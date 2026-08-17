/* Data binding for the captured 2021/2022 Develop page. Row markup and classes
   come directly from the capture's Experiences item table. */
(function () {
  "use strict";
  function q(selector, root) { return (root || document).querySelector(selector); }
  function element(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function text(node, value) { if (node) node.textContent = value == null ? "" : String(value); }
  function post(url, body, token) {
    return fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token || window.LUXORA.xsrf }, body: JSON.stringify(body) })
      .then(function (response) { var retry = response.headers.get("X-CSRF-TOKEN"); if (response.status === 403 && retry) return post(url, body, retry); if (!response.ok) throw new Error("request failed"); return response.json(); });
  }

  function gameRow(game) {
    var wrap = document.createDocumentFragment();
    var row = element('<table class="item-table" data-type="universes"><tr><td class="image-col universe-image-col"><a class="game-image"><img alt=""></a></td><td class="universe-name-col"><a class="title"></a><table class="details-table"><tr><td class="item-universe"><span>Start Place:</span> <a class="title start-place-url"></a></td></tr><tr class="activate-cell"><td><a></a></td></tr></table></td><td class="edit-col"><a class="btn-control btn-control-large">Sponsor</a></td><td class="edit-col"><a class="roblox-edit-button btn-control btn-control-large">Edit</a></td><td class="menu-col"><div class="gear-button-wrapper"><a href="#" class="gear-button"></a></div></td></tr></table>');
    row.dataset.itemId = game.id;
    row.dataset.rootplaceId = game.rootPlaceId;
    var configure = "/universes/configure?id=" + game.id;
    var gameUrl = "/games/" + game.rootPlaceId + "/" + encodeURIComponent(game.name.replace(/\s+/g, "-"));
    var imageLink = q(".game-image", row); imageLink.href = configure;
    var image = q("img", row); image.src = game.imageUrl; image.alt = game.name;
    var title = q(".universe-name-col > .title", row); title.href = configure; text(title, game.name);
    var place = q(".start-place-url", row); place.href = gameUrl; text(place, game.name);
    var status = q(".activate-cell a", row); status.href = "#"; status.className = game.isActive ? "place-active" : "place-inactive"; text(status, game.isActive ? "Public" : "Private");
    status.addEventListener("click", function (event) {
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
      var next = !game.isActive; text(status, next ? "Making Public..." : "Making Private...");
      post("/apisite/develop/v1/games/" + game.id + "/active", { isActive: next }).then(load).catch(function (error) {
        text(status, game.isActive ? "Public" : "Private");
        if (window.console) console.error("[luxora] visibility update failed", error);
      });
    });
    q(".edit-col .btn-control", row).href = "/develop?Page=ads&gameId=" + game.id;
    q(".roblox-edit-button", row).href = "/universes/configure?id=" + game.id;
    q(".gear-button", row).href = "/universes/configure?id=" + game.id;
    wrap.appendChild(row);
    wrap.appendChild(element('<div class="separator"></div>'));
    return wrap;
  }

  function load() {
    var container = q("#MyCreationsTab .items-container");
    if (!container) return;
    var checkbox = q("#MyCreationsTab .active-only-checkbox input");
    var url = "/apisite/develop/v1/user/games?publicOnly=" + (checkbox && checkbox.checked ? "true" : "false");
    fetch(url, { credentials: "same-origin" }).then(function (response) {
      if (response.status === 401) { location.href = "/login?returnUrl=%2Fdevelop"; throw new Error("signed out"); }
      return response.json();
    }).then(function (body) {
      container.innerHTML = "";
      (body.data || []).forEach(function (game) { container.appendChild(gameRow(game)); });
    }).catch(function (error) { if (window.console) console.warn("[luxora] develop failed", error); });
  }

  function boot() {
    var create = q("#MyCreationsTab #CreatePlace");
    if (create) {
      create.removeAttribute("onclick");
      create.href = "/places/create";
      create.addEventListener("click", function (event) { event.preventDefault(); location.href = "/places/create"; });
    }
    var checkbox = q("#MyCreationsTab .active-only-checkbox input");
    if (checkbox) checkbox.addEventListener("change", load);
    load();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
