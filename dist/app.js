// ==UserScript==
// @name         Facturier (alpha)
// @namespace    http://tampermonkey.net/
// @version      1.10.0000
// @description  Un addon pour vous aider dans votre facturation
// @author       Stéphane TORCHY
// @updateURL    https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js
// @downloadURL  https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js
// @match        https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history*

// Start at document start https://www.tampermonkey.net/documentation.php#_run_at
// @run-at document-start   

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_notification

// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js
// @require      https://unpkg.com/lowdb@0.17/dist/low.min.js
// @require      https://unpkg.com/lowdb@0.17/dist/LocalStorage.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/locale/fr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/isBetween.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/isSameOrBefore.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/isSameOrAfter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/customParseFormat.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/localeData.min.js


// GM_Config
// require      https://openuserjs.org/src/libs/sizzle/GM_config.js (cassé ce jour 28/08/2020);
// @require      https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/gm_config.js

// sweetalert 2
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.all.min.js

// draggabilly
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.2.0/draggabilly.pkgd.min.js

// toastify
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1.8.0/src/toastify.min.js
// @resource    toastifycss https://raw.githubusercontent.com/apvarun/toastify-js/master/src/toastify.css

// https://github.com/uzairfarooq/arrive --> included manually
// require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js

// simple-datatables
// @require     https://cdn.jsdelivr.net/npm/simple-datatables@latest
// @resource    simpledatatablecss https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css

// require https://raw.githubusercontent.com/anywhichway/nano-memoize/master/dist/nano-memoize.min.js
// @require https://cdn.jsdelivr.net/npm/moize@5.4.7/dist/moize.min.js

// require https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/fetch-inject.umd.min.js
// j'utilisais celui là mais désormais je le livre dans l'application directement require https://cdn.jsdelivr.net/npm/fetch-inject

// PARSER MKDOWN
// @require 	 https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js

// PDF https://pdf-lib.js.org/docs/api/
// @require      https://unpkg.com/pdf-lib@1.9.0/dist/pdf-lib.min.js
// @require      https://unpkg.com/downloadjs@1.4.7/download.js



// ProgressBar 
// https://loading.io/progress/
// require https://raw.githubusercontent.com/loadingio/loading-bar/master/dist/loading-bar.js
// resource loading_barcss https://raw.githubusercontent.com/loadingio/loading-bar/master/dist/loading-bar.css
// @require https://loadingio.github.io/loading-bar/dist/loading-bar.js
// @resource loading_barcss https://loadingio.github.io/loading-bar/dist/loading-bar.min.css

// https://www.cssscript.com/demo/text-progress-bar-ascii-loader/
// https://github.com/kimmobrunfeldt/progressbar.js - fonctionne mais probleme avec le easing dans mon popup progress bar
// require https://raw.githubusercontent.com/kimmobrunfeldt/progressbar.js/master/dist/progressbar.min.js
// require https://raw.githubusercontent.com/kimmobrunfeldt/progressbar.js/master/dist/progressbar.js
// https://pvdlg.github.io/uprogress/js-api/#UProgress+start
// https://ricostacruz.com/nprogress

// semble cassé
// https://github.com/webosorg/Process
// https://unpkg.com/@webos/process@0.2.0/dist/process.js
// https://cdn.jsdelivr.net/npm/@webos/process@0.2.0/dist/process.min.js
// bof ... je ne parviens pas à faire fonctionner l'exemple
// https://cdn.jsdelivr.net/npm/worker-function@2.0.1/WorkerFunction.min.js
// Threading 
// @require  https://raw.githubusercontent.com/gkjohnson/threading-js/master/umd/Thread.js
// @require   https://raw.githubusercontent.com/gkjohnson/threading-js/master/umd/ThreadPool.js
// @require   https://raw.githubusercontent.com/gkjohnson/threading-js/master/umd/ThreadQueue.js
// semble cassé
// https://cdn.jsdelivr.net/npm/threads@1.6.3/dist/index.min.js
// https://unpkg.com/paralleljs@1.0/lib/parallel.js
// https://cdn.jsdelivr.net/npm/threads@1.6.3/dist/index.min.js
// Freelancer
// https://github.com/Wildhoney/Freelancer
// fonctionne require https://raw.githubusercontent.com/arqex/worker-function/master/WorkerFunction.js
// ne fonctonne pas https://raw.githubusercontent.com/duart38/Thread/master/Thread.bundle.js
// require      https://cdn.jsdelivr.net/npm/paralleljs@1.0.1/lib/parallel.min.js


/*
 * History
 * cf https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/blob/master/CHANGELOG.md
 */
