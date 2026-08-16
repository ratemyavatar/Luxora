#!/usr/bin/env python3
"""
LUXORA pageprep — turns a captured 2020-era page into a Luxora page template.
Never authors markup/CSS: it strips captured leftovers, repoints hosts, and injects
tokens ({{LUXORA_*}}) that site/src PageRenderMiddleware fills per request.

usage: python3 tools/pageprep.py <capture.html> <templateName>
  reads assets from study library (bundles) -> site/wwwroot/bundles/{css,js,img}
  writes site/wwwroot/pages/<templateName>.htmltpl
"""
import json, re, shutil, sys
from pathlib import Path

GLUE_VER = "bday3"  # bump whenever luxora glue changes meaningfully (kills stale browser caches)

ROOT = Path(__file__).resolve().parent.parent
STUDY = ROOT.parent / "study"
SITE_WWW = ROOT / "site" / "wwwroot"

CSS_NAME_MAP = {  # data-bundlename -> held css file (study/10_static_assets/css)
    "styleguide": "rbxstyle.css", "navigation": "rbxnav.css", "footer": "rbxfooter.css",
    "landing": "rbxlanding.css", "thumbnails": "rbxthumb.css", "captcha": "rbxCaptcha.css",
    "robuxicon": "rbxRobuxIcon.css", "leanbase": "leanbase.css", "login": "rbxlogin.css",
    "page": "page.css",
}
EMPTY_CSS = "/bundles/css/__empty.css"

IMG_EXTS = r"(?:png|jpg|jpeg|gif|ico|svg|webp|woff2?|ttf|eot)"
_MANIFEST: set[str] = set()  # "kind|remote-url|local-rel-path" of assets we don't hold locally

def _held_img_index() -> dict[str, str]:
    """hash -> actual bundled filename (covers both hash.ext and hash-suffix.ext naming)"""
    d = SITE_WWW / "bundles" / "img"
    idx = {}
    if d.is_dir():
        for f in d.iterdir():
            m = re.match(r"^([0-9a-f]{32})(?:-[^.]*)?\.(\w+)$", f.name)
            if m: idx.setdefault(m.group(1), f.name)
    return idx

def localize_css_urls(css: str, css_name: str) -> str:
    """Archive captures leave asset URLs pointing at web.archive.org (/web/<ts>im_/...),
    archive-relative /cdn/imgs or /cdn/font helper paths, or plain rbxcdn. Point all of
    them at our local /bundles/img mirror; anything we don't hold goes into the fetch
    manifest for tools/fetch-assets.ps1."""
    css = re.sub(r"url\(\s*[\"']?(?:https://web\.archive\.org)?(?:/web/\d+im_/)?"
                 r"(?:https?://images\.rbxcdn\.com/|images\.rbxcdn\.com/|/+cdn/imgs/+|/+cdn/font/+)"
                 r"([0-9a-zA-Z_\-]+\." + IMG_EXTS + r")[\"']?\s*\)",
                 lambda mm: _img_rep(mm, "images"), css, flags=re.I)
    css = re.sub(r"url\(\s*[\"']?(?:https://web\.archive\.org)?/web/\d+im_/"
                 r"https://(?:static|css)\.rbxcdn\.com/([^\"')\s]+\." + IMG_EXTS + r")[\"']?\s*\)",
                 lambda mm: _img_rep(mm, "static"), css, flags=re.I)
    css = re.sub(r"url\(\s*[\"']?https://static\.rbxcdn\.com/([^\"')\s]+\." + IMG_EXTS + r")[\"']?\s*\)",
                 lambda mm: _img_rep(mm, "static"), css, flags=re.I)
    return css

def _archive_fallback(mm: re.Match, live: str) -> str:
    """Original capture URL if the source had a wayback link (exact timestamp =
    guaranteed hit); otherwise a generic 2020 wayback guess."""
    src = mm.group(0)
    m = re.search(r"/web/(\d+)im_/(https?://[^\"')\s]+)", src)
    if m: return f"https://web.archive.org/web/{m.group(1)}im_/{m.group(2)}"
    return f"https://web.archive.org/web/2020im_/{live}"

