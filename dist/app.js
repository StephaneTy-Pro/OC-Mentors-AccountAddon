// ==UserScript==
// @name         Facturier (alpha)
// @namespace    http://tampermonkey.net/
// @version      1.00.0004
// @description  Un addon pour vous aidez dans votre facturation
// @author       Stéphane TORCHY
// @updateURL    https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js
// @downloadURL  https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js
// @match        https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history*
// @run-at          document-end
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
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js

// sweetalert 2
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.all.min.js

// draggabilly
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.2.0/draggabilly.pkgd.min.js

// toastify
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1.8.0/src/toastify.min.js
// @resource    toastifycss https://raw.githubusercontent.com/apvarun/toastify-js/master/src/toastify.css

//
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js

// simple-datatables
// @require     https://cdn.jsdelivr.net/npm/simple-datatables@latest
// @resource    simpledatatablecss https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css

// require https://raw.githubusercontent.com/anywhichway/nano-memoize/master/dist/nano-memoize.min.js
// @require https://cdn.jsdelivr.net/npm/moize@5.4.7/dist/moize.min.js

// require https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/fetch-inject.umd.min.js
// @require https://cdn.jsdelivr.net/npm/fetch-inject

// PARSER MKDOWN
// @require 	 https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js

// PDF https://pdf-lib.js.org/docs/api/
// @require      https://unpkg.com/pdf-lib@1.9.0/dist/pdf-lib.min.js
// @require      https://unpkg.com/downloadjs@1.4.7/download.js


/*
 * History
 * cf https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/blob/master/CHANGELOG.md
 */



// ==/UserScript==

