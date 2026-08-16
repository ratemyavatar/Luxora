#!/usr/bin/env bash
# ======================================================================================
# LUXORA grid — fetch the STOCK content trees for the 2020 RCC node.
# Binaries we commit (RCCService.exe, OPENGL32.DLL, dlls, configs, internalscripts, ssl)
# are already here under grid/RCCService2020. The ~360MB of stock Roblox content is NOT
# committed (repo size discipline) — it is byte-identical public CDN material. Run this
# ONCE on each grid machine from the repo root:   bash grid/FETCH_CONTENT.sh
# ======================================================================================
set -e
DST="grid/RCCService2020"

echo "== Option A (preferred, exactly matches this exe) : copy from kornet src clone =="
cat <<'TXT'
    git clone --depth 1 https://github.com/rytiufi1/kornet /tmp/kornet
    cp -r /tmp/kornet/RCCService2020/content            grid/RCCService2020/
    cp -r /tmp/kornet/RCCService2020/platformcontent    grid/RCCService2020/
    cp -r /tmp/kornet/RCCService2020/shaders            grid/RCCService2020/
    cp -r /tmp/kornet/RCCService2020/ExtraContent       grid/RCCService2020/
    cp -r /tmp/kornet/RCCService2020/ExtraContent2020   grid/RCCService2020/
TXT

echo "== Option B (fallback, official CDN for the same train) =="
echo "This RCCService.exe reports build 0.450.0.411923 (2020-09-30), hash version-a26d354ee82042ea."
echo "Final 2020L client (0.459.2.415973, version-66446108dba5497e) content also works in practice."
CDN="https://setup.rbxcdn.com/channel/zlive"
VER="version-a26d354ee82042ea"          # 0.450.0.411923
# VER="version-66446108dba5497e"        # 0.459.2.415973 (final 2020L) alternative

mkdir -p "$DST/content" "$DST/platformcontent" "$DST/shaders"
for pkg in content-fonts content-skybox content-sounds content-textures2 content-textures3 content-terrain content-models content-qt_translations shaders platformcontent; do
  f="/tmp/$pkg.zip"
  if curl -fL --retry 3 -o "$f" "$CDN/$VER-$pkg.zip" ; then
    case "$pkg" in
      platformcontent) unzip -qo "$f" -d "$DST/platformcontent" ;;
      shaders)         unzip -qo "$f" -d "$DST/shaders" ;;
      *)               unzip -qo "$f" -d "$DST/content" ;;
    esac
    echo "  ok: $pkg"
  else
    echo "  !! pkg not served for this version, skipped: $pkg (not fatal if Option A used)"
  fi
done
echo "== done. Sanity: ls $DST/content $DST/platformcontent $DST/shaders should be non-empty =="