def _img_rep(mm: re.Match, kind: str) -> str:
    fname = mm.group(1)
    local = f"/bundles/img/{'staticcdn/' if kind == 'static' else ''}{fname}"
    store = SITE_WWW / local.lstrip("/")
    if not store.exists():
        if kind == "images":
            remote = f"https://images.rbxcdn.com/{fname}"
        else:
            host = "css.rbxcdn.com" if "css.rbxcdn.com" in mm.group(0) else "static.rbxcdn.com"
            remote = f"https://{host}/{fname}"
        _MANIFEST.add(f"{kind}|{remote}|{_archive_fallback(mm, remote)}|{local.lstrip('/')}")
    return f"url({local})"

def brace_extract(text: str, start: int) -> tuple[str, int]:
    """extract balanced {...} block starting at index of '{'"""
    depth, i = 0, start
    in_str = None
    while i < len(text):
        ch = text[i]
        if in_str:
            if ch == "\\": i += 1
            elif ch == in_str: in_str = None
        elif ch in "\"'": in_str = ch
        elif ch == "{": depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0: return text[start:i+1], i+1
        i += 1
    return text[start:], len(text)

def env_urls_json() -> str:
    # kornet-style squash: {service}.roblox.com/{ver}... == /apisite/{service}/{ver}...
    # NOTE: era bundles READ THESE AT LOAD (CoreRobloxUtilities does `EnvUrls.xApi.replace(...)`
    # at module scope -> undefined key kills the whole script chain and blanks the page).
    services = ["accountinformation","accountsettings","ads","api","auth","avatar","badges","billing",
                "captcha","catalog","chat","contacts","develop","economy","ecsv2","engagementpayouts",
                "followings","friends","gameinternationalization","games","groups","inventory",
                "itemconfiguration","locale","metrics","moderation","notifications","points",
                "premiumfeatures","presence","privatemessages","publish","textfilter","thumbnails",
                "trades","translationroles","twostepverification","users","usermoderation","voice",
                "abtesting","search"]
    m = {f"{s}Api": f"/apisite/{s}" for s in services}
    # era code uses several hard-coded alias spellings; provide every one the bundles touch
    m.update({
        "accountInformationApi": "/apisite/accountinformation",
        "accountSettingsApi": "/apisite/accountsettings",
        "gameInternationalizationApi": "/apisite/gameinternationalization",
        "translationRolesApi": "/apisite/translationroles",
        "privateMessagesApi": "/apisite/privatemessages",
        "notificationApi": "/apisite/notifications",
        "abtestingApiSite": "/apisite/abtesting",
        "thumbnailsApi": "/apisite/thumbnails",
        "gameApi": "/apisite/games",
        "authApi": "/apisite/auth",
        "authAppSite": "",
        "websiteUrl": "",
        "apiProxyUrl": "/apisite/api",
        "api": "/apisite/api",
        "www": "",
        "amazonStoreLink": "#", "amazonWebStoreLink": "#", "appStoreLink": "#",
        "googlePlayStoreLink": "#", "windowsStoreLink": "#", "xboxStoreLink": "#",
    })
    m["domain"] = "luxora.wtf"
    return json.dumps(m)

