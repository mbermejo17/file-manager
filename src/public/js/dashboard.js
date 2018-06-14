(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

    var getCookie = function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    var UserName = getCookie('UserName');
    var UserRole = getCookie('UserRole');
    var CompanyName = getCookie('CompanyName');
    var RootPath = getCookie('RootPath');
    var AccessString = getCookie('AccessString');

    var _AccessString$split = AccessString.split(','),
        _AccessString$split2 = _slicedToArray(_AccessString$split, 7),
        AllowNewFolder = _AccessString$split2[0],
        AllowRenameFolder = _AccessString$split2[1],
        AllowRenameFile = _AccessString$split2[2],
        AllowDeleteFolder = _AccessString$split2[3],
        AllowDeleteFile = _AccessString$split2[4],
        AllowUpload = _AccessString$split2[5],
        AllowDownload = _AccessString$split2[6];

    var currentPath = RootPath + '\\';

    console.log(AccessString.split(','));
    console.log('AllowNewFolder', AllowNewFolder);
    console.log('AllowDeleteFolder', AllowDeleteFolder);
    console.log('AllowDeleteFile', AllowDeleteFile);
    console.log('AllowUpload', AllowUpload);
    console.log('AllowDownload', AllowDownload);

    var logout = function logout() {
        setCookie('UserName', '', 0);
        setCookie('UserRole', '', 0);
        setCookie('sessionId', '', 0);
        setCookie('token', '', 0);
        setCookie('wssURL', '', 0);
        document.location.href = '/';
    };

    var refreshPath = function refreshPath(cPath) {
        var cPathArray = cPath.split('\\');
        var newHtmlContent = "<li><label id=\"currentpath\">Path:</label></li>";

        cPathArray.forEach(function (val, idx, array) {
            newHtmlContent += "<li><a class=\"breadcrumb\" href=\"#!\">" + val + "</a></li><li></li>";
        });
        $('#currentPath').html(newHtmlContent);
    };

    var showUserProfile = function showUserProfile() {
        var ModalTitle = 'User Profile';
        var ModalContent = "<table id=\"tableUserProfile\" class=\"striped highlight\">\n                               <tr><td>User Name:</td><td>" + UserName + "</td></tr>\n                               <tr><td>User Role:</td><td>" + UserRole + "</td></tr> \n                               <tr><td>Company Name:</td><td>" + CompanyName + "</td></tr>\n                               <tr><td colspan=\"2\" style=\"text-align:center;border-botom:1px solid #CCC\"><strong>Access</strong></td></tr>\n                               <tr><td>Allow new Folder:</td><td>" + AllowNewFolder + "</td></tr>\n                               <tr><td>Allow rename Folder:</td><td>" + AllowRenameFolder + "</td></tr>\n                               <tr><td>Allow rename File:</td><td>" + AllowRenameFile + "</td></tr>\n                               <tr><td>Allow delete Folder:</td><td>" + AllowDeleteFolder + "</td></tr>\n                               <tr><td>Allow delete File:</td><td>" + AllowDeleteFile + "</td></tr>\n                               <tr><td>Allow Upload:</td><td>" + AllowUpload + "</td></tr>\n                               <tr><td>Allow Download:</td><td>" + AllowDownload + "</td></tr>\n                            </table>";
        var htmlContent = "<div id=\"modal-header\">\n          <h5>" + ModalTitle + "</h5>\n          <a class=\"modal_close\" id=\"modalClose\" href=\"#hola\"></a>\n        </div>\n        <div class=\"modal-content\">\n          <p>" + ModalContent + "</p>\n        </div>\n        <div class=\"modal-footer\">\n            <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"ModalClose\" href=\"#!\">Close</a>\n        </div>    ";
        $('#modal').html(htmlContent);
        $('#modal').show();
    };

    AllowNewFolder === '1' ? $('#NewFolder').removeClass('disabled') : $('#NewFolder').addClass('disabled');
    if (AllowDeleteFolder === '1' && AllowDeleteFile === '1') {
        $('#delete').removeClass('disabled');
    } else {
        $('#delete').removeClass('disabled');
        $('#delete').addClass('disabled');
    }
    if (AllowRenameFolder === '1' && AllowRenameFile === '1') {
        $('#rename').removeClass('disabled');
    } else {
        $('#rename').removeClass('disabled');
        $('#rename').addClass('disabled');
    }
    AllowUpload == '1' ? $('#upload').removeClass('disabled') : $('#upload').removeClass('disabled').addClass('disabled');
    AllowDownload == '1' ? $('#download').removeClass('disabled') : $('#download').removeClass('disabled').addClass('disabled');

    UserRole == 'admin' ? $('#settings').show() : $('#settings').hide();

    $('#modaltrigger').html(UserName);
    $('#modaltrigger').leanModal({
        top: 110,
        overlay: 0.45,
        closeButton: ".hidemodal"
    });

    $('a').on('click', function (e) {
        console.log(this.id);
        console.log($(this).hasClass('disabled'));

        e.preventDefault();
        if (!$(this).hasClass('disabled')) {
            switch (this.id) {
                case 'settings':
                    break;
                case 'usertrigger':
                    $('#Usersdropdown').show();
                    break;
                case 'refresh':
                    refreshPath(currentPath);
                    break;
                case 'userLogout':
                    $('#Usersdropdown').hide();
                    $('#logoutmodal').show();
                    break;
                case 'ModalUserLogout':
                    $('#logoutmodal').hide();
                    logout();
                    break;
                case 'userChangePassword':
                    $('#Usersdropdown').hide();
                    logout();
                    break;
                case 'userProfile':
                    $('#Usersdropdown').hide();
                    showUserProfile();
                    break;
                case 'modalClose':
                case 'ModalClose':
                    $('#modal').hide();
                    break;
                case 'logoutModalClose':
                case 'cancel':
                    $('#logoutmodal').hide();
                    break;
                case 'home':
                    currentPath = RootPath + '\\';
                    refreshPath(currentPath);
                    break;
                case 'newFolder':
                    M.toast({
                        html: 'Opcion no disponible'
                    });
                    break;
                case 'delete':
                    M.toast({
                        html: 'Opcion no disponible'
                    });
                    break;
                case 'upload':
                    M.toast({
                        html: 'Opcion no disponible'
                    });
                    break;
                case 'download':
                    M.toast({
                        html: 'Opcion no disponible'
                    });
                    break;
            }
        } else {
            M.toast({
                html: 'Opcion no permitida'
            });
        }
    });

    refreshPath(currentPath);
});

},{}]},{},[1]);

//# sourceMappingURL=dashboard.js.map
