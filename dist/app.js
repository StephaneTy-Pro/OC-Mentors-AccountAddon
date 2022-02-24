// ==UserScript==
// @name         Facturier
// @namespace    http://tampermonkey.net/
// @version      1.10.0011
// @description  Un addon pour vous aider dans votre facturation
// @author       Stéphane TORCHY
// @updateURL    https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js
// @downloadURL  https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js
// @icon         https://mirrors.creativecommons.org/presskit/icons/heart.red.png
// multiple usage
// @match        https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history*
// @match        https://openclassrooms.com/fr/mentorship/dashboard/sessions
// @match        https://openclassrooms.com/fr/mentorship/dashboard/booked-mentorship-sessions

// Start at document start https://www.tampermonkey.net/documentation.php#_run_at
// @run-at document-start   

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
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


//// GM_Compat : Portable monkey-patching for userscripts  
// SRC 				https://github.com/chocolateboy/gm-compat
// permet notamment d'utiliser GMCompat.unsafeWindow.notify('loaded', { value: 42 }) sous chrome
// @require       	https://unpkg.com/gm-compat@1.1.0 

//// GM_Config
// SRC 			https://github.com/sizzlemctwizzle/GM_config/wiki
// require      https://openuserjs.org/src/libs/sizzle/GM_config.js (cassé ce jour 28/08/2020);
// @require      https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/gm_config.js

//// sweetalert 2
// require      https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.all.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10

//// draggabilly
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.2.0/draggabilly.pkgd.min.js

//// toastify 
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1.8.0/src/toastify.min.js
// @resource    toastifycss https://raw.githubusercontent.com/apvarun/toastify-js/master/src/toastify.css

// https://github.com/uzairfarooq/arrive --> included manually
// require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js

////simple-datatables
//// https://github.com/fiduswriter/Simple-DataTables
// @require     https://cdn.jsdelivr.net/npm/simple-datatables@latest
// @resource    simpledatatablecss https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css


//// MEMOIZATION
//// TODO : check best function
// require https://raw.githubusercontent.com/anywhichway/nano-memoize/master/dist/nano-memoize.min.js
// https://github.com/planttheidea/moize#usage
// @require https://cdn.jsdelivr.net/npm/moize@5.4.7/dist/moize.min.js
// require https://cdn.jsdelivr.net/npm/moize@6.0.2/dist/moize.min.js -> probleme 20210701
// require https://cdn.jsdelivr.net/npm/moize@6.0.3/dist/moize.min.js -> probleme 20210701
// USAGE OF https://caolan.github.io/async/v3/docs.html
// FONCTIONNE PAS require https://cdn.jsdelivr.net/npm/async@3.2.0/memoize.min.js probleme export
// @require https://cdn.jsdelivr.net/npm/async@3.2.0/dist/async.min.js
// TOTEST https://github.com/sindresorhus/p-memoize
// Ne fonctionne pasrequire https://cdn.skypack.dev/p-memoize

//// FETCH INJECT --> included manually
// require https://cdn.jsdelivr.net/npm/fetch-inject

//// PARSER MKDOWN
// @require 	 https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js

//// PDF https://pdf-lib.js.org/docs/api/
// @require      https://unpkg.com/pdf-lib@1.9.0/dist/pdf-lib.min.js
// @require      https://unpkg.com/downloadjs@1.4.7/download.js

//// HTMX https://htmx.org --> included dynamically
// require https://unpkg.com/htmx.org@1.1.0/dist/htmx.min.js

//// ALPINE JS --> included dynamically
// require https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js


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


// @require https://unpkg.com/nprogress@0.2.0/nprogress.js
// @resource nprogress_css https://unpkg.com/nprogress@0.2.0/nprogress.css


