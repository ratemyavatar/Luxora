/* Wiring for the captured 2022 Create Experience form. */
(function () {
  "use strict";
  function q(s, r) { return (r || document).querySelector(s); }
  function qa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var form = q("#placeForm"); if (!form) return;
  var params = new URLSearchParams(location.search), gameId = parseInt(params.get("id"), 10) || 0;
  var currentActive = false;

  function api(url, options) {
    options = options || {}; options.credentials = "same-origin";
    options.headers = Object.assign({ "Content-Type": "application/json", "X-CSRF-TOKEN": window.LUXORA.xsrf }, options.headers || {});
    return fetch(url, options).then(function (response) {
      var retry = response.headers.get("X-CSRF-TOKEN");
      if (response.status === 403 && retry) { options.headers["X-CSRF-TOKEN"] = retry; return api(url, options); }
      return response.json().catch(function () { return {}; }).then(function (body) { if (!response.ok) throw body; return body; });
    });
  }
  function value(id, fallback) { var node = q("#" + id); return node ? node.value : fallback; }
  function checked(id) { var node = q("#" + id); return !!(node && node.checked); }
  function showError(message) {
    var summary = q("[data-valmsg-summary] ul");
    if (summary) { summary.innerHTML = ""; var li = document.createElement("li"); li.textContent = message; summary.appendChild(li); }
  }
  function payload() {
    return {
      name: value("Name", ""), description: value("Description", ""), genre: value("Genre", "All"),
      access: value("Access", "Everyone"), numberOfPlayersMax: parseInt(value("MaxPlayersInput", "20"), 10) || 20,
      templateId: parseInt(value("TemplateID", ""), 10) || null, isCopyingAllowed: checked("IsCopyingAllowed"),
      isActive: currentActive, socialSlotType: (q("input[name='SocialSlotType']:checked") || {}).value || "Automatic",
      numberOfCustomSocialSlots: parseInt(value("FriendSlotsInput", "0"), 10) || 0
    };
  }
  function submit(event) {
    if (event) event.preventDefault();
    var data = payload();
    if (!data.name.trim()) return showError("Name is required");
    var url = gameId ? "/apisite/develop/v1/games/" + gameId : "/apisite/develop/v1/games";
    api(url, { method: gameId ? "PUT" : "POST", body: JSON.stringify(data) }).then(function () { location.href = "/develop"; })
      .catch(function (body) { showError(body.errors && body.errors[0] ? body.errors[0].message : "Unable to save experience."); });
  }
  function setValue(id, value) { var node = q("#" + id); if (node && value != null) node.value = value; }
  function loadEdit() {
    if (!gameId) return;
    api("/apisite/develop/v1/games/" + gameId, { method: "GET", headers: {} }).then(function (game) {
      currentActive = game.isActive;
      setValue("Name", game.name); setValue("Description", game.description); setValue("Genre", game.genre);
      setValue("Access", game.access); setValue("MaxPlayersInput", game.numberOfPlayersMax); setValue("TemplateID", game.templateId || "");
      var copy = q("#IsCopyingAllowed"); if (copy) copy.checked = game.isCopyingAllowed;
      var social = q("input[name='SocialSlotType'][value='" + game.socialSlotType + "']"); if (social) social.checked = true;
      setValue("FriendSlotsInput", game.numberOfCustomSocialSlots);
      var heading = q("h1"); if (heading) heading.textContent = "Configure Experience";
      var finish = q("#finishButton"); if (finish) finish.textContent = "Save";
    }).catch(function () { showError("Experience not found."); });
  }

  qa(".tab-container .tab", form).forEach(function (tab) { tab.addEventListener("click", function () {
    qa(".tab-container .tab", form).forEach(function (x) { x.classList.remove("active"); }); tab.classList.add("active");
    qa(".tab-content", form).forEach(function (x) { x.classList.remove("tab-active"); });
    var content = q("#" + tab.dataset.id, form); if (content) content.classList.add("tab-active");
  }); });
  qa(".templates .template", form).forEach(function (template) { template.addEventListener("click", function (event) {
    event.preventDefault(); qa(".templates .template", form).forEach(function (x) { x.classList.remove("selected"); });
    template.classList.add("selected"); setValue("TemplateID", template.getAttribute("placeid") || "");
  }); });
  var finish = q("#finishButton"); if (finish) finish.addEventListener("click", submit);
  var cancel = q("#cancelButton"); if (cancel) { cancel.href = "/develop"; cancel.addEventListener("click", function (e) { e.preventDefault(); location.href = "/develop"; }); }
  form.addEventListener("submit", submit);
  loadEdit();
})();