def prep(src: Path, name: str) -> Path:
    t = src.read_text(encoding="utf-8", errors="replace")

    # 1) XSRF meta -> per-request token
    t = re.sub(r'(<meta\s+name\s*=\s*["\']?csrf-token["\']?[^>]*data-token\s*=\s*["\'])[^"\']*', r"\1{{LUXORA_XSRF}}", t, flags=re.I)

    # 2) Roblox.EnvironmentUrls {…} -> our map
    m = re.search(r'Roblox\.EnvironmentUrls\s*=\s*\{', t)
    if m:
        block, end = brace_extract(t, m.end() - 1)
        t = t[:m.start()] + "Roblox.EnvironmentUrls = " + env_urls_json() + t[end:]

    # 3) bundle scripts: js.rbxcdn.com hash -> /bundles/js/<BundleFile> (held set, matched by data-bundlename)
    held_js = {p.stem.lower(): p.name for p in (STUDY / "10_static_assets/js/js").glob("*.js")}
    def js_repl(mm: re.Match) -> str:
        tag = mm.group(0)
        bn = re.search(r"data-bundlename\s*=\s*[\"']([^\"']+)", tag, re.I)
        local = held_js.get(bn.group(1).lower()) if bn else None
        new_src = f"/bundles/js/{local}" if local else "/bundles/js/__404.js"
        return re.sub(r'src\s*=\s*["\'][^"\']*["\']', f'src="{new_src}"', tag, count=1)
    t = re.sub(r"<script[^>]*src\s*=\s*[\"']https://js\.rbxcdn\.com/[^\"']+[\"'][^>]*>", js_repl, t, flags=re.I)

    # 4) css links: css.rbxcdn -> mapped held file; legacy static.rbxcdn page bundle -> page.css
    def css_repl(mm: re.Match) -> str:
        tag = mm.group(0)
        bn = re.search(r"data-bundlename\s*=\s*[\"']([^\"']+)", tag, re.I)
        local = CSS_NAME_MAP.get(bn.group(1).lower()) if bn else None
        new = f"/bundles/css/{local}" if local else EMPTY_CSS
        return re.sub(r'href\s*=\s*["\'][^"\']*["\']', f'href="{new}"', tag, count=1)
    t = re.sub(r"<link[^>]*href\s*=\s*[\"']https://css\.rbxcdn\.com/[^\"']+[\"'][^>]*>", css_repl, t, flags=re.I)
    t = re.sub(r'href=["\']https://static\.rbxcdn\.com/css/page___[0-9a-f]+_m\.css/fetch["\']', 'href="/bundles/css/page.css"', t, flags=re.I)
    t = re.sub(r'https://static\.rbxcdn\.com/([0-9a-f]{32,64})\.(js|css)', lambda mm: f"/bundles/{'js' if mm.group(2)=='js' else 'css'}/__404.{mm.group(2)}", t)

    # 5) images: images.rbxcdn.com/{hash}(.ext) -> /bundles/img/<held file matching hash>;
    # not held -> {hash}.png + fetch-manifest entry (tools/fetch-assets.ps1 fills it)
    idx = _held_img_index()
    def img_sub(mm: re.Match) -> str:
        h = mm.group(1)
        ext = ((mm.group(2) if mm.lastindex and mm.lastindex > 1 else None) or "png").lower()
        held = idx.get(h)
        if held: return "/bundles/img/" + held
        local = f"bundles/img/{h}.{ext}"
        _MANIFEST.add(f"images|https://images.rbxcdn.com/{h}.{ext}|https://web.archive.org/web/2020im_/https://images.rbxcdn.com/{h}.{ext}|{local}")
        return "/" + local
    t = re.sub(r'https://images\.rbxcdn\.com/([0-9a-fA-Z\-]+)\.(png|jpg|jpeg|gif|ico|svg|webp)', img_sub, t)
    t = re.sub(r'https://images\.rbxcdn\.com/([0-9a-f]{16,64})(?=[\s"\'\)])', img_sub, t)

    # 6) absolute site links -> relative (page links only; API URLs are shimmed at runtime)
    t = re.sub(r'https?://(?:www|web)\.roblox\.com(?=[/"\'\s])', '', t)

    # 7) tracking beacons -> local 204 stub: scorecardresearch / sentry
    t = re.sub(r'https?://[sb]?\.?scorecardresearch\.com[^"\')\s]*', '/apisite/metrics/beacon', t)
    t = re.sub(r'https://js\.sentry[^"\')\s]*', '/luxora/off.js', t)

    # 3b) ng-modules/ng-app reference angular modules defined in hash-named bundles with no
    # data-bundlename (e.g. baseTemplateApp). Find the held bundle that DEFINES each referenced
    # module and make sure it's loaded, else the app bootstrap dies -> blank page.
    needed_mods = set(re.findall(r'ng-modules\s*=\s*"([^"]+)"', t))
    needed_mods |= set(re.findall(r'ng-app\s*=\s*"([^"]+)"', t))
    definers = {}
    held_dir = STUDY / "10_static_assets/js/js"
    if not held_dir.is_dir(): held_dir = SITE_WWW / "bundles/js"
    for f in held_dir.glob("*.js"):
        try: txt = f.read_text(encoding="utf-8", errors="replace")
        except OSError: continue
        for modname in re.findall(r'angular\.module\("([^"]+)"\s*,\s*\[', txt):
            definers.setdefault(modname, f.name)
    inject = []
    for mod in sorted(needed_mods):
        f = definers.get(mod)
        if f and f"/bundles/js/{f}" not in t:
            inject.append(f'<script type="text/javascript" src="/bundles/js/{f}"></script>')
    if inject:
        t = re.sub(r"</body>", "\n" + "\n".join(inject) + "\n</body>", t, count=1, flags=re.I)

    # 8) inject our shim EARLY (first <head> script) + glue before </body>
    t = re.sub(r"(<head[^>]*>)", r'\1' + '\n<script src="/luxora/hostshim.js?v=' + GLUE_VER + '"></script>', t, count=1, flags=re.I)
    glue = ('<script>\nwindow.LUXORA = { xsrf: "{{LUXORA_XSRF}}", turnstileSiteKey: "{{LUXORA_TURNSTILE_SITEKEY}}",'
            '\n  baseUrl: "{{LUXORA_BASEURL}}" };\n</script>\n'
            '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n'
            '<script src="/luxora/auth.js?v=' + GLUE_VER + '" defer></script>\n</body>')
    t = re.sub(r"</body>", glue, t, count=1, flags=re.I)

    out = SITE_WWW / "pages" / f"{name}.htmltpl"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(t, encoding="utf-8")
    print(f"[pageprep] {src.name} -> {out} ({len(t)//1024}K)")
    return out

