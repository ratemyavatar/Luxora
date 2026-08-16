/* LUXORA home data binding. Markup/classes are copied from Roblox's captured
   2022 HomeHeader, PeopleList, and PlacesList bundles. No CSS is authored here. */
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

  /* Exact 2022 HomeHeader component structure. */
  function renderHeader(me) {
    var host = q("#home-header");
    if (!host) return;
    host.innerHTML = '<div class="home-header"><a class="user-avatar-container avatar avatar-headshot-lg"><span class="avatar-card-image"><img alt=""></span></a><div class="user-info-container"><h1 class="user-name-container"><a></a></h1></div></div>';
    var links = host.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) links[i].href = "/users/" + me.id + "/profile";
    q("img", host).src = "/bundles/img/__thumb.png";
    q("img", host).alt = me.name;
    text(q(".user-name-container a", host), me.displayName || me.name);
  }

  /* PeopleList bundle hides the complete section when the user has no friends. */
  function renderFriends(friends) {
    var host = q("#people-list-container");
    if (!host) return;
    host.innerHTML = "";
    if (!friends.length) return;
    var section = el('<div class="col-xs-12 people-list-container"><div class="section home-friends"><div class="container-header people-list-header"><h3>Friends<span class="friends-count"></span></h3><a href="/users/friends" class="btn-secondary-xs btn-more see-all-link-icon">See All</a></div><div class="section-content remove-panel people-list"><ul class="hlist"></ul></div></div></div>');
    text(q(".friends-count", section), "(" + friends.length + ")");
    var list = q("ul", section);
    friends.slice(0, 9).forEach(function (friend) {
      var item = el('<li class="list-item friend"><div><div class="avatar-container"><a class="text-link friend-link"><div class="avatar avatar-card-fullbody"><span class="avatar-card-link friend-avatar"><span class="avatar-card-image"><img alt=""></span></span></div><span class="text-overflow friend-name font-caption-header"></span></a><span class="avatar-status friend-status"></span></div></div></li>');
      item.id = "people-" + friend.id;
      var link = q(".friend-link", item); link.href = "/users/" + friend.id + "/profile";
      q("img", item).src = "/bundles/img/__thumb.png"; q("img", item).alt = friend.name;
      text(q(".friend-name", item), friend.displayName || friend.name);
      q(".friend-name", item).title = friend.displayName || friend.name;
      var status = q(".friend-status", item);
      if (friend.presence === 2) status.classList.add("icon-game");
      else if (friend.presence === 1) status.classList.add("icon-online");
      status.title = friend.presence === 2 ? "In Game" : friend.presence === 1 ? "Online" : "Offline";
      list.appendChild(item);
    });
    host.appendChild(section);
  }

  /* Exact 2022 PlacesList GameTile structure. Variant B keeps only playing count. */
  function gameCard(game) {
    var card = el('<div class="grid-item-container game-card-container"><a class="game-card-link"><span class="game-card-thumb-container"><img class="game-card-thumb" alt=""></span><div class="game-card-name game-name-title"></div><div class="game-card-info"><span class="info-label icon-playing-counts-gray"></span><span class="info-label playing-counts-label"></span></div></a></div>');
    var link = q("a", card);
    link.id = String(game.universeId);
    link.href = "/games/" + game.placeId + "/" + encodeURIComponent(game.name.replace(/\s+/g, "-"));
    var img = q("img", card); img.src = game.imageUrl || "/bundles/img/__thumb.png"; img.alt = game.name;
    var name = q(".game-card-name", card); name.title = game.name; text(name, game.name);
    text(q(".playing-counts-label", card), Number(game.playerCount || 0).toLocaleString());
    return card;
  }

  function renderSorts(sorts) {
    var host = q("#place-list");
    if (!host) return;
    host.innerHTML = "";
    sorts.forEach(function (sort) {
      if (!sort.games || !sort.games.length) return;
      var section = el('<div class="game-home-page-container"><div class="game-home-page-carousel-title"><h2></h2><a href="/discover" class="btn-secondary-xs btn-more see-all-link-icon">See All</a></div><div class="game-carousel"></div></div>');
      text(q("h2", section), sort.displayName);
      sort.games.forEach(function (game) { q(".game-carousel", section).appendChild(gameCard(game)); });
      host.appendChild(section);
    });
  }

  function boot() {
    document.addEventListener("click", function (ev) {
      var logout = ev.target.closest && ev.target.closest("[data-behavior='logout']");
      if (!logout) return;
      ev.preventDefault();
      json("/apisite/auth/v2/logout", { method: "POST", body: "{}" }).then(function () { location.href = "/login"; });
    }, true);

    json("/apisite/users/v1/users/authenticated").then(function (me) {
      renderHeader(me);
      var friends = json("/apisite/friends/v1/users/" + me.id + "/friends").then(function (result) {
        var data = result.data || [];
        if (!data.length) return renderFriends(data);
        return json("/apisite/presence/v1/presence/users", { method: "POST", body: JSON.stringify({ userIds: data.map(function (x) { return x.id; }) }) }).then(function (presence) {
          var byId = {}; (presence.userPresences || []).forEach(function (x) { byId[x.userId] = x.userPresenceType; });
          data.forEach(function (x) { x.presence = byId[x.id] || 0; }); renderFriends(data);
        });
      });
      var games = json("/apisite/games/v1/games/sorts").then(function (result) { renderSorts(result.sorts || []); });
      return Promise.all([friends, games]);
    }).catch(function (error) { if (window.console) console.warn("[luxora] home failed", error); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
