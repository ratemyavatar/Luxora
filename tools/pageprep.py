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

GLUE_VER = "avatar1"  # bump whenever luxora glue changes meaningfully (kills stale browser caches)

ROOT = Path(__file__).resolve().parent.parent
STUDY = ROOT.parent / "study"
SITE_WWW = ROOT / "site" / "wwwroot"

CSS_NAME_MAP = {  # data-bundlename -> held css file (study/10_static_assets/css)
    "styleguide": "rbxstyle.css", "navigation": "rbxnav.css", "footer": "rbxfooter.css",
    "landing": "rbxlanding.css", "thumbnails": "rbxthumb.css", "captcha": "rbxCaptcha.css",
    "robuxicon": "rbxRobuxIcon.css", "leanbase": "leanbase.css", "login": "rbxlogin.css",
    "page": "page.css",
}
# Exact component sheets captured with the authenticated 2022 home shell. Keep them
# separate from the 2020 login/signup sheets: mixing bundle vintages broke the layout.
HOME_CSS_NAME_MAP = {
    "styleguide": "home2022-styleguide.css", "navigation": "home2022-navigation.css",
    "footer": "home2022-footer.css", "thumbnails": "home2022-thumbnails.css",
    "robuxicon": "home2022-robux.css", "peoplelist": "home2022-people-list.css",
    "placeslist": "home2022-places-list.css", "homeheader": "home2022-header.css",
}
DEVELOP_CSS_NAME_MAP = {
    "legacystyleguide": "home2022-styleguide.css", "thumbnails": "home2022-thumbnails.css",
    "audiobutton": "develop2022-audio.css", "developerexchange": "develop2022-devex.css",
    "robuxicon": "home2022-robux.css",
}
GAME_CSS_NAME_MAP = {
    "styleguide": "home2022-styleguide.css", "thumbnails": "home2022-thumbnails.css",
    "gamedetails": "game2022-details.css", "recommendedgames": "game2022-details.css",
    "sociallinksjumbotron": "game2022-details.css", "robuxicon": "home2022-robux.css",
}
PROFILE_CSS_NAME_MAP = {
    "styleguide": "home2022-styleguide.css", "thumbnails": "home2022-thumbnails.css",
    "peoplelist": "profile2022-5b78f24a5404361865e0b4270f7a5f530983e00cb93db4587fd8204050dc3cc7.css",
    "userdescription": "profile2022-192054a85a454151ab8e7e1b0ab68f630347c67d6f0cc0be54c6cd3cd6e5f456.css",
    "profilebadges": "profile2022-9a71331ed246c4c79ccb18c8582bb1366a2a66843c0776e767b0b48634d36dfa.css",
    "profilestatistics": "profile2022-b52536edd49882b6c7ffbb39e44d25c8f3a96eceb0bf94b4413e6ae9f6e2477b.css",
    "groupslist": "profile2022-105adf87a231522c9bc7de0beae9cc928c074a72def1e694727ac27cd242359e.css",
    "robuxicon": "home2022-robux.css",
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
    # 2022 StyleGuide serves fonts directly from css.rbxcdn.com (no subdirectory).
    css = re.sub(r"url\(\s*[\"']?https://css\.rbxcdn\.com/([0-9A-Za-z_\-]+\." + IMG_EXTS + r")[\"']?\s*\)",
                 _css_asset_rep, css, flags=re.I)
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

def _css_asset_rep(mm: re.Match) -> str:
    fname = mm.group(1)
    local = f"/bundles/img/{fname}"
    if not (SITE_WWW / local.lstrip("/")).exists():
        remote = f"https://css.rbxcdn.com/{fname}"
        _MANIFEST.add(f"css|{remote}|https://web.archive.org/web/2022im_/{remote}|{local.lstrip('/')}")
    return f"url({local})"

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

def replace_div_by_id(text: str, element_id: str, replacement: str) -> str:
    """Replace one captured div and all nested divs without rewriting its markup."""
    value = re.escape(element_id)
    start_match = re.search(r'<div\b[^>]*\sid\s*=\s*(?:["\']' + value + r'["\']|' + value + r'(?=[\s>]))[^>]*>', text, re.I)
    if not start_match: return text
    depth = 0
    for tag in re.finditer(r'<div\b[^>]*>|</div\s*>', text[start_match.start():], re.I):
        depth += -1 if tag.group(0).lower().startswith('</') else 1
        if depth == 0:
            end = start_match.start() + tag.end()
            return text[:start_match.start()] + replacement + text[end:]
    return text

def replace_first_div_by_class(text: str, class_name: str, replacement: str) -> str:
    value = re.escape(class_name)
    start_match = re.search(r'<div\b[^>]*\bclass\s*=\s*(?:["\'][^"\']*\b' + value + r'\b[^"\']*["\']|[^\s>]*\b' + value + r'\b[^\s>]*)[^>]*>', text, re.I)
    if not start_match: return text
    depth = 0
    for tag in re.finditer(r'<div\b[^>]*>|</div\s*>', text[start_match.start():], re.I):
        depth += -1 if tag.group(0).lower().startswith('</') else 1
        if depth == 0:
            end = start_match.start() + tag.end()
            return text[:start_match.start()] + replacement + text[end:]
    return text

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
        "localizationTablesApi": "/apisite/localizationtables",
        "twoStepVerificationApi": "/apisite/twostepverification",
        "privateMessagesApi": "/apisite/privatemessages",
        "notificationApi": "/apisite/notifications",
        "abtestingApiSite": "/apisite/abtesting",
        "thumbnailsApi": "/apisite/thumbnails",
        "gameApi": "/apisite/games",
        "authApi": "/apisite/auth",
        "authAppSite": "",
        "websiteUrl": "",
        "apiProxyUrl": "/apisite/api",
        "apiGatewayUrl": "/apisite/api",
        "apiGatewayCdnUrl": "/apisite/api",
        "universalAppConfigurationApi": "/apisite/api/universal-app-configuration",
        "api": "/apisite/api",
        "www": "",
        "amazonStoreLink": "#", "amazonWebStoreLink": "#", "appStoreLink": "#",
        "googlePlayStoreLink": "#", "windowsStoreLink": "#", "xboxStoreLink": "#",
    })
    m["domain"] = "luxora.wtf"
    return json.dumps(m)