def sync_assets():
    pairs = [("10_static_assets/css/css", "bundles/css"), ("10_static_assets/js/js", "bundles/js"), ("10_static_assets/imgs/imgs", "bundles/img")]
    for src_rel, dst_rel in pairs:
        src, dst = STUDY / src_rel, SITE_WWW / dst_rel
        dst.mkdir(parents=True, exist_ok=True)
        if not src.is_dir():
            print(f"[pageprep] WARN study source missing ({src}) - keeping already-synced {dst_rel}")
            continue
        for f in src.iterdir():
            if f.is_file(): shutil.copy2(f, dst / f.name)
    (SITE_WWW / "bundles/css/__empty.css").write_text("/* luxora: bundle not cached (safe to 404-style empty) */\n")
    (SITE_WWW / "bundles/js/__404.js").write_text("/* luxora: bundle not cached */\n")
    # localize archive/cdn asset URLs inside every css bundle
    for f in (SITE_WWW / "bundles/css").glob("*.css"):
        if f.name.startswith("__"): continue
        css = f.read_text(encoding="utf-8", errors="replace")
        f.write_text(localize_css_urls(css, f.name), encoding="utf-8")
    (SITE_WWW / "luxora").mkdir(exist_ok=True)
    (SITE_WWW / "luxora/off.js").write_text("/* stubbed external tracker */\n")
    print("[pageprep] assets synced to site/wwwroot/bundles (css urls localized)")

def write_manifest():
    out = ROOT / "tools" / "assets-manifest.txt"
    lines = sorted(_MANIFEST)
    out.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    if lines: print(f"[pageprep] {len(lines)} missing assets -> tools/assets-manifest.txt (run tools/fetch-assets.ps1 on the VPS)")

if __name__ == "__main__":
    sync_assets()
    prep(Path(sys.argv[1]), sys.argv[2])
    write_manifest()
