(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _ajax = require('./vendor/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _jsBase = require('js-base64');

var _md = require('./vendor/md5.min');

var _md2 = _interopRequireDefault(_md);

var _jsCookie = require('./vendor/js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (c, d) {
  console.log(navigator.userAgent.indexOf("MSIE"));
  console.log(navigator.userAgent.indexOf("Edge"));
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    document.getElementById("password-field").style.display = "none";
  }

  var waiting = d.querySelector('#waiting');
  var READY_STATE_COMPLETE = 4;
  var OK = 200;
  var NOT_FOUND = 404;
  var loader = d.querySelector('#loader');
  var main = d.querySelector('#main');
  var loginbutton = d.querySelector('#login-button');

  var hasClass = function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };

  var addClass = function addClass(el, className) {
    if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
  };

  var removeClass = function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  };

  var logout = function logout() {
    _jsCookie2.default.remove('UserName');
    _jsCookie2.default.remove('UserRole');
    _jsCookie2.default.remove('sessionId');
    _jsCookie2.default.remove('token');
    _jsCookie2.default.remove('wssURL');
    _jsCookie2.default.remove('RootPath');
    _jsCookie2.default.remove('CompanyName');
    _jsCookie2.default.remove('AccessString');
    document.location.href = '/';
  };

  var showDashboard = function showDashboard(data) {
    console.log("data::showDashboard: ", data);
    _jsCookie2.default.set('token', data.Token);
    _jsCookie2.default.set('UserName', data.UserName);
    _jsCookie2.default.set('UserRole', data.Role);
    _jsCookie2.default.set('wssURL', data.wssURL);
    _jsCookie2.default.set('CompanyName', data.CompanyName);
    _jsCookie2.default.set('RootPath', data.RootPath);
    _jsCookie2.default.set('AccessString', data.AccessString);
    window.location.href = '/dashboard';
  };

  function submit(e) {
    e.preventDefault();
    var username = d.querySelector('#username').value;
    var password = d.querySelector('#password').value;
    var form = d.querySelector('#formLogon');
    //d.querySelector('#password').value = Base64.encode(md5(password)
    console.log(password);
    console.log((0, _md2.default)(password));
    console.log(_jsBase.Base64.encode((0, _md2.default)(password)));
    (0, _ajax2.default)({
      type: 'POST',
      url: '/login',
      data: {
        username: username,
        password: _jsBase.Base64.encode((0, _md2.default)(password))
      },
      ajaxtimeout: 40000,
      beforeSend: function beforeSend() {
        addClass(waiting, 'active');
      },
      success: function success(data) {
        console.log(data);
        //console.log(JSON.parse(data))
        var dataJSON = JSON.parse(data);
        console.log('status', dataJSON.status);
        if (status === 'FAIL') {
          M.toast({
            html: dataJSON.message
          });
          document.querySelector('#message').innerHTML = dataJSON.message;
        } else {
          showDashboard(dataJSON.data);
        }
      },
      complete: function complete(xhr, status) {
        console.log(xhr, status);
      },
      error: function error(xhr, err) {
        M.toast({
          html: 'Wrong user name or password'
        });
        if (err === 'timeout') {
          console.log('Timeout Error');
        } else {
          console.log(xhr, err);
        }
        removeClass(waiting, 'active');
      }
    });
  }
  loader.style.display = 'none';
  loginbutton.addEventListener('click', submit);

  d.getElementById("password-field").addEventListener('mouseout', function (e) {
    d.querySelector("#password").setAttribute("type", "password");
  });

  d.getElementById("password-field").addEventListener('click', function (e) {
    c('password-field click', e);

    var cName = d.getElementById("password-field").className;
    if (cName.indexOf("fa-eye") > -1) {
      e.target.classList.add("fa-eye");
    } else {
      e.target.classList.remove("fa-eye");
    }
    if (cName.indexOf("fa-eye-slash") > -1) {
      e.target.classList.add("fa-eye-slash");
    } else {
      e.target.classList.remove("fa-eye-sl");
    }

    var input = d.querySelector("#password");
    console.log(input);
    if (input.getAttribute("type") == "password") {
      input.setAttribute("type", "text");
    } else {
      input.setAttribute("type", "password");
    }
  });
  document.querySelector('#bar-preloader').style.display = 'none';
})(console.log, document);

},{"./vendor/ajax":2,"./vendor/js-cookie":3,"./vendor/md5.min":4,"js-base64":8}],2:[function(require,module,exports){
'use strict';

var type;
try {
  type = require('type-of');
} catch (ex) {
  // hide from browserify
  var r = require;
  type = r('type');
}

var jsonpID = 0;
var document = window.document;
var key;
var name;
// var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
var scriptTypeRE = /^(?:text|application)\/javascript/i;
var xmlTypeRE = /^(?:text|application)\/xml/i;
var jsonType = 'application/json';
var htmlType = 'text/html';
var blankRE = /^\s*$/;

var ajax = module.exports = function (options) {
  var settings = extend({}, options || {});
  for (key in ajax.settings) {
    if (settings[key] === undefined) settings[key] = ajax.settings[key];
  }

  ajaxStart(settings);

  if (!settings.crossDomain) {
    settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
  }

  var dataType = settings.dataType;
  var hasPlaceholder = /=\?/.test(settings.url);
  if (dataType === 'jsonp' || hasPlaceholder) {
    if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?');
    return ajax.JSONP(settings);
  }

  if (!settings.url) settings.url = window.location.toString();
  serializeData(settings);

  var mime = settings.accepts[dataType];
  var baseHeaders = {};
  var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
  var xhr = ajax.settings.xhr();
  var abortTimeout;

  if (settings.ajaxtimeout) xhr.timeout = settings.ajaxtimeout;
  if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
  if (mime) {
    baseHeaders['Accept'] = mime;
    if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
    xhr.overrideMimeType && xhr.overrideMimeType(mime);
  }
  if (settings.contentType || settings.data && settings.type.toUpperCase() !== 'GET') {
    baseHeaders['Content-Type'] = settings.contentType || 'application/x-www-form-urlencoded';
  }
  settings.headers = extend(baseHeaders, settings.headers || {});
  xhr.ontimeout = function () {
    ajaxError(null, 'timeout', xhr, settings);
  };
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      clearTimeout(abortTimeout);
      var result;
      var error = false;
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 0 && protocol === 'file:') {
        dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
        result = xhr.responseText;

        try {
          if (dataType === 'script') (1, eval)(result);else if (dataType === 'xml') result = xhr.responseXML;else if (dataType === 'json') result = blankRE.test(result) ? null : JSON.parse(result);
        } catch (e) {
          error = e;
        }

        if (error) ajaxError(error, 'parsererror', xhr, settings);else ajaxSuccess(result, xhr, settings);
      } else {
        if (xhr.status !== 0) {
          ajaxError(null, 'error', xhr, settings);
        }
      }
    }
  };

  var async = 'async' in settings ? settings.async : true;
  xhr.open(settings.type, settings.url, async);

  for (name in settings.headers) {
    xhr.setRequestHeader(name, settings.headers[name]);
  }if (ajaxBeforeSend(xhr, settings) === false) {
    xhr.abort();
    return false;
  }

  /* if (settings.timeout > 0) abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, settings)
  }, settings.timeout) */

  // avoid sending empty string (#319)
  xhr.send(settings.data ? settings.data : null);
  return xhr;
};

// trigger a custom event and return false if it was cancelled
function triggerAndReturn(context, eventName, data) {
  // todo: Fire off some events
  // var event = $.Event(eventName)
  // $(context).trigger(event, data)
  return true; //! event.defaultPrevented
}

// trigger an Ajax "global" event
function triggerGlobal(settings, context, eventName, data) {
  if (settings.global) return triggerAndReturn(context || document, eventName, data);
}

// Number of active Ajax requests
ajax.active = 0;

function ajaxStart(settings) {
  if (settings.global && ajax.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
}

function ajaxStop(settings) {
  if (settings.global && ! --ajax.active) triggerGlobal(settings, null, 'ajaxStop');
}

// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
function ajaxBeforeSend(xhr, settings) {
  var context = settings.context;
  if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) {
    return false;
  }

  triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
}

function ajaxSuccess(data, xhr, settings) {
  var context = settings.context;
  var status = 'success';
  settings.success.call(context, data, status, xhr);
  triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
  ajaxComplete(status, xhr, settings);
}
// type: "timeout", "error", "abort", "parsererror"
function ajaxError(error, type, xhr, settings) {
  var context = settings.context;
  settings.error.call(context, xhr, type, error);
  triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
  ajaxComplete(type, xhr, settings);
}
// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
function ajaxComplete(status, xhr, settings) {
  var context = settings.context;
  settings.complete.call(context, xhr, status);
  triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
  ajaxStop(settings);
}

// Empty function, used as default callback
function empty() {}

ajax.JSONP = function (options) {
  if (!('type' in options)) return ajax(options);
  var callbackName = 'jsonp' + ++jsonpID;
  var script = document.createElement('script');
  var abort = function abort() {
    // todo: remove script
    // $(script).remove()
    if (callbackName in window) window[callbackName] = empty;
    ajaxComplete('abort', xhr, options);
  };
  var xhr = { abort: abort };
  var abortTimeout;
  var head = document.getElementsByTagName('head')[0] || document.documentElement;

  if (options.error) {
    script.onerror = function () {
      xhr.abort();
      options.error();
    };
  }

  window[callbackName] = function (data) {
    clearTimeout(abortTimeout);
    // todo: remove script
    // $(script).remove()
    delete window[callbackName];
    ajaxSuccess(data, xhr, options);
  };

  serializeData(options);
  script.src = options.url.replace(/=\?/, '=' + callbackName);

  // Use insertBefore instead of appendChild to circumvent an IE6 bug.
  // This arises when a base node is used (see jQuery bugs #2709 and #4378).
  head.insertBefore(script, head.firstChild);

  if (options.timeout > 0) {
    abortTimeout = setTimeout(function () {
      xhr.abort();
      ajaxComplete('timeout', xhr, options);
    }, options.timeout);
  }

  return xhr;
};

ajax.settings = {
  // Default type of request
  type: 'GET',
  // Callback that is executed before request
  beforeSend: empty,
  // Callback that is executed if the request succeeds
  success: empty,
  // Callback that is executed the the server drops error
  error: empty,
  // Callback that is executed on request complete (both: error and success)
  complete: empty,
  // The context for the callbacks
  context: null,
  // Whether to trigger "global" Ajax events
  global: true,
  // Transport
  xhr: function xhr() {
    return new window.XMLHttpRequest();
  },
  // MIME types mapping
  accepts: {
    script: 'text/javascript, application/javascript',
    json: jsonType,
    xml: 'application/xml, text/xml',
    html: htmlType,
    text: 'text/plain'
  },
  // Whether the request is to another domain
  crossDomain: false,
  // Default timeout
  timeout: 0
};

function mimeToDataType(mime) {
  return mime && (mime === htmlType ? 'html' : mime === jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
}

function appendQuery(url, query) {
  return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}

// serialize payload and append it to the URL for GET requests
function serializeData(options) {
  if (type(options.data) === 'object') options.data = param(options.data);
  if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
    options.url = appendQuery(options.url, options.data);
  }
}

ajax.get = function (url, success) {
  return ajax({ url: url, success: success });
};

ajax.post = function (url, data, success, dataType) {
  if (type(data) === 'function') {
    dataType = dataType || success;
    success = data;
    data = null;
  }
  return ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
};

ajax.getJSON = function (url, success) {
  return ajax({ url: url, success: success, dataType: 'json' });
};

var escape = encodeURIComponent;

