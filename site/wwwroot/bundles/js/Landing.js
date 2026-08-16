  !(function (t) {
    var n = {};
    function i(a) {
      if (n[a]) return n[a].exports;
      var e = (n[a] = { i: a, l: !1, exports: {} });
      return (t[a].call(e.exports, e, e.exports, i), (e.l = !0), e.exports);
    }
    ((i.m = t),
      (i.c = n),
      (i.d = function (a, e, t) {
        i.o(a, e) || Object.defineProperty(a, e, { enumerable: !0, get: t });
      }),
      (i.r = function (a) {
        ("undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(a, "__esModule", { value: !0 }));
      }),
      (i.t = function (e, a) {
        if ((1 & a && (e = i(e)), 8 & a)) return e;
        if (4 & a && "object" == typeof e && e && e.__esModule) return e;
        var t = Object.create(null);
        if (
          (i.r(t),
          Object.defineProperty(t, "default", { enumerable: !0, value: e }),
          2 & a && "string" != typeof e)
        )
          for (var n in e)
            i.d(
              t,
              n,
              function (a) {
                return e[a];
              }.bind(null, n),
            );
        return t;
      }),
      (i.n = function (a) {
        var e =
          a && a.__esModule
            ? function () {
                return a.default;
              }
            : function () {
                return a;
              };
        return (i.d(e, "a", e), e);
      }),
      (i.o = function (a, e) {
        return Object.prototype.hasOwnProperty.call(a, e);
      }),
      (i.p = ""),
      i((i.s = 55)));
  })([
    function (a, e) {
      a.exports = Roblox;
    },
    function (a, e) {
      function r(a) {
        return a.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function o(a) {
        return a.split("/").pop().replace(".html", "");
      }
      var t = {
        importFilesUnderPath: function (a) {
          a.keys().forEach(a);
        },
        templateCacheGenerator: function (a, e, n, i) {
          return a.module(e, []).run([
            "$templateCache",
            function (t) {
              (n &&
                n.keys().forEach(function (a) {
                  var e = r(o(a));
                  t.put(e, n(a));
                }),
                i &&
                  i.keys().forEach(function (a) {
                    var e = r(o(a));
                    t.put(
                      e,
                      (function (a) {
                        return a.replace(/<\/?script[^>]*>/gi, "");
                      })(i(a)),
                    );
                  }));
            },
          ]);
        },
      };
      a.exports = t;
    },
    function (a, e) {
      a.exports = angular;
    },
    function (a, e, t) {
      "use strict";
      var n = t(0),
        i = t(2),
        r = t
          .n(i)
          .a.module("landingPage", [
            "robloxApp",
            "modal",
            "captchaV2",
            "roblox.formEvents",
          ])
          .config([
            "languageResourceProvider",
            function (a) {
              (a.setLanguageKeysFromFile(n.Lang.LandingResources),
                a.setLanguageKeysFromFile(n.Lang.MessagesResources),
                a.setLanguageKeysFromFile(n.Lang.SignUpResources),
                a.setLanguageKeysFromFile(n.Lang.CaptchaResources),
                a.setLanguageKeysFromFile(n.Lang.ControlsResources),
                a.setLanguageKeysFromFile(n.Lang["CommonUI.Features"]),
                a.setLanguageKeysFromFile(n.Lang.LandingAvatarResources));
            },
          ]);
      e.a = r;
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(2),
        i = t.n(n),
        r = t(1),
        o = (t(56), t(57), t(58), t(59), t(60), t(3));
      (Object(r.importFilesUnderPath)(t(61)),
        Object(r.importFilesUnderPath)(t(65)),
        Object(r.importFilesUnderPath)(t(68)),
        Object(r.importFilesUnderPath)(t(72)));
      var s = t(79),
        l = Object(r.templateCacheGenerator)(i.a, "landingPageAppTemplates", s);
      (i.a.element(function () {
        i.a.bootstrap("#landing-page-container", [o.a.name, l.name]);
      }),
        (e.default = o.a));
    },
    function (a, e, t) {},
    function (a, e, t) {},
    function (a, e, t) {},
    function (a, e, t) {},
    function (a, e, t) {},
    function (a, e, t) {
      var n = {
        "./avatarLandingConstants.js": 62,
        "./landingPageConstants.js": 63,
        "./signupConstants.js": 64,
      };
      function i(a) {
        var e = r(a);
        return t(e);
      }
      function r(a) {
        var e = n[a];
        if (e + 1) return e;
        var t = new Error("Cannot find module '" + a + "'");
        throw ((t.code = "MODULE_NOT_FOUND"), t);
      }
      ((i.keys = function () {
        return Object.keys(n);
      }),
        (i.resolve = r),
        ((a.exports = i).id = 61));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = {
        templates: {
          avatarLandingPage: "avatar-landing",
          youtubeModal: "youtube-modal",
        },
        pages: {
          bodyPage: "bodyPage",
          accessoryPage: "accessoryPage",
          signupPage: "signupPage",
        },
        ftuxAvatarAssetMap: "ftuxAvatarAssetMap",
        tabs: { head: "head", clothing: "clothing", color: "color" },
        urls: {
          avatarImage:
            "https://web.archive.org/web/20200731233919/https://images.rbxcdn.com/",
        },
        avatarIds: {
          preSelectedIds: {
            v1: [
              "rm_rm_rsg_ng_body",
              "rf_rf_rsb_lo_body",
              "sm_sm_gt_po_body",
              "sf_sf_dj_lo_body",
              "nm_nm_ps_bn_body",
              "nf_nf_pt_ng_body",
              "c_cm_gj_do_body",
              "c_cf_dw_bl_body",
            ],
            v2: [
              "classic-m_classic-m_roblox-shirt_pastelOrange_body",
              "classic-f_classic-f_denim-white_nougat_body",
              "neo-m_neo-m_zipup-jacket_darkOrange_body",
              "neo-f_neo-f_purple-top_lightOrange_body",
              "style-m_style-m_guitar-tee_pastelOrange_body",
              "style-f_style-f_denim-jacket_lightOrange_body",
              "rthro-m_rthro-m_rbx-green_nougat_body",
              "rthro-f_rthro-f_rbx-black_lightOrange_body",
            ],
          },
        },
        headMapping: {
          v1: {
            cm: ["cm_head", "cf_head"],
            cf: ["cm_head", "cf_head"],
            rm: ["rm_head", "rf_head"],
            rf: ["rm_head", "rf_head"],
            nm: ["nm_head", "nf_head"],
            nf: ["nm_head", "nf_head"],
            sm: ["sm_head", "sf_head"],
            sf: ["sm_head", "sf_head"],
          },
          v2: {
            "classic-m": ["classic-m_head", "classic-f_head"],
            "classic-f": ["classic-m_head", "classic-f_head"],
            "rthro-m": ["rthro-m_head", "rthro-f_head"],
            "rthro-f": ["rthro-m_head", "rthro-f_head"],
            "style-m": ["style-m_head", "style-f_head"],
            "style-f": ["style-m_head", "style-f_head"],
            "neo-m": ["neo-m_head", "neo-f_head"],
            "neo-f": ["neo-m_head", "neo-f_head"],
          },
        },
        outfitMapping: {
          v1: {
            c: [
              "c_cf_dj_ng_clothing",
              "c_cf_dw_ng_clothing",
              "c_cf_gj_ng_clothing",
              "c_cf_gt_ng_clothing",
              "c_cf_ps_ng_clothing",
              "c_cf_pt_ng_clothing",
              "c_cf_rsb_ng_clothing",
              "c_cf_rsg_ng_clothing",
            ],
            nf: [
              "nf_nf_dj_ng_clothing",
              "nf_nf_dw_ng_clothing",
              "nf_nf_gj_ng_clothing",
              "nf_nf_gt_ng_clothing",
              "nf_nf_ps_ng_clothing",
              "nf_nf_pt_ng_clothing",
              "nf_nf_rsb_ng_clothing",
              "nf_nf_rsg_ng_clothing",
            ],
            nm: [
              "nm_nm_dj_ng_clothing",
              "nm_nm_dw_ng_clothing",
              "nm_nm_gj_ng_clothing",
              "nm_nm_gt_ng_clothing",
              "nm_nm_ps_ng_clothing",
              "nm_nm_pt_ng_clothing",
              "nm_nm_rsb_ng_clothing",
              "nm_nm_rsg_ng_clothing",
            ],
            rf: [
              "rf_rf_dj_ng_clothing",
              "rf_rf_dw_ng_clothing",
              "rf_rf_gj_ng_clothing",
              "rf_rf_gt_ng_clothing",
              "rf_rf_ps_ng_clothing",
              "rf_rf_pt_ng_clothing",
              "rf_rf_rsg_ng_clothing",
            ],
            rm: [
              "rm_rf_dj_ng_clothing",
              "rm_rf_dw_ng_clothing",
              "rm_rf_gj_ng_clothing",
              "rm_rf_gt_ng_clothing",
              "rm_rf_ps_ng_clothing",
              "rm_rf_pt_ng_clothing",
              "rm_rf_rsg_ng_clothing",
            ],
            sf: [
              "sf_sf_dj_ng_clothing",
              "sf_sf_dw_ng_clothing",
              "sf_sf_gj_ng_clothing",
              "sf_sf_gt_ng_clothing",
              "sf_sf_ps_ng_clothing",
              "sf_sf_pt_ng_clothing",
              "sf_sf_rsb_ng_clothing",
              "sf_sf_rsg_ng_clothing",
            ],
            sm: [
              "sm_sm_dj_ng_clothing",
              "sm_sm_dw_ng_clothing",
              "sm_sm_gj_ng_clothing",
              "sm_sm_gt_ng_clothing",
              "sm_sm_ps_ng_clothing",
              "sm_sm_pt_ng_clothing",
              "sm_sm_rsb_ng_clothing",
              "sm_sm_rsg_ng_clothing",
            ],
          },
          v2: {
            "classic-f": [
              "classic-f_classic-f_denim-jacket_nougat_clothing",
              "classic-f_classic-f_denim-white_nougat_clothing",
              "classic-f_classic-f_guitar-tee_nougat_clothing",
              "classic-f_classic-f_purple-top_nougat_clothing",
              "classic-f_classic-f_rbx-black_nougat_clothing",
              "classic-f_classic-f_rbx-green_nougat_clothing",
              "classic-f_classic-f_roblox-shirt_nougat_clothing",
              "classic-f_classic-f_zipup-jacket_nougat_clothing",
            ],
            "classic-m": [
              "classic-m_classic-m_denim-jacket_nougat_clothing",
              "classic-m_classic-m_denim-white_nougat_clothing",
              "classic-m_classic-m_guitar-tee_nougat_clothing",
              "classic-m_classic-m_purple-top_nougat_clothing",
              "classic-m_classic-m_rbx-black_nougat_clothing",
              "classic-m_classic-m_rbx-green_nougat_clothing",
              "classic-m_classic-m_roblox-shirt_nougat_clothing",
              "classic-m_classic-m_zipup-jacket_nougat_clothing",
            ],
            "neo-f": [
              "neo-f_neo-f_denim-jacket_nougat_clothing",
              "neo-f_neo-f_denim-white_nougat_clothing",
              "neo-f_neo-f_guitar-tee_nougat_clothing",
              "neo-f_neo-f_purple-top_nougat_clothing",
              "neo-f_neo-f_rbx-black_nougat_clothing",
              "neo-f_neo-f_rbx-green_nougat_clothing",
              "neo-f_neo-f_roblox-shirt_nougat_clothing",
              "neo-f_neo-f_zipup-jacket_nougat_clothing",
            ],
            "neo-m": [
              "neo-m_neo-m_denim-jacket_nougat_clothing",
              "neo-m_neo-m_denim-white_nougat_clothing",
              "neo-m_neo-m_guitar-tee_nougat_clothing",
              "neo-m_neo-m_purple-top_nougat_clothing",
              "neo-m_neo-m_rbx-black_nougat_clothing",
              "neo-m_neo-m_rbx-green_nougat_clothing",
              "neo-m_neo-m_roblox-shirt_nougat_clothing",
              "neo-m_neo-m_zipup-jacket_nougat_clothing",
            ],
            "rthro-f": [
              "rthro-f_rthro-f_denim-jacket_nougat_clothing",
              "rthro-f_rthro-f_denim-white_nougat_clothing",
              "rthro-f_rthro-f_guitar-tee_nougat_clothing",
              "rthro-f_rthro-f_purple-top_nougat_clothing",
              "rthro-f_rthro-f_rbx-black_nougat_clothing",
              "rthro-f_rthro-f_roblox-shirt_nougat_clothing",
              "rthro-f_rthro-f_zipup-jacket_nougat_clothing",
            ],
            "rthro-m": [
              "rthro-m_rthro-m_denim-jacket_nougat_clothing",
              "rthro-m_rthro-m_denim-white_nougat_clothing",
              "rthro-m_rthro-m_guitar-tee_nougat_clothing",
              "rthro-m_rthro-m_purple-top_nougat_clothing",
              "rthro-m_rthro-m_rbx-black_nougat_clothing",
              "rthro-m_rthro-m_roblox-shirt_nougat_clothing",
              "rthro-m_rthro-m_zipup-jacket_nougat_clothing",
            ],
            "style-f": [
              "style-f_style-f_denim-jacket_nougat_clothing",
              "style-f_style-f_denim-white_nougat_clothing",
              "style-f_style-f_guitar-tee_nougat_clothing",
              "style-f_style-f_purple-top_nougat_clothing",
              "style-f_style-f_rbx-black_nougat_clothing",
              "style-f_style-f_roblox-shirt_nougat_clothing",
              "style-f_style-f_zipup-jacket_nougat_clothing",
            ],
            "style-m": [
              "style-m_style-m_denim-jacket_nougat_clothing",
              "style-m_style-m_denim-white_nougat_clothing",
              "style-m_style-m_guitar-tee_nougat_clothing",
              "style-m_style-m_purple-top_nougat_clothing",
              "style-m_style-m_rbx-black_nougat_clothing",
              "style-m_style-m_rbx-green_nougat_clothing",
              "style-m_style-m_roblox-shirt_nougat_clothing",
              "style-m_style-m_zipup-jacket_nougat_clothing",
            ],
          },
        },
        colorMapping: {
          v1: [
            "bl_color",
            "po_color",
            "bn_color",
            "do_color",
            "lo_color",
            "ng_color",
          ],
          v2: [
            "nougat_color",
            "pastelOrange_color",
            "lightOrange_color",
            "darkOrange_color",
          ],
        },
        events: {
          context: "avatarSignupScreen",
          avatarSelection: "avatarSelection",
          continue: "continue",
          signup: "signup",
          buttonClick: "buttonClick",
          modalAction: "modalAction",
          videoPreview: "videoPreview",
          dismiss: "dismiss",
        },
      };
      (t(3).a.constant("avatarLandingConstants", n), (e.default = n));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = {
        templates: { landingPage: "landing" },
        urls: {
          login: "login/",
          metadata: "/v1/metadata",
          privacy: "/info/privacy",
        },
        urlQueryNames: { locale: "locale" },
        context: "Multiverse",
        mainShowSignupButtonEvent: "mainShowSignup",
        topShowSignupButtonEvent: "topShowSignup",
        hideSignupButtonEvent: "hideSignup",
        appButtonClickEvent: "AppLink",
        resolutionEvent: "resolutionMetadata",
        ftuxAvatarTestAvatarV1ContextV1Variation: 2,
        ftuxAvatarTestAvatarV2ContextV1Variation: 3,
        ftuxAvatarTestAvatarV1ContextV2Variation: 4,
        ftuxAvatarTestAvatarV2ContextV2Variation: 5,
      };
      (t(3).a.constant("landingPageConstants", n), (e.default = n));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        i = t(0),
        r = {
          urls: {
            signUpApi: "/v2/signup",
            metaData: "/landing/metadata",
            weChatSignUp: "/v2/wechat/signup",
            termsOfUse: "/info/terms",
            privacy: "/info/privacy",
            gamesNewUser: "/games?nu=true",
            homePage: "/home?nu=true",
          },
          genderType: { unknown: 1, male: 2, female: 3 },
          inputType: { password: "password", text: "text" },
          urlQueryNames: { locale: "locale" },
          maxSignUpAge: 100,
          context: "Multiverse",
          maxNumberOfDates: 31,
          anchorOpeningTag: '<a target="_blank" href="',
          anchorClosingTag: "</a>",
          localeParamName: "?locale=",
          nonLeapYear: "2014",
          newUserParam: "nu=true",
          apiUrls: {
            enrollAbtestingApi: {
              url: i.EnvironmentUrls.abtestingApiSite + "/v1/enrollments",
              retryable: !1,
              withCredentials: !0,
            },
          },
          abtestingRequest: { subjectType: "User" },
          abtestingResponse: {
            status: { enrolled: "Enrolled" },
            landingTohomePageVariation: 2,
          },
          counters: {
            prefix: "WebsiteSignUp_",
            firstAttempt: "FirstAttempt",
            attempt: "Attempt",
            success: "Success",
            captcha: "Captcha",
            tooManyAttempts: "TooManyAttempts",
            genderInvalid: "GenderInvalid",
            passwordInvalid: "PasswordInvalid",
            usernameInvalid: "UsernameInvalid",
            usernameTaken: "UsernameTaken",
            unknownError: "UnknownError",
          },
          signUpSubmitButtonName: "signupSubmit",
          weChatSignUpSubmitButtonName: "weChatSignupSubmit",
          birthdayPicker: {
            year: {
              id: "YearDropdown",
              class: "year",
              name: "birthdayYear",
              type: "year",
            },
            month: {
              id: "MonthDropdown",
              class: "month",
              name: "birthdayMonth",
              type: "month",
            },
            day: {
              id: "DayDropdown",
              class: "day",
              name: "birthdayDay",
              type: "day",
            },
          },
          defaultDateOrdering: { month: 0, day: 1, year: 2 },
          defaultDateParts: {
            0: {
              options: [{ label: "Month", value: null }],
              id: "MonthDropdown",
              class: "month",
              name: "birthdayMonth",
              type: "month",
            },
            1: {
              options: [{ label: "Day", value: null }],
              id: "DayDropdown",
              class: "day",
              name: "birthdayDay",
              type: "day",
            },
            2: {
              options: [{ label: "Year", value: null }],
              id: "YearDropdown",
              class: "year",
              name: "birthdayYear",
              type: "year",
            },
          },
        };
      (n.a.constant("signupConstants", r), (e.default = r));
    },
    function (a, e, t) {
      var n = { "./landingPageService.js": 66, "./signupService.js": 67 };
      function i(a) {
        var e = r(a);
        return t(e);
      }
      function r(a) {
        var e = n[a];
        if (e + 1) return e;
        var t = new Error("Cannot find module '" + a + "'");
        throw ((t.code = "MODULE_NOT_FOUND"), t);
      }
      ((i.keys = function () {
        return Object.keys(n);
      }),
        (i.resolve = r),
        ((a.exports = i).id = 65));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        i = t(0);
      function r(e, t) {
        return {
          getMetadata: function () {
            var a = { url: i.EnvironmentUrls.authApi + t.urls.metadata };
            return e.httpGet(a);
          },
        };
      }
      ((r.$inject = ["httpService", "landingPageConstants"]),
        n.a.factory("landingPageService", r),
        (e.default = r));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        r = t(0);
      function i(n, i) {
        return {
          signup: function (a, e) {
            var t = { url: e || r.EnvironmentUrls.authApi + i.urls.signUpApi };
            return n.httpPost(t, a, !0);
          },
          getMetadata: function () {
            var a = { url: r.EnvironmentUrls.authAppSite + i.urls.metaData };
            return n.httpGet(a);
          },
        };
      }
      ((i.$inject = ["httpService", "signupConstants"]),
        n.a.factory("signupService", i),
        (e.default = i));
    },
    function (a, e, t) {
      var n = {
        "./avatarLandingPageController.js": 69,
        "./landingPageController.js": 70,
        "./signupController.js": 71,
      };
      function i(a) {
        var e = r(a);
        return t(e);
      }
      function r(a) {
        var e = n[a];
        if (e + 1) return e;
        var t = new Error("Cannot find module '" + a + "'");
        throw ((t.code = "MODULE_NOT_FOUND"), t);
      }
      ((i.keys = function () {
        return Object.keys(n);
      }),
        (i.resolve = r),
        ((a.exports = i).id = 68));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3);
      t(0);
      function o(a, e, t) {
        return (
          e in a
            ? Object.defineProperty(a, e, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (a[e] = t),
          a
        );
      }
      function i(d, n, a, i, e) {
        var t;
        ((d.landingLayout.displayAvatarSignup = !0),
          (d.avatarSignupLayout = {
            currentLayout: n.pages.bodyPage,
            layouts: {
              bodyPage: n.pages.bodyPage,
              accessoryPage: n.pages.accessoryPage,
              signupPage: n.pages.signupPage,
            },
            currentTab: n.tabs.clothing,
            tabs: {
              head: n.tabs.head,
              clothing: n.tabs.clothing,
              color: n.tabs.color,
            },
          }));
        var s =
          (o(
            (t = { body_clicks: 0 }),
            "tab_".concat(n.tabs.head, "_clicks"),
            0,
          ),
          o(t, "tab_".concat(n.tabs.clothing, "_clicks"), 0),
          o(t, "tab_".concat(n.tabs.color, "_clicks"), 0),
          o(t, "randomize_clicks", 0),
          o(t, "head_clicks", 0),
          o(t, "clothing_clicks", 0),
          o(t, "color_clicks", 0),
          t);
        function l() {
          var a = d.avatarSignupMetadata.displayAvatarV2 ? "v5" : "v3";
          d.avatarSignupMetadata.avatarUrl = ""
            .concat(n.urls.avatarImage)
            .concat(d.avatarSignupMetadata.bodyId, "_")
            .concat(d.avatarSignupMetadata.headId, "_")
            .concat(d.avatarSignupMetadata.clothingId, "_")
            .concat(d.avatarSignupMetadata.colorId, "_")
            .concat(a, ".png");
        }
        function u(a, e) {
          for (var t in a) if (Object.keys(a[t]).includes(e)) return a[t][e];
          return !1;
        }
        function c(a) {
          return a[Math.floor(Math.random() * a.length)];
        }
        function g(a) {
          var e = [];
          return (
            a.forEach(function (a) {
              e = e.concat(Object.keys(a));
            }),
            e
          );
        }
        function p() {
          d.avatarSignupMetadata.displayAvatarV2
            ? ((d.clothings = r(
                n.outfitMapping.v2[d.avatarSignupMetadata.bodyId],
              )),
              (d.heads = r(n.headMapping.v2[d.avatarSignupMetadata.headId])),
              (d.colors = r(n.colorMapping.v2)))
            : ((d.clothings = r(
                n.outfitMapping.v1[d.avatarSignupMetadata.bodyId],
              )),
              (d.heads = r(n.headMapping.v1[d.avatarSignupMetadata.headId])),
              (d.colors = r(n.colorMapping.v1)));
        }
        function r(a) {
          var n = [],
            i = d.avatarSignupMetadata.headId,
            r = d.avatarSignupMetadata.clothingId,
            o = d.avatarSignupMetadata.colorId;
          return (
            angular.forEach(a, function (a, e) {
              var t = !1;
              (a.endsWith("head") && (t = a.startsWith(i)),
                a.endsWith("clothing") && (t = a.split("_")[2] === r),
                a.endsWith("color") && (t = a.startsWith(o)),
                n.push({ name: a, checked: t }));
            }),
            n
          );
        }
        ((d.ftuxAvatarAssetMap = {}),
          (d.handleYoutubeClick = function () {
            var a = e.open({
              animation: !1,
              size: "youtube-large",
              templateUrl: n.templates.youtubeModal,
            });
            (a.opened.then(function () {
              var a = { btn: n.events.videoPreview };
              i.sendEventWithTarget(n.events.buttonClick, n.events.context, a);
            }),
              a.result.then(
                function () {},
                function () {
                  var a = { aType: n.events.dismiss };
                  i.sendEventWithTarget(
                    n.events.modalAction,
                    n.events.context,
                    a,
                  );
                },
              ));
          }),
          (d.backClick = function (a) {
            a === n.pages.accessoryPage
              ? (d.avatarSignupLayout.currentLayout = n.pages.bodyPage)
              : a === n.pages.signupPage &&
                (d.avatarSignupLayout.currentLayout = n.pages.accessoryPage);
          }),
          (d.continueClick = function () {
            ((d.avatarSignupLayout.currentLayout = n.pages.signupPage),
              (function () {
                var a = d.avatarSignupMetadata.colorId,
                  e = d.avatarSignupMetadata.headId,
                  t = d.avatarSignupMetadata.clothingId,
                  n = d.avatarSignupMetadata.bodyId,
                  i = [],
                  r = u(d.ftuxAvatarAssetMap.bodies, n) || {},
                  o = u(d.ftuxAvatarAssetMap.heads, e) || [],
                  s = u(d.ftuxAvatarAssetMap.clothing, t) || [];
                i = i.concat(r.assetIds, o, s);
                var l = u(d.ftuxAvatarAssetMap.bodyColors, a) || [],
                  c = {
                    assetIds: i,
                    bodyColorId: l,
                    bodyTypeScale: r.scale.bodyType,
                    headScale: r.scale.head,
                    heightScale: r.scale.height,
                    widthScale: r.scale.width,
                    proportionScale: r.scale.proportion,
                  };
                Object.assign(d.avatarSignupMetadata, c);
              })());
            var a = { btn: n.events.continue };
            (Object.assign(a, s),
              i.sendEventWithTarget(n.events.buttonClick, n.events.context, a));
          }),
          (d.avatarIds = d.avatarSignupMetadata.displayAvatarV2
            ? n.avatarIds.preSelectedIds.v2
            : n.avatarIds.preSelectedIds.v1),
          (d.avatarIds = (function () {
            for (var a = [0, 2, 4, 6], e = a.length - 1; 0 < e; e--) {
              var t = Math.floor(Math.random() * (e + 1)),
                n = [a[t], a[e]];
              ((a[e] = n[0]), (a[t] = n[1]));
            }
            for (var i = d.avatarIds, r = [], o = 0, s = a; o < s.length; o++) {
              var l = s[o];
              (r.push(i[l]), r.push(i[l + 1]));
            }
            return r;
          })()),
          (d.handleBodySelect = function (a, e) {
            ((d.avatarSignupLayout.currentLayout = n.pages.accessoryPage),
              (d.avatarSignupLayout.currentTab = n.tabs.clothing));
            var t = a.split("_");
            ((d.avatarSignupMetadata.bodyId = t[0]),
              (d.avatarSignupMetadata.headId = t[1]),
              (d.avatarSignupMetadata.clothingId = t[2]),
              (d.avatarSignupMetadata.colorId = t[3]),
              l(),
              p(),
              s.body_clicks++,
              1 === s.body_clicks &&
                i.sendEventWithTarget(n.events.buttonClick, n.events.context, {
                  btn: n.events.avatarSelection,
                  body: d.avatarSignupMetadata.bodyId,
                  clothing: d.avatarSignupMetadata.clothingId,
                  head: d.avatarSignupMetadata.headId,
                  color: d.avatarSignupMetadata.colorId,
                  index: e,
                }));
          }),
          (d.handleTabClick = function (a) {
            d.avatarSignupLayout.currentTab != a &&
              ((d.avatarSignupLayout.currentTab = a),
              s["tab_".concat(a, "_clicks")]++);
          }),
          (d.handlePartSelect = function (t, a) {
            ((d.landingLayout.thumbnailLoaded = !1),
              angular.forEach(a, function (a, e) {
                t != e
                  ? (a.checked = !1)
                  : ((a.checked = !0),
                    (function (a) {
                      a.endsWith(n.tabs.head) &&
                        (d.avatarSignupMetadata.headId = a.replace(
                          "_head",
                          "",
                        ));
                      a.endsWith(n.tabs.clothing) &&
                        (d.avatarSignupMetadata.clothingId = a.split("_")[2]);
                      a.endsWith(n.tabs.color) &&
                        (d.avatarSignupMetadata.colorId = a.split("_")[0]);
                      l();
                    })(a.name));
              }),
              d.avatarSignupLayout.currentTab === n.tabs.head
                ? s.head_clicks++
                : d.avatarSignupLayout.currentTab === n.tabs.clothing
                  ? s.clothing_clicks++
                  : d.avatarSignupLayout.currentTab === n.tabs.color &&
                    s.color_clicks++);
          }),
          (d.handleRandomize = function () {
            var a = g(d.ftuxAvatarAssetMap.bodies),
              e = g(d.ftuxAvatarAssetMap.clothing),
              t = g(d.ftuxAvatarAssetMap.bodyColors),
              n = c(a),
              i = d.avatarSignupMetadata.displayAvatarV2
                ? n
                : n.charAt(0) + c(["m", "f"]),
              r = c(e),
              o = c(t);
            ((d.avatarSignupMetadata.headId = i),
              (d.avatarSignupMetadata.bodyId = n),
              (d.avatarSignupMetadata.clothingId = r),
              (d.avatarSignupMetadata.colorId = o),
              l(),
              p(),
              s.randomize_clicks++);
          }),
          a.getMetadata().then(function (a) {
            if (a) {
              var e = d.avatarSignupMetadata.displayAvatarV2 ? "v2" : "v1";
              ((d.ftuxAvatarAssetMap = JSON.parse(a[n.ftuxAvatarAssetMap])[e]),
                console.log("assetMap: ", d.ftuxAvatarAssetMap));
            }
          }));
      }
      ((i.$inject = [
        "$scope",
        "avatarLandingConstants",
        "landingPageService",
        "eventStreamService",
        "$uibModal",
      ]),
        n.a.controller("avatarLandingPageController", i),
        (e.default = i));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        i = t(0);
      function r(a, e, t) {
        ((a.landingLayout = {
          googlePlayStoreLink: i.EnvironmentUrls.googlePlayStoreLink,
          amazonStoreLink: i.EnvironmentUrls.amazonStoreLink,
          appStoreLink: i.EnvironmentUrls.appStoreLink,
          windowsStoreLink: i.EnvironmentUrls.windowsStoreLink,
          xboxStoreLink: i.EnvironmentUrls.xboxStoreLink,
          loginLink: i.EnvironmentUrls.websiteUrl + t.urls.login,
        }),
          (a.appClick = function (a) {
            !(function (a) {
              i.FormEvents && i.FormEvents.SendInteractionClick(t.context, a);
            })(a + t.appButtonClickEvent);
          }),
          (a.avatarSignupMetadata = {}),
          (a.displayAvatarSignup = !1),
          a.useExperimentationPlatformForFtux
            ? ((a.displayAvatarSignup = a.isFtuxAvatarEnabled),
              (a.avatarSignupMetadata.displayAvatarV2 =
                2 === a.ftuxAvatarVersion),
              (a.avatarSignupMetadata.displayContextV2 =
                2 === a.ftuxContextVersion))
            : ((a.displayAvatarSignup = 2 <= a.abTestVariation),
              (a.avatarSignupMetadata.abTestVariation = a.abTestVariation),
              (a.avatarSignupMetadata.displayAvatarV2 =
                4 === a.abTestVariation || 5 === a.abTestVariation),
              (a.avatarSignupMetadata.displayContextV2 =
                3 === a.abTestVariation || 5 === a.abTestVariation)),
          (function () {
            if (i.EventStream && i.EventStream.SendEvent) {
              var a = {
                screenResolution:
                  e.screen.width * e.devicePixelRatio +
                  "x" +
                  e.screen.height * e.devicePixelRatio,
                actualScreenSize: e.screen.width + "x" + e.screen.height,
                zoomRatio: e.devicePixelRatio,
                windowSize: e.innerWidth + "x" + e.innerHeight,
              };
              i.EventStream.SendEvent(t.resolutionEvent, t.context, a);
            }
          })());
      }
      ((r.$inject = ["$scope", "$window", "landingPageConstants"]),
        n.a.controller("landingPageController", r),
        (e.default = r));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        _ = t(0);
      function i(a, o, e, t, s, n, i, l, r, c, d, u) {
        ((o.signup = {}),
          (o.layout = {
            context: l.context,
            passwordInputType: l.inputType.password,
            isFirstSignUpSubmit: !0,
            orderedBirthdayParts: {
              parts: l.defaultDateParts,
              typeOrder: l.defaultDateOrdering,
            },
            isSubmitting: !1,
          }),
          (o.signUpParams = o.signUpParams || {}));
        var g = new _.Intl();
        function p(a, e, t) {
          var n = o.layout.orderedBirthdayParts.typeOrder[a];
          o.layout.orderedBirthdayParts.parts[n] = {
            options: e,
            idName: l.birthdayPicker[a].id,
            className: l.birthdayPicker[a].class,
            birthdayName: l.birthdayPicker[a].name,
            placeholder: t,
          };
        }
        function v(a, e) {
          return e ? a + l.localeParamName + e : a;
        }
        function m() {
          var a = _.UrlParser
            ? _.UrlParser.getParameterValueByName(l.urlQueryNames.locale)
            : null;
          return a ? encodeURIComponent(a) : null;
        }
        ((o.genderType = l.genderType),
          (o.signup.gender = o.genderType.unknown),
          (o.captchaActivated = !1),
          (o.captchaActionTypes = r.captchaActionTypes),
          (o.init = function () {
            ((o.isAsianBirthdayUsed = g && g.isAsianLanguage()),
              i
                .getMetadata()
                .then(
                  function (a) {
                    ((o.isBedev2CaptchaForWebSignUpEnabled =
                      a.IsBEDEV2CaptchaForWebSignUpEnabled),
                      (o.layout.orderedBirthdayParts.typeOrder = new _.Intl()
                        .getDateTimeFormatter()
                        .getOrderedDateParts()));
                  },
                  function (a) {
                    e.debug("getMetadata failed: ", a);
                  },
                )
                .finally(function () {
                  (_.Resources &&
                    (_.Resources.AnimatedSignupFormValidator = {
                      maxValid: c.get(
                        "Response.TooManyAccountsWithSameEmailError",
                      ),
                      invalidEmail: c.get("Response.InvalidEmail"),
                      invalidBirthday: c.get("Response.InvalidBirthday"),
                      loginFieldsRequired: c.get(
                        "Response.UsernamePasswordRequired",
                      ),
                      loginFieldsIncorrect: c.get(
                        "Response.UsernameOrPasswordIncorrect",
                      ),
                      doesntMatch: c.get("Response.PasswordMismatch"),
                      passwordIsUsername: c.get(
                        "Response.PasswordContainsUsernameError",
                      ),
                      requiredField: c.get("Label.Required"),
                      tooShort: c.get("Response.PasswordWrongShort"),
                      weakKey: c.get("Response.PasswordComplexity"),
                      invalidCharacters: c.get(
                        "Response.SpaceOrSpecialCharaterError",
                      ),
                      invalidName: c.get(
                        "Response.UsernameAllowedCharactersError",
                      ),
                      cantBeUsed: c.get("Response.BadUsername"),
                      cantBeUsedPii: c.get("Response.UsernamePrivateInfo"),
                      alreadyTaken: c.get("Response.UsernameAlreadyInUse"),
                      userNameInvalidLength: c.get(
                        "Response.UsernameInvalidLength",
                      ),
                      startsOrEndsWithUnderscore: c.get(
                        "Response.UsernameInvalidUnderscore",
                      ),
                      moreThanOneUnderscore: c.get(
                        "Response.UsernameTooManyUnderscores",
                      ),
                      birthdayRequired: c.get(
                        "Response.BirthdayMustBeSetFirst",
                      ),
                      passwordRequired: c.get("Response.PleaseEnterPassword"),
                      usernameRequired: c.get("Response.PleaseEnterUsername"),
                      passwordConfirmationRequired: c.get(
                        "Response.PasswordConfirmation",
                      ),
                      usernameNoRealNameUse: c.get(
                        "Message.Username.NoRealNameUse",
                      ),
                      passwordMinLength: c.get("Message.Password.MinLength"),
                      usernameNotAvailable: c.get(
                        "Response.UsernameNotAvailable",
                      ),
                    }),
                    (function () {
                      o.layout.months = [
                        { value: "Jan", label: c.get("Label.January") },
                        { value: "Feb", label: c.get("Label.February") },
                        { value: "Mar", label: c.get("Label.March") },
                        { value: "Apr", label: c.get("Label.April") },
                        { value: "May", label: c.get("Label.May") },
                        { value: "Jun", label: c.get("Label.June") },
                        { value: "Jul", label: c.get("Label.July") },
                        { value: "Aug", label: c.get("Label.August") },
                        { value: "Sep", label: c.get("Label.September") },
                        { value: "Oct", label: c.get("Label.October") },
                        { value: "Nov", label: c.get("Label.November") },
                        { value: "Dec", label: c.get("Label.December") },
                      ];
                      var a = c.get("Label.Month");
                      p("month", o.layout.months, a);
                    })(),
                    (function () {
                      for (
                        var a = [], e = l.maxNumberOfDates, t = 1;
                        t <= e;
                        t++
                      ) {
                        var n = ("0" + t).slice(-2),
                          i = {
                            day: n,
                            value: n,
                            label: o.isAsianBirthdayUsed
                              ? g.getFormattedDateString(n, c.get("Label.Day"))
                              : n,
                          };
                        a.push(i);
                      }
                      p("day", (o.layout.dates = a), c.get("Label.Day"));
                    })(),
                    (function () {
                      for (
                        var a = [],
                          e = new Date().getFullYear(),
                          t = e - l.maxSignUpAge,
                          n = e;
                        t < n;
                        n--
                      ) {
                        var i = {
                          year: n,
                          value: n,
                          label: o.isAsianBirthdayUsed
                            ? g.getFormattedDateString(n, c.get("Label.Year"))
                            : n,
                        };
                        a.push(i);
                      }
                      p("year", (o.layout.years = a), c.get("Label.Year"));
                    })());
                  var a = m(),
                    e = _.EnvironmentUrls.websiteUrl + l.urls.termsOfUse,
                    t = _.EnvironmentUrls.websiteUrl + l.urls.privacy,
                    n = v(e, a),
                    i = v(t, a);
                  ((o.layout.termsOfUseLinkElement =
                    l.anchorOpeningTag +
                    n +
                    '">' +
                    c.get("Label.TermsOfUse") +
                    l.anchorClosingTag),
                    (o.layout.privacyLinkElement =
                      l.anchorOpeningTag +
                      i +
                      '">' +
                      c.get("Description.PrivacyPolicy") +
                      l.anchorClosingTag));
                }));
          }),
          (o.handleCaptchaError = function (a) {
            var e;
            switch (a) {
              case r.errorCodes.internal.failedToLoadProviderScript:
                e = c.get("Response.CaptchaErrorFailedToLoad");
                break;
              default:
                e = c.get("Response.CaptchaErrorFailedToVerify");
            }
            t(function () {
              ((o.isSubmitting = !1),
                (o.signupForm.$generalError = !0),
                (o.signupForm.$generalErrorText = e));
            }, 0);
          }),
          (o.handleCaptchaDismiss = function () {
            o.layout.isSubmitting = !1;
          }),
          (o.handleCaptchaSuccess = function (a) {
            ((o.captchaActivated = !1), o.submitSignup(!1, a));
          }),
          (o.setGender = function (a, e, t) {
            (a && a.preventDefault(),
              o.layout.isGenderDisabled ||
                ((o.signup.gender = e), (o.layout.isGenderDisabled = t)));
          }),
          (o.isGenderInvalid = function () {
            return o.badSubmit && !o.isGenderValid();
          }),
          (o.isGenderValid = function () {
            return (
              o.signup.gender === o.genderType.male ||
              o.signup.gender === o.genderType.female
            );
          }),
          (o.getGenderInvalidMessage = function () {
            return o.isGenderInvalid() ? c.get("Label.GenderRequired") : "";
          }),
          (o.isBirthdayFormDirty = function () {
            return (
              !!(
                o.signupForm.birthdayMonth &&
                o.signupForm.birthdayDay &&
                o.signupForm.birthdayYear
              ) &&
              o.signupForm.birthdayMonth.$dirty &&
              o.signupForm.birthdayDay.$dirty &&
              o.signupForm.birthdayYear.$dirty &&
              null !== o.signupForm.birthdayMonth.$modelValue &&
              null !== o.signupForm.birthdayDay.$modelValue &&
              null !== o.signupForm.birthdayYear.$modelValue
            );
          }),
          (o.isBirthdayInvalid = function () {
            return (
              (o.badSubmit || o.isBirthdayFormDirty()) &&
              (!o.isValidBirthday(o.signup.birthdayDay) ||
                o.signupForm.birthdayYear.$invalid)
            );
          }),
          (o.getBirthdayInvalidMessage = function () {
            return o.isBirthdayInvalid()
              ? c.get("Response.InvalidBirthday")
              : "";
          }),
          (o.isValidBirthday = function (a, e) {
            var t = o.signup.birthdayYear;
            !t && e && (t = l.nonLeapYear);
            var n = o.signup.birthdayMonth;
            if (((a = parseInt(a)), !t || !n || !a)) return !1;
            var i = new Date(n + " " + a + " " + t);
            if (
              "[object Date]" !== Object.prototype.toString.call(i) ||
              isNaN(i.getTime())
            )
              return !1;
            if (i.getDate() !== a) return !1;
            var r = new Date();
            return (
              i.getTime() < r.getTime() &&
              i.getFullYear() > r.getFullYear() - 100
            );
          }),
          (o.togglePasswordVisibility = function () {
            o.layout.showPassword
              ? ((o.layout.showPassword = !1),
                (o.layout.passwordInputType = l.inputType.password))
              : ((o.layout.showPassword = !0),
                (o.layout.passwordInputType = l.inputType.text));
          }));
        var h = !(o.isFormValid = function () {
          return o.signupForm.$valid;
        });
        ((o.passwordBoxClicked = function () {
          h = !0;
        }),
          (o.getHintForUsername = function () {
            return o.signup.username
              ? o.badSubmit || o.signupForm.signupUsername.$dirty
                ? o.signupForm.signupUsername.$validationMessage
                : ""
              : _.Resources.AnimatedSignupFormValidator.usernameNoRealNameUse;
          }),
          (o.getHintForPassword = function () {
            return !o.signup.password && h
              ? _.Resources.AnimatedSignupFormValidator.passwordMinLength
              : o.badSubmit || o.signupForm.signupPassword.$dirty
                ? o.signupForm.signupPassword.$validationMessage
                : "";
          }),
          (o.setGeneralError = function () {
            ((o.signupForm.$generalError = !0),
              (o.signupForm.$generalErrorText = "Sorry, an error occurred."));
          }),
          (o.handleSignupErrors = function (a) {
            var e = 0;
            (-1 !== a.reasons.indexOf("Captcha") &&
              ((o.captchaReturnTokenInSuccessCb =
                o.isBedev2CaptchaForWebSignUpEnabled || !1),
              (o.captchaActivated = !0),
              (o.layout.isSubmitting = !0),
              o.incrementEphemeralCounter(l.counters.captcha),
              (e += 1)),
              -1 !== a.reasons.indexOf("GenderInvalid") &&
                ((o.signup.gender = 1),
                o.incrementEphemeralCounter(l.counters.genderInvalid),
                (e += 1)),
              -1 !== a.reasons.indexOf("PasswordInvalid") &&
                (o.signupForm.signupPassword.$setValidity("password", !1),
                (o.signupForm.signupPassword.$passwordMessage =
                  "Password is invalid"),
                o.incrementEphemeralCounter(l.counters.passwordInvalid),
                (e += 1)),
              -1 !== a.reasons.indexOf("UsernameInvalid") &&
                (o.signupForm.signupUsername.$setValidity("validusername", !1),
                (o.signupForm.signupUsername.$usernameMessage =
                  "Username is invalid"),
                o.incrementEphemeralCounter(l.counters.usernameInvalid),
                (e += 1)),
              -1 !== a.reasons.indexOf("UsernameTaken") &&
                (o.signupForm.signupUsername.$setValidity("unique", !1),
                (o.signupForm.signupUsername.$usernameMessage =
                  "Username is taken"),
                o.incrementEphemeralCounter(l.counters.usernameTaken),
                (e += 1)),
              e < a.reasons.length &&
                (o.incrementEphemeralCounter(l.counters.unknownError),
                o.setGeneralError()));
          }),
          (o.incrementSignUpSubmitCounters = function () {
            (o.incrementEphemeralCounter(l.counters.attempt),
              o.layout.isFirstSignUpSubmit &&
                ((o.layout.isFirstSignUpSubmit = !1),
                o.incrementEphemeralCounter(l.counters.firstAttempt)));
          }),
          (o.badSubmit = !1),
          (o.sendConversionEvent = function (a) {
            if ("undefined" == typeof gtag || !gtag || !gtag.conversionEvents)
              return a();
            var e = setTimeout(a, 2e3);
            gtag("event", "conversion", {
              send_to: gtag.signupConversionEvent,
              event_callback: function () {
                (clearTimeout(e), a());
              },
              event_timeout: 2e3,
            });
          }),
          (o.submitSignup = function (a, e) {
            if (
              (a && o.sendInteractionClickEvent(l.signUpSubmitButtonName),
              o.isFormValid() &&
                o.signup.gender !== o.genderType.unknown &&
                o.isValidBirthday(o.signup.birthdayDay))
            ) {
              ((o.badSubmit = !1),
                (o.layout.isSubmitting = !0),
                a && o.incrementSignUpSubmitCounters());
              var t =
                  o.signup.birthdayDay +
                  " " +
                  o.signup.birthdayMonth +
                  " " +
                  o.signup.birthdayYear,
                r = {
                  username: o.signup.username,
                  password: o.signup.password,
                  birthday: t,
                  gender: o.signup.gender,
                  isTosAgreementBoxChecked: !0,
                  context: o.signupForm.context,
                };
              Object.assign(r, o.$parent.avatarSignupMetadata);
              var n = m();
              (n && (r.locale = n),
                null != e &&
                  ((r.captchaToken = e.captchaToken),
                  (r.captchaProvider = e.captchaProvider)),
                i.signup(r).then(
                  function (a) {
                    o.incrementEphemeralCounter(l.counters.success);
                    var e = _.Auth && _.Auth.returnUrl;
                    if ("string" == typeof e && 0 < e.length)
                      (-1 === e.indexOf("?") ? (e += "?") : (e += "&"),
                        (e += l.newUserParam),
                        o.sendConversionEvent(function () {
                          return (window.location.href = e);
                        }));
                    else {
                      var n = l.urls.homePage;
                      if (
                        _.SignupMeta &&
                        _.SignupMeta.isNewUserLandingAbTestingEnabled &&
                        a &&
                        a.data
                      ) {
                        var t = a.data.userId,
                          i = [
                            {
                              SubjectType: l.abtestingRequest.subjectType,
                              SubjectTargetId: t,
                              ExperimentName:
                                _.SignupMeta.newUserLandingPageAbTestName,
                            },
                          ];
                        ((l.apiUrls.enrollAbtestingApi.timeout =
                          _.SignupMeta.timeoutOnAbtestingEnrollEndpoint),
                          s.httpPost(l.apiUrls.enrollAbtestingApi, i).then(
                            function (a) {
                              if (a.data && 0 < a.data.length) {
                                r.assetIds &&
                                  1 < r.assetIds.length &&
                                  d.sendEventWithTarget(
                                    u.events.buttonClick,
                                    u.events.context,
                                    {
                                      btn: u.events.signup,
                                      body: o.$parent.avatarSignupMetadata
                                        .bodyId,
                                      head: o.$parent.avatarSignupMetadata
                                        .headId,
                                      clothing:
                                        o.$parent.avatarSignupMetadata
                                          .clothingId,
                                      color:
                                        o.$parent.avatarSignupMetadata.colorId,
                                    },
                                  );
                                var e = a.data[0],
                                  t = l.abtestingResponse;
                                if (e.Status === t.status.enrolled)
                                  return (
                                    o.sendConversionEvent(function () {
                                      window.location.href =
                                        e.Variation ===
                                        t.landingTohomePageVariation
                                          ? n
                                          : l.urls.gamesNewUser;
                                    }),
                                    !1
                                  );
                              }
                              o.sendConversionEvent(function () {
                                return (window.location.href = n);
                              });
                            },
                            function () {
                              o.sendConversionEvent(function () {
                                return (window.location.href = n);
                              });
                            },
                          ));
                      } else
                        o.sendConversionEvent(function () {
                          return (window.location.href = n);
                        });
                    }
                  },
                  function (a) {
                    o.handleSignupError(a.data, a.status);
                  },
                ));
            } else o.badSubmit = !0;
          }),
          (o.handleSignupError = function (a, e) {
            ((o.badSubmit = !0),
              (o.layout.isSubmitting = !1),
              403 === e
                ? o.handleSignupErrors(a)
                : 429 === e
                  ? (o.setGeneralError(),
                    o.incrementEphemeralCounter(l.counters.tooManyAttempts))
                  : (o.setGeneralError(),
                    o.incrementEphemeralCounter(l.counters.unknownError)));
          }),
          (o.incrementEphemeralCounter = function (a) {
            !(function (a) {
              n.fireEvent(a);
            })(l.counters.prefix + a);
          }),
          (o.sendInteractionClickEvent = function (a) {
            _.FormEvents &&
              _.FormEvents.SendInteractionClick(o.signupForm.context, a);
          }),
          o.init());
      }
      ((i.$inject = [
        "$injector",
        "$scope",
        "$log",
        "$timeout",
        "httpService",
        "eventTrackerService",
        "signupService",
        "signupConstants",
        "captchaV2Constants",
        "languageResource",
        "eventStreamService",
        "avatarLandingConstants",
      ]),
        n.a.controller("signupController", i),
        (e.default = i));
    },
    function (a, e, t) {
      var n = {
        "./avatarLandingDirective.js": 73,
        "./landingDirective.js": 74,
        "./signupDirective.js": 75,
        "./validBirthday.js": 76,
        "./validPassword.js": 77,
        "./validUsername.js": 78,
      };
      function i(a) {
        var e = r(a);
        return t(e);
      }
      function r(a) {
        var e = n[a];
        if (e + 1) return e;
        var t = new Error("Cannot find module '" + a + "'");
        throw ((t.code = "MODULE_NOT_FOUND"), t);
      }
      ((i.keys = function () {
        return Object.keys(n);
      }),
        (i.resolve = r),
        ((a.exports = i).id = 72));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3);
      function i(a) {
        return {
          restrict: "A",
          replace: !1,
          templateUrl: a.templates.avatarLandingPage,
          controller: "avatarLandingPageController",
        };
      }
      ((i.$inject = ["avatarLandingConstants"]),
        n.a.directive("avatarLanding", i),
        (e.default = i));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3);
      function i(a) {
        return {
          restrict: "A",
          replace: !1,
          templateUrl: a.templates.landingPage,
          controller: "landingPageController",
          link: function (a, e, t) {
            a.landingParams = {
              isLoginFunCaptchaEnabled: "true" === t.isLoginFunCaptchaEnabled,
              isAlwaysCaptchaLoginEnabled:
                "true" === t.isAlwaysCaptchaLoginEnabled,
              isAlwaysCaptchaSignupEnabled:
                "true" === t.isAlwaysCaptchaSignupEnabled,
              isCaptchaV2ComponentForSignupEnabled:
                "true" === t.isCaptchaV2ComponentForSignupEnabled,
              isBedev2CaptchaForWebLoginEnabled:
                "true" === t.isBedev2CaptchaForWebLoginEnabled,
            };
          },
          scope: {
            abTestVariation: "=",
            ftuxAvatarVersion: "=",
            ftuxContextVersion: "=",
            isFtuxAvatarEnabled: "=",
            useExperimentationPlatformForFtux: "=",
          },
        };
      }
      ((i.$inject = ["landingPageConstants"]),
        n.a.directive("landingPageContainer", i),
        (e.default = n.a));
    },
    function (a, e, t) {
      "use strict";
      function n() {
        return {
          restrict: "A",
          replace: !1,
          templateUrl: "signup",
          controller: "signupController",
          scope: { showGenderIcons: "=", isFtuxAvatar: "=" },
        };
      }
      (t.r(e), t(3).a.directive("signup", n), (e.default = n));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        i = t(0);
      function r() {
        return {
          require: "ngModel",
          link: function (a, e, t, n) {
            a.$watch(
              function () {
                return (
                  !angular.isUndefined(n.$modelValue) && "" !== n.$modelValue
                );
              },
              function (a) {
                (n.$setValidity("birthday", a),
                  (n.$validationMessage =
                    i.Resources.AnimatedSignupFormValidator.invalidBirthday));
              },
            );
          },
        };
      }
      (n.a.directive("rbxValidBirthday", r), (e.default = r));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        i = t(0);
      function r() {
        return {
          require: "ngModel",
          link: function (e, a, t, n) {
            e.$watch(
              function () {
                return (
                  !angular.isUndefined(n.$modelValue) &&
                  i.SignupFormValidatorGeneric.getInvalidPasswordMessage(
                    n.$modelValue,
                    e.signup.username,
                  )
                );
              },
              function (a) {
                (n.$setValidity(
                  "password",
                  angular.isString(n.$modelValue) && "" === a,
                ),
                  (n.$validationMessage = angular.isString(n.$modelValue)
                    ? a
                    : i.Resources.AnimatedSignupFormValidator.passwordRequired),
                  (e.$unitTestValidationMessage = n.$validationMessage));
              },
            );
          },
        };
      }
      (n.a.directive("rbxValidPassword", r), (e.default = r));
    },
    function (a, e, t) {
      "use strict";
      t.r(e);
      var n = t(3),
        d = t(0);
      function i(c) {
        return {
          require: "ngModel",
          link: function (s, a, e, l) {
            ((s.signup.username = a.val()),
              (s.usernameValidationRequestNum = 0),
              (s.onChange = function () {
                var a =
                    "" === s.signup.username ||
                    angular.isUndefined(s.signup.username),
                  e = "",
                  t = !1,
                  i = ++s.usernameValidationRequestNum;
                if (
                  (1 == i &&
                    (s.signupForm
                      ? s.signupForm.signupUsername &&
                        s.signup.username &&
                        (s.signupForm.signupUsername.$dirty = !0)
                      : s.fbConnectForm &&
                        s.fbConnectForm.username &&
                        s.signup.username &&
                        (s.fbConnectForm.username.$dirty = !0)),
                  a
                    ? ((t = !0),
                      (e =
                        d.Resources.AnimatedSignupFormValidator
                          .usernameRequired))
                    : "" !==
                        (e =
                          d.SignupFormValidatorGeneric.getInvalidUsernameMessage(
                            s.signup.username,
                          )) && (t = !0),
                  (s.signup.birthdayDay &&
                    s.signup.birthdayMonth &&
                    s.signup.birthdayYear) ||
                    ((t = !0),
                    (e =
                      d.Resources.AnimatedSignupFormValidator
                        .birthdayRequired)),
                  l.$setValidity("validusername", !t),
                  t)
                )
                  l.$validationMessage = e;
                else {
                  l.$validationMessage = "";
                  var n = {
                      url: d.EnvironmentUrls.authApi + "/v1/usernames/validate",
                    },
                    r = { username: s.signup.username, context: "Signup" };
                  if (
                    s.signup.birthdayDay &&
                    s.signup.birthdayMonth &&
                    s.signup.birthdayYear
                  ) {
                    var o = new Date(
                      Date.parse(
                        s.signup.birthdayMonth +
                          " " +
                          s.signup.birthdayDay +
                          ", " +
                          s.signup.birthdayYear,
                      ),
                    );
                    angular.isDate(o) && (r.birthday = o);
                  }
                  c.httpGet(n, r).then(
                    function (a) {
                      if (i == s.usernameValidationRequestNum) {
                        var e = !0,
                          t = !0,
                          n = "";
                        (1 === a.code
                          ? ((e = !1),
                            (n =
                              d.Resources.AnimatedSignupFormValidator
                                .alreadyTaken))
                          : 2 === a.code
                            ? ((t = !1),
                              (n =
                                d.Resources.AnimatedSignupFormValidator
                                  .cantBeUsed))
                            : 10 === a.code
                              ? ((t = !1),
                                (n =
                                  d.Resources.AnimatedSignupFormValidator
                                    .cantBeUsedPii))
                              : 12 === a.code &&
                                ((t = !1),
                                (n =
                                  d.Resources.AnimatedSignupFormValidator
                                    .usernameNotAvailable)),
                          l.$setValidity("unique", e),
                          l.$setValidity("moderated", t),
                          l.$invalid
                            ? "" != n && (l.$validationMessage = n)
                            : (l.$validationMessage = ""));
                      }
                    },
                    function (a) {
                      2 === c.getPrimaryApiErrorCode(a) &&
                        (l.$setValidity("moderated", !1),
                        (l.$validationMessage =
                          d.Resources.AnimatedSignupFormValidator.birthdayRequired));
                    },
                  );
                }
              }),
              s.$evalAsync(function () {
                s.onChange();
              }));
          },
        };
      }
      ((i.$inject = ["httpService"]),
        n.a.directive("rbxValidUsername", i),
        (e.default = i));
    },
    function (a, e, t) {
      var n = {
        "./directives/templates/avatarLanding.html": 80,
        "./directives/templates/landing.html": 81,
        "./directives/templates/signup.html": 82,
        "./directives/templates/youtubeModal.html": 83,
      };
      function i(a) {
        var e = r(a);
        return t(e);
      }
      function r(a) {
        var e = n[a];
        if (e + 1) return e;
        var t = new Error("Cannot find module '" + a + "'");
        throw ((t.code = "MODULE_NOT_FOUND"), t);
      }
      ((i.keys = function () {
        return Object.keys(n);
      }),
        (i.resolve = r),
        ((a.exports = i).id = 79));
    },
    function (a, e) {
      a.exports =
        '<div id="action-bar-container"> <div id="action-bar"> <div class="avatar-text-logo"></div> <div class="avatar-login-container"> <span class="avatar-login-text" ng-bind="\'Label.AlreadyHaveRobloxAccount\' | translate"></span> <a id="main-login-button" class="btn-control-md avatar-login-button" ng-bind="\'Action.LogInCapitalized\' | translate" ng-href="{{landingLayout.loginLink}}"></a> </div> </div> </div> <div class="avatar-content-container" id="AvatarContentContainer" ng-class="{\'avatar-3d-background\': avatarSignupLayout.currentLayout ==avatarSignupLayout.layouts.bodyPage, \'avatar-lab-background-v2\': avatarSignupMetadata.displayContextV2, \'avatar-tiles-background\' : avatarSignupLayout.currentLayout !== avatarSignupLayout.layouts.bodyPage && !avatarSignupMetadata.displayContextV2}"> <div ng-if="avatarSignupLayout.currentLayout == avatarSignupLayout.layouts.bodyPage"> <div class="avatar-title-text"> <h1 ng-bind="\'Heading.SelectStartingAvatar\' | translate"></h1> <p ng-if="!avatarSignupMetadata.displayContextV2" ng-bind="\'Description.ChangeLater\' | translate"></p> <p ng-if="avatarSignupMetadata.displayContextV2" ng-bind="\'Description.JoinGames\' | translate"></p> </div> <div class="avatar-body-container"> <ul class="avatar-body-box"> <div ng-repeat="avatarId in avatarIds" ng-click="handleBodySelect(avatarId, $index)" class="avatar-with-shadow"> <li class="avatar-body-image {{avatarId}}"> </li> <li ng-if="avatarSignupMetadata.displayAvatarV2" id="avatar-shadow" class="avatar-body-image {{avatarId}}"> </li> </div> </ul> <div ng-if="avatarSignupMetadata.displayContextV2" class="video-thumbnail-container"> <h1 class="youtube-trailer-text" ng-bind="\'Heading.WatchTrailer\' | translate"></h1> <div ng-click="handleYoutubeClick()" class="video-thumbnail-image"></div> </div> </div> </div> <div ng-if="avatarSignupLayout.currentLayout == avatarSignupLayout.layouts.accessoryPage"> <div class="avatar-accessory-container"> <div class="avatar-thumbnail-container"> <div class="avatar-title-text"> <h1 ng-bind="\'Heading.CustomizeYourCharacter\' | translate"></h1> <p ng-bind="\'Description.ChangeLater\' | translate"></p> </div> <div class="avatar-accessory-image-container"> <div class="avatar-picked-with-shadow"> <div class="avatar-accessory-image-thumbnail" ng-style="{\'background-image\': \'url(\' + avatarSignupMetadata.avatarUrl + \')\'}"></div> <div ng-if="avatarSignupMetadata.displayAvatarV2" id="avatar-picked-shadow" class="avatar-accessory-image-thumbnail" ng-style="{\'background-image\': \'url(\' + avatarSignupMetadata.avatarUrl + \')\'}"></div> </div> </div> <div class="avatar-randomize-button-container" ng-click="handleRandomize()"> <a class="btn-control-md avatar-randomize-button"> <i class="randomize-icon"></i><span class="randomize-text" ng-bind="\'Action.Randomize\' | translate"></span> </a> </div> </div> <div class="avatar-editor-container"> <div class="avatar-editor-title"> <i ng-click="backClick(avatarSignupLayout.currentLayout)" class="nav-back-icon"></i> <span class="avatar-text-title" ng-bind="\'Label.Avatar\' | translate"></span> </div> <div class="avatar-editor-picker"> <ul class="avatar-tabs"> <li class="avatar-tab" ng-class="{\'current-tab\': avatarSignupLayout.currentTab === avatarSignupLayout.tabs.clothing}" ng-click="handleTabClick(avatarSignupLayout.tabs.clothing)"><span ng-bind="\'Label.Clothing\' | translate"></span></li> <li class="avatar-tab" ng-class="{\'current-tab\': avatarSignupLayout.currentTab === avatarSignupLayout.tabs.head}" ng-click="handleTabClick(avatarSignupLayout.tabs.head)"><span ng-bind="\'Label.Head\' | translate"></li> <li class="avatar-tab" ng-class="{\'current-tab\': avatarSignupLayout.currentTab === avatarSignupLayout.tabs.color}" ng-click="handleTabClick(avatarSignupLayout.tabs.color)"><span ng-bind="\'Label.SkinTone\' | translate"></li> </ul> <div class="tabcontent head-tab-content" ng-if="avatarSignupLayout.currentTab == avatarSignupLayout.tabs.head"> <div class="avatar-thumbnail-container"> <ul class="avatar-thumbnails" data-columns="2"> <li ng-repeat="head in heads" class="avatar-part-image {{head.name}}" ng-click="handlePartSelect($index, heads)"> <div ng-class="{\'avatar-selected-overlay\':head.checked}"></div> <div ng-class="{\'avatar-checker-wrapper\':head.checked}"> <span ng-model="head.checked" ng-class="{\'avatar-selected-icon\':head.checked}"/> </div> </li> </ul> </div> </div> <div class="tabcontent clothing-tab-content" ng-if="avatarSignupLayout.currentTab == avatarSignupLayout.tabs.clothing"> <div class="avatar-thumbnail-container"> <ul class="avatar-thumbnails" data-columns="2"> <li ng-repeat="clothing in clothings" class="avatar-part-image {{clothing.name}}" ng-click="handlePartSelect($index, clothings)"> <div ng-class="{\'avatar-selected-overlay\':clothing.checked}"></div> <div ng-class="{\'avatar-checker-wrapper\':clothing.checked}"> <span ng-model="clothing.checked" ng-class="{\'avatar-selected-icon\':clothing.checked}"/> </div> </li> </ul> </div> </div> <div class="tabcontent color-tab-content" ng-if="avatarSignupLayout.currentTab == avatarSignupLayout.tabs.color"> <div class="avatar-thumbnail-container"> <ul ng-if="!avatarSignupMetadata.displayAvatarV2" class="avatar-color-thumbnails" data-columns="3"> <li ng-repeat="color in colors" ng-click="handlePartSelect($index, colors)" class="avatar-skintone-thumbnail {{color.name}}"> <div ng-class="{\'check-wrapper\':true, \'display-inner-circle\': color.checked, \'{{color.name}}_inner\': color.checked}"> <span ng-model="color.checked" ng-class="{\'avatar-selected-color-icon\':true, \'display-checker\': color.checked}"/> </div> </li> </ul> <ul ng-if="avatarSignupMetadata.displayAvatarV2" class="avatar-color-thumbnails-v2" data-columns="2"> <li ng-repeat="color in colors" ng-click="handlePartSelect($index, colors)" class="avatar-skintone-thumbnail-v2 {{color.name}}"> <div ng-class="{\'check-wrapper-v2\':true, \'display-inner-circle\': color.checked, \'{{color.name}}_inner\': color.checked}"> <span ng-model="color.checked" ng-class="{\'avatar-selected-color-icon\':true, \'display-checker\': color.checked}"/> </div> </li> </ul> </div> </div> <div class="avatar-continue-button-container"> <a ng-click="continueClick()" class="btn-primary-md avatar-continue-button"> <span ng-bind="\'Action.Continue\' | translate"></span> </a> </div> </div> </div> </div> </div> <div ng-show="avatarSignupLayout.currentLayout == avatarSignupLayout.layouts.signupPage"> <div class="avatar-accessory-container"> <div class="avatar-thumbnail-container"> <div class="avatar-title-text"> <h1 ng-bind="\'Heading.CustomizeYourCharacter\' | translate"></h1> <p ng-bind="\'Description.ChangeLater\' | translate"></p> </div> <div class="avatar-accessory-image-container"> <div class="avatar-picked-with-shadow"> <div class="avatar-accessory-image-thumbnail" ng-style="{\'background-image\': \'url(\' + avatarSignupMetadata.avatarUrl + \')\'}"></div> <div ng-if="avatarSignupMetadata.displayAvatarV2" id="avatar-picked-shadow" class="avatar-accessory-image-thumbnail" ng-style="{\'background-image\': \'url(\' + avatarSignupMetadata.avatarUrl + \')\'}"></div> </div> </div> <div class="avatar-randomize-signup-filler"></div> </div> <div class="avatar-editor-container"> <div class="avatar-editor-title"> <i ng-click="backClick(avatarSignupLayout.currentLayout)" class="icon-back nav-back-icon"></i> <span class="avatar-text-title" ng-bind="\'Action.SignUp\' | translate"></span> </div> <div class="avatar-editor-picker"> <div class="dark-theme avatar-signup-form-container" signup show-gender-icons="landingLayout.showGenderIcons" is-ftux-avatar="true"></div> </div> </div> </div> </div> </div> ';
    },
    function (a, e) {
      a.exports =
        '<div ng-if="!displayAvatarSignup" id="landing-page-container"> <div class="container-fluid"> <section class="row full-height-section rollercoaster-background" id="RollerContainer"> <div class="col-md-12 inner-full-height-section" id="InnerRollerContainer"> <div id="action-bar-container"> <div id="action-bar"> <a id="main-login-button" class="btn-control-md" ng-bind="\'Action.LogInCapitalized\' | translate" ng-href="{{landingLayout.loginLink}}"></a> </div> </div> <div class="lower-logo-container"> <div id="signup-container"> <div id="signup-header-container"> <div id="signup-header"> <div class="text-logo"></div> </div> </div> <div class="rbx-login-partial-legacy signup-container" signup></div> </div> <div id="app-stores-container"> <div id="app-stores"> <div id="app-stores-devices"> <h4><span ng-bind="\'Heading.RobloxOnDevice\' | translate"></span></h4> </div> <a ng-href="{{landingLayout.appStoreLink}}" target="_blank" class="app-store-logo apple-badge" ng-click="appClick(\'apple\')" title="{{\'Label.RobloxAppStore\' | translate}}"></a> <a ng-href="{{landingLayout.googlePlayStoreLink}}" target="_blank" class="app-store-logo google-badge" ng-click="appClick(\'google\')" title="{{\'Label.GetOnGooglePlay\' | translate}}"></a> <a ng-href="{{landingLayout.amazonStoreLink}}" target="_blank" class="app-store-logo amazon-badge" ng-click="appClick(\'amazon\')" title="{{\'Label.RobloxAmazonStore\' | translate}}"></a> <a ng-href="{{landingLayout.xboxStoreLink}}" target="_blank" class="app-store-logo xbox-badge" ng-click="appClick(\'xbox\')" title="{{\'Label.RobloxOnXbox\' | translate}}"></a> <a ng-href="{{landingLayout.windowsStoreLink}}" target="_blank" class="app-store-logo microsoft-badge" ng-click="appClick(\'microsoft\')" title="{{\'Label.RobloxWindowsStore\' | translate }}"></a> </div> </div> </div> </div> </section> </div> </div> <div ng-if="displayAvatarSignup" class="avatar-signup-container" avatar-landing></div>';
    },
    function (a, e) {
      a.exports =
        '<div id="signup"> <h3 ng-hide="isFtuxAvatar" class="text-center signup-header" ng-bind="\'Heading.SignupHaveFun\' | translate"></h3> <div class="signup-or-log-in new-username-pwd-rule"> <div class="signup-container"> <div class="signup-input-area" ng-form name="signupForm" rbx-form-context context="{{layout.context}}"> <div class="birthday-container"> <div class="form-group" ng-class="{\'has-error\' : isBirthdayInvalid(), \'has-success\' : isBirthdayFormDirty() && !isBirthdayInvalid() }"> <label class="birthday-label" ng-bind="\'Label.Birthday\' | translate"></label> <div class="form-control birthday-select-group"> <div ng-repeat="part in layout.orderedBirthdayParts.parts" class="rbx-select-group" ng-class="part.className"> <select class="input-field rbx-select" id="{{part.idName}}" tabindex="1" rbx-valid-birthday rbx-form-interaction rbx-form-validation name="{{part.birthdayName}}" ng-model="signup[part.birthdayName]" ng-change="onChange()" ng-disabled="layout.isSubmitting"> <option value="" disabled="disabled" selected="selected"> {{part.placeholder}} </option> <option ng-repeat="dateOption in part.options" value="{{dateOption.value}}"> {{dateOption.label}} </option> </select> </div> </div> <p id="signup-BirthdayInputValidation" class="form-control-label font-caption-body input-validation text-error" ng-bind="getBirthdayInvalidMessage()"></p> </div> </div> <div class="form-group" ng-class="{\'has-error\' : (badSubmit || signupForm.signupUsername.$dirty) && signupForm.signupUsername.$invalid, \'has-success\': (signupForm.signupUsername.$dirty && signupForm.signupUsername.$valid) }"> <label ng-show="isFtuxAvatar" class="birthday-label" ng-bind="\'Label.Username\' | translate"></label> <input id="signup-username" ng-trim="false" ng-change="onChange()" ng-model-options="{ debounce: 200 }" name="signupUsername" class="form-control input-field" type="text" autocomplete="signup-username" tabindex="1" rbx-valid-username rbx-form-interaction send-input-value="true" rbx-form-validation placeholder="{{\'Label.Username\' | translate}}" ng-model="signup.username" ng-disabled="layout.isSubmitting"/> <p id="signup-usernameInputValidation" class="form-control-label font-caption-body input-validation" ng-class="{\'text-error\': signup.username.length, \'text-info\': !signup.username.length}" ng-bind="getHintForUsername()"></p> </div> <div class="form-group password-form-group" ng-class="{\'has-error\' : (badSubmit || signupForm.signupPassword.$dirty) && signupForm.signupPassword.$invalid, \'has-success\': (signupForm.signupPassword.$dirty && signupForm.signupPassword.$valid) }"> <label ng-show="isFtuxAvatar" class="birthday-label" ng-bind="\'Label.Password\' | translate"></label> <input id="signup-password" ng-trim="false" name="signupPassword" class="form-control input-field password-with-visibility-toggle" type="{{layout.passwordInputType}}" autocomplete="new-password" tabindex="2" rbx-valid-password rbx-form-interaction rbx-form-validation rbx-form-validation-redact-input placeholder="{{\'Label.Password\' | translate}}" ng-model="signup.password" ng-click="passwordBoxClicked()" ng-disabled="layout.isSubmitting"/> <div ng-show="signup.password" class="icon-password-show password-visibility-toggle" ng-class="layout.showPassword ? \'icon-password-hide\' : \'icon-password-show\'" ng-click="togglePasswordVisibility()" ng-cloak></div> <p id="signup-passwordInputValidation" class="form-control-label font-caption-body input-validation" ng-class="{\'text-error\': signup.password.length, \'text-info\': !signup.password.length}" ng-bind="getHintForPassword()"></p> </div> <div class="gender-container"> <label ng-bind="\'Label.Gender\' | translate"></label> <div class="form-group" ng-class="{\'has-error\' : isGenderInvalid(), \'has-success\': isGenderValid() }"> <div class="form-control fake-input-lg"> <div id="FemaleButton" class="gender-button text-lead" tabindex="7" rbx-form-interaction name="genderFemale" title="{{\'Label.Female\' | translate}}" ng-click="setGender($event, genderType.female)" ng-keypress="setGender($event, genderType.female)"> <div class="gender-icon gender-female" ng-class="{\'gender-selected\': signup.gender === genderType.female}"></div> </div> <div id="MaleButton" class="gender-button text-lead" tabindex="8" rbx-form-interaction name="genderMale" title="{{\'Label.Male\' | translate}}" ng-click="setGender($event, genderType.male)" ng-keypress="setGender($event, genderType.male)"> <div class="gender-icon gender-male" ng-class="{\'gender-selected\': signup.gender === genderType.male}"></div> </div> </div> <p id="signup-GenderInputValidation" class="form-control-label font-caption-body input-validation text-error" ng-bind="getGenderInvalidMessage()"></p> </div> </div> <div class="legal-text-container"> <div class="terms-agreement" ng-bind-html="\'Description.SignUpAgreement\' | translate: {spanStart: \'<span>\', spanEnd: \'</span>\', termsOfUseLink: layout.termsOfUseLinkElement, privacyPolicyLink: layout.privacyLinkElement}"> </div> </div> <captcha activated="captchaActivated" captcha-action-type="captchaActionTypes.signup" captcha-failed="handleCaptchaError" captcha-passed="handleCaptchaSuccess" captcha-dismissed="handleCaptchaDismiss" return-token-in-success-cb="captchaReturnTokenInSuccessCb"> </captcha> <button id="signup-button" type="button" tabindex="10" class="btn-primary-md signup-submit-button" name="signupSubmit" ng-disabled="layout.isSubmitting" ng-click="submitSignup(true)" ng-keypress="submitSignup(true)" ng-bind="\'GuestSignUpAB.Action.SignUp\' | translate"></button> <noscript> <div class="text-danger"> <strong ng-bind="Response.JavaScriptRequired | translate"></strong> </div> </noscript> <div id="GeneralErrorText" class="input-validation-large alert-warning font-bold" ng-cloak ng-show="signupForm.$generalError" ng-bind="signupForm.$generalErrorText" ng-click="signupForm.$generalError=false"></div> </div> </div> </div> </div>';
    },
    function (a, e) {
      a.exports =
        '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/sme76WoJ_-U?autoplay=1&rel=0" frameborder="0" allow="autoplay"></iframe> ';
    },
  ]);
  //# sourceMappingURL=https://js.rbxcdn.com/510ddf27ae4903280e73-landing.js.map

  /* Bundle detector */
  window.Roblox &&
    window.Roblox.BundleDetector &&
    window.Roblox.BundleDetector.bundleDetected("Landing");

