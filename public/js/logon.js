(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _jsBase = require("js-base64");

var _md = require("./vendor/md5.min");

var _md2 = _interopRequireDefault(_md);

var _jsCookie = require("./vendor/js-cookie");

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (c, d) {
  var READY_STATE_COMPLETE = 4;
  var OK = 200;
  var NOT_FOUND = 404;
  var main = d.querySelector("#main");
  var loginbutton = d.querySelector("#login-button");

  var hasClass = function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
  };

  var addClass = function addClass(el, className) {
    if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
  };

  var removeClass = function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
      var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
      el.className = el.className.replace(reg, " ");
    }
  };

  var logout = function logout() {
    _jsCookie2.default.remove("UserName");
    _jsCookie2.default.remove("UserRole");
    _jsCookie2.default.remove("sessionId");
    _jsCookie2.default.remove("token");
    _jsCookie2.default.remove("wssURL");
    _jsCookie2.default.remove("RootPath");
    _jsCookie2.default.remove("CompanyName");
    _jsCookie2.default.remove("AccessString");
    document.location.href = "/";
  };

  var showDashboard = function showDashboard(data) {
    console.log("data::showDashboard: ", data);
    _jsCookie2.default.set("token", data.Token);
    _jsCookie2.default.set("UserName", data.UserName);
    _jsCookie2.default.set("UserRole", data.Role);
    _jsCookie2.default.set("wssURL", data.wssURL);
    _jsCookie2.default.set("CompanyName", data.CompanyName);
    _jsCookie2.default.set("RootPath", data.RootPath);
    _jsCookie2.default.set("AccessString", data.AccessString);
    _jsCookie2.default.set("RunMode", data.RunMode);
    window.location.href = "/dashboard";
  };

  function showToast(title, msg, type) {
    var icon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    toast.create({
      title: title,
      text: msg,
      type: type,
      icon: icon
    });
  }

  function submit(e) {
    e.preventDefault();
    var username = d.querySelector("#username").value;
    var password = d.querySelector("#password").value;
    var form = d.querySelector("#formLogon");
    if (username.trim() == "" || password.trim() == "") {
      showToast("Error", "Username or Password not provided", "error");
      return false;
    }

    $u("#waiting").addClass("active");

    _axios2.default.post("/login", {
      username: username,
      password: _jsBase.Base64.encode((0, _md2.default)(password))
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 30000
    }).then(function (d) {
      $u("#waiting").addClass("active");
      console.log(d);
      if (d.data.status === "OK") {
        showDashboard(d.data.data);
      } else {
        showToast("Login", d.data.data.message, "error", "fas fa-exclamation-triangle");
        document.querySelector("#message").innerHTML = d.data.data.message;
      }
    }).catch(function (e) {
      $u("#waiting").removeClass("active");
      if (e.response.status === 403) {
        showToast("Login", e.response.data.message, "error");
      } else {
        showToast("Login", "Wrong user name or password", "error");
      }
      //console.log('Logon result:',e.response.status);
    });
  }

  loginbutton.addEventListener("click", submit);

  $u("#waiting").removeClass("active");

  [].forEach.call(document.querySelectorAll("input"), function (el) {
    el.addEventListener("blur", function (e) {
      if (e.target.value) $u("#" + e.target.id).addClass("used");else $u("#" + e.target.id).removeClass("used");
    });
  });
})(console.log, document);

},{"./vendor/js-cookie":2,"./vendor/md5.min":3,"axios":4,"js-base64":33}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
})(function () {
	function extend() {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[i];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init(converter) {
		function api(key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					var result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

				key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';
				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}

					// Considers RFC 6265 section 5.2:
					// ...
					// 3.  If the remaining unparsed-attributes contains a %x3B (";")
					//     character:
					// Consume the characters of the unparsed-attributes up to,
					// not including, the first %x3B (";") character.
					// ...
					stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
				}

				return document.cookie = key + '=' + value + stringifiedAttributes;
			}

			// Read

			var jar = {};
			var decode = function decode(s) {
				return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
			};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) || decode(cookie);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function (key) {
			return api.call({
				json: true
			}, key);
		};
		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
});

},{}],3:[function(require,module,exports){
(function (process,global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.7.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function () {
    "use strict";

    function t(t) {
        if (t) d[0] = d[16] = d[1] = d[2] = d[3] = d[4] = d[5] = d[6] = d[7] = d[8] = d[9] = d[10] = d[11] = d[12] = d[13] = d[14] = d[15] = 0, this.blocks = d, this.buffer8 = l;else if (a) {
            var r = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(r), this.blocks = new Uint32Array(r);
        } else this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0;
    }var r = "input is invalid type",
        e = "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)),
        i = e ? window : {};
    i.JS_MD5_NO_WINDOW && (e = !1);var s = !e && "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)),
        h = !i.JS_MD5_NO_NODE_JS && "object" == (typeof process === "undefined" ? "undefined" : _typeof(process)) && process.versions && process.versions.node;
    h ? i = global : s && (i = self);var f = !i.JS_MD5_NO_COMMON_JS && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports,
        o = "function" == typeof define && define.amd,
        a = !i.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
        n = "0123456789abcdef".split(""),
        u = [128, 32768, 8388608, -2147483648],
        y = [0, 8, 16, 24],
        c = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"],
        p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
        d = [],
        l;if (a) {
        var A = new ArrayBuffer(68);
        l = new Uint8Array(A), d = new Uint32Array(A);
    }!i.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
    }), !a || !i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function (t) {
        return "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && t.buffer && t.buffer.constructor === ArrayBuffer;
    });var b = function b(r) {
        return function (e) {
            return new t(!0).update(e)[r]();
        };
    },
        v = function v() {
        var r = b("hex");
        h && (r = w(r)), r.create = function () {
            return new t();
        }, r.update = function (t) {
            return r.create().update(t);
        };for (var e = 0; e < c.length; ++e) {
            var i = c[e];
            r[i] = b(i);
        }return r;
    },
        w = function w(t) {
        var e = eval("require('crypto')"),
            i = eval("require('buffer').Buffer"),
            s = function s(_s) {
            if ("string" == typeof _s) return e.createHash("md5").update(_s, "utf8").digest("hex");if (null === _s || void 0 === _s) throw r;return _s.constructor === ArrayBuffer && (_s = new Uint8Array(_s)), Array.isArray(_s) || ArrayBuffer.isView(_s) || _s.constructor === i ? e.createHash("md5").update(new i(_s)).digest("hex") : t(_s);
        };return s;
    };
    t.prototype.update = function (t) {
        if (!this.finalized) {
            var e,
                i = typeof t === "undefined" ? "undefined" : _typeof(t);if ("string" !== i) {
                if ("object" !== i) throw r;if (null === t) throw r;if (a && t.constructor === ArrayBuffer) t = new Uint8Array(t);else if (!(Array.isArray(t) || a && ArrayBuffer.isView(t))) throw r;
                e = !0;
            }for (var s, h, f = 0, o = t.length, n = this.blocks, u = this.buffer8; f < o;) {
                if (this.hashed && (this.hashed = !1, n[0] = n[16], n[16] = n[1] = n[2] = n[3] = n[4] = n[5] = n[6] = n[7] = n[8] = n[9] = n[10] = n[11] = n[12] = n[13] = n[14] = n[15] = 0), e) {
                    if (a) for (h = this.start; f < o && h < 64; ++f) {
                        u[h++] = t[f];
                    } else for (h = this.start; f < o && h < 64; ++f) {
                        n[h >> 2] |= t[f] << y[3 & h++];
                    }
                } else if (a) for (h = this.start; f < o && h < 64; ++f) {
                    (s = t.charCodeAt(f)) < 128 ? u[h++] = s : s < 2048 ? (u[h++] = 192 | s >> 6, u[h++] = 128 | 63 & s) : s < 55296 || s >= 57344 ? (u[h++] = 224 | s >> 12, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), u[h++] = 240 | s >> 18, u[h++] = 128 | s >> 12 & 63, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s);
                } else for (h = this.start; f < o && h < 64; ++f) {
                    (s = t.charCodeAt(f)) < 128 ? n[h >> 2] |= s << y[3 & h++] : s < 2048 ? (n[h >> 2] |= (192 | s >> 6) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : s < 55296 || s >= 57344 ? (n[h >> 2] |= (224 | s >> 12) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), n[h >> 2] |= (240 | s >> 18) << y[3 & h++], n[h >> 2] |= (128 | s >> 12 & 63) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]);
                }this.lastByteIndex = h, this.bytes += h - this.start, h >= 64 ? (this.start = h - 64, this.hash(), this.hashed = !0) : this.start = h;
            }return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this;
        }
    }, t.prototype.finalize = function () {
        if (!this.finalized) {
            this.finalized = !0;var t = this.blocks,
                r = this.lastByteIndex;
            t[r >> 2] |= u[3 & r], r >= 56 && (this.hashed || this.hash(), t[0] = t[16], t[16] = t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = t[8] = t[9] = t[10] = t[11] = t[12] = t[13] = t[14] = t[15] = 0), t[14] = this.bytes << 3, t[15] = this.hBytes << 3 | this.bytes >>> 29, this.hash();
        }
    }, t.prototype.hash = function () {
        var t,
            r,
            e,
            i,
            s,
            h,
            f = this.blocks;
        this.first ? r = ((r = ((t = ((t = f[0] - 680876937) << 7 | t >>> 25) - 271733879 << 0) ^ (e = ((e = (-271733879 ^ (i = ((i = (-1732584194 ^ 2004318071 & t) + f[1] - 117830708) << 12 | i >>> 20) + t << 0) & (-271733879 ^ t)) + f[2] - 1126478375) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1316259209) << 22 | r >>> 10) + e << 0 : (t = this.h0, r = this.h1, e = this.h2, r = ((r += ((t = ((t += ((i = this.h3) ^ r & (e ^ i)) + f[0] - 680876936) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[1] - 389564586) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[2] + 606105819) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1044525330) << 22 | r >>> 10) + e << 0), r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[4] - 176418897) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[5] + 1200080426) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[6] - 1473231341) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[7] - 45705983) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[8] + 1770035416) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[9] - 1958414417) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[10] - 42063) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[11] - 1990404162) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[12] + 1804603682) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[13] - 40341101) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[14] - 1502002290) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[15] + 1236535329) << 22 | r >>> 10) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[1] - 165796510) << 5 | t >>> 27) + r << 0) ^ r)) + f[6] - 1069501632) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[11] + 643717713) << 14 | e >>> 18) + i << 0) ^ i)) + f[0] - 373897302) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[5] - 701558691) << 5 | t >>> 27) + r << 0) ^ r)) + f[10] + 38016083) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[15] - 660478335) << 14 | e >>> 18) + i << 0) ^ i)) + f[4] - 405537848) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[9] + 568446438) << 5 | t >>> 27) + r << 0) ^ r)) + f[14] - 1019803690) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[3] - 187363961) << 14 | e >>> 18) + i << 0) ^ i)) + f[8] + 1163531501) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[13] - 1444681467) << 5 | t >>> 27) + r << 0) ^ r)) + f[2] - 51403784) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[7] + 1735328473) << 14 | e >>> 18) + i << 0) ^ i)) + f[12] - 1926607734) << 20 | r >>> 12) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[5] - 378558) << 4 | t >>> 28) + r << 0)) + f[8] - 2022574463) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[11] + 1839030562) << 16 | e >>> 16) + i << 0)) + f[14] - 35309556) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[1] - 1530992060) << 4 | t >>> 28) + r << 0)) + f[4] + 1272893353) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[7] - 155497632) << 16 | e >>> 16) + i << 0)) + f[10] - 1094730640) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[13] + 681279174) << 4 | t >>> 28) + r << 0)) + f[0] - 358537222) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[3] - 722521979) << 16 | e >>> 16) + i << 0)) + f[6] + 76029189) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[9] - 640364487) << 4 | t >>> 28) + r << 0)) + f[12] - 421815835) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[15] + 530742520) << 16 | e >>> 16) + i << 0)) + f[2] - 995338651) << 23 | r >>> 9) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[0] - 198630844) << 6 | t >>> 26) + r << 0) | ~e)) + f[7] + 1126891415) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[14] - 1416354905) << 15 | e >>> 17) + i << 0) | ~t)) + f[5] - 57434055) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[12] + 1700485571) << 6 | t >>> 26) + r << 0) | ~e)) + f[3] - 1894986606) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[10] - 1051523) << 15 | e >>> 17) + i << 0) | ~t)) + f[1] - 2054922799) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[8] + 1873313359) << 6 | t >>> 26) + r << 0) | ~e)) + f[15] - 30611744) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[6] - 1560198380) << 15 | e >>> 17) + i << 0) | ~t)) + f[13] + 1309151649) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[4] - 145523070) << 6 | t >>> 26) + r << 0) | ~e)) + f[11] - 1120210379) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[2] + 718787259) << 15 | e >>> 17) + i << 0) | ~t)) + f[9] - 343485551) << 21 | r >>> 11) + e << 0, this.first ? (this.h0 = t + 1732584193 << 0, this.h1 = r - 271733879 << 0, this.h2 = e - 1732584194 << 0, this.h3 = i + 271733878 << 0, this.first = !1) : (this.h0 = this.h0 + t << 0, this.h1 = this.h1 + r << 0, this.h2 = this.h2 + e << 0, this.h3 = this.h3 + i << 0);
    }, t.prototype.hex = function () {
        this.finalize();var t = this.h0,
            r = this.h1,
            e = this.h2,
            i = this.h3;return n[t >> 4 & 15] + n[15 & t] + n[t >> 12 & 15] + n[t >> 8 & 15] + n[t >> 20 & 15] + n[t >> 16 & 15] + n[t >> 28 & 15] + n[t >> 24 & 15] + n[r >> 4 & 15] + n[15 & r] + n[r >> 12 & 15] + n[r >> 8 & 15] + n[r >> 20 & 15] + n[r >> 16 & 15] + n[r >> 28 & 15] + n[r >> 24 & 15] + n[e >> 4 & 15] + n[15 & e] + n[e >> 12 & 15] + n[e >> 8 & 15] + n[e >> 20 & 15] + n[e >> 16 & 15] + n[e >> 28 & 15] + n[e >> 24 & 15] + n[i >> 4 & 15] + n[15 & i] + n[i >> 12 & 15] + n[i >> 8 & 15] + n[i >> 20 & 15] + n[i >> 16 & 15] + n[i >> 28 & 15] + n[i >> 24 & 15];
    }, t.prototype.toString = t.prototype.hex, t.prototype.digest = function () {
        this.finalize();var t = this.h0,
            r = this.h1,
            e = this.h2,
            i = this.h3;return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & i, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255];
    }, t.prototype.array = t.prototype.digest, t.prototype.arrayBuffer = function () {
        this.finalize();var t = new ArrayBuffer(16),
            r = new Uint32Array(t);return r[0] = this.h0, r[1] = this.h1, r[2] = this.h2, r[3] = this.h3, t;
    }, t.prototype.buffer = t.prototype.arrayBuffer, t.prototype.base64 = function () {
        for (var t, r, e, i = "", s = this.array(), h = 0; h < 15;) {
            t = s[h++], r = s[h++], e = s[h++], i += p[t >>> 2] + p[63 & (t << 4 | r >>> 4)] + p[63 & (r << 2 | e >>> 6)] + p[63 & e];
        }return t = s[h], i += p[t >>> 2] + p[t << 4 & 63] + "==";
    };var _ = v();
    f ? module.exports = _ : (i.md5 = _, o && define(function () {
        return _;
    }));
}();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":34}],4:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":6}],5:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

}).call(this,require('_process'))

},{"../core/createError":12,"./../core/settle":15,"./../helpers/btoa":19,"./../helpers/buildURL":20,"./../helpers/cookies":22,"./../helpers/isURLSameOrigin":24,"./../helpers/parseHeaders":26,"./../utils":28,"_process":34}],6:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":7,"./cancel/CancelToken":8,"./cancel/isCancel":9,"./core/Axios":10,"./defaults":17,"./helpers/bind":18,"./helpers/spread":27,"./utils":28}],7:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],8:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":7}],9:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],10:[function(require,module,exports){
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":17,"./../utils":28,"./InterceptorManager":11,"./dispatchRequest":13}],11:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":28}],12:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":14}],13:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":9,"../defaults":17,"./../helpers/combineURLs":21,"./../helpers/isAbsoluteURL":23,"./../utils":28,"./transformData":16}],14:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],15:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":12}],16:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":28}],17:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))

},{"./adapters/http":5,"./adapters/xhr":5,"./helpers/normalizeHeaderName":25,"./utils":28,"_process":34}],18:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],19:[function(require,module,exports){
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],20:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":28}],21:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],22:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":28}],23:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],24:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":28}],25:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":28}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":28}],27:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],28:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":18,"is-buffer":32}],29:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],30:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":29,"ieee754":31}],31:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],32:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],33:[function(require,module,exports){
(function (global){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.4.5";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {}
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function (u) {
            return (u.constructor === buffer.constructor ? u : buffer.from(u))
                .toString('base64')
        }
        :  function (u) {
            return (u.constructor === buffer.constructor ? u : new  buffer(u))
                .toString('base64')
        }
        : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function(a) {
            return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
        }
        : function(a) {
            return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
        }
        : function(a) { return btou(atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"buffer":30}],34:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9sb2dvbi5qcyIsImpzL3ZlbmRvci9qcy1jb29raWUuanMiLCJqcy92ZW5kb3IvbWQ1Lm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnRvYS5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qcy1iYXNlNjQvYmFzZTY0LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxDQUFDLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUNULE1BQU0sdUJBQXVCLENBQTdCO0FBQ0EsTUFBTSxLQUFLLEdBQVg7QUFDQSxNQUFNLFlBQVksR0FBbEI7QUFDQSxNQUFNLE9BQU8sRUFBRSxhQUFGLENBQWdCLE9BQWhCLENBQWI7QUFDQSxNQUFNLGNBQWMsRUFBRSxhQUFGLENBQWdCLGVBQWhCLENBQXBCOztBQUVBLE1BQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxFQUFELEVBQUssU0FBTCxFQUFtQjtBQUNsQyxRQUFJLEdBQUcsU0FBUCxFQUFrQixPQUFPLEdBQUcsU0FBSCxDQUFhLFFBQWIsQ0FBc0IsU0FBdEIsQ0FBUCxDQUFsQixLQUVF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9TQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5pbXBvcnQgeyBCYXNlNjQgfSBmcm9tIFwianMtYmFzZTY0XCI7XHJcbmltcG9ydCBtZDUgZnJvbSBcIi4vdmVuZG9yL21kNS5taW5cIjtcclxuaW1wb3J0IENvb2tpZXMgZnJvbSBcIi4vdmVuZG9yL2pzLWNvb2tpZVwiO1xyXG5cclxuXHJcbigoYywgZCkgPT4ge1xyXG4gIGNvbnN0IFJFQURZX1NUQVRFX0NPTVBMRVRFID0gNDtcclxuICBjb25zdCBPSyA9IDIwMDtcclxuICBjb25zdCBOT1RfRk9VTkQgPSA0MDQ7XHJcbiAgY29uc3QgbWFpbiA9IGQucXVlcnlTZWxlY3RvcihcIiNtYWluXCIpO1xyXG4gIGNvbnN0IGxvZ2luYnV0dG9uID0gZC5xdWVyeVNlbGVjdG9yKFwiI2xvZ2luLWJ1dHRvblwiKTtcclxuXHJcbiAgY29uc3QgaGFzQ2xhc3MgPSAoZWwsIGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgaWYgKGVsLmNsYXNzTGlzdCkgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4gISFlbC5jbGFzc05hbWUubWF0Y2goXHJcbiAgICAgICAgbmV3IFJlZ0V4cChcIihcXFxcc3xeKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXHN8JClcIilcclxuICAgICAgKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRDbGFzcyA9IChlbCwgY2xhc3NOYW1lKSA9PiB7XHJcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICBlbHNlIGlmICghaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW1vdmVDbGFzcyA9IChlbCwgY2xhc3NOYW1lKSA9PiB7XHJcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICBlbHNlIGlmIChoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xyXG4gICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIihcXFxcc3xeKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXHN8JClcIik7XHJcbiAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgXCIgXCIpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGxldCBsb2dvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgIENvb2tpZXMucmVtb3ZlKFwiVXNlck5hbWVcIik7XHJcbiAgICBDb29raWVzLnJlbW92ZShcIlVzZXJSb2xlXCIpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoXCJzZXNzaW9uSWRcIik7XHJcbiAgICBDb29raWVzLnJlbW92ZShcInRva2VuXCIpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoXCJ3c3NVUkxcIik7XHJcbiAgICBDb29raWVzLnJlbW92ZShcIlJvb3RQYXRoXCIpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoXCJDb21wYW55TmFtZVwiKTtcclxuICAgIENvb2tpZXMucmVtb3ZlKFwiQWNjZXNzU3RyaW5nXCIpO1xyXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IFwiL1wiO1xyXG4gIH07XHJcblxyXG4gIGxldCBzaG93RGFzaGJvYXJkID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgY29uc29sZS5sb2coXCJkYXRhOjpzaG93RGFzaGJvYXJkOiBcIiwgZGF0YSk7XHJcbiAgICBDb29raWVzLnNldChcInRva2VuXCIsIGRhdGEuVG9rZW4pO1xyXG4gICAgQ29va2llcy5zZXQoXCJVc2VyTmFtZVwiLCBkYXRhLlVzZXJOYW1lKTtcclxuICAgIENvb2tpZXMuc2V0KFwiVXNlclJvbGVcIiwgZGF0YS5Sb2xlKTtcclxuICAgIENvb2tpZXMuc2V0KFwid3NzVVJMXCIsIGRhdGEud3NzVVJMKTtcclxuICAgIENvb2tpZXMuc2V0KFwiQ29tcGFueU5hbWVcIiwgZGF0YS5Db21wYW55TmFtZSk7XHJcbiAgICBDb29raWVzLnNldChcIlJvb3RQYXRoXCIsIGRhdGEuUm9vdFBhdGgpO1xyXG4gICAgQ29va2llcy5zZXQoXCJBY2Nlc3NTdHJpbmdcIiwgZGF0YS5BY2Nlc3NTdHJpbmcpO1xyXG4gICAgQ29va2llcy5zZXQoXCJSdW5Nb2RlXCIsIGRhdGEuUnVuTW9kZSk7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2Rhc2hib2FyZFwiO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dUb2FzdCh0aXRsZSwgbXNnLCB0eXBlLCBpY29uID0gdHJ1ZSkge1xyXG4gICAgdG9hc3QuY3JlYXRlKHtcclxuICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICB0ZXh0OiBtc2csXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIGljb246IGljb25cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3VibWl0KGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCB1c2VybmFtZSA9IGQucXVlcnlTZWxlY3RvcihcIiN1c2VybmFtZVwiKS52YWx1ZTtcclxuICAgIGxldCBwYXNzd29yZCA9IGQucXVlcnlTZWxlY3RvcihcIiNwYXNzd29yZFwiKS52YWx1ZTtcclxuICAgIGxldCBmb3JtID0gZC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm1Mb2dvblwiKTtcclxuICAgIGlmICh1c2VybmFtZS50cmltKCkgPT0gXCJcIiB8fCBwYXNzd29yZC50cmltKCkgPT0gXCJcIikge1xyXG4gICAgICBzaG93VG9hc3QoXCJFcnJvclwiLCBcIlVzZXJuYW1lIG9yIFBhc3N3b3JkIG5vdCBwcm92aWRlZFwiLCBcImVycm9yXCIpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgJHUoXCIjd2FpdGluZ1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHJcbiAgICBheGlvc1xyXG4gICAgICAucG9zdChcclxuICAgICAgICBcIi9sb2dpblwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgICAgIHBhc3N3b3JkOiBCYXNlNjQuZW5jb2RlKG1kNShwYXNzd29yZCkpXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGltZW91dDogMzAwMDBcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgICAgLnRoZW4oZCA9PiB7XHJcbiAgICAgICAgJHUoXCIjd2FpdGluZ1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICBpZiAoZC5kYXRhLnN0YXR1cyA9PT0gXCJPS1wiKSB7XHJcbiAgICAgICAgICBzaG93RGFzaGJvYXJkKGQuZGF0YS5kYXRhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgICBcIkxvZ2luXCIsXHJcbiAgICAgICAgICAgIGQuZGF0YS5kYXRhLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgIFwiZXJyb3JcIixcclxuICAgICAgICAgICAgXCJmYXMgZmEtZXhjbGFtYXRpb24tdHJpYW5nbGVcIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVzc2FnZVwiKS5pbm5lckhUTUwgPSBkLmRhdGEuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgJHUoXCIjd2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICBpZihlLnJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgICAgICBzaG93VG9hc3QoXCJMb2dpblwiLCBlLnJlc3BvbnNlLmRhdGEubWVzc2FnZSwgXCJlcnJvclwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2hvd1RvYXN0KFwiTG9naW5cIiwgXCJXcm9uZyB1c2VyIG5hbWUgb3IgcGFzc3dvcmRcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ0xvZ29uIHJlc3VsdDonLGUucmVzcG9uc2Uuc3RhdHVzKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBsb2dpbmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3VibWl0KTtcclxuICBcclxuICAkdShcIiN3YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpLCBmdW5jdGlvbihlbCkge1xyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICBpZiAoZS50YXJnZXQudmFsdWUpICR1KFwiI1wiICsgZS50YXJnZXQuaWQpLmFkZENsYXNzKFwidXNlZFwiKTtcclxuICAgICAgZWxzZSAkdShcIiNcIiArIGUudGFyZ2V0LmlkKS5yZW1vdmVDbGFzcyhcInVzZWRcIik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbn0pKGNvbnNvbGUubG9nLCBkb2N1bWVudCk7XHJcbiIsIi8qIVxyXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcclxuICpcclxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcjtcclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0XHRkZWZpbmUoZmFjdG9yeSk7XHJcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XHJcblx0fVxyXG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XHJcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xyXG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xyXG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcclxuXHRcdFx0cmV0dXJuIGFwaTtcclxuXHRcdH07XHJcblx0fVxyXG59KGZ1bmN0aW9uICgpIHtcclxuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xyXG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBXcml0ZVxyXG5cclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XHJcblx0XHRcdFx0XHRwYXRoOiAnLydcclxuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkgKiAxICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxyXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xyXG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSA/XHJcblx0XHRcdFx0XHRjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cclxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxyXG5cdFx0XHRcdFx0LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XHJcblxyXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcclxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcclxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxyXG5cdFx0XHRcdFx0Ly8gICAgIGNoYXJhY3RlcjpcclxuXHRcdFx0XHRcdC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXHJcblx0XHRcdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBSZWFkXHJcblxyXG5cdFx0XHR2YXIgamFyID0ge307XHJcblx0XHRcdHZhciBkZWNvZGUgPSBmdW5jdGlvbiAocykge1xyXG5cdFx0XHRcdHJldHVybiBzLnJlcGxhY2UoLyglWzAtOUEtWl17Mn0pKy9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XHJcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxyXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cdFx0XHR2YXIgaSA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xyXG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgbmFtZSA9IGRlY29kZShwYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRjb29raWUgPSAoY29udmVydGVyLnJlYWQgfHwgY29udmVydGVyKShjb29raWUsIG5hbWUpIHx8XHJcblx0XHRcdFx0XHRcdGRlY29kZShjb29raWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0amFyW25hbWVdID0gY29va2llO1xyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFwaS5zZXQgPSBhcGk7XHJcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xyXG5cdFx0fTtcclxuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoe1xyXG5cdFx0XHRcdGpzb246IHRydWVcclxuXHRcdFx0fSwga2V5KTtcclxuXHRcdH07XHJcblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xyXG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcclxuXHRcdFx0XHRleHBpcmVzOiAtMVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xyXG5cclxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcclxuXHJcblx0XHRyZXR1cm4gYXBpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xyXG59KSk7XHJcbiIsIi8qKlxyXG4gKiBbanMtbWQ1XXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZW1uMTc4L2pzLW1kNX1cclxuICpcclxuICogQG5hbWVzcGFjZSBtZDVcclxuICogQHZlcnNpb24gMC43LjNcclxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cclxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMTdcclxuICogQGxpY2Vuc2UgTUlUXHJcbiAqL1xyXG4hIGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiB0KHQpIHsgaWYgKHQpIGRbMF0gPSBkWzE2XSA9IGRbMV0gPSBkWzJdID0gZFszXSA9IGRbNF0gPSBkWzVdID0gZFs2XSA9IGRbN10gPSBkWzhdID0gZFs5XSA9IGRbMTBdID0gZFsxMV0gPSBkWzEyXSA9IGRbMTNdID0gZFsxNF0gPSBkWzE1XSA9IDAsIHRoaXMuYmxvY2tzID0gZCwgdGhpcy5idWZmZXI4ID0gbDtcclxuICAgICAgICBlbHNlIGlmIChhKSB7IHZhciByID0gbmV3IEFycmF5QnVmZmVyKDY4KTtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXI4ID0gbmV3IFVpbnQ4QXJyYXkociksIHRoaXMuYmxvY2tzID0gbmV3IFVpbnQzMkFycmF5KHIpIH0gZWxzZSB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgICAgICB0aGlzLmgwID0gdGhpcy5oMSA9IHRoaXMuaDIgPSB0aGlzLmgzID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDAsIHRoaXMuZmluYWxpemVkID0gdGhpcy5oYXNoZWQgPSAhMSwgdGhpcy5maXJzdCA9ICEwIH0gdmFyIHIgPSBcImlucHV0IGlzIGludmFsaWQgdHlwZVwiLFxyXG4gICAgICAgIGUgPSBcIm9iamVjdFwiID09IHR5cGVvZiB3aW5kb3csXHJcbiAgICAgICAgaSA9IGUgPyB3aW5kb3cgOiB7fTtcclxuICAgIGkuSlNfTUQ1X05PX1dJTkRPVyAmJiAoZSA9ICExKTsgdmFyIHMgPSAhZSAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBzZWxmLFxyXG4gICAgICAgIGggPSAhaS5KU19NRDVfTk9fTk9ERV9KUyAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xyXG4gICAgaCA/IGkgPSBnbG9iYWwgOiBzICYmIChpID0gc2VsZik7IHZhciBmID0gIWkuSlNfTUQ1X05PX0NPTU1PTl9KUyAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMsXHJcbiAgICAgICAgbyA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGVmaW5lICYmIGRlZmluZS5hbWQsXHJcbiAgICAgICAgYSA9ICFpLkpTX01ENV9OT19BUlJBWV9CVUZGRVIgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgQXJyYXlCdWZmZXIsXHJcbiAgICAgICAgbiA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiLnNwbGl0KFwiXCIpLFxyXG4gICAgICAgIHUgPSBbMTI4LCAzMjc2OCwgODM4ODYwOCwgLTIxNDc0ODM2NDhdLFxyXG4gICAgICAgIHkgPSBbMCwgOCwgMTYsIDI0XSxcclxuICAgICAgICBjID0gW1wiaGV4XCIsIFwiYXJyYXlcIiwgXCJkaWdlc3RcIiwgXCJidWZmZXJcIiwgXCJhcnJheUJ1ZmZlclwiLCBcImJhc2U2NFwiXSxcclxuICAgICAgICBwID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuc3BsaXQoXCJcIiksXHJcbiAgICAgICAgZCA9IFtdLFxyXG4gICAgICAgIGw7IGlmIChhKSB7IHZhciBBID0gbmV3IEFycmF5QnVmZmVyKDY4KTtcclxuICAgICAgICBsID0gbmV3IFVpbnQ4QXJyYXkoQSksIGQgPSBuZXcgVWludDMyQXJyYXkoQSkgfSFpLkpTX01ENV9OT19OT0RFX0pTICYmIEFycmF5LmlzQXJyYXkgfHwgKEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbih0KSB7IHJldHVybiBcIltvYmplY3QgQXJyYXldXCIgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KSB9KSwgIWEgfHwgIWkuSlNfTUQ1X05PX0FSUkFZX0JVRkZFUl9JU19WSUVXICYmIEFycmF5QnVmZmVyLmlzVmlldyB8fCAoQXJyYXlCdWZmZXIuaXNWaWV3ID0gZnVuY3Rpb24odCkgeyByZXR1cm4gXCJvYmplY3RcIiA9PSB0eXBlb2YgdCAmJiB0LmJ1ZmZlciAmJiB0LmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIgfSk7IHZhciBiID0gZnVuY3Rpb24ocikgeyByZXR1cm4gZnVuY3Rpb24oZSkgeyByZXR1cm4gbmV3IHQoITApLnVwZGF0ZShlKVtyXSgpIH0gfSxcclxuICAgICAgICB2ID0gZnVuY3Rpb24oKSB7IHZhciByID0gYihcImhleFwiKTtcclxuICAgICAgICAgICAgaCAmJiAociA9IHcocikpLCByLmNyZWF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IHQgfSwgci51cGRhdGUgPSBmdW5jdGlvbih0KSB7IHJldHVybiByLmNyZWF0ZSgpLnVwZGF0ZSh0KSB9OyBmb3IgKHZhciBlID0gMDsgZSA8IGMubGVuZ3RoOyArK2UpIHsgdmFyIGkgPSBjW2VdO1xyXG4gICAgICAgICAgICAgICAgcltpXSA9IGIoaSkgfSByZXR1cm4gciB9LFxyXG4gICAgICAgIHcgPSBmdW5jdGlvbih0KSB7IHZhciBlID0gZXZhbChcInJlcXVpcmUoJ2NyeXB0bycpXCIpLFxyXG4gICAgICAgICAgICAgICAgaSA9IGV2YWwoXCJyZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcIiksXHJcbiAgICAgICAgICAgICAgICBzID0gZnVuY3Rpb24ocykgeyBpZiAoXCJzdHJpbmdcIiA9PSB0eXBlb2YgcykgcmV0dXJuIGUuY3JlYXRlSGFzaChcIm1kNVwiKS51cGRhdGUocywgXCJ1dGY4XCIpLmRpZ2VzdChcImhleFwiKTsgaWYgKG51bGwgPT09IHMgfHwgdm9pZCAwID09PSBzKSB0aHJvdyByOyByZXR1cm4gcy5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIgJiYgKHMgPSBuZXcgVWludDhBcnJheShzKSksIEFycmF5LmlzQXJyYXkocykgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHMpIHx8IHMuY29uc3RydWN0b3IgPT09IGkgPyBlLmNyZWF0ZUhhc2goXCJtZDVcIikudXBkYXRlKG5ldyBpKHMpKS5kaWdlc3QoXCJoZXhcIikgOiB0KHMpIH07IHJldHVybiBzIH07XHJcbiAgICB0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0KSB7IGlmICghdGhpcy5maW5hbGl6ZWQpIHsgdmFyIGUsIGkgPSB0eXBlb2YgdDsgaWYgKFwic3RyaW5nXCIgIT09IGkpIHsgaWYgKFwib2JqZWN0XCIgIT09IGkpIHRocm93IHI7IGlmIChudWxsID09PSB0KSB0aHJvdyByOyBpZiAoYSAmJiB0LmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcikgdCA9IG5ldyBVaW50OEFycmF5KHQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIShBcnJheS5pc0FycmF5KHQpIHx8IGEgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KHQpKSkgdGhyb3cgcjtcclxuICAgICAgICAgICAgICAgIGUgPSAhMCB9IGZvciAodmFyIHMsIGgsIGYgPSAwLCBvID0gdC5sZW5ndGgsIG4gPSB0aGlzLmJsb2NrcywgdSA9IHRoaXMuYnVmZmVyODsgZiA8IG87KSB7IGlmICh0aGlzLmhhc2hlZCAmJiAodGhpcy5oYXNoZWQgPSAhMSwgblswXSA9IG5bMTZdLCBuWzE2XSA9IG5bMV0gPSBuWzJdID0gblszXSA9IG5bNF0gPSBuWzVdID0gbls2XSA9IG5bN10gPSBuWzhdID0gbls5XSA9IG5bMTBdID0gblsxMV0gPSBuWzEyXSA9IG5bMTNdID0gblsxNF0gPSBuWzE1XSA9IDApLCBlKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikgdVtoKytdID0gdFtmXTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKSBuW2ggPj4gMl0gfD0gdFtmXSA8PCB5WzMgJiBoKytdO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYSlcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikocyA9IHQuY2hhckNvZGVBdChmKSkgPCAxMjggPyB1W2grK10gPSBzIDogcyA8IDIwNDggPyAodVtoKytdID0gMTkyIHwgcyA+PiA2LCB1W2grK10gPSAxMjggfCA2MyAmIHMpIDogcyA8IDU1Mjk2IHx8IHMgPj0gNTczNDQgPyAodVtoKytdID0gMjI0IHwgcyA+PiAxMiwgdVtoKytdID0gMTI4IHwgcyA+PiA2ICYgNjMsIHVbaCsrXSA9IDEyOCB8IDYzICYgcykgOiAocyA9IDY1NTM2ICsgKCgxMDIzICYgcykgPDwgMTAgfCAxMDIzICYgdC5jaGFyQ29kZUF0KCsrZikpLCB1W2grK10gPSAyNDAgfCBzID4+IDE4LCB1W2grK10gPSAxMjggfCBzID4+IDEyICYgNjMsIHVbaCsrXSA9IDEyOCB8IHMgPj4gNiAmIDYzLCB1W2grK10gPSAxMjggfCA2MyAmIHMpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKShzID0gdC5jaGFyQ29kZUF0KGYpKSA8IDEyOCA/IG5baCA+PiAyXSB8PSBzIDw8IHlbMyAmIGgrK10gOiBzIDwgMjA0OCA/IChuW2ggPj4gMl0gfD0gKDE5MiB8IHMgPj4gNikgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pIDogcyA8IDU1Mjk2IHx8IHMgPj0gNTczNDQgPyAobltoID4+IDJdIHw9ICgyMjQgfCBzID4+IDEyKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gNiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSkgOiAocyA9IDY1NTM2ICsgKCgxMDIzICYgcykgPDwgMTAgfCAxMDIzICYgdC5jaGFyQ29kZUF0KCsrZikpLCBuW2ggPj4gMl0gfD0gKDI0MCB8IHMgPj4gMTgpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgcyA+PiAxMiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gNiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RCeXRlSW5kZXggPSBoLCB0aGlzLmJ5dGVzICs9IGggLSB0aGlzLnN0YXJ0LCBoID49IDY0ID8gKHRoaXMuc3RhcnQgPSBoIC0gNjQsIHRoaXMuaGFzaCgpLCB0aGlzLmhhc2hlZCA9ICEwKSA6IHRoaXMuc3RhcnQgPSBoIH0gcmV0dXJuIHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1ICYmICh0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwLCB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTYpLCB0aGlzIH0gfSwgdC5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbigpIHsgaWYgKCF0aGlzLmZpbmFsaXplZCkgeyB0aGlzLmZpbmFsaXplZCA9ICEwOyB2YXIgdCA9IHRoaXMuYmxvY2tzLFxyXG4gICAgICAgICAgICAgICAgciA9IHRoaXMubGFzdEJ5dGVJbmRleDtcclxuICAgICAgICAgICAgdFtyID4+IDJdIHw9IHVbMyAmIHJdLCByID49IDU2ICYmICh0aGlzLmhhc2hlZCB8fCB0aGlzLmhhc2goKSwgdFswXSA9IHRbMTZdLCB0WzE2XSA9IHRbMV0gPSB0WzJdID0gdFszXSA9IHRbNF0gPSB0WzVdID0gdFs2XSA9IHRbN10gPSB0WzhdID0gdFs5XSA9IHRbMTBdID0gdFsxMV0gPSB0WzEyXSA9IHRbMTNdID0gdFsxNF0gPSB0WzE1XSA9IDApLCB0WzE0XSA9IHRoaXMuYnl0ZXMgPDwgMywgdFsxNV0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjksIHRoaXMuaGFzaCgpIH0gfSwgdC5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uKCkgeyB2YXIgdCwgciwgZSwgaSwgcywgaCwgZiA9IHRoaXMuYmxvY2tzO1xyXG4gICAgICAgIHRoaXMuZmlyc3QgPyByID0gKChyID0gKCh0ID0gKCh0ID0gZlswXSAtIDY4MDg3NjkzNykgPDwgNyB8IHQgPj4+IDI1KSAtIDI3MTczMzg3OSA8PCAwKSBeIChlID0gKChlID0gKC0yNzE3MzM4NzkgXiAoaSA9ICgoaSA9ICgtMTczMjU4NDE5NCBeIDIwMDQzMTgwNzEgJiB0KSArIGZbMV0gLSAxMTc4MzA3MDgpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICgtMjcxNzMzODc5IF4gdCkpICsgZlsyXSAtIDExMjY0NzgzNzUpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlszXSAtIDEzMTYyNTkyMDkpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwIDogKHQgPSB0aGlzLmgwLCByID0gdGhpcy5oMSwgZSA9IHRoaXMuaDIsIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9ICgoaSA9IHRoaXMuaDMpIF4gciAmIChlIF4gaSkpICsgZlswXSAtIDY4MDg3NjkzNikgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZlsxXSAtIDM4OTU2NDU4NikgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzJdICsgNjA2MTA1ODE5KSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbM10gLSAxMDQ0NTI1MzMwKSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCksIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9IChpIF4gciAmIChlIF4gaSkpICsgZls0XSAtIDE3NjQxODg5NykgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZls1XSArIDEyMDAwODA0MjYpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZls2XSAtIDE0NzMyMzEzNDEpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZls3XSAtIDQ1NzA1OTgzKSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKGkgXiByICYgKGUgXiBpKSkgKyBmWzhdICsgMTc3MDAzNTQxNikgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZls5XSAtIDE5NTg0MTQ0MTcpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZlsxMF0gLSA0MjA2MykgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzExXSAtIDE5OTA0MDQxNjIpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwLCByID0gKChyICs9ICgodCA9ICgodCArPSAoaSBeIHIgJiAoZSBeIGkpKSArIGZbMTJdICsgMTgwNDYwMzY4MikgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZlsxM10gLSA0MDM0MTEwMSkgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzE0XSAtIDE1MDIwMDIyOTApIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlsxNV0gKyAxMjM2NTM1MzI5KSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZlsxXSAtIDE2NTc5NjUxMCkgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzZdIC0gMTA2OTUwMTYzMikgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZlsxMV0gKyA2NDM3MTc3MTMpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbMF0gLSAzNzM4OTczMDIpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzVdIC0gNzAxNTU4NjkxKSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbMTBdICsgMzgwMTYwODMpIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbMTVdIC0gNjYwNDc4MzM1KSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzRdIC0gNDA1NTM3ODQ4KSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZls5XSArIDU2ODQ0NjQzOCkgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzE0XSAtIDEwMTk4MDM2OTApIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbM10gLSAxODczNjM5NjEpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbOF0gKyAxMTYzNTMxNTAxKSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZlsxM10gLSAxNDQ0NjgxNDY3KSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbMl0gLSA1MTQwMzc4NCkgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZls3XSArIDE3MzUzMjg0NzMpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbMTJdIC0gMTkyNjYwNzczNCkgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbNV0gLSAzNzg1NTgpIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbOF0gLSAyMDIyNTc0NDYzKSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzExXSArIDE4MzkwMzA1NjIpIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzE0XSAtIDM1MzA5NTU2KSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzFdIC0gMTUzMDk5MjA2MCkgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZls0XSArIDEyNzI4OTMzNTMpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbN10gLSAxNTU0OTc2MzIpIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzEwXSAtIDEwOTQ3MzA2NDApIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbMTNdICsgNjgxMjc5MTc0KSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzBdIC0gMzU4NTM3MjIyKSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzNdIC0gNzIyNTIxOTc5KSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZls2XSArIDc2MDI5MTg5KSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzldIC0gNjQwMzY0NDg3KSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzEyXSAtIDQyMTgxNTgzNSkgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZlsxNV0gKyA1MzA3NDI1MjApIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzJdIC0gOTk1MzM4NjUxKSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbMF0gLSAxOTg2MzA4NDQpIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbN10gKyAxMTI2ODkxNDE1KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzE0XSAtIDE0MTYzNTQ5MDUpIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzVdIC0gNTc0MzQwNTUpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbMTJdICsgMTcwMDQ4NTU3MSkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZlszXSAtIDE4OTQ5ODY2MDYpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbMTBdIC0gMTA1MTUyMykgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbMV0gLSAyMDU0OTIyNzk5KSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzhdICsgMTg3MzMxMzM1OSkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZlsxNV0gLSAzMDYxMTc0NCkgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZls2XSAtIDE1NjAxOTgzODApIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzEzXSArIDEzMDkxNTE2NDkpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbNF0gLSAxNDU1MjMwNzApIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbMTFdIC0gMTEyMDIxMDM3OSkgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZlsyXSArIDcxODc4NzI1OSkgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbOV0gLSAzNDM0ODU1NTEpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCB0aGlzLmZpcnN0ID8gKHRoaXMuaDAgPSB0ICsgMTczMjU4NDE5MyA8PCAwLCB0aGlzLmgxID0gciAtIDI3MTczMzg3OSA8PCAwLCB0aGlzLmgyID0gZSAtIDE3MzI1ODQxOTQgPDwgMCwgdGhpcy5oMyA9IGkgKyAyNzE3MzM4NzggPDwgMCwgdGhpcy5maXJzdCA9ICExKSA6ICh0aGlzLmgwID0gdGhpcy5oMCArIHQgPDwgMCwgdGhpcy5oMSA9IHRoaXMuaDEgKyByIDw8IDAsIHRoaXMuaDIgPSB0aGlzLmgyICsgZSA8PCAwLCB0aGlzLmgzID0gdGhpcy5oMyArIGkgPDwgMCkgfSwgdC5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24oKSB7IHRoaXMuZmluYWxpemUoKTsgdmFyIHQgPSB0aGlzLmgwLFxyXG4gICAgICAgICAgICByID0gdGhpcy5oMSxcclxuICAgICAgICAgICAgZSA9IHRoaXMuaDIsXHJcbiAgICAgICAgICAgIGkgPSB0aGlzLmgzOyByZXR1cm4gblt0ID4+IDQgJiAxNV0gKyBuWzE1ICYgdF0gKyBuW3QgPj4gMTIgJiAxNV0gKyBuW3QgPj4gOCAmIDE1XSArIG5bdCA+PiAyMCAmIDE1XSArIG5bdCA+PiAxNiAmIDE1XSArIG5bdCA+PiAyOCAmIDE1XSArIG5bdCA+PiAyNCAmIDE1XSArIG5bciA+PiA0ICYgMTVdICsgblsxNSAmIHJdICsgbltyID4+IDEyICYgMTVdICsgbltyID4+IDggJiAxNV0gKyBuW3IgPj4gMjAgJiAxNV0gKyBuW3IgPj4gMTYgJiAxNV0gKyBuW3IgPj4gMjggJiAxNV0gKyBuW3IgPj4gMjQgJiAxNV0gKyBuW2UgPj4gNCAmIDE1XSArIG5bMTUgJiBlXSArIG5bZSA+PiAxMiAmIDE1XSArIG5bZSA+PiA4ICYgMTVdICsgbltlID4+IDIwICYgMTVdICsgbltlID4+IDE2ICYgMTVdICsgbltlID4+IDI4ICYgMTVdICsgbltlID4+IDI0ICYgMTVdICsgbltpID4+IDQgJiAxNV0gKyBuWzE1ICYgaV0gKyBuW2kgPj4gMTIgJiAxNV0gKyBuW2kgPj4gOCAmIDE1XSArIG5baSA+PiAyMCAmIDE1XSArIG5baSA+PiAxNiAmIDE1XSArIG5baSA+PiAyOCAmIDE1XSArIG5baSA+PiAyNCAmIDE1XSB9LCB0LnByb3RvdHlwZS50b1N0cmluZyA9IHQucHJvdG90eXBlLmhleCwgdC5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24oKSB7IHRoaXMuZmluYWxpemUoKTsgdmFyIHQgPSB0aGlzLmgwLFxyXG4gICAgICAgICAgICByID0gdGhpcy5oMSxcclxuICAgICAgICAgICAgZSA9IHRoaXMuaDIsXHJcbiAgICAgICAgICAgIGkgPSB0aGlzLmgzOyByZXR1cm4gWzI1NSAmIHQsIHQgPj4gOCAmIDI1NSwgdCA+PiAxNiAmIDI1NSwgdCA+PiAyNCAmIDI1NSwgMjU1ICYgciwgciA+PiA4ICYgMjU1LCByID4+IDE2ICYgMjU1LCByID4+IDI0ICYgMjU1LCAyNTUgJiBlLCBlID4+IDggJiAyNTUsIGUgPj4gMTYgJiAyNTUsIGUgPj4gMjQgJiAyNTUsIDI1NSAmIGksIGkgPj4gOCAmIDI1NSwgaSA+PiAxNiAmIDI1NSwgaSA+PiAyNCAmIDI1NV0gfSwgdC5wcm90b3R5cGUuYXJyYXkgPSB0LnByb3RvdHlwZS5kaWdlc3QsIHQucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7IHRoaXMuZmluYWxpemUoKTsgdmFyIHQgPSBuZXcgQXJyYXlCdWZmZXIoMTYpLFxyXG4gICAgICAgICAgICByID0gbmV3IFVpbnQzMkFycmF5KHQpOyByZXR1cm4gclswXSA9IHRoaXMuaDAsIHJbMV0gPSB0aGlzLmgxLCByWzJdID0gdGhpcy5oMiwgclszXSA9IHRoaXMuaDMsIHQgfSwgdC5wcm90b3R5cGUuYnVmZmVyID0gdC5wcm90b3R5cGUuYXJyYXlCdWZmZXIsIHQucHJvdG90eXBlLmJhc2U2NCA9IGZ1bmN0aW9uKCkgeyBmb3IgKHZhciB0LCByLCBlLCBpID0gXCJcIiwgcyA9IHRoaXMuYXJyYXkoKSwgaCA9IDA7IGggPCAxNTspIHQgPSBzW2grK10sIHIgPSBzW2grK10sIGUgPSBzW2grK10sIGkgKz0gcFt0ID4+PiAyXSArIHBbNjMgJiAodCA8PCA0IHwgciA+Pj4gNCldICsgcFs2MyAmIChyIDw8IDIgfCBlID4+PiA2KV0gKyBwWzYzICYgZV07IHJldHVybiB0ID0gc1toXSwgaSArPSBwW3QgPj4+IDJdICsgcFt0IDw8IDQgJiA2M10gKyBcIj09XCIgfTsgdmFyIF8gPSB2KCk7XHJcbiAgICBmID8gbW9kdWxlLmV4cG9ydHMgPSBfIDogKGkubWQ1ID0gXywgbyAmJiBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBfIH0pKSB9KCk7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3RcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgIH1cblxuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayhcbiAgICAgIHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aClcbiAgICApKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxudmFyIEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ3BhcmVudCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ieXRlT2Zmc2V0XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKGlzQXJyYXlCdWZmZXIodmFsdWUpIHx8ICh2YWx1ZSAmJiBpc0FycmF5QnVmZmVyKHZhbHVlLmJ1ZmZlcikpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIE5vdGU6IENoYW5nZSBwcm90b3R5cGUgKmFmdGVyKiBCdWZmZXIuZnJvbSBpcyBkZWZpbmVkIHRvIHdvcmthcm91bmQgQ2hyb21lIGJ1Zzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvMTQ4XG5CdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG5CdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAoc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IGJ1Zi53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgYnVmID0gYnVmLnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGJ1ZltpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wib2Zmc2V0XCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJsZW5ndGhcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgdmFyIGJ1ZlxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgYnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0IChvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW4pXG5cbiAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJ1ZlxuICAgIH1cblxuICAgIG9iai5jb3B5KGJ1ZiwgMCwgMCwgbGVuKVxuICAgIHJldHVybiBidWZcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KG9iaikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IG51bWJlcklzTmFOKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBBcnJheS1saWtlIE9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwgS19NQVhfTEVOR1RIYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBLX01BWF9MRU5HVEgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICE9IG51bGwgJiYgYi5faXNCdWZmZXIgPT09IHRydWVcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYnVmKSkge1xuICAgICAgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBpc0FycmF5QnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgKGFuZCB0aGUgYGlzLWJ1ZmZlcmAgbnBtIHBhY2thZ2UpXG4vLyB0byBkZXRlY3QgYSBCdWZmZXIgaW5zdGFuY2UuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHVzZSBgaW5zdGFuY2VvZiBCdWZmZXJgXG4vLyByZWxpYWJseSBpbiBhIGJyb3dzZXJpZnkgY29udGV4dCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG11bHRpcGxlIGRpZmZlcmVudFxuLy8gY29waWVzIG9mIHRoZSAnYnVmZmVyJyBwYWNrYWdlIGluIHVzZS4gVGhpcyBtZXRob2Qgd29ya3MgZXZlbiBmb3IgQnVmZmVyXG4vLyBpbnN0YW5jZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZnJvbSBhbm90aGVyIGNvcHkgb2YgdGhlIGBidWZmZXJgIHBhY2thZ2UuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNTRcbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nXG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBVc2UgYnVpbHQtaW4gd2hlbiBhdmFpbGFibGUsIG1pc3NpbmcgZnJvbSBJRTExXG4gICAgdGhpcy5jb3B5V2l0aGluKHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKVxuICB9IGVsc2UgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yICh2YXIgaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZylcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHZhbHVlIFwiJyArIHZhbCArXG4gICAgICAgICdcIiBpcyBpbnZhbGlkIGZvciBhcmd1bWVudCBcInZhbHVlXCInKVxuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXisvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHRha2VzIGVxdWFsIHNpZ25zIGFzIGVuZCBvZiB0aGUgQmFzZTY0IGVuY29kaW5nXG4gIHN0ciA9IHN0ci5zcGxpdCgnPScpWzBdXG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuLy8gQXJyYXlCdWZmZXJzIGZyb20gYW5vdGhlciBjb250ZXh0IChpLmUuIGFuIGlmcmFtZSkgZG8gbm90IHBhc3MgdGhlIGBpbnN0YW5jZW9mYCBjaGVja1xuLy8gYnV0IHRoZXkgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgdmFsaWQuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gJ0FycmF5QnVmZmVyJyAmJlxuICAgICAgdHlwZW9mIG9iai5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJylcbn1cblxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICByZXR1cm4gb2JqICE9PSBvYmogLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiLypcbiAqICBiYXNlNjQuanNcbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxuICogICAgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICpcbiAqICBSZWZlcmVuY2VzOlxuICogICAgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjRcbiAqL1xuOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KGdsb2JhbClcbiAgICAgICAgOiB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWRcbiAgICAgICAgPyBkZWZpbmUoZmFjdG9yeSkgOiBmYWN0b3J5KGdsb2JhbClcbn0oKFxuICAgIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGZcbiAgICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvd1xuICAgICAgICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsXG46IHRoaXNcbiksIGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBleGlzdGluZyB2ZXJzaW9uIGZvciBub0NvbmZsaWN0KClcbiAgICB2YXIgX0Jhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgdmFyIHZlcnNpb24gPSBcIjIuNC41XCI7XG4gICAgLy8gaWYgbm9kZS5qcywgd2UgdXNlIEJ1ZmZlclxuICAgIHZhciBidWZmZXI7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge31cbiAgICB9XG4gICAgLy8gY29uc3RhbnRzXG4gICAgdmFyIGI2NGNoYXJzXG4gICAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuICAgIHZhciBiNjR0YWIgPSBmdW5jdGlvbihiaW4pIHtcbiAgICAgICAgdmFyIHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBiaW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB0W2Jpbi5jaGFyQXQoaSldID0gaTtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfShiNjRjaGFycyk7XG4gICAgdmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG4gICAgLy8gZW5jb2RlciBzdHVmZlxuICAgIHZhciBjYl91dG9iID0gZnVuY3Rpb24oYykge1xuICAgICAgICBpZiAoYy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICB2YXIgY2MgPSBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICByZXR1cm4gY2MgPCAweDgwID8gY1xuICAgICAgICAgICAgICAgIDogY2MgPCAweDgwMCA/IChmcm9tQ2hhckNvZGUoMHhjMCB8IChjYyA+Pj4gNikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoY2MgJiAweDNmKSkpXG4gICAgICAgICAgICAgICAgOiAoZnJvbUNoYXJDb2RlKDB4ZTAgfCAoKGNjID4+PiAxMikgJiAweDBmKSlcbiAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICggY2MgICAgICAgICAmIDB4M2YpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY2MgPSAweDEwMDAwXG4gICAgICAgICAgICAgICAgKyAoYy5jaGFyQ29kZUF0KDApIC0gMHhEODAwKSAqIDB4NDAwXG4gICAgICAgICAgICAgICAgKyAoYy5jaGFyQ29kZUF0KDEpIC0gMHhEQzAwKTtcbiAgICAgICAgICAgIHJldHVybiAoZnJvbUNoYXJDb2RlKDB4ZjAgfCAoKGNjID4+PiAxOCkgJiAweDA3KSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+IDEyKSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVfdXRvYiA9IC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZGXXxbXlxceDAwLVxceDdGXS9nO1xuICAgIHZhciB1dG9iID0gZnVuY3Rpb24odSkge1xuICAgICAgICByZXR1cm4gdS5yZXBsYWNlKHJlX3V0b2IsIGNiX3V0b2IpO1xuICAgIH07XG4gICAgdmFyIGNiX2VuY29kZSA9IGZ1bmN0aW9uKGNjYykge1xuICAgICAgICB2YXIgcGFkbGVuID0gWzAsIDIsIDFdW2NjYy5sZW5ndGggJSAzXSxcbiAgICAgICAgb3JkID0gY2NjLmNoYXJDb2RlQXQoMCkgPDwgMTZcbiAgICAgICAgICAgIHwgKChjY2MubGVuZ3RoID4gMSA/IGNjYy5jaGFyQ29kZUF0KDEpIDogMCkgPDwgOClcbiAgICAgICAgICAgIHwgKChjY2MubGVuZ3RoID4gMiA/IGNjYy5jaGFyQ29kZUF0KDIpIDogMCkpLFxuICAgICAgICBjaGFycyA9IFtcbiAgICAgICAgICAgIGI2NGNoYXJzLmNoYXJBdCggb3JkID4+PiAxOCksXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gMTIpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDIgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gNikgJiA2MyksXG4gICAgICAgICAgICBwYWRsZW4gPj0gMSA/ICc9JyA6IGI2NGNoYXJzLmNoYXJBdChvcmQgJiA2MylcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIGJ0b2EgPSBnbG9iYWwuYnRvYSA/IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbC5idG9hKGIpO1xuICAgIH0gOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gYnVmZmVyID9cbiAgICAgICAgYnVmZmVyLmZyb20gJiYgVWludDhBcnJheSAmJiBidWZmZXIuZnJvbSAhPT0gVWludDhBcnJheS5mcm9tXG4gICAgICAgID8gZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIHJldHVybiAodS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yID8gdSA6IGJ1ZmZlci5mcm9tKHUpKVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgfVxuICAgICAgICA6ICBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgcmV0dXJuICh1LmNvbnN0cnVjdG9yID09PSBidWZmZXIuY29uc3RydWN0b3IgPyB1IDogbmV3ICBidWZmZXIodSkpXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGJ0b2EodXRvYih1KSkgfVxuICAgIDtcbiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24odSwgdXJpc2FmZSkge1xuICAgICAgICByZXR1cm4gIXVyaXNhZmVcbiAgICAgICAgICAgID8gX2VuY29kZShTdHJpbmcodSkpXG4gICAgICAgICAgICA6IF9lbmNvZGUoU3RyaW5nKHUpKS5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbTAgPT0gJysnID8gJy0nIDogJ18nO1xuICAgICAgICAgICAgfSkucmVwbGFjZSgvPS9nLCAnJyk7XG4gICAgfTtcbiAgICB2YXIgZW5jb2RlVVJJID0gZnVuY3Rpb24odSkgeyByZXR1cm4gZW5jb2RlKHUsIHRydWUpIH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gbmV3IFJlZ0V4cChbXG4gICAgICAgICdbXFx4QzAtXFx4REZdW1xceDgwLVxceEJGXScsXG4gICAgICAgICdbXFx4RTAtXFx4RUZdW1xceDgwLVxceEJGXXsyfScsXG4gICAgICAgICdbXFx4RjAtXFx4RjddW1xceDgwLVxceEJGXXszfSdcbiAgICBdLmpvaW4oJ3wnKSwgJ2cnKTtcbiAgICB2YXIgY2JfYnRvdSA9IGZ1bmN0aW9uKGNjY2MpIHtcbiAgICAgICAgc3dpdGNoKGNjY2MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHZhciBjcCA9ICgoMHgwNyAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTgpXG4gICAgICAgICAgICAgICAgfCAgICAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpIDw8IDEyKVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDIpKSA8PCAgNilcbiAgICAgICAgICAgICAgICB8ICAgICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgzKSksXG4gICAgICAgICAgICBvZmZzZXQgPSBjcCAtIDB4MTAwMDA7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgob2Zmc2V0ICA+Pj4gMTApICsgMHhEODAwKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgob2Zmc2V0ICYgMHgzRkYpICsgMHhEQzAwKSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmcm9tQ2hhckNvZGUoXG4gICAgICAgICAgICAgICAgKCgweDBmICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCAxMilcbiAgICAgICAgICAgICAgICAgICAgfCAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDIpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAgZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgxZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgNilcbiAgICAgICAgICAgICAgICAgICAgfCAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgYnRvdSA9IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGIucmVwbGFjZShyZV9idG91LCBjYl9idG91KTtcbiAgICB9O1xuICAgIHZhciBjYl9kZWNvZGUgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHZhciBsZW4gPSBjY2NjLmxlbmd0aCxcbiAgICAgICAgcGFkbGVuID0gbGVuICUgNCxcbiAgICAgICAgbiA9IChsZW4gPiAwID8gYjY0dGFiW2NjY2MuY2hhckF0KDApXSA8PCAxOCA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAxID8gYjY0dGFiW2NjY2MuY2hhckF0KDEpXSA8PCAxMiA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAyID8gYjY0dGFiW2NjY2MuY2hhckF0KDIpXSA8PCAgNiA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAzID8gYjY0dGFiW2NjY2MuY2hhckF0KDMpXSAgICAgICA6IDApLFxuICAgICAgICBjaGFycyA9IFtcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSggbiA+Pj4gMTYpLFxuICAgICAgICAgICAgZnJvbUNoYXJDb2RlKChuID4+PiAgOCkgJiAweGZmKSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSggbiAgICAgICAgICYgMHhmZilcbiAgICAgICAgXTtcbiAgICAgICAgY2hhcnMubGVuZ3RoIC09IFswLCAwLCAyLCAxXVtwYWRsZW5dO1xuICAgICAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gICAgfTtcbiAgICB2YXIgYXRvYiA9IGdsb2JhbC5hdG9iID8gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmF0b2IoYSk7XG4gICAgfSA6IGZ1bmN0aW9uKGEpe1xuICAgICAgICByZXR1cm4gYS5yZXBsYWNlKC9bXFxzXFxTXXsxLDR9L2csIGNiX2RlY29kZSk7XG4gICAgfTtcbiAgICB2YXIgX2RlY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICA/IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IGJ1ZmZlci5mcm9tKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IG5ldyBidWZmZXIoYSwgJ2Jhc2U2NCcpKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gYnRvdShhdG9iKGEpKSB9O1xuICAgIHZhciBkZWNvZGUgPSBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIF9kZWNvZGUoXG4gICAgICAgICAgICBTdHJpbmcoYSkucmVwbGFjZSgvWy1fXS9nLCBmdW5jdGlvbihtMCkgeyByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nIH0pXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJylcbiAgICAgICAgKTtcbiAgICB9O1xuICAgIHZhciBub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgICAgICBnbG9iYWwuQmFzZTY0ID0gX0Jhc2U2NDtcbiAgICAgICAgcmV0dXJuIEJhc2U2NDtcbiAgICB9O1xuICAgIC8vIGV4cG9ydCBCYXNlNjRcbiAgICBnbG9iYWwuQmFzZTY0ID0ge1xuICAgICAgICBWRVJTSU9OOiB2ZXJzaW9uLFxuICAgICAgICBhdG9iOiBhdG9iLFxuICAgICAgICBidG9hOiBidG9hLFxuICAgICAgICBmcm9tQmFzZTY0OiBkZWNvZGUsXG4gICAgICAgIHRvQmFzZTY0OiBlbmNvZGUsXG4gICAgICAgIHV0b2I6IHV0b2IsXG4gICAgICAgIGVuY29kZTogZW5jb2RlLFxuICAgICAgICBlbmNvZGVVUkk6IGVuY29kZVVSSSxcbiAgICAgICAgYnRvdTogYnRvdSxcbiAgICAgICAgZGVjb2RlOiBkZWNvZGUsXG4gICAgICAgIG5vQ29uZmxpY3Q6IG5vQ29uZmxpY3RcbiAgICB9O1xuICAgIC8vIGlmIEVTNSBpcyBhdmFpbGFibGUsIG1ha2UgQmFzZTY0LmV4dGVuZFN0cmluZygpIGF2YWlsYWJsZVxuICAgIGlmICh0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBub0VudW0gPSBmdW5jdGlvbih2KXtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6dixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9O1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWwuQmFzZTY0LmV4dGVuZFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAnZnJvbUJhc2U2NCcsIG5vRW51bShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGUodGhpcylcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICh1cmlzYWZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdXJpc2FmZSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0VVJJJywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyBleHBvcnQgQmFzZTY0IHRvIHRoZSBuYW1lc3BhY2VcbiAgICAvL1xuICAgIGlmIChnbG9iYWxbJ01ldGVvciddKSB7IC8vIE1ldGVvci5qc1xuICAgICAgICBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIH1cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBhbmQgQU1EIGFyZSBtdXR1YWxseSBleGNsdXNpdmUuXG4gICAgLy8gbW9kdWxlLmV4cG9ydHMgaGFzIHByZWNlZGVuY2UuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLkJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKXsgcmV0dXJuIGdsb2JhbC5CYXNlNjQgfSk7XG4gICAgfVxuICAgIC8vIHRoYXQncyBpdCFcbiAgICByZXR1cm4ge0Jhc2U2NDogZ2xvYmFsLkJhc2U2NH1cbn0pKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
