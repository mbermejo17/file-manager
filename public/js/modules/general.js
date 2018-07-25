(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _jsCookie = require("../vendor/js-cookie");

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRealPath = module.exports = function (p) {
  var rPath = "";
  var RUNMODE = _jsCookie2.default.get("RunMode");
  var REAL_ROOT_PATH = _jsCookie2.default.get("RootPath");

  if (RUNMODE === "DEBUG") console.log("getRealPath:p ", p);
  if (RUNMODE === "DEBUG") console.log("getRealPath:REAL_ROOT_PATH ", REAL_ROOT_PATH);
  if (p == "/" && (REAL_ROOT_PATH === "/" || REAL_ROOT_PATH === "")) {
    rPath = p;
  } else {
    if (p == "/") {
      rPath = "/" + REAL_ROOT_PATH;
    } else {
      //rPath = "/" + REAL_ROOT__PATH + p;
      rPath = p;
    }
  }
  if (RUNMODE === "DEBUG") console.log("getRealPath:rPath ", rPath);
  return rPath;
};

},{"../vendor/js-cookie":2}],2:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2dlbmVyYWwuanMiLCJqcy92ZW5kb3IvanMtY29va2llLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBR0MsSUFBSSxjQUFjLE9BQU8sT0FBUCxHQUFpQixVQUFDLENBQUQsRUFBTztBQUNyQyxNQUFJLFFBQVEsRUFBWjtBQUNBLE1BQUksVUFBVSxtQkFBUSxHQUFSLENBQVksU0FBWixDQUFkO0FBQ0EsTUFBSSxpQkFBaUIsbUJBQVEsR0FBUixDQUFZLFVBQVosQ0FBckI7O0FBRUEsTUFBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLGdCQUFaLEVBQThCLENBQTlCO0FBQ3pCLE1BQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxjQUEzQztBQUN6QixNQUFJLEtBQUssR0FBTCxLQUFhLG1CQUFtQixHQUFuQixJQUEwQixtQkFBbUIsRUFBMUQsQ0FBSixFQUFtRTtBQUNqRSxZQUFRLENBQVI7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJLEtBQUssR0FBVCxFQUFjO0FBQ1osY0FBUSxNQUFNLGNBQWQ7QUFDRCxLQUZELE1BRU87QUFDTDtBQUNBLGNBQVEsQ0FBUjtBQUNEO0FBQ0Y7QUFDRCxNQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksb0JBQVosRUFBa0MsS0FBbEM7QUFDekIsU0FBTyxLQUFQO0FBQ0QsQ0FuQko7Ozs7Ozs7QUNIRDs7Ozs7OztBQU9BLENBQUUsV0FBVSxPQUFWLEVBQW1CO0FBQ3BCLEtBQUksd0JBQUo7QUFDQSxLQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQy9DLFNBQU8sT0FBUDtBQUNBLDZCQUEyQixJQUEzQjtBQUNBO0FBQ0QsS0FBSSxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUF2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QUFDeEIsVUFBTyxJQUFJLElBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFQO0FBQ0EsR0FGRDtBQUdBLE1BQUksT0FBSixHQUFjLFVBQVUsR0FBVixFQUFlO0FBQzVCLFVBQU8sSUFBSSxJQUFKLENBQVM7QUFDZixVQUFNO0FBRFMsSUFBVCxFQUVKLEdBRkksQ0FBUDtBQUdBLEdBSkQ7QUFLQSxNQUFJLE1BQUosR0FBYSxVQUFVLEdBQVYsRUFBZSxVQUFmLEVBQTJCO0FBQ3ZDLE9BQUksR0FBSixFQUFTLEVBQVQsRUFBYSxPQUFPLFVBQVAsRUFBbUI7QUFDL0IsYUFBUyxDQUFDO0FBRHFCLElBQW5CLENBQWI7QUFHQSxHQUpEOztBQU1BLE1BQUksUUFBSixHQUFlLEVBQWY7O0FBRUEsTUFBSSxhQUFKLEdBQW9CLElBQXBCOztBQUVBLFNBQU8sR0FBUDtBQUNBOztBQUVELFFBQU8sS0FBSyxZQUFZLENBQUUsQ0FBbkIsQ0FBUDtBQUNBLENBMUpDLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ29va2llcyBmcm9tIFwiLi4vdmVuZG9yL2pzLWNvb2tpZVwiO1xyXG5cclxuXHJcbiB2YXIgZ2V0UmVhbFBhdGggPSBtb2R1bGUuZXhwb3J0cyA9IChwKSA9PiB7XHJcbiAgICAgIGxldCByUGF0aCA9IFwiXCI7XHJcbiAgICAgIGxldCBSVU5NT0RFID0gQ29va2llcy5nZXQoXCJSdW5Nb2RlXCIpO1xyXG4gICAgICBsZXQgUkVBTF9ST09UX1BBVEggPSBDb29raWVzLmdldChcIlJvb3RQYXRoXCIpO1xyXG5cclxuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDpwIFwiLCBwKTtcclxuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDpSRUFMX1JPT1RfUEFUSCBcIiwgUkVBTF9ST09UX1BBVEgpO1xyXG4gICAgICBpZiAocCA9PSBcIi9cIiAmJiAoUkVBTF9ST09UX1BBVEggPT09IFwiL1wiIHx8IFJFQUxfUk9PVF9QQVRIID09PSBcIlwiKSkge1xyXG4gICAgICAgIHJQYXRoID0gcDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgclBhdGggPSBcIi9cIiArIFJFQUxfUk9PVF9QQVRIO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3JQYXRoID0gXCIvXCIgKyBSRUFMX1JPT1RfX1BBVEggKyBwO1xyXG4gICAgICAgICAgclBhdGggPSBwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcImdldFJlYWxQYXRoOnJQYXRoIFwiLCByUGF0aCk7XHJcbiAgICAgIHJldHVybiByUGF0aDtcclxuICAgIH07XHJcbiIsIi8qIVxyXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcclxuICpcclxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcjtcclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0XHRkZWZpbmUoZmFjdG9yeSk7XHJcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XHJcblx0fVxyXG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XHJcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xyXG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xyXG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcclxuXHRcdFx0cmV0dXJuIGFwaTtcclxuXHRcdH07XHJcblx0fVxyXG59KGZ1bmN0aW9uICgpIHtcclxuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xyXG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBXcml0ZVxyXG5cclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XHJcblx0XHRcdFx0XHRwYXRoOiAnLydcclxuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkgKiAxICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxyXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xyXG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSA/XHJcblx0XHRcdFx0XHRjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cclxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxyXG5cdFx0XHRcdFx0LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XHJcblxyXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcclxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcclxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxyXG5cdFx0XHRcdFx0Ly8gICAgIGNoYXJhY3RlcjpcclxuXHRcdFx0XHRcdC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXHJcblx0XHRcdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBSZWFkXHJcblxyXG5cdFx0XHR2YXIgamFyID0ge307XHJcblx0XHRcdHZhciBkZWNvZGUgPSBmdW5jdGlvbiAocykge1xyXG5cdFx0XHRcdHJldHVybiBzLnJlcGxhY2UoLyglWzAtOUEtWl17Mn0pKy9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XHJcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxyXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cdFx0XHR2YXIgaSA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xyXG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgbmFtZSA9IGRlY29kZShwYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRjb29raWUgPSAoY29udmVydGVyLnJlYWQgfHwgY29udmVydGVyKShjb29raWUsIG5hbWUpIHx8XHJcblx0XHRcdFx0XHRcdGRlY29kZShjb29raWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0amFyW25hbWVdID0gY29va2llO1xyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFwaS5zZXQgPSBhcGk7XHJcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xyXG5cdFx0fTtcclxuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoe1xyXG5cdFx0XHRcdGpzb246IHRydWVcclxuXHRcdFx0fSwga2V5KTtcclxuXHRcdH07XHJcblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xyXG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcclxuXHRcdFx0XHRleHBpcmVzOiAtMVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xyXG5cclxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcclxuXHJcblx0XHRyZXR1cm4gYXBpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xyXG59KSk7XHJcbiJdfQ==
