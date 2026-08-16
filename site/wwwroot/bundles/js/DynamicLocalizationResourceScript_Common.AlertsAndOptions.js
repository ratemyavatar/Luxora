var _____WB$wombat$assign$function_____ = function (name) {
  return (
    (self._wb_wombat &&
      self._wb_wombat.local_init &&
      self._wb_wombat.local_init(name)) ||
    self[name]
  );
};
if (!self.__WB_pmw) {
  self.__WB_pmw = function (obj) {
    this.__WB_source = obj;
    return this;
  };
}
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opens = _____WB$wombat$assign$function_____("opens");
  var Roblox = Roblox || {};
  Roblox.LangDynamic = Roblox.LangDynamic || {};
  Roblox.LangDynamic["Common.AlertsAndOptions"] = {
    "Label.sRobux": "Robux",
    "Label.sBuyRobux": "Buy Robux",
    "Label.sSettings": "Settings",
    "Label.sHelp": "Help",
    "Label.sLogout": "Logout",
    "Label.sRobuxMessage": "{robuxValue} Robux",
  };
  window.Roblox &&
    window.Roblox.BundleDetector &&
    window.Roblox.BundleDetector.bundleDetected(
      "DynamicLocalizationResourceScript_Common.AlertsAndOptions",
    );
}