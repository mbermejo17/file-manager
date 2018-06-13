(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

$(document).ready(function () {

    var setCookie = function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + ";path='/'";
    };

    var logout = function logout() {
        setCookie('UserName', '', 0);
        setCookie('UserRole', '', 0);
        setCookie('sessionId', '', 0);
        setCookie('token', '', 0);
        setCookie('wssURL', '', 0);
        document.location.href = '/';
    };

    $('#modaltrigger').leanModal({ top: 110, overlay: 0.45, closeButton: ".hidemodal" });
    $('a').on('click', function (e) {
        console.log(this.id);
        e.preventDefault();
        switch (this.id) {
            case 'refresh':
                $('#logoutmodal').hide();
                logout();
                break;
            case 'logout':
                $('#logoutmodal').hide();
                logout();
                break;
            case 'modalClose':
            case 'cancel':
                $('#logoutmodal').hide();
                break;
            case 'home':
                M.toast({ html: 'Opcion no disponible' });
                break;
            case 'newFolder':
                M.toast({ html: 'Opcion no disponible' });
                break;
            case 'delete':
                M.toast({ html: 'Opcion no disponible' });
                break;
            case 'upload':
                M.toast({ html: 'Opcion no disponible' });
                break;
            case 'download':
                M.toast({ html: 'Opcion no disponible' });
                break;
        }
    });
});

},{}]},{},[1]);

//# sourceMappingURL=dashboard.js.map
