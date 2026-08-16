/* LUXORA hostshim — era bundles believe they're on roblox.com; we reroute everything
   to our host + kornet-style /apisite/{service} squash. Loaded FIRST (before bundles). */
(function () {
  "use strict";
  var SERVICES = ["accountinformation","accountsettings","ads","api","auth","avatar","badges","billing",
    "captcha","catalog","chat","contacts","develop","economy","ecsv2","followings","friends","games",
    "groups","inventory","itemconfiguration","locale","metrics","notifications","premiumfeatures",
    "presence","privatemessages","publish","thumbnails","trades","users","voice","abtesting","search","presence"];

  function rewrite(url) {
    try {
      var u = new URL(url, location.href);
      var h = u.hostname.toLowerCase();
      if (h === "luxora.wtf" || h === location.hostname) return url;
      if (h === "www.roblox.com" || h === "web.roblox.com" || h === "roblox.com")
        return u.pathname + u.search;
      if (/^images\.rbxcdn\.com$/.test(h))
        return "/bundles/img" + u.pathname.replace(/\.(png|jpg|jpeg|gif|ico|svg|webp)$/i, function (e) { return e; });
      if (/^(js|static)\.rbxcdn\.com$/.test(h)) return "/bundles/js/__404.js";
      if (/^css\.rbxcdn\.com$/.test(h)) return "/bundles/css/__empty.css";
      if (/^t\d\.rbxcdn\.com$/.test(h)) return "/bundles/img/c94b4b3bdd1be463ef59dae29f93f882-thumbnail_status_unavailable_dark.svg";
      var svc = h.split(".")[0];
      if (SERVICES.indexOf(svc) !== -1 && /\.roblox\.com$/.test(h) || /\.roblox\.plus$/.test(h))
        return "/apisite/" + svc + u.pathname + u.search;
      // arc: arkose/other externals — kill quietly via metrics stub
      return "/apisite/metrics/beacon";
    } catch (e) { return url; }
  }
  window.__luxoraRewrite = rewrite;

  var xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) { arguments[1] = rewrite(u); return xo.apply(this, arguments); };

  var of = window.fetch;
  if (of) window.fetch = function (u, o) {
    try { arguments[0] = rewrite(typeof u === "string" ? u : u.url); } catch (e) {}
    return of.apply(this, arguments);
  };

  if (navigator.sendBeacon) navigator.sendBeacon = function () { return true; };   // telemetry dropped

  // era bundles look for these globals; provide minimum-safe shells if a bundle 404'd them
  window.Roblox = window.Roblox || {};
  window.Roblox.BundleDetector = window.Roblox.BundleDetector || { reportBundleError: function () {} };
})();
