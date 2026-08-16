using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Dapper;
using Luxora.Security;

namespace Luxora.Services;

public sealed record CreatedUser(long Id, string Username, Guid SessionId);

public sealed class UserService
{
    private static readonly Regex UsernameRe = new("^[a-zA-Z][a-zA-Z0-9_]*$", RegexOptions.Compiled);
    private static readonly string[] HardBlockedWords = { "roblox", "admin", "luxora", "luxoraadmin", "password" };

    private readonly Db _db;
    private readonly LuxoraConfig _cfg;
    public UserService(Db db, LuxoraConfig cfg) { _db = db; _cfg = cfg; }

    public enum UsernameCheck { Available = 0, Taken = 1, Invalid = 2, TooShort = 3, TooLong = 4 }

    public async Task<(UsernameCheck code, string message)> ValidateUsername(string username, long? ignoreUserId = null)
    {
        if (string.IsNullOrWhiteSpace(username) || username.Length < 3) return (UsernameCheck.TooShort, "Usernames may be 3–20 characters long.");
        if (username.Length > 20) return (UsernameCheck.TooLong, "Usernames may be 3–20 characters long.");
        if (!UsernameRe.IsMatch(username) || username.StartsWith('_') || username.EndsWith("__"))
            return (UsernameCheck.Invalid, "Only letters, numbers, and isolated underscores are allowed.");
        if (username.All(c => c == '_')) return (UsernameCheck.Invalid, "Username must contain letters or numbers.");
        if (HardBlockedWords.Any(w => username.Contains(w, StringComparison.OrdinalIgnoreCase)))
            return (UsernameCheck.Invalid, "Username not available."); // era-style vague denial for reserved words
        using var c = _db.Open();
        var taken = await c.ExecuteScalarAsync<long?>(@"select id from users where username_lower = lower(@username) limit 1", new { username });
        if (taken is not null && taken != ignoreUserId) return (UsernameCheck.Taken, "Username is already in use.");
        return (UsernameCheck.Available, "Username is available.");
    }

    public enum SignupError { None = 0, CaptchaFailed = 1, UsernameTaken = 2, UsernameInvalid = 3, PasswordInvalid = 4, BirthdayInvalid = 5, GenderInvalid = 6, IpRateLimited = 8 }

