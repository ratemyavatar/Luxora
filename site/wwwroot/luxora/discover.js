/* Database binding for the supplied 2020 fan-made Discover layout. */
(function () {
  "use strict";
  function q(s, r) { return (r || document).querySelector(s); }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function text(node, value) { if (node) node.textContent = value == null ? "" : String(value); }
  var host = q("#games-carousel-page"); if (!host) return;
  host.innerHTML = '<div class="page"><main class="main"><div class="section-title">Popular Experiences</div><div class="games"></div></main></div>';

  function card(game) {
    var item = el('<div class="game"><a><div class="thumb"><img class="game-card-thumb" width="100%" height="105" alt=""></div><b></b><small></small></a></div>');
    var link = q("a", item); link.href = "/games/" + game.placeId + "/" + encodeURIComponent(game.name.replace(/\s+/g, "-"));
    var image = q("img", item); image.src = game.imageUrl; image.alt = game.name;
    text(q("b", item), game.name);
    text(q("small", item), Number(game.playerCount || 0).toLocaleString() + " playing · By " + game.creatorName);
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