def bundle_name(tag: str) -> str:
    match = re.search(r'data-bundlename\s*=\s*(?:["\']([^"\']+)["\']|([^\s>]+))', tag, re.I)
    return ((match.group(1) or match.group(2)) if match else "").lower()

def prep(src: Path, name: str) -> Path:
    t = src.read_text(encoding="utf-8", errors="replace")

    # Authenticated content pages all receive one shared captured navbar/sidebar.
    # Their source-specific navigation is removed, not restyled or redesigned.
    if name not in {"landing", "login"}:
        t = replace_div_by_id(t, "navigation-container", "{{LUXORA_UNIVERSAL_NAV}}")

    # Captured authenticated pages must never leak the archived account. Keep the
    # capture's attributes/markup, but make their values per-request template tokens.
    if name not in {"landing", "login"}:
        def user_meta(mm: re.Match) -> str:
            tag = mm.group(0)
            values = {"userid": "{{LUXORA_USERID}}", "name": "{{LUXORA_USERNAME}}",
                      "displayname": "{{LUXORA_USERNAME}}", "isunder13": "{{LUXORA_ISUNDER13}}",
                      "created": "{{LUXORA_CREATED}}"}
            for attr, value in values.items():
                tag = re.sub(r'(data-' + attr + r')\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)',
                             lambda m: f'{m.group(1)}="{value}"', tag, flags=re.I)
            return tag
        t = re.sub(r'<meta\b(?=[^>]*\bname\s*=\s*["\']?user-data(?:["\']|\s|>))[^>]*>', user_meta, t, flags=re.I)
        t = re.sub(r'(name=["\']user-data["\'][^>]*data-userid=["\'])[^"\']*', r'\1{{LUXORA_USERID}}', t, flags=re.I)
        t = re.sub(r'(name=["\']user-data["\'][^>]*data-name=["\'])[^"\']*', r'\1{{LUXORA_USERNAME}}', t, flags=re.I)
        t = re.sub(r'(name=["\']user-data["\'][^>]*data-displayName=["\'])[^"\']*', r'\1{{LUXORA_USERNAME}}', t, flags=re.I)
        t = re.sub(r'(name=["\']user-data["\'][^>]*data-isunder13=["\'])[^"\']*', r'\1{{LUXORA_ISUNDER13}}', t, flags=re.I)
        t = re.sub(r'(name=["\']user-data["\'][^>]*data-created=["\'])[^"\']*', r'\1{{LUXORA_CREATED}}', t, flags=re.I)
        t = re.sub(r'data-userid\s*=\s*(?:"\d+"|\'\d+\'|\d+)', 'data-userid="{{LUXORA_USERID}}"', t, flags=re.I)
        t = re.sub(r'(<body[^>]*class=["\'][^"\']*)dark-theme', r'\1{{LUXORA_THEME}}', t, count=1, flags=re.I)

    if name in {"createexperience", "configureexperience", "catalogeditor"}:
        t = replace_div_by_id(t, "PrivateServersAccess", "")
        t = re.sub(r'<img\b[^>]*\bplace-access-tooltip\b[^>]*>', '', t, flags=re.I)
        t = re.sub(r'<script\b[^>]*>(?:(?!</script>).)*DisableVIPServersWarningTitleText(?:(?!</script>).)*</script>', '', t, flags=re.I | re.S)
        t = re.sub(r'data-userid\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)', 'data-userid="{{LUXORA_USERID}}"', t, flags=re.I)
        t = re.sub(r'(<span\b[^>]*\bid=["\']userData["\'][^>]*\bdata-name=)(?:"[^"]*"|\'[^\']*\'|[^\s>]+)',
                   r'\1"{{LUXORA_USERNAME}}"', t, flags=re.I)

    if name == "configureexperience":
        # Dedicated configuration variant from the captured Create form: retain the
        # captured Basic/Access/Advanced panels and remove only the template picker.
        t = replace_div_by_id(t, "templates_tab", "")
        t = re.sub(r'<div\s+class=["\']tab\s+active["\']\s+data-id=["\']templates_tab["\']>\s*Templates\s*</div>', '', t, flags=re.I)
        t = re.sub(r'(<div\s+class=["\'])tab(["\']\s+data-id=["\']basicsettings_tab["\'])', r'\1tab active\2', t, count=1, flags=re.I)
        t = re.sub(r'(<div\s+class=["\'])tab-content(["\']\s+id=["\']basicsettings_tab["\'])', r'\1tab-content tab-active\2', t, count=1, flags=re.I)
        t = t.replace("<title>Create Experience - Roblox</title>", "<title>Configure Experience - Roblox</title>", 1)
        t = t.replace("<h1>Create Experience</h1>", "<h1>Configure Experience</h1>", 1)
        t = t.replace('id="finishButton">Create Experience</a>', 'id="finishButton">Save</a>', 1)

    if name == "catalogeditor":
        for panel in ("templates_tab", "access_tab", "advancedsettings_tab"):
            t = replace_div_by_id(t, panel, "")
        t = re.sub(r'<div\s+class=["\']tab(?:\s+active)?["\']\s+data-id=["\'](?:templates_tab|access_tab|advancedsettings_tab)["\']>.*?</div>', '', t, flags=re.I | re.S)
        t = re.sub(r'(<div\s+class=["\'])tab(["\']\s+data-id=["\']basicsettings_tab["\'])', r'\1tab active\2', t, count=1, flags=re.I)
        t = re.sub(r'(<div\s+class=["\'])tab-content(["\']\s+id=["\']basicsettings_tab["\'])', r'\1tab-content tab-active\2', t, count=1, flags=re.I)
        t = t.replace("<title>Create Experience - Roblox</title>", "<title>Configure Catalog Item - Roblox</title>", 1)
        t = t.replace("<h1>Create Experience</h1>", "<h1>Configure Catalog Item</h1>", 1)
        t = t.replace('id="finishButton">Create Experience</a>', 'id="finishButton">Save Item</a>', 1)

    if name == "game":
        # Keep the captured page shell but remove Arsenal and every captured dynamic
        # game/server/store value before the response exists.
        t = replace_div_by_id(t, "game-detail-page", '<div id="game-detail-page" class="row page-content inline-social"></div>')
        t = t.replace("Arsenal", "Experience").replace("ROLVe Community", "Creator")
        for captured_id in ("286090429", "111958650", "1693098016"):
            t = t.replace(captured_id, "0")

    if name == "profile":
        t = replace_first_div_by_class(t, "profile-container", '<div class="profile-container" id="luxora-profile"></div>')
        t = t.replace("hyskgl29", "User").replace("751000854", "0")

    if name == "catalog":
        t = replace_div_by_id(t, "avatar-container", '<div id="catalog-container" class="row page-content"></div>')
        # The archive captured an already-open cookie preferences modal. Its fixed
        # backdrop covered the entire replacement catalog and intercepted all clicks.
        t = replace_div_by_id(t, "cookieConsentModalOverlay", "")
        t = replace_div_by_id(t, "cookieConsentModalWrapper", "")
        t = replace_div_by_id(t, "cookie-banner-wrapper", "")

    if name == "develop":
        # Remove archived owners/groups and captured games before the response exists.
        t = replace_div_by_id(t, "GroupCreationsTab", '<div id="GroupCreationsTab"></div>')
        t = replace_first_div_by_class(t, "items-container", '<div class="items-container"></div>')
        # These captured initializers belong to omitted bundles and only throw; none
        # owns visible Develop markup or behavior used by Luxora.
        for marker in ("Roblox.FixedUI.gutterAdsEnabled", "Roblox.Client._skip",
                       "Roblox.DeveloperConsoleWarning.showWarning"):
            t = re.sub(r'<script\b[^>]*>[^<]*' + re.escape(marker) + r'.*?</script>', '', t, flags=re.I | re.S)

    # 1) XSRF meta -> per-request token
    t = re.sub(r'(<meta\s+name\s*=\s*["\']?csrf-token["\']?[^>]*data-token\s*=\s*["\'])[^"\']*', r"\1{{LUXORA_XSRF}}", t, flags=re.I)

    # 2) Roblox.EnvironmentUrls {…} -> our map
    m = re.search(r'Roblox\.EnvironmentUrls\s*=\s*\{', t)
    if m:
        block, end = brace_extract(t, m.end() - 1)
        t = t[:m.start()] + "Roblox.EnvironmentUrls = " + env_urls_json() + t[end:]

    # 3) bundle scripts: js.rbxcdn.com hash -> /bundles/js/<BundleFile> (held set, matched by data-bundlename)
    held_js_dir = STUDY / "10_static_assets/js/js"
    if not held_js_dir.is_dir(): held_js_dir = SITE_WWW / "bundles/js"  # study lib gone? used already-synced set
    held_js = {p.stem.lower(): p.name for p in held_js_dir.glob("*.js")}
    def js_repl(mm: re.Match) -> str:
        tag = mm.group(0)
        component = bundle_name(tag)
        local = held_js.get(component) if component else None
        if name == "home":
            digest = re.search(r'https://js\.rbxcdn\.com/([0-9a-f]+)\.js', tag, re.I)
            exact = f"home2022-{digest.group(1)}.js" if digest else ""
            if exact and (SITE_WWW / "bundles/js" / exact).exists(): local = exact
            else: local = None  # never mix the 2020 login JS with the 2022 home shell
            # Luxora binds these captured component structures to its own database.
            # Loading their original bootstraps too would race and erase empty rows.
            if component in {"navigation", "peoplelist", "placeslist", "homeheader", "homepageupsellcard",
                             "avatarshophomepagerecommendations", "accountsecurityprompt", "gamelaunch"}:
                local = None
        elif name in {"develop", "createexperience", "configureexperience", "catalogeditor"}:
            digest = re.search(r'https://js\.rbxcdn\.com/([0-9a-f]+)\.js', tag, re.I)
            exact = f"develop2022-{digest.group(1)}.js" if digest else ""
            # Develop's listing is bound by our vanilla glue. Keep only the captured
            # bootstrap trio; partial later bundles depend on uncaptured globals.
            local = exact if component in {"header", "polyfill", "headerscripts"} and exact and (SITE_WWW / "bundles/js" / exact).exists() else None
        elif name in {"game", "discover", "profile", "catalog", "avatar"}:
            local = None
        new_src = f"/bundles/js/{local}" if local else "/bundles/js/__404.js"
        return re.sub(r'src\s*=\s*(?:["\'][^"\']*["\']|https?://[^\s>]+)', f'src="{new_src}"', tag, count=1)
    t = re.sub(r"<script[^>]*src\s*=\s*(?:[\"']https://js\.rbxcdn\.com/[^\"']+[\"']|https://js\.rbxcdn\.com/[^\s>]+)[^>]*>", js_repl, t, flags=re.I)

    # 4) css links: css.rbxcdn -> mapped held file; legacy static.rbxcdn page bundle -> page.css
    def css_repl(mm: re.Match) -> str:
        tag = mm.group(0)
        component = bundle_name(tag)
        css_map = (HOME_CSS_NAME_MAP if name == "home" else
                   DEVELOP_CSS_NAME_MAP if name in {"develop", "createexperience", "configureexperience", "catalogeditor"} else
                   GAME_CSS_NAME_MAP if name in {"game", "discover"} else
                   PROFILE_CSS_NAME_MAP if name == "profile" else
                   HOME_CSS_NAME_MAP if name in {"catalog", "avatar"} else CSS_NAME_MAP)
        local = css_map.get(component) if component else None
        new = f"/bundles/css/{local}" if local else EMPTY_CSS
        return re.sub(r'href\s*=\s*(?:["\'][^"\']*["\']|https?://[^\s>]+)', f'href="{new}"', tag, count=1)
    t = re.sub(r"<link[^>]*href\s*=\s*(?:[\"']https://css\.rbxcdn\.com/[^\"']+[\"']|https://css\.rbxcdn\.com/[^\s>]+)[^>]*>", css_repl, t, flags=re.I)
    LEGACY_CSS = {"leanbase": "leanbase.css", "page": "page.css"}
    if name == "home": LEGACY_CSS = {"leanbase": "home2022-leanbase.css", "page": "__empty.css"}
    elif name in {"develop", "createexperience", "configureexperience", "catalogeditor"}: LEGACY_CSS = {"maincss": "develop2022-main.css", "page": "develop2022-page.css"}
    elif name in {"game", "discover"}: LEGACY_CSS = {"leanbase": "home2022-leanbase.css", "page": "game2022-page.css"}
    elif name in {"profile", "catalog", "avatar"}: LEGACY_CSS = {"leanbase": "home2022-leanbase.css", "page": "profile2022-page.css"}
    t = re.sub(r'href\s*=\s*["\']?https://static\.rbxcdn\.com/css/(\w+)___[0-9a-f]+_m\.css(?:/fetch)?["\']?',
               lambda mm: f'href="/bundles/css/{LEGACY_CSS.get(mm.group(1).lower(), "__empty.css")}"', t, flags=re.I)
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

    # Captured 2022 Create templates use extensionless tr.rbxcdn image URLs.
    def template_img(mm: re.Match) -> str:
        digest = mm.group(1)
        remote = mm.group(0)
        local = f"bundles/img/templates/{digest}.jpg"
        if not (SITE_WWW / local).exists():
            _MANIFEST.add(f"images|{remote}|https://web.archive.org/web/2022im_/{remote}|{local}")
        return "/" + local
    t = re.sub(r'https://tr\.rbxcdn\.com/([0-9a-f]{32})/197/115/Image/Jpeg', template_img, t, flags=re.I)

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
    if inject and name != "home":
        t = re.sub(r"</body>", "\n" + "\n".join(inject) + "\n</body>", t, count=1, flags=re.I)

    # 8) inject our shim EARLY (first <head> script) + glue before </body>
    t = re.sub(r"(<head[^>]*>)", r'\1' + '\n<script src="/luxora/hostshim.js?v=' + GLUE_VER + '"></script>', t, count=1, flags=re.I)
    if name in {"createexperience", "configureexperience", "catalogeditor"}:
        t = re.sub(r"</head>", '<link rel="stylesheet" href="/bundles/css/fan2020-grid.css">\n</head>', t, count=1, flags=re.I)
    elif name == "discover":
        discover_link = '<link rel="stylesheet" href="https://css.rbxcdn.com/5d58fdaa60dedc843176981258306a3168ced80bfdb11ea8a382186e1c419caa.css">\n'
        t, linked = re.subn(r"</head>", discover_link + '</head>', t, count=1, flags=re.I)
        if linked == 0: t = re.sub(r"(<head[^>]*>)", r'\1\n' + discover_link, t, count=1, flags=re.I)
    elif name == "catalog":
        catalog_links = '<link rel="stylesheet" href="/bundles/css/develop2022-main.css">\n<link rel="stylesheet" href="/bundles/css/develop2022-page.css">\n'
        t, linked = re.subn(r"</head>", catalog_links + '</head>', t, count=1, flags=re.I)
        if linked == 0: t = re.sub(r"(<head[^>]*>)", r'\1\n' + catalog_links, t, count=1, flags=re.I)
    elif name == "avatar":
        avatar_link = '<link rel="stylesheet" href="https://css.rbxcdn.com/43246eb063d4fce7f3f28a2c6d167e33c7ecc50cf90dec5888d84a4923e7f243.css">\n'
        t, linked = re.subn(r"</head>", avatar_link + '</head>', t, count=1, flags=re.I)
        if linked == 0: t = re.sub(r"(<head[^>]*>)", r'\1\n' + avatar_link, t, count=1, flags=re.I)
    elif name == "game":
        # Exact immutable styles referenced by the captured 2021 game page. Keep the
        # local 2022-compatible sheets as fallback underneath these authoritative rules.
        game_links = '<link rel="stylesheet" href="https://css.rbxcdn.com/bb42d99b195855de31288f59c867272f2edbffa3bab76c13aad102e986fbea48.css">\n<link rel="stylesheet" href="https://static.rbxcdn.com/css/page___2740e1577ea4fe3dddbe5c20a75461ed_m.css/fetch">\n'
        t, linked = re.subn(r"</head>", game_links + '</head>', t, count=1, flags=re.I)
        if linked == 0: t = re.sub(r"(<head[^>]*>)", r'\1\n' + game_links, t, count=1, flags=re.I)
    glue_files = {"home": "home.js", "develop": "develop.js", "createexperience": "create-experience.js", "configureexperience": "create-experience.js", "catalogeditor": "catalog-editor.js", "game": "game-page.js", "discover": "discover.js", "profile": "profile.js", "catalog": "catalog.js", "avatar": "avatar.js"}
    page_glue = (f'<script src="/luxora/{glue_files[name]}?v={GLUE_VER}" defer></script>\n' if name in glue_files else '')
    glue = ('<script>\nwindow.LUXORA = { xsrf: "{{LUXORA_XSRF}}", turnstileSiteKey: "{{LUXORA_TURNSTILE_SITEKEY}}",'
            '\n  baseUrl: "{{LUXORA_BASEURL}}" };\n</script>\n'
            '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n'
            '<script src="/luxora/auth.js?v=' + GLUE_VER + '" defer></script>\n' + page_glue + '</body>')
    t, injected = re.subn(r"</body>", glue, t, count=1, flags=re.I)
    if injected == 0: t += "\n" + glue + "\n</html>"

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
    existing = set()
    if out.exists():
        existing = {l.strip() for l in out.read_text(encoding="utf-8").splitlines() if l.strip()}
    lines = sorted(existing | _MANIFEST)  # merge: later pages add entries without losing earlier ones
    out.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    added = len(lines) - len(existing)
    if lines: print(f"[pageprep] manifest: {len(lines)} entries ({added:+d} new) -> tools/assets-manifest.txt")

if __name__ == "__main__":
    sync_assets()
    prep(Path(sys.argv[1]), sys.argv[2])
    write_manifest()