function serialize(params, obj, traditional, scope) {
  var array = type(obj) === 'array';
  for (var key in obj) {
    var value = obj[key];

    if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
    // handle data in serializeArray() format
    if (!scope && array) params.add(value.name, value.value);
    // recurse into nested objects
    else if (traditional ? type(value) === 'array' : type(value) === 'object') {
        serialize(params, value, traditional, key);
      } else params.add(key, value);
  }
}

function param(obj, traditional) {
  var params = [];
  params.add = function (k, v) {
    this.push(escape(k) + '=' + escape(v));
  };
  serialize(params, obj, traditional);
  return params.join('&').replace('%20', '+');
}

function extend(target) {
  var slice = Array.prototype.slice;
  slice.call(arguments, 1).forEach(function (source) {
    for (key in source) {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  });
  return target;
}

},{"type-of":10}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"_process":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"base64-js":5,"ieee754":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"buffer":6}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var toString = Object.prototype.toString

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function'
    case '[object Date]': return 'date'
    case '[object RegExp]': return 'regexp'
    case '[object Arguments]': return 'arguments'
    case '[object Array]': return 'array'
    case '[object String]': return 'string'
  }

  if (typeof val == 'object' && val && typeof val.length == 'number') {
    try {
      if (typeof val.callee == 'function') return 'arguments';
    } catch (ex) {
      if (ex instanceof TypeError) {
        return 'arguments';
      }
    }
  }

  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (val && val.nodeType === 1) return 'element'
  if (val === Object(val)) return 'object'

  return typeof val
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9sb2dvbi5qcyIsImpzL3ZlbmRvci9hamF4LmpzIiwianMvdmVuZG9yL2pzLWNvb2tpZS5qcyIsImpzL3ZlbmRvci9tZDUubWluLmpzIiwibm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qcy1iYXNlNjQvYmFzZTY0LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90eXBlLW9mL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOztBQUdBOzs7O0FBQ0E7Ozs7OztBQUVBLENBQUMsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQ1QsVUFBUSxHQUFSLENBQVksVUFBVSxTQUFWLENBQW9CLE9BQXBCLENBQTRCLE1BQTVCLENBQVo7QUFDQSxVQUFRLEdBQVIsQ0FBWSxVQUFVLFNBQVYsQ0FBb0IsT0FBcEIsQ0FBNEIsTUFBNUIsQ0FBWjtBQUNBLE1BQUcsVUFBVSxTQUFWLENBQW9CLE9BQXBCLENBQTRCLE1BQTVCLEtBQXFDLENBQUMsQ0FBdEMsSUFBMkMsVUFBVSxTQUFWLENBQW9CLE9BQXBCLENBQTRCLE1BQTVCLEtBQXNDLENBQUMsQ0FBckYsRUFBd0Y7QUFDdEYsYUFBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxLQUExQyxDQUFnRCxPQUFoRCxHQUF5RCxNQUF6RDtBQUNEOztBQUVELE1BQUksVUFBVSxFQUFFLGFBQUYsQ0FBZ0IsVUFBaEIsQ0FBZDtBQUNBLE1BQU0sdUJBQXVCLENBQTdCO0FBQ0EsTUFBTSxLQUFLLEdBQVg7QUFDQSxNQUFNLFlBQVksR0FBbEI7QUFDQSxNQUFNLFNBQVMsRUFBRSxhQUFGLENBQWdCLFNBQWhCLENB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBhamF4IGZyb20gJy4vdmVuZG9yL2FqYXgnO1xyXG5pbXBvcnQge1xyXG4gIEJhc2U2NFxyXG59IGZyb20gJ2pzLWJhc2U2NCc7XHJcbmltcG9ydCBtZDUgZnJvbSAnLi92ZW5kb3IvbWQ1Lm1pbic7XHJcbmltcG9ydCBDb29raWVzIGZyb20gJy4vdmVuZG9yL2pzLWNvb2tpZSc7XHJcblxyXG4oKGMsIGQpID0+IHtcclxuICBjb25zb2xlLmxvZyhuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpKTtcclxuICBjb25zb2xlLmxvZyhuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpKTtcclxuICBpZihuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpIT0tMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJFZGdlXCIpICE9LTEpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFzc3dvcmQtZmllbGRcIikuc3R5bGUuZGlzcGxheSA9XCJub25lXCI7IFxyXG4gIH1cclxuXHJcbiAgbGV0IHdhaXRpbmcgPSBkLnF1ZXJ5U2VsZWN0b3IoJyN3YWl0aW5nJylcclxuICBjb25zdCBSRUFEWV9TVEFURV9DT01QTEVURSA9IDRcclxuICBjb25zdCBPSyA9IDIwMFxyXG4gIGNvbnN0IE5PVF9GT1VORCA9IDQwNFxyXG4gIGNvbnN0IGxvYWRlciA9IGQucXVlcnlTZWxlY3RvcignI2xvYWRlcicpXHJcbiAgY29uc3QgbWFpbiA9IGQucXVlcnlTZWxlY3RvcignI21haW4nKVxyXG4gIGNvbnN0IGxvZ2luYnV0dG9uID0gZC5xdWVyeVNlbGVjdG9yKCcjbG9naW4tYnV0dG9uJylcclxuXHJcbiAgY29uc3QgaGFzQ2xhc3MgPSAoZWwsIGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgaWYgKGVsLmNsYXNzTGlzdClcclxuICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiAhIWVsLmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgYWRkQ2xhc3MgPSAoZWwsIGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgaWYgKGVsLmNsYXNzTGlzdClcclxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXHJcbiAgICBlbHNlIGlmICghaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVtb3ZlQ2xhc3MgPSAoZWwsIGNsYXNzTmFtZSkgPT4ge1xyXG4gICAgaWYgKGVsLmNsYXNzTGlzdClcclxuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXHJcbiAgICBlbHNlIGlmIChoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xyXG4gICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKVxyXG4gICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShyZWcsICcgJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxldCBsb2dvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBDb29raWVzLnJlbW92ZSgnVXNlck5hbWUnKTtcclxuICAgIENvb2tpZXMucmVtb3ZlKCdVc2VyUm9sZScpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoJ3Nlc3Npb25JZCcpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoJ3Rva2VuJyk7XHJcbiAgICBDb29raWVzLnJlbW92ZSgnd3NzVVJMJyk7XHJcbiAgICBDb29raWVzLnJlbW92ZSgnUm9vdFBhdGgnKTtcclxuICAgIENvb2tpZXMucmVtb3ZlKCdDb21wYW55TmFtZScpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoJ0FjY2Vzc1N0cmluZycpO1xyXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9ICcvJztcclxuICB9XHJcblxyXG4gIGxldCBzaG93RGFzaGJvYXJkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiZGF0YTo6c2hvd0Rhc2hib2FyZDogXCIsZGF0YSk7XHJcbiAgICBDb29raWVzLnNldCgndG9rZW4nLCBkYXRhLlRva2VuKTtcclxuICAgIENvb2tpZXMuc2V0KCdVc2VyTmFtZScsIGRhdGEuVXNlck5hbWUpO1xyXG4gICAgQ29va2llcy5zZXQoJ1VzZXJSb2xlJywgZGF0YS5Sb2xlKTtcclxuICAgIENvb2tpZXMuc2V0KCd3c3NVUkwnLCBkYXRhLndzc1VSTCk7XHJcbiAgICBDb29raWVzLnNldCgnQ29tcGFueU5hbWUnLCBkYXRhLkNvbXBhbnlOYW1lKTtcclxuICAgIENvb2tpZXMuc2V0KCdSb290UGF0aCcsIGRhdGEuUm9vdFBhdGgpO1xyXG4gICAgQ29va2llcy5zZXQoJ0FjY2Vzc1N0cmluZycsIGRhdGEuQWNjZXNzU3RyaW5nKTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9kYXNoYm9hcmQnO1xyXG4gIH07XHJcblxyXG5cclxuICBmdW5jdGlvbiBzdWJtaXQoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBsZXQgdXNlcm5hbWUgPSBkLnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpLnZhbHVlXHJcbiAgICBsZXQgcGFzc3dvcmQgPSBkLnF1ZXJ5U2VsZWN0b3IoJyNwYXNzd29yZCcpLnZhbHVlXHJcbiAgICBsZXQgZm9ybSA9IGQucXVlcnlTZWxlY3RvcignI2Zvcm1Mb2dvbicpXHJcbiAgICAvL2QucXVlcnlTZWxlY3RvcignI3Bhc3N3b3JkJykudmFsdWUgPSBCYXNlNjQuZW5jb2RlKG1kNShwYXNzd29yZClcclxuICAgIGNvbnNvbGUubG9nKHBhc3N3b3JkKVxyXG4gICAgY29uc29sZS5sb2cobWQ1KHBhc3N3b3JkKSlcclxuICAgIGNvbnNvbGUubG9nKEJhc2U2NC5lbmNvZGUobWQ1KHBhc3N3b3JkKSkpXHJcbiAgICBhamF4KHtcclxuICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiBCYXNlNjQuZW5jb2RlKG1kNShwYXNzd29yZCkpXHJcbiAgICAgIH0sXHJcbiAgICAgIGFqYXh0aW1lb3V0OiA0MDAwMCxcclxuICAgICAgYmVmb3JlU2VuZDogKCkgPT4ge1xyXG4gICAgICAgIGFkZENsYXNzKHdhaXRpbmcsICdhY3RpdmUnKVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5wYXJzZShkYXRhKSlcclxuICAgICAgICBsZXQgZGF0YUpTT04gPSBKU09OLnBhcnNlKGRhdGEpXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXR1cycsIGRhdGFKU09OLnN0YXR1cylcclxuICAgICAgICBpZiAoc3RhdHVzID09PSAnRkFJTCcpIHtcclxuICAgICAgICAgIE0udG9hc3Qoe1xyXG4gICAgICAgICAgICBodG1sOiBkYXRhSlNPTi5tZXNzYWdlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lc3NhZ2UnKS5pbm5lckhUTUwgPSBkYXRhSlNPTi5tZXNzYWdlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNob3dEYXNoYm9hcmQoZGF0YUpTT04uZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXBsZXRlOiAoeGhyLCBzdGF0dXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyh4aHIsIHN0YXR1cylcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6ICh4aHIsIGVycikgPT4ge1xyXG4gICAgICAgIE0udG9hc3Qoe1xyXG4gICAgICAgICAgaHRtbDogJ1dyb25nIHVzZXIgbmFtZSBvciBwYXNzd29yZCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChlcnIgPT09ICd0aW1lb3V0Jykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1RpbWVvdXQgRXJyb3InKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh4aHIsIGVycilcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtb3ZlQ2xhc3Mod2FpdGluZywgJ2FjdGl2ZScpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIGxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgbG9naW5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJtaXQpXHJcbiAgXHJcbiAgZC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkLWZpZWxkXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywoZSk9PntcclxuICAgIGQucXVlcnlTZWxlY3RvcihcIiNwYXNzd29yZFwiKS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJwYXNzd29yZFwiKVxyXG4gIH0pXHJcblxyXG4gIGQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZC1maWVsZFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT4ge1xyXG4gICAgYygncGFzc3dvcmQtZmllbGQgY2xpY2snLGUpXHJcblxyXG4gICAgbGV0IGNOYW1lID0gZC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkLWZpZWxkXCIpLmNsYXNzTmFtZTtcclxuICAgIGlmKGNOYW1lLmluZGV4T2YoXCJmYS1leWVcIikgPiAtMSkge1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiZmEtZXllXCIpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtZXllXCIpXHJcbiAgICB9XHJcbiAgICBpZihjTmFtZS5pbmRleE9mKFwiZmEtZXllLXNsYXNoXCIpID4tMSkge1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiZmEtZXllLXNsYXNoXCIpXHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1leWUtc2xcIilcclxuICAgIH1cclxuICAgXHJcbiAgICB2YXIgaW5wdXQgPSAgZC5xdWVyeVNlbGVjdG9yKFwiI3Bhc3N3b3JkXCIpO1xyXG4gICAgY29uc29sZS5sb2coaW5wdXQpXHJcbiAgICBpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcInBhc3N3b3JkXCIpIHtcclxuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLFwidGV4dFwiKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLFwicGFzc3dvcmRcIilcclxuICAgIH1cclxuICB9KTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYmFyLXByZWxvYWRlcicpLnN0eWxlLmRpc3BsYXk9J25vbmUnO1xyXG4gIFxyXG59KShjb25zb2xlLmxvZywgZG9jdW1lbnQpXHJcbiIsInZhciB0eXBlXHJcbnRyeSB7XHJcbiAgdHlwZSA9IHJlcXVpcmUoJ3R5cGUtb2YnKVxyXG59IGNhdGNoIChleCkge1xyXG4gICAgLy8gaGlkZSBmcm9tIGJyb3dzZXJpZnlcclxuICB2YXIgciA9IHJlcXVpcmVcclxuICB0eXBlID0gcigndHlwZScpXHJcbn1cclxuXHJcbnZhciBqc29ucElEID0gMFxyXG52YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnRcclxudmFyIGtleVxyXG52YXIgbmFtZVxyXG4gICAgLy8gdmFyIHJzY3JpcHQgPSAvPHNjcmlwdFxcYltePF0qKD86KD8hPFxcL3NjcmlwdD4pPFtePF0qKSo8XFwvc2NyaXB0Pi9naVxyXG52YXIgc2NyaXB0VHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL2phdmFzY3JpcHQvaVxyXG52YXIgeG1sVHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL3htbC9pXHJcbnZhciBqc29uVHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG52YXIgaHRtbFR5cGUgPSAndGV4dC9odG1sJ1xyXG52YXIgYmxhbmtSRSA9IC9eXFxzKiQvXHJcblxyXG52YXIgYWpheCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB2YXIgc2V0dGluZ3MgPSBleHRlbmQoe30sIG9wdGlvbnMgfHwge30pXHJcbiAgZm9yIChrZXkgaW4gYWpheC5zZXR0aW5ncykgeyBpZiAoc2V0dGluZ3Nba2V5XSA9PT0gdW5kZWZpbmVkKSBzZXR0aW5nc1trZXldID0gYWpheC5zZXR0aW5nc1trZXldIH1cclxuXHJcbiAgYWpheFN0YXJ0KHNldHRpbmdzKVxyXG5cclxuICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSB7XHJcbiAgICBzZXR0aW5ncy5jcm9zc0RvbWFpbiA9IC9eKFtcXHctXSs6KT9cXC9cXC8oW15cXC9dKykvLnRlc3Qoc2V0dGluZ3MudXJsKSAmJlxyXG4gICAgICAgICAgICBSZWdFeHAuJDIgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YVR5cGUgPSBzZXR0aW5ncy5kYXRhVHlwZVxyXG4gIHZhciBoYXNQbGFjZWhvbGRlciA9IC89XFw/Ly50ZXN0KHNldHRpbmdzLnVybClcclxuICBpZiAoZGF0YVR5cGUgPT09ICdqc29ucCcgfHwgaGFzUGxhY2Vob2xkZXIpIHtcclxuICAgIGlmICghaGFzUGxhY2Vob2xkZXIpIHNldHRpbmdzLnVybCA9IGFwcGVuZFF1ZXJ5KHNldHRpbmdzLnVybCwgJ2NhbGxiYWNrPT8nKVxyXG4gICAgcmV0dXJuIGFqYXguSlNPTlAoc2V0dGluZ3MpXHJcbiAgfVxyXG5cclxuICBpZiAoIXNldHRpbmdzLnVybCkgc2V0dGluZ3MudXJsID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcclxuICBzZXJpYWxpemVEYXRhKHNldHRpbmdzKVxyXG5cclxuICB2YXIgbWltZSA9IHNldHRpbmdzLmFjY2VwdHNbZGF0YVR5cGVdXHJcbiAgdmFyIGJhc2VIZWFkZXJzID0ge31cclxuICB2YXIgcHJvdG9jb2wgPSAvXihbXFx3LV0rOilcXC9cXC8vLnRlc3Qoc2V0dGluZ3MudXJsKSA/IFJlZ0V4cC4kMSA6IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbFxyXG4gIHZhciB4aHIgPSBhamF4LnNldHRpbmdzLnhocigpXHJcbiAgdmFyIGFib3J0VGltZW91dFxyXG5cclxuICBpZiAoc2V0dGluZ3MuYWpheHRpbWVvdXQpIHhoci50aW1lb3V0ID0gc2V0dGluZ3MuYWpheHRpbWVvdXRcclxuICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSBiYXNlSGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0J1xyXG4gIGlmIChtaW1lKSB7XHJcbiAgICBiYXNlSGVhZGVyc1snQWNjZXB0J10gPSBtaW1lXHJcbiAgICBpZiAobWltZS5pbmRleE9mKCcsJykgPiAtMSkgbWltZSA9IG1pbWUuc3BsaXQoJywnLCAyKVswXVxyXG4gICAgeGhyLm92ZXJyaWRlTWltZVR5cGUgJiYgeGhyLm92ZXJyaWRlTWltZVR5cGUobWltZSlcclxuICB9XHJcbiAgaWYgKHNldHRpbmdzLmNvbnRlbnRUeXBlIHx8IChzZXR0aW5ncy5kYXRhICYmIHNldHRpbmdzLnR5cGUudG9VcHBlckNhc2UoKSAhPT0gJ0dFVCcpKSB7IGJhc2VIZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykgfVxyXG4gIHNldHRpbmdzLmhlYWRlcnMgPSBleHRlbmQoYmFzZUhlYWRlcnMsIHNldHRpbmdzLmhlYWRlcnMgfHwge30pXHJcbiAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGFqYXhFcnJvcihudWxsLCAndGltZW91dCcsIHhociwgc2V0dGluZ3MpXHJcbiAgfVxyXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KGFib3J0VGltZW91dClcclxuICAgICAgdmFyIHJlc3VsdFxyXG4gICAgICB2YXIgZXJyb3IgPSBmYWxzZVxyXG4gICAgICBpZiAoKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHx8IHhoci5zdGF0dXMgPT09IDMwNCB8fCAoeGhyLnN0YXR1cyA9PT0gMCAmJiBwcm90b2NvbCA9PT0gJ2ZpbGU6JykpIHtcclxuICAgICAgICBkYXRhVHlwZSA9IGRhdGFUeXBlIHx8IG1pbWVUb0RhdGFUeXBlKHhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJykpXHJcbiAgICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dFxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKGRhdGFUeXBlID09PSAnc2NyaXB0JykoMSwgZXZhbCkocmVzdWx0KVxyXG4gICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09ICd4bWwnKSByZXN1bHQgPSB4aHIucmVzcG9uc2VYTUxcclxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSAnanNvbicpIHJlc3VsdCA9IGJsYW5rUkUudGVzdChyZXN1bHQpID8gbnVsbCA6IEpTT04ucGFyc2UocmVzdWx0KVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgZXJyb3IgPSBlIH1cclxuXHJcbiAgICAgICAgaWYgKGVycm9yKSBhamF4RXJyb3IoZXJyb3IsICdwYXJzZXJlcnJvcicsIHhociwgc2V0dGluZ3MpXHJcbiAgICAgICAgZWxzZSBhamF4U3VjY2VzcyhyZXN1bHQsIHhociwgc2V0dGluZ3MpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDApIHtcclxuICAgICAgICAgIGFqYXhFcnJvcihudWxsLCAnZXJyb3InLCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFzeW5jID0gJ2FzeW5jJyBpbiBzZXR0aW5ncyA/IHNldHRpbmdzLmFzeW5jIDogdHJ1ZVxyXG4gIHhoci5vcGVuKHNldHRpbmdzLnR5cGUsIHNldHRpbmdzLnVybCwgYXN5bmMpXHJcblxyXG4gIGZvciAobmFtZSBpbiBzZXR0aW5ncy5oZWFkZXJzKSB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBzZXR0aW5ncy5oZWFkZXJzW25hbWVdKVxyXG5cclxuICBpZiAoYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlKSB7XHJcbiAgICB4aHIuYWJvcnQoKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAgIC8qIGlmIChzZXR0aW5ncy50aW1lb3V0ID4gMCkgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHlcclxuICAgICAgICB4aHIuYWJvcnQoKVxyXG4gICAgICAgIGFqYXhFcnJvcihudWxsLCAndGltZW91dCcsIHhociwgc2V0dGluZ3MpXHJcbiAgICB9LCBzZXR0aW5ncy50aW1lb3V0KSAqL1xyXG5cclxuICAgIC8vIGF2b2lkIHNlbmRpbmcgZW1wdHkgc3RyaW5nICgjMzE5KVxyXG4gIHhoci5zZW5kKHNldHRpbmdzLmRhdGEgPyBzZXR0aW5ncy5kYXRhIDogbnVsbClcclxuICByZXR1cm4geGhyXHJcbn1cclxuXHJcbi8vIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgYW5kIHJldHVybiBmYWxzZSBpZiBpdCB3YXMgY2FuY2VsbGVkXHJcbmZ1bmN0aW9uIHRyaWdnZXJBbmRSZXR1cm4gKGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgLy8gdG9kbzogRmlyZSBvZmYgc29tZSBldmVudHNcclxuICAgIC8vIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnROYW1lKVxyXG4gICAgLy8gJChjb250ZXh0KS50cmlnZ2VyKGV2ZW50LCBkYXRhKVxyXG4gIHJldHVybiB0cnVlIC8vISBldmVudC5kZWZhdWx0UHJldmVudGVkXHJcbn1cclxuXHJcbi8vIHRyaWdnZXIgYW4gQWpheCBcImdsb2JhbFwiIGV2ZW50XHJcbmZ1bmN0aW9uIHRyaWdnZXJHbG9iYWwgKHNldHRpbmdzLCBjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcclxuICBpZiAoc2V0dGluZ3MuZ2xvYmFsKSByZXR1cm4gdHJpZ2dlckFuZFJldHVybihjb250ZXh0IHx8IGRvY3VtZW50LCBldmVudE5hbWUsIGRhdGEpXHJcbn1cclxuXHJcbi8vIE51bWJlciBvZiBhY3RpdmUgQWpheCByZXF1ZXN0c1xyXG5hamF4LmFjdGl2ZSA9IDBcclxuXHJcbmZ1bmN0aW9uIGFqYXhTdGFydCAoc2V0dGluZ3MpIHtcclxuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmIGFqYXguYWN0aXZlKysgPT09IDApIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RhcnQnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBhamF4U3RvcCAoc2V0dGluZ3MpIHtcclxuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmICEoLS1hamF4LmFjdGl2ZSkpIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RvcCcpXHJcbn1cclxuXHJcbi8vIHRyaWdnZXJzIGFuIGV4dHJhIGdsb2JhbCBldmVudCBcImFqYXhCZWZvcmVTZW5kXCIgdGhhdCdzIGxpa2UgXCJhamF4U2VuZFwiIGJ1dCBjYW5jZWxhYmxlXHJcbmZ1bmN0aW9uIGFqYXhCZWZvcmVTZW5kICh4aHIsIHNldHRpbmdzKSB7XHJcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XHJcbiAgaWYgKHNldHRpbmdzLmJlZm9yZVNlbmQuY2FsbChjb250ZXh0LCB4aHIsIHNldHRpbmdzKSA9PT0gZmFsc2UgfHxcclxuICAgICAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEJlZm9yZVNlbmQnLCBbeGhyLCBzZXR0aW5nc10pID09PSBmYWxzZSkgeyByZXR1cm4gZmFsc2UgfVxyXG5cclxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFNlbmQnLCBbeGhyLCBzZXR0aW5nc10pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFqYXhTdWNjZXNzIChkYXRhLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XHJcbiAgdmFyIHN0YXR1cyA9ICdzdWNjZXNzJ1xyXG4gIHNldHRpbmdzLnN1Y2Nlc3MuY2FsbChjb250ZXh0LCBkYXRhLCBzdGF0dXMsIHhocilcclxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFN1Y2Nlc3MnLCBbeGhyLCBzZXR0aW5ncywgZGF0YV0pXHJcbiAgYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncylcclxufVxyXG4vLyB0eXBlOiBcInRpbWVvdXRcIiwgXCJlcnJvclwiLCBcImFib3J0XCIsIFwicGFyc2VyZXJyb3JcIlxyXG5mdW5jdGlvbiBhamF4RXJyb3IgKGVycm9yLCB0eXBlLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XHJcbiAgc2V0dGluZ3MuZXJyb3IuY2FsbChjb250ZXh0LCB4aHIsIHR5cGUsIGVycm9yKVxyXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4RXJyb3InLCBbeGhyLCBzZXR0aW5ncywgZXJyb3JdKVxyXG4gIGFqYXhDb21wbGV0ZSh0eXBlLCB4aHIsIHNldHRpbmdzKVxyXG59XHJcbi8vIHN0YXR1czogXCJzdWNjZXNzXCIsIFwibm90bW9kaWZpZWRcIiwgXCJlcnJvclwiLCBcInRpbWVvdXRcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcclxuZnVuY3Rpb24gYWpheENvbXBsZXRlIChzdGF0dXMsIHhociwgc2V0dGluZ3MpIHtcclxuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcclxuICBzZXR0aW5ncy5jb21wbGV0ZS5jYWxsKGNvbnRleHQsIHhociwgc3RhdHVzKVxyXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4Q29tcGxldGUnLCBbeGhyLCBzZXR0aW5nc10pXHJcbiAgYWpheFN0b3Aoc2V0dGluZ3MpXHJcbn1cclxuXHJcbi8vIEVtcHR5IGZ1bmN0aW9uLCB1c2VkIGFzIGRlZmF1bHQgY2FsbGJhY2tcclxuZnVuY3Rpb24gZW1wdHkgKCkge31cclxuXHJcbmFqYXguSlNPTlAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIGlmICghKCd0eXBlJyBpbiBvcHRpb25zKSkgcmV0dXJuIGFqYXgob3B0aW9ucylcclxuICB2YXIgY2FsbGJhY2tOYW1lID0gJ2pzb25wJyArICgrK2pzb25wSUQpXHJcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXHJcbiAgdmFyIGFib3J0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIHRvZG86IHJlbW92ZSBzY3JpcHRcclxuICAgICAgICAvLyAkKHNjcmlwdCkucmVtb3ZlKClcclxuICAgIGlmIChjYWxsYmFja05hbWUgaW4gd2luZG93KSB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGVtcHR5XHJcbiAgICBhamF4Q29tcGxldGUoJ2Fib3J0JywgeGhyLCBvcHRpb25zKVxyXG4gIH1cclxuICB2YXIgeGhyID0geyBhYm9ydDogYWJvcnQgfVxyXG4gIHZhciBhYm9ydFRpbWVvdXRcclxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0gfHxcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcclxuXHJcbiAgaWYgKG9wdGlvbnMuZXJyb3IpIHtcclxuICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB4aHIuYWJvcnQoKVxyXG4gICAgICBvcHRpb25zLmVycm9yKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXHJcbiAgICAgICAgICAgIC8vIHRvZG86IHJlbW92ZSBzY3JpcHRcclxuICAgICAgICAgICAgLy8gJChzY3JpcHQpLnJlbW92ZSgpXHJcbiAgICBkZWxldGUgd2luZG93W2NhbGxiYWNrTmFtZV1cclxuICAgIGFqYXhTdWNjZXNzKGRhdGEsIHhociwgb3B0aW9ucylcclxuICB9XHJcblxyXG4gIHNlcmlhbGl6ZURhdGEob3B0aW9ucylcclxuICBzY3JpcHQuc3JjID0gb3B0aW9ucy51cmwucmVwbGFjZSgvPVxcPy8sICc9JyArIGNhbGxiYWNrTmFtZSlcclxuXHJcbiAgICAvLyBVc2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgYXBwZW5kQ2hpbGQgdG8gY2lyY3VtdmVudCBhbiBJRTYgYnVnLlxyXG4gICAgLy8gVGhpcyBhcmlzZXMgd2hlbiBhIGJhc2Ugbm9kZSBpcyB1c2VkIChzZWUgalF1ZXJ5IGJ1Z3MgIzI3MDkgYW5kICM0Mzc4KS5cclxuICBoZWFkLmluc2VydEJlZm9yZShzY3JpcHQsIGhlYWQuZmlyc3RDaGlsZClcclxuXHJcbiAgaWYgKG9wdGlvbnMudGltZW91dCA+IDApIHtcclxuICAgIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB4aHIuYWJvcnQoKVxyXG4gICAgICBhamF4Q29tcGxldGUoJ3RpbWVvdXQnLCB4aHIsIG9wdGlvbnMpXHJcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQpXHJcbiAgfVxyXG5cclxuICByZXR1cm4geGhyXHJcbn1cclxuXHJcbmFqYXguc2V0dGluZ3MgPSB7XHJcbiAgICAvLyBEZWZhdWx0IHR5cGUgb2YgcmVxdWVzdFxyXG4gIHR5cGU6ICdHRVQnLFxyXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBiZWZvcmUgcmVxdWVzdFxyXG4gIGJlZm9yZVNlbmQ6IGVtcHR5LFxyXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkc1xyXG4gIHN1Y2Nlc3M6IGVtcHR5LFxyXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCB0aGUgdGhlIHNlcnZlciBkcm9wcyBlcnJvclxyXG4gIGVycm9yOiBlbXB0eSxcclxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgb24gcmVxdWVzdCBjb21wbGV0ZSAoYm90aDogZXJyb3IgYW5kIHN1Y2Nlc3MpXHJcbiAgY29tcGxldGU6IGVtcHR5LFxyXG4gICAgLy8gVGhlIGNvbnRleHQgZm9yIHRoZSBjYWxsYmFja3NcclxuICBjb250ZXh0OiBudWxsLFxyXG4gICAgLy8gV2hldGhlciB0byB0cmlnZ2VyIFwiZ2xvYmFsXCIgQWpheCBldmVudHNcclxuICBnbG9iYWw6IHRydWUsXHJcbiAgICAvLyBUcmFuc3BvcnRcclxuICB4aHI6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcclxuICB9LFxyXG4gICAgLy8gTUlNRSB0eXBlcyBtYXBwaW5nXHJcbiAgYWNjZXB0czoge1xyXG4gICAgc2NyaXB0OiAndGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcclxuICAgIGpzb246IGpzb25UeXBlLFxyXG4gICAgeG1sOiAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCcsXHJcbiAgICBodG1sOiBodG1sVHlwZSxcclxuICAgIHRleHQ6ICd0ZXh0L3BsYWluJ1xyXG4gIH0sXHJcbiAgICAvLyBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIHRvIGFub3RoZXIgZG9tYWluXHJcbiAgY3Jvc3NEb21haW46IGZhbHNlLFxyXG4gICAgLy8gRGVmYXVsdCB0aW1lb3V0XHJcbiAgdGltZW91dDogMFxyXG59XHJcblxyXG5mdW5jdGlvbiBtaW1lVG9EYXRhVHlwZSAobWltZSkge1xyXG4gIHJldHVybiBtaW1lICYmIChtaW1lID09PSBodG1sVHlwZSA/ICdodG1sJ1xyXG4gICAgICAgIDogbWltZSA9PT0ganNvblR5cGUgPyAnanNvbidcclxuICAgICAgICA6IHNjcmlwdFR5cGVSRS50ZXN0KG1pbWUpID8gJ3NjcmlwdCdcclxuICAgICAgICA6IHhtbFR5cGVSRS50ZXN0KG1pbWUpICYmICd4bWwnKSB8fCAndGV4dCdcclxufVxyXG5cclxuZnVuY3Rpb24gYXBwZW5kUXVlcnkgKHVybCwgcXVlcnkpIHtcclxuICByZXR1cm4gKHVybCArICcmJyArIHF1ZXJ5KS5yZXBsYWNlKC9bJj9dezEsMn0vLCAnPycpXHJcbn1cclxuXHJcbi8vIHNlcmlhbGl6ZSBwYXlsb2FkIGFuZCBhcHBlbmQgaXQgdG8gdGhlIFVSTCBmb3IgR0VUIHJlcXVlc3RzXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEgKG9wdGlvbnMpIHtcclxuICBpZiAodHlwZShvcHRpb25zLmRhdGEpID09PSAnb2JqZWN0Jykgb3B0aW9ucy5kYXRhID0gcGFyYW0ob3B0aW9ucy5kYXRhKVxyXG4gIGlmIChvcHRpb25zLmRhdGEgJiYgKCFvcHRpb25zLnR5cGUgfHwgb3B0aW9ucy50eXBlLnRvVXBwZXJDYXNlKCkgPT09ICdHRVQnKSkgeyBvcHRpb25zLnVybCA9IGFwcGVuZFF1ZXJ5KG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEpIH1cclxufVxyXG5cclxuYWpheC5nZXQgPSBmdW5jdGlvbiAodXJsLCBzdWNjZXNzKSB7IHJldHVybiBhamF4KHsgdXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3MgfSkgfVxyXG5cclxuYWpheC5wb3N0ID0gZnVuY3Rpb24gKHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUpIHtcclxuICBpZiAodHlwZShkYXRhKSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBzdWNjZXNzXHJcbiAgICBzdWNjZXNzID0gZGF0YVxyXG4gICAgZGF0YSA9IG51bGxcclxuICB9XHJcbiAgcmV0dXJuIGFqYXgoeyB0eXBlOiAnUE9TVCcsIHVybDogdXJsLCBkYXRhOiBkYXRhLCBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhVHlwZTogZGF0YVR5cGUgfSlcclxufVxyXG5cclxuYWpheC5nZXRKU09OID0gZnVuY3Rpb24gKHVybCwgc3VjY2Vzcykge1xyXG4gIHJldHVybiBhamF4KHsgdXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGFUeXBlOiAnanNvbicgfSlcclxufVxyXG5cclxudmFyIGVzY2FwZSA9IGVuY29kZVVSSUNvbXBvbmVudFxyXG5cclxuZnVuY3Rpb24gc2VyaWFsaXplIChwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwsIHNjb3BlKSB7XHJcbiAgdmFyIGFycmF5ID0gdHlwZShvYmopID09PSAnYXJyYXknXHJcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgdmFyIHZhbHVlID0gb2JqW2tleV1cclxuXHJcbiAgICBpZiAoc2NvcGUpIGtleSA9IHRyYWRpdGlvbmFsID8gc2NvcGUgOiBzY29wZSArICdbJyArIChhcnJheSA/ICcnIDoga2V5KSArICddJ1xyXG4gICAgICAgICAgICAvLyBoYW5kbGUgZGF0YSBpbiBzZXJpYWxpemVBcnJheSgpIGZvcm1hdFxyXG4gICAgaWYgKCFzY29wZSAmJiBhcnJheSkgcGFyYW1zLmFkZCh2YWx1ZS5uYW1lLCB2YWx1ZS52YWx1ZSlcclxuICAgICAgICAgICAgLy8gcmVjdXJzZSBpbnRvIG5lc3RlZCBvYmplY3RzXHJcbiAgICBlbHNlIGlmICh0cmFkaXRpb25hbCA/ICh0eXBlKHZhbHVlKSA9PT0gJ2FycmF5JykgOiAodHlwZSh2YWx1ZSkgPT09ICdvYmplY3QnKSkgeyBzZXJpYWxpemUocGFyYW1zLCB2YWx1ZSwgdHJhZGl0aW9uYWwsIGtleSkgfSBlbHNlIHBhcmFtcy5hZGQoa2V5LCB2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcmFtIChvYmosIHRyYWRpdGlvbmFsKSB7XHJcbiAgdmFyIHBhcmFtcyA9IFtdXHJcbiAgcGFyYW1zLmFkZCA9IGZ1bmN0aW9uIChrLCB2KSB7IHRoaXMucHVzaChlc2NhcGUoaykgKyAnPScgKyBlc2NhcGUodikpIH1cclxuICBzZXJpYWxpemUocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsKVxyXG4gIHJldHVybiBwYXJhbXMuam9pbignJicpLnJlcGxhY2UoJyUyMCcsICcrJylcclxufVxyXG5cclxuZnVuY3Rpb24gZXh0ZW5kICh0YXJnZXQpIHtcclxuICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcclxuICBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XHJcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgaWYgKHNvdXJjZVtrZXldICE9PSB1bmRlZmluZWQpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XSB9XHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gdGFyZ2V0XHJcbn1cclxuIiwiLyohXHJcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjIuMFxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICovXHJcbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcclxuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyO1xyXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuXHRcdGRlZmluZShmYWN0b3J5KTtcclxuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XHJcblx0fVxyXG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcclxuXHR9XHJcblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcclxuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XHJcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XHJcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xyXG5cdFx0XHRyZXR1cm4gYXBpO1xyXG5cdFx0fTtcclxuXHR9XHJcbn0oZnVuY3Rpb24gKCkge1xyXG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XHJcblx0XHR2YXIgaSA9IDA7XHJcblx0XHR2YXIgcmVzdWx0ID0ge307XHJcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xyXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xyXG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XHJcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFdyaXRlXHJcblxyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcclxuXHRcdFx0XHRcdHBhdGg6ICcvJ1xyXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XHJcblxyXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUobmV3IERhdGUoKSAqIDEgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXHJcblx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcclxuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblxyXG5cdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlID9cclxuXHRcdFx0XHRcdGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KSA6XHJcblx0XHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcclxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XHJcblxyXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSlcclxuXHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcclxuXHJcblx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xyXG5cdFx0XHRcdGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xyXG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xyXG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxyXG5cdFx0XHRcdFx0Ly8gLi4uXHJcblx0XHRcdFx0XHQvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXHJcblx0XHRcdFx0XHQvLyAgICAgY2hhcmFjdGVyOlxyXG5cdFx0XHRcdFx0Ly8gQ29uc3VtZSB0aGUgY2hhcmFjdGVycyBvZiB0aGUgdW5wYXJzZWQtYXR0cmlidXRlcyB1cCB0byxcclxuXHRcdFx0XHRcdC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxyXG5cdFx0XHRcdFx0Ly8gLi4uXHJcblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXS5zcGxpdCgnOycpWzBdO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFJlYWRcclxuXHJcblx0XHRcdHZhciBqYXIgPSB7fTtcclxuXHRcdFx0dmFyIGRlY29kZSA9IGZ1bmN0aW9uIChzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHMucmVwbGFjZSgvKCVbMC05QS1aXXsyfSkrL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XHJcblx0XHRcdH07XHJcblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcclxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXHJcblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblx0XHRcdHZhciBpID0gMDtcclxuXHJcblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcclxuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xyXG5cclxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XHJcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBuYW1lID0gZGVjb2RlKHBhcnRzWzBdKTtcclxuXHRcdFx0XHRcdGNvb2tpZSA9IChjb252ZXJ0ZXIucmVhZCB8fCBjb252ZXJ0ZXIpKGNvb2tpZSwgbmFtZSkgfHxcclxuXHRcdFx0XHRcdFx0ZGVjb2RlKGNvb2tpZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xyXG5cdFx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcclxuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRqYXJbbmFtZV0gPSBjb29raWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXI7XHJcblx0XHR9XHJcblxyXG5cdFx0YXBpLnNldCA9IGFwaTtcclxuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XHJcblx0XHR9O1xyXG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRcdHJldHVybiBhcGkuY2FsbCh7XHJcblx0XHRcdFx0anNvbjogdHJ1ZVxyXG5cdFx0XHR9LCBrZXkpO1xyXG5cdFx0fTtcclxuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xyXG5cdFx0XHRcdGV4cGlyZXM6IC0xXHJcblx0XHRcdH0pKTtcclxuXHRcdH07XHJcblxyXG5cdFx0YXBpLmRlZmF1bHRzID0ge307XHJcblxyXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xyXG5cclxuXHRcdHJldHVybiBhcGk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XHJcbn0pKTtcclxuIiwiLyoqXHJcbiAqIFtqcy1tZDVde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9lbW4xNzgvanMtbWQ1fVxyXG4gKlxyXG4gKiBAbmFtZXNwYWNlIG1kNVxyXG4gKiBAdmVyc2lvbiAwLjcuM1xyXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxyXG4gKiBAY29weXJpZ2h0IENoZW4sIFlpLUN5dWFuIDIwMTQtMjAxN1xyXG4gKiBAbGljZW5zZSBNSVRcclxuICovXHJcbiEgZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIHQodCkgeyBpZiAodCkgZFswXSA9IGRbMTZdID0gZFsxXSA9IGRbMl0gPSBkWzNdID0gZFs0XSA9IGRbNV0gPSBkWzZdID0gZFs3XSA9IGRbOF0gPSBkWzldID0gZFsxMF0gPSBkWzExXSA9IGRbMTJdID0gZFsxM10gPSBkWzE0XSA9IGRbMTVdID0gMCwgdGhpcy5ibG9ja3MgPSBkLCB0aGlzLmJ1ZmZlcjggPSBsO1xyXG4gICAgICAgIGVsc2UgaWYgKGEpIHsgdmFyIHIgPSBuZXcgQXJyYXlCdWZmZXIoNjgpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcjggPSBuZXcgVWludDhBcnJheShyKSwgdGhpcy5ibG9ja3MgPSBuZXcgVWludDMyQXJyYXkocikgfSBlbHNlIHRoaXMuYmxvY2tzID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xyXG4gICAgICAgIHRoaXMuaDAgPSB0aGlzLmgxID0gdGhpcy5oMiA9IHRoaXMuaDMgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMCwgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9ICExLCB0aGlzLmZpcnN0ID0gITAgfSB2YXIgciA9IFwiaW5wdXQgaXMgaW52YWxpZCB0eXBlXCIsXHJcbiAgICAgICAgZSA9IFwib2JqZWN0XCIgPT0gdHlwZW9mIHdpbmRvdyxcclxuICAgICAgICBpID0gZSA/IHdpbmRvdyA6IHt9O1xyXG4gICAgaS5KU19NRDVfTk9fV0lORE9XICYmIChlID0gITEpOyB2YXIgcyA9ICFlICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIHNlbGYsXHJcbiAgICAgICAgaCA9ICFpLkpTX01ENV9OT19OT0RFX0pTICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XHJcbiAgICBoID8gaSA9IGdsb2JhbCA6IHMgJiYgKGkgPSBzZWxmKTsgdmFyIGYgPSAhaS5KU19NRDVfTk9fQ09NTU9OX0pTICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cyxcclxuICAgICAgICBvID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCxcclxuICAgICAgICBhID0gIWkuSlNfTUQ1X05PX0FSUkFZX0JVRkZFUiAmJiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBBcnJheUJ1ZmZlcixcclxuICAgICAgICBuID0gXCIwMTIzNDU2Nzg5YWJjZGVmXCIuc3BsaXQoXCJcIiksXHJcbiAgICAgICAgdSA9IFsxMjgsIDMyNzY4LCA4Mzg4NjA4LCAtMjE0NzQ4MzY0OF0sXHJcbiAgICAgICAgeSA9IFswLCA4LCAxNiwgMjRdLFxyXG4gICAgICAgIGMgPSBbXCJoZXhcIiwgXCJhcnJheVwiLCBcImRpZ2VzdFwiLCBcImJ1ZmZlclwiLCBcImFycmF5QnVmZmVyXCIsIFwiYmFzZTY0XCJdLFxyXG4gICAgICAgIHAgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5zcGxpdChcIlwiKSxcclxuICAgICAgICBkID0gW10sXHJcbiAgICAgICAgbDsgaWYgKGEpIHsgdmFyIEEgPSBuZXcgQXJyYXlCdWZmZXIoNjgpO1xyXG4gICAgICAgIGwgPSBuZXcgVWludDhBcnJheShBKSwgZCA9IG5ldyBVaW50MzJBcnJheShBKSB9IWkuSlNfTUQ1X05PX05PREVfSlMgJiYgQXJyYXkuaXNBcnJheSB8fCAoQXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIFwiW29iamVjdCBBcnJheV1cIiA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpIH0pLCAhYSB8fCAhaS5KU19NRDVfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgJiYgQXJyYXlCdWZmZXIuaXNWaWV3IHx8IChBcnJheUJ1ZmZlci5pc1ZpZXcgPSBmdW5jdGlvbih0KSB7IHJldHVybiBcIm9iamVjdFwiID09IHR5cGVvZiB0ICYmIHQuYnVmZmVyICYmIHQuYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlciB9KTsgdmFyIGIgPSBmdW5jdGlvbihyKSB7IHJldHVybiBmdW5jdGlvbihlKSB7IHJldHVybiBuZXcgdCghMCkudXBkYXRlKGUpW3JdKCkgfSB9LFxyXG4gICAgICAgIHYgPSBmdW5jdGlvbigpIHsgdmFyIHIgPSBiKFwiaGV4XCIpO1xyXG4gICAgICAgICAgICBoICYmIChyID0gdyhyKSksIHIuY3JlYXRlID0gZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgdCB9LCByLnVwZGF0ZSA9IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHIuY3JlYXRlKCkudXBkYXRlKHQpIH07IGZvciAodmFyIGUgPSAwOyBlIDwgYy5sZW5ndGg7ICsrZSkgeyB2YXIgaSA9IGNbZV07XHJcbiAgICAgICAgICAgICAgICByW2ldID0gYihpKSB9IHJldHVybiByIH0sXHJcbiAgICAgICAgdyA9IGZ1bmN0aW9uKHQpIHsgdmFyIGUgPSBldmFsKFwicmVxdWlyZSgnY3J5cHRvJylcIiksXHJcbiAgICAgICAgICAgICAgICBpID0gZXZhbChcInJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclwiKSxcclxuICAgICAgICAgICAgICAgIHMgPSBmdW5jdGlvbihzKSB7IGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBzKSByZXR1cm4gZS5jcmVhdGVIYXNoKFwibWQ1XCIpLnVwZGF0ZShzLCBcInV0ZjhcIikuZGlnZXN0KFwiaGV4XCIpOyBpZiAobnVsbCA9PT0gcyB8fCB2b2lkIDAgPT09IHMpIHRocm93IHI7IHJldHVybiBzLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlciAmJiAocyA9IG5ldyBVaW50OEFycmF5KHMpKSwgQXJyYXkuaXNBcnJheShzKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcocykgfHwgcy5jb25zdHJ1Y3RvciA9PT0gaSA/IGUuY3JlYXRlSGFzaChcIm1kNVwiKS51cGRhdGUobmV3IGkocykpLmRpZ2VzdChcImhleFwiKSA6IHQocykgfTsgcmV0dXJuIHMgfTtcclxuICAgIHQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHQpIHsgaWYgKCF0aGlzLmZpbmFsaXplZCkgeyB2YXIgZSwgaSA9IHR5cGVvZiB0OyBpZiAoXCJzdHJpbmdcIiAhPT0gaSkgeyBpZiAoXCJvYmplY3RcIiAhPT0gaSkgdGhyb3cgcjsgaWYgKG51bGwgPT09IHQpIHRocm93IHI7IGlmIChhICYmIHQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB0ID0gbmV3IFVpbnQ4QXJyYXkodCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghKEFycmF5LmlzQXJyYXkodCkgfHwgYSAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcodCkpKSB0aHJvdyByO1xyXG4gICAgICAgICAgICAgICAgZSA9ICEwIH0gZm9yICh2YXIgcywgaCwgZiA9IDAsIG8gPSB0Lmxlbmd0aCwgbiA9IHRoaXMuYmxvY2tzLCB1ID0gdGhpcy5idWZmZXI4OyBmIDwgbzspIHsgaWYgKHRoaXMuaGFzaGVkICYmICh0aGlzLmhhc2hlZCA9ICExLCBuWzBdID0gblsxNl0sIG5bMTZdID0gblsxXSA9IG5bMl0gPSBuWzNdID0gbls0XSA9IG5bNV0gPSBuWzZdID0gbls3XSA9IG5bOF0gPSBuWzldID0gblsxMF0gPSBuWzExXSA9IG5bMTJdID0gblsxM10gPSBuWzE0XSA9IG5bMTVdID0gMCksIGUpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKSB1W2grK10gPSB0W2ZdO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpIG5baCA+PiAyXSB8PSB0W2ZdIDw8IHlbMyAmIGgrK107XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhKVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKShzID0gdC5jaGFyQ29kZUF0KGYpKSA8IDEyOCA/IHVbaCsrXSA9IHMgOiBzIDwgMjA0OCA/ICh1W2grK10gPSAxOTIgfCBzID4+IDYsIHVbaCsrXSA9IDEyOCB8IDYzICYgcykgOiBzIDwgNTUyOTYgfHwgcyA+PSA1NzM0NCA/ICh1W2grK10gPSAyMjQgfCBzID4+IDEyLCB1W2grK10gPSAxMjggfCBzID4+IDYgJiA2MywgdVtoKytdID0gMTI4IHwgNjMgJiBzKSA6IChzID0gNjU1MzYgKyAoKDEwMjMgJiBzKSA8PCAxMCB8IDEwMjMgJiB0LmNoYXJDb2RlQXQoKytmKSksIHVbaCsrXSA9IDI0MCB8IHMgPj4gMTgsIHVbaCsrXSA9IDEyOCB8IHMgPj4gMTIgJiA2MywgdVtoKytdID0gMTI4IHwgcyA+PiA2ICYgNjMsIHVbaCsrXSA9IDEyOCB8IDYzICYgcyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpKHMgPSB0LmNoYXJDb2RlQXQoZikpIDwgMTI4ID8gbltoID4+IDJdIHw9IHMgPDwgeVszICYgaCsrXSA6IHMgPCAyMDQ4ID8gKG5baCA+PiAyXSB8PSAoMTkyIHwgcyA+PiA2KSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSkgOiBzIDwgNTUyOTYgfHwgcyA+PSA1NzM0NCA/IChuW2ggPj4gMl0gfD0gKDIyNCB8IHMgPj4gMTIpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgcyA+PiA2ICYgNjMpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgNjMgJiBzKSA8PCB5WzMgJiBoKytdKSA6IChzID0gNjU1MzYgKyAoKDEwMjMgJiBzKSA8PCAxMCB8IDEwMjMgJiB0LmNoYXJDb2RlQXQoKytmKSksIG5baCA+PiAyXSB8PSAoMjQwIHwgcyA+PiAxOCkgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCBzID4+IDEyICYgNjMpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgcyA+PiA2ICYgNjMpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgNjMgJiBzKSA8PCB5WzMgJiBoKytdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGgsIHRoaXMuYnl0ZXMgKz0gaCAtIHRoaXMuc3RhcnQsIGggPj0gNjQgPyAodGhpcy5zdGFydCA9IGggLSA2NCwgdGhpcy5oYXNoKCksIHRoaXMuaGFzaGVkID0gITApIDogdGhpcy5zdGFydCA9IGggfSByZXR1cm4gdGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUgJiYgKHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDAsIHRoaXMuYnl0ZXMgPSB0aGlzLmJ5dGVzICUgNDI5NDk2NzI5NiksIHRoaXMgfSB9LCB0LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uKCkgeyBpZiAoIXRoaXMuZmluYWxpemVkKSB7IHRoaXMuZmluYWxpemVkID0gITA7IHZhciB0ID0gdGhpcy5ibG9ja3MsXHJcbiAgICAgICAgICAgICAgICByID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xyXG4gICAgICAgICAgICB0W3IgPj4gMl0gfD0gdVszICYgcl0sIHIgPj0gNTYgJiYgKHRoaXMuaGFzaGVkIHx8IHRoaXMuaGFzaCgpLCB0WzBdID0gdFsxNl0sIHRbMTZdID0gdFsxXSA9IHRbMl0gPSB0WzNdID0gdFs0XSA9IHRbNV0gPSB0WzZdID0gdFs3XSA9IHRbOF0gPSB0WzldID0gdFsxMF0gPSB0WzExXSA9IHRbMTJdID0gdFsxM10gPSB0WzE0XSA9IHRbMTVdID0gMCksIHRbMTRdID0gdGhpcy5ieXRlcyA8PCAzLCB0WzE1XSA9IHRoaXMuaEJ5dGVzIDw8IDMgfCB0aGlzLmJ5dGVzID4+PiAyOSwgdGhpcy5oYXNoKCkgfSB9LCB0LnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24oKSB7IHZhciB0LCByLCBlLCBpLCBzLCBoLCBmID0gdGhpcy5ibG9ja3M7XHJcbiAgICAgICAgdGhpcy5maXJzdCA/IHIgPSAoKHIgPSAoKHQgPSAoKHQgPSBmWzBdIC0gNjgwODc2OTM3KSA8PCA3IHwgdCA+Pj4gMjUpIC0gMjcxNzMzODc5IDw8IDApIF4gKGUgPSAoKGUgPSAoLTI3MTczMzg3OSBeIChpID0gKChpID0gKC0xNzMyNTg0MTk0IF4gMjAwNDMxODA3MSAmIHQpICsgZlsxXSAtIDExNzgzMDcwOCkgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKC0yNzE3MzM4NzkgXiB0KSkgKyBmWzJdIC0gMTEyNjQ3ODM3NSkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzNdIC0gMTMxNjI1OTIwOSkgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAgOiAodCA9IHRoaXMuaDAsIHIgPSB0aGlzLmgxLCBlID0gdGhpcy5oMiwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKChpID0gdGhpcy5oMykgXiByICYgKGUgXiBpKSkgKyBmWzBdIC0gNjgwODc2OTM2KSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzFdIC0gMzg5NTY0NTg2KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbMl0gKyA2MDYxMDU4MTkpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlszXSAtIDEwNDQ1MjUzMzApIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwKSwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKGkgXiByICYgKGUgXiBpKSkgKyBmWzRdIC0gMTc2NDE4ODk3KSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzVdICsgMTIwMDA4MDQyNikgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzZdIC0gMTQ3MzIzMTM0MSkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzddIC0gNDU3MDU5ODMpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwLCByID0gKChyICs9ICgodCA9ICgodCArPSAoaSBeIHIgJiAoZSBeIGkpKSArIGZbOF0gKyAxNzcwMDM1NDE2KSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzldIC0gMTk1ODQxNDQxNykgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzEwXSAtIDQyMDYzKSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbMTFdIC0gMTk5MDQwNDE2MikgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9IChpIF4gciAmIChlIF4gaSkpICsgZlsxMl0gKyAxODA0NjAzNjgyKSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzEzXSAtIDQwMzQxMTAxKSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbMTRdIC0gMTUwMjAwMjI5MCkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzE1XSArIDEyMzY1MzUzMjkpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzFdIC0gMTY1Nzk2NTEwKSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbNl0gLSAxMDY5NTAxNjMyKSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzExXSArIDY0MzcxNzcxMykgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZlswXSAtIDM3Mzg5NzMwMikgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbNV0gLSA3MDE1NTg2OTEpIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZlsxMF0gKyAzODAxNjA4MykgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZlsxNV0gLSA2NjA0NzgzMzUpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbNF0gLSA0MDU1Mzc4NDgpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzldICsgNTY4NDQ2NDM4KSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbMTRdIC0gMTAxOTgwMzY5MCkgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZlszXSAtIDE4NzM2Mzk2MSkgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZls4XSArIDExNjM1MzE1MDEpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzEzXSAtIDE0NDQ2ODE0NjcpIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZlsyXSAtIDUxNDAzNzg0KSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzddICsgMTczNTMyODQ3MykgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZlsxMl0gLSAxOTI2NjA3NzM0KSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZls1XSAtIDM3ODU1OCkgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZls4XSAtIDIwMjI1NzQ0NjMpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbMTFdICsgMTgzOTAzMDU2MikgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbMTRdIC0gMzUzMDk1NTYpIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbMV0gLSAxNTMwOTkyMDYwKSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzRdICsgMTI3Mjg5MzM1MykgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZls3XSAtIDE1NTQ5NzYzMikgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbMTBdIC0gMTA5NDczMDY0MCkgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZlsxM10gKyA2ODEyNzkxNzQpIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbMF0gLSAzNTg1MzcyMjIpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbM10gLSA3MjI1MjE5NzkpIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzZdICsgNzYwMjkxODkpIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbOV0gLSA2NDAzNjQ0ODcpIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbMTJdIC0gNDIxODE1ODM1KSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzE1XSArIDUzMDc0MjUyMCkgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbMl0gLSA5OTUzMzg2NTEpIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZlswXSAtIDE5ODYzMDg0NCkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZls3XSArIDExMjY4OTE0MTUpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbMTRdIC0gMTQxNjM1NDkwNSkgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbNV0gLSA1NzQzNDA1NSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZlsxMl0gKyAxNzAwNDg1NTcxKSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzNdIC0gMTg5NDk4NjYwNikgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZlsxMF0gLSAxMDUxNTIzKSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZlsxXSAtIDIwNTQ5MjI3OTkpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbOF0gKyAxODczMzEzMzU5KSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzE1XSAtIDMwNjExNzQ0KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzZdIC0gMTU2MDE5ODM4MCkgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbMTNdICsgMTMwOTE1MTY0OSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZls0XSAtIDE0NTUyMzA3MCkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZlsxMV0gLSAxMTIwMjEwMzc5KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzJdICsgNzE4Nzg3MjU5KSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZls5XSAtIDM0MzQ4NTU1MSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHRoaXMuZmlyc3QgPyAodGhpcy5oMCA9IHQgKyAxNzMyNTg0MTkzIDw8IDAsIHRoaXMuaDEgPSByIC0gMjcxNzMzODc5IDw8IDAsIHRoaXMuaDIgPSBlIC0gMTczMjU4NDE5NCA8PCAwLCB0aGlzLmgzID0gaSArIDI3MTczMzg3OCA8PCAwLCB0aGlzLmZpcnN0ID0gITEpIDogKHRoaXMuaDAgPSB0aGlzLmgwICsgdCA8PCAwLCB0aGlzLmgxID0gdGhpcy5oMSArIHIgPDwgMCwgdGhpcy5oMiA9IHRoaXMuaDIgKyBlIDw8IDAsIHRoaXMuaDMgPSB0aGlzLmgzICsgaSA8PCAwKSB9LCB0LnByb3RvdHlwZS5oZXggPSBmdW5jdGlvbigpIHsgdGhpcy5maW5hbGl6ZSgpOyB2YXIgdCA9IHRoaXMuaDAsXHJcbiAgICAgICAgICAgIHIgPSB0aGlzLmgxLFxyXG4gICAgICAgICAgICBlID0gdGhpcy5oMixcclxuICAgICAgICAgICAgaSA9IHRoaXMuaDM7IHJldHVybiBuW3QgPj4gNCAmIDE1XSArIG5bMTUgJiB0XSArIG5bdCA+PiAxMiAmIDE1XSArIG5bdCA+PiA4ICYgMTVdICsgblt0ID4+IDIwICYgMTVdICsgblt0ID4+IDE2ICYgMTVdICsgblt0ID4+IDI4ICYgMTVdICsgblt0ID4+IDI0ICYgMTVdICsgbltyID4+IDQgJiAxNV0gKyBuWzE1ICYgcl0gKyBuW3IgPj4gMTIgJiAxNV0gKyBuW3IgPj4gOCAmIDE1XSArIG5bciA+PiAyMCAmIDE1XSArIG5bciA+PiAxNiAmIDE1XSArIG5bciA+PiAyOCAmIDE1XSArIG5bciA+PiAyNCAmIDE1XSArIG5bZSA+PiA0ICYgMTVdICsgblsxNSAmIGVdICsgbltlID4+IDEyICYgMTVdICsgbltlID4+IDggJiAxNV0gKyBuW2UgPj4gMjAgJiAxNV0gKyBuW2UgPj4gMTYgJiAxNV0gKyBuW2UgPj4gMjggJiAxNV0gKyBuW2UgPj4gMjQgJiAxNV0gKyBuW2kgPj4gNCAmIDE1XSArIG5bMTUgJiBpXSArIG5baSA+PiAxMiAmIDE1XSArIG5baSA+PiA4ICYgMTVdICsgbltpID4+IDIwICYgMTVdICsgbltpID4+IDE2ICYgMTVdICsgbltpID4+IDI4ICYgMTVdICsgbltpID4+IDI0ICYgMTVdIH0sIHQucHJvdG90eXBlLnRvU3RyaW5nID0gdC5wcm90b3R5cGUuaGV4LCB0LnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbigpIHsgdGhpcy5maW5hbGl6ZSgpOyB2YXIgdCA9IHRoaXMuaDAsXHJcbiAgICAgICAgICAgIHIgPSB0aGlzLmgxLFxyXG4gICAgICAgICAgICBlID0gdGhpcy5oMixcclxuICAgICAgICAgICAgaSA9IHRoaXMuaDM7IHJldHVybiBbMjU1ICYgdCwgdCA+PiA4ICYgMjU1LCB0ID4+IDE2ICYgMjU1LCB0ID4+IDI0ICYgMjU1LCAyNTUgJiByLCByID4+IDggJiAyNTUsIHIgPj4gMTYgJiAyNTUsIHIgPj4gMjQgJiAyNTUsIDI1NSAmIGUsIGUgPj4gOCAmIDI1NSwgZSA+PiAxNiAmIDI1NSwgZSA+PiAyNCAmIDI1NSwgMjU1ICYgaSwgaSA+PiA4ICYgMjU1LCBpID4+IDE2ICYgMjU1LCBpID4+IDI0ICYgMjU1XSB9LCB0LnByb3RvdHlwZS5hcnJheSA9IHQucHJvdG90eXBlLmRpZ2VzdCwgdC5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHsgdGhpcy5maW5hbGl6ZSgpOyB2YXIgdCA9IG5ldyBBcnJheUJ1ZmZlcigxNiksXHJcbiAgICAgICAgICAgIHIgPSBuZXcgVWludDMyQXJyYXkodCk7IHJldHVybiByWzBdID0gdGhpcy5oMCwgclsxXSA9IHRoaXMuaDEsIHJbMl0gPSB0aGlzLmgyLCByWzNdID0gdGhpcy5oMywgdCB9LCB0LnByb3RvdHlwZS5idWZmZXIgPSB0LnByb3RvdHlwZS5hcnJheUJ1ZmZlciwgdC5wcm90b3R5cGUuYmFzZTY0ID0gZnVuY3Rpb24oKSB7IGZvciAodmFyIHQsIHIsIGUsIGkgPSBcIlwiLCBzID0gdGhpcy5hcnJheSgpLCBoID0gMDsgaCA8IDE1OykgdCA9IHNbaCsrXSwgciA9IHNbaCsrXSwgZSA9IHNbaCsrXSwgaSArPSBwW3QgPj4+IDJdICsgcFs2MyAmICh0IDw8IDQgfCByID4+PiA0KV0gKyBwWzYzICYgKHIgPDwgMiB8IGUgPj4+IDYpXSArIHBbNjMgJiBlXTsgcmV0dXJuIHQgPSBzW2hdLCBpICs9IHBbdCA+Pj4gMl0gKyBwW3QgPDwgNCAmIDYzXSArIFwiPT1cIiB9OyB2YXIgXyA9IHYoKTtcclxuICAgIGYgPyBtb2R1bGUuZXhwb3J0cyA9IF8gOiAoaS5tZDUgPSBfLCBvICYmIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIF8gfSkpIH0oKTsiLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG52YXIgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDJcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAncGFyZW50Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5idWZmZXJcbiAgfVxufSlcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdvZmZzZXQnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgYnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGJ1ZlxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUoYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgQnVmZmVyW1N5bWJvbC5zcGVjaWVzXSA9PT0gQnVmZmVyKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgdmFsdWU6IG51bGwsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuZnVuY3Rpb24gZnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBpZiAoaXNBcnJheUJ1ZmZlcih2YWx1ZSkgfHwgKHZhbHVlICYmIGlzQXJyYXlCdWZmZXIodmFsdWUuYnVmZmVyKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20odmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gTm90ZTogQ2hhbmdlIHByb3RvdHlwZSAqYWZ0ZXIqIEJ1ZmZlci5mcm9tIGlzIGRlZmluZWQgdG8gd29ya2Fyb3VuZCBDaHJvbWUgYnVnOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC8xNDhcbkJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbkJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG5lZ2F0aXZlJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYnVmW2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJvZmZzZXRcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcImxlbmd0aFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICB2YXIgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbilcblxuICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYnVmXG4gICAgfVxuXG4gICAgb2JqLmNvcHkoYnVmLCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcob2JqKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgbnVtYmVySXNOYU4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgQXJyYXkuaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIEFycmF5LWxpa2UgT2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBLX01BWF9MRU5HVEhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIEtfTUFYX0xFTkdUSC50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuIGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlciA9PT0gdHJ1ZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhidWYpKSB7XG4gICAgICBidWYgPSBCdWZmZXIuZnJvbShidWYpXG4gICAgfVxuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfVxuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IGlzQXJyYXlCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCAoYW5kIHRoZSBgaXMtYnVmZmVyYCBucG0gcGFja2FnZSlcbi8vIHRvIGRldGVjdCBhIEJ1ZmZlciBpbnN0YW5jZS4gSXQncyBub3QgcG9zc2libGUgdG8gdXNlIGBpbnN0YW5jZW9mIEJ1ZmZlcmBcbi8vIHJlbGlhYmx5IGluIGEgYnJvd3NlcmlmeSBjb250ZXh0IGJlY2F1c2UgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgZGlmZmVyZW50XG4vLyBjb3BpZXMgb2YgdGhlICdidWZmZXInIHBhY2thZ2UgaW4gdXNlLiBUaGlzIG1ldGhvZCB3b3JrcyBldmVuIGZvciBCdWZmZXJcbi8vIGluc3RhbmNlcyB0aGF0IHdlcmUgY3JlYXRlZCBmcm9tIGFub3RoZXIgY29weSBvZiB0aGUgYGJ1ZmZlcmAgcGFja2FnZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE1NFxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChudW1iZXJJc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChudW1iZXJJc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCA+Pj4gMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIChieXRlc1tpICsgMV0gKiAyNTYpKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzaG91bGQgYmUgYSBCdWZmZXInKVxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFVzZSBidWlsdC1pbiB3aGVuIGF2YWlsYWJsZSwgbWlzc2luZyBmcm9tIElFMTFcbiAgICB0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpXG4gIH0gZWxzZSBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKHZhciBpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmICgoZW5jb2RpbmcgPT09ICd1dGY4JyAmJiBjb2RlIDwgMTI4KSB8fFxuICAgICAgICAgIGVuY29kaW5nID09PSAnbGF0aW4xJykge1xuICAgICAgICAvLyBGYXN0IHBhdGg6IElmIGB2YWxgIGZpdHMgaW50byBhIHNpbmdsZSBieXRlLCB1c2UgdGhhdCBudW1lcmljIHZhbHVlLlxuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogbmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgXCInICsgdmFsICtcbiAgICAgICAgJ1wiIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50IFwidmFsdWVcIicpXG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teKy8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgdGFrZXMgZXF1YWwgc2lnbnMgYXMgZW5kIG9mIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgc3RyID0gc3RyLnNwbGl0KCc9JylbMF1cbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBBcnJheUJ1ZmZlcnMgZnJvbSBhbm90aGVyIGNvbnRleHQgKGkuZS4gYW4gaWZyYW1lKSBkbyBub3QgcGFzcyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrXG4vLyBidXQgdGhleSBzaG91bGQgYmUgdHJlYXRlZCBhcyB2YWxpZC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTY2XG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXJyYXlCdWZmZXInICYmXG4gICAgICB0eXBlb2Ygb2JqLmJ5dGVMZW5ndGggPT09ICdudW1iZXInKVxufVxuXG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLypcbiAqICBiYXNlNjQuanNcbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxuICogICAgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICpcbiAqICBSZWZlcmVuY2VzOlxuICogICAgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjRcbiAqL1xuOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KGdsb2JhbClcbiAgICAgICAgOiB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWRcbiAgICAgICAgPyBkZWZpbmUoZmFjdG9yeSkgOiBmYWN0b3J5KGdsb2JhbClcbn0oKFxuICAgIHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGZcbiAgICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvd1xuICAgICAgICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsXG46IHRoaXNcbiksIGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBleGlzdGluZyB2ZXJzaW9uIGZvciBub0NvbmZsaWN0KClcbiAgICB2YXIgX0Jhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgdmFyIHZlcnNpb24gPSBcIjIuNC41XCI7XG4gICAgLy8gaWYgbm9kZS5qcywgd2UgdXNlIEJ1ZmZlclxuICAgIHZhciBidWZmZXI7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge31cbiAgICB9XG4gICAgLy8gY29uc3RhbnRzXG4gICAgdmFyIGI2NGNoYXJzXG4gICAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuICAgIHZhciBiNjR0YWIgPSBmdW5jdGlvbihiaW4pIHtcbiAgICAgICAgdmFyIHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBiaW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB0W2Jpbi5jaGFyQXQoaSldID0gaTtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfShiNjRjaGFycyk7XG4gICAgdmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG4gICAgLy8gZW5jb2RlciBzdHVmZlxuICAgIHZhciBjYl91dG9iID0gZnVuY3Rpb24oYykge1xuICAgICAgICBpZiAoYy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICB2YXIgY2MgPSBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICByZXR1cm4gY2MgPCAweDgwID8gY1xuICAgICAgICAgICAgICAgIDogY2MgPCAweDgwMCA/IChmcm9tQ2hhckNvZGUoMHhjMCB8IChjYyA+Pj4gNikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoY2MgJiAweDNmKSkpXG4gICAgICAgICAgICAgICAgOiAoZnJvbUNoYXJDb2RlKDB4ZTAgfCAoKGNjID4+PiAxMikgJiAweDBmKSlcbiAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICggY2MgICAgICAgICAmIDB4M2YpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY2MgPSAweDEwMDAwXG4gICAgICAgICAgICAgICAgKyAoYy5jaGFyQ29kZUF0KDApIC0gMHhEODAwKSAqIDB4NDAwXG4gICAgICAgICAgICAgICAgKyAoYy5jaGFyQ29kZUF0KDEpIC0gMHhEQzAwKTtcbiAgICAgICAgICAgIHJldHVybiAoZnJvbUNoYXJDb2RlKDB4ZjAgfCAoKGNjID4+PiAxOCkgJiAweDA3KSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+IDEyKSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVfdXRvYiA9IC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZGXXxbXlxceDAwLVxceDdGXS9nO1xuICAgIHZhciB1dG9iID0gZnVuY3Rpb24odSkge1xuICAgICAgICByZXR1cm4gdS5yZXBsYWNlKHJlX3V0b2IsIGNiX3V0b2IpO1xuICAgIH07XG4gICAgdmFyIGNiX2VuY29kZSA9IGZ1bmN0aW9uKGNjYykge1xuICAgICAgICB2YXIgcGFkbGVuID0gWzAsIDIsIDFdW2NjYy5sZW5ndGggJSAzXSxcbiAgICAgICAgb3JkID0gY2NjLmNoYXJDb2RlQXQoMCkgPDwgMTZcbiAgICAgICAgICAgIHwgKChjY2MubGVuZ3RoID4gMSA/IGNjYy5jaGFyQ29kZUF0KDEpIDogMCkgPDwgOClcbiAgICAgICAgICAgIHwgKChjY2MubGVuZ3RoID4gMiA/IGNjYy5jaGFyQ29kZUF0KDIpIDogMCkpLFxuICAgICAgICBjaGFycyA9IFtcbiAgICAgICAgICAgIGI2NGNoYXJzLmNoYXJBdCggb3JkID4+PiAxOCksXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gMTIpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDIgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gNikgJiA2MyksXG4gICAgICAgICAgICBwYWRsZW4gPj0gMSA/ICc9JyA6IGI2NGNoYXJzLmNoYXJBdChvcmQgJiA2MylcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIGJ0b2EgPSBnbG9iYWwuYnRvYSA/IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbC5idG9hKGIpO1xuICAgIH0gOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gYnVmZmVyID9cbiAgICAgICAgYnVmZmVyLmZyb20gJiYgVWludDhBcnJheSAmJiBidWZmZXIuZnJvbSAhPT0gVWludDhBcnJheS5mcm9tXG4gICAgICAgID8gZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIHJldHVybiAodS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yID8gdSA6IGJ1ZmZlci5mcm9tKHUpKVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgfVxuICAgICAgICA6ICBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgcmV0dXJuICh1LmNvbnN0cnVjdG9yID09PSBidWZmZXIuY29uc3RydWN0b3IgPyB1IDogbmV3ICBidWZmZXIodSkpXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHUpIHsgcmV0dXJuIGJ0b2EodXRvYih1KSkgfVxuICAgIDtcbiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24odSwgdXJpc2FmZSkge1xuICAgICAgICByZXR1cm4gIXVyaXNhZmVcbiAgICAgICAgICAgID8gX2VuY29kZShTdHJpbmcodSkpXG4gICAgICAgICAgICA6IF9lbmNvZGUoU3RyaW5nKHUpKS5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbTAgPT0gJysnID8gJy0nIDogJ18nO1xuICAgICAgICAgICAgfSkucmVwbGFjZSgvPS9nLCAnJyk7XG4gICAgfTtcbiAgICB2YXIgZW5jb2RlVVJJID0gZnVuY3Rpb24odSkgeyByZXR1cm4gZW5jb2RlKHUsIHRydWUpIH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gbmV3IFJlZ0V4cChbXG4gICAgICAgICdbXFx4QzAtXFx4REZdW1xceDgwLVxceEJGXScsXG4gICAgICAgICdbXFx4RTAtXFx4RUZdW1xceDgwLVxceEJGXXsyfScsXG4gICAgICAgICdbXFx4RjAtXFx4RjddW1xceDgwLVxceEJGXXszfSdcbiAgICBdLmpvaW4oJ3wnKSwgJ2cnKTtcbiAgICB2YXIgY2JfYnRvdSA9IGZ1bmN0aW9uKGNjY2MpIHtcbiAgICAgICAgc3dpdGNoKGNjY2MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHZhciBjcCA9ICgoMHgwNyAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTgpXG4gICAgICAgICAgICAgICAgfCAgICAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpIDw8IDEyKVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDIpKSA8PCAgNilcbiAgICAgICAgICAgICAgICB8ICAgICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgzKSksXG4gICAgICAgICAgICBvZmZzZXQgPSBjcCAtIDB4MTAwMDA7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgob2Zmc2V0ICA+Pj4gMTApICsgMHhEODAwKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgob2Zmc2V0ICYgMHgzRkYpICsgMHhEQzAwKSk7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmcm9tQ2hhckNvZGUoXG4gICAgICAgICAgICAgICAgKCgweDBmICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCAxMilcbiAgICAgICAgICAgICAgICAgICAgfCAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDIpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAgZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgxZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgNilcbiAgICAgICAgICAgICAgICAgICAgfCAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgYnRvdSA9IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGIucmVwbGFjZShyZV9idG91LCBjYl9idG91KTtcbiAgICB9O1xuICAgIHZhciBjYl9kZWNvZGUgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHZhciBsZW4gPSBjY2NjLmxlbmd0aCxcbiAgICAgICAgcGFkbGVuID0gbGVuICUgNCxcbiAgICAgICAgbiA9IChsZW4gPiAwID8gYjY0dGFiW2NjY2MuY2hhckF0KDApXSA8PCAxOCA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAxID8gYjY0dGFiW2NjY2MuY2hhckF0KDEpXSA8PCAxMiA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAyID8gYjY0dGFiW2NjY2MuY2hhckF0KDIpXSA8PCAgNiA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAzID8gYjY0dGFiW2NjY2MuY2hhckF0KDMpXSAgICAgICA6IDApLFxuICAgICAgICBjaGFycyA9IFtcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSggbiA+Pj4gMTYpLFxuICAgICAgICAgICAgZnJvbUNoYXJDb2RlKChuID4+PiAgOCkgJiAweGZmKSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSggbiAgICAgICAgICYgMHhmZilcbiAgICAgICAgXTtcbiAgICAgICAgY2hhcnMubGVuZ3RoIC09IFswLCAwLCAyLCAxXVtwYWRsZW5dO1xuICAgICAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gICAgfTtcbiAgICB2YXIgYXRvYiA9IGdsb2JhbC5hdG9iID8gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmF0b2IoYSk7XG4gICAgfSA6IGZ1bmN0aW9uKGEpe1xuICAgICAgICByZXR1cm4gYS5yZXBsYWNlKC9bXFxzXFxTXXsxLDR9L2csIGNiX2RlY29kZSk7XG4gICAgfTtcbiAgICB2YXIgX2RlY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICA/IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IGJ1ZmZlci5mcm9tKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IG5ldyBidWZmZXIoYSwgJ2Jhc2U2NCcpKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gYnRvdShhdG9iKGEpKSB9O1xuICAgIHZhciBkZWNvZGUgPSBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIF9kZWNvZGUoXG4gICAgICAgICAgICBTdHJpbmcoYSkucmVwbGFjZSgvWy1fXS9nLCBmdW5jdGlvbihtMCkgeyByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nIH0pXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJylcbiAgICAgICAgKTtcbiAgICB9O1xuICAgIHZhciBub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgICAgICBnbG9iYWwuQmFzZTY0ID0gX0Jhc2U2NDtcbiAgICAgICAgcmV0dXJuIEJhc2U2NDtcbiAgICB9O1xuICAgIC8vIGV4cG9ydCBCYXNlNjRcbiAgICBnbG9iYWwuQmFzZTY0ID0ge1xuICAgICAgICBWRVJTSU9OOiB2ZXJzaW9uLFxuICAgICAgICBhdG9iOiBhdG9iLFxuICAgICAgICBidG9hOiBidG9hLFxuICAgICAgICBmcm9tQmFzZTY0OiBkZWNvZGUsXG4gICAgICAgIHRvQmFzZTY0OiBlbmNvZGUsXG4gICAgICAgIHV0b2I6IHV0b2IsXG4gICAgICAgIGVuY29kZTogZW5jb2RlLFxuICAgICAgICBlbmNvZGVVUkk6IGVuY29kZVVSSSxcbiAgICAgICAgYnRvdTogYnRvdSxcbiAgICAgICAgZGVjb2RlOiBkZWNvZGUsXG4gICAgICAgIG5vQ29uZmxpY3Q6IG5vQ29uZmxpY3RcbiAgICB9O1xuICAgIC8vIGlmIEVTNSBpcyBhdmFpbGFibGUsIG1ha2UgQmFzZTY0LmV4dGVuZFN0cmluZygpIGF2YWlsYWJsZVxuICAgIGlmICh0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBub0VudW0gPSBmdW5jdGlvbih2KXtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6dixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9O1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWwuQmFzZTY0LmV4dGVuZFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAnZnJvbUJhc2U2NCcsIG5vRW51bShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGUodGhpcylcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICh1cmlzYWZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdXJpc2FmZSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0VVJJJywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyBleHBvcnQgQmFzZTY0IHRvIHRoZSBuYW1lc3BhY2VcbiAgICAvL1xuICAgIGlmIChnbG9iYWxbJ01ldGVvciddKSB7IC8vIE1ldGVvci5qc1xuICAgICAgICBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIH1cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBhbmQgQU1EIGFyZSBtdXR1YWxseSBleGNsdXNpdmUuXG4gICAgLy8gbW9kdWxlLmV4cG9ydHMgaGFzIHByZWNlZGVuY2UuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLkJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKXsgcmV0dXJuIGdsb2JhbC5CYXNlNjQgfSk7XG4gICAgfVxuICAgIC8vIHRoYXQncyBpdCFcbiAgICByZXR1cm4ge0Jhc2U2NDogZ2xvYmFsLkJhc2U2NH1cbn0pKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCl7XHJcbiAgc3dpdGNoICh0b1N0cmluZy5jYWxsKHZhbCkpIHtcclxuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbidcclxuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnXHJcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiByZXR1cm4gJ3JlZ2V4cCdcclxuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJ1xyXG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5J1xyXG4gICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzogcmV0dXJuICdzdHJpbmcnXHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHZhbCA9PSAnb2JqZWN0JyAmJiB2YWwgJiYgdHlwZW9mIHZhbC5sZW5ndGggPT0gJ251bWJlcicpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdmFsLmNhbGxlZSA9PSAnZnVuY3Rpb24nKSByZXR1cm4gJ2FyZ3VtZW50cyc7XHJcbiAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICBpZiAoZXggaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gJ2FyZ3VtZW50cyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCdcclxuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJ1xyXG4gIGlmICh2YWwgJiYgdmFsLm5vZGVUeXBlID09PSAxKSByZXR1cm4gJ2VsZW1lbnQnXHJcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0J1xyXG5cclxuICByZXR1cm4gdHlwZW9mIHZhbFxyXG59XHJcbiJdfQ==
