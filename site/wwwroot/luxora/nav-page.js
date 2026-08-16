/* Shared content shell for universal-navigation destinations whose dedicated
   capture is not yet mounted. Structure/classes are from the captured 2022 home. */
(function () {
  "use strict";
  var path = location.pathname.toLowerCase();
  var titles = {
    "/discover": "Discover", "/catalog": "Avatar Shop", "/robux": "Robux",
    "/users/friends": "Friends", "/my/messages": "Messages", "/my/avatar": "Avatar",
    "/trades": "Trades", "/my/groups": "Groups", "/giftcards-us": "Gift Cards",
    "/premium/membership": "Premium", "/my/account": "Settings",
    "/crossdevicelogin/confirmcode": "Quick Log In", "/info/help": "Help",
    "/users/profile": "Profile", "/users/inventory": "Inventory"
  };
  var title = titles[path] || (path.indexOf("/inventory") >= 0 ? "Inventory" : path.indexOf("/profile") >= 0 ? "Profile" : "Luxora");
  var home = document.querySelector("#HomeContainer");
  if (!home) return;
  var header = document.querySelector("#home-header");
  if (header) header.innerHTML = '<div class="home-header"><div class="user-info-container"><h1 class="user-name-container"></h1></div></div>';
  var heading = header && header.querySelector(".user-name-container"); if (heading) heading.textContent = title;
  var people = document.querySelector("#people-list-container"); if (people) people.innerHTML = "";
  var places = document.querySelector("#place-list"); if (places) places.innerHTML = "";
  document.title = title + " - Luxora";
})();
