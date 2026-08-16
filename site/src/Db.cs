using Dapper;
using Npgsql;

namespace Luxora;

public sealed class Db
{
    private readonly string _cs;
    public Db(LuxoraConfig cfg) => _cs = cfg.Postgres;

    public NpgsqlConnection Open()
    {
        var c = new NpgsqlConnection(_cs);
        c.Open();
        return c;
    }

    public Task<int> Execute(string sql, object? p = null) { using var c = Open(); return c.ExecuteAsync(sql, p); }
    public Task<T?> QueryFirst<T>(string sql, object? p = null) { using var c = Open(); return c.QueryFirstOrDefaultAsync<T>(sql, p); }
    public Task<T> Scalar<T>(string sql, object? p = null) { using var c = Open(); return c.ExecuteScalarAsync<T>(sql, p); }
}