    /// <summary>Create account + starter rows + session. Returns error enum + message.</summary>
    public async Task<(SignupError err, string msg, CreatedUser? user)> CreateUser(
        string username, string password, DateOnly? birthday, short gender, string? ip, string? userAgent)
    {
        var (code, umsg) = await ValidateUsername(username);
        if (code == UsernameCheck.Taken) return (SignupError.UsernameTaken, umsg, null);
        if (code != UsernameCheck.Available) return (SignupError.UsernameInvalid, umsg, null);

        if (string.IsNullOrEmpty(password) || password.Length < 8 || password.Length > 200)
            return (SignupError.PasswordInvalid, "Passwords must be at least 8 characters long.", null);
        if (password.Equals(username, StringComparison.OrdinalIgnoreCase))
            return (SignupError.PasswordInvalid, "Password may not be your username.", null);

        if (!birthday.HasValue || birthday.Value.Year < 1900 || birthday.Value > DateOnly.FromDateTime(DateTime.UtcNow))
            return (SignupError.BirthdayInvalid, "Please enter a valid birthday.", null);
        if (gender is not (0 or 2 or 3)) return (SignupError.GenderInvalid, "Please pick a gender.", null);

        var isU13 = Age(birthday.Value) < 13;
        var hash = HashPassword(password);

        using var c = _db.Open();
        using var tx = c.BeginTransaction();

        // cheap 1-per-IP-per-minute race breaker
        var recent = c.ExecuteScalar<int>(
            "select count(*) from signup_event where ip = @ip and ok and created > now() - interval '1 minute'", new { ip }, tx);
        if (recent >= 1) return (SignupError.IpRateLimited, "Too many attempts. Try again in a minute.", null);

        var p = new DynamicParameters();
        p.Add("username", username);
        p.Add("hash", hash);
        p.Add("bday", birthday.Value.ToDateTime(TimeOnly.MinValue), DbType.Date); // dapper can't map DateOnly — explicit DbType.Date
        p.Add("gender", gender);
        p.Add("u13", isU13);
        var id = c.ExecuteScalar<long>(
            @"insert into users (username, password_hash, birthday, gender, is_under13)
              values (@username, @hash, @bday, @gender, @u13) returning id", p, tx);
        c.Execute("insert into user_economy (user_id, robux) values (@id, @starter)", new { id, starter = _cfg.NewUser.StarterRobux }, tx);
        c.Execute("insert into user_settings (user_id) values (@id)", new { id }, tx);
        c.Execute("insert into signup_event (username, ip, ok) values (@username, @ip, true)", new { username, ip }, tx);

        var sid = Guid.NewGuid();
        c.Execute("insert into user_session (id, user_id, ip, user_agent) values (@sid, @id, @ip, @ua)",
            new { sid, id, ip, ua = Trunc(userAgent, 400) }, tx);

        tx.Commit();
        return (SignupError.None, "", new CreatedUser(id, username, sid));
    }

    public void LogSignupFailure(string username, string? ip, SignupError code)
        => _db.Execute("insert into signup_event (username, ip, ok, fail_code) values (@username, @ip, false, @c)",
            new { username, ip, c = (int)code });

    // ---- login ----
    public abstract record LoginResult
    {
        public sealed record Ok(long Id, string Username, Guid SessionId) : LoginResult;
        public sealed record BadCredentials : LoginResult;
        public sealed record RateLimited : LoginResult;
    }

    private sealed class UserCred
    {
        public long Id;
        public string Username = "";
        public string PasswordHash = "";
        public short AccountStatus;
    }

    private sealed class Flood { public int Count; public DateTimeOffset Since = DateTimeOffset.UtcNow; }
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, Flood> _loginFlood = new();

    /// <summary>Verify credentials, mint a session. Per-IP sliding-window flood breaker.</summary>
    public async Task<LoginResult> TryLogin(string username, string password, string? ip, string? userAgent)
    {
        var key = ip ?? "?";
        var now = DateTimeOffset.UtcNow;
        var ent = _loginFlood.GetOrAdd(key, _ => new Flood());
        lock (ent)
        {
            if (now - ent.Since > TimeSpan.FromMinutes(5)) { ent.Count = 0; ent.Since = now; }
            if (++ent.Count > 15) return new LoginResult.RateLimited();
        }

        using var c = _db.Open();
        var row = await c.QueryFirstOrDefaultAsync<UserCred>(
            @"select id, username as Username, password_hash as PasswordHash, account_status as AccountStatus
              from users where username_lower = lower(@u)", new { u = username.Trim() });
        if (row is null || row.AccountStatus != 0 || !VerifyPassword(password, row.PasswordHash))
            return new LoginResult.BadCredentials();

        var sid = Guid.NewGuid();
        await c.ExecuteAsync("insert into user_session (id, user_id, ip, user_agent) values (@sid, @uid, @ip, @ua)",
            new { sid, uid = row.Id, ip, ua = Trunc(userAgent, 400) });
        return new LoginResult.Ok(row.Id, row.Username, sid);
    }

    public Task EndSession(Guid sid) => _db.Execute("delete from user_session where id = @sid", new { sid });

    // ---- passwords: PBKDF2-SHA512, format v1$iter$salt$hash (no external deps) ----
    private static string HashPassword(string pw)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(pw, salt, 210_000, HashAlgorithmName.SHA512, 32);
        return $"v1$210000${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
    }

    public static bool VerifyPassword(string pw, string stored)
    {
        var parts = stored.Split('$');
        if (parts.Length != 4 || parts[0] != "v1") return false;
        var salt = Convert.FromBase64String(parts[2]);
        var expect = Convert.FromBase64String(parts[3]);
        var got = Rfc2898DeriveBytes.Pbkdf2(pw, salt, int.Parse(parts[1]), HashAlgorithmName.SHA512, expect.Length);
        return CryptographicOperations.FixedTimeEquals(got, expect);
    }

    private static int Age(DateOnly bday)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var age = today.Year - bday.Year;
        return bday > today.AddYears(-age) ? age - 1 : age;
    }
    private static string? Trunc(string? s, int n) => s is null ? null : s.Length <= n ? s : s[..n];
}