(function() {

    'use strict';
  let __defineProperty = Object.defineProperty;
  let __hasOwnProperty = Object.prototype.hasOwnProperty;
  let __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  let __markAsModule = (target) => {
    return __defineProperty(target, "__esModule", {value: true});
  };
  let __export = (target, all) => {
    __markAsModule(target);
    for (let name in all)
      __defineProperty(target, name, {get: all[name], enumerable: true});
  };
  let __exportStar = (target, module) => {
    __markAsModule(target);
    if (typeof module === "object" || typeof module === "function") {
      for (let key in module)
        if (__hasOwnProperty.call(module, key) && !__hasOwnProperty.call(target, key) && key !== "default")
          __defineProperty(target, key, {get: () => module[key], enumerable: true});
    }
    return target;
  };
  let __toModule = (module) => {
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
      OC_AUTOFUNDED: () => OC_AUTOFUNDED,
      OC_FUNDED: () => OC_FUNDED,
      OC_MAX_LEVEL: () => OC_MAX_LEVEL,
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
      default: () => src_default
    });
    const Facturier = {
      Cfg: {
        dbase: null
      },
      start: async function() {
        await domReady();
        const bSupport = Facturier.checkSupport();
        console.log(`%cAre all functions supported ? : ${bSupport}`, APP_DEBUG_STYLE);
        document.arrive(".MuiAvatar-img", Facturier._warmup);
      },
      checkSupport: function() {
        return true;
      },
      _warmup: function() {
        console.log("%cinSetup", APP_DEBUG_STYLE);
        if (GM === void 0) {
          console.log("%cI am not in a tamper env");
          Facturier._userscriptless();
        } else {
          console.log(`%cTamper environment detected the version is ${GM.info.version}`, APP_DEBUG_STYLE);
        }
        GM_addStyle(GM_getResourceText("jspanelcss"));
        GM_addStyle(GM_getResourceText("toastifycss"));
        GM_addStyle(GM_getResourceText("simpledatatablecss"));
        GM_config.init(appmenu);
        GM_registerMenuCommand("OC Facturier - configure", opencfg);
        if (GM_config.get("hackheaderzindex") === true) {
          document.getElementById("header").style.zIndex = 0;
        }
        GM_addStyle(".swal2-content{font-size:" + GM_config.get("sizeofcontentlist") + "}");
        GM_addStyle(".swal2-title{font-size:1.275em)");
        Facturier._main();
      },
      _userscriptless() {
      },
      _main: function() {
        console.log("​​​%cMainLoaded​​​", APP_DEBUG_STYLE);
        let adapter = new LocalStorage("db");
        var db = low(adapter);
        db.defaults({students: [], sessions: [], f_archives: [], history_session_cache: []}).write();
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
        if (GM_config.get("use_custom_css") === true) {
          let sDependencies = GM_config.get("custom_css_url");
          let rDependencies = sDependencies.split(",");
          if (rDependencies.length !== 0) {
            fetchInject([rDependencies]).then(() => {
              console.log(`%cDependencies ${rDependencies} loaded`, APP_DEBUG_STYLE);
            });
          } else {
            let sData = GM_config.get("custom_css_data");
            if (sData.length() > 0) {
              console.log(`%cNeed to inject a custom css in application content is ${sData}`, APP_DEBUG_STYLE);
            }
          }
        }
        if (GM.info.script.downloadURL === "https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/billing.js") {
          console.log("%cALERTE .... version locale !!!!!! ", "background-color:coral;color:white");
          unsafeWindow.Facturier = {libs: [], cfg: {dbase: null}};
          unsafeWindow.Facturier.cfg.dbase = Facturier.Cfg.dbase;
          unsafeWindow.Facturier.libs.push({id: "fetchInject", ptr: fetchInject});
          unsafeWindow.Facturier.libs.push({id: "dayjs", ptr: dayjs});
          console.log("%cImportants values are exported in unsafeWindow.Facturier", APP_DEBUG_STYLE);
          Facturier.loadDependencies();
        } else {
          console.log(`GM.info.script.downloadURL url : ${GM.info.script.downloadURL}`);
        }
      },
      loadDependencies: function() {
        let rDependencies = [];
        rDependencies.push("http://localhost:8000/src/branch01/sandbox.js");
        rDependencies.push("http://localhost:8000/src/branch01/sandbox.css");
        fetchInject(rDependencies).then(() => {
          console.log(`dependencies ${rDependencies} loaded`);
        });
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
        console.log(`%cOn progress function:`, APP_DEBUG_STYLE);
        console.log(`%cgm_xhr onprogress lengthComputable: ${e.lengthComputable}`, APP_DEBUG_STYLE);
        console.log(`%cgm_xhr onprogress loaded: ${e.loaded}`, APP_DEBUG_STYLE);
        console.log(`%cgm_xhr onprogress total: ${e.total}`, APP_DEBUG_STYLE);
        console.log(`%cgm_xhr onprogress total: ${e.position}`, APP_DEBUG_STYLE);
        console.log(`%cgm_xhr onprogress total: ${e.done}`, APP_DEBUG_STYLE);
      }
    }).catch((error) => {
      console.error(`%cError ${error}`, APP_ERROR_STYLE);
    });
    let domparser = new DOMParser();
    let doc = domparser.parseFromString(response.responseText.replace(/\n/mg, ""), "text/html");
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
      throw Error("Erreur qui ne devrait jamais arriver en getkey :" + e.stack || e);
    }
  };
  var extractDate = function(sWhen) {
    var _t = sWhen.trim().split(" ");
    try {
      var id = dayjs_locale_fr.months.findIndex((m) => m === _t[1]) + 1;
    } catch (e) {
      throw Error("Erreur qui ne devrait jamais arriver en conversion de date :" + e.stack || e);
    }
    return `${_t[2]}-${id}-${_t[0]}T${_t[4]}`;
  };
  var convertRowToDate = function(oDom, index8 = 0) {
    if (index8 === -1) {
      index8 = oDom.children.length - 1;
    }
    var sRowDate = oDom.children[index8].children[0].innerText;
    let f_sRowDate = extractDate(sRowDate);
    var dtRowDate = dayjs(f_sRowDate);
    return dtRowDate;
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
          el.querySelector("#dtFrom").addEventListener("change", function() {
            document.getElementById("dtTo").value = dayjs(document.getElementById("dtFrom").value).endOf("month").format("YYYY-MM-DD");
          });
      },
      onClose: (el) => {
        if (bMonthAdjustment === true)
          el.querySelector("#dtFrom").removeEventListener("change");
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
  const index2 = __toModule(require_src());
  class Archive {
    static tbl_name = "f_archives";
    static add = async function(oArchive) {
      let db = index2.default.Cfg.dbase;
      let now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      let needle = {id: oArchive[0].to.format("YYYYMM"), data: oArchive, created_at: oArchive[0].now};
      console.log(`%cWill create archive for id ${oArchive[0].to.format("YYYYMM")} (YYYYMM)`, APP_DEBUG_STYLE);
      db.get(Archive.tbl_name).push(JSON.parse(JSON.stringify(needle))).write();
    };
    static exists = function(needle) {
      let db = index2.default.Cfg.dbase;
      let _r = db.get(Archive.tbl_name).find({id: needle}).value();
      if (_r === void 0) {
        return false;
      } else {
        return true;
      }
    };
    static get = function(needle) {
      let db = index2.default.Cfg.dbase;
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
      let db = index2.default.Cfg.dbase;
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
        return dtDate.isBefore(dayjs("2020-06-01"));
      } catch (e) {
        throw Error("Erreur qui ne devrait jamais arriver en IsInOldMode (probablement un probleme sur la conversion de la date en objet dayjs:" + e.stack || e);
      }
    };
  }
  var core_default = Core;

  // src/students.js
  const index7 = __toModule(require_src());
  class Student {
    static tbl_name = "students";
    static add = function(sStudentId, sStudentFullName = "noname", sStudentPath = "nopath", sStudentFundedBy = "unkonw", created) {
      let db = index7.default.Cfg.dbase;
      var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      let me = {id: sStudentId, fullname: sStudentFullName, path: sStudentPath, fundedby: sStudentFundedBy, created: now};
      db.get(Student.tbl_name).push(JSON.parse(JSON.stringify(me))).write();
    };
    static exists = function(needle) {
      let db = index7.default.Cfg.dbase;
      var r = db.get(Student.tbl_name).find({id: needle}).value();
      if (r === void 0) {
        return false;
      } else {
        return true;
      }
    };
    static getFunded = function(studentId) {
      let db = index7.default.Cfg.dbase;
      let _r = db.get(Student.tbl_name).find({id: studentId}).value();
      if (_r == void 0) {
        throw Error(`IRRECOVERABLE ERROR STUDENT WITH ID ${studentId} NOT IN DB:`);
      } else {
        return _r.fundedby;
      }
    };
    static isAutoFunded = function(iStudentId) {
      return Student.getFunded(iStudentId).toLowerCase() === OC_AUTOFUNDED;
    };
    static getFinancialMode = async function(id) {
      const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${id}/dashboard`, ".mentorshipStudent__details > p");
      return oDom.innerText;
    };
    static delete = function(dtFrom = null, dtTo = null) {
      let db = index7.default.Cfg.dbase;
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
    static getAll = async (e, ctx) => {
      var bForceUpdate = false;
      let db = index7.default.Cfg.dbase;
      var sPath = "table.crud-list tbody";
      var aStudents = document.querySelectorAll(sPath)[1];
      var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      Swal.fire({
        position: "top-end",
        icon: "info",
        toast: true,
        title: "mise à jour de la base de donnée des étudiants...\ncela peut prendre du temps",
        showConfirmButton: false,
        timer: 1e3
      });
      for (const el of aStudents.children) {
        var sStudentId = getKey(el.children[0], -2);
        var sStudentFullName = el.children[0].innerText;
        var sStudentPath = "non défini";
        if (el.children[1].firstElementChild) {
          sStudentPath = el.children[1].firstElementChild.href.split("/").pop();
        }
        var res = db.get(Student.tbl_name).find({id: sStudentId}).value();
        if (res && bForceUpdate === false) {
          console.log(`%c${sStudentFullName}(uniquid:${sStudentId}) already present in database created at ${res.created}`, APP_DEBUG_STYLE);
        } else {
          let sStudentFundedBy = await Student.getFinancialMode(sStudentId);
          console.log(`%cFinancial Mode of student ${sStudentFullName}(id:${sStudentId}) is ${sStudentFundedBy}`, APP_DEBUG_STYLE);
          Toastify({
            text: `Ajoute l'étudiant : ${sStudentFullName}(${sStudentFundedBy}) en base`,
            gravity: "top",
            position: "right",
            close: true,
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
          }).showToast();
          Student.add(sStudentId, sStudentFullName, sStudentPath, sStudentFundedBy, now);
        }
      }
    };
    static showList = function() {
      let db = index7.default.Cfg.dbase;
      let _r = db.get(Student.tbl_name).value();
      var sHtml = "";
      sHtml += "<table>";
      sHtml += "<caption>Liste des étudiant</caption>";
      sHtml += "<thead>";
      sHtml += "<tr>";
      sHtml += `<th>Nom</th><th>Parcours</th><th>Financement</th><th>Date de création</th>`;
      sHtml += "</tr>";
      sHtml += "</thead>";
      sHtml += "<tbody>";
      for (var idx in _r) {
        sHtml += "<tr>";
        sHtml += `<td>${_r[idx].fullname}</td><td>${_r[idx].path}</td><td>${_r[idx].fundedby}</td><td>${dayjs(_r[idx].created, "YYYY-MM-DDTHH:mm:ssZ[Z]").format("DD/MM/YYYY à HH:mm")}</td>`;
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
      sHtml += '<label for="fundedby">Autofinancé</label>';
      sHtml += '<input id="fundedby" type="checkbox" value="autofunded">';
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
            document.getElementById("fundedby").checked,
            document.getElementById("session_date").value
          ];
        }
      });
      if (formValues) {
        var sFundedBy = "";
        if (formValues[3] === true) {
          sFundedBy = OC_AUTOFUNDED;
        } else {
          sFundedBy = OC_FUNDED;
        }
        Student.add(formValues[0], formValues[1], formValues[2], sFundedBy, formValues[4]);
      }
    };
  }
  var students_default = Student;

  // src/sessions.js
  const index6 = __toModule(require_src());
  class Session {
    static tbl_name = "sessions";
    static add = async function(oSession) {
      let db = index6.default.Cfg.dbase;
      if (GM_config.get("checksessionalreadyexists") === true) {
        var bCheckExistsBeforAdd = true;
      }
      if (core_default.isInOldMode(dayjs(oSession.when))) {
        oSession.isFunded = true;
      } else {
        if (oSession.type.toLowerCase() === "soutenance") {
          oSession.isFunded = true;
        } else {
          var bOldStudent = students_default.exists(oSession.who_id);
          console.log("is student in db ?", bOldStudent);
          if (bOldStudent == false) {
            console.warn("%cI'm updating db .... could'nt do anything else", APP_WARN_STYLE);
            await students_default.getAll();
            var bPass2 = students_default.exists(oSession.who_id);
            if (bPass2 == false) {
              return students_default.createManually(oSession.who_id, oSession.who_name, oSession.when);
            }
          }
          oSession.isFunded = !students_default.isAutoFunded(oSession.who_id);
        }
      }
      if (bCheckExistsBeforAdd) {
        if (Session.exists(oSession.id) == false) {
          db.get(Session.tbl_name).push(JSON.parse(JSON.stringify(oSession))).write();
        } else {
          console.info(`%cSession of ${oSession.who_name} at ${oSession.when} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
        }
      } else {
        db.get(Session.tbl_name).push(JSON.parse(JSON.stringify(oSession))).write();
      }
    };
    static exists = function(sessionId) {
      let db = index6.default.Cfg.dbase;
      var r = db.get(Session.tbl_name).find({id: sessionId}).value();
      if (r === void 0) {
        return false;
      } else {
        return true;
      }
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
    static parseTable = function(oEl) {
      var sWhen = oEl.children[0].children[0].innerText;
      var sId = getKey(oEl.children[0]);
      var sWho = oEl.children[1].children[0].innerText;
      var iWho = getKey(oEl.children[1], -2);
      var sStatus = oEl.children[2].innerText.trim().toLowerCase();
      var sType = oEl.children[3].children.length ? oEl.children[3].children[0].innerText.trim().toLowerCase() : "session";
      var sLvl = -1;
      if (oEl.children[4].children.length > 0) {
        sLvl = oEl.children[4].children[0].innerText;
      }
      sWhen = extractDate(sWhen);
      var me = {id: sId, when: sWhen, who_id: iWho, who_name: sWho, status: sStatus, type: sType, lvl: sLvl};
      return me;
    };
  }
  var sessions_default = Session;

  // src/accounting.js
  const index = __toModule(require_src());
  class Accounting2 {
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
      return Accounting2.memoized(dtFrom, dtTo);
    };
    static _calculateBill = function(dtFrom, dtTo) {
      if (typeof dtFrom === "string") {
        dtFrom = dayjs(dtFrom);
      }
      ;
      if (typeof dtTo === "string") {
        dtTo = dayjs(dtTo);
      }
      var t0 = performance.now();
      let db = index.default.Cfg.dbase;
      var r = db.get(sessions_default.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day") && dayjs(v.when).isSameOrAfter(dtFrom, "day"));
      var def = r.filter((v) => v.type.toLowerCase() === "soutenance") || 0;
      let aPrice = [0, OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6];
      let oErrors = [];
      let aLvl = [];
      for (let _i = 1; _i <= OC_MAX_LEVEL; _i += 1) {
        aLvl[_i] = [];
        aLvl[_i][0] = {session: null, defense: null};
        aLvl[_i][1] = {session: null, defense: null};
        aLvl[_i][2] = {session: null, defense: null};
        aLvl[_i][3] = {session: null, defense: null};
        aLvl[_i][4] = {session: null, defense: null};
        aLvl[_i][5] = {session: null, defense: null};
        aLvl[_i][6] = {session: null, defense: null};
        aLvl[_i][7] = {session: null, defense: null};
        aLvl[_i][0].session = r.filter((v) => v.lvl == _i && v.status === OC_STATUS_0 && v.isFunded === true) || 0;
        aLvl[_i][1].session = r.filter((v) => v.lvl == _i && v.status === OC_STATUS_1 && v.isFunded === true) || 0;
        aLvl[_i][2].session = r.filter((v) => v.lvl == _i && v.status === OC_STATUS_2 && v.isFunded === true) || 0;
        aLvl[_i][3].session = r.filter((v) => v.lvl == _i && (v.status === OC_STATUS_3_M || v.status === OC_STATUS_3_F) && v.isFunded === true) || 0;
        aLvl[_i][4].session = r.filter((v) => v.lvl == _i && v.status === OC_STATUS_0 && v.isFunded === false) || 0;
        aLvl[_i][5].session = r.filter((v) => v.lvl == _i && v.status === OC_STATUS_1 && v.isFunded === false) || 0;
        aLvl[_i][6].session = r.filter((v) => v.lvl == _i && v.status === OC_STATUS_2 && v.isFunded === false) || 0;
        aLvl[_i][7].session = r.filter((v) => v.lvl == _i && (v.status === OC_STATUS_3_M || v.status === OC_STATUS_3_F) && v.isFunded === false) || 0;
        aLvl[_i][0].defense = def.filter((v) => v.lvl == _i && v.status === OC_STATUS_0 && v.isFunded === true) || 0;
        aLvl[_i][1].defense = def.filter((v) => v.lvl == _i && v.status === OC_STATUS_1 && v.isFunded === true) || 0;
        aLvl[_i][2].defense = def.filter((v) => v.lvl == _i && v.status === OC_STATUS_2 && v.isFunded === true) || 0;
        aLvl[_i][3].defense = def.filter((v) => v.lvl == _i && (v.status === OC_STATUS_3_M || v.status === OC_STATUS_3_F) && v.isFunded === true) || 0;
        aLvl[_i][4].defense = def.filter((v) => v.lvl == _i && v.status === OC_STATUS_0 && v.isFunded === false) || 0;
        aLvl[_i][5].defense = def.filter((v) => v.lvl == _i && v.status === OC_STATUS_1 && v.isFunded === false) || 0;
        aLvl[_i][6].defense = def.filter((v) => v.lvl == _i && v.status === OC_STATUS_2 && v.isFunded === false) || 0;
        aLvl[_i][7].defense = def.filter((v) => v.lvl == _i && (v.status === OC_STATUS_3_M || v.status === OC_STATUS_3_F) && v.isFunded === false) || 0;
      }
      var t1 = performance.now();
      console.log("%cFiltering took " + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
      oErrors.push({total_errors: 0, total_filtered: 0, total: r.value().length, control: 0});
      oErrors.push({type: "bad level", data: r.filter((v) => v.lvl < 1 || v.lvl > OC_MAX_LEVEL).value()});
      oErrors.push({type: "bad status", data: r.filter((v) => v.status !== OC_STATUS_0 && v.status !== OC_STATUS_1 && v.status !== OC_STATUS_2 && v.status !== OC_STATUS_3_M && v.status !== OC_STATUS_3_F).value()});
      oErrors.push({type: "bad funded", data: r.filter((v) => v.isFunded !== false && v.isFunded !== true).value()});
      oErrors[0].total_errors = oErrors[1].data.length + oErrors[2].data.length + oErrors[3].data.length;
      var myArray = [];
      var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      var aPu = [];
      for (let _i = 1; _i <= OC_MAX_LEVEL; _i += 1) {
        if (core_default.isInOldMode(dtFrom)) {
          aPu[_i] = [aPrice[_i], 0, aPrice[_i] / 2, aPrice[_i] / 2, aPrice[_i], 0, aPrice[_i] / 2, aPrice[_i] / 2];
        } else {
          aPu[_i] = [aPrice[_i], 0, 0, aPrice[_i] / 2, aPrice[_i] / 2, 0, 0, aPrice[_i] / 4];
        }
      }
      var t2 = performance.now();
      console.log("%cPU calculated took " + (t2 - t1) + " milliseconds.", APP_PERF_STYLE);
      var oSessionsAf = r.filter((v) => v.type.toLowerCase() !== "soutenance" && v.status === OC_STATUS_0 && v.isFunded === false);
      var _temp = oSessionsAf.groupBy((v) => v.who_id);
      var oBonus = [];
      for (var n in _temp.value()) {
        "f_archives";
        oBonus.push({who_id: n, who_name: _temp.value()[n][0].who_name, sessions: _temp.value()[n].length});
      }
      var t3 = performance.now();
      console.log("%cBonus took " + (t3 - t2) + " milliseconds.", APP_PERF_STYLE);
      var aSNumbers = [];
      var aDNumbers = [];
      var _iTotSessions = 0;
      for (let _i = 1; _i <= OC_MAX_LEVEL; _i += 1) {
        let _s = [];
        _s[0] = aLvl[_i][0].session.value().length;
        _s[1] = aLvl[_i][1].session.value().length;
        _s[2] = aLvl[_i][2].session.value().length;
        _s[3] = aLvl[_i][3].session.value().length;
        _s[4] = aLvl[_i][4].session.value().length;
        _s[5] = aLvl[_i][5].session.value().length;
        _s[6] = aLvl[_i][6].session.value().length;
        _s[7] = aLvl[_i][7].session.value().length;
        aSNumbers[_i] = [_s[0], _s[1], _s[2], _s[3], _s[4], _s[5], _s[6], _s[7]];
        _iTotSessions += aSNumbers[_i].reduce((acc, val) => acc + val);
        let _d = [];
        _d[0] = aLvl[_i][0].defense.value().length;
        _d[1] = aLvl[_i][1].defense.value().length;
        _d[2] = aLvl[_i][2].defense.value().length;
        _d[3] = aLvl[_i][3].defense.value().length;
        _d[4] = aLvl[_i][4].defense.value().length;
        _d[5] = aLvl[_i][5].defense.value().length;
        _d[6] = aLvl[_i][6].defense.value().length;
        _d[7] = aLvl[_i][7].defense.value().length;
        aDNumbers[_i] = [_d[0], _d[1], _d[2], _d[3], _d[4], _d[5], _d[6], _d[7]];
      }
      oErrors[0].total_filtered = _iTotSessions;
      oErrors[0].control = oErrors[0].total - _iTotSessions;
      var t4 = performance.now();
      console.log("%cPrecalc some vars took " + (t4 - t3) + " milliseconds.", APP_PERF_STYLE);
      myArray.push({from: dtFrom, to: dtTo, created_at: now, errors: oErrors, bonus: oBonus, max_level: OC_MAX_LEVEL});
      for (let _i = 1; _i <= OC_MAX_LEVEL; _i += 1) {
        let _t = aLvl[_i];
        myArray.push({
          sessions: {data: [_t[0].session, _t[1].session, _t[2].session, _t[3].session, _t[4].session, _t[5].session, _t[6].session, _t[7].session], number: aSNumbers[_i], pu: aPu[_i]},
          defenses: {data: [_t[0].defense, _t[1].defense, _t[2].defense, _t[3].defense, _t[4].defense, _t[5].defense, _t[6].defense, _t[7].defense], number: aDNumbers[_i], pu: aPu[_i]}
        });
      }
      var t5 = performance.now();
      console.log("%cMy array full storage took " + (t5 - t4) + " milliseconds.", APP_PERF_STYLE);
      if (dtTo.isBefore(dayjs())) {
        archives_default.add(myArray);
      }
      return myArray;
    };
    static memoized = moize.default(Accounting2._calculateBill, {
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
  }
  var accounting_default = Accounting2;

  // src/history.js
  const index4 = __toModule(require_src());
  class History {
    static tbl_name = "history_session_cache";
    static getSessionPage = function(dtTo) {
      if (dtTo.get("day") < dtTo.daysInMonth()) {
        dtTo = dtTo.endOf("month");
      }
      console.log(`%cSearch in history session cache data for id: ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      let db = index4.default.Cfg.dbase;
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
      let db = index4.default.Cfg.dbase;
      if (!db.has(History.tbl_name).value()) {
        throw Error(`DB ${History.db_name} NOT FOUND`);
        return -1;
      }
      let _iBaseDay = +dtTo.format("YYYYMMDD");
      let _r = db.get(History.tbl_name).value().map((i) => +i.id - _iBaseDay);
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
      let db = index4.default.Cfg.dbase;
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
      let db = index4.default.Cfg.dbase;
      let _r = History.getSessionPage(dtTo);
      if (_r == -1) {
        throw Error("session page not found in history");
        return -1;
      }
      db.get(History.tbl_name).find({id: +dtTo.format("YYYYMMDD")}).assign({page}).write();
    };
    static addSessionPage = function(page = 1, dtTo = dayjs("1970-10-06")) {
      let db = index4.default.Cfg.dbase;
      db.get(History.tbl_name).push(JSON.parse(JSON.stringify({id: +dtTo.format("YYYYMMDD"), page}))).write();
    };
  }
  var history_default = History;

  // src/lists.js
  const index5 = __toModule(require_src());
  class List {
    static detail_bill = "truc";
    static getListDetailBill = function(dtFrom, dtTo) {
      let db = index5.default.Cfg.dbase;
      let _r = db.get(sessions_default.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day") && dayjs(v.when).isSameOrAfter(dtFrom, "day")).sortBy(function(o) {
        return dayjs(o.when).valueOf();
      }).value();
      var aPrice = [0, OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6];
      let iCumul = 0;
      for (var i in _r) {
        if (_r[i].lvl > aPrice.length - 1) {
          throw Error("ERROR PRICE ARRAY MUST BE UPDATED IN LISTS.JS");
        }
        ;
        var iPu = _r[i].isFunded === true ? aPrice[_r[i].lvl] : aPrice[_r[i].lvl] * 0.5;
        var iFPu = 0;
        var bOldMode = true;
        if (core_default.isInOldMode(dayjs(_r[i].when))) {
          if (_r[i].status === OC_STATUS_0) {
            iFPu = iPu;
          } else {
            if (_r[i].status === OC_STATUS_3_M || _r[i].status === OC_STATUS_3_F || _r[i].status === OC_STATUS_2) {
              iFPu = iPu * 0.5;
            }
          }
        } else {
          bOldMode = false;
          if (_r[i].status === OC_STATUS_0) {
            iFPu = iPu;
          } else {
            if (_r[i].status === OC_STATUS_3_M || _r[i].status === OC_STATUS_3_F) {
              iFPu = iPu * 0.5;
            }
          }
        }
        iCumul += iFPu;
        _r[i].iPu = iPu;
        _r[i].oldMode = bOldMode;
        _r[i].iCumul = iCumul;
        _r[i].iFPu = iFPu;
      }
      return _r;
    };
    static getListStatistic = function(dtFrom, dtTo) {
      let dtCurFrom = dtFrom;
      let aData = [];
      let aStat = [];
      var t0 = performance.now();
      while (dtCurFrom.isSameOrBefore(dtTo, "day")) {
        let dtCurTo = dtCurFrom.endOf("month");
        aData.push(Accounting.calculateBill(dtCurFrom, dtCurTo));
        dtCurFrom = dtCurFrom.add(1, "month");
      }
      var t1 = performance.now();
      console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
      aStat[1][1] = 666;
    };
  }
  var lists_default = List;

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
  }
  var pdf_default = PDF;

  // src/dbase.js
  const index3 = __toModule(require_src());
  class Dbase {
    static export = function() {
      console.log(`%cWanna export DBASE`, APP_DEBUG_STYLE);
      return JSON.stringify(index3.default.Cfg.dbase.getState());
    };
    static import = function(sExport) {
      console.log(`%cWanna import ${sExport} in DBASE`, APP_DEBUG_STYLE);
      console.log(`%c !!!!!! TYPE NOT CHECKED BE CARREFULL`, APP_DEBUG_STYLE);
      return index3.default.Cfg.dbase.setState(JSON.parse(sExport)).write();
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
    var sessions4 = document.querySelector(sPath);
    var bChecked = false;
    if (sessions4.querySelector("[type=checkbox]") === null) {
      for (const el2 of sessions4.children) {
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
      var _t = sessions4.querySelectorAll("[type=checkbox]");
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
    sHtml += "<tr><th>Quand</th><th>Qui</th><th>Financé ?</th><th>Ancien Mode ?</th><th>PU HT</th><th>Statut</th><th>PU (corrigé) HT</th><th>Cumul</th></tr>";
    sHtml += "<thead>";
    sHtml += "<tbody>";
    var iCumul = 0;
    for (let _i = 0; _i < _r.length; _i += 1) {
      sHtml += "<tr>";
      sHtml += `<td>${dayjs(_r[_i].when).format("DD/MM/YYYY à HH:mm:ss")}</td><td>${_r[_i].who_name}</td><td>${_r[_i].isFunded === true ? "Oui" : "Non"}</td><td>${_r[_i].oldMode === true ? "Oui" : "Non"}</td><td>${_r[_i].iPu}</td><td>${_r[_i].status}</td><td>${_r[_i].iFPu}</td><td>${_r[_i].iCumul}€</td>`;
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
  var collectChecked = async function() {
    var sPath = "table.crud-list tbody input:checked";
    var cb = document.querySelectorAll(sPath);
    for (var i = 0; i < cb.length; i += 1) {
      var oEl = cb[i].parentElement.parentElement;
      var me = sessions_default.parseTable(oEl);
      await sessions_default.add(me);
    }
    toastOk("Collecte des sessions cochées\nterminée");
  };
  var historyFetch = async function() {
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
      res = await _historyFetch(dtFrom, dtTo, pg, data);
      if (res.length > 0 && dayjs(res[res.length - 1].when).isSameOrBefore(dtFrom) === true) {
        bBrowse = false;
      }
      pg += 1;
      iRecurse += 1;
    }
    for (var i in res) {
      if (dayjs(res[i].when).isBefore(dtFrom, "day") === true) {
        Swal.fire({
          position: "top-end",
          icon: "info",
          toast: true,
          title: "Collecte des sessions\nCollecte terminée",
          showConfirmButton: false,
          timer: 1500
        });
        break;
      }
      if (dayjs(res[i].when).isAfter(dtTo, "day") === true) {
        continue;
      }
      if (dayjs(res[i].when).isBetween(dtFrom, dtTo, "day", "[]")) {
        await sessions_default.add(res[i]);
      }
    }
    addCbox();
    toastOk("Collecte automatique terminée");
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
    let oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history?page=${pg}`, "table.crud-list tbody");
    if (oDom === null) {
      throw new Error("Something went wrong .... try to navigate forward and backward or click some buttons to change url");
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
      let _iWidth = [0, lorem_width(18), lorem_width(36), lorem_width(18), lorem_width(5), lorem_width(8), lorem_width(5), lorem_width(7)];
      let iLineHeigth = page.lineHeight;
      let iXStart = 25;
      for (let _l = 1; _l < _r.length; _l += 1) {
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
          let aHeader = ["", "Quand", "Qui", "Quoi", "PU", "Statut", "Puf", "Montant"];
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
        curPage.drawText(dayjs(_r[_l].when).format("DD/MM/YYYY à HH:mm"), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[1];
        curPage.drawText(_r[_l].who_name.trim(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[2];
        curPage.drawText(`${_r[_l].type} ${_r[_l].isFunded === true ? "F." : "AF"} (${_r[_l].lvl})`, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[3];
        curPage.drawText(_r[_l].iPu.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[4];
        let sStatus = _r[_l].status;
        if (_r[_l].status === "étudiant absent") {
          sStatus = "absent";
        }
        curPage.drawText(sStatus, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[5];
        curPage.drawText(_r[_l].iFPu.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[6];
        curPage.drawText(_r[_l].iCumul.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        curLine += 1;
      }
      pdf_default.addFooter(pdfDoc, "Généré avec Facturier version 1.01");
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
        let r = document.getElementsByName("date_filter");
        let radioValue = "notfound";
        for (var i in r) {
          if (r[i].checked === true)
            radioValue = r[i].value;
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
    console.log(`wanna raz students ? ${bRAZStudents}, wanna raz sessions ? ${bRAZSessions}, wanna raz archives ? ${bRAZArchives}`);
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
    var data = accounting_default.calculateBill(dtFrom, dtTo);
    if (core_default.isInOldMode(dtFrom)) {
      showBillPhase1(dtFrom, dtTo, data);
    } else {
      showBillPhase2(dtFrom, dtTo, data);
    }
  };
  var showBillPhase1 = function(dtFrom, dtTo, r) {
    var sHtml = "";
    var _ref = null;
    var iTotQ = 0;
    var iTotM = 0;
    var aTable = [[4, "Groupe"], [1, "Niveau 1"], [2, "Niveau 2"], [3, "Niveau 3"]];
    var iCurrentMaxLevel = r[0].max_level;
    sHtml += "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
    sHtml += '<div class="wrapper">';
    sHtml += "<table>";
    sHtml += "<caption>Sessions de mentorat</caption>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += '<th>Type</th><th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    for (var k in aTable) {
      sHtml += "<tr>";
      sHtml += "<td>" + aTable[k][1] + "</td>";
      _ref = r[aTable[k][0]].sessions;
      let _q1 = _ref.number[0];
      let _q2 = _ref.number[4];
      let _m1 = _q1 * _ref.pu[0];
      let _m2 = _q2 * _ref.pu[4];
      iTotQ += _q1 + _q2;
      iTotM += _m1 + _m2;
      sHtml += `<td>${_q1 + _q2}</td><td>${(_ref.pu[0] + _ref.pu[4]) / 2}</td><td>${_m1 + _m2}€</td>`;
      sHtml += "</tr>";
    }
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    var iTotQG = iTotQ;
    var iTotMG = iTotM;
    iTotQ = 0;
    iTotM = 0;
    sHtml += "<table>";
    sHtml += "<caption>Sessions de mentorat (NoShow)</caption>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += '<th>Type</th><th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    for (k in aTable) {
      sHtml += "<tr>";
      sHtml += "<td>" + aTable[k][1] + "</td>";
      _ref = r[aTable[k][0]].sessions;
      let _q1 = _ref.number[2] + _ref.number[3];
      let _q2 = _ref.number[6] + _ref.number[7];
      let _m1 = _q1 * (_ref.pu[2] + _ref.pu[3]) / 2;
      let _m2 = _q2 * (_ref.pu[6] + _ref.pu[7]) / 2;
      iTotQ += _q1 + _q2;
      iTotM += _m1 + _m2;
      sHtml += `<td>${_q1 + _q2}</td><td>${(_ref.pu[2] + _ref.pu[3] + _ref.pu[6] + _ref.pu[7]) / 4}</td><td>${_m1 + _m2}€</td>`;
      sHtml += "</tr>";
    }
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    iTotQG += iTotQ;
    iTotMG += iTotM;
    var iCanceledSessions = 0;
    var iTotalSessions = 0;
    var iTotalHtSessions = 0;
    var iTotalDefenses = 0;
    var iTotalHtDefenses = 0;
    var _l = 1;
    while (_l <= iCurrentMaxLevel) {
      iCanceledSessions += r[_l].sessions.number[1];
      iCanceledSessions += r[_l].sessions.number[5];
      for (let _i in [...Array(8).keys()]) {
        let _t = r[_l].sessions.number[_i];
        iTotalSessions += _t;
        iTotalHtSessions += _t * r[_l].sessions.pu[_i];
        _t = r[_l].defenses.number[_i];
        iTotalDefenses += _t;
        iTotalHtDefenses += _t * r[_l].defenses.pu[_i];
      }
      _l += 1;
    }
    let iError = r[0].errors[0].total_errors;
    iTotalSessions += iError;
    sHtml += `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG - iTotQ} session(s) de mentorat (${iTotMG - iTotM}€)`;
    sHtml += `, ${iTotQ} NoShows (${iTotM}€)`;
    if (iError == 0) {
      sHtml += `et ${iCanceledSessions} session(s) annulée(s) (${0}€) </p>`;
    } else {
      sHtml += `, ${iCanceledSessions} session(s) annulée(s) (${0}€) ainsi que ${iError} session(s) en anomalie (cf 1.)`;
    }
    sHtml += `<br >Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
    sHtml += `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;
    if (iError > 0) {
      let oError = r[0].errors[0];
      sHtml += `(1) Attention, il y a ${iError} session(s) qui présente(nt) une anomalie c'est peut être normal : exemple un étudiant qui n'a plus de parcours associé au moment de la collecte de session`;
      sHtml += `, pour plus d'information regarder du côté de la console (en 'warn')</p>`;
      console.warn("Sessions en anomalie");
      console.warn(`il y a ${oError.total_errors} erreurs relevées , notez qu'il y a ${oError.total_filtered} ennregistrements filtrés(lvl,...)  sur ${oError.total} enregistrements dans la période, le total des erreurs devrait donc être de ${oError.control} erreurs`);
      console.warn("détail");
      console.warn(`${r[0].errors[1].data.length} erreurs de type ${r[0].errors[1].type} data are`, r[0].errors[1].data);
      console.warn(`${r[0].errors[2].data.length} erreurs de type ${r[0].errors[2].type} data are`, r[0].errors[2].data);
      console.warn(`${r[0].errors[3].data.length} erreurs de type ${r[0].errors[3].type} data are`, r[0].errors[3].data);
    }
    sHtml += `<p>Soit un total général à facturer de ${iTotalHtSessions}€`;
    Swal.fire({
      title: `<strong>Liste des formations tarifées du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen"
    });
  };
  var showBillPhase2 = function(dtFrom, dtTo, r) {
    console.log("enter computation bill");
    var t0 = performance.now();
    var sHtml = "";
    var _ref = null;
    var iTotQ1 = 0;
    var iTotQ2 = 0;
    var iTotM1 = 0;
    var iTotM2 = 0;
    var aTable = [[4, "Groupe"], [1, "Niveau 1"], [2, "Niveau 2"], [3, "Niveau 3"]];
    var iCurrentMaxLevel = r[0].max_level;
    sHtml += "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
    sHtml += '<div class="wrapper">';
    sHtml += "<table>";
    sHtml += "<caption>Sessions de mentorat (dont soutenances)</caption>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += '<th rowspan="2">Type</th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th>';
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += '<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">nb</abbr></th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    var _l = 1;
    while (_l <= iCurrentMaxLevel) {
      sHtml += "<tr>";
      sHtml += `<td> Niveau ${_l}</td>`;
      let _ses = r[_l].sessions;
      let _def = r[_l].defenses;
      let _q1 = _ses.number[0];
      let _q2 = _ses.number[4];
      let _m1 = _q1 * _ses.pu[0];
      let _m2 = _q2 * _ses.pu[4];
      iTotQ1 += _q1;
      iTotQ2 += _q2;
      iTotM1 += _m1;
      iTotM2 += _m2;
      sHtml += `<td>${_q1} (${_def.number[0]})</td><td>${_ses.pu[0]}</td><td>${_m1}€</td>`;
      sHtml += `<td>${_q2} (${_def.number[4]})</td><td>${_ses.pu[4]}</td><td>${_m2}€</td>`;
      sHtml += `<td>${_q1 + _q2} (${_def.number[0] + _def.number[4]})</td><td>${_m1 + _m2}€</td>`;
      sHtml += "</tr>";
      _l += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ1}</td><td></td><td>${iTotM1}€</td>`;
    sHtml += `<td>${iTotQ2}</td><td></td><td>${iTotM2}€</td>`;
    sHtml += `<td>${iTotQ1 + iTotQ2}</td><td>${iTotM1 + iTotM2}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    var iTotQG = iTotQ1 + iTotQ2;
    var iTotMG = iTotM1 + iTotM2;
    iTotQ1 = 0;
    iTotQ2 = 0;
    iTotM1 = 0;
    iTotM2 = 0;
    sHtml += "<table>";
    sHtml += "<caption>Sessions de mentorat :NoShow (dont soutenances)</caption>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += '<th rowspan="2"></th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th><th colspan="2" scope="colgroup">Ensemble</th>';
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += '<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += '<th><abbr title="nombre">nb</abbr></th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    _l = 1;
    while (_l <= iCurrentMaxLevel) {
      sHtml += "<tr>";
      sHtml += `<td> Niveau ${_l}</td>`;
      let _ses = r[_l].sessions;
      let _def = r[_l].defenses;
      let _q1 = _ses.number[3];
      let _q2 = _ses.number[7];
      let _m1 = _q1 * _ses.pu[3];
      let _m2 = _q2 * _ses.pu[7];
      iTotQ1 += _q1;
      iTotQ2 += _q2;
      iTotM1 += _m1;
      iTotM2 += _m2;
      sHtml += `<td>${_q1} (${_def.number[3]})</td><td>${_ses.pu[3]}</td><td>${_m1}€</td>`;
      sHtml += `<td>${_q2} (${_def.number[7]})</td><td>${_ses.pu[7]}</td><td>${_m2}€</td>`;
      sHtml += `<td>${_q1 + _q2}</td><td>${_m1 + _m2}€</td>`;
      sHtml += "</tr>";
      _l += 1;
    }
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ1}</td><td></td><td>${iTotM1}€</td>`;
    sHtml += `<td>${iTotQ2}</td><td></td><td>${iTotM2}€</td>`;
    sHtml += `<td>${iTotQ1 + iTotQ2}</td><td>${iTotM1 + iTotM2}€</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    var t2 = performance.now();
    console.log("%cCalculate second html table took " + (t2 - t1) + " milliseconds.", APP_PERF_STYLE);
    iTotQG += iTotQ1 + iTotQ2;
    iTotMG += iTotM1 + iTotM2;
    var iCanceledSessions = 0;
    var iTotalSessions = 0;
    var iTotalHtSessions = 0;
    var iTotalDefenses = 0;
    var iTotalHtDefenses = 0;
    _l = 1;
    while (_l <= iCurrentMaxLevel) {
      iCanceledSessions += r[_l].sessions.number[1];
      iCanceledSessions += r[_l].sessions.number[2];
      iCanceledSessions += r[_l].sessions.number[5];
      iCanceledSessions += r[_l].sessions.number[6];
      for (let _i in [...Array(8).keys()]) {
        let _t = r[_l].sessions.number[_i];
        iTotalSessions += _t;
        iTotalHtSessions += _t * r[_l].sessions.pu[_i];
        _t = r[_l].defenses.number[_i];
        iTotalDefenses += _t;
        iTotalHtDefenses += _t * r[_l].defenses.pu[_i];
      }
      _l += 1;
    }
    let iError = r[0].errors[0].total_errors;
    iTotalSessions += iError;
    sHtml += `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG - iTotQ1 - iTotQ2} session(s) de mentorat (${iTotMG - iTotM1 - iTotM2}€)`;
    sHtml += `, ${iTotQ1 + iTotQ2} NoShows (${iTotM1 + iTotM2}€)`;
    if (iError == 0) {
      sHtml += `et ${iCanceledSessions} session(s) annulée(s) (${0}€)`;
    } else {
      sHtml += `, ${iCanceledSessions} session(s) annulée(s) (${0}€) ainsi que ${iError} session(s) en anomalie (cf 1.)`;
    }
    sHtml += `<br>Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
    sHtml += `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;
    if (iError > 0) {
      let oError = r[0].errors[0];
      sHtml += `(1) Attention, il y a ${iError} session(s) qui présente(nt) une anomalie c'est peut être normal : exemple un étudiant qui n'a plus de parcours associé au moment de la collecte de session`;
      sHtml += `, pour plus d'information regarder du côté de la console (en 'warn')</p>`;
      console.warn("Sessions en anomalie");
      console.warn(`il y a ${oError.total_errors} erreurs relevées , notez qu'il y a ${oError.total_filtered} ennregistrements filtrés(lvl,...)  sur ${oError.total} enregistrements dans la période, le total des erreurs devrait donc être de ${oError.control} erreurs`);
      console.warn("détail");
      console.warn(`${r[0].errors[1].data.length} erreurs de type ${r[0].errors[1].type} data are`, r[0].errors[1].data);
      console.warn(`${r[0].errors[2].data.length} erreurs de type ${r[0].errors[2].type} data are`, r[0].errors[2].data);
      console.warn(`${r[0].errors[3].data.length} erreurs de type ${r[0].errors[3].type} data are`, r[0].errors[3].data);
    }
    var t3 = performance.now();
    console.log("%cCalculate bottom remark + errors took " + (t3 - t2) + " milliseconds.", APP_PERF_STYLE);
    var iTotG = 0;
    let sAFOK = "";
    let sAFKO = "";
    for (var t in r[0].bonus) {
      if (r[0].bonus[t].sessions >= 1) {
        iTotG += 30;
        sAFOK += r[0].bonus[t].who_name + ",";
      } else {
        sAFKO += r[0].bonus[t].who_name + ",";
      }
    }
    sHtml += `<p>Calcul du forfait "autofinancé". Vous sont affectés ${r[0].bonus.length} étudiants financés, parmi ceux ci, ${iTotG / 30} étudiant(s) avaient au moins une session programmée (${sAFOK.slice(0, -1)})`;
    if (iTotG / 30 !== r[0].bonus.length) {
      sHtml += `, (${r[0].bonus.length - iTotG / 30}) étudiant(s) (${sAFKO.slice(0, -1)}) n'ont pas eu de sessions`;
    }
    sHtml += `, le forfait est donc de ${iTotG}€</p>`;
    sHtml += `<p>Soit un total général à facturer de ${iTotalHtSessions + iTotG}€`;
    var t4 = performance.now();
    console.log("%cCalculate AF took " + (t4 - t3) + " milliseconds.", APP_PERF_STYLE);
    var t5 = performance.now();
    console.log("%cCalculate html table took " + (t4 - t0) + " milliseconds.", APP_PERF_STYLE);
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
    let dtCurFrom = dtFrom;
    let aData = [];
    var t0 = performance.now();
    while (dtCurFrom.isSameOrBefore(dtTo, "day")) {
      let dtCurTo2 = dtCurFrom.endOf("month");
      aData.push(accounting_default.calculateBill(dtCurFrom, dtCurTo2));
      dtCurFrom = dtCurFrom.add(1, "month");
    }
    var t1 = performance.now();
    console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    var sHtml = "";
    var _iMaxIndex = dtTo.get("month") - dtFrom.get("month");
    sHtml += "<table>";
    sHtml += "<thead>";
    sHtml += "<tr><th>Origine</th>";
    var _m1 = 0;
    while (_m1 <= _iMaxIndex) {
      let _dt = dtFrom.add(_m1, "month");
      sHtml += `<th>${_dt.format("MMMM")}</th>`;
      _m1 += 1;
    }
    sHtml += "<th>Total</th><th>Moyenne</th></tr>";
    sHtml += "</thdead>";
    sHtml += "<tbody>";
    sHtml += "<tr>";
    sHtml += `<td colspan=${_iMaxIndex} style="text-align:left;">Sessions</td></tr>`;
    sHtml += "<tr>";
    sHtml += "<td>Sessions (Mt)</td>";
    let iTotalRow = 0;
    let _m = 0;
    let iTotal = 0;
    let aNbInMonth = [];
    let aNbDInMonth = [];
    let aNbMInMonth = [];
    let aAmInMonth = [];
    let aCanceledNbInMonth = [];
    let aCanceledNbDInMonth = [];
    let aCanceledNbMInMonth = [];
    dtCurFrom = dtFrom;
    while (_m <= _iMaxIndex) {
      let _l = 1;
      aNbInMonth[_m] = 0;
      aNbDInMonth[_m] = 0;
      aNbMInMonth[_m] = 0;
      aCanceledNbInMonth[_m] = 0;
      aCanceledNbDInMonth[_m] = 0;
      aCanceledNbMInMonth[_m] = 0;
      let iCurrentMaxLevel = aData[_m][0].max_level;
      while (_l < iCurrentMaxLevel) {
        let _z = [...Array(8).keys()];
        for (let _i = 0; _i < _z.length; _i += 1) {
          iTotal += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
          aNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
          aNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
          aNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
          if (core_default.isInOldMode(dtCurFrom)) {
            if ([1, 5].includes(_i)) {
              aCanceledNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
              aCanceledNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
              aCanceledNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
            }
          } else {
            if ([1, 2, 5, 6].includes(_i)) {
              aCanceledNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
              aCanceledNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
              aCanceledNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
            }
          }
        }
        _l += 1;
      }
      sHtml += `<td>${iTotal}</td>`;
      aAmInMonth[_m] = iTotal;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
      dtCurFrom = dtCurFrom.add(1, "month");
    }
    sHtml += `<td>${iTotalRow}</td><td>${(iTotalRow / (_iMaxIndex + 1)).toFixed(2)}</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>Sessions (Nb)</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${aNbInMonth[_m] - aCanceledNbInMonth[_m]}(${aNbInMonth[_m]})</td>`;
      iTotalRow += aNbInMonth[_m];
      _m += 1;
    }
    sHtml += `<td>${iTotalRow}</td><td>${(iTotalRow / (_iMaxIndex + 1)).toFixed(2)}</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>Sessions (PU)</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${(aAmInMonth[_m] / (aNbInMonth[_m] - aCanceledNbInMonth[_m])).toFixed(2)}</td>`;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += `<td colspan=${_iMaxIndex} style="text-align:left;">Mentorat</td></tr>`;
    sHtml += "<tr>";
    sHtml += "<td>Mentorat (Mt)</td>";
    _m = 0;
    iTotal = 0;
    aAmInMonth = [];
    while (_m <= _iMaxIndex) {
      let _l = 1;
      let iCurrentMaxLevel = aData[_m][0].max_level;
      while (_l < iCurrentMaxLevel) {
        let _z = [...Array(8).keys()];
        for (let _i = 0; _i < _z.length; _i += 1) {
          iTotal += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i] - aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i];
          aAmInMonth[_m] = iTotal;
        }
        _l += 1;
      }
      sHtml += `<td>${iTotal}</td>`;
      _m += 1;
      iTotal = 0;
    }
    sHtml += "<tr>";
    sHtml += "<tr>";
    sHtml += "<td>Mentorat (Nb)</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    aNbInMonth = [];
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${aNbMInMonth[_m] - aCanceledNbMInMonth[_m]}(${aNbMInMonth[_m]})</td>`;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow}</td><td>${(iTotalRow / (_iMaxIndex + 1)).toFixed(2)}</td>`;
    sHtml += "</tr>";
    sHtml += "<td>Mentorat (PU)</td>";
    _m = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${(aAmInMonth[_m] / (aNbMInMonth[_m] - aCanceledNbMInMonth[_m])).toFixed(2)}</td>`;
      aAmInMonth[_m] = iTotal;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow}</td><td>${(iTotalRow / (_iMaxIndex + 1)).toFixed(2)}</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += `<td colspan=${_iMaxIndex} style="text-align:left;">Soutenances</td></tr>`;
    sHtml += "<tr>";
    sHtml += "<td>Soutenances (Mt)</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    aNbInMonth = [];
    aAmInMonth = [];
    while (_m <= _iMaxIndex) {
      let _l = 1;
      aNbInMonth[_m] = 0;
      let iCurrentMaxLevel = aData[_m][0].max_level;
      while (_l < iCurrentMaxLevel) {
        let _z = [...Array(8).keys()];
        for (let _i = 0; _i < _z.length; _i += 1) {
          iTotal += aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i];
          aNbInMonth[_m] += aData[_m][_l].defenses.number[_i];
        }
        _l += 1;
      }
      sHtml += `<td>${iTotal}</td>`;
      aAmInMonth[_m] = iTotal;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow}</td><td>${(iTotalRow / (_iMaxIndex + 1)).toFixed(2)}</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>Soutenances (Nb)</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${aNbInMonth[_m] - aCanceledNbDInMonth[_m]}(${aNbInMonth[_m]})</td>`;
      iTotalRow += aNbInMonth[_m];
      _m += 1;
    }
    sHtml += `<td>${iTotalRow}</td><td>${(iTotalRow / (_iMaxIndex + 1)).toFixed(2)}</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>Soutenances (PU)</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${(aAmInMonth[_m] / (aNbInMonth[_m] - aCanceledNbDInMonth[_m])).toFixed(2)}</td>`;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
    sHtml += "</tr>";
    sHtml += `<td colspan=${_iMaxIndex} style="text-align:left;">Bonus</td></tr>`;
    sHtml += "<tr>";
    sHtml += "<td>Bonus AF</td>";
    _m = 0;
    iTotal = 0;
    let aAmBoInMonth = [];
    while (_m <= _iMaxIndex) {
      let _z = aData[_m][0].bonus;
      aAmBoInMonth[_m] = 0;
      for (let _i = 0; _i < _z.length; _i += 1) {
        iTotal += _z[_i].sessions > 0 ? 30 : 0;
      }
      sHtml += `<td>${iTotal}</td>`;
      aAmBoInMonth[_m] = iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += `<td colspan=${_iMaxIndex} style="text-align:left;">TJM</td></tr>`;
    sHtml += "<tr>";
    sHtml += "<td>Nb Jrs</td>";
    _m = 0;
    var _iTot = [];
    iTotalRow = 0;
    dtCurFrom = dtFrom;
    aAmInMonth = [];
    dtCurFrom = dtFrom.clone();
    let dtCurTo = dtCurFrom.clone().endOf("month");
    let aWorkDays = [];
    while (_m <= _iMaxIndex) {
      if (dtCurTo.isAfter(dtTo, "day"))
        dtCurTo = dtTo.clone();
      sHtml += `<td>${workday_count(dtCurFrom, dtCurTo)} jrs</td>`;
      aWorkDays[_m] = workday_count(dtCurFrom, dtCurTo);
      dtCurFrom = dtCurFrom.add(1, "month");
      dtCurTo = dtCurTo.add(1, "month");
      _m += 1;
    }
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>TJM</td>";
    _m = 0;
    while (_m <= _iMaxIndex) {
      iTotal = 0;
      let _l = 1;
      aAmInMonth[_m] = 0;
      _iTot[_m] = 0;
      let iCurrentMaxLevel = aData[_m][0].max_level;
      while (_l < iCurrentMaxLevel) {
        let _z = [...Array(8).keys()];
        for (let _i = 0; _i < _z.length; _i += 1) {
          aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
        }
        _l += 1;
      }
      sHtml += `<td>${(aAmInMonth[_m] / aWorkDays[_m]).toFixed(2)} €</td>`;
      _m += 1;
    }
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>THM (théorique)</td>";
    _m = 0;
    _iTot = [];
    iTotalRow = 0;
    dtCurFrom = dtFrom;
    aAmInMonth = [];
    while (_m <= _iMaxIndex) {
      iTotal = 0;
      let _l = 1;
      aAmInMonth[_m] = 0;
      _iTot[_m] = 0;
      let iCurrentMaxLevel = aData[_m][0].max_level;
      while (_l < iCurrentMaxLevel) {
        let _z = [...Array(8).keys()];
        for (let _i = 0; _i < _z.length; _i += 1) {
          aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
          if (core_default.isInOldMode(dtCurFrom)) {
            iTotal += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45 / 60);
          } else {
            if ([4, 5, 6, 7].includes(_i)) {
              iTotal += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (30 / 60);
            }
            if ([0, 1, 2, 3].includes(_i)) {
              iTotal += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45 / 60);
            }
          }
          iTotal += aData[_m][_l].defenses.number[_i] * (45 / 60);
        }
        _l += 1;
      }
      console.log(`%cMontant mensuel : ${aAmInMonth[_m]} + bonus ${aAmBoInMonth[_m]}/ Nb heures ${iTotal} = $((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)`, APP_DEBUG_STYLE);
      sHtml += `<td>${((aAmInMonth[_m] + aAmBoInMonth[_m]) / iTotal).toFixed(2)} €</td>`;
      iTotalRow += iTotal;
      _iTot[_m] = iTotal;
      iTotal = 0;
      _m += 1;
      dtCurFrom = dtCurFrom.add(1, "month");
    }
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>Nb heures</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${_iTot[_m].toFixed(2)} h</td>`;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>THM (person.)</td>";
    _m = 0;
    _iTot = [];
    iTotalRow = 0;
    dtCurFrom = dtFrom;
    aAmInMonth = [];
    while (_m <= _iMaxIndex) {
      iTotal = 0;
      let _l = 1;
      aAmInMonth[_m] = 0;
      _iTot[_m] = 0;
      let iCurrentMaxLevel = aData[_m][0].max_level;
      while (_l < iCurrentMaxLevel) {
        let _z = [...Array(8).keys()];
        for (let _i = 0; _i < _z.length; _i += 1) {
          aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
          if (core_default.isInOldMode(dtCurFrom)) {
            iTotal += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM") / 60);
          } else {
            if ([4, 5, 6, 7].includes(_i)) {
              iTotal += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsAfM") / 60);
            }
            if ([0, 1, 2, 3].includes(_i)) {
              iTotal += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM") / 60);
            }
          }
          iTotal += aData[_m][_l].defenses.number[_i] * (GM_config.get("nbHrsD") / 60);
        }
        _l += 1;
      }
      console.log(`montant mensuel : ${aAmInMonth[_m]} + bonus ${aAmBoInMonth[_m]}/ Nb heures ${iTotal} = $((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)`);
      sHtml += `<td>${((aAmInMonth[_m] + aAmBoInMonth[_m]) / iTotal).toFixed(2)} €</td>`;
      iTotalRow += iTotal;
      _iTot[_m] = iTotal;
      iTotal = 0;
      _m += 1;
      dtCurFrom = dtCurFrom.add(1, "month");
    }
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "<td>Nb heures</td>";
    iTotalRow = 0;
    _m = 0;
    iTotal = 0;
    while (_m <= _iMaxIndex) {
      sHtml += `<td>${_iTot[_m].toFixed(2)} h</td>`;
      iTotalRow += iTotal;
      iTotal = 0;
      _m += 1;
    }
    sHtml += `<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
    sHtml += "</tr>";
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml + "<p>Attention le nombre entre parenthèse représente les sessions y compris les sessions annulées</p>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    var t2 = performance.now();
    console.log("%cTime to show table :" + (t2 - t1) + " milliseconds.", APP_PERF_STYLE);
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

  // src/ui.js
  class UI {
    static init = function() {
      console.log("%cin initUI", APP_DEBUG_STYLE);
      UI.build();
      var draggie = new Draggabilly(".draggable", {handle: ".handle"});
      FpsTracker.start("animation-target");
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
      UI.addButton("CollectAuto", historyFetch, {}, div);
      UI.addButton("showBill", showBill, {}, div);
      UI.addButton("billInDetails", billInDetails, {}, div);
      UI.addButton("PDF", pdf2, {}, div);
      UI.addButton("SList", students_default.showList, {}, div);
      UI.addButton("statistics", statistics, {}, div);
      UI.addButton("Database", mgtDbase, {}, div);
      UI.addButton("about", about, {}, div);
      var fpstracker = document.createElement("div");
      fpstracker.id = "animation-target";
      div.appendChild(fpstracker);
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
      requestAnimationFrame(slideRight);
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
        label: "Nombre de minutes pour une session AF",
        labelPos: "left",
        type: "input",
        default: 30
      },
      nbHrsfM: {
        label: "Nombre de minutes pour une session financée",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsD: {
        label: "Nombre de minutes pour une session de soutenance",
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
        section: ["Interface", "gadget"],
        label: "Toujours ajouter les checkbox sur l'interface",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      hackheaderzindex: {
        label: "changer le zindex du bandeau haut",
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
  require_src();
})();
//# sourceMappingURL=app-facturier.js.map

