(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.general = function () {
  return {
    // get real path
    getRealPath: function getRealPath(p) {
      var rPath = "";
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
    }
  };
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2dlbmVyYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixZQUFZO0FBQzNCLFNBQU87QUFDTDtBQUNBLGlCQUFhLHFCQUFDLENBQUQsRUFBTztBQUNsQixVQUFJLFFBQVEsRUFBWjtBQUNBLFVBQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixDQUE5QjtBQUN6QixVQUFJLFlBQVksT0FBaEIsRUFDRSxRQUFRLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxjQUEzQztBQUNGLFVBQUksS0FBSyxHQUFMLEtBQWEsbUJBQW1CLEdBQW5CLElBQTBCLG1CQUFtQixFQUExRCxDQUFKLEVBQW1FO0FBQ2pFLGdCQUFRLENBQVI7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJLEtBQUssR0FBVCxFQUFjO0FBQ1osa0JBQVEsTUFBTSxjQUFkO0FBQ0QsU0FGRCxNQUVPO0FBQ0w7QUFDQSxrQkFBUSxDQUFSO0FBQ0Q7QUFDRjtBQUNELFVBQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxLQUFsQztBQUN6QixhQUFPLEtBQVA7QUFDRDtBQW5CSSxHQUFQO0FBcUJELENBdEJnQixFQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIndpbmRvdy5nZW5lcmFsID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIC8vIGdldCByZWFsIHBhdGhcbiAgICBnZXRSZWFsUGF0aDogKHApID0+IHtcbiAgICAgIGxldCByUGF0aCA9IFwiXCI7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcImdldFJlYWxQYXRoOnAgXCIsIHApO1xuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDpSRUFMX1JPT1RfUEFUSCBcIiwgUkVBTF9ST09UX1BBVEgpO1xuICAgICAgaWYgKHAgPT0gXCIvXCIgJiYgKFJFQUxfUk9PVF9QQVRIID09PSBcIi9cIiB8fCBSRUFMX1JPT1RfUEFUSCA9PT0gXCJcIikpIHtcbiAgICAgICAgclBhdGggPSBwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHAgPT0gXCIvXCIpIHtcbiAgICAgICAgICByUGF0aCA9IFwiL1wiICsgUkVBTF9ST09UX1BBVEg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9yUGF0aCA9IFwiL1wiICsgUkVBTF9ST09UX19QQVRIICsgcDtcbiAgICAgICAgICByUGF0aCA9IHA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiZ2V0UmVhbFBhdGg6clBhdGggXCIsIHJQYXRoKTtcbiAgICAgIHJldHVybiByUGF0aDtcbiAgICB9XG4gIH07XG59KCk7XG4iXX0=
