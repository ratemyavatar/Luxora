/* Behavior-only binding for the captured 2022 universal navigation fragment. */
(function () {
  "use strict";
  var nav = document.querySelector("#navigation-container");
  if (!nav || nav.__luxoraWired) return;
  nav.__luxoraWired = true;

  function postLogout(token) {
    return fetch("/apisite/auth/v2/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token || (window.LUXORA && window.LUXORA.xsrf) || "" },
      body: "{}"
    }).then(function (response) {
      var retry = response.headers.get("X-CSRF-TOKEN");
      if (response.status === 403 && retry) return postLogout(retry);
      if (!response.ok) throw new Error("logout failed");
      location.href = "/login";
    });
  }

  document.addEventListener("click", function (event) {
    var settingsButton = event.target.closest && event.target.closest(".btn-navigation-nav-settings-md");
    var popover = nav.querySelector("#settings-popover");
    if (settingsButton && popover) {
      event.preventDefault();
      popover.classList.toggle("hidden");
      popover.classList.toggle("in", !popover.classList.contains("hidden"));
      return;
    }

    var logout = event.target.closest && event.target.closest(".logout-menu-item,[data-behavior='logout']");
    if (logout) {
      event.preventDefault();
      event.stopPropagation();
      postLogout().catch(function () { location.href = "/login"; });
      return;
    }

    var menu = event.target.closest && event.target.closest(".btn-navigation-nav-menu-md,#header-menu-icon");
    if (menu) {
      event.preventDefault();
      var side = nav.querySelector("#navigation");
      if (side) side.classList.toggle("nav-show");
      return;
    }

    if (popover && !popover.classList.contains("hidden") && !event.target.closest("#navbar-settings")) {
      popover.classList.add("hidden");
      popover.classList.remove("in");
    }
  }, true);

  var search = nav.querySelector("[data-testid='navigation-search-input'] form");
  if (search) search.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = nav.querySelector("#navbar-search-input");
    location.href = "/discover/?Keyword=" + encodeURIComponent(input ? input.value : "");
  });

  fetch("/navigation/userdata", { credentials: "same-origin" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) {
      var amount = nav.querySelector("#nav-robux-amount");
      if (amount && data) amount.textContent = String(data.robux == null ? data.RobuxBalance || 0 : data.robux);
    }).catch(function () {});
})();
