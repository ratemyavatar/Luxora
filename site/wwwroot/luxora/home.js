/* LUXORA home glue. The shell and every component/card class below come from the
   captured Roblox home pages. This file only binds those captured components to
   Luxora's database APIs; it deliberately contains no styling. */
(function () {
  "use strict";

  function q(s, r) { return (r || document).querySelector(s); }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function text(node, value) { if (node) node.textContent = value == null ? "" : String(value); }

  function json(url, options) {
    options = options || {};
    options.credentials = "same-origin";
    options.headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (options.method && options.method !== "GET") options.headers["X-CSRF-TOKEN"] = window.LUXORA.xsrf;
    return fetch(url, options).then(function (r) {
      if (r.status === 401) { location.href = "/login?returnUrl=%2Fhome"; throw new Error("signed out"); }
      if (r.status === 403 && r.headers.get("X-CSRF-TOKEN")) {
        options.headers["X-CSRF-TOKEN"] = r.headers.get("X-CSRF-TOKEN");
        return json(url, options);
      }
      return r.json().then(function (body) { if (!r.ok) throw body; return body; });
    });
  }

  function renderHeader(me) {
    var host = q("#home-header");
    if (!host) return;
    host.innerHTML = '<a href="/users/profile" class="avatar avatar-headshot-lg"><img alt="avatar" src="/bundles/img/__thumb.png" id="home-avatar-thumb" class="avatar-card-image"></a>' +
      '<div class="home-header-content non-bc"><h1><a href="/users/profile"></a></h1></div>';
    text(q(".home-header-content a", host), "Hello, " + me.name + "!");
  }

  function renderFriends(me, friends) {
    var host = q("#people-list-container");
    if (!host) return;
    host.innerHTML = "";
    var section = el('<div class="col-xs-12 container-list"><div class="container-header"><h3></h3><a href="/users/friends" class="btn-secondary-xs btn-more btn-fixed-width">See All</a></div><ul class="hlist avatar-cards"></ul></div>');
    text(q("h3", section), "Friends (" + friends.length + ")");
    var list = q("ul", section);
    friends.slice(0, 9).forEach(function (f) {
      var card = el('<li class="list-item avatar-card"><div class="avatar-card-container"><a class="avatar avatar-headshot-lg"><img class="avatar-card-image" alt=""></a><div class="avatar-card-caption"><a class="text-overflow avatar-name"></a><div class="text-overflow avatar-status"></div></div></div></li>');
      q("a.avatar", card).href = "/users/" + f.id + "/profile";
      q("img", card).src = "/bundles/img/__thumb.png";
      q("img", card).alt = f.name;
      q("a.avatar-name", card).href = "/users/" + f.id + "/profile";
      text(q("a.avatar-name", card), f.name);
      text(q(".avatar-status", card), f.presence === 2 ? "In Game" : f.presence === 1 ? "Online" : "Offline");
      list.appendChild(card);
    });
    host.appendChild(section);
  }

  /* game-card-container/link/thumb/name/name-secondary is copied from the capture's
     #game-item-card-template. Variant B intentionally omits its captured vote block. */
  function gameCard(g) {
    var li = el('<li class="list-item game-card"><div class="game-card-container"><a class="game-card-link"><div class="game-card-thumb-container"><img class="game-card-thumb" alt=""></div><div class="text-overflow game-card-name"></div><div class="game-card-name-secondary"></div></a></div></li>');
    var a = q("a", li);
    a.href = "/games/" + g.placeId + "/" + encodeURIComponent(g.name.replace(/\s+/g, "-"));
    q("img", li).src = g.imageUrl || "/bundles/img/__thumb.png";
    q("img", li).alt = g.name;
    q(".game-card-name", li).title = g.name;
    text(q(".game-card-name", li), g.name);
    text(q(".game-card-name-secondary", li), Number(g.playerCount || 0).toLocaleString() + " Playing");
    return li;
  }

  function renderSorts(sorts) {
    var host = q("#place-list");
    if (!host) return;
    host.innerHTML = "";
    sorts.forEach(function (sort) {
      if (!sort.games || !sort.games.length) return;
      var section = el('<div class="col-xs-12 container-list home-games"><div class="container-header"><h3></h3><a href="/discover" class="btn-secondary-xs btn-more btn-fixed-width">See All</a></div><div class="game-card-list"><ul class="hlist game-cards game-cards-sm"></ul></div></div>');
      text(q("h3", section), sort.displayName);
      sort.games.forEach(function (g) { q("ul", section).appendChild(gameCard(g)); });
      host.appendChild(section);
    });
  }

  function renderFeed(me, entries) {
    var host = q("#place-list");
    if (!host) return;
    var section = el('<div class="col-xs-12 home-left-col"><div class="section"><div class="section-header"><h3>My Feed</h3></div><div class="section-content"><div class="form-horizontal" id="statusForm" role="form"><div class="form-group"><input class="form-control input-field" id="txtStatusMessage" maxlength="254" placeholder="What are you up to?"><p class="form-control-label hidden">Status update failed.</p></div><a type="button" class="btn-primary-md btn-fixed-width" id="shareButton">Share</a></div><ul class="vlist feeds"></ul></div></div></div>');
    var error = q(".form-control-label", section);
    var list = q("ul.feeds", section);
    entries.forEach(function (e) {
      var item = el('<li class="list-item"><a class="list-header avatar avatar-headshot-md"><img class="avatar-card-image" alt=""></a><div class="list-body"><a class="text-name text-lead"></a><p class="list-content"></p></div></li>');
      q("a.list-header", item).href = "/users/" + e.userId + "/profile";
      q("img", item).src = "/bundles/img/__thumb.png"; q("img", item).alt = e.name;
      q("a.text-name", item).href = "/users/" + e.userId + "/profile";
      text(q("a.text-name", item), e.name); text(q(".list-content", item), e.status);
      list.appendChild(item);
    });
    q("#shareButton", section).addEventListener("click", function () {
      var input = q("#txtStatusMessage", section), value = input.value.trim();
      if (!value) return;
      json("/apisite/users/v1/users/" + me.id + "/status", { method: "POST", body: JSON.stringify({ status: value }) })
        .then(function () { location.reload(); })
        .catch(function (x) { text(error, x.errors && x.errors[0] ? x.errors[0].message : "Status update failed."); error.classList.remove("hidden"); });
    });
    host.appendChild(section);
  }

  function boot() {
    document.addEventListener("click", function (ev) {
      var logout = ev.target.closest && ev.target.closest("[data-behavior='logout']");
      if (!logout) return;
      ev.preventDefault();
      json("/apisite/auth/v2/logout", { method: "POST", body: "{}" })
        .then(function () { location.href = "/login"; });
    }, true);

    json("/apisite/users/v1/users/authenticated").then(function (me) {
      renderHeader(me);
      var friendsPromise = json("/apisite/friends/v1/users/" + me.id + "/friends").then(function (f) {
        var data = f.data || [];
        if (!data.length) { renderFriends(me, data); return; }
        return json("/apisite/presence/v1/presence/users", { method: "POST", body: JSON.stringify({ userIds: data.map(function (x) { return x.id; }) }) }).then(function (p) {
          var byId = {}; (p.userPresences || []).forEach(function (x) { byId[x.userId] = x.userPresenceType; });
          data.forEach(function (x) { x.presence = byId[x.id] || 0; }); renderFriends(me, data);
        });
      });
      var gamesPromise = json("/apisite/games/v1/games/sorts").then(function (g) { renderSorts(g.sorts || []); });
      var feedPromise = json("/apisite/users/v1/users/" + me.id + "/feed").then(function (f) { renderFeed(me, f.data || []); });
      return Promise.all([friendsPromise, gamesPromise, feedPromise]);
    }).catch(function (e) { if (window.console) console.warn("[luxora] home failed", e); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
