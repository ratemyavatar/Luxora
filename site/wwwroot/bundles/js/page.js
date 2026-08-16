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
  let opens = _____WB$wombat$assign$function_____("opens"); // bundle: page___38af22b1b5ce898a08bbd79adae3f389_m
  // files: captcha/constants/captchaConstants.js, captcha/captchaLogger.js, captcha/captchaService.js, ~/viewapp/widgets/captcha/captcha.js, ~/viewapp/widgets/captcha/constants/captchaConstants.js, ~/viewapp/widgets/captcha/directives/captchaDirective.js, ~/viewapp/widgets/captcha/services/captchaInterface.js, ~/viewapp/widgets/captcha/services/funCaptchaInterface.js, ~/viewapp/widgets/captcha/directives/funCaptchaDirective.js, EventTracker.js, ~/viewapp/common/services/eventTrackerService.js, Tracking/FormEvents.js, ~/viewapp/common/formEvents/formEvents.js, ~/viewapp/common/formEvents/directives/formInteraction.js, ~/viewapp/common/formEvents/directives/formContext.js, ~/viewapp/common/formEvents/directives/formValidation.js, ~/viewapp/common/formEvents/directives/formValidationRedactInput.js, ~/viewapp/common/constants/phoneConstants.js, ~/viewapp/common/services/phoneService.js, FormValidator.js, SignupFormValidatorGeneric.js, Signup/Signup.js, ~/Generated/js/Roblox_TranslationResources_Feature_LandingResources_en_us_standard.js, ~/Generated/js/Roblox_TranslationResources_Authentication_SignUpResources_en_us_standard.js, ~/Generated/js/Roblox_TranslationResources_CommonUI_ControlsResources_en_us_standard.js, ~/Generated/js/Roblox_TranslationResources_Common_CaptchaResources_en_us_standard.js, ~/Generated/js/Roblox_TranslationResources_CommonUI_FeaturesResources_en_us_standard.js, ~/Generated/js/Roblox_TranslationResources_Feature_AvatarResources_en_us_standard.js, ~/Generated/js/Roblox_TranslationResources_Feature_LandingAvatarResources_en_us_standard.js, common/deviceMeta.js
  // captcha/constants/captchaConstants.js
  ("use strict");
  var Roblox = Roblox || {};
  Roblox.CaptchaConstants = Roblox.CaptchaConstants || {
    endpoints: {
      sendMessage: "",
      addFriend: "",
      follow: "",
      signup: "",
      joinGroup: "",
      login: "",
      postComment: "",
      clothingUpload: "",
      favorite: "",
      appSignup: "",
      appLogin: "",
      resetPassword: "",
    },
    serviceData: {
      sitekey: "",
      trulyInvisibleSitekey: "",
      successSuffix: "Captcha_Success",
      failSuffix: "Captcha_Failed",
      displayedSuffix: "Captcha_Displayed",
      captchaSolvedPrefix: "Captcha_User_Solved_InSeconds_",
      captchaSolveTimeIntervals: [
        { seconds: 1, suffix: "Less_Than_1" },
        { seconds: 3, suffix: "1_To_3" },
        { seconds: 10, suffix: "4_To_10" },
        { seconds: 20, suffix: "11_To_20" },
        { seconds: 30, suffix: "21_To_30" },
        { seconds: 40, suffix: "31_To_40" },
        { seconds: 50, suffix: "41_To_50" },
      ],
      captchaSolveTimeLarge: "Greater_Than_50",
      badgePosition: "bottomright",
      logConstants: {
        successSuffix: "_Success",
        failSuffix: "_Failed",
        maxFailSuffix: "_MaxFailed",
        retrySuffix: "_Retried",
        displayedSuffix: "_Displayed",
        triggeredSuffix: "_Triggered",
        initializedSuffix: "_Initialized",
        suppressedSuffix: "_Suppressed",
        providerErrorSuffix: "_FailedToLoad",
        completedTimeSequenceSuffix: "_SolveTime",
        solvedPrefix: "_User_Solved_InSeconds_",
        solveTimeIntervals: [
          { seconds: 1, suffix: "Less_Than_1" },
          { seconds: 3, suffix: "1_To_3" },
          { seconds: 10, suffix: "4_To_10" },
          { seconds: 20, suffix: "11_To_20" },
          { seconds: 30, suffix: "21_To_30" },
          { seconds: 40, suffix: "31_To_40" },
          { seconds: 50, suffix: "41_To_50" },
        ],
        solveTimeLarge: "Greater_Than_50",
        eventStreamCaptchaEventName: "captcha",
        eventStreamCaptchaInitiatedEventName: "captchaInitiated",
        eventStreamCaptchaTokenReceivedEventName: "captchaTokenReceived",
        captchaInitiatedChallengeTypes: {
          visible: "visible",
          hidden: "hidden",
          error: "error",
        },
      },
    },
    types: {
      signup: "signup",
      sendMessage: "sendMessage",
      follow: "follow",
      joinGroup: "joinGroup",
      login: "login",
      postComment: "postComment",
      clothingUpload: "clothingUpload",
      favorite: "favorite",
      appSignup: "appSignup",
      appLogin: "appLogin",
      gameCardRedeem: "gameCardRedeem",
      resetPassword: "resetPassword",
    },
    ids: {
      defaultCaptcha: "captcha-container",
      signup: "signup-captcha",
      login: "login-captcha",
      groups: "groups-captcha",
      profile: "profile-captcha",
      appCaptcha: "app-captcha",
      gameCardRedeem: "game-card-redeem-captcha",
      resetPassword: "reset-password-captcha",
    },
    messageElementIds: { defaultError: "captcha-error" },
    eventElementIds: {
      shown: "captcha-event-shown",
      token: "captcha-event-token",
      provider: "captcha-event-provider",
    },
    hybridEvents: { shown: "CaptchaShown", success: "CaptchaSuccess" },
    messages: {
      error: "We currently cannot verify CAPTCHA, please try again later.",
      funCaptchaError:
        "We currently cannot verify FunCaptcha, please try again later.",
    },
    errorCodes: { failedToLoadProviderScript: 0, failedToVerify: 1 },
    localeToFunCaptchaLanguageCodeMap: {
      "de-de": "de",
      "en-us": "en",
      "es-es": "es",
      "fr-fr": "fr",
      "pt-br": "pt-br",
      "ko-kr": "ko",
      "zh-cn": "zh",
      "zh-tw": "zh-tw",
      "ja-jp": "ja",
    },
    appTypes: {
      android: "android",
      ios: "ios",
      xbox: "xbox",
      uwp: "uwp",
      unknown: "unknown",
    },
    captchaProviders: { arkoseLabs: "PROVIDER_ARKOSE_LABS" },
  }; // captcha/captchaLogger.js

  ("use strict");
  var Roblox = Roblox || {},
    EventTracker = window.EventTracker || null;
  Roblox.CaptchaLogger = function (n) {
    function r(n) {
      return e && typeof f != "undefined" ? n + "_" + f : n;
    }
    function u(n) {
      return n.charAt(0).toUpperCase() + n.slice(1);
    }
    var i = Roblox.CaptchaConstants,
      o = $.extend({}, i.serviceData),
      t = o.logConstants,
      e = !1,
      f;
    ((this.provider = n),
      (this.setPerAppTypeLoggingEnabled = function (n) {
        var t = null,
          r;
        (Roblox.UrlParser &&
          ((r = Roblox.UrlParser.getParameterValueByName("appType")),
          i && i.appTypes && i.appTypes.hasOwnProperty(r) && (t = r)),
          t == null &&
            Roblox.DeviceMeta &&
            Roblox.DeviceMeta().isInApp &&
            (t = Roblox.DeviceMeta().appType),
          t !== null && ((e = n), (f = t)));
      }),
      (this.fireEvent = function (n, t) {
        ((t = u(n + this.provider + t)),
          EventTracker && EventTracker.fireEvent(r(t)));
      }),
      (this.startStatisticsSequence = function (n) {
        EventTracker && EventTracker.start(r(n));
      }),
      (this.endStatisticsSequenceWithSuccess = function (n) {
        EventTracker && EventTracker.endSuccess(r(n));
      }),
      (this.endStatisticsSequenceWithFailure = function (n) {
        EventTracker && EventTracker.endFailure(r(n));
      }),
      (this.logSuccess = function (n) {
        (this.fireEvent(n, t.successSuffix),
          this.endStatisticsSequenceWithSuccess(
            u(n + this.provider + t.completedTimeSequenceSuffix),
          ));
      }),
      (this.logFail = function (n) {
        this.fireEvent(n, t.failSuffix);
      }),
      (this.logMaxFail = function (n) {
        (this.fireEvent(n, t.maxFailSuffix),
          this.endStatisticsSequenceWithFailure(
            u(n + this.provider + t.completedTimeSequenceSuffix),
          ));
      }),
      (this.logRetried = function (n) {
        this.fireEvent(n, t.retrySuffix);
      }),
      (this.logTriggered = function (n) {
        (this.fireEvent(n, t.triggeredSuffix),
          this.startStatisticsSequence(
            u(n + this.provider + t.completedTimeSequenceSuffix),
          ));
      }),
      (this.logInitialized = function (n) {
        this.fireEvent(n, t.initializedSuffix);
      }),
      (this.logSuppressed = function (n) {
        this.fireEvent(n, t.suppressedSuffix);
      }),
      (this.logDisplayed = function (n) {
        this.fireEvent(n, t.displayedSuffix);
      }),
      (this.logProviderError = function (n) {
        this.fireEvent(n, t.providerErrorSuffix);
      }),
      (this.logCaptchaShownEventToEventStream = function (n) {
        this.logCaptchaInitiatedEventToEventStream(
          n,
          t.captchaInitiatedChallengeTypes.visible,
        );
      }),
      (this.logCaptchaSuppressedEventToEventStream = function (n) {
        this.logCaptchaInitiatedEventToEventStream(
          n,
          t.captchaInitiatedChallengeTypes.hidden,
        );
      }),
      (this.logCaptchaErrorEventToEventStream = function (n, i) {
        this.logCaptchaInitiatedEventToEventStream(
          n,
          t.captchaInitiatedChallengeTypes.error,
          i.toString(),
        );
      }),
      (this.logCaptchaInitiatedEventToEventStream = function (n, i, r) {
        if (Roblox.EventStream) {
          var f = n,
            u = { type: i, provider: this.provider };
          (typeof r != "undefined" && (u.message = r),
            Roblox.EventStream.SendEventWithTarget(
              t.eventStreamCaptchaInitiatedEventName,
              f,
              u,
              Roblox.EventStream.TargetTypes.WWW,
            ));
        }
      }),
      (this.logCaptchaTokenReceivedEventToEventStream = function (n, i) {
        if (Roblox.EventStream) {
          var r = n;
          Roblox.EventStream.SendEventWithTarget(
            t.eventStreamCaptchaTokenReceivedEventName,
            r,
            { provider: this.provider, session: i },
            Roblox.EventStream.TargetTypes.WWW,
          );
        }
      }),
      (this.logCaptchaEventToEventStream = function (n, i, r, u) {
        if (Roblox.EventStream) {
          i = i || 0;
          var f = r ? "true" : "false",
            e = n;
          Roblox.EventStream.SendEventWithTarget(
            t.eventStreamCaptchaEventName,
            e,
            {
              solveDuration: i,
              success: f,
              provider: this.provider,
              session: u || "",
            },
            Roblox.EventStream.TargetTypes.WWW,
          );
        }
      }));
  }; // captcha/captchaService.js

  ("use strict");
  var Roblox = Roblox || {},
    grecaptcha = window.grecaptcha || null,
    EventTracker = window.EventTracker || null;
  Roblox.Captcha = (function () {
    function u(n) {
      return n.charAt(0).toUpperCase() + n.slice(1);
    }
    function v(n) {
      return n.charAt(0).toLowerCase() + n.slice(1);
    }
    function a() {
      return new Date().valueOf();
    }
    function k(t) {
      for (
        var e = 1e3,
          u = n.captchaSolvedPrefix,
          f = n.captchaSolveTimeIntervals,
          r,
          i = 0;
        i < f.length;
        i++
      )
        if (((r = f[i]), t <= r.seconds * e)) return u + r.suffix;
      return u + n.captchaSolveTimeLarge;
    }
    function d(n) {
      var i = k(n);
      EventTracker && EventTracker.fireEvent(u(t + i));
    }
    function y(n, t, i) {
      if (Roblox.EventStream) {
        t = t || 0;
        var r = i ? "true" : "false",
          u = n;
        Roblox.EventStream.SendEventWithTarget(
          "captcha",
          u,
          { solveDuration: t, success: r, provider: "Google" },
          Roblox.EventStream.TargetTypes.WWW,
        );
      }
    }
    function p(t, f, o) {
      var h = { "g-Recaptcha-Response": f, isInvisible: i.invisible };
      $.ajax({
        method: "POST",
        data: h,
        success: function () {
          (EventTracker && EventTracker.fireEvent(u(t + n.successSuffix)),
            y(t, o, !0),
            s && (s(), $("#" + l).empty()));
        },
        error: function () {
          (EventTracker && EventTracker.fireEvent(u(t + n.failSuffix)),
            y(t, o, !1),
            e && e(),
            Roblox.BootstrapWidgets &&
              Roblox.BootstrapWidgets.ToggleSystemMessage(
                $(".alert-warning"),
                100,
                2e3,
                Roblox.CaptchaConstants.messages.error,
              ));
        },
        url: r[t],
      });
    }
    function w(n) {
      var i = { "g-Recaptcha-Response": n, isTrulyInvisible: !0 };
      $.ajax({
        method: "POST",
        data: i,
        complete: function () {
          $("#" + c).empty();
        },
        url: r[t],
      });
    }
    function g(i, r) {
      if (((t = t || v(r)), (c = i), grecaptcha)) {
        var u = { callback: w, badge: n.badgePosition },
          f = grecaptcha.render(c, u);
        grecaptcha.execute(f);
      }
    }
    var r = Roblox.CaptchaConstants.endpoints,
      l,
      c,
      h,
      i = { invisible: !1 },
      n = Roblox.CaptchaConstants.serviceData,
      o,
      t,
      s,
      e,
      f,
      b = function (n) {
        typeof f == "function" && f();
        var i = null;
        (o && ((i = a() - o), d(i), (o = null)), p(t, n, i));
      };
    return {
      ids: Roblox.CaptchaConstants.ids,
      types: Roblox.CaptchaConstants.types,
      setEndpoint: function (n, t) {
        r[n] = t;
      },
      getEndpoint: function (n) {
        return r[n];
      },
      setInvisibleMode: function (n) {
        i.invisible = n;
      },
      getInvisibleMode: function () {
        return i.invisible;
      },
      setSiteKey: function (t) {
        n.sitekey = t;
      },
      verify: p,
      reset: function (n, r, u, o) {
        ((t = n),
          (s = r),
          (e = u),
          (f = o),
          grecaptcha &&
            (grecaptcha.reset(h), i.invisible && grecaptcha.execute(h)));
      },
      render: function (r, c, v, y, p) {
        if (((t = c), (s = v), (e = y), (f = p), (l = r), grecaptcha)) {
          var w = { sitekey: n.sitekey, callback: b, badge: n.badgePosition };
          (i.invisible && (w.size = "invisible"),
            (h = grecaptcha.render(r, w)),
            EventTracker && EventTracker.fireEvent(u(t + n.displayedSuffix)),
            (o = a()));
        }
      },
      execute: function () {
        grecaptcha && i.invisible && grecaptcha.execute(h);
      },
      setMultipleEndpoints: function (n, t) {
        var i, u;
        if (n && t) for (i = 0; i < n.length; i++) ((u = v(n[i])), (r[u] = t));
      },
      trulyInvisibleCallback: w,
      renderTrulyInvisible: g,
    };
  })(); // ~/viewapp/widgets/captcha/captcha.js

  ("use strict");
  var captcha = angular.module("captcha", []); // ~/viewapp/widgets/captcha/constants/captchaConstants.js

  ("use strict");
  captcha.constant("captchaConstants", {
    template:
      "<div id='{{captchaElem.id}}' ng-show='captchaElem.isVisible'></div>",
    googleTemplate: "google-captcha-template",
    fcTemplate: "fun-captcha-template",
    fcModalTemplate: "fun-captcha-modal-template",
  }); // ~/viewapp/widgets/captcha/directives/captchaDirective.js

  ("use strict");
  captcha.directive("captcha", [
    "$log",
    "$parse",
    "captchaConstants",
    "captchaInterface",
    function (n, t, i, r) {
      return {
        restrict: "A",
        template: i.template,
        link: function (i, u, f) {
          function h(n, t, f, e) {
            var l = u.find("#" + i.captchaElem.id),
              s,
              h;
            if (
              ((i.captchaElem.isVisible = !0),
              (s = function () {
                (c(), angular.isFunction(t) && t());
              }),
              (h = function () {
                angular.isFunction(f) && f();
              }),
              o)
            ) {
              r.reset(n, s, h, e);
              return;
            }
            (r.render(i.captchaElem.id, n, s, h, e), (o = !0), r.execute());
          }
          function c() {
            var n = u.find("#" + i.captchaElem.id);
            (n.empty(), (i.captchaElem.isVisible = !1));
          }
          var o, e, s;
          ((i.captchaElem = { isVisible: !1 }),
            (o = !1),
            (e = t(f.captchaModel)(i)),
            (i.captchaElem.id = e.id || r.ids.defaultCaptcha),
            (s = i.$watch(
              function () {
                return e.isActivated;
              },
              function (r) {
                if (r) {
                  var s = t(f.onCaptchaSuccess)(i) || angular.noop,
                    c = t(f.onCaptchaError)(i) || angular.noop,
                    l = t(f.onCaptchaResponse)(i) || angular.noop,
                    o = t(f.captchaType)(i);
                  if (!o) {
                    n.debug("[Captcha Error] captcha type cannot be empty");
                    return;
                  }
                  (h(o, s, c, l), (e.isActivated = !1));
                }
              },
              !0,
            )),
            i.$on("$destroy", function () {
              s && s();
            }));
        },
      };
    },
  ]); // ~/viewapp/widgets/captcha/services/captchaInterface.js

  captcha.factory("captchaInterface", [
    "$q",
    function () {
      var t = Roblox.Captcha || {};
      return {
        types: t.types,
        ids: t.ids,
        setEndpoint: t.setEndpoint,
        setInvisibleMode: t.setInvisibleMode,
        setSiteKey: t.setSiteKey,
        reset: t.reset,
        render: t.render,
        execute: t.execute,
      };
    },
  ]); // ~/viewapp/widgets/captcha/services/funCaptchaInterface.js

  captcha.factory("funCaptchaInterface", [
    "$q",
    function () {
      var t = Roblox.FunCaptcha || {};
      return {
        ids: Roblox.CaptchaConstants.ids,
        types: t.types,
        reset: t.reset,
        render: t.render,
      };
    },
  ]); // ~/viewapp/widgets/captcha/directives/funCaptchaDirective.js

  ("use strict");
  captcha.directive("funCaptcha", [
    "$log",
    "$uibModal",
    "captchaConstants",
    "funCaptchaInterface",
    function (n, t, i, r) {
      return {
        restrict: "A",
        scope: {
          captchaModel: "=",
          onFunCaptchaSuccess: "&",
          onFunCaptchaError: "&",
          onFunCaptchaSolved: "&",
          onFunCaptchaLoaded: "&",
          onFunCaptchaSuppress: "&",
          onFunCaptchaShown: "&",
          onFunCaptchaClosed: "&",
          captchaType: "=",
          credentialsValue: "=",
          credentialsType: "=",
          showInModal: "=",
        },
        templateUrl: i.fcTemplate,
        link: function (u, f) {
          function a() {
            (u.showInModal &&
              ((u.showContainer = !1),
              (s = t.open({
                templateUrl: i.fcModalTemplate,
                keyboard: !1,
                backdrop: "static",
              })),
              s.rendered.then(function () {
                ((c = angular.element("#funcaptcha-modal-body")),
                  (l = angular.element("#" + u.captchaElem.id).detach()),
                  c.append(l),
                  (u.showContainer = !0));
              }),
              s.result.then(function () {
                (f.append(angular.element("#" + u.captchaElem.id).detach()),
                  (u.showContainer = !1),
                  u.onFunCaptchaClosed && u.onFunCaptchaClosed());
              })),
              u.onFunCaptchaShown && u.onFunCaptchaShown());
          }
          function v() {
            (u.showInModal && s && s.close(),
              u.onFunCaptchaSolved && u.onFunCaptchaSolved());
          }
          var o = u.captchaModel,
            s,
            c,
            l,
            h;
          ((u.captchaElem = { id: o.id }),
            (u.showContainer = !0),
            (h = u.$watch(
              function () {
                return o.isActivated;
              },
              function (t) {
                if (t) {
                  var f = {
                    successCb: u.onFunCaptchaSuccess || angular.noop,
                    errorCb: function (n) {
                      u.onFunCaptchaError &&
                        u.onFunCaptchaError({ errorCode: n });
                    },
                    solvedCb: v,
                    loadedCb: u.onFunCaptchaLoaded || angular.noop,
                    suppressCb: u.onFunCaptchaSuppress || angular.noop,
                    shownCb: a,
                    cType: u.captchaType,
                  };
                  if (!f.cType) {
                    n.debug("[Captcha Error] captcha type cannot be empty");
                    return;
                  }
                  (o.extraValidationParams
                    ? (f.extraValidationParams = o.extraValidationParams)
                    : u.credentialsValue &&
                      u.credentialsType &&
                      (f.extraValidationParams = {
                        credentialsValue: u.credentialsValue,
                        credentialsType: u.credentialsType,
                      }),
                    r.render(u.captchaElem.id, f),
                    (o.isActivated = !1));
                }
              },
              !0,
            )),
            u.$on("$destroy", function () {
              h && h();
            }));
        },
      };
    },
  ]); // EventTracker.js

  EventTracker = new (function () {
    var n = this;
    ((n.logMetrics = !1), (n.transmitMetrics = !0), (n.localEventLog = []));
    var t = new (function () {
        var n = {};
        ((this.get = function (t) {
          return n[t];
        }),
          (this.set = function (t, i) {
            n[t] = i;
          }),
          (this.remove = function (t) {
            delete n[t];
          }));
      })(),
      r = function () {
        return new Date().valueOf();
      },
      i = function (n, t) {
        var i = r();
        $.each(n, function (n, r) {
          u(r, t, i);
        });
      },
      u = function (i, r, u) {
        var e = t.get(i),
          f,
          o;
        e
          ? (t.remove(i),
            (f = u - e),
            n.logMetrics && console.log("[event]", i, r, f),
            n.transmitMetrics &&
              ((o = i + "_" + r),
              $.ajax({
                type: "POST",
                timeout: 5e4,
                url: "/game/report-stats?name=" + o + "&value=" + f,
                crossDomain: !0,
                xhrFields: { withCredentials: !0 },
              })))
          : n.logMetrics &&
            console.log("[event]", "ERROR: event not started -", i, r);
      };
    ((n.start = function () {
      var n = r();
      $.each(arguments, function (i, r) {
        t.set(r, n);
      });
    }),
      (n.endSuccess = function () {
        i(arguments, "Success");
      }),
      (n.endCancel = function () {
        i(arguments, "Cancel");
      }),
      (n.endFailure = function () {
        i(arguments, "Failure");
      }),
      (n.fireEvent = function () {
        $.each(arguments, function (t, i) {
          ($.ajax({
            type: "POST",
            timeout: 5e4,
            url: "/game/report-event?name=" + i,
            crossDomain: !0,
            xhrFields: { withCredentials: !0 },
          }),
            n.logMetrics && console.log("[event]", i),
            n.localEventLog.push(i));
        });
      }));
  })(); // ~/viewapp/common/services/eventTrackerService.js

  ("use strict");
  robloxApp.factory("eventTrackerService", [
    function () {
      function n() {
        return EventTracker !== undefined && EventTracker !== null;
      }
      return {
        fireEvent: function (t) {
          n() && EventTracker.fireEvent && EventTracker.fireEvent(t);
        },
      };
    },
  ]); // Tracking/FormEvents.js

  (typeof Roblox == "undefined" && (Roblox = {}),
    typeof Roblox.FormEvents == "undefined" &&
      (Roblox.FormEvents = (function () {
        function n(n, t, i) {
          Roblox.EventStream && Roblox.EventStream.SendEvent(n, t, i);
        }
        function t(t, i, r, u) {
          var f = { msg: u, input: r, field: i, vis: !0 };
          n("formValidation", t, f);
        }
        function i(t, i) {
          var r = { aType: "focus", field: i };
          n("formInteraction", t, r);
        }
        function r(t, i, r) {
          var u = { aType: "offFocus", field: i };
          (r && (u.input = r), n("formInteraction", t, u));
        }
        function u(t, i, r, u) {
          var f = { aType: "click", field: i };
          (r && (f.input = r),
            u && (f = $.extend(f, u)),
            n("formInteraction", t, f));
        }
        return {
          SendValidationFailed: t,
          SendInteractionFocus: i,
          SendInteractionOffFocus: r,
          SendInteractionClick: u,
        };
      })())); // ~/viewapp/common/formEvents/formEvents.js

  ("use strict");
  var formEvents = angular.module("roblox.formEvents", []); // ~/viewapp/common/formEvents/directives/formInteraction.js

  ("use strict");
  formEvents.directive("rbxFormInteraction", function () {
    return {
      require: "^form",
      restrict: "A",
      link: function (n, t, i, r) {
        var u = i.sendInputValue;
        t.bind("blur", function () {
          if (Roblox.FormEvents) {
            var n = angular.element(this),
              t;
            (u && (t = n.val()),
              Roblox.FormEvents.SendInteractionOffFocus(
                r.context,
                n.attr("name"),
                t,
              ));
          }
        }).bind("focus", function () {
          Roblox.FormEvents &&
            Roblox.FormEvents.SendInteractionFocus(
              r.context,
              angular.element(this).attr("name"),
            );
        });
      },
    };
  }); // ~/viewapp/common/formEvents/directives/formContext.js

  ("use strict");
  formEvents.directive("rbxFormContext", function () {
    return {
      require: "form",
      restrict: "A",
      link: function (n, t, i, r) {
        var u = r.$name;
        r.context = i.context + u.charAt(0).toUpperCase() + u.substr(1);
      },
    };
  }); // ~/viewapp/common/formEvents/directives/formValidation.js

  ("use strict");
  formEvents.directive("rbxFormValidation", function () {
    return {
      require: ["^form", "ngModel"],
      restrict: "A",
      link: function (n, t, i, r) {
        n.$watch(
          function () {
            var n = r[1];
            return n.$modelValue;
          },
          function (t) {
            var i = r[1],
              f = r[0],
              u;
            (n.badSubmit || i.$dirty) &&
              i.$invalid &&
              ((u = i.redactedInput ? "[Redacted]" : t),
              Roblox.FormEvents &&
                Roblox.FormEvents.SendValidationFailed(
                  f.context,
                  i.$name,
                  u,
                  i.$validationMessage,
                ));
          },
        );
      },
    };
  }); // ~/viewapp/common/formEvents/directives/formValidationRedactInput.js

  ("use strict");
  formEvents.directive("rbxFormValidationRedactInput", function () {
    return {
      require: "ngModel",
      restrict: "A",
      link: function (n, t, i, r) {
        r.redactedInput = !0;
      },
    };
  }); // ~/viewapp/common/constants/phoneConstants.js

  robloxApp.constant("phoneConstants", {
    templates: { verifyPhoneModal: "verify-phone-modal" },
    urls: {
      phonePrefixes: "/v1/countries/phone-prefix-list",
      addPhone: "/v1/phone",
      verifyPhone: "/v1/phone/verify",
      resendCode: "/v1/phone/resend",
    },
    modalTypes: { addPhone: "addPhone", verifyPhone: "verifyPhone" },
    minimumPhoneLength: 4,
    underscore: "_",
    phonePrefixCharacter: "+",
    defaultCountryCode: "US",
    unitedStatesPrefix: {
      name: "United States",
      localizedName: "United States",
      code: "US",
      prefix: 1,
    },
  }); // ~/viewapp/common/services/phoneService.js

  robloxApp.factory("phoneService", [
    "$q",
    "httpService",
    "phoneConstants",
    function (n, t, i) {
      function f(n) {
        var i = n + r,
          f = { url: i };
        return t.httpGet(f, null).then(function (n) {
          var t;
          return (
            _.reject(n, function (n) {
              return n.code === u ? ((t = n), !0) : !1;
            }),
            t && n.unshift(t),
            n
          );
        });
      }
      function e(n) {
        var r =
            Roblox.EnvironmentUrls.accountInformationApi + i.urls.addPhoneV2,
          u = { url: r },
          f = {
            countryCode: n.countryCode,
            prefix: n.prefix,
            phone: n.phone,
            password: n.password,
          };
        return t.httpPost(u, f);
      }
      function o(n) {
        var r =
            Roblox.EnvironmentUrls.accountInformationApi + i.urls.verifyPhoneV2,
          u = { url: r },
          f = { code: n.code };
        return t.httpPost(u, f);
      }
      function s() {
        var n =
            Roblox.EnvironmentUrls.accountInformationApi + i.urls.resendCodeV2,
          r = { url: n };
        return t.httpPost(r);
      }
      function h(n) {
        return !n || n.length < i.minimumPhoneLength
          ? !1
          : /\d/.test(n)
            ? /^[\d|\W|_]+$/.test(n)
            : !1;
      }
      var r = i.urls.phonePrefixes,
        u = i.defaultCountryCode;
      return {
        getPhonePrefixes: f,
        addPhone: e,
        verifyPhone: o,
        resendCode: s,
        isPhoneNumber: h,
      };
    },
  ]); // FormValidator.js

  (typeof Roblox == "undefined" && (Roblox = {}),
    (Roblox.FormValidator = (function () {
      function n(n) {
        var i = $(n).data("regex"),
          r = $(n).val();
        return t(r, i);
      }
      function t(n, t) {
        if (typeof n == "undefined" || typeof t == "undefined") return !1;
        var i = new RegExp(t, "i");
        return i.test(n);
      }
      return { validateElementRegex: n };
    })())); // SignupFormValidatorGeneric.js

  var intl, langResources;
  (typeof Roblox == "undefined" && (Roblox = {}),
    typeof Roblox.Resources == "undefined" && (Roblox.Resources = {}),
    typeof Roblox.Resources.AnimatedSignupFormValidator == "undefined" &&
      ((intl =
        Roblox.I18nData &&
        Roblox.I18nData.isI18nEnabledOnLanding &&
        Roblox.Lang &&
        Roblox.Lang.SignUpResources &&
        Roblox.Intl &&
        new Roblox.Intl()),
      intl
        ? ((langResources = Roblox.Lang.SignUpResources),
          (Roblox.Resources.AnimatedSignupFormValidator = {
            maxValid: intl.f(
              langResources["Response.TooManyAccountsWithSameEmailError"],
            ),
            invalidEmail: intl.f(langResources["Response.InvalidEmail"]),
            invalidBirthday: intl.f(langResources["Response.InvalidBirthday"]),
            loginFieldsRequired: intl.f(
              langResources["Response.UsernamePasswordRequired"],
            ),
            loginFieldsIncorrect: intl.f(
              langResources["Response.UsernameOrPasswordIncorrect"],
            ),
            doesntMatch: intl.f(langResources["Response.PasswordMismatch"]),
            passwordIsUsername: intl.f(
              langResources["Response.PasswordContainsUsernameError"],
            ),
            requiredField: intl.f(langResources["Label.Required"]),
            tooShort: intl.f(langResources["Response.PasswordWrongShort"]),
            weakKey: intl.f(langResources["Response.PasswordComplexity"]),
            invalidCharacters: intl.f(
              langResources["Response.SpaceOrSpecialCharaterError"],
            ),
            invalidName: intl.f(
              langResources["Response.UsernameAllowedCharactersError"],
            ),
            cantBeUsed: intl.f(langResources["Response.BadUsername"]),
            cantBeUsedPii: intl.f(
              langResources["Response.UsernamePrivateInfo"],
            ),
            alreadyTaken: intl.f(
              langResources["Response.UsernameAlreadyInUse"],
            ),
            userNameInvalidLength: intl.f(
              langResources["Response.UsernameInvalidLength"],
            ),
            startsOrEndsWithUnderscore: intl.f(
              langResources["Response.UsernameInvalidUnderscore"],
            ),
            moreThanOneUnderscore: intl.f(
              langResources["Response.UsernameTooManyUnderscores"],
            ),
            birthdayRequired: intl.f(
              langResources["Response.BirthdayMustBeSetFirst"],
            ),
            passwordRequired: intl.f(
              langResources["Response.PleaseEnterPassword"],
            ),
            usernameRequired: intl.f(
              langResources["Response.PleaseEnterUsername"],
            ),
            passwordConfirmationRequired: intl.f(
              langResources["Response.PasswordConfirmation"],
            ),
            usernameNoRealNameUse: intl.f(
              langResources["Message.Username.NoRealNameUse"],
            ),
            passwordMinLength: intl.f(
              langResources["Message.Password.MinLength"],
            ),
            usernameNotAvailable: intl.f(
              langResources["Response.UsernameNotAvailable"],
            ),
          }))
        : (Roblox.Resources.AnimatedSignupFormValidator = {
            maxValid: "Too many accounts use this email.",
            invalidEmail: "Invalid email address.",
            invalidBirthday: "Invalid birthday.",
            loginFieldsRequired: "Username and Password are required.",
            loginFieldsIncorrect: "Your username or password is incorrect.",
            doesntMatch: "Passwords do not match.",
            passwordIsUsername: "Password shouldn't match username.",
            requiredField: "Required",
            tooShort: "Passwords must be at least 8 characters long.",
            weakKey: "Please create a more complex password.",
            invalidCharacters: "Spaces and special characters are not allowed.",
            invalidName: "Usernames may only contain letters, numbers, and _.",
            cantBeUsed: "Username not appropriate for Roblox.",
            cantBeUsedPii: "Username might contain private information.",
            alreadyTaken: "This username is already in use.",
            userNameInvalidLength: "Usernames can be 3 to 20 characters long.",
            startsOrEndsWithUnderscore: "Usernames cannot start or end with _.",
            moreThanOneUnderscore: "Usernames can have at most one _.",
            birthdayRequired: "Birthday must be set first.",
            passwordRequired: "Please enter a password.",
            usernameRequired: "Please enter a username.",
            passwordConfirmationRequired:
              "Please enter a password confirmation.",
            usernameNoRealNameUse: "Don't use your real name",
            passwordMinLength: "Min length 8",
            usernameNotAvailable: "Username not available. Please try again.",
          })),
    (Roblox.SignupFormValidatorGeneric = (function () {
      function n(n) {
        var t = n.match(/<[a-z][\s\S]*>/i);
        return t && t.length > 0;
      }
      function h(n, t, i) {
        return i <= 0 || n <= 0 || t <= 0 || t > new Date(i, n, 0).getDate();
      }
      function c(n, t, i) {
        return i != 0 && n != 0 && t != 0;
      }
      function l(n, t) {
        return $(n).length != 0 || $(t).length != 0;
      }
      function t(n) {
        return n.length > 20;
      }
      function i(n) {
        return n.length < 3;
      }
      function r(n) {
        n = n.trim();
        var t = n.length;
        if (n[0] == "_" || n[t - 1] == "_") return !0;
      }
      function u(n) {
        return n.split("_").length > 2;
      }
      function f(n) {
        var t = n.indexOf(" ") != -1,
          i = /^[a-zA-Z0-9_]*$/;
        return (t = t || !n.match(i));
      }
      function a(n, t) {
        return n === t;
      }
      function e(n) {
        return n.length < 8;
      }
      function o(n, t) {
        return n == t;
      }
      function s(n) {
        var i = [
            "roblox123",
            "password",
            "password1",
            "password12",
            "password123",
            "trustno1",
            "iloveyou",
            "princess",
            "abcd1234",
            "qwertyui",
            "qwerty",
            "football",
            "baseball",
            "michael",
            "jennifer",
            "michelle",
            "babygirl",
            "superman",
            "12345678",
            "123456789",
            "1234567890",
            "123123123",
            "69696969",
            "11111111",
            "22222222",
            "33333333",
            "44444444",
            "55555555",
            "66666666",
            "77777777",
            "88888888",
            "99999999",
            "00000000",
          ],
          t;
        for (n = n.toLowerCase(), t = 0; t < i.length; t++)
          if (n === i[t]) return !0;
        return /^[\s]*$/.test(n) ? !0 : !1;
      }
      function v(t) {
        return n(t)
          ? Roblox.Resources.AnimatedSignupFormValidator.invalidEmail
          : "";
      }
      function y(e) {
        return i(e) || t(e)
          ? Roblox.Resources.AnimatedSignupFormValidator.userNameInvalidLength
          : r(e)
            ? Roblox.Resources.AnimatedSignupFormValidator
                .startsOrEndsWithUnderscore
            : u(e)
              ? Roblox.Resources.AnimatedSignupFormValidator
                  .moreThanOneUnderscore
              : n(e)
                ? Roblox.Resources.AnimatedSignupFormValidator.invalidName
                : f(e)
                  ? Roblox.Resources.AnimatedSignupFormValidator.invalidName
                  : "";
      }
      function p(n, t) {
        return e(n)
          ? Roblox.Resources.AnimatedSignupFormValidator.tooShort
          : o(n, t)
            ? Roblox.Resources.AnimatedSignupFormValidator.passwordIsUsername
            : s(n)
              ? Roblox.Resources.AnimatedSignupFormValidator.weakKey
              : "";
      }
      return {
        invalidBirthday: h,
        selectedBirthday: c,
        genderSelected: l,
        usernameTooLong: t,
        usernameTooShort: i,
        usernameRegexInvalid: f,
        usernameStartsOrEndsWithUnderscore: r,
        usernameHasMoreThanOneUnderscore: u,
        getInvalidUsernameMessage: y,
        getInvalidEmailMessage: v,
        passwordIsUsername: o,
        passwordsMatch: a,
        weakPassword: s,
        passwordTooShort: e,
        getInvalidPasswordMessage: p,
      };
    })())); // Signup/Signup.js

  var Roblox = Roblox || {};
  Roblox.Signup =
    Roblox.Signup ||
    (function () {
      var i = { unknown: 1, male: 2, female: 3 },
        r = { signup: 0, captcha: 2 },
        n,
        u = function (t) {
          typeof n == "function" && n(t);
        },
        t = function (n) {
          n.data("params", {});
        },
        f = function (i) {
          (typeof i.onSignupSuccess == "function" && (n = i.onSignupSuccess),
            t($(".signup-or-log-in")));
        },
        e = function (n, t, i) {
          var r = n.data("params");
          (typeof r == "undefined" && (r = {}),
            (r[t] = { name: t, value: i }),
            n.data("params", r));
        };
      return {
        GenderType: i,
        SectionType: r,
        addSignupParam: e,
        onSignupSuccess: u,
        resetParams: t,
        init: f,
      };
    })(); // ~/Generated/js/Roblox_TranslationResources_Feature_LandingResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["Feature.Landing"] = {
      "Description.RobloxOnDeviceParagraphOne":
        "You can access Roblox on all modern smartphones, desktops, Xbox One, Oculus Rift, and soon on Daydream and Cardboard. Roblox adventures are accessible from any device, so players can imagine with their friends regardless of where they are.",
      "Description.RobloxOnDeviceParagraphTwo":
        "You can access Roblox on PC, Mac, iOS, Android, Amazon Devices, and Xbox One. Roblox adventures are accessible from any device, so players can imagine with their friends regardless of where they are.",
      "Description.WhatIsRobloxParagraphOne":
        "Roblox helps power the imagination of people around the world. As the largest growing social platform for play, over 44 million players come to Roblox every month to create adventures, play games, roleplay, and learn with friends. We call it the ‘Imagination Platform’ and believe everyone should have the right to play on it.",
      "Heading.RobloxOnDevice": "Roblox on your Device",
      "Heading.WhatIsRoblox": "What is Roblox?",
      "Heading.WhatIsRobloxParagraphTwo":
        "Roblox is the best place to Imagine with Friends. With the largest user-generated online gaming platform, and over 15 million games created by users, Roblox is the #1 gaming site for kids and teens (comScore). Every day, virtual explorers come to Roblox to create adventures, play games, role play, and learn with their friends in a family-friendly, immersive, 3D environment.",
      "Label.About": "About",
      "Label.GetOnGooglePlay": "Get it on Google Play",
      "Label.Platforms": "Platforms",
      "Label.Play": "Play",
      "Label.RobloxAmazonStore": "Roblox on Amazon Store",
      "Label.RobloxAppStore": "Roblox on App Store",
      "Label.RobloxOnXbox": "Roblox on Xbox Store",
      "Label.RobloxWindowsStore": "Roblox on Windows Store",
    }),
    (Roblox.Lang.LandingResources = Roblox.Lang["Feature.Landing"])); // ~/Generated/js/Roblox_TranslationResources_Authentication_SignUpResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["Authentication.SignUp"] = {
      "Action.CreateAccount": "Create Account",
      "Action.LinkAccount": "Link Account",
      "Action.LogInCapitalized": "Log In",
      "Action.ReturnHome": "Return Home",
      "Action.SignUp": "Sign up",
      "Action.SignupAndSync": "Sign Up & Sync",
      "Action.Submit": "Submit",
      "Description.AccountLinkingWarning":
        "To link to an existing Roblox account, sign in and link them on the account settings page.",
      "Description.ChangeLater": "You can always change this later",
      "Description.NoRealName": "Do not use your real name.",
      "Description.PrivacyPolicy": "Privacy Policy",
      "Description.SignUpAgreement":
        "By clicking {spanStart}Sign Up{spanEnd}, you are agreeing to the {termsOfUseLink} and acknowledging the {privacyPolicyLink}",
      "Description.TermsOfService": "Terms of Service",
      "GuestSignUpAB.Action.SignUp": "Sign Up",
      "Heading.ConnectFacebook": "Connect to Facebook",
      "Heading.CreateAnAccount": "CREATE AN ACCOUNT",
      "Heading.CustomizeYourCharacter": "Customize Your Character",
      "Heading.FacebookSignupAlmostDone": "{firstname}, YOU'RE ALMOST DONE",
      "Heading.LoginHaveFun": "Log in and start having fun!",
      "Heading.SelectStartingAvatar": "Select a Starting Character",
      "Heading.SignupHaveFun": "Sign up and start having fun!",
      "Label.About": "About",
      "Label.AlreadyHaveRobloxAccount": "Already have a Roblox account?",
      "Label.AlreadyRegistered": "Already registered?",
      "Label.Birthday": "Birthday",
      "Label.BirthdayWithColumn": "Birthday:",
      "Label.ConfirmPassword": "Confirm password",
      "Label.Day": "Day",
      "Label.DesiredUsername": "Desired Username:",
      "Label.FacebookNotLinked":
        "Your Facebook account is not linked to any Roblox account. Please sign up for a Roblox account.",
      "Label.FacebookSignupUsername": "Create Roblox username:",
      "Label.Female": "Female",
      "Label.Gender": "Gender",
      "Label.GenderRequired": "Gender is required.",
      "Label.GenderWithColumn": "Gender:",
      "Label.Male": "Male",
      "Label.Month": "Month",
      "Label.Password": "Password",
      "Label.PasswordRequirements": "Password (min length 8)",
      "Label.Platforms": "Platforms",
      "Label.Play": "Play",
      "Label.PleaseAgreeToTerms":
        "Please agree to our Terms of Use and Privacy Policy.",
      "Label.Required": "Required",
      "Label.SignupButtonText": "Sign Up and Play!",
      "Label.SignUpWith": "or sign up with",
      "Label.TermsOfUse": "Terms of Use",
      "Label.Username": "Username",
      "Label.UsernameCharacterLimit":
        "3-20 alphanumeric characters, no spaces.",
      "Label.UsernameHint": "Username (don't use your real name)",
      "Label.UsernameRequirements": "Username (length 3-20, _ is allowed)",
      "Label.Year": "Year",
      "Message.Password.MinLength": "Min length 8",
      "Message.Username.NoRealNameUse": "Don't use your real name",
      "Response.BadUsername": "Username not appropriate for Roblox.",
      "Response.BadUsernameForWeChat": "Username is not appropriate",
      "Response.BirthdayInvalid": "This birthday is invalid.",
      "Response.BirthdayMustBeSetFirst": "Birthday must be set first.",
      "Response.CaptchaMismatchError": "Words do not match.",
      "Response.CaptchaNotEnteredError": "Please fill out the Captcha",
      "Response.FacebookConnectionError":
        "Error while retrieving values from Facebook.",
      "Response.FacebookLoginAge":
        "Facebook login can only be used by users above 13.",
      "Response.GlobalAppAccessError":
        "The account is unable to log in. Please log in to the LuoBu app.",
      "Response.InvalidBirthday": "Invalid birthday.",
      "Response.InvalidEmail": "Invalid email address.",
      "Response.JavaScriptRequired":
        "JavaScript is required to submit this form.",
      "Response.PasswordBadLength":
        "Passwords must be between 8 and 200 characters long.",
      "Response.PasswordComplexity": "Please create a more complex password.",
      "Response.PasswordConfirmation": "Please enter a password confirmation.",
      "Response.PasswordContainsUsernameError":
        "Password shouldn't match username.",
      "Response.PasswordMismatch": "Passwords do not match.",
      "Response.PasswordWrongShort":
        "Passwords must be at least 8 characters long.",
      "Response.PleaseEnterPassword": "Please enter a password.",
      "Response.PleaseEnterUsername": "Please enter a username.",
      "Response.SocialAccountCreationFailed": "Account creation failed",
      "Response.SpaceOrSpecialCharaterError":
        "Spaces and special characters are not allowed.",
      "Response.TooManyAccountsWithSameEmailError":
        "Too many accounts use this email.",
      "Response.UnknownError":
        "Sorry! An unknown error occurred. Please try again later.",
      "Response.UsernameAllowedCharactersError":
        "Usernames may only contain letters, numbers, and _.",
      "Response.UsernameAlreadyInUse": "This username is already in use.",
      "Response.UsernameExplicit":
        "This username is not allowed, please try another.",
      "Response.UsernameInvalid": "Please enter a valid username.",
      "Response.UsernameInvalidCharacters":
        "Only a-z, A-Z, 0-9 and _ are allowed.",
      "Response.UsernameInvalidLength":
        "Usernames can be 3 to 20 characters long.",
      "Response.UsernameInvalidUnderscore":
        "Usernames cannot start or end with _.",
      "Response.UsernameNotAvailable":
        "Username not available. Please try again.",
      "Response.UsernameOrPasswordIncorrect":
        "Your username or password is incorrect.",
      "Response.UsernamePasswordRequired":
        "Username and Password are required.",
      "Response.UsernamePrivateInfo":
        "Username might contain private information.",
      "Response.UsernameRequired": "Username is required.",
      "Response.UsernameTakenTryAgain":
        "This username is already taken! Please try a different one.",
      "Response.UsernameTooManyUnderscores":
        "Usernames can have at most one _.",
    }),
    (Roblox.Lang.SignUpResources = Roblox.Lang["Authentication.SignUp"])); // ~/Generated/js/Roblox_TranslationResources_CommonUI_ControlsResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["CommonUI.Controls"] = {
      "Action.Accept": "Accept",
      "Action.AcceptAll": "Accept All",
      "Action.Agree": "Agree",
      "Action.Allow": "Allow",
      "Action.Back": "Back",
      "Action.Cancel": "Cancel",
      "Action.Collapse": "Collapse",
      "Action.Confirm": "Confirm",
      "Action.Continue": "Continue",
      "Action.Decline": "Decline",
      "Action.DeclineAll": "Decline All",
      "Action.Delete": "Delete",
      "Action.Disable": "Disable",
      "Action.Discard": "Discard",
      "Action.Distribute": "Distribute",
      "Action.Enable": "Enable",
      "Action.IgnoreAll": "Ignore All",
      "Action.No": "No",
      "Action.OK": "OK",
      "Action.Remove": "Remove",
      "Action.Save": "Save",
      "Action.Show": "Show",
      "Action.Submit": "Submit",
      "Action.Yes": "Yes",
      "Birthdaypicker.Label.Date": "Date",
      "Description.UnsavedChange":
        "You have unsaved changes. Do you want to proceed?",
      "Label.April": "April",
      "Label.AprilAbbreviated": "Apr",
      "Label.August": "August",
      "Label.AugustAbbreviated": "Aug",
      "Label.CurrentPage": "Page {currentPage}",
      "Label.Day": "Day",
      "Label.December": "December",
      "Label.DecemberAbbreviated": "Dec",
      "Label.February": "February",
      "Label.FebruaryAbbreviated": "Feb",
      "Label.January": "January",
      "Label.JanuaryAbbreviated": "Jan",
      "Label.July": "July",
      "Label.June": "June",
      "Label.March": "March",
      "Label.MarchAbbreviated": "Mar",
      "Label.May": "May",
      "Label.Month": "Month",
      "Label.Name": "Name",
      "Label.Next": "Next",
      "Label.November": "November",
      "Label.NovemberAbbreviated": "Nov",
      "Label.October": "October",
      "Label.OctoberAbbreviated": "Oct",
      "Label.Previous": "Previous",
      "Label.September": "September",
      "Label.SeptemberAbbreviated": "Sept",
      "Label.Summary": "Summary",
      "Label.UnsavedChanges": "Unsaved Changes",
      "Label.Week": "Week",
      "Label.Year": "Year",
    }),
    (Roblox.Lang.ControlsResources = Roblox.Lang["CommonUI.Controls"])); // ~/Generated/js/Roblox_TranslationResources_Common_CaptchaResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["Common.Captcha"] = {
      "Response.CaptchaErrorFailedToLoad":
        "We need to verify that you are human. Please disable your browser blocker or try a different browser.",
      "Response.CaptchaErrorFailedToVerify":
        "Temporary error. Please try again in a few minutes.",
      "Response.CaptchaErrorVerifyFailed":
        "Temporary error. Please try again in a few minutes",
    }),
    (Roblox.Lang.CaptchaResources = Roblox.Lang["Common.Captcha"])); // ~/Generated/js/Roblox_TranslationResources_CommonUI_FeaturesResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["CommonUI.Features"] = {
      "Action.BackToTop": "Back To Top",
      "Action.BuyAccess": "Buy Access",
      "Action.Cancel": "Cancel",
      "Action.Ok": "Ok",
      "Action.sUpgradeNow": "Upgrade Now",
      ActionsGetPremium: "Get Premium",
      ActionsPremium: "Premium",
      BuyAccessToGameForModal:
        "Would you like to buy access to the Place: {placeName} from {creatorName} for {robux}?",
      "Description.CopyRightMessage":
        "©2018 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.",
      "Description.CopyRightMessageDynamicYear":
        "©{copyrightYear} Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.",
      "Description.UnsupportedLanguage":
        "While some games may use the selected language, it is not fully supported by roblox.com.",
      "Description.UnsupportedLanguageModal":
        "{userLanguage} is currently unavailable on roblox.com. You will see in-game content in {platformLanguage}, and roblox.com has been set to English.",
      "Heading.BuyItem": "Buy Item",
      "Heading.ConfigurePrivateServer": "Configure Private Server",
      "Heading.UnsupportedLanguage": "Unsupported Language",
      "Label.AboutUs": "About Us",
      "Label.AuthenticationError": "Authentication Error",
      "Label.Avatar": "Avatar",
      "Label.AvatarShop": "Avatar Shop",
      "Label.Badges": "Badges",
      "Label.Careers": "Careers",
      "Label.Configure": "Configure",
      "Label.ConfigureGame": "Configure Game",
      "Label.ConfigurePlace": "Configure Place",
      "Label.ConfigurePrivateServer": "Configure VIP Server",
      "Label.ContactUs": "Contact Us",
      "Label.Create": "Create",
      "Label.CreateGame": "Create Game",
      "Label.CreateGroup": "Create Group",
      "Label.CreateUserAd": "Create User Ad",
      "Label.Discover": "Discover",
      "Label.DisplayName": "Display Name",
      "Label.Favorites": "Favorites",
      "Label.Feeds": "My Feed",
      "Label.FindMyFeed": "Looking for My Feed? It's now in side menu",
      "Label.GiftCards": "Gift Cards",
      "Label.Help": "Help",
      "Label.Jobs": "Jobs",
      "Label.Library": "Library",
      "Label.Merch": "Merchandise",
      "Label.OfficialStore": "Official Store",
      "Label.Parents": "Parents",
      "Label.PlaceStatistics": "Place Statistics",
      "Label.Players": "Players",
      "Label.Privacy": "Privacy",
      "Label.RealNameVerified": "Real Name Verified",
      "Label.RedeemRobloxCards": "Redeem Roblox Cards",
      "Label.sAvatar": "Avatar",
      "Label.sBlog": "Blog",
      "Label.sCatalog": "Catalog",
      "Label.sDevelop": "Develop",
      "Label.sEvents": "Events",
      "Label.sForum": "Forum",
      "Label.sFriends": "Friends",
      "Label.sGames": "Games",
      "Label.sGroups": "Groups",
      "Label.sHome": "Home",
      "Label.sInventory": "Inventory",
      "Label.sLogin": "Log In",
      "Label.sMessages": "Messages",
      "Label.sProfile": "Profile",
      "Label.sRobux": "Robux",
      "Label.sSearch": "Search",
      "Label.sSearchPhrase": 'Search "{phrase}" in {location}',
      "Label.sShop": "Shop",
      "Label.sSignUp": "Sign Up",
      "Label.Store": "Store",
      "Label.sTrade": "Trade",
      "Label.Support": "Support",
      "Label.Terms": "Terms",
      "Label.TermsOfUse": "Terms of Use",
      "Label.Thanks": "Thanks",
      "Label.Upgrade": "Upgrade",
    }),
    (Roblox.Lang.FeaturesResources = Roblox.Lang["CommonUI.Features"])); // ~/Generated/js/Roblox_TranslationResources_Feature_AvatarResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["Feature.Avatar"] = {
      "Action.Advanced": "Advanced",
      "Action.Buy": "Buy",
      "Action.Cancel": "Cancel",
      "Action.Close": "Close",
      "Action.Create": "Create",
      "Action.CreateNewOutfit": "Create",
      "Action.Delete": "Delete",
      "Action.Done": "Done",
      "Action.Get": "Get",
      "Action.GetMore": "Get More",
      "Action.OpenRobloxApp": "Open Roblox App",
      "Action.Redraw": "Redraw",
      "Action.Rename": "Rename",
      "Action.RenameOutfit": "Rename",
      "Action.Save": "Save",
      "Action.SeeAll": "See All",
      "Action.ThreeDimensions": "3D",
      "Action.TwoDimensions": "2D",
      "Action.Update": "Update",
      "Action.UserUnderstands": "Got it",
      "Description.AvatarEditorUpsell":
        "To change your look you will need to use the Avatar Editor on the App.",
      "Description.CreateNewCostume":
        "A costume will be created from your avatar's current appearance.",
      "Description.CreateNewOutfit":
        "An outfit will be created from your avatar's current appearance.",
      "Description.RenameCostume": "Choose a new name for your costume.",
      "Description.RenameOutfit": "Choose a new name for your outfit.",
      "Heading.Accessories": "Accessories",
      "Heading.AccessoriesChange": "Accessories Change",
      "Heading.AdvancedOptions": "Advanced Options",
      "Heading.All": "All",
      "Heading.Animations": "Animations",
      "Heading.Appearance": "Appearance",
      "Heading.AvatarPageTitle": "Avatar Editor",
      "Heading.Body": "Body",
      "Heading.BodyParts": "Body Parts",
      "Heading.Clothing": "Clothing",
      "Heading.Costumes": "Costumes",
      "Heading.CreateNewCostume": "Create New Costume",
      "Heading.CreateNewOutfit": "Create New Outfit",
      "Heading.Delete": "Delete",
      "Heading.DeleteCostume": "Delete Costume",
      "Heading.DeleteOutfit": "Delete Outfit",
      "Heading.Emotes": "Emotes",
      "Heading.EquipEmotes": "Equip Emotes",
      "Heading.Outfits": "Outfits",
      "Heading.Packages": "Packages",
      "Heading.Recent": "Recent",
      "Heading.Recommended": "Recommended",
      "Heading.RenameCostume": "Rename Costume",
      "Heading.RenameOutfit": "Rename Outfit",
      "Heading.Scaling": "Scaling",
      "Heading.SkinToneBodyParts": "Skin Tone by Body Parts",
      "Heading.Update": "Update",
      "Heading.UpdateCostume": "Update Costume",
      "Heading.UpdateOutfit": "Update Outfit",
      "Label.All": "All",
      "Label.AskIfLoadingCorrectly": "Avatar isn't loading correctly?",
      "Label.AssetIDPlaceholder": "Asset ID",
      "Label.Back": "Back",
      "Label.BackAccessories": "Back Accessories",
      "Label.BodyType": "Body Type",
      "Label.Climb": "Climb",
      "Label.ClimbAnimations": "Climb Animations",
      "Label.Clothes": "Clothes",
      "Label.Costume": "Costume",
      "Label.DirectionsForPackagePlacement":
        "Packages have been moved to Costumes. Check {startBold}Costumes{rightArrow}Preset Costumes{endBold}",
      "Label.DirectionsForScalingOptions":
        "Scaling options are available under Body category. Check {startBold}Body{rightArrow}Scale{endBold}",
      "label.Emotes": "Emotes",
      "Label.Equip": "Equip",
      "Label.ExploreAvatarShop":
        "Explore the avatar shop to find more clothes!",
      "Label.ExploreCatalog": "Explore the catalog to find more clothes!",
      "Label.Face": "Face",
      "Label.FaceAccessories": "Face Accessories",
      "Label.Faces": "Faces",
      "Label.Fall": "Fall",
      "Label.FallAnimations": "Fall Animations",
      "Label.Free": "Free",
      "Label.Front": "Front",
      "Label.FrontAccessories": "Front Accessories",
      "Label.Gear": "Gear",
      "Label.Hair": "Hair",
      "Label.HairAccessories": "Hair Accessories",
      "Label.Hat": "Hat",
      "Label.HatAccessories": "Hat Accessories",
      "Label.Head": "Head",
      "Label.Heads": "Heads",
      "Label.Height": "Height",
      "Label.Idle": "Idle",
      "Label.IdleAnimations": "Idle Animations",
      "Label.Jump": "Jump",
      "Label.JumpAnimations": "Jump Animations",
      "Label.LeftArm": "Left Arm",
      "Label.LeftArms": "Left Arms",
      "Label.LeftLeg": "Left Leg",
      "Label.LeftLegs": "Left Legs",
      "Label.MyCostumes": "My Costumes",
      "Label.NamePlaceholderCostume": "Name your costume",
      "Label.NamePlaceholderOutfit": "Name your outfit",
      "Label.Neck": "Neck",
      "Label.NeckAccessories": "Neck Accessories",
      "Label.NoResellers": "No resellers",
      "Label.OffSale": "Off sale",
      "Label.Outfit": "Outfit",
      "Label.Pants": "Pants",
      "Label.Parts": "Parts",
      "Label.PresetCostumes": "Preset Costumes",
      "Label.Proportions": "Proportions",
      "Label.RedrawUnavailable": "Avatar redraw is unavailable.",
      "Label.RightArm": "Right Arm",
      "Label.RightArms": "Right Arms",
      "Label.RightLeg": "Right Leg",
      "Label.RightLegs": "Right Legs",
      "Label.Run": "Run",
      "Label.RunAnimations": "Run Animations",
      "Label.Scale": "Scale",
      "Label.Shirts": "Shirts",
      "Label.ShoulderAccessories": "Shoulder Accessories",
      "Label.Shoulders": "Shoulders",
      "Label.SkinTone": "Skin Tone",
      "Label.Swim": "Swim",
      "Label.SwimAnimations": "Swim Animations",
      "Label.SwitchAvatarType":
        "Switch between classic R6 avatar and more expressive next generation R15 avatar",
      "Label.Torso": "Torso",
      "Label.Torsos": "Torsos",
      "Label.TShirts": "T-Shirts",
      "Label.Waist": "Waist",
      "Label.WaistAccessories": "Waist Accessories",
      "Label.Walk": "Walk",
      "Label.WalkAnimations": "Walk Animations",
      "Label.Width": "Width",
      "Label.YourEmotes": "Your Emotes",
      "Message.AccessoriesChange":
        "Are you sure you want to override your current look?",
      "Message.ChooseEmote": "Choose an Emote",
      "Message.ChooseEmoteSlot": "Choose a slot",
      "Message.ChooseEmoteSlotOrEmote": "Choose a slot or an Emote",
      "Message.DefaultClothing":
        "Default clothing has been applied to your avatar - wear something from your clothing.",
      "Message.DeleteOutfit":
        "Are you sure you want to delete this {outfitType}?",
      "Message.DeleteThisCostume":
        "Are you sure you want to delete this costume?",
      "Message.DeleteThisOutfit":
        "Are you sure you want to delete this outfit?",
      "Message.EmotesInstructions":
        'Go to "Animations" > "Emotes" > "Equip Emotes" to equip an emote.',
      "Message.EmptyAssetList": "You don't have any.",
      "Message.EmptyListForItem": "You don't have this item: {itemType}",
      "Message.EmptyListOfCostumes":
        "You don't have any costumes. Try creating some!",
      "Message.EmptyListOfOutfits":
        "You don't have any outfits. Try creating some!",
      "Message.EmptyRecentItems": "You don't have any recent items.",
      "Message.ErrorCreateCostume":
        "Unable to create costume, try again later.",
      "Message.ErrorCreateOutfit": "Unable to create outfit, try again later.",
      "Message.ErrorDeleteEmote": "Failed to delete emote.",
      "Message.ErrorEquipEmote":
        "Failed to equip emote, please try again later.",
      "Message.ErrorLoadCostume": "Failed to load costume.",
      "Message.ErrorLoadEmotes": "Failed to load emotes.",
      "Message.ErrorLoadOutfits": "Failed to load outfits.",
      "Message.ErrorOutfitName":
        "Name can contain letters, numbers, and spaces.",
      "Message.ErrorRenameCostume": "Failed to rename costume.",
      "Message.ErrorRenameOutfit": "Failed to rename outfit.",
      "Message.ErrorUnequipEmote": "Failed to unequip emote.",
      "Message.ErrorUpdateCostume":
        "Costume update failed, please try again later.",
      "Message.ErrorUpdateEmote":
        "Updating emote slot failed, please try again later.",
      "Message.ErrorUpdateOutfit":
        "Outfit update failed, please try again later.",
      "Message.ErrorUpdateWorn": "Error while updating worn items.",
      "Message.ErrorWearCostume": "Failed to wear costume.",
      "Message.ErrorWearOutfit": "Failed to wear outfit.",
      "Message.FailedDeleteCostume": "Failed to delete costume.",
      "Message.FailedDeleteEmote": "Failed to delete emote.",
      "Message.FailedDeleteOutfit": "Failed to delete outfit.",
      "Message.FailedLoadAssets": "Failed to load assets list.",
      "Message.FailedLoadRecent": "Failed to load recent items.",
      "Message.FailedUpdateBodyColor": "Failed to update skin tone.",
      "Message.FailedUpdateDeletedCostume":
        "The costume you tried to update no longer exists.",
      "Message.FailedUpdateDeletedOutfit":
        "The outfit you tried to update no longer exists.",
      "Message.FailedUpdateScales": "Failed to update scales.",
      "Message.FailedUpdateType": "Failed to update avatar type.",
      "Message.FailedWearPackage": "Failed to wear package.",
      "Message.HatLimitTooltip": "You can wear up to 3 hats",
      "Message.InvalidOutfitName":
        "Name must be appropriate and less than 100 characters.",
      "Message.Loading": "Loading...",
      "Message.MissingItemsFromOutfit":
        "Number of items that you don't own in this outfit: {number}",
      "Message.PageUnavailable": "The avatar page is temporarily unavailable.",
      "Message.PresetCostumesDelay":
        "Note: We're doing some housekeeping, so it may take a few minutes for all your costumes to appear. Check again in a bit!",
      "Message.ReachedMaxCostumes":
        "You have reached the maximum number of costumes.",
      "Message.ReachedMaxOutfits":
        "You have reached the maximum number of outfits.",
      "Message.RedirectAvatarSettings":
        "You can set Avatar Settings from your Roblox Studio project. In Roblox Studio, go to Home > Game Settings > Avatar",
      "Message.RedrawFloodchecked":
        "You have redrawn your avatar too many times, please try again later.",
      "Message.RedrawThumbnailFailed": "Failed to redraw thumbnail.",
      "Message.SelectEnableScaling": "Select R15 to enable scaling.",
      "Message.Success": "Success",
      "Message.SuccessCreateCostume": "Created costume",
      "Message.SuccessCreateOutfit": "Created outfit",
      "Message.SuccessDeleteCostume": "Deleted costume",
      "Message.SuccessDeleteOutfit": "Deleted outfit",
      "Message.SuccessEquipEmote": "Equipped Emote",
      "Message.SuccessRenameCostume": "Renamed costume",
      "Message.SuccessRenameOutfit": "Renamed outfit",
      "Message.SuccessSavedAccessories": "Saved accessories",
      "Message.SuccessUnequipEmote": "Unequipped emote",
      "Message.SuccessUpdatedCostume": "Updated costume",
      "Message.SuccessUpdatedOutfit": "Updated outfit",
      "Message.SuccessWoreCostume": "Successfully wore costume",
      "Message.SuccessWoreOutfit": "Successfully wore outfit",
      "Message.UpdateOutfit":
        "Do you want to update this {outfitType1}? This will overwrite the {outfitType2} with your avatar's current appearance.",
      "Message.UpdateThisCostume":
        "Do you want to update this costume? This will overwrite the costume with your avatar's current appearance.",
      "Message.UpdateThisOutfit":
        "Do you want to update this outfit? This will overwrite the outfit with your avatar's current appearance.",
      "Message.Warning": "Warning",
    }),
    (Roblox.Lang.AvatarResources = Roblox.Lang["Feature.Avatar"])); // ~/Generated/js/Roblox_TranslationResources_Feature_LandingAvatarResources_en_us_standard.js

  var Roblox = Roblox || {};
  ((Roblox.Lang = Roblox.Lang || {}),
    (Roblox.Lang["Feature.LandingAvatar"] = {
      "Action.Randomize": "Randomize",
      "Description.ChangeLater": "You can always change this later",
      "Description.JoinGames":
        "You can join millions of games with this character!",
      "Heading.CustomizeYourCharacter": "Customize Your Character",
      "Heading.JoinGamesWithCharacter":
        "You can join millions of games with this character!",
      "Heading.SelectStartingAvatar": "Select a Starting Character",
      "Heading.WatchTrailer": "Watch Trailer",
      "Label.Avatar": "Avatar",
      "Label.Clothing": "Clothing",
      "Label.Head": "Head",
      "Label.SkinTone": "Skin Tone",
    }),
    (Roblox.Lang.LandingAvatarResources =
      Roblox.Lang["Feature.LandingAvatar"])); // common/deviceMeta.js

  var Roblox = Roblox || {};
  Roblox.DeviceMeta = (function () {
    var t = document.querySelector('meta[name="device-meta"]');
    if (t === null) {
      console.debug(
        "Error loading device information from meta tag - please check if meta tag is present",
      );
      return;
    }
    var n = t.dataset || {},
      i = {
        android: "android",
        ios: "ios",
        xbox: "xbox",
        uwp: "uwp",
        amazon: "amazon",
        win32: "win32",
        universalapp: "universalApp",
        unknown: "unknown",
      },
      r = {
        computer: "computer",
        tablet: "tablet",
        phone: "phone",
        console: "console",
      };
    return function () {
      return {
        deviceType: r[n.deviceType] || "",
        appType: i[n.appType] || "",
        isInApp: n.isInApp === "true",
        isDesktop: n.isDesktop === "true",
        isPhone: n.isPhone === "true",
        isTablet: n.isTablet === "true",
        isConsole: n.isConsole === "true",
        isAndroidApp: n.isAndroidApp === "true",
        isIosApp: n.isIosApp === "true",
        isUWPApp: n.isUwpApp === "true",
        isXboxApp: n.isXboxApp === "true",
        isAmazonApp: n.isAmazonApp === "true",
        isWin32App: n.isWin32App === "true",
        isStudio: n.isStudio === "true",
        isIosDevice: n.isIosDevice === "true",
        isAndroidDevice: n.isAndroidDevice === "true",
        isUniversalApp: n.isUniversalApp === "true",
      };
    };
  })(); //Bundle detector

  Roblox &&
    Roblox.BundleDetector &&
    Roblox.BundleDetector.bundleDetected("page");
}
