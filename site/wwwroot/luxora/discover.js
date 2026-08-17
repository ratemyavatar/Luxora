/* Database binding for the supplied 2020 fan-made Discover layout. */
(function () {
  "use strict";
  function q(s, r) { return (r || document).querySelector(s); }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function text(node, value) { if (node) node.textContent = value == null ? "" : String(value); }
  var host = q("#games-carousel-page"); if (!host) return;
  host.innerHTML = '<div class="page"><main class="main"><div class="section-title">Popular Experiences</div><div class="games"></div></main></div>';

  function card(game) {
    var item = el('<div class="grid-item-container game-card-container"><a class="game-card-link"><span class="thumbnail-2d-container game-card-thumb-container"><img class="game-card-thumb" alt=""></span><div class="game-card-name game-name-title"></div><div class="game-card-info"><span class="info-label icon-playing-counts-gray"></span><span class="info-label playing-counts-label"></span></div><div class="text-label xsmall text-overflow creator"></div></a></div>');
    var link = q("a", item); link.href = "/games/" + game.placeId + "/" + encodeURIComponent(game.name.replace(/\s+/g, "-"));
    var image = q("img", item); image.src = game.imageUrl; image.alt = game.name;
    text(q(".game-card-name", item), game.name); q(".game-card-name", item).title = game.name;
    text(q(".playing-counts-label", item), Number(game.playerCount || 0).toLocaleString());
    text(q(".creator", item), "By " + game.creatorName);
    return item;
  }
  function load() {
    var keyword = new URLSearchParams(location.search).get("Keyword") || "";
    fetch("/apisite/games/v1/discover?keyword=" + encodeURIComponent(keyword) + "&sort=Popular", { credentials: "same-origin" })
      .then(function (response) { return response.json(); }).then(function (body) {
        var list = q(".games", host); list.innerHTML = "";
        (body.data || []).forEach(function (game) { list.appendChild(card(game)); });
      }).catch(function (error) { if (window.console) console.warn("[luxora] discover failed", error); });
  }
  load();
})();
