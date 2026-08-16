/* LUXORA auth glue (phase 1: signup)
   The visible form = era Landing bundle (their markup). We only WIRE it:
   capture the real submit, gather the era fields, Turnstile, POST to our
   /apisite/auth/v2/signup with the authentic 403->X-CSRF-TOKEN retry flow,
   surface errors via the bundle's own error nodes. No markup authored here. */
(function () {
  "use strict";
  var state = { wired: false, busy: false };

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function formRoot() {
    return q("#signup-username") && (q("#signup-container") || q("[signup]") || q("form") || document.body);
  }

  function showErr(msg) {
    var root = formRoot();
    var node = q(".signup-error", root) || q("[id*='error'][class*='text-error']", root)
      || q(".text-error:not(.input-error)", root) || q("[id*='signup'][id*='error' i]", root);
    if (node) { node.textContent = msg; node.classList.remove("hidden"); node.style.display = ""; }
    else if (window.console) console.warn("[luxora] signup error:", msg);
    var bad = q(".form-group.input-error", root);
    void bad;
  }

  function fieldErr(inputSel, msg) {
    var inp = q(inputSel);
    if (!inp) { showErr(msg); return; }
    var grp = inp.closest(".form-group");
    if (grp) grp.classList.add("input-error");
    var lbl = grp && (q(".text-error", grp) || q("[id*='rror']", grp));
    if (lbl) { lbl.textContent = msg; lbl.classList.remove("hidden"); lbl.style.display = ""; }
    else showErr(msg);
  }
  function clearErrs() { qa(".form-group.input-error").forEach(function (g) { g.classList.remove("input-error"); }); }

  function getGender() {
    var sel = q("#MaleButton .gender-selected") && q("#MaleButton") ? 2
      : q("#FemaleButton .gender-selected") && q("#FemaleButton") ? 3
      : null;
    if (!sel) {
      var m = q("#MaleButton"), f = q("#FemaleButton");
      if (m && (m.classList.contains("gender-selected") || q(".gender-selected", m))) sel = 2;
      else if (f && (f.classList.contains("gender-selected") || q(".gender-selected", f))) sel = 3;
    }
    return sel; // null = untouched
  }

  /* Era birthday selects (angular ng-options) carry "string:Jan"/"number:15"/"?" in their
     DOM values; the REAL values live in the angular model ("Jan".."Dec" / numbers). Reading
     order below: angular model -> prefix-stripped DOM value. No DOM surgery: replacing the
     selects made the era form's own validation flag "birthday missing" instantly. */
  function rawVal(el) {
    var v = el ? String(el.value) : "";
    if (v === "?") return "";
    return v.replace(/^[a-z]+:/, "");
  }

  function selVal(el) {
    if (!el) return "";
    try {
      if (window.angular) {
        var c = angular.element(el).controller("ngModel");
        if (c && c.$modelValue !== undefined && c.$modelValue !== null && c.$modelValue !== "") return c.$modelValue;
      }
    } catch (e) { /* fall through */ }
    return rawVal(el);
  }

  var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

  function birthday() {
    var m = q("#MonthDropdown"), d = q("#DayDropdown"), y = q("#YearDropdown");
    if (!m || !d || !y) return null;
    var mv = MONTHS[String(selVal(m)).slice(0, 3).toLowerCase()] || parseInt(selVal(m), 10);
    var dv = parseInt(selVal(d), 10), yv = parseInt(selVal(y), 10);
    if (!mv || !dv || !yv) return null;
    return yv + "-" + String(mv).padStart(2, "0") + "-" + String(dv).padStart(2, "0");
  }

  var ts = { box: null, wid: null };
  function getTurnstileToken(cb) {
    if (!window.LUXORA.turnstileSiteKey || !window.turnstile) return cb(""); // captcha disabled (dev)
    try {
      if (!ts.box) {
        var root = formRoot();
        var anchor = q("[name='signupSubmit']", root) || q("button[type='submit']", root);
        ts.box = document.createElement("div");
        ts.box.id = "luxora-ts-box";
        ts.box.style.cssText = "display:table;margin:12px auto;"; // centered above the button
        if (anchor) anchor.parentNode.insertBefore(ts.box, anchor);
        else root.appendChild(ts.box);
      }
      if (ts.wid === null) ts.wid = turnstile.render(ts.box, { sitekey: window.LUXORA.turnstileSiteKey });
      var tries = 0;
      var iv = setInterval(function () {
        var t = null;
        try { t = turnstile.getResponse(ts.wid); } catch (e) { /* widget mid-boot */ }
        if (t) { clearInterval(iv); cb(t); }
        else if (++tries > 160) { clearInterval(iv); try { turnstile.reset(ts.wid); } catch (e) {} cb(null); }
      }, 250);
    } catch (e) { cb(null); }
  }

  function api(path, opts, done) {
    function go(xsrf) {
      var headers = { "Content-Type": "application/json", "X-CSRF-TOKEN": xsrf || window.LUXORA.xsrf };
      fetch(path, Object.assign({ method: "POST", headers: headers, credentials: "same-origin" }, opts || {}))
        .then(function (r) {
          if (r.status === 403 && r.headers.get("X-CSRF-TOKEN")) go(r.headers.get("X-CSRF-TOKEN")); // era retry
          else r.json().catch(function () { return {}; }).then(function (j) { done(r.status, j); });
        }).catch(function () { done(0, {}); });
    }
    go(null);
  }

  function submit() {
    if (state.busy) return;
    clearErrs();
    var username = (q("#signup-username") || {}).value || "";
    var password = (q("#signup-password") || {}).value || "";
    var bday = birthday();
    var gender = getGender();
    if (!username || !password) return fieldErr("#signup-username", "Please fill in all fields.");
    if (!bday) return showErr("Please pick your birthday.");
    if (gender === null) return showErr("Please pick a gender.");

    state.busy = true;
    getTurnstileToken(function (token) {
      if (token === null) { state.busy = false; return showErr("Captcha failed — please try again."); }
      api("/apisite/auth/v2/signup", {
        body: JSON.stringify({
          username: username, password: password, birthday: bday, gender: gender,
          captchaProvider: "Turnstile", captchaToken: token, captchaId: "luxora-signup",
          isTosAgreementBoxChecked: true, agreementIds: []
        })
      }, function (status, j) {
        state.busy = false;
        if (status === 200 && j.userId) { location.href = "/home?nu=true"; return; }
        var e = (j.errors && j.errors[0]) || { code: 500, message: "Something went wrong. Try again." };
        if (e.code === 1 || e.code === 5) fieldErr("#signup-username", e.message);
        else if (e.code === 4) fieldErr("#signup-password", e.message);
        else showErr(e.message);
      });
    });
  }

  function wireUsernameCheck() {
    var inp = q("#signup-username");
    if (!inp || inp.__luxoraWired) return; inp.__luxoraWired = true;
    inp.addEventListener("blur", function () {
      var v = inp.value; if (!v) return;
      fetch("/apisite/auth/v1/usernames/validate?username=" + encodeURIComponent(v), { credentials: "same-origin" })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j.code !== 0) fieldErr("#signup-username", j.message); })
        .catch(function () {});
    });
  }

  function wire() {
    if (state.wired) return;
    var user = q("#signup-username"); if (!user) return;
    state.wired = true;
    wireUsernameCheck();
    var root = formRoot();
    // capture-phase intercept — their angular handlers never see the network phase
    root.addEventListener("submit", function (ev) { ev.preventDefault(); ev.stopPropagation(); submit(); }, true);
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[name='signupSubmit'],button[type='submit'],.signup-button");
      if (b && root.contains(b)) { ev.preventDefault(); ev.stopPropagation(); submit(); }
    }, true);
    if (window.console) console.log("[luxora] signup wired");
  }

  var iv = setInterval(function () {
    wire();
    if (state.wired) clearInterval(iv);
  }, 300);
  setTimeout(function () { clearInterval(iv); }, 30000);
})();