// ==/UserScript==
(() => {
  var __defineProperty = Object.defineProperty;
  var __hasOwnProperty = Object.prototype.hasOwnProperty;
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __markAsModule = (target) => {
    return __defineProperty(target, "__esModule", {value: true});
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defineProperty(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar = (target, module) => {
    __markAsModule(target);
    if (typeof module === "object" || typeof module === "function") {
      for (let key in module)
        if (!__hasOwnProperty.call(target, key) && key !== "default")
          __defineProperty(target, key, {get: () => module[key], enumerable: true});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__defineProperty({}, "default", {value: module, enumerable: true}), module);
  };

  // src/index.js
  var require_src = __commonJS((exports) => {
    __export(exports, {
      APP_AUTHOR: () => APP_AUTHOR,
      APP_DEBUG_STYLE: () => APP_DEBUG_STYLE,
      APP_ERROR_STYLE: () => APP_ERROR_STYLE2,
      APP_INFO_STYLE: () => APP_INFO_STYLE,
      APP_LOG_STYLE: () => APP_LOG_STYLE,
      APP_NAME: () => APP_NAME,
      APP_PERF_STYLE: () => APP_PERF_STYLE,
      APP_WARN_STYLE: () => APP_WARN_STYLE,
      BILL_AUTOFUNDED: () => BILL_AUTOFUNDED,
      BILL_BILLMODIFICATORS: () => BILL_BILLMODIFICATORS,
      BILL_FUNDED: () => BILL_FUNDED,
      BILL_OTHER: () => BILL_OTHER,
      OC_AUTOFUNDED: () => OC_AUTOFUNDED,
      OC_FUNDED: () => OC_FUNDED,
      OC_MAX_LEVEL: () => OC_MAX_LEVEL,
      OC_OTHER: () => OC_OTHER,
      OC_PRICE1: () => OC_PRICE1,
      OC_PRICE2: () => OC_PRICE2,
      OC_PRICE3: () => OC_PRICE3,
      OC_PRICE4: () => OC_PRICE4,
      OC_PRICE5: () => OC_PRICE5,
      OC_PRICE6: () => OC_PRICE6,
      OC_STATUS_0: () => OC_STATUS_0,
      OC_STATUS_1: () => OC_STATUS_1,
      OC_STATUS_2: () => OC_STATUS_2,
      OC_STATUS_3_F: () => OC_STATUS_3_F,
      OC_STATUS_3_M: () => OC_STATUS_3_M,
      SESSION_CANCEL: () => SESSION_CANCEL,
      SESSION_CANCEL_LATE: () => SESSION_CANCEL_LATE,
      SESSION_DONE: () => SESSION_DONE,
      SESSION_STUDENT_AWAY: () => SESSION_STUDENT_AWAY,
      TYPE_COACHING: () => TYPE_COACHING,
      TYPE_DEFENSE: () => TYPE_DEFENSE,
      TYPE_SESSION: () => TYPE_SESSION,
      default: () => src_default
    });
    const Facturier = {
      Cfg: {
        dbase: null
      },
      raf: null,
      start: async function() {
        await domReady();
        const bSupport = Facturier.checkSupport();
        console.log(`%cAre all functions supported ? : ${bSupport}`, APP_DEBUG_STYLE);
        if (document.querySelector(".MuiAvatar-img") === null) {
          console.log(`%c All condition not met, waiting element '.MuiAvatar-img' `, APP_DEBUG_STYLE);
          document.arrive(".MuiAvatar-img", Facturier._warmup);
        } else {
          console.log(`%c All condition already met go`, APP_DEBUG_STYLE);
          Facturier._warmup();
        }
      },
      checkSupport: function() {
        return true;
      },
      _warmup: function() {
        console.log("%c in _warmup", APP_DEBUG_STYLE);
        document.unbindArrive(Facturier._warmup);
        if (GM === void 0) {
          console.log("%cI am not in a tamper env");
          Facturier._userscriptless();
        } else {
          console.log(`%cTamper environment detected the version is ${GM.info.version}`, APP_DEBUG_STYLE);
        }
        GM_addStyle(GM_getResourceText("jspanelcss"));
        GM_addStyle(GM_getResourceText("toastifycss"));
        GM_addStyle(GM_getResourceText("simpledatatablecss"));
        GM_addStyle(GM_getResourceText("loading_barcss"));
        GM_config.init(appmenu);
        GM_registerMenuCommand("OC Facturier - configure", opencfg);
        if (GM_config.get("hackheaderzindex") === true) {
          document.getElementById("header").style.zIndex = 0;
        }
        GM_addStyle(".swal2-title{font-size:1.275em)");
        Facturier._main();
      },
      _userscriptless() {
        console.log(`%cIm'not in a Tamper environment so i need to load js scripts`, APP_DEBUG_STYLE);
      },
      _main: function() {
        console.log("​​​%cMainLoaded​​​", APP_DEBUG_STYLE);
        gm_perf_default.paintTiming();
        gm_perf_default.longTaskTiming();
        let adapter = new LocalStorage("db");
        var db = low(adapter);
        db.defaults({students: [], sessions: [], f_archives: [], history_session_cache: [], meta: [], students_history: []}).write();
        Facturier.Cfg.dbase = db;
        dayjs.extend(dayjs_plugin_isSameOrAfter);
        dayjs.extend(dayjs_plugin_isSameOrBefore);
        dayjs.extend(dayjs_plugin_isBetween);
        dayjs.extend(dayjs_plugin_localeData);
        dayjs.extend(dayjs_plugin_localeData);
        dayjs.extend(dayjs_plugin_customParseFormat);
        if (document.querySelector(".panel.menuBar.flex.draggable") === null) {
          ui_default.init();
        }
        if (GM_config.get("alwaysaddcbox") === true) {
          addCbox();
        }
        dayjs.locale("fr");
        if (db.get("meta").value() === void 0) {
          console.log("%cDb dont' contain meta table create it", APP_DEBUG_STYLE);
          db.assign({meta: []}).write();
        }
        let sDbVersion = db.get("meta").find({key: "dbVersion"}).value().value;
        if (sDbVersion === void 0) {
          console.log(db.get("meta").value());
          console.log("%cDb dont' contain dbVersion field in meta table create it", APP_DEBUG_STYLE);
          db.get("meta").push({key: "dbVersion", value: "1.0.0"}).write();
          sDbVersion = db.get("meta").find({key: "dbVersion"}).value().value;
        }
        if (semverCompare(GM.info.script.version, sDbVersion) == 1) {
          console.log(`%cDB is in version: ${db.get("meta").value().dbVersion} need to go to version ${GM.info.script.version}`, APP_DEBUG_STYLE);
          dbase_default.update(GM.info.script.version);
        }
        fetch_inject_default(["https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"]).then(async function(e) {
          console.log("apline js fetched", e);
        });
        if (GM_config.get("use_custom_css") === true) {
          let sDependencies = GM_config.get("custom_css_url");
          let rDependencies = sDependencies.split(",");
          if (rDependencies.length !== 0) {
            console.log(`%cWanna inject Custom CSS from URL:${rDependencies}`, APP_DEBUG_STYLE);
            fetch_inject_default([rDependencies]).then(() => {
              console.log(`%cCustom CSS from URL:${rDependencies} loaded`, APP_DEBUG_STYLE);
            }).catch((err) => console.log(`%cError detected when loading dependencies ${err}`, APP_ERROR_STYLE));
          } else {
            let sData = GM_config.get("custom_css_data");
            if (sData.length() > 0) {
              console.log(`%cNeed to inject a custom css in application content is ${sData}`, APP_DEBUG_STYLE);
              const styleTag = document.createElement("style");
              styleTag.innerHTML = sData;
              document.head.insertAdjacentElement("beforeend", styleTag);
            }
          }
        }
        if (GM.info.script.downloadURL === "http://localhost:8000/dist/app-facturier.iife.js") {
          console.log("%cALERTE .... version locale !!!!!! ", "background-color:coral;color:white");
          unsafeWindow.Facturier = {libs: [], cfg: {dbase: null}, klass: []};
          unsafeWindow.Facturier.cfg.dbase = Facturier.Cfg.dbase;
          unsafeWindow.Facturier.libs.push({id: "fetchInject", ptr: fetch_inject_default});
          unsafeWindow.Facturier.libs.push({id: "dayjs", ptr: dayjs});
          unsafeWindow.Facturier.klass.push({id: "Student", ptr: students_default});
          unsafeWindow.Facturier.klass.push({id: "Session", ptr: sessions_default});
          unsafeWindow.Facturier.klass.push({id: "Archive", ptr: archives_default});
          unsafeWindow.Facturier.klass.push({id: "History", ptr: history_default});
          unsafeWindow.Facturier.klass.push({id: "StudentHistory", ptr: students_history_default});
          console.log("%cImportants values are exported in unsafeWindow.Facturier", APP_DEBUG_STYLE);
          console.log("%c test readfile", APP_DEBUG_STYLE);
          readFile("file:////media/pwyll/USB120Go/DevStt/UserScripts/SttAddon/src/update_data_base.js", function(_res) {
            console.log(_res);
          });
          Facturier.loadDependencies();
        } else {
          console.log(`%c GM.info.script.downloadURL url : ${GM.info.script.downloadURL}`, APP_DEBUG_STYLE);
        }
      },
      loadDependencies: function() {
        let rDependencies = [];
        rDependencies.push("http://localhost:8000/src/branch01/sandbox.js");
        rDependencies.push("http://localhost:8000/src/branch01/sandbox.css");
        fetch_inject_default(rDependencies).then(() => {
          console.log(`dependencies ${rDependencies} loaded`);
        });
      },
      dbUpdate: function() {
        console.log("%c Need to update DB", APP_DEBUG_STYLE);
        if (semverCompare(GM.info.script.version, "1.00.0006") == 0) {
          console.log("%c Need to update DB to version '1.00.0006'", APP_DEBUG_STYLE);
          dbase_default.update("1.00.0006");
        }
      },
      overrideDebug: function() {
        var open = window.XMLHttpRequest.prototype.open, send = window.XMLHttpRequest.prototype.send;
        function openReplacement(method, url, async, user, password) {
          this._url = url;
          return open.apply(this, arguments);
        }
        function sendReplacement(data) {
          if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
          }
          console.log(`%c Request sent : ${data}`, APP_DEBUG_STYLE);
          this.onreadystatechange = onReadyStateChangeReplacement;
          return send.apply(this, arguments);
        }
        function onReadyStateChangeReplacement() {
          console.log(`%c Ready state changed to: ${this.readyState}`, APP_DEBUG_STYLE);
          if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
          }
        }
        window.XMLHttpRequest.prototype.open = openReplacement;
        window.XMLHttpRequest.prototype.send = sendReplacement;
      }
    };
    if (window.Facturier !== void 0) {
      window.Facturier.start();
    } else {
      Facturier.start();
    }
    var src_default = Facturier;
  });

  // src/gmc.polyfills.js
  var GMC = {
    async XHR(details) {
      const xhr = window.GM_xmlhttpRequest || (GM ? GM.xmlHttpRequest : null);
      if (!xhr) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        Object.assign(details, {
          onabort: reject,
          onerror: reject,
          onload: resolve,
          ontimeout: reject
        });
        xhr(details);
      });
    },
    async getValue(name, failv = null) {
      if (window.GM_getValue) {
        return Promise.resolve(GM_getValue(name) || failv);
      } else {
        return await GM.getValue(name) || failv;
      }
    },
    async setValue(name, value) {
      if (window.GM_setValue) {
        GM_setValue(name, value);
      } else {
        GM.setValue(name, value);
      }
    }
  };

  // src/constants.js
  const APP_NAME = "OC-Addons";
  const APP_AUTHOR = "Stéphane TORCHY";
  const APP_DEBUG_STYLE = "background-color:green;color:white";
  const APP_LOG_STYLE = "background-color:black;color:white";
  const APP_WARN_STYLE = "background-color:coral;color:white";
  const APP_INFO_STYLE = "background-color:cyan;color:white";
  const APP_ERROR_STYLE2 = "background-color:red;color:white";
  const APP_PERF_STYLE = "background-color:blue;color:white";
  const OC_AUTOFUNDED = "auto-financé";
  const OC_FUNDED = "financé par un tiers";
  const OC_OTHER = "autre";
  const OC_STATUS_0 = "réalisée";
  const OC_STATUS_1 = "annulée";
  const OC_STATUS_2 = "annulée tardivement";
  const OC_STATUS_3_M = "étudiant absent";
  const OC_STATUS_3_F = "étudiante absente";
  const OC_MAX_LEVEL = 6;
  const OC_PRICE1 = 30;
  const OC_PRICE2 = 35;
  const OC_PRICE3 = 40;
  const OC_PRICE4 = 45;
  const OC_PRICE5 = 50;
  const OC_PRICE6 = 55;
  const BILL_AUTOFUNDED = 0;
  const BILL_FUNDED = 1;
  const BILL_OTHER = 2;
  const BILL_BILLMODIFICATORS = [{pathId: 158, path: "158-trouvez-lemploi-qui-vous-correspond", value: 2}];
  const SESSION_DONE = 0;
  const SESSION_CANCEL = 1;
  const SESSION_CANCEL_LATE = 2;
  const SESSION_STUDENT_AWAY = 3;
  const TYPE_SESSION = 0;
  const TYPE_DEFENSE = 1;
  const TYPE_COACHING = 2;

  // src/utils.js
  var domReady = function() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  };
  var _fetch = async function(sUrl = "", sPath = "", bAll = false) {
    console.info(`%cfetch() waiting return from : ${sUrl}`, APP_DEBUG_STYLE);
    const response = await GMC.XHR({
      method: "GET",
      url: sUrl,
      responseType: "text/html",
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      onprogress: function(e) {
      }
    }).catch((error) => {
      console.error(`%cError ${error}`, APP_ERROR_STYLE2);
    });
    let domparser = new DOMParser();
    let doc = domparser.parseFromString(response.responseText.replace(/\n/mg, ""), "text/html");
    let sCaptcha = doc.querySelector("meta[id=captcha-bypass]");
    if (sCaptcha !== null) {
      console.error(`%cError CloudFlare CAPTCHA : ${doc.querySelector("title").innerText}`, APP_DEBUG_STYLE);
      throw new Error("Must Respond to Cloudflare Captcha or waiting....");
    }
    var oDom = {};
    if (bAll === true) {
      oDom = doc.querySelectorAll(sPath);
    } else {
      oDom = doc.querySelector(sPath);
    }
    return oDom;
  };
  var getKey = function(el, idx = -1) {
    try {
      var _t1 = (el.children[0].href || "/").split("/");
      return _t1[_t1.length + idx];
    } catch (e) {
      console.error(`%cError in getkey${e.stack || e}`, APP_ERROR_STYLE2);
    }
  };
  var extractDate = function(sWhen) {
    var _t = sWhen.trim().split(" ");
    try {
      var id = dayjs_locale_fr.months.findIndex((m) => m === _t[1]) + 1;
    } catch (e) {
      console.error(`%cError in extractDate${e.stack || e}`, APP_ERROR_STYLE2);
    }
    return `${_t[2]}-${id}-${_t[0]}T${_t[4]}`;
  };
  var convertRowToDate = function(oDom, index11 = 0) {
    if (index11 === -1) {
      index11 = oDom.children.length - 1;
    }
    var sRowDate = oDom.children[index11].children[0].innerText;
    let f_sRowDate = extractDate(sRowDate);
    var dtRowDate = dayjs(f_sRowDate);
    return dtRowDate;
  };
  var sleep = function(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  var semverCompare = function(a, b) {
    var pa = a.split(".");
    var pb = b.split(".");
    for (var i = 0; i < 3; i++) {
      var na = Number(pa[i]);
      var nb = Number(pb[i]);
      if (na > nb)
        return 1;
      if (nb > na)
        return -1;
      if (!isNaN(na) && isNaN(nb))
        return 1;
      if (isNaN(na) && !isNaN(nb))
        return -1;
    }
    return 0;
  };
  var readFile = function readFile2(_path, _cb) {
    console.info("Reading:", _path);
    return fetch(_path, {mode: "same-origin"}).then(function(_res) {
      return _res.blob();
    }).then(function(_blob) {
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        _cb(this.result);
      });
      reader.readAsText(_blob);
    });
  };
  var matrix = function(aSizes) {
    const _matrix = aSizes;
    const _iSize = aSizes.reduce(function(a, c) {
      return a * c;
    });
    var _data = new Array(_iSize);
    const set = function(...args) {
      const data = args.pop();
      if (args.length !== aSizes.length) {
        throw "Wrong matrix dimensions, need " + aSizes.length + ", you provide " + data.length + "!";
      }
      if (checkType(args) === 0) {
        throw "Wrong type for set need one or more int has dimension, check type of!";
      }
      const _r = getIndex(args);
      _data[_r] = data;
      return data;
    };
    const get = function(...args) {
      if (args.length !== aSizes.length) {
        throw "Wrong matrix dimensions, need " + aSizes.length + ", you provide " + args.length + "!";
      }
      if (checkType(args) === 0) {
        throw "Wrong type for set need one or more int has dimension, check type of!";
      }
      const _r = getIndex(args);
      return _data[_r];
    };
    const del = function(...args) {
      const _r = getIndex(args);
      _data[_r] = void 0;
      return _data[_r] === void 0;
    };
    const toConsole = function() {
      console.group("dump table");
      console.table(_data);
      console.groupEnd("dump table");
    };
    const getIndex = function(aValues) {
      return aValues.reduce(function(accumulator, currentValue, currentIndex, array) {
        let _t = _matrix.slice(currentIndex + 1);
        let _ratio = _t.length > 0 ? _t.reduce(function(a, c) {
          return a * c;
        }) : 1;
        return accumulator + currentValue * _ratio;
      }, 0);
    };
    const checkType = function(aValues) {
      return aValues.reduce((a, e) => a & typeof e === "number", 1);
    };
    return Object.freeze({
      set,
      get,
      del,
      toConsole
    });
  };
  var assert = function(condition, errorMessage, ErrorType = Error) {
    if (!condition)
      throw new ErrorType(errorMessage);
  };

  // src/polyfills.js
  HTMLElement.prototype.appendFirst = function(childNode) {
    if (this.firstChild)
      this.insertBefore(childNode, this.firstChild);
    else
      this.appendChild(childNode);
  };

  // src/components.js
  var popupDateSelector = async function(dtFrom = null, dtTo = null, bMonthAdjustment = true) {
    var sHtml = "";
    sHtml += "<style>";
    sHtml += "form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}";
    sHtml += "form input {background: #fff;border: 1px solid #9c9c9c;}";
    sHtml += "form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}";
    sHtml += "form button:hover {background: gold;}";
    sHtml += "form label {padding: 0.5em 0.5em 0.5em 0;}";
    sHtml += "form input {padding: 0.7em;margin-bottom: 0.5rem;}";
    sHtml += "form input:focus {outline: 3px solid gold;}";
    sHtml += "@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}label {text-align: right;grid-column: 1 / 2;}input,button {grid-column: 2 / 3;}}";
    sHtml += "</style>";
    sHtml += '<form class="form1" action="">';
    sHtml += '<label for="dtFrom" class="date">Date de début</label>';
    if (dtFrom) {
      sHtml += '<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31" value="' + dayjs(dtFrom).format("YYYY-MM-DD") + '">';
    } else {
      sHtml += '<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
    }
    sHtml += '<label for="dtTo" class="date">Date de fin</label>';
    if (dtFrom) {
      sHtml += '<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31" value="' + dayjs(dtTo).format("YYYY-MM-DD") + '">';
    } else {
      sHtml += '<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';
    }
    sHtml += "</form>";
    const {value: formValues} = await Swal.fire({
      title: "<strong>Choix de la période</strong>",
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "top-start",
      grow: "row",
      footer: "Choisissez la période pour la sélection des temps facturés",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById("dtFrom").value,
          document.getElementById("dtTo").value
        ];
      },
      onRender: (e) => {
      },
      onOpen: (el) => {
        if (bMonthAdjustment === true)
          el.querySelector("#dtFrom").addEventListener("change", _handler = function() {
            document.getElementById("dtTo").value = dayjs(document.getElementById("dtFrom").value).endOf("month").format("YYYY-MM-DD");
          });
      },
      onClose: (el) => {
        if (bMonthAdjustment === true)
          el.querySelector("#dtFrom").removeEventListener("change", _handler);
      },
      onAfterClose: (el) => {
      },
      onDestroy: (el) => {
      }
    });
    dtFrom = dayjs(formValues[0]);
    dtTo = dayjs(formValues[1]);
    await sleep(250);
    return [dtFrom, dtTo];
  };
  var toastOk = async function(text) {
    await Swal.fire({
      position: "top-end",
      icon: "success",
      title: text,
      showConfirmButton: false,
      timer: 1500
    });
  };

  // src/archives.js
  const index = __toModule(require_src());
  class Archive {
    static tbl_name = "f_archives";
    static add = async function(oArchive) {
      let db = index.default.Cfg.dbase;
      let now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      let needle = {id: oArchive[0].to.format("YYYYMM"), data: oArchive, created_at: oArchive[0].now};
      console.log(`%cWill create archive for id ${oArchive[0].to.format("YYYYMM")} (YYYYMM)`, APP_DEBUG_STYLE);
      db.get(Archive.tbl_name).push(JSON.parse(JSON.stringify(needle))).write();
    };
    static exists = function(needle) {
      let db = index.default.Cfg.dbase;
      let _r = db.get(Archive.tbl_name).find({id: needle}).value();
      if (_r === void 0) {
        return false;
      } else {
        return true;
      }
    };
    static get = function(needle) {
      let db = index.default.Cfg.dbase;
      var _r = db.get(Archive.tbl_name).find({id: needle}).value();
      if (_r === void 0) {
        throw Error("Erreur qui ne devrait jamais arriver en Archive.get");
        return false;
      } else {
        console.log(`%cWill use archive for id ${needle} (YYYYMM)`, APP_DEBUG_STYLE);
        return _r;
      }
    };
    static delete = function(dtFrom = null, dtTo = null) {
      let db = index.default.Cfg.dbase;
      if (typeof dtFrom === "string") {
        dtFrom = dtFrom.format("YYYY-MM-DD");
      }
      if (typeof dtTo === "string") {
        dtTo = dtTo.format("YYYY-MM-DD");
      }
      if (dtFrom === null && dtTo == null) {
        console.log(`%cWanna suppress ALL Archives from DB `, APP_DEBUG_STYLE);
        db.get(Archive.tbl_name).remove().write();
        return;
      }
      if (dtTo == null) {
        db.get(Archive.tbl_name).remove(function(o) {
          return dayjs(o.id, "YYYYMM").isBefore(dtTo), "month";
        }).write();
        return;
      }
      if (dtFrom == null) {
        db.get(Archive.tbl_name).remove(function(o) {
          return dayjs(o.id, "YYYYMM").isAfter(dtFrom, "month");
        }).write();
        return;
      }
      db.get(Archive.tbl_name).remove(function(o) {
        return dayjs(o.id, "YYYYMM").isBetween(dtFrom, dtTo, "month", "[]");
      }).write();
    };
  }
  var archives_default = Archive;

  // src/core.js
  class Core {
    static isInOldMode = function(date) {
      var dtDate = null;
      if (typeof date === "string") {
        dtDate = dayjs(date);
      } else {
        dtDate = date;
      }
      try {
        return dtDate.isBefore(Core.getOldModeDate());
      } catch (e) {
        throw Error("Erreur qui ne devrait jamais arriver en IsInOldMode (probablement un probleme sur la conversion de la date en objet dayjs:" + e.stack || e);
      }
    };
    static getOldModeDate = function() {
      return dayjs("2020-06-01");
    };
    static getAppVersion = function() {
      return GM.info.script.version;
    };
  }
  var core_default = Core;

  // src/students_history.js
  const index2 = __toModule(require_src());
  var fStudentHistory = function() {
    const TBL_NAME = "students_history";
    const TYPE_FUNDING = 1;
    const TYPE_PATH = 2;
    const getType = function(sType2) {
      if (sType2.toUpperCase() === "FUNDING")
        return TYPE_FUNDING;
      if (sType2.toUpperCase() === "PATH")
        return TYPE_PATH;
      throw Error("Erreur qui ne devrait jamais arriver en getype");
      return false;
    };
    const addFunding = function(sStudentId, data, created2 = null) {
      return add(sStudentId, TYPE_FUNDING, data, created2);
    };
    const addPath = function(sStudentId, data, created2 = null) {
      return add(sStudentId, TYPE_PATH, data, created2);
    };
    const add = function(sStudentId, iType, data, created2 = null) {
      assert(typeof sStudentId === "string", "You must provide a string.", TypeError);
      const db = index2.default.Cfg.dbase;
      if (typeof created2 === "string") {
        created2 = dayjs(created2);
      }
      if (created2 === null) {
        created2 = dayjs();
      }
      assert(created2 instanceof dayjs, "created date must be a string, a dayjs instance or null.", TypeError);
      let me = {id: sStudentId, type: 0 | iType, value: data, date: created2.valueOf(), humanDate: created2.format("YYYY-MM-DDTHH:mm:ssZZ")};
      console.log(`%cAdd in student history at date ${dayjs(me.date).format("YYYY-MM-DDTHH:mm:ssZZ")} data ${data} with type:${iType}`, APP_DEBUG_STYLE);
      return db.get(TBL_NAME).push(JSON.parse(JSON.stringify(me))).write();
    };
    const remove = function(sStudentId, iType = null, dtFrom = null) {
      const db = index2.default.Cfg.dbase;
      if (sStudentId == null && iType == null && dtFrom == null) {
        console.log(`%cRemove all in student history`, APP_DEBUG_STYLE);
        return db.get(TBL_NAME).remove().write();
      }
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      if (dtFrom == null) {
        if (iType == null) {
          console.log(`%cRemove for student id:${sStudentId} history for all type of event`, APP_DEBUG_STYLE);
          return db.get(TBL_NAME).remove({id: sStudentId}).write();
        } else {
          console.log(`%cRemove for student id:${sStudentId} history with event type:${type}`, APP_DEBUG_STYLE);
          return db.get(TBL_NAME).remove({id: sStudentId, type: iType}).write();
        }
      }
      console.log(`%cRemove for student id:${sStudentId} history at date ${dtFrom.format("DD/MM/YYYY")} with event type:${type}`, APP_DEBUG_STYLE);
      return db.get(TBL_NAME).remove({id: sStudentId, type: iType, date: dtFrom.valueOf()}).write();
    };
    const find = function(sStudentId, iType, dtFrom = null) {
      const db = index2.default.Cfg.dbase;
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      if (dtFrom === null) {
        dtFrom = dayjs();
      }
      console.log(`%cSearching in student history at date ${dtFrom.format("DD/MM/YYYY")} any data with type:${iType}`, APP_DEBUG_STYLE);
      var _iBaseDay = +dtFrom.valueOf();
      var _r = db.get(TBL_NAME).filter((o) => o.id === sStudentId && o.type & iType).map((i) => i.date - _iBaseDay).filter((i) => i >= 0).value();
      if (_r.length == 0) {
        console.log(`%cThere is no data in student history at date ${dtFrom.format("DD/MM/YYYY")} with type:${iType}`, APP_DEBUG_STYLE);
        return void 0;
      }
      const min = (arr) => Math.min(...arr);
      let _needle = _iBaseDay + min(_r);
      return db.get(TBL_NAME).filter((o) => o.id === sStudentId && o.type & iType && o.date == _needle).value()[0];
    };
    const isFunding = function(data) {
      return is(data, TYPE_FUNDING);
    };
    const isPath = function(data) {
      return is(data, TYPE_PATH);
    };
    const is = function(data, type2) {
      return data.type & type2;
    };
    return Object.freeze({
      addFunding,
      addPath,
      getType,
      remove,
      find,
      isFunding,
      isPath,
      tbl_name: TBL_NAME
    });
  };
  const StudentHistory = fStudentHistory();
  var students_history_default = StudentHistory;

  // src/students.js
  const index3 = __toModule(require_src());
  class Student {
    static tbl_name = "students";
    static add = function(sStudentId, sStudentFullName = "noname", sStudentPath = "nopath", sStudentFunding = "unknown", created2) {
      let db = index3.default.Cfg.dbase;
      var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      let me = {id: sStudentId, fullname: sStudentFullName, path: sStudentPath, funding: sStudentFunding, created: now};
      db.get(Student.tbl_name).push(JSON.parse(JSON.stringify(me))).write();
    };
    static exists = function(needle, dtFrom = null) {
      let _r = Student.findById(needle, dtFrom);
      console.log(`%cStudent ${needle} exists in db ? ${_r === void 0 ? false : true}`, APP_DEBUG_STYLE);
      return _r === void 0 ? false : true;
    };
    static findById = function(sNeedle, dtFrom = null) {
      assert(typeof sNeedle === "string", "You must provide a string.", TypeError);
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      ;
      if (dtFrom == null) {
        return Student.m_findById(sNeedle, dtFrom);
      }
      return Student.m_findById(sNeedle, dtFrom.format("YYYY-MM-DDTHH:mm:ssZZ"));
    };
    static _findById = function(sNeedle, dtFrom = null) {
      let db = index3.default.Cfg.dbase;
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      console.log(`%cSearching student with id:${sNeedle} in db`, APP_DEBUG_STYLE);
      var _r = db.get(Student.tbl_name).find({id: sNeedle}).value();
      if (_r === void 0) {
        return void 0;
      } else {
        if (dtFrom !== null) {
          var _rClone = {..._r};
          var _rFunding = students_history_default.find(sNeedle, students_history_default.getType("FUNDING"), dtFrom);
          if (_rFunding !== void 0) {
            _rClone.funding = _rFunding.value;
          }
          var _rPath = students_history_default.find(sNeedle, students_history_default.getType("PATH"), dtFrom);
          if (_rPath !== void 0) {
            _rClone.path = _rPath.value;
          }
          return _rClone;
        }
        return _r;
      }
    };
    static m_findById = moize.default(Student._findById, {
      maxAge: 6e5,
      isSerialized: true,
      onCacheHit: function() {
        console.log("%cGet data from cache", APP_DEBUG_STYLE);
      }
    });
    static getFunding = function(sId, dtFrom = null) {
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      ;
      return Student.m_getFunding(sId, dtFrom);
    };
    static _getFunding = function(sId, dtFrom = null) {
      let _r = Student.findById(sId, dtFrom);
      if (_r === void 0) {
        console.log(`%cStudent ${studentId} is not in db, fetchin data:'funded mode' from webpage`, APP_DEBUG_STYLE);
        return Student.getFundingFomDashboard(studentId).toLowerCase();
      } else {
        return _r.funding.toLowerCase();
      }
    };
    static m_getFunding = moize.default(Student._getFunding, {
      maxAge: 6e5,
      isSerialized: true
    });
    static isAutoFunded = function(iStudentId) {
      console.log(`%cFUNCTION DEPRECATED !!!!!!!!!!!!!!!!!!!!!! `, APP_ERROR_STYLE2);
      return Student.getFunded(iStudentId).toLowerCase() === OC_AUTOFUNDED;
    };
    static getFundingFomDashboard = async function(id) {
      const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${id}/dashboard`, ".mentorshipStudent__details > p");
      return oDom.innerText.trim();
    };
    static getPath = async function(sId, dtFrom = null) {
      let _r = Student.findById(sId, dtFrom);
      if (_r == void 0) {
        console.log(`%cStudent ${sId} is not in db, fetching data: 'path' from webpage ....`, APP_DEBUG_STYLE);
        const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${sId}/dashboard`, "a[href*='paths/']");
        if (oDom.innerText.length == 0) {
          console.error(`%cStudent path is not readable from url : https://openclassrooms.com/fr/mentorship/students/${sId}/dashboard`, APP_ERROR_STYLE2);
        }
        return oDom.innerText.trim();
      } else {
        return _r.path;
      }
    };
    static delete = function(dtFrom = null, dtTo = null) {
      let db = index3.default.Cfg.dbase;
      if (typeof dtFrom === "string") {
        dtFrom = dtFrom.format("YYYY-MM-DD");
      }
      if (typeof dtTo === "string") {
        dtTo = dtTo.format("YYYY-MM-DD");
      }
      if (dtFrom === null && dtTo == null) {
        console.log(`%cWanna suppress ALL Students from DB`, APP_DEBUG_STYLE);
        db.get(Student.tbl_name).remove().write();
        return;
      }
      if (dtTo == null) {
        db.get(Student.tbl_name).remove(function(o) {
          return dayjs(o.created, "YYYY-MM-DDTHH:mm:ssZ[Z]").isBefore(dtTo), "day";
        }).write();
        return;
      }
      if (dtFrom == null) {
        db.get(Student.tbl_name).remove(function(o) {
          return dayjs(o.created, "YYYY-MM-DDTHH:mm:ssZ[Z]").isAfter(dtFrom, "day");
        }).write();
        return;
      }
      db.get(Student.tbl_name).remove(function(o) {
        return dayjs(o.created, "YYYY-MM-DDTHH:mm:ssZ[Z]").isBetween(dtFrom, dtTo, "day", "[]");
      }).write();
    };
    static deleteById = function(sId, dtCreated = null) {
      let db = index3.default.Cfg.dbase;
      db.get("students").remove((o) => o.id === sId).write();
      console.log(`%cAll students with id:${sId} are removed from DataBase`, APP_DEBUG_STYLE);
    };
    static modifyFunding(sId, dtFrom, sNewState) {
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      ;
      assert(created instanceof dayjs, "modifyFunding date must be a string, a dayjs instance or null.", TypeError);
      const sCurFunding = Student.getFunding(sId, dtFrom);
      if (sNewState.toLower() === sCurFunding.toLower()) {
        console.log(`%cFundingMode ${sNewState} is identical as current: ${sCurrent}, nothing to do`, APP_DEBUG_STYLE);
        return;
      }
      if (sNewState !== OC_AUTOFUNDED || sNewState != OC_FUNDED || sNewState !== OC_OTHER) {
        console.log(`%cWarning this state is unknown ${sNewState}`, APP_WARN_STYLE);
      }
      const db = index3.default.Cfg.dbase;
      const dtNow = dayjs().format("YYYY-MM-DDTHH:mm:ssZZ");
      if (dtFrom === null) {
        dtFrom = dtNow;
      }
      oLastHistory = students_history_default.find(sId, students_history_default.getType("FUNDING"), dtFrom);
      db.get(Student.tbl_name).find({id: sId}).assign({funding: sNewState}).write();
      students_history_default.addFunding(sId, sCurFunding, dtNow);
      if (dtFrom.isSameOrAfter(core_default.getOldModeDate())) {
        var oListToUpdate = db.get("sessions").filter((v) => v.who_id === sId && ((v2) => dayjs(v2.when).isSameOrAfter(dtFrom, "day")));
      } else {
        var oListToUpdate = db.get("sessions").filter((v) => v.who_id === sId && ((v2) => dayjs(v2.when).isSameOrAfter(core_default.getOldModeDate(), "day")));
      }
      for (var i = oListToUpdate.value().length; i -= 1; ) {
        console.log(`There is ${i} elements left to update`, APP_DEBUG_STYLE);
        oListToUpdate.get(i).assign({funding: sNewState}).write();
      }
    }
    static getAll = async (e, ctx) => {
      var bForceUpdate = false;
      let db = index3.default.Cfg.dbase;
      var sPath = "table.crud-list tbody";
      var aStudents = document.querySelectorAll(sPath)[1];
      const now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      var t0 = performance.now();
      var sFirstStudentId = getKey(aStudents.children[0].children[0], -2);
      await Student.getFundingFomDashboard(sFirstStudentId);
      console.log(`%cEstimated time for updating : ${(performance.now() - t0) * aStudents.children.length} ms`, APP_DEBUG_STYLE);
      Swal.fire({
        position: "top-end",
        icon: "info",
        toast: true,
        title: `mise à jour de la base de donnée des étudiants...
cela peut prendre du temps ~ ${(performance.now() - t0) * aStudents.children.length / 1e3} s`,
        showConfirmButton: false,
        timer: 1e3
      });
      await sleep(1e3);
      for (const el of aStudents.children) {
        toastOk(`Collecte les données de l'étudiant : ${el.children[0].innerText}`);
        var sStudentId = getKey(el.children[0], -2);
        var sStudentFullName = el.children[0].innerText;
        var sStudentPath = "non défini";
        if (el.children[1].firstElementChild) {
          sStudentPath = el.children[1].firstElementChild.href.split("/").pop();
        }
        let sStudentFunding = await Student.getFundingFomDashboard(sStudentId);
        var _r = Student.m_findById(sStudentId, null);
        if (_r === void 0) {
          console.log(`%cStudent ${sStudentFullName}(id:${sStudentId}) not present in database will create it`, APP_DEBUG_STYLE);
          return Student.add(sStudentId, sStudentFullName, sStudentPath, sStudentFunding, now);
        }
        if (sStudentFunding.toLowerCase() !== _r.funding.toLowerCase()) {
          db.get(Student.tbl_name).find({id: sStudentId}).assign({funding: sStudentFunding.toLowerCase()}).write();
          students_history_default.add(sStudentId, students_history_default.getType("FUNDING"), _r.funding.toLowerCase(), dayjs());
          console.log(`%cStudent ${sStudentFullName}(id:${sStudentId}) was already present in database but change of funding was detected (from ${_r.funding.toLowerCase()} to ${sStudentFunding.toLowerCase()})`, APP_DEBUG_STYLE);
        }
        if (sStudentPath !== _r.path) {
          db.get(Student.tbl_name).find({id: sStudentId}).assign({path: sStudentPath}).write();
          students_history_default.add(sStudentId, students_history_default.getType("PATH"), _r.path, dayjs());
          console.log(`%cStudent ${sStudentFullName}(id:${sStudentId}) was already present in database but change of path was detected (from ${_r.path} to ${sStudentPath})`, APP_DEBUG_STYLE);
        }
      }
    };
    static showList = function() {
      let db = index3.default.Cfg.dbase;
      let _r = db.get(Student.tbl_name).value();
      var sHtml = "";
      sHtml += "<table>";
      sHtml += "<caption>Liste des étudiant</caption>";
      sHtml += "<thead>";
      sHtml += "<tr>";
      sHtml += `<th>Nom</th><th>Parcours</th><th>Financement</th><th>Date de création</th><th>Edition</th>`;
      sHtml += "</tr>";
      sHtml += "</thead>";
      sHtml += "<tbody>";
      for (var idx in _r) {
        sHtml += "<tr>";
        sHtml += `<td>${_r[idx].fullname}</td><td>${_r[idx].path}</td><td>${_r[idx].funding}</td>`;
        sHtml += `<td>${dayjs(_r[idx].created, "YYYY-MM-DDTHH:mm:ssZ[Z]").format("DD/MM/YYYY à HH:mm")}</td>`;
        sHtml += `<td><a href="https://openclassrooms.com/fr/mentorship/students/${_r[idx].id}/dashboard">${_r[idx].id}</a></td>`;
        sHtml += "</tr>";
      }
      sHtml += "</tbody>";
      sHtml += "</table>";
      Swal.fire({
        title: "<strong>Liste des Etudiants</strong>",
        icon: "info",
        html: sHtml,
        showCloseButton: true,
        focusConfirm: false,
        position: "top-start",
        grow: "fullscreen",
        onOpen: (el) => {
          var myTable = el.querySelector("table");
          var dataTable = new simpleDatatables.DataTable(myTable);
        }
      });
    };
    static createManually = async function(sStudentId, sStudentName, sSessionDate) {
      let aPathList = ["non présent dans la liste", "Chef de projet digital", "Chef de projet SI", "Développeur d'application - Frontend", "Développeur Web", "Expert en stratégie marketing et communication ", "Production de contenu web avec CMS et Content Marketing ", "Tech lead"];
      var sHtml = "";
      sHtml += "<style>";
      sHtml += "form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}";
      sHtml += "form input {background: #fff;border: 1px solid #9c9c9c;}";
      sHtml += "form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}";
      sHtml += "form button:hover {background: gold;}";
      sHtml += "form label {padding: 0.5em 0.5em 0.5em 0;}";
      sHtml += "form input {padding: 0.7em;margin-bottom: 0.5rem;}";
      sHtml += "form input:focus {outline: 3px solid gold;}";
      sHtml += "@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}label {text-align: right;grid-column: 1 / 2;}input,button {grid-column: 2 / 3;}}";
      sHtml += "</style>";
      sHtml += '<form class="form1" action="">';
      sHtml += '<label for="student_id" class="name">Reference</label>';
      sHtml += '<input id="student_id" type="text" value="' + sStudentId + '">';
      sHtml += '<label for="student_name" class="name">Name</label>';
      sHtml += '<input id="student_name" type="text" value="' + sStudentName + '">';
      sHtml += '<label for="funding">Autofinancé</label>';
      sHtml += '<input id="funding" type="checkbox" value="autofunded">';
      sHtml += '<label for="student_path">Parcours</label>';
      sHtml += '<input id="student_path" name="student_path" type="text" list="student_path-list">';
      sHtml += '<datalist id="student_path-list">';
      for (var i in aPathList) {
        sHtml += `<option>${aPathList[i]}</option>`;
      }
      sHtml += "/<datalist>";
      sHtml += '<label for="session_date">Date</label>';
      sHtml += '<input id="session_date" type="date" max="2030-12-31" min="2010-12-31" value="' + dayjs(sSessionDate).format("YYYY-MM-DD") + '">';
      sHtml += "</form>";
      const {value: formValues} = await Swal.fire({
        title: "<strong>Ajout d'un étudiant en mode manuel</strong>",
        icon: "info",
        html: sHtml,
        showCloseButton: true,
        focusConfirm: false,
        position: "top-start",
        grow: "row",
        footer: `votre étudiant(e) ${sStudentName} n'a pas été trouvé`,
        preConfirm: () => {
          return [
            document.getElementById("student_id").value,
            document.getElementById("student_name").value,
            document.getElementById("student_path").value,
            document.getElementById("funding").checked,
            document.getElementById("session_date").value
          ];
        }
      });
      if (formValues) {
        var sFundedBy = "";
        if (formValues[3] === true) {
          sFunding = OC_AUTOFUNDED;
        } else {
          sFunding = OC_FUNDED;
        }
        Student.add(formValues[0], formValues[1], formValues[2], sFunding, formValues[4]);
      }
    };
  }
  var students_default = Student;

  // src/sessions.js
  const index4 = __toModule(require_src());
  class Session {
    static tbl_name = "sessions";
    static add = async function(oSession) {
      let db = index4.default.Cfg.dbase;
      if (GM_config.get("checksessionalreadyexists") === true) {
        var bCheckExistsBeforAdd = true;
      }
      if (bCheckExistsBeforAdd === true && Session.exists(oSession.id) === true) {
        return;
      }
      if (core_default.isInOldMode(dayjs(oSession.when))) {
        console.log(`%cWe are in old mode`, APP_DEBUG_STYLE);
        oSession.funding = OC_FUNDED;
        if (oSession.type.toLowerCase() === "soutenance") {
          console.log(`%cThis is a defense, we DON't need to add the path to the session`, APP_DEBUG_STYLE);
          oSession.path = "this ia a defense no need for path";
        } else {
          oSession.path = "old mode no need for path";
        }
      } else {
        if (oSession.type.toLowerCase() === "soutenance") {
          console.log("%cThis is a defense nothing to do specially for now", APP_DEBUG_STYLE);
          oSession.funding = OC_FUNDED;
        } else {
          if (students_default.exists(oSession.who_id) === false) {
            await students_default.getAll();
            if (students_default.exists(oSession.who_id, oSession.when) == false) {
              console.warn(`%cStudent {oSession.who_id} which exists at ${oSession.when} still not exit in Db, have to manually create him/her`, APP_DEBUG_STYLE);
              return students_default.createManually(oSession.who_id, oSession.who_name, oSession.when);
            }
          }
          oSession.funding = await students_default.getFunding(oSession.who_id, oSession.when);
          oSession.path = await students_default.getPath(oSession.who_id, oSession.when);
        }
      }
      console.log(`%cSaving session id:${oSession.id} of ${oSession.who_name}(${oSession.who_id}) at ${oSession.when} to DB`, APP_DEBUG_STYLE);
      db.get(Session.tbl_name).push(JSON.parse(JSON.stringify(oSession))).write();
    };
    static exists = function(sessionId) {
      let db = index4.default.Cfg.dbase;
      console.log(`%cWill search existence of session id:${sessionId} in database`, APP_DEBUG_STYLE);
      var r2 = db.get(Session.tbl_name).find({id: sessionId}).value();
      if (r2 === void 0) {
        return false;
      } else {
        return true;
      }
    };
    static delete = function(dtFrom = null, dtTo = null) {
      let db = index4.default.Cfg.dbase;
      if (typeof dtFrom === "string") {
        dtFrom = dtFrom.format("YYYY-MM-DD");
      }
      if (typeof dtTo === "string") {
        dtTo = dtTo.format("YYYY-MM-DD");
      }
      if (dtFrom === null && dtTo == null) {
        console.log(`%cWanna suppress ALL Sessions from DB`, APP_DEBUG_STYLE);
        db.get(Session.tbl_name).remove().write();
        return;
      }
      if (dtTo == null) {
        db.get(Session.tbl_name).remove(function(o) {
          return dayjs(o.when).isBefore(dtTo), "day";
        }).write();
        return;
      }
      if (dtFrom == null) {
        db.get(Session.tbl_name).remove(function(o) {
          return dayjs(o.when).isAfter(dtFrom, "day");
        }).write();
        return;
      }
      db.get(Session.tbl_name).remove(function(o) {
        return dayjs(o.when).isBetween(dtFrom, dtTo, "day", "[]");
      }).write();
    };
    static deleteById = function(sId) {
      let db = index4.default.Cfg.dbase;
      db.get("sessions").remove((o) => o.id === sId).write();
      console.log(`%cSession ${sId} suppressed from DB`, APP_DEBUG_STYLE);
    };
    static getBetween(dtFrom, dtTo) {
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      ;
      if (typeof dtTo === "string") {
        dtFrom = dayjs(dtTo);
      }
      ;
      let db = index4.default.Cfg.dbase;
      let _r = db.get(Session.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day") && dayjs(v.when).isSameOrAfter(dtFrom, "day")).value();
      return _r;
    }
    static parseTable = function(oEl) {
      var sWhen = oEl.children[0].children[0].innerText;
      var sId = getKey(oEl.children[0]);
      var sWho = oEl.children[1].children[0].innerText.trim();
      var iWho = getKey(oEl.children[1], -2);
      var sStatus = oEl.children[2].innerText.trim().toLowerCase();
      var sType2 = oEl.children[3].children.length ? oEl.children[3].children[0].innerText.trim().toLowerCase() : "session";
      var sLvl = -1;
      if (oEl.children[4].children.length > 0) {
        sLvl = oEl.children[4].children[0].innerText.trim();
      }
      sWhen = extractDate(sWhen);
      var me = {id: sId, when: sWhen, who_id: iWho, who_name: sWho, status: sStatus, type: sType2, lvl: sLvl};
      return me;
    };
  }
  var sessions_default = Session;

  // src/accounting.js
  const index5 = __toModule(require_src());
  class Accounting {
    static calculateBill = function(dtFrom, dtTo) {
      let sArchiveId = dtTo.format("YYYYMM");
      if (archives_default.exists(sArchiveId) === true) {
        console.log(`%cUse Archived version ${sArchiveId} of accounting`, APP_DEBUG_STYLE);
        let _r = archives_default.get(sArchiveId);
        return _r.data;
      }
      if (typeof dtFrom === "string") {
        dtFrom = dtFrom.format("YYYY-MM-DD");
      }
      if (typeof dtTo === "string") {
        dtTo = dtTo.format("YYYY-MM-DD");
      }
      return Accounting.m_calculateBill(dtFrom, dtTo);
    };
    static _calculateBill = function(dtFrom, dtTo) {
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      if (typeof dtTo === "string") {
        dtTo = dayjs(dtTo);
      }
      const now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      var _1 = 0, _2 = 0;
      var t0 = performance.now();
      const db = index5.default.Cfg.dbase;
      const dbSessions = db.get(sessions_default.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day") && dayjs(v.when).isSameOrAfter(dtFrom, "day"));
      const oSessions = dbSessions.value();
      const iSessionsNumber = oSessions.length;
      let oMeta = {from: dtFrom, to: dtTo, created_at: null, maxLevel: OC_MAX_LEVEL, number: 0, amount: 0, errors: {funding: [], level: [], path: [], status: [], type: []}, flatFee: []};
      let iNumber = 0;
      let iAmount = 0;
      let aBonus = [];
      _1 = performance.now();
      const aPu = Accounting.getPriceList(dtFrom);
      _2 = performance.now();
      console.log("%cGetPriceList took " + (_2 - _1) + " milliseconds.", APP_PERF_STYLE);
      let theSessionsMatrix = matrix([OC_MAX_LEVEL + 1, OC_MAX_LEVEL + 1, OC_MAX_LEVEL + 1, OC_MAX_LEVEL + 1]);
      for (var _i = 0; _i < iSessionsNumber; _i += 1) {
        const oTheSession = oSessions[_i];
        var iStatus = 0;
        if (oTheSession.status === OC_STATUS_0)
          iStatus = SESSION_DONE;
        if (oTheSession.status === OC_STATUS_1)
          iStatus = SESSION_CANCEL;
        if (oTheSession.status === OC_STATUS_2)
          iStatus = SESSION_CANCEL_LATE;
        if (oTheSession.status === OC_STATUS_3_M || oTheSession.status === OC_STATUS_3_F)
          iStatus = SESSION_STUDENT_AWAY;
        var iType = 0;
        if (oTheSession.type.toLowerCase() === "session")
          iType = TYPE_SESSION;
        if (oTheSession.type.toLowerCase() === "soutenance")
          iType = TYPE_DEFENSE;
        if (oTheSession.path != void 0 && oTheSession.path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && oTheSession.type !== "soutenance")
          iType = TYPE_COACHING;
        var iFunding = 0;
        const bIsInOldMode = core_default.isInOldMode(dtFrom);
        if (bIsInOldMode === true) {
          iFunding = oTheSession.isFunded === true ? BILL_FUNDED : BILL_AUTOFUNDED;
        }
        if (oTheSession.funding === OC_AUTOFUNDED)
          iFunding = BILL_AUTOFUNDED;
        if (oTheSession.funding === OC_FUNDED)
          iFunding = BILL_FUNDED;
        if (oTheSession.funding === OC_OTHER)
          iFunding = BILL_OTHER;
        if (oTheSession.lvl < 0) {
          oMeta.errors.level.push(oTheSession);
          continue;
        }
        if (bIsInOldMode === false && oTheSession.funding !== OC_AUTOFUNDED && oTheSession.funding !== OC_FUNDED && oTheSession.funding !== OC_OTHER) {
          oMeta.errors.funding.push(oTheSession);
          continue;
        }
        if (oTheSession.type.toLowerCase() !== "session" && iType !== TYPE_DEFENSE && iType !== TYPE_COACHING) {
          oMeta.errors.type.push(oTheSession);
          continue;
        }
        if (oTheSession.status !== OC_STATUS_0 && oTheSession.status !== OC_STATUS_1 && oTheSession.status !== OC_STATUS_2 && oTheSession.status !== OC_STATUS_3_M && oTheSession.status !== OC_STATUS_3_F) {
          oMeta.errors.status.push(oTheSession);
          continue;
        }
        let toUpdate = theSessionsMatrix.get(iType, iStatus, iFunding, +oTheSession.lvl);
        if (toUpdate === void 0) {
          toUpdate = {number: 0, amount: 0, data: []};
        }
        toUpdate.number += 1;
        iNumber += 1;
        if (oTheSession.lvl < 0) {
          toUpdate.amount += 0;
          iAmount += 0;
        } else {
          toUpdate.amount += 1 * aPu[oTheSession.lvl][iType][iStatus][iFunding];
          iAmount += 1 * aPu[oTheSession.lvl][iType][iStatus][iFunding];
        }
        toUpdate.data.push(oTheSession);
        theSessionsMatrix.set(iType, iStatus, iFunding, +oTheSession.lvl, toUpdate);
        if (iType === TYPE_SESSION && iFunding === BILL_AUTOFUNDED) {
          aBonus.push({id: +oTheSession.who_id, who_id: oTheSession.who_id, who_name: oTheSession.who_name});
        }
      }
      var oBonus = [];
      _1 = performance.now();
      oBonus = _.uniqBy(aBonus, "id");
      oMeta.flatFee = oBonus;
      oMeta.number = iNumber;
      oMeta.amount = iAmount;
      if (oMeta.number + oMeta.errors.funding.length + oMeta.errors.level.length + oMeta.errors.path.length + oMeta.errors.status.length + oMeta.errors.type.length < iSessionsNumber) {
        console.log(`%cError total number of sessions is ${iSessionsNumber} and total number of sessions in bill ${iNumber} + all errors are different`, APP_ERROR_STYLE2);
        console.log("errors are", oMeta.errors);
        console.log("sessions are", oSessions);
      }
      oMeta.created_at = now;
      theSessionsMatrix.set(0, 0, 0, 0, oMeta);
      var t666 = performance.now();
      console.log("%cFunction took " + (t666 - t0) + " milliseconds.", APP_PERF_STYLE);
      return theSessionsMatrix;
    };
    static m_calculateBill = moize.default(Accounting._calculateBill, {
      maxAge: 12e4,
      isSerialized: true,
      onCacheAdd: function(c, o, m) {
        console.log("%cAdd data to cache", APP_DEBUG_STYLE);
        ;
      },
      onCacheHit: function() {
        console.log("%cGet data from cache", APP_DEBUG_STYLE);
      }
    });
    static getPriceList = function(dtFrom) {
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      ;
      var aPrice = [0, OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6];
      const bIsInOldMode = core_default.isInOldMode(dtFrom);
      var aPu = new Array(7);
      for (let _i = 1; _i <= OC_MAX_LEVEL; _i += 1) {
        let iPrice = aPrice[_i];
        let iPriceHalf = aPrice[_i] / 2;
        let iPriceQuart = aPrice[_i] / 4;
        if (bIsInOldMode) {
          aPu[_i] = new Array(3);
          aPu[_i][TYPE_SESSION] = new Array(5);
          aPu[_i][TYPE_SESSION][SESSION_DONE] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
          aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_FUNDED] = iPrice;
          aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_OTHER] = iPrice;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_FUNDED] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_OTHER] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE] = new Array(5);
          aPu[_i][TYPE_DEFENSE][SESSION_DONE] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
          aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_FUNDED] = iPrice;
          aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_OTHER] = iPrice;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_FUNDED] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_OTHER] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_COACHING] = new Array(5);
          aPu[_i][TYPE_COACHING][SESSION_DONE] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
          aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_FUNDED] = iPrice;
          aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_OTHER] = iPrice;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_FUNDED] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_OTHER] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
        } else {
          aPu[_i] = new Array(3);
          aPu[_i][TYPE_SESSION] = new Array(5);
          aPu[_i][TYPE_SESSION][SESSION_DONE] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_FUNDED] = iPrice;
          aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_OTHER] = iPrice;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_FUNDED] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_OTHER] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_FUNDED] = 0;
          aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_OTHER] = 0;
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY] = new Array(4);
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceQuart;
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE] = new Array(5);
          aPu[_i][TYPE_DEFENSE][SESSION_DONE] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
          aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_FUNDED] = iPrice;
          aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_OTHER] = iPrice;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_FUNDED] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_OTHER] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_FUNDED] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_OTHER] = 0;
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY] = new Array(4);
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
          aPu[_i][TYPE_COACHING] = new Array(5);
          aPu[_i][TYPE_COACHING][SESSION_DONE] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
          aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_FUNDED] = iPrice;
          aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_OTHER] = iPrice;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_FUNDED] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_OTHER] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_FUNDED] = 0;
          aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_OTHER] = 0;
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY] = new Array(4);
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
          aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
        }
      }
      return aPu;
    };
  }
  var accounting_default = Accounting;

  // src/history.js
  const index6 = __toModule(require_src());
  class History {
    static tbl_name = "history_session_cache";
    static getSessionPage = function(dtTo) {
      if (dtTo.get("day") < dtTo.daysInMonth()) {
        dtTo = dtTo.endOf("month");
      }
      console.log(`%cSearch in history session cache data for id: ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      let db = index6.default.Cfg.dbase;
      if (!db.has(History.tbl_name).value()) {
        throw Error(`DB ${History.db_name} NOT FOUND`);
        return -1;
      }
      let _r = db.get(History.tbl_name).find({id: +dtTo.format("YYYYMMDD")}).value();
      if (_r === void 0) {
        return -1;
      } else {
        return _r;
      }
    };
    static getNearestSessionPage = function(dtTo) {
      if (dtTo.get("day") < dtTo.daysInMonth()) {
        dtTo = dtTo.endOf("month");
      }
      console.log(`%cSearch in history session cache NEAREST cached data for id: ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      let db = index6.default.Cfg.dbase;
      if (!db.has(History.tbl_name).value()) {
        throw Error(`DB ${History.db_name} NOT FOUND`);
        return -1;
      }
      let _iBaseDay = +dtTo.format("YYYYMMDD");
      let _r = db.get(History.tbl_name).value().map((i) => +i.id - _iBaseDay).filter((i) => i > 0);
      const min = (arr) => Math.min(...arr);
      let _needle = min(_r) + _iBaseDay;
      console.log(`%cNearest data in history session cache is data with id: ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      _r = db.get(History.tbl_name).find({id: _needle}).value();
      if (_r === void 0) {
        return -1;
      } else {
        return _r;
      }
    };
    static getSameOrNearestSessionPage = function(dtTo) {
      let _r = History.getSessionPage(dtTo);
      if (_r === -1) {
        _r = History.getNearestSessionPage(dtTo);
      }
      return _r;
    };
    static delete = function(dtFrom = null, dtTo = null) {
      let db = index6.default.Cfg.dbase;
      if (typeof dtFrom === "string") {
        dtFrom = dtFrom.format("YYYY-MM-DD");
      }
      if (typeof dtTo === "string") {
        dtTo = dtTo.format("YYYY-MM-DD");
      }
      if (dtFrom === null && dtTo == null) {
        db.get(History.tbl_name).remove().write();
        console.log(`%cWanna suppress ALL History from DB`, APP_DEBUG_STYLE);
        return;
      }
      if (dtTo == null) {
        db.get(History.tbl_name).remove(function(o) {
          return dayjs(o.id, "YYYYMMDD").isBefore(dtTo), "day";
        }).write();
        return;
      }
      if (dtFrom == null) {
        db.get(History.tbl_name).remove(function(o) {
          return dayjs(o.id, "YYYYMMDD").isAfter(dtFrom, "day");
        }).write();
        return;
      }
      db.get(History.tbl_name).remove(function(o) {
        return dayjs(o.id, "YYYYMMDD").isBetween(dtFrom, dtTo, "day", "[]");
      }).write();
    };
    static addOrUpdateSessionPage = function(page = 1, dtTo = dayjs("1970-10-06")) {
      if (History.getSessionPage(dtTo) == -1) {
        History.addSessionPage(page, dtTo);
      } else {
        History.updateSessionPage(page, dtTo);
      }
    };
    static updateSessionPage = function(page = 1, dtTo = dayjs("1970-10-06")) {
      let db = index6.default.Cfg.dbase;
      let _r = History.getSessionPage(dtTo);
      if (_r == -1) {
        throw Error("session page not found in history");
        return -1;
      }
      db.get(History.tbl_name).find({id: +dtTo.format("YYYYMMDD")}).assign({page}).write();
    };
    static addSessionPage = function(page = 1, dtTo = dayjs("1970-10-06")) {
      let db = index6.default.Cfg.dbase;
      db.get(History.tbl_name).push(JSON.parse(JSON.stringify({id: +dtTo.format("YYYYMMDD"), page}))).write();
    };
  }
  var history_default = History;

  // src/date.lib.js
  var workday_count = function(start, end) {
    let lookup = [
      [0, 1, 2, 3, 4, 5, 5],
      [5, 1, 2, 3, 4, 5, 5],
      [4, 5, 1, 2, 3, 4, 4],
      [3, 4, 5, 1, 2, 3, 3],
      [2, 3, 4, 5, 1, 2, 2],
      [1, 2, 3, 4, 5, 1, 1],
      [0, 1, 2, 3, 4, 5, 0]
    ];
    return Math.trunc(end.diff(start, "days") / 7) * 5 + lookup[start.day()][end.day()];
  };

  // src/lists.js
  const index7 = __toModule(require_src());
  class List {
    static detail_bill = "truc";
    static getListDetailBill = function(dtFrom, dtTo) {
      let db = index7.default.Cfg.dbase;
      let _r = db.get(sessions_default.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day") && dayjs(v.when).isSameOrAfter(dtFrom, "day")).sortBy(function(o) {
        return dayjs(o.when).valueOf();
      }).value();
      const dtNewMode = core_default.getOldModeDate();
      let aPu_before = accounting_default.getPriceList(dtNewMode.subtract(1, "day"));
      let aPu_after = accounting_default.getPriceList(dtNewMode);
      let iCumul = 0;
      var _rClone = _.cloneDeep(_r);
      for (var i in _rClone) {
        var iPu2 = 0;
        var iFPu = 0;
        var bOldMode = true;
        var iStatus = 0;
        if (_rClone[i].status === OC_STATUS_0)
          iStatus = SESSION_DONE;
        if (_rClone[i].status === OC_STATUS_1)
          iStatus = SESSION_CANCEL;
        if (_rClone[i].status === OC_STATUS_2)
          iStatus = SESSION_CANCEL_LATE;
        if (_rClone[i].status === OC_STATUS_3_M || _rClone[i].status === OC_STATUS_3_F)
          iStatus = SESSION_STUDENT_AWAY;
        var iType = 0;
        if (_rClone[i].type.toLowerCase() === "session")
          iType = TYPE_SESSION;
        if (_rClone[i].type.toLowerCase() === "soutenance")
          iType = TYPE_DEFENSE;
        if (_rClone[i].path != void 0 && _rClone[i].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _rClone[i].type !== "soutenance")
          iType = TYPE_COACHING;
        var iFunding = 0;
        if (_rClone[i].funding === OC_AUTOFUNDED)
          iFunding = BILL_AUTOFUNDED;
        if (_rClone[i].funding === OC_FUNDED)
          iFunding = BILL_FUNDED;
        if (_rClone[i].funding === OC_OTHER)
          iFunding = BILL_OTHER;
        if (core_default.isInOldMode(dayjs(_rClone[i].when))) {
          iPu2 = +_rClone[i].lvl > 0 ? aPu_before[+_rClone[i].lvl][iType][iStatus][iFunding] : 0;
        } else {
          bOldMode = false;
          iPu2 = +_rClone[i].lvl > 0 ? aPu_after[+_rClone[i].lvl][iType][iStatus][iFunding] : 0;
        }
        iCumul += iPu2;
        _rClone[i].iPu = iPu2;
        _rClone[i].oldMode = bOldMode;
        _rClone[i].iCumul = iCumul;
      }
      return _rClone;
    };
    static getListStatistic = function(dtFrom, dtTo) {
      let dtCurFrom = dtFrom.clone();
      let dtCurTo = dtCurFrom.endOf("month");
      let aData = [];
      let aStat = [];
      let _m = 0;
      let _iMaxIndex = dtTo.diff(dtFrom, "month");
      var t0 = performance.now();
      while (dtCurFrom.isSameOrBefore(dtTo, "day")) {
        aData.push(accounting_default.calculateBill(dtCurFrom, dtCurTo));
        dtCurFrom = dtCurFrom.add(1, "month");
        dtCurTo = dtCurFrom.endOf("month");
      }
      var t1 = performance.now();
      console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
      dtCurFrom = dtFrom.clone();
      dtCurTo = dtCurFrom.endOf("month");
      let _i02 = 0, _i1 = 0, _i2 = 0, _qs = 0, _ms = 0, _qsc = 0, _msc = 0;
      while (_m <= _iMaxIndex) {
        const oMeta = aData[_m].get(0, 0, 0, 0);
        const iCurrentMaxLevel = oMeta.maxLevel;
        aStat[_m] = {
          header: {dtFrom: null, dtTo: null, created_at: null},
          sessions: {total: 0, nb: 0, pu: 0, nbc: 0},
          defenses: {total: 0, nb: 0, pu: 0, nbc: 0},
          coaches: {total: 0, nb: 0, pu: 0, nbc: 0},
          bonus: 0,
          kpi: {jrs: 0, hrs: 0, hrsp: 0}
        };
        let _l2 = 1;
        while (_l2 < iCurrentMaxLevel) {
          let cTotal = 0, cNb = 0, cPu = 0, cNbc = 0;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_DONE, BILL_AUTOFUNDED, _l2);
          _i2 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_DONE, BILL_FUNDED, _l2);
          _i1 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_DONE, BILL_OTHER, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = typeof _i02 === "undefined" ? 0 : _i02.number;
          if (core_default.isInOldMode(dtCurFrom)) {
            aStat[_m].kpi.hrs += (_i02 + _i1 + _i2) * (45 / 60);
            aStat[_m].kpi.hrsp += (_i02 + _i1 + _i2) * (GM_config.get("nbHrsS") / 60);
          } else {
            aStat[_m].kpi.hrs += _i2 * (30 / 60);
            aStat[_m].kpi.hrsp += _i2 * (GM_config.get("nbHrsAfM") / 60);
            aStat[_m].kpi.hrs += (_i02 + _i1) * (45 / 60);
            aStat[_m].kpi.hrsp += (_i02 + _i1) * (GM_config.get("nbHrsfM") / 60);
          }
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL, BILL_FUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL, BILL_OTHER, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          if (core_default.isInOldMode(dtCurFrom)) {
            _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
            _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
            _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
            _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
            _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
            _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
            _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
            _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
            _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          } else {
            _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
            _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
            _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
            _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
            _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
            _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
            _i02 = aData[_m].get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
            _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
            _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          }
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
          _i2 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
          _i1 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = typeof _i02 === "undefined" ? 0 : _i02;
          aStat[_m].kpi.hrs += (_i02 + _i1 + _i2) * (15 / 60);
          aStat[_m].kpi.hrsp += (_i02 + _i1 + _i2) * (15 / 60);
          cTotal = aStat[_m].sessions.total;
          cNb = aStat[_m].sessions.nb;
          cPu = aStat[_m].sessions.pu;
          cNbc = aStat[_m].sessions.nbc;
          aStat[_m].sessions = {total: _ms + cTotal, nb: _qs + cNb, pu: (_ms + cTotal) / (_qs + cNb), nbc: _qsc + cNbc};
          cTotal = 0;
          cNb = 0;
          cPu = 0;
          cNbc = 0;
          _qs = 0;
          _ms = 0;
          _qsc = 0;
          _msc = 0;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_DONE, BILL_AUTOFUNDED, _l2);
          _i2 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_DONE, BILL_FUNDED, _l2);
          _i1 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_DONE, BILL_OTHER, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = typeof _i02 === "undefined" ? 0 : _i02.number;
          aStat[_m].kpi.hrs += (_i02 + _i1 + _i2) * (45 / 60);
          aStat[_m].kpi.hrsp += (_i02 + _i1 + _i2) * (GM_config.get("nbHrsD") / 60);
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_CANCEL, BILL_FUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_CANCEL, BILL_OTHER, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
          _i2 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
          _i1 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = typeof _i02 === "undefined" ? 0 : _i02.number;
          aStat[_m].kpi.hrs += (_i02 + _i1 + _i2) * (15 / 60);
          aStat[_m].kpi.hrsp += (_i02 + _i1 + _i2) * (15 / 60);
          cTotal = aStat[_m].defenses.total;
          cNb = aStat[_m].defenses.nb;
          cPu = aStat[_m].defenses.pu;
          cNbc = aStat[_m].defenses.nbc;
          aStat[_m].defenses = {total: _ms + cTotal, nb: _qs + cNb, pu: (_ms + cTotal) / (_qs + cNb), nbc: _qsc + cNbc};
          cTotal = 0;
          cTotal = 0;
          cNb = 0;
          cPu = 0;
          cNbc = 0;
          _qs = 0;
          _ms = 0;
          _qsc = 0;
          _msc = 0;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_DONE, BILL_AUTOFUNDED, _l2);
          _i2 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_DONE, BILL_FUNDED, _l2);
          _i1 = typeof _i02 === "undefined" ? 0 : _i02.number;
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_DONE, BILL_OTHER, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = typeof _i02 === "undefined" ? 0 : _i02.number;
          aStat[_m].kpi.hrs += (_i02 + _i1 + _i2) * (45 / 60);
          aStat[_m].kpi.hrsp += (_i02 + _i1 + _i2) * (GM_config.get("nbHrsC") / 60);
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_CANCEL, BILL_FUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_CANCEL, BILL_OTHER, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
          _qsc = typeof _i02 === "undefined" ? _qsc : _qsc + _i02.number;
          _msc = typeof _i02 === "undefined" ? _msc : _msc + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          _i02 = aData[_m].get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
          _qs = typeof _i02 === "undefined" ? _qs : _qs + _i02.number;
          _ms = typeof _i02 === "undefined" ? _ms : _ms + _i02.amount;
          cTotal = aStat[_m].coaches.total;
          cNb = aStat[_m].coaches.nb;
          cPu = aStat[_m].coaches.pu;
          cNbc = aStat[_m].coaches.nbc;
          _i02 = typeof _i02 === "undefined" ? 0 : _i02.number;
          aStat[_m].kpi.hrs += _i02 * (15 / 60);
          aStat[_m].kpi.hrsp += _i02 * (15 / 60);
          aStat[_m].coaches = {total: _ms + cTotal, nb: _qs + cNb, pu: (_ms + cTotal) / (_qs + cNb), nbc: _qsc + cNbc};
          _l2 += 1;
        }
        let iFlatFeeNumber = oMeta.flatFee.length;
        for (var t = 0; t < iFlatFeeNumber; t += 1) {
          aStat[_m].bonus += 30;
        }
        if (dtCurTo.isAfter(dtTo, "day"))
          dtCurTo = dtTo.clone();
        aStat[_m].kpi.jrs = workday_count(dtCurFrom, dtCurTo);
        aStat[_m].header.dtFrom = dtCurFrom.format("YYYY-MM-DD");
        aStat[_m].header.dtTo = dtCurTo.format("YYYY-MM-DD");
        aStat[_m].header.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
        dtCurFrom = dtCurFrom.add(1, "month");
        dtCurTo = dtCurFrom.endOf("month");
        _m += 1;
      }
      return aStat;
    };
    static getListStatisticOld = function(dtFrom, dtTo) {
      let dtCurFrom = dtFrom.clone();
      let dtCurTo = dtCurFrom.endOf("month");
      let aData = [];
      let aStat = [];
      let _iMaxIndex = dtTo.get("month") - dtFrom.get("month");
      var t0 = performance.now();
      while (dtCurFrom.isSameOrBefore(dtTo, "day")) {
        aData.push(accounting_default.calculateBill(dtCurFrom, dtCurTo));
        dtCurFrom = dtCurFrom.add(1, "month");
        dtCurTo = dtCurFrom.endOf("month");
      }
      var t1 = performance.now();
      console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
      let _m = 0;
      dtCurFrom = dtFrom.clone();
      dtCurTo = dtCurFrom.endOf("month");
      console.log(aData);
      while (_m <= _iMaxIndex) {
        let iCurrentMaxLevel = aData[_m][0].max_level;
        aStat[_m] = {
          header: {dtFrom: null, dtTo: null, created_at: null},
          sessions: {total: 0, nb: 0, pu: 0, nbc: 0},
          defenses: {total: 0, nb: 0, pu: 0, nbc: 0},
          coaches: {total: 0, nb: 0, pu: 0, nbc: 0},
          bonus: 0,
          kpi: {jrs: 0, hrs: 0, hrsp: 0}
        };
        let _l2 = 1;
        while (_l2 < iCurrentMaxLevel) {
          let _z = [...Array(8).keys()];
          for (let _i = 0; _i < _z.length; _i += 1) {
            aStat[_m].sessions.total += aData[_m][_l2].sessions.number[_i] * aData[_m][_l2].sessions.pu[_i];
            aStat[_m].sessions.nb += aData[_m][_l2].sessions.number[_i];
            aStat[_m].defenses.total += aData[_m][_l2].defenses.number[_i] * aData[_m][_l2].defenses.pu[_i];
            aStat[_m].defenses.nb += aData[_m][_l2].defenses.number[_i];
            if (core_default.isInOldMode(dtCurFrom)) {
              if ([1, 5].includes(_i)) {
                aStat[_m].sessions.nbc += aData[_m][_l2].sessions.number[_i];
                aStat[_m].defenses.nbc += aData[_m][_l2].defenses.number[_i];
              }
            } else {
              if ([1, 2, 5, 6].includes(_i)) {
                aStat[_m].sessions.nbc += aData[_m][_l2].sessions.number[_i];
                aStat[_m].defenses.nbc += aData[_m][_l2].defenses.number[_i];
              }
            }
            if (core_default.isInOldMode(dtCurFrom)) {
              aStat[_m].kpi.hrs += (aData[_m][_l2].sessions.number[_i] - aData[_m][_l2].defenses.number[_i]) * (45 / 60);
              aStat[_m].kpi.hrsp += (aData[_m][_l2].sessions.number[_i] - aData[_m][_l2].defenses.number[_i]) * (GM_config.get("nbHrsfM") / 60);
            } else {
              if ([4, 5, 6, 7].includes(_i)) {
                aStat[_m].kpi.hrs += (aData[_m][_l2].sessions.number[_i] - aData[_m][_l2].defenses.number[_i]) * (30 / 60);
                aStat[_m].kpi.hrsp += (aData[_m][_l2].sessions.number[_i] - aData[_m][_l2].defenses.number[_i]) * (GM_config.get("nbHrsAfM") / 60);
              }
              if ([0, 1, 2, 3].includes(_i)) {
                aStat[_m].kpi.hrs += (aData[_m][_l2].sessions.number[_i] - aData[_m][_l2].defenses.number[_i]) * (45 / 60);
                aStat[_m].kpi.hrsp += (aData[_m][_l2].sessions.number[_i] - aData[_m][_l2].defenses.number[_i]) * (GM_config.get("nbHrsfM") / 60);
              }
            }
            aStat[_m].kpi.hrs += aData[_m][_l2].defenses.number[_i] * (45 / 60);
            aStat[_m].kpi.hrsp += aData[_m][_l2].defenses.number[_i] * (GM_config.get("nbHrsD") / 60);
          }
          _l2 += 1;
        }
        aStat[_m].sessions.pu = aStat[_m].sessions.total / (aStat[_m].sessions.nb - aStat[_m].sessions.nbc);
        aStat[_m].defenses.pu = aStat[_m].defenses.total / (aStat[_m].defenses.nb - aStat[_m].defenses.nbc);
        aStat[_m].coaches.total = aStat[_m].sessions.total - aStat[_m].defenses.total;
        aStat[_m].coaches.nb = aStat[_m].sessions.nb - aStat[_m].defenses.nb;
        aStat[_m].coaches.nbc = aStat[_m].sessions.nbc - aStat[_m].defenses.nbc;
        aStat[_m].coaches.pu = aStat[_m].coaches.total / (aStat[_m].coaches.nb - aStat[_m].coaches.nbc);
        for (let _i = 0; _i < aData[_m][0].bonus.length; _i += 1) {
          aStat[_m].bonus += aData[_m][0].bonus[_i].sessions > 0 ? 30 : 0;
        }
        if (dtCurTo.isAfter(dtTo, "day"))
          dtCurTo = dtTo.clone();
        aStat[_m].kpi.jrs = workday_count(dtCurFrom, dtCurTo);
        aStat[_m].header.dtFrom = dtCurFrom.format("YYYY-MM-DD");
        aStat[_m].header.dtTo = dtCurTo.format("YYYY-MM-DD");
        aStat[_m].header.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
        dtCurFrom = dtCurFrom.add(1, "month");
        dtCurTo = dtCurFrom.endOf("month");
        _m += 1;
      }
      return aStat;
    };
  }
  var lists_default = List;

  // src/pdf.js
  class PDF {
    static addFooter = async function(doc, sLeft, options = {}) {
      const {degrees, PDFDocument, rgb, StandardFonts} = PDFLib;
      const pageCnt = doc.getPageCount();
      const pagesCntTpl = "8".repeat(pageCnt);
      const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);
      const iFontSize = 12;
      const iTextRigthSz = timesRomanFont.widthOfTextAtSize(`page ${pagesCntTpl} / ${pagesCntTpl}`, iFontSize);
      const iMarginLeft = 10;
      const iMarginRight = 10;
      const iBorderWidth = 1;
      const oBorderColor = rgb(0 / 255, 0 / 255, 0 / 255);
      const oBackgroundColor = rgb(253 / 255, 246 / 255, 227 / 255);
      const iPaddingLeft = 5;
      const iPaddingRigth = 5;
      const iPaddingTop = 3;
      const iPaddingBottom = 3;
      const bNotOnFirstPage = true;
      doc.getPages().forEach((page, idx) => {
        if (bNotOnFirstPage === true && idx == 0) {
        } else {
          const {width, height} = page.getSize();
          const iBoxHeigth = iFontSize + 2 * iBorderWidth + iPaddingTop + iPaddingBottom;
          page.moveTo(iMarginLeft + iPaddingLeft, iFontSize + iPaddingBottom);
          page.setFont(timesRomanFont);
          page.setFontSize(iFontSize);
          page.setFontColor(rgb(1, 0, 0));
          if (sLeft !== void 0) {
            page.drawText(`${sLeft}`);
          }
          page.drawText(`page ${idx + 1} / ${pageCnt}`, {x: width - iTextRigthSz - iPaddingRigth});
          page.drawRectangle({
            x: iMarginLeft,
            y: 10,
            width: width - (iMarginLeft + iMarginRight),
            height: iBoxHeigth,
            color: oBackgroundColor,
            opacity: 0.6,
            borderColor: oBorderColor,
            borderWidth: iBorderWidth
          });
        }
      });
    };
    static changePgIfNeeded(iCurrentHeigth, iBottomPg, iCurLine, oPdf) {
      var iCurPage = oPdf.getPageCount();
      var oCurPage = oPdf.getPages()[iCurPage - 1];
      var iFontSize = oCurPage.fontSize;
      var oFont = oCurPage.getFont();
      var iLineHeigth = oCurPage.lineHeight;
      if (iCurrentHeigth < iBottomPg) {
        iCurLine = 1;
        oCurPage = oPdf.addPage();
        oCurPage.font = oFont;
        oCurPage.setFontSize(iFontSize);
        oCurPage.lineHeight = iLineHeigth;
      }
      return [iCurLine, oCurPage];
    }
  }
  var pdf_default = PDF;

  // src/meta.js
  const index8 = __toModule(require_src());
  var fMeta = function() {
    const TBL_NAME = "meta";
    const setVersion = function(sVersion) {
      return index8.default.Cfg.dbase.get("meta").find({key: "dbVersion"}).assign({value: sVersion}).write();
    };
    const getVersion = function() {
      let _r = index8.default.Cfg.dbase.get("meta").find({key: "dbVersion"}).value;
      return typeof _r === "undefined" ? -1 : _r.value;
    };
    return Object.freeze({
      getVersion,
      setVersion,
      tbl_name: TBL_NAME
    });
  };
  const Meta = fMeta();
  var meta_default = Meta;

  // src/update_database.js
  const index9 = __toModule(require_src());
  var maj_1_00_0006 = async function() {
    let db = index9.default.Cfg.dbase;
    const majWorkFlow = await Swal.mixin({
      confirmButtonText: "Suivant &rarr;",
      showCancelButton: true,
      progressSteps: ["0", "1", "2", "3", "4", "5"],
      onOpen: function(modal) {
        console.log("...onOpen");
      },
      onRender: function(modal) {
        console.log("....onUpdate");
      },
      onClose: function(modal) {
        console.log(".....onClose");
      },
      onAfterClose: function(modal) {
        console.log("......onAfterClose");
      },
      onDestroy: function(modal) {
        console.log(".......onDestroy");
      }
    }).queue([
      {
        title: "Migration de la base",
        html: "<p>Cette migration va corriger la base et ajouter les nouveaux champs nécessaires, l`interrpuption du traitement est sans danger (mais ce n' est pas une raison !)</p>"
      },
      {
        title: "Correction de la table étudiant",
        html: "<p>Correction de la liste des étudiants (who_id)",
        onOpen: async function(modal) {
          console.log("%cMigration table des étudiants correction du who_id", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom2 = dayjs("2020-06-01");
          var oListStudents = db.get("students");
          var aListStudents2 = oListStudents.value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom2, "day"));
          var iSize = oListStudents.size().value();
          var sContent = Swal.getContent().textContent;
          for (i = 0; i < iSize; i += 1) {
            var r3 = aListSessionsSinceJune2.find((v) => v.who_name === aListStudents2[i].fullname).value();
            if (r3 !== void 0)
              oListStudents.get(i).assign({who_id: r3.who_id}).write();
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i}/${aListStudents2.length}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement terminé : ${aListStudents2.length}/${aListStudents2.length}`;
        }
      },
      {
        title: "Correction de la table étudiant",
        html: "<p>Correction de la liste des étudiants funded devient funding</p>",
        onOpen: async function(modal) {
          console.log("%cMigration : table des étudiants suppression de l'ancien champs et ajout du champs funding", APP_DEBUG_STYLE);
          Swal.showLoading();
          var oListStudents = db.get("students");
          var iSize = oListStudents.size().value();
          var sContent = Swal.getContent().textContent;
          for (var i2 = 0; i2 < iSize; i2 += 1) {
            var _r2 = oListStudents.get(i2).value().fundedby;
            if (_r2 === void 0) {
              console.log("%cStudent ${oListStudents.get(i).who_name} already converted, skip it", APP_DEBUG_STYLE);
              continue;
            }
            oListStudents.get(i2).unset(["fundedby"]).assign({funding: _r2}).write();
            console.log("%cStudent ${oListStudents.get(i).who_name} create field funding and remove fundedby", APP_DEBUG_STYLE);
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i2}/${iSize}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement terminé : ${iSize}/${iSize}`;
        }
      },
      {
        title: "Correction table Etudiants",
        html: "<p>Correction de la liste des sessions, ajout du path dans la session</p>",
        onOpen: async function(modal) {
          console.log("%cMigration table des sessions correction de id_who", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom2 = dayjs("2020-06-01");
          var oListStudents = db.get("students");
          var aListStudents2 = oListStudents.value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom2, "day"));
          var aListToUpdate2 = aListSessionsSinceJune2.filter((v) => v.type != "soutenance").value();
          var sContent = Swal.getContent().textContent;
          for (i = 0; i < aListToUpdate2.length; i += 1) {
            var _r2 = oListStudents.find({who_id: aListToUpdate2[i].who_id}).value();
            console.log("found", _r2);
            var data2 = _r2 !== void 0 && _r2.path.length > 0 ? _r2.path : "0-unknown";
            db.get("sessions").find({id: aListToUpdate2[i].id}).assign({path: data2}).write();
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i}/${aListToUpdate2.length}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement terminé : ${i}/${aListToUpdate2.length}`;
        }
      },
      {
        title: "Migration de la table des Sessions",
        html: '<p>Correction de la liste des sessions, suppression du champs "isFunded"</p>',
        onOpen: async function(modal) {
          console.log("%cMigration : table des sessions suppression de isFunded", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom2 = dayjs("2020-06-01");
          var aListStudents2 = db.get("students").value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom2, "day"));
          var sContent = Swal.getContent().textContent;
          for (var i2 = aListSessionsSinceJune2.value().length; i2 -= 1; ) {
            var _r2 = aListSessionsSinceJune2.get(i2);
            if (_r2.value().isFunded === void 0 || _r2.value().isFunded === void 0) {
              console.log(`%cSkip ${_r2.value()} already converted`, APP_DEBUG_STYLE);
            } else {
              _r2.unset(["isFunded"]).write();
            }
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : il reste ${i2} élements à convertir</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement en terminé : ${aListSessionsSinceJune2.value().length}/${aListSessionsSinceJune2.value().length}`;
        }
      },
      {
        title: "Migration de la table des Sessions",
        html: "<p>Correction de la liste des sessions, ajout de funding</p>",
        onOpen: async function(modal) {
          console.log("%cMigration : table des sessions ajout de fundedBy", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom2 = dayjs("2020-06-01");
          var aListStudents2 = db.get("students").value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom2, "day"));
          var oListToUpdate2 = aListSessionsSinceJune2.filter((v) => v.type != "soutenance");
          var sContent = Swal.getContent().textContent;
          for (var i2 = oListToUpdate2.value().length; i2 -= 1; ) {
            var _r2 = oListToUpdate2.get(i2);
            if (_r2.value().funding !== void 0) {
              console.log(`%cSkip ${_r2.value()} already converted`, APP_DEBUG_STYLE);
            } else {
              _r2.assign({funding: students_default.getFunding(_r2.value().who_id)}).write();
            }
            const content2 = Swal.getContent();
            content2.innerHTML = `${sContent}<br /><p>Traitement en cours : il rest ${i2}élements à convertir</p>`;
            await sleep(1);
          }
          var j = i2;
          var oListToUpdate2 = aListSessionsSinceJune2.filter((v) => v.type == "soutenance");
          for (var i2 = 0; i2 < oListToUpdate2.value().length; i2 += 1) {
            oListToUpdate2.get(i2).assign({funding: OC_FUNDED}).write();
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${j + i2}/${aListSessionsSinceJune2.value().length}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement terminé :  ${aListSessionsSinceJune2.value().length}/${aListSessionsSinceJune2.value().length}`;
        }
      }
    ]).then((result) => {
      if (result.value) {
        const answers = JSON.stringify(result.value);
        Swal.fire({
          title: "Traitement terminé!",
          html: `
			Your answers:
			<pre><code>${answers}</code></pre>
		  `,
          confirmButtonText: "Lovely!"
        });
      } else {
        console.log("%c resultat en erreur", APP_DEBUG_STYLE, result, result.dismiss === Swal.DismissReason.cancel);
        return -1;
      }
    });
    return majWorkFlow;
    var dtFrom = dayjs("2020-06-01");
    var aListStudents = db.get("students").value();
    var aListSessionsSinceJune = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom, "day"));
    for (i = 0; i < aListStudents.length; i += 1) {
      var r2 = aListSessionsSinceJune.find((v) => v.who_name === aListStudents[i].fullname).value();
      if (r2 !== void 0)
        db.get("students").find({fullname: r2.who_name}).assign({who_id: r2.who_id}).write();
    }
    var aListToUpdate = aListSessionsSinceJune.filter((v) => v.type != "soutenance").value();
    for (i = 0; i < aListToUpdate.length; i += 1) {
      var r2 = db.get("students").find({who_id: aListToUpdate[i].who_id}).value();
      var data = r2 !== void 0 && r2.path.length > 0 ? r2.path : "0-unknown";
      db.get("sessions").find({id: aListToUpdate[i].id}).assign({path: data}).write();
    }
    for (var i = 0; i < aListSessionsSinceJune.value().length; i += 1) {
      aListSessionsSinceJune.get(i).unset(["isFunded"]).write();
    }
    var oListToUpdate = aListSessionsSinceJune.filter((v) => v.type != "soutenance");
    for (var i = 0; i < oListToUpdate.value().length; i += 1) {
      var _r = oListToUpdate.get(i);
      _r.assign({fundedBy: students_default.getFunded(_r.value().who_id)}).write();
    }
    var oListToUpdate = aListSessionsSinceJune.filter((v) => v.type == "soutenance");
    for (var i = 0; i < oListToUpdate.value().length; i += 1) {
      oListToUpdate.get(i).assign({fundedBy: OC_FUNDED}).write();
    }
  };

  // src/dbase.js
  const index10 = __toModule(require_src());
  class Dbase {
    static export = function() {
      console.log(`%cWanna export DBASE`, APP_DEBUG_STYLE);
      return JSON.stringify(index10.default.Cfg.dbase.getState());
    };
    static import = function(sExport) {
      console.log(`%cWanna import ${sExport} in DBASE`, APP_DEBUG_STYLE);
      console.log(`%c !!!!!! TYPE NOT CHECKED BE CARREFULL`, APP_DEBUG_STYLE);
      return index10.default.Cfg.dbase.setState(JSON.parse(sExport)).write();
    };
    static update = async function(sVersion) {
      console.log(`%cIs there any update to DB to go to version ${sVersion}`, APP_DEBUG_STYLE);
      if (semverCompare(sVersion, "1.00.0006") == 0) {
        console.log("%cFound an update to DB version '1.00.0006' proceed conversion...", APP_DEBUG_STYLE);
        let _r2 = await maj_1_00_0006();
        if (_r2 == -1) {
          console.log("%cError something was wrong during update.... you have canceled it", APP_ERROR_STYLE);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Quelque chose s'est mal passé ou vous avez annulé l'update \n\nUtiliser l'application dans ces conditions n'est pas garanti  !",
            footer: '<a href="https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/issues">Générer un bug?</a>'
          });
        } else {
          let _r3 = meta_default.setVersion(sVersion);
          console.log(`%cChanged DB to version ${_r3}`, APP_DEBUG_STYLE);
        }
        return;
      }
      let _r = meta_default.setVersion(sVersion);
      console.log(`%cChanged DB to version ${_r}`, APP_DEBUG_STYLE);
    };
    static erase = function(sTableName) {
      console.log(`%cErase all data of table: ${sTableName}`, APP_DEBUG_STYLE);
      return index10.default.Cfg.dbase.get(sTableName).remove().write();
    };
  }
  var dbase_default = Dbase;

  // src/do.js
  var about = async function() {
    var sHtml = "";
    sHtml += "<style>div.about_content {background-color: #fed9ff;/*width: 600px;*/height: var(--heigth, 80%);overflow-x: hidden;overflow-y: auto;text-align: left;padding: 20px;}</style>";
    sHtml += '<div class="about_content" style="--heigth: 600px;">';
    sHtml += '<div class="about_content__wrapper">';
    const response = await GMC.XHR({
      method: "GET",
      url: "https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/README.md",
      responseType: "text/html",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    var md = response.responseText;
    var converter = new showdown.Converter();
    var html = converter.makeHtml(md);
    sHtml += html;
    sHtml += "</div>";
    sHtml += "</div>";
    Swal.fire({
      title: `<strong>A propos de ${APP_NAME}</strong>`,
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen"
    });
  };
  var addCbox = function() {
    var sPath = "table.crud-list tbody";
    var sessions6 = document.querySelector(sPath);
    var bChecked = false;
    if (sessions6.querySelector("[type=checkbox]") === null) {
      for (const el2 of sessions6.children) {
        var id = getKey(el2.children[0]);
        var inputElem = document.createElement("input");
        inputElem.type = "checkbox";
        inputElem.name = "name";
        inputElem.value = id;
        inputElem.id = "id";
        bChecked = sessions_default.exists(id);
        if (bChecked === true)
          inputElem.checked = true;
        var td = document.createElement("td");
        td.style = "text-align: center";
        td.appendChild(inputElem);
        el2.appendChild(td);
      }
      sPath = "table.crud-list thead tr";
      var el = document.querySelector(sPath);
      inputElem = document.createElement("input");
      inputElem.type = "checkbox";
      inputElem.name = "name";
      inputElem.value = "value";
      inputElem.id = "id";
      inputElem.onclick = function() {
        document.querySelectorAll("tbody input[type=checkbox]").forEach((e) => e.checked = !e.checked);
      };
      inputElem.style = "visibility: hidden;";
      var label = document.createElement("label");
      label.innerText = "in DB";
      label.style = "display:block;";
      label.onMouseOver = "this.style.cursor=pointer;";
      label.onMouseOut = "this.style.cursor=auto;";
      label.appendChild(inputElem);
      td = document.createElement("td");
      td.style = "text-align: center";
      td.appendChild(label);
      el.appendChild(td);
    } else {
      var _t = sessions6.querySelectorAll("[type=checkbox]");
      var i = _t.length, aChkBox = new Array(i);
      for (; i--; aChkBox[i] = _t[i])
        ;
      for (var v in aChkBox) {
        bChecked = sessions_default.exists(aChkBox[v].value);
        if (bChecked === true) {
          aChkBox[v].checked = true;
        } else {
          aChkBox[v].checked = false;
        }
      }
    }
  };
  var billInDetails = async function() {
    var [dtFrom, dtTo] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
    let _r = lists_default.getListDetailBill(dtFrom, dtTo);
    let sHtml = "";
    sHtml += "<table>";
    sHtml += "<thead>";
    sHtml += "<tr><th>Quand</th><th>Qui</th><th>Financé ?</th><th>Type</th><th>Niveau</th><th>Ancien Mode ?</th><th>Statut</th><th>PU HT</th><th>Cumul</th></tr>";
    sHtml += "<thead>";
    sHtml += "<tbody>";
    for (let _i = 0; _i < _r.length; _i += 1) {
      sHtml += "<tr>";
      sHtml += `<td>${dayjs(_r[_i].when).format("DD/MM/YYYY à HH:mm:ss")}</td>`;
      sHtml += `<td>${_r[_i].who_name}</td><td>${_r[_i].funding}</td>`;
      sType = _r[_i].type;
      if (_r[_i].path != void 0 && _r[_i].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _r[_i].type !== "soutenance")
        sType = "Coaching";
      sHtml += `<td>${sType}</td><td>${_r[_i].lvl}</td>`;
      sHtml += `<td>${_r[_i].oldMode === true ? "Oui" : "Non"}</td>`;
      sHtml += `<td>${_r[_i].status}</td>`;
      sHtml += `<td>${_r[_i].iPu}</td><td>${_r[_i].iCumul}€</td>`;
      sHtml += "</tr>";
    }
    sHtml += "</tbody>";
    sHtml += "</table>";
    Swal.fire({
      title: `<strong>Liste détaillées des sessions du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen",
      onOpen: (el) => {
        var myTable = el.querySelector("table");
        var dataTable = new simpleDatatables.DataTable(myTable);
      }
    });
  };
  var collectAuto = async function() {
    var [dtFrom, dtTo] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
    let iRecurse = 0;
    let iMaxRecurse = GM_config.get("maxfetchpg");
    let bBrowse = true;
    var res = {};
    let data = [];
    let pg = 1;
    let _r = history_default.getSameOrNearestSessionPage(dtTo);
    if (_r !== void 0 && _r.page > pg) {
      pg = _r.page;
    }
    while (bBrowse) {
      if (iRecurse > iMaxRecurse) {
        console.warn("%cEMERGENCY EXIT LOOP", APP_WARN_STYLE);
        break;
      }
      try {
        res = await _historyFetch(dtFrom, dtTo, pg, data);
      } catch (e) {
        console.error(`%c IRRECOVERABLE ERROR ... ${e}, will exit !!!! `, APP_ERROR_STYLE2);
        throw new Error();
      }
      if (res.length > 0 && dayjs(res[res.length - 1].when).isSameOrBefore(dtFrom) === true) {
        bBrowse = false;
      }
      pg += 1;
      iRecurse += 1;
    }
    GM_addStyle(".ldBar path.mainline{stroke-width:10;stroke:#09f;stroke-linecap:round}");
    GM_addStyle(".ldBar path.baseline{stroke-width:14;stroke:#f1f2f3;stroke-linecap:round;filter:url(#custom-shadow)}");
    let sHtml = '<div id="pbar" class="ldBar label-center" data-value="0" data-path="M0 0 L200 0 L200 1"></div>';
    var cb = res.length;
    Swal.fire({
      title: "Traitement en cours!",
      html: sHtml,
      confirmButtonText: "Lovely!",
      onBeforeOpen: function(modal) {
        var bar = new ldBar("#pbar");
      },
      onRender: function(modal) {
      },
      onOpen: async function(modal) {
        var bar = document.getElementById("pbar").ldBar;
        for (var i in res) {
          if (dayjs(res[i].when).isBefore(dtFrom, "day") === true) {
            break;
          }
          if (dayjs(res[i].when).isAfter(dtTo, "day") === true) {
            bar.set(i / cb * 100, false);
            continue;
          }
          if (dayjs(res[i].when).isBetween(dtFrom, dtTo, "day", "[]")) {
            await sessions_default.add(res[i]);
            bar.set(i / cb * 100, false);
          }
        }
        bar.set(100, false);
        Swal.getTitle().innerText = "Traitement terminé !";
      },
      onClose: function(modal) {
      },
      onAfterClose: function(modal) {
      },
      onDestroy: function(modal) {
      }
    });
    addCbox();
  };
  var collectChecked = async function() {
    var sPath = "table.crud-list tbody input:checked";
    var cb = document.querySelectorAll(sPath);
    GM_addStyle(".ldBar path.mainline{stroke-width:10;stroke:#09f;stroke-linecap:round}");
    GM_addStyle(".ldBar path.baseline{stroke-width:14;stroke:#f1f2f3;stroke-linecap:round;filter:url(#custom-shadow)}");
    let sHtml = '<div id="pbar" class="ldBar label-center" data-value="0" data-path="M0 0 L200 0 L200 1"></div>';
    Swal.fire({
      title: "Traitement en cours!",
      html: sHtml,
      confirmButtonText: "Lovely!",
      onBeforeOpen: function(modal) {
        var bar = new ldBar("#pbar");
      },
      onRender: function(modal) {
      },
      onOpen: async function(modal) {
        var bar = document.getElementById("pbar").ldBar;
        for (var i = 0; i < cb.length; i += 1) {
          var oEl = cb[i].parentElement.parentElement;
          var me = sessions_default.parseTable(oEl);
          await sessions_default.add(me);
          bar.set(i / cb.length * 100, false);
        }
        bar.set(100, false);
        if (Swal.getTitle()) {
          Swal.getTitle().innerText = "Traitement terminé !";
        }
      },
      onClose: function(modal) {
      },
      onAfterClose: function(modal) {
      },
      onDestroy: function(modal) {
      }
    });
  };
  var debugMode = function() {
    const d_dbase = unsafeWindow.Facturier.cfg.dbase;
    const d_dayjs = unsafeWindow.Facturier.libs.find((o) => o.id == "dayjs").ptr;
    const d_fetchInject = unsafeWindow.Facturier.libs.find((o) => o.id == "fetchInject").ptr;
    const d_Session = unsafeWindow.Facturier.klass.find((o) => o.id == "Session").ptr;
    const d_Student = unsafeWindow.Facturier.klass.find((o) => o.id == "Student").ptr;
    const d_History = unsafeWindow.Facturier.klass.find((o) => o.id == "History").ptr;
    const d_Archive = unsafeWindow.Facturier.klass.find((o) => o.id == "Archive").ptr;
    const d_StudentHistory = unsafeWindow.Facturier.klass.find((o) => o.id == "StudentHistory").ptr;
    console.log(`%cd_dbase, d_dayjs, d_Session, d_Student, d_History, d_Archive, d_StudentHistory are exported`, APP_DEBUG_STYLE);
    console.log("%cfor examples write all code after $>", APP_DEBUG_STYLE);
    console.group("%cd_dbase", APP_DEBUG_STYLE);
    console.log("example : get last session in db $>d_dbase.get(d_Session.tbl_name).last().value();");
    console.log("          get first student in db $>d_dbase.get(d_Student.tbl_name).first().value()");
    console.log("          or d_dbase.get(d_Student.tbl_name).get(0).value()");
    console.log("          get all sessions grouped by month/yyyy in db $>d_dbase.get(d_Session.tbl_name).groupBy( v => d_dayjs(v.when).format('MM/YYYY')).value()");
    console.log("          get all table $> d_dbase.value()");
    console.groupEnd();
    console.group("%cd_fetchInject", APP_DEBUG_STYLE);
    console.log("same as fetchInject libs : https://habd.as/code/fetch-inject/");
    console.groupEnd();
    console.group("%cd_dayjs", APP_DEBUG_STYLE);
    console.log("same as dayjs libs");
    console.groupEnd();
    console.group("%cd_Student", APP_DEBUG_STYLE);
    console.log("find a student by id ¤ d_Student.findById(STUDENT_ID, (DATE) ); // date is optionnal");
    console.groupEnd();
    console.group("%cd_Session", APP_DEBUG_STYLE);
    console.log("get a list of session ¤ d_Session.getBetween('2020-08-01','2020-08-31')");
    console.log("delete a session by id ¤ d_Session.deleteById(SESSION_ID);");
    console.groupEnd();
    console.group("%cSome combinated example", APP_DEBUG_STYLE);
    console.log("Delete last saved session :  d_Session.deleteById( d_dbase.get(d_Session.tbl_name).last().value().id ); ");
    console.log("Find all session between 01/08/2020 and 31/08/2020 :  d_dbase.get(d_Session.tbl_name).filter( v => d_dayjs(v.when).isSameOrBefore('20200831', 'day') && d_dayjs(v.when).isSameOrAfter('20200801', 'day')).value(); ");
    console.groupEnd();
    debugger;
  };
  var _historyFetch = async function(dtFrom, dtTo, pg = 1, data = []) {
    Swal.fire({
      position: "top-end",
      icon: "info",
      toast: true,
      title: "Collecte des sessions de l'historique\ndu " + dtFrom.format("DD/MM/YYYY") + " au " + dtTo.format("DD/MM/YYYY") + " \npage : " + pg + "\ncela peut prendre du temps...",
      showConfirmButton: false,
      timer: 3e3
    });
    let oDom = null;
    try {
      oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history?page=${pg}`, "table.crud-list tbody");
    } catch (e) {
      console.error(`%c _historyFetch : ${e}`, APP_ERROR_STYLE2);
    }
    if (oDom === null) {
      throw new Error(`Something went wrong could'nt collect anything from ${dtFrom.format("DD/MM/YYYY")} to ${dtTo.format("DD/MM/YYYY")} working on history page:${pg}.... try to navigate forward and backward or click some buttons to change url`);
    }
    let _from = convertRowToDate(oDom);
    let _to = convertRowToDate(oDom, -1);
    if (_from.get("month") != _to.get("month")) {
      let _z = _to.endOf("month");
      history_default.addOrUpdateSessionPage(pg, _z);
    }
    if (_to.isAfter(dtTo, "day") === true) {
      console.log(`%cOptimization: oldest (last) data from page are at :${_to.format("DD/MM/YYYY")}, don't analyze what was before end date of extraction ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      return data;
    }
    for (var i = 0; i < oDom.children.length; i += 1) {
      var row = oDom.children[i];
      var me = sessions_default.parseTable(row);
      data.push(me);
    }
    return data;
  };
  var pdf2 = function() {
    const {degrees, PDFDocument, rgb, StandardFonts} = PDFLib;
    async function modifyPdf() {
      const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
      const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const {width, height} = firstPage.getSize();
      firstPage.drawText("This text was added with JavaScript!", {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45)
      });
      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
    }
    async function createPdf() {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const page = pdfDoc.addPage();
      const {width, height} = page.getSize();
      const fontSize = 30;
      page.drawText("Creating PDFs in JavaScript is awesome!", {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71)
      });
      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
    }
    async function createPdf2() {
      var [dtFrom, dtTo] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
      let _r = lists_default.getListDetailBill(dtFrom, dtTo);
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const page = pdfDoc.addPage();
      const {width, height} = page.getSize();
      const fontSize = 30;
      page.drawText(`Prestations en détail 

 du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}`, {
        x: 50,
        y: height / 2 - fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(116 / 255, 81 / 255, 235 / 255)
      });
      let font_size = 12;
      let line_space = 1.25;
      let curPage = pdfDoc.addPage();
      curPage.setFontSize(font_size);
      curPage.line_space = line_space;
      curPage.font = timesRomanFont;
      let curLine = 1;
      let iSizeOfFooter = 20;
      let iBottomPg = line_space * font_size + iSizeOfFooter;
      let iCurrentHeigth = height / 2;
      const lorem_width = function(width2) {
        const needle = "LOrEm ipsum DOLor sit aMet, conSEc/tetUr 25 porttitor. ";
        return width2 * 1.0925 * (timesRomanFont.widthOfTextAtSize(needle, font_size) / needle.length);
      };
      let _iStrMaxLength = [0, 18, 36, 10, 13, 8, 5, 7];
      let _iWidth = [
        _iStrMaxLength[0],
        lorem_width(_iStrMaxLength[1]),
        lorem_width(_iStrMaxLength[2]),
        lorem_width(_iStrMaxLength[3]),
        lorem_width(_iStrMaxLength[4]),
        lorem_width(_iStrMaxLength[5]),
        lorem_width(_iStrMaxLength[6]),
        lorem_width(_iStrMaxLength[7])
      ];
      let iLineHeigth = page.lineHeight;
      let iXStart = 25;
      for (let _l3 = 1; _l3 < _r.length; _l3 += 1) {
        iCurrentHeigth = height - line_space * font_size * curLine;
        if (iCurrentHeigth < iBottomPg) {
          curLine = 1;
          curPage = pdfDoc.addPage();
          curPage.font = timesRomanFont;
          curPage.setFontSize(font_size);
          curPage.line_space = line_space;
          iCurrentHeigth = height - line_space * font_size * curLine;
        }
        if (curLine === 1) {
          let aHeader = ["", "Quand", "Qui", "Financé", "Type-Niv.", "Statut", "Pu", "Cumul"];
          let iCurX2 = iXStart;
          curPage.moveTo(iCurX2, iCurrentHeigth);
          for (let _i = 1; _i < aHeader.length; _i += 1) {
            curPage.drawText(aHeader[_i], {x: iCurX2});
            iCurX2 += _iWidth[_i];
          }
          curLine += 1;
          iCurrentHeigth = height - line_space * font_size * curLine;
        }
        let iCurX = iXStart;
        curPage.drawText(dayjs(_r[_l3].when).format("DD/MM/YYYY à HH:mm"), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[1];
        curPage.drawText(_r[_l3].who_name.trim().slice(0, _iStrMaxLength[2]), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[2];
        let sFunding2 = _r[_l3].funding.trim().slice(0, _iStrMaxLength[3]);
        if (_r[_l3].funding === "auto-financé") {
          sFunding2 = "Au. Fin.";
        }
        if (_r[_l3].funding === "financé par un tiers") {
          sFunding2 = "Fin.";
        }
        curPage.drawText(sFunding2, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[3];
        let sType2 = _r[_l3].type;
        if (_r[_l3].path != void 0 && _r[_l3].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _r[_l3].type !== "soutenance") {
          sType2 = "Coaching";
        }
        let sCol5 = `${sType2.trim().slice(0, _iStrMaxLength[4] - 2)}-${_r[_l3].lvl.toString()}`;
        curPage.drawText(sCol5, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[4];
        let sStatus = _r[_l3].status;
        if (_r[_l3].status === "étudiant absent") {
          sStatus = "absent";
        }
        if (_r[_l3].status === "étudiante absente") {
          sStatus = "absente";
        }
        if (_r[_l3].status === "annulée tardivement") {
          sStatus = "an. tard.";
        }
        curPage.drawText(sStatus, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[5];
        curPage.drawText(_r[_l3].iPu.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[6];
        curPage.drawText(_r[_l3].iCumul.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        curLine += 1;
      }
      var data = await accounting_default.calculateBill(dtFrom, dtTo);
      const oMeta = data.get(0, 0, 0, 0);
      const iCurrentMaxLevel = oMeta.maxLevel;
      const dtNewMode = core_default.getOldModeDate();
      const aPu_before = accounting_default.getPriceList(dtNewMode.subtract(1, "day"));
      const aPu_after = accounting_default.getPriceList(dtNewMode);
      var _l2 = 1;
      const bShowEmptyLines = false;
      var _aSessionType = [TYPE_SESSION, TYPE_DEFENSE, TYPE_COACHING];
      var _aSessionTypeStr = ["Sessions", "Soutenance", "Coaching"];
      var _aSessionQuality = [0, 1, 2, 3];
      var _aSessionQualityStr = ["Réalisée", "Annulée", "Annulée tardivement", "Etudiant(e) absent(e)"];
      var _aFunding = [BILL_AUTOFUNDED, BILL_FUNDED, BILL_OTHER];
      var _aFundingStr = ["Autofinancés", "Financés", "Autres"];
      curLine = 1;
      curPage = pdfDoc.addPage();
      let aHeader2 = ["", "Quand", "Qui", "Nb", "Pu", "Cumul"];
      let _iStrMaxLength2 = [0, 18, 50, 3, 5, 7];
      let _iWidth2 = [
        _iStrMaxLength[0],
        lorem_width(_iStrMaxLength[1]),
        lorem_width(_iStrMaxLength[2]),
        lorem_width(_iStrMaxLength[3]),
        lorem_width(_iStrMaxLength[4]),
        lorem_width(_iStrMaxLength[5])
      ];
      let sHeader = "";
      for (_iSessionType = 0, _iSessionTypeLength = _aSessionType.length; _iSessionType < _iSessionTypeLength; _iSessionType += 1) {
        while (_l2 <= iCurrentMaxLevel) {
          [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
          iCurrentHeigth = height - line_space * font_size * curLine;
          for (_iSessionQuality = 0, _iSessionQualityLength = _aSessionQuality.length; _iSessionQuality < _iSessionQualityLength; _iSessionQuality += 1) {
            for (_iFunding = 0, _iFundingLength = _aFunding.length; _iFunding < _iFundingLength; _iFunding += 1) {
              _i0 = data.get(_aSessionType[_iSessionType], _aSessionQuality[_iSessionQuality], _aFunding[_iFunding], _l2);
              if (typeof _i0 === "undefined" && bShowEmptyLines === false) {
                continue;
              }
              _i0.data = _i0.data.reverse();
              let iCurX = iXStart;
              sHeader = `${_aSessionTypeStr[_iSessionType]} de Niveau ${_l2} Etudiants ${_aFundingStr[_iFunding]}`;
              curPage.moveTo(iCurX, iCurrentHeigth);
              curPage.drawText(sHeader, {
                font: timesRomanFont,
                size: font_size + 4,
                y: iCurrentHeigth,
                x: iCurX,
                lineHeight: iLineHeigth
              });
              iCurX += 15;
              curLine += 1;
              [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
              iCurrentHeigth = height - line_space * font_size * curLine;
              curPage.moveTo(iCurX, iCurrentHeigth);
              curPage.drawText(_aSessionQualityStr[_iSessionQuality], {
                font: timesRomanFont,
                size: font_size + 2,
                y: iCurrentHeigth,
                x: iCurX,
                lineHeight: iLineHeigth
              });
              iCurX += 15;
              curLine += 1;
              [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
              iCurrentHeigth = height - line_space * font_size * curLine;
              if (typeof _i0 === "undefined") {
                curPage.drawText(`désolé pas de résultat pour cette section au niveau de facturation (${_l2})`, {
                  font: timesRomanFont,
                  size: font_size,
                  y: iCurrentHeigth,
                  x: iCurX,
                  lineHeight: iLineHeigth
                });
                curLine += 1;
                [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
                iCurrentHeigth = height - line_space * font_size * curLine;
                continue;
              }
              let iCurSubX = iCurX;
              let iCumul = 0;
              curPage.moveTo(iCurX, iCurrentHeigth);
              for (let _i = 1; _i < aHeader2.length; _i += 1) {
                curPage.drawText(aHeader2[_i], {
                  font: timesRomanFont,
                  size: font_size + 2,
                  y: iCurrentHeigth,
                  x: iCurSubX,
                  lineHeight: iLineHeigth
                });
                iCurSubX += _iWidth2[_i];
              }
              curLine += 1;
              [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
              iCurrentHeigth = height - line_space * font_size * curLine;
              iCurSubX = iCurX;
              for (var _k = 0, _length = _i0.data.length; _k < _length; _k += 1) {
                iCurSubX = iCurX;
                curPage.drawText(dayjs(_i0.data[_k].when).format("DD/MM/YYYY à HH:mm"), {
                  font: timesRomanFont,
                  size: font_size,
                  y: iCurrentHeigth,
                  x: iCurSubX,
                  lineHeight: iLineHeigth
                });
                iCurSubX += _iWidth2[1];
                curPage.drawText(_i0.data[_k].who_name.trim().slice(0, _iStrMaxLength2[1]), {
                  font: timesRomanFont,
                  size: font_size,
                  y: iCurrentHeigth,
                  x: iCurSubX,
                  lineHeight: iLineHeigth
                });
                iCurSubX += _iWidth2[2];
                curPage.drawText((_k + 1).toString(), {
                  font: timesRomanFont,
                  size: font_size,
                  y: iCurrentHeigth,
                  x: iCurSubX,
                  lineHeight: iLineHeigth
                });
                iCurSubX += _iWidth2[3];
                if (core_default.isInOldMode(dayjs(_i0.data[_k].when))) {
                  iPu = +_i0.data[_k].lvl > 0 ? aPu_before[_l2][_aSessionType[_iSessionType]][_aSessionQuality[_iSessionQuality]][_aFunding[_iFunding]] : 0;
                } else {
                  iPu = +_i0.data[_k].lvl > 0 ? aPu_after[_l2][_aSessionType[_iSessionType]][_aSessionQuality[_iSessionQuality]][_aFunding[_iFunding]] : 0;
                }
                curPage.drawText(iPu.toString(), {
                  font: timesRomanFont,
                  size: font_size,
                  y: iCurrentHeigth,
                  x: iCurSubX,
                  lineHeight: iLineHeigth
                });
                iCurSubX += _iWidth2[4];
                iCumul += iPu;
                curPage.drawText(iCumul.toString(), {
                  font: timesRomanFont,
                  size: font_size,
                  y: iCurrentHeigth,
                  x: iCurSubX,
                  lineHeight: iLineHeigth
                });
                curLine += 1;
                [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
                iCurrentHeigth = height - line_space * font_size * curLine;
              }
            }
          }
          _l2 += 1;
          curLine += 1;
          [curLine, curPage] = pdf_default.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
          iCurrentHeigth = height - line_space * font_size * curLine;
        }
        _l2 = 1;
      }
      pdf_default.addFooter(pdfDoc, `Généré avec Facturier version ${core_default.getAppVersion()}`);
      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `prestations_facturees_detail_${dtFrom.format("YYYYMMDD")}-${dtTo.format("YYYYMMDD")}.pdf`, "application/pdf");
    }
    createPdf2();
  };
  var mgtDbase = async function() {
    GM_addStyle('.formgrid{font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;}');
    GM_addStyle(".swal2-styled[type=button]{background-color:#3085d6;border-radius:.75em;color:#fff;font-size:1.0625em;border-left-color:#3085d6;border-right-color:#3085d6;display:inline-block}.formgrid{display:grid;grid-template-columns:1fr 1em 1fr;grid-gap:.3em .6em;grid-auto-flow:dense;align-items:center}input,output,textarea,select,button{grid-column:2 / 4;width:auto;margin:0}legend{font-size:1.2em;width:100%;border-bottom:1px dotted #99c}fieldset{max-width:40em;padding:4px;margin:2em auto;border:0 none}");
    let sHtml = "";
    sHtml += "<legend>Que voulez vous faire ?</legend>";
    sHtml += "<fieldset>";
    sHtml += '<div class="formgrid">';
    sHtml += 'Epurer<button id="answer1" data-action="raz" class="swal2-styled" type="button">RAZ</button>';
    sHtml += 'Exporter<button id="answer2" data-action="export" class="swal2-styled" type="button">Exporter</button>';
    sHtml += 'Importer<button id="answer3" data-action="import" class="swal2-styled" type="button">Importer</button>';
    sHtml += "</fieldset>";
    sHtml += "</div>";
    const {value: formValues} = await Swal.fire({
      title: "Gestion de la base de donnée",
      html: sHtml,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("answer1").value,
          document.getElementById("answer2").value
        ];
      },
      onOpen: (el) => {
        el.querySelector(".formgrid").addEventListener("click", function(e) {
          const raz_action = function(evt) {
            if (evt.target.matches('button[data-action="raz"]')) {
              Swal.close();
              razDbase();
            }
            return;
          };
          const export_action = function(evt) {
            if (evt.target.matches('button[data-action="export"]')) {
              Swal.close();
              export_database();
            }
            return;
          };
          const import_action = function(evt) {
            if (evt.target.matches('button[data-action="import"]')) {
              Swal.close();
              import_database();
            }
            return;
          };
          raz_action(e);
          export_action(e);
          import_action(e);
        });
        console.log("%conOpen popup", "color:coral");
      },
      onClose: (el) => {
        el.querySelector(".formgrid").removeEventListener("click");
        console.log("%conClose popup", "color:coral");
      }
    });
    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
    }
  };
  var export_database = async function() {
    let sExport = dbase_default.export();
    console.log(`%cWanna export : ${sExport}`, APP_DEBUG_STYLE);
    let now = dayjs();
    let sHtml = "";
    sHtml += `<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="export_${now.format("YYYYMMDD")}.json" style="display:none"></a>`;
    sHtml += `<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="export_${now.format("YYYYMMDD")}.json">export_${now.format("YYYYMMDD")}.json</a>`;
    Swal.fire({
      title: "Export de la base de donnée",
      html: sHtml,
      focusConfirm: false,
      onOpen: (el) => {
        el.querySelector("#download").click();
      },
      onClose: (el) => {
      }
    });
  };
  var import_database = async function() {
    console.log(`%cWanna import DATABASE`, APP_DEBUG_STYLE);
    const {value: file} = await Swal.fire({
      title: "Selection de la sauvegarde (json)",
      input: "file",
      inputAttributes: {
        accept: ".json",
        "aria-label": "Upload your database"
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dbase_default.import(e.target.result);
        addCbox();
        toastOk("Import terminé");
      };
      reader.readAsText(file);
    }
  };
  var razDbase = async function() {
    GM_addStyle(".form_addon {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}");
    GM_addStyle(".form_addon input {background: #fff;border: 1px solid #9c9c9c;}");
    GM_addStyle(".form_addon button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}");
    GM_addStyle(".form_addon button:hover {background: gold;}");
    GM_addStyle(".form_addon label {padding: 0.5em 0.5em 0.5em 0;}");
    GM_addStyle(".form_addon input {padding: 0.7em;margin-bottom: 0.5rem;}");
    GM_addStyle(".form_addon input:focus {outline: 3px solid gold;}");
    GM_addStyle("@media (min-width: 400px) {.form_addon {grid-template-columns: 200px 1fr;grid-gap: 16px;} .form_addon label {text-align: right;grid-column: 1 / 2;} .form_addon input, .form_addon button {grid-column: 2 / 3;}}");
    var sHtml = "";
    sHtml += '<form id="RAZ" class="form_addon" action="">';
    sHtml += '<label for="students" class="cbox">Etudiants</label>';
    sHtml += '<input id="students" type="checkbox" value="del_students_true" checked>';
    sHtml += '<label for="sessions" class="cbox">Sessions</label>';
    sHtml += '<input id="sessions" type="checkbox" value="del_sessions_true" checked>';
    sHtml += '<label for="archives" class="cbox">Archives : factures</label>';
    sHtml += '<input id="archives" type="checkbox" value="del_archives_true" checked>';
    sHtml += '<label for="history_cache" class="cbox">Signet historique</label>';
    sHtml += '<input id="history_cache" type="checkbox" value="del_history_cache_true" checked>';
    sHtml += '<label for="radio1">filtrer la date</label>';
    sHtml += '<input type="radio" id="radio1" name="date_filter" value="false" checked>';
    sHtml += '<label for="radio2">ne pas filtrer</label>';
    sHtml += '<input type="radio" id="radio2" name="date_filter" value="true">';
    sHtml += '<label for="dtFrom" class="date">Date de début</label>';
    sHtml += '<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += '<label for="dtTo" class="date">Date de fin</label>';
    sHtml += '<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += "<!-- Switch -->";
    sHtml += '<input type="checkbox" class="switch" name="s1" id="s1">';
    sHtml += '<label for="s1">Switch</label>';
    sHtml += "</form>";
    const {value: formValues} = await Swal.fire({
      title: "<strong>RAZ des données</strong>",
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "top-start",
      grow: "row",
      footer: "Choisissez ce que vous allez supprimer de la base de donnée",
      preConfirm: () => {
        let r2 = document.getElementsByName("date_filter");
        let radioValue = "notfound";
        for (var i in r2) {
          if (r2[i].checked === true)
            radioValue = r2[i].value;
        }
        console.log(document.getElementById("s1"));
        return [
          document.getElementById("students").checked,
          document.getElementById("sessions").checked,
          document.getElementById("archives").checked,
          document.getElementById("history_cache").checked,
          document.getElementById("dtFrom").disabled === true ? null : document.getElementById("dtFrom").value,
          document.getElementById("dtTo").disabled === true ? null : document.getElementById("dtTo").value,
          radioValue
        ];
      },
      onOpen: (el) => {
        el.querySelector("#radio1").addEventListener("change", function() {
          console.log(document.getElementById("radio1").checked);
          let _b = document.getElementById("radio1").checked;
          document.getElementById("dtFrom").disabled = !_b;
          document.getElementById("dtTo").disabled = !_b;
        });
        el.querySelector("#radio2").addEventListener("change", function() {
          let _b = document.getElementById("radio1").checked;
          document.getElementById("dtFrom").disabled = !_b;
          document.getElementById("dtTo").disabled = !_b;
        });
        el.querySelector("#dtFrom").addEventListener("change", function() {
          document.getElementById("dtTo").value = dayjs(document.getElementById("dtFrom").value).endOf("month").format("YYYY-MM-DD");
        });
      },
      onClose: (el) => {
        el.querySelector("#radio1").removeEventListener("change");
        el.querySelector("#radio2").removeEventListener("change");
        el.querySelector("#dtFrom").removeEventListener("change");
      }
    });
    let bRAZStudents = formValues[0];
    let bRAZSessions = formValues[1];
    let bRAZArchives = formValues[2];
    let bRAZHistorySessionCache = formValues[3];
    console.log(`%cWanna raz students ? ${bRAZStudents}, wanna raz sessions ? ${bRAZSessions}, wanna raz archives ? ${bRAZArchives}`, APP_DEBUG_STYLE);
    let dtFrom = formValues[4] ? dayjs(formValues[4]) : null;
    let dtTo = formValues[5] ? dayjs(formValues[5]) : null;
    if (bRAZStudents === true) {
      setTimeout(function() {
        Toastify({
          text: `Suppression de la base des étudiants`,
          gravity: "top",
          position: "right",
          close: true,
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
      }, 500);
      students_default.delete(dtFrom, dtTo);
    }
    if (bRAZSessions === true) {
      setTimeout(function() {
        Toastify({
          text: `Suppression de la base des sessions`,
          gravity: "top",
          position: "right",
          close: true,
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
      }, 500);
      sessions_default.delete(dtFrom, dtTo);
      addCbox();
    }
    if (bRAZArchives === true) {
      setTimeout(function() {
        Toastify({
          text: `Suppression de la base des archives (financières)`,
          gravity: "top",
          position: "right",
          close: true,
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
      }, 500);
      archives_default.delete(dtFrom, dtTo);
    }
    if (bRAZHistorySessionCache === true) {
      setTimeout(function() {
        Toastify({
          text: `Suppression de la base du cache des historique de session`,
          gravity: "top",
          position: "right",
          close: true,
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
      }, 500);
      history_default.delete(dtFrom, dtTo);
    }
  };
  var showBill = async function() {
    var sHtml = "";
    sHtml += "<style>";
    sHtml += "form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}";
    sHtml += "form input {background: #fff;border: 1px solid #9c9c9c;}";
    sHtml += "form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}";
    sHtml += "form button:hover {background: gold;}";
    sHtml += "form label {padding: 0.5em 0.5em 0.5em 0;}";
    sHtml += "form input {padding: 0.7em;margin-bottom: 0.5rem;}";
    sHtml += "form input:focus {outline: 3px solid gold;}";
    sHtml += "@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}label {text-align: right;grid-column: 1 / 2;}input,button {grid-column: 2 / 3;}}";
    sHtml += "</style>";
    sHtml += '<form class="form1" action="">';
    sHtml += '<label for="dd" class="date">Date de début</label>';
    sHtml += '<input id="dd" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += '<label for="df" class="date">Date de fin</label>';
    sHtml += '<input id="df" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += "</form>";
    var [dtFrom, dtTo] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
    var data = await accounting_default.calculateBill(dtFrom, dtTo);
    if (core_default.isInOldMode(dtFrom)) {
      showBillPhase1(dtFrom, dtTo, data);
    } else {
      showBillPhase2(dtFrom, dtTo, data);
    }
  };
  var showBillPhase1 = function(dtFrom, dtTo, data) {
    const oMeta = data.get(0, 0, 0, 0);
    const iCurrentMaxLevel = 4;
    var sHtml = "";
    var _ref = null;
    var iTotQ = 0;
    var iTotM = 0;
    var iTotG = 0;
    var aTable = [[4, "Groupe"], [1, "Niveau 1"], [2, "Niveau 2"], [3, "Niveau 3"]];
    var t0 = 0, t1 = 0;
    var bShowEmptyLine = false;
    var _0 = 0, _1 = 0, _2 = 0;
    var _q0 = 0, _q1 = 0, _q2 = 0;
    var _m0 = 0, _m1 = 0, _m2 = 0;
    var _qa = 0, _qf = 0, _qo = 0;
    var _pa = 0, _pf = 0, _po = 0;
    var _ma = 0, _mf = 0, _mo = 0;
    var _l2 = 1;
    data.toConsole();
    sHtml += "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
    sHtml += '<div class="wrapper">';
    sHtml += "<table>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += '<th>Type</th><th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    sHtml += "<tr>";
    sHtml += '<th colspan="4" class="pseudoheader" scope="colgroup">Sessions de Mentorat</th>';
    sHtml += "</tr>";
    var t0 = performance.now();
    while (_l2 <= iCurrentMaxLevel) {
      _i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : réalisées</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées tard.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : étudiant abs.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    iTotG += iTotM;
    iTotQ = 0;
    iTotM = 0;
    sHtml += "<tr>";
    sHtml += '<th colspan="4" class="pseudoheader" scope="colgroup">Sessions de Soutenance</th>';
    sHtml += "</tr>";
    _l2 = 1;
    var t0 = performance.now();
    while (_l2 <= iCurrentMaxLevel) {
      _i0 = data.get(TYPE_DEFENSE, SESSION_DONE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_DONE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_DONE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : réalisées</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées tard.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : étudiant abs.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate second array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    iTotG += iTotM;
    iTotQ = 0;
    iTotM = 0;
    sHtml += "<tr>";
    sHtml += '<th colspan="4" class="pseudoheader" scope="colgroup">Sessions de Coaching</th>';
    sHtml += "</tr>";
    _l2 = 1;
    var t0 = performance.now();
    while (_l2 <= iCurrentMaxLevel) {
      _i0 = data.get(TYPE_COACHING, SESSION_DONE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_DONE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_DONE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : réalisées</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées tard.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQ += _qa;
        iTotQ += _qf;
        iTotQ += _qo;
        iTotM += _ma;
        iTotM += _mf;
        iTotM += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : étudiant abs.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate third array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    iTotG += iTotM;
    sHtml += "<tr>";
    sHtml += '<th colspan="4" class="pseudoheader" scope="colgroup">Total Général</th>';
    sHtml += "</tr>";
    sHtml += `<td colspan="3"></td><td>${iTotG}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    sHtml += `<p>Soit un total général à facturer de ${iTotG}€`;
    Swal.fire({
      title: `<strong>Liste des formations tarifées du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen"
    });
  };
  var showBillPhase2 = function(dtFrom, dtTo, data) {
    console.log("%cEnter computation bill", APP_DEBUG_STYLE);
    const bShowEmptyLine = false;
    var sHtml = "";
    var iTotQa = 0;
    var iTotQf = 0;
    var iTotQo = 0;
    var iTotMa = 0;
    var iTotMf = 0;
    var iTotMo = 0;
    var iTotGQa = 0;
    var iTotGQf = 0;
    var iTotGQo = 0;
    var iTotGMa = 0;
    var iTotGMf = 0;
    var iTotGMo = 0;
    const oMeta = data.get(0, 0, 0, 0);
    const iCurrentMaxLevel = oMeta.maxLevel;
    var _0 = 0, _1 = 0, _2 = 0;
    var _q0 = 0, _q1 = 0, _q2 = 0;
    var _m0 = 0, _m1 = 0, _m2 = 0;
    var _qa = 0, _qf = 0, _qo = 0;
    var _pa = 0, _pf = 0, _po = 0;
    var _ma = 0, _mf = 0, _mo = 0;
    var _l2 = 1;
    sHtml += "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
    sHtml += '<div class="wrapper">';
    sHtml += "<table>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += '<th rowspan="2">Type</th><th colspan="3" scope="colgroup">Auto Financés</th><th colspan="3" scope="colgroup">Financés</th><th colspan="3" scope="colgroup">Autres</th><th colspan="2" scope="colgroup">Total</th>';
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += '<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="prix unitaire">Pu.</abbt>(<abbr title="hors taxes">HT</abbr>)</th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="prix unitaire">Pu.</abbt>(<abbr title="hors taxes">HT</abbr>)</th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="prix unitaire">Pu.</abbt>(<abbr title="hors taxes">HT</abbr>)</th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    sHtml += "<tr>";
    sHtml += '<th colspan="12" class="pseudoheader" scope="colgroup">Sessions de mentorat</th>';
    sHtml += "</tr>";
    var t0 = performance.now();
    while (_l2 <= iCurrentMaxLevel) {
      _i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : réalisées</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées tard.</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_SESSION, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : étud. absent</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQa}</td><td></td><td>${iTotMa}€</td>`;
    sHtml += `<td>${iTotQf}</td><td></td><td>${iTotMf}€</td>`;
    sHtml += `<td>${iTotQo}</td><td></td><td>${iTotMo}€</td>`;
    sHtml += `<td>${iTotQa + iTotQf + iTotQo}</td><td>${iTotMa + iTotMf + iTotMo}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    iTotGQa += iTotQa;
    iTotGQf += iTotQf;
    iTotGQo += iTotQo;
    iTotGMa += iTotMa;
    iTotGMf += iTotMf;
    iTotGMo += iTotMo;
    iTotQa = 0;
    iTotQf = 0;
    iTotQo = 0;
    iTotMa = 0;
    iTotMf = 0;
    iTotMo = 0;
    sHtml += "<tr>";
    sHtml += '<th colspan="12" class="pseudoheader" scope="colgroup">Sessions de Soutenance</th>';
    sHtml += "</tr>";
    _l2 = 1;
    while (_l2 <= iCurrentMaxLevel) {
      _i0 = data.get(TYPE_DEFENSE, SESSION_DONE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_DONE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_DONE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : réalisées</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées tard.</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_DEFENSE, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : étud. absent</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQa}</td><td></td><td>${iTotMa}€</td>`;
    sHtml += `<td>${iTotQf}</td><td></td><td>${iTotMf}€</td>`;
    sHtml += `<td>${iTotQo}</td><td></td><td>${iTotMo}€</td>`;
    sHtml += `<td>${iTotQa + iTotQf + iTotQo}</td><td>${iTotMa + iTotMf + iTotMo}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    iTotGQa += iTotQa;
    iTotGQf += iTotQf;
    iTotGQo += iTotQo;
    iTotGMa += iTotMa;
    iTotGMf += iTotMf;
    iTotGMo += iTotMo;
    iTotQa = 0;
    iTotQf = 0;
    iTotQo = 0;
    iTotMa = 0;
    iTotMf = 0;
    iTotMo = 0;
    sHtml += "<tr>";
    sHtml += '<th colspan="12" class="pseudoheader" scope="colgroup">Sessions de Coaching</th>';
    sHtml += "</tr>";
    var _l2 = 1;
    while (_l2 <= iCurrentMaxLevel) {
      _i0 = data.get(TYPE_COACHING, SESSION_DONE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_DONE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_DONE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : réalisées</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_CANCEL_LATE, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : annulées tard.</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _i0 = data.get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l2);
      _qa = _i0 === void 0 ? 0 : _i0.number;
      _ma = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_FUNDED, _l2);
      _qf = _i0 === void 0 ? 0 : _i0.number;
      _mf = _i0 === void 0 ? 0 : _i0.amount;
      _i0 = data.get(TYPE_COACHING, SESSION_STUDENT_AWAY, BILL_OTHER, _l2);
      _qo = _i0 === void 0 ? 0 : _i0.number;
      _mo = _i0 === void 0 ? 0 : _i0.amount;
      _pa = _qa > 0 ? _ma / _qa : _ma;
      _pf = _qf > 0 ? _mf / _qf : _mf;
      _po = _qo > 0 ? _mo / _qo : _mo;
      if (bShowEmptyLine === true || _qa + _qf + _qo > 0) {
        iTotQa += _qa;
        iTotQf += _qf;
        iTotQo += _qo;
        iTotMa += _ma;
        iTotMf += _mf;
        iTotMo += _mo;
        sHtml += "<tr>";
        sHtml += `<td>Niveau ${_l2} : étud. absent</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}€</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    iTotGQa += iTotQa;
    iTotGQf += iTotQf;
    iTotGQo += iTotQo;
    iTotGMa += iTotMa;
    iTotGMf += iTotMf;
    iTotGMo += iTotMo;
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQa}</td><td></td><td>${iTotMa}€</td>`;
    sHtml += `<td>${iTotQf}</td><td></td><td>${iTotMf}€</td>`;
    sHtml += `<td>${iTotQo}</td><td></td><td>${iTotMo}€</td>`;
    sHtml += `<td>${iTotQa + iTotQf + iTotQo}</td><td>${iTotMa + iTotMf + iTotMo}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    var iTotG = 0;
    var sAFOK = "";
    let iFlatFeeNumber = oMeta.flatFee.length;
    for (var t = 0; t < iFlatFeeNumber; t += 1) {
      iTotG += 30;
      sAFOK += oMeta.flatFee[t].who_name + ", ";
    }
    if (iFlatFeeNumber > 1) {
      sHtml += `<p class="flat_fee">Calcul du forfait "autofinancé". Ce mois ci ${iFlatFeeNumber} étudiants ont eu au moins une session il s'agit de : ${sAFOK.slice(0, -1)}`;
    } else {
      sHtml += `<p class="flat_fee">Calcul du forfait "autofinancé". Ce mois ci ${iFlatFeeNumber} étudiant a eu au moins une session il s'agit de : ${sAFOK.slice(0, -1)}`;
    }
    sHtml += `. Le forfait est donc de ${iTotG}€</p>`;
    sHtml += `<p>Soit un total général à facturer de ${iTotGMa + iTotGMf + iTotGMo + iTotG}€</p>`;
    Swal.fire({
      title: `<strong>Liste des formations tarifées du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen"
    });
  };
  var statistics = async function() {
    var [dtFrom, dtTo] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"), false);
    if (dtFrom === null || dtTo === null) {
      console.log("%cError need date from, date to", APP_ERROR_STYLE2);
      throw new Error();
    }
    const aData = lists_default.getListStatistic(dtFrom, dtTo);
    let sHtml = "";
    let aHtml = new Array(22);
    let aTot = Array.apply(null, Array(22)).map(Number.prototype.valueOf, 0);
    let dtCurFrom = dtFrom.clone();
    let dtCurTo = dtCurFrom.endOf("month");
    let sSuffix = "";
    aHtml[0] = `<thead><tr><th>Sessions</th>`;
    aHtml[1] = `<tbody><tr><td>Sessions</td>`;
    aHtml[2] = `<tr class="header"><td>Montant</td>`;
    aHtml[3] = `<tr><td>Nb.`;
    aHtml[4] = `<tr><td>Pu`;
    aHtml[5] = `<tr class="header"><td>Soutenances</td>`;
    aHtml[6] = `<tr><td>Montant</td>`;
    aHtml[7] = `<tr><td>Nb.`;
    aHtml[8] = `<tr><td>Pu`;
    aHtml[9] = `<tr class="header"><td>Coaching</td>`;
    aHtml[10] = `<tr><td>Montant</td>`;
    aHtml[11] = `<tr><td>Nb.`;
    aHtml[12] = `<tr><td>Pu`;
    aHtml[13] = `<tr class="header"><td>Bonus</td>`;
    aHtml[14] = `<tr><td>Bonus AF</td>`;
    aHtml[15] = `<tr><td>Total Général</td>`;
    aHtml[16] = `<tr class="header"><td>KPI</td>`;
    aHtml[17] = `<tr><td>NbJrs</td>`;
    aHtml[18] = `<tr><td>TJM</td>`;
    aHtml[19] = `<tr><td>Nb hrs</td>`;
    aHtml[20] = `<tr><td>THM</td>`;
    aHtml[21] = `<tr><td>Nb hrs (p.)</td>`;
    aHtml[22] = `<tr><td>THM (p)</td>`;
    for (var _m = 0; _m < aData.length; _m += 1) {
      aTot[2] += aData[_m].sessions.total;
      aTot[3] += aData[_m].sessions.nb - aData[_m].sessions.nbc;
      aTot[4] += aData[_m].sessions.pu;
      aTot[6] += aData[_m].defenses.total;
      aTot[7] += aData[_m].defenses.nb - aData[_m].defenses.nbc;
      aTot[8] += aData[_m].defenses.pu;
      aTot[10] += aData[_m].coaches.total;
      aTot[11] += aData[_m].coaches.nb - aData[_m].coaches.nbc;
      aTot[12] += aData[_m].coaches.pu;
      aTot[14] += aData[_m].bonus;
      let _iTotG = aData[_m].sessions.total + aData[_m].defenses.total + aData[_m].coaches.total + aData[_m].bonus;
      aTot[15] += _iTotG;
      aTot[16] += aData[_m].kpi.jrs;
      aTot[18] += aData[_m].kpi.hrs;
      aTot[20] += aData[_m].kpi.hrsp;
      if (aData.length == 1)
        sSuffix = "</tr>";
      if (_m === aData.length - 1 && aData.length > 1) {
        if (dtCurTo.isAfter(dtTo, "day")) {
          aTot[2] -= aData[_m].sessions.total;
          aTot[3] -= aData[_m].sessions.nb - aData[_m].sessions.nbc;
          aTot[4] -= aData[_m].sessions.pu;
          aTot[6] -= aData[_m].defenses.total;
          aTot[7] -= aData[_m].defenses.nb - aData[_m].defenses.nbc;
          aTot[8] -= aData[_m].defenses.pu;
          aTot[10] -= aData[_m].coaches.total;
          aTot[11] -= aData[_m].coaches.nb - aData[_m].coaches.nbc;
          aTot[12] -= aData[_m].coaches.pu;
          aTot[14] -= aData[_m].bonus;
          aTot[15] -= _iTotG;
          aTot[16] -= aData[_m].kpi.jrs;
          aTot[18] -= aData[_m].kpi.hrs;
          aTot[20] -= aData[_m].kpi.hrsp;
          aHtml[0] += `<td>Total(moy)</td><td>${dayjs(aData[_m].header.dtTo).format("MMMM")}</td></thead></tr>`;
          aHtml[1] += `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
          aHtml[2] += `<td>${aTot[2]} (${(aTot[2] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].sessions.total}</td></tr>`;
          aHtml[3] += `<td>${aTot[3]} (${(aTot[3] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].sessions.nb} (${aData[_m].sessions.nbc})</td></tr>`;
          aHtml[4] += `<td> n/a (${(aTot[4] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].sessions.pu.toFixed(2)}</td></tr>`;
          aHtml[5] += `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
          aHtml[6] += `<td>${aTot[6]} (${(aTot[6] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].defenses.total}</td></tr>`;
          aHtml[7] += `<td>${aTot[7]} (${(aTot[7] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].defenses.nb} (${aData[_m].defenses.nbc})</td></tr>`;
          aHtml[8] += `<td> n/a (${(aTot[8] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].defenses.pu.toFixed(2)}</td></tr>`;
          aHtml[9] += `<td>&nbsp;</td>${sSuffix}`;
          aHtml[10] += `<td>${aTot[10]} (${(aTot[10] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].coaches.total}</td></tr>`;
          aHtml[11] += `<td>${aTot[11]} (${(aTot[11] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].coaches.nb} (${aData[_m].coaches.nbc})</td></tr>`;
          aHtml[12] += `<td> n/a (${(aTot[12] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].coaches.pu.toFixed(2)}</td></tr>`;
          aHtml[13] += `<td>&nbsp;</td></tr>`;
          aHtml[14] += `<td>${aTot[14]} (${(aTot[14] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].bonus}</td></tr>`;
          aHtml[15] += `<td>${aTot[15]} (${(aTot[15] / (aData.length - 1)).toFixed(2)})</td><td>${_iTotG}</td></tr>`;
          aHtml[16] += `<td>&nbsp;</td></tr>`;
          aHtml[17] += `<td>${aTot[16]} (${(aTot[16] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].kpi.jrs}</td></tr>`;
          aHtml[18] += `<td> n/a (${(aTot[15] / aTot[16]).toFixed(2)})</td><td>${(_iTotG / aData[_m].kpi.jrs).toFixed(2)}</td></tr>`;
          aHtml[19] += `<td>${aTot[18]} (${(aTot[18] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].kpi.hrs.toFixed(2)}</td></tr>`;
          aHtml[20] += `<td> n/a  (${(aTot[15] / aTot[18]).toFixed(2)})</td><td>${(_iTotG / aData[_m].kpi.hrs).toFixed(2)}</td></tr>`;
          aHtml[21] += `<td>${aTot[20].toFixed(2)} (${(aTot[20] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].kpi.hrsp.toFixed(2)}</td></tr>`;
          aHtml[22] += `<td> n/a  (${(aTot[15] / aTot[20]).toFixed(2)})</td><td>${(_iTotG / aData[_m].kpi.hrsp).toFixed(2)}</td></tr>`;
        } else {
          aHtml[0] += `<td>${dayjs(aData[_m].header.dtTo).format("MMMM")}</td><td>Tot.</td></thead></tr>`;
          aHtml[1] += `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
          aHtml[2] += `<td>${aData[_m].sessions.total}</td><td>${aTot[2]} (${(aTot[2] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[3] += `<td>${aData[_m].sessions.nb} (${aData[_m].sessions.nbc})</td><td>${aTot[3]} (${(aTot[3] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[4] += `<td>${aData[_m].sessions.pu.toFixed(2)}</td><td> n/a (${(aTot[4] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[5] += `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
          aHtml[6] += `<td>${aData[_m].defenses.total}</td><td>${aTot[6]} (${(aTot[6] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[7] += `<td>${aData[_m].defenses.nb} (${aData[_m].defenses.nbc})</td><td>${aTot[7]} (${(aTot[7] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[8] += `<td>${aData[_m].defenses.pu.toFixed(2)}</td><td> n/a (${(aTot[8] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[9] += `<td>&nbsp;</td>${sSuffix}`;
          aHtml[10] += `<td>${aData[_m].coaches.total}</td><td>${aTot[10]} (${(aTot[10] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[11] += `<td>${aData[_m].coaches.nb} (${aData[_m].coaches.nbc})</td><td>${aTot[11]} (${(aTot[11] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[12] += `<td>${aData[_m].coaches.pu.toFixed(2)}</td><td> n/a (${(aTot[12] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[13] += `<td>&nbsp;</td></tr>`;
          aHtml[14] += `<td>${aData[_m].bonus}</td><td>${aTot[14]} (${(aTot[14] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[15] += `<td>${_iTotG}</td><td>${aTot[15]} (${(aTot[15] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[16] += `<td>&nbsp;</td></tr>`;
          aHtml[17] += `<td>${aData[_m].kpi.jrs}</td><td>${aTot[16]} (${(aTot[16] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[18] += `<td>${(_iTotG / aData[_m].kpi.jrs).toFixed(2)}</td><td> n/a (${(aTot[15] / aTot[16]).toFixed(2)})</td></tr>`;
          aHtml[19] += `<td>${aData[_m].kpi.hrs.toFixed(2)}</td><td>${aTot[18]} (${(aTot[18] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[20] += `<td>${(_iTotG / aData[_m].kpi.hrs).toFixed(2)}</td><td> n/a  (${(aTot[15] / aTot[18]).toFixed(2)})</td></tr>`;
          aHtml[21] += `<td>${aData[_m].kpi.hrsp.toFixed(2)}</td><td>${aTot[20].toFixed(2)} (${(aTot[20] / aData.length).toFixed(2)})</td></tr>`;
          aHtml[22] += `<td>${(_iTotG / aData[_m].kpi.hrsp).toFixed(2)}</td><td> n/a  (${(aTot[15] / aTot[20]).toFixed(2)})</td></tr>`;
        }
      } else {
        aHtml[0] += `<td>${dayjs(aData[_m].header.dtTo).format("MMMM")}</td>${sSuffix}`;
        aHtml[1] += `<td>&nbsp;</td>${sSuffix}`;
        aHtml[2] += `<td>${aData[_m].sessions.total}</td>${sSuffix}`;
        aHtml[3] += `<td>${aData[_m].sessions.nb} (${aData[_m].sessions.nbc})</td>${sSuffix}`;
        aHtml[4] += `<td>${aData[_m].sessions.pu.toFixed(2)}</td>${sSuffix}`;
        aHtml[5] += `<td>&nbsp;</td>${sSuffix}`;
        aHtml[6] += `<td>${aData[_m].defenses.total}</td>${sSuffix}`;
        aHtml[7] += `<td>${aData[_m].defenses.nb} (${aData[_m].defenses.nbc})</td>${sSuffix}`;
        aHtml[8] += `<td>${aData[_m].defenses.pu.toFixed(2)}</td>${sSuffix}`;
        aHtml[9] += `<td>&nbsp;</td>${sSuffix}`;
        aHtml[10] += `<td>${aData[_m].coaches.total}</td>${sSuffix}`;
        aHtml[11] += `<td>${aData[_m].coaches.nb} (${aData[_m].coaches.nbc})</td>${sSuffix}`;
        aHtml[12] += `<td>${aData[_m].coaches.pu.toFixed(2)}</td>${sSuffix}`;
        aHtml[13] += `<td>&nbsp;</td>${sSuffix}`;
        aHtml[14] += `<td>${aData[_m].bonus}</td>${sSuffix}`;
        aHtml[15] += `<td>${_iTotG}</td>${sSuffix}`;
        aHtml[16] += `<td>&nbsp;</td>${sSuffix}`;
        aHtml[17] += `<td>${aData[_m].kpi.jrs}</td>${sSuffix}`;
        aHtml[18] += `<td>${(_iTotG / aData[_m].kpi.jrs).toFixed(2)}</td>${sSuffix}`;
        aHtml[19] += `<td>${aData[_m].kpi.hrs.toFixed(2)}</td>${sSuffix}`;
        aHtml[20] += `<td>${(_iTotG / aData[_m].kpi.hrs).toFixed(2)}</td>${sSuffix}`;
        aHtml[21] += `<td>${aData[_m].kpi.hrsp.toFixed(2)}</td>${sSuffix}`;
        aHtml[22] += `<td>${(_iTotG / aData[_m].kpi.hrsp).toFixed(2)}</td>${sSuffix}`;
      }
      dtCurFrom = dtCurFrom.add(1, "month");
      dtCurTo = dtCurFrom.endOf("month");
    }
    sHtml = "<table>" + aHtml.join(" ") + `</tbody><tfoot><tr><td colspan=${aData.length + 1}>la valeur entre parenthèse fait reference aux annulés</td></tr></tfoot></table>`;
    Swal.fire({
      title: `<strong>Statistiques du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen",
      onOpen: (el) => {
      }
    });
  };

  // src/vendor/runcss/runcss.js
  let isNum = (v) => !isNaN(v);
  let isStartNum = (v) => !isNaN(parseInt(v));
  let split = (s) => s.split("!");
  let indexOf = (s, v) => split(s).indexOf(v);
  let includes = (s, v) => split(s).includes(v);
  let ifRemTo = (v) => isNum(v) ? negative + Number(v) * 0.25 + "rem" : negative + v;
  let newObject = (o = {}) => Object.assign(Object.create(null), o);
  let classesCache = new Map();
  let customCache = new Map();
  let parentSheet;
  let config = newObject({separator: ":", screens: {sm: "640px", md: "768px", lg: "1024px", xl: "1280px"}});
  let isObject = (value) => Object.prototype.toString.call(value) === "[object Object]";
  let hex6 = (value) => {
    if (typeof value !== "string") {
      throw Error("Hex value is not a hex string.");
    }
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    value = value.length === 4 ? value.slice(1).split("").map((v) => v + v).join("") : value.slice(1);
    if (!/^[0-9a-f]{6}$/i.test(value)) {
      throw Error("Incorrect hex color format.");
    }
    return value;
  };
  let customColors = new Map();
  if (document.styleSheets.length === 0) {
    parentSheet = document.head.appendChild(document.createElement("style")).sheet;
  } else {
    parentSheet = document.styleSheets[0];
  }
  let media = new Map();
  let originalClass;
  let formatters = newObject({
    p: "padding",
    m: "margin",
    h: "height",
    z: "z-index",
    w: "width"
  });
  let classNames = newObject();
  for (let c of split('box-border|-webkit-box-sizing:border-box;box-sizing:border-box!box-content|-webkit-box-sizing:content-box;box-sizing:content-box!hidden|display:none!object-scale-down|object-fit:scale-down;-o-object-fit:scale-down!scrolling-touch|-webkit-overflow-scrolling:touch!scrolling-auto|-webkit-overflow-scrolling:auto!visible|visibility:visible!invisible|visibility:hidden!order-first|order:-9999!order-last|order:9999!order-none|order:0!grid-cols-none|grid-template-columns:none!col-auto|grid-column:auto!col-start-auto|-ms-grid-column:auto;grid-column-start:auto!col-end-auto|-ms-grid-column-span:auto;grid-column-end:auto!grid-rows-none|-ms-grid-rows:none;grid-template-rows:none!row-auto|grid-row:auto!row-start-auto|-ms-grid-row:auto;grid-row-start:auto!row-end-auto|-ms-grid-row-span:auto;grid-row-end:auto!gap-px|gap:1px!row-gap-px|row-gap:1px!grid-flow-row|grid-auto-flow:row!grid-flow-col|grid-auto-flow:column!grid-flow-row-dense|grid-auto-flow:row dense!grid-flow-col-dense|grid-auto-flow:column dense!min-w-full|min-width:100%!max-w-full|max-width:100%!max-w-screen-sm|max-width:640px!max-w-screen-md|max-width:768px!max-w-screen-lg|max-width:1024px!max-w-screen-xl|max-width:1280px!max-w-none|max-width:none!min-h-full|min-height:100%!min-h-screen|min-height:100vh!max-h-full|max-height:100%!max-h-screen|max-height:100vh!text-2xl|font-size:1.5rem!text-3xl|font-size:1.875rem!text-4xl|font-size:2.25rem!underline|text-decoration:underline!line-through|text-decoration:line-through!no-underline|text-decoration:none!uppercase|text-transform:uppercase!lowercase|text-transform:lowercase!capitalize|text-transform:capitalize!normal-case|text-transform:none!whitespace-no-wrap|white-space:nowrap!break-normal|word-break:normal;overflow-wrap:normal!break-words|overflow-wrap:break-word!break-all|word-break:break-all!truncate|overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;white-space:nowrap!h-auto|height:auto!max-w-2xl|max-width:42rem!tracking-tighter|letter-spacing:-0.05em!tracking-tight|letter-spacing:-0.025em!tracking-normal|0!tracking-wide:letter-spacing:0.025em!tracking-wider|letter-spacing:0.05em!tracking-widest|letter-spacing: 0.1em!leading-none|line-height:1!leading-tight|line-height:1.25!leading-snug|line-height:1.375!leading-normal|line-height:1.5!leading-relaxed|line-height:1.625!leading-loose|line-height:2!list-none|list-style-type:none!list-disc|list-style-type:disc!list-decimal|list-style-type:decimal!list-inside|list-style-position:inside!list-outside|list-style-position:outside!border|border-width:1px!border-collapse|border-collapse:collapse!border-separate|border-collapse:separate!table-auto|table-layout:auto!table-fixed|table-layout:fixed!appearance-none|-webkit-appearance:none;-moz-appearance:none;appearance:none!outline-none|outline:0!resize-none|resize:none!resize|resize:both!resize-y|resize:vertical!resize-x|resize:horizontal!fill-current|fill:currentColor!stroke-current|stroke:currentColor!sr-only|position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0!not-sr-only|position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal!font-sans|font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji!font-serif|font-family:Georgia,Cambria,"Times New Roman",Times,serif!font-mono|font-family:Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace!sticky|position:-webkit-sticky;position:sticky')) {
    let [k, v] = c.split("|");
    classNames[k] = v;
  }
  for (let c of split("float-right!float-left!float-none!clear-left!clear-right!clear-both!clear-none")) {
    classNames[c] = c.replace("-", ":");
  }
  for (let c of split("block!flow-root!inline-block!inline!flex!grid!inline-grid!table!table-caption!table-cell!table-column!table-column-group!table-footer-group!table-header-group!table-row-group!table-row")) {
    let p = c;
    if (c === "flex") {
      p = "-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex";
    } else if (c === "inline-flex") {
      p = "-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex";
    } else if (c === "grid") {
      p = "-ms-grid;display:grid";
    } else if (c === "inline-grid") {
      p = "-ms-inline-grid;display:inline-grid";
    }
    classNames[c] = "display:" + p;
  }
  for (let c of split("static!fixed!absolute!relative")) {
    classNames[c] = "position:" + c;
  }
  let colors = split("f7fafc!edf2f7!e2e8f0!cbd5e0!a0aec0!718096!4a5568!2d3748!1a202c!fff5f5!fed7d7!feb2b2!fc8181!f56565!e53e3e!c53030!9b2c2c!742a2a!fffaf0!feebc8!fbd38d!f6ad55!ed8936!dd6b20!c05621!9c4221!7b341e!fffff0!fefcbf!faf089!f6e05e!ecc94b!d69e2e!b7791f!975a16!744210!f0fff4!c6f6d5!9ae6b4!68d391!48bb78!38a169!2f855a!276749!22543d!e6fffa!b2f5ea!81e6d9!4fd1c5!38b2ac!319795!2c7a7b!285e61!234e52!ebf8ff!bee3f8!90cdf4!63b3ed!4299e1!3182ce!2b6cb0!2c5282!2a4365!ebf4ff!c3dafe!a3bffa!7f9cf5!667eea!5a67d8!4c51bf!434190!3c366b!faf5ff!e9d8fd!d6bcfa!b794f4!9f7aea!805ad5!6b46c1!553c9a!44337a!fff5f7!fed7e2!fbb6ce!f687b3!ed64a6!d53f8c!b83280!97266d!702459");
  let colorNames = split("gray!red!orange!yellow!green!teal!blue!indigo!purple!pink");
  let roundedSize = split("none!sm!nm!md!lg!full");
  let edge = newObject({l: "left", r: "right", t: "top", b: "bottom"});
  let setColor = (type2) => {
    if (secondPart === "opacity" && isNum(thirdPart)) {
      rule = `--${type2}-opacity:` + (thirdPart === "100" ? "1" : thirdPart / 100);
    } else {
      let color = customColors.get(rest);
      if (color) {
        if (thirdPart && isObject(color)) {
          color = color[thirdPart];
        }
      } else {
        if (thirdPart) {
          let colorPos = colorNames.indexOf(secondPart);
          color = colors[colorPos * 9 + (Number(thirdPart[0]) - 1)];
        } else if (secondPart && secondPart.startsWith("#")) {
          try {
            color = hex6(secondPart);
          } catch {
          }
        }
      }
      if (color) {
        let rgba = type2 + `:rgba(${parseInt(color.slice(0, 2), 16)},${parseInt(color.slice(2, 4), 16)},${parseInt(color.slice(4, 6), 16)},var(--${type2}-opacity,1))`;
        rule = type2 + `:#${color};` + rgba;
      } else if (secondPart === "current") {
        rule = type2 + ":currentColor";
      } else {
        rule = type2 + ":" + rest;
      }
    }
  };
  let setPosition = () => {
    if (!fourthPart && (includes("auto!initial!inherit", lastPart) || isStartNum(lastPart))) {
      let v = negative + lastPart;
      if (thirdPart) {
        sheetLevel = 1;
        if (secondPart === "y") {
          rule = `top:${v};bottom:` + v;
        } else if (secondPart === "x") {
          rule = `left:${v};right:` + v;
        }
      } else if (secondPart) {
        if (firstPart === "inset") {
          rule = `top:${v};right:${v};bottom:${v};left:` + v;
        } else {
          sheetLevel = 2;
          rule = firstPart + ":" + v;
        }
      }
    }
  };
  let timeProp = () => {
    let v;
    if (isNum(secondPart)) {
      v = secondPart + "ms";
    } else if (isStartNum(secondPart)) {
      v = secondPart;
    }
    if (v) {
      rule = `-webkit-transition-${firstPart}:${v};-o-transition-${firstPart}:${v};transition-${firstPart}:` + v;
    }
  };
  let cls2process = newObject({
    object: () => {
      if (includes("contain!cover!fill!none!bottom", rest)) {
        rule = `-o-object-fit:${rest};object-fit:` + rest;
      } else if (includes("bottom!center!left!left-bottom!left-top!right!right-bottom!right-top!top", rest)) {
        rest = rest.replace("-", " ");
        rule = `-o-object-position:${rest};object-position:` + rest;
      }
    },
    overflow: () => {
      if (includes("x!y", secondPart)) {
        sheetLevel = 1;
      }
      rule = partsWithoutEnd + ":" + lastPart;
    },
    clearfix: () => {
      originalClass = "clearfix::after";
      rule = 'content:"";display:table;clear:both';
    },
    text: () => {
      let pos = indexOf("xs!sm!base!lg!xl", secondPart);
      if (pos > -1) {
        rule = `font-size:${0.75 + 0.125 * pos}rem`;
      } else if (secondPart.endsWith("xl")) {
        let [num] = secondPart.split("x");
        if (isNum(num)) {
          rule = `font-size:${Number(num) - 2}rem`;
        }
      } else if (includes("left!center!right!justify", rest)) {
        rule = "text-align:" + rest;
      } else {
        setColor("color");
      }
    },
    font: () => {
      let pos = indexOf("hairline!thin!light!normal!medium!semibold!bold!extrabold!black", secondPart);
      if (pos > -1) {
        rule = "font-weight:" + 100 * (1 + pos);
      } else if (isNum(secondPart)) {
        rule = "font-weight:" + secondPart;
      }
    },
    whitespace: () => {
      if (includes("normal!pre!pre-line!pre-wrap", rest)) {
        rule = "white-space:" + rest;
      }
    },
    inset: setPosition,
    top: setPosition,
    right: setPosition,
    bottom: setPosition,
    left: setPosition,
    flex: () => {
      let ruleFunc = (v1, v2 = 1, v3 = "0%") => `-webkit-box-flex:${v1};-ms-flex:${v1} ${v2} ${v3};flex:${v1} ${v2} ` + v3;
      if (includes("row!row-reverse!col!col-reverse", rest)) {
        rest = rest.replace("col", "column");
        rule = `-webkit-box-orient:${secondPart === "row" ? "horizontal" : "vertical"};-webkit-box-direction:${thirdPart === "reverse" ? thirdPart : "normal"};-ms-flex-direction:${rest};flex-direction:${rest}`;
      } else if (includes("no-wrap!flex-wrap!wrap-reverse", rest)) {
        if (rest === "no-wrap") {
          rest = "nowrap";
        }
        rule = `-ms-flex-wrap:${rest};flex-wrap:${rest}`;
      } else if (includes("grow!shrink", secondPart)) {
        sheetLevel = 1;
        let v = thirdPart || 1;
        if (secondPart === "grow") {
          rule = `-webkit-box-flex:${v};-ms-flex-positive:${v};flex-grow:${v}`;
        } else {
          rule = `-ms-flex-negative:${v};flex-shrink:${v}`;
        }
      } else if (rest === "initial") {
        rule = ruleFunc(0, 1, "auto");
      } else if (rest === "auto") {
        rule = ruleFunc(1, 1, "auto");
      } else if (rest === "none") {
        rule = "-webkit-box-flex:0;-ms-flex:none;flex:none";
      } else if (fourthPart) {
        rule = ruleFunc(secondPart, thirdPart, fourthPart);
      } else if (thirdPart) {
        rule = ruleFunc(secondPart, thirdPart);
      } else {
        rule = ruleFunc(secondPart);
      }
    },
    order: () => {
      if (isNum(secondPart)) {
        let num = negative + secondPart;
        rule = `-webkit-box-ordinal-group:${Number(num) + 1};-ms-flex-order:${num};order:` + num;
      }
    },
    grid: () => {
      if (isNum(thirdPart)) {
        rule = newObject({
          cols: `-ms-grid-columns:(minmax(0,1fr))[${thirdPart}];grid-template-columns: repeat(${thirdPart}, minmax(0, 1fr))`,
          span: `-ms-grid-column-span:${thirdPart};grid-column: span ${thirdPart} / span ` + thirdPart,
          start: `-ms-grid-column:${thirdPart};grid-column-start:` + thirdPart,
          end: `-ms-grid-column-span:${thirdPart};grid-column-end:` + thirdPart,
          rows: `-ms-grid-rows:(minmax(0,1fr))[${thirdPart}];grid-template-rows: repeat(${thirdPart}, minmax(0, 1fr))`
        })[secondPart];
      }
    },
    row: () => {
      if (isStartNum(thirdPart)) {
        rule = newObject({
          span: `-ms-grid-row-span:${thirdPart};grid-row: span ${thirdPart} / span ${thirdPart}`,
          start: `-ms-grid-row:${thirdPart};grid-row-start:` + thirdPart,
          end: `-ms-grid-row-span:${thirdPart};grid-row-end:` + thirdPart,
          gap: "row-gap:" + ifRemTo(thirdPart)
        })[secondPart];
      }
    },
    col: () => {
      if (isNum(thirdPart)) {
        if (secondPart === "span") {
          rule = `-ms-grid-column-span:${thirdPart};grid-column:span ${thirdPart} / span ${thirdPart};`;
        } else if (secondPart === "start") {
          rule = `-ms-grid-column:${thirdPart};grid-column-start:${thirdPart}`;
        } else if (secondPart === "end") {
          rule = `-ms-grid-column-span:${thirdPart};grid-column-end:${thirdPart}`;
        }
      }
      if (isStartNum(thirdPart) && secondPart === "gap") {
        let v = thirdPart === "px" ? "1px" : ifRemTo(thirdPart);
        rule = `-webkit-column-gap:${v};-moz-column-gap:${v}column-gap:` + v;
      }
    },
    gap: () => {
      if (isStartNum(secondPart)) {
        rule = "gap:" + ifRemTo(secondPart);
      }
    },
    space: () => {
      pseudos = [">:not(template)~:not(template)"];
      if (thirdPart === "px") {
        thirdPart = "1px";
      }
      if (thirdPart) {
        if (isStartNum(thirdPart)) {
          let v = ifRemTo(thirdPart);
          if (secondPart === "x") {
            rule = `margin-right:calc(${v}*var(--space-x-reverse,0));margin-left:calc(${v}*(1 - var(--space-x-reverse,0)))`;
          } else if (secondPart === "y") {
            rule = `margin-top:calc(${v}*(1 - var(--space-y-reverse,0)));margin-bottom:calc(${v}*var(--space-y-reverse,0))`;
          }
        } else if (thirdPart === "reverse") {
          rule = `--space-${secondPart}-reverse:1`;
        }
      }
    },
    divide: () => {
      pseudos = [">:not(template)~:not(template)"];
      sheetLevel = 1;
      if (!fourthPart) {
        let v;
        if (isNum(thirdPart)) {
          v = thirdPart + "px";
        } else if (isStartNum(thirdPart)) {
          v = thirdPart;
        } else if (thirdPart === "reverse") {
          rule = `--divide-${secondPart}-reverse:1`;
        } else if (secondPart) {
          v = "1px";
        }
        if (v) {
          if (secondPart === "y") {
            rule = `border-top-width:calc(${v}*calc(1 - var(--divide-y-reverse,0)));border-bottom-width:calc(${v}*var(--divide-y-reverse,0)))`;
          } else if (secondPart === "x") {
            rule = `border-right-width:calc(${v}*var(--divide-x-reverse,0));border-left-width:calc(${v}*calc(1 - var(--divide-x-reverse,0)))`;
          }
        }
      }
      if (!rule) {
        setColor("border-color");
      }
    },
    min: () => {
      if (isStartNum(thirdPart)) {
        if (secondPart === "w" || secondPart === "h") {
          let p = secondPart === "w" ? "width" : "height";
          rule = `min-${p}:` + thirdPart;
        }
      }
    },
    max: () => {
      if (secondPart === "w") {
        let pos = indexOf("xs!sm!md!lg!xl", thirdPart);
        if (pos > -1) {
          rule = `max-width:${pos * 4 + 20}rem`;
        } else if (isStartNum(thirdPart)) {
          if (thirdPart.endsWith("xl")) {
            rule = `max-width:${parseInt(thirdPart) * 8 + 24}rem`;
          } else {
            rule = "max-width:" + thirdPart;
          }
        }
      } else if (secondPart === "h" && isStartNum(thirdPart)) {
        rule = "max-height:" + thirdPart;
      }
    },
    tracking: () => {
      if (isStartNum(secondPart)) {
        rule = "letter-spacing:" + secondPart;
      }
    },
    leading: () => {
      if (isNum(secondPart)) {
        rule = `line-height:${Number(secondPart) * 0.25}rem`;
      } else if (isStartNum(secondPart)) {
        rule = "line-height:" + secondPart;
      }
    },
    placeholder: () => {
      pseudos.push("::placeholder");
      setColor("color");
    },
    align: () => {
      if (includes("baseline!top!middle!bottom!text-top!text-bottom", rest)) {
        rule = "vertical-align:" + rest;
      }
    },
    bg: () => {
      rest = rest.replace("-", " ");
      if (includes("bottom!center!left!left bottom!left top!right!right bottom!right top!top", rest)) {
        rule = "background-position:" + rest;
      } else if (includes("repeat!no-repeat!repeat-x!repeat-y", rest)) {
        rule = "background-repeat:" + rest;
      } else if (includes("repeat-round!repeat-space", rest)) {
        rule = "background-repeat:" + thirdPart;
      } else if (includes("auto!cover!contain", rest)) {
        rule = "background-size:" + rest;
      } else if (includes("fixed!local!scroll", secondPart)) {
        rule = "background-attachment:" + secondPart;
      } else {
        setColor("background-color");
      }
    },
    rounded: () => {
      let v;
      let pos = roundedSize.indexOf(lastPart);
      if (isStartNum(lastPart)) {
        v = lastPart;
        pos = 9;
      } else if (pos === 5) {
        v = "9999px";
      } else if (pos > -1) {
        v = pos * 0.125 + "rem";
      } else if (!secondPart || edge[secondPart] || includes("t!b", secondPart[0]) && includes("r!l", secondPart[1])) {
        v = "0.25rem";
      }
      if (v) {
        let place1 = edge[secondPart[0]];
        if (!secondPart || !thirdPart && pos > -1) {
          rule = "border-radius:" + v;
        } else if (includes("t!b", secondPart)) {
          sheetLevel = 1;
          rule = `border-${place1}-left-radius:${v};border-${place1}-right-radius:` + v;
        } else if (includes("l!r", secondPart)) {
          sheetLevel = 1;
          rule = `border-top-${place1}-radius:${v};border-bottom-${place1}-radius:` + v;
        } else {
          sheetLevel = 2;
          rule = `border-${place1}-${edge[secondPart[1]]}-radius:` + v;
        }
      }
    },
    border: () => {
      let b = edge[secondPart];
      if (thirdPart && b) {
        if (isNum(thirdPart)) {
          sheetLevel = 1;
          rule = `border-${b}-width:${thirdPart}px`;
        } else if (isStartNum(thirdPart)) {
          rule = `border-${b}-width:` + thirdPart;
        }
      } else {
        if (includes("solid!dashed!dotted!double!none", secondPart)) {
          rule = "border-style:" + secondPart;
        } else if (b) {
          sheetLevel = 1;
          rule = `border-${b}-width:1px`;
        } else if (isNum(secondPart)) {
          rule = `border-width:${secondPart}px`;
        } else if (isStartNum(secondPart)) {
          rule = "border-width:" + secondPart;
        } else {
          setColor("border-color");
        }
      }
    },
    opacity: () => {
      if (isNum(secondPart)) {
        rule = "opacity:" + secondPart / 100;
      }
    },
    transition: () => {
      let ruleFunc = (value) => `-webkit-transition-property:${value};-o-transition-property:${value};transition-property:` + value;
      let ruleFunc2 = (value) => `-webkit-transition-property:-webkit-${value};transition-property:-webkit-${value};-o-transition-property:${value};transition-property:${value};transition-property:${value},-webkit-${value}`;
      if (!secondPart) {
        rule = "-webkit-transition-property:S-webkit-box-shadow,-webkit-transform;transition-property:S-webkit-box-shadow,-webkit-transform;-o-transition-property:Sbox-shadow,transform;transition-property:Sbox-shadow,transform;transition-property:Sbox-shadow,transform,-webkit-box-shadow,-webkit-transform";
        rule = rule.replace(/S/g, "background-color,border-color,color,fill,stroke,opacity,");
      } else if (secondPart === "colors") {
        rule = ruleFunc("background-color,border-color,color,fill,stroke");
      } else if (secondPart === "shadow") {
        rule = ruleFunc2("box-shadow");
      } else if (secondPart === "transform") {
        rule = ruleFunc2("transform");
      } else if (secondPart) {
        rule = ruleFunc(secondPart);
      }
    },
    duration: timeProp,
    delay: timeProp,
    ease: () => {
      let ruleFunc = (value) => `-webkit-transition-timing-function:${value};-o-transition-timing-function:${value};transition-timing-function:${value}`;
      if (rest === "in") {
        rule = ruleFunc("cubic-bezier(0.4,0,1,1)");
      } else if (rest === "out") {
        rule = ruleFunc("cubic-bezier(0,0,0.2,1)");
      } else if (rest === "in-out") {
        rule = ruleFunc("cubic-bezier(0.4,0,0.2,1)");
      } else if (rest === "linear") {
        rule = ruleFunc("linear");
      }
    },
    scale: () => {
      if (isNum(lastPart)) {
        let v = lastPart / 100;
        if (includes("x!y", secondPart)) {
          sheetLevel = 1;
          rule = `--transform-scale-${secondPart}:` + v;
        } else {
          rule = `--transform-scale-x:${v};--transform-scale-y:` + v;
        }
      }
    },
    rotate: () => {
      if (isNum(secondPart)) {
        rule = `--transform-rotate:${negative}${secondPart}deg`;
      }
    },
    translate: () => {
      if (includes("x!y", secondPart)) {
        if (thirdPart === "px") {
          thirdPart = "1px";
        } else if (thirdPart === "full") {
          thirdPart = "100%";
        } else if (thirdPart.includes("/")) {
          let fractions = thirdPart.split("/");
          if (fractions.length === 2) {
            thirdPart = Number(fractions[0]) / Number(fractions[1]) + "%";
          }
        }
        if (isStartNum(thirdPart)) {
          rule = `--transform-translate-${secondPart}:` + ifRemTo(thirdPart);
        }
      }
    },
    skew: () => {
      if (includes("x!y", secondPart) && isNum(thirdPart)) {
        rule = `--transform-skew-${secondPart}:${negative + thirdPart}deg`;
      }
    },
    transform: () => {
      let v = "translatex(var(--transform-translate-x,0))translatey(var(--transform-translate-y,0))rotate(var(--transform-rotate,0))skewx(var(--transform-skew-x,0))skewy(var(--transform-skew-y,0))scalex(var(--transform-scale-x,1))scaley(var(--transform-scale-y,1))";
      rule = `-webkit-transform:${v};-ms-transform:${v};transform:` + v;
    },
    origin: () => {
      if (includes("center!top!top-right!right!bottom-right!bottom!bottom-left!left!top-left", rest)) {
        rest = rest.replace("-", " ");
        rule = `-webkit-transform-origin:${rest};-ms-transform-origin:${rest};transform-origin:` + rest;
      }
    },
    cursor: () => {
      if (includes("auto!default!pointer!wait!text!move!not-allowed", rest)) {
        rule = "cursor:" + rest;
      }
    },
    shadow: () => {
      let shadows = newObject({
        xs: "0 0 0 1pxR.05)",
        sm: "0 1px 2px 0R.05)",
        "": "0 1px 3px 0R.1), 0 1px 2px 0R.06)",
        md: "0 4px 6px -1pxR.1), 0 2px 4px -1pxR.06)",
        lg: "0 10px 15px -3pxR.1), 0 4px 6px -2pxR.05)",
        xl: "0 20px 25px -5pxR.1), 0 10px 10px -5pxR.04)",
        "2xl": "0 25px 50px -12pxR.25)",
        inner: "inset 0 2px 4px 0R.06)",
        outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
        none: "none"
      });
      let v = shadows[secondPart];
      if (v) {
        v = v.replace(/R/g, " rgba(0, 0, 0, 0");
        rule = `-webkit-box-shadow:${v};box-shadow:` + v;
      }
    },
    outline: () => {
      if (secondPart) {
        rule = "outline:" + rest.replace("-", " ");
      }
    },
    pointer: () => {
      if (secondPart) {
        rule = "pointer-events:" + secondPart;
      }
    },
    select: () => {
      if (includes("none!auto!text!contain!all!inherit!initial!unset", rest)) {
        rule = `-webkit-user-select:${rest};-moz-user-select:${rest};-ms-user-select:${rest};user-select:` + rest;
      }
    },
    fill: () => {
      if (secondPart) {
        rule = "fill:" + secondPart;
      }
    },
    stroke: () => {
      if (isNum(secondPart)) {
        rule = "stroke-width:" + secondPart;
      } else if (secondPart) {
        rule = "stroke:" + secondPart;
      }
    },
    items: () => {
      if (includes("stretch!start!center!end!baseline", rest)) {
        rule = `-webkit-box-align:${rest};-ms-flex-align:${rest};align-items:` + (includes("start!end", rest) ? "flex-" : "") + rest;
      }
    },
    content: () => {
      if (includes("start!center!end!between!around")) {
        let v = rest;
        if (includes("start!end", rest)) {
          rest = "flex-" + rest;
        } else if (rest === "between") {
          v = "justify";
          rest = "space-" + rest;
        } else if (rest === "around") {
          v = "distribute";
          rest = "space-" + rest;
        }
        rule = `-ms-flex-line-pack:${v};align-content:` + rest;
      }
    },
    self: () => {
      if (includes("auto!start!center!end!stretch", rest)) {
        let gridRowAlign = `-ms-grid-row-align:${rest};`;
        let v = rest;
        if (includes("start!end", rest)) {
          rest = "flex-" + rest;
          gridRowAlign = "";
        }
        rule = `-ms-flex-item-align:${v};${gridRowAlign}align-self:` + rest;
      }
    },
    justify: () => {
      if (includes("start!center!end!between!around", rest)) {
        let v = rest;
        if (v === "between") {
          v = "justify";
          rest = "space-" + rest;
        } else if (includes("start!end")) {
          rest = "flex-" + rest;
        }
        let webkit = `-webkit-box-pack:${v};`;
        if (v === "around") {
          v = "distribute";
          rest = "space-" + rest;
          webkit = "";
        }
        rule = webkit + `-ms-flex-pack:${v};justify-content:` + rest;
      }
    }
  });
  let firstPart;
  let secondPart;
  let thirdPart;
  let fourthPart;
  let lastPart;
  let partsWithoutEnd;
  let rest;
  let negative;
  let rule;
  let pseudos;
  let sheetLevel;
  let responsiveSheets = new Map();
  let pseudoVendorPrefixes = newObject({
    "::placeholder": "::-webkit-input-P!::-moz-P!:-ms-input-P!::-ms-input-P".replace(/P/g, "placeholder"),
    "::selection": ":::-moz-selection"
  });

  // src/sandbox.js

  // src/ui.js
  class UI {
    static init = function() {
      console.log("%cin initUI", APP_DEBUG_STYLE);
      UI.build();
      var draggie = new Draggabilly(".draggable", {handle: ".handle"});
      if (GM_config.get("hackheaderzindex") === true) {
        FpsTracker.start("animation-target");
      }
    };
    static build = function() {
      console.log("%c in buildUI", "background-color:green;color:white");
      GM_addStyle(".flex > * { margin: 2px 1px; }");
      GM_addStyle(".flex > :first-child { margin-left: 0; }");
      GM_addStyle(".flex > :last-child { margin-right: 0; }");
      GM_addStyle(".panel {display: flex; justify-content: center;z-index:999}");
      GM_addStyle(".menuBar {border-top: 1px solid; padding: 10px; font-size: 1rem; pointer-events: inherit;position: relative;top:0px;  flex-flow: row wrap;/*align-content: space-between;justify-content: space-between;*/}");
      GM_addStyle(".draggable {background: transparent;border-radius: 10px;padding: 20px;}");
      GM_addStyle(".draggable.is-pointer-down {background: #09F;}");
      GM_addStyle(".draggable.is-dragging { opacity: 0.7; }");
      GM_addStyle(".handle {background: #555;background: hsla(0, 0%, 0%, 0.4);width: 20px;height: 20px; border-radius: 10px;}");
      GM_addStyle(".flex > :nth-last-child(2) {page-break-after: always; /* CSS 2.1 syntax */break-after: always; /* New syntax */}");
      GM_addStyle("#animation-target {width: 10px;height: 5px;background-color:coral;border-radius: 25%;}");
      var div = document.createElement("div");
      var subDiv = document.createElement("div");
      subDiv.classList.add("handle");
      div.appendChild(subDiv);
      div.classList.add("panel", "menuBar", "flex", "draggable");
      document.body.appendFirst(div);
      UI.addButton("collectChecked", collectChecked, {}, div);
      UI.addButton("CollectAuto", collectAuto, {}, div);
      UI.addButton("showBill", showBill, {}, div);
      UI.addButton("billInDetails", billInDetails, {}, div);
      UI.addButton("PDF", pdf2, {}, div);
      UI.addButton("SList", students_default.showList, {}, div);
      UI.addButton("DbgMode", debugMode, {}, div);
      UI.addButton("statistics", statistics, {}, div);
      UI.addButton("Database", mgtDbase, {}, div);
      if (false) {
        UI.addButton("Sandbox", popup_students, {}, div);
      }
      UI.addButton("about", about, {}, div);
      if (GM_config.get("hackheaderzindex") === true) {
        var fpstracker = document.createElement("div");
        fpstracker.id = "animation-target";
        div.appendChild(fpstracker);
      }
    };
    static addButton = function(text, onclick, cssObj, el) {
      el = el || document.body;
      cssObj = cssObj || {position: "absolute", bottom: "7%", left: "4%", "z-index": 3};
      let button = document.createElement("button"), btnStyle = button.style;
      button.classList.add("button--primary", "button");
      el.appendChild(button);
      button.innerHTML = text;
      button.onclick = onclick;
      Object.keys(cssObj).forEach((key) => btnStyle[key] = cssObj[key]);
      return button;
    };
  }
  class FpsTracker {
    static start = function(id) {
      const element = document.getElementById(id);
      const moveTo = (xCoord2) => element.style.transform = `translateX(${xCoord2}px)`;
      let xCoord = 0;
      const delta = 7;
      const slideRight = (timestamp) => {
        moveTo(xCoord);
        xCoord += delta;
        if (xCoord > 100) {
          requestAnimationFrame(slideLeft);
        } else {
          requestAnimationFrame(slideRight);
        }
      };
      const slideLeft = (timestamp) => {
        moveTo(xCoord);
        xCoord -= delta;
        if (xCoord < -100) {
          requestAnimationFrame(slideRight);
        } else {
          requestAnimationFrame(slideLeft);
        }
      };
      return requestAnimationFrame(slideRight);
    };
    static stop = function(animationId) {
      window.cancelAnimationFrame(animationId);
    };
  }
  var ui_default = UI;

  // src/gmc.lib.js
  const windowcss = "#OCAddonsCfg {background-color: lightblue;} #OCAddonsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #OCAddonsCfg .saveclose_buttons {margin: .7em;}";
  const iframecss = "height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;";
  const appmenu = {
    id: "OCAddonsCfg",
    title: "Configuration du module",
    fields: {
      nbHrsAfM: {
        section: ["Statistiques", "paramètres"],
        label: "Nombre de minutes pour une session d'étudiant auto financé",
        title: "Durée moyenne d'une session AF (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 30
      },
      nbHrsfM: {
        label: "Nombre de minutes pour une session d'étudiant financé",
        title: "Durée moyenne d'une session Financée (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsS: {
        label: "Nombre de minutes pour une session (avant 01/07/2020)",
        title: "Durée moyenne d'une session avant la séparation auto financé | financé (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsD: {
        label: "Nombre de minutes pour une session de soutenance",
        title: "Durée moyenne d'une sessionde soutenance AF (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsC: {
        label: "Nombre de minutes pour une session de coaching",
        title: "Durée moyenne d'une session de coachine (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      maxfetchpg: {
        section: ["Application", "optimisation"],
        label: "Maximum de page recherchées dans l'historique",
        labelPos: "left",
        type: "input",
        default: 1e3
      },
      datacachelifetime: {
        label: "Temps de conservation des données dans le cache (en ms)",
        labelPos: "left",
        type: "input",
        default: 12e4
      },
      checksessionalreadyexists: {
        section: ["Application", "Base de donnée"],
        label: "sessions: vérifier existence avant insertion",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      sizeofcontentlist: {
        section: ["Interface", "thème"],
        label: "taille de la police des listes",
        labelPos: "left",
        type: "input",
        default: "1em;"
      },
      use_custom_css: {
        label: "utiliser des styles personnalisés",
        labelPos: "left",
        type: "checkbox",
        default: false
      },
      custom_css_url: {
        label: "url de la feuille de style (si plusieurs les séparer par des virgules)",
        labelPos: "left",
        type: "input",
        default: ""
      },
      custom_css_data: {
        label: "saisir ici le code css à injecter directement dans la page",
        title: "Je me demande bien à quoi sert le titre",
        labelPos: "left",
        type: "input",
        default: ""
      },
      alwaysaddcbox: {
        section: ["Interface", "Gadget"],
        label: "Toujours ajouter les checkbox sur l'interface",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      show_throttle: {
        label: "Afficher le temoin d'utilisation du CPU",
        title: "Affiche le point rouge qui circule dans la barre de menu. Quand il s'arrête le CPU est utilisé",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      hackheaderzindex: {
        section: ["", "Hack"],
        label: "Changer le zindex du bandeau haut",
        title: "le bandeau haut à un z-index  (1000) qui le place au dessus de tout ce qui est présent à l'écran, ce qui gêne la barre de menu ; activer cette option réduit ce chiffre à 0",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      support: {
        section: ["", "Support"],
        label: "StephaneTy-Pro.github.io",
        title: "more info on https://github.com/StephaneTy-Pro",
        type: "button",
        click: () => {
          GM_openInTab("https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon", {
            active: true,
            insert: true,
            setParent: true
          });
        }
      }
    },
    css: windowcss,
    events: {
      save: function() {
        GM_config.close();
      }
    }
  };
  var opencfg = function() {
    GM_config.open();
    OCAddonsCfg.style = iframecss;
  };

  // src/gm_perf.js
  class Performance {
    static longTaskTiming = function() {
      if (window.self !== window.top) {
        return;
      }
      console.log("LongTasks: Initializing");
      var observer = new window.PerformanceObserver(function(list) {
        var perfEntries = list.getEntries();
        for (var i = 0; i < perfEntries.length; i++) {
          console.log("LongTasks: ", perfEntries[i].name, perfEntries[i].duration, perfEntries[i].attribution.length, perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerType : null, perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerName : null, perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerSrc : null, perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerId : null, perfEntries[i]);
        }
      });
      if (typeof window.PerformanceLongTaskTiming !== "undefined") {
        console.log("LongTasks: Appears to be supported");
      } else {
        console.log("LongTasks: Not supported");
      }
      try {
        observer.observe({entryTypes: ["longtask"]});
      } catch (e) {
        console.log("LongTasks: Not supported");
      }
    };
    static paintTiming = function() {
      if (window.self !== window.top) {
        return;
      }
      console.log("PaintTiming: Initializing");
      var observer = new window.PerformanceObserver(function(list) {
        var perfEntries = list.getEntries();
        for (var i = 0; i < perfEntries.length; i++) {
          console.log("PaintTiming: ", perfEntries[i].name, perfEntries[i].startTime);
        }
      });
      if (typeof window.PerformancePaintTiming !== "undefined") {
        console.log("PaintTiming: Appears to be supported");
      } else {
        console.log("PaintTiming: Not supported");
        return;
      }
      try {
        observer.observe({entryTypes: ["paint"], buffered: true});
      } catch (e) {
        console.log("PaintTiming: Not supported");
      }
    };
  }
  var gm_perf_default = Performance;

  // src/vendor/fetch-inject/injectors.js
  const head = function(i, n, j, e, c, t, s) {
    t = n.createElement(j), s = n.getElementsByTagName(j)[0];
    t.appendChild(n.createTextNode(e.text));
    t.onload = c(e);
    s ? s.parentNode.insertBefore(t, s) : n.head.appendChild(t);
  };

  // src/vendor/fetch-inject/fetch-inject.js
  /**
   * Fetch Inject module.
   *
   * @module fetchInject
   * @license Zlib
   * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
   * @param {Promise} [promise] A promise to await before attempting injection.
   * @throws {Promise<ReferenceError>} Rejects with error when given no arguments.
   * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
   * @throws {Promise<Error>} Whatever `fetch` decides to throw.
   * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
   * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
   *     Objects containing `Response` `Body` properties used by the module.
   */
  const fetchInject = function(inputs, promise) {
    if (!arguments.length)
      return Promise.reject(new ReferenceError("Failed to execute 'fetchInject': 1 argument required but only 0 present."));
    if (arguments[0] && arguments[0].constructor !== Array)
      return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'."));
    if (arguments[1] && arguments[1].constructor !== Promise)
      return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'."));
    const resources = [];
    const deferreds = promise ? [].concat(promise) : [];
    const thenables = [];
    inputs.forEach((input) => deferreds.push(window.fetch(input).then((res) => {
      return [res.clone().text(), res.blob()];
    }).then((promises) => {
      return Promise.all(promises).then((resolved) => {
        resources.push({text: resolved[0], blob: resolved[1]});
      });
    })));
    return Promise.all(deferreds).then(() => {
      resources.forEach((resource) => {
        thenables.push({
          then: (resolve) => {
            resource.blob.type.includes("text/css") ? head(window, document, "style", resource, resolve) : head(window, document, "script", resource, resolve);
          }
        });
      });
      return Promise.all(thenables);
    });
  };
  var fetch_inject_default = fetchInject;

  // src/vendor/arrive/arrive.js
  var Arrive = function(window2, $, undefined2) {
    "use strict";
    if (!window2.MutationObserver || typeof HTMLElement === "undefined") {
      return;
    }
    var arriveUniqueId = 0;
    var utils10 = function() {
      var matches = HTMLElement.prototype.matches || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector;
      return {
        matchesSelector: function(elem, selector) {
          return elem instanceof HTMLElement && matches.call(elem, selector);
        },
        addMethod: function(object, name, fn) {
          var old = object[name];
          object[name] = function() {
            if (fn.length == arguments.length) {
              return fn.apply(this, arguments);
            } else if (typeof old == "function") {
              return old.apply(this, arguments);
            }
          };
        },
        callCallbacks: function(callbacksToBeCalled, registrationData) {
          if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
            callbacksToBeCalled = [callbacksToBeCalled[0]];
          }
          for (var i = 0, cb; cb = callbacksToBeCalled[i]; i++) {
            if (cb && cb.callback) {
              cb.callback.call(cb.elem, cb.elem);
            }
          }
          if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
            registrationData.me.unbindEventWithSelectorAndCallback.call(registrationData.target, registrationData.selector, registrationData.callback);
          }
        },
        checkChildNodesRecursively: function(nodes, registrationData, matchFunc, callbacksToBeCalled) {
          for (var i = 0, node; node = nodes[i]; i++) {
            if (matchFunc(node, registrationData, callbacksToBeCalled)) {
              callbacksToBeCalled.push({callback: registrationData.callback, elem: node});
            }
            if (node.childNodes.length > 0) {
              utils10.checkChildNodesRecursively(node.childNodes, registrationData, matchFunc, callbacksToBeCalled);
            }
          }
        },
        mergeArrays: function(firstArr, secondArr) {
          var options = {}, attrName;
          for (attrName in firstArr) {
            if (firstArr.hasOwnProperty(attrName)) {
              options[attrName] = firstArr[attrName];
            }
          }
          for (attrName in secondArr) {
            if (secondArr.hasOwnProperty(attrName)) {
              options[attrName] = secondArr[attrName];
            }
          }
          return options;
        },
        toElementsArray: function(elements) {
          if (typeof elements !== "undefined" && (typeof elements.length !== "number" || elements === window2)) {
            elements = [elements];
          }
          return elements;
        }
      };
    }();
    var EventsBucket = function() {
      var EventsBucket2 = function() {
        this._eventsBucket = [];
        this._beforeAdding = null;
        this._beforeRemoving = null;
      };
      EventsBucket2.prototype.addEvent = function(target, selector, options, callback) {
        var newEvent = {
          target,
          selector,
          options,
          callback,
          firedElems: []
        };
        if (this._beforeAdding) {
          this._beforeAdding(newEvent);
        }
        this._eventsBucket.push(newEvent);
        return newEvent;
      };
      EventsBucket2.prototype.removeEvent = function(compareFunction) {
        for (var i = this._eventsBucket.length - 1, registeredEvent; registeredEvent = this._eventsBucket[i]; i--) {
          if (compareFunction(registeredEvent)) {
            if (this._beforeRemoving) {
              this._beforeRemoving(registeredEvent);
            }
            var removedEvents = this._eventsBucket.splice(i, 1);
            if (removedEvents && removedEvents.length) {
              removedEvents[0].callback = null;
            }
          }
        }
      };
      EventsBucket2.prototype.beforeAdding = function(beforeAdding) {
        this._beforeAdding = beforeAdding;
      };
      EventsBucket2.prototype.beforeRemoving = function(beforeRemoving) {
        this._beforeRemoving = beforeRemoving;
      };
      return EventsBucket2;
    }();
    var MutationEvents = function(getObserverConfig, onMutation) {
      var eventsBucket = new EventsBucket(), me = this;
      var defaultOptions = {
        fireOnAttributesModification: false
      };
      eventsBucket.beforeAdding(function(registrationData) {
        var target = registrationData.target, observer;
        if (target === window2.document || target === window2) {
          target = document.getElementsByTagName("html")[0];
        }
        observer = new MutationObserver(function(e) {
          onMutation.call(this, e, registrationData);
        });
        var config2 = getObserverConfig(registrationData.options);
        observer.observe(target, config2);
        registrationData.observer = observer;
        registrationData.me = me;
      });
      eventsBucket.beforeRemoving(function(eventData) {
        eventData.observer.disconnect();
      });
      this.bindEvent = function(selector, options, callback) {
        options = utils10.mergeArrays(defaultOptions, options);
        var elements = utils10.toElementsArray(this);
        for (var i = 0; i < elements.length; i++) {
          eventsBucket.addEvent(elements[i], selector, options, callback);
        }
      };
      this.unbindEvent = function() {
        var elements = utils10.toElementsArray(this);
        eventsBucket.removeEvent(function(eventObj) {
          for (var i = 0; i < elements.length; i++) {
            if (this === undefined2 || eventObj.target === elements[i]) {
              return true;
            }
          }
          return false;
        });
      };
      this.unbindEventWithSelectorOrCallback = function(selector) {
        var elements = utils10.toElementsArray(this), callback = selector, compareFunction;
        if (typeof selector === "function") {
          compareFunction = function(eventObj) {
            for (var i = 0; i < elements.length; i++) {
              if ((this === undefined2 || eventObj.target === elements[i]) && eventObj.callback === callback) {
                return true;
              }
            }
            return false;
          };
        } else {
          compareFunction = function(eventObj) {
            for (var i = 0; i < elements.length; i++) {
              if ((this === undefined2 || eventObj.target === elements[i]) && eventObj.selector === selector) {
                return true;
              }
            }
            return false;
          };
        }
        eventsBucket.removeEvent(compareFunction);
      };
      this.unbindEventWithSelectorAndCallback = function(selector, callback) {
        var elements = utils10.toElementsArray(this);
        eventsBucket.removeEvent(function(eventObj) {
          for (var i = 0; i < elements.length; i++) {
            if ((this === undefined2 || eventObj.target === elements[i]) && eventObj.selector === selector && eventObj.callback === callback) {
              return true;
            }
          }
          return false;
        });
      };
      return this;
    };
    var ArriveEvents = function() {
      var arriveDefaultOptions = {
        fireOnAttributesModification: false,
        onceOnly: false,
        existing: false
      };
      function getArriveObserverConfig(options) {
        var config2 = {
          attributes: false,
          childList: true,
          subtree: true
        };
        if (options.fireOnAttributesModification) {
          config2.attributes = true;
        }
        return config2;
      }
      function onArriveMutation(mutations, registrationData) {
        mutations.forEach(function(mutation) {
          var newNodes = mutation.addedNodes, targetNode = mutation.target, callbacksToBeCalled = [], node;
          if (newNodes !== null && newNodes.length > 0) {
            utils10.checkChildNodesRecursively(newNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
          } else if (mutation.type === "attributes") {
            if (nodeMatchFunc(targetNode, registrationData, callbacksToBeCalled)) {
              callbacksToBeCalled.push({callback: registrationData.callback, elem: targetNode});
            }
          }
          utils10.callCallbacks(callbacksToBeCalled, registrationData);
        });
      }
      function nodeMatchFunc(node, registrationData, callbacksToBeCalled) {
        if (utils10.matchesSelector(node, registrationData.selector)) {
          if (node._id === undefined2) {
            node._id = arriveUniqueId++;
          }
          if (registrationData.firedElems.indexOf(node._id) == -1) {
            registrationData.firedElems.push(node._id);
            return true;
          }
        }
        return false;
      }
      arriveEvents = new MutationEvents(getArriveObserverConfig, onArriveMutation);
      var mutationBindEvent = arriveEvents.bindEvent;
      arriveEvents.bindEvent = function(selector, options, callback) {
        if (typeof callback === "undefined") {
          callback = options;
          options = arriveDefaultOptions;
        } else {
          options = utils10.mergeArrays(arriveDefaultOptions, options);
        }
        var elements = utils10.toElementsArray(this);
        if (options.existing) {
          var existing = [];
          for (var i = 0; i < elements.length; i++) {
            var nodes = elements[i].querySelectorAll(selector);
            for (var j = 0; j < nodes.length; j++) {
              existing.push({callback, elem: nodes[j]});
            }
          }
          if (options.onceOnly && existing.length) {
            return callback.call(existing[0].elem, existing[0].elem);
          }
          setTimeout(utils10.callCallbacks, 1, existing);
        }
        mutationBindEvent.call(this, selector, options, callback);
      };
      return arriveEvents;
    };
    var LeaveEvents = function() {
      var leaveDefaultOptions = {};
      function getLeaveObserverConfig() {
        var config2 = {
          childList: true,
          subtree: true
        };
        return config2;
      }
      function onLeaveMutation(mutations, registrationData) {
        mutations.forEach(function(mutation) {
          var removedNodes = mutation.removedNodes, callbacksToBeCalled = [];
          if (removedNodes !== null && removedNodes.length > 0) {
            utils10.checkChildNodesRecursively(removedNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
          }
          utils10.callCallbacks(callbacksToBeCalled, registrationData);
        });
      }
      function nodeMatchFunc(node, registrationData) {
        return utils10.matchesSelector(node, registrationData.selector);
      }
      leaveEvents = new MutationEvents(getLeaveObserverConfig, onLeaveMutation);
      var mutationBindEvent = leaveEvents.bindEvent;
      leaveEvents.bindEvent = function(selector, options, callback) {
        if (typeof callback === "undefined") {
          callback = options;
          options = leaveDefaultOptions;
        } else {
          options = utils10.mergeArrays(leaveDefaultOptions, options);
        }
        mutationBindEvent.call(this, selector, options, callback);
      };
      return leaveEvents;
    };
    var arriveEvents = new ArriveEvents(), leaveEvents = new LeaveEvents();
    function exposeUnbindApi(eventObj, exposeTo, funcName) {
      utils10.addMethod(exposeTo, funcName, eventObj.unbindEvent);
      utils10.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorOrCallback);
      utils10.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorAndCallback);
    }
    function exposeApi(exposeTo) {
      exposeTo.arrive = arriveEvents.bindEvent;
      exposeUnbindApi(arriveEvents, exposeTo, "unbindArrive");
      exposeTo.leave = leaveEvents.bindEvent;
      exposeUnbindApi(leaveEvents, exposeTo, "unbindLeave");
    }
    if ($) {
      exposeApi($.fn);
    }
    exposeApi(HTMLElement.prototype);
    exposeApi(NodeList.prototype);
    exposeApi(HTMLCollection.prototype);
    exposeApi(HTMLDocument.prototype);
    exposeApi(Window.prototype);
    var Arrive2 = {};
    exposeUnbindApi(arriveEvents, Arrive2, "unbindAllArrive");
    exposeUnbindApi(leaveEvents, Arrive2, "unbindAllLeave");
    return Arrive2;
  }(window, typeof jQuery === "undefined" ? null : jQuery, void 0);
  require_src();
})();
//# sourceMappingURL=app-facturier.js.map
