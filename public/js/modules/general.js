(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRealPath = getRealPath;
exports.serializeObject = serializeObject;
function getRealPath(p) {
  var rPath = "";

  if (userData.RunMode === "DEBUG") console.log("getRealPath:p ", p);
  if (userData.RunMode === "DEBUG") console.log("getRealPath:REAL_ROOT_PATH ", userData.RealRottPath);
  if (p == "/" && (userData.RealRottPathR === "/" || userData.RealRottPath === "")) {
    rPath = p;
  } else {
    if (p == "/") {
      rPath = "/" + userData.RealRottPath;
    } else {
      //rPath = "/" + REAL_ROOT__PATH + p;
      rPath = p;
    }
  }
  if (userData.RunMode === "DEBUG") console.log("getRealPath:rPath ", rPath);
  return rPath;
}

function serializeObject(dataObject) {
  var stringResult = "",
      value = void 0;
  for (var key in dataObject) {
    if (userData.RunMode === "DEBUG") console.log(dataObject[key], key);
    value = dataObject[key];
    if (stringResult !== "") {
      stringResult += "&" + key + "=" + value;
    } else {
      stringResult += key + "=" + value;
    }
  }
  return stringResult;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2dlbmVyYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixXLEdBQUEsVztRQW1CQSxlLEdBQUEsZTtBQW5CVCxTQUFTLFdBQVQsQ0FBcUIsQ0FBckIsRUFBd0I7QUFDekIsTUFBSSxRQUFRLEVBQVo7O0FBRUEsTUFBSSxTQUFTLE9BQVQsS0FBcUIsT0FBekIsRUFBa0MsUUFBUSxHQUFSLENBQVksZ0JBQVosRUFBOEIsQ0FBOUI7QUFDbEMsTUFBSSxTQUFTLE9BQVQsS0FBcUIsT0FBekIsRUFBa0MsUUFBUSxHQUFSLENBQVksNkJBQVosRUFBMkMsU0FBUyxZQUFwRDtBQUNsQyxNQUFJLEtBQUssR0FBTCxLQUFhLFNBQVMsYUFBVCxLQUEyQixHQUEzQixJQUFrQyxTQUFTLFlBQVQsS0FBMEIsRUFBekUsQ0FBSixFQUFrRjtBQUNoRixZQUFRLENBQVI7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJLEtBQUssR0FBVCxFQUFjO0FBQ1osY0FBUSxNQUFNLFNBQVMsWUFBdkI7QUFDRCxLQUZELE1BRU87QUFDTDtBQUNBLGNBQVEsQ0FBUjtBQUNEO0FBQ0Y7QUFDRCxNQUFJLFNBQVMsT0FBVCxLQUFxQixPQUF6QixFQUFrQyxRQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxLQUFsQztBQUNsQyxTQUFPLEtBQVA7QUFDRDs7QUFFRSxTQUFTLGVBQVQsQ0FBeUIsVUFBekIsRUFBcUM7QUFDdEMsTUFBSSxlQUFlLEVBQW5CO0FBQUEsTUFDRSxRQUFRLEtBQUssQ0FEZjtBQUVBLE9BQUssSUFBSSxHQUFULElBQWdCLFVBQWhCLEVBQTRCO0FBQzFCLFFBQUksU0FBUyxPQUFULEtBQXFCLE9BQXpCLEVBQWtDLFFBQVEsR0FBUixDQUFZLFdBQVcsR0FBWCxDQUFaLEVBQTZCLEdBQTdCO0FBQ2xDLFlBQVEsV0FBVyxHQUFYLENBQVI7QUFDQSxRQUFJLGlCQUFpQixFQUFyQixFQUF5QjtBQUN2QixzQkFBZ0IsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixLQUFsQztBQUNELEtBRkQsTUFFTztBQUNMLHNCQUFnQixNQUFNLEdBQU4sR0FBWSxLQUE1QjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLFlBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBmdW5jdGlvbiBnZXRSZWFsUGF0aChwKSB7XHJcbiAgICAgIGxldCByUGF0aCA9IFwiXCI7XHJcbiAgICAgIFxyXG4gICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcImdldFJlYWxQYXRoOnAgXCIsIHApO1xyXG4gICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcImdldFJlYWxQYXRoOlJFQUxfUk9PVF9QQVRIIFwiLCB1c2VyRGF0YS5SZWFsUm90dFBhdGgpO1xyXG4gICAgICBpZiAocCA9PSBcIi9cIiAmJiAodXNlckRhdGEuUmVhbFJvdHRQYXRoUiA9PT0gXCIvXCIgfHwgdXNlckRhdGEuUmVhbFJvdHRQYXRoID09PSBcIlwiKSkge1xyXG4gICAgICAgIHJQYXRoID0gcDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgclBhdGggPSBcIi9cIiArIHVzZXJEYXRhLlJlYWxSb3R0UGF0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy9yUGF0aCA9IFwiL1wiICsgUkVBTF9ST09UX19QQVRIICsgcDtcclxuICAgICAgICAgIHJQYXRoID0gcDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDpyUGF0aCBcIiwgclBhdGgpO1xyXG4gICAgICByZXR1cm4gclBhdGg7XHJcbiAgICB9XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplT2JqZWN0KGRhdGFPYmplY3QpIHtcclxuICAgICAgdmFyIHN0cmluZ1Jlc3VsdCA9IFwiXCIsXHJcbiAgICAgICAgdmFsdWUgPSB2b2lkIDA7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhT2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZGF0YU9iamVjdFtrZXldLCBrZXkpO1xyXG4gICAgICAgIHZhbHVlID0gZGF0YU9iamVjdFtrZXldO1xyXG4gICAgICAgIGlmIChzdHJpbmdSZXN1bHQgIT09IFwiXCIpIHtcclxuICAgICAgICAgIHN0cmluZ1Jlc3VsdCArPSBcIiZcIiArIGtleSArIFwiPVwiICsgdmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN0cmluZ1Jlc3VsdCArPSBrZXkgKyBcIj1cIiArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3RyaW5nUmVzdWx0O1xyXG4gICAgfSAgIFxyXG4iXX0=
