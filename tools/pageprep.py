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
    services = ["accountinformation","accountsettings","ads","api","auth","avatar","badges","billing",
                "captcha","catalog","chat","contacts","develop","economy","ecsv2","followings","friends",
                "games","groups","inventory","itemconfiguration","locale","metrics","notifications",
                "premiumfeatures","presence","privatemessages","publish","thumbnails","trades","users","voice","abtesting","search"]
    m = {f"{s}Api": f"/apisite/{s}" for s in services}
    m.update({"accountInformationApi": m["accountinformationApi"], "authApi": m["authApi"], "gameApi": m["gamesApi"]})
    m["domain"] = "luxora.wtf"; m["api"] = "/apisite/api"; m["www"] = ""
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

    # 5) images: images.rbxcdn.com/{hash}(.ext) -> /bundles/img/{hash}.ext (identity naming in imgs.zip)
    t = re.sub(r'https://images\.rbxcdn\.com/([0-9a-fA-Z\-]+)\.(png|jpg|jpeg|gif|ico|svg|webp)',
               r'/bundles/img/\1.\2', t)
    t = re.sub(r'https://images\.rbxcdn\.com/([0-9a-fA-Z\-]+)(?=[\s"\'\)])', r'/bundles/img/\1.png', t)

    # 6) absolute site links -> relative (page links only; API URLs are shimmed at runtime)
    t = re.sub(r'https?://(?:www|web)\.roblox\.com(?=[/"\'\s])', '', t)

    # 7) tracking beacons -> local 204 stub: scorecardresearch / sentry
    t = re.sub(r'https?://[sb]?\.?scorecardresearch\.com[^"\')\s]*', '/apisite/metrics/beacon', t)
    t = re.sub(r'https://js\.sentry[^"\')\s]*', '/luxora/off.js', t)

    # 8) inject our shim EARLY (first <head> script) + glue before </body>
    t = re.sub(r"(<head[^>]*>)", r"\1\n<script src=\"/luxora/hostshim.js\"></script>", t, count=1, flags=re.I)
    glue = ('<script>\nwindow.LUXORA = { xsrf: "{{LUXORA_XSRF}}", turnstileSiteKey: "{{LUXORA_TURNSTILE_SITEKEY}}",'
            '\n  baseUrl: "{{LUXORA_BASEURL}}" };\n</script>\n'
            '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n'
            '<script src="/luxora/auth.js" defer></script>\n</body>')
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
        for f in src.iterdir():
            if f.is_file(): shutil.copy2(f, dst / f.name)
    (SITE_WWW / "bundles/css/__empty.css").write_text("/* luxora: bundle not cached (safe to 404-style empty) */\n")
    (SITE_WWW / "bundles/js/__404.js").write_text("/* luxora: bundle not cached */\n")
    (SITE_WWW / "luxora").mkdir(exist_ok=True)
    (SITE_WWW / "luxora/off.js").write_text("/* stubbed external tracker */\n")
    print("[pageprep] assets synced to site/wwwroot/bundles")

if __name__ == "__main__":
    sync_assets()
    prep(Path(sys.argv[1]), sys.argv[2])