// semble cassé
// https://github.com/webosorg/Process
// https://unpkg.com/@webos/process@0.2.0/dist/process.js
// https://cdn.jsdelivr.net/npm/@webos/process@0.2.0/dist/process.min.js
// bof ... je ne parviens pas à faire fonctionner l'exemple
// https://cdn.jsdelivr.net/npm/worker-function@2.0.1/WorkerFunction.min.js
// Threading 
// require  https://raw.githubusercontent.com/gkjohnson/threading-js/master/umd/Thread.js
// require   https://raw.githubusercontent.com/gkjohnson/threading-js/master/umd/ThreadPool.js
// require   https://raw.githubusercontent.com/gkjohnson/threading-js/master/umd/ThreadQueue.js
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
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/vendor/papaparse/papaparse.min.js
  var require_papaparse_min = __commonJS({
    "src/vendor/papaparse/papaparse.min.js"(exports, module) {
      !function(e, t) {
        typeof define == "function" && define.amd ? define([], t) : typeof module == "object" && typeof exports != "undefined" ? module.exports = t() : e.Papa = t();
      }(exports, function s() {
        "use strict";
        var f = typeof self != "undefined" ? self : typeof window != "undefined" ? window : f !== void 0 ? f : {};
        var n = !f.document && !!f.postMessage, o = n && /blob:/i.test((f.location || {}).protocol), a = {}, h2 = 0, b = { parse: function(e, t) {
          var i3 = (t = t || {}).dynamicTyping || false;
          U(i3) && (t.dynamicTypingFunction = i3, i3 = {});
          if (t.dynamicTyping = i3, t.transform = !!U(t.transform) && t.transform, t.worker && b.WORKERS_SUPPORTED) {
            var r2 = function() {
              if (!b.WORKERS_SUPPORTED)
                return false;
              var e2 = (i4 = f.URL || f.webkitURL || null, r3 = s.toString(), b.BLOB_URL || (b.BLOB_URL = i4.createObjectURL(new Blob(["(", r3, ")();"], { type: "text/javascript" })))), t2 = new f.Worker(e2);
              var i4, r3;
              return t2.onmessage = m, t2.id = h2++, a[t2.id] = t2;
            }();
            return r2.userStep = t.step, r2.userChunk = t.chunk, r2.userComplete = t.complete, r2.userError = t.error, t.step = U(t.step), t.chunk = U(t.chunk), t.complete = U(t.complete), t.error = U(t.error), delete t.worker, void r2.postMessage({ input: e, config: t, workerId: r2.id });
          }
          var n2 = null;
          b.NODE_STREAM_INPUT, typeof e == "string" ? n2 = t.download ? new l(t) : new p(t) : e.readable === true && U(e.read) && U(e.on) ? n2 = new g(t) : (f.File && e instanceof File || e instanceof Object) && (n2 = new c(t));
          return n2.stream(e);
        }, unparse: function(e, t) {
          var n2 = false, m2 = true, _3 = ",", v2 = "\r\n", s2 = '"', a2 = s2 + s2, i3 = false, r2 = null, o2 = false;
          !function() {
            if (typeof t != "object")
              return;
            typeof t.delimiter != "string" || b.BAD_DELIMITERS.filter(function(e2) {
              return t.delimiter.indexOf(e2) !== -1;
            }).length || (_3 = t.delimiter);
            (typeof t.quotes == "boolean" || typeof t.quotes == "function" || Array.isArray(t.quotes)) && (n2 = t.quotes);
            typeof t.skipEmptyLines != "boolean" && typeof t.skipEmptyLines != "string" || (i3 = t.skipEmptyLines);
            typeof t.newline == "string" && (v2 = t.newline);
            typeof t.quoteChar == "string" && (s2 = t.quoteChar);
            typeof t.header == "boolean" && (m2 = t.header);
            if (Array.isArray(t.columns)) {
              if (t.columns.length === 0)
                throw new Error("Option columns is empty");
              r2 = t.columns;
            }
            t.escapeChar !== void 0 && (a2 = t.escapeChar + s2);
            typeof t.escapeFormulae == "boolean" && (o2 = t.escapeFormulae);
          }();
          var h3 = new RegExp(q(s2), "g");
          typeof e == "string" && (e = JSON.parse(e));
          if (Array.isArray(e)) {
            if (!e.length || Array.isArray(e[0]))
              return f2(null, e, i3);
            if (typeof e[0] == "object")
              return f2(r2 || u2(e[0]), e, i3);
          } else if (typeof e == "object")
            return typeof e.data == "string" && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : u2(e.data[0])), Array.isArray(e.data[0]) || typeof e.data[0] == "object" || (e.data = [e.data])), f2(e.fields || [], e.data || [], i3);
          throw new Error("Unable to serialize unrecognized input");
          function u2(e2) {
            if (typeof e2 != "object")
              return [];
            var t2 = [];
            for (var i4 in e2)
              t2.push(i4);
            return t2;
          }
          function f2(e2, t2, i4) {
            var r3 = "";
            typeof e2 == "string" && (e2 = JSON.parse(e2)), typeof t2 == "string" && (t2 = JSON.parse(t2));
            var n3 = Array.isArray(e2) && 0 < e2.length, s3 = !Array.isArray(t2[0]);
            if (n3 && m2) {
              for (var a3 = 0; a3 < e2.length; a3++)
                0 < a3 && (r3 += _3), r3 += y2(e2[a3], a3);
              0 < t2.length && (r3 += v2);
            }
            for (var o3 = 0; o3 < t2.length; o3++) {
              var h4 = n3 ? e2.length : t2[o3].length, u3 = false, f3 = n3 ? Object.keys(t2[o3]).length === 0 : t2[o3].length === 0;
              if (i4 && !n3 && (u3 = i4 === "greedy" ? t2[o3].join("").trim() === "" : t2[o3].length === 1 && t2[o3][0].length === 0), i4 === "greedy" && n3) {
                for (var d2 = [], l2 = 0; l2 < h4; l2++) {
                  var c2 = s3 ? e2[l2] : l2;
                  d2.push(t2[o3][c2]);
                }
                u3 = d2.join("").trim() === "";
              }
              if (!u3) {
                for (var p2 = 0; p2 < h4; p2++) {
                  0 < p2 && !f3 && (r3 += _3);
                  var g2 = n3 && s3 ? e2[p2] : p2;
                  r3 += y2(t2[o3][g2], p2);
                }
                o3 < t2.length - 1 && (!i4 || 0 < h4 && !f3) && (r3 += v2);
              }
            }
            return r3;
          }
          function y2(e2, t2) {
            if (e2 == null)
              return "";
            if (e2.constructor === Date)
              return JSON.stringify(e2).slice(1, 25);
            o2 === true && typeof e2 == "string" && e2.match(/^[=+\-@].*$/) !== null && (e2 = "'" + e2);
            var i4 = e2.toString().replace(h3, a2), r3 = typeof n2 == "boolean" && n2 || typeof n2 == "function" && n2(e2, t2) || Array.isArray(n2) && n2[t2] || function(e3, t3) {
              for (var i5 = 0; i5 < t3.length; i5++)
                if (-1 < e3.indexOf(t3[i5]))
                  return true;
              return false;
            }(i4, b.BAD_DELIMITERS) || -1 < i4.indexOf(_3) || i4.charAt(0) === " " || i4.charAt(i4.length - 1) === " ";
            return r3 ? s2 + i4 + s2 : i4;
          }
        } };
        if (b.RECORD_SEP = String.fromCharCode(30), b.UNIT_SEP = String.fromCharCode(31), b.BYTE_ORDER_MARK = "\uFEFF", b.BAD_DELIMITERS = ["\r", "\n", '"', b.BYTE_ORDER_MARK], b.WORKERS_SUPPORTED = !n && !!f.Worker, b.NODE_STREAM_INPUT = 1, b.LocalChunkSize = 10485760, b.RemoteChunkSize = 5242880, b.DefaultDelimiter = ",", b.Parser = w, b.ParserHandle = i2, b.NetworkStreamer = l, b.FileStreamer = c, b.StringStreamer = p, b.ReadableStreamStreamer = g, f.jQuery) {
          var d = f.jQuery;
          d.fn.parse = function(o2) {
            var i3 = o2.config || {}, h3 = [];
            return this.each(function(e2) {
              if (!(d(this).prop("tagName").toUpperCase() === "INPUT" && d(this).attr("type").toLowerCase() === "file" && f.FileReader) || !this.files || this.files.length === 0)
                return true;
              for (var t = 0; t < this.files.length; t++)
                h3.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i3) });
            }), e(), this;
            function e() {
              if (h3.length !== 0) {
                var e2, t, i4, r2, n2 = h3[0];
                if (U(o2.before)) {
                  var s2 = o2.before(n2.file, n2.inputElem);
                  if (typeof s2 == "object") {
                    if (s2.action === "abort")
                      return e2 = "AbortError", t = n2.file, i4 = n2.inputElem, r2 = s2.reason, void (U(o2.error) && o2.error({ name: e2 }, t, i4, r2));
                    if (s2.action === "skip")
                      return void u2();
                    typeof s2.config == "object" && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
                  } else if (s2 === "skip")
                    return void u2();
                }
                var a2 = n2.instanceConfig.complete;
                n2.instanceConfig.complete = function(e3) {
                  U(a2) && a2(e3, n2.file, n2.inputElem), u2();
                }, b.parse(n2.file, n2.instanceConfig);
              } else
                U(o2.complete) && o2.complete();
            }
            function u2() {
              h3.splice(0, 1), e();
            }
          };
        }
        function u(e) {
          this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
            var t = E(e2);
            t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
            this._handle = new i2(t), (this._handle.streamer = this)._config = t;
          }.call(this, e), this.parseChunk = function(e2, t) {
            if (this.isFirstChunk && U(this._config.beforeFirstChunk)) {
              var i3 = this._config.beforeFirstChunk(e2);
              i3 !== void 0 && (e2 = i3);
            }
            this.isFirstChunk = false, this._halted = false;
            var r2 = this._partialLine + e2;
            this._partialLine = "";
            var n2 = this._handle.parse(r2, this._baseIndex, !this._finished);
            if (!this._handle.paused() && !this._handle.aborted()) {
              var s2 = n2.meta.cursor;
              this._finished || (this._partialLine = r2.substring(s2 - this._baseIndex), this._baseIndex = s2), n2 && n2.data && (this._rowCount += n2.data.length);
              var a2 = this._finished || this._config.preview && this._rowCount >= this._config.preview;
              if (o)
                f.postMessage({ results: n2, workerId: b.WORKER_ID, finished: a2 });
              else if (U(this._config.chunk) && !t) {
                if (this._config.chunk(n2, this._handle), this._handle.paused() || this._handle.aborted())
                  return void (this._halted = true);
                n2 = void 0, this._completeResults = void 0;
              }
              return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(n2.data), this._completeResults.errors = this._completeResults.errors.concat(n2.errors), this._completeResults.meta = n2.meta), this._completed || !a2 || !U(this._config.complete) || n2 && n2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), a2 || n2 && n2.meta.paused || this._nextChunk(), n2;
            }
            this._halted = true;
          }, this._sendError = function(e2) {
            U(this._config.error) ? this._config.error(e2) : o && this._config.error && f.postMessage({ workerId: b.WORKER_ID, error: e2, finished: false });
          };
        }
        function l(e) {
          var r2;
          (e = e || {}).chunkSize || (e.chunkSize = b.RemoteChunkSize), u.call(this, e), this._nextChunk = n ? function() {
            this._readChunk(), this._chunkLoaded();
          } : function() {
            this._readChunk();
          }, this.stream = function(e2) {
            this._input = e2, this._nextChunk();
          }, this._readChunk = function() {
            if (this._finished)
              this._chunkLoaded();
            else {
              if (r2 = new XMLHttpRequest(), this._config.withCredentials && (r2.withCredentials = this._config.withCredentials), n || (r2.onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)), r2.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !n), this._config.downloadRequestHeaders) {
                var e2 = this._config.downloadRequestHeaders;
                for (var t in e2)
                  r2.setRequestHeader(t, e2[t]);
              }
              if (this._config.chunkSize) {
                var i3 = this._start + this._config.chunkSize - 1;
                r2.setRequestHeader("Range", "bytes=" + this._start + "-" + i3);
              }
              try {
                r2.send(this._config.downloadRequestBody);
              } catch (e3) {
                this._chunkError(e3.message);
              }
              n && r2.status === 0 && this._chunkError();
            }
          }, this._chunkLoaded = function() {
            r2.readyState === 4 && (r2.status < 200 || 400 <= r2.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : r2.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(e2) {
              var t = e2.getResponseHeader("Content-Range");
              if (t === null)
                return -1;
              return parseInt(t.substring(t.lastIndexOf("/") + 1));
            }(r2), this.parseChunk(r2.responseText)));
          }, this._chunkError = function(e2) {
            var t = r2.statusText || e2;
            this._sendError(new Error(t));
          };
        }
        function c(e) {
          var r2, n2;
          (e = e || {}).chunkSize || (e.chunkSize = b.LocalChunkSize), u.call(this, e);
          var s2 = typeof FileReader != "undefined";
          this.stream = function(e2) {
            this._input = e2, n2 = e2.slice || e2.webkitSlice || e2.mozSlice, s2 ? ((r2 = new FileReader()).onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)) : r2 = new FileReaderSync(), this._nextChunk();
          }, this._nextChunk = function() {
            this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
          }, this._readChunk = function() {
            var e2 = this._input;
            if (this._config.chunkSize) {
              var t = Math.min(this._start + this._config.chunkSize, this._input.size);
              e2 = n2.call(e2, this._start, t);
            }
            var i3 = r2.readAsText(e2, this._config.encoding);
            s2 || this._chunkLoaded({ target: { result: i3 } });
          }, this._chunkLoaded = function(e2) {
            this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
          }, this._chunkError = function() {
            this._sendError(r2.error);
          };
        }
        function p(e) {
          var i3;
          u.call(this, e = e || {}), this.stream = function(e2) {
            return i3 = e2, this._nextChunk();
          }, this._nextChunk = function() {
            if (!this._finished) {
              var e2, t = this._config.chunkSize;
              return t ? (e2 = i3.substring(0, t), i3 = i3.substring(t)) : (e2 = i3, i3 = ""), this._finished = !i3, this.parseChunk(e2);
            }
          };
        }
        function g(e) {
          u.call(this, e = e || {});
          var t = [], i3 = true, r2 = false;
          this.pause = function() {
            u.prototype.pause.apply(this, arguments), this._input.pause();
          }, this.resume = function() {
            u.prototype.resume.apply(this, arguments), this._input.resume();
          }, this.stream = function(e2) {
            this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
          }, this._checkIsFinished = function() {
            r2 && t.length === 1 && (this._finished = true);
          }, this._nextChunk = function() {
            this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i3 = true;
          }, this._streamData = y(function(e2) {
            try {
              t.push(typeof e2 == "string" ? e2 : e2.toString(this._config.encoding)), i3 && (i3 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
            } catch (e3) {
              this._streamError(e3);
            }
          }, this), this._streamError = y(function(e2) {
            this._streamCleanUp(), this._sendError(e2);
          }, this), this._streamEnd = y(function() {
            this._streamCleanUp(), r2 = true, this._streamData("");
          }, this), this._streamCleanUp = y(function() {
            this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
          }, this);
        }
        function i2(_3) {
          var a2, o2, h3, r2 = Math.pow(2, 53), n2 = -r2, s2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/, u2 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/, t = this, i3 = 0, f2 = 0, d2 = false, e = false, l2 = [], c2 = { data: [], errors: [], meta: {} };
          if (U(_3.step)) {
            var p2 = _3.step;
            _3.step = function(e2) {
              if (c2 = e2, m2())
                g2();
              else {
                if (g2(), c2.data.length === 0)
                  return;
                i3 += e2.data.length, _3.preview && i3 > _3.preview ? o2.abort() : (c2.data = c2.data[0], p2(c2, t));
              }
            };
          }
          function v2(e2) {
            return _3.skipEmptyLines === "greedy" ? e2.join("").trim() === "" : e2.length === 1 && e2[0].length === 0;
          }
          function g2() {
            if (c2 && h3 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + b.DefaultDelimiter + "'"), h3 = false), _3.skipEmptyLines)
              for (var e2 = 0; e2 < c2.data.length; e2++)
                v2(c2.data[e2]) && c2.data.splice(e2--, 1);
            return m2() && function() {
              if (!c2)
                return;
              function e3(e4, t3) {
                U(_3.transformHeader) && (e4 = _3.transformHeader(e4, t3)), l2.push(e4);
              }
              if (Array.isArray(c2.data[0])) {
                for (var t2 = 0; m2() && t2 < c2.data.length; t2++)
                  c2.data[t2].forEach(e3);
                c2.data.splice(0, 1);
              } else
                c2.data.forEach(e3);
            }(), function() {
              if (!c2 || !_3.header && !_3.dynamicTyping && !_3.transform)
                return c2;
              function e3(e4, t3) {
                var i4, r3 = _3.header ? {} : [];
                for (i4 = 0; i4 < e4.length; i4++) {
                  var n3 = i4, s3 = e4[i4];
                  _3.header && (n3 = i4 >= l2.length ? "__parsed_extra" : l2[i4]), _3.transform && (s3 = _3.transform(s3, n3)), s3 = y2(n3, s3), n3 === "__parsed_extra" ? (r3[n3] = r3[n3] || [], r3[n3].push(s3)) : r3[n3] = s3;
                }
                return _3.header && (i4 > l2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + l2.length + " fields but parsed " + i4, f2 + t3) : i4 < l2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + l2.length + " fields but parsed " + i4, f2 + t3)), r3;
              }
              var t2 = 1;
              !c2.data.length || Array.isArray(c2.data[0]) ? (c2.data = c2.data.map(e3), t2 = c2.data.length) : c2.data = e3(c2.data, 0);
              _3.header && c2.meta && (c2.meta.fields = l2);
              return f2 += t2, c2;
            }();
          }
          function m2() {
            return _3.header && l2.length === 0;
          }
          function y2(e2, t2) {
            return i4 = e2, _3.dynamicTypingFunction && _3.dynamicTyping[i4] === void 0 && (_3.dynamicTyping[i4] = _3.dynamicTypingFunction(i4)), (_3.dynamicTyping[i4] || _3.dynamicTyping) === true ? t2 === "true" || t2 === "TRUE" || t2 !== "false" && t2 !== "FALSE" && (function(e3) {
              if (s2.test(e3)) {
                var t3 = parseFloat(e3);
                if (n2 < t3 && t3 < r2)
                  return true;
              }
              return false;
            }(t2) ? parseFloat(t2) : u2.test(t2) ? new Date(t2) : t2 === "" ? null : t2) : t2;
            var i4;
          }
          function k(e2, t2, i4, r3) {
            var n3 = { type: e2, code: t2, message: i4 };
            r3 !== void 0 && (n3.row = r3), c2.errors.push(n3);
          }
          this.parse = function(e2, t2, i4) {
            var r3 = _3.quoteChar || '"';
            if (_3.newline || (_3.newline = function(e3, t3) {
              e3 = e3.substring(0, 1048576);
              var i5 = new RegExp(q(t3) + "([^]*?)" + q(t3), "gm"), r4 = (e3 = e3.replace(i5, "")).split("\r"), n4 = e3.split("\n"), s4 = 1 < n4.length && n4[0].length < r4[0].length;
              if (r4.length === 1 || s4)
                return "\n";
              for (var a3 = 0, o3 = 0; o3 < r4.length; o3++)
                r4[o3][0] === "\n" && a3++;
              return a3 >= r4.length / 2 ? "\r\n" : "\r";
            }(e2, r3)), h3 = false, _3.delimiter)
              U(_3.delimiter) && (_3.delimiter = _3.delimiter(e2), c2.meta.delimiter = _3.delimiter);
            else {
              var n3 = function(e3, t3, i5, r4, n4) {
                var s4, a3, o3, h4;
                n4 = n4 || [",", "	", "|", ";", b.RECORD_SEP, b.UNIT_SEP];
                for (var u3 = 0; u3 < n4.length; u3++) {
                  var f3 = n4[u3], d3 = 0, l3 = 0, c3 = 0;
                  o3 = void 0;
                  for (var p3 = new w({ comments: r4, delimiter: f3, newline: t3, preview: 10 }).parse(e3), g3 = 0; g3 < p3.data.length; g3++)
                    if (i5 && v2(p3.data[g3]))
                      c3++;
                    else {
                      var m3 = p3.data[g3].length;
                      l3 += m3, o3 !== void 0 ? 0 < m3 && (d3 += Math.abs(m3 - o3), o3 = m3) : o3 = m3;
                    }
                  0 < p3.data.length && (l3 /= p3.data.length - c3), (a3 === void 0 || d3 <= a3) && (h4 === void 0 || h4 < l3) && 1.99 < l3 && (a3 = d3, s4 = f3, h4 = l3);
                }
                return { successful: !!(_3.delimiter = s4), bestDelimiter: s4 };
              }(e2, _3.newline, _3.skipEmptyLines, _3.comments, _3.delimitersToGuess);
              n3.successful ? _3.delimiter = n3.bestDelimiter : (h3 = true, _3.delimiter = b.DefaultDelimiter), c2.meta.delimiter = _3.delimiter;
            }
            var s3 = E(_3);
            return _3.preview && _3.header && s3.preview++, a2 = e2, o2 = new w(s3), c2 = o2.parse(a2, t2, i4), g2(), d2 ? { meta: { paused: true } } : c2 || { meta: { paused: false } };
          }, this.paused = function() {
            return d2;
          }, this.pause = function() {
            d2 = true, o2.abort(), a2 = U(_3.chunk) ? "" : a2.substring(o2.getCharIndex());
          }, this.resume = function() {
            t.streamer._halted ? (d2 = false, t.streamer.parseChunk(a2, true)) : setTimeout(t.resume, 3);
          }, this.aborted = function() {
            return e;
          }, this.abort = function() {
            e = true, o2.abort(), c2.meta.aborted = true, U(_3.complete) && _3.complete(c2), a2 = "";
          };
        }
        function q(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function w(e) {
          var O, D = (e = e || {}).delimiter, I = e.newline, T = e.comments, A = e.step, L = e.preview, F = e.fastMode, z = O = e.quoteChar === void 0 ? '"' : e.quoteChar;
          if (e.escapeChar !== void 0 && (z = e.escapeChar), (typeof D != "string" || -1 < b.BAD_DELIMITERS.indexOf(D)) && (D = ","), T === D)
            throw new Error("Comment character same as delimiter");
          T === true ? T = "#" : (typeof T != "string" || -1 < b.BAD_DELIMITERS.indexOf(T)) && (T = false), I !== "\n" && I !== "\r" && I !== "\r\n" && (I = "\n");
          var M = 0, j = false;
          this.parse = function(a2, t, i3) {
            if (typeof a2 != "string")
              throw new Error("Input must be a string");
            var r2 = a2.length, e2 = D.length, n2 = I.length, s2 = T.length, o2 = U(A), h3 = [], u2 = [], f2 = [], d2 = M = 0;
            if (!a2)
              return R();
            if (F || F !== false && a2.indexOf(O) === -1) {
              for (var l2 = a2.split(I), c2 = 0; c2 < l2.length; c2++) {
                if (f2 = l2[c2], M += f2.length, c2 !== l2.length - 1)
                  M += I.length;
                else if (i3)
                  return R();
                if (!T || f2.substring(0, s2) !== T) {
                  if (o2) {
                    if (h3 = [], b2(f2.split(D)), S(), j)
                      return R();
                  } else
                    b2(f2.split(D));
                  if (L && L <= c2)
                    return h3 = h3.slice(0, L), R(true);
                }
              }
              return R();
            }
            for (var p2 = a2.indexOf(D, M), g2 = a2.indexOf(I, M), m2 = new RegExp(q(z) + q(O), "g"), _3 = a2.indexOf(O, M); ; )
              if (a2[M] !== O)
                if (T && f2.length === 0 && a2.substring(M, M + s2) === T) {
                  if (g2 === -1)
                    return R();
                  M = g2 + n2, g2 = a2.indexOf(I, M), p2 = a2.indexOf(D, M);
                } else {
                  if (p2 !== -1 && (p2 < g2 || g2 === -1)) {
                    if (!(p2 < _3)) {
                      f2.push(a2.substring(M, p2)), M = p2 + e2, p2 = a2.indexOf(D, M);
                      continue;
                    }
                    var v2 = x(p2, _3, g2);
                    if (v2 && v2.nextDelim !== void 0) {
                      p2 = v2.nextDelim, _3 = v2.quoteSearch, f2.push(a2.substring(M, p2)), M = p2 + e2, p2 = a2.indexOf(D, M);
                      continue;
                    }
                  }
                  if (g2 === -1)
                    break;
                  if (f2.push(a2.substring(M, g2)), C(g2 + n2), o2 && (S(), j))
                    return R();
                  if (L && h3.length >= L)
                    return R(true);
                }
              else
                for (_3 = M, M++; ; ) {
                  if ((_3 = a2.indexOf(O, _3 + 1)) === -1)
                    return i3 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h3.length, index: M }), E2();
                  if (_3 === r2 - 1)
                    return E2(a2.substring(M, _3).replace(m2, O));
                  if (O !== z || a2[_3 + 1] !== z) {
                    if (O === z || _3 === 0 || a2[_3 - 1] !== z) {
                      p2 !== -1 && p2 < _3 + 1 && (p2 = a2.indexOf(D, _3 + 1)), g2 !== -1 && g2 < _3 + 1 && (g2 = a2.indexOf(I, _3 + 1));
                      var y2 = w2(g2 === -1 ? p2 : Math.min(p2, g2));
                      if (a2[_3 + 1 + y2] === D) {
                        f2.push(a2.substring(M, _3).replace(m2, O)), a2[M = _3 + 1 + y2 + e2] !== O && (_3 = a2.indexOf(O, M)), p2 = a2.indexOf(D, M), g2 = a2.indexOf(I, M);
                        break;
                      }
                      var k = w2(g2);
                      if (a2.substring(_3 + 1 + k, _3 + 1 + k + n2) === I) {
                        if (f2.push(a2.substring(M, _3).replace(m2, O)), C(_3 + 1 + k + n2), p2 = a2.indexOf(D, M), _3 = a2.indexOf(O, M), o2 && (S(), j))
                          return R();
                        if (L && h3.length >= L)
                          return R(true);
                        break;
                      }
                      u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h3.length, index: M }), _3++;
                    }
                  } else
                    _3++;
                }
            return E2();
            function b2(e3) {
              h3.push(e3), d2 = M;
            }
            function w2(e3) {
              var t2 = 0;
              if (e3 !== -1) {
                var i4 = a2.substring(_3 + 1, e3);
                i4 && i4.trim() === "" && (t2 = i4.length);
              }
              return t2;
            }
            function E2(e3) {
              return i3 || (e3 === void 0 && (e3 = a2.substring(M)), f2.push(e3), M = r2, b2(f2), o2 && S()), R();
            }
            function C(e3) {
              M = e3, b2(f2), f2 = [], g2 = a2.indexOf(I, M);
            }
            function R(e3) {
              return { data: h3, errors: u2, meta: { delimiter: D, linebreak: I, aborted: j, truncated: !!e3, cursor: d2 + (t || 0) } };
            }
            function S() {
              A(R()), h3 = [], u2 = [];
            }
            function x(e3, t2, i4) {
              var r3 = { nextDelim: void 0, quoteSearch: void 0 }, n3 = a2.indexOf(O, t2 + 1);
              if (t2 < e3 && e3 < n3 && (n3 < i4 || i4 === -1)) {
                var s3 = a2.indexOf(D, n3);
                if (s3 === -1)
                  return r3;
                n3 < s3 && (n3 = a2.indexOf(O, n3 + 1)), r3 = x(s3, n3, i4);
              } else
                r3 = { nextDelim: e3, quoteSearch: t2 };
              return r3;
            }
          }, this.abort = function() {
            j = true;
          }, this.getCharIndex = function() {
            return M;
          };
        }
        function m(e) {
          var t = e.data, i3 = a[t.workerId], r2 = false;
          if (t.error)
            i3.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var n2 = { abort: function() {
              r2 = true, _2(t.workerId, { data: [], errors: [], meta: { aborted: true } });
            }, pause: v, resume: v };
            if (U(i3.userStep)) {
              for (var s2 = 0; s2 < t.results.data.length && (i3.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r2); s2++)
                ;
              delete t.results;
            } else
              U(i3.userChunk) && (i3.userChunk(t.results, n2, t.file), delete t.results);
          }
          t.finished && !r2 && _2(t.workerId, t.results);
        }
        function _2(e, t) {
          var i3 = a[e];
          U(i3.userComplete) && i3.userComplete(t), i3.terminate(), delete a[e];
        }
        function v() {
          throw new Error("Not implemented.");
        }
        function E(e) {
          if (typeof e != "object" || e === null)
            return e;
          var t = Array.isArray(e) ? [] : {};
          for (var i3 in e)
            t[i3] = E(e[i3]);
          return t;
        }
        function y(e, t) {
          return function() {
            e.apply(t, arguments);
          };
        }
        function U(e) {
          return typeof e == "function";
        }
        return o && (f.onmessage = function(e) {
          var t = e.data;
          b.WORKER_ID === void 0 && t && (b.WORKER_ID = t.workerId);
          if (typeof t.input == "string")
            f.postMessage({ workerId: b.WORKER_ID, results: b.parse(t.input, t.config), finished: true });
          else if (f.File && t.input instanceof File || t.input instanceof Object) {
            var i3 = b.parse(t.input, t.config);
            i3 && f.postMessage({ workerId: b.WORKER_ID, results: i3, finished: true });
          }
        }), (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(u.prototype)).constructor = c, (p.prototype = Object.create(p.prototype)).constructor = p, (g.prototype = Object.create(u.prototype)).constructor = g, b;
      });
    }
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
  var APP_NAME = "OC-Addons";
  var APP_AUTHOR = "St\xE9phane TORCHY";
  var APP_DEBUG_STYLE = "background-color:green;color:white";
  var APP_LOG_STYLE = "background-color:black;color:white";
  var APP_WARN_STYLE = "background-color:coral;color:white";
  var APP_INFO_STYLE = "background-color:cyan;color:white";
  var APP_ERROR_STYLE = "background-color:red;color:white";
  var APP_PERF_STYLE = "background-color:blue;color:white";
  var OC_AUTOFUNDED = "auto-financ\xE9";
  var OC_FUNDED = "financ\xE9 par un tiers";
  var OC_OTHER = "autre";
  var OC_STATUS_0 = "r\xE9alis\xE9e";
  var OC_STATUS_1 = "annul\xE9e";
  var OC_STATUS_2 = "annul\xE9e tardivement";
  var OC_STATUS_3_M = "\xE9tudiant absent";
  var OC_STATUS_3_F = "\xE9tudiante absente";
  var OC_MAX_LEVEL = 6;
  var OC_PRICE1 = 30;
  var OC_PRICE2 = 35;
  var OC_PRICE3 = 40;
  var OC_PRICE4 = 45;
  var OC_PRICE5 = 50;
  var OC_PRICE6 = 55;
  var BILL_AUTOFUNDED = 0;
  var BILL_FUNDED = 1;
  var BILL_OTHER = 2;
  var BILL_BILLMODIFICATORS = [{ pathId: 158, path: "158-trouvez-lemploi-qui-vous-correspond", value: 2 }];
  var SESSION_DONE = 0;
  var SESSION_CANCEL = 1;
  var SESSION_CANCEL_LATE = 2;
  var SESSION_STUDENT_AWAY = 3;
  var TYPE_SESSION = 0;
  var TYPE_DEFENSE = 1;
  var TYPE_COACHING = 2;
  var TYPE_MENTORAT = 0;
  var OC_API_SESSION_STATUS_0 = "completed";
  var OC_API_SESSION_STATUS_1 = "canceled";
  var OC_API_SESSION_STATUS_2 = "late canceled";
  var OC_API_SESSION_STATUS_3 = "marked student as absent";
  var OC_DASHBOARDCSSMAINDATASELECTOR = "ol";

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
      console.error(`%cError ${error}`, APP_ERROR_STYLE);
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
      var _t1 = (el.querySelector("a").href || "/").split("/");
      return _t1[_t1.length + idx];
    } catch (e) {
      console.error(`%cError in getkey${e.stack || e}`, APP_ERROR_STYLE);
    }
  };
  var extractDate = function(sWhen) {
    var _t = sWhen.trim().split(" ");
    try {
      var id = dayjs_locale_fr.months.findIndex((m) => m === _t[1]) + 1;
    } catch (e) {
      console.error(`%cError in extractDate${e.stack || e}`, APP_ERROR_STYLE);
    }
    return `${_t[2]}-${id}-${_t[0]}T${_t[4]}`;
  };
  var sleep = function(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  var getFileExtension = function(filename) {
    return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
  };
  var semverCompare = function(a, b) {
    var pa = a.split(".");
    var pb = b.split(".");
    for (var i2 = 0; i2 < 3; i2++) {
      var na = Number(pa[i2]);
      var nb = Number(pb[i2]);
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
    return fetch(_path, { mode: "same-origin" }).then(function(_res) {
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
      const _r2 = getIndex(args);
      _data[_r2] = data;
      return data;
    };
    const get3 = function(...args) {
      if (args.length !== aSizes.length) {
        throw "Wrong matrix dimensions, need " + aSizes.length + ", you provide " + args.length + "!";
      }
      if (checkType(args) === 0) {
        throw "Wrong type for set need one or more int has dimension, check type of!";
      }
      const _r2 = getIndex(args);
      return _data[_r2];
    };
    const del = function(...args) {
      const _r2 = getIndex(args);
      _data[_r2] = void 0;
      return _data[_r2] === void 0;
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
      get: get3,
      del,
      toConsole
    });
  };
  var cyrb53 = function(str, seed = 0) {
    let h1 = 3735928559 ^ seed, h2 = 1103547991 ^ seed;
    for (let i2 = 0, ch; i2 < str.length; i2++) {
      ch = str.charCodeAt(i2);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
  var assert = function(condition, errorMessage, ErrorType = Error) {
    if (!condition)
      throw new ErrorType(errorMessage);
  };

  // src/helpers.js
  var isArray = (_2) => Array.isArray(_2);
  var isEmptyFunction = (_2) => _2.toString().trim().length <= "function(){}".length;
  var debounce = function(fn) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      timeout = window.requestAnimationFrame(function() {
        fn.apply(context, args);
      });
    };
  };
  var pause = function(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  };

  // src/polyfills.js
  HTMLElement.prototype.appendFirst = function(childNode) {
    if (this.firstChild)
      this.insertBefore(childNode, this.firstChild);
    else
      this.appendChild(childNode);
  };

  // src/components.js
  var popupDateSelector = async function(dtFrom2 = null, dtTo2 = null, bMonthAdjustment = true) {
    var sHtml = "";
    sHtml += "<style>";
    sHtml += "form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}";
    sHtml += "form input {background: #fff;border: 1px solid #9c9c9c;}";
    sHtml += "form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}";
    sHtml += "form button:hover {background: gold;}";
    sHtml += "form label {padding: 0.5em 0.5em 0.5em 0;}";
    sHtml += "form input {padding: 0.7em;margin-bottom: 0.5rem;}";
    sHtml += "form input:focus {outline: 3px solid gold;}";
    sHtml += "@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}form label {text-align: right;grid-column: 1 / 2;}form input, form button {grid-column: 2 / 3;}}";
    sHtml += "</style>";
    sHtml += '<form class="form1" action="">';
    sHtml += '<label for="dtFrom" class="date">Date de d\xE9but</label>';
    if (dtFrom2) {
      sHtml += '<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31" value="' + dayjs(dtFrom2).format("YYYY-MM-DD") + '">';
    } else {
      sHtml += '<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
    }
    sHtml += '<label for="dtTo" class="date">Date de fin</label>';
    if (dtFrom2) {
      sHtml += '<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31" value="' + dayjs(dtTo2).format("YYYY-MM-DD") + '">';
    } else {
      sHtml += '<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';
    }
    sHtml += "</form>";
    const { value: formValues } = await Swal.fire({
      title: "<strong>Choix de la p\xE9riode</strong>",
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "top-start",
      grow: "row",
      footer: "Choisissez la p\xE9riode pour la s\xE9lection des temps factur\xE9s",
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
    dtFrom2 = dayjs(formValues[0]);
    dtTo2 = dayjs(formValues[1]);
    await sleep(250);
    return [dtFrom2, dtTo2];
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
  var _Archive = class {
  };
  var Archive = _Archive;
  __publicField(Archive, "tbl_name", "f_archives");
  __publicField(Archive, "add", async function(oArchive) {
    let db = src_default.Cfg.dbase;
    let now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
    let needle = { id: oArchive[0].to.format("YYYYMM"), data: oArchive, created_at: oArchive[0].now };
    console.log(`%cWill create archive for id ${oArchive[0].to.format("YYYYMM")} (YYYYMM)`, APP_DEBUG_STYLE);
    db.get(_Archive.tbl_name).push(JSON.parse(JSON.stringify(needle))).write();
  });
  __publicField(Archive, "exists", function(needle) {
    let db = src_default.Cfg.dbase;
    let _r2 = db.get(_Archive.tbl_name).find({ id: needle }).value();
    if (_r2 === void 0) {
      return false;
    } else {
      return true;
    }
  });
  __publicField(Archive, "get", function(needle) {
    let db = src_default.Cfg.dbase;
    var _r2 = db.get(_Archive.tbl_name).find({ id: needle }).value();
    if (_r2 === void 0) {
      throw Error("Erreur qui ne devrait jamais arriver en Archive.get");
      return false;
    } else {
      console.log(`%cWill use archive for id ${needle} (YYYYMM)`, APP_DEBUG_STYLE);
      return _r2;
    }
  });
  __publicField(Archive, "delete", function(dtFrom2 = null, dtTo2 = null) {
    let db = src_default.Cfg.dbase;
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dtFrom2.format("YYYY-MM-DD");
    }
    if (typeof dtTo2 === "string") {
      dtTo2 = dtTo2.format("YYYY-MM-DD");
    }
    if (dtFrom2 === null && dtTo2 == null) {
      console.log(`%cWanna suppress ALL Archives from DB `, APP_DEBUG_STYLE);
      db.get(_Archive.tbl_name).remove().write();
      return;
    }
    if (dtTo2 == null) {
      db.get(_Archive.tbl_name).remove(function(o) {
        return dayjs(o.id, "YYYYMM").isBefore(dtTo2), "month";
      }).write();
      return;
    }
    if (dtFrom2 == null) {
      db.get(_Archive.tbl_name).remove(function(o) {
        return dayjs(o.id, "YYYYMM").isAfter(dtFrom2, "month");
      }).write();
      return;
    }
    db.get(_Archive.tbl_name).remove(function(o) {
      return dayjs(o.id, "YYYYMM").isBetween(dtFrom2, dtTo2, "month", "[]");
    }).write();
  });
  var archives_default = Archive;

  // src/core.js
  var _Core = class {
  };
  var Core = _Core;
  __publicField(Core, "isInOldMode", function(date) {
    var dtDate = null;
    if (typeof date === "string") {
      dtDate = dayjs(date);
    } else {
      dtDate = date;
    }
    try {
      return dtDate.isBefore(_Core.getOldModeDate());
    } catch (e) {
      throw Error("Erreur qui ne devrait jamais arriver en IsInOldMode (probablement un probleme sur la conversion de la date en objet dayjs:" + e.stack || e);
    }
  });
  __publicField(Core, "getOldModeDate", function() {
    return dayjs("2020-06-01");
  });
  __publicField(Core, "getAppVersion", function() {
    return GM.info.script.version;
  });
  var core_default = Core;

  // src/students_history.js
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
      let bDebug2 = false;
      if (typeof sStudentId === "number") {
        sStudentId = sStudentId.toString(10);
      }
      assert(typeof sStudentId === "string", "You must provide a string.", TypeError);
      const db = src_default.Cfg.dbase;
      if (typeof created2 === "string") {
        created2 = dayjs(created2);
      }
      if (created2 === null) {
        created2 = dayjs();
      }
      assert(created2 instanceof dayjs, "created date must be a string, a dayjs instance or null.", TypeError);
      let me = { id: sStudentId, type: 0 | iType, value: data, date: created2.valueOf(), humanDate: created2.format("YYYY-MM-DDTHH:mm:ssZZ") };
      if (bDebug2 === true)
        console.log(`%cAdd in student history at date ${dayjs(me.date).format("YYYY-MM-DDTHH:mm:ssZZ")} data ${data} with type:${iType} cf const of object`, APP_DEBUG_STYLE);
      return db.get(TBL_NAME).push(JSON.parse(JSON.stringify(me))).write();
    };
    const remove = function(sStudentId, iType = null, dtFrom2 = null) {
      const db = src_default.Cfg.dbase;
      if (sStudentId == null && iType == null && dtFrom2 == null) {
        console.log(`%cRemove all in student history`, APP_DEBUG_STYLE);
        return db.get(TBL_NAME).remove().write();
      }
      if (typeof dtFrom2 === "string") {
        dtFrom2 = dayjs(dtFrom2);
      }
      if (dtFrom2 == null) {
        if (iType == null) {
          console.log(`%cRemove for student id:${sStudentId} history for all type of event`, APP_DEBUG_STYLE);
          return db.get(TBL_NAME).remove({ id: sStudentId }).write();
        } else {
          console.log(`%cRemove for student id:${sStudentId} history with event type:${iType} cf const of object`, APP_DEBUG_STYLE);
          return db.get(TBL_NAME).remove({ id: sStudentId, type: iType }).write();
        }
      }
      console.log(`%cRemove for student id:${sStudentId} history at date ${dtFrom2.format("DD/MM/YYYY")} with event type:${iType} cf const of object`, APP_DEBUG_STYLE);
      return db.get(TBL_NAME).remove({ id: sStudentId, type: iType, date: dtFrom2.valueOf() }).write();
    };
    const find = function(sStudentId, iType, dtFrom2 = null) {
      const bDebug2 = false;
      const db = src_default.Cfg.dbase;
      if (typeof dtFrom2 === "string") {
        dtFrom2 = dayjs(dtFrom2);
      }
      if (dtFrom2 === null) {
        dtFrom2 = dayjs();
      }
      if (bDebug2 === true)
        console.log("%cSearching in student history at date %o ", APP_DEBUG_STYLE, dtFrom2);
      if (bDebug2 === true)
        console.log(`%cSearching in student history at date ${dtFrom2.format("DD/MM/YYYY")} any data with type:${iType} cf const of object`, APP_DEBUG_STYLE);
      var _iBaseDay = +dtFrom2.valueOf();
      var _r2 = db.get(TBL_NAME).filter((o) => o.id === sStudentId && o.type & iType).map((i2) => i2.date - _iBaseDay).filter((i2) => i2 >= 0).value();
      if (_r2.length == 0) {
        if (bDebug2 === true)
          console.log(`%cThere is no data in student history at date ${dtFrom2.format("DD/MM/YYYY")} with type:${iType} cf const of object`, APP_DEBUG_STYLE);
        return void 0;
      }
      const min = (arr) => Math.min(...arr);
      let _needle = _iBaseDay + min(_r2);
      return db.get(TBL_NAME).filter((o) => o.id === sStudentId && o.type & iType && o.date == _needle).value()[0];
    };
    const isFunding = function(data) {
      return is(data, TYPE_FUNDING);
    };
    const isPath = function(data) {
      return is(data, TYPE_PATH);
    };
    const is = function(data, type) {
      return data.type & type;
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
  var StudentHistory = fStudentHistory();
  var students_history_default = StudentHistory;

  // src/api.openclassrooms.js
  var fApi = function() {
    let _header = {};
    let _user = "0";
    const VERBOSE = true;
    const API_BASE_URL = "https://api.openclassrooms.com";
    const LIFE_CYCLE_STATUS_PENDING = "pending";
    const LIFE_CYCLE_STATUS_CANCELED = "canceled";
    const LIFE_CYCLE_STATUS_COMPLETED = "completed";
    const LIFE_CYCLE_STATUS_LATE_CANCELED = "late canceled";
    const LIFE_CYCLE_STATUS_ABSENT = "marked student as absent";
    const _setUser = async function() {
      let _r2 = await getMe();
      _r2 = JSON.parse(_r2);
      _user = _r2.id;
      return _user;
    };
    const _checkSupport = async function() {
      if (_header.length == 0) {
        throw new Error("_header is empty, no xhr have been trapped so could't do some api request");
      }
    };
    const getMe = async function() {
      const API_ME_URL = API_BASE_URL + "/me";
      let _r2 = await _fetchGet(API_ME_URL);
      return _r2;
    };
    const _getLimit = function(iFrom, iTo) {
      return { "Range": `items=${iFrom}-${iTo}` };
    };
    const getPendingSessionAfter = async (dtDate = dayjs(), iFrom = 0, iTo = 19) => await _getSessionOnDate("AFTER", dtDate, [LIFE_CYCLE_STATUS_PENDING], iFrom, iTo);
    const getPendingSessionBefore = async (dtDate = dayjs(), iFrom = 0, iTo = 19) => await _getSessionOnDate("BEFORE", dtDate, [LIFE_CYCLE_STATUS_PENDING], iFrom, iTo);
    const getHistorySession = async (aFilter, iFrom = 0, iTo = 19) => await _getSession(aFilter, iFrom, iTo);
    const _getSessionOnDate = async function(sPeriod = "BEFORE", dtDate, aFilter = [
      LIFE_CYCLE_STATUS_CANCELED,
      LIFE_CYCLE_STATUS_COMPLETED,
      LIFE_CYCLE_STATUS_LATE_CANCELED,
      LIFE_CYCLE_STATUS_ABSENT
    ], iFrom = 0, iTo = 19) {
      bDebug = true;
      if (typeof dtDate === "string") {
        dtDate = dayjs(dtDate);
      }
      assert(isArray(aFilter) === true, "You must provide an array as param aFilter.", TypeError);
      assert(dtDate instanceof dayjs === true, "date must be a string or a dayjs object.", TypeError);
      let sFilter = aFilter.join(",");
      let sDate = encodeURIComponent(dtDate.format("YYYY-MM-DDTHH:MM:ss[Z]"));
      sFilter = encodeURIComponent(sFilter);
      let API_URL = "";
      if (_user == 0) {
        await _setUser();
      }
      if (sPeriod === "AFTER") {
        API_URL = `${API_BASE_URL}/users/${_user}/sessions?actor=expert&after=${sDate}&life-cycle-status=${sFilter}`;
        console.log("URL IS %s", API_URL);
      } else {
        API_URL = `${API_BASE_URL}/users/${_user}/sessions?actor=expert&before=${sDate}&life-cycle-status=${sFilter}`;
        console.log("URL IS %s", API_URL);
      }
      let oLimit = _getLimit(iFrom, iTo);
      if (bDebug) {
        console.log("%c_getSessionOnDate url to call is:%s , params are %o", APP_DEBUG_STYLE, API_URL, oLimit);
      }
      let _r2 = await xGet(API_URL, _getLimit(iFrom, iTo));
      return _r2;
    };
    const _getSession = async function(aFilter = [], iFrom = 0, iTo = 19) {
      bDebug = true;
      assert(isArray(aFilter) === true, "You must provide an array as param aFilter.", TypeError);
      if (aFilter.length == 0) {
        aFilter = [
          LIFE_CYCLE_STATUS_CANCELED,
          LIFE_CYCLE_STATUS_COMPLETED,
          LIFE_CYCLE_STATUS_LATE_CANCELED,
          LIFE_CYCLE_STATUS_ABSENT
        ];
      }
      let sFilter = aFilter.join(",");
      sFilter = encodeURIComponent(sFilter);
      if (_user == 0) {
        await _setUser();
      }
      const API_URL = `${API_BASE_URL}/users/${_user}/sessions?actor=expert&life-cycle-status=${sFilter}`;
      let oLimit = _getLimit(iFrom, iTo);
      if (bDebug) {
        console.log("%cUrl to call is:%o , params are %o", APP_DEBUG_STYLE, API_URL, oLimit);
      }
      let _r2 = await xGet(API_URL, oLimit);
      if (_r2 === null || _r2 === void 0) {
        console.error("%cAPI have a problem returned value %o is null|undefined", APP_ERROR_STYLE, _r2);
        throw new Error(`Request:${API_BASE_URL}/users/${_user}/sessions?actor=expert&life-cycle-status=${sFilter} have a problem`);
      }
      if (_r2.errors) {
        console.log("%cAPI return an error %s", APP_ERROR_STYLE, _r2.errors.message);
      }
      return _r2;
    };
    const getUser = async function(iUser) {
      const API_USER = `${API_BASE_URL}/users/${iUser}`;
      let _r2 = await xGet(API_USER);
      return _r2;
    };
    const getUserFollowedPath = async function(iUser) {
      await _checkSupport();
      const API_URL = `${API_BASE_URL}/users/${iUser}/paths/followed-path`;
      let _r2 = await xGet(API_URL);
      return _r2;
    };
    const getUserPath = async function(iUser) {
      const API_USER_PATHS = `${API_BASE_URL}/users/${iUser}/paths`;
      let _r2 = await xGet(API_USER_PATHS);
      return _r2;
    };
    const getUserStudents = async function(iUser = null) {
      if (iUser === null) {
        let _r3 = await getMe();
        _r3 = JSON.parse(_r3);
        iUser = _r3.id;
      }
      const API_REQUEST = `${API_BASE_URL}/mentors/${iUser}/students`;
      let _r2;
      try {
        _r2 = await xGet(API_REQUEST);
      } catch (e) {
        console.error("%c[getUserStudents()] Trapped error %o", APP_ERROR_STYLE, e);
      } finally {
        return _r2;
      }
    };
    const bookStudent = async function(iUser = null, iProjectId, iStudentId, sDate) {
      if (iUser === null) {
        let _r3 = await getMe();
        _r3 = JSON.parse(_r3);
        iUser = _r3.id;
      }
      const API_REQUEST = `${API_BASE_URL}/mentoring-sessions`;
      const mData = { "mentorId": iUser, "projectId": iProjectId, "studentId": iStudentId, "sessionDate": sDate };
      let _r2 = await xPost(API_REQUEST, {}, mData);
      if (typeof _r2 === "string") {
        const data2 = JSON.parse(_r2);
        if ("errors" in data2 && data2.errors.length == 1 && data2.errors[0].code === "SESSION_ALREADY_EXISTS") {
          const e = data2.errors[0];
          console.error("%c[Api.bookStudent()] call bookStudent error[%s] :%s ", APP_ERROR_STYLE, e.code, e.message);
        } else {
          console.log("%c[Api.bookStudent()] return an unknow value :%o", APP_ERROR_STYLE, data2);
        }
        return data2;
      }
      const data = await _r2.json();
      console.log("%c[Api.bookStudent()] return :%o ", APP_DEBUG_STYLE, data);
      return;
    };
    const xGet = async function(sUrl, oHeader = {}) {
      await _checkSupport();
      let _r2 = await _fetchGet(sUrl, oHeader);
      if (typeof _r2 === "string") {
        let _t = JSON.parse(_r2);
        if (typeof _t.errors !== "undefined") {
          const e = _t.errors.reduce((acc, v) => `${acc}{v.message}`);
          console.error("%c[Api.xGet()] call _fetchGet error :%s ", APP_ERROR_STYLE, e.message);
          throw new Error(`[Api.xGet()] Irrecoverable error :' ${e.message}'`);
        }
        return _r2;
      }
      throw new Error(`[Api.xGet()] Irrecoverable error result is not a string but a :' ${typeof _r2}'`);
      return;
    };
    const xPost = async function(sUrl, oHeader = {}, mData = {}, bThrowError = true) {
      await _checkSupport();
      let _r2 = await _fetchPost(sUrl, oHeader, mData);
      console.log("%c[Api.xPost()] call _fetchPost with url :%s and with data:%o", APP_DEBUG_STYLE, sUrl, mData);
      if (typeof _r2 === "string") {
        let _t = JSON.parse(_r2);
        if (typeof _t.errors !== "undefined") {
          if (_t.errors.length == 1 && _t.errors[0].code === "SESSION_ALREADY_EXISTS") {
            return _r2;
          }
          if (_t.errors.length == 1 && _t.errors[0].code === "TOO_LOW_ERROR" && _t.errors[0].field === "sessionDate") {
            return _r2;
          }
          console.error("%c[Api.xPost()] raw list of error :%o ", APP_ERROR_STYLE, _t);
          const e = _t.errors.reduce((acc, v) => `${acc}{v.message}`);
          console.error("%c[Api.xPost()] call _fetchPost error :%s ", APP_ERROR_STYLE, e.message);
          if (bThrowError === true) {
            throw new Error(`[Api.xPost()] Irrecoverable error :' ${e.message}'`);
          }
          return;
        }
        return _r2;
      }
      if (bThrowError === true) {
        throw new Error(`[Api.xPost()] Irrecoverable error result is not a string but a :' ${typeof _r2}'`);
      }
      return;
    };
    const forge = function(idUser) {
      _user = idUser;
    };
    const _containsEncodedComponents = function(x) {
      return decodeURI(x) !== decodeURIComponent(x);
    };
    const _fetchGet = async function(sUrl = "", oHeader = {}, sFormat = "json", sPath = "", bAll = true) {
      let mHeader = Object.assign({ "User-Agent": "Mozilla/5.0" }, _header, oHeader);
      if (sFormat.toLowerCase() === "json") {
        const response = await GMC.XHR({
          method: "GET",
          url: sUrl,
          responseType: "application/json",
          headers: mHeader
        }).catch((error) => {
          console.error("%c[_fetchGet()]Error is %o", APP_ERROR_STYLE, error);
        });
        return response.responseText;
      }
      if (sFormat.toLowerCase === "html") {
        const response = await GMC.XHR({
          method: "GET",
          url: sUrl,
          responseType: "application/json",
          headers: mHeader
        }).catch((error) => {
          console.error("%c[Api_fetchGet()]Error is %o", APP_ERROR_STYLE, error);
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
      }
    };
    const _fetchPost = async function(sUrl = "", oHeader = {}, oData = {}) {
      console.info(`%c[Api._fetchPost()] waiting return from : ${sUrl}`, APP_DEBUG_STYLE, sUrl);
      let mHeader = Object.assign({ "User-Agent": "Mozilla/5.0" }, _header, oHeader);
      console.log("%c[Api._fetchPost()]final header is %o", APP_DEBUG_STYLE, mHeader);
      console.log("%c[Api._fetchPost()]data is %o", APP_DEBUG_STYLE, oData);
      const response = await GMC.XHR({
        method: "POST",
        url: sUrl,
        responseType: "application/json",
        headers: mHeader,
        data: JSON.stringify(oData)
      }).catch((error) => {
        console.error("%c[Api_fetchPost()]Error is %o", APP_ERROR_STYLE, error);
      });
      return response.responseText;
    };
    const _bootstrap = function() {
      const VERBOSE2 = false;
      const FN_VERBOSE_STYLE = "color:DarkSalmon;background-color:AliceBlue;";
      var open = window.XMLHttpRequest.prototype.open, send = window.XMLHttpRequest.prototype.send, setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
      var openReplacement = function(method, url, async, user, password) {
        if (VERBOSE2 === true)
          console.log("%cmethod %o url:%o, async:%o, user %o, password:%o", FN_VERBOSE_STYLE, method, url, async, user, password);
        this._url = url;
        this._requestHeaders = {};
        this._knox = [];
        return open.apply(this, arguments);
      };
      var onReadyStateChangeReplacement = function() {
        if (VERBOSE2 === true)
          console.log("%cReady state changed to: %o", FN_VERBOSE_STYLE, this.readyState);
        if (this.readyState === 4 && this.status && this.status >= 200 && this.status < 300) {
          if (this._url.match(/^https:\/\/api.openclassrooms.com/g)) {
            if (VERBOSE2 === true)
              console.log("%cOPENCLASSROOMS API", FN_VERBOSE_STYLE);
            for (var i2 in this._knox) {
              _header[this._knox[i2].key] = this._knox[i2].value;
            }
            if (VERBOSE2 === true)
              console.log("%c _header is %o", FN_VERBOSE_STYLE, _header);
            if (VERBOSE2 === true) {
              if (_containsEncodedComponents(this._url)) {
                console.log("%cDECODED URL:%s", FN_VERBOSE_STYLE, decodeURIComponent(this._url));
              } else {
                console.log("%c DECODED URL:%s", FN_VERBOSE_STYLE, decodeURI(this._url));
              }
            }
          }
          if (VERBOSE2 === true)
            console.log("%cResponse is :%o", FN_VERBOSE_STYLE, this.response);
        }
        if (this._onreadystatechange) {
          return this._onreadystatechange.apply(this, arguments);
        }
      };
      var sendReplacement = function(data) {
        if (VERBOSE2 === true)
          console.log("%csendReplacement(%o)", FN_VERBOSE_STYLE, data);
        if (this.onreadystatechange) {
          this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
      };
      var setRequestHeaderReplacement = function(header, value) {
        if (this._url.match(/^https:\/\/api.openclassrooms.com/g)) {
          this._knox.push({ key: header, value });
        }
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
      };
      window.XMLHttpRequest.prototype.open = openReplacement;
      window.XMLHttpRequest.prototype.send = sendReplacement;
      window.XMLHttpRequest.prototype.setRequestHeader = setRequestHeaderReplacement;
    };
    _bootstrap();
    return Object.freeze({
      bookStudent,
      forge,
      getPendingSessionAfter,
      getPendingSessionBefore,
      getHistorySession,
      getUserStudents,
      getUser,
      getUserFollowedPath,
      getUserPath,
      getMe,
      xGet,
      xPost
    });
  };
  var Api = fApi();
  var api_openclassrooms_default = Api;

  // src/vendor/tcomb/tcomb.neutral.js
  var __commonJS2 = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_isFunction = __commonJS2({
    "src/lib/isFunction.js"(exports, module) {
      module.exports = function isFunction(x) {
        return typeof x === "function";
      };
    }
  });
  var require_isNil = __commonJS2({
    "src/lib/isNil.js"(exports, module) {
      module.exports = function isNil(x) {
        return x === null || x === void 0;
      };
    }
  });
  var require_fail = __commonJS2({
    "src/lib/fail.js"(exports, module) {
      module.exports = function fail(message) {
        throw new TypeError("[tcomb] " + message);
      };
    }
  });
  var require_getFunctionName = __commonJS2({
    "src/lib/getFunctionName.js"(exports, module) {
      module.exports = function getFunctionName(f) {
        return f.displayName || f.name || "<function" + f.length + ">";
      };
    }
  });
  var require_stringify = __commonJS2({
    "src/lib/stringify.js"(exports, module) {
      var getFunctionName = require_getFunctionName();
      function replacer(key, value) {
        if (typeof value === "function") {
          return getFunctionName(value);
        }
        return value;
      }
      module.exports = function stringify(x) {
        try {
          return JSON.stringify(x, replacer, 2);
        } catch (e) {
          return String(x);
        }
      };
    }
  });
  var require_assert = __commonJS2({
    "src/lib/assert.js"(exports, module) {
      var isFunction = require_isFunction();
      var isNil = require_isNil();
      var fail = require_fail();
      var stringify = require_stringify();
      function assert2(guard, message) {
        if (guard !== true) {
          if (isFunction(message)) {
            message = message();
          } else if (isNil(message)) {
            message = 'Assert failed (turn on "Pause on exceptions" in your Source panel)';
          }
          assert2.fail(message);
        }
      }
      assert2.fail = fail;
      assert2.stringify = stringify;
      module.exports = assert2;
    }
  });
  var require_isString = __commonJS2({
    "src/lib/isString.js"(exports, module) {
      module.exports = function isString(x) {
        return typeof x === "string";
      };
    }
  });
  var require_isArray = __commonJS2({
    "src/lib/isArray.js"(exports, module) {
      module.exports = function isArray2(x) {
        return Array.isArray ? Array.isArray(x) : x instanceof Array;
      };
    }
  });
  var require_isObject = __commonJS2({
    "src/lib/isObject.js"(exports, module) {
      var isNil = require_isNil();
      var isArray2 = require_isArray();
      module.exports = function isObject(x) {
        return !isNil(x) && typeof x === "object" && !isArray2(x);
      };
    }
  });
  var require_isType = __commonJS2({
    "src/lib/isType.js"(exports, module) {
      var isFunction = require_isFunction();
      var isObject = require_isObject();
      module.exports = function isType(x) {
        return isFunction(x) && isObject(x.meta);
      };
    }
  });
  var require_getTypeName = __commonJS2({
    "src/lib/getTypeName.js"(exports, module) {
      var isType = require_isType();
      var getFunctionName = require_getFunctionName();
      module.exports = function getTypeName(ctor) {
        if (isType(ctor)) {
          return ctor.displayName;
        }
        return getFunctionName(ctor);
      };
    }
  });
  var require_forbidNewOperator = __commonJS2({
    "src/lib/forbidNewOperator.js"(exports, module) {
      var assert2 = require_assert();
      var getTypeName = require_getTypeName();
      module.exports = function forbidNewOperator(x, type) {
        assert2(!(x instanceof type), function() {
          return "Cannot use the new operator to instantiate the type " + getTypeName(type);
        });
      };
    }
  });
  var require_irreducible = __commonJS2({
    "src/lib/irreducible.js"(exports, module) {
      var assert2 = require_assert();
      var isString = require_isString();
      var isFunction = require_isFunction();
      var forbidNewOperator = require_forbidNewOperator();
      module.exports = function irreducible(name, predicate) {
        if (true) {
          assert2(isString(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to irreducible(name, predicate) (expected a string)";
          });
          assert2(isFunction(predicate), "Invalid argument predicate " + assert2.stringify(predicate) + " supplied to irreducible(name, predicate) (expected a function)");
        }
        function Irreducible(value, path) {
          if (true) {
            forbidNewOperator(this, Irreducible);
            path = path || [name];
            assert2(predicate(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/");
            });
          }
          return value;
        }
        Irreducible.meta = {
          kind: "irreducible",
          name,
          predicate,
          identity: true
        };
        Irreducible.displayName = name;
        Irreducible.is = predicate;
        return Irreducible;
      };
    }
  });
  var require_Any = __commonJS2({
    "src/lib/Any.js"(exports, module) {
      var irreducible = require_irreducible();
      module.exports = irreducible("Any", function() {
        return true;
      });
    }
  });
  var require_Array = __commonJS2({
    "src/lib/Array.js"(exports, module) {
      var irreducible = require_irreducible();
      var isArray2 = require_isArray();
      module.exports = irreducible("Array", isArray2);
    }
  });
  var require_isBoolean = __commonJS2({
    "src/lib/isBoolean.js"(exports, module) {
      module.exports = function isBoolean(x) {
        return x === true || x === false;
      };
    }
  });
  var require_Boolean = __commonJS2({
    "src/lib/Boolean.js"(exports, module) {
      var irreducible = require_irreducible();
      var isBoolean = require_isBoolean();
      module.exports = irreducible("Boolean", isBoolean);
    }
  });
  var require_Date = __commonJS2({
    "src/lib/Date.js"(exports, module) {
      var irreducible = require_irreducible();
      module.exports = irreducible("Date", function(x) {
        return x instanceof Date;
      });
    }
  });
  var require_Error = __commonJS2({
    "src/lib/Error.js"(exports, module) {
      var irreducible = require_irreducible();
      module.exports = irreducible("Error", function(x) {
        return x instanceof Error;
      });
    }
  });
  var require_Function = __commonJS2({
    "src/lib/Function.js"(exports, module) {
      var irreducible = require_irreducible();
      var isFunction = require_isFunction();
      module.exports = irreducible("Function", isFunction);
    }
  });
  var require_Nil = __commonJS2({
    "src/lib/Nil.js"(exports, module) {
      var irreducible = require_irreducible();
      var isNil = require_isNil();
      module.exports = irreducible("Nil", isNil);
    }
  });
  var require_isNumber = __commonJS2({
    "src/lib/isNumber.js"(exports, module) {
      module.exports = function isNumber(x) {
        return typeof x === "number" && isFinite(x) && !isNaN(x);
      };
    }
  });
  var require_Number = __commonJS2({
    "src/lib/Number.js"(exports, module) {
      var irreducible = require_irreducible();
      var isNumber = require_isNumber();
      module.exports = irreducible("Number", isNumber);
    }
  });
  var require_isTypeName = __commonJS2({
    "src/lib/isTypeName.js"(exports, module) {
      var isNil = require_isNil();
      var isString = require_isString();
      module.exports = function isTypeName(name) {
        return isNil(name) || isString(name);
      };
    }
  });
  var require_isIdentity = __commonJS2({
    "src/lib/isIdentity.js"(exports, module) {
      var assert2 = require_assert();
      var Boolean = require_Boolean();
      var isType = require_isType();
      var getTypeName = require_getTypeName();
      module.exports = function isIdentity(type) {
        if (isType(type)) {
          if (true) {
            assert2(Boolean.is(type.meta.identity), function() {
              return "Invalid meta identity " + assert2.stringify(type.meta.identity) + " supplied to type " + getTypeName(type);
            });
          }
          return type.meta.identity;
        }
        return true;
      };
    }
  });
  var require_create = __commonJS2({
    "src/lib/create.js"(exports, module) {
      var isType = require_isType();
      var getFunctionName = require_getFunctionName();
      var assert2 = require_assert();
      var stringify = require_stringify();
      module.exports = function create(type, value, path) {
        if (isType(type)) {
          return !type.meta.identity && typeof value === "object" && value !== null ? new type(value, path) : type(value, path);
        }
        if (true) {
          path = path || [getFunctionName(type)];
          assert2(value instanceof type, function() {
            return "Invalid value " + stringify(value) + " supplied to " + path.join("/");
          });
        }
        return value;
      };
    }
  });
  var require_is = __commonJS2({
    "src/lib/is.js"(exports, module) {
      var isType = require_isType();
      module.exports = function is(x, type) {
        if (isType(type)) {
          return type.is(x);
        }
        return x instanceof type;
      };
    }
  });
  var require_refinement = __commonJS2({
    "src/lib/refinement.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var forbidNewOperator = require_forbidNewOperator();
      var isIdentity = require_isIdentity();
      var create = require_create();
      var is = require_is();
      var getTypeName = require_getTypeName();
      var getFunctionName = require_getFunctionName();
      function getDefaultName(type, predicate) {
        return "{" + getTypeName(type) + " | " + getFunctionName(predicate) + "}";
      }
      function refinement(type, predicate, name) {
        if (true) {
          assert2(isFunction(type), function() {
            return "Invalid argument type " + assert2.stringify(type) + " supplied to refinement(type, predicate, [name]) combinator (expected a type)";
          });
          assert2(isFunction(predicate), function() {
            return "Invalid argument predicate supplied to refinement(type, predicate, [name]) combinator (expected a function)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to refinement(type, predicate, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(type, predicate);
        var identity = isIdentity(type);
        function Refinement(value, path) {
          if (true) {
            if (identity) {
              forbidNewOperator(this, Refinement);
            }
            path = path || [displayName];
          }
          var x = create(type, value, path);
          if (true) {
            assert2(predicate(x), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/");
            });
          }
          return x;
        }
        Refinement.meta = {
          kind: "subtype",
          type,
          predicate,
          name,
          identity
        };
        Refinement.displayName = displayName;
        Refinement.is = function(x) {
          return is(x, type) && predicate(x);
        };
        Refinement.update = function(instance, patch) {
          return Refinement(assert2.update(instance, patch));
        };
        return Refinement;
      }
      refinement.getDefaultName = getDefaultName;
      module.exports = refinement;
    }
  });
  var require_Integer = __commonJS2({
    "src/lib/Integer.js"(exports, module) {
      var refinement = require_refinement();
      var Number2 = require_Number();
      module.exports = refinement(Number2, function(x) {
        return x % 1 === 0;
      }, "Integer");
    }
  });
  var require_Object = __commonJS2({
    "src/lib/Object.js"(exports, module) {
      var irreducible = require_irreducible();
      var isObject = require_isObject();
      module.exports = irreducible("Object", isObject);
    }
  });
  var require_RegExp = __commonJS2({
    "src/lib/RegExp.js"(exports, module) {
      var irreducible = require_irreducible();
      module.exports = irreducible("RegExp", function(x) {
        return x instanceof RegExp;
      });
    }
  });
  var require_String = __commonJS2({
    "src/lib/String.js"(exports, module) {
      var irreducible = require_irreducible();
      var isString = require_isString();
      module.exports = irreducible("String", isString);
    }
  });
  var require_Type = __commonJS2({
    "src/lib/Type.js"(exports, module) {
      var irreducible = require_irreducible();
      var isType = require_isType();
      module.exports = irreducible("Type", isType);
    }
  });
  var require_dict = __commonJS2({
    "src/lib/dict.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var getTypeName = require_getTypeName();
      var isIdentity = require_isIdentity();
      var isObject = require_isObject();
      var create = require_create();
      var is = require_is();
      function getDefaultName(domain, codomain) {
        return "{[key: " + getTypeName(domain) + "]: " + getTypeName(codomain) + "}";
      }
      function dict(domain, codomain, name) {
        if (true) {
          assert2(isFunction(domain), function() {
            return "Invalid argument domain " + assert2.stringify(domain) + " supplied to dict(domain, codomain, [name]) combinator (expected a type)";
          });
          assert2(isFunction(codomain), function() {
            return "Invalid argument codomain " + assert2.stringify(codomain) + " supplied to dict(domain, codomain, [name]) combinator (expected a type)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to dict(domain, codomain, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(domain, codomain);
        var domainNameCache = getTypeName(domain);
        var codomainNameCache = getTypeName(codomain);
        var identity = isIdentity(domain) && isIdentity(codomain);
        function Dict(value, path) {
          if (false) {
            if (identity) {
              return value;
            }
          }
          if (true) {
            path = path || [displayName];
            assert2(isObject(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/");
            });
          }
          var idempotent = true;
          var ret = {};
          for (var k in value) {
            if (value.hasOwnProperty(k)) {
              k = create(domain, k, true ? path.concat(domainNameCache) : null);
              var actual = value[k];
              var instance = create(codomain, actual, true ? path.concat(k + ": " + codomainNameCache) : null);
              idempotent = idempotent && actual === instance;
              ret[k] = instance;
            }
          }
          if (idempotent) {
            ret = value;
          }
          if (true) {
            Object.freeze(ret);
          }
          return ret;
        }
        Dict.meta = {
          kind: "dict",
          domain,
          codomain,
          name,
          identity
        };
        Dict.displayName = displayName;
        Dict.is = function(x) {
          if (!isObject(x)) {
            return false;
          }
          for (var k in x) {
            if (x.hasOwnProperty(k)) {
              if (!is(k, domain) || !is(x[k], codomain)) {
                return false;
              }
            }
          }
          return true;
        };
        Dict.update = function(instance, patch) {
          return Dict(assert2.update(instance, patch));
        };
        return Dict;
      }
      dict.getDefaultName = getDefaultName;
      module.exports = dict;
    }
  });
  var require_mixin = __commonJS2({
    "src/lib/mixin.js"(exports, module) {
      var isNil = require_isNil();
      var assert2 = require_assert();
      module.exports = function mixin(target, source, overwrite) {
        if (isNil(source)) {
          return target;
        }
        for (var k in source) {
          if (source.hasOwnProperty(k)) {
            if (overwrite !== true) {
              if (true) {
                assert2(!target.hasOwnProperty(k) || target[k] === source[k], function() {
                  return 'Invalid call to mixin(target, source, [overwrite]): cannot overwrite property "' + k + '" of target object';
                });
              }
            }
            target[k] = source[k];
          }
        }
        return target;
      };
    }
  });
  var require_isUnion = __commonJS2({
    "src/lib/isUnion.js"(exports, module) {
      var isType = require_isType();
      module.exports = function isUnion(x) {
        return isType(x) && x.meta.kind === "union";
      };
    }
  });
  var require_declare = __commonJS2({
    "src/lib/declare.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isType = require_isType();
      var isNil = require_isNil();
      var mixin = require_mixin();
      var getTypeName = require_getTypeName();
      var isUnion = require_isUnion();
      var nextDeclareUniqueId = 1;
      module.exports = function declare(name) {
        if (true) {
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + name + " supplied to declare([name]) (expected a string)";
          });
        }
        var type;
        function Declare(value, path) {
          if (true) {
            assert2(!isNil(type), function() {
              return "Type declared but not defined, don't forget to call .define on every declared type";
            });
            if (isUnion(type)) {
              assert2(type.dispatch === Declare.dispatch, function() {
                return "Please define the custom " + name + ".dispatch function before calling " + name + ".define()";
              });
            }
          }
          return type(value, path);
        }
        Declare.define = function(spec) {
          if (true) {
            assert2(isType(spec), function() {
              return "Invalid argument type " + assert2.stringify(spec) + " supplied to define(type) (expected a type)";
            });
            assert2(isNil(type), function() {
              return "Declare.define(type) can only be invoked once";
            });
          }
          if (isUnion(spec) && Declare.hasOwnProperty("dispatch")) {
            spec.dispatch = Declare.dispatch;
          }
          type = spec;
          mixin(Declare, type, true);
          if (name) {
            type.displayName = Declare.displayName = name;
            Declare.meta.name = name;
          }
          Declare.meta.identity = type.meta.identity;
          Declare.prototype = type.prototype;
          return Declare;
        };
        Declare.displayName = name || getTypeName(Declare) + "$" + nextDeclareUniqueId++;
        Declare.meta = { identity: false };
        Declare.prototype = null;
        return Declare;
      };
    }
  });
  var require_enums = __commonJS2({
    "src/lib/enums.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var forbidNewOperator = require_forbidNewOperator();
      var isNumber = require_isNumber();
      var isString = require_isString();
      var isObject = require_isObject();
      function getDefaultName(map) {
        return Object.keys(map).map(function(k) {
          return assert2.stringify(k);
        }).join(" | ");
      }
      function enums(map, name) {
        if (true) {
          assert2(isObject(map), function() {
            return "Invalid argument map " + assert2.stringify(map) + " supplied to enums(map, [name]) combinator (expected a dictionary of String -> String | Number)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to enums(map, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(map);
        function Enums(value, path) {
          if (true) {
            forbidNewOperator(this, Enums);
            path = path || [displayName];
            assert2(Enums.is(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/") + " (expected one of " + assert2.stringify(Object.keys(map)) + ")";
            });
          }
          return value;
        }
        Enums.meta = {
          kind: "enums",
          map,
          name,
          identity: true
        };
        Enums.displayName = displayName;
        Enums.is = function(x) {
          return (isString(x) || isNumber(x)) && map.hasOwnProperty(x);
        };
        return Enums;
      }
      enums.of = function(keys, name) {
        keys = isString(keys) ? keys.split(" ") : keys;
        var value = {};
        keys.forEach(function(k) {
          value[k] = k;
        });
        return enums(value, name);
      };
      enums.getDefaultName = getDefaultName;
      module.exports = enums;
    }
  });
  var require_list = __commonJS2({
    "src/lib/list.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var getTypeName = require_getTypeName();
      var isIdentity = require_isIdentity();
      var create = require_create();
      var is = require_is();
      var isArray2 = require_isArray();
      function getDefaultName(type) {
        return "Array<" + getTypeName(type) + ">";
      }
      function list(type, name) {
        if (true) {
          assert2(isFunction(type), function() {
            return "Invalid argument type " + assert2.stringify(type) + " supplied to list(type, [name]) combinator (expected a type)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to list(type, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(type);
        var typeNameCache = getTypeName(type);
        var identity = isIdentity(type);
        function List2(value, path) {
          if (false) {
            if (identity) {
              return value;
            }
          }
          if (true) {
            path = path || [displayName];
            assert2(isArray2(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/") + " (expected an array of " + typeNameCache + ")";
            });
          }
          var idempotent = true;
          var ret = [];
          for (var i2 = 0, len = value.length; i2 < len; i2++) {
            var actual = value[i2];
            var instance = create(type, actual, true ? path.concat(i2 + ": " + typeNameCache) : null);
            idempotent = idempotent && actual === instance;
            ret.push(instance);
          }
          if (idempotent) {
            ret = value;
          }
          if (true) {
            Object.freeze(ret);
          }
          return ret;
        }
        List2.meta = {
          kind: "list",
          type,
          name,
          identity
        };
        List2.displayName = displayName;
        List2.is = function(x) {
          return isArray2(x) && x.every(function(e) {
            return is(e, type);
          });
        };
        List2.update = function(instance, patch) {
          return List2(assert2.update(instance, patch));
        };
        return List2;
      }
      list.getDefaultName = getDefaultName;
      module.exports = list;
    }
  });
  var require_isMaybe = __commonJS2({
    "src/lib/isMaybe.js"(exports, module) {
      var isType = require_isType();
      module.exports = function isMaybe(x) {
        return isType(x) && x.meta.kind === "maybe";
      };
    }
  });
  var require_maybe = __commonJS2({
    "src/lib/maybe.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var isMaybe = require_isMaybe();
      var isIdentity = require_isIdentity();
      var Any = require_Any();
      var create = require_create();
      var Nil = require_Nil();
      var forbidNewOperator = require_forbidNewOperator();
      var is = require_is();
      var getTypeName = require_getTypeName();
      function getDefaultName(type) {
        return "?" + getTypeName(type);
      }
      function maybe(type, name) {
        if (isMaybe(type) || type === Any || type === Nil) {
          return type;
        }
        if (true) {
          assert2(isFunction(type), function() {
            return "Invalid argument type " + assert2.stringify(type) + " supplied to maybe(type, [name]) combinator (expected a type)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to maybe(type, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(type);
        var identity = isIdentity(type);
        function Maybe(value, path) {
          if (true) {
            if (identity) {
              forbidNewOperator(this, Maybe);
            }
          }
          return Nil.is(value) ? value : create(type, value, path);
        }
        Maybe.meta = {
          kind: "maybe",
          type,
          name,
          identity
        };
        Maybe.displayName = displayName;
        Maybe.is = function(x) {
          return Nil.is(x) || is(x, type);
        };
        return Maybe;
      }
      maybe.getDefaultName = getDefaultName;
      module.exports = maybe;
    }
  });
  var require_getDefaultInterfaceName = __commonJS2({
    "src/lib/getDefaultInterfaceName.js"(exports, module) {
      var getTypeName = require_getTypeName();
      function getDefaultInterfaceName(props) {
        return "{" + Object.keys(props).map(function(prop) {
          return prop + ": " + getTypeName(props[prop]);
        }).join(", ") + "}";
      }
      module.exports = getDefaultInterfaceName;
    }
  });
  var require_isStruct = __commonJS2({
    "src/lib/isStruct.js"(exports, module) {
      var isType = require_isType();
      module.exports = function isStruct(x) {
        return isType(x) && x.meta.kind === "struct";
      };
    }
  });
  var require_isInterface = __commonJS2({
    "src/lib/isInterface.js"(exports, module) {
      var isType = require_isType();
      module.exports = function isInterface(x) {
        return isType(x) && x.meta.kind === "interface";
      };
    }
  });
  var require_decompose = __commonJS2({
    "src/lib/decompose.js"(exports, module) {
      var isType = require_isType();
      function isRefinement(type) {
        return isType(type) && type.meta.kind === "subtype";
      }
      function getPredicates(type) {
        return isRefinement(type) ? [type.meta.predicate].concat(getPredicates(type.meta.type)) : [];
      }
      function getUnrefinedType(type) {
        return isRefinement(type) ? getUnrefinedType(type.meta.type) : type;
      }
      function decompose(type) {
        return {
          predicates: getPredicates(type),
          unrefinedType: getUnrefinedType(type)
        };
      }
      module.exports = decompose;
    }
  });
  var require_extend = __commonJS2({
    "src/lib/extend.js"(exports, module) {
      var assert2 = require_assert();
      var isFunction = require_isFunction();
      var isArray2 = require_isArray();
      var mixin = require_mixin();
      var isStruct = require_isStruct();
      var isInterface = require_isInterface();
      var isObject = require_isObject();
      var refinement = require_refinement();
      var decompose = require_decompose();
      function compose(predicates, unrefinedType, name) {
        var result = predicates.reduce(function(type, predicate) {
          return refinement(type, predicate);
        }, unrefinedType);
        if (name) {
          result.displayName = name;
          result.meta.name = name;
        }
        return result;
      }
      function getProps(type) {
        return isObject(type) ? type : type.meta.props;
      }
      function getDefaultProps(type) {
        return isObject(type) ? null : type.meta.defaultProps;
      }
      function pushAll(arr, elements) {
        Array.prototype.push.apply(arr, elements);
      }
      function extend(combinator, mixins, options) {
        if (true) {
          assert2(isFunction(combinator), function() {
            return "Invalid argument combinator supplied to extend(combinator, mixins, options), expected a function";
          });
          assert2(isArray2(mixins), function() {
            return "Invalid argument mixins supplied to extend(combinator, mixins, options), expected an array";
          });
        }
        var props = {};
        var prototype = {};
        var predicates = [];
        var defaultProps = {};
        mixins.forEach(function(x, i2) {
          var decomposition = decompose(x);
          var unrefinedType = decomposition.unrefinedType;
          if (true) {
            assert2(isObject(unrefinedType) || isStruct(unrefinedType) || isInterface(unrefinedType), function() {
              return "Invalid argument mixins[" + i2 + "] supplied to extend(combinator, mixins, options), expected an object, struct, interface or a refinement (of struct or interface)";
            });
          }
          pushAll(predicates, decomposition.predicates);
          mixin(props, getProps(unrefinedType));
          mixin(prototype, unrefinedType.prototype);
          mixin(defaultProps, getDefaultProps(unrefinedType), true);
        });
        options = combinator.getOptions(options);
        options.defaultProps = mixin(defaultProps, options.defaultProps, true);
        var result = compose(predicates, combinator(props, {
          strict: options.strict,
          defaultProps: options.defaultProps
        }), options.name);
        mixin(result.prototype, prototype);
        return result;
      }
      module.exports = extend;
    }
  });
  var require_struct = __commonJS2({
    "src/lib/struct.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var String2 = require_String();
      var Function2 = require_Function();
      var isBoolean = require_isBoolean();
      var isObject = require_isObject();
      var isNil = require_isNil();
      var create = require_create();
      var getTypeName = require_getTypeName();
      var dict = require_dict();
      var getDefaultInterfaceName = require_getDefaultInterfaceName();
      var extend = require_extend();
      function getDefaultName(props) {
        return "Struct" + getDefaultInterfaceName(props);
      }
      function extendStruct(mixins, name) {
        return extend(struct, mixins, name);
      }
      function getOptions(options) {
        if (!isObject(options)) {
          options = isNil(options) ? {} : { name: options };
        }
        if (!options.hasOwnProperty("strict")) {
          options.strict = struct.strict;
        }
        if (!options.hasOwnProperty("defaultProps")) {
          options.defaultProps = {};
        }
        return options;
      }
      function struct(props, options) {
        options = getOptions(options);
        var name = options.name;
        var strict = options.strict;
        var defaultProps = options.defaultProps;
        if (true) {
          assert2(dict(String2, Function2).is(props), function() {
            return "Invalid argument props " + assert2.stringify(props) + " supplied to struct(props, [options]) combinator (expected a dictionary String -> Type)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to struct(props, [options]) combinator (expected a string)";
          });
          assert2(isBoolean(strict), function() {
            return "Invalid argument strict " + assert2.stringify(strict) + " supplied to struct(props, [options]) combinator (expected a boolean)";
          });
          assert2(isObject(defaultProps), function() {
            return "Invalid argument defaultProps " + assert2.stringify(defaultProps) + " supplied to struct(props, [options]) combinator (expected an object)";
          });
        }
        var displayName = name || getDefaultName(props);
        function Struct(value, path) {
          if (Struct.is(value)) {
            return value;
          }
          if (true) {
            path = path || [displayName];
            assert2(isObject(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/") + " (expected an object)";
            });
            if (strict) {
              for (k in value) {
                if (value.hasOwnProperty(k)) {
                  assert2(props.hasOwnProperty(k), function() {
                    return 'Invalid additional prop "' + k + '" supplied to ' + path.join("/");
                  });
                }
              }
            }
          }
          if (!(this instanceof Struct)) {
            return new Struct(value, path);
          }
          for (var k in props) {
            if (props.hasOwnProperty(k)) {
              var expected = props[k];
              var actual = value[k];
              if (actual === void 0) {
                actual = defaultProps[k];
              }
              this[k] = create(expected, actual, true ? path.concat(k + ": " + getTypeName(expected)) : null);
            }
          }
          if (true) {
            Object.freeze(this);
          }
        }
        Struct.meta = {
          kind: "struct",
          props,
          name,
          identity: false,
          strict,
          defaultProps
        };
        Struct.displayName = displayName;
        Struct.is = function(x) {
          return x instanceof Struct;
        };
        Struct.update = function(instance, patch) {
          return new Struct(assert2.update(instance, patch));
        };
        Struct.extend = function(xs, name2) {
          return extendStruct([Struct].concat(xs), name2);
        };
        return Struct;
      }
      struct.strict = false;
      struct.getOptions = getOptions;
      struct.getDefaultName = getDefaultName;
      struct.extend = extendStruct;
      module.exports = struct;
    }
  });
  var require_tuple = __commonJS2({
    "src/lib/tuple.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var getTypeName = require_getTypeName();
      var isIdentity = require_isIdentity();
      var isArray2 = require_isArray();
      var create = require_create();
      var is = require_is();
      function getDefaultName(types) {
        return "[" + types.map(getTypeName).join(", ") + "]";
      }
      function tuple(types, name) {
        if (true) {
          assert2(isArray2(types) && types.every(isFunction), function() {
            return "Invalid argument types " + assert2.stringify(types) + " supplied to tuple(types, [name]) combinator (expected an array of types)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to tuple(types, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(types);
        var identity = types.every(isIdentity);
        function Tuple(value, path) {
          if (false) {
            if (identity) {
              return value;
            }
          }
          if (true) {
            path = path || [displayName];
            assert2(isArray2(value) && value.length === types.length, function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/") + " (expected an array of length " + types.length + ")";
            });
          }
          var idempotent = true;
          var ret = [];
          for (var i2 = 0, len = types.length; i2 < len; i2++) {
            var expected = types[i2];
            var actual = value[i2];
            var instance = create(expected, actual, true ? path.concat(i2 + ": " + getTypeName(expected)) : null);
            idempotent = idempotent && actual === instance;
            ret.push(instance);
          }
          if (idempotent) {
            ret = value;
          }
          if (true) {
            Object.freeze(ret);
          }
          return ret;
        }
        Tuple.meta = {
          kind: "tuple",
          types,
          name,
          identity
        };
        Tuple.displayName = displayName;
        Tuple.is = function(x) {
          return isArray2(x) && x.length === types.length && types.every(function(type, i2) {
            return is(x[i2], type);
          });
        };
        Tuple.update = function(instance, patch) {
          return Tuple(assert2.update(instance, patch));
        };
        return Tuple;
      }
      tuple.getDefaultName = getDefaultName;
      module.exports = tuple;
    }
  });
  var require_union = __commonJS2({
    "src/lib/union.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var getTypeName = require_getTypeName();
      var isIdentity = require_isIdentity();
      var isArray2 = require_isArray();
      var create = require_create();
      var is = require_is();
      var forbidNewOperator = require_forbidNewOperator();
      var isUnion = require_isUnion();
      var isNil = require_isNil();
      function getDefaultName(types) {
        return types.map(getTypeName).join(" | ");
      }
      function union(types, name) {
        if (true) {
          assert2(isArray2(types) && types.every(isFunction) && types.length >= 2, function() {
            return "Invalid argument types " + assert2.stringify(types) + " supplied to union(types, [name]) combinator (expected an array of at least 2 types)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to union(types, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(types);
        var identity = types.every(isIdentity);
        function Union(value, path) {
          if (false) {
            if (identity) {
              return value;
            }
          }
          var type = Union.dispatch(value);
          if (!type && Union.is(value)) {
            return value;
          }
          if (true) {
            if (identity) {
              forbidNewOperator(this, Union);
            }
            path = path || [displayName];
            assert2(isFunction(type), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/") + " (no constructor returned by dispatch)";
            });
            path[path.length - 1] += "(" + getTypeName(type) + ")";
          }
          return create(type, value, path);
        }
        Union.meta = {
          kind: "union",
          types,
          name,
          identity
        };
        Union.displayName = displayName;
        Union.is = function(x) {
          return types.some(function(type) {
            return is(x, type);
          });
        };
        Union.dispatch = function(x) {
          for (var i2 = 0, len = types.length; i2 < len; i2++) {
            var type = types[i2];
            if (isUnion(type)) {
              var t = type.dispatch(x);
              if (!isNil(t)) {
                return t;
              }
            } else if (is(x, type)) {
              return type;
            }
          }
        };
        Union.update = function(instance, patch) {
          return Union(assert2.update(instance, patch));
        };
        return Union;
      }
      union.getDefaultName = getDefaultName;
      module.exports = union;
    }
  });
  var require_func = __commonJS2({
    "src/lib/func.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var FunctionType = require_Function();
      var isArray2 = require_isArray();
      var list = require_list();
      var isObject = require_isObject();
      var create = require_create();
      var isNil = require_isNil();
      var isBoolean = require_isBoolean();
      var tuple = require_tuple();
      var getFunctionName = require_getFunctionName();
      var getTypeName = require_getTypeName();
      var isType = require_isType();
      function getDefaultName(domain, codomain) {
        return "(" + domain.map(getTypeName).join(", ") + ") => " + getTypeName(codomain);
      }
      function isInstrumented(f) {
        return FunctionType.is(f) && isObject(f.instrumentation);
      }
      function getOptionalArgumentsIndex(types) {
        var end = types.length;
        var areAllMaybes = false;
        for (var i2 = end - 1; i2 >= 0; i2--) {
          var type = types[i2];
          if (!isType(type) || type.meta.kind !== "maybe") {
            return i2 + 1;
          } else {
            areAllMaybes = true;
          }
        }
        return areAllMaybes ? 0 : end;
      }
      function func(domain, codomain, name) {
        domain = isArray2(domain) ? domain : [domain];
        if (true) {
          assert2(list(FunctionType).is(domain), function() {
            return "Invalid argument domain " + assert2.stringify(domain) + " supplied to func(domain, codomain, [name]) combinator (expected an array of types)";
          });
          assert2(FunctionType.is(codomain), function() {
            return "Invalid argument codomain " + assert2.stringify(codomain) + " supplied to func(domain, codomain, [name]) combinator (expected a type)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to func(domain, codomain, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(domain, codomain);
        var domainLength = domain.length;
        var optionalArgumentsIndex = getOptionalArgumentsIndex(domain);
        function FuncType(value, path) {
          if (!isInstrumented(value)) {
            return FuncType.of(value);
          }
          if (true) {
            path = path || [displayName];
            assert2(FuncType.is(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/");
            });
          }
          return value;
        }
        FuncType.meta = {
          kind: "func",
          domain,
          codomain,
          name,
          identity: true
        };
        FuncType.displayName = displayName;
        FuncType.is = function(x) {
          return isInstrumented(x) && x.instrumentation.domain.length === domainLength && x.instrumentation.domain.every(function(type, i2) {
            return type === domain[i2];
          }) && x.instrumentation.codomain === codomain;
        };
        FuncType.of = function(f, curried) {
          if (true) {
            assert2(FunctionType.is(f), function() {
              return "Invalid argument f supplied to func.of " + displayName + " (expected a function)";
            });
            assert2(isNil(curried) || isBoolean(curried), function() {
              return "Invalid argument curried " + assert2.stringify(curried) + " supplied to func.of " + displayName + " (expected a boolean)";
            });
          }
          if (FuncType.is(f)) {
            return f;
          }
          function fn() {
            var args = Array.prototype.slice.call(arguments);
            var argsLength = args.length;
            if (true) {
              var tupleLength = curried ? argsLength : Math.max(argsLength, optionalArgumentsIndex);
              tuple(domain.slice(0, tupleLength), "arguments of function " + displayName)(args);
            }
            if (curried && argsLength < domainLength) {
              if (true) {
                assert2(argsLength > 0, "Invalid arguments.length = 0 for curried function " + displayName);
              }
              var g = Function.prototype.bind.apply(f, [this].concat(args));
              var newDomain = func(domain.slice(argsLength), codomain);
              return newDomain.of(g, true);
            } else {
              return create(codomain, f.apply(this, args));
            }
          }
          fn.instrumentation = {
            domain,
            codomain,
            f
          };
          fn.displayName = getFunctionName(f);
          return fn;
        };
        return FuncType;
      }
      func.getDefaultName = getDefaultName;
      func.getOptionalArgumentsIndex = getOptionalArgumentsIndex;
      module.exports = func;
    }
  });
  var require_intersection = __commonJS2({
    "src/lib/intersection.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var isFunction = require_isFunction();
      var isArray2 = require_isArray();
      var forbidNewOperator = require_isIdentity();
      var is = require_is();
      var getTypeName = require_getTypeName();
      var isIdentity = require_isIdentity();
      function getDefaultName(types) {
        return types.map(getTypeName).join(" & ");
      }
      function intersection(types, name) {
        if (true) {
          assert2(isArray2(types) && types.every(isFunction) && types.length >= 2, function() {
            return "Invalid argument types " + assert2.stringify(types) + " supplied to intersection(types, [name]) combinator (expected an array of at least 2 types)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to intersection(types, [name]) combinator (expected a string)";
          });
        }
        var displayName = name || getDefaultName(types);
        var identity = types.every(isIdentity);
        function Intersection(value, path) {
          if (true) {
            if (identity) {
              forbidNewOperator(this, Intersection);
            }
            path = path || [displayName];
            assert2(Intersection.is(value), function() {
              return "Invalid value " + assert2.stringify(value) + " supplied to " + path.join("/");
            });
          }
          return value;
        }
        Intersection.meta = {
          kind: "intersection",
          types,
          name,
          identity
        };
        Intersection.displayName = displayName;
        Intersection.is = function(x) {
          return types.every(function(type) {
            return is(x, type);
          });
        };
        Intersection.update = function(instance, patch) {
          return Intersection(assert2.update(instance, patch));
        };
        return Intersection;
      }
      intersection.getDefaultName = getDefaultName;
      module.exports = intersection;
    }
  });
  var require_assign = __commonJS2({
    "src/lib/assign.js"(exports, module) {
      function assign(x, y) {
        for (var k in y) {
          if (y.hasOwnProperty(k)) {
            x[k] = y[k];
          }
        }
        return x;
      }
      module.exports = assign;
    }
  });
  var require_interface = __commonJS2({
    "src/lib/interface.js"(exports, module) {
      var assert2 = require_assert();
      var isTypeName = require_isTypeName();
      var String2 = require_String();
      var Function2 = require_Function();
      var isBoolean = require_isBoolean();
      var isObject = require_isObject();
      var isNil = require_isNil();
      var create = require_create();
      var getTypeName = require_getTypeName();
      var dict = require_dict();
      var getDefaultInterfaceName = require_getDefaultInterfaceName();
      var isIdentity = require_isIdentity();
      var is = require_is();
      var extend = require_extend();
      var assign = require_assign();
      function extendInterface(mixins, name) {
        return extend(inter, mixins, name);
      }
      function getOptions(options) {
        if (!isObject(options)) {
          options = isNil(options) ? {} : { name: options };
        }
        if (!options.hasOwnProperty("strict")) {
          options.strict = inter.strict;
        }
        return options;
      }
      function inter(props, options) {
        options = getOptions(options);
        var name = options.name;
        var strict = options.strict;
        if (true) {
          assert2(dict(String2, Function2).is(props), function() {
            return "Invalid argument props " + assert2.stringify(props) + " supplied to interface(props, [options]) combinator (expected a dictionary String -> Type)";
          });
          assert2(isTypeName(name), function() {
            return "Invalid argument name " + assert2.stringify(name) + " supplied to interface(props, [options]) combinator (expected a string)";
          });
          assert2(isBoolean(strict), function() {
            return "Invalid argument strict " + assert2.stringify(strict) + " supplied to struct(props, [options]) combinator (expected a boolean)";
          });
        }
        var displayName = name || getDefaultInterfaceName(props);
        var identity = Object.keys(props).map(function(prop) {
          return props[prop];
        }).every(isIdentity);
        function Interface(value, path) {
          if (false) {
            if (identity) {
              return value;
            }
          }
          if (true) {
            path = path || [displayName];
            assert2(!isNil(value), function() {
              return "Invalid value " + value + " supplied to " + path.join("/");
            });
            if (strict) {
              for (var k in value) {
                assert2(props.hasOwnProperty(k), function() {
                  return 'Invalid additional prop "' + k + '" supplied to ' + path.join("/");
                });
              }
            }
          }
          var idempotent = true;
          var ret = identity ? {} : assign({}, value);
          for (var prop in props) {
            var expected = props[prop];
            var actual = value[prop];
            var instance = create(expected, actual, true ? path.concat(prop + ": " + getTypeName(expected)) : null);
            idempotent = idempotent && actual === instance;
            ret[prop] = instance;
          }
          if (idempotent) {
            ret = value;
          }
          if (true) {
            Object.freeze(ret);
          }
          return ret;
        }
        Interface.meta = {
          kind: "interface",
          props,
          name,
          identity,
          strict
        };
        Interface.displayName = displayName;
        Interface.is = function(x) {
          if (isNil(x)) {
            return false;
          }
          if (strict) {
            for (var k in x) {
              if (!props.hasOwnProperty(k)) {
                return false;
              }
            }
          }
          for (var prop in props) {
            if (!is(x[prop], props[prop])) {
              return false;
            }
          }
          return true;
        };
        Interface.update = function(instance, patch) {
          return Interface(assert2.update(instance, patch));
        };
        Interface.extend = function(xs, name2) {
          return extendInterface([Interface].concat(xs), name2);
        };
        return Interface;
      }
      inter.strict = false;
      inter.getOptions = getOptions;
      inter.getDefaultName = getDefaultInterfaceName;
      inter.extend = extendInterface;
      module.exports = inter;
    }
  });
  var require_update = __commonJS2({
    "src/lib/update.js"(exports, module) {
      var assert2 = require_assert();
      var isObject = require_isObject();
      var isFunction = require_isFunction();
      var isArray2 = require_isArray();
      var isNumber = require_isNumber();
      var assign = require_assign();
      function getShallowCopy(x) {
        if (isObject(x)) {
          if (x instanceof Date || x instanceof RegExp) {
            return x;
          }
          return assign({}, x);
        }
        if (isArray2(x)) {
          return x.concat();
        }
        return x;
      }
      function isCommand(k) {
        return update.commands.hasOwnProperty(k);
      }
      function getCommand(k) {
        return update.commands[k];
      }
      function update(instance, patch) {
        if (true) {
          assert2(isObject(patch), function() {
            return "Invalid argument patch " + assert2.stringify(patch) + " supplied to function update(instance, patch): expected an object containing commands";
          });
        }
        var value = instance;
        var isChanged = false;
        var newValue;
        for (var k in patch) {
          if (patch.hasOwnProperty(k)) {
            if (isCommand(k)) {
              newValue = getCommand(k)(patch[k], value);
              if (newValue !== instance) {
                isChanged = true;
                value = newValue;
              } else {
                value = instance;
              }
            } else {
              if (value === instance) {
                value = getShallowCopy(instance);
              }
              newValue = update(value[k], patch[k]);
              isChanged = isChanged || newValue !== value[k];
              value[k] = newValue;
            }
          }
        }
        return isChanged ? value : instance;
      }
      function $apply(f, value) {
        if (true) {
          assert2(isFunction(f), "Invalid argument f supplied to immutability helper { $apply: f } (expected a function)");
        }
        return f(value);
      }
      function $push(elements, arr) {
        if (true) {
          assert2(isArray2(elements), "Invalid argument elements supplied to immutability helper { $push: elements } (expected an array)");
          assert2(isArray2(arr), "Invalid value supplied to immutability helper $push (expected an array)");
        }
        if (elements.length > 0) {
          return arr.concat(elements);
        }
        return arr;
      }
      function $remove(keys, obj) {
        if (true) {
          assert2(isArray2(keys), "Invalid argument keys supplied to immutability helper { $remove: keys } (expected an array)");
          assert2(isObject(obj), "Invalid value supplied to immutability helper $remove (expected an object)");
        }
        if (keys.length > 0) {
          obj = getShallowCopy(obj);
          for (var i2 = 0, len = keys.length; i2 < len; i2++) {
            delete obj[keys[i2]];
          }
        }
        return obj;
      }
      function $set(value) {
        return value;
      }
      function $splice(splices, arr) {
        if (true) {
          assert2(isArray2(splices) && splices.every(isArray2), "Invalid argument splices supplied to immutability helper { $splice: splices } (expected an array of arrays)");
          assert2(isArray2(arr), "Invalid value supplied to immutability helper $splice (expected an array)");
        }
        if (splices.length > 0) {
          arr = getShallowCopy(arr);
          return splices.reduce(function(acc, splice) {
            acc.splice.apply(acc, splice);
            return acc;
          }, arr);
        }
        return arr;
      }
      function $swap(config, arr) {
        if (true) {
          assert2(isObject(config), "Invalid argument config supplied to immutability helper { $swap: config } (expected an object)");
          assert2(isNumber(config.from), "Invalid argument config.from supplied to immutability helper { $swap: config } (expected a number)");
          assert2(isNumber(config.to), "Invalid argument config.to supplied to immutability helper { $swap: config } (expected a number)");
          assert2(isArray2(arr), "Invalid value supplied to immutability helper $swap (expected an array)");
        }
        if (config.from !== config.to) {
          arr = getShallowCopy(arr);
          var element = arr[config.to];
          arr[config.to] = arr[config.from];
          arr[config.from] = element;
        }
        return arr;
      }
      function $unshift(elements, arr) {
        if (true) {
          assert2(isArray2(elements), "Invalid argument elements supplied to immutability helper {$unshift: elements} (expected an array)");
          assert2(isArray2(arr), "Invalid value supplied to immutability helper $unshift (expected an array)");
        }
        if (elements.length > 0) {
          return elements.concat(arr);
        }
        return arr;
      }
      function $merge(whatToMerge, value) {
        var isChanged = false;
        var result = getShallowCopy(value);
        for (var k in whatToMerge) {
          if (whatToMerge.hasOwnProperty(k)) {
            result[k] = whatToMerge[k];
            isChanged = isChanged || result[k] !== value[k];
          }
        }
        return isChanged ? result : value;
      }
      update.commands = {
        $apply,
        $push,
        $remove,
        $set,
        $splice,
        $swap,
        $unshift,
        $merge
      };
      module.exports = update;
    }
  });
  var require_match = __commonJS2({
    "src/lib/match.js"(exports, module) {
      var assert2 = require_assert();
      var isFunction = require_isFunction();
      var isType = require_isType();
      var Any = require_Any();
      module.exports = function match(x) {
        var type, guard, f, count;
        for (var i2 = 1, len = arguments.length; i2 < len; ) {
          type = arguments[i2];
          guard = arguments[i2 + 1];
          f = arguments[i2 + 2];
          if (isFunction(f) && !isType(f)) {
            i2 = i2 + 3;
          } else {
            f = guard;
            guard = Any.is;
            i2 = i2 + 2;
          }
          if (true) {
            count = (count || 0) + 1;
            assert2(isType(type), function() {
              return "Invalid type in clause #" + count;
            });
            assert2(isFunction(guard), function() {
              return "Invalid guard in clause #" + count;
            });
            assert2(isFunction(f), function() {
              return "Invalid block in clause #" + count;
            });
          }
          if (type.is(x) && guard(x)) {
            return f(x);
          }
        }
        assert2.fail("Match error");
      };
    }
  });
  var require_src = __commonJS2({
    "src/index.js"(exports, module) {
      var t = require_assert();
      t.Any = require_Any();
      t.Array = require_Array();
      t.Boolean = require_Boolean();
      t.Date = require_Date();
      t.Error = require_Error();
      t.Function = require_Function();
      t.Nil = require_Nil();
      t.Number = require_Number();
      t.Integer = require_Integer();
      t.IntegerT = t.Integer;
      t.Object = require_Object();
      t.RegExp = require_RegExp();
      t.String = require_String();
      t.Type = require_Type();
      t.TypeT = t.Type;
      t.Arr = t.Array;
      t.Bool = t.Boolean;
      t.Dat = t.Date;
      t.Err = t.Error;
      t.Func = t.Function;
      t.Num = t.Number;
      t.Obj = t.Object;
      t.Re = t.RegExp;
      t.Str = t.String;
      t.dict = require_dict();
      t.declare = require_declare();
      t.enums = require_enums();
      t.irreducible = require_irreducible();
      t.list = require_list();
      t.maybe = require_maybe();
      t.refinement = require_refinement();
      t.struct = require_struct();
      t.tuple = require_tuple();
      t.union = require_union();
      t.func = require_func();
      t.intersection = require_intersection();
      t.subtype = t.refinement;
      t.inter = require_interface();
      t["interface"] = t.inter;
      t.assert = t;
      t.update = require_update();
      t.mixin = require_mixin();
      t.isType = require_isType();
      t.is = require_is();
      t.getTypeName = require_getTypeName();
      t.match = require_match();
      module.exports = t;
    }
  });
  var tcomb_neutral_default = require_src();

  // src/students.js
  var StudentData = tcomb_neutral_default.struct({
    id: tcomb_neutral_default.String,
    fullname: tcomb_neutral_default.String,
    path: tcomb_neutral_default.String,
    funding: tcomb_neutral_default.String,
    created: tcomb_neutral_default.String
  }, "StudentData");
  var _Student = class {
    static modifyFunding(sId, dtFrom2, sNewState) {
      if (typeof dtFrom2 === "string") {
        dtFrom2 = dayjs(dtFrom2);
      }
      ;
      assert(created instanceof dayjs, "modifyFunding date must be a string, a dayjs instance or null.", TypeError);
      const sCurFunding = _Student.getFunding(sId, dtFrom2);
      if (sNewState.toLower() === sCurFunding.toLower()) {
        console.log(`%cFundingMode ${sNewState} is identical as current: ${sCurrent}, nothing to do`, APP_DEBUG_STYLE);
        return;
      }
      if (sNewState !== OC_AUTOFUNDED || sNewState != OC_FUNDED || sNewState !== OC_OTHER) {
        console.log(`%cWarning this state is unknown ${sNewState}`, APP_WARN_STYLE);
      }
      const db = src_default.Cfg.dbase;
      const dtNow = dayjs().format("YYYY-MM-DDTHH:mm:ssZZ");
      if (dtFrom2 === null) {
        dtFrom2 = dtNow;
      }
      oLastHistory = students_history_default.find(sId, students_history_default.getType("FUNDING"), dtFrom2);
      db.get(_Student.tbl_name).find({ id: sId }).assign({ funding: sNewState }).write();
      students_history_default.addFunding(sId, sCurFunding, dtNow);
      if (dtFrom2.isSameOrAfter(core_default.getOldModeDate())) {
        var oListToUpdate = db.get("sessions").filter(function(v) {
          return v.who_id === sId && dayjs(v.when).isSameOrAfter(dtFrom2, "day");
        });
      } else {
        var oListToUpdate = db.get("sessions").filter(function(v) {
          v.who_id === sId && dayjs(v.when).isSameOrAfter(core_default.getOldModeDate(), "day");
        });
      }
      for (var i2 = oListToUpdate.value().length; i2 -= 1; ) {
        console.log(`There is ${i2} elements left to update`, APP_DEBUG_STYLE);
        oListToUpdate.get(i2).assign({ "funding": sNewState }).write();
      }
    }
  };
  var Student = _Student;
  __publicField(Student, "tbl_name", "students");
  __publicField(Student, "ocmapper", async function(o) {
    let bDebug2 = false;
    try {
      let _r2 = await _Student.getFundingFomDashboard(o.id);
      if (bDebug2 === true)
        console.log("%cocmapper() funding is %o", APP_DEBUG_STYLE, _r2);
      let id = o.id.toString(10);
      let fullname = o.displayName;
      let _s = o.followedLearningPath.learningPathTitle;
      let path;
      if (_s.length == 0) {
        path = "non d\xE9fini";
      } else {
        path = _s;
      }
      let funding = _r2.toLowerCase();
      let created2 = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      return StudentData({
        id,
        fullname,
        path,
        funding,
        created: created2
      });
    } catch (e) {
      console.error("%c,IRRECOVERABLE ERROR in StudentData.ocmapper: %o", APP_ERROR_STYLE, e);
    }
  });
  __publicField(Student, "add", function(sStudentId, sStudentFullName = "noname", sStudentPath = "nopath", sStudentFunding = "unknown", created2) {
    let db = src_default.Cfg.dbase;
    var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
    let me = { id: sStudentId, fullname: sStudentFullName, path: sStudentPath, funding: sStudentFunding, created: now };
    _Student._save(me);
  });
  __publicField(Student, "_checkObject", function(oStudent) {
    let bDebug2 = false;
    if (bDebug2 === true)
      console.log("%cChecking object student:%o ", APP_DEBUG_STYLE, oStudent);
    assert(typeof oStudent.id === "string", "Student object id need to be a string.", TypeError);
    assert(typeof oStudent.fullname === "string", "Student object fullname need to be a number.", TypeError);
    assert(typeof oStudent.path === "string", "Student object path need to be a string.", TypeError);
    assert(typeof oStudent.funding === "string", "Student object funding need to be a string.", TypeError);
    assert(typeof oStudent.created === "string", "Student object created need to be a string.", TypeError);
  });
  __publicField(Student, "_save", function(oStudent) {
    let bDebug2 = false;
    _Student._checkObject(oStudent);
    if (bDebug2 === true)
      console.log("%cSaving student %o to DB", APP_DEBUG_STYLE, oStudent);
    let db = src_default.Cfg.dbase;
    db.get(_Student.tbl_name).push(JSON.parse(JSON.stringify(oStudent))).write();
  });
  __publicField(Student, "exists", function(needle, dtFrom2 = null) {
    let bDebug2 = false;
    let _r2 = _Student.findById(needle, dtFrom2);
    if (bDebug2 === true)
      console.log(`%cStudent ${needle} exists in db ? ${_r2 === void 0 ? false : true}`, APP_DEBUG_STYLE);
    return _r2 === void 0 ? false : true;
  });
  __publicField(Student, "findById", function(sNeedle, dtFrom2 = null) {
    let bUseCache = GM_config.get("use_student_cache");
    if (bUseCache === false)
      console.log("%cache \xE9tudiant desactiv\xE9 dans les options", APP_DEBUG_STYLE);
    if (typeof sNeedle === "number") {
      sNeedle = sNeedle.toString(10);
    }
    assert(typeof sNeedle === "string", "You must provide a string.", TypeError);
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dayjs(dtFrom2);
    }
    if (dtFrom2 == null) {
      if (bUseCache === false) {
        return _Student._findById(sNeedle, dtFrom2);
      }
      return _Student.m_findById(sNeedle, "null");
    }
    if (bUseCache === false) {
      return _Student._findById(sNeedle, dtFrom2.toISOString());
    }
    return _Student.m_findById(sNeedle, dtFrom2.toISOString());
  });
  __publicField(Student, "_findById", function(sNeedle, dtFrom2 = null) {
    let bDebug2 = false;
    let db = src_default.Cfg.dbase;
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dayjs(dtFrom2);
    }
    if (bDebug2 === true)
      console.log(`%c_findById() searching student with id:(${typeof sNeedle})${sNeedle} in db`, APP_DEBUG_STYLE);
    var _r2 = db.get(_Student.tbl_name).find({ id: sNeedle }).value();
    if (bDebug2 === true)
      console.log("%c_findById() student %o is found", APP_DEBUG_STYLE, _r2);
    if (_r2 === void 0) {
      return void 0;
    } else {
      if (dtFrom2 !== null) {
        var _rClone = { ..._r2 };
        var _rFunding = students_history_default.find(sNeedle, students_history_default.getType("FUNDING"), dtFrom2);
        if (_rFunding !== void 0) {
          _rClone.funding = _rFunding.value;
        }
        var _rPath = students_history_default.find(sNeedle, students_history_default.getType("PATH"), dtFrom2);
        if (_rPath !== void 0) {
          _rClone.path = _rPath.value;
        }
        return _rClone;
      }
      if (bDebug2 === true)
        console.log("%c_findById() student final %o is found", APP_DEBUG_STYLE, _r2);
      return _r2;
    }
  });
  __publicField(Student, "m_findById", moize.default(_Student._findById, {
    maxAge: 6e5,
    isSerialized: true
  }));
  __publicField(Student, "findByFullName", function(sNeedle) {
    let bUseCache = GM_config.get("use_student_cache");
    if (bUseCache === false)
      console.log("%cache \xE9tudiant desactiv\xE9 dans les options", APP_DEBUG_STYLE);
    assert(typeof sNeedle === "string", "You must provide a string.", TypeError);
    if (bUseCache === false) {
      return _Student._findByFullName(sNeedle);
    }
    return _Student.m_findByFullName(sNeedle);
  });
  __publicField(Student, "_findByFullName", function(sNeedle) {
    let bDebug2 = false;
    let db = src_default.Cfg.dbase;
    if (bDebug2 === true)
      console.log(`%c[_findByFullName()] searching student with name:(${typeof sNeedle})${sNeedle} in db`, APP_DEBUG_STYLE);
    var _r2 = db.get(_Student.tbl_name).find({ fullname: sNeedle }).value();
    if (bDebug2 === true)
      console.log("%c[_findByFullName()] student %o is found", APP_DEBUG_STYLE, _r2);
    if (_r2 === void 0) {
      return void 0;
    } else {
      return _r2;
    }
  });
  __publicField(Student, "m_findByFullName", moize.default(_Student._findByFullName, {
    maxAge: 6e5,
    isSerialized: true
  }));
  __publicField(Student, "getFunding", async function(sId, dtFrom2 = null) {
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dayjs(dtFrom2);
    }
    ;
    return await _Student.m_getFunding(sId, dtFrom2);
  });
  __publicField(Student, "_getFunding", async function(sId, dtFrom2 = null) {
    let _r2 = _Student.findById(sId, dtFrom2);
    if (_r2 === void 0) {
      console.log('%c[Student._getFunding()]Student %s is not in db, fetching data:"funded mode" from webpage', APP_DEBUG_STYLE, sId);
      _r2 = await _Student.getFundingFomDashboard(sId);
      console.log("%c[Student._getFunding()]Student %s funding is %o", APP_DEBUG_STYLE, sId, _r2);
      return _r2.toLowerCase();
    } else {
      return _r2.funding.toLowerCase();
    }
  });
  __publicField(Student, "m_getFunding", moize.default(_Student._getFunding, {
    maxAge: 6e5,
    isSerialized: true,
    isPromise: true
  }));
  __publicField(Student, "isAutoFunded", function(iStudentId) {
    console.log(`%cFUNCTION DEPRECATED !!!!!!!!!!!!!!!!!!!!!! `, APP_ERROR_STYLE);
    return _Student.getFunded(iStudentId).toLowerCase() === OC_AUTOFUNDED;
  });
  __publicField(Student, "getFundingFomDashboard", async function(id) {
    const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${id}/dashboard`, ".mentorshipStudent__details > p");
    return oDom.innerText.trim();
  });
  __publicField(Student, "getPath", async function(sId, dtFrom2 = null) {
    let _r2 = _Student.findById(sId, dtFrom2);
    if (_r2 == void 0) {
      console.log(`%cStudent ${sId} is not in db, fetching data: 'path' from webpage ....`, APP_DEBUG_STYLE);
      const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${sId}/dashboard`, "a[href*='paths/']");
      if (oDom.innerText.length == 0) {
        console.error(`%cStudent path is not readable from url : https://openclassrooms.com/fr/mentorship/students/${sId}/dashboard`, APP_ERROR_STYLE);
      }
      return oDom.innerText.trim();
    } else {
      return _r2.path;
    }
  });
  __publicField(Student, "delete", function(dtFrom2 = null, dtTo2 = null) {
    let db = src_default.Cfg.dbase;
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dtFrom2.format("YYYY-MM-DD");
    }
    if (typeof dtTo2 === "string") {
      dtTo2 = dtTo2.format("YYYY-MM-DD");
    }
    if (dtFrom2 === null && dtTo2 == null) {
      console.log(`%cWanna suppress ALL Students from DB`, APP_DEBUG_STYLE);
      db.get(_Student.tbl_name).remove().write();
      return;
    }
    if (dtTo2 == null) {
      db.get(_Student.tbl_name).remove(function(o) {
        return dayjs(o.created, "YYYY-MM-DDTHH:mm:ssZ[Z]").isBefore(dtTo2, "day");
      }).write();
      return;
    }
    if (dtFrom2 == null) {
      db.get(_Student.tbl_name).remove(function(o) {
        return dayjs(o.created, "YYYY-MM-DDTHH:mm:ssZ[Z]").isAfter(dtFrom2, "day");
      }).write();
      return;
    }
    db.get(_Student.tbl_name).remove(function(o) {
      return dayjs(o.created, "YYYY-MM-DDTHH:mm:ssZ[Z]").isBetween(dtFrom2, dtTo2, "day", "[]");
    }).write();
  });
  __publicField(Student, "deleteById", function(sId, dtCreated = null) {
    let db = src_default.Cfg.dbase;
    db.get("students").remove((o) => o.id === sId).write();
    console.log(`%cAll students with id:${sId} are removed from DataBase`, APP_DEBUG_STYLE);
  });
  __publicField(Student, "getAll", async (e, ctx) => {
    let bDebug2 = true;
    var bForceUpdate = false;
    let db = src_default.Cfg.dbase;
    var sPath = "table.crud-list tbody";
    if (bDebug2 === true)
      console.log("%c[getAll()] Enter function", APP_DEBUG_STYLE);
    const oJson = await api_openclassrooms_default.getUserStudents();
    var aStudents = JSON.parse(oJson);
    if (bDebug2 === true)
      console.log("%cgetAll() collect this array of stundent %o", APP_DEBUG_STYLE, aStudents);
    const now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
    var t0 = performance.now();
    await _Student.ocmapper(aStudents[0]);
    if (bDebug2 === true)
      console.log(`%cEstimated time for updating : ${(performance.now() - t0) * aStudents.length} ms`, APP_DEBUG_STYLE);
    Swal.fire({
      position: "top-end",
      icon: "info",
      toast: true,
      title: `mise \xE0 jour de la base de donn\xE9e des \xE9tudiants...
cela peut prendre du temps ~ ${(performance.now() - t0) * aStudents.length / 1e3} s`,
      showConfirmButton: false,
      timer: 1e3
    });
    await sleep(1e3);
    if (bDebug2 === true)
      console.log("%cWill process all students of board", APP_DEBUG_STYLE);
    for (const oStudent of aStudents) {
      let theStudent = await _Student.ocmapper(oStudent);
      if (bDebug2 === true)
        console.log('%c Working on student "%s"', APP_DEBUG_STYLE, theStudent.fullname);
      toastOk(`Collecte les donn\xE9es de l'\xE9tudiant : ${theStudent.fullname}`);
      var _r2 = _Student.m_findById(theStudent.id, null);
      if (_r2 === void 0) {
        if (bDebug2 === true)
          console.log(`%cStudent ${theStudent.fullname} (id:${theStudent.id}) not present in student database will create it`, APP_DEBUG_STYLE);
        _Student.add(theStudent.id, theStudent.fullname, theStudent.path, theStudent.funding, theStudent.created);
        continue;
      }
      if (theStudent.funding.toLowerCase() !== _r2.funding.toLowerCase()) {
        db.get(_Student.tbl_name).find({ id: theStudent.id }).assign({ funding: theStudent.funding }).write();
        students_history_default.addFunding(theStudent.id, _r2.funding, dayjs());
        console.log(`%c[Student.getAll]Student ${theStudent.fullname}(id:${theStudent.id}) was already present in database but change of funding was detected (from ${_r2.funding.toLowerCase()} to ${theStudent.funding.toLowerCase()})`, APP_DEBUG_STYLE);
      }
      if (theStudent.path !== _r2.path) {
        db.get(_Student.tbl_name).find({ id: theStudent.id }).assign({ path: theStudent.path }).write();
        students_history_default.addPath(theStudent.id, _r2.path, dayjs());
        console.log(`%c[Student.getAll]Student ${theStudent.fullname}(id:${theStudent.id}) was already present in database but change of path was detected (from ${_r2.path} to ${theStudent.path})`, APP_DEBUG_STYLE);
      }
    }
  });
  __publicField(Student, "showList", function() {
    let db = src_default.Cfg.dbase;
    let _r2 = db.get(_Student.tbl_name).value();
    var sHtml = "";
    sHtml += "<table>";
    sHtml += "<caption>Liste des \xE9tudiant</caption>";
    sHtml += "<thead>";
    sHtml += "<tr>";
    sHtml += `<th>Nom</th><th>Parcours</th><th>Financement</th><th>Date de cr\xE9ation</th><th>Edition</th>`;
    sHtml += "</tr>";
    sHtml += "</thead>";
    sHtml += "<tbody>";
    for (var idx in _r2) {
      sHtml += "<tr>";
      sHtml += `<td>${_r2[idx].fullname}</td><td>${_r2[idx].path}</td><td>${_r2[idx].funding}</td>`;
      sHtml += `<td>${dayjs(_r2[idx].created, "YYYY-MM-DDTHH:mm:ssZ[Z]").format("DD/MM/YYYY \xE0 HH:mm")}</td>`;
      sHtml += `<td><a href="https://openclassrooms.com/fr/mentorship/students/${_r2[idx].id}/dashboard">${_r2[idx].id}</a></td>`;
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
  });
  __publicField(Student, "createManually", async function(sStudentId, sStudentName, sSessionDate) {
    let aPathList = ["non pr\xE9sent dans la liste", "Chef de projet digital", "Chef de projet SI", "D\xE9veloppeur d'application - Frontend", "D\xE9veloppeur Web", "Expert en strat\xE9gie marketing et communication ", "Production de contenu web avec CMS et Content Marketing ", "Tech lead"];
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
    sHtml += '<label for="funding">Autofinanc\xE9</label>';
    sHtml += '<input id="funding" type="checkbox" value="autofunded">';
    sHtml += '<label for="student_path">Parcours</label>';
    sHtml += '<input id="student_path" name="student_path" type="text" list="student_path-list">';
    sHtml += '<datalist id="student_path-list">';
    for (var i2 in aPathList) {
      sHtml += `<option>${aPathList[i2]}</option>`;
    }
    sHtml += "/<datalist>";
    sHtml += '<label for="session_date">Date</label>';
    sHtml += '<input id="session_date" type="date" max="2030-12-31" min="2010-12-31" value="' + dayjs(sSessionDate).format("YYYY-MM-DD") + '">';
    sHtml += "</form>";
    const { value: formValues } = await Swal.fire({
      title: "<strong>Ajout d'un \xE9tudiant en mode manuel</strong>",
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "top-start",
      grow: "row",
      footer: `votre \xE9tudiant(e) ${sStudentName} n'a pas \xE9t\xE9 trouv\xE9`,
      preConfirm: () => {
        return {
          student_id: document.getElementById("student_id").value,
          student_name: document.getElementById("student_name").value,
          student_path: document.getElementById("student_path").value,
          student_funding: document.getElementById("funding").checked,
          session_date: document.getElementById("session_date").value
        };
      }
    });
    if (formValues && formValues.hasOwnProperty("student_id")) {
      var sFunding = "";
      if (formValues.student_funding === true) {
        sFunding = OC_AUTOFUNDED;
      } else {
        sFunding = OC_FUNDED;
      }
      _Student.add(formValues.student_id, formValues.student_name, formValues.student_path, sFunding, formValues.session_date);
    }
  });
  var students_default = Student;

  // src/refs.js
  var fRef = function() {
    const TBL_NAME = "refs";
    const TYPE_DEFAULT = 0;
    const TYPE_FUNDING = 1;
    const TYPE_PATH = 2;
    const TYPE = {
      DEFAULT: 0,
      SESSIONID_DATEREFID: 1
    };
    const checkSupport = function() {
      if (src_default.Cfg.dbase.get("refs").value() === void 0) {
        console.log("%cDb dont' contain ref table create it", APP_DEBUG_STYLE);
        src_default.Cfg.dbase.assign({ refs: [] }).write();
      }
    };
    const add = function(mKey1, mKey2, sType2 = TYPE.DEFAULT) {
      let db = src_default.Cfg.dbase;
      var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      let me = { key1: mKey1, key2: mKey2, type: sType2, created: now, updated: now };
      let _r2 = _save(me);
      pause(50);
      assert(Array.isArray(_r2) && _r2.length > 0, "Database insertion fail");
    };
    const _save = function(oRef) {
      let db = src_default.Cfg.dbase;
      let _r2 = db.get(Ref.tbl_name).push(JSON.parse(JSON.stringify(oRef))).write();
      return _r2;
    };
    const getByKey = function(mNeedle, iKey = 1, sType2 = TYPE.DEFAULT) {
      assert(typeof iKey === "number", "You must provide a number as index of key.", TypeError);
      let db = src_default.Cfg.dbase;
      let _r2 = null;
      if (iKey == 1) {
        _r2 = db.get(Ref.tbl_name).find((o) => o.key1 === mNeedle && o.type === sType2).value();
      }
      if (iKey == 2) {
        _r2 = db.get(Ref.tbl_name).find((o) => o.key2 === mNeedle && o.type === sType2).value();
      }
      if (_r2 === void 0 || _r2 === null) {
        return void 0;
      }
      return _r2;
    };
    const exists = function(mNeedle, iKey, sType2 = TYPE.DEFAULT) {
      let _r2 = Ref.getByKey(mNeedle, iKey, sType2);
      console.log(`%cRef ${mNeedle} exists in db ? ${_r2 === void 0 ? false : true}`, APP_DEBUG_STYLE);
      return _r2 === void 0 ? false : true;
    };
    const updKey1 = function(mNeedle, mValue, sType2 = TYPE.DEFAULT) {
      let db = src_default.Cfg.dbase;
      let _r2;
      _r2 = db.get(Ref.tbl_name).find((o) => o.key2 === mNeedle && o.type === sType2).assign({ key1: mValue }).write();
      console.log("%cNeedle  %o mValue %o sType %o", APP_DEBUG_STYLE, mNeedle, mValue, sType2);
      console.log("%c_r %o", APP_DEBUG_STYLE, _r2);
      assert(Array.isArray(_r2) && _r2.length > 0, "Database insertion fail");
    };
    const updKey2 = function(mNeedle, mValue, sType2 = TYPE.DEFAULT) {
      let db = src_default.Cfg.dbase;
      let _r2;
      _r2 = db.get(Ref.tbl_name).find((o) => o.key1 === mNeedle && o.type === sType2).assign({ key2: mValue }).write();
      console.log("%cNeedle  %o mValue %o sType %o", APP_DEBUG_STYLE, mNeedle, mValue, sType2);
      console.log("%c_r %o", APP_DEBUG_STYLE, _r2);
      assert(Array.isArray(_r2) && _r2.length > 0, "Database insertion fail");
    };
    return Object.freeze({
      tbl_name: TBL_NAME,
      TYPE,
      add,
      updKey1,
      updKey2,
      checkSupport,
      exists,
      getByKey
    });
  };
  var Ref = fRef();
  var refs_default = Ref;

  // src/meta.js
  var fMeta = function() {
    const TBL_NAME = "meta";
    const setDbVersion = function(sVersion) {
      assert(typeof sVersion === "string", "You must provide a string.", TypeError);
      return src_default.Cfg.dbase.get(Meta.tbl_name).find({ "key": "dbVersion" }).assign({ value: sVersion }).write().value;
    };
    const getDbVersion = function() {
      let _r2 = src_default.Cfg.dbase.get(Meta.tbl_name).find({ "key": "dbVersion" }).value();
      return typeof _r2 === "undefined" ? -1 : _r2.value;
    };
    const reset = function() {
      return src_default.Cfg.dbase.get("meta").remove((item) => true).write();
    };
    const delDbVersion = function() {
      console.log("%c resetDbVersion NE FONCTIONNE PAS", APP_ERROR_STYLE);
      return src_default.Cfg.dbase.get("meta").find({ key: "dbVersion" }).remove((item) => true).write();
    };
    const setStudentListUpd = function(sValue) {
      assert(typeof sValue === "string", "You must provide a string.", TypeError);
      return src_default.Cfg.dbase.get(Meta.tbl_name).find({ "key": "studentLstUpd" }).assign({ value: sValue }).write().value;
    };
    const getStudentListUpd = function() {
      let _r2 = src_default.Cfg.dbase.get(Meta.tbl_name).find({ "key": "studentLstUpd" }).value();
      return typeof _r2 === "undefined" ? -1 : _r2.value;
    };
    const remStudentListUpd = function() {
      return setStudentListUpd(dayjs("19701006").toISOString());
    };
    const checkSupport = function() {
      if (src_default.Cfg.dbase.get("meta").value() === void 0) {
        console.log("%cDb dont' contain meta table create it", APP_DEBUG_STYLE);
        src_default.Cfg.dbase.assign({ meta: [] }).write();
      }
      if (getDbVersion() == -1) {
        src_default.Cfg.dbase.get("meta").push({ "key": "dbVersion", "value": "1.0.0" }).write();
      }
      if (getStudentListUpd() == -1) {
        src_default.Cfg.dbase.get("meta").push({ "key": "studentLstUpd", "value": dayjs("19701006").toISOString() }).write();
      }
    };
    return Object.freeze({
      checkSupport,
      getDbVersion,
      setDbVersion,
      delDbVersion,
      setStudentListUpd,
      getStudentListUpd,
      remStudentListUpd,
      tbl_name: TBL_NAME
    });
  };
  var Meta = fMeta();
  var meta_default = Meta;

  // src/history.js
  var _HistoryDb = function fHistoryDb() {
    const TBL_NAME = "history_session_cache";
    const VERBOSE = false;
    const DBCreateTable = function() {
      if (VERBOSE === true)
        console.log("%cDb dont' contain table history_session_cache table, will create it", APP_DEBUG_STYLE);
      src_default.Cfg.dbase.assign({ history_session_cache: [] }).write();
    };
    const DBTableExists = function() {
      if (src_default.Cfg.dbase.get(TBL_NAME).value() === void 0) {
        return false;
      }
      return true;
    };
    const DBFindInTable = function(oValue) {
      if (DBTableExists === false) {
        throw new Error("%c_HistoryDb:DBFindInTable() failed reason : table is not defined", APP_DEBUG_STYLE);
      }
      if (VERBOSE === true)
        console.log('%c_HistoryDb:DBFindInTable()  Request is App.Cfg.dbase.get("%s").find(%o).value()', APP_DEBUG_STYLE, TBL_NAME, oValue);
      let _r2 = src_default.Cfg.dbase.get(TBL_NAME).find(oValue).value();
      return _r2;
    };
    const DBGetAll = function() {
      if (DBTableExists === false) {
        throw new Error("%c_HistoryDb:DBGetAll() failed reason : table is not defined", APP_DEBUG_STYLE);
      }
      if (VERBOSE === true)
        console.log('%c_HistoryDb:DBGetAll()  Request is App.Cfg.dbase.get("%s").value()', APP_DEBUG_STYLE, TBL_NAME);
      let _r2 = src_default.Cfg.dbase.get(TBL_NAME).value();
      return _r2;
    };
    const DBInsertInTable = function(oValue) {
      if (DBTableExists === false) {
        DBCreateTable();
      }
      if (VERBOSE === true)
        console.log("%c_HistoryDb:DBInsertInTable table:%s data:%o)", APP_DEBUG_STYLE, TBL_NAME, oValue);
      let _r2 = src_default.Cfg.dbase.get(TBL_NAME).push(oValue).write();
      return _r2;
    };
    const DBUpdateInTable = function(oFind, oAssign) {
      if (DBTableExists === false) {
        throw new Error("%c_HistoryDb:DBUpdateInTable() failed reason : table is not defined", APP_DEBUG_STYLE);
      }
      let _r2 = src_default.Cfg.dbase.get(TBL_NAME).find(oFind).assign(oAssign).write();
      return _r2;
    };
    const DBRemoveInTable = function(fn_filter = {}) {
      if (DBTableExists === false) {
        throw new Error("%c_HistoryDb:DBRemove() failed reason : table is not defined", APP_DEBUG_STYLE);
      }
      if (VERBOSE === true)
        console.log("%c_HistoryDb:DBRemove with filter", APP_DEBUG_STYLE);
      if (isEmptyFunction(fn_filter) === true)
        console.log("%c_HistoryDb:DBRemove /! filter is empty", APP_DEBUG_STYLE);
      let _r2 = src_default.Cfg.dbase.get(TBL_NAME).remove(fn_filter).write();
      return _r2;
    };
    const DBResetTable = function() {
      if (VERBOSE === true)
        console.log("%c_History:DBResetTable", APP_DEBUG_STYLE);
      let _r2 = src_default.Cfg.dbase.get(TBL_NAME).remove().write();
      return _r2;
    };
    return {
      find: DBFindInTable,
      getAll: DBGetAll,
      insert: DBInsertInTable,
      remove: DBRemoveInTable,
      reset: DBResetTable,
      update: DBUpdateInTable
    };
  }();
  var fHistory = function() {
    const TBL_NAME = "history_session_cache";
    const checkSupport = function() {
      let bDebug2 = true;
      if (src_default.Cfg.dbase.get("history_session_cache").value() === void 0) {
        if (bDebug2)
          console.log("%cDb dont' contain history_session_cache table create it", APP_DEBUG_STYLE);
        src_default.Cfg.dbase.assign({ history_session_cache: [] }).write();
      }
    };
    const _exists = function(dtDate) {
      let bDebug2 = true;
      if (typeof dtDate === "string") {
        dtDate = dayjs(dtDate);
      }
      assert(dtDate instanceof dayjs === true, "date must be a string or a dayjs object.", TypeError);
      let _r2 = _HistoryDb.find({ id: +dtDate.format("YYYYMMDD") });
      if (bDebug2)
        console.log(`%cHistory:_exists ${dtDate.format("YYYYMMDD")} in db ? ${_r2 === void 0 ? false : true}`, APP_DEBUG_STYLE);
      return _r2 === void 0 ? false : true;
    };
    const _getSessionIndex = function(dtDate) {
      let bDebug2 = true;
      if (typeof dtDate === "string") {
        dtDate = dayjs(dtDate);
      }
      assert(dtDate instanceof dayjs === true, "date must be a string or a dayjs object.", TypeError);
      if (dtDate.get("day") < dtDate.daysInMonth()) {
        dtDate = dtDate.endOf("month");
      }
      if (bDebug2 === true)
        console.log(`%cSearch in history session cache data for id: ${dtDate.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      if (_exists(dtDate) === true) {
        _r = _HistoryDb.find({ id: +dtDate.format("YYYYMMDD") });
        if (typeof _r.index !== void 0) {
          return _r.index;
        }
        throw new Error("_getSessionIndex() failed reason : property index is unknown");
      }
      return -1;
    };
    const _getNearestSessionIndex = function(dtDate) {
      let bDebug2 = false;
      if (typeof dtDate === "string") {
        dtDate = dayjs(dtDate);
      }
      assert(dtDate instanceof dayjs === true, "date must be a string or a dayjs object.", TypeError);
      if (bDebug2 === true)
        console.log(`%cSearch in history session cache NEAREST cached data for id: ${dtDate.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
      let _iBaseDay = +dtDate.format("YYYYMMDD");
      let _r2 = _HistoryDb.getAll();
      if (_r2.length === 0) {
        if (bDebug2 === true)
          console.log("%cHistory session cache is empty", APP_DEBUG_STYLE);
        return -1;
      }
      _r2 = _r2.map((i2) => +i2.id - _iBaseDay).filter((i2) => i2 > 0);
      const min = (arr) => Math.min(...arr);
      if (_r2.length == 0) {
        if (bDebug2 === true)
          console.log("%cAll indexes  %o are later than your date:%s", APP_DEBUG_STYLE, _HistoryDb.getAll(), dtDate.format("DD/MM/YYYY"));
        return -1;
      }
      let _needle = min(_r2) + _iBaseDay;
      if (bDebug2 === true)
        console.log("%cNearest data in history session cache is data with id: %o", APP_DEBUG_STYLE, _needle);
      if (_exists(_needle) === true) {
        _r2 = _HistoryDb.find({ id: +_needle.format("YYYYMMDD") });
        if (typeof _r2.index !== void 0) {
          return _r2.index;
        }
        throw new Error("[History._getNearestSessionIndex()] failed reason : property index is unknown");
      }
      return -1;
    };
    const getSameOrNearestSessionIndex = function(dtDate) {
      let _r2 = _getSessionIndex(dtDate);
      if (_r2 === -1) {
        _r2 = _getNearestSessionIndex(dtDate);
      }
      return _r2;
    };
    const remove = function(dtFrom2 = null, dtTo2 = null) {
      if (typeof dtFrom2 === "string") {
        dtFrom2 = dayjs(dtFrom2);
      }
      if (typeof dtTo2 === "string") {
        dtTo2 = dayjs(dtTo2);
      }
      let fn_filter = function() {
      };
      if (dtFrom2 !== null && dtTo2 !== null) {
        fn_filter = function(o) {
          return dayjs(o.id.toString(10)).isBetween(dtFrom2, dtTo2, "day", "[]");
        };
      }
      if (dtFrom2 == null && dtTo2 !== null) {
        fn_filter = function(o) {
          return dayjs(o.id.toString(10)).isBefore(dtTo2, "day");
        };
      }
      if (dtFrom2 != null && dtTo2 == null) {
        fn_filter = function(o) {
          return dayjs(o.id.toString(10)).isAfter(dtFrom2, "day");
        };
      }
      return _HistoryDb.remove(fn_filter);
    };
    const reset = function() {
      return _HistoryDb.reset();
    };
    const setSessionIndex = function(dtDate, index = 0) {
      if (typeof dtDate === "string") {
        dtDate = dayjs(dtDate);
      }
      assert(dtDate instanceof dayjs === true, "date must be a string or a dayjs object.", TypeError);
      if (dtDate.get("day") < dtDate.daysInMonth()) {
        dtDate = dtDate.endOf("month");
      }
      let _r2 = _getSessionIndex(dtDate);
      if (_r2 == -1) {
        _r2 = _HistoryDb.insert({ id: +dtDate.format("YYYYMMDD"), index });
      } else {
        _r2 = _HistoryDb.update({ id: +dtDate.format("YYYYMMDD") }, { index });
      }
      return _r2;
    };
    return Object.freeze({
      tbl_name: TBL_NAME,
      getSameOrNearestSessionIndex,
      remove,
      reset,
      setSessionIndex
    });
  };
  var History = fHistory();
  var history_default = History;

  // src/sessions.js
  var SessionData = tcomb_neutral_default.struct({
    id: tcomb_neutral_default.String,
    cid: tcomb_neutral_default.maybe(tcomb_neutral_default.Integer),
    who_id: tcomb_neutral_default.String,
    who_name: tcomb_neutral_default.String,
    type: tcomb_neutral_default.String,
    lvl: tcomb_neutral_default.Integer,
    when: tcomb_neutral_default.Date,
    path: tcomb_neutral_default.String,
    funding: tcomb_neutral_default.String
  }, "SessionData");
  SessionData.prototype.ocmapper = function(o) {
  };
  var _Session = class {
    static getBetween(dtFrom2, dtTo2) {
      if (typeof dtFrom2 === "string") {
        dtFrom2 = dayjs(dtFrom2);
      }
      ;
      if (typeof dtTo2 === "string") {
        dtFrom2 = dayjs(dtTo2);
      }
      ;
      let db = src_default.Cfg.dbase;
      let _r2 = db.get(_Session.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo2, "day") && dayjs(v.when).isSameOrAfter(dtFrom2, "day")).value();
      return _r2;
    }
  };
  var Session = _Session;
  __publicField(Session, "tbl_name", "sessions");
  __publicField(Session, "_checkObject", function(oSession2) {
    let bDebug2 = false;
    if (bDebug2 === true)
      console.log("%cChecking object session:%o ", APP_DEBUG_STYLE, oSession2);
    assert(typeof oSession2.id === "string", "Session object id need to be a string.", TypeError);
    assert(typeof oSession2.cid === "number", "Session object cid need to be a number.", TypeError);
    assert(typeof oSession2.who_id === "string", "Session object who_id need to be a string.", TypeError);
    assert(typeof oSession2.who_name === "string", "Session object who_name need to be a string.", TypeError);
    assert(typeof oSession2.status === "string", "Session object status need to be a string.", TypeError);
    assert(typeof oSession2.type === "string", "Session object type need to be a string.", TypeError);
    assert(typeof oSession2.lvl === "string", "Session object lvl need to be a string.", TypeError);
    assert(typeof oSession2.when === "string", "Session object when need to be a string.", TypeError);
    assert(typeof oSession2.path === "string", "Session object path need to be a string.", TypeError);
    assert(typeof oSession2.funding === "string", "Session object funding need to be a string.", TypeError);
  });
  __publicField(Session, "add", async function(oSession2) {
    const iRefreshStudentDataBaseTreshold = 30;
    let bDebug2 = true;
    if (bDebug2 === true)
      console.log("%cSession.add() so you wanna add a session %o to database", APP_DEBUG_STYLE, oSession2);
    let db = src_default.Cfg.dbase;
    if (GM_config.get("checksessionalreadyexists") === true) {
      var bCheckExistsBeforAdd = true;
    }
    if (bDebug2 === true)
      console.log("%cSession.add() will search if session %o is already in database", APP_DEBUG_STYLE, oSession2);
    if (oSession2.id.length > 0) {
      if (bCheckExistsBeforAdd === true && _Session.exists(oSession2.id) === true) {
        if (bDebug2 === true)
          console.info(`%cSession.add() session id:${oSession2.id} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
        return;
      }
    } else {
      if (bCheckExistsBeforAdd === true && _Session.exists(oSession2.cid) === true) {
        if (bDebug2 === true)
          console.info(`%cSession.add() session cid:${oSession2.cid} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
        return;
      }
    }
    if (oSession2.type.toLowerCase() === "presentation") {
      oSession2.type = "soutenance";
    }
    if (core_default.isInOldMode(dayjs(oSession2.when))) {
      oSession2.funding = OC_FUNDED;
      if (oSession2.type.toLowerCase() === "soutenance") {
        oSession2.path = "n/a (defense)";
      } else {
        oSession2.path = "n/a (old mode)";
      }
    } else {
      if (oSession2.type.toLowerCase() === "soutenance") {
        oSession2.funding = OC_FUNDED;
        oSession2.path = "n/a (defense)";
      } else {
        if (students_default.exists(oSession2.who_id) === false) {
          console.warn("%cStudent %s not in Db, will updating student db by fetching students list from dashboard", APP_WARN_STYLE, oSession2.who_id);
          if (bDebug2 === true)
            console.log("%cLast Update of Student BDD was %i min ago", APP_DEBUG_STYLE, dayjs(meta_default.getStudentListUpd()).diff(dayjs(), "m"));
          if (dayjs(meta_default.getStudentListUpd()).diff(dayjs(), "m") < -iRefreshStudentDataBaseTreshold) {
            await students_default.getAll();
            meta_default.setStudentListUpd(dayjs().toISOString());
          } else {
            console.log("%c[Session.add()]last Update of database DB was less than %i min ago", APP_DEBUG_STYLE, iRefreshStudentDataBaseTreshold);
            await students_default.createManually(oSession2.who_id, oSession2.who_name, oSession2.when);
            if (moize.default.isMoized(students_default.m_findById) && students_default.m_findById.has([oSession2.who_id, null])) {
              students_default.m_findById.remove([oSession2.who_id, null]);
              if (bDebug2 === true)
                console.log("%c[Session.add()]student %s removed from the m_findById function cache", APP_DEBUG_STYLE, oSession2.who_id);
            }
          }
          console.log("%c[Student.add()] pr\xE9c\xE9demment notre \xE9tudiant %o  n'existait pas existe t'il maintenant ?", APP_DEBUG_STYLE, oSession2.who_id);
          console.log("%c[Student.add()] la r\xE9ponse est :%o", APP_DEBUG_STYLE, students_default.exists(oSession2.who_id, oSession2.when));
          if (students_default.exists(oSession2.who_id, oSession2.when) == false) {
            console.warn(`%c[Session.add()] Student ${oSession2.who_id} which exists at ${oSession2.when} still not exit in Db, have to manually create him/her`, APP_WARN_STYLE);
            await students_default.createManually(oSession2.who_id, oSession2.who_name, oSession2.when);
            if (moize.default.isMoized(students_default.m_findById) && students_default.m_findById.has([oSession2.who_id, oSession2.when])) {
              students_default.m_findById.remove([oSession2.who_id, oSession2.when]);
              if (bDebug2 === true)
                console.log("%c[Session.add()]student %s removed from the m_findById function cache", APP_DEBUG_STYLE, oSession2.who_id);
            }
          }
        }
        oSession2.funding = await students_default.getFunding(oSession2.who_id, oSession2.when);
        oSession2.path = await students_default.getPath(oSession2.who_id, oSession2.when);
      }
    }
    if (oSession2.cid === void 0) {
      if (bDebug2 === true)
        console.log("%c[Session.add()] need to calculate a cid]", APP_DEBUG_STYLE);
      oSession2.cid = _Session.getHashId(oSession2.when, oSession2.who_id);
    }
    if (bDebug2 === true)
      console.log("%cSession.add() calculated id:%s", APP_DEBUG_STYLE, oSession2.cid);
    _r = refs_default.getByKey(oSession2.cid, 2, refs_default.TYPE.SESSIONID_DATEREFID);
    if (_r !== void 0) {
      if (bDebug2 === true)
        console.log("%cSession.add() I've found a ref %d by using key (%s)%d", APP_DEBUG_STYLE, _r.key1, typeof oSession2.cid, oSession2.cid);
      oSession2.id = _r.key1.toString();
    }
    _Session._save(oSession2);
  });
  __publicField(Session, "_save", function(oSession2) {
    var dDebug = false;
    _Session._checkObject(oSession2);
    if (oSession2.lvl == "") {
      oSession2.lvl = "2";
    }
    oSession2.lvl.lvl = parseInt(oSession2.lvl.lvl, 10);
    if (bDebug === true)
      console.log(`%c[Session._save()] saving session id:${oSession2.id} of ${oSession2.who_name}[cid:${oSession2.cid}](${oSession2.who_id}) at ${oSession2.when} to DB`, APP_DEBUG_STYLE);
    let db = src_default.Cfg.dbase;
    db.get(_Session.tbl_name).push(JSON.parse(JSON.stringify(oSession2))).write();
  });
  __publicField(Session, "exists", function(sessionId) {
    let db = src_default.Cfg.dbase;
    var bDebug2 = false;
    if (bDebug2 === true)
      console.log(`%c[Session.exist()] will search existence of session id:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
    var _r2 = _Session.findById(sessionId);
    if (_r2 === void 0) {
      return false;
    } else {
      return true;
    }
  });
  __publicField(Session, "findById", function(sessionId) {
    let db = src_default.Cfg.dbase;
    var _r2 = db.get(_Session.tbl_name).find({ id: sessionId }).value();
    if (_r2 === void 0) {
      _r2 = db.get(_Session.tbl_name).find({ cid: sessionId }).value();
      return _r2;
    }
    return _r2;
  });
  __publicField(Session, "delete", function(dtFrom2 = null, dtTo2 = null) {
    let db = src_default.Cfg.dbase;
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dtFrom2.format("YYYY-MM-DD");
    }
    if (typeof dtTo2 === "string") {
      dtTo2 = dtTo2.format("YYYY-MM-DD");
    }
    if (dtFrom2 === null && dtTo2 == null) {
      console.log(`%cWanna suppress ALL Sessions from DB`, APP_DEBUG_STYLE);
      db.get(_Session.tbl_name).remove().write();
      return;
    }
    if (dtTo2 == null) {
      db.get(_Session.tbl_name).remove(function(o) {
        return dayjs(o.when).isBefore(dtTo2), "day";
      }).write();
      return;
    }
    if (dtFrom2 == null) {
      db.get(_Session.tbl_name).remove(function(o) {
        return dayjs(o.when).isAfter(dtFrom2, "day");
      }).write();
      return;
    }
    db.get(_Session.tbl_name).remove(function(o) {
      return dayjs(o.when).isBetween(dtFrom2, dtTo2, "day", "[]");
    }).write();
  });
  __publicField(Session, "deleteById", function(sId) {
    let db = src_default.Cfg.dbase;
    db.get("sessions").remove((o) => o.id === sId).write();
    console.log(`%cSession ${sId} suppressed from DB`, APP_DEBUG_STYLE);
  });
  __publicField(Session, "parseTable", function(oEl) {
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
    var me = { id: sId, when: sWhen, who_id: iWho, who_name: sWho, status: sStatus, type: sType2, lvl: sLvl };
    return me;
  });
  __publicField(Session, "getHashId", function(sDate, sId) {
    if (sDate instanceof dayjs) {
      sDate = sDate.toISOString();
    }
    if (typeof sId === "number") {
      sId = sId.toString(10);
    }
    assert(typeof sDate === "string" && typeof sId === "string", "getId need two string", TypeError);
    return cyrb53(sDate + sId);
  });
  __publicField(Session, "parseRow", function(oRow) {
    let bDebug2 = true;
    if (bDebug2 === true)
      console.log("%cparseRow() Row is %o", APP_DEBUG_STYLE, oRow);
    var sType2 = oRow.children[0].innerText.length > 0 ? oRow.children[0].innerText.trim().toLowerCase() : "session";
    var sStatus = oRow.children[0].querySelector("svg").getAttribute("aria-label").trim().toLowerCase();
    var sWhen = oRow.children[1].querySelector("time").dateTime;
    sWhen = dayjs(sWhen).toISOString();
    var iWho = getKey(oRow.children[2], -2);
    var sWho = oRow.children[2].innerText.trim();
    var iId = _Session.getHashId(sWhen, iWho);
    var sLvl = oRow.children[3].innerText.trim();
    sLvl = sLvl.replace(/[^\d]/gmis, "");
    var me = { id: "", cid: iId, when: sWhen, who_id: iWho, who_name: sWho, status: sStatus, type: sType2, lvl: sLvl };
    return me;
  });
  __publicField(Session, "getSessionsFromAPI", async function(dtFrom2, dtTo2) {
    let bDebug2 = false;
    let iMaxLoop = 999;
    let iLoop = 0;
    let bBrowse = true;
    let iIndexStart = 0;
    let iMaxOfItems = 20;
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dayjs(dtFrom2);
    }
    assert(dtFrom2 instanceof dayjs === true, "dtFrom must be a string or a dayjs object.", TypeError);
    if (typeof dtTo2 === "string") {
      dtTo2 = dayjs(dtTo2);
    }
    assert(dtTo2 instanceof dayjs === true, "dtTo must be a string or a dayjs object.", TypeError);
    let _r2 = history_default.getSameOrNearestSessionIndex(dtTo2);
    if (_r2 !== void 0 && typeof _r2 === "number" && _r2 > iIndexStart) {
      iIndexStart = _r2;
    }
    var _iDaysToProcess = dtTo2.diff(dtFrom2, "d") + 1;
    NProgress.start();
    while (bBrowse === true) {
      if (iLoop > iMaxLoop) {
        console.error("%c[Session.getSessionsFromAPI()] EMERGENCY EXIT LOOP", APP_ERROR_STYLE);
        break;
      }
      iLoop += 1;
      var iIndexEnd = iIndexStart + (iMaxOfItems - 1);
      var aSessions = await api_openclassrooms_default.getHistorySession([], iIndexStart, iIndexEnd);
      if (aSessions === null) {
        throw new Error("Api.getHistorySession is null");
      }
      var oSessions = JSON.parse(aSessions);
      if (oSessions.errors) {
        Object.entries(oSession.errors).forEach((i2) => console.log("%cApi.getHistorySession send us some errors : %s", APP_WARN_STYLE, i2[1].message));
        throw new Error("Api.getHistorySession send us some errors ");
      }
      if (bDebug2 === true)
        console.log("%cgetSessionsFromAPI() Sessions are %o", APP_DEBUG_STYLE, oSessions);
      iIndexStart = iIndexEnd + 1;
      oSession = _Session.parseRowFromApi(oSessions[oSessions.length - 1]);
      console.log("%c[Session.getSessionsFromAPI()]La derni\xE8re session r\xE9cuper\xE9e par api date de:%s et nous collectons les sessions entre %s et %s", APP_DEBUG_STYLE, dayjs(oSession.when).format("DD/MM/YYYY"), dayjs(dtFrom2).format("DD/MM/YYYY"), dayjs(dtTo2).format("DD/MM/YYYY"));
      if (bDebug2 === true)
        console.log("%cgetSessionsFromAPI() last session of loaded page is %o", APP_DEBUG_STYLE, oSession);
      console.log("%c[Session.getSessionsFromAPI()] compare last session date %s avec la date de d\xE9but %s est ce ant\xE9rieur  %o", APP_DEBUG_STYLE, dayjs(oSession.when).format("DD/MM/YYYY"), dayjs(dtFrom2).format("DD/MM/YYYY"), dayjs(oSession.when).isBefore(dtFrom2));
      if (dayjs(oSession.when).isBefore(dtFrom2) === true) {
        bBrowse = false;
        if (bDebug2 === true)
          console.log("%cgetSessionsFromAPI() last session is before start date of parsing %s STOP browsing....", APP_DEBUG_STYLE, dayjs(oSession.dtFrom).format("DD/MM/YYYY"));
        history_default.setSessionIndex(oSession.when, iIndexStart);
      }
      let oSessionsFinal = oSessions.filter((o) => dayjs(o.sessionDate).isBetween(dtFrom2, dtTo2, "day", "[]"));
      if (bDebug2 === true)
        console.log("%cgetSessionsFromAPI() Filtered on date Sessions are %o", APP_DEBUG_STYLE, oSessionsFinal);
      for (const o of oSessionsFinal) {
        oSession = _Session.parseRowFromApi(o);
        if (bDebug2 === true)
          console.log("%cgetSessionsFromAPI()  will call Session.add() on %o", APP_DEBUG_STYLE, oSession);
        const _r3 = await _Session.add(oSession);
        var _iDaysProcessed = dayjs(dtTo2).diff(oSession.when, "d") + 1;
        NProgress.set(_iDaysProcessed / _iDaysToProcess);
      }
      iIndexStart = iIndexEnd + 1;
    }
    NProgress.done();
    await toastOk(`Collecte des sessions du ${dtFrom2.format("DD/MM/YYYY")} au ${dtTo2.format("DD/MM/YYYY")} termin\xE9e`);
  });
  __publicField(Session, "parseRowFromApi", function(oSession2) {
    bDebug = false;
    if (bDebug === true)
      console.log("%cparseRowFromApi() oSession is %o", APP_DEBUG_STYLE, oSession2);
    let oDBSession = {};
    oDBSession.id = "";
    oDBSession.who_id = oSession2.recipient.id;
    if (typeof oDBSession.who_id == "number") {
      oDBSession.who_id = oDBSession.who_id.toString(10);
    }
    oDBSession.who_name = oSession2.recipient.displayableName;
    if (oSession2.status === OC_API_SESSION_STATUS_0) {
      oDBSession.status = OC_STATUS_0;
    }
    if (oSession2.status === OC_API_SESSION_STATUS_1) {
      oDBSession.status = OC_STATUS_1;
    }
    if (oSession2.status === OC_API_SESSION_STATUS_2) {
      oDBSession.status = OC_STATUS_2;
    }
    if (oSession2.status === OC_API_SESSION_STATUS_3) {
      oDBSession.status = OC_STATUS_3_M;
    }
    if (oDBSession.status === void 0)
      oDBSession.status = oSession2.status;
    oDBSession.type = oSession2.type;
    if (oDBSession.type.toLowerCase() === "mentoring")
      oDBSession.type = "mentorat";
    oDBSession.lvl = oSession2.projectLevel;
    if (oDBSession.lvl == null) {
      oDBSession.lvl = "";
    }
    oDBSession.when = dayjs(oSession2.sessionDate).toISOString();
    oDBSession.path = null;
    oDBSession.funding = null;
    oDBSession.cid = _Session.getHashId(oDBSession.when, oDBSession.who_id);
    return oDBSession;
  });
  var sessions_default = Session;

  // src/accounting.js
  var _Accounting = class {
  };
  var Accounting = _Accounting;
  __publicField(Accounting, "calculateBill", function(dtFrom2, dtTo2) {
    let sArchiveId = dtTo2.format("YYYYMM");
    if (archives_default.exists(sArchiveId) === true) {
      console.log(`%cUse Archived version ${sArchiveId} of accounting`, APP_DEBUG_STYLE);
      let _r2 = archives_default.get(sArchiveId);
      return _r2.data;
    }
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dtFrom2.format("YYYY-MM-DD");
    }
    if (typeof dtTo2 === "string") {
      dtTo2 = dtTo2.format("YYYY-MM-DD");
    }
    return _Accounting.m_calculateBill(dtFrom2, dtTo2);
  });
  __publicField(Accounting, "_calculateBill", function(dtFrom2, dtTo2) {
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dayjs(dtFrom2);
    }
    if (typeof dtTo2 === "string") {
      dtTo2 = dayjs(dtTo2);
    }
    const now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
    var _1 = 0, _2 = 0;
    var t0 = performance.now();
    const db = src_default.Cfg.dbase;
    const dbSessions = db.get(sessions_default.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo2, "day") && dayjs(v.when).isSameOrAfter(dtFrom2, "day"));
    const oSessions = dbSessions.value();
    const iSessionsNumber = oSessions.length;
    let oMeta = { from: dtFrom2, to: dtTo2, created_at: null, maxLevel: OC_MAX_LEVEL, number: 0, amount: 0, errors: { funding: [], level: [], path: [], status: [], type: [] }, flatFee: [] };
    let iNumber = 0;
    let iAmount = 0;
    let aBonus = [];
    _1 = performance.now();
    const aPu = _Accounting.getPriceList(dtFrom2);
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
      if (oTheSession.type.toLowerCase() === "mentorat")
        iType = TYPE_MENTORAT;
      if (oTheSession.type.toLowerCase() === "soutenance")
        iType = TYPE_DEFENSE;
      if (oTheSession.path != void 0 && oTheSession.path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && oTheSession.type !== "soutenance")
        iType = TYPE_COACHING;
      var iFunding = 0;
      const bIsInOldMode = core_default.isInOldMode(dtFrom2);
      if (bIsInOldMode === true) {
        iFunding = oTheSession.isFunded === true ? BILL_FUNDED : BILL_AUTOFUNDED;
      }
      if (oTheSession.funding === OC_AUTOFUNDED)
        iFunding = BILL_AUTOFUNDED;
      if (oTheSession.funding === OC_FUNDED)
        iFunding = BILL_FUNDED;
      if (oTheSession.funding === OC_OTHER)
        iFunding = BILL_OTHER;
      if (oTheSession.lvl == "") {
        oMeta.errors.level.push(oTheSession);
        continue;
      }
      if (typeof oTheSession.lvl === "string") {
        oTheSession.lvl = parseInt(oTheSession.lvl, 10);
      }
      if (oTheSession.lvl < 0) {
        oMeta.errors.level.push(oTheSession);
        continue;
      }
      if (bIsInOldMode === false && oTheSession.funding !== OC_AUTOFUNDED && oTheSession.funding !== OC_FUNDED && oTheSession.funding !== OC_OTHER) {
        oMeta.errors.funding.push(oTheSession);
        continue;
      }
      if (oTheSession.type.toLowerCase() !== "session" && oTheSession.type.toLowerCase() !== "mentorat" && iType !== TYPE_DEFENSE && iType !== TYPE_COACHING) {
        oMeta.errors.type.push(oTheSession);
        continue;
      }
      if (oTheSession.status !== OC_STATUS_0 && oTheSession.status !== OC_STATUS_1 && oTheSession.status !== OC_STATUS_2 && oTheSession.status !== OC_STATUS_3_M && oTheSession.status !== OC_STATUS_3_F) {
        oMeta.errors.status.push(oTheSession);
        continue;
      }
      let toUpdate = theSessionsMatrix.get(iType, iStatus, iFunding, +oTheSession.lvl);
      if (toUpdate === void 0) {
        toUpdate = { number: 0, amount: 0, data: [] };
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
      if (iType === TYPE_SESSION && iFunding === BILL_AUTOFUNDED && oTheSession.status !== OC_STATUS_1) {
        aBonus.push({ id: +oTheSession.who_id, who_id: oTheSession.who_id, who_name: oTheSession.who_name });
      }
    }
    var oBonus = [];
    _1 = performance.now();
    oBonus = _.uniqBy(aBonus, "id");
    oMeta.flatFee = oBonus;
    oMeta.number = iNumber;
    oMeta.amount = iAmount;
    if (oMeta.number + oMeta.errors.funding.length + oMeta.errors.level.length + oMeta.errors.path.length + oMeta.errors.status.length + oMeta.errors.type.length < iSessionsNumber) {
      console.log(`%cError total number of sessions is ${iSessionsNumber} and total number of sessions in bill ${iNumber} + all errors are different`, APP_ERROR_STYLE);
      console.log("errors are", oMeta.errors);
      console.log("sessions are", oSessions);
    }
    oMeta.created_at = now;
    theSessionsMatrix.set(0, 0, 0, 0, oMeta);
    var t666 = performance.now();
    console.log("%cFunction took " + (t666 - t0) + " milliseconds.", APP_PERF_STYLE);
    if (oMeta.errors.funding.length + oMeta.errors.level.length + oMeta.errors.path.length + oMeta.errors.status.length + oMeta.errors.type.length > 0) {
      console.log("%cWarning some errors found %o", APP_WARN_STYLE, oMeta.errors);
    }
    return theSessionsMatrix;
  });
  __publicField(Accounting, "m_calculateBill", moize.default(_Accounting._calculateBill, {
    maxAge: 12e4,
    isSerialized: true
  }));
  __publicField(Accounting, "getPriceList", function(dtFrom2) {
    if (typeof dtFrom2 === "string") {
      dtFrom2 = dayjs(dtFrom2);
    }
    ;
    var aPrice = [0, OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6];
    const bIsInOldMode = core_default.isInOldMode(dtFrom2);
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
  });
  var accounting_default = Accounting;

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
  var List = class {
  };
  __publicField(List, "detail_bill", "truc");
  __publicField(List, "getListDetailBill", function(dtFrom2, dtTo2) {
    let db = src_default.Cfg.dbase;
    let _r2 = db.get(sessions_default.tbl_name).filter((v) => dayjs(v.when).isSameOrBefore(dtTo2, "day") && dayjs(v.when).isSameOrAfter(dtFrom2, "day")).sortBy(function(o) {
      return dayjs(o.when).valueOf();
    }).value();
    const dtNewMode = core_default.getOldModeDate();
    let aPu_before = accounting_default.getPriceList(dtNewMode.subtract(1, "day"));
    let aPu_after = accounting_default.getPriceList(dtNewMode);
    let iCumul = 0;
    var _rClone = _.cloneDeep(_r2);
    for (var i2 in _rClone) {
      var iPu2 = 0;
      var iFPu = 0;
      var bOldMode = true;
      var iStatus = 0;
      if (_rClone[i2].status === OC_STATUS_0)
        iStatus = SESSION_DONE;
      if (_rClone[i2].status === OC_STATUS_1)
        iStatus = SESSION_CANCEL;
      if (_rClone[i2].status === OC_STATUS_2)
        iStatus = SESSION_CANCEL_LATE;
      if (_rClone[i2].status === OC_STATUS_3_M || _rClone[i2].status === OC_STATUS_3_F)
        iStatus = SESSION_STUDENT_AWAY;
      var iType = 0;
      if (_rClone[i2].type.toLowerCase() === "session")
        iType = TYPE_SESSION;
      if (_rClone[i2].type.toLowerCase() === "soutenance")
        iType = TYPE_DEFENSE;
      if (_rClone[i2].path != void 0 && _rClone[i2].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _rClone[i2].type !== "soutenance")
        iType = TYPE_COACHING;
      var iFunding = 0;
      if (_rClone[i2].funding === OC_AUTOFUNDED)
        iFunding = BILL_AUTOFUNDED;
      if (_rClone[i2].funding === OC_FUNDED)
        iFunding = BILL_FUNDED;
      if (_rClone[i2].funding === OC_OTHER)
        iFunding = BILL_OTHER;
      if (core_default.isInOldMode(dayjs(_rClone[i2].when))) {
        iPu2 = +_rClone[i2].lvl > 0 ? aPu_before[+_rClone[i2].lvl][iType][iStatus][iFunding] : 0;
      } else {
        bOldMode = false;
        iPu2 = +_rClone[i2].lvl > 0 ? aPu_after[+_rClone[i2].lvl][iType][iStatus][iFunding] : 0;
      }
      iCumul += iPu2;
      _rClone[i2].iPu = iPu2;
      _rClone[i2].oldMode = bOldMode;
      _rClone[i2].iCumul = iCumul;
    }
    return _rClone;
  });
  __publicField(List, "getListStatistic", function(dtFrom2, dtTo2) {
    let dtCurFrom = dtFrom2.clone();
    let dtCurTo = dtCurFrom.endOf("month");
    let aData = [];
    let aStat = [];
    let _m = 0;
    let _iMaxIndex = dtTo2.diff(dtFrom2, "month");
    var t0 = performance.now();
    while (dtCurFrom.isSameOrBefore(dtTo2, "day")) {
      aData.push(accounting_default.calculateBill(dtCurFrom, dtCurTo));
      dtCurFrom = dtCurFrom.add(1, "month");
      dtCurTo = dtCurFrom.endOf("month");
    }
    var t1 = performance.now();
    console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    dtCurFrom = dtFrom2.clone();
    dtCurTo = dtCurFrom.endOf("month");
    let _i02 = 0, _i1 = 0, _i2 = 0, _qs = 0, _ms = 0, _qsc = 0, _msc = 0;
    while (_m <= _iMaxIndex) {
      const oMeta = aData[_m].get(0, 0, 0, 0);
      const iCurrentMaxLevel = oMeta.maxLevel;
      aStat[_m] = {
        header: { dtFrom: null, dtTo: null, created_at: null },
        sessions: { total: 0, nb: 0, pu: 0, nbc: 0 },
        defenses: { total: 0, nb: 0, pu: 0, nbc: 0 },
        coaches: { total: 0, nb: 0, pu: 0, nbc: 0 },
        bonus: 0,
        kpi: { jrs: 0, hrs: 0, hrsp: 0 }
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
        aStat[_m].sessions = { total: _ms + cTotal, nb: _qs + cNb, pu: (_ms + cTotal) / (_qs + cNb), nbc: _qsc + cNbc };
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
        aStat[_m].defenses = { total: _ms + cTotal, nb: _qs + cNb, pu: (_ms + cTotal) / (_qs + cNb), nbc: _qsc + cNbc };
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
        aStat[_m].coaches = { total: _ms + cTotal, nb: _qs + cNb, pu: (_ms + cTotal) / (_qs + cNb), nbc: _qsc + cNbc };
        _l2 += 1;
      }
      let iFlatFeeNumber = oMeta.flatFee.length;
      for (var t = 0; t < iFlatFeeNumber; t += 1) {
        aStat[_m].bonus += 30;
      }
      if (dtCurTo.isAfter(dtTo2, "day"))
        dtCurTo = dtTo2.clone();
      aStat[_m].kpi.jrs = workday_count(dtCurFrom, dtCurTo);
      aStat[_m].header.dtFrom = dtCurFrom.format("YYYY-MM-DD");
      aStat[_m].header.dtTo = dtCurTo.format("YYYY-MM-DD");
      aStat[_m].header.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
      dtCurFrom = dtCurFrom.add(1, "month");
      dtCurTo = dtCurFrom.endOf("month");
      _m += 1;
    }
    return aStat;
  });
  __publicField(List, "getListStatisticOld", function(dtFrom2, dtTo2) {
    let dtCurFrom = dtFrom2.clone();
    let dtCurTo = dtCurFrom.endOf("month");
    let aData = [];
    let aStat = [];
    let _iMaxIndex = dtTo2.get("month") - dtFrom2.get("month");
    var t0 = performance.now();
    while (dtCurFrom.isSameOrBefore(dtTo2, "day")) {
      aData.push(accounting_default.calculateBill(dtCurFrom, dtCurTo));
      dtCurFrom = dtCurFrom.add(1, "month");
      dtCurTo = dtCurFrom.endOf("month");
    }
    var t1 = performance.now();
    console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    let _m = 0;
    dtCurFrom = dtFrom2.clone();
    dtCurTo = dtCurFrom.endOf("month");
    console.log(aData);
    while (_m <= _iMaxIndex) {
      let iCurrentMaxLevel = aData[_m][0].max_level;
      aStat[_m] = {
        header: { dtFrom: null, dtTo: null, created_at: null },
        sessions: { total: 0, nb: 0, pu: 0, nbc: 0 },
        defenses: { total: 0, nb: 0, pu: 0, nbc: 0 },
        coaches: { total: 0, nb: 0, pu: 0, nbc: 0 },
        bonus: 0,
        kpi: { jrs: 0, hrs: 0, hrsp: 0 }
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
      if (dtCurTo.isAfter(dtTo2, "day"))
        dtCurTo = dtTo2.clone();
      aStat[_m].kpi.jrs = workday_count(dtCurFrom, dtCurTo);
      aStat[_m].header.dtFrom = dtCurFrom.format("YYYY-MM-DD");
      aStat[_m].header.dtTo = dtCurTo.format("YYYY-MM-DD");
      aStat[_m].header.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
      dtCurFrom = dtCurFrom.add(1, "month");
      dtCurTo = dtCurFrom.endOf("month");
      _m += 1;
    }
    return aStat;
  });
  var lists_default = List;

  // src/pdf.js
  var PDF = class {
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
  };
  __publicField(PDF, "addFooter", async function(doc, sLeft, options = {}) {
    const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
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
        const { width, height } = page.getSize();
        const iBoxHeigth = iFontSize + 2 * iBorderWidth + iPaddingTop + iPaddingBottom;
        page.moveTo(iMarginLeft + iPaddingLeft, iFontSize + iPaddingBottom);
        page.setFont(timesRomanFont);
        page.setFontSize(iFontSize);
        page.setFontColor(rgb(1, 0, 0));
        if (sLeft !== void 0) {
          page.drawText(`${sLeft}`);
        }
        page.drawText(`page ${idx + 1} / ${pageCnt}`, { x: width - iTextRigthSz - iPaddingRigth });
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
  });
  var pdf_default = PDF;

  // src/update_database.js
  var maj_1_00_0006 = async function() {
    let db = src_default.Cfg.dbase;
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
        html: "<p>Cette migration va corriger la base et ajouter les nouveaux champs n\xE9cessaires, l`interrpuption du traitement est sans danger (mais ce n' est pas une raison !)</p>"
      },
      {
        title: "Correction de la table \xE9tudiant",
        html: "<p>Correction de la liste des \xE9tudiants (who_id)",
        onOpen: async function(modal) {
          console.log("%cMigration table des \xE9tudiants correction du who_id", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom3 = dayjs("2020-06-01");
          var oListStudents = db.get("students");
          var aListStudents2 = oListStudents.value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom3, "day"));
          var iSize = oListStudents.size().value();
          var sContent = Swal.getContent().textContent;
          for (i2 = 0; i2 < iSize; i2 += 1) {
            var r3 = aListSessionsSinceJune2.find((v) => v.who_name === aListStudents2[i2].fullname).value();
            if (r3 !== void 0)
              oListStudents.get(i2).assign({ who_id: r3.who_id }).write();
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i2}/${aListStudents2.length}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement termin\xE9 : ${aListStudents2.length}/${aListStudents2.length}`;
        }
      },
      {
        title: "Correction de la table \xE9tudiant",
        html: "<p>Correction de la liste des \xE9tudiants funded devient funding</p>",
        onOpen: async function(modal) {
          console.log("%cMigration : table des \xE9tudiants suppression de l'ancien champs et ajout du champs funding", APP_DEBUG_STYLE);
          Swal.showLoading();
          var oListStudents = db.get("students");
          var iSize = oListStudents.size().value();
          var sContent = Swal.getContent().textContent;
          for (var i3 = 0; i3 < iSize; i3 += 1) {
            var _r3 = oListStudents.get(i3).value().fundedby;
            if (_r3 === void 0) {
              console.log("%cStudent ${oListStudents.get(i).who_name} already converted, skip it", APP_DEBUG_STYLE);
              continue;
            }
            oListStudents.get(i3).unset(["fundedby"]).assign({ "funding": _r3 }).write();
            console.log("%cStudent ${oListStudents.get(i).who_name} create field funding and remove fundedby", APP_DEBUG_STYLE);
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i3}/${iSize}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement termin\xE9 : ${iSize}/${iSize}`;
        }
      },
      {
        title: "Correction table Etudiants",
        html: "<p>Correction de la liste des sessions, ajout du path dans la session</p>",
        onOpen: async function(modal) {
          console.log("%cMigration table des sessions correction de id_who", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom3 = dayjs("2020-06-01");
          var oListStudents = db.get("students");
          var aListStudents2 = oListStudents.value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom3, "day"));
          var aListToUpdate2 = aListSessionsSinceJune2.filter((v) => v.type != "soutenance").value();
          var sContent = Swal.getContent().textContent;
          for (i2 = 0; i2 < aListToUpdate2.length; i2 += 1) {
            var _r3 = oListStudents.find({ who_id: aListToUpdate2[i2].who_id }).value();
            console.log("found", _r3);
            var data2 = _r3 !== void 0 && _r3.path.length > 0 ? _r3.path : "0-unknown";
            db.get("sessions").find({ id: aListToUpdate2[i2].id }).assign({ path: data2 }).write();
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i2}/${aListToUpdate2.length}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement termin\xE9 : ${i2}/${aListToUpdate2.length}`;
        }
      },
      {
        title: "Migration de la table des Sessions",
        html: '<p>Correction de la liste des sessions, suppression du champs "isFunded"</p>',
        onOpen: async function(modal) {
          console.log("%cMigration : table des sessions suppression de isFunded", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom3 = dayjs("2020-06-01");
          var aListStudents2 = db.get("students").value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom3, "day"));
          var sContent = Swal.getContent().textContent;
          for (var i3 = aListSessionsSinceJune2.value().length; i3 -= 1; ) {
            var _r3 = aListSessionsSinceJune2.get(i3);
            if (_r3.value().isFunded === void 0 || _r3.value().isFunded === void 0) {
              console.log(`%cSkip ${_r3.value()} already converted`, APP_DEBUG_STYLE);
            } else {
              _r3.unset(["isFunded"]).write();
            }
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : il reste ${i3} \xE9lements \xE0 convertir</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement en termin\xE9 : ${aListSessionsSinceJune2.value().length}/${aListSessionsSinceJune2.value().length}`;
        }
      },
      {
        title: "Migration de la table des Sessions",
        html: "<p>Correction de la liste des sessions, ajout de funding</p>",
        onOpen: async function(modal) {
          console.log("%cMigration : table des sessions ajout de fundedBy", APP_DEBUG_STYLE);
          Swal.showLoading();
          var dtFrom3 = dayjs("2020-06-01");
          var aListStudents2 = db.get("students").value();
          var aListSessionsSinceJune2 = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom3, "day"));
          var oListToUpdate2 = aListSessionsSinceJune2.filter((v) => v.type != "soutenance");
          var sContent = Swal.getContent().textContent;
          for (var i3 = oListToUpdate2.value().length; i3 -= 1; ) {
            var _r3 = oListToUpdate2.get(i3);
            if (_r3.value().funding !== void 0) {
              console.log(`%cSkip ${_r3.value()} already converted`, APP_DEBUG_STYLE);
            } else {
              _r3.assign({ "funding": students_default.getFunding(_r3.value().who_id) }).write();
            }
            const content2 = Swal.getContent();
            content2.innerHTML = `${sContent}<br /><p>Traitement en cours : il rest ${i3}\xE9lements \xE0 convertir</p>`;
            await sleep(1);
          }
          var j = i3;
          var oListToUpdate2 = aListSessionsSinceJune2.filter((v) => v.type == "soutenance");
          for (var i3 = 0; i3 < oListToUpdate2.value().length; i3 += 1) {
            oListToUpdate2.get(i3).assign({ "funding": OC_FUNDED }).write();
            const content2 = Swal.getContent();
            if (content2 != void 0)
              content2.innerHTML = `${sContent}<br /><p>Traitement en cours : ${j + i3}/${aListSessionsSinceJune2.value().length}</p>`;
            await sleep(1);
          }
          Swal.hideLoading();
          const content = Swal.getContent();
          if (content != void 0)
            content.textContent = `Traitement termin\xE9 :  ${aListSessionsSinceJune2.value().length}/${aListSessionsSinceJune2.value().length}`;
        }
      }
    ]).then((result) => {
      if (result.value) {
        const answers = JSON.stringify(result.value);
        Swal.fire({
          title: "Traitement termin\xE9!",
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
    var dtFrom2 = dayjs("2020-06-01");
    var aListStudents = db.get("students").value();
    var aListSessionsSinceJune = db.get("sessions").filter((v) => dayjs(v.when).isSameOrAfter(dtFrom2, "day"));
    for (i2 = 0; i2 < aListStudents.length; i2 += 1) {
      var r2 = aListSessionsSinceJune.find((v) => v.who_name === aListStudents[i2].fullname).value();
      if (r2 !== void 0)
        db.get("students").find({ fullname: r2.who_name }).assign({ who_id: r2.who_id }).write();
    }
    var aListToUpdate = aListSessionsSinceJune.filter((v) => v.type != "soutenance").value();
    for (i2 = 0; i2 < aListToUpdate.length; i2 += 1) {
      var r2 = db.get("students").find({ who_id: aListToUpdate[i2].who_id }).value();
      var data = r2 !== void 0 && r2.path.length > 0 ? r2.path : "0-unknown";
      db.get("sessions").find({ id: aListToUpdate[i2].id }).assign({ path: data }).write();
    }
    for (var i2 = 0; i2 < aListSessionsSinceJune.value().length; i2 += 1) {
      aListSessionsSinceJune.get(i2).unset(["isFunded"]).write();
    }
    var oListToUpdate = aListSessionsSinceJune.filter((v) => v.type != "soutenance");
    for (var i2 = 0; i2 < oListToUpdate.value().length; i2 += 1) {
      var _r2 = oListToUpdate.get(i2);
      _r2.assign({ "fundedBy": students_default.getFunded(_r2.value().who_id) }).write();
    }
    var oListToUpdate = aListSessionsSinceJune.filter((v) => v.type == "soutenance");
    for (var i2 = 0; i2 < oListToUpdate.value().length; i2 += 1) {
      oListToUpdate.get(i2).assign({ "fundedBy": OC_FUNDED }).write();
    }
  };

  // src/dbase.js
  var import_papaparse_min = __toModule(require_papaparse_min());
  var _Dbase = class {
  };
  var Dbase = _Dbase;
  __publicField(Dbase, "save", function() {
    console.log(`%cWanna save DBASE`, APP_DEBUG_STYLE);
    return JSON.stringify(src_default.Cfg.dbase.getState());
  });
  __publicField(Dbase, "load", function(sFileName) {
    console.log(`%cWanna load ${sFileName} in DBASE`, APP_DEBUG_STYLE);
    console.log(`%c !!!!!! TYPE NOT CHECKED BE CARREFULL`, APP_DEBUG_STYLE);
    return src_default.Cfg.dbase.setState(JSON.parse(sFileName)).write();
  });
  __publicField(Dbase, "update", async function(sVersion) {
    console.log(`%cIs there any update to DB to go to version ${sVersion}`, APP_DEBUG_STYLE);
    const aDbNeedUpdate = [
      { version: "1.00.0006", action: maj_1_00_0006 }
    ];
    for (let _i = 0, _size = aDbNeedUpdate.length; _i < _size; _i++) {
      if (semverCompare(sVersion, aDbNeedUpdate[_i].version) == 0) {
        console.log(`%cFound an update to DB version '${aDbNeedUpdate[_i].version}' proceed conversion...`, APP_DEBUG_STYLE);
        let _r3 = await aDbNeedUpdate[_i].action();
        if (_r3 == -1) {
          console.log(`%cError something was wrong during update of database from version: ${meta_default.getVersion()} to version:${aDbNeedUpdate[_i].version}.... you have canceled it`, APP_ERROR_STYLE);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Quelque chose s'est mal pass\xE9 ou vous avez annul\xE9 l'update \n\nUtiliser l'application dans ces conditions n'est pas garanti  !",
            footer: '<a href="https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/issues">G\xE9n\xE9rer un bug?</a>'
          });
        } else {
          let _r4 = meta_default.setDbVersion(sVersion);
          console.log(`%cChanged DB to version ${_r4}`, APP_DEBUG_STYLE);
        }
      }
    }
    let _r2 = meta_default.setDbVersion(sVersion);
    console.log(`%cChanged DB to version ${_r2}`, APP_DEBUG_STYLE);
  });
  __publicField(Dbase, "erase", function(sTableName) {
    console.log(`%cErase all data of table: ${sTableName}`, APP_DEBUG_STYLE);
    return src_default.Cfg.dbase.get(sTableName).remove().write();
  });
  __publicField(Dbase, "loadTable", function(sTableName, aValue) {
    if (table_exist(sTableName)) {
      return src_default.Cfg.dbase.set(sTableName, aValue).write();
    }
    throw "Table :" + sTableName + ", not exists in DB !";
    return -1;
  });
  __publicField(Dbase, "table_exist", (sTableName) => src_default.Cfg.dbase.has(sTableName).value);
  __publicField(Dbase, "table_export", function(sTableName) {
    if (table_exist(sTableName)) {
      return JSON.stringify(src_default.Cfg.dbase.get(sTableName).value());
    }
    throw "Table :" + sTableName + ", not exists id DB !";
    return -1;
  });
  __publicField(Dbase, "exportTblToCSV", function(sTableName = "", sDateFrom, sDateTo) {
    const data = _Dbase.exportTblToJSON(sTableName, sDateFrom, sDateTo);
    const config = {
      quotes: false,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false,
      columns: null
    };
    return import_papaparse_min.default.unparse(data, config);
  });
  __publicField(Dbase, "exportTblToJSON", function(sTableName = "", sDateFrom, sDateTo) {
    if (sTableName == "") {
      console.log(`%cIrrecoverable Error: You forget to define a data table name`, APP_ERROR_STYLE);
      return -1;
    }
    if (sDateFrom !== null && sDateFrom !== "") {
      dtFrom = dayjs(sDateFrom);
    }
    if (sDateTo !== null && sDateTo !== "") {
      dtTo = dayjs(sDateTo);
    }
    if (src_default.Cfg.dbase.has(sTableName).value == false) {
      console.log(`%cIrrecoverable Error: table ${sTableName} don't exist`, APP_ERROR_STYLE);
      return -1;
    }
    if (sTableName === sessions_default.tbl_name) {
      if (typeof dtFrom === "object" && dtTo === "object") {
        return src_default.Cfg.dbase.get(sTableName).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day") && dayjs(v.when).isSameOrAfter(dtFrom, "day")).value();
      }
      if (typeof dtFrom === "object") {
        return src_default.Cfg.dbase.get(sTableName).filter((v) => dayjs(v.when).isSameOrAfter(dtFrom, "day")).value();
      }
      if (typeof dtTo === "object") {
        return src_default.Cfg.dbase.get(sTableName).filter((v) => dayjs(v.when).isSameOrBefore(dtTo, "day")).value();
      }
    }
    return src_default.Cfg.dbase.get(sTableName).value();
  });
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
  var _checkOrAddCbox = function(oEl) {
    if (oEl.querySelector(".Facturier__cbox input[type=checkbox]") === null) {
      oEl.appendChild(_buildCbox(oEl));
    } else {
      _checkCbox(oEl);
    }
  };
  var patchSessionHistoryLineUI = function(oEl) {
    _checkOrAddCbox(oEl);
  };
  var _buildCbox = function(oEl) {
    var sState = oEl.children[0].querySelector("svg").getAttribute("aria-label");
    var sSessionType = oEl.children[0].querySelector("p").innerText;
    var sDateTime = oEl.children[1].querySelector("time").getAttribute("datetime").trim();
    var sStudentName = oEl.children[2].querySelector("a").innerText;
    var sWho_id = getKey(oEl.children[2], -2);
    var inputElem = document.createElement("input");
    inputElem.type = "checkbox";
    inputElem.name = "name";
    var sWhen = dayjs(sDateTime).toISOString();
    var iHash = sessions_default.getHashId(sWhen, sWho_id);
    inputElem.value = iHash;
    inputElem.onclick = function(event) {
      event.stopPropagation();
    };
    bChecked = sessions_default.exists(iHash);
    if (bChecked === true)
      inputElem.checked = true;
    const cls2ndChild = oEl.children[1].classList;
    const clsLastChild = oEl.lastChild.classList;
    oEl.lastChild.classList = cls2ndChild;
    var oSubEl = document.createElement("div");
    oSubEl.appendChild(inputElem);
    oSubEl.classList.add(...clsLastChild);
    oSubEl.classList.add("Facturier__cbox");
    return oSubEl;
  };
  var _checkCbox = function(oEl) {
    try {
      oInput = oEl.querySelector("input");
    } catch (e) {
      throw Error("IRRECOVERABLE ERROR: no input element");
    }
    let iHash = parseInt(oInput.value, 10);
    bChecked = sessions_default.exists(iHash);
    if (bChecked === true) {
      oInput.checked = true;
    } else {
      oInput.checked = false;
    }
  };
  var addCbox = function() {
    var sPath = OC_DASHBOARDCSSMAINDATASELECTOR;
    var sessions = document.querySelector(sPath);
    var bChecked2 = false;
    if (sessions === null) {
      console.log(`%cERROR:Could'nt find the table which display sessions : ${sessions}`, APP_ERROR_STYLE);
      throw new Error("!!!! IRRECOVERABLE ERROR NO TABLE OF SESSIONS FOUNDED");
    }
    if (sessions.querySelector(".Facturier__cbox input[type=checkbox]") === null) {
      var sessions = document.querySelector(`${sPath}`).children;
      for (let [key, oEl2] of Object.entries(sessions)) {
        if (oEl2.firstChild.nodeName !== "A") {
          continue;
        }
        const oLine = oEl2.firstChild;
        oLine.appendChild(_buildCbox(oLine));
      }
      if (document.querySelector(`${sPath} .Facturier__cbox_all`) === null) {
        const insertBefore = (ele, anotherEle) => anotherEle.insertAdjacentElement("beforebegin", ele);
        var el = document.querySelector(`${sPath} li`);
        const cls = el.firstChild.classList;
        var inputElem = document.createElement("input");
        inputElem.type = "checkbox";
        inputElem.name = "name";
        inputElem.value = "value";
        inputElem.id = "id";
        inputElem.onclick = function() {
          document.querySelectorAll(".Facturier__cbox input[type=checkbox]").forEach((e) => e.checked = !e.checked);
        };
        inputElem.style = "visibility: hidden;";
        var label = document.createElement("label");
        label.innerText = "in DB";
        label.style = "display:block;text-align:right;";
        label.onMouseOver = "this.style.cursor=pointer;";
        label.onMouseOut = "this.style.cursor=auto;";
        label.appendChild(inputElem);
        var oEl = document.createElement("div");
        oEl.classList = cls;
        oEl.classList.add("Facturier__cbox_all");
        oEl.appendChild(label);
        insertBefore(oEl, document.querySelector(`${sPath} li`));
      }
    } else {
      var sessions = document.querySelector(`${sPath}`).children;
      for (let [key, oEl2] of Object.entries(sessions)) {
        if (oEl2.firstChild.nodeName !== "A") {
          continue;
        }
        const oLine = oEl2.firstChild;
        if (oLine.querySelector(".Facturier__cbox input[type=checkbox]") === null) {
          oLine.appendChild(_buildCbox(oLine));
        } else {
          _checkCbox(oLine);
        }
      }
    }
  };
  var billInDetails = async function() {
    var [dtFrom2, dtTo2] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
    let _r2 = lists_default.getListDetailBill(dtFrom2, dtTo2);
    let sHtml = "";
    sHtml += "<table>";
    sHtml += "<thead>";
    sHtml += "<tr><th>Quand</th><th>Qui</th><th>Financ\xE9 ?</th><th>Type</th><th>Niveau</th><th>Ancien Mode ?</th><th>Statut</th><th>PU HT</th><th>Cumul</th></tr>";
    sHtml += "<thead>";
    sHtml += "<tbody>";
    for (let _i = 0; _i < _r2.length; _i += 1) {
      sHtml += "<tr>";
      sHtml += `<td>${dayjs(_r2[_i].when).format("DD/MM/YYYY \xE0 HH:mm:ss")}</td>`;
      sHtml += `<td>${_r2[_i].who_name}</td><td>${_r2[_i].funding}</td>`;
      sType = _r2[_i].type;
      if (_r2[_i].path != void 0 && _r2[_i].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _r2[_i].type !== "soutenance")
        sType = "Coaching";
      sHtml += `<td>${sType}</td><td>${_r2[_i].lvl}</td>`;
      sHtml += `<td>${_r2[_i].oldMode === true ? "Oui" : "Non"}</td>`;
      sHtml += `<td>${_r2[_i].status}</td>`;
      sHtml += `<td>${_r2[_i].iPu}</td><td>${_r2[_i].iCumul}\u20AC</td>`;
      sHtml += "</tr>";
    }
    sHtml += "</tbody>";
    sHtml += "</table>";
    Swal.fire({
      title: `<strong>Liste d\xE9taill\xE9es des sessions du ${dtFrom2.format("DD/MM/YYYY")} au ${dtTo2.format("DD/MM/YYYY")}</strong>`,
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
    var bDebug2 = true;
    var [dtFrom2, dtTo2] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
    if (bDebug2 == true)
      console.log("%ccollectAuto() Wanna collect from %s to %s", APP_DEBUG_STYLE, dtFrom2.format("DD/MM/YYYY"), dtTo2.format("DD/MM/YYYY"));
    var _r2 = await sessions_default.getSessionsFromAPI(dtFrom2, dtTo2);
    if (bDebug2 == true)
      console.log("%ccollectAuto() Sessions are is %o", APP_DEBUG_STYLE, _r2);
  };
  var collectChecked = async function() {
    var sPath = OC_DASHBOARDCSSMAINDATASELECTOR;
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
        for (var i2 = 0; i2 < cb.length; i2 += 1) {
          var oEl = cb[i2].parentElement.parentElement;
          var me = sessions_default.parseRow(oEl);
          await sessions_default.add(me);
          bar.set(i2 / cb.length * 100, false);
        }
        bar.set(100, false);
        if (Swal.getTitle()) {
          Swal.getTitle().innerText = "Traitement termin\xE9 !";
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
    console.log("find a student by id \xA4 d_Student.findById(STUDENT_ID, (DATE) ); // date is optionnal");
    console.groupEnd();
    console.group("%cd_Session", APP_DEBUG_STYLE);
    console.log("get a list of session \xA4 d_Session.getBetween('2020-08-01','2020-08-31')");
    console.log("delete a session by id \xA4 d_Session.deleteById(SESSION_ID);");
    console.groupEnd();
    console.group("%cSome combinated example", APP_DEBUG_STYLE);
    console.log("Delete last saved session :  d_Session.deleteById( d_dbase.get(d_Session.tbl_name).last().value().id ); ");
    console.log("Find all session between 01/08/2020 and 31/08/2020 :  d_dbase.get(d_Session.tbl_name).filter( v => d_dayjs(v.when).isSameOrBefore('20200831', 'day') && d_dayjs(v.when).isSameOrAfter('20200801', 'day')).value(); ");
    console.groupEnd();
    debugger;
  };
  var pdf = function() {
    const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
    async function modifyPdf() {
      const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
      const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
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
      const { width, height } = page.getSize();
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
      var [dtFrom2, dtTo2] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
      let _r2 = lists_default.getListDetailBill(dtFrom2, dtTo2);
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 30;
      page.drawText(`Prestations en d\xE9tail 

 du ${dtFrom2.format("DD/MM/YYYY")} au ${dtTo2.format("DD/MM/YYYY")}`, {
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
      for (let _l3 = 1; _l3 < _r2.length; _l3 += 1) {
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
          let aHeader = ["", "Quand", "Qui", "Financ\xE9", "Type-Niv.", "Statut", "Pu", "Cumul"];
          let iCurX2 = iXStart;
          curPage.moveTo(iCurX2, iCurrentHeigth);
          for (let _i = 1; _i < aHeader.length; _i += 1) {
            curPage.drawText(aHeader[_i], { x: iCurX2 });
            iCurX2 += _iWidth[_i];
          }
          curLine += 1;
          iCurrentHeigth = height - line_space * font_size * curLine;
        }
        let iCurX = iXStart;
        curPage.drawText(dayjs(_r2[_l3].when).format("DD/MM/YYYY \xE0 HH:mm"), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[1];
        curPage.drawText(_r2[_l3].who_name.trim().slice(0, _iStrMaxLength[2]), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[2];
        let sFunding = _r2[_l3].funding.trim().slice(0, _iStrMaxLength[3]);
        if (_r2[_l3].funding === "auto-financ\xE9") {
          sFunding = "Au. Fin.";
        }
        if (_r2[_l3].funding === "financ\xE9 par un tiers") {
          sFunding = "Fin.";
        }
        curPage.drawText(sFunding, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[3];
        let sType2 = _r2[_l3].type;
        if (_r2[_l3].path != void 0 && _r2[_l3].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _r2[_l3].type !== "soutenance") {
          sType2 = "Coaching";
        }
        let sCol5 = `${sType2.trim().slice(0, _iStrMaxLength[4] - 2)}-${_r2[_l3].lvl.toString()}`;
        curPage.drawText(sCol5, {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[4];
        let sStatus = _r2[_l3].status;
        if (_r2[_l3].status === "\xE9tudiant absent") {
          sStatus = "absent";
        }
        if (_r2[_l3].status === "\xE9tudiante absente") {
          sStatus = "absente";
        }
        if (_r2[_l3].status === "annul\xE9e tardivement") {
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
        curPage.drawText(_r2[_l3].iPu.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        iCurX += _iWidth[6];
        curPage.drawText(_r2[_l3].iCumul.toString(), {
          font: timesRomanFont,
          size: font_size,
          y: iCurrentHeigth,
          x: iCurX,
          lineHeight: iLineHeigth
        });
        curLine += 1;
      }
      var data = await accounting_default.calculateBill(dtFrom2, dtTo2);
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
      var _aSessionQualityStr = ["R\xE9alis\xE9e", "Annul\xE9e", "Annul\xE9e tardivement", "Etudiant(e) absent(e)"];
      var _aFunding = [BILL_AUTOFUNDED, BILL_FUNDED, BILL_OTHER];
      var _aFundingStr = ["Autofinanc\xE9s", "Financ\xE9s", "Autres"];
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
                curPage.drawText(`d\xE9sol\xE9 pas de r\xE9sultat pour cette section au niveau de facturation (${_l2})`, {
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
                curPage.drawText(dayjs(_i0.data[_k].when).format("DD/MM/YYYY \xE0 HH:mm"), {
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
      pdf_default.addFooter(pdfDoc, `G\xE9n\xE9r\xE9 avec Facturier version ${core_default.getAppVersion()}`);
      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `prestations_facturees_detail_${dtFrom2.format("YYYYMMDD")}-${dtTo2.format("YYYYMMDD")}.pdf`, "application/pdf");
    }
    createPdf2();
  };
  var mgtDbase = async function() {
    GM_addStyle('.formgrid{font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;}');
    GM_addStyle(`
.swal2-styled[type=button]{background-color:#3085d6;border-radius:.75em;color:#fff;font-size:1.0625em;border-left-color:#3085d6;border-right-color:#3085d6;display:inline-block}
.formgrid{display:grid;grid-template-columns:1fr 1em 1fr;grid-gap:.3em .6em;grid-auto-flow:dense;align-items:center}
.formgrid input,.formgrid output,.formgrid textarea,.formgrid select,.formgrid button{grid-column:2 / 4;width:auto;margin:0}
.formgrid legend{font-size:1.2em;width:100%;border-bottom:1px dotted #99c}
.formgrid fieldset{max-width:40em;padding:4px;margin:2em auto;border:0 none}
`);
    let sHtml = "";
    sHtml += "<legend>Que voulez vous faire ?</legend>";
    sHtml += "<fieldset>";
    sHtml += '<div class="formgrid">';
    sHtml += 'Epurer<button id="answer1" data-action="raz" class="swal2-styled" type="button">RAZ</button>';
    sHtml += 'Sauvegarder toute la base<button id="answer2" data-action="export" class="swal2-styled" type="button">Sauvegarder</button>';
    sHtml += 'Charger toute la base<button id="answer3" data-action="import" class="swal2-styled" type="button">Charger</button>';
    if (false) {
      sHtml += `Exporter les tables
    <button class="swal2-styled" type="button"
    	hx-get="http://127.0.0.1:8000/views/test-swal-sauvegarde.html"
        hx-target="#sttPlaceHolder"
        hx-include="[name='email']"
        hx-swap="innerHTML"> Exporter (local)
    </button>
		`;
      sHtml += `Exporter les tables
    <button class="swal2-styled" type="button"
    	hx-get="http://127.0.0.1:8000/views/test-swal-sauvegarde.html"
        hx-target="#sttPlaceHolder"
        hx-include="[name='email']"
        hx-swap="innerHTML"> Importer (local)
    </button>
		`;
    }
    sHtml += `Exporter les tables
    <button class="swal2-styled" type="button"
    	hx-get="/views/test-swal-sauvegarde"
		hx-select="body"
        hx-target="#sttPlaceHolder"
        hx-include="[name='email']"
        hx-swap="innerHTML"> Exporter
    </button>
		`;
    sHtml += "</fieldset>";
    sHtml += "</div>";
    const { value: formValues } = await Swal.fire({
      title: "Gestion de la base de donn\xE9e",
      html: sHtml,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("answer1").value,
          document.getElementById("answer2").value
        ];
      },
      didOpen: (el) => {
        console.log("%conOpen popup", "color:coral");
        htmx.process(document.querySelector(".swal2-container"));
        console.log("%cHtmx Process done", "color:coral");
        el.querySelector(".formgrid").addEventListener("click", _handler = function(e) {
          const raz_action = function(evt) {
            if (evt.target.matches('button[data-action="raz"]')) {
              Swal.close();
              razDbase();
            }
            return;
          };
          const save_action = function(evt) {
            if (evt.target.matches('button[data-action="export"]')) {
              Swal.close();
              save_database();
            }
            return;
          };
          const load_action = function(evt) {
            if (evt.target.matches('button[data-action="import"]')) {
              Swal.close();
              load_database();
            }
            return;
          };
          raz_action(e);
          save_action(e);
          load_action(e);
        });
      },
      onClose: (el) => {
        el.querySelector(".formgrid").removeEventListener("click", _handler);
        console.log("%conClose popup", "color:coral");
      }
    });
    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
    }
  };
  var save_database = async function() {
    let sExport = dbase_default.save();
    console.log(`%cWanna save : ${sExport}`, APP_DEBUG_STYLE);
    let now = dayjs();
    let sHtml = "";
    sHtml += `<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="save_${now.format("YYYYMMDD")}.json">save_${now.format("YYYYMMDD")}.json</a>`;
    Swal.fire({
      title: "Sauvegarde de la base de donn\xE9e",
      html: sHtml,
      focusConfirm: false,
      onOpen: (el) => {
        el.querySelector("#download").click();
      },
      onClose: (el) => {
      }
    });
  };
  var load_database = async function() {
    console.log(`%cWanna load DATABASE`, APP_DEBUG_STYLE);
    const { value: file } = await Swal.fire({
      title: "Selection de la sauvegarde (json)",
      input: "file",
      inputAttributes: {
        "accept": ".json",
        "aria-label": "Upload your database"
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dbase_default.load(e.target.result);
        addCbox();
        toastOk("Chargement de la base termin\xE9");
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
    sHtml += '<label for="dtFrom" class="date">Date de d\xE9but</label>';
    sHtml += '<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += '<label for="dtTo" class="date">Date de fin</label>';
    sHtml += '<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += "<!-- Switch -->";
    sHtml += '<input type="checkbox" class="switch" name="s1" id="s1">';
    sHtml += '<label for="s1">Switch</label>';
    sHtml += "</form>";
    const { value: formValues } = await Swal.fire({
      title: "<strong>RAZ des donn\xE9es</strong>",
      icon: "info",
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "top-start",
      grow: "row",
      footer: "Choisissez ce que vous allez supprimer de la base de donn\xE9e",
      preConfirm: () => {
        let r2 = document.getElementsByName("date_filter");
        let radioValue = "notfound";
        for (var i2 in r2) {
          if (r2[i2].checked === true)
            radioValue = r2[i2].value;
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
    let dtFrom2 = formValues[4] ? dayjs(formValues[4]) : null;
    let dtTo2 = formValues[5] ? dayjs(formValues[5]) : null;
    if (bRAZStudents === true) {
      setTimeout(function() {
        Toastify({
          text: `Suppression de la base des \xE9tudiants`,
          gravity: "top",
          position: "right",
          close: true,
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
      }, 500);
      students_default.delete(dtFrom2, dtTo2);
      meta_default.remStudentListUpd();
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
      sessions_default.delete(dtFrom2, dtTo2);
      addCbox();
    }
    if (bRAZArchives === true) {
      setTimeout(function() {
        Toastify({
          text: `Suppression de la base des archives (financi\xE8res)`,
          gravity: "top",
          position: "right",
          close: true,
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
      }, 500);
      archives_default.delete(dtFrom2, dtTo2);
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
      history_default.remove(dtFrom2, dtTo2);
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
    sHtml += '<label for="dd" class="date">Date de d\xE9but</label>';
    sHtml += '<input id="dd" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += '<label for="df" class="date">Date de fin</label>';
    sHtml += '<input id="df" type="date" max="2030-12-31" min="2010-12-31">';
    sHtml += "</form>";
    var [dtFrom2, dtTo2] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"));
    var data = await accounting_default.calculateBill(dtFrom2, dtTo2);
    if (core_default.isInOldMode(dtFrom2)) {
      showBillPhase1(dtFrom2, dtTo2, data);
    } else {
      showBillPhase2(dtFrom2, dtTo2, data);
    }
  };
  var showBillPhase1 = function(dtFrom2, dtTo2, data) {
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
        sHtml += `<td>Niveau ${_l2} : r\xE9alis\xE9es</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es tard.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : \xE9tudiant abs.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : r\xE9alis\xE9es</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es tard.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : \xE9tudiant abs.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate second array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : r\xE9alis\xE9es</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es tard.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : \xE9tudiant abs.</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_pf}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate third array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQ}</td><td></td><td>${iTotM}\u20AC</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    iTotG += iTotM;
    sHtml += "<tr>";
    sHtml += '<th colspan="4" class="pseudoheader" scope="colgroup">Total G\xE9n\xE9ral</th>';
    sHtml += "</tr>";
    sHtml += `<td colspan="3"></td><td>${iTotG}\u20AC</td>`;
    sHtml += "</tr>";
    sHtml += "<tr>";
    sHtml += "</tr>";
    sHtml += "</tbody>";
    sHtml += "<tfoot>";
    sHtml += "</tfoot>";
    sHtml += "</table>";
    sHtml += `<p>Soit un total g\xE9n\xE9ral \xE0 facturer de ${iTotG}\u20AC`;
    Swal.fire({
      title: `<strong>Liste des formations tarif\xE9es du ${dtFrom2.format("DD/MM/YYYY")} au ${dtTo2.format("DD/MM/YYYY")}</strong>`,
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen"
    });
  };
  var showBillPhase2 = function(dtFrom2, dtTo2, data) {
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
    sHtml += '<th rowspan="2">Type</th><th colspan="3" scope="colgroup">Auto Financ\xE9s</th><th colspan="3" scope="colgroup">Financ\xE9s</th><th colspan="3" scope="colgroup">Autres</th><th colspan="2" scope="colgroup">Total</th>';
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
        sHtml += `<td>Niveau ${_l2} : r\xE9alis\xE9es</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es tard.</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : \xE9tud. absent</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    var t1 = performance.now();
    console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQa}</td><td></td><td>${iTotMa}\u20AC</td>`;
    sHtml += `<td>${iTotQf}</td><td></td><td>${iTotMf}\u20AC</td>`;
    sHtml += `<td>${iTotQo}</td><td></td><td>${iTotMo}\u20AC</td>`;
    sHtml += `<td>${iTotQa + iTotQf + iTotQo}</td><td>${iTotMa + iTotMf + iTotMo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : r\xE9alis\xE9es</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es tard.</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : \xE9tud. absent</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
        sHtml += "</tr>";
      }
      _l2 += 1;
    }
    sHtml += "<tr>";
    sHtml += "<td>Total</td>";
    sHtml += `<td>${iTotQa}</td><td></td><td>${iTotMa}\u20AC</td>`;
    sHtml += `<td>${iTotQf}</td><td></td><td>${iTotMf}\u20AC</td>`;
    sHtml += `<td>${iTotQo}</td><td></td><td>${iTotMo}\u20AC</td>`;
    sHtml += `<td>${iTotQa + iTotQf + iTotQo}</td><td>${iTotMa + iTotMf + iTotMo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : r\xE9alis\xE9es</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : annul\xE9es tard.</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
        sHtml += `<td>Niveau ${_l2} : \xE9tud. absent</td>`;
        sHtml += `<td>${_qa}</td><td>${_pa}</td><td>${_ma}\u20AC</td>`;
        sHtml += `<td>${_qf}</td><td>${_pf}</td><td>${_mf}\u20AC</td>`;
        sHtml += `<td>${_qo}</td><td>${_po}</td><td>${_mo}\u20AC</td>`;
        sHtml += `<td>${_qa + _qf + _qo}</td><td>${_ma + _mf + _mo}\u20AC</td>`;
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
    sHtml += `<td>${iTotQa}</td><td></td><td>${iTotMa}\u20AC</td>`;
    sHtml += `<td>${iTotQf}</td><td></td><td>${iTotMf}\u20AC</td>`;
    sHtml += `<td>${iTotQo}</td><td></td><td>${iTotMo}\u20AC</td>`;
    sHtml += `<td>${iTotQa + iTotQf + iTotQo}</td><td>${iTotMa + iTotMf + iTotMo}\u20AC</td>`;
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
      sHtml += `<p class="flat_fee">Calcul du forfait "autofinanc\xE9". Ce mois ci ${iFlatFeeNumber} \xE9tudiants ont eu au moins une session il s'agit de : ${sAFOK.slice(0, -1)}`;
    } else {
      sHtml += `<p class="flat_fee">Calcul du forfait "autofinanc\xE9". Ce mois ci ${iFlatFeeNumber} \xE9tudiant a eu au moins une session il s'agit de : ${sAFOK.slice(0, -1)}`;
    }
    sHtml += `. Le forfait est donc de ${iTotG}\u20AC</p>`;
    sHtml += `<p>Soit un total g\xE9n\xE9ral \xE0 facturer de ${iTotGMa + iTotGMf + iTotGMo + iTotG}\u20AC</p>`;
    Swal.fire({
      title: `<strong>Liste des formations tarif\xE9es du ${dtFrom2.format("DD/MM/YYYY")} au ${dtTo2.format("DD/MM/YYYY")}</strong>`,
      html: sHtml,
      showCloseButton: true,
      focusConfirm: false,
      position: "center-start",
      grow: "fullscreen"
    });
  };
  var statistics = async function() {
    var [dtFrom2, dtTo2] = await popupDateSelector(dayjs().startOf("month"), dayjs().endOf("month"), false);
    if (dtFrom2 === null || dtTo2 === null) {
      console.log("%cError need date from, date to", APP_ERROR_STYLE);
      throw new Error();
    }
    const aData = lists_default.getListStatistic(dtFrom2, dtTo2);
    let sHtml = "";
    let aHtml = new Array(22);
    let aTot = Array.apply(null, Array(22)).map(Number.prototype.valueOf, 0);
    let dtCurFrom = dtFrom2.clone();
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
    aHtml[15] = `<tr><td>Total G\xE9n\xE9ral</td>`;
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
        if (dtCurTo.isAfter(dtTo2, "day")) {
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
    sHtml = "<table>" + aHtml.join(" ") + `</tbody><tfoot><tr><td colspan=${aData.length + 1}>la valeur entre parenth\xE8se fait reference aux annul\xE9s</td></tr></tfoot></table>`;
    Swal.fire({
      title: `<strong>Statistiques du ${dtFrom2.format("DD/MM/YYYY")} au ${dtTo2.format("DD/MM/YYYY")}</strong>`,
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
  var _UI = class {
  };
  var UI = _UI;
  __publicField(UI, "init", function() {
    console.log("%cin initUI", APP_DEBUG_STYLE);
    _UI.build();
    var draggie = new Draggabilly(".draggable", { handle: ".handle" });
  });
  __publicField(UI, "build", function() {
    console.log("%c in buildUI", "background-color:green;color:white");
    GM_addStyle(`
.flow > * + * {
  margin-top: var(--flow-space, 1em);
}
		`);
    GM_addStyle(".panel {/* because of stacking context : https://stackoverflow.com/questions/5218927/z-index-not-working-with-fixed-positioning */position: relative;z-index: 666; /*seems that 4 is good*/}");
    GM_addStyle(".menuBar {padding:7px;/*for handler*/font-size: 1rem; pointer-events: inherit;}");
    GM_addStyle(".draggable {background: transparent;border-radius: 10px;padding: 20px;}");
    GM_addStyle(".draggable.is-pointer-down {background: #09F;}");
    GM_addStyle(".draggable.is-dragging { opacity: 0.7; }");
    GM_addStyle(".handle {background: #555;background: hsla(0, 0%, 0%, 0.4);width: 20px;height: 20px; border-radius: 10px; position: relative; top:10px; left:-10px;}");
    GM_addStyle(`
.menuBar{
/*Smol Responsive CSS Grid*/
--min: 15ch;
--gap: 1rem;
display: grid;
grid-gap: var(--gap);
/* min() with 100% prevents overflow
in extra narrow spaces */
grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min)), 1fr)); /* 20 px is size of handle*/ 
}
		`);
    var elMenu2 = document.createElement("div");
    var elHandle = document.createElement("div");
    elHandle.classList.add("handle");
    elMenu2.appendChild(elHandle);
    elMenu2.classList.add("panel", "draggable");
    document.body.insertAdjacentElement("beforeend", elMenu2);
    elMenu2.setAttribute("style", `top:-${document.body.offsetHeight - elMenu2.offsetHeight}px`);
    var elMenuContent = document.createElement("div");
    elMenuContent.classList.add("menuBar");
    elMenu2.appendChild(elMenuContent);
    _UI.addButton("collectChecked", collectChecked, {}, elMenuContent);
    _UI.addButton("CollectAuto", collectAuto, {}, elMenuContent);
    _UI.addButton("showBill", showBill, {}, elMenuContent);
    _UI.addButton("billInDetails", billInDetails, {}, elMenuContent);
    _UI.addButton("PDF", pdf, {}, elMenuContent);
    _UI.addButton("SList", students_default.showList, {}, elMenuContent);
    _UI.addButton("DbgMode", debugMode, {}, elMenuContent);
    _UI.addButton("statistics", statistics, {}, elMenuContent);
    _UI.addButton("Database", mgtDbase, {}, elMenuContent);
    if (false) {
      _UI.addButton("Sandbox", sandbox, {}, elMenuContent);
    }
    _UI.addButton("about", about, {}, elMenuContent);
    let el = document.createElement("div"), elStyle = el.style;
    el.id = "sttPlaceHolder";
    let cssObj = { position: "absolute", bottom: "7%", left: "4%", "z-index": 999, "display": "hidden" };
    document.body.insertAdjacentElement("beforeend", el);
    Object.keys(cssObj).forEach((key) => elStyle[key] = cssObj[key]);
  });
  __publicField(UI, "addButton", function(text, onclick, cssObj, el) {
    el = el || document.body;
    cssObj = cssObj || { position: "absolute", bottom: "7%", left: "4%", "z-index": 3 };
    let button = document.createElement("button"), btnStyle = button.style;
    button.classList.add("button--primary", "button");
    el.appendChild(button);
    button.innerHTML = text;
    button.onclick = onclick;
    Object.keys(cssObj).forEach((key) => btnStyle[key] = cssObj[key]);
    return button;
  });
  var FpsTracker = class {
  };
  __publicField(FpsTracker, "start", function(id) {
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
  });
  __publicField(FpsTracker, "stop", function(animationId) {
    window.cancelAnimationFrame(animationId);
  });
  var ui_default = UI;

  // src/gmc.lib.js
  var windowcss = "#OCAddonsCfg {background-color: lightblue;} #OCAddonsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #OCAddonsCfg .saveclose_buttons {margin: .7em;}";
  var iframecss = "height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;";
  var appmenu = {
    id: "OCAddonsCfg",
    title: "Configuration du module",
    fields: {
      nbHrsAfM: {
        section: ["Statistiques", "param\xE8tres"],
        label: "Nombre de minutes pour une session d'\xE9tudiant auto financ\xE9",
        title: "Dur\xE9e moyenne d'une session AF (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 30
      },
      nbHrsfM: {
        label: "Nombre de minutes pour une session d'\xE9tudiant financ\xE9",
        title: "Dur\xE9e moyenne d'une session Financ\xE9e (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsS: {
        label: "Nombre de minutes pour une session (avant 01/07/2020)",
        title: "Dur\xE9e moyenne d'une session avant la s\xE9paration auto financ\xE9 | financ\xE9 (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsD: {
        label: "Nombre de minutes pour une session de soutenance",
        title: "Dur\xE9e moyenne d'une sessionde soutenance AF (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      nbHrsC: {
        label: "Nombre de minutes pour une session de coaching",
        title: "Dur\xE9e moyenne d'une session de coachine (calcul du THM)",
        labelPos: "left",
        type: "input",
        default: 45
      },
      maxfetchpg: {
        section: ["Application", "optimisation"],
        label: "Maximum de page recherch\xE9es dans l'historique",
        labelPos: "left",
        type: "input",
        default: 1e3
      },
      datacachelifetime: {
        label: "Temps de conservation des donn\xE9es dans le cache (en ms)",
        labelPos: "left",
        type: "input",
        default: 12e4
      },
      checksessionalreadyexists: {
        section: ["Application", "Base de donn\xE9e"],
        label: "sessions: v\xE9rifier existence avant insertion",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      sizeofcontentlist: {
        section: ["Interface", "th\xE8me"],
        label: "taille de la police des listes",
        labelPos: "left",
        type: "input",
        default: "1em;"
      },
      use_custom_css: {
        label: "utiliser des styles personnalis\xE9s",
        labelPos: "left",
        type: "checkbox",
        default: false
      },
      custom_css_url: {
        label: "url de la feuille de style (si plusieurs les s\xE9parer par des virgules)",
        labelPos: "left",
        type: "input",
        default: ""
      },
      custom_css_data: {
        label: "code css \xE0 injecter ?",
        title: "saisir ici le code css \xE0 injecter directement dans la page web g\xE9n\xE9r\xE9e",
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
      "hackheaderzindex": {
        section: ["", "Hack"],
        label: "Changer le zindex du bandeau haut",
        title: "le bandeau haut \xE0 un z-index  (1000) qui le place au dessus de tout ce qui est pr\xE9sent \xE0 l'\xE9cran, ce qui g\xEAne la barre de menu ; activer cette option r\xE9duit ce chiffre \xE0 0",
        labelPos: "left",
        type: "checkbox",
        default: true
      },
      "use_student_cache": {
        section: ["Avanc\xE9es", ""],
        label: "Utiliser le cache \xE9tudiant",
        title: "Lorsque l' application recherche si un \xE9tudiant est pr\xE9sent on utilise un cache pour \xE9viter de passer trop de temps dans les requ\xEAtes, d\xE9sactiver le cache permettra de toujours faire une requete en base ",
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
  var Performance = class {
  };
  __publicField(Performance, "longTaskTiming", function() {
    if (window.self !== window.top) {
      return;
    }
    console.log("LongTasks: Initializing");
    var observer = new window.PerformanceObserver(function(list) {
      var perfEntries = list.getEntries();
      for (var i2 = 0; i2 < perfEntries.length; i2++) {
        console.log("LongTasks: ", perfEntries[i2].name, perfEntries[i2].duration, perfEntries[i2].attribution.length, perfEntries[i2].attribution.length > 0 ? perfEntries[i2].attribution[0].containerType : null, perfEntries[i2].attribution.length > 0 ? perfEntries[i2].attribution[0].containerName : null, perfEntries[i2].attribution.length > 0 ? perfEntries[i2].attribution[0].containerSrc : null, perfEntries[i2].attribution.length > 0 ? perfEntries[i2].attribution[0].containerId : null, perfEntries[i2]);
      }
    });
    if (typeof window.PerformanceLongTaskTiming !== "undefined") {
      console.log("LongTasks: Appears to be supported");
    } else {
      console.log("LongTasks: Not supported");
    }
    try {
      observer.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      console.log("LongTasks: Not supported");
    }
  });
  __publicField(Performance, "paintTiming", function() {
    if (window.self !== window.top) {
      return;
    }
    console.log("PaintTiming: Initializing");
    var observer = new window.PerformanceObserver(function(list) {
      var perfEntries = list.getEntries();
      for (var i2 = 0; i2 < perfEntries.length; i2++) {
        console.log("PaintTiming: ", perfEntries[i2].name, perfEntries[i2].startTime);
      }
    });
    if (typeof window.PerformancePaintTiming !== "undefined") {
      console.log("PaintTiming: Appears to be supported");
    } else {
      console.log("PaintTiming: Not supported");
      return;
    }
    try {
      observer.observe({ entryTypes: ["paint"], buffered: true });
    } catch (e) {
      console.log("PaintTiming: Not supported");
    }
  });

  // src/vendor/fetch-inject/injectors.js
  var head = function(i2, n, j, e, c, t, s) {
    t = n.createElement(j), s = n.getElementsByTagName(j)[0];
    t.appendChild(n.createTextNode(e.text));
    t.onload = c(e);
    s ? s.parentNode.insertBefore(t, s) : n.head.appendChild(t);
  };

  // src/vendor/fetch-inject/fetch-inject.js
  var fetchInject = function(inputs, promise) {
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
        resources.push({ text: resolved[0], blob: resolved[1] });
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
    var utils = function() {
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
          for (var i2 = 0, cb; cb = callbacksToBeCalled[i2]; i2++) {
            if (cb && cb.callback) {
              cb.callback.call(cb.elem, cb.elem);
            }
          }
          if (registrationData && registrationData.options.onceOnly && registrationData.firedElems.length == 1) {
            registrationData.me.unbindEventWithSelectorAndCallback.call(registrationData.target, registrationData.selector, registrationData.callback);
          }
        },
        checkChildNodesRecursively: function(nodes, registrationData, matchFunc, callbacksToBeCalled) {
          for (var i2 = 0, node; node = nodes[i2]; i2++) {
            if (matchFunc(node, registrationData, callbacksToBeCalled)) {
              callbacksToBeCalled.push({ callback: registrationData.callback, elem: node });
            }
            if (node.childNodes.length > 0) {
              utils.checkChildNodesRecursively(node.childNodes, registrationData, matchFunc, callbacksToBeCalled);
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
        for (var i2 = this._eventsBucket.length - 1, registeredEvent; registeredEvent = this._eventsBucket[i2]; i2--) {
          if (compareFunction(registeredEvent)) {
            if (this._beforeRemoving) {
              this._beforeRemoving(registeredEvent);
            }
            var removedEvents = this._eventsBucket.splice(i2, 1);
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
        var config = getObserverConfig(registrationData.options);
        observer.observe(target, config);
        registrationData.observer = observer;
        registrationData.me = me;
      });
      eventsBucket.beforeRemoving(function(eventData) {
        eventData.observer.disconnect();
      });
      this.bindEvent = function(selector, options, callback) {
        options = utils.mergeArrays(defaultOptions, options);
        var elements = utils.toElementsArray(this);
        for (var i2 = 0; i2 < elements.length; i2++) {
          eventsBucket.addEvent(elements[i2], selector, options, callback);
        }
      };
      this.unbindEvent = function() {
        var elements = utils.toElementsArray(this);
        eventsBucket.removeEvent(function(eventObj) {
          for (var i2 = 0; i2 < elements.length; i2++) {
            if (this === undefined2 || eventObj.target === elements[i2]) {
              return true;
            }
          }
          return false;
        });
      };
      this.unbindEventWithSelectorOrCallback = function(selector) {
        var elements = utils.toElementsArray(this), callback = selector, compareFunction;
        if (typeof selector === "function") {
          compareFunction = function(eventObj) {
            for (var i2 = 0; i2 < elements.length; i2++) {
              if ((this === undefined2 || eventObj.target === elements[i2]) && eventObj.callback === callback) {
                return true;
              }
            }
            return false;
          };
        } else {
          compareFunction = function(eventObj) {
            for (var i2 = 0; i2 < elements.length; i2++) {
              if ((this === undefined2 || eventObj.target === elements[i2]) && eventObj.selector === selector) {
                return true;
              }
            }
            return false;
          };
        }
        eventsBucket.removeEvent(compareFunction);
      };
      this.unbindEventWithSelectorAndCallback = function(selector, callback) {
        var elements = utils.toElementsArray(this);
        eventsBucket.removeEvent(function(eventObj) {
          for (var i2 = 0; i2 < elements.length; i2++) {
            if ((this === undefined2 || eventObj.target === elements[i2]) && eventObj.selector === selector && eventObj.callback === callback) {
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
        var config = {
          attributes: false,
          childList: true,
          subtree: true
        };
        if (options.fireOnAttributesModification) {
          config.attributes = true;
        }
        return config;
      }
      function onArriveMutation(mutations, registrationData) {
        mutations.forEach(function(mutation) {
          var newNodes = mutation.addedNodes, targetNode = mutation.target, callbacksToBeCalled = [], node;
          if (newNodes !== null && newNodes.length > 0) {
            utils.checkChildNodesRecursively(newNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
          } else if (mutation.type === "attributes") {
            if (nodeMatchFunc(targetNode, registrationData, callbacksToBeCalled)) {
              callbacksToBeCalled.push({ callback: registrationData.callback, elem: targetNode });
            }
          }
          utils.callCallbacks(callbacksToBeCalled, registrationData);
        });
      }
      function nodeMatchFunc(node, registrationData, callbacksToBeCalled) {
        if (utils.matchesSelector(node, registrationData.selector)) {
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
          options = utils.mergeArrays(arriveDefaultOptions, options);
        }
        var elements = utils.toElementsArray(this);
        if (options.existing) {
          var existing = [];
          for (var i2 = 0; i2 < elements.length; i2++) {
            var nodes = elements[i2].querySelectorAll(selector);
            for (var j = 0; j < nodes.length; j++) {
              existing.push({ callback, elem: nodes[j] });
            }
          }
          if (options.onceOnly && existing.length) {
            return callback.call(existing[0].elem, existing[0].elem);
          }
          setTimeout(utils.callCallbacks, 1, existing);
        }
        mutationBindEvent.call(this, selector, options, callback);
      };
      return arriveEvents;
    };
    var LeaveEvents = function() {
      var leaveDefaultOptions = {};
      function getLeaveObserverConfig() {
        var config = {
          childList: true,
          subtree: true
        };
        return config;
      }
      function onLeaveMutation(mutations, registrationData) {
        mutations.forEach(function(mutation) {
          var removedNodes = mutation.removedNodes, callbacksToBeCalled = [];
          if (removedNodes !== null && removedNodes.length > 0) {
            utils.checkChildNodesRecursively(removedNodes, registrationData, nodeMatchFunc, callbacksToBeCalled);
          }
          utils.callCallbacks(callbacksToBeCalled, registrationData);
        });
      }
      function nodeMatchFunc(node, registrationData) {
        return utils.matchesSelector(node, registrationData.selector);
      }
      leaveEvents = new MutationEvents(getLeaveObserverConfig, onLeaveMutation);
      var mutationBindEvent = leaveEvents.bindEvent;
      leaveEvents.bindEvent = function(selector, options, callback) {
        if (typeof callback === "undefined") {
          callback = options;
          options = leaveDefaultOptions;
        } else {
          options = utils.mergeArrays(leaveDefaultOptions, options);
        }
        mutationBindEvent.call(this, selector, options, callback);
      };
      return leaveEvents;
    };
    var arriveEvents = new ArriveEvents(), leaveEvents = new LeaveEvents();
    function exposeUnbindApi(eventObj, exposeTo, funcName) {
      utils.addMethod(exposeTo, funcName, eventObj.unbindEvent);
      utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorOrCallback);
      utils.addMethod(exposeTo, funcName, eventObj.unbindEventWithSelectorAndCallback);
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

  // src/views/export_table.js
  var export_table_default = {
    data: "DwCwLgtgNgfAUKApgQwCb2BRZkAIDGIyATgM7YC8ARAK5gBmAtABxUYCEjjuADgPY1iARxp8AlrjEA7fFEGJcURKUViARitSIaAD1z1xKgPy5GMXgOIWaAN3FWlKgFYDEVxFNwQ+W3KRxSqMhQfFIKXBik+MRiPGB+xPjU4GA8pABcAPSZ+KhSAHROpFpQYjbE+WFgmVI8EJmkAO6I2MFuYABMAAIAjAAMbMAN0bFgkSNxCUlUKWlZmTS1ANYA5vn4fPVBAJ5FvfnM+R09mTtF+RDShaRUuFr0brgwQ1ExcRxcuNZWAJIAoj0eqYzAhXqMpskwKkMtlcgUiiUyhUqpkViBMsEeNJEEUMVAsWEujYOvkdKTTmJ-HiCYhGGJEIDrrd7m5nsM3mMEJxuPxBIplLhkHRiAKpMgbGIVsgwNoyMDxhyITMoXNYXlrojypVsKj0Zjsbj9YTiaTyahKdUjYgmWywe84KCwNslPA1D5trgAN5wL4GKRgRj0ZCXKDbdK4KgAeR4HlwAGVkFIbgAaUzIHg8JSMUjbfyICCpgBCpSkSwAssh8HHczKIAAxUJgVNUOOIFZ8BQAVR+VFTACU+G6wHxU5GdNsVh5GAmk6nO2pFmAaKmAMKJnAiqBQZsACUQUBs2DE+DwADltIhe7g9wejyfUwBBGLBVOkROkbNuMT0ADcuDgAC+CANE6LrASAKDoA6wBuqg2zwAg5o2AQUDIKQpDULWmbSpeGAUjYCGghMnJwI00ioHwjT5CyxAADJ8Gg0grA++LYrgFD6Is+BgGIoS4AAFCeW5qJWSwAJRenAACQUkbEmfBKPkIQrPxVA0YoDHmlIKxUGJP4+l8hlfGRgSUfkaCoH8h7+rRFoeG4-EAORNMEjmpvQXE8Xx-GIBJ3pGUZsmhKQCnWspqmINZ8TOY0rm4CK+CIGUiCoKmFEEMEUAifgSy6fpAWGUF8mKeFvn5QVAVCVlon8XpBkFQBdUVQQwWhUpfAqY5kUePE5BgI5TWGQB+lySFJUdapNH0Yx2ksTSfjYDKqB5XAHkyF5niTmAnbEFAABqJCkLVklGTYJC4GdcocZ6w31Rd508CQYAqBxJkUVRIQnht+QgCK9D5CK2GJfxmQANpGAAZAAugA1PxoMAHoUNDMNiRQ8MI9DABUYmomI7mebxUj8QWSyINsyZnXIvknRVl2kKDZPbFD7H3dT5VfI1HPxdggiePT+lAathN8VtO1QAACiQwb8Y9xDBtgbhpYgQY0FAYBUzQvn+YZl24II+LS1gMpWBx9xCurmuINz378W9ZmfdKRM-X9+TkYgOiRvQstG4rxASeYjA9GJOsFQbcsKybrNi7tB1kLVoMR8bbhQ9zRlAUZIpLsQnjh77JuCw6esURAfaQR6HFrdxRMCX50lZ3zuBhI0uAS8QmyUog-EimNh7seY3oyd+AkUfgNBYP6APl3GOAyuxHFUCEM06XXMlSaP489eZqCWVFtl5mExCqQAIpGZYro2PXTVoy2pj3CmHmJ0lSQBuD7uQklr-ft61fpMlAS-J+t04D8TQtsGQx0KAD2kqNNq4UqAAFJ8D5HyP4J6V4qAbBCMQdIGx5ZQBWlJZAsUxDxBLmXNA2xf4wNauNFSiDch8HwJIFQIpKEYKwXwHBeDgiEP4DwGgPBqFFTGmFCaDCUH5A8LfCMnDuFcN4XVKSgExLULgJkLGPosb6x4qUJ0nF1o1xoOQVAkhTFnBUJSRy-p9YmK0f+XA2ivgNxzgQQQIobFBBlKmR6O8Uq4DImAEAuA+iSHoE3FoN8tGZDgHrLaAAVCCx8cLsSrhtY6g80k118fxUgfkebZ08Lk3AwBcD9AkiYRyfRHK4Bhn4XA4ZSB-gAcXVmzdcDJJlLVeuvNXGg1QPkLadY1ZQAAJooCPhJHxaB+IDK2mWRsIBaow2DtM1AszBnYE6V3MSYkoaFHEMTRyjABqASLg9PgAieCszATIAx1dQi1UHsPfiToYx8HCXGWKUBcDsAoBxRyWTQgDUHiItqbh25HwYT8YgCU+CHnlmoJQb9YVcIwdlVY7dFioEYHI9IIpUp4qRaJQhUkXFSD-i-aS2RgR3AAJf0GkKQmuWgVD7nzD1FQGwIAQEWKQalORgq9RlGkVmoNHI9DcrgRyHQpWOQAMyOShtJJQwrECio4uKyVyYZVKpoUmXq3yACKWstYz3VazL5wQLhiB0NIfioKAD6WE44ZCbiM5MBkZJyUZcQCAhY6DDikPEj2YBwyOTjDQMo65cAQ3lrCn8bkvWyUTIlKAAaoShBDToMN0q250vwHSrQNiIaoQTUmr4MkeDtxWD3Ug5q5h+BFaQT1layXdTIIgDNQa3VgGIFrVtuAZJUzEF4omZZlBvknOGlcChCDBlFcoeIIoRBWM9TJc0qBoweHDECop3gghQFXmvWBdDVKSKtVAdIm7t1SFJTJe2VFzSkEemAQgVker8WfmvdpK5jHDggB+-0TkXJQCld+mSnpcALjUEi5Q4Y+0DruK0MQV6vS4BlDm8MUYADS+RbivwAWvKST9iNKJfqmZ+ZEty3t3SLYm2tv2nrEfQi93z0jUagLe0lAF13r1HWXQIbg6OGO8ge4IIcIPMfaqxtjwRr0CekW4e9UlH3UUpK+99UV+K-v-ZsIDYAQPfKlVBmDcHe39sQMrHAqHwxQcw7myB5gHMkBQPkK2uBCO7OfrxqjqGoArhCOQETDzibiaPaC71tCWPnskfkS9HH-OBb4OQHjfHN3JeC-c9J4XJPEek-AuLKCEsZaC5ecjvmN2juPku9uYZstExJj4CTkWwVnqoEV4r7HN01f8HVtLz9pJc2kvq-wbMtYvVwKDVOKrsBuNhT1Btf9RvxEemEKAjrGggFCpGYgrYlDcVZqCniYBkVSXDSahQdg1aIAAF4XQECoN8tg2wkC0MQJNMlwDQCMuGAABs-YAShJyBBgCubblJKTkHu2BulMpAhayGMD6R8AZLAEZfuVAfVUdSWAEhFCaEMJUAMH62to62CA+kAI+Io7qCEHEIlW4YosB04h4zjD2wYzJFHcW24VtqBSBGYMbkRBAjIoXJmzwshjxLAIGz8IIIZLxIEPED2-BiAmxgoGvitOqDvmaMQHozJpTIEYJWDa1A1dcLAI6zKtxZCE+oKBjo2ZQIpVuG8xA1AJdBrYJGHDQwfehBx3GOlUAC0bUPvyFQOBzNa8l2Y6g+u3AdGNzgM3oXLc6HVzb0Il4CfoSd98l3-hnTu451zqgQe70wH94H7XUgcdDAx1ALH2Am+ohiFBGSf2+PVsQBfKQvqIAhfScgVMahkz4GTKlGmn8ovFRi+Pyf0-Z-kakqq3Azr8w8Fdd+vtHpWvb4gLvw6rMABScZIynnyHLcgsymGb0niINw2x9uIG4lwpyoNmde8wfLqgKGAadzYILWdfKSWEaLGTVSENE-dIK8Y-U-MgdfV+L6QgHyY9GSSAxfaAv7JBP4HQRKOIGuAAEk9EQAAl72lTxR4SgB-AxVrQEECFxQUi4XxRSgGkpRkkvVQW20aAOlKDHVCAnXQmQEnH4j+wnUSAkF8Hp0hysEWAUFZWQ10FwEuQ2lID+3APJX0GCHIC4KIzaxi0v2v1v0Oi7g3gnjAHyBf2IDf3ZU-yPkch-wVlZwZ0vCALEhAOpl2S4OyFtk9w+S3xdTP3+QBWxRVmxFQBqQAB8Yjgid9XV54OJBctw8sh5vYEiT8kiwj3U0jWseDSA+CBDR0nZhDJ0xCu5JC3B8AZC50IdSAxAFCwhkNNBtA9B1CiZNDtDelPAgwoB9Dv1X5v1sDRFcCkFYCkCWFcAyDEDXVKDkxMFWD5F8F70dDPQ8weB0gehUwrZ0g5jDohZ-4+MNFn4nArtkBKRkM7AmjeAnpbjSA+RFDkMZRQs7hHI6VrIOUbE5smhSFCBHhHiHBHJFg1CaBFBHIhQ+0lCBR2UrC2jFA8AX8tY34+jQhQsziFAYxVCtBXio5UIWoDU7j1tNttslBdt39uJUxzivAupPByANc7h0TvheB25HpJwHAFBiA6VHj1ZpRcBJFcAABzvAFov0ULFox6FQZ+LGGJB9fzWjBrbyfcTAgrcROTK9Tjbjdfb9fcGwrWOwyk4cJw-IEnCAMnaIrwiyAzfeeHByRyaXHKKVR1UXVAJQU2JUhjSTKTKA8KPA-AAzXAeJEgLacMMg60DcLaBYpY7BXBBRAhcAn0okq3DXFiDbc3GuSuejHyGwMAdIteW2SKawyM7AC4aUAEo6RyavfpE3DPC3KgFMm3O3Tw-Mk9X0iaf0ggnPXAB8WiWiOXdw3vGMtg2glTLAzINbfcUknbPbBw6wg4q6aVRs23LcRyP8GlDYNWPIRyeIYxBQUhCDGSIs9YdxHqYM4gLafU1-I0r-Zw3-Nw48Dw4AjzDiEwm-PrJib8KhT0PYhs7Pa3FcghRqQ8iA04RABcFYDkrgmSIdHgx0pYQfYfYRYjIdQwmSclaC26fLIVN+f8jXSMMIW3N4rM0TBjXM1sqSQs3M-IEs6ww8iAcsiCSs6srxU3DM0ILPHPR1PPQAgaCi0CycjbLbGco0-IBcybLqPC3PMINc3ADcgQVvKQHc2xfcsAEC48seBbf0c8y82w+wg7Y07-e8--dw3irwl83AN81BPtT8+gb8385cni4C4jKSIdNUlSf0n4JMdoQUJtC1fk-gRojaBpGYz0HgraS7M1EVZZHoaMmg+Msc2C75N2byjXSKxABtH2EkrbaUZXBMQ8ZMcK7AdKzKsSFZUjFyzY0gVBTMR8-iIqsAEq6KsqnYkJVMCVNQTgkCng6QBkxq01DK6KwSx1M06UQq5KiKga0qmGDoCq4jKqmq0oYGBqpq9VZZDoVMPodqnofALqlyoybITfR1NQMATwDiBqxCpo-1BvZCteIdbIY6069YJapYW6mCqSOCl6y6v1N6l+f8YjDCiDLCteDRQUN40hRxOUteRstMoi9JMqCDRsgixAOGxrBGteYbf+IbB0ERVbRMKcnKsAPK8UBQa6Z+E7M7C7FE67JQe7a7J7IUQ8KUYgd7T7KSb7KAc7XAAHNePHMoZNKSHQRgVi6gUOIdGSWPRwOzO6NtKSHoOzMxcMfoVMMAJFdIZyJcYtZ6KVBzcNP4TWsQdcUgGpXzAqNeDoBW0dcMDoLajDNW5ySdLonW0NcNVsdCJ2zzQdQKGSeVS21AcMeVW21Wq9DWmgLW0gF0i0LhbYZ2rDaVHcKOmIF-FQOHMOw2-0Y2z2mW8WqSAAFj9vDFzqDvtpAETu2EdXIHdtCEdRPABNjtzUcgrGEBRPZIUErsaOChNq9sKhkgAFYC7cBe7i6Q7jZkB67w1j5QgpA6UWgVB0xaqvpkpM7Tae6qVZaAIqBv0cdcc1Z4BZbgBuQeYxsgisJUI54Ig7pebT6cJs614haSdqBQZR1djQDEAWZpBcBIw1BzjuIpF-QYhlBXlkBzMxJN6zaZJ0gmZqBydL6ZI96ApebSh4Hva0cqc6AK8-8ASco3QdBbh0hdcrY3ZloGljLCHg6+dX7qAKdwG0dUI1B9wGkH6qBCHydcAhaHNqAyHQ1BhMg6H9xkHV6kcxABHebMhr6ZRt7ccFhYBv0hgkIcde9n5+9vqR9a5+559QLBQY8IIRRpi8AsGlgcGAlSFgkpA+AzFJAvB-19BUMo4ddTFhw+AmMcLuLLUJrsAJZLlBFaorzDS5yuE0zv9PcKADGcGoYn7UBPCuDN8JAOJuKlIPAVgglUxbdYU2lEAW4nx5YqExA9J-qZISd+I-wxAuA-xUniAn6WZrorbuLKmiHUxf99i+A6nf8p8IIcoUomm6mDGUpMb0Lej0NNj0gNrxtEBwxymiMAEsLRo8aSSvFSb58KbEAuaqBLstwBR5mUxn4OauaebcdS8wIsDtEhJpEAGrA0B0wwA6VkNcBZgYRBVsFSg1B1hNhMhsB8BMgRQVgzSHmuEnnGAvmzTGAOhe7MhbmVR7m5EnmXmthKIpAl5UBMgegABOVFsF2U5+DRPhqAaiHCdIdIZAegKOT0OSeHXNKgAAHUQGYHlQADYqAfxArmVQhwxNwnZDwfwlAiXC6+geAdAfxhwtjB6+WfwAIMWCmuEIAvRn1sJ6sLTGWLImIlb8x6DRJGDsVwwABiegZFnVnV+grhd7JWvlvwBSUdXATV-AHa61n8Bii86Qa2kUKVqE8x0JF1215AIWsiVAIJcMWlvoXl-l3xLSFYZViAUV5+M0yQWodBz0BgrFQILV+gZNg1lm4TMpE1sac1zV5F-AXN3NiNiVv1aDBvL0eNpg-21QNEMAWtcmBVneJVkJfIAAdhVe9d9bKQDYQVTaNZCULakijer3SG2wRTLbVYTcrfbFb37ajexa9GDcbb6HyF7vzCbZXalaXfXb7aIyjbQfiE9AXe0nDCXdbfDbtZWGkEYCHAA2PeXadZnclejep3SAMDHhUE9BVxLDGdwHlUzbNdMSndQH7a6CwHNDwBJkvfbZAB5cDb8lNMldtx3j4k9AtMYHEdpCwXHiTGtoDZNZ6HoGIB-FQ6lCFZ6FpZFdfng79UQ4ok8Dnc9AczN1KBWCkFZclHACI67xYLkAgFY7KTktwA6FFYFLNJo51xjabBE4Q4sj4mry9FQ8w94+toE-lVFaIxeDdyb13dQGoD7AfAAC17dUJC9idpOkO70wb6yKdUGJOMHWcP9DG+BcHE8q8jS082LM8qA+oK65yjB7d2myZu9cc52mH8A1AjTdtTw+AwA2BQ8DKiYo9nieA6UYgfAFAjAkdgH+HAcQuuFqAfW6x24IAjPHc1IcI2BtkbnUA6UJdMv6GZGbPqcXOCuiuPdOc-95nbgGKdBqAbbA6g4Xd5UjcvBpBeu+h+gBvGAhv3O6yiYndsBHV5mRrWu7hazUJtIaBKiKBAUPsm9cviB8uia+ASuTPOuYBKvfBGUpA6vsvGv0HdcfXlc2vK9OuvBPWxv+uehBvhvLgpAxuJuvupvhvWLZuOKvOFulvhwZv1uVhNvJxtuCPHIO8zSm8X1EwYAouZRwxkVGV1ZdGgTETVu54WjShLg54X9o8Foq6kwClLBp7lAXg1sFG+8RQVHwwnMNHv01BzwUpKuzZH8rDNkwA-glArDCxtgfh1kqyjTgCemgPv0WvNhWZLCt4toRfviwBxfJenJFeIBnzX6uDHvzH+ex5Be1fReeotepfdf9f2Zv1v1bZufIk+f-kMNLNY0IYBI7gwBCulfciqBbg4jvfldkiIxdJcBWzCjijghSiNoRCp0qipDaibnSAw8P9I9Hhnj5mwT6UNgASYd9G0IYS-A0-QstDoKdD+jBiMb8nlEv4BnWshn5VKNiM9jQZDyVfJ5zeNerenJwu5zZeAuUo+M15O-rDu+xeJfrefeivgDn1gGlBTFcjEN0u8iflwwx+hf1fJ-tfHIbfzLX6R+N0BfVfsBt-Lep+deju5-KQF--Fl-3eTBUj1+mTTfT-heLf-Re+9-r+D-qYINlUGNSlJVn4xboYwfHHyEenUZi1AoepPSjeRNKicZOSlK0jvBtJ2RD4TkedNpEQDOlXS7pVmHugwIwCKouNBaGAG2S+8IAqNPiCRVCw5k8yrWSit7GPK0Uyyb6Jit-hB7sU-u4PG3EtwI6bAzKFFTfBYlZh1hzcggekBUCebVUru6yY3uYD4BEN540qCxHtWIy2wxBuRCIldxSj8V3KqkJBD8D7B9g-gK4SMHtD+B6dCwtEP4LgGsF9hIwfYXAKeD+B-Bj4PZFcCuD+Bxg4wQZSMPGDPj2CHwEsCWLRB+ArgHw8SH4NflwB7QHwfYOML2BApVlx2FbbjmwQJR-giUqEHKImhArgF+mhSaClShcraDVuuwaqnEGIAd8T+XfM-p-016X8f+yuW3iiQ4ggULED+N-g0I-498Wh+-bwmARAp-0t03sRyN4H9AgBgCo1QzFQFGSLDRkjAMsGWEYDHxj4Y5KSOQCgD-RxKYqT0IINUab8J+F-XfkMKtgq0+A16eoeP0aEDDzhv-YYRQUAEoU0K7aEoUDWgpJkxsfUB8HBjypzk+enpBgRRSorFkQypZBihwMAbOFuBnnbzjsPT5+cWyTAoyEdTUDK9bhW-Jod-374GVB+DnFKKUPXjYjThX-QYTP02A383wcGJfr8i3xqAuhZI+4Tv2n5tCvC8-OkazHYCMjDyaFYGkc0s41wIa4rNeH1EoFFcaBXpaCn8IBF8AjS2yDAmnAqjDZmoB1QVDgXgRIJQgt6CwFcg4TLE4yqxQaKqO7pGRSsKWb9pAIkhQJaY6ogKHAINL6V0+t5KjtQOQHAEnW8KRAOgIPgOR-8iYScAgVFyt43ApogKJViGx-wZmxJKcnMKOzk1SElNaVGs30CStpQbNHZv9kBxIQBaQtEWlQDFprxJa8Ge0avXlroYranbdyBmLDSOQigwKFWi7WlSNilKWdGhhbSrGVsbatYv1NKHVr4BSANgcetQWHFd1b6MkWBmvRzob0t6sjXegLQPqfAe48QE+jvjPoK4RGaOdDpOMFqBg8uVACJi-Wpjv1PAX9H+tYR6gAMjopYvJGAwQYQMoGVAGBigwEb70kGe43HHuzs7-4HOODPBgQ1fpEM8GpDYCXMIobUwqG74nOsFyy7r8mGLDYhuw1DScNgJDmHhtixgmiNPxKDIYOh0kZDBFxojeRoNh7ws8B8oQYfOz1tHQIQaYLNCBhh0b7k56cuf8U52MZBIm45jc1hIF5RjZcedjTwOa0cY-D4grjc6u4zACeMrkPjeAf42ICBNnCwTUJk53CajoomEGGJqzHiZKBtIyTLfCQA9LtIsmyAHJnkwgyFNimpTQybCkqZHYamzTMQPsmfpNwFYXTZyZUAVhtMiR-tWpp5Ll59NihjcKDEM1zonitY4zIyYYSmbLZthxqKaiKivJax4YSjfGkJTJKIAKSc5PvOlMW44R10UMLwkEg8D8QBIPcNWHmWgHPxRBjqY+CJA-gcQJB3EKQW4HyBLBjOcg8iPxEUFqEVBrvRyPVKL4aCtBdUhqaTVd66Coi+ZQwdClMHmDLB1gh8LYPsGODnBrg9wZ4IfDeDfB-g+JIEKvxlgQhYQiIVEJiFxCEhSQlIWvDSE5R1WzBPFNkJaixliUOUY2t+nXyA0saG6MaUX2V6-TyAt+PtM-BeQVT1YzwzAjSj7TvgzSjwMDIOHOKq5PA5oCUpcRFDfojqKM1mGDOsKEMCUNAYGKAmTA6BaJAkT0JInHxTYyQmxKGOGDJBWxGoqYG6BJChnywkwUbBGenwwzmMUZQaMUHYQEhMx0gmxCKWMythzVN8pAHcJACgDUApSNzbkryVngMsMZc2XXm0g9TB9jea-LgiMTBaNF+QcuBdJoBSRLpUSa-VMASWz5KUzZ8s6tJ3HNnco4giAB3uEn4iLdjwoMeVOEz6BVNXeK-TAuvCpFSspIcTFGV7PCY9AZsxGI3kOjDmezvZoMDoNHLbJaiOySCHng43MZ7kieCgMgrr1fjcB85R3BYrIiNGjkUC9vAspkQ9n4BQYUcj3l8Frn1z9kL5V3n+S4p24Q4clMFg2jKQQYaUOc0uioATH0MTwOciGrFG0YKA88KlUxB-StACQScb8MBC1B4DbA5qZAu8YmJcqVioM1Y5WnbRDr+Aw6nKUcY5H1pp0jaE4lyl2P3k9jh66tduk7WbFx0I0jtTulnRcq+1uxAdR+aHXDqR1-A0dc+QnWAVJ0JsuAVOmBwzo3ziM+dX+bgCLoq0S6ZdHztTxrqVgII58puhT1bpU8O6SYOBWvH7qIKh6KCkeq0HPmT0pA9PAUPPSWrstlAxCmcbLSOr3YOIF49Pn-RsqAM7xLMsFoU14nnjv63C68fSFvF388kIcQwXeIiZFTX4HiG4goGeIQpZQ7xd2HoD-DIpe6b8MbPLL7QCAbAdKLSb8S7LW4qGf4SyV-j1hiAKAjqW7Ak30kgAg4xTGABQD6DWTGAIg34sGTgyngFYOk27JUxbk0UkUpQ2aZxlwo54rwpAPxUoACVYAihpAcxYyRhivkr875GytpC-IOpSxws+JYgESVWZWK16AGdaEbLxIkUyuN8rkkKXFK0owcxpcrjEhBSyh4o6WdAEsUQYpZMs9JX9mAB4AHucLBFrcF+gqx8uJudIA5gnKoRpAP4edJ2jAAUA6ATAZgMmHDIyA0unYPsJEM2D8AwgwGFJVJVaXMgRlmkTigBTIIJIkkOEWqABGuChA2Ay5a5dgESSIAlRrSx5ddwxAwA-s0FbIL0ugD9LgAPAGAFc3DyLLJwVhG5i8s9BmMqIcwpyEsNGSrCNhA0B5W2MdmWBqqkiIYGCv+Vrwhib8AYgoCgw0pmgASRMGKGiXW5fKSIt4ifTv4DzeGFobGcoEqnPCyyQiPQHaIdSJgxADFNDDoEajgEaUnwUsdzNpUa5TF4k27BQGmzQVJZIqR1I2R0nhzk5Vi7CmnJUi1zN5EGNQA2H7FgA3y6qz2bnX2TyCypvU5Qb-lUENiQoKA9YEP1QAGqjV0IlcHGD2hfB45dci1aaW6lqF1GtqwJQNKHEjivCcvCDI73dXShPVe0CioUyOp2LbajqCABQE2KqqpKTipJiAB-COoxAwANNWUzEAwxUYTAowtAUzWNlQYBaoqSSNtjVqpKtagKS6v4pSQHFt+YxEslr4uVPQNTfGCBQ3RTKPAGwLQDsr2Un488wGVAOUqkRSUqlUAZXPGtyQqqa1daryVgEaVUDmlfAXZEf2IyNMm1OeFtfslaZDqpILYh0uOIvXvCZIRQ9pRjSBrRrvYhqusW+UTVf5k1HilJumuPXW4c1QSfNYWuLVb5S15akCoYP-Ua5T1D6xtWuubUbq5e7aztQIiKJlSL1-avyYOpcqj8R1Wy8dbsovhTrDlhmKyh+RyV2VZkc6ypdUr4C1LoNYAU9Zuqsze8d1Ws3ZGJAPU-p3JjG5jeetw1Hk35bYxyLeqHUPr3hAoiDD0s6WyyqAwAXeirOIxJq5sBan9VvilZxNHFek3NSWqLXhswNZanxb1DrCoYiloa7mnCocX8aFYAER1K8qJq3KukXy2YsEo3WhpKCh5IFVAH6WHkgcwjECoMua7nK0AYyv6JMpwDTLQ0syy4hSkWV9QVlDAFgBss9DWaN1rFOcYJvejwsLlVAMgqQFM0JLbNbAVzTZqwAAR+IpW9zTmmcq4bAtvyvzayr+XPr5qsm9JfJukYwAlNWNb2jwV9RdwSBEtZMd+0cimbCA0glQCsDpTT1FZ7ACtI+I5o5jmodfNHPI3y2yaAIcjMoNhKkiKNwGPqK6t2izRXr6Ih4UMHNtgZ9MpmdUV+IZGAh2hOQged0HhA5rwAgAA",
    method: "decompressFromEncodedURIComponent"
  };

  // src/vendor/lz-string/lz-string.js
  var LZString = function() {
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (var i2 = 0; i2 < alphabet.length; i2++) {
          baseReverseDic[alphabet][alphabet.charAt(i2)] = i2;
        }
      }
      return baseReverseDic[alphabet][character];
    }
    var LZString2 = {
      compressToBase64: function(input) {
        if (input == null)
          return "";
        var res = LZString2._compress(input, 6, function(a) {
          return keyStrBase64.charAt(a);
        });
        switch (res.length % 4) {
          default:
          case 0:
            return res;
          case 1:
            return res + "===";
          case 2:
            return res + "==";
          case 3:
            return res + "=";
        }
      },
      decompressFromBase64: function(input) {
        if (input == null)
          return "";
        if (input == "")
          return null;
        return LZString2._decompress(input.length, 32, function(index) {
          return getBaseValue(keyStrBase64, input.charAt(index));
        });
      },
      compressToUTF16: function(input) {
        if (input == null)
          return "";
        return LZString2._compress(input, 15, function(a) {
          return f(a + 32);
        }) + " ";
      },
      decompressFromUTF16: function(compressed) {
        if (compressed == null)
          return "";
        if (compressed == "")
          return null;
        return LZString2._decompress(compressed.length, 16384, function(index) {
          return compressed.charCodeAt(index) - 32;
        });
      },
      compressToUint8Array: function(uncompressed) {
        var compressed = LZString2.compress(uncompressed);
        var buf = new Uint8Array(compressed.length * 2);
        for (var i2 = 0, TotalLen = compressed.length; i2 < TotalLen; i2++) {
          var current_value = compressed.charCodeAt(i2);
          buf[i2 * 2] = current_value >>> 8;
          buf[i2 * 2 + 1] = current_value % 256;
        }
        return buf;
      },
      decompressFromUint8Array: function(compressed) {
        if (compressed === null || compressed === void 0) {
          return LZString2.decompress(compressed);
        } else {
          var buf = new Array(compressed.length / 2);
          for (var i2 = 0, TotalLen = buf.length; i2 < TotalLen; i2++) {
            buf[i2] = compressed[i2 * 2] * 256 + compressed[i2 * 2 + 1];
          }
          var result = [];
          buf.forEach(function(c) {
            result.push(f(c));
          });
          return LZString2.decompress(result.join(""));
        }
      },
      compressToEncodedURIComponent: function(input) {
        if (input == null)
          return "";
        return LZString2._compress(input, 6, function(a) {
          return keyStrUriSafe.charAt(a);
        });
      },
      decompressFromEncodedURIComponent: function(input) {
        if (input == null)
          return "";
        if (input == "")
          return null;
        input = input.replace(/ /g, "+");
        return LZString2._decompress(input.length, 32, function(index) {
          return getBaseValue(keyStrUriSafe, input.charAt(index));
        });
      },
      compress: function(uncompressed) {
        return LZString2._compress(uncompressed, 16, function(a) {
          return f(a);
        });
      },
      _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null)
          return "";
        var i2, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
        for (ii = 0; ii < uncompressed.length; ii += 1) {
          context_c = uncompressed.charAt(ii);
          if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
          }
          context_wc = context_w + context_c;
          if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
          } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i2 = 0; i2 < context_numBits; i2++) {
                  context_data_val = context_data_val << 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i2 = 0; i2 < 8; i2++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i2 = 0; i2 < context_numBits; i2++) {
                  context_data_val = context_data_val << 1 | value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i2 = 0; i2 < 16; i2++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i2 = 0; i2 < context_numBits; i2++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
          }
        }
        if (context_w !== "") {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
              for (i2 = 0; i2 < context_numBits; i2++) {
                context_data_val = context_data_val << 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i2 = 0; i2 < 8; i2++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i2 = 0; i2 < context_numBits; i2++) {
                context_data_val = context_data_val << 1 | value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i2 = 0; i2 < 16; i2++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i2 = 0; i2 < context_numBits; i2++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
        }
        value = 2;
        for (i2 = 0; i2 < context_numBits; i2++) {
          context_data_val = context_data_val << 1 | value & 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
        while (true) {
          context_data_val = context_data_val << 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
          } else
            context_data_position++;
        }
        return context_data.join("");
      },
      decompress: function(compressed) {
        if (compressed == null)
          return "";
        if (compressed == "")
          return null;
        return LZString2._decompress(compressed.length, 32768, function(index) {
          return compressed.charCodeAt(index);
        });
      },
      _decompress: function(length, resetValue, getNextValue) {
        var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i2, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
        for (i2 = 0; i2 < 3; i2 += 1) {
          dictionary[i2] = i2;
        }
        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        switch (next = bits) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;
          case 2:
            return "";
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        while (true) {
          if (data.index > length) {
            return "";
          }
          bits = 0;
          maxpower = Math.pow(2, numBits);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          switch (c = bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;
            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;
            case 2:
              return result.join("");
          }
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
          if (dictionary[c]) {
            entry = dictionary[c];
          } else {
            if (c === dictSize) {
              entry = w + w.charAt(0);
            } else {
              return null;
            }
          }
          result.push(entry);
          dictionary[dictSize++] = w + entry.charAt(0);
          enlargeIn--;
          w = entry;
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
        }
      }
    };
    return LZString2;
  }();

  // src/views.js
  var fView = function() {
    var views = [
      { id: "/views/test-swal-sauvegarde", path: "views", file: "test-swal-sauvegarde", ptr: export_table_default }
    ];
    var load = function(sView) {
      oCurView = views.find((o) => o.id == sView);
      if (oCurView === void 0) {
        console.log(`%cError view ${sView} could't be found`, APP_ERROR_STYLE);
      }
      oCurView = oCurView.ptr;
      let sHtmlPacked = oCurView.data;
      let sHtmlUnpacked = LZString[oCurView.method](sHtmlPacked);
      return sHtmlUnpacked;
    };
    return Object.freeze({
      load
    });
  };
  var View = fView();
  var views_default = View;

  // src/vendor/sheetrock/sheetrock.neutral.tampermonkey.js
  var __create2 = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __markAsModule2 = (target) => __defProp2(target, "__esModule", { value: true });
  var __commonJS3 = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport2 = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames2(module))
        if (!__hasOwnProp2.call(target, key) && key !== "default")
          __defProp2(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc2(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule2 = (module) => {
    return __reExport2(__markAsModule2(__defProp2(module != null ? __create2(__getProtoOf2(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var require_cross_fetch = __commonJS3({
    "vendor/cross-fetch.js"(exports) {
      !function(t) {
        !function(e) {
          var r2 = "URLSearchParams" in t, o = "Symbol" in t && "iterator" in Symbol, n = "FileReader" in t && "Blob" in t && function() {
            try {
              return new Blob(), true;
            } catch (t2) {
              return false;
            }
          }(), i2 = "FormData" in t, s = "ArrayBuffer" in t;
          if (s)
            var a = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"], h2 = ArrayBuffer.isView || function(t2) {
              return t2 && a.indexOf(Object.prototype.toString.call(t2)) > -1;
            };
          function u(t2) {
            if (typeof t2 != "string" && (t2 = String(t2)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t2))
              throw new TypeError("Invalid character in header field name");
            return t2.toLowerCase();
          }
          function d(t2) {
            return typeof t2 != "string" && (t2 = String(t2)), t2;
          }
          function f(t2) {
            var e2 = { next: function() {
              var e3 = t2.shift();
              return { done: e3 === void 0, value: e3 };
            } };
            return o && (e2[Symbol.iterator] = function() {
              return e2;
            }), e2;
          }
          function c(t2) {
            this.map = {}, t2 instanceof c ? t2.forEach(function(t3, e2) {
              this.append(e2, t3);
            }, this) : Array.isArray(t2) ? t2.forEach(function(t3) {
              this.append(t3[0], t3[1]);
            }, this) : t2 && Object.getOwnPropertyNames(t2).forEach(function(e2) {
              this.append(e2, t2[e2]);
            }, this);
          }
          function p(t2) {
            if (t2.bodyUsed)
              return Promise.reject(new TypeError("Already read"));
            t2.bodyUsed = true;
          }
          function y(t2) {
            return new Promise(function(e2, r22) {
              t2.onload = function() {
                e2(t2.result);
              }, t2.onerror = function() {
                r22(t2.error);
              };
            });
          }
          function l(t2) {
            var e2 = new FileReader(), r22 = y(e2);
            return e2.readAsArrayBuffer(t2), r22;
          }
          function b(t2) {
            if (t2.slice)
              return t2.slice(0);
            var e2 = new Uint8Array(t2.byteLength);
            return e2.set(new Uint8Array(t2)), e2.buffer;
          }
          function m() {
            return this.bodyUsed = false, this._initBody = function(t2) {
              var e2;
              this._bodyInit = t2, t2 ? typeof t2 == "string" ? this._bodyText = t2 : n && Blob.prototype.isPrototypeOf(t2) ? this._bodyBlob = t2 : i2 && FormData.prototype.isPrototypeOf(t2) ? this._bodyFormData = t2 : r2 && URLSearchParams.prototype.isPrototypeOf(t2) ? this._bodyText = t2.toString() : s && n && ((e2 = t2) && DataView.prototype.isPrototypeOf(e2)) ? (this._bodyArrayBuffer = b(t2.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : s && (ArrayBuffer.prototype.isPrototypeOf(t2) || h2(t2)) ? this._bodyArrayBuffer = b(t2) : this._bodyText = t2 = Object.prototype.toString.call(t2) : this._bodyText = "", this.headers.get("content-type") || (typeof t2 == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r2 && URLSearchParams.prototype.isPrototypeOf(t2) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
            }, n && (this.blob = function() {
              var t2 = p(this);
              if (t2)
                return t2;
              if (this._bodyBlob)
                return Promise.resolve(this._bodyBlob);
              if (this._bodyArrayBuffer)
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              if (this._bodyFormData)
                throw new Error("could not read FormData body as blob");
              return Promise.resolve(new Blob([this._bodyText]));
            }, this.arrayBuffer = function() {
              return this._bodyArrayBuffer ? p(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(l);
            }), this.text = function() {
              var t2, e2, r22, o2 = p(this);
              if (o2)
                return o2;
              if (this._bodyBlob)
                return t2 = this._bodyBlob, e2 = new FileReader(), r22 = y(e2), e2.readAsText(t2), r22;
              if (this._bodyArrayBuffer)
                return Promise.resolve(function(t3) {
                  for (var e3 = new Uint8Array(t3), r3 = new Array(e3.length), o3 = 0; o3 < e3.length; o3++)
                    r3[o3] = String.fromCharCode(e3[o3]);
                  return r3.join("");
                }(this._bodyArrayBuffer));
              if (this._bodyFormData)
                throw new Error("could not read FormData body as text");
              return Promise.resolve(this._bodyText);
            }, i2 && (this.formData = function() {
              return this.text().then(E);
            }), this.json = function() {
              return this.text().then(JSON.parse);
            }, this;
          }
          c.prototype.append = function(t2, e2) {
            t2 = u(t2), e2 = d(e2);
            var r22 = this.map[t2];
            this.map[t2] = r22 ? r22 + ", " + e2 : e2;
          }, c.prototype.delete = function(t2) {
            delete this.map[u(t2)];
          }, c.prototype.get = function(t2) {
            return t2 = u(t2), this.has(t2) ? this.map[t2] : null;
          }, c.prototype.has = function(t2) {
            return this.map.hasOwnProperty(u(t2));
          }, c.prototype.set = function(t2, e2) {
            this.map[u(t2)] = d(e2);
          }, c.prototype.forEach = function(t2, e2) {
            for (var r22 in this.map)
              this.map.hasOwnProperty(r22) && t2.call(e2, this.map[r22], r22, this);
          }, c.prototype.keys = function() {
            var t2 = [];
            return this.forEach(function(e2, r22) {
              t2.push(r22);
            }), f(t2);
          }, c.prototype.values = function() {
            var t2 = [];
            return this.forEach(function(e2) {
              t2.push(e2);
            }), f(t2);
          }, c.prototype.entries = function() {
            var t2 = [];
            return this.forEach(function(e2, r22) {
              t2.push([r22, e2]);
            }), f(t2);
          }, o && (c.prototype[Symbol.iterator] = c.prototype.entries);
          var w = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
          function v(t2, e2) {
            var r22, o2, n2 = (e2 = e2 || {}).body;
            if (t2 instanceof v) {
              if (t2.bodyUsed)
                throw new TypeError("Already read");
              this.url = t2.url, this.credentials = t2.credentials, e2.headers || (this.headers = new c(t2.headers)), this.method = t2.method, this.mode = t2.mode, this.signal = t2.signal, n2 || t2._bodyInit == null || (n2 = t2._bodyInit, t2.bodyUsed = true);
            } else
              this.url = String(t2);
            if (this.credentials = e2.credentials || this.credentials || "same-origin", !e2.headers && this.headers || (this.headers = new c(e2.headers)), this.method = (r22 = e2.method || this.method || "GET", o2 = r22.toUpperCase(), w.indexOf(o2) > -1 ? o2 : r22), this.mode = e2.mode || this.mode || null, this.signal = e2.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && n2)
              throw new TypeError("Body not allowed for GET or HEAD requests");
            this._initBody(n2);
          }
          function E(t2) {
            var e2 = new FormData();
            return t2.trim().split("&").forEach(function(t3) {
              if (t3) {
                var r22 = t3.split("="), o2 = r22.shift().replace(/\+/g, " "), n2 = r22.join("=").replace(/\+/g, " ");
                e2.append(decodeURIComponent(o2), decodeURIComponent(n2));
              }
            }), e2;
          }
          function A(t2, e2) {
            e2 || (e2 = {}), this.type = "default", this.status = e2.status === void 0 ? 200 : e2.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in e2 ? e2.statusText : "OK", this.headers = new c(e2.headers), this.url = e2.url || "", this._initBody(t2);
          }
          v.prototype.clone = function() {
            return new v(this, { body: this._bodyInit });
          }, m.call(v.prototype), m.call(A.prototype), A.prototype.clone = function() {
            return new A(this._bodyInit, { status: this.status, statusText: this.statusText, headers: new c(this.headers), url: this.url });
          }, A.error = function() {
            var t2 = new A(null, { status: 0, statusText: "" });
            return t2.type = "error", t2;
          };
          var _2 = [301, 302, 303, 307, 308];
          A.redirect = function(t2, e2) {
            if (_2.indexOf(e2) === -1)
              throw new RangeError("Invalid status code");
            return new A(null, { status: e2, headers: { location: t2 } });
          }, e.DOMException = t.DOMException;
          try {
            new e.DOMException();
          } catch (t2) {
            e.DOMException = function(t3, e2) {
              this.message = t3, this.name = e2;
              var r22 = Error(t3);
              this.stack = r22.stack;
            }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
          }
          function g(t2, r22) {
            return new Promise(function(o2, i22) {
              var s2 = new v(t2, r22);
              if (s2.signal && s2.signal.aborted)
                return i22(new e.DOMException("Aborted", "AbortError"));
              var a2 = new XMLHttpRequest();
              function h22() {
                a2.abort();
              }
              a2.onload = function() {
                var t3, e2, r3 = { status: a2.status, statusText: a2.statusText, headers: (t3 = a2.getAllResponseHeaders() || "", e2 = new c(), t3.replace(/\r?\n[\t ]+/g, " ").split(/\r?\n/).forEach(function(t4) {
                  var r4 = t4.split(":"), o3 = r4.shift().trim();
                  if (o3) {
                    var n3 = r4.join(":").trim();
                    e2.append(o3, n3);
                  }
                }), e2) };
                r3.url = "responseURL" in a2 ? a2.responseURL : r3.headers.get("X-Request-URL");
                var n2 = "response" in a2 ? a2.response : a2.responseText;
                o2(new A(n2, r3));
              }, a2.onerror = function() {
                i22(new TypeError("Network request failed"));
              }, a2.ontimeout = function() {
                i22(new TypeError("Network request failed"));
              }, a2.onabort = function() {
                i22(new e.DOMException("Aborted", "AbortError"));
              }, a2.open(s2.method, s2.url, true), s2.credentials === "include" ? a2.withCredentials = true : s2.credentials === "omit" && (a2.withCredentials = false), "responseType" in a2 && n && (a2.responseType = "blob"), s2.headers.forEach(function(t3, e2) {
                a2.setRequestHeader(e2, t3);
              }), s2.signal && (s2.signal.addEventListener("abort", h22), a2.onreadystatechange = function() {
                a2.readyState === 4 && s2.signal.removeEventListener("abort", h22);
              }), a2.send(s2._bodyInit === void 0 ? null : s2._bodyInit);
            });
          }
          g.polyfill = true, t.fetch || (t.fetch = g, t.Headers = c, t.Request = v, t.Response = A), e.Headers = c, e.Request = v, e.Response = A, e.fetch = g, Object.defineProperty(e, "__esModule", { value: true });
        }({});
      }(typeof self != "undefined" ? self : exports);
    }
  });
  var defaults = {
    url: "",
    query: "",
    target: null,
    fetchSize: 0,
    labels: [],
    rowTemplate: null,
    callback: null,
    reset: false
  };
  var legacyOptions = {
    sql: "query",
    resetStatus: "reset",
    chunkSize: "fetchSize",
    rowHandler: "rowTemplate"
  };
  var sheetTypes = {
    2014: {
      apiEndpoint: "https://docs.google.com/spreadsheets/d/%key%/gviz/tq?",
      keyFormat: new RegExp("spreadsheets/d/([^/#]+)", "i"),
      gidFormat: new RegExp("gid=([^/&#]+)", "i")
    },
    2010: {
      apiEndpoint: "https://spreadsheets.google.com/tq?key=%key%&",
      keyFormat: new RegExp("key=([^&#]+)", "i"),
      gidFormat: new RegExp("gid=([^/&#]+)", "i")
    }
  };
  function getCellValue(cell) {
    let value = cell ? cell.f || cell.v || cell : "";
    if (value instanceof Array) {
      value = value.join("");
    }
    if (typeof value === "object") {
      return "";
    }
    return `${value}`.replace(/^\s+|\s+$/, "");
  }
  function extractElement(blob) {
    let el = blob;
    if (typeof el === "object" && el.jquery && el.length) {
      [el] = el;
    }
    return el && el.nodeType && el.nodeType === 1 ? el : null;
  }
  function append(target, html) {
    if (target && target.insertAdjacentHTML) {
      target.insertAdjacentHTML("beforeEnd", html);
    }
  }
  function hasClass(el, className) {
    const classes = ` ${el.className} `;
    return classes.indexOf(` ${className} `) !== -1;
  }
  function isTable(el) {
    return el && el.tagName === "TABLE";
  }
  function wrapTag(str, tag) {
    return `<${tag}>${str}</${tag}>`;
  }
  function toHTML(row) {
    const tag = row.num ? "td" : "th";
    let html = "";
    Object.keys(row.cells).forEach((key) => {
      html += wrapTag(row.cells[key], tag);
    });
    return wrapTag(html, "tr");
  }
  function triggerEvent(el, eventName) {
    if (typeof Event === "function") {
      const event = new Event(eventName);
      el.dispatchEvent(event);
    }
  }
  var SheetrockError = class extends Error {
    constructor(message = "", code = null) {
      super();
      this.name = "SheetrockError";
      this.code = code;
      this.message = message;
    }
  };
  function translateLegacyOptions(options) {
    const newOptions = {};
    Object.keys(options).forEach((key) => {
      if ({}.hasOwnProperty.call(legacyOptions, key)) {
        newOptions[legacyOptions[key]] = options[key];
      } else {
        newOptions[key] = options[key];
      }
    });
    return newOptions;
  }
  function setUserOptions(options) {
    const validatedOptions = {};
    validatedOptions.target = extractElement(options.target);
    validatedOptions.fetchSize = Math.max(0, parseInt(options.fetchSize, 10) || 0);
    if (!validatedOptions.target && !options.callback && !defaults.callback) {
      throw new SheetrockError("No element targeted or callback provided.");
    }
    return { ...defaults, ...options, ...validatedOptions };
  }
  function setRequestOptions(options, data) {
    if (data) {
      return { data };
    }
    let sheetType = null;
    Object.keys(sheetTypes).forEach((key) => {
      const value = sheetTypes[key];
      if (value.keyFormat.test(options.url) && value.gidFormat.test(options.url)) {
        sheetType = value;
      }
    });
    if (sheetType) {
      const sheetKey = options.url.match(sheetType.keyFormat)[1];
      return {
        key: sheetKey,
        gid: options.url.match(sheetType.gidFormat)[1],
        apiEndpoint: sheetType.apiEndpoint.replace("%key%", sheetKey)
      };
    }
    throw new SheetrockError("No key/gid in the provided URL.");
  }
  var Options = class {
    constructor(options = {}, data = false) {
      this.user = setUserOptions(translateLegacyOptions(options));
      this.request = setRequestOptions(this.user, data);
      this.requestIndex = `${this.request.key}_${this.request.gid}_${this.user.query}`;
    }
  };
  var stateCache = {
    defaults: {
      failed: false,
      header: 0,
      labels: null,
      loaded: false,
      offset: 0
    },
    store: {}
  };
  var Request = class {
    constructor(options) {
      this.options = options;
      this.index = options.requestIndex;
      if (this.state.failed) {
        throw new SheetrockError("A previous request for this resource failed.");
      }
      if (this.state.loaded) {
        throw new SheetrockError("No more rows to load!");
      }
    }
    get state() {
      const hasPreviousState = {}.hasOwnProperty.call(stateCache.store, this.index);
      const reset = this.options.user.reset || this.options.request.data;
      if (!hasPreviousState || reset) {
        const savedState = {
          labels: hasPreviousState ? stateCache.store[this.index].labels : null
        };
        stateCache.store[this.index] = { ...stateCache.defaults, ...savedState };
      }
      return stateCache.store[this.index];
    }
    get url() {
      const size = this.options.user.fetchSize;
      const pageQuery = size ? ` limit ${size + 1} offset ${this.state.offset}` : "";
      const queryVars = [
        `gid=${encodeURIComponent(this.options.request.gid)}`,
        `tq=${encodeURIComponent(this.options.user.query + pageQuery)}`
      ];
      return this.options.request.apiEndpoint + queryVars.join("&");
    }
    update(attributes = {}) {
      stateCache.store[this.index] = Object.assign(this.state, attributes);
    }
  };
  var Row = class {
    constructor(number, cellsArray, labels) {
      this.num = number;
      this.cellsArray = cellsArray.map(getCellValue);
      this.labels = labels;
    }
    get cells() {
      const cellsObj = {};
      this.labels.forEach((label, index) => {
        cellsObj[label] = this.cellsArray[index];
      });
      return cellsObj;
    }
  };
  var Response = class {
    constructor(request) {
      this.request = request;
      this.options = request.options;
    }
    setAttributes() {
      const { fetchSize } = this.options.user;
      const { rows } = this.raw.table;
      const { cols } = this.raw.table;
      const attributes = {
        last: rows.length - 1,
        rowNumberOffset: this.request.state.header || 0
      };
      let columnLabels = this.request.state.labels;
      if (!this.request.state.offset) {
        columnLabels = cols.map((col, i2) => {
          if (col.label) {
            return col.label.replace(/\s/g, "");
          }
          attributes.last += 1;
          attributes.rowNumberOffset = 1;
          return getCellValue(rows[0].c[i2]) || col.id;
        });
        this.request.update({
          header: attributes.rowNumberOffset,
          labels: columnLabels,
          offset: this.request.state.offset + attributes.rowNumberOffset
        });
      }
      if (!fetchSize || rows.length - attributes.rowNumberOffset < fetchSize) {
        attributes.last += 1;
        this.request.update({ loaded: true });
      }
      const userLabels = this.options.user.labels;
      const userLabelsValid = userLabels && userLabels.length === columnLabels.length;
      attributes.labels = userLabelsValid ? userLabels : columnLabels;
      this.attributes = attributes;
    }
    setOutput() {
      this.rows = [];
      if (!this.request.state.offset && !this.attributes.rowNumberOffset) {
        this.rows.push(new Row(0, this.attributes.labels, this.attributes.labels));
      }
      this.raw.table.rows.forEach((row, i2) => {
        if (row.c && i2 < this.attributes.last) {
          const counter = this.request.state.offset + i2 + 1 - this.attributes.rowNumberOffset;
          this.rows.push(new Row(counter, row.c, this.attributes.labels));
        }
      });
      this.request.update({
        offset: this.request.state.offset + this.options.user.fetchSize
      });
    }
    setHTML() {
      const { target } = this.options.user;
      if (typeof target === "undefined" || target === null)
        return;
      const template = this.options.user.rowTemplate || toHTML;
      const isTable2 = isTable(target);
      const needsHeader = target && hasClass(target, "sheetrock-header");
      let headerHTML = "";
      let bodyHTML = "";
      this.rows.forEach((row) => {
        if (row.num) {
          bodyHTML += template(row);
        } else if (isTable2 || needsHeader) {
          headerHTML += template(row);
        }
      });
      if (isTable2) {
        headerHTML = wrapTag(headerHTML, "thead");
        bodyHTML = wrapTag(bodyHTML, "tbody");
      }
      append(target, headerHTML + bodyHTML);
      triggerEvent(target, "sheetrock:loaded");
      this.html = headerHTML + bodyHTML;
    }
    loadData(rawData, callback) {
      this.raw = rawData;
      try {
        this.setAttributes();
        this.setOutput();
      } catch (error) {
        callback(new SheetrockError("Unexpected API response format."));
        return;
      }
      this.setHTML();
      callback(null);
    }
  };
  var import_cross_fetch = __toModule2(require_cross_fetch());
  function get(response, callback) {
    const transportOptions = {
      headers: {
        "X-DataSource-Auth": "true"
      }
    };
    (0, import_cross_fetch.default)(response.request.url, transportOptions).then((resp) => {
      if (!resp.ok) {
        throw new SheetrockError("Request failed.", resp.status);
      }
      return resp.text();
    }).then((body) => {
      const data = JSON.parse(body.replace(/^\)]\}'\n/, ""));
      response.loadData(data, callback);
    }).catch((error) => {
      if (error instanceof SheetrockError) {
        return callback(error);
      }
      const errorMessage = error && error.message ? error.message : "Request failed.";
      return callback(new SheetrockError(errorMessage, 500));
    });
  }
  var callbackIndex = 0;
  function get2(response, callback) {
    const headElement = window.document.getElementsByTagName("head")[0];
    const scriptElement = window.document.createElement("script");
    const callbackName = `_sheetrock_callback_${callbackIndex}`;
    callbackIndex += 1;
    function always() {
      headElement.removeChild(scriptElement);
      delete window[callbackName];
    }
    function success(data) {
      always();
      response.loadData(data, callback);
    }
    function error() {
      always();
      callback(new SheetrockError("Request failed."));
    }
    unsafeWindow[callbackName] = success;
    if (scriptElement.addEventListener) {
      scriptElement.addEventListener("error", error, false);
      scriptElement.addEventListener("abort", error, false);
    }
    scriptElement.type = "text/javascript";
    scriptElement.src = `${response.request.url}&tqx=responseHandler:${callbackName}`;
    headElement.appendChild(scriptElement);
  }
  var version = "1.2.0";
  function sheetrock(userOptions = {}, data = null) {
    let options = null;
    let request = null;
    let response = null;
    function handleError(error) {
      if (error && error.name === "SheetrockError") {
        if (request && request.update) {
          request.update({ failed: true });
        }
      }
      if (userOptions.callback) {
        userOptions.callback(error, options, response);
        return;
      }
      if (error) {
        throw error;
      }
    }
    try {
      options = new Options({ target: this, ...userOptions }, !!data);
      request = new Request(options);
      response = new Response(request);
    } catch (error) {
      handleError(error);
    }
    if (data) {
      response.loadData(data, handleError);
    } else if (options && request && response) {
      if (typeof window === "object" && "document" in window) {
        get2(response, handleError);
      } else {
        get(response, handleError);
      }
    }
    return this;
  }
  Object.assign(sheetrock, { defaults, version });
  try {
    window.jQuery.fn.sheetrock = sheetrock;
  } catch (ignore) {
  }
  var src_default2 = sheetrock;

  // src/sbox_google_sh.js
  var sGoogleSheetURL = "https://docs.google.com/spreadsheets/d/1hn8gBDB-7l02Gp0jAnFq15ogCjpDixKrsxLqAIk3Gt0/edit#gid=0";
  var fSandBox_Google = function() {
    var myCallback = function(error, options, response) {
      if (!error) {
        insert = "";
        console.log("my callback");
        console.dir(response);
        for (i = 0; i < response.raw.table.rows.length; i++) {
          insert = "insert into data (`Team`,`Pos`,`First`,`Last`,`Bats`,`AB`,`R`,`H`,`HR`,`RBI`,`SB`,`BA`) values (";
          datos = "";
          for (h = 0; h < response.raw.table.rows[i].c.length; h++) {
            if (response.raw.table.rows[i].c[h] == null) {
              val = "";
            } else {
              val = response.raw.table.rows[i].c[h].v;
            }
            datos += "'" + val + "'";
            if (h < response.raw.table.rows[i].c.length - 1) {
              datos += ",";
            }
          }
          insert += datos;
          insert += ");";
          console.log(insert);
        }
      }
    };
    const test_1 = function() {
      src_default2({
        url: sGoogleSheetURL,
        query: "select A,B,C",
        callback: myCallback
      }, null);
    };
    const test_dbg = function() {
      const bToDo = false;
      src_default2({ url: sGoogleSheetURL, callback: function(e, o, r2) {
        console.log(e, o, r2);
      } }, {});
      debugger;
    };
    return Object.freeze({
      test_1,
      test_dbg
    });
  };
  var SandBox_Google = fSandBox_Google();
  var sbox_google_sh_default = SandBox_Google;

  // src/index.js
  var Facturier = {
    Cfg: {
      dbase: null
    },
    raf: null,
    cssMainDataSelector: OC_DASHBOARDCSSMAINDATASELECTOR,
    ID_MENU_FORCE_LOADING: null,
    ID_MENU_FORCE_ADDTOLEFTMENU: null,
    start: async function() {
      await domReady();
      const bSupport = Facturier.checkSupport();
      console.log(`%cAre all functions supported ? : ${bSupport}`, APP_DEBUG_STYLE);
      var sCSSObserved2 = "header [class*=MuiAvatar-img]";
      if (document.querySelector(sCSSObserved2) === null) {
        console.log(`%c All condition not met, waiting element '${sCSSObserved2}' `, APP_DEBUG_STYLE);
        document.arrive(sCSSObserved2, Facturier._warmup);
        Facturier.ID_MENU_FORCE_LOADING = GM_registerMenuCommand("force - loading", Facturier._warmup);
        Facturier.ID_MENU_FORCE_ADDTOLEFTMENU = GM_registerMenuCommand("force - populate menuleft", Facturier._addLinkToMenu);
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
      GM_unregisterMenuCommand(Facturier.ID_MENU_FORCE_LOADING);
      if (GM === void 0) {
        console.log("%cI am not in a tamper env", APP_DEBUG_STYLE);
        Facturier._userscriptless();
      } else {
        console.log(`%cTamper environment detected the version is ${GM.info.version}`, APP_DEBUG_STYLE);
      }
      GM_addStyle(GM_getResourceText("jspanelcss"));
      GM_addStyle(GM_getResourceText("toastifycss"));
      GM_addStyle(GM_getResourceText("simpledatatablecss"));
      GM_addStyle(GM_getResourceText("loading_barcss"));
      GM_addStyle(GM_getResourceText("nprogress_css"));
      GM_config.init(appmenu);
      GM_registerMenuCommand("collectauto", opencfg, "a");
      GM_registerMenuCommand("configure", opencfg, "a");
      if (GM_config.get("hackheaderzindex") === true) {
        document.getElementById("header").style.zIndex = 0;
      }
      GM_addStyle(".swal2-title{font-size:1.275em}");
      GM_addStyle(`
		.button {
			display: inline-flex;
			-webkit-box-align: center;
			align-items: center;
			-webkist-box-pack: center;
			justify-content: center;
			text-decoration: none;
			cursor: pointer;
			font-weight: 700;
		}
		.button--primary{
			font-family: "Montserrat";
			font-size: .875rem;
			font-weight: 700;
			text-align: center;
			line-height: 1.5rem;
			border-radius: 4px;
			border-width: 1px;
			border-style: solid;
			outline: none;
			padding: 8px 16px;
			text-transform: uppercase;
			position: relative;
			overflow: hidden;
			color: #fff;
			background-color: #7451eb;
			border-color: #7451eb;
			box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.2);
		}
		.button--primary:hover{
			color: #fff;
			background-color: #7451eb;
			border-color: #7451eb;
			box-shadow: 0 6px 6px 0 rgba(0,0,0,0.26),0 10px 20px 0 rgba(0,0,0,0.19);
		}
		.button--primary:active{
			color: #fff;
			background-color: #7451eb;
			border-color: #7451eb;
			-webkistbox-shadow: none;
			box-shadow: none;
		}
		.button--primary:after{
			content: '';
			position: 'absolute';
			top: 50%;
			left: 50%;
			width: 5px;
			height: 5px;
			background-color: #fff;
			opacity: 0;
			border-radius: 100%;
			-webkit-transform:scale(1,1) translate(-50%);
			transform:scale(1,1) translate(-50%);
			-webkit-transform-origin: 50% 50%;
			transform-origin: 50% 50%;
		}
		.button--primary:disabled{
			color: #545454;
			background-color: #d2d2d2;
			border-color: #d2d2d2;
			-webkit-box-shadow: none;
			box-shadow: none;
		}`);
      var sCSSObserved2 = Facturier.cssMainDataSelector;
      if (document.querySelector(sCSSObserved2) === null) {
        console.log(`%c All condition not met, waiting element '${sCSSObserved2}' `, APP_DEBUG_STYLE);
        document.arrive(sCSSObserved2, Facturier._main);
      } else {
        console.log(`%c All condition already met go`, APP_DEBUG_STYLE);
        Facturier._main();
      }
    },
    _forceCbox: function() {
      Facturier._applyInjectionForSessionsHistory();
    },
    pathname: document.location.pathname,
    _getOCMainClass: function() {
      try {
        const _sOCMainCntClass = document.querySelector(Facturier.cssMainDataSelector).classList.value;
        const _aOCMainSrvId = _sOCMainCntClass.match(/webapp-(\d)/);
        if (_aOCMainSrvId.length == 2)
          return `webapp-${_aOCMainSrvId[1]}`;
        throw new Error("_aOCMainSrvId.length must be 2");
      } catch (error) {
        console.error("%cError in _getOCMainClass():%s", APP_ERROR_STYLE, error);
        return "";
      }
    },
    _sOCMainSrvClassName: "",
    _eventMonitor: function() {
      var bodyList = document.querySelector("body"), observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.target.classList.contains(`${Facturier._sOCMainSrvClassName}-MuiTouchRipple-root`)) {
          }
          if (mutation.target.nodeName === "TBODY" && mutation.target.parentElement.nodeName === "TABLE") {
            debounce(Facturier._applyInjectionOnPathNameMutation());
          }
          if (mutation.target.nodeName === "OL") {
            if (mutation.addedNodes.length === 1 && mutation.addedNodes[0].style.cssText === "" && mutation.addedNodes[0].nodeName === "LI") {
              debounce(patchSessionHistoryLineUI(mutation.addedNodes[0].firstChild));
              Facturier._lastMutation = dayjs().valueOf();
            } else {
              debounce(Facturier._applyInjectionOnPathNameMutation());
            }
          }
          if (mutation.target.nodeName === "BUTTON" && mutation.target.parentElement.parentElement.parentElement.firstElementChild.nodeName === "TABLE") {
            debounce(Facturier._applyInjectionOnPathNameMutation());
          }
          if (mutation.target.ariaLabel === "Page pr\xE9c\xE9dente") {
          }
          if (Facturier.pathname != document.location.pathname) {
            Facturier.pathname = document.location.pathname;
            debounce(Facturier._applyInjectionOnPathNameMutation());
          }
        });
      });
      var config = {
        childList: true,
        subtree: true
      };
      observer.observe(bodyList, config);
    },
    _applyInjectionOnPathNameMutation: function() {
      let bStop = false;
      if (bStop === false && document.location.pathname.match(/\/sessions$/)) {
        bStop = true;
        Facturier._applyInjectionForSessionsToComplete();
      }
      if (bStop === false && document.location.pathname.match(/\/booked-mentorship-sessions$/)) {
        bStop = true;
        Facturier._applyInjectionForSessionsBooked();
      }
      if (bStop === false && document.location.pathname.match(/\/mentorship-sessions-history$/)) {
        bStop = true;
        Facturier._applyInjectionForSessionsHistory();
      }
      if (bStop === false) {
        console.log("%cUnknow Route so could't guess what to do", APP_ERROR_STYLE);
      }
    },
    _lastMutation: 0,
    _applyInjectionForSessionsToComplete: function() {
      if (document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`) !== null) {
        document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`).style.display = "none";
      }
      console.log("%cWill Patch All Buttons corresponding to this CSS PATH %s", APP_DEBUG_STYLE, `${Facturier.cssMainDataSelector} a a[href*=sessions]`);
      var btns = Array.from(document.querySelectorAll(`${Facturier.cssMainDataSelector} a a[href*=sessions]`));
      var _handler2;
      btns.forEach(function(btn) {
        console.log("%cWill Patch Button %o", APP_DEBUG_STYLE, btn);
        btn.innerText = ".:" + btn.innerText + ":.";
        btn.addEventListener("click", _handler2 = function(e) {
          e.stopPropagation();
          e.preventDefault();
          var oLine = btn.parentElement.parentElement.parentElement;
          var sDateTime = oLine.children[1].querySelector("time").getAttribute("datetime").trim();
          var sWho_id = getKey(oLine.children[2], -2);
          var sHref = oLine.children[3].querySelector("a").getAttribute("href-sav");
          var _t1 = (sHref || "/").split("/");
          var sSessionId = _t1[_t1.length - 1];
          var sWhen = dayjs(sDateTime).toISOString();
          var iHash = sessions_default.getHashId(sWhen, sWho_id);
          let iSessionId = parseInt(sSessionId, 10);
          let bExistsSessionId = refs_default.exists(iSessionId, 1, refs_default.TYPE.SESSIONID_DATEREFID);
          let bExistsHashId = refs_default.exists(iHash, 2, refs_default.TYPE.SESSIONID_DATEREFID);
          if (bExistsSessionId) {
            if (!bExistsHashId) {
              console.log(`[SESSIONID_DATEREFID] iSessionId ${iSessionId} est connu mais pas iHash${iHash}`);
              refs_default.updKey2(iSessionId, iHash, refs_default.TYPE.SESSIONID_DATEREFID);
            }
          }
          if (bExistsHashId) {
            if (!bExistsSessionId) {
              console.log(`[SESSIONID_DATEREFID] iHash${iHash} est connu mais pas iSessionId ${iSessionId}`);
              refs_default.updKey1(iSessionId, iHash, refs_default.TYPE.SESSIONID_DATEREFID);
            }
          }
          if (!bExistsSessionId && !bExistsHashId) {
            console.log(`[SESSIONID_DATEREFID] iHash${iHash} et iSessionId ${iSessionId} sont INconnus`);
            refs_default.add(iSessionId, iHash, refs_default.TYPE.SESSIONID_DATEREFID);
          }
          window.open(sHref, "blank").focus();
        });
        btn.setAttribute("href-sav", btn.getAttribute("href"));
        btn.removeAttribute("href");
      });
    },
    _applyInjectionForSessionsBooked: function() {
      if (document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`) !== null) {
        document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`).style.display = "none";
      }
    },
    _applyInjectionForSessionsHistory: function(iDelayBetweenTwoMutations = 100) {
      if (document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`) !== null) {
        document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`).style.display = "block";
      }
      if (dayjs().valueOf() - Facturier._lastMutation < iDelayBetweenTwoMutations) {
        return;
      }
      addCbox();
      Facturier._lastMutation = dayjs().valueOf();
    },
    _addHeader: function() {
      if (Facturier._sOCMainSrvClassName.length === 0) {
        Facturier._sOCMainSrvClassName = Facturier._getOCMainClass();
      }
      if (Facturier._sOCMainSrvClassName.length === 0) {
        console.error("%c[index._addHeader()] _sOCMainSrvClassName is still unknow", APP_ERROR_STYLE);
        console.log("[index._addHeader()]check this %o", document.querySelector(Facturier.cssMainDataSelector));
      }
      let aDom = document.querySelector("#mainContent > :not(div:empty)").children;
      let i2 = 0;
      for (i2 = aDom.length - 1; i2 >= 0; i2--) {
        console.log(i2, aDom[i2].nodeName);
        if (aDom[i2].nodeName === "SECTION")
          break;
      }
      if (i2 === 0) {
        console.error("IRRECOVERABLE ERROR element <section> not found");
        return;
      }
      i2 = i2 - 1;
      const oBase = document.querySelector('#mainContent[class*="webapp"]');
      const oPanelSelectorContainer = document.querySelector('[role="tablist"]');
      var handleElementShown = function(oElem) {
        const oPanelSelectorContainer2 = document.querySelector('[role="tablist"]');
        let oSpan_12 = document.createElement("span");
        oSpan_12.innerText = "Facturier v." + GM.info.script.version;
        oSpan_12.classList.add(...oElem.children[0].classList);
        oSpan_12.classList.add("Facturier__header");
        if (oElem.children.length > 1) {
          let oSpan_22 = document.createElement("span");
          oSpan_22.classList.add(...oElem.children[1].classList);
          oSpan_22.classList.add("Facturier__header");
        }
        let oRoot2 = document.createElement("a");
        oRoot2.onclick = about;
        oRoot2.classList.add(...oElem.classList);
        oRoot2.classList.add("Facturier__header");
        oRoot2.appendChild(oSpan_12);
        if (oElem.children.length > 1) {
          oRoot2.appendChild(oSpan_2);
        }
        oRoot2.style = "margin-left: auto";
        oPanelSelectorContainer2.appendChild(oRoot2);
      };
      var observer = new MutationObserver(function(mutations, me) {
        const oRefCSS2 = oPanelSelectorContainer.querySelector("a[aria-selected=false]");
        if (oRefCSS2.children) {
          handleElementShown(oRefCSS2);
          me.disconnect();
          return;
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true
      });
      return;
      const oRefCSS = oPanelSelectorContainer.querySelector("a[aria-selected=false]");
      let oSpan_1 = document.createElement("span");
      oSpan_1.innerText = "Facturier v." + GM.info.script.version;
      oSpan_1.classList.add(...oRefCSS.children[0].classList);
      oSpan_1.classList.add("Facturier__header");
      let oSpan_2 = document.createElement("span");
      oSpan_2.classList.add(...oRefCSS.children[1].classList);
      oSpan_2.classList.add("Facturier__header");
      let oRoot = document.createElement("a");
      oRoot.onclick = about;
      oRoot.classList.add(...oRefCSS.classList);
      oRoot.classList.add("Facturier__header");
      oRoot.appendChild(oSpan_1);
      oRoot.appendChild(oSpan_2);
      oRoot.style = "margin-left: auto";
      oPanelSelectorContainer.appendChild(oRoot);
    },
    _userscriptless() {
      console.log(`%cIm'not in a Tamper environment so i need to load js scripts`, APP_DEBUG_STYLE);
    },
    _main: function() {
      console.log("\u200B\u200B\u200B%c[index._main()]MainLoaded\u200B\u200B\u200B", APP_DEBUG_STYLE);
      document.unbindArrive(Facturier._main);
      Facturier._eventMonitor();
      if (false) {
        gm_perf_default.paintTiming();
        gm_perf_default.longTaskTiming();
      }
      let adapter = new LocalStorage("db");
      var db = low(adapter);
      db.defaults({ students: [], sessions: [], f_archives: [], history_session_cache: [], meta: [], refs: [], students_history: [] }).write();
      Facturier.Cfg.dbase = db;
      dayjs.extend(dayjs_plugin_isSameOrAfter);
      dayjs.extend(dayjs_plugin_isSameOrBefore);
      dayjs.extend(dayjs_plugin_isBetween);
      dayjs.extend(dayjs_plugin_localeData);
      dayjs.extend(dayjs_plugin_customParseFormat);
      dayjs.locale("fr");
      refs_default.checkSupport();
      meta_default.checkSupport();
      if (document.querySelector(".panel.menuBar.flex.draggable") === null) {
        ui_default.init();
      }
      Facturier._addHeader();
      Facturier._applyInjectionOnPathNameMutation();
      console.log(`%cWait for side menu to add element to it`, APP_DEBUG_STYLE);
      sCSSObserved = "nav:not([role])";
      document.arrive(sCSSObserved, Facturier._addLinkToMenu);
      let sDbVersion = meta_default.getDbVersion();
      if (semverCompare(GM.info.script.version, sDbVersion) == 1) {
        console.log(`%cDB is in version: ${meta_default.getDbVersion()} need to go to version ${GM.info.script.version}`, APP_DEBUG_STYLE);
        dbase_default.update(GM.info.script.version);
      }
      fetch_inject_default(["https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"]).then(async function(e) {
        console.log("%cALPINE js fetched", APP_DEBUG_STYLE);
      });
      fetch_inject_default([
        "https://unpkg.com/htmx.org@1.1.0",
        "https://unpkg.com/htmx.org@1.1.0/dist/ext/debug.js"
      ]).then(async function(e) {
        htmx.on("htmx:configRequest", function(evt) {
        });
        htmx.on("htmx:beforeRequest", function(evt) {
          if (evt.detail.pathInfo.finalPath && getFileExtension(evt.detail.pathInfo.finalPath) !== "html") {
            evt.detail.xhr.addEventListener("abort", function() {
            });
            evt.detail.xhr.onloadstart = function(e2) {
              this.abort();
            };
            let sHtml = views_default.load(evt.detail.pathInfo.finalPath);
            let oTarget = evt.detail.target;
            var sTargetSelect = evt.detail.elt.getAttribute("hx-select");
            if (sTargetSelect) {
              let oDom = new DOMParser().parseFromString(sHtml, "text/html");
              oNode = oDom.querySelector(sTargetSelect);
              if (oNode) {
                sHtml = oNode.outerHTML;
              } else {
                console.log(`%cWanna select target ${sTargetSelect} in data received from calling ${evt.detail.pathInfo.finalPath} but this node could'nt be found so return the whole string`, APP_ERROR_STYLE);
              }
            }
            var appendFromHtmlStr = function(sHtml2, oDom) {
              var range = document.createRange();
              var fragment = range.createContextualFragment(sHtml2);
              for (var i2 = fragment.childNodes.length - 1; i2 >= 0; i2--) {
                var child = fragment.childNodes[i2];
                oDom.appendChild(child);
                htmx.process(child);
              }
              return oDom.lastChild;
            };
            appendFromHtmlStr(sHtml, evt.detail.target);
          }
        });
        htmx.on("htmx:xhr:loadstart", function(evt) {
        });
      });
      fetch_inject_default(["https://cdn.jsdelivr.net/npm/sweetalert2@10"]).then(async function(e) {
        console.log("%cSweetAlert fetched", APP_DEBUG_STYLE);
      });
      if (GM_config.get("use_custom_css") === true) {
        let sDependencies = GM_config.get("custom_css_url");
        let aDependencies = sDependencies.split(",");
        if (aDependencies.length !== 0) {
          console.log(`%cWanna inject Custom CSS from URL:${aDependencies}`, APP_DEBUG_STYLE);
          fetch_inject_default(aDependencies).then(() => {
            console.log(`%cCustom CSS from URL:${aDependencies} loaded`, APP_DEBUG_STYLE);
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
      unsafeWindow.Facturier = { libs: [], cfg: { dbase: null }, klass: [] };
      unsafeWindow.Facturier.cfg.dbase = Facturier.Cfg.dbase;
      unsafeWindow.Facturier.libs.push({ id: "fetchInject", ptr: fetch_inject_default });
      unsafeWindow.Facturier.libs.push({ id: "dayjs", ptr: dayjs });
      unsafeWindow.Facturier.klass.push({ id: "Student", ptr: students_default });
      unsafeWindow.Facturier.klass.push({ id: "Session", ptr: sessions_default });
      unsafeWindow.Facturier.klass.push({ id: "Archive", ptr: archives_default });
      unsafeWindow.Facturier.klass.push({ id: "History", ptr: history_default });
      unsafeWindow.Facturier.klass.push({ id: "StudentHistory", ptr: students_history_default });
      unsafeWindow.Facturier.klass.push({ id: "Ref", ptr: refs_default });
      unsafeWindow.Facturier.klass.push({ id: "Dbase", ptr: dbase_default });
      unsafeWindow.Facturier.klass.push({ id: "Meta", ptr: meta_default });
      unsafeWindow.Facturier.klass.push({ id: "Ref", ptr: refs_default });
      unsafeWindow.Facturier.klass.push({ id: "Api", ptr: api_openclassrooms_default });
      unsafeWindow.Facturier.libs.push({ id: "NProgress", ptr: NProgress });
      sbox_google_sh_default.test_1();
      unsafeWindow.Facturier.klass.push({ id: "SandBox_Google", ptr: sbox_google_sh_default });
      if (false) {
        document.body.appendChild(document.createElement("div")).innerHTML = '<iframe id="temoin" style="display:none"></iframe>';
        console.groupCollapsed("liste de variable de la page");
        Object.keys(window).filter((a) => !(a in window.frames[window.frames.length - 1])).sort().forEach((a, i2) => console.log(i2, a, window[a]));
        document.body.removeChild(document.querySelector("#temoin").parentNode);
        console.groupEnd();
      }
      unsafeWindow.Facturier.libs.push({ id: "Moise", ptr: moize });
      if (GM.info.script.downloadURL === "http://localhost:8000/dist/app-facturier.iife.js") {
        console.log("%cALERTE .... version locale !!!!!! ", "background-color:coral;color:white");
        console.log("%c test readfile", APP_DEBUG_STYLE);
        readFile("file:////media/pwyll/USB120Go/DevStt/UserScripts/SttAddon/src/update_data_base.js", function(_res) {
          console.log(_res);
        });
        Facturier.loadDependencies();
      } else {
        console.log(`%c GM.info.script.downloadURL url : ${GM.info.script.downloadURL}`, APP_DEBUG_STYLE);
      }
    },
    _addLinkToMenu: function() {
      console.log(`%cSide menu will be added`, APP_DEBUG_STYLE);
      document.unbindArrive(Facturier._addLinkToMenu);
      if (document.querySelector("ul.Facturier__Menu-header") !== null) {
        console.log(`%cDirty Check no double launch`, APP_DEBUG_STYLE);
        return;
      }
      try {
        let oMenu = document.querySelectorAll("nav:not([role])")[0];
        let oCloneLI = oMenu.children[0].lastChild.cloneNode(true);
        oCloneLI.firstChild.innerText = "Facturier";
        elMenu = document.querySelector(".panel.draggable");
        oCloneLI.firstChild.href = "javascript::void(0);";
        oCloneLI.firstChild.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          elMenu = document.querySelector(".panel.draggable");
          elMenu.style.display = elMenu.style.display != "block" ? "block" : "none";
        };
        let el = oMenu.children[0].lastChild.firstChild;
        oCloneLI.firstChild.appendChild(el.children[0].cloneNode(true));
        oCloneLI.firstChild.appendChild(el.children[1].cloneNode(false));
        oCloneLI.firstChild.appendChild(el.children[2].cloneNode(false));
        let oCloneUL = oMenu.children[0].cloneNode(false);
        oCloneUL.appendChild(oCloneLI);
        oCloneUL.classList.add("Facturier__Menu-header");
        oMenu.appendChild(oCloneUL);
        console.log(`%cSide menu will added`, APP_DEBUG_STYLE);
      } catch (e) {
        console.log("%cInjecting menu encounter an error: %o", APP_ERROR_STYLE, e);
      }
      ;
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
    }
  };
  if (window.Facturier !== void 0) {
    window.Facturier.start();
  } else {
    Facturier.start();
  }
  var src_default = Facturier;
})();
/* @license
Papa Parse
v5.3.0
https://github.com/mholt/PapaParse
License: MIT
*/
/*!
 * Sheetrock
 * Quickly connect to, query, and lazy-load data from Google Sheets.
 * https://chriszarate.github.io/sheetrock/
 * License: MIT
 */
/*! @preserve
 *
 * tcomb.js - Type checking and DDD for JavaScript
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 Giulio Canti
 *
 */
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
//# sourceMappingURL=app.js.map
