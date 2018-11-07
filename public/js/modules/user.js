(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.searchUserName = searchUserName;
exports.editUser = editUser;
exports.selectRole = selectRole;
exports.showAddUserForm = showAddUserForm;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _jsBase = require("js-base64");

var _md = require("../vendor/md5.min");

var _md2 = _interopRequireDefault(_md);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _modalDialog = require("../vendor/modalDialog");

var _dataTables = require("../vendor/dataTables");

var _dataTables2 = _interopRequireDefault(_dataTables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

////////////////////////////////////
// Users manage module
///////////////////////////////////
var htmlUserFormTemplate = "\n    <div class=\"userForm-container\">\n      <form id=\"formAddUser\" class=\"userForm-content\">\n        <div class=\"userForm-row\">\n          <div class=\"userForm-title\">New User</div>\n        </div>\n        <br>\n        <div class=\"userForm-row\">\n          <div class=\"userForm-group\">\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n              <input id=\"UserName\" type=\"text\" class=\"userForm-input\">\n                <label for=\"UserName\" class=\"userForm-label\">Name</label>\n            </div>   \n             </div>\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n              <input id=\"CompanyName\" type=\"text\" class=\"userForm-input\">\n                <label for=\"CompanyName\" class=\"userForm-label\">Company Name</label>\n            </div>   \n             </div>\n          </div>\n        </div>\n        <div class=\"userForm-row\">\n         <div class=\"userForm-group\"> \n          <div class=\"userForm-field-content\">\n            <div class=\"userForm-input-container\">\n              <input id=\"UserPasswd\" type=\"password\" autocomplete=\"off\" class=\"userForm-input\">\n                <label for=\"UserPasswd\" class=\"userForm-label\">Password</label>\n            </div>    \n          </div>\n          <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n              <input id=\"repeatUserPasswd\" type=\"password\" autocomplete=\"off\" class=\"userForm-input\">\n                <label for=\"repeatUserPasswd\" class=\"userForm-label\">Repeat Password</label>\n            </div> \n          </div>\n          </div>  \n        </div>\n        <div class=\"userForm-row\">\n          <div class=\"userForm-group\">\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n              <input id=\"RootPath\" type=\"text\" class=\"userForm-input\">\n                <label for=\"RootPath\" class=\"userForm-label\">Root Path</label>\n            </div> \n             </div>\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n              <i id=\"FindPath\"></i>\n                <input class=\"datepicker userForm-input used\" id=\"ExpirateDate\" type=\"date\">\n                <label for=\"ExpirateDateInput\" class=\"userForm-label\">Expiration Date</label>\n            </div> \n             </div>\n          </div> \n        </div>\n        <div class=\"userForm-row\">\n          <div class=\"userForm-title\">Access Rights</div>\n        </div>\n        <br>\n        <div class=\"userForm-row\">            \n              <div class=\"userForm-input-field\">\n                <label class=\"userForm-select-label\">User Role</label>\n                <input id=\"Role\" type=\"hidden\" value=\"\" class=\"userForm-input\">\n                <select id=\"RoleOptions\" name=\"optionsname\" required=\"\" class=\"userForm-select\">\n                  <option value=\"opt1\">User</option>\n                  <option value=\"opt2\">Admin</option>\n                  <option value=\"opt3\">Advanced User</option>\n                  <option value=\"opt4\">Custom</option>\n                </select>\n              </div>\n            </div>\n        <br>\n        <div class=\"userForm-row\">\n          <div class=\"userForm-group\">\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container-switch\">\n                  <label class=\"switch-label\">Download</label>\n                <label class=\"switch jsSwitcher\" role=\"switch\" aria-label=\"regular switch\" aria-checked=\"false\">\n                  <input type=\"checkbox\" class=\"off-screen AccessRightsSwitch\" name=\"switcher\" aria-hidden=\"true\" />\n                  <span class=\"switch__off-text\" aria-hidden=\"true\">Deny</span>\n                  <span class=\"switch__lever\"></span>\n                  <span class=\"switch__on-text\" aria-hidden=\"true\">Allow</span>\n                </label>\n                </div>\n            </div>\n            <div class=\"userForm-field-separator\"></div>\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container-switch\">\n                  <span class=\"switch-label\">Upload</span>\n                <label class=\"switch jsSwitcher\" role=\"switch\" aria-label=\"regular switch\" aria-checked=\"false\">\n                  <input type=\"checkbox\" class=\"off-screen AccessRightsSwitch\" name=\"switcher\" aria-hidden=\"true\" />\n                  <span class=\"switch__off-text\" aria-hidden=\"true\">Deny</span>\n                  <span class=\"switch__lever\"></span>\n                  <span class=\"switch__on-text\" aria-hidden=\"true\">Allow</span>\n                </label>\n                </div>\n            </div>\n          </div>  \n        </div>\n        <div class=\"userForm-row\">\n          <div class=\"userForm-group\">\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container-switch\">\n                  <span class=\"switch-label\">Delete File</span>\n                <label class=\"switch jsSwitcher\" role=\"switch\" aria-label=\"regular switch\" aria-checked=\"false\">\n                  <input type=\"checkbox\" class=\"off-screen AccessRightsSwitch\" name=\"switcher\" aria-hidden=\"true\" />\n                  <span class=\"switch__off-text\" aria-hidden=\"true\">Deny</span>\n                  <span class=\"switch__lever\"></span>\n                  <span class=\"switch__on-text\" aria-hidden=\"true\">Allow</span>\n                </label>\n                </div>\n            </div>\n            <div class=\"userForm-field-separator\"></div>\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container-switch\">\n                  <span class=\"switch-label\">Delete Folder</span>\n                <label class=\"switch jsSwitcher\" role=\"switch\" aria-label=\"regular switch\" aria-checked=\"false\">\n                  <input type=\"checkbox\" class=\"off-screen AccessRightsSwitch\" name=\"switcher\" aria-hidden=\"true\" />\n                  <span class=\"switch__off-text\" aria-hidden=\"true\">Deny</span>\n                  <span class=\"switch__lever\"></span>\n                  <span class=\"switch__on-text\" aria-hidden=\"true\">Allow</span>\n                </label>\n                </div>\n            </div>\n          </div>  \n        </div>\n        <div class=\"userForm-row\">\n          <div class=\"userForm-group\">\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container-switch\">\n                  <span class=\"switch-label\">Add Folder</span>\n                <label class=\"switch jsSwitcher\" role=\"switch\" aria-label=\"regular switch\" aria-checked=\"false\">\n                  <input type=\"checkbox\" class=\"off-screen AccessRightsSwitch\" name=\"switcher\" aria-hidden=\"true\" />\n                  <span class=\"switch__off-text\" aria-hidden=\"true\">Deny</span>\n                  <span class=\"switch__lever\"></span>\n                  <span class=\"switch__on-text\" aria-hidden=\"true\">Allow</span>\n                </label>\n                </div>\n            </div>\n            <div class=\"userForm-field-separator\"></div>\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container-switch\">\n                  <span class=\"switch-label\">Share files</span>\n                <label class=\"switch jsSwitcher\" role=\"switch\" aria-label=\"regular switch\" aria-checked=\"false\">\n                  <input type=\"checkbox\" class=\"off-screen AccessRightsSwitch\" name=\"switcher\" aria-hidden=\"true\" />\n                  <span class=\"switch__off-text\" aria-hidden=\"true\">Deny</span>\n                  <span class=\"switch__lever\"></span>\n                  <span class=\"switch__on-text\" aria-hidden=\"true\">Allow</span>\n                </label>\n                </div>\n            </div>\n          </div>  \n        </div>\n        <br>\n        <div class=\"userForm-footer\">\n          <div class=\"userForm-group\">\n            <div class=\"userForm-field-content\">\n            </div>  \n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n                    <button class=\"waves-effect waves-teal btn-flat btn2-unify\" id=\"btn-addUserCancel\" type=\"submit\" name=\"action\">Cancel</button>\n                </div> \n             </div>\n            <div class=\"userForm-field-content\">\n                <div class=\"userForm-input-container\">\n                    <button class=\"waves-effect waves-teal btn-flat btn2-unify\" id=\"btn-addUserAcept\" type=\"submit\" name=\"action\">Accept</button>\n                </div> \n             </div>\n             <div class=\"userForm-field-content\">\n            </div> \n          </div>\n        </div>\n      </form>\n    </div>";

/* let htmlSearchUserTemplate = `<div id="searchUserModal">
                                  <div class="row"> 
                                    <div class="input-field col s12 m12"></div>
                                  </div>
                                  <div class="row" id="searchUser">
                                  <div class="input-field col s1 m1"></div>
                                    <div class="input-field col s5">
                                    <input id="searchUserName" type="text" autocomplete="off" />
                                    <label for="usersList">Search User</label></div>
                                    <div id="user-List" >
                                    </div> 
                                    <div class="input-field col s2">
                                      <i class="fa fa-search" id="btnSearchUser"></i>
                                    </div>
                                    <div class="input-field col s4 m4"></div>
                                    <div class="row"> 
                                    <div class="input-field col s9 m9"></div>
                                    <div class="input-field col s2 m2">
                                      <button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-SearchUserCancel" type="submit" name="action">Cancel</button></div>
                                    </div>
                                    <div class="input-field col s1 m1"></div>
                                    </div>
                                </div>`; */
/*let htmlSearchUserTemplate = `
<div class="userForm-container">
  <div id="users" class="userForm-content">
  <input class="search" placeholder="Search" />
  <span class="sort" data-sort="UserName">Sort by name</span>
  <span class="sort" data-sort="CompanyName">Sort by Company Name</span>
  <div class="head-list">
      <div>UserId</div> 
      <div>UserName</div>
      <div>CompanyName</div>
      <div>RootPath</div>
      <div>AccessString</div>
      <div>ExpirateDate</div>
  </div>     
  <ul id="tableList" class="list">
  </ul>
  </div>
</div>
`;*/

var htmlSearchUserTemplate = "\n<div>\n      <div class=\"head-Title\">Edit Users</div> \n      <table id=\"usersTableList\" class=\"tableList\">\n        <thead>\n          <tr>\n            <th>User Id</th>\n            <th>User Name</th>\n            <th>User Role</th>\n            <th>Company Name</th>\n            <th>Root Path</div>\n            <th data-type=\"date\" data-format=\"YYYY/MM/DD\">Expirate Date</th>\n            <th></th>\n          </tr>\n        </thead>\n        <tbody id=\"bodyList\">    \n        </tbody>\n      </table>\n      <div class=\"AddUserModalContent-footer\">\n        <div class=\"button-container\">\n            <button class=\"waves-effect waves-teal btn-flat btn2-unify\" id=\"btn-EditUserCancel\" type=\"submit\" name=\"action\">Close</button>\n        </div> \n      </div>\n</div>\n";

var checkAccessRights = function checkAccessRights(aSwitch, role, accessRights) {
    var opt = "";
    //let aAccessRights = split(accessRights, ",");

    if (role !== "Custom") {
        switch (role.toUpperCase()) {
            case "USER":
                opt = "opt1";
                break;
            case "ADMIN":
                opt = "opt2";
                break;
            case "ADVANCED USER":
                opt = "opt3";
                break;
        }
        changeAccessRights(aSwitch, opt);
    } else {
        aSwitch[0].checked = accessRights.download;
        aSwitch[1].checked = accessRights.upload;
        aSwitch[2].checked = accessRights.deletefile;
        aSwitch[3].checked = accessRights.deletefolder;
        aSwitch[4].checked = accessRights.addfolder;
        aSwitch[5].checked = accessRights.sharefiles;
    }
};

var changeAccessRights = function changeAccessRights(AccessSwitch, opt) {
    for (var x = 0; x < AccessSwitch.length; x++) {
        AccessSwitch[x].disabled = false;
    }
    switch (opt) {
        case "opt1":
            AccessSwitch[0].checked = true; //Download
            AccessSwitch[1].checked = true; //Upload
            AccessSwitch[2].checked = false;
            AccessSwitch[3].checked = false;
            AccessSwitch[5].checked = false;
            AccessSwitch[2].disabled = true;
            AccessSwitch[3].disabled = true;
            AccessSwitch[4].checked = true; // Add Folders
            AccessSwitch[4].disabled = true;
            AccessSwitch[5].disabled = true;
            break;
        case "opt2":
            AccessSwitch[0].checked = true;
            AccessSwitch[1].checked = true;
            AccessSwitch[2].checked = true;
            AccessSwitch[3].checked = true;
            AccessSwitch[4].checked = true;
            AccessSwitch[5].checked = true;
            break;
        case "opt3":
            AccessSwitch[0].checked = true;
            AccessSwitch[1].checked = true;
            AccessSwitch[2].checked = false; // Delete Files
            AccessSwitch[2].disabled = true;
            AccessSwitch[3].checked = false; // Delete Folders
            AccessSwitch[3].disabled = true;
            AccessSwitch[4].checked = true; // Add Folders
            AccessSwitch[4].disabled = true;
            AccessSwitch[5].checked = true; // Shared Files
            AccessSwitch[5].disabled = true;
            break;
        case "opt4":
            AccessSwitch[0].checked = false;
            AccessSwitch[1].checked = false;
            AccessSwitch[2].checked = false;
            AccessSwitch[3].checked = false;
            AccessSwitch[4].checked = false;
            AccessSwitch[5].checked = false;
            break;
    }
};

var _editUser = function _editUser(userId, callback) {
    document.querySelector("#waiting").classList.add("active");
    _axios2.default.get("/user/" + userId, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.Token
        },
        timeout: 30000
    }).then(function (d) {
        document.querySelector("#waiting").classList.remove("active");
        if (userData.RunMode === "DEBUG") console.log(d.data.data);
        callback(d.data.data);
    }).catch(function (e) {
        document.querySelector("#waiting").classList.remove("active");
        showToast("Search Users", "Error al buscar usuario.<br>Err:" + e, "error");
        if (userData.RunMode === "DEBUG") console.log(e);
    });
};

var _removeUser = function _removeUser(userId, userName, callback) {
    document.querySelector("#waiting").classList.add("active");
    (0, _axios2.default)({
        url: "/user/" + userId,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.Token
        },
        timeout: 30000,
        method: 'delete',
        data: {
            userName: userName
        }
    }).then(function (d) {
        document.querySelector("#waiting").classList.remove("active");
        if (userData.RunMode === "DEBUG") console.log(d);
        callback(d.data.data);
    }).catch(function (e) {
        document.querySelector("#waiting").classList.remove("active");
        showToast("Search Users", "Error al borrar usuario.<br>Err:" + e, "error");
        if (userData.RunMode === "DEBUG") console.log(e);
    });
};

function searchUserName(userName) {
    if (userData.RunMode === "DEBUG") console.log(userName);
    document.querySelector("#waiting").classList.add("active");
    _axios2.default.get('/searchuser?userName=" + userName', {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.Token
        },
        timeout: 30000
    }).then(function (d) {
        document.querySelector("#waiting").classList.remove("active");
        if (userData.RunMode === "DEBUG") console.log(d);
        if (d.data.status == "OK") {
            showAddUserForm("Edit User", d.data);
        } else {
            showToast("Search Users", d.data.message, "error");
        }
    }).catch(function (e) {
        document.querySelector("#waiting").classList.remove("active");
        showToast("Search Users", "Error al buscar usuario " + userName + ".<br>Err:" + e, "error");
        if (userData.RunMode === "DEBUG") console.log(e);
    });
}

function editUser() {
    var AddUserModalContent = document.querySelector("#AddUserModalContent");
    var containerOverlay = document.querySelector(".container-overlay");

    AddUserModalContent.innerHTML = htmlSearchUserTemplate;
    $u("#AddUserModalContent").addClass("edit");
    AddUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    document.querySelector("#waiting").classList.add("active");
    _axios2.default.get("/users", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.Token
        },
        timeout: 30000
    }).then(function (d) {
        document.querySelector("#waiting").classList.remove("active");
        if (userData.RunMode === "DEBUG") console.log(d);
        if (d.data.status === "OK") {
            var users = d.data.data;
            var i = void 0;
            var htmlListContent = "";
            var bodyList = document.querySelector("#bodyList");
            if (userData.RunMode === "DEBUG") console.log("users: ", users);
            for (i = 0; i < users.length; i++) {
                var sDate = users[i].ExpirateDate ? users[i].ExpirateDate : 'never';
                htmlListContent += "\n                  <tr class=\"data-row\">\n                    <td>" + users[i].UserId + "</td>\n                    <td>" + users[i].UserName + "</td>\n                    <td>" + users[i].UserRole + "</td>\n                    <td>" + users[i].CompanyName + "</td>\n                    <td>" + users[i].RootPath + "</td>\n                    <td>" + sDate + "</td>\n                    <td>\n                    <i id=\"" + users[i].UserId + "-id\" class=\"fas fa-user-edit edit-user-icon\" title=\"Editar Usuario\"></i>";
                if (users[i].UserRole.trim().toUpperCase() !== 'ADMIN') {
                    htmlListContent += "\n                    <i id=\"" + users[i].UserId + "-id\" class=\"fas fa-user-times del-user-icon\" title=\"Borrar Usuario\"></i></td>\n                  </tr>";
                } else {
                    htmlListContent += "&nbsp;</td></tr>";
                }
                //console.log('User Role. ',users[i].UserRole.trim().toUpperCase());
            }
            bodyList.innerHTML = htmlListContent;

            var table = new _dataTables2.default(document.querySelector("#usersTableList"), {
                searchable: true,
                fixedHeight: true,
                info: false,
                perPageSelect: null,
                perPage: 200
            });

            [].forEach.call(document.querySelectorAll(".del-user-icon"), function (el) {
                el.addEventListener("click", function (e) {
                    var userId = e.target.id.slice(0, -3);
                    var userName = e.target.parentNode.parentNode.children[1].innerHTML;
                    userName = userName.charAt(0).toUpperCase() + userName.slice(1);
                    console.log("userId: ", userId);
                    _removeUser(userId, userName, function (d) {
                        showToast("Delete User", "Usuario " + userName + " borrado", "success");
                        AddUserModalContent.style.display = "none";
                        $u("#AddUserModalContent").removeClass("edit");
                        containerOverlay.style.display = "none";
                        document.getElementById("userMod").click();
                    });
                });
            });

            [].forEach.call(document.querySelectorAll(".edit-user-icon"), function (el) {
                el.addEventListener("click", function (e) {
                    var userId = e.target.id.slice(0, -3);
                    console.log("userId: ", userId);
                    _editUser(userId, function (d) {
                        document.querySelector("#AddUserModalContent").style.display = "none";
                        $u("#AddUserModalContent").removeClass("edit");
                        document.querySelector(".container-overlay").style.display = "none";
                        showAddUserForm('Edit User', d);
                    });
                });
            });

            document.querySelector("#btn-EditUserCancel").addEventListener("click", function (e) {
                e.preventDefault();
                AddUserModalContent.style.display = "none";
                $u("#AddUserModalContent").removeClass("edit");
                containerOverlay.style.display = "none";
            });
        } else {
            showToast("Users", d.data.data.message, "error");
        }
    }).catch(function (e) {
        document.querySelector("#waiting").classList.remove("active");
        if (userData.RunMode === "DEBUG") console.log(e);
        showToast("Users", e, "error");
    });
}

function selectRole(element, role) {
    if (userData.RunMode === "DEBUG") console.log(role);
    for (var x = 0; x < element.options.length; x++) {
        if (userData.RunMode === "DEBUG") console.log("option: ", element.options[x].text);
        if (element.options[x].text.toUpperCase() === role.toUpperCase()) {
            element.options[x].selected = "selected";
            element.selectedIndex = x;
            if (userData.RunMode === "DEBUG") console.log("option selected: ", element.options[x].text);
            if (role.toUpperCase() !== "CUSTOM") {
                changeAccessRights(document.querySelectorAll(".AccessRightsSwitch"), element.options[x].value);
            }
            break;
        }
    }
}

function showAddUserForm(title, data) {
    var AddUserModalContent = document.querySelector("#AddUserModalContent");
    var containerOverlay = document.querySelector(".container-overlay");

    var mode = data ? "edit" : "add";
    var oldData = null;

    AddUserModalContent.innerHTML = htmlUserFormTemplate;
    document.querySelector("#AddUserModalContent").classList.remove("edit");
    document.querySelector("#AddUserModalContent").classList.add("show");
    if (data) {
        if (userData.RunMode === "DEBUG") console.log('showAddUserForm: ', data);
        oldData = _extends({}, data);
        document.querySelector(".userForm-title").innerHTML = title;
        document.querySelector("#UserName").value = data.UserName;
        document.querySelector("#CompanyName").value = data.CompanyName;
        document.querySelector("#UserPasswd").value = _jsBase.Base64.decode(data.UserPasswd);
        document.querySelector("#repeatUserPasswd").value = data.UserPasswd;
        document.querySelector("#RootPath").value = data.RootPath;
        document.querySelector("#ExpirateDate").value = data.ExpirateDate;
        //document.querySelector("#expirationDate")
        selectRole(document.querySelector("#RoleOptions"), data.UserRole);
        var aSwitch = document.querySelectorAll(".AccessRightsSwitch");
        if (data.UserRole.toUpperCase() === "CUSTOM") {
            checkAccessRights(aSwitch, data.UserRole, JSON.parse(data.AccessString));
        }

        document.querySelector("#UserName").classList.add("used");
        document.querySelector("#CompanyName").classList.add("used");
        document.querySelector("#UserPasswd").classList.add("used");
        document.querySelector("#repeatUserPasswd").classList.add("used");
        document.querySelector("#RootPath").classList.add("used");
        document.querySelector("#UserName").disabled = true;
        containerOverlay.style.display = "block";
        AddUserModalContent.style.display = "block";

        document.querySelector("#btn-addUserCancel").addEventListener("click", function (e) {
            e.preventDefault();
            //containerOverlay.style.display = "none";
            AddUserModalContent.style.display = "none";
            $u("#AddUserModalContent").removeClass("show");
            containerOverlay.style.display = "none";
        });

        document.querySelector("#btn-addUserAcept").addEventListener("click", function (e) {
            e.preventDefault();
            console.log('=================> oldData:', oldData);
            _updateUser(oldData);
        });
    } else {
        document.querySelector("#UserName").classList.remove("used");
        document.querySelector("#CompanyName").classList.remove("used");
        document.querySelector("#UserPasswd").classList.remove("used");
        document.querySelector("#repeatUserPasswd").classList.remove("used");
        document.querySelector("#RootPath").classList.remove("used");
        containerOverlay.style.display = "block";
        AddUserModalContent.style.display = "block";
        changeAccessRights(document.querySelectorAll(".AccessRightsSwitch"), "opt1");
        document.querySelector("#btn-addUserCancel").addEventListener("click", function (e) {
            e.preventDefault();
            containerOverlay.style.display = "none";
            $u("#AddUserModalContent").removeClass("show");
            AddUserModalContent.style.display = "none";
        });
        document.querySelector("#btn-addUserAcept").addEventListener("click", function (e) {
            e.preventDefault();
            _addUser();
        });
    }

    [].forEach.call(document.querySelectorAll(".userForm-input"), function (el) {
        el.addEventListener("blur", function (e) {
            if (e.target.value && e.target.id !== 'ExpirateDate') document.querySelector("#" + e.target.id).classList.add("used");else document.querySelector("#" + e.target.id).classList.remove("used");
        });
    });

    var sel = document.querySelector("select");

    $(".AccessRightsSwitch").change(function () {
        if ($(this).is(":checked")) {
            if (userData.RunMode === "DEBUG") console.log("Is checked");
        } else {
            if (userData.RunMode === "DEBUG") console.log("Is Not checked");
        }
    });

    sel.addEventListener("change", function (e) {
        var opt = e.target[e.target.selectedIndex].value;
        var AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
        changeAccessRights(AccessSwitch, opt);
    });

    var _getUserRole = function _getUserRole() {
        return sel.options[sel.selectedIndex].text;
    };

    var _getChanges = function _getChanges() {
        var AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
        var accessString = _getAccessString(AccessSwitch);
        var userRole = _getUserRole();
        var queryString = {};
        if (userData.RunMode === "DEBUG") console.log(oldData);
        for (var prop in oldData) {
            if (hasOwnProperty.call(oldData, prop)) {
                console.log(prop);
                if (prop === "UserRole") {
                    if (oldData[prop].toUpperCase() !== userRole.toUpperCase()) {
                        queryString.UserRole = userRole;
                        console.warn(oldData[prop], userRole);
                    } else {
                        console.log(oldData[prop], userRole);
                    }
                } else {
                    if (prop === "AccessString") {
                        console.log('old accessString: ', oldData[prop]);
                        console.log('new accessString: ', decodeURI(accessString));
                        if (oldData[prop] !== decodeURI(accessString)) {
                            console.warn(oldData[prop], accessString);
                            queryString.AccessString = accessString;
                        } else {
                            console.log(oldData[prop], accessString);
                        }
                    } else {
                        if (prop === "ExpirateDate") {
                            if (oldData[prop] === null) oldData[prop] = "";
                            if (oldData[prop] !== document.getElementById(prop).value) {
                                queryString.ExpirateDate = document.getElementById(prop).value;
                                queryString.UnixDate = (0, _moment2.default)(queryString.ExpirateDate).unix();
                                console.warn(oldData[prop], document.getElementById(prop).value);
                            } else {
                                console.log(oldData[prop], document.getElementById(prop).value);
                            }
                        } else {
                            if (prop !== "UserId" && prop !== 'MaxFileSize') {
                                if (prop === "UserPasswd") {
                                    var oPasswd = _jsBase.Base64.decode(oldData[prop]);
                                    var nPasswd = document.getElementById(prop).value;
                                    console.log('Old Pass: ', oPasswd);
                                    console.log('New Pass: ', nPasswd);
                                    if (oPasswd !== nPasswd) {
                                        queryString[prop] = (0, _md2.default)(document.getElementById(prop).value);
                                    }
                                } else {
                                    console.log('prop: ', prop);
                                    if (oldData[prop].toUpperCase() !== document.getElementById(prop).value.toUpperCase()) {
                                        queryString[prop] = document.getElementById(prop).value;
                                        console.warn(oldData[prop], document.getElementById(prop).value);
                                    } else {
                                        console.log(oldData[prop], document.getElementById(prop).value);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (userData.RunMode === "DEBUG") console.log(queryString);
        return queryString;
    };

    var _updateUser = function _updateUser(oData) {

        console.log("====================== oData: ", oData);

        var _goBack = function _goBack() {
            document.querySelector("#AddUserModalContent").style.display = "none";
            document.querySelector("#AddUserModalContent").classList.remove("show");
            document.querySelector(".container-overlay").style.display = "none";
            document.getElementById("userMod").click();
        };

        var queryString = _getChanges();
        if (Object.keys(queryString).length > 0) {
            var _data = {
                userName: oData.UserName,
                userId: oData.UserId,
                queryString: queryString
            };
            console.log("====================== userName: ", _data.userName);
            document.querySelector("#waiting").classList.add("active");
            _axios2.default.post("/updateuser", _data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userData.Token
                },
                timeout: 30000
            }).then(function (d) {
                document.querySelector("#waiting").classList.remove("active");
                if (userData.RunMode === "DEBUG") console.log(d);
                if (d.data.status === "OK") {
                    showToast("User", "Datos usuario " + _data.userName + " actualizados.", "success");
                    if (queryString.hasOwnProperty('RootPath')) {
                        document.getElementById("refresh").click();
                    }
                    _goBack();
                }
            }).catch(function (e) {
                document.querySelector("#waiting").classList.remove("active");
                if (userData.RunMode === "DEBUG") console.log(e);
                showToast("Error al grabar los cambios para el usuario " + _data.userName + ".<br>Err:" + e, "error");
            });
        } else {
            _goBack();
        }
    };

    var _getAccessString = function _getAccessString(AccessSwitch) {
        var accessName = ["download", "upload", "deletefile", "deletefolder", "addfolder", "sharefiles"];
        var result = "";
        var v = false;

        for (var x = 0; x < AccessSwitch.length; x++) {
            if (AccessSwitch[x].checked) {
                v = true;
            } else {
                v = false;
            }
            if (x != 0) {
                result += ',"' + accessName[x] + '":' + v;
            } else {
                result += '"' + accessName[x] + '":' + v;
            }
        }
        console.log("getAccessString: ", result);
        return encodeURI("{" + result + "}");
    };

    var _addUser = function _addUser() {
        var AccessSwitch = document.querySelectorAll(".AccessRightsSwitch");
        var userName = document.querySelector("#UserName").value;
        var companyName = document.querySelector("#CompanyName").value;
        var userPassword = document.querySelector("#UserPasswd").value;
        var userRole = sel[sel.selectedIndex].innerHTML;
        var userRootPath = document.querySelector("#RootPath").value;
        var expirateDate = document.querySelector("#ExpirateDate").value;

        if (userRootPath.trim() === "" && userRole !== "Admin") {
            showToast("New User", "Empty RootPath ", "error");
            return false;
        }

        var result = _getAccessString(AccessSwitch);

        var data = {
            userName: userName,
            userPassword: _jsBase.Base64.encode((0, _md2.default)(userPassword)),
            companyName: companyName,
            userRole: userRole,
            expirateDate: expirateDate,
            rootPath: userRootPath,
            accessRights: result,
            unixDate: (0, _moment2.default)(expirateDate).unix(),
            userEmail: userName
        };
        document.querySelector("#waiting").classList.add("active");
        _axios2.default.post("/adduser", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
        }).then(function (d) {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(d.data.status);
            if (d.data.status === "OK") {
                showToast("Usuario " + d.data.message, "success");
                document.getElementById("refresh").click();
                document.querySelector("#formAddUser").reset();
                [].forEach.call(document.querySelectorAll(".userForm-input"), function (el) {
                    if (el.id !== 'ExpirateDate') {
                        document.querySelector("#" + el.id).classList.remove("used");
                    }
                });
                changeAccessRights(document.querySelectorAll(".AccessRightsSwitch"), "opt1");
            } else {
                showToast("Usuario ", "Error al añadir usurio " + d.data.message, "error");
            }
        }).catch(function (e) {
            document.querySelector("#waiting").classList.remove("active");
            showToast("User", "Error al añadir usuario " + data.UserName + ".<br>Err:" + e, "error");
            if (userData.RunMode === "DEBUG") console.log(e);
        });
    };
}

////////////////////////////////////
// End user manage module
///////////////////////////////////

},{"../vendor/dataTables":2,"../vendor/md5.min":3,"../vendor/modalDialog":4,"axios":5,"js-base64":31,"moment":32}],2:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 *
 * Vanilla-DataTables
 * Copyright (c) 2015-2017 Karl Saunders (http://mobius.ovh)
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Version: 1.6.15
 *
 */
(function (root, factory) {
    var plugin = "DataTable";

    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
        module.exports = factory(plugin);
    } else if (typeof define === "function" && define.amd) {
        define([], factory(plugin));
    } else {
        root[plugin] = factory(plugin);
    }
})(typeof global !== 'undefined' ? global : undefined.window || undefined.global, function (plugin) {
    "use strict";

    var win = window,
        doc = document,
        body = doc.body;

    /**
     * Default configuration
     * @typ {Object}
     */
    var defaultConfig = {
        perPage: 10,
        perPageSelect: [5, 10, 15, 20, 25],

        sortable: true,
        searchable: true,
        info: true,

        // Pagination
        nextPrev: true,
        firstLast: false,
        prevText: "&lsaquo;",
        nextText: "&rsaquo;",
        firstText: "&laquo;",
        lastText: "&raquo;",
        ellipsisText: "&hellip;",
        ascText: "▴",
        descText: "▾",
        truncatePager: true,
        pagerDelta: 2,

        fixedColumns: true,
        fixedHeight: false,

        header: true,
        footer: false,

        // Customise the display text
        labels: {
            placeholder: "Search...", // The search input placeholder
            perPage: "{select} entries per page", // per-page dropdown label
            noRows: "No entries found", // Message shown when there are no search results
            info: "Showing {start} to {end} of {rows} entries" //
        },

        // Customise the layout
        layout: {
            top: "{select}{search}",
            bottom: "{info}{pager}"
        }
    };

    /**
     * Check is item is object
     * @return {Boolean}
     */
    var isObject = function isObject(val) {
        return Object.prototype.toString.call(val) === "[object Object]";
    };

    /**
     * Check is item is array
     * @return {Boolean}
     */
    var isArray = function isArray(val) {
        return Array.isArray(val);
    };

    /**
     * Check for valid JSON string
     * @param  {String}   str
     * @return {Boolean|Array|Object}
     */
    var isJson = function isJson(str) {
        var t = !1;
        try {
            t = JSON.parse(str);
        } catch (e) {
            return !1;
        }
        return !(null === t || !isArray(t) && !isObject(t)) && t;
    };

    /**
     * Merge objects (reccursive)
     * @param  {Object} r
     * @param  {Object} t
     * @return {Object}
     */
    var extend = function extend(src, props) {
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                var val = props[prop];
                if (val && isObject(val)) {
                    src[prop] = src[prop] || {};
                    extend(src[prop], val);
                } else {
                    src[prop] = val;
                }
            }
        }
        return src;
    };

    /**
     * Iterator helper
     * @param  {(Array|Object)}   arr     Any object, array or array-like collection.
     * @param  {Function}         fn      Callback
     * @param  {Object}           scope   Change the value of this
     * @return {Void}
     */
    var each = function each(arr, fn, scope) {
        var n;
        if (isObject(arr)) {
            for (n in arr) {
                if (Object.prototype.hasOwnProperty.call(arr, n)) {
                    fn.call(scope, arr[n], n);
                }
            }
        } else {
            for (n = 0; n < arr.length; n++) {
                fn.call(scope, arr[n], n);
            }
        }
    };

    /**
     * Add event listener to target
     * @param  {Object} el
     * @param  {String} e
     * @param  {Function} fn
     */
    var on = function on(el, e, fn) {
        el.addEventListener(e, fn, false);
    };

    /**
     * Create DOM element node
     * @param  {String}   a nodeName
     * @param  {Object}   b properties and attributes
     * @return {Object}
     */
    var createElement = function createElement(a, b) {
        var d = doc.createElement(a);
        if (b && "object" == (typeof b === "undefined" ? "undefined" : _typeof(b))) {
            var e;
            for (e in b) {
                if ("html" === e) {
                    d.innerHTML = b[e];
                } else {
                    d.setAttribute(e, b[e]);
                }
            }
        }
        return d;
    };

    var flush = function flush(el, ie) {
        if (el instanceof NodeList) {
            each(el, function (e) {
                flush(e, ie);
            });
        } else {
            if (ie) {
                while (el.hasChildNodes()) {
                    el.removeChild(el.firstChild);
                }
            } else {
                el.innerHTML = "";
            }
        }
    };

    /**
     * Create button helper
     * @param  {String}   c
     * @param  {Number}   p
     * @param  {String}   t
     * @return {Object}
     */
    var button = function button(c, p, t) {
        return createElement("li", {
            class: c,
            html: '<a href="#" data-page="' + p + '">' + t + "</a>"
        });
    };

    /**
     * classList shim
     * @type {Object}
     */
    var classList = {
        add: function add(s, a) {
            if (s.classList) {
                s.classList.add(a);
            } else {
                if (!classList.contains(s, a)) {
                    s.className = s.className.trim() + " " + a;
                }
            }
        },
        remove: function remove(s, a) {
            if (s.classList) {
                s.classList.remove(a);
            } else {
                if (classList.contains(s, a)) {
                    s.className = s.className.replace(new RegExp("(^|\\s)" + a.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },
        contains: function contains(s, a) {
            if (s) return s.classList ? s.classList.contains(a) : !!s.className && !!s.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"));
        }
    };

    /**
     * Bubble sort algorithm
     */
    var sortItems = function sortItems(a, b) {
        var c, d;
        if (1 === b) {
            c = 0;
            d = a.length;
        } else {
            if (b === -1) {
                c = a.length - 1;
                d = -1;
            }
        }
        for (var e = !0; e;) {
            e = !1;
            for (var f = c; f != d; f += b) {
                if (a[f + b] && a[f].value > a[f + b].value) {
                    var g = a[f],
                        h = a[f + b],
                        i = g;
                    a[f] = h;
                    a[f + b] = i;
                    e = !0;
                }
            }
        }
        return a;
    };

    /**
     * Pager truncation algorithm
     */
    var truncate = function truncate(a, b, c, d, ellipsis) {
        d = d || 2;
        var j,
            e = 2 * d,
            f = b - d,
            g = b + d,
            h = [],
            i = [];
        if (b < 4 - d + e) {
            g = 3 + e;
        } else if (b > c - (3 - d + e)) {
            f = c - (2 + e);
        }
        for (var k = 1; k <= c; k++) {
            if (1 == k || k == c || k >= f && k <= g) {
                var l = a[k - 1];
                classList.remove(l, "active");
                h.push(l);
            }
        }
        each(h, function (c) {
            var d = c.children[0].getAttribute("data-page");
            if (j) {
                var e = j.children[0].getAttribute("data-page");
                if (d - e == 2) i.push(a[e]);else if (d - e != 1) {
                    var f = createElement("li", {
                        class: "ellipsis",
                        html: '<a href="#">' + ellipsis + "</a>"
                    });
                    i.push(f);
                }
            }
            i.push(c);
            j = c;
        });

        return i;
    };

    /**
     * Parse data to HTML table
     */
    var dataToTable = function dataToTable(data) {
        var thead = false,
            tbody = false;

        data = data || this.options.data;

        if (data.headings) {
            thead = createElement("thead");
            var tr = createElement("tr");
            each(data.headings, function (col) {
                var td = createElement("th", {
                    html: col
                });
                tr.appendChild(td);
            });

            thead.appendChild(tr);
        }

        if (data.data && data.data.length) {
            tbody = createElement("tbody");
            each(data.data, function (rows) {
                if (data.headings) {
                    if (data.headings.length !== rows.length) {
                        throw new Error("The number of rows do not match the number of headings.");
                    }
                }
                var tr = createElement("tr");
                each(rows, function (value) {
                    var td = createElement("td", {
                        html: value
                    });
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        }

        if (thead) {
            if (this.table.tHead !== null) {
                this.table.removeChild(this.table.tHead);
            }
            this.table.appendChild(thead);
        }

        if (tbody) {
            if (this.table.tBodies.length) {
                this.table.removeChild(this.table.tBodies[0]);
            }
            this.table.appendChild(tbody);
        }
    };

    /**
     * Use moment.js to parse cell contents for sorting
     * @param  {String} content     The datetime string to parse
     * @param  {String} format      The format for moment to use
     * @return {String|Boolean}     Datatime string or false
     */
    var parseDate = function parseDate(content, format) {
        var date = false;

        // moment() throws a fit if the string isn't a valid datetime string
        // so we need to supply the format to the constructor (https://momentjs.com/docs/#/parsing/string-format/)

        // Converting to YYYYMMDD ensures we can accurately sort the column numerically

        if (format) {
            switch (format) {
                case "ISO_8601":
                    date = moment(content, moment.ISO_8601).format("YYYYMMDD");
                    break;
                case "RFC_2822":
                    date = moment(content, "ddd, MM MMM YYYY HH:mm:ss ZZ").format("YYYYMMDD");
                    break;
                case "MYSQL":
                    date = moment(content, "YYYY-MM-DD hh:mm:ss").format("YYYYMMDD");
                    break;
                case "UNIX":
                    date = moment(content).unix();
                    break;
                // User defined format using the data-format attribute or columns[n].format option
                default:
                    date = moment(content, format).format("YYYYMMDD");
                    break;
            }
        }

        return date;
    };

    /**
     * Columns API
     * @param {Object} instance DataTable instance
     * @param {Mixed} columns  Column index or array of column indexes
     */
    var Columns = function Columns(dt) {
        this.dt = dt;
        return this;
    };

    /**
     * Swap two columns
     * @return {Void}
     */
    Columns.prototype.swap = function (columns) {
        if (columns.length && columns.length === 2) {
            var cols = [];

            // Get the current column indexes
            each(this.dt.headings, function (h, i) {
                cols.push(i);
            });

            var x = columns[0];
            var y = columns[1];
            var b = cols[y];
            cols[y] = cols[x];
            cols[x] = b;

            this.order(cols);
        }
    };

    /**
     * Reorder the columns
     * @return {Array} columns  Array of ordered column indexes
     */
    Columns.prototype.order = function (columns) {

        var a,
            b,
            c,
            d,
            h,
            s,
            cell,
            temp = [[], [], [], []],
            dt = this.dt;

        // Order the headings
        each(columns, function (column, x) {
            h = dt.headings[column];
            s = h.getAttribute("data-sortable") !== "false";
            a = h.cloneNode(true);
            a.originalCellIndex = x;
            a.sortable = s;

            temp[0].push(a);

            if (dt.hiddenColumns.indexOf(column) < 0) {
                b = h.cloneNode(true);
                b.originalCellIndex = x;
                b.sortable = s;

                temp[1].push(b);
            }
        });

        // Order the row cells
        each(dt.data, function (row, i) {
            c = row.cloneNode();
            d = row.cloneNode();

            c.dataIndex = d.dataIndex = i;

            if (row.searchIndex !== null && row.searchIndex !== undefined) {
                c.searchIndex = d.searchIndex = row.searchIndex;
            }

            // Append the cell to the fragment in the correct order
            each(columns, function (column, x) {
                cell = row.cells[column].cloneNode(true);
                cell.data = row.cells[column].data;
                c.appendChild(cell);

                if (dt.hiddenColumns.indexOf(column) < 0) {
                    cell = row.cells[column].cloneNode(true);
                    cell.data = row.cells[column].data;
                    d.appendChild(cell);
                }
            });

            temp[2].push(c);
            temp[3].push(d);
        });

        dt.headings = temp[0];
        dt.activeHeadings = temp[1];

        dt.data = temp[2];
        dt.activeRows = temp[3];

        // Update
        dt.update();
    };

    /**
     * Hide columns
     * @return {Void}
     */
    Columns.prototype.hide = function (columns) {
        if (columns.length) {
            var dt = this.dt;

            each(columns, function (column) {
                if (dt.hiddenColumns.indexOf(column) < 0) {
                    dt.hiddenColumns.push(column);
                }
            });

            this.rebuild();
        }
    };

    /**
     * Show columns
     * @return {Void}
     */
    Columns.prototype.show = function (columns) {
        if (columns.length) {
            var index,
                dt = this.dt;

            each(columns, function (column) {
                index = dt.hiddenColumns.indexOf(column);
                if (index > -1) {
                    dt.hiddenColumns.splice(index, 1);
                }
            });

            this.rebuild();
        }
    };

    /**
     * Check column(s) visibility
     * @return {Boolean}
     */
    Columns.prototype.visible = function (columns) {
        var cols,
            dt = this.dt;

        columns = columns || dt.headings.map(function (th) {
            return th.originalCellIndex;
        });

        if (!isNaN(columns)) {
            cols = dt.hiddenColumns.indexOf(columns) < 0;
        } else if (isArray(columns)) {
            cols = [];
            each(columns, function (column) {
                cols.push(dt.hiddenColumns.indexOf(column) < 0);
            });
        }

        return cols;
    };

    /**
     * Add a new column
     * @param {Object} data
     */
    Columns.prototype.add = function (data) {
        var that = this,
            td,
            th = document.createElement("th");

        if (!this.dt.headings.length) {
            this.dt.insert({
                headings: [data.heading],
                data: data.data.map(function (i) {
                    return [i];
                })
            });
            this.rebuild();
            return;
        }

        if (!this.dt.hiddenHeader) {
            if (data.heading.nodeName) {
                th.appendChild(data.heading);
            } else {
                th.innerHTML = data.heading;
            }
        } else {
            th.innerHTML = "";
        }

        this.dt.headings.push(th);

        each(this.dt.data, function (row, i) {
            if (data.data[i]) {
                td = document.createElement("td");

                if (data.data[i].nodeName) {
                    td.appendChild(data.data[i]);
                } else {
                    td.innerHTML = data.data[i];
                }

                td.data = td.innerHTML;

                if (data.render) {
                    td.innerHTML = data.render.call(that, td.data, td, row);
                }

                row.appendChild(td);
            }
        });

        if (data.type) {
            th.setAttribute("data-type", data.type);
        }
        if (data.format) {
            th.setAttribute("data-format", data.format);
        }

        if (data.hasOwnProperty("sortable")) {
            th.sortable = data.sortable;
            th.setAttribute("data-sortable", data.sortable === true ? "true" : "false");
        }

        this.rebuild();

        this.dt.renderHeader();
    };

    /**
     * Remove column(s)
     * @param  {Array|Number} select
     * @return {Void}
     */
    Columns.prototype.remove = function (select) {
        if (isArray(select)) {
            // Remove in reverse otherwise the indexes will be incorrect
            select.sort(function (a, b) {
                return b - a;
            });

            each(select, function (column) {
                this.remove(column);
            }, this);
        } else {
            this.dt.headings.splice(select, 1);

            each(this.dt.data, function (row) {
                row.removeChild(row.cells[select]);
            });
        }

        this.rebuild();
    };

    /**
     * Sort by column
     * @param  {int} column - The column no.
     * @param  {string} direction - asc or desc
     * @return {void}
     */
    Columns.prototype.sort = function (column, direction, init) {

        var dt = this.dt;

        // Check column is present
        if (dt.hasHeadings && (column < 1 || column > dt.activeHeadings.length)) {
            return false;
        }

        dt.sorting = true;

        // Convert to zero-indexed
        column = column - 1;

        var dir,
            rows = dt.data,
            alpha = [],
            numeric = [],
            a = 0,
            n = 0,
            th = dt.activeHeadings[column];

        column = th.originalCellIndex;

        each(rows, function (tr) {
            var cell = tr.cells[column];
            var content = cell.hasAttribute('data-content') ? cell.getAttribute('data-content') : cell.data;
            var num = content.replace(/(\$|\,|\s|%)/g, "");

            // Check for date format and moment.js
            if (th.getAttribute("data-type") === "date" && win.moment) {
                var format = false,
                    formatted = th.hasAttribute("data-format");

                if (formatted) {
                    format = th.getAttribute("data-format");
                }

                num = parseDate(content, format);
            }

            if (parseFloat(num) == num) {
                numeric[n++] = {
                    value: Number(num),
                    row: tr
                };
            } else {
                alpha[a++] = {
                    value: content,
                    row: tr
                };
            }
        });

        /* Sort according to direction (ascending or descending) */
        var top, btm;
        if (classList.contains(th, "asc") || direction == "asc") {
            top = sortItems(alpha, -1);
            btm = sortItems(numeric, -1);
            dir = "descending";
            classList.remove(th, "asc");
            classList.add(th, "desc");
        } else {
            top = sortItems(numeric, 1);
            btm = sortItems(alpha, 1);
            dir = "ascending";
            classList.remove(th, "desc");
            classList.add(th, "asc");
        }

        /* Clear asc/desc class names from the last sorted column's th if it isn't the same as the one that was just clicked */
        if (dt.lastTh && th != dt.lastTh) {
            classList.remove(dt.lastTh, "desc");
            classList.remove(dt.lastTh, "asc");
        }

        dt.lastTh = th;

        /* Reorder the table */
        rows = top.concat(btm);

        dt.data = [];
        var indexes = [];

        each(rows, function (v, i) {
            dt.data.push(v.row);

            if (v.row.searchIndex !== null && v.row.searchIndex !== undefined) {
                indexes.push(i);
            }
        }, dt);

        dt.searchData = indexes;

        this.rebuild();

        dt.update();

        if (!init) {
            dt.emit("datatable.sort", column, dir);
        }
    };

    /**
     * Rebuild the columns
     * @return {Void}
     */
    Columns.prototype.rebuild = function () {
        var a,
            b,
            c,
            d,
            dt = this.dt,
            temp = [];

        dt.activeRows = [];
        dt.activeHeadings = [];

        each(dt.headings, function (th, i) {
            th.originalCellIndex = i;
            th.sortable = th.getAttribute("data-sortable") !== "false";
            if (dt.hiddenColumns.indexOf(i) < 0) {
                dt.activeHeadings.push(th);
            }
        }, this);

        // Loop over the rows and reorder the cells
        each(dt.data, function (row, i) {
            a = row.cloneNode();
            b = row.cloneNode();

            a.dataIndex = b.dataIndex = i;

            if (row.searchIndex !== null && row.searchIndex !== undefined) {
                a.searchIndex = b.searchIndex = row.searchIndex;
            }

            // Append the cell to the fragment in the correct order
            each(row.cells, function (cell) {
                c = cell.cloneNode(true);
                c.data = cell.data;
                a.appendChild(c);

                if (dt.hiddenColumns.indexOf(cell.cellIndex) < 0) {
                    d = cell.cloneNode(true);
                    d.data = cell.data;
                    b.appendChild(d);
                }
            });

            // Append the fragment with the ordered cells
            temp.push(a);
            dt.activeRows.push(b);
        });

        dt.data = temp;

        dt.update();
    };

    /**
     * Rows API
     * @param {Object} instance DataTable instance
     * @param {Array} rows
     */
    var Rows = function Rows(dt, rows) {
        this.dt = dt;
        this.rows = rows;

        return this;
    };

    /**
     * Build a new row
     * @param  {Array} row
     * @return {HTMLElement}
     */
    Rows.prototype.build = function (row) {
        var td,
            tr = createElement("tr");

        var headings = this.dt.headings;

        if (!headings.length) {
            headings = row.map(function () {
                return "";
            });
        }

        each(headings, function (h, i) {
            td = createElement("td");

            // Fixes #29
            if (!row[i] && !row[i].length) {
                row[i] = "";
            }

            td.innerHTML = row[i];

            td.data = row[i];

            tr.appendChild(td);
        });

        return tr;
    };

    Rows.prototype.render = function (row) {
        return row;
    };

    /**
     * Add new row
     * @param {Array} select
     */
    Rows.prototype.add = function (data) {

        if (isArray(data)) {
            var dt = this.dt;
            // Check for multiple rows
            if (isArray(data[0])) {
                each(data, function (row, i) {
                    dt.data.push(this.build(row));
                }, this);
            } else {
                dt.data.push(this.build(data));
            }

            // We may have added data to an empty table
            if (dt.data.length) {
                dt.hasRows = true;
            }

            this.update();

            dt.columns().rebuild();
        }
    };

    /**
     * Remove row(s)
     * @param  {Array|Number} select
     * @return {Void}
     */
    Rows.prototype.remove = function (select) {

        var dt = this.dt;

        if (isArray(select)) {
            // Remove in reverse otherwise the indexes will be incorrect
            select.sort(function (a, b) {
                return b - a;
            });

            each(select, function (row, i) {
                dt.data.splice(row, 1);
            });
        } else {
            dt.data.splice(select, 1);
        }

        this.update();
        dt.columns().rebuild();
    };

    /**
     * Update row indexes
     * @return {Void}
     */
    Rows.prototype.update = function () {
        each(this.dt.data, function (row, i) {
            row.dataIndex = i;
        });
    };

    ////////////////////
    //    MAIN LIB    //
    ////////////////////

    var DataTable = function DataTable(table, options) {
        this.initialized = false;

        // user options
        this.options = extend(defaultConfig, options);

        if (typeof table === "string") {
            table = document.querySelector(table);
        }

        this.initialLayout = table.innerHTML;
        this.initialSortable = this.options.sortable;

        // Disable manual sorting if no header is present (#4)
        if (!this.options.header) {
            this.options.sortable = false;
        }

        if (table.tHead === null) {
            if (!this.options.data || this.options.data && !this.options.data.headings) {
                this.options.sortable = false;
            }
        }

        if (table.tBodies.length && !table.tBodies[0].rows.length) {
            if (this.options.data) {
                if (!this.options.data.data) {
                    throw new Error("You seem to be using the data option, but you've not defined any rows.");
                }
            }
        }

        this.table = table;

        this.init();
    };

    /**
     * Add custom property or method to extend DataTable
     * @param  {String} prop    - Method name or property
     * @param  {Mixed} val      - Function or property value
     * @return {Void}
     */
    DataTable.extend = function (prop, val) {
        if (typeof val === "function") {
            DataTable.prototype[prop] = val;
        } else {
            DataTable[prop] = val;
        }
    };

    var proto = DataTable.prototype;

    /**
     * Initialize the instance
     * @param  {Object} options
     * @return {Void}
     */
    proto.init = function (options) {
        if (this.initialized || classList.contains(this.table, "dataTable-table")) {
            return false;
        }

        var that = this;

        this.options = extend(this.options, options || {});

        // IE detection
        this.isIE = !!/(msie|trident)/i.test(navigator.userAgent);

        this.currentPage = 1;
        this.onFirstPage = true;

        this.hiddenColumns = [];
        this.columnRenderers = [];
        this.selectedColumns = [];

        this.render();

        setTimeout(function () {
            that.emit("datatable.init");
            that.initialized = true;

            if (that.options.plugins) {
                each(that.options.plugins, function (options, plugin) {
                    if (that[plugin] && typeof that[plugin] === "function") {
                        that[plugin] = that[plugin](options, {
                            each: each,
                            extend: extend,
                            classList: classList,
                            createElement: createElement
                        });

                        // Init plugin
                        if (options.enabled && that[plugin].init && typeof that[plugin].init === "function") {
                            that[plugin].init();
                        }
                    }
                });
            }
        }, 10);
    };

    /**
     * Render the instance
     * @param  {String} type
     * @return {Void}
     */
    proto.render = function (type) {
        if (type) {
            switch (type) {
                case "page":
                    this.renderPage();
                    break;
                case "pager":
                    this.renderPager();
                    break;
                case "header":
                    this.renderHeader();
                    break;
            }

            return false;
        }

        var that = this,
            o = that.options,
            template = "";

        // Convert data to HTML
        if (o.data) {
            dataToTable.call(that);
        }

        if (o.ajax) {
            var ajax = o.ajax;
            var xhr = new XMLHttpRequest();

            var xhrProgress = function xhrProgress(e) {
                that.emit("datatable.ajax.progress", e, xhr);
            };

            var xhrLoad = function xhrLoad(e) {
                if (xhr.readyState === 4) {
                    that.emit("datatable.ajax.loaded", e, xhr);

                    if (xhr.status === 200) {
                        var obj = {};
                        obj.data = ajax.load ? ajax.load.call(that, xhr) : xhr.responseText;

                        obj.type = "json";

                        if (ajax.content && ajax.content.type) {
                            obj.type = ajax.content.type;

                            obj = extend(obj, ajax.content);
                        }

                        that.import(obj);

                        that.setColumns(true);

                        that.emit("datatable.ajax.success", e, xhr);
                    } else {
                        that.emit("datatable.ajax.error", e, xhr);
                    }
                }
            };

            var xhrFailed = function xhrFailed(e) {
                that.emit("datatable.ajax.error", e, xhr);
            };

            var xhrCancelled = function xhrCancelled(e) {
                that.emit("datatable.ajax.abort", e, xhr);
            };

            on(xhr, "progress", xhrProgress);
            on(xhr, "load", xhrLoad);
            on(xhr, "error", xhrFailed);
            on(xhr, "abort", xhrCancelled);

            that.emit("datatable.ajax.loading", xhr);

            xhr.open("GET", typeof ajax === "string" ? o.ajax : o.ajax.url);
            xhr.send();
        }

        // Store references
        that.body = that.table.tBodies[0];
        that.head = that.table.tHead;
        that.foot = that.table.tFoot;

        if (!that.body) {
            that.body = createElement("tbody");

            that.table.appendChild(that.body);
        }

        that.hasRows = that.body.rows.length > 0;

        // Make a tHead if there isn't one (fixes #8)
        if (!that.head) {
            var h = createElement("thead");
            var t = createElement("tr");

            if (that.hasRows) {
                each(that.body.rows[0].cells, function () {
                    t.appendChild(createElement("th"));
                });

                h.appendChild(t);
            }

            that.head = h;

            that.table.insertBefore(that.head, that.body);

            that.hiddenHeader = !o.ajax;
        }

        that.headings = [];
        that.hasHeadings = that.head.rows.length > 0;

        if (that.hasHeadings) {
            that.header = that.head.rows[0];
            that.headings = [].slice.call(that.header.cells);
        }

        // Header
        if (!o.header) {
            if (that.head) {
                that.table.removeChild(that.table.tHead);
            }
        }

        // Footer
        if (o.footer) {
            if (that.head && !that.foot) {
                that.foot = createElement("tfoot", {
                    html: that.head.innerHTML
                });
                that.table.appendChild(that.foot);
            }
        } else {
            if (that.foot) {
                that.table.removeChild(that.table.tFoot);
            }
        }

        // Build
        that.wrapper = createElement("div", {
            class: "dataTable-wrapper dataTable-loading"
        });

        // Template for custom layouts
        template += "<div class='dataTable-top'>";
        template += o.layout.top;
        template += "</div>";
        template += "<div class='dataTable-container'></div>";
        if (defaultConfig.info) {
            template += "<div class='dataTable-bottom'>";
            template += o.layout.bottom;
            template += "</div>";
            // Info placement
            template = template.replace("{info}", "<div class='dataTable-info'></div>");
        }

        // Per Page Select
        if (o.perPageSelect) {
            var wrap = "<div class='dataTable-dropdown'><label>";
            wrap += o.labels.perPage;
            wrap += "</label></div>";

            // Create the select
            var select = createElement("select", {
                class: "dataTable-selector"
            });

            // Create the options
            each(o.perPageSelect, function (val) {
                var selected = val === o.perPage;
                var option = new Option(val, val, selected, selected);
                select.add(option);
            });

            // Custom label
            wrap = wrap.replace("{select}", select.outerHTML);

            // Selector placement
            template = template.replace("{select}", wrap);
        } else {
            template = template.replace("{select}", "");
        }

        // Searchable
        if (o.searchable) {
            var form = "<div class='dataTable-search'><input class='dataTable-input' placeholder='" + o.labels.placeholder + "' type='text'></div>";

            // Search input placement
            template = template.replace("{search}", form);
        } else {
            template = template.replace("{search}", "");
        }

        if (that.hasHeadings) {
            // Sortable
            this.render("header");
        }

        // Add table class
        classList.add(that.table, "dataTable-table");

        // Paginator
        var w = createElement("div", {
            class: "dataTable-pagination"
        });
        var paginator = createElement("ul");
        w.appendChild(paginator);

        // Pager(s) placement
        template = template.replace(/\{pager\}/g, w.outerHTML);

        that.wrapper.innerHTML = template;

        that.container = that.wrapper.querySelector(".dataTable-container");

        that.pagers = that.wrapper.querySelectorAll(".dataTable-pagination");

        that.label = that.wrapper.querySelector(".dataTable-info");

        // Insert in to DOM tree
        that.table.parentNode.replaceChild(that.wrapper, that.table);
        that.container.appendChild(that.table);

        // Store the table dimensions
        that.rect = that.table.getBoundingClientRect();

        // Convert rows to array for processing
        that.data = [].slice.call(that.body.rows);
        that.activeRows = that.data.slice();
        that.activeHeadings = that.headings.slice();

        // Update
        that.update();

        if (!o.ajax) {
            that.setColumns();
        }

        // Fix height
        this.fixHeight();

        // Fix columns
        that.fixColumns();

        // Class names
        if (!o.header) {
            classList.add(that.wrapper, "no-header");
        }

        if (!o.footer) {
            classList.add(that.wrapper, "no-footer");
        }

        if (o.sortable) {
            classList.add(that.wrapper, "sortable");
        }

        if (o.searchable) {
            classList.add(that.wrapper, "searchable");
        }

        if (o.fixedHeight) {
            classList.add(that.wrapper, "fixed-height");
        }

        if (o.fixedColumns) {
            classList.add(that.wrapper, "fixed-columns");
        }

        that.bindEvents();
    };

    /**
     * Render the page
     * @return {Void}
     */
    proto.renderPage = function () {
        if (this.hasRows && this.totalPages) {
            if (this.currentPage > this.totalPages) {
                this.currentPage = 1;
            }

            // Use a fragment to limit touching the DOM
            var index = this.currentPage - 1,
                frag = doc.createDocumentFragment();

            if (this.hasHeadings) {
                flush(this.header, this.isIE);

                each(this.activeHeadings, function (th) {
                    this.header.appendChild(th);
                }, this);
            }

            each(this.pages[index], function (row) {
                frag.appendChild(this.rows().render(row));
            }, this);

            this.clear(frag);

            this.onFirstPage = this.currentPage === 1;
            this.onLastPage = this.currentPage === this.lastPage;
        } else {
            this.clear();
        }

        // Update the info
        var current = 0,
            f = 0,
            t = 0,
            items;

        if (this.totalPages) {
            current = this.currentPage - 1;
            f = current * this.options.perPage;
            t = f + this.pages[current].length;
            f = f + 1;
            items = !!this.searching ? this.searchData.length : this.data.length;
        }

        if (this.label && this.options.labels.info.length) {
            // CUSTOM LABELS
            var string = this.options.labels.info.replace("{start}", f).replace("{end}", t).replace("{page}", this.currentPage).replace("{pages}", this.totalPages).replace("{rows}", items);

            this.label.innerHTML = items ? string : "";
        }

        if (this.currentPage == 1) {
            this.fixHeight();
        }
    };

    /**
     * Render the pager(s)
     * @return {Void}
     */
    proto.renderPager = function () {
        flush(this.pagers, this.isIE);

        if (this.totalPages > 1) {
            var c = "pager",
                frag = doc.createDocumentFragment(),
                prev = this.onFirstPage ? 1 : this.currentPage - 1,
                next = this.onlastPage ? this.totalPages : this.currentPage + 1;

            // first button
            if (this.options.firstLast) {
                frag.appendChild(button(c, 1, this.options.firstText));
            }

            // prev button
            if (this.options.nextPrev) {
                frag.appendChild(button(c, prev, this.options.prevText));
            }

            var pager = this.links;

            // truncate the links
            if (this.options.truncatePager) {
                pager = truncate(this.links, this.currentPage, this.pages.length, this.options.pagerDelta, this.options.ellipsisText);
            }

            // active page link
            classList.add(this.links[this.currentPage - 1], "active");

            // append the links
            each(pager, function (p) {
                classList.remove(p, "active");
                frag.appendChild(p);
            });

            classList.add(this.links[this.currentPage - 1], "active");

            // next button
            if (this.options.nextPrev) {
                frag.appendChild(button(c, next, this.options.nextText));
            }

            // first button
            if (this.options.firstLast) {
                frag.appendChild(button(c, this.totalPages, this.options.lastText));
            }

            // We may have more than one pager
            each(this.pagers, function (pager) {
                pager.appendChild(frag.cloneNode(true));
            });
        }
    };

    /**
     * Render the header
     * @return {Void}
     */
    proto.renderHeader = function () {
        var that = this;

        that.labels = [];

        if (that.headings && that.headings.length) {
            each(that.headings, function (th, i) {

                that.labels[i] = th.textContent;

                if (classList.contains(th.firstElementChild, "dataTable-sorter")) {
                    th.innerHTML = th.firstElementChild.innerHTML;
                }

                th.sortable = th.getAttribute("data-sortable") !== "false";

                th.originalCellIndex = i;
                if (that.options.sortable && th.sortable) {
                    var link = createElement("a", {
                        href: "#",
                        class: "dataTable-sorter",
                        html: th.innerHTML
                    });

                    th.innerHTML = "";
                    th.setAttribute("data-sortable", "");
                    th.appendChild(link);
                }
            });
        }

        that.fixColumns();
    };

    /**
     * Bind event listeners
     * @return {[type]} [description]
     */
    proto.bindEvents = function () {
        var that = this,
            o = that.options;

        // Per page selector
        if (o.perPageSelect) {
            var selector = that.wrapper.querySelector(".dataTable-selector");
            if (selector) {
                // Change per page
                on(selector, "change", function (e) {
                    o.perPage = parseInt(this.value, 10);
                    that.update();

                    that.fixHeight();

                    that.emit("datatable.perpage", o.perPage);
                });
            }
        }

        // Search input
        if (o.searchable) {
            that.input = that.wrapper.querySelector(".dataTable-input");
            if (that.input) {
                on(that.input, "keyup", function (e) {
                    that.search(this.value);
                });
            }
        }

        // Pager(s) / sorting
        on(that.wrapper, "click", function (e) {
            var t = e.target;
            if (t.nodeName.toLowerCase() === "a") {
                if (t.hasAttribute("data-page")) {
                    that.page(t.getAttribute("data-page"));
                    e.preventDefault();
                } else if (o.sortable && classList.contains(t, "dataTable-sorter") && t.parentNode.getAttribute("data-sortable") != "false") {
                    that.columns().sort(that.activeHeadings.indexOf(t.parentNode) + 1);
                    e.preventDefault();
                }
            }
        });
    };

    /**
     * Set up columns
     * @return {[type]} [description]
     */
    proto.setColumns = function (ajax) {

        var that = this;

        if (!ajax) {
            each(that.data, function (row) {
                each(row.cells, function (cell) {
                    cell.data = cell.innerHTML;
                });
            });
        }

        // Check for the columns option
        if (that.options.columns && that.headings.length) {

            each(that.options.columns, function (data) {

                // convert single column selection to array
                if (!isArray(data.select)) {
                    data.select = [data.select];
                }

                if (data.hasOwnProperty("render") && typeof data.render === "function") {
                    that.selectedColumns = that.selectedColumns.concat(data.select);

                    that.columnRenderers.push({
                        columns: data.select,
                        renderer: data.render
                    });
                }

                // Add the data attributes to the th elements
                each(data.select, function (column) {
                    var th = that.headings[column];
                    if (data.type) {
                        th.setAttribute("data-type", data.type);
                    }
                    if (data.format) {
                        th.setAttribute("data-format", data.format);
                    }
                    if (data.hasOwnProperty("sortable")) {
                        th.setAttribute("data-sortable", data.sortable);
                    }

                    if (data.hasOwnProperty("hidden")) {
                        if (data.hidden !== false) {
                            that.columns().hide(column);
                        }
                    }

                    if (data.hasOwnProperty("sort") && data.select.length === 1) {
                        that.columns().sort(data.select[0] + 1, data.sort, true);
                    }
                });
            });
        }

        if (that.hasRows) {
            each(that.data, function (row, i) {
                row.dataIndex = i;
                each(row.cells, function (cell) {
                    cell.data = cell.innerHTML;
                });
            });

            if (that.selectedColumns.length) {
                each(that.data, function (row) {
                    each(row.cells, function (cell, i) {
                        if (that.selectedColumns.indexOf(i) > -1) {
                            each(that.columnRenderers, function (o) {
                                if (o.columns.indexOf(i) > -1) {
                                    cell.innerHTML = o.renderer.call(that, cell.data, cell, row);
                                }
                            });
                        }
                    });
                });
            }

            that.columns().rebuild();
        }

        that.render("header");
    };

    /**
     * Destroy the instance
     * @return {void}
     */
    proto.destroy = function () {
        this.table.innerHTML = this.initialLayout;

        // Remove the className
        classList.remove(this.table, "dataTable-table");

        // Remove the containers
        this.wrapper.parentNode.replaceChild(this.table, this.wrapper);

        this.initialized = false;
    };

    /**
     * Update the instance
     * @return {Void}
     */
    proto.update = function () {
        classList.remove(this.wrapper, "dataTable-empty");

        this.paginate(this);
        this.render("page");

        this.links = [];

        var i = this.pages.length;
        while (i--) {
            var num = i + 1;
            this.links[i] = button(i === 0 ? "active" : "", num, num);
        }

        this.sorting = false;

        this.render("pager");

        this.rows().update();

        this.emit("datatable.update");
    };

    /**
     * Sort rows into pages
     * @return {Number}
     */
    proto.paginate = function () {
        var perPage = this.options.perPage,
            rows = this.activeRows;

        if (this.searching) {
            rows = [];

            each(this.searchData, function (index) {
                rows.push(this.activeRows[index]);
            }, this);
        }

        // Check for hidden columns
        this.pages = rows.map(function (tr, i) {
            return i % perPage === 0 ? rows.slice(i, i + perPage) : null;
        }).filter(function (page) {
            return page;
        });

        this.totalPages = this.lastPage = this.pages.length;

        return this.totalPages;
    };

    /**
     * Fix column widths
     * @return {Void}
     */
    proto.fixColumns = function () {

        if (this.options.fixedColumns && this.activeHeadings && this.activeHeadings.length) {

            var cells,
                hd = false;

            this.columnWidths = [];

            // If we have headings we need only set the widths on them
            // otherwise we need a temp header and the widths need applying to all cells
            if (this.table.tHead) {
                // Reset widths
                each(this.activeHeadings, function (cell) {
                    cell.style.width = "";
                }, this);

                each(this.activeHeadings, function (cell, i) {
                    var ow = cell.offsetWidth;
                    var w = ow / this.rect.width * 100;
                    cell.style.width = w + "%";
                    this.columnWidths[i] = ow;
                }, this);
            } else {
                cells = [];

                // Make temperary headings
                hd = createElement("thead");
                var r = createElement("tr");
                var c = this.table.tBodies[0].rows[0].cells;
                each(c, function () {
                    var th = createElement("th");
                    r.appendChild(th);
                    cells.push(th);
                });

                hd.appendChild(r);
                this.table.insertBefore(hd, this.body);

                var widths = [];
                each(cells, function (cell, i) {
                    var ow = cell.offsetWidth;
                    var w = ow / this.rect.width * 100;
                    widths.push(w);
                    this.columnWidths[i] = ow;
                }, this);

                each(this.data, function (row) {
                    each(row.cells, function (cell, i) {
                        if (this.columns(cell.cellIndex).visible()) cell.style.width = widths[i] + "%";
                    }, this);
                }, this);

                // Discard the temp header
                this.table.removeChild(hd);
            }
        }
    };

    /**
     * Fix the container height;
     * @return {Void}
     */
    proto.fixHeight = function () {
        if (this.options.fixedHeight) {
            this.container.style.height = null;
            this.rect = this.container.getBoundingClientRect();
            this.container.style.height = this.rect.height + "px";
        }
    };

    /**
     * Perform a search of the data set
     * @param  {string} query
     * @return {void}
     */
    proto.search = function (query) {
        if (!this.hasRows) return false;

        var that = this;

        query = query.toLowerCase();

        this.currentPage = 1;
        this.searching = true;
        this.searchData = [];

        if (!query.length) {
            this.searching = false;
            this.update();
            this.emit("datatable.search", query, this.searchData);
            classList.remove(this.wrapper, "search-results");
            return false;
        }

        this.clear();

        each(this.data, function (row, idx) {
            var inArray = this.searchData.indexOf(row) > -1;

            // https://github.com/Mobius1/Vanilla-DataTables/issues/12
            var doesQueryMatch = query.split(" ").reduce(function (bool, word) {
                var includes = false,
                    cell = null,
                    content = null;

                for (var x = 0; x < row.cells.length; x++) {
                    cell = row.cells[x];
                    content = cell.hasAttribute('data-content') ? cell.getAttribute('data-content') : cell.textContent;

                    if (content.toLowerCase().indexOf(word) > -1 && that.columns(cell.cellIndex).visible()) {
                        includes = true;
                        break;
                    }
                }

                return bool && includes;
            }, true);

            if (doesQueryMatch && !inArray) {
                row.searchIndex = idx;
                this.searchData.push(idx);
            } else {
                row.searchIndex = null;
            }
        }, this);

        classList.add(this.wrapper, "search-results");

        if (!that.searchData.length) {
            classList.remove(that.wrapper, "search-results");

            that.setMessage(that.options.labels.noRows);
        } else {
            that.update();
        }

        this.emit("datatable.search", query, this.searchData);
    };

    /**
     * Change page
     * @param  {int} page
     * @return {void}
     */
    proto.page = function (page) {
        // We don't want to load the current page again.
        if (page == this.currentPage) {
            return false;
        }

        if (!isNaN(page)) {
            this.currentPage = parseInt(page, 10);
        }

        if (page > this.pages.length || page < 0) {
            return false;
        }

        this.render("page");
        this.render("pager");

        this.emit("datatable.page", page);
    };

    /**
     * Sort by column
     * @param  {int} column - The column no.
     * @param  {string} direction - asc or desc
     * @return {void}
     */
    proto.sortColumn = function (column, direction) {
        // Use columns API until sortColumn method is removed
        this.columns().sort(column, direction);
    };

    /**
     * Add new row data
     * @param {object} data
     */
    proto.insert = function (data) {

        var that = this,
            rows = [];
        if (isObject(data)) {
            if (data.headings) {
                if (!that.hasHeadings && !that.hasRows) {
                    var tr = createElement("tr"),
                        th;
                    each(data.headings, function (heading) {
                        th = createElement("th", {
                            html: heading
                        });

                        tr.appendChild(th);
                    });
                    that.head.appendChild(tr);

                    that.header = tr;
                    that.headings = [].slice.call(tr.cells);
                    that.hasHeadings = true;

                    // Re-enable sorting if it was disabled due
                    // to missing header
                    that.options.sortable = that.initialSortable;

                    // Allow sorting on new header
                    that.render("header");
                }
            }

            if (data.data && isArray(data.data)) {
                rows = data.data;
            }
        } else if (isArray(data)) {
            each(data, function (row) {
                var r = [];
                each(row, function (cell, heading) {

                    var index = that.labels.indexOf(heading);

                    if (index > -1) {
                        r[index] = cell;
                    }
                });
                rows.push(r);
            });
        }

        if (rows.length) {
            that.rows().add(rows);

            that.hasRows = true;
        }

        that.update();

        that.fixColumns();
    };

    /**
     * Refresh the instance
     * @return {void}
     */
    proto.refresh = function () {
        if (this.options.searchable) {
            this.input.value = "";
            this.searching = false;
        }
        this.currentPage = 1;
        this.onFirstPage = true;
        this.update();

        this.emit("datatable.refresh");
    };

    /**
     * Truncate the table
     * @param  {mixes} html - HTML string or HTMLElement
     * @return {void}
     */
    proto.clear = function (html) {
        if (this.body) {
            flush(this.body, this.isIE);
        }

        var parent = this.body;
        if (!this.body) {
            parent = this.table;
        }

        if (html) {
            if (typeof html === "string") {
                var frag = doc.createDocumentFragment();
                frag.innerHTML = html;
            }

            parent.appendChild(html);
        }
    };

    /**
     * Export table to various formats (csv, txt or sql)
     * @param  {Object} options User options
     * @return {Boolean}
     */
    proto.export = function (options) {
        if (!this.hasHeadings && !this.hasRows) return false;

        var headers = this.activeHeadings,
            rows = [],
            arr = [],
            i,
            x,
            str,
            link;

        var defaults = {
            download: true,
            skipColumn: [],

            // csv
            lineDelimiter: "\n",
            columnDelimiter: ",",

            // sql
            tableName: "myTable",

            // json
            replacer: null,
            space: 4
        };

        // Check for the options object
        if (!isObject(options)) {
            return false;
        }

        var o = extend(defaults, options);

        if (o.type) {
            if (o.type === "txt" || o.type === "csv") {
                // Include headings
                rows[0] = this.header;
            }

            // Selection or whole table
            if (o.selection) {
                // Page number
                if (!isNaN(o.selection)) {
                    rows = rows.concat(this.pages[o.selection - 1]);
                } else if (isArray(o.selection)) {
                    // Array of page numbers
                    for (i = 0; i < o.selection.length; i++) {
                        rows = rows.concat(this.pages[o.selection[i] - 1]);
                    }
                }
            } else {
                rows = rows.concat(this.activeRows);
            }

            // Only proceed if we have data
            if (rows.length) {
                if (o.type === "txt" || o.type === "csv") {
                    str = "";

                    for (i = 0; i < rows.length; i++) {
                        for (x = 0; x < rows[i].cells.length; x++) {
                            // Check for column skip and visibility
                            if (o.skipColumn.indexOf(headers[x].originalCellIndex) < 0 && this.columns(headers[x].originalCellIndex).visible()) {
                                var text = rows[i].cells[x].textContent;
                                text = text.trim();
                                text = text.replace(/\s{2,}/g, ' ');
                                text = text.replace(/\n/g, '  ');
                                text = text.replace(/"/g, '""');
                                if (text.indexOf(",") > -1) text = '"' + text + '"';

                                str += text + o.columnDelimiter;
                            }
                        }
                        // Remove trailing column delimiter
                        str = str.trim().substring(0, str.length - 1);

                        // Apply line delimiter
                        str += o.lineDelimiter;
                    }

                    // Remove trailing line delimiter
                    str = str.trim().substring(0, str.length - 1);

                    if (o.download) {
                        str = "data:text/csv;charset=utf-8," + str;
                    }
                } else if (o.type === "sql") {
                    // Begin INSERT statement
                    str = "INSERT INTO `" + o.tableName + "` (";

                    // Convert table headings to column names
                    for (i = 0; i < headers.length; i++) {
                        // Check for column skip and column visibility
                        if (o.skipColumn.indexOf(headers[i].originalCellIndex) < 0 && this.columns(headers[i].originalCellIndex).visible()) {
                            str += "`" + headers[i].textContent + "`,";
                        }
                    }

                    // Remove trailing comma
                    str = str.trim().substring(0, str.length - 1);

                    // Begin VALUES
                    str += ") VALUES ";

                    // Iterate rows and convert cell data to column values
                    for (i = 0; i < rows.length; i++) {
                        str += "(";

                        for (x = 0; x < rows[i].cells.length; x++) {
                            // Check for column skip and column visibility
                            if (o.skipColumn.indexOf(headers[x].originalCellIndex) < 0 && this.columns(headers[x].originalCellIndex).visible()) {
                                str += '"' + rows[i].cells[x].textContent + '",';
                            }
                        }

                        // Remove trailing comma
                        str = str.trim().substring(0, str.length - 1);

                        // end VALUES
                        str += "),";
                    }

                    // Remove trailing comma
                    str = str.trim().substring(0, str.length - 1);

                    // Add trailing colon
                    str += ";";

                    if (o.download) {
                        str = "data:application/sql;charset=utf-8," + str;
                    }
                } else if (o.type === "json") {
                    // Iterate rows
                    for (x = 0; x < rows.length; x++) {
                        arr[x] = arr[x] || {};
                        // Iterate columns
                        for (i = 0; i < headers.length; i++) {
                            // Check for column skip and column visibility
                            if (o.skipColumn.indexOf(headers[i].originalCellIndex) < 0 && this.columns(headers[i].originalCellIndex).visible()) {
                                arr[x][headers[i].textContent] = rows[x].cells[i].textContent;
                            }
                        }
                    }

                    // Convert the array of objects to JSON string
                    str = JSON.stringify(arr, o.replacer, o.space);

                    if (o.download) {
                        str = "data:application/json;charset=utf-8," + str;
                    }
                }

                // Download
                if (o.download) {
                    // Filename
                    o.filename = o.filename || "datatable_export";
                    o.filename += "." + o.type;

                    str = encodeURI(str);

                    // Create a link to trigger the download
                    link = document.createElement("a");
                    link.href = str;
                    link.download = o.filename;

                    // Append the link
                    body.appendChild(link);

                    // Trigger the download
                    link.click();

                    // Remove the link
                    body.removeChild(link);
                }

                return str;
            }
        }

        return false;
    };

    /**
     * Import data to the table
     * @param  {Object} options User options
     * @return {Boolean}
     */
    proto.import = function (options) {
        var obj = false;
        var defaults = {
            // csv
            lineDelimiter: "\n",
            columnDelimiter: ","
        };

        // Check for the options object
        if (!isObject(options)) {
            return false;
        }

        options = extend(defaults, options);

        if (options.data.length || isObject(options.data)) {
            // Import CSV
            if (options.type === "csv") {
                obj = {
                    data: []
                };

                // Split the string into rows
                var rows = options.data.split(options.lineDelimiter);

                if (rows.length) {

                    if (options.headings) {
                        obj.headings = rows[0].split(options.columnDelimiter);

                        rows.shift();
                    }

                    each(rows, function (row, i) {
                        obj.data[i] = [];

                        // Split the rows into values
                        var values = row.split(options.columnDelimiter);

                        if (values.length) {
                            each(values, function (value) {
                                obj.data[i].push(value);
                            });
                        }
                    });
                }
            } else if (options.type === "json") {
                var json = isJson(options.data);

                // Valid JSON string
                if (json) {
                    obj = {
                        headings: [],
                        data: []
                    };

                    each(json, function (data, i) {
                        obj.data[i] = [];
                        each(data, function (value, column) {
                            if (obj.headings.indexOf(column) < 0) {
                                obj.headings.push(column);
                            }

                            obj.data[i].push(value);
                        });
                    });
                } else {
                    console.warn("That's not valid JSON!");
                }
            }

            if (isObject(options.data)) {
                obj = options.data;
            }

            if (obj) {
                // Add the rows
                this.insert(obj);
            }
        }

        return false;
    };
    /**
     * Print the table
     * @return {void}
     */
    proto.print = function () {
        var headings = this.activeHeadings;
        var rows = this.activeRows;
        var table = createElement("table");
        var thead = createElement("thead");
        var tbody = createElement("tbody");

        var tr = createElement("tr");
        each(headings, function (th) {
            tr.appendChild(createElement("th", {
                html: th.textContent
            }));
        });

        thead.appendChild(tr);

        each(rows, function (row) {
            var tr = createElement("tr");
            each(row.cells, function (cell) {
                tr.appendChild(createElement("td", {
                    html: cell.textContent
                }));
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        // Open new window
        var w = win.open();

        // Append the table to the body
        w.document.body.appendChild(table);

        // Print
        w.print();
    };

    /**
     * Show a message in the table
     * @param {string} message
     */
    proto.setMessage = function (message) {
        var colspan = 1;

        if (this.hasRows) {
            colspan = this.data[0].cells.length;
        }

        classList.add(this.wrapper, "dataTable-empty");

        this.clear(createElement("tr", {
            html: '<td class="dataTables-empty" colspan="' + colspan + '">' + message + "</td>"
        }));
    };

    /**
     * Columns API access
     * @return {Object} new Columns instance
     */
    proto.columns = function (columns) {
        return new Columns(this, columns);
    };

    /**
     * Rows API access
     * @return {Object} new Rows instance
     */
    proto.rows = function (rows) {
        return new Rows(this, rows);
    };

    /**
     * Add custom event listener
     * @param  {String} event
     * @param  {Function} callback
     * @return {Void}
     */
    proto.on = function (event, callback) {
        this.events = this.events || {};
        this.events[event] = this.events[event] || [];
        this.events[event].push(callback);
    };

    /**
     * Remove custom event listener
     * @param  {String} event
     * @param  {Function} callback
     * @return {Void}
     */
    proto.off = function (event, callback) {
        this.events = this.events || {};
        if (event in this.events === false) return;
        this.events[event].splice(this.events[event].indexOf(callback), 1);
    };

    /**
     * Fire custom event
     * @param  {String} event
     * @return {Void}
     */
    proto.emit = function (event) {
        this.events = this.events || {};
        if (event in this.events === false) return;
        for (var i = 0; i < this.events[event].length; i++) {
            this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };

    return DataTable;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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

},{"_process":33}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.modalDialog = modalDialog;
/* jshint laxbreak: true */
/* experimental: [asyncawait, asyncreqawait] */

function modalDialog(title, message, options) {
    "use strict";

    var messageContent = "";
    //let ModalDialogObject = {};

    if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== "object") {
        options = {};
    }

    console.log("window.modalDialogAlert: ", window.modalDialogAlert);
    console.log(".ModalDialog-alert: ", document.querySelector(".ModalDialog-alert"));

    //if (window.modalDialogAlert.element) delete window.modalDialogAlert;
    if (document.querySelector("#ModalDialog-wrap")) {
        var el = document.querySelector("#ModalDialog-wrap");
        el.parentNode.removeChild(el);
    }
    if (document.querySelector(".ModalDialog-alert")) {
        var _el = document.querySelector(".ModalDialog-alert");
        _el.parentNode.removeChild(_el);
    }

    if (window.modalDialogAlert) {
        if (window.modalDialogAlert.element) delete window.modalDialogAlert;
        delete window.modalDialogAlert;
    }
    if (!window.modalDialogAlert) {
        var ModalDialogObject = {
            element: null,
            cancelElement: null,
            confirmElement: null
        };
        ModalDialogObject.element = document.querySelector("#ModalDialog-alert");
    }

    // Define default options
    ModalDialogObject.type = options.type !== undefined ? options.type : "OkCancel";
    ModalDialogObject.width = options.width !== undefined ? options.width : "640px";
    ModalDialogObject.cancel = options.cancel !== undefined ? options.cancel : false;
    ModalDialogObject.cancelText = options.cancelText !== undefined ? options.cancelText : "Cancel";
    ModalDialogObject.confirm = options.confirm !== undefined ? options.confirm : true;
    ModalDialogObject.confirmText = options.confirmText !== undefined ? options.confirmText : "Confirm";

    ModalDialogObject.cancelCallBack = function (event) {
        document.body.classList.remove("modal-dialog-open");
        window.modalDialogAlert.element.style.display = "none";
        // Cancel callback
        if (typeof options.cancelCallBack === "function") {
            var _el2 = document.querySelector("#ModalDialog-wrap");
            _el2.parentNode.removeChild(_el2);
            options.cancelCallBack(event);
        }

        // Cancelled
        return false;
    };

    // Close alert on click outside
    /* if (document.querySelector(".ModalDialog-mask")) {
      document
        .querySelector(".ModalDialog-mask")
        .addEventListener("click", function(event) {
          document.body.classList.remove("modal-dialog-open");
          window.modalDialogAlert.element.style.display = "none";
          // Cancel callback
          if (typeof options.cancelCallBack === "function") {
            let el = document.querySelector("#ModalDialog-wrap");
            el.parentNode.removeChild(el);
            options.cancelCallBack(event);
          }
          // Clicked outside
          return false;
        });
    } */

    ModalDialogObject.message = message;
    ModalDialogObject.title = title;

    ModalDialogObject.confirmCallBack = function (event) {
        var el = document.querySelector("#ModalDialog-wrap");

        // Confirm callback
        if (typeof options.confirmCallBack === "function") {
            switch (ModalDialogObject.type) {
                case "prompt":
                    document.body.classList.remove("modal-dialog-open");
                    window.modalDialogAlert.element.style.display = "none";
                    el.parentNode.removeChild(el);
                    options.confirmCallBack(event, ModalDialogObject.inputId.value.trim());
                    break;
                case "changePassword":
                    console.log(ModalDialogObject.newpassword);
                    document.body.classList.remove("modal-dialog-open");
                    window.modalDialogAlert.element.style.display = "none";
                    el.parentNode.removeChild(el);
                    options.confirmCallBack(event, ModalDialogObject.newpassword.value.trim(), ModalDialogObject.newpassword2.value.trim());
                    break;
                case "shareFile":
                    options.confirmCallBack(event, {
                        destUserName: ModalDialogObject.destUserName.value.trim(),
                        FileExpirateDate: ModalDialogObject.FileExpirateDate.value.trim(),
                        delFileAfterExpired: ModalDialogObject.delFileAfterExpired.checked
                    });
                    break;
                default:
                    document.body.classList.remove("modal-dialog-open");
                    window.modalDialogAlert.element.style.display = "none";
                    el.parentNode.removeChild(el);
                    options.confirmCallBack(event);

            }
        }

        // Confirmed
        return true;
    };

    ModalDialogObject._IfUsed = function (event) {
        var el = event.target;
        if (el.value.trim() !== '') {
            el.classList.add('used');
        } else {
            el.classList.remove('used');
        }
    };

    // Button Close Window Dialog
    ModalDialogObject.ModalClose = function (event) {
        var el = document.querySelector("#ModalDialog-wrap");
        el.parentNode.removeChild(el);
        /* document.body.classList.remove("modal-dialog-open");
        window.modalDialogAlert.element.style.display = "none"; */
    };

    // Window Dialog content
    if (!ModalDialogObject.element) {
        var htmlContent = "";

        htmlContent = '<div class="ModalDialog-alert" id="ModalDialog-alert">' + '<div class="ModalDialog-mask"></div>' + '<div class="ModalDialog-body" aria-relevant="all">' + '<div class="ModalDialog-title">' + ModalDialogObject.title + "</div>" + '<a class="ModalDialog-close" id="ModalDialogClose" href="#"></a>';

        console.log("ModalDialogObject.type: ", ModalDialogObject.type);

        // Body content

        switch (ModalDialogObject.type) {
            case "prompt":
                messageContent = '<div class="ModalDialog-container">' + '<div class="ModalDialog-content" id="ModalDialog-content">' + '<div class="ModalDialog-input-field">' + '<input id="inputId" class="ModalDialog-input" type="text">' + '<label for="inputId" class="ModalDialog-label">' + ModalDialogObject.message + '</label>' + '</div>' + '</div>' + '</div>';
                break;
            case "changePassword":
                messageContent = '<div class="ModalDialog-container">' + '<div class="ModalDialog-content" id="ModalDialog-content">' + ModalDialogObject.message + '</div>' + '</div>';
                break;
            case "prompt":
                break;
            case "prompt":
                break;
            default:
                messageContent = '<div class="ModalDialog-container">' + '<div class="ModalDialog-content" id="ModalDialog-content">' + ModalDialogObject.message + '</div>' + '</div>';
        }

        // Button container content 
        htmlContent += messageContent + '<div class="ModalDialog-button">';
        if (ModalDialogObject.cancel || true) {
            htmlContent += '<a href="javascript:;" class="btn2-unify ModalDialog-button-cancel"  id="ModalDialog-button-cancel">' + ModalDialogObject.cancelText + "</a>";
        }

        if (ModalDialogObject.confirm || true) {
            htmlContent += '<a href="javascript:;" class="btn2-unify ModalDialog-button-confirm" id="ModalDialog-button-confirm">' + ModalDialogObject.confirmText + "</a>";
        }

        htmlContent += '</div></div></div>';
        ModalDialogObject.html = htmlContent;

        // Add content to DOM
        var element = document.createElement("div");
        element.id = "ModalDialog-wrap";
        element.innerHTML = htmlContent;
        document.body.appendChild(element);

        ModalDialogObject.modalClose = document.querySelector("#ModalDialogClose");
        ModalDialogObject.element = document.querySelector(".ModalDialog-alert");
        ModalDialogObject.cancelElement = document.querySelector("#ModalDialog-button-cancel");
        ModalDialogObject.confirmElement = document.querySelector("#ModalDialog-button-confirm");

        if (ModalDialogObject.type === "prompt") {
            ModalDialogObject.inputId = document.querySelector("#inputId");
            ModalDialogObject.inputId.onblur = ModalDialogObject._IfUsed;
        }
        if (ModalDialogObject.type === "changePassword") {
            ModalDialogObject.newpassword = document.querySelector("#newpassword");
            ModalDialogObject.newpassword2 = document.querySelector("#newpassword2");
            ModalDialogObject.newpassword.onblur = ModalDialogObject._IfUsed;
            ModalDialogObject.newpassword2.onblur = ModalDialogObject._IfUsed;
        }
        if (ModalDialogObject.type === "shareFile") {
            document.querySelector(".ModalDialog-body").classList.add("shareFile");
            ModalDialogObject.destUserName = document.querySelector("#destUserName");
            ModalDialogObject.FileExpirateDate = document.querySelector("#FileExpirateDate");
            ModalDialogObject.delFileAfterExpired = document.querySelector("#delFileAfterExpired");
            ModalDialogObject.destUserName.onblur = ModalDialogObject._IfUsed;
        }
        // Enabled cancel button callback
        if (ModalDialogObject.cancel) {
            document.querySelector("#ModalDialog-button-cancel").style.display = "block";
        } else {
            document.querySelector("#ModalDialog-button-cancel").style.display = "none";
        }

        // Enabled cancel button callback
        if (ModalDialogObject.confirm) {
            document.querySelector("#ModalDialog-button-confirm").style.display = "block";
        } else {
            document.querySelector("#ModalDialog-button-confirm").style.display = "none";
        }

        ModalDialogObject.modalClose.onclick = ModalDialogObject.ModalClose;
        ModalDialogObject.cancelElement.onclick = ModalDialogObject.cancelCallBack;
        ModalDialogObject.confirmElement.onclick = ModalDialogObject.confirmCallBack;

        window.modalDialogAlert = ModalDialogObject;
    }
}

},{}],5:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":7}],6:[function(require,module,exports){
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

},{"../core/createError":13,"./../core/settle":16,"./../helpers/btoa":20,"./../helpers/buildURL":21,"./../helpers/cookies":23,"./../helpers/isURLSameOrigin":25,"./../helpers/parseHeaders":27,"./../utils":29,"_process":33}],7:[function(require,module,exports){
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

},{"./cancel/Cancel":8,"./cancel/CancelToken":9,"./cancel/isCancel":10,"./core/Axios":11,"./defaults":18,"./helpers/bind":19,"./helpers/spread":28,"./utils":29}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./Cancel":8}],10:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],11:[function(require,module,exports){
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

},{"./../defaults":18,"./../utils":29,"./InterceptorManager":12,"./dispatchRequest":14}],12:[function(require,module,exports){
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

},{"./../utils":29}],13:[function(require,module,exports){
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

},{"./enhanceError":15}],14:[function(require,module,exports){
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

},{"../cancel/isCancel":10,"../defaults":18,"./../helpers/combineURLs":22,"./../helpers/isAbsoluteURL":24,"./../utils":29,"./transformData":17}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./createError":13}],17:[function(require,module,exports){
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

},{"./../utils":29}],18:[function(require,module,exports){
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

},{"./adapters/http":6,"./adapters/xhr":6,"./helpers/normalizeHeaderName":26,"./utils":29,"_process":33}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./../utils":29}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{"./../utils":29}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"./../utils":29}],26:[function(require,module,exports){
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

},{"../utils":29}],27:[function(require,module,exports){
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

},{"./../utils":29}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"./helpers/bind":19,"is-buffer":30}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
    var version = "2.4.9";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
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
        noConflict: noConflict,
        __buffer__: buffer
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

},{}],32:[function(require,module,exports){
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays :
                this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.22.2';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'YYYY-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

},{}],33:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3VzZXIuanMiLCJqcy92ZW5kb3IvZGF0YVRhYmxlcy5qcyIsImpzL3ZlbmRvci9tZDUubWluLmpzIiwianMvdmVuZG9yL21vZGFsRGlhbG9nLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idG9hLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtYmFzZTY0L2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O1FDd1lnQixjLEdBQUEsYztRQStCQSxRLEdBQUEsUTtRQTJHQSxVLEdBQUEsVTtRQXFCQSxlLEdBQUEsZTs7QUF2aUJoQjs7OztBQUNBOztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFHQTs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1alNBQUo7O0FBZ0xBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsSUFBSSw2ekJBQUo7O0FBMEJBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE9BQUQsRUFBVSxJQUFWLEVBQWdCLFlBQWhCLEVBQWlDO0FBQ3ZELFFBQUksTUFBTSxFQUFWO0FBQ0E7O0FBRUEsUUFBSSxTQUFTLFFBQWIsRUFBdUI7QUFDbkIsZ0JBQVEsS0FBSyxXQUFMLEVBQVI7QUFDSSxp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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcbmltcG9ydCB7XHJcbiAgICBCYXNlNjRcclxufSBmcm9tIFwianMtYmFzZTY0XCI7XHJcbmltcG9ydCBtZDUgZnJvbSBcIi4uL3ZlbmRvci9tZDUubWluXCI7XHJcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5pbXBvcnQge1xyXG4gICAgbW9kYWxEaWFsb2dcclxufSBmcm9tIFwiLi4vdmVuZG9yL21vZGFsRGlhbG9nXCI7XHJcbmltcG9ydCBEYXRhVGFibGUgZnJvbSBcIi4uL3ZlbmRvci9kYXRhVGFibGVzXCI7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gVXNlcnMgbWFuYWdlIG1vZHVsZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5sZXQgaHRtbFVzZXJGb3JtVGVtcGxhdGUgPSBgXHJcbiAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tY29udGFpbmVyXCI+XHJcbiAgICAgIDxmb3JtIGlkPVwiZm9ybUFkZFVzZXJcIiBjbGFzcz1cInVzZXJGb3JtLWNvbnRlbnRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tcm93XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tdGl0bGVcIj5OZXcgVXNlcjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tcm93XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJVc2VyTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIlVzZXJOYW1lXCIgY2xhc3M9XCJ1c2VyRm9ybS1sYWJlbFwiPk5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj4gICBcclxuICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZmllbGQtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWlucHV0LWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cIkNvbXBhbnlOYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cInVzZXJGb3JtLWlucHV0XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiQ29tcGFueU5hbWVcIiBjbGFzcz1cInVzZXJGb3JtLWxhYmVsXCI+Q29tcGFueSBOYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+ICAgXHJcbiAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1yb3dcIj5cclxuICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWdyb3VwXCI+IFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWlucHV0LWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cIlVzZXJQYXNzd2RcIiB0eXBlPVwicGFzc3dvcmRcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBjbGFzcz1cInVzZXJGb3JtLWlucHV0XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiVXNlclBhc3N3ZFwiIGNsYXNzPVwidXNlckZvcm0tbGFiZWxcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PiAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJyZXBlYXRVc2VyUGFzc3dkXCIgdHlwZT1cInBhc3N3b3JkXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlcGVhdFVzZXJQYXNzd2RcIiBjbGFzcz1cInVzZXJGb3JtLWxhYmVsXCI+UmVwZWF0IFBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+IFxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1yb3dcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZmllbGQtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWlucHV0LWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cIlJvb3RQYXRoXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cInVzZXJGb3JtLWlucHV0XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiUm9vdFBhdGhcIiBjbGFzcz1cInVzZXJGb3JtLWxhYmVsXCI+Um9vdCBQYXRoPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+IFxyXG4gICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0taW5wdXQtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgPGkgaWQ9XCJGaW5kUGF0aFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImRhdGVwaWNrZXIgdXNlckZvcm0taW5wdXQgdXNlZFwiIGlkPVwiRXhwaXJhdGVEYXRlXCIgdHlwZT1cImRhdGVcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJFeHBpcmF0ZURhdGVJbnB1dFwiIGNsYXNzPVwidXNlckZvcm0tbGFiZWxcIj5FeHBpcmF0aW9uIERhdGU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj4gXHJcbiAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PiBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tcm93XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tdGl0bGVcIj5BY2Nlc3MgUmlnaHRzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1yb3dcIj4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0taW5wdXQtZmllbGRcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInVzZXJGb3JtLXNlbGVjdC1sYWJlbFwiPlVzZXIgUm9sZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJSb2xlXCIgdHlwZT1cImhpZGRlblwiIHZhbHVlPVwiXCIgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dFwiPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cIlJvbGVPcHRpb25zXCIgbmFtZT1cIm9wdGlvbnNuYW1lXCIgcmVxdWlyZWQ9XCJcIiBjbGFzcz1cInVzZXJGb3JtLXNlbGVjdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwib3B0MVwiPlVzZXI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm9wdDJcIj5BZG1pbjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwib3B0M1wiPkFkdmFuY2VkIFVzZXI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm9wdDRcIj5DdXN0b208L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YnI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLXJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0taW5wdXQtY29udGFpbmVyLXN3aXRjaFwiPlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzd2l0Y2gtbGFiZWxcIj5Eb3dubG9hZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzd2l0Y2gganNTd2l0Y2hlclwiIHJvbGU9XCJzd2l0Y2hcIiBhcmlhLWxhYmVsPVwicmVndWxhciBzd2l0Y2hcIiBhcmlhLWNoZWNrZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJvZmYtc2NyZWVuIEFjY2Vzc1JpZ2h0c1N3aXRjaFwiIG5hbWU9XCJzd2l0Y2hlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19vZmYtdGV4dFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPkRlbnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19sZXZlclwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2l0Y2hfX29uLXRleHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5BbGxvdzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1zZXBhcmF0b3JcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXItc3dpdGNoXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoLWxhYmVsXCI+VXBsb2FkPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic3dpdGNoIGpzU3dpdGNoZXJcIiByb2xlPVwic3dpdGNoXCIgYXJpYS1sYWJlbD1cInJlZ3VsYXIgc3dpdGNoXCIgYXJpYS1jaGVja2VkPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwib2ZmLXNjcmVlbiBBY2Nlc3NSaWdodHNTd2l0Y2hcIiBuYW1lPVwic3dpdGNoZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN3aXRjaF9fb2ZmLXRleHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5EZW55PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN3aXRjaF9fbGV2ZXJcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19vbi10ZXh0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+QWxsb3c8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tcm93XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXItc3dpdGNoXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoLWxhYmVsXCI+RGVsZXRlIEZpbGU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzd2l0Y2gganNTd2l0Y2hlclwiIHJvbGU9XCJzd2l0Y2hcIiBhcmlhLWxhYmVsPVwicmVndWxhciBzd2l0Y2hcIiBhcmlhLWNoZWNrZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJvZmYtc2NyZWVuIEFjY2Vzc1JpZ2h0c1N3aXRjaFwiIG5hbWU9XCJzd2l0Y2hlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19vZmYtdGV4dFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPkRlbnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19sZXZlclwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2l0Y2hfX29uLXRleHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5BbGxvdzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1zZXBhcmF0b3JcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXItc3dpdGNoXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoLWxhYmVsXCI+RGVsZXRlIEZvbGRlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInN3aXRjaCBqc1N3aXRjaGVyXCIgcm9sZT1cInN3aXRjaFwiIGFyaWEtbGFiZWw9XCJyZWd1bGFyIHN3aXRjaFwiIGFyaWEtY2hlY2tlZD1cImZhbHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cIm9mZi1zY3JlZW4gQWNjZXNzUmlnaHRzU3dpdGNoXCIgbmFtZT1cInN3aXRjaGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2l0Y2hfX29mZi10ZXh0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+RGVueTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2l0Y2hfX2xldmVyXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN3aXRjaF9fb24tdGV4dFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPkFsbG93PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLXJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0taW5wdXQtY29udGFpbmVyLXN3aXRjaFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN3aXRjaC1sYWJlbFwiPkFkZCBGb2xkZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzd2l0Y2gganNTd2l0Y2hlclwiIHJvbGU9XCJzd2l0Y2hcIiBhcmlhLWxhYmVsPVwicmVndWxhciBzd2l0Y2hcIiBhcmlhLWNoZWNrZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJvZmYtc2NyZWVuIEFjY2Vzc1JpZ2h0c1N3aXRjaFwiIG5hbWU9XCJzd2l0Y2hlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19vZmYtdGV4dFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPkRlbnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19sZXZlclwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2l0Y2hfX29uLXRleHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5BbGxvdzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1zZXBhcmF0b3JcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXItc3dpdGNoXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoLWxhYmVsXCI+U2hhcmUgZmlsZXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzd2l0Y2gganNTd2l0Y2hlclwiIHJvbGU9XCJzd2l0Y2hcIiBhcmlhLWxhYmVsPVwicmVndWxhciBzd2l0Y2hcIiBhcmlhLWNoZWNrZWQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJvZmYtc2NyZWVuIEFjY2Vzc1JpZ2h0c1N3aXRjaFwiIG5hbWU9XCJzd2l0Y2hlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19vZmYtdGV4dFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPkRlbnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpdGNoX19sZXZlclwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2l0Y2hfX29uLXRleHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5BbGxvdzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZm9vdGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVzZXJGb3JtLWZpZWxkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwid2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuLWFkZFVzZXJDYW5jZWxcIiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImFjdGlvblwiPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+IFxyXG4gICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyRm9ybS1maWVsZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0taW5wdXQtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIndhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bi1hZGRVc2VyQWNlcHRcIiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImFjdGlvblwiPkFjY2VwdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+IFxyXG4gICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tZmllbGQtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8L2Rpdj4gXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9mb3JtPlxyXG4gICAgPC9kaXY+YDtcclxuXHJcbi8qIGxldCBodG1sU2VhcmNoVXNlclRlbXBsYXRlID0gYDxkaXYgaWQ9XCJzZWFyY2hVc2VyTW9kYWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczEyIG0xMlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgaWQ9XCJzZWFyY2hVc2VyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxIG0xXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwic2VhcmNoVXNlck5hbWVcIiB0eXBlPVwidGV4dFwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2Vyc0xpc3RcIj5TZWFyY2ggVXNlcjwvbGFiZWw+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJ1c2VyLUxpc3RcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCIgaWQ9XCJidG5TZWFyY2hVc2VyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzNCBtNFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHM5IG05XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczIgbTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwid2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeSByaWdodFwiIGlkPVwiYnRuLVNlYXJjaFVzZXJDYW5jZWxcIiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImFjdGlvblwiPkNhbmNlbDwvYnV0dG9uPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMSBtMVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gOyAqL1xyXG4vKmxldCBodG1sU2VhcmNoVXNlclRlbXBsYXRlID0gYFxyXG48ZGl2IGNsYXNzPVwidXNlckZvcm0tY29udGFpbmVyXCI+XHJcbiAgPGRpdiBpZD1cInVzZXJzXCIgY2xhc3M9XCJ1c2VyRm9ybS1jb250ZW50XCI+XHJcbiAgPGlucHV0IGNsYXNzPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIiAvPlxyXG4gIDxzcGFuIGNsYXNzPVwic29ydFwiIGRhdGEtc29ydD1cIlVzZXJOYW1lXCI+U29ydCBieSBuYW1lPC9zcGFuPlxyXG4gIDxzcGFuIGNsYXNzPVwic29ydFwiIGRhdGEtc29ydD1cIkNvbXBhbnlOYW1lXCI+U29ydCBieSBDb21wYW55IE5hbWU8L3NwYW4+XHJcbiAgPGRpdiBjbGFzcz1cImhlYWQtbGlzdFwiPlxyXG4gICAgICA8ZGl2PlVzZXJJZDwvZGl2PiBcclxuICAgICAgPGRpdj5Vc2VyTmFtZTwvZGl2PlxyXG4gICAgICA8ZGl2PkNvbXBhbnlOYW1lPC9kaXY+XHJcbiAgICAgIDxkaXY+Um9vdFBhdGg8L2Rpdj5cclxuICAgICAgPGRpdj5BY2Nlc3NTdHJpbmc8L2Rpdj5cclxuICAgICAgPGRpdj5FeHBpcmF0ZURhdGU8L2Rpdj5cclxuICA8L2Rpdj4gICAgIFxyXG4gIDx1bCBpZD1cInRhYmxlTGlzdFwiIGNsYXNzPVwibGlzdFwiPlxyXG4gIDwvdWw+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gOyovXHJcblxyXG5sZXQgaHRtbFNlYXJjaFVzZXJUZW1wbGF0ZSA9IGBcclxuPGRpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImhlYWQtVGl0bGVcIj5FZGl0IFVzZXJzPC9kaXY+IFxyXG4gICAgICA8dGFibGUgaWQ9XCJ1c2Vyc1RhYmxlTGlzdFwiIGNsYXNzPVwidGFibGVMaXN0XCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGg+VXNlciBJZDwvdGg+XHJcbiAgICAgICAgICAgIDx0aD5Vc2VyIE5hbWU8L3RoPlxyXG4gICAgICAgICAgICA8dGg+VXNlciBSb2xlPC90aD5cclxuICAgICAgICAgICAgPHRoPkNvbXBhbnkgTmFtZTwvdGg+XHJcbiAgICAgICAgICAgIDx0aD5Sb290IFBhdGg8L2Rpdj5cclxuICAgICAgICAgICAgPHRoIGRhdGEtdHlwZT1cImRhdGVcIiBkYXRhLWZvcm1hdD1cIllZWVkvTU0vRERcIj5FeHBpcmF0ZSBEYXRlPC90aD5cclxuICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICA8L3RyPlxyXG4gICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgPHRib2R5IGlkPVwiYm9keUxpc3RcIj4gICAgXHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgICAgPGRpdiBjbGFzcz1cIkFkZFVzZXJNb2RhbENvbnRlbnQtZm9vdGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIndhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bi1FZGl0VXNlckNhbmNlbFwiIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYWN0aW9uXCI+Q2xvc2U8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj4gXHJcbiAgICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbmNvbnN0IGNoZWNrQWNjZXNzUmlnaHRzID0gKGFTd2l0Y2gsIHJvbGUsIGFjY2Vzc1JpZ2h0cykgPT4ge1xyXG4gICAgbGV0IG9wdCA9IFwiXCI7XHJcbiAgICAvL2xldCBhQWNjZXNzUmlnaHRzID0gc3BsaXQoYWNjZXNzUmlnaHRzLCBcIixcIik7XHJcbiAgICBcclxuICAgIGlmIChyb2xlICE9PSBcIkN1c3RvbVwiKSB7XHJcbiAgICAgICAgc3dpdGNoIChyb2xlLnRvVXBwZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcIlVTRVJcIjpcclxuICAgICAgICAgICAgICAgIG9wdCA9IFwib3B0MVwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBRE1JTlwiOlxyXG4gICAgICAgICAgICAgICAgb3B0ID0gXCJvcHQyXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFEVkFOQ0VEIFVTRVJcIjpcclxuICAgICAgICAgICAgICAgIG9wdCA9IFwib3B0M1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYW5nZUFjY2Vzc1JpZ2h0cyhhU3dpdGNoLCBvcHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYVN3aXRjaFswXS5jaGVja2VkID0gYWNjZXNzUmlnaHRzLmRvd25sb2FkIDtcclxuICAgICAgYVN3aXRjaFsxXS5jaGVja2VkID0gYWNjZXNzUmlnaHRzLnVwbG9hZDtcclxuICAgICAgYVN3aXRjaFsyXS5jaGVja2VkID0gYWNjZXNzUmlnaHRzLmRlbGV0ZWZpbGU7XHJcbiAgICAgIGFTd2l0Y2hbM10uY2hlY2tlZCA9IGFjY2Vzc1JpZ2h0cy5kZWxldGVmb2xkZXIgO1xyXG4gICAgICBhU3dpdGNoWzRdLmNoZWNrZWQgPSBhY2Nlc3NSaWdodHMuYWRkZm9sZGVyO1xyXG4gICAgICBhU3dpdGNoWzVdLmNoZWNrZWQgPSBhY2Nlc3NSaWdodHMuc2hhcmVmaWxlczsgICAgXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBjaGFuZ2VBY2Nlc3NSaWdodHMgPSAoQWNjZXNzU3dpdGNoLCBvcHQpID0+IHtcclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQWNjZXNzU3dpdGNoLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgQWNjZXNzU3dpdGNoW3hdLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKG9wdCkge1xyXG4gICAgICAgIGNhc2UgXCJvcHQxXCI6XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFswXS5jaGVja2VkID0gdHJ1ZTsgLy9Eb3dubG9hZFxyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbMV0uY2hlY2tlZCA9IHRydWU7IC8vVXBsb2FkXHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFsyXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFszXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs1XS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFsyXS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFszXS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs0XS5jaGVja2VkID0gdHJ1ZTsgLy8gQWRkIEZvbGRlcnNcclxuICAgICAgICAgICAgQWNjZXNzU3dpdGNoWzRdLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgQWNjZXNzU3dpdGNoWzVdLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm9wdDJcIjpcclxuICAgICAgICAgICAgQWNjZXNzU3dpdGNoWzBdLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbMV0uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFsyXS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgQWNjZXNzU3dpdGNoWzNdLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbNF0uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs1XS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIm9wdDNcIjpcclxuICAgICAgICAgICAgQWNjZXNzU3dpdGNoWzBdLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbMV0uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFsyXS5jaGVja2VkID0gZmFsc2U7IC8vIERlbGV0ZSBGaWxlc1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbMl0uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbM10uY2hlY2tlZCA9IGZhbHNlOyAvLyBEZWxldGUgRm9sZGVyc1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbM10uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBBY2Nlc3NTd2l0Y2hbNF0uY2hlY2tlZCA9IHRydWU7IC8vIEFkZCBGb2xkZXJzXHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs0XS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs1XS5jaGVja2VkID0gdHJ1ZTsgLy8gU2hhcmVkIEZpbGVzXHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs1XS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJvcHQ0XCI6XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFswXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFsxXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFsyXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFszXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs0XS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIEFjY2Vzc1N3aXRjaFs1XS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgX2VkaXRVc2VyID0gKHVzZXJJZCwgY2FsbGJhY2spID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgYXhpb3NcclxuICAgICAgICAuZ2V0KFwiL3VzZXIvXCIgKyB1c2VySWQsIHtcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDMwMDAwXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoZCkgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZC5kYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkLmRhdGEuZGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgIHNob3dUb2FzdChcclxuICAgICAgICAgICAgICAgIFwiU2VhcmNoIFVzZXJzXCIsXHJcbiAgICAgICAgICAgICAgICBcIkVycm9yIGFsIGJ1c2NhciB1c3VhcmlvLjxicj5FcnI6XCIgKyBlLFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuY29uc3QgX3JlbW92ZVVzZXIgPSAodXNlcklkLCB1c2VyTmFtZSwgY2FsbGJhY2spID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgYXhpb3Moe1xyXG4gICAgICAgICAgICB1cmw6IFwiL3VzZXIvXCIgKyB1c2VySWQsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogXCJCZWFyZXIgXCIgKyB1c2VyRGF0YS5Ub2tlblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aW1lb3V0OiAzMDAwMCxcclxuICAgICAgICAgICAgbWV0aG9kOiAnZGVsZXRlJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgdXNlck5hbWU6IHVzZXJOYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChkKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhkKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soZC5kYXRhLmRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICBzaG93VG9hc3QoXHJcbiAgICAgICAgICAgICAgICBcIlNlYXJjaCBVc2Vyc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJFcnJvciBhbCBib3JyYXIgdXN1YXJpby48YnI+RXJyOlwiICsgZSxcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaFVzZXJOYW1lKHVzZXJOYW1lKSB7XHJcbiAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyh1c2VyTmFtZSk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgIGF4aW9zXHJcbiAgICAgICAgLmdldCgnL3NlYXJjaHVzZXI/dXNlck5hbWU9XCIgKyB1c2VyTmFtZScsIHtcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDMwMDAwXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihkID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICBpZiAoZC5kYXRhLnN0YXR1cyA9PSBcIk9LXCIpIHtcclxuICAgICAgICAgICAgICAgIHNob3dBZGRVc2VyRm9ybShcIkVkaXQgVXNlclwiLCBkLmRhdGEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KFwiU2VhcmNoIFVzZXJzXCIsIGQuZGF0YS5tZXNzYWdlLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICBzaG93VG9hc3QoXHJcbiAgICAgICAgICAgICAgICBcIlNlYXJjaCBVc2Vyc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJFcnJvciBhbCBidXNjYXIgdXN1YXJpbyBcIiArIHVzZXJOYW1lICsgXCIuPGJyPkVycjpcIiArIGUsXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlZGl0VXNlcigpIHtcclxuICAgIGxldCBBZGRVc2VyTW9kYWxDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNBZGRVc2VyTW9kYWxDb250ZW50XCIpO1xyXG4gICAgbGV0IGNvbnRhaW5lck92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1vdmVybGF5XCIpO1xyXG5cclxuICAgIEFkZFVzZXJNb2RhbENvbnRlbnQuaW5uZXJIVE1MID0gaHRtbFNlYXJjaFVzZXJUZW1wbGF0ZTtcclxuICAgICR1KFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikuYWRkQ2xhc3MoXCJlZGl0XCIpO1xyXG4gICAgQWRkVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICBheGlvc1xyXG4gICAgICAgIC5nZXQoXCIvdXNlcnNcIiwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IFwiQmVhcmVyIFwiICsgdXNlckRhdGEuVG9rZW5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGltZW91dDogMzAwMDBcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGQgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgICAgIGlmIChkLmRhdGEuc3RhdHVzID09PSBcIk9LXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VycyA9IGQuZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbExpc3RDb250ZW50ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5TGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm9keUxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcInVzZXJzOiBcIiwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHVzZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNEYXRlID0gKHVzZXJzW2ldLkV4cGlyYXRlRGF0ZSkgPyB1c2Vyc1tpXS5FeHBpcmF0ZURhdGUgOiAnbmV2ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWxMaXN0Q29udGVudCArPSBgXHJcbiAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImRhdGEtcm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7dXNlcnNbaV0uVXNlcklkfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7dXNlcnNbaV0uVXNlck5hbWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+JHt1c2Vyc1tpXS5Vc2VyUm9sZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD4ke3VzZXJzW2ldLkNvbXBhbnlOYW1lfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7dXNlcnNbaV0uUm9vdFBhdGh9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+JHtzRGF0ZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICA8aSBpZD1cIiR7dXNlcnNbaV0uVXNlcklkfS1pZFwiIGNsYXNzPVwiZmFzIGZhLXVzZXItZWRpdCBlZGl0LXVzZXItaWNvblwiIHRpdGxlPVwiRWRpdGFyIFVzdWFyaW9cIj48L2k+YDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlcnNbaV0uVXNlclJvbGUudHJpbSgpLnRvVXBwZXJDYXNlKCkgIT09ICdBRE1JTicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbExpc3RDb250ZW50ICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8aSBpZD1cIiR7dXNlcnNbaV0uVXNlcklkfS1pZFwiIGNsYXNzPVwiZmFzIGZhLXVzZXItdGltZXMgZGVsLXVzZXItaWNvblwiIHRpdGxlPVwiQm9ycmFyIFVzdWFyaW9cIj48L2k+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgPC90cj5gO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxMaXN0Q29udGVudCArPSBgJm5ic3A7PC90ZD48L3RyPmA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1VzZXIgUm9sZS4gJyx1c2Vyc1tpXS5Vc2VyUm9sZS50cmltKCkudG9VcHBlckNhc2UoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib2R5TGlzdC5pbm5lckhUTUwgPSBodG1sTGlzdENvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHRhYmxlID0gbmV3IERhdGFUYWJsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3VzZXJzVGFibGVMaXN0XCIpLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmaXhlZEhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBwZXJQYWdlU2VsZWN0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHBlclBhZ2U6IDIwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGVsLXVzZXItaWNvblwiKSwgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcklkID0gZS50YXJnZXQuaWQuc2xpY2UoMCwgLTMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlck5hbWUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bMV0uaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyTmFtZSA9IHVzZXJOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdXNlck5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlcklkOiBcIiwgdXNlcklkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlbW92ZVVzZXIodXNlcklkLCB1c2VyTmFtZSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dUb2FzdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRlbGV0ZSBVc2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFVzdWFyaW8gJHt1c2VyTmFtZX0gYm9ycmFkb2AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR1KFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikucmVtb3ZlQ2xhc3MoXCJlZGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJNb2RcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lZGl0LXVzZXItaWNvblwiKSwgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcklkID0gZS50YXJnZXQuaWQuc2xpY2UoMCwgLTMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXJJZDogXCIsIHVzZXJJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9lZGl0VXNlcih1c2VySWQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHUoXCIjQWRkVXNlck1vZGFsQ29udGVudFwiKS5yZW1vdmVDbGFzcyhcImVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1vdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBZGRVc2VyRm9ybSgnRWRpdCBVc2VyJywgZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG4tRWRpdFVzZXJDYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICAkdShcIiNBZGRVc2VyTW9kYWxDb250ZW50XCIpLnJlbW92ZUNsYXNzKFwiZWRpdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KFwiVXNlcnNcIiwgZC5kYXRhLmRhdGEubWVzc2FnZSwgXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIHNob3dUb2FzdChcIlVzZXJzXCIsIGUsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RSb2xlKGVsZW1lbnQsIHJvbGUpIHtcclxuICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKHJvbGUpO1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBlbGVtZW50Lm9wdGlvbnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9wdGlvbjogXCIsIGVsZW1lbnQub3B0aW9uc1t4XS50ZXh0KTtcclxuICAgICAgICBpZiAoZWxlbWVudC5vcHRpb25zW3hdLnRleHQudG9VcHBlckNhc2UoKSA9PT0gcm9sZS50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQub3B0aW9uc1t4XS5zZWxlY3RlZCA9IFwic2VsZWN0ZWRcIjtcclxuICAgICAgICAgICAgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0geDtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIilcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3B0aW9uIHNlbGVjdGVkOiBcIiwgZWxlbWVudC5vcHRpb25zW3hdLnRleHQpO1xyXG4gICAgICAgICAgICBpZiAocm9sZS50b1VwcGVyQ2FzZSgpICE9PSBcIkNVU1RPTVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3NSaWdodHMoXHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5BY2Nlc3NSaWdodHNTd2l0Y2hcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vcHRpb25zW3hdLnZhbHVlXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNob3dBZGRVc2VyRm9ybSh0aXRsZSwgZGF0YSkge1xyXG4gICAgbGV0IEFkZFVzZXJNb2RhbENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIik7XHJcbiAgICBsZXQgY29udGFpbmVyT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyLW92ZXJsYXlcIik7XHJcblxyXG4gICAgbGV0IG1vZGUgPSBkYXRhID8gXCJlZGl0XCIgOiBcImFkZFwiO1xyXG4gICAgbGV0IG9sZERhdGEgPSBudWxsO1xyXG5cclxuICAgIEFkZFVzZXJNb2RhbENvbnRlbnQuaW5uZXJIVE1MID0gaHRtbFVzZXJGb3JtVGVtcGxhdGU7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikuY2xhc3NMaXN0LnJlbW92ZShcImVkaXRcIik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikuY2xhc3NMaXN0LmFkZChcInNob3dcIik7XHJcbiAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKCdzaG93QWRkVXNlckZvcm06ICcsIGRhdGEpO1xyXG4gICAgICAgIG9sZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVzZXJGb3JtLXRpdGxlXCIpLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjVXNlck5hbWVcIikudmFsdWUgPSBkYXRhLlVzZXJOYW1lO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjQ29tcGFueU5hbWVcIikudmFsdWUgPSBkYXRhLkNvbXBhbnlOYW1lO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjVXNlclBhc3N3ZFwiKS52YWx1ZSA9IEJhc2U2NC5kZWNvZGUoZGF0YS5Vc2VyUGFzc3dkKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlcGVhdFVzZXJQYXNzd2RcIikudmFsdWUgPSBkYXRhLlVzZXJQYXNzd2Q7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNSb290UGF0aFwiKS52YWx1ZSA9IGRhdGEuUm9vdFBhdGg7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNFeHBpcmF0ZURhdGVcIikudmFsdWUgPSBkYXRhLkV4cGlyYXRlRGF0ZTtcclxuICAgICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXhwaXJhdGlvbkRhdGVcIilcclxuICAgICAgICBzZWxlY3RSb2xlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjUm9sZU9wdGlvbnNcIiksIGRhdGEuVXNlclJvbGUpO1xyXG4gICAgICAgIGxldCBhU3dpdGNoID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuQWNjZXNzUmlnaHRzU3dpdGNoXCIpO1xyXG4gICAgICAgIGlmIChkYXRhLlVzZXJSb2xlLnRvVXBwZXJDYXNlKCkgPT09IFwiQ1VTVE9NXCIpe1xyXG4gICAgICAgICAgY2hlY2tBY2Nlc3NSaWdodHMoYVN3aXRjaCwgZGF0YS5Vc2VyUm9sZSxKU09OLnBhcnNlKGRhdGEuQWNjZXNzU3RyaW5nKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1VzZXJOYW1lXCIpLmNsYXNzTGlzdC5hZGQoXCJ1c2VkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjQ29tcGFueU5hbWVcIikuY2xhc3NMaXN0LmFkZChcInVzZWRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNVc2VyUGFzc3dkXCIpLmNsYXNzTGlzdC5hZGQoXCJ1c2VkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVwZWF0VXNlclBhc3N3ZFwiKS5jbGFzc0xpc3QuYWRkKFwidXNlZFwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1Jvb3RQYXRoXCIpLmNsYXNzTGlzdC5hZGQoXCJ1c2VkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjVXNlck5hbWVcIikuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuLWFkZFVzZXJDYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIEFkZFVzZXJNb2RhbENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAkdShcIiNBZGRVc2VyTW9kYWxDb250ZW50XCIpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuLWFkZFVzZXJBY2VwdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ29sZERhdGE6Jywgb2xkRGF0YSk7XHJcbiAgICAgICAgICAgIF91cGRhdGVVc2VyKG9sZERhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1VzZXJOYW1lXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJ1c2VkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjQ29tcGFueU5hbWVcIikuY2xhc3NMaXN0LnJlbW92ZShcInVzZWRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNVc2VyUGFzc3dkXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJ1c2VkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVwZWF0VXNlclBhc3N3ZFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwidXNlZFwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1Jvb3RQYXRoXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJ1c2VkXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgY2hhbmdlQWNjZXNzUmlnaHRzKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLkFjY2Vzc1JpZ2h0c1N3aXRjaFwiKSxcclxuICAgICAgICAgICAgXCJvcHQxXCJcclxuICAgICAgICApO1xyXG4gICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI2J0bi1hZGRVc2VyQ2FuY2VsXCIpXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICR1KFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICAgICAgQWRkVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuLWFkZFVzZXJBY2VwdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgX2FkZFVzZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi51c2VyRm9ybS1pbnB1dFwiKSwgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAmJiBlLnRhcmdldC5pZCAhPT0gJ0V4cGlyYXRlRGF0ZScpIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyBlLnRhcmdldC5pZCkuY2xhc3NMaXN0LmFkZChcInVzZWRcIik7XHJcbiAgICAgICAgZWxzZSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgZS50YXJnZXQuaWQpLmNsYXNzTGlzdC5yZW1vdmUoXCJ1c2VkXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pOyBcclxuXHJcbiAgICBsZXQgc2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuXHJcbiAgICAkKFwiLkFjY2Vzc1JpZ2h0c1N3aXRjaFwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuaXMoXCI6Y2hlY2tlZFwiKSkge1xyXG4gICAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIklzIGNoZWNrZWRcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJJcyBOb3QgY2hlY2tlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBzZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBlID0+IHtcclxuICAgICAgICBsZXQgb3B0ID0gZS50YXJnZXRbZS50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcbiAgICAgICAgbGV0IEFjY2Vzc1N3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuQWNjZXNzUmlnaHRzU3dpdGNoXCIpO1xyXG4gICAgICAgIGNoYW5nZUFjY2Vzc1JpZ2h0cyhBY2Nlc3NTd2l0Y2gsIG9wdCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBfZ2V0VXNlclJvbGUgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHNlbC5vcHRpb25zW3NlbC5zZWxlY3RlZEluZGV4XS50ZXh0O1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfZ2V0Q2hhbmdlcyA9ICgpID0+IHtcclxuICAgICAgICBsZXQgQWNjZXNzU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5BY2Nlc3NSaWdodHNTd2l0Y2hcIik7XHJcbiAgICAgICAgbGV0IGFjY2Vzc1N0cmluZyA9IF9nZXRBY2Nlc3NTdHJpbmcoQWNjZXNzU3dpdGNoKTtcclxuICAgICAgICBsZXQgdXNlclJvbGUgPSBfZ2V0VXNlclJvbGUoKTtcclxuICAgICAgICBsZXQgcXVlcnlTdHJpbmcgPSB7fTtcclxuICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhvbGREYXRhKTtcclxuICAgICAgICBmb3IgKGxldCBwcm9wIGluIG9sZERhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2xkRGF0YSwgcHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiVXNlclJvbGVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGREYXRhW3Byb3BdLnRvVXBwZXJDYXNlKCkgIT09IHVzZXJSb2xlLnRvVXBwZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcuVXNlclJvbGUgPSB1c2VyUm9sZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG9sZERhdGFbcHJvcF0sIHVzZXJSb2xlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvbGREYXRhW3Byb3BdLCB1c2VyUm9sZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJBY2Nlc3NTdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb2xkIGFjY2Vzc1N0cmluZzogJywgb2xkRGF0YVtwcm9wXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgYWNjZXNzU3RyaW5nOiAnLCBkZWNvZGVVUkkoYWNjZXNzU3RyaW5nKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbGREYXRhW3Byb3BdICE9PSBkZWNvZGVVUkkoYWNjZXNzU3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG9sZERhdGFbcHJvcF0sIGFjY2Vzc1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVN0cmluZy5BY2Nlc3NTdHJpbmcgPSBhY2Nlc3NTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvbGREYXRhW3Byb3BdLCBhY2Nlc3NTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiRXhwaXJhdGVEYXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbGREYXRhW3Byb3BdID09PSBudWxsKSBvbGREYXRhW3Byb3BdID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbGREYXRhW3Byb3BdICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wKS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nLkV4cGlyYXRlRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3ApLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nLlVuaXhEYXRlID0gbW9tZW50KHF1ZXJ5U3RyaW5nLkV4cGlyYXRlRGF0ZSkudW5peCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGREYXRhW3Byb3BdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wKS52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9sZERhdGFbcHJvcF0sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3ApLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wICE9PSBcIlVzZXJJZFwiICYmIHByb3AgIT09ICdNYXhGaWxlU2l6ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJVc2VyUGFzc3dkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9QYXNzd2QgPSBCYXNlNjQuZGVjb2RlKG9sZERhdGFbcHJvcF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgblBhc3N3ZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3ApLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnT2xkIFBhc3M6ICcsIG9QYXNzd2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTmV3IFBhc3M6ICcsIG5QYXNzd2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob1Bhc3N3ZCAhPT0gblBhc3N3ZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmdbcHJvcF0gPSBtZDUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcCkudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Byb3A6ICcscHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbGREYXRhW3Byb3BdLnRvVXBwZXJDYXNlKCkgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3ApLnZhbHVlLnRvVXBwZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nW3Byb3BdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcCkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkRGF0YVtwcm9wXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wKS52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9sZERhdGFbcHJvcF0sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3ApLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhxdWVyeVN0cmluZyk7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfdXBkYXRlVXNlciA9IChvRGF0YSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT09PT09PT09PT0gb0RhdGE6IFwiLG9EYXRhKTtcclxuXHJcbiAgICAgICAgbGV0IF9nb0JhY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjQWRkVXNlck1vZGFsQ29udGVudFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjQWRkVXNlck1vZGFsQ29udGVudFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXItb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlck1vZFwiKS5jbGljaygpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBxdWVyeVN0cmluZyA9IF9nZXRDaGFuZ2VzKCk7XHJcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5U3RyaW5nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgdXNlck5hbWU6IG9EYXRhLlVzZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgdXNlcklkOiBvRGF0YS5Vc2VySWQsXHJcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZzogcXVlcnlTdHJpbmdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09PT09PT09PT09IHVzZXJOYW1lOiBcIixkYXRhLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgIGF4aW9zXHJcbiAgICAgICAgICAgICAgICAucG9zdChcIi91cGRhdGV1c2VyXCIsIGRhdGEsIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAzMDAwMFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkLmRhdGEuc3RhdHVzID09PSBcIk9LXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVc2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkRhdG9zIHVzdWFyaW8gXCIgKyBkYXRhLnVzZXJOYW1lICsgXCIgYWN0dWFsaXphZG9zLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXJ5U3RyaW5nLmhhc093blByb3BlcnR5KCdSb290UGF0aCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZnJlc2hcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZ29CYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICBzaG93VG9hc3QoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRXJyb3IgYWwgZ3JhYmFyIGxvcyBjYW1iaW9zIHBhcmEgZWwgdXN1YXJpbyBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudXNlck5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIi48YnI+RXJyOlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF9nb0JhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9nZXRBY2Nlc3NTdHJpbmcgPSBBY2Nlc3NTd2l0Y2ggPT4ge1xyXG4gICAgICAgIGxldCBhY2Nlc3NOYW1lID0gW1xyXG4gICAgICBcImRvd25sb2FkXCIsXHJcbiAgICAgIFwidXBsb2FkXCIsXHJcbiAgICAgIFwiZGVsZXRlZmlsZVwiLFxyXG4gICAgICBcImRlbGV0ZWZvbGRlclwiLFxyXG4gICAgICBcImFkZGZvbGRlclwiLFxyXG4gICAgICBcInNoYXJlZmlsZXNcIlxyXG4gICAgXTtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICBsZXQgdiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEFjY2Vzc1N3aXRjaC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoQWNjZXNzU3dpdGNoW3hdLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgIHYgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh4ICE9IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnLFwiJyArIGFjY2Vzc05hbWVbeF0gKyAnXCI6JyArIHY7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJ1wiJyArIGFjY2Vzc05hbWVbeF0gKyAnXCI6JyArIHY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRBY2Nlc3NTdHJpbmc6IFwiLCByZXN1bHQpO1xyXG4gICAgICAgIHJldHVybiBlbmNvZGVVUkkoXCJ7XCIgKyByZXN1bHQgKyBcIn1cIik7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9hZGRVc2VyID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBBY2Nlc3NTd2l0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLkFjY2Vzc1JpZ2h0c1N3aXRjaFwiKTtcclxuICAgICAgICBsZXQgdXNlck5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1VzZXJOYW1lXCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCBjb21wYW55TmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjQ29tcGFueU5hbWVcIikudmFsdWU7XHJcbiAgICAgICAgbGV0IHVzZXJQYXNzd29yZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjVXNlclBhc3N3ZFwiKS52YWx1ZTtcclxuICAgICAgICBsZXQgdXNlclJvbGUgPSBzZWxbc2VsLnNlbGVjdGVkSW5kZXhdLmlubmVySFRNTDtcclxuICAgICAgICBsZXQgdXNlclJvb3RQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNSb290UGF0aFwiKS52YWx1ZTtcclxuICAgICAgICBsZXQgZXhwaXJhdGVEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNFeHBpcmF0ZURhdGVcIikudmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh1c2VyUm9vdFBhdGgudHJpbSgpID09PSBcIlwiICYmIHVzZXJSb2xlICE9PSBcIkFkbWluXCIpIHtcclxuICAgICAgICAgICAgc2hvd1RvYXN0KFwiTmV3IFVzZXJcIiwgXCJFbXB0eSBSb290UGF0aCBcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IF9nZXRBY2Nlc3NTdHJpbmcoQWNjZXNzU3dpdGNoKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJOYW1lOiB1c2VyTmFtZSxcclxuICAgICAgICAgICAgdXNlclBhc3N3b3JkOiBCYXNlNjQuZW5jb2RlKG1kNSh1c2VyUGFzc3dvcmQpKSxcclxuICAgICAgICAgICAgY29tcGFueU5hbWU6IGNvbXBhbnlOYW1lLFxyXG4gICAgICAgICAgICB1c2VyUm9sZTogdXNlclJvbGUsXHJcbiAgICAgICAgICAgIGV4cGlyYXRlRGF0ZTogZXhwaXJhdGVEYXRlLFxyXG4gICAgICAgICAgICByb290UGF0aDogdXNlclJvb3RQYXRoLFxyXG4gICAgICAgICAgICBhY2Nlc3NSaWdodHM6IHJlc3VsdCxcclxuICAgICAgICAgICAgdW5peERhdGU6IG1vbWVudChleHBpcmF0ZURhdGUpLnVuaXgoKSxcclxuICAgICAgICAgICAgdXNlckVtYWlsOiB1c2VyTmFtZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgYXhpb3MucG9zdChcIi9hZGR1c2VyXCIsIGRhdGEsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogMzAwMDBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGQuZGF0YS5zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQuZGF0YS5zdGF0dXMgPT09IFwiT0tcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dUb2FzdChcIlVzdWFyaW8gXCIgKyBkLmRhdGEubWVzc2FnZSwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVmcmVzaFwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9ybUFkZFVzZXJcIikucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi51c2VyRm9ybS1pbnB1dFwiKSwgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpZihlbC5pZCAhPT0gJ0V4cGlyYXRlRGF0ZScpeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIGVsLmlkKS5jbGFzc0xpc3QucmVtb3ZlKFwidXNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc1JpZ2h0cyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLkFjY2Vzc1JpZ2h0c1N3aXRjaFwiKSwgXCJvcHQxXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93VG9hc3QoXCJVc3VhcmlvIFwiLCBcIkVycm9yIGFsIGHDsWFkaXIgdXN1cmlvIFwiICsgZC5kYXRhLm1lc3NhZ2UsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVXNlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRXJyb3IgYWwgYcOxYWRpciB1c3VhcmlvIFwiICsgZGF0YS5Vc2VyTmFtZSArIFwiLjxicj5FcnI6XCIgKyBlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBFbmQgdXNlciBtYW5hZ2UgbW9kdWxlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIiwiLyohXHJcbiAqXHJcbiAqIFZhbmlsbGEtRGF0YVRhYmxlc1xyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNyBLYXJsIFNhdW5kZXJzIChodHRwOi8vbW9iaXVzLm92aClcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcclxuICpcclxuICogVmVyc2lvbjogMS42LjE1XHJcbiAqXHJcbiAqL1xyXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xyXG4gIHZhciBwbHVnaW4gPSBcIkRhdGFUYWJsZVwiO1xyXG5cclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHBsdWdpbik7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICBkZWZpbmUoW10sIGZhY3RvcnkocGx1Z2luKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgcm9vdFtwbHVnaW5dID0gZmFjdG9yeShwbHVnaW4pO1xyXG4gIH1cclxufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzLndpbmRvdyB8fCB0aGlzLmdsb2JhbCwgZnVuY3Rpb24ocGx1Z2luKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgdmFyIHdpbiA9IHdpbmRvdyxcclxuICAgICAgZG9jID0gZG9jdW1lbnQsXHJcbiAgICAgIGJvZHkgPSBkb2MuYm9keTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVmYXVsdCBjb25maWd1cmF0aW9uXHJcbiAgICogQHR5cCB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHZhciBkZWZhdWx0Q29uZmlnID0ge1xyXG4gICAgICBwZXJQYWdlOiAxMCxcclxuICAgICAgcGVyUGFnZVNlbGVjdDogWzUsIDEwLCAxNSwgMjAsIDI1XSxcclxuXHJcbiAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxyXG4gICAgICBpbmZvOiB0cnVlLFxyXG5cclxuICAgICAgLy8gUGFnaW5hdGlvblxyXG4gICAgICBuZXh0UHJldjogdHJ1ZSxcclxuICAgICAgZmlyc3RMYXN0OiBmYWxzZSxcclxuICAgICAgcHJldlRleHQ6IFwiJmxzYXF1bztcIixcclxuICAgICAgbmV4dFRleHQ6IFwiJnJzYXF1bztcIixcclxuICAgICAgZmlyc3RUZXh0OiBcIiZsYXF1bztcIixcclxuICAgICAgbGFzdFRleHQ6IFwiJnJhcXVvO1wiLFxyXG4gICAgICBlbGxpcHNpc1RleHQ6IFwiJmhlbGxpcDtcIixcclxuICAgICAgYXNjVGV4dDogXCLilrRcIixcclxuICAgICAgZGVzY1RleHQ6IFwi4pa+XCIsXHJcbiAgICAgIHRydW5jYXRlUGFnZXI6IHRydWUsXHJcbiAgICAgIHBhZ2VyRGVsdGE6IDIsXHJcblxyXG4gICAgICBmaXhlZENvbHVtbnM6IHRydWUsXHJcbiAgICAgIGZpeGVkSGVpZ2h0OiBmYWxzZSxcclxuXHJcbiAgICAgIGhlYWRlcjogdHJ1ZSxcclxuICAgICAgZm9vdGVyOiBmYWxzZSxcclxuXHJcbiAgICAgIC8vIEN1c3RvbWlzZSB0aGUgZGlzcGxheSB0ZXh0XHJcbiAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgcGxhY2Vob2xkZXI6IFwiU2VhcmNoLi4uXCIsIC8vIFRoZSBzZWFyY2ggaW5wdXQgcGxhY2Vob2xkZXJcclxuICAgICAgICAgIHBlclBhZ2U6IFwie3NlbGVjdH0gZW50cmllcyBwZXIgcGFnZVwiLCAvLyBwZXItcGFnZSBkcm9wZG93biBsYWJlbFxyXG4gICAgICAgICAgbm9Sb3dzOiBcIk5vIGVudHJpZXMgZm91bmRcIiwgLy8gTWVzc2FnZSBzaG93biB3aGVuIHRoZXJlIGFyZSBubyBzZWFyY2ggcmVzdWx0c1xyXG4gICAgICAgICAgaW5mbzogXCJTaG93aW5nIHtzdGFydH0gdG8ge2VuZH0gb2Yge3Jvd3N9IGVudHJpZXNcIiAvL1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gQ3VzdG9taXNlIHRoZSBsYXlvdXRcclxuICAgICAgbGF5b3V0OiB7XHJcbiAgICAgICAgICB0b3A6IFwie3NlbGVjdH17c2VhcmNofVwiLFxyXG4gICAgICAgICAgYm90dG9tOiBcIntpbmZvfXtwYWdlcn1cIlxyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaXMgaXRlbSBpcyBvYmplY3RcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHZhciBpc09iamVjdCA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlzIGl0ZW0gaXMgYXJyYXlcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHZhciBpc0FycmF5ID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGZvciB2YWxpZCBKU09OIHN0cmluZ1xyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICBzdHJcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufEFycmF5fE9iamVjdH1cclxuICAgKi9cclxuICB2YXIgaXNKc29uID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICB2YXIgdCA9ICExO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgICAgdCA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgcmV0dXJuICExO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAhKG51bGwgPT09IHQgfHwgKCFpc0FycmF5KHQpICYmICFpc09iamVjdCh0KSkpICYmIHQ7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogTWVyZ2Ugb2JqZWN0cyAocmVjY3Vyc2l2ZSlcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChzcmMsIHByb3BzKSB7XHJcbiAgICAgIGZvciAodmFyIHByb3AgaW4gcHJvcHMpIHtcclxuICAgICAgICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgIHZhciB2YWwgPSBwcm9wc1twcm9wXTtcclxuICAgICAgICAgICAgICBpZiAodmFsICYmIGlzT2JqZWN0KHZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgc3JjW3Byb3BdID0gc3JjW3Byb3BdIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICBleHRlbmQoc3JjW3Byb3BdLCB2YWwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHNyY1twcm9wXSA9IHZhbDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNyYztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBJdGVyYXRvciBoZWxwZXJcclxuICAgKiBAcGFyYW0gIHsoQXJyYXl8T2JqZWN0KX0gICBhcnIgICAgIEFueSBvYmplY3QsIGFycmF5IG9yIGFycmF5LWxpa2UgY29sbGVjdGlvbi5cclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICBmbiAgICAgIENhbGxiYWNrXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgc2NvcGUgICBDaGFuZ2UgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIHZhciBlYWNoID0gZnVuY3Rpb24gKGFyciwgZm4sIHNjb3BlKSB7XHJcbiAgICAgIHZhciBuO1xyXG4gICAgICBpZiAoaXNPYmplY3QoYXJyKSkge1xyXG4gICAgICAgICAgZm9yIChuIGluIGFycikge1xyXG4gICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJyLCBuKSkge1xyXG4gICAgICAgICAgICAgICAgICBmbi5jYWxsKHNjb3BlLCBhcnJbbl0sIG4pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvciAobiA9IDA7IG4gPCBhcnIubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICBmbi5jYWxsKHNjb3BlLCBhcnJbbl0sIG4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRhcmdldFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gZWxcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGVcclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cclxuICAgKi9cclxuICB2YXIgb24gPSBmdW5jdGlvbiAoZWwsIGUsIGZuKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZSwgZm4sIGZhbHNlKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgRE9NIGVsZW1lbnQgbm9kZVxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICBhIG5vZGVOYW1lXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIGIgcHJvcGVydGllcyBhbmQgYXR0cmlidXRlc1xyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICB2YXIgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHZhciBkID0gZG9jLmNyZWF0ZUVsZW1lbnQoYSk7XHJcbiAgICAgIGlmIChiICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIGIpIHtcclxuICAgICAgICAgIHZhciBlO1xyXG4gICAgICAgICAgZm9yIChlIGluIGIpIHtcclxuICAgICAgICAgICAgICBpZiAoXCJodG1sXCIgPT09IGUpIHtcclxuICAgICAgICAgICAgICAgICAgZC5pbm5lckhUTUwgPSBiW2VdO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGQuc2V0QXR0cmlidXRlKGUsIGJbZV0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZDtcclxuICB9O1xyXG5cclxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoZWwsIGllKSB7XHJcbiAgICAgIGlmIChlbCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICBlYWNoKGVsLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgIGZsdXNoKGUsIGllKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGllKSB7XHJcbiAgICAgICAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYnV0dG9uIGhlbHBlclxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICBjXHJcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgIHBcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgdFxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICB2YXIgYnV0dG9uID0gZnVuY3Rpb24gKGMsIHAsIHQpIHtcclxuICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7XHJcbiAgICAgICAgICBjbGFzczogYyxcclxuICAgICAgICAgIGh0bWw6ICc8YSBocmVmPVwiI1wiIGRhdGEtcGFnZT1cIicgKyBwICsgJ1wiPicgKyB0ICsgXCI8L2E+XCJcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogY2xhc3NMaXN0IHNoaW1cclxuICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHZhciBjbGFzc0xpc3QgPSB7XHJcbiAgICAgIGFkZDogZnVuY3Rpb24gKHMsIGEpIHtcclxuICAgICAgICAgIGlmIChzLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgIHMuY2xhc3NMaXN0LmFkZChhKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjbGFzc0xpc3QuY29udGFpbnMocywgYSkpIHtcclxuICAgICAgICAgICAgICAgICAgcy5jbGFzc05hbWUgPSBzLmNsYXNzTmFtZS50cmltKCkgKyBcIiBcIiArIGE7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChzLCBhKSB7XHJcbiAgICAgICAgICBpZiAocy5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICBzLmNsYXNzTGlzdC5yZW1vdmUoYSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMocywgYSkpIHtcclxuICAgICAgICAgICAgICAgICAgcy5jbGFzc05hbWUgPSBzLmNsYXNzTmFtZS5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxzKVwiICsgYS5zcGxpdChcIiBcIikuam9pbihcInxcIikgKyBcIihcXFxcc3wkKVwiLCBcImdpXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgXCIgXCJcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAocywgYSkge1xyXG4gICAgICAgICAgaWYgKHMpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHMuY2xhc3NMaXN0ID9cclxuICAgICAgICAgICAgICAgICAgcy5jbGFzc0xpc3QuY29udGFpbnMoYSkgOlxyXG4gICAgICAgICAgICAgICAgICAhIXMuY2xhc3NOYW1lICYmXHJcbiAgICAgICAgICAgICAgICAgICEhcy5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cChcIihcXFxcc3xeKVwiICsgYSArIFwiKFxcXFxzfCQpXCIpKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEJ1YmJsZSBzb3J0IGFsZ29yaXRobVxyXG4gICAqL1xyXG4gIHZhciBzb3J0SXRlbXMgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB2YXIgYywgZDtcclxuICAgICAgaWYgKDEgPT09IGIpIHtcclxuICAgICAgICAgIGMgPSAwO1xyXG4gICAgICAgICAgZCA9IGEubGVuZ3RoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGIgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgYyA9IGEubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICBkID0gLTE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgZSA9ICEwOyBlOykge1xyXG4gICAgICAgICAgZSA9ICExO1xyXG4gICAgICAgICAgZm9yICh2YXIgZiA9IGM7IGYgIT0gZDsgZiArPSBiKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGFbZiArIGJdICYmIGFbZl0udmFsdWUgPiBhW2YgKyBiXS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZyA9IGFbZl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBoID0gYVtmICsgYl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBpID0gZztcclxuICAgICAgICAgICAgICAgICAgYVtmXSA9IGg7XHJcbiAgICAgICAgICAgICAgICAgIGFbZiArIGJdID0gaTtcclxuICAgICAgICAgICAgICAgICAgZSA9ICEwO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBQYWdlciB0cnVuY2F0aW9uIGFsZ29yaXRobVxyXG4gICAqL1xyXG4gIHZhciB0cnVuY2F0ZSA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCBlbGxpcHNpcykge1xyXG4gICAgICBkID0gZCB8fCAyO1xyXG4gICAgICB2YXIgaixcclxuICAgICAgICAgIGUgPSAyICogZCxcclxuICAgICAgICAgIGYgPSBiIC0gZCxcclxuICAgICAgICAgIGcgPSBiICsgZCxcclxuICAgICAgICAgIGggPSBbXSxcclxuICAgICAgICAgIGkgPSBbXTtcclxuICAgICAgaWYgKGIgPCA0IC0gZCArIGUpIHtcclxuICAgICAgICAgIGcgPSAzICsgZTtcclxuICAgICAgfSBlbHNlIGlmIChiID4gYyAtICgzIC0gZCArIGUpKSB7XHJcbiAgICAgICAgICBmID0gYyAtICgyICsgZSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgayA9IDE7IGsgPD0gYzsgaysrKSB7XHJcbiAgICAgICAgICBpZiAoMSA9PSBrIHx8IGsgPT0gYyB8fCAoayA+PSBmICYmIGsgPD0gZykpIHtcclxuICAgICAgICAgICAgICB2YXIgbCA9IGFbayAtIDFdO1xyXG4gICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUobCwgXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgaC5wdXNoKGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVhY2goaCwgZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgIHZhciBkID0gYy5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VcIik7XHJcbiAgICAgICAgICBpZiAoaikge1xyXG4gICAgICAgICAgICAgIHZhciBlID0gai5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VcIik7XHJcbiAgICAgICAgICAgICAgaWYgKGQgLSBlID09IDIpIGkucHVzaChhW2VdKTtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChkIC0gZSAhPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBmID0gY3JlYXRlRWxlbWVudChcImxpXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImVsbGlwc2lzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBodG1sOiAnPGEgaHJlZj1cIiNcIj4nICsgZWxsaXBzaXMgKyBcIjwvYT5cIlxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgaS5wdXNoKGYpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGkucHVzaChjKTtcclxuICAgICAgICAgIGogPSBjO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIGRhdGEgdG8gSFRNTCB0YWJsZVxyXG4gICAqL1xyXG4gIHZhciBkYXRhVG9UYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgIHZhciB0aGVhZCA9IGZhbHNlLFxyXG4gICAgICAgICAgdGJvZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMub3B0aW9ucy5kYXRhO1xyXG5cclxuICAgICAgaWYgKGRhdGEuaGVhZGluZ3MpIHtcclxuICAgICAgICAgIHRoZWFkID0gY3JlYXRlRWxlbWVudChcInRoZWFkXCIpO1xyXG4gICAgICAgICAgdmFyIHRyID0gY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICAgICAgZWFjaChkYXRhLmhlYWRpbmdzLCBmdW5jdGlvbiAoY29sKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHRkID0gY3JlYXRlRWxlbWVudChcInRoXCIsIHtcclxuICAgICAgICAgICAgICAgICAgaHRtbDogY29sXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhlYWQuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRib2R5ID0gY3JlYXRlRWxlbWVudChcInRib2R5XCIpO1xyXG4gICAgICAgICAgZWFjaChkYXRhLmRhdGEsIGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuaGVhZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGVhZGluZ3MubGVuZ3RoICE9PSByb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhlIG51bWJlciBvZiByb3dzIGRvIG5vdCBtYXRjaCB0aGUgbnVtYmVyIG9mIGhlYWRpbmdzLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHZhciB0ciA9IGNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgICAgICAgICAgICBlYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdGQgPSBjcmVhdGVFbGVtZW50KFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaHRtbDogdmFsdWVcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoZWFkKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy50YWJsZS50SGVhZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlQ2hpbGQodGhpcy50YWJsZS50SGVhZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLmFwcGVuZENoaWxkKHRoZWFkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRib2R5KSB7XHJcbiAgICAgICAgICBpZiAodGhpcy50YWJsZS50Qm9kaWVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlQ2hpbGQodGhpcy50YWJsZS50Qm9kaWVzWzBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFibGUuYXBwZW5kQ2hpbGQodGJvZHkpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVXNlIG1vbWVudC5qcyB0byBwYXJzZSBjZWxsIGNvbnRlbnRzIGZvciBzb3J0aW5nXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBjb250ZW50ICAgICBUaGUgZGF0ZXRpbWUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBmb3JtYXQgICAgICBUaGUgZm9ybWF0IGZvciBtb21lbnQgdG8gdXNlXHJcbiAgICogQHJldHVybiB7U3RyaW5nfEJvb2xlYW59ICAgICBEYXRhdGltZSBzdHJpbmcgb3IgZmFsc2VcclxuICAgKi9cclxuICB2YXIgcGFyc2VEYXRlID0gZnVuY3Rpb24gKGNvbnRlbnQsIGZvcm1hdCkge1xyXG4gICAgICB2YXIgZGF0ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgLy8gbW9tZW50KCkgdGhyb3dzIGEgZml0IGlmIHRoZSBzdHJpbmcgaXNuJ3QgYSB2YWxpZCBkYXRldGltZSBzdHJpbmdcclxuICAgICAgLy8gc28gd2UgbmVlZCB0byBzdXBwbHkgdGhlIGZvcm1hdCB0byB0aGUgY29uc3RydWN0b3IgKGh0dHBzOi8vbW9tZW50anMuY29tL2RvY3MvIy9wYXJzaW5nL3N0cmluZy1mb3JtYXQvKVxyXG5cclxuICAgICAgLy8gQ29udmVydGluZyB0byBZWVlZTU1ERCBlbnN1cmVzIHdlIGNhbiBhY2N1cmF0ZWx5IHNvcnQgdGhlIGNvbHVtbiBudW1lcmljYWxseVxyXG5cclxuICAgICAgaWYgKGZvcm1hdCkge1xyXG4gICAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICAgIGNhc2UgXCJJU09fODYwMVwiOlxyXG4gICAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoY29udGVudCwgbW9tZW50LklTT184NjAxKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgXCJSRkNfMjgyMlwiOlxyXG4gICAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoY29udGVudCwgXCJkZGQsIE1NIE1NTSBZWVlZIEhIOm1tOnNzIFpaXCIpLmZvcm1hdChcIllZWVlNTUREXCIpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBcIk1ZU1FMXCI6XHJcbiAgICAgICAgICAgICAgZGF0ZSA9IG1vbWVudChjb250ZW50LCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZm9ybWF0KFwiWVlZWU1NRERcIik7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIFwiVU5JWFwiOlxyXG4gICAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoY29udGVudCkudW5peCgpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIC8vIFVzZXIgZGVmaW5lZCBmb3JtYXQgdXNpbmcgdGhlIGRhdGEtZm9ybWF0IGF0dHJpYnV0ZSBvciBjb2x1bW5zW25dLmZvcm1hdCBvcHRpb25cclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgZGF0ZSA9IG1vbWVudChjb250ZW50LCBmb3JtYXQpLmZvcm1hdChcIllZWVlNTUREXCIpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGF0ZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDb2x1bW5zIEFQSVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZSBEYXRhVGFibGUgaW5zdGFuY2VcclxuICAgKiBAcGFyYW0ge01peGVkfSBjb2x1bW5zICBDb2x1bW4gaW5kZXggb3IgYXJyYXkgb2YgY29sdW1uIGluZGV4ZXNcclxuICAgKi9cclxuICB2YXIgQ29sdW1ucyA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFN3YXAgdHdvIGNvbHVtbnNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIENvbHVtbnMucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiAoY29sdW1ucykge1xyXG4gICAgICBpZiAoY29sdW1ucy5sZW5ndGggJiYgY29sdW1ucy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgIHZhciBjb2xzID0gW107XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbHVtbiBpbmRleGVzXHJcbiAgICAgICAgICBlYWNoKHRoaXMuZHQuaGVhZGluZ3MsIGZ1bmN0aW9uIChoLCBpKSB7XHJcbiAgICAgICAgICAgICAgY29scy5wdXNoKGkpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdmFyIHggPSBjb2x1bW5zWzBdO1xyXG4gICAgICAgICAgdmFyIHkgPSBjb2x1bW5zWzFdO1xyXG4gICAgICAgICAgdmFyIGIgPSBjb2xzW3ldO1xyXG4gICAgICAgICAgY29sc1t5XSA9IGNvbHNbeF07XHJcbiAgICAgICAgICBjb2xzW3hdID0gYjtcclxuXHJcbiAgICAgICAgICB0aGlzLm9yZGVyKGNvbHMpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVvcmRlciB0aGUgY29sdW1uc1xyXG4gICAqIEByZXR1cm4ge0FycmF5fSBjb2x1bW5zICBBcnJheSBvZiBvcmRlcmVkIGNvbHVtbiBpbmRleGVzXHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUub3JkZXIgPSBmdW5jdGlvbiAoY29sdW1ucykge1xyXG5cclxuICAgICAgdmFyIGEsIGIsIGMsIGQsIGgsIHMsIGNlbGwsXHJcbiAgICAgICAgICB0ZW1wID0gW1xyXG4gICAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICAgIFtdXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgZHQgPSB0aGlzLmR0O1xyXG5cclxuICAgICAgLy8gT3JkZXIgdGhlIGhlYWRpbmdzXHJcbiAgICAgIGVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbiwgeCkge1xyXG4gICAgICAgICAgaCA9IGR0LmhlYWRpbmdzW2NvbHVtbl07XHJcbiAgICAgICAgICBzID0gaC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNvcnRhYmxlXCIpICE9PSBcImZhbHNlXCI7XHJcbiAgICAgICAgICBhID0gaC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICBhLm9yaWdpbmFsQ2VsbEluZGV4ID0geDtcclxuICAgICAgICAgIGEuc29ydGFibGUgPSBzO1xyXG5cclxuICAgICAgICAgIHRlbXBbMF0ucHVzaChhKTtcclxuXHJcbiAgICAgICAgICBpZiAoZHQuaGlkZGVuQ29sdW1ucy5pbmRleE9mKGNvbHVtbikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgYiA9IGguY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgIGIub3JpZ2luYWxDZWxsSW5kZXggPSB4O1xyXG4gICAgICAgICAgICAgIGIuc29ydGFibGUgPSBzO1xyXG5cclxuICAgICAgICAgICAgICB0ZW1wWzFdLnB1c2goYik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gT3JkZXIgdGhlIHJvdyBjZWxsc1xyXG4gICAgICBlYWNoKGR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIGMgPSByb3cuY2xvbmVOb2RlKCk7XHJcbiAgICAgICAgICBkID0gcm93LmNsb25lTm9kZSgpO1xyXG5cclxuICAgICAgICAgIGMuZGF0YUluZGV4ID0gZC5kYXRhSW5kZXggPSBpO1xyXG5cclxuICAgICAgICAgIGlmIChyb3cuc2VhcmNoSW5kZXggIT09IG51bGwgJiYgcm93LnNlYXJjaEluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBjLnNlYXJjaEluZGV4ID0gZC5zZWFyY2hJbmRleCA9IHJvdy5zZWFyY2hJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBcHBlbmQgdGhlIGNlbGwgdG8gdGhlIGZyYWdtZW50IGluIHRoZSBjb3JyZWN0IG9yZGVyXHJcbiAgICAgICAgICBlYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4sIHgpIHtcclxuICAgICAgICAgICAgICBjZWxsID0gcm93LmNlbGxzW2NvbHVtbl0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgIGNlbGwuZGF0YSA9IHJvdy5jZWxsc1tjb2x1bW5dLmRhdGE7XHJcbiAgICAgICAgICAgICAgYy5hcHBlbmRDaGlsZChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW4pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsID0gcm93LmNlbGxzW2NvbHVtbl0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLmRhdGEgPSByb3cuY2VsbHNbY29sdW1uXS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICBkLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRlbXBbMl0ucHVzaChjKTtcclxuICAgICAgICAgIHRlbXBbM10ucHVzaChkKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkdC5oZWFkaW5ncyA9IHRlbXBbMF07XHJcbiAgICAgIGR0LmFjdGl2ZUhlYWRpbmdzID0gdGVtcFsxXTtcclxuXHJcbiAgICAgIGR0LmRhdGEgPSB0ZW1wWzJdO1xyXG4gICAgICBkdC5hY3RpdmVSb3dzID0gdGVtcFszXTtcclxuXHJcbiAgICAgIC8vIFVwZGF0ZVxyXG4gICAgICBkdC51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBIaWRlIGNvbHVtbnNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIENvbHVtbnMucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY29sdW1ucykge1xyXG4gICAgICBpZiAoY29sdW1ucy5sZW5ndGgpIHtcclxuICAgICAgICAgIHZhciBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICAgICAgZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW4pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBkdC5oaWRkZW5Db2x1bW5zLnB1c2goY29sdW1uKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3cgY29sdW1uc1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XHJcbiAgICAgIGlmIChjb2x1bW5zLmxlbmd0aCkge1xyXG4gICAgICAgICAgdmFyIGluZGV4LCBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICAgICAgZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgaW5kZXggPSBkdC5oaWRkZW5Db2x1bW5zLmluZGV4T2YoY29sdW1uKTtcclxuICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBkdC5oaWRkZW5Db2x1bW5zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBjb2x1bW4ocykgdmlzaWJpbGl0eVxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUudmlzaWJsZSA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XHJcbiAgICAgIHZhciBjb2xzLCBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICBjb2x1bW5zID0gY29sdW1ucyB8fCBkdC5oZWFkaW5ncy5tYXAoZnVuY3Rpb24gKHRoKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGgub3JpZ2luYWxDZWxsSW5kZXg7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCFpc05hTihjb2x1bW5zKSkge1xyXG4gICAgICAgICAgY29scyA9IGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW5zKSA8IDA7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb2x1bW5zKSkge1xyXG4gICAgICAgICAgY29scyA9IFtdO1xyXG4gICAgICAgICAgZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgY29scy5wdXNoKGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW4pIDwgMCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbHM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgbmV3IGNvbHVtblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgdGQsIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmR0LmhlYWRpbmdzLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5kdC5pbnNlcnQoe1xyXG4gICAgICAgICAgICAgIGhlYWRpbmdzOiBbZGF0YS5oZWFkaW5nXSxcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEubWFwKGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbaV07XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5kdC5oaWRkZW5IZWFkZXIpIHtcclxuICAgICAgICAgIGlmIChkYXRhLmhlYWRpbmcubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICB0aC5hcHBlbmRDaGlsZChkYXRhLmhlYWRpbmcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aC5pbm5lckhUTUwgPSBkYXRhLmhlYWRpbmc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmR0LmhlYWRpbmdzLnB1c2godGgpO1xyXG5cclxuICAgICAgZWFjaCh0aGlzLmR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIGlmIChkYXRhLmRhdGFbaV0pIHtcclxuICAgICAgICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YVtpXS5ub2RlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZChkYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHRkLmlubmVySFRNTCA9IGRhdGEuZGF0YVtpXTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHRkLmRhdGEgPSB0ZC5pbm5lckhUTUw7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkYXRhLnJlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICB0ZC5pbm5lckhUTUwgPSBkYXRhLnJlbmRlci5jYWxsKHRoYXQsIHRkLmRhdGEsIHRkLCByb3cpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoZGF0YS50eXBlKSB7XHJcbiAgICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiwgZGF0YS50eXBlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5mb3JtYXQpIHtcclxuICAgICAgICAgIHRoLnNldEF0dHJpYnV0ZShcImRhdGEtZm9ybWF0XCIsIGRhdGEuZm9ybWF0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJzb3J0YWJsZVwiKSkge1xyXG4gICAgICAgICAgdGguc29ydGFibGUgPSBkYXRhLnNvcnRhYmxlO1xyXG4gICAgICAgICAgdGguc2V0QXR0cmlidXRlKFwiZGF0YS1zb3J0YWJsZVwiLCBkYXRhLnNvcnRhYmxlID09PSB0cnVlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnJlYnVpbGQoKTtcclxuXHJcbiAgICAgIHRoaXMuZHQucmVuZGVySGVhZGVyKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGNvbHVtbihzKVxyXG4gICAqIEBwYXJhbSAge0FycmF5fE51bWJlcn0gc2VsZWN0XHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBDb2x1bW5zLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoc2VsZWN0KSB7XHJcbiAgICAgIGlmIChpc0FycmF5KHNlbGVjdCkpIHtcclxuICAgICAgICAgIC8vIFJlbW92ZSBpbiByZXZlcnNlIG90aGVyd2lzZSB0aGUgaW5kZXhlcyB3aWxsIGJlIGluY29ycmVjdFxyXG4gICAgICAgICAgc2VsZWN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gYiAtIGE7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBlYWNoKHNlbGVjdCwgZnVuY3Rpb24gKGNvbHVtbikge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGNvbHVtbik7XHJcbiAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZHQuaGVhZGluZ3Muc3BsaWNlKHNlbGVjdCwgMSk7XHJcblxyXG4gICAgICAgICAgZWFjaCh0aGlzLmR0LmRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICByb3cucmVtb3ZlQ2hpbGQocm93LmNlbGxzW3NlbGVjdF0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNvcnQgYnkgY29sdW1uXHJcbiAgICogQHBhcmFtICB7aW50fSBjb2x1bW4gLSBUaGUgY29sdW1uIG5vLlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGlyZWN0aW9uIC0gYXNjIG9yIGRlc2NcclxuICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAqL1xyXG4gIENvbHVtbnMucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiAoY29sdW1uLCBkaXJlY3Rpb24sIGluaXQpIHtcclxuXHJcbiAgICAgIHZhciBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICAvLyBDaGVjayBjb2x1bW4gaXMgcHJlc2VudFxyXG4gICAgICBpZiAoZHQuaGFzSGVhZGluZ3MgJiYgKGNvbHVtbiA8IDEgfHwgY29sdW1uID4gZHQuYWN0aXZlSGVhZGluZ3MubGVuZ3RoKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkdC5zb3J0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIENvbnZlcnQgdG8gemVyby1pbmRleGVkXHJcbiAgICAgIGNvbHVtbiA9IGNvbHVtbiAtIDE7XHJcblxyXG4gICAgICB2YXIgZGlyLFxyXG4gICAgICAgICAgcm93cyA9IGR0LmRhdGEsXHJcbiAgICAgICAgICBhbHBoYSA9IFtdLFxyXG4gICAgICAgICAgbnVtZXJpYyA9IFtdLFxyXG4gICAgICAgICAgYSA9IDAsXHJcbiAgICAgICAgICBuID0gMCxcclxuICAgICAgICAgIHRoID0gZHQuYWN0aXZlSGVhZGluZ3NbY29sdW1uXTtcclxuXHJcbiAgICAgIGNvbHVtbiA9IHRoLm9yaWdpbmFsQ2VsbEluZGV4O1xyXG5cclxuICAgICAgZWFjaChyb3dzLCBmdW5jdGlvbiAodHIpIHtcclxuICAgICAgICAgIHZhciBjZWxsID0gdHIuY2VsbHNbY29sdW1uXTtcclxuICAgICAgICAgIHZhciBjb250ZW50ID0gY2VsbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpID8gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpIDogY2VsbC5kYXRhO1xyXG4gICAgICAgICAgdmFyIG51bSA9IGNvbnRlbnQucmVwbGFjZSgvKFxcJHxcXCx8XFxzfCUpL2csIFwiXCIpO1xyXG5cclxuICAgICAgICAgIC8vIENoZWNrIGZvciBkYXRlIGZvcm1hdCBhbmQgbW9tZW50LmpzXHJcbiAgICAgICAgICBpZiAodGguZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpID09PSBcImRhdGVcIiAmJiB3aW4ubW9tZW50KSB7XHJcbiAgICAgICAgICAgICAgdmFyIGZvcm1hdCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSB0aC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZvcm1hdFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlZCkge1xyXG4gICAgICAgICAgICAgICAgICBmb3JtYXQgPSB0aC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZvcm1hdFwiKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIG51bSA9IHBhcnNlRGF0ZShjb250ZW50LCBmb3JtYXQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG51bSkgPT0gbnVtKSB7XHJcbiAgICAgICAgICAgICAgbnVtZXJpY1tuKytdID0ge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogTnVtYmVyKG51bSksXHJcbiAgICAgICAgICAgICAgICAgIHJvdzogdHJcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbHBoYVthKytdID0ge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgcm93OiB0clxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLyogU29ydCBhY2NvcmRpbmcgdG8gZGlyZWN0aW9uIChhc2NlbmRpbmcgb3IgZGVzY2VuZGluZykgKi9cclxuICAgICAgdmFyIHRvcCwgYnRtO1xyXG4gICAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKHRoLCBcImFzY1wiKSB8fCBkaXJlY3Rpb24gPT0gXCJhc2NcIikge1xyXG4gICAgICAgICAgdG9wID0gc29ydEl0ZW1zKGFscGhhLCAtMSk7XHJcbiAgICAgICAgICBidG0gPSBzb3J0SXRlbXMobnVtZXJpYywgLTEpO1xyXG4gICAgICAgICAgZGlyID0gXCJkZXNjZW5kaW5nXCI7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKHRoLCBcImFzY1wiKTtcclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGgsIFwiZGVzY1wiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRvcCA9IHNvcnRJdGVtcyhudW1lcmljLCAxKTtcclxuICAgICAgICAgIGJ0bSA9IHNvcnRJdGVtcyhhbHBoYSwgMSk7XHJcbiAgICAgICAgICBkaXIgPSBcImFzY2VuZGluZ1wiO1xyXG4gICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZSh0aCwgXCJkZXNjXCIpO1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aCwgXCJhc2NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qIENsZWFyIGFzYy9kZXNjIGNsYXNzIG5hbWVzIGZyb20gdGhlIGxhc3Qgc29ydGVkIGNvbHVtbidzIHRoIGlmIGl0IGlzbid0IHRoZSBzYW1lIGFzIHRoZSBvbmUgdGhhdCB3YXMganVzdCBjbGlja2VkICovXHJcbiAgICAgIGlmIChkdC5sYXN0VGggJiYgdGggIT0gZHQubGFzdFRoKSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGR0Lmxhc3RUaCwgXCJkZXNjXCIpO1xyXG4gICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShkdC5sYXN0VGgsIFwiYXNjXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkdC5sYXN0VGggPSB0aDtcclxuXHJcbiAgICAgIC8qIFJlb3JkZXIgdGhlIHRhYmxlICovXHJcbiAgICAgIHJvd3MgPSB0b3AuY29uY2F0KGJ0bSk7XHJcblxyXG4gICAgICBkdC5kYXRhID0gW107XHJcbiAgICAgIHZhciBpbmRleGVzID0gW107XHJcblxyXG4gICAgICBlYWNoKHJvd3MsIGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICBkdC5kYXRhLnB1c2godi5yb3cpO1xyXG5cclxuICAgICAgICAgIGlmICh2LnJvdy5zZWFyY2hJbmRleCAhPT0gbnVsbCAmJiB2LnJvdy5zZWFyY2hJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LCBkdCk7XHJcblxyXG4gICAgICBkdC5zZWFyY2hEYXRhID0gaW5kZXhlcztcclxuXHJcbiAgICAgIHRoaXMucmVidWlsZCgpO1xyXG5cclxuICAgICAgZHQudXBkYXRlKCk7XHJcblxyXG4gICAgICBpZiAoIWluaXQpIHtcclxuICAgICAgICAgIGR0LmVtaXQoXCJkYXRhdGFibGUuc29ydFwiLCBjb2x1bW4sIGRpcik7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZWJ1aWxkIHRoZSBjb2x1bW5zXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBDb2x1bW5zLnByb3RvdHlwZS5yZWJ1aWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYSwgYiwgYywgZCwgZHQgPSB0aGlzLmR0LFxyXG4gICAgICAgICAgdGVtcCA9IFtdO1xyXG5cclxuICAgICAgZHQuYWN0aXZlUm93cyA9IFtdO1xyXG4gICAgICBkdC5hY3RpdmVIZWFkaW5ncyA9IFtdO1xyXG5cclxuICAgICAgZWFjaChkdC5oZWFkaW5ncywgZnVuY3Rpb24gKHRoLCBpKSB7XHJcbiAgICAgICAgICB0aC5vcmlnaW5hbENlbGxJbmRleCA9IGk7XHJcbiAgICAgICAgICB0aC5zb3J0YWJsZSA9IHRoLmdldEF0dHJpYnV0ZShcImRhdGEtc29ydGFibGVcIikgIT09IFwiZmFsc2VcIjtcclxuICAgICAgICAgIGlmIChkdC5oaWRkZW5Db2x1bW5zLmluZGV4T2YoaSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgZHQuYWN0aXZlSGVhZGluZ3MucHVzaCh0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgLy8gTG9vcCBvdmVyIHRoZSByb3dzIGFuZCByZW9yZGVyIHRoZSBjZWxsc1xyXG4gICAgICBlYWNoKGR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIGEgPSByb3cuY2xvbmVOb2RlKCk7XHJcbiAgICAgICAgICBiID0gcm93LmNsb25lTm9kZSgpO1xyXG5cclxuICAgICAgICAgIGEuZGF0YUluZGV4ID0gYi5kYXRhSW5kZXggPSBpO1xyXG5cclxuICAgICAgICAgIGlmIChyb3cuc2VhcmNoSW5kZXggIT09IG51bGwgJiYgcm93LnNlYXJjaEluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBhLnNlYXJjaEluZGV4ID0gYi5zZWFyY2hJbmRleCA9IHJvdy5zZWFyY2hJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBcHBlbmQgdGhlIGNlbGwgdG8gdGhlIGZyYWdtZW50IGluIHRoZSBjb3JyZWN0IG9yZGVyXHJcbiAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICBjID0gY2VsbC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgYy5kYXRhID0gY2VsbC5kYXRhO1xyXG4gICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoYyk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkdC5oaWRkZW5Db2x1bW5zLmluZGV4T2YoY2VsbC5jZWxsSW5kZXgpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBkID0gY2VsbC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgIGQuZGF0YSA9IGNlbGwuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgYi5hcHBlbmRDaGlsZChkKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBBcHBlbmQgdGhlIGZyYWdtZW50IHdpdGggdGhlIG9yZGVyZWQgY2VsbHNcclxuICAgICAgICAgIHRlbXAucHVzaChhKTtcclxuICAgICAgICAgIGR0LmFjdGl2ZVJvd3MucHVzaChiKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkdC5kYXRhID0gdGVtcDtcclxuXHJcbiAgICAgIGR0LnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJvd3MgQVBJXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlIERhdGFUYWJsZSBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSB7QXJyYXl9IHJvd3NcclxuICAgKi9cclxuICB2YXIgUm93cyA9IGZ1bmN0aW9uIChkdCwgcm93cykge1xyXG4gICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAgIHRoaXMucm93cyA9IHJvd3M7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCBhIG5ldyByb3dcclxuICAgKiBAcGFyYW0gIHtBcnJheX0gcm93XHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgUm93cy5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgIHZhciB0ZCwgdHIgPSBjcmVhdGVFbGVtZW50KFwidHJcIik7XHJcblxyXG4gICAgICB2YXIgaGVhZGluZ3MgPSB0aGlzLmR0LmhlYWRpbmdzO1xyXG5cclxuICAgICAgaWYgKCFoZWFkaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgIGhlYWRpbmdzID0gcm93Lm1hcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWFjaChoZWFkaW5ncywgZnVuY3Rpb24gKGgsIGkpIHtcclxuICAgICAgICAgIHRkID0gY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG5cclxuICAgICAgICAgIC8vIEZpeGVzICMyOVxyXG4gICAgICAgICAgaWYgKCFyb3dbaV0gJiYgIXJvd1tpXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICByb3dbaV0gPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRkLmlubmVySFRNTCA9IHJvd1tpXTtcclxuXHJcbiAgICAgICAgICB0ZC5kYXRhID0gcm93W2ldO1xyXG5cclxuICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdHI7XHJcbiAgfTtcclxuXHJcbiAgUm93cy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICByZXR1cm4gcm93O1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBuZXcgcm93XHJcbiAgICogQHBhcmFtIHtBcnJheX0gc2VsZWN0XHJcbiAgICovXHJcbiAgUm93cy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICB2YXIgZHQgPSB0aGlzLmR0O1xyXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIG11bHRpcGxlIHJvd3NcclxuICAgICAgICAgIGlmIChpc0FycmF5KGRhdGFbMF0pKSB7XHJcbiAgICAgICAgICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbiAocm93LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGR0LmRhdGEucHVzaCh0aGlzLmJ1aWxkKHJvdykpO1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBkdC5kYXRhLnB1c2godGhpcy5idWlsZChkYXRhKSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gV2UgbWF5IGhhdmUgYWRkZWQgZGF0YSB0byBhbiBlbXB0eSB0YWJsZVxyXG4gICAgICAgICAgaWYgKCBkdC5kYXRhLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICBkdC5oYXNSb3dzID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICBkdC5jb2x1bW5zKCkucmVidWlsZCgpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIHJvdyhzKVxyXG4gICAqIEBwYXJhbSAge0FycmF5fE51bWJlcn0gc2VsZWN0XHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBSb3dzLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoc2VsZWN0KSB7XHJcblxyXG4gICAgICB2YXIgZHQgPSB0aGlzLmR0O1xyXG5cclxuICAgICAgaWYgKGlzQXJyYXkoc2VsZWN0KSkge1xyXG4gICAgICAgICAgLy8gUmVtb3ZlIGluIHJldmVyc2Ugb3RoZXJ3aXNlIHRoZSBpbmRleGVzIHdpbGwgYmUgaW5jb3JyZWN0XHJcbiAgICAgICAgICBzZWxlY3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBiIC0gYTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGVhY2goc2VsZWN0LCBmdW5jdGlvbiAocm93LCBpKSB7XHJcbiAgICAgICAgICAgICAgZHQuZGF0YS5zcGxpY2Uocm93LCAxKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZHQuZGF0YS5zcGxpY2Uoc2VsZWN0LCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgZHQuY29sdW1ucygpLnJlYnVpbGQoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgcm93IGluZGV4ZXNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIFJvd3MucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZWFjaCh0aGlzLmR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIHJvdy5kYXRhSW5kZXggPSBpO1xyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vICAgIE1BSU4gTElCICAgIC8vXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgdmFyIERhdGFUYWJsZSA9IGZ1bmN0aW9uICh0YWJsZSwgb3B0aW9ucykge1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgICAvLyB1c2VyIG9wdGlvbnNcclxuICAgICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRDb25maWcsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0YWJsZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhYmxlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbml0aWFsTGF5b3V0ID0gdGFibGUuaW5uZXJIVE1MO1xyXG4gICAgICB0aGlzLmluaXRpYWxTb3J0YWJsZSA9IHRoaXMub3B0aW9ucy5zb3J0YWJsZTtcclxuXHJcbiAgICAgIC8vIERpc2FibGUgbWFudWFsIHNvcnRpbmcgaWYgbm8gaGVhZGVyIGlzIHByZXNlbnQgKCM0KVxyXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5oZWFkZXIpIHtcclxuICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3J0YWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGFibGUudEhlYWQgPT09IG51bGwpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmRhdGEgfHxcclxuICAgICAgICAgICAgICAodGhpcy5vcHRpb25zLmRhdGEgJiYgIXRoaXMub3B0aW9ucy5kYXRhLmhlYWRpbmdzKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvcnRhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0YWJsZS50Qm9kaWVzLmxlbmd0aCAmJiAhdGFibGUudEJvZGllc1swXS5yb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgIFwiWW91IHNlZW0gdG8gYmUgdXNpbmcgdGhlIGRhdGEgb3B0aW9uLCBidXQgeW91J3ZlIG5vdCBkZWZpbmVkIGFueSByb3dzLlwiXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcblxyXG4gICAgICB0aGlzLmluaXQoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGQgY3VzdG9tIHByb3BlcnR5IG9yIG1ldGhvZCB0byBleHRlbmQgRGF0YVRhYmxlXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBwcm9wICAgIC0gTWV0aG9kIG5hbWUgb3IgcHJvcGVydHlcclxuICAgKiBAcGFyYW0gIHtNaXhlZH0gdmFsICAgICAgLSBGdW5jdGlvbiBvciBwcm9wZXJ0eSB2YWx1ZVxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgRGF0YVRhYmxlLmV4dGVuZCA9IGZ1bmN0aW9uKHByb3AsIHZhbCkge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICBEYXRhVGFibGUucHJvdG90eXBlW3Byb3BdID0gdmFsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgRGF0YVRhYmxlW3Byb3BdID0gdmFsO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHByb3RvID0gRGF0YVRhYmxlLnByb3RvdHlwZTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgaW5zdGFuY2VcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIHByb3RvLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZCB8fCBjbGFzc0xpc3QuY29udGFpbnModGhpcy50YWJsZSwgXCJkYXRhVGFibGUtdGFibGVcIikpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyB8fCB7fSk7XHJcblxyXG4gICAgICAvLyBJRSBkZXRlY3Rpb25cclxuICAgICAgdGhpcy5pc0lFID0gISEvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgIHRoaXMub25GaXJzdFBhZ2UgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5zID0gW107XHJcbiAgICAgIHRoaXMuY29sdW1uUmVuZGVyZXJzID0gW107XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRDb2x1bW5zID0gW107XHJcblxyXG4gICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuaW5pdFwiKTtcclxuICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMucGx1Z2lucykge1xyXG4gICAgICAgICAgICAgIGVhY2godGhhdC5vcHRpb25zLnBsdWdpbnMsIGZ1bmN0aW9uKG9wdGlvbnMsIHBsdWdpbikge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodGhhdFtwbHVnaW5dICYmIHR5cGVvZiB0aGF0W3BsdWdpbl0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhhdFtwbHVnaW5dID0gdGhhdFtwbHVnaW5dKG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoOiBlYWNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZDogZXh0ZW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogY2xhc3NMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIEluaXQgcGx1Z2luXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVkICYmIHRoYXRbcGx1Z2luXS5pbml0ICYmIHR5cGVvZiB0aGF0W3BsdWdpbl0uaW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdFtwbHVnaW5dLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LCAxMCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVuZGVyIHRoZSBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdHlwZVxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgY2FzZSBcInBhZ2VcIjpcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlclBhZ2UoKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgXCJwYWdlclwiOlxyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyUGFnZXIoKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgXCJoZWFkZXJcIjpcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckhlYWRlcigpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgbyA9IHRoYXQub3B0aW9ucyxcclxuICAgICAgICAgIHRlbXBsYXRlID0gXCJcIjtcclxuXHJcbiAgICAgIC8vIENvbnZlcnQgZGF0YSB0byBIVE1MXHJcbiAgICAgIGlmIChvLmRhdGEpIHtcclxuICAgICAgICAgIGRhdGFUb1RhYmxlLmNhbGwodGhhdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLmFqYXgpIHtcclxuICAgICAgICAgIHZhciBhamF4ID0gby5hamF4O1xyXG4gICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgIHZhciB4aHJQcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5lbWl0KFwiZGF0YXRhYmxlLmFqYXgucHJvZ3Jlc3NcIiwgZSwgeGhyKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIHhockxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5sb2FkZWRcIiwgZSwgeGhyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgIG9iai5kYXRhID0gYWpheC5sb2FkID8gYWpheC5sb2FkLmNhbGwodGhhdCwgeGhyKSA6IHhoci5yZXNwb25zZVRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSBcImpzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoYWpheC5jb250ZW50ICYmIGFqYXguY29udGVudC50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSBhamF4LmNvbnRlbnQudHlwZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gZXh0ZW5kKG9iaiwgYWpheC5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmltcG9ydChvYmopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0Q29sdW1ucyh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5zdWNjZXNzXCIsIGUsIHhocik7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5lcnJvclwiLCBlLCB4aHIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB2YXIgeGhyRmFpbGVkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5lcnJvclwiLCBlLCB4aHIpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB2YXIgeGhyQ2FuY2VsbGVkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5hYm9ydFwiLCBlLCB4aHIpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBvbih4aHIsIFwicHJvZ3Jlc3NcIiwgeGhyUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgb24oeGhyLCBcImxvYWRcIiwgeGhyTG9hZCk7XHJcbiAgICAgICAgICBvbih4aHIsIFwiZXJyb3JcIiwgeGhyRmFpbGVkKTtcclxuICAgICAgICAgIG9uKHhociwgXCJhYm9ydFwiLCB4aHJDYW5jZWxsZWQpO1xyXG5cclxuICAgICAgICAgIHRoYXQuZW1pdChcImRhdGF0YWJsZS5hamF4LmxvYWRpbmdcIiwgeGhyKTtcclxuXHJcbiAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB0eXBlb2YgYWpheCA9PT0gXCJzdHJpbmdcIiA/IG8uYWpheCA6IG8uYWpheC51cmwpO1xyXG4gICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU3RvcmUgcmVmZXJlbmNlc1xyXG4gICAgICB0aGF0LmJvZHkgPSB0aGF0LnRhYmxlLnRCb2RpZXNbMF07XHJcbiAgICAgIHRoYXQuaGVhZCA9IHRoYXQudGFibGUudEhlYWQ7XHJcbiAgICAgIHRoYXQuZm9vdCA9IHRoYXQudGFibGUudEZvb3Q7XHJcblxyXG4gICAgICBpZiAoIXRoYXQuYm9keSkge1xyXG4gICAgICAgICAgdGhhdC5ib2R5ID0gY3JlYXRlRWxlbWVudChcInRib2R5XCIpO1xyXG5cclxuICAgICAgICAgIHRoYXQudGFibGUuYXBwZW5kQ2hpbGQodGhhdC5ib2R5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC5oYXNSb3dzID0gdGhhdC5ib2R5LnJvd3MubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgIC8vIE1ha2UgYSB0SGVhZCBpZiB0aGVyZSBpc24ndCBvbmUgKGZpeGVzICM4KVxyXG4gICAgICBpZiAoIXRoYXQuaGVhZCkge1xyXG4gICAgICAgICAgdmFyIGggPSBjcmVhdGVFbGVtZW50KFwidGhlYWRcIik7XHJcbiAgICAgICAgICB2YXIgdCA9IGNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuXHJcbiAgICAgICAgICBpZiAodGhhdC5oYXNSb3dzKSB7XHJcbiAgICAgICAgICAgICAgZWFjaCh0aGF0LmJvZHkucm93c1swXS5jZWxscywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICB0LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW1lbnQoXCJ0aFwiKSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGguYXBwZW5kQ2hpbGQodCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhhdC5oZWFkID0gaDtcclxuXHJcbiAgICAgICAgICB0aGF0LnRhYmxlLmluc2VydEJlZm9yZSh0aGF0LmhlYWQsIHRoYXQuYm9keSk7XHJcblxyXG4gICAgICAgICAgdGhhdC5oaWRkZW5IZWFkZXIgPSAhby5hamF4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGF0LmhlYWRpbmdzID0gW107XHJcbiAgICAgIHRoYXQuaGFzSGVhZGluZ3MgPSB0aGF0LmhlYWQucm93cy5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgaWYgKHRoYXQuaGFzSGVhZGluZ3MpIHtcclxuICAgICAgICAgIHRoYXQuaGVhZGVyID0gdGhhdC5oZWFkLnJvd3NbMF07XHJcbiAgICAgICAgICB0aGF0LmhlYWRpbmdzID0gW10uc2xpY2UuY2FsbCh0aGF0LmhlYWRlci5jZWxscyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhlYWRlclxyXG4gICAgICBpZiAoIW8uaGVhZGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhhdC5oZWFkKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC50YWJsZS5yZW1vdmVDaGlsZCh0aGF0LnRhYmxlLnRIZWFkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRm9vdGVyXHJcbiAgICAgIGlmIChvLmZvb3Rlcikge1xyXG4gICAgICAgICAgaWYgKHRoYXQuaGVhZCAmJiAhdGhhdC5mb290KSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5mb290ID0gY3JlYXRlRWxlbWVudChcInRmb290XCIsIHtcclxuICAgICAgICAgICAgICAgICAgaHRtbDogdGhhdC5oZWFkLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHRoYXQudGFibGUuYXBwZW5kQ2hpbGQodGhhdC5mb290KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGF0LmZvb3QpIHtcclxuICAgICAgICAgICAgICB0aGF0LnRhYmxlLnJlbW92ZUNoaWxkKHRoYXQudGFibGUudEZvb3QpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBCdWlsZFxyXG4gICAgICB0aGF0LndyYXBwZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgICAgIGNsYXNzOiBcImRhdGFUYWJsZS13cmFwcGVyIGRhdGFUYWJsZS1sb2FkaW5nXCJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBUZW1wbGF0ZSBmb3IgY3VzdG9tIGxheW91dHNcclxuICAgICAgdGVtcGxhdGUgKz0gXCI8ZGl2IGNsYXNzPSdkYXRhVGFibGUtdG9wJz5cIjtcclxuICAgICAgdGVtcGxhdGUgKz0gby5sYXlvdXQudG9wO1xyXG4gICAgICB0ZW1wbGF0ZSArPSBcIjwvZGl2PlwiO1xyXG4gICAgICB0ZW1wbGF0ZSArPSBcIjxkaXYgY2xhc3M9J2RhdGFUYWJsZS1jb250YWluZXInPjwvZGl2PlwiO1xyXG4gICAgICBpZihkZWZhdWx0Q29uZmlnLmluZm8pIHtcclxuICAgICAgICB0ZW1wbGF0ZSArPSBcIjxkaXYgY2xhc3M9J2RhdGFUYWJsZS1ib3R0b20nPlwiO1xyXG4gICAgICAgIHRlbXBsYXRlICs9IG8ubGF5b3V0LmJvdHRvbTtcclxuICAgICAgICB0ZW1wbGF0ZSArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgIC8vIEluZm8gcGxhY2VtZW50XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie2luZm99XCIsIFwiPGRpdiBjbGFzcz0nZGF0YVRhYmxlLWluZm8nPjwvZGl2PlwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgXHJcblxyXG4gICAgICAvLyBQZXIgUGFnZSBTZWxlY3RcclxuICAgICAgaWYgKG8ucGVyUGFnZVNlbGVjdCkge1xyXG4gICAgICAgICAgdmFyIHdyYXAgPSBcIjxkaXYgY2xhc3M9J2RhdGFUYWJsZS1kcm9wZG93bic+PGxhYmVsPlwiO1xyXG4gICAgICAgICAgd3JhcCArPSBvLmxhYmVscy5wZXJQYWdlO1xyXG4gICAgICAgICAgd3JhcCArPSBcIjwvbGFiZWw+PC9kaXY+XCI7XHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBzZWxlY3RcclxuICAgICAgICAgIHZhciBzZWxlY3QgPSBjcmVhdGVFbGVtZW50KFwic2VsZWN0XCIsIHtcclxuICAgICAgICAgICAgICBjbGFzczogXCJkYXRhVGFibGUtc2VsZWN0b3JcIlxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBvcHRpb25zXHJcbiAgICAgICAgICBlYWNoKG8ucGVyUGFnZVNlbGVjdCwgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHZhbCA9PT0gby5wZXJQYWdlO1xyXG4gICAgICAgICAgICAgIHZhciBvcHRpb24gPSBuZXcgT3B0aW9uKHZhbCwgdmFsLCBzZWxlY3RlZCwgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgIHNlbGVjdC5hZGQob3B0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIEN1c3RvbSBsYWJlbFxyXG4gICAgICAgICAgd3JhcCA9IHdyYXAucmVwbGFjZShcIntzZWxlY3R9XCIsIHNlbGVjdC5vdXRlckhUTUwpO1xyXG5cclxuICAgICAgICAgIC8vIFNlbGVjdG9yIHBsYWNlbWVudFxyXG4gICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3NlbGVjdH1cIiwgd3JhcCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoXCJ7c2VsZWN0fVwiLCBcIlwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU2VhcmNoYWJsZVxyXG4gICAgICBpZiAoby5zZWFyY2hhYmxlKSB7XHJcbiAgICAgICAgICB2YXIgZm9ybSA9XHJcbiAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdkYXRhVGFibGUtc2VhcmNoJz48aW5wdXQgY2xhc3M9J2RhdGFUYWJsZS1pbnB1dCcgcGxhY2Vob2xkZXI9J1wiICtcclxuICAgICAgICAgICAgICBvLmxhYmVscy5wbGFjZWhvbGRlciArXHJcbiAgICAgICAgICAgICAgXCInIHR5cGU9J3RleHQnPjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgIC8vIFNlYXJjaCBpbnB1dCBwbGFjZW1lbnRcclxuICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShcIntzZWFyY2h9XCIsIGZvcm0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3NlYXJjaH1cIiwgXCJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGF0Lmhhc0hlYWRpbmdzKSB7XHJcbiAgICAgICAgICAvLyBTb3J0YWJsZVxyXG4gICAgICAgICAgdGhpcy5yZW5kZXIoXCJoZWFkZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkZCB0YWJsZSBjbGFzc1xyXG4gICAgICBjbGFzc0xpc3QuYWRkKHRoYXQudGFibGUsIFwiZGF0YVRhYmxlLXRhYmxlXCIpO1xyXG5cclxuICAgICAgLy8gUGFnaW5hdG9yXHJcbiAgICAgIHZhciB3ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgICBjbGFzczogXCJkYXRhVGFibGUtcGFnaW5hdGlvblwiXHJcbiAgICAgIH0pO1xyXG4gICAgICB2YXIgcGFnaW5hdG9yID0gY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgICB3LmFwcGVuZENoaWxkKHBhZ2luYXRvcik7XHJcblxyXG4gICAgICAvLyBQYWdlcihzKSBwbGFjZW1lbnRcclxuICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHtwYWdlclxcfS9nLCB3Lm91dGVySFRNTCk7XHJcblxyXG4gICAgICB0aGF0LndyYXBwZXIuaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcblxyXG4gICAgICB0aGF0LmNvbnRhaW5lciA9IHRoYXQud3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmRhdGFUYWJsZS1jb250YWluZXJcIik7XHJcblxyXG4gICAgICB0aGF0LnBhZ2VycyA9IHRoYXQud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwiLmRhdGFUYWJsZS1wYWdpbmF0aW9uXCIpO1xyXG5cclxuICAgICAgdGhhdC5sYWJlbCA9IHRoYXQud3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmRhdGFUYWJsZS1pbmZvXCIpO1xyXG5cclxuICAgICAgLy8gSW5zZXJ0IGluIHRvIERPTSB0cmVlXHJcbiAgICAgIHRoYXQudGFibGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodGhhdC53cmFwcGVyLCB0aGF0LnRhYmxlKTtcclxuICAgICAgdGhhdC5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhhdC50YWJsZSk7XHJcblxyXG4gICAgICAvLyBTdG9yZSB0aGUgdGFibGUgZGltZW5zaW9uc1xyXG4gICAgICB0aGF0LnJlY3QgPSB0aGF0LnRhYmxlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgLy8gQ29udmVydCByb3dzIHRvIGFycmF5IGZvciBwcm9jZXNzaW5nXHJcbiAgICAgIHRoYXQuZGF0YSA9IFtdLnNsaWNlLmNhbGwodGhhdC5ib2R5LnJvd3MpO1xyXG4gICAgICB0aGF0LmFjdGl2ZVJvd3MgPSB0aGF0LmRhdGEuc2xpY2UoKTtcclxuICAgICAgdGhhdC5hY3RpdmVIZWFkaW5ncyA9IHRoYXQuaGVhZGluZ3Muc2xpY2UoKTtcclxuXHJcbiAgICAgIC8vIFVwZGF0ZVxyXG4gICAgICB0aGF0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKCFvLmFqYXgpIHtcclxuICAgICAgICAgIHRoYXQuc2V0Q29sdW1ucygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBGaXggaGVpZ2h0XHJcbiAgICAgIHRoaXMuZml4SGVpZ2h0KCk7XHJcblxyXG4gICAgICAvLyBGaXggY29sdW1uc1xyXG4gICAgICB0aGF0LmZpeENvbHVtbnMoKTtcclxuXHJcbiAgICAgIC8vIENsYXNzIG5hbWVzXHJcbiAgICAgIGlmICghby5oZWFkZXIpIHtcclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGhhdC53cmFwcGVyLCBcIm5vLWhlYWRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFvLmZvb3Rlcikge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aGF0LndyYXBwZXIsIFwibm8tZm9vdGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoby5zb3J0YWJsZSkge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aGF0LndyYXBwZXIsIFwic29ydGFibGVcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLnNlYXJjaGFibGUpIHtcclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGhhdC53cmFwcGVyLCBcInNlYXJjaGFibGVcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLmZpeGVkSGVpZ2h0KSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QuYWRkKHRoYXQud3JhcHBlciwgXCJmaXhlZC1oZWlnaHRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLmZpeGVkQ29sdW1ucykge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aGF0LndyYXBwZXIsIFwiZml4ZWQtY29sdW1uc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC5iaW5kRXZlbnRzKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVuZGVyIHRoZSBwYWdlXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBwcm90by5yZW5kZXJQYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5oYXNSb3dzICYmIHRoaXMudG90YWxQYWdlcykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPiB0aGlzLnRvdGFsUGFnZXMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBVc2UgYSBmcmFnbWVudCB0byBsaW1pdCB0b3VjaGluZyB0aGUgRE9NXHJcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmN1cnJlbnRQYWdlIC0gMSxcclxuICAgICAgICAgICAgICBmcmFnID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5oYXNIZWFkaW5ncykge1xyXG4gICAgICAgICAgICAgIGZsdXNoKHRoaXMuaGVhZGVyLCB0aGlzLmlzSUUpO1xyXG5cclxuICAgICAgICAgICAgICBlYWNoKHRoaXMuYWN0aXZlSGVhZGluZ3MsIGZ1bmN0aW9uICh0aCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWFjaCh0aGlzLnBhZ2VzW2luZGV4XSwgZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQodGhpcy5yb3dzKCkucmVuZGVyKHJvdykpO1xyXG4gICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jbGVhcihmcmFnKTtcclxuXHJcbiAgICAgICAgICB0aGlzLm9uRmlyc3RQYWdlID0gdGhpcy5jdXJyZW50UGFnZSA9PT0gMTtcclxuICAgICAgICAgIHRoaXMub25MYXN0UGFnZSA9IHRoaXMuY3VycmVudFBhZ2UgPT09IHRoaXMubGFzdFBhZ2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFVwZGF0ZSB0aGUgaW5mb1xyXG4gICAgICB2YXIgY3VycmVudCA9IDAsXHJcbiAgICAgICAgICBmID0gMCxcclxuICAgICAgICAgIHQgPSAwLFxyXG4gICAgICAgICAgaXRlbXM7XHJcblxyXG4gICAgICBpZiAodGhpcy50b3RhbFBhZ2VzKSB7XHJcbiAgICAgICAgICBjdXJyZW50ID0gdGhpcy5jdXJyZW50UGFnZSAtIDE7XHJcbiAgICAgICAgICBmID0gY3VycmVudCAqIHRoaXMub3B0aW9ucy5wZXJQYWdlO1xyXG4gICAgICAgICAgdCA9IGYgKyB0aGlzLnBhZ2VzW2N1cnJlbnRdLmxlbmd0aDtcclxuICAgICAgICAgIGYgPSBmICsgMTtcclxuICAgICAgICAgIGl0ZW1zID0gISF0aGlzLnNlYXJjaGluZyA/IHRoaXMuc2VhcmNoRGF0YS5sZW5ndGggOiB0aGlzLmRhdGEubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5sYWJlbCAmJiB0aGlzLm9wdGlvbnMubGFiZWxzLmluZm8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAvLyBDVVNUT00gTEFCRUxTXHJcbiAgICAgICAgICB2YXIgc3RyaW5nID0gdGhpcy5vcHRpb25zLmxhYmVscy5pbmZvXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7c3RhcnR9XCIsIGYpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7ZW5kfVwiLCB0KVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKFwie3BhZ2V9XCIsIHRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7cGFnZXN9XCIsIHRoaXMudG90YWxQYWdlcylcclxuICAgICAgICAgICAgICAucmVwbGFjZShcIntyb3dzfVwiLCBpdGVtcyk7XHJcblxyXG4gICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSBpdGVtcyA/IHN0cmluZyA6IFwiXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IDEpIHtcclxuICAgICAgICAgIHRoaXMuZml4SGVpZ2h0KCk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW5kZXIgdGhlIHBhZ2VyKHMpXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBwcm90by5yZW5kZXJQYWdlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZmx1c2godGhpcy5wYWdlcnMsIHRoaXMuaXNJRSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50b3RhbFBhZ2VzID4gMSkge1xyXG4gICAgICAgICAgdmFyIGMgPSBcInBhZ2VyXCIsXHJcbiAgICAgICAgICAgICAgZnJhZyA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgICAgcHJldiA9IHRoaXMub25GaXJzdFBhZ2UgPyAxIDogdGhpcy5jdXJyZW50UGFnZSAtIDEsXHJcbiAgICAgICAgICAgICAgbmV4dCA9IHRoaXMub25sYXN0UGFnZSA/IHRoaXMudG90YWxQYWdlcyA6IHRoaXMuY3VycmVudFBhZ2UgKyAxO1xyXG5cclxuICAgICAgICAgIC8vIGZpcnN0IGJ1dHRvblxyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maXJzdExhc3QpIHtcclxuICAgICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGJ1dHRvbihjLCAxLCB0aGlzLm9wdGlvbnMuZmlyc3RUZXh0KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gcHJldiBidXR0b25cclxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubmV4dFByZXYpIHtcclxuICAgICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGJ1dHRvbihjLCBwcmV2LCB0aGlzLm9wdGlvbnMucHJldlRleHQpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgcGFnZXIgPSB0aGlzLmxpbmtzO1xyXG5cclxuICAgICAgICAgIC8vIHRydW5jYXRlIHRoZSBsaW5rc1xyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50cnVuY2F0ZVBhZ2VyKSB7XHJcbiAgICAgICAgICAgICAgcGFnZXIgPSB0cnVuY2F0ZShcclxuICAgICAgICAgICAgICAgICAgdGhpcy5saW5rcyxcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSxcclxuICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlckRlbHRhLFxyXG4gICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxsaXBzaXNUZXh0XHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBhY3RpdmUgcGFnZSBsaW5rXHJcbiAgICAgICAgICBjbGFzc0xpc3QuYWRkKHRoaXMubGlua3NbdGhpcy5jdXJyZW50UGFnZSAtIDFdLCBcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAvLyBhcHBlbmQgdGhlIGxpbmtzXHJcbiAgICAgICAgICBlYWNoKHBhZ2VyLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUocCwgXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGhpcy5saW5rc1t0aGlzLmN1cnJlbnRQYWdlIC0gMV0sIFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgIC8vIG5leHQgYnV0dG9uXHJcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm5leHRQcmV2KSB7XHJcbiAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChidXR0b24oYywgbmV4dCwgdGhpcy5vcHRpb25zLm5leHRUZXh0KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gZmlyc3QgYnV0dG9uXHJcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpcnN0TGFzdCkge1xyXG4gICAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoYnV0dG9uKGMsIHRoaXMudG90YWxQYWdlcywgdGhpcy5vcHRpb25zLmxhc3RUZXh0KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gV2UgbWF5IGhhdmUgbW9yZSB0aGFuIG9uZSBwYWdlclxyXG4gICAgICAgICAgZWFjaCh0aGlzLnBhZ2VycywgZnVuY3Rpb24gKHBhZ2VyKSB7XHJcbiAgICAgICAgICAgICAgcGFnZXIuYXBwZW5kQ2hpbGQoZnJhZy5jbG9uZU5vZGUodHJ1ZSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW5kZXIgdGhlIGhlYWRlclxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucmVuZGVySGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICB0aGF0LmxhYmVscyA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoYXQuaGVhZGluZ3MgJiYgdGhhdC5oZWFkaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgIGVhY2godGhhdC5oZWFkaW5ncywgZnVuY3Rpb24gKHRoLCBpKSB7XHJcblxyXG4gICAgICAgICAgICAgIHRoYXQubGFiZWxzW2ldID0gdGgudGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnModGguZmlyc3RFbGVtZW50Q2hpbGQsIFwiZGF0YVRhYmxlLXNvcnRlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICB0aC5pbm5lckhUTUwgPSB0aC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB0aC5zb3J0YWJsZSA9IHRoLmdldEF0dHJpYnV0ZShcImRhdGEtc29ydGFibGVcIikgIT09IFwiZmFsc2VcIjtcclxuXHJcbiAgICAgICAgICAgICAgdGgub3JpZ2luYWxDZWxsSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc29ydGFibGUgJiYgdGguc29ydGFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBjcmVhdGVFbGVtZW50KFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBocmVmOiBcIiNcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImRhdGFUYWJsZS1zb3J0ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IHRoLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgIHRoLnNldEF0dHJpYnV0ZShcImRhdGEtc29ydGFibGVcIiwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgIHRoLmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGF0LmZpeENvbHVtbnMoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBCaW5kIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHByb3RvLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgIG8gPSB0aGF0Lm9wdGlvbnM7XHJcblxyXG4gICAgICAvLyBQZXIgcGFnZSBzZWxlY3RvclxyXG4gICAgICBpZiAoby5wZXJQYWdlU2VsZWN0KSB7XHJcbiAgICAgICAgICB2YXIgc2VsZWN0b3IgPSB0aGF0LndyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5kYXRhVGFibGUtc2VsZWN0b3JcIik7XHJcbiAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGVyIHBhZ2VcclxuICAgICAgICAgICAgICBvbihzZWxlY3RvciwgXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgby5wZXJQYWdlID0gcGFyc2VJbnQodGhpcy52YWx1ZSwgMTApO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC5maXhIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuZW1pdChcImRhdGF0YWJsZS5wZXJwYWdlXCIsIG8ucGVyUGFnZSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbnB1dFxyXG4gICAgICBpZiAoby5zZWFyY2hhYmxlKSB7XHJcbiAgICAgICAgICB0aGF0LmlucHV0ID0gdGhhdC53cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YVRhYmxlLWlucHV0XCIpO1xyXG4gICAgICAgICAgaWYgKHRoYXQuaW5wdXQpIHtcclxuICAgICAgICAgICAgICBvbih0aGF0LmlucHV0LCBcImtleXVwXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuc2VhcmNoKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQYWdlcihzKSAvIHNvcnRpbmdcclxuICAgICAgb24odGhhdC53cmFwcGVyLCBcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIpIHtcclxuICAgICAgICAgICAgICBpZiAodC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VcIikpIHtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5wYWdlKHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYWdlXCIpKTtcclxuICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAgIG8uc29ydGFibGUgJiZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmNvbnRhaW5zKHQsIFwiZGF0YVRhYmxlLXNvcnRlclwiKSAmJlxyXG4gICAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3J0YWJsZVwiKSAhPSBcImZhbHNlXCJcclxuICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5jb2x1bW5zKCkuc29ydCh0aGF0LmFjdGl2ZUhlYWRpbmdzLmluZGV4T2YodC5wYXJlbnROb2RlKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXQgdXAgY29sdW1uc1xyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHByb3RvLnNldENvbHVtbnMgPSBmdW5jdGlvbiAoYWpheCkge1xyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKCFhamF4KSB7XHJcbiAgICAgICAgICBlYWNoKHRoYXQuZGF0YSwgZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgIGVhY2gocm93LmNlbGxzLCBmdW5jdGlvbiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLmRhdGEgPSBjZWxsLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgdGhlIGNvbHVtbnMgb3B0aW9uXHJcbiAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY29sdW1ucyAmJiB0aGF0LmhlYWRpbmdzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgIGVhY2godGhhdC5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIGNvbnZlcnQgc2luZ2xlIGNvbHVtbiBzZWxlY3Rpb24gdG8gYXJyYXlcclxuICAgICAgICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YS5zZWxlY3QpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuc2VsZWN0ID0gW2RhdGEuc2VsZWN0XTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwicmVuZGVyXCIpICYmIHR5cGVvZiBkYXRhLnJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRDb2x1bW5zID0gdGhhdC5zZWxlY3RlZENvbHVtbnMuY29uY2F0KGRhdGEuc2VsZWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuY29sdW1uUmVuZGVyZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uczogZGF0YS5zZWxlY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlcjogZGF0YS5yZW5kZXJcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgYXR0cmlidXRlcyB0byB0aGUgdGggZWxlbWVudHNcclxuICAgICAgICAgICAgICBlYWNoKGRhdGEuc2VsZWN0LCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aCA9IHRoYXQuaGVhZGluZ3NbY29sdW1uXTtcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGguc2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIsIGRhdGEudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWZvcm1hdFwiLCBkYXRhLmZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJzb3J0YWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGguc2V0QXR0cmlidXRlKFwiZGF0YS1zb3J0YWJsZVwiLCBkYXRhLnNvcnRhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJoaWRkZW5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmhpZGRlbiAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbHVtbnMoKS5oaWRlKGNvbHVtbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwic29ydFwiKSAmJiBkYXRhLnNlbGVjdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY29sdW1ucygpLnNvcnQoZGF0YS5zZWxlY3RbMF0gKyAxLCBkYXRhLnNvcnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoYXQuaGFzUm93cykge1xyXG4gICAgICAgICAgZWFjaCh0aGF0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgICAgICByb3cuZGF0YUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICAgICAgY2VsbC5kYXRhID0gY2VsbC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZENvbHVtbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgZWFjaCh0aGF0LmRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICAgICAgZWFjaChyb3cuY2VsbHMsIGZ1bmN0aW9uIChjZWxsLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZENvbHVtbnMuaW5kZXhPZihpKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaCh0aGF0LmNvbHVtblJlbmRlcmVycywgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8uY29sdW1ucy5pbmRleE9mKGkpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MID0gby5yZW5kZXJlci5jYWxsKHRoYXQsIGNlbGwuZGF0YSwgY2VsbCwgcm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGF0LmNvbHVtbnMoKS5yZWJ1aWxkKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoYXQucmVuZGVyKFwiaGVhZGVyXCIpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc3Ryb3kgdGhlIGluc3RhbmNlXHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnRhYmxlLmlubmVySFRNTCA9IHRoaXMuaW5pdGlhbExheW91dDtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0aGUgY2xhc3NOYW1lXHJcbiAgICAgIGNsYXNzTGlzdC5yZW1vdmUodGhpcy50YWJsZSwgXCJkYXRhVGFibGUtdGFibGVcIik7XHJcblxyXG4gICAgICAvLyBSZW1vdmUgdGhlIGNvbnRhaW5lcnNcclxuICAgICAgdGhpcy53cmFwcGVyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRoaXMudGFibGUsIHRoaXMud3JhcHBlcik7XHJcblxyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBpbnN0YW5jZVxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8udXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBjbGFzc0xpc3QucmVtb3ZlKHRoaXMud3JhcHBlciwgXCJkYXRhVGFibGUtZW1wdHlcIik7XHJcblxyXG4gICAgICB0aGlzLnBhZ2luYXRlKHRoaXMpO1xyXG4gICAgICB0aGlzLnJlbmRlcihcInBhZ2VcIik7XHJcblxyXG4gICAgICB0aGlzLmxpbmtzID0gW107XHJcblxyXG4gICAgICB2YXIgaSA9IHRoaXMucGFnZXMubGVuZ3RoO1xyXG4gICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICB2YXIgbnVtID0gaSArIDE7XHJcbiAgICAgICAgICB0aGlzLmxpbmtzW2ldID0gYnV0dG9uKGkgPT09IDAgPyBcImFjdGl2ZVwiIDogXCJcIiwgbnVtLCBudW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNvcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgIHRoaXMucmVuZGVyKFwicGFnZXJcIik7XHJcblxyXG4gICAgICB0aGlzLnJvd3MoKS51cGRhdGUoKTtcclxuXHJcbiAgICAgIHRoaXMuZW1pdChcImRhdGF0YWJsZS51cGRhdGVcIik7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU29ydCByb3dzIGludG8gcGFnZXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgcHJvdG8ucGFnaW5hdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwZXJQYWdlID0gdGhpcy5vcHRpb25zLnBlclBhZ2UsXHJcbiAgICAgICAgICByb3dzID0gdGhpcy5hY3RpdmVSb3dzO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2VhcmNoaW5nKSB7XHJcbiAgICAgICAgICByb3dzID0gW107XHJcblxyXG4gICAgICAgICAgZWFjaCh0aGlzLnNlYXJjaERhdGEsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgIHJvd3MucHVzaCh0aGlzLmFjdGl2ZVJvd3NbaW5kZXhdKTtcclxuICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgaGlkZGVuIGNvbHVtbnNcclxuICAgICAgdGhpcy5wYWdlcyA9IHJvd3NcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHRyLCBpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGkgJSBwZXJQYWdlID09PSAwID8gcm93cy5zbGljZShpLCBpICsgcGVyUGFnZSkgOiBudWxsO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHBhZ2UpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy50b3RhbFBhZ2VzID0gdGhpcy5sYXN0UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMudG90YWxQYWdlcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGaXggY29sdW1uIHdpZHRoc1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uZml4Q29sdW1ucyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZml4ZWRDb2x1bW5zICYmIHRoaXMuYWN0aXZlSGVhZGluZ3MgJiYgdGhpcy5hY3RpdmVIZWFkaW5ncy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICB2YXIgY2VsbHMsXHJcbiAgICAgICAgICAgICAgaGQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbHVtbldpZHRocyA9IFtdO1xyXG5cclxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgaGVhZGluZ3Mgd2UgbmVlZCBvbmx5IHNldCB0aGUgd2lkdGhzIG9uIHRoZW1cclxuICAgICAgICAgIC8vIG90aGVyd2lzZSB3ZSBuZWVkIGEgdGVtcCBoZWFkZXIgYW5kIHRoZSB3aWR0aHMgbmVlZCBhcHBseWluZyB0byBhbGwgY2VsbHNcclxuICAgICAgICAgIGlmICh0aGlzLnRhYmxlLnRIZWFkKSB7XHJcbiAgICAgICAgICAgICAgLy8gUmVzZXQgd2lkdGhzXHJcbiAgICAgICAgICAgICAgZWFjaCh0aGlzLmFjdGl2ZUhlYWRpbmdzLCBmdW5jdGlvbiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLndpZHRoID0gXCJcIjtcclxuICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgZWFjaCh0aGlzLmFjdGl2ZUhlYWRpbmdzLCBmdW5jdGlvbiAoY2VsbCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgb3cgPSBjZWxsLm9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdyA9IG93IC8gdGhpcy5yZWN0LndpZHRoICogMTAwO1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLndpZHRoID0gdyArIFwiJVwiO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbldpZHRoc1tpXSA9IG93O1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjZWxscyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAvLyBNYWtlIHRlbXBlcmFyeSBoZWFkaW5nc1xyXG4gICAgICAgICAgICAgIGhkID0gY3JlYXRlRWxlbWVudChcInRoZWFkXCIpO1xyXG4gICAgICAgICAgICAgIHZhciByID0gY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICAgICAgICAgIHZhciBjID0gdGhpcy50YWJsZS50Qm9kaWVzWzBdLnJvd3NbMF0uY2VsbHM7XHJcbiAgICAgICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aCA9IGNyZWF0ZUVsZW1lbnQoXCJ0aFwiKTtcclxuICAgICAgICAgICAgICAgICAgci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2godGgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBoZC5hcHBlbmRDaGlsZChyKTtcclxuICAgICAgICAgICAgICB0aGlzLnRhYmxlLmluc2VydEJlZm9yZShoZCwgdGhpcy5ib2R5KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIHdpZHRocyA9IFtdO1xyXG4gICAgICAgICAgICAgIGVhY2goY2VsbHMsIGZ1bmN0aW9uIChjZWxsLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBvdyA9IGNlbGwub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB3ID0gb3cgLyB0aGlzLnJlY3Qud2lkdGggKiAxMDA7XHJcbiAgICAgICAgICAgICAgICAgIHdpZHRocy5wdXNoKHcpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbldpZHRoc1tpXSA9IG93O1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICBlYWNoKHRoaXMuZGF0YSwgZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbHVtbnMoY2VsbC5jZWxsSW5kZXgpLnZpc2libGUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLndpZHRoID0gd2lkdGhzW2ldICsgXCIlXCI7XHJcbiAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBEaXNjYXJkIHRoZSB0ZW1wIGhlYWRlclxyXG4gICAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlQ2hpbGQoaGQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRml4IHRoZSBjb250YWluZXIgaGVpZ2h0O1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uZml4SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmZpeGVkSGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgdGhpcy5yZWN0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSB0aGlzLnJlY3QuaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBhIHNlYXJjaCBvZiB0aGUgZGF0YSBzZXRcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHF1ZXJ5XHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5zZWFyY2ggPSBmdW5jdGlvbiAocXVlcnkpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgIHF1ZXJ5ID0gcXVlcnkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICB0aGlzLnNlYXJjaGluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuc2VhcmNoRGF0YSA9IFtdO1xyXG5cclxuICAgICAgaWYgKCFxdWVyeS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRoaXMuc2VhcmNoaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgdGhpcy5lbWl0KFwiZGF0YXRhYmxlLnNlYXJjaFwiLCBxdWVyeSwgdGhpcy5zZWFyY2hEYXRhKTtcclxuICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUodGhpcy53cmFwcGVyLCBcInNlYXJjaC1yZXN1bHRzXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICBlYWNoKHRoaXMuZGF0YSwgZnVuY3Rpb24gKHJvdywgaWR4KSB7XHJcbiAgICAgICAgICB2YXIgaW5BcnJheSA9IHRoaXMuc2VhcmNoRGF0YS5pbmRleE9mKHJvdykgPiAtMTtcclxuXHJcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9iaXVzMS9WYW5pbGxhLURhdGFUYWJsZXMvaXNzdWVzLzEyXHJcbiAgICAgICAgICB2YXIgZG9lc1F1ZXJ5TWF0Y2ggPSBxdWVyeS5zcGxpdChcIiBcIikucmVkdWNlKGZ1bmN0aW9uIChib29sLCB3b3JkKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGluY2x1ZGVzID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGNlbGwgPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByb3cuY2VsbHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgY2VsbCA9IHJvdy5jZWxsc1t4XTtcclxuICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNlbGwuaGFzQXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKSA/IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKSA6IGNlbGwudGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih3b3JkKSA+IC0xICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbHVtbnMoY2VsbC5jZWxsSW5kZXgpLnZpc2libGUoKVxyXG4gICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gYm9vbCAmJiBpbmNsdWRlcztcclxuICAgICAgICAgIH0sIHRydWUpO1xyXG5cclxuICAgICAgICAgIGlmIChkb2VzUXVlcnlNYXRjaCAmJiAhaW5BcnJheSkge1xyXG4gICAgICAgICAgICAgIHJvdy5zZWFyY2hJbmRleCA9IGlkeDtcclxuICAgICAgICAgICAgICB0aGlzLnNlYXJjaERhdGEucHVzaChpZHgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByb3cuc2VhcmNoSW5kZXggPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgIGNsYXNzTGlzdC5hZGQodGhpcy53cmFwcGVyLCBcInNlYXJjaC1yZXN1bHRzXCIpO1xyXG5cclxuICAgICAgaWYgKCF0aGF0LnNlYXJjaERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKHRoYXQud3JhcHBlciwgXCJzZWFyY2gtcmVzdWx0c1wiKTtcclxuXHJcbiAgICAgICAgICB0aGF0LnNldE1lc3NhZ2UodGhhdC5vcHRpb25zLmxhYmVscy5ub1Jvd3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5lbWl0KFwiZGF0YXRhYmxlLnNlYXJjaFwiLCBxdWVyeSwgdGhpcy5zZWFyY2hEYXRhKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGFuZ2UgcGFnZVxyXG4gICAqIEBwYXJhbSAge2ludH0gcGFnZVxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucGFnZSA9IGZ1bmN0aW9uIChwYWdlKSB7XHJcbiAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gbG9hZCB0aGUgY3VycmVudCBwYWdlIGFnYWluLlxyXG4gICAgICBpZiAocGFnZSA9PSB0aGlzLmN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghaXNOYU4ocGFnZSkpIHtcclxuICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBwYXJzZUludChwYWdlLCAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYWdlID4gdGhpcy5wYWdlcy5sZW5ndGggfHwgcGFnZSA8IDApIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5yZW5kZXIoXCJwYWdlXCIpO1xyXG4gICAgICB0aGlzLnJlbmRlcihcInBhZ2VyXCIpO1xyXG5cclxuICAgICAgdGhpcy5lbWl0KFwiZGF0YXRhYmxlLnBhZ2VcIiwgcGFnZSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU29ydCBieSBjb2x1bW5cclxuICAgKiBAcGFyYW0gIHtpbnR9IGNvbHVtbiAtIFRoZSBjb2x1bW4gbm8uXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBkaXJlY3Rpb24gLSBhc2Mgb3IgZGVzY1xyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uc29ydENvbHVtbiA9IGZ1bmN0aW9uIChjb2x1bW4sIGRpcmVjdGlvbikge1xyXG4gICAgICAvLyBVc2UgY29sdW1ucyBBUEkgdW50aWwgc29ydENvbHVtbiBtZXRob2QgaXMgcmVtb3ZlZFxyXG4gICAgICB0aGlzLmNvbHVtbnMoKS5zb3J0KGNvbHVtbiwgZGlyZWN0aW9uKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGQgbmV3IHJvdyBkYXRhXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFcclxuICAgKi9cclxuICBwcm90by5pbnNlcnQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgcm93cyA9IFtdO1xyXG4gICAgICBpZiAoaXNPYmplY3QoZGF0YSkpIHtcclxuICAgICAgICAgIGlmIChkYXRhLmhlYWRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCF0aGF0Lmhhc0hlYWRpbmdzICYmICF0aGF0Lmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRyID0gY3JlYXRlRWxlbWVudChcInRyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGg7XHJcbiAgICAgICAgICAgICAgICAgIGVhY2goZGF0YS5oZWFkaW5ncywgZnVuY3Rpb24gKGhlYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoID0gY3JlYXRlRWxlbWVudChcInRoXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sOiBoZWFkaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LmhlYWQuYXBwZW5kQ2hpbGQodHIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIgPSB0cjtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkaW5ncyA9IFtdLnNsaWNlLmNhbGwodHIuY2VsbHMpO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0Lmhhc0hlYWRpbmdzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFJlLWVuYWJsZSBzb3J0aW5nIGlmIGl0IHdhcyBkaXNhYmxlZCBkdWVcclxuICAgICAgICAgICAgICAgICAgLy8gdG8gbWlzc2luZyBoZWFkZXJcclxuICAgICAgICAgICAgICAgICAgdGhhdC5vcHRpb25zLnNvcnRhYmxlID0gdGhhdC5pbml0aWFsU29ydGFibGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBBbGxvdyBzb3J0aW5nIG9uIG5ldyBoZWFkZXJcclxuICAgICAgICAgICAgICAgICAgdGhhdC5yZW5kZXIoXCJoZWFkZXJcIik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgaXNBcnJheShkYXRhLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgcm93cyA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICBlYWNoKGRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICB2YXIgciA9IFtdO1xyXG4gICAgICAgICAgICAgIGVhY2gocm93LCBmdW5jdGlvbiAoY2VsbCwgaGVhZGluZykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhhdC5sYWJlbHMuaW5kZXhPZihoZWFkaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByW2luZGV4XSA9IGNlbGw7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByb3dzLnB1c2gocik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJvd3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGF0LnJvd3MoKS5hZGQocm93cyk7XHJcblxyXG4gICAgICAgICAgdGhhdC5oYXNSb3dzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC51cGRhdGUoKTtcclxuXHJcbiAgICAgIHRoYXQuZml4Q29sdW1ucygpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZnJlc2ggdGhlIGluc3RhbmNlXHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNlYXJjaGFibGUpIHtcclxuICAgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgdGhpcy5zZWFyY2hpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgdGhpcy5vbkZpcnN0UGFnZSA9IHRydWU7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICB0aGlzLmVtaXQoXCJkYXRhdGFibGUucmVmcmVzaFwiKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUcnVuY2F0ZSB0aGUgdGFibGVcclxuICAgKiBAcGFyYW0gIHttaXhlc30gaHRtbCAtIEhUTUwgc3RyaW5nIG9yIEhUTUxFbGVtZW50XHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5jbGVhciA9IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgIGlmICh0aGlzLmJvZHkpIHtcclxuICAgICAgICAgIGZsdXNoKHRoaXMuYm9keSwgdGhpcy5pc0lFKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHBhcmVudCA9IHRoaXMuYm9keTtcclxuICAgICAgaWYgKCF0aGlzLmJvZHkpIHtcclxuICAgICAgICAgIHBhcmVudCA9IHRoaXMudGFibGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChodG1sKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGh0bWwgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgZnJhZyA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgICAgICAgZnJhZy5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChodG1sKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydCB0YWJsZSB0byB2YXJpb3VzIGZvcm1hdHMgKGNzdiwgdHh0IG9yIHNxbClcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgVXNlciBvcHRpb25zXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBwcm90by5leHBvcnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSGVhZGluZ3MgJiYgIXRoaXMuaGFzUm93cykgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgdmFyIGhlYWRlcnMgPSB0aGlzLmFjdGl2ZUhlYWRpbmdzLFxyXG4gICAgICAgICAgcm93cyA9IFtdLFxyXG4gICAgICAgICAgYXJyID0gW10sXHJcbiAgICAgICAgICBpLFxyXG4gICAgICAgICAgeCxcclxuICAgICAgICAgIHN0cixcclxuICAgICAgICAgIGxpbms7XHJcblxyXG4gICAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICBkb3dubG9hZDogdHJ1ZSxcclxuICAgICAgICAgIHNraXBDb2x1bW46IFtdLFxyXG5cclxuICAgICAgICAgIC8vIGNzdlxyXG4gICAgICAgICAgbGluZURlbGltaXRlcjogXCJcXG5cIixcclxuICAgICAgICAgIGNvbHVtbkRlbGltaXRlcjogXCIsXCIsXHJcblxyXG4gICAgICAgICAgLy8gc3FsXHJcbiAgICAgICAgICB0YWJsZU5hbWU6IFwibXlUYWJsZVwiLFxyXG5cclxuICAgICAgICAgIC8vIGpzb25cclxuICAgICAgICAgIHJlcGxhY2VyOiBudWxsLFxyXG4gICAgICAgICAgc3BhY2U6IDRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciB0aGUgb3B0aW9ucyBvYmplY3RcclxuICAgICAgaWYgKCFpc09iamVjdChvcHRpb25zKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgbyA9IGV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICBpZiAoby50eXBlKSB7XHJcbiAgICAgICAgICBpZiAoby50eXBlID09PSBcInR4dFwiIHx8IG8udHlwZSA9PT0gXCJjc3ZcIikge1xyXG4gICAgICAgICAgICAgIC8vIEluY2x1ZGUgaGVhZGluZ3NcclxuICAgICAgICAgICAgICByb3dzWzBdID0gdGhpcy5oZWFkZXI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gU2VsZWN0aW9uIG9yIHdob2xlIHRhYmxlXHJcbiAgICAgICAgICBpZiAoby5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAvLyBQYWdlIG51bWJlclxyXG4gICAgICAgICAgICAgIGlmICghaXNOYU4oby5zZWxlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJvd3MgPSByb3dzLmNvbmNhdCh0aGlzLnBhZ2VzW28uc2VsZWN0aW9uIC0gMV0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShvLnNlbGVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb2YgcGFnZSBudW1iZXJzXHJcbiAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvLnNlbGVjdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHJvd3MuY29uY2F0KHRoaXMucGFnZXNbby5zZWxlY3Rpb25baV0gLSAxXSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJvd3MgPSByb3dzLmNvbmNhdCh0aGlzLmFjdGl2ZVJvd3MpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIE9ubHkgcHJvY2VlZCBpZiB3ZSBoYXZlIGRhdGFcclxuICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGlmIChvLnR5cGUgPT09IFwidHh0XCIgfHwgby50eXBlID09PSBcImNzdlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIHN0ciA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHJvd3NbaV0uY2VsbHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sdW1uIHNraXAgYW5kIHZpc2liaWxpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2tpcENvbHVtbi5pbmRleE9mKGhlYWRlcnNbeF0ub3JpZ2luYWxDZWxsSW5kZXgpIDwgMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbnMoaGVhZGVyc1t4XS5vcmlnaW5hbENlbGxJbmRleCkudmlzaWJsZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gcm93c1tpXS5jZWxsc1t4XS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHN7Mix9L2csICcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnICAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXCIvZywgJ1wiXCInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQuaW5kZXhPZihcIixcIikgPiAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAnXCInICsgdGV4dCArICdcIic7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IHRleHQgKyBvLmNvbHVtbkRlbGltaXRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgY29sdW1uIGRlbGltaXRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnRyaW0oKS5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGx5IGxpbmUgZGVsaW1pdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gby5saW5lRGVsaW1pdGVyO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgbGluZSBkZWxpbWl0ZXJcclxuICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnRyaW0oKS5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFwiICsgc3RyO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnR5cGUgPT09IFwic3FsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gQmVnaW4gSU5TRVJUIHN0YXRlbWVudFxyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBcIklOU0VSVCBJTlRPIGBcIiArIG8udGFibGVOYW1lICsgXCJgIChcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGFibGUgaGVhZGluZ3MgdG8gY29sdW1uIG5hbWVzXHJcbiAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sdW1uIHNraXAgYW5kIGNvbHVtbiB2aXNpYmlsaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgby5za2lwQ29sdW1uLmluZGV4T2YoaGVhZGVyc1tpXS5vcmlnaW5hbENlbGxJbmRleCkgPCAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5zKGhlYWRlcnNbaV0ub3JpZ2luYWxDZWxsSW5kZXgpLnZpc2libGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiYFwiICsgaGVhZGVyc1tpXS50ZXh0Q29udGVudCArIFwiYCxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIGNvbW1hXHJcbiAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci50cmltKCkuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIEJlZ2luIFZBTFVFU1xyXG4gICAgICAgICAgICAgICAgICBzdHIgKz0gXCIpIFZBTFVFUyBcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgcm93cyBhbmQgY29udmVydCBjZWxsIGRhdGEgdG8gY29sdW1uIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiKFwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCByb3dzW2ldLmNlbGxzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGNvbHVtbiBza2lwIGFuZCBjb2x1bW4gdmlzaWJpbGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5za2lwQ29sdW1uLmluZGV4T2YoaGVhZGVyc1t4XS5vcmlnaW5hbENlbGxJbmRleCkgPCAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sdW1ucyhoZWFkZXJzW3hdLm9yaWdpbmFsQ2VsbEluZGV4KS52aXNpYmxlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcIicgKyByb3dzW2ldLmNlbGxzW3hdLnRleHRDb250ZW50ICsgJ1wiLCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBjb21tYVxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnRyaW0oKS5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIGVuZCBWQUxVRVNcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBcIiksXCI7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBjb21tYVxyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBzdHIudHJpbSgpLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBBZGQgdHJhaWxpbmcgY29sb25cclxuICAgICAgICAgICAgICAgICAgc3RyICs9IFwiO1wiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiZGF0YTphcHBsaWNhdGlvbi9zcWw7Y2hhcnNldD11dGYtOCxcIiArIHN0cjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoby50eXBlID09PSBcImpzb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIHJvd3NcclxuICAgICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHJvd3MubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGFyclt4XSA9IGFyclt4XSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sdW1uIHNraXAgYW5kIGNvbHVtbiB2aXNpYmlsaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnNraXBDb2x1bW4uaW5kZXhPZihoZWFkZXJzW2ldLm9yaWdpbmFsQ2VsbEluZGV4KSA8IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5zKGhlYWRlcnNbaV0ub3JpZ2luYWxDZWxsSW5kZXgpLnZpc2libGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJbeF1baGVhZGVyc1tpXS50ZXh0Q29udGVudF0gPSByb3dzW3hdLmNlbGxzW2ldLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2Ygb2JqZWN0cyB0byBKU09OIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBKU09OLnN0cmluZ2lmeShhcnIsIG8ucmVwbGFjZXIsIG8uc3BhY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsXCIgKyBzdHI7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIERvd25sb2FkXHJcbiAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gRmlsZW5hbWVcclxuICAgICAgICAgICAgICAgICAgby5maWxlbmFtZSA9IG8uZmlsZW5hbWUgfHwgXCJkYXRhdGFibGVfZXhwb3J0XCI7XHJcbiAgICAgICAgICAgICAgICAgIG8uZmlsZW5hbWUgKz0gXCIuXCIgKyBvLnR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBlbmNvZGVVUkkoc3RyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGxpbmsgdG8gdHJpZ2dlciB0aGUgZG93bmxvYWRcclxuICAgICAgICAgICAgICAgICAgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBzdHI7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmsuZG93bmxvYWQgPSBvLmZpbGVuYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBsaW5rXHJcbiAgICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHRoZSBkb3dubG9hZFxyXG4gICAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxpbmtcclxuICAgICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBJbXBvcnQgZGF0YSB0byB0aGUgdGFibGVcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgVXNlciBvcHRpb25zXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBwcm90by5pbXBvcnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICB2YXIgb2JqID0gZmFsc2U7XHJcbiAgICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICAgIC8vIGNzdlxyXG4gICAgICAgICAgbGluZURlbGltaXRlcjogXCJcXG5cIixcclxuICAgICAgICAgIGNvbHVtbkRlbGltaXRlcjogXCIsXCJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciB0aGUgb3B0aW9ucyBvYmplY3RcclxuICAgICAgaWYgKCFpc09iamVjdChvcHRpb25zKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmRhdGEubGVuZ3RoIHx8IGlzT2JqZWN0KG9wdGlvbnMuZGF0YSkpIHtcclxuICAgICAgICAgIC8vIEltcG9ydCBDU1ZcclxuICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09IFwiY3N2XCIpIHtcclxuICAgICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gU3BsaXQgdGhlIHN0cmluZyBpbnRvIHJvd3NcclxuICAgICAgICAgICAgICB2YXIgcm93cyA9IG9wdGlvbnMuZGF0YS5zcGxpdChvcHRpb25zLmxpbmVEZWxpbWl0ZXIpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhlYWRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvYmouaGVhZGluZ3MgPSByb3dzWzBdLnNwbGl0KG9wdGlvbnMuY29sdW1uRGVsaW1pdGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICByb3dzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGVhY2gocm93cywgZnVuY3Rpb24gKHJvdywgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb2JqLmRhdGFbaV0gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBTcGxpdCB0aGUgcm93cyBpbnRvIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHJvdy5zcGxpdChvcHRpb25zLmNvbHVtbkRlbGltaXRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoKHZhbHVlcywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5kYXRhW2ldLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJqc29uXCIpIHtcclxuICAgICAgICAgICAgICB2YXIganNvbiA9IGlzSnNvbihvcHRpb25zLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBWYWxpZCBKU09OIHN0cmluZ1xyXG4gICAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGhlYWRpbmdzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICBlYWNoKGpzb24sIGZ1bmN0aW9uIChkYXRhLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvYmouZGF0YVtpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbiAodmFsdWUsIGNvbHVtbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGVhZGluZ3MuaW5kZXhPZihjb2x1bW4pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaGVhZGluZ3MucHVzaChjb2x1bW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmRhdGFbaV0ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVGhhdCdzIG5vdCB2YWxpZCBKU09OIVwiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlzT2JqZWN0KG9wdGlvbnMuZGF0YSkpIHtcclxuICAgICAgICAgICAgICBvYmogPSBvcHRpb25zLmRhdGE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICAgIC8vIEFkZCB0aGUgcm93c1xyXG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KG9iaik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIFByaW50IHRoZSB0YWJsZVxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucHJpbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBoZWFkaW5ncyA9IHRoaXMuYWN0aXZlSGVhZGluZ3M7XHJcbiAgICAgIHZhciByb3dzID0gdGhpcy5hY3RpdmVSb3dzO1xyXG4gICAgICB2YXIgdGFibGUgPSBjcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcbiAgICAgIHZhciB0aGVhZCA9IGNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiKTtcclxuICAgICAgdmFyIHRib2R5ID0gY3JlYXRlRWxlbWVudChcInRib2R5XCIpO1xyXG5cclxuICAgICAgdmFyIHRyID0gY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICBlYWNoKGhlYWRpbmdzLCBmdW5jdGlvbiAodGgpIHtcclxuICAgICAgICAgIHRyLmFwcGVuZENoaWxkKFxyXG4gICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgIGh0bWw6IHRoLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhlYWQuYXBwZW5kQ2hpbGQodHIpO1xyXG5cclxuICAgICAgZWFjaChyb3dzLCBmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgICAgICB2YXIgdHIgPSBjcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZChcclxuICAgICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IGNlbGwudGV4dENvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodGhlYWQpO1xyXG4gICAgICB0YWJsZS5hcHBlbmRDaGlsZCh0Ym9keSk7XHJcblxyXG4gICAgICAvLyBPcGVuIG5ldyB3aW5kb3dcclxuICAgICAgdmFyIHcgPSB3aW4ub3BlbigpO1xyXG5cclxuICAgICAgLy8gQXBwZW5kIHRoZSB0YWJsZSB0byB0aGUgYm9keVxyXG4gICAgICB3LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGFibGUpO1xyXG5cclxuICAgICAgLy8gUHJpbnRcclxuICAgICAgdy5wcmludCgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3cgYSBtZXNzYWdlIGluIHRoZSB0YWJsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXHJcbiAgICovXHJcbiAgcHJvdG8uc2V0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgIHZhciBjb2xzcGFuID0gMTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgIGNvbHNwYW4gPSB0aGlzLmRhdGFbMF0uY2VsbHMubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGFzc0xpc3QuYWRkKHRoaXMud3JhcHBlciwgXCJkYXRhVGFibGUtZW1wdHlcIik7XHJcblxyXG4gICAgICB0aGlzLmNsZWFyKFxyXG4gICAgICAgICAgY3JlYXRlRWxlbWVudChcInRyXCIsIHtcclxuICAgICAgICAgICAgICBodG1sOiAnPHRkIGNsYXNzPVwiZGF0YVRhYmxlcy1lbXB0eVwiIGNvbHNwYW49XCInICtcclxuICAgICAgICAgICAgICAgICAgY29sc3BhbiArXHJcbiAgICAgICAgICAgICAgICAgICdcIj4nICtcclxuICAgICAgICAgICAgICAgICAgbWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAgIFwiPC90ZD5cIlxyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDb2x1bW5zIEFQSSBhY2Nlc3NcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IG5ldyBDb2x1bW5zIGluc3RhbmNlXHJcbiAgICovXHJcbiAgcHJvdG8uY29sdW1ucyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ29sdW1ucyh0aGlzLCBjb2x1bW5zKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSb3dzIEFQSSBhY2Nlc3NcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IG5ldyBSb3dzIGluc3RhbmNlXHJcbiAgICovXHJcbiAgcHJvdG8ucm93cyA9IGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUm93cyh0aGlzLCByb3dzKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGQgY3VzdG9tIGV2ZW50IGxpc3RlbmVyXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBldmVudFxyXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XHJcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHRoaXMuZXZlbnRzW2V2ZW50XSB8fCBbXTtcclxuICAgICAgdGhpcy5ldmVudHNbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBjdXN0b20gZXZlbnQgbGlzdGVuZXJcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGV2ZW50XHJcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBwcm90by5vZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XHJcbiAgICAgIGlmIChldmVudCBpbiB0aGlzLmV2ZW50cyA9PT0gZmFsc2UpIHJldHVybjtcclxuICAgICAgdGhpcy5ldmVudHNbZXZlbnRdLnNwbGljZSh0aGlzLmV2ZW50c1tldmVudF0uaW5kZXhPZihjYWxsYmFjayksIDEpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpcmUgY3VzdG9tIGV2ZW50XHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBldmVudFxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9O1xyXG4gICAgICBpZiAoZXZlbnQgaW4gdGhpcy5ldmVudHMgPT09IGZhbHNlKSByZXR1cm47XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnRdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF1baV0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gRGF0YVRhYmxlO1xyXG59KTsiLCIvKipcclxuICogW2pzLW1kNV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1tZDV9XHJcbiAqXHJcbiAqIEBuYW1lc3BhY2UgbWQ1XHJcbiAqIEB2ZXJzaW9uIDAuNy4zXHJcbiAqIEBhdXRob3IgQ2hlbiwgWWktQ3l1YW4gW2VtbjE3OEBnbWFpbC5jb21dXHJcbiAqIEBjb3B5cmlnaHQgQ2hlbiwgWWktQ3l1YW4gMjAxNC0yMDE3XHJcbiAqIEBsaWNlbnNlIE1JVFxyXG4gKi9cclxuISBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgZnVuY3Rpb24gdCh0KSB7IGlmICh0KSBkWzBdID0gZFsxNl0gPSBkWzFdID0gZFsyXSA9IGRbM10gPSBkWzRdID0gZFs1XSA9IGRbNl0gPSBkWzddID0gZFs4XSA9IGRbOV0gPSBkWzEwXSA9IGRbMTFdID0gZFsxMl0gPSBkWzEzXSA9IGRbMTRdID0gZFsxNV0gPSAwLCB0aGlzLmJsb2NrcyA9IGQsIHRoaXMuYnVmZmVyOCA9IGw7XHJcbiAgICAgICAgZWxzZSBpZiAoYSkgeyB2YXIgciA9IG5ldyBBcnJheUJ1ZmZlcig2OCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyOCA9IG5ldyBVaW50OEFycmF5KHIpLCB0aGlzLmJsb2NrcyA9IG5ldyBVaW50MzJBcnJheShyKSB9IGVsc2UgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcbiAgICAgICAgdGhpcy5oMCA9IHRoaXMuaDEgPSB0aGlzLmgyID0gdGhpcy5oMyA9IHRoaXMuc3RhcnQgPSB0aGlzLmJ5dGVzID0gdGhpcy5oQnl0ZXMgPSAwLCB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gITEsIHRoaXMuZmlyc3QgPSAhMCB9IHZhciByID0gXCJpbnB1dCBpcyBpbnZhbGlkIHR5cGVcIixcclxuICAgICAgICBlID0gXCJvYmplY3RcIiA9PSB0eXBlb2Ygd2luZG93LFxyXG4gICAgICAgIGkgPSBlID8gd2luZG93IDoge307XHJcbiAgICBpLkpTX01ENV9OT19XSU5ET1cgJiYgKGUgPSAhMSk7IHZhciBzID0gIWUgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2Ygc2VsZixcclxuICAgICAgICBoID0gIWkuSlNfTUQ1X05PX05PREVfSlMgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2YgcHJvY2VzcyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcclxuICAgIGggPyBpID0gZ2xvYmFsIDogcyAmJiAoaSA9IHNlbGYpOyB2YXIgZiA9ICFpLkpTX01ENV9OT19DT01NT05fSlMgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2YgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzLFxyXG4gICAgICAgIG8gPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kLFxyXG4gICAgICAgIGEgPSAhaS5KU19NRDVfTk9fQVJSQVlfQlVGRkVSICYmIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIEFycmF5QnVmZmVyLFxyXG4gICAgICAgIG4gPSBcIjAxMjM0NTY3ODlhYmNkZWZcIi5zcGxpdChcIlwiKSxcclxuICAgICAgICB1ID0gWzEyOCwgMzI3NjgsIDgzODg2MDgsIC0yMTQ3NDgzNjQ4XSxcclxuICAgICAgICB5ID0gWzAsIDgsIDE2LCAyNF0sXHJcbiAgICAgICAgYyA9IFtcImhleFwiLCBcImFycmF5XCIsIFwiZGlnZXN0XCIsIFwiYnVmZmVyXCIsIFwiYXJyYXlCdWZmZXJcIiwgXCJiYXNlNjRcIl0sXHJcbiAgICAgICAgcCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLnNwbGl0KFwiXCIpLFxyXG4gICAgICAgIGQgPSBbXSxcclxuICAgICAgICBsOyBpZiAoYSkgeyB2YXIgQSA9IG5ldyBBcnJheUJ1ZmZlcig2OCk7XHJcbiAgICAgICAgbCA9IG5ldyBVaW50OEFycmF5KEEpLCBkID0gbmV3IFVpbnQzMkFycmF5KEEpIH0haS5KU19NRDVfTk9fTk9ERV9KUyAmJiBBcnJheS5pc0FycmF5IHx8IChBcnJheS5pc0FycmF5ID0gZnVuY3Rpb24odCkgeyByZXR1cm4gXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkgfSksICFhIHx8ICFpLkpTX01ENV9OT19BUlJBWV9CVUZGRVJfSVNfVklFVyAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgKEFycmF5QnVmZmVyLmlzVmlldyA9IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIFwib2JqZWN0XCIgPT0gdHlwZW9mIHQgJiYgdC5idWZmZXIgJiYgdC5idWZmZXIuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyIH0pOyB2YXIgYiA9IGZ1bmN0aW9uKHIpIHsgcmV0dXJuIGZ1bmN0aW9uKGUpIHsgcmV0dXJuIG5ldyB0KCEwKS51cGRhdGUoZSlbcl0oKSB9IH0sXHJcbiAgICAgICAgdiA9IGZ1bmN0aW9uKCkgeyB2YXIgciA9IGIoXCJoZXhcIik7XHJcbiAgICAgICAgICAgIGggJiYgKHIgPSB3KHIpKSwgci5jcmVhdGUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyB0IH0sIHIudXBkYXRlID0gZnVuY3Rpb24odCkgeyByZXR1cm4gci5jcmVhdGUoKS51cGRhdGUodCkgfTsgZm9yICh2YXIgZSA9IDA7IGUgPCBjLmxlbmd0aDsgKytlKSB7IHZhciBpID0gY1tlXTtcclxuICAgICAgICAgICAgICAgIHJbaV0gPSBiKGkpIH0gcmV0dXJuIHIgfSxcclxuICAgICAgICB3ID0gZnVuY3Rpb24odCkgeyB2YXIgZSA9IGV2YWwoXCJyZXF1aXJlKCdjcnlwdG8nKVwiKSxcclxuICAgICAgICAgICAgICAgIGkgPSBldmFsKFwicmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgcyA9IGZ1bmN0aW9uKHMpIHsgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIHMpIHJldHVybiBlLmNyZWF0ZUhhc2goXCJtZDVcIikudXBkYXRlKHMsIFwidXRmOFwiKS5kaWdlc3QoXCJoZXhcIik7IGlmIChudWxsID09PSBzIHx8IHZvaWQgMCA9PT0gcykgdGhyb3cgcjsgcmV0dXJuIHMuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyICYmIChzID0gbmV3IFVpbnQ4QXJyYXkocykpLCBBcnJheS5pc0FycmF5KHMpIHx8IEFycmF5QnVmZmVyLmlzVmlldyhzKSB8fCBzLmNvbnN0cnVjdG9yID09PSBpID8gZS5jcmVhdGVIYXNoKFwibWQ1XCIpLnVwZGF0ZShuZXcgaShzKSkuZGlnZXN0KFwiaGV4XCIpIDogdChzKSB9OyByZXR1cm4gcyB9O1xyXG4gICAgdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24odCkgeyBpZiAoIXRoaXMuZmluYWxpemVkKSB7IHZhciBlLCBpID0gdHlwZW9mIHQ7IGlmIChcInN0cmluZ1wiICE9PSBpKSB7IGlmIChcIm9iamVjdFwiICE9PSBpKSB0aHJvdyByOyBpZiAobnVsbCA9PT0gdCkgdGhyb3cgcjsgaWYgKGEgJiYgdC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpIHQgPSBuZXcgVWludDhBcnJheSh0KTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCEoQXJyYXkuaXNBcnJheSh0KSB8fCBhICYmIEFycmF5QnVmZmVyLmlzVmlldyh0KSkpIHRocm93IHI7XHJcbiAgICAgICAgICAgICAgICBlID0gITAgfSBmb3IgKHZhciBzLCBoLCBmID0gMCwgbyA9IHQubGVuZ3RoLCBuID0gdGhpcy5ibG9ja3MsIHUgPSB0aGlzLmJ1ZmZlcjg7IGYgPCBvOykgeyBpZiAodGhpcy5oYXNoZWQgJiYgKHRoaXMuaGFzaGVkID0gITEsIG5bMF0gPSBuWzE2XSwgblsxNl0gPSBuWzFdID0gblsyXSA9IG5bM10gPSBuWzRdID0gbls1XSA9IG5bNl0gPSBuWzddID0gbls4XSA9IG5bOV0gPSBuWzEwXSA9IG5bMTFdID0gblsxMl0gPSBuWzEzXSA9IG5bMTRdID0gblsxNV0gPSAwKSwgZSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpIHVbaCsrXSA9IHRbZl07XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikgbltoID4+IDJdIHw9IHRbZl0gPDwgeVszICYgaCsrXTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGEpXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpKHMgPSB0LmNoYXJDb2RlQXQoZikpIDwgMTI4ID8gdVtoKytdID0gcyA6IHMgPCAyMDQ4ID8gKHVbaCsrXSA9IDE5MiB8IHMgPj4gNiwgdVtoKytdID0gMTI4IHwgNjMgJiBzKSA6IHMgPCA1NTI5NiB8fCBzID49IDU3MzQ0ID8gKHVbaCsrXSA9IDIyNCB8IHMgPj4gMTIsIHVbaCsrXSA9IDEyOCB8IHMgPj4gNiAmIDYzLCB1W2grK10gPSAxMjggfCA2MyAmIHMpIDogKHMgPSA2NTUzNiArICgoMTAyMyAmIHMpIDw8IDEwIHwgMTAyMyAmIHQuY2hhckNvZGVBdCgrK2YpKSwgdVtoKytdID0gMjQwIHwgcyA+PiAxOCwgdVtoKytdID0gMTI4IHwgcyA+PiAxMiAmIDYzLCB1W2grK10gPSAxMjggfCBzID4+IDYgJiA2MywgdVtoKytdID0gMTI4IHwgNjMgJiBzKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikocyA9IHQuY2hhckNvZGVBdChmKSkgPCAxMjggPyBuW2ggPj4gMl0gfD0gcyA8PCB5WzMgJiBoKytdIDogcyA8IDIwNDggPyAobltoID4+IDJdIHw9ICgxOTIgfCBzID4+IDYpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgNjMgJiBzKSA8PCB5WzMgJiBoKytdKSA6IHMgPCA1NTI5NiB8fCBzID49IDU3MzQ0ID8gKG5baCA+PiAyXSB8PSAoMjI0IHwgcyA+PiAxMikgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCBzID4+IDYgJiA2MykgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pIDogKHMgPSA2NTUzNiArICgoMTAyMyAmIHMpIDw8IDEwIHwgMTAyMyAmIHQuY2hhckNvZGVBdCgrK2YpKSwgbltoID4+IDJdIHw9ICgyNDAgfCBzID4+IDE4KSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gMTIgJiA2MykgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCBzID4+IDYgJiA2MykgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaCwgdGhpcy5ieXRlcyArPSBoIC0gdGhpcy5zdGFydCwgaCA+PSA2NCA/ICh0aGlzLnN0YXJ0ID0gaCAtIDY0LCB0aGlzLmhhc2goKSwgdGhpcy5oYXNoZWQgPSAhMCkgOiB0aGlzLnN0YXJ0ID0gaCB9IHJldHVybiB0aGlzLmJ5dGVzID4gNDI5NDk2NzI5NSAmJiAodGhpcy5oQnl0ZXMgKz0gdGhpcy5ieXRlcyAvIDQyOTQ5NjcyOTYgPDwgMCwgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2KSwgdGhpcyB9IH0sIHQucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24oKSB7IGlmICghdGhpcy5maW5hbGl6ZWQpIHsgdGhpcy5maW5hbGl6ZWQgPSAhMDsgdmFyIHQgPSB0aGlzLmJsb2NrcyxcclxuICAgICAgICAgICAgICAgIHIgPSB0aGlzLmxhc3RCeXRlSW5kZXg7XHJcbiAgICAgICAgICAgIHRbciA+PiAyXSB8PSB1WzMgJiByXSwgciA+PSA1NiAmJiAodGhpcy5oYXNoZWQgfHwgdGhpcy5oYXNoKCksIHRbMF0gPSB0WzE2XSwgdFsxNl0gPSB0WzFdID0gdFsyXSA9IHRbM10gPSB0WzRdID0gdFs1XSA9IHRbNl0gPSB0WzddID0gdFs4XSA9IHRbOV0gPSB0WzEwXSA9IHRbMTFdID0gdFsxMl0gPSB0WzEzXSA9IHRbMTRdID0gdFsxNV0gPSAwKSwgdFsxNF0gPSB0aGlzLmJ5dGVzIDw8IDMsIHRbMTVdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5LCB0aGlzLmhhc2goKSB9IH0sIHQucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbigpIHsgdmFyIHQsIHIsIGUsIGksIHMsIGgsIGYgPSB0aGlzLmJsb2NrcztcclxuICAgICAgICB0aGlzLmZpcnN0ID8gciA9ICgociA9ICgodCA9ICgodCA9IGZbMF0gLSA2ODA4NzY5MzcpIDw8IDcgfCB0ID4+PiAyNSkgLSAyNzE3MzM4NzkgPDwgMCkgXiAoZSA9ICgoZSA9ICgtMjcxNzMzODc5IF4gKGkgPSAoKGkgPSAoLTE3MzI1ODQxOTQgXiAyMDA0MzE4MDcxICYgdCkgKyBmWzFdIC0gMTE3ODMwNzA4KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAoLTI3MTczMzg3OSBeIHQpKSArIGZbMl0gLSAxMTI2NDc4Mzc1KSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbM10gLSAxMzE2MjU5MjA5KSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCA6ICh0ID0gdGhpcy5oMCwgciA9IHRoaXMuaDEsIGUgPSB0aGlzLmgyLCByID0gKChyICs9ICgodCA9ICgodCArPSAoKGkgPSB0aGlzLmgzKSBeIHIgJiAoZSBeIGkpKSArIGZbMF0gLSA2ODA4NzY5MzYpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbMV0gLSAzODk1NjQ1ODYpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZlsyXSArIDYwNjEwNTgxOSkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzNdIC0gMTA0NDUyNTMzMCkgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDApLCByID0gKChyICs9ICgodCA9ICgodCArPSAoaSBeIHIgJiAoZSBeIGkpKSArIGZbNF0gLSAxNzY0MTg4OTcpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbNV0gKyAxMjAwMDgwNDI2KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbNl0gLSAxNDczMjMxMzQxKSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbN10gLSA0NTcwNTk4MykgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9IChpIF4gciAmIChlIF4gaSkpICsgZls4XSArIDE3NzAwMzU0MTYpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbOV0gLSAxOTU4NDE0NDE3KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbMTBdIC0gNDIwNjMpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlsxMV0gLSAxOTkwNDA0MTYyKSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKGkgXiByICYgKGUgXiBpKSkgKyBmWzEyXSArIDE4MDQ2MDM2ODIpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbMTNdIC0gNDAzNDExMDEpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZlsxNF0gLSAxNTAyMDAyMjkwKSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbMTVdICsgMTIzNjUzNTMyOSkgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbMV0gLSAxNjU3OTY1MTApIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZls2XSAtIDEwNjk1MDE2MzIpIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbMTFdICsgNjQzNzE3NzEzKSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzBdIC0gMzczODk3MzAyKSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZls1XSAtIDcwMTU1ODY5MSkgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzEwXSArIDM4MDE2MDgzKSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzE1XSAtIDY2MDQ3ODMzNSkgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZls0XSAtIDQwNTUzNzg0OCkgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbOV0gKyA1Njg0NDY0MzgpIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZlsxNF0gLSAxMDE5ODAzNjkwKSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzNdIC0gMTg3MzYzOTYxKSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzhdICsgMTE2MzUzMTUwMSkgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbMTNdIC0gMTQ0NDY4MTQ2NykgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzJdIC0gNTE0MDM3ODQpIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbN10gKyAxNzM1MzI4NDczKSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzEyXSAtIDE5MjY2MDc3MzQpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzVdIC0gMzc4NTU4KSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzhdIC0gMjAyMjU3NDQ2MykgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZlsxMV0gKyAxODM5MDMwNTYyKSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZlsxNF0gLSAzNTMwOTU1NikgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZlsxXSAtIDE1MzA5OTIwNjApIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbNF0gKyAxMjcyODkzMzUzKSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzddIC0gMTU1NDk3NjMyKSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZlsxMF0gLSAxMDk0NzMwNjQwKSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzEzXSArIDY4MTI3OTE3NCkgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZlswXSAtIDM1ODUzNzIyMikgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZlszXSAtIDcyMjUyMTk3OSkgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbNl0gKyA3NjAyOTE4OSkgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZls5XSAtIDY0MDM2NDQ4NykgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZlsxMl0gLSA0MjE4MTU4MzUpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbMTVdICsgNTMwNzQyNTIwKSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZlsyXSAtIDk5NTMzODY1MSkgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzBdIC0gMTk4NjMwODQ0KSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzddICsgMTEyNjg5MTQxNSkgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZlsxNF0gLSAxNDE2MzU0OTA1KSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZls1XSAtIDU3NDM0MDU1KSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzEyXSArIDE3MDA0ODU1NzEpIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbM10gLSAxODk0OTg2NjA2KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzEwXSAtIDEwNTE1MjMpIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzFdIC0gMjA1NDkyMjc5OSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZls4XSArIDE4NzMzMTMzNTkpIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbMTVdIC0gMzA2MTE3NDQpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbNl0gLSAxNTYwMTk4MzgwKSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZlsxM10gKyAxMzA5MTUxNjQ5KSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzRdIC0gMTQ1NTIzMDcwKSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzExXSAtIDExMjAyMTAzNzkpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbMl0gKyA3MTg3ODcyNTkpIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzldIC0gMzQzNDg1NTUxKSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgdGhpcy5maXJzdCA/ICh0aGlzLmgwID0gdCArIDE3MzI1ODQxOTMgPDwgMCwgdGhpcy5oMSA9IHIgLSAyNzE3MzM4NzkgPDwgMCwgdGhpcy5oMiA9IGUgLSAxNzMyNTg0MTk0IDw8IDAsIHRoaXMuaDMgPSBpICsgMjcxNzMzODc4IDw8IDAsIHRoaXMuZmlyc3QgPSAhMSkgOiAodGhpcy5oMCA9IHRoaXMuaDAgKyB0IDw8IDAsIHRoaXMuaDEgPSB0aGlzLmgxICsgciA8PCAwLCB0aGlzLmgyID0gdGhpcy5oMiArIGUgPDwgMCwgdGhpcy5oMyA9IHRoaXMuaDMgKyBpIDw8IDApIH0sIHQucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmZpbmFsaXplKCk7IHZhciB0ID0gdGhpcy5oMCxcclxuICAgICAgICAgICAgciA9IHRoaXMuaDEsXHJcbiAgICAgICAgICAgIGUgPSB0aGlzLmgyLFxyXG4gICAgICAgICAgICBpID0gdGhpcy5oMzsgcmV0dXJuIG5bdCA+PiA0ICYgMTVdICsgblsxNSAmIHRdICsgblt0ID4+IDEyICYgMTVdICsgblt0ID4+IDggJiAxNV0gKyBuW3QgPj4gMjAgJiAxNV0gKyBuW3QgPj4gMTYgJiAxNV0gKyBuW3QgPj4gMjggJiAxNV0gKyBuW3QgPj4gMjQgJiAxNV0gKyBuW3IgPj4gNCAmIDE1XSArIG5bMTUgJiByXSArIG5bciA+PiAxMiAmIDE1XSArIG5bciA+PiA4ICYgMTVdICsgbltyID4+IDIwICYgMTVdICsgbltyID4+IDE2ICYgMTVdICsgbltyID4+IDI4ICYgMTVdICsgbltyID4+IDI0ICYgMTVdICsgbltlID4+IDQgJiAxNV0gKyBuWzE1ICYgZV0gKyBuW2UgPj4gMTIgJiAxNV0gKyBuW2UgPj4gOCAmIDE1XSArIG5bZSA+PiAyMCAmIDE1XSArIG5bZSA+PiAxNiAmIDE1XSArIG5bZSA+PiAyOCAmIDE1XSArIG5bZSA+PiAyNCAmIDE1XSArIG5baSA+PiA0ICYgMTVdICsgblsxNSAmIGldICsgbltpID4+IDEyICYgMTVdICsgbltpID4+IDggJiAxNV0gKyBuW2kgPj4gMjAgJiAxNV0gKyBuW2kgPj4gMTYgJiAxNV0gKyBuW2kgPj4gMjggJiAxNV0gKyBuW2kgPj4gMjQgJiAxNV0gfSwgdC5wcm90b3R5cGUudG9TdHJpbmcgPSB0LnByb3RvdHlwZS5oZXgsIHQucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmZpbmFsaXplKCk7IHZhciB0ID0gdGhpcy5oMCxcclxuICAgICAgICAgICAgciA9IHRoaXMuaDEsXHJcbiAgICAgICAgICAgIGUgPSB0aGlzLmgyLFxyXG4gICAgICAgICAgICBpID0gdGhpcy5oMzsgcmV0dXJuIFsyNTUgJiB0LCB0ID4+IDggJiAyNTUsIHQgPj4gMTYgJiAyNTUsIHQgPj4gMjQgJiAyNTUsIDI1NSAmIHIsIHIgPj4gOCAmIDI1NSwgciA+PiAxNiAmIDI1NSwgciA+PiAyNCAmIDI1NSwgMjU1ICYgZSwgZSA+PiA4ICYgMjU1LCBlID4+IDE2ICYgMjU1LCBlID4+IDI0ICYgMjU1LCAyNTUgJiBpLCBpID4+IDggJiAyNTUsIGkgPj4gMTYgJiAyNTUsIGkgPj4gMjQgJiAyNTVdIH0sIHQucHJvdG90eXBlLmFycmF5ID0gdC5wcm90b3R5cGUuZGlnZXN0LCB0LnByb3RvdHlwZS5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkgeyB0aGlzLmZpbmFsaXplKCk7IHZhciB0ID0gbmV3IEFycmF5QnVmZmVyKDE2KSxcclxuICAgICAgICAgICAgciA9IG5ldyBVaW50MzJBcnJheSh0KTsgcmV0dXJuIHJbMF0gPSB0aGlzLmgwLCByWzFdID0gdGhpcy5oMSwgclsyXSA9IHRoaXMuaDIsIHJbM10gPSB0aGlzLmgzLCB0IH0sIHQucHJvdG90eXBlLmJ1ZmZlciA9IHQucHJvdG90eXBlLmFycmF5QnVmZmVyLCB0LnByb3RvdHlwZS5iYXNlNjQgPSBmdW5jdGlvbigpIHsgZm9yICh2YXIgdCwgciwgZSwgaSA9IFwiXCIsIHMgPSB0aGlzLmFycmF5KCksIGggPSAwOyBoIDwgMTU7KSB0ID0gc1toKytdLCByID0gc1toKytdLCBlID0gc1toKytdLCBpICs9IHBbdCA+Pj4gMl0gKyBwWzYzICYgKHQgPDwgNCB8IHIgPj4+IDQpXSArIHBbNjMgJiAociA8PCAyIHwgZSA+Pj4gNildICsgcFs2MyAmIGVdOyByZXR1cm4gdCA9IHNbaF0sIGkgKz0gcFt0ID4+PiAyXSArIHBbdCA8PCA0ICYgNjNdICsgXCI9PVwiIH07IHZhciBfID0gdigpO1xyXG4gICAgZiA/IG1vZHVsZS5leHBvcnRzID0gXyA6IChpLm1kNSA9IF8sIG8gJiYgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gXyB9KSkgfSgpOyIsIi8qIGpzaGludCBsYXhicmVhazogdHJ1ZSAqL1xyXG4vKiBleHBlcmltZW50YWw6IFthc3luY2F3YWl0LCBhc3luY3JlcWF3YWl0XSAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1vZGFsRGlhbG9nKHRpdGxlLCBtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBsZXQgbWVzc2FnZUNvbnRlbnQgPSBcIlwiO1xyXG4gICAgLy9sZXQgTW9kYWxEaWFsb2dPYmplY3QgPSB7fTtcclxuXHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICBvcHRpb25zID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJ3aW5kb3cubW9kYWxEaWFsb2dBbGVydDogXCIsIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0KTtcclxuICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgIFwiLk1vZGFsRGlhbG9nLWFsZXJ0OiBcIixcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLk1vZGFsRGlhbG9nLWFsZXJ0XCIpXHJcbiAgICApO1xyXG5cclxuICAgIC8vaWYgKHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQpIGRlbGV0ZSB3aW5kb3cubW9kYWxEaWFsb2dBbGVydDtcclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIikpIHtcclxuICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5Nb2RhbERpYWxvZy1hbGVydFwiKSkge1xyXG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuTW9kYWxEaWFsb2ctYWxlcnRcIik7XHJcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0KSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQpIGRlbGV0ZSB3aW5kb3cubW9kYWxEaWFsb2dBbGVydDtcclxuICAgICAgICBkZWxldGUgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQ7XHJcbiAgICB9XHJcbiAgICBpZiAoIXdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0KSB7XHJcbiAgICAgICAgdmFyIE1vZGFsRGlhbG9nT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBlbGVtZW50OiBudWxsLFxyXG4gICAgICAgICAgICBjYW5jZWxFbGVtZW50OiBudWxsLFxyXG4gICAgICAgICAgICBjb25maXJtRWxlbWVudDogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctYWxlcnRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVmaW5lIGRlZmF1bHQgb3B0aW9uc1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QudHlwZSA9XHJcbiAgICAgICAgb3B0aW9ucy50eXBlICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnR5cGUgOiBcIk9rQ2FuY2VsXCI7XHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC53aWR0aCA9XHJcbiAgICAgICAgb3B0aW9ucy53aWR0aCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy53aWR0aCA6IFwiNjQwcHhcIjtcclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbCA9XHJcbiAgICAgICAgb3B0aW9ucy5jYW5jZWwgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2FuY2VsIDogZmFsc2U7XHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5jYW5jZWxUZXh0ID1cclxuICAgICAgICBvcHRpb25zLmNhbmNlbFRleHQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2FuY2VsVGV4dCA6IFwiQ2FuY2VsXCI7XHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5jb25maXJtID1cclxuICAgICAgICBvcHRpb25zLmNvbmZpcm0gIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY29uZmlybSA6IHRydWU7XHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5jb25maXJtVGV4dCA9XHJcbiAgICAgICAgb3B0aW9ucy5jb25maXJtVGV4dCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jb25maXJtVGV4dCA6IFwiQ29uZmlybVwiO1xyXG5cclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbENhbGxCYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1kaWFsb2ctb3BlblwiKTtcclxuICAgICAgICB3aW5kb3cubW9kYWxEaWFsb2dBbGVydC5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAvLyBDYW5jZWwgY2FsbGJhY2tcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FuY2VsQ2FsbEJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmNhbmNlbENhbGxCYWNrKGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENhbmNlbGxlZFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ2xvc2UgYWxlcnQgb24gY2xpY2sgb3V0c2lkZVxyXG4gICAgLyogaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuTW9kYWxEaWFsb2ctbWFza1wiKSkge1xyXG4gICAgICBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLk1vZGFsRGlhbG9nLW1hc2tcIilcclxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1kaWFsb2ctb3BlblwiKTtcclxuICAgICAgICAgIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgLy8gQ2FuY2VsIGNhbGxiYWNrXHJcbiAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FuY2VsQ2FsbEJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmNhbmNlbENhbGxCYWNrKGV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIENsaWNrZWQgb3V0c2lkZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSAqL1xyXG5cclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QudGl0bGUgPSB0aXRsZTtcclxuXHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5jb25maXJtQ2FsbEJhY2sgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcblxyXG4gICAgICAgIC8vIENvbmZpcm0gY2FsbGJhY2tcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY29uZmlybUNhbGxCYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChNb2RhbERpYWxvZ09iamVjdC50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwicHJvbXB0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtZGlhbG9nLW9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7IFxyXG4gICAgICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29uZmlybUNhbGxCYWNrKGV2ZW50LCBNb2RhbERpYWxvZ09iamVjdC5pbnB1dElkLnZhbHVlLnRyaW0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hhbmdlUGFzc3dvcmRcIjpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhNb2RhbERpYWxvZ09iamVjdC5uZXdwYXNzd29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtZGlhbG9nLW9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7IFxyXG4gICAgICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29uZmlybUNhbGxCYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QubmV3cGFzc3dvcmQudmFsdWUudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5uZXdwYXNzd29yZDIudmFsdWUudHJpbSgpXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2hhcmVGaWxlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb25maXJtQ2FsbEJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdFVzZXJOYW1lOiBNb2RhbERpYWxvZ09iamVjdC5kZXN0VXNlck5hbWUudmFsdWUudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVFeHBpcmF0ZURhdGU6IE1vZGFsRGlhbG9nT2JqZWN0LkZpbGVFeHBpcmF0ZURhdGUudmFsdWUudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlbEZpbGVBZnRlckV4cGlyZWQ6IE1vZGFsRGlhbG9nT2JqZWN0LmRlbEZpbGVBZnRlckV4cGlyZWQuY2hlY2tlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhazsgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWRpYWxvZy1vcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyBcclxuICAgICAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbmZpcm1DYWxsQmFjayhldmVudCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDb25maXJtZWRcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QuX0lmVXNlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IGVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGlmIChlbC52YWx1ZS50cmltKCkgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3VzZWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCd1c2VkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBCdXR0b24gQ2xvc2UgV2luZG93IERpYWxvZ1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QuTW9kYWxDbG9zZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpO1xyXG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgIC8qIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWRpYWxvZy1vcGVuXCIpO1xyXG4gICAgICAgIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyAqL1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gV2luZG93IERpYWxvZyBjb250ZW50XHJcbiAgICBpZiAoIU1vZGFsRGlhbG9nT2JqZWN0LmVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgaHRtbENvbnRlbnQgPSBcIlwiO1xyXG5cclxuICAgICAgICBodG1sQ29udGVudCA9XHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiTW9kYWxEaWFsb2ctYWxlcnRcIiBpZD1cIk1vZGFsRGlhbG9nLWFsZXJ0XCI+JyArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiTW9kYWxEaWFsb2ctbWFza1wiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWJvZHlcIiBhcmlhLXJlbGV2YW50PVwiYWxsXCI+JyArXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiTW9kYWxEaWFsb2ctdGl0bGVcIj4nICtcclxuICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QudGl0bGUgK1xyXG4gICAgICAgICAgICBcIjwvZGl2PlwiICtcclxuICAgICAgICAgICAgJzxhIGNsYXNzPVwiTW9kYWxEaWFsb2ctY2xvc2VcIiBpZD1cIk1vZGFsRGlhbG9nQ2xvc2VcIiBocmVmPVwiI1wiPjwvYT4nO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIk1vZGFsRGlhbG9nT2JqZWN0LnR5cGU6IFwiLCBNb2RhbERpYWxvZ09iamVjdC50eXBlKTtcclxuXHJcbiAgICAgICAgLy8gQm9keSBjb250ZW50XHJcblxyXG4gICAgICAgIHN3aXRjaCAoTW9kYWxEaWFsb2dPYmplY3QudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwicHJvbXB0XCI6XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlQ29udGVudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWNvbnRlbnRcIiBpZD1cIk1vZGFsRGlhbG9nLWNvbnRlbnRcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWlucHV0LWZpZWxkXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBpZD1cImlucHV0SWRcIiBjbGFzcz1cIk1vZGFsRGlhbG9nLWlucHV0XCIgdHlwZT1cInRleHRcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGxhYmVsIGZvcj1cImlucHV0SWRcIiBjbGFzcz1cIk1vZGFsRGlhbG9nLWxhYmVsXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QubWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvbGFiZWw+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiY2hhbmdlUGFzc3dvcmRcIjpcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VDb250ZW50ID1cclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWNvbnRhaW5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiTW9kYWxEaWFsb2ctY29udGVudFwiIGlkPVwiTW9kYWxEaWFsb2ctY29udGVudFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm1lc3NhZ2UgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicHJvbXB0XCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInByb21wdFwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlQ29udGVudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWNvbnRlbnRcIiBpZD1cIk1vZGFsRGlhbG9nLWNvbnRlbnRcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5tZXNzYWdlICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCdXR0b24gY29udGFpbmVyIGNvbnRlbnQgXHJcbiAgICAgICAgaHRtbENvbnRlbnQgKz0gbWVzc2FnZUNvbnRlbnQgK1xyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWJ1dHRvblwiPic7XHJcbiAgICAgICAgaWYgKE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbCB8fCB0cnVlKSB7XHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50ICs9XHJcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuMi11bmlmeSBNb2RhbERpYWxvZy1idXR0b24tY2FuY2VsXCIgIGlkPVwiTW9kYWxEaWFsb2ctYnV0dG9uLWNhbmNlbFwiPicgK1xyXG4gICAgICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuY2FuY2VsVGV4dCArXHJcbiAgICAgICAgICAgICAgICBcIjwvYT5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChNb2RhbERpYWxvZ09iamVjdC5jb25maXJtIHx8IHRydWUpIHtcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQgKz1cclxuICAgICAgICAgICAgICAgICc8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4yLXVuaWZ5IE1vZGFsRGlhbG9nLWJ1dHRvbi1jb25maXJtXCIgaWQ9XCJNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiPicgK1xyXG4gICAgICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybVRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8L2E+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sQ29udGVudCArPSAnPC9kaXY+PC9kaXY+PC9kaXY+JztcclxuICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5odG1sID0gaHRtbENvbnRlbnQ7XHJcblxyXG5cclxuICAgICAgICAvLyBBZGQgY29udGVudCB0byBET01cclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZWxlbWVudC5pZCA9IFwiTW9kYWxEaWFsb2ctd3JhcFwiO1xyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbENvbnRlbnQ7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QubW9kYWxDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2dDbG9zZVwiKTtcclxuICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5Nb2RhbERpYWxvZy1hbGVydFwiKTtcclxuICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5jYW5jZWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy1idXR0b24tY2FuY2VsXCIpO1xyXG4gICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNvbmZpcm1FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiKTtcclxuXHJcbiAgICAgICAgaWYgKE1vZGFsRGlhbG9nT2JqZWN0LnR5cGUgPT09IFwicHJvbXB0XCIpIHtcclxuICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuaW5wdXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5wdXRJZFwiKTtcclxuICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuaW5wdXRJZC5vbmJsdXIgPSBNb2RhbERpYWxvZ09iamVjdC5fSWZVc2VkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoTW9kYWxEaWFsb2dPYmplY3QudHlwZSA9PT0gXCJjaGFuZ2VQYXNzd29yZFwiKSB7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm5ld3Bhc3N3b3JkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNuZXdwYXNzd29yZFwiKTtcclxuICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QubmV3cGFzc3dvcmQyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNuZXdwYXNzd29yZDJcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm5ld3Bhc3N3b3JkLm9uYmx1ciA9IE1vZGFsRGlhbG9nT2JqZWN0Ll9JZlVzZWQ7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm5ld3Bhc3N3b3JkMi5vbmJsdXIgPSBNb2RhbERpYWxvZ09iamVjdC5fSWZVc2VkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoTW9kYWxEaWFsb2dPYmplY3QudHlwZSA9PT0gXCJzaGFyZUZpbGVcIikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLk1vZGFsRGlhbG9nLWJvZHlcIikuY2xhc3NMaXN0LmFkZChcInNoYXJlRmlsZVwiKTtcclxuICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuZGVzdFVzZXJOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkZXN0VXNlck5hbWVcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LkZpbGVFeHBpcmF0ZURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0ZpbGVFeHBpcmF0ZURhdGVcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmRlbEZpbGVBZnRlckV4cGlyZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RlbEZpbGVBZnRlckV4cGlyZWRcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmRlc3RVc2VyTmFtZS5vbmJsdXIgPSBNb2RhbERpYWxvZ09iamVjdC5fSWZVc2VkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmFibGVkIGNhbmNlbCBidXR0b24gY2FsbGJhY2tcclxuICAgICAgICBpZiAoTW9kYWxEaWFsb2dPYmplY3QuY2FuY2VsKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctYnV0dG9uLWNhbmNlbFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctYnV0dG9uLWNhbmNlbFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFbmFibGVkIGNhbmNlbCBidXR0b24gY2FsbGJhY2tcclxuICAgICAgICBpZiAoTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLWJ1dHRvbi1jb25maXJtXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm1vZGFsQ2xvc2Uub25jbGljayA9IE1vZGFsRGlhbG9nT2JqZWN0Lk1vZGFsQ2xvc2U7XHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuY2FuY2VsRWxlbWVudC5vbmNsaWNrID0gTW9kYWxEaWFsb2dPYmplY3QuY2FuY2VsQ2FsbEJhY2s7XHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybUVsZW1lbnQub25jbGljayA9IE1vZGFsRGlhbG9nT2JqZWN0LmNvbmZpcm1DYWxsQmFjaztcclxuXHJcbiAgICAgICAgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQgPSBNb2RhbERpYWxvZ09iamVjdDtcclxuICAgIH1cclxuXHJcblxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG52YXIgYnRvYSA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYnRvYSAmJiB3aW5kb3cuYnRvYS5iaW5kKHdpbmRvdykpIHx8IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idG9hJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIGxvYWRFdmVudCA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICAgIHZhciB4RG9tYWluID0gZmFsc2U7XG5cbiAgICAvLyBGb3IgSUUgOC85IENPUlMgc3VwcG9ydFxuICAgIC8vIE9ubHkgc3VwcG9ydHMgUE9TVCBhbmQgR0VUIGNhbGxzIGFuZCBkb2Vzbid0IHJldHVybnMgdGhlIHJlc3BvbnNlIGhlYWRlcnMuXG4gICAgLy8gRE9OJ1QgZG8gdGhpcyBmb3IgdGVzdGluZyBiL2MgWE1MSHR0cFJlcXVlc3QgaXMgbW9ja2VkLCBub3QgWERvbWFpblJlcXVlc3QuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ICYmICEoJ3dpdGhDcmVkZW50aWFscycgaW4gcmVxdWVzdCkgJiZcbiAgICAgICAgIWlzVVJMU2FtZU9yaWdpbihjb25maWcudXJsKSkge1xuICAgICAgcmVxdWVzdCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIGxvYWRFdmVudCA9ICdvbmxvYWQnO1xuICAgICAgeERvbWFpbiA9IHRydWU7XG4gICAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiBoYW5kbGVQcm9ncmVzcygpIHt9O1xuICAgICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge307XG4gICAgfVxuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCB8fCAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdFtsb2FkRXZlbnRdID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0ICYmICF4RG9tYWluKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICAvLyBJRSBzZW5kcyAxMjIzIGluc3RlYWQgb2YgMjA0IChodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzIwMSlcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/IDIwNCA6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1cyA9PT0gMTIyMyA/ICdObyBDb250ZW50JyA6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgdmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3REYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UodXRpbHMubWVyZ2UoZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gdXRpbHMubWVyZ2Uoe1xuICAgICAgdXJsOiBhcmd1bWVudHNbMF1cbiAgICB9LCBhcmd1bWVudHNbMV0pO1xuICB9XG5cbiAgY29uZmlnID0gdXRpbHMubWVyZ2UoZGVmYXVsdHMsIHttZXRob2Q6ICdnZXQnfSwgdGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodXRpbHMubWVyZ2UoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gU3VwcG9ydCBiYXNlVVJMIGNvbmZpZ1xuICBpZiAoY29uZmlnLmJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwoY29uZmlnLnVybCkpIHtcbiAgICBjb25maWcudXJsID0gY29tYmluZVVSTHMoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICB9XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVycyB8fCB7fVxuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICAvLyBOb3RlOiBzdGF0dXMgaXMgbm90IGV4cG9zZWQgYnkgWERvbWFpblJlcXVlc3RcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGJ0b2EgcG9seWZpbGwgZm9yIElFPDEwIGNvdXJ0ZXN5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXZpZGNoYW1iZXJzL0Jhc2U2NC5qc1xuXG52YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuXG5mdW5jdGlvbiBFKCkge1xuICB0aGlzLm1lc3NhZ2UgPSAnU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyJztcbn1cbkUucHJvdG90eXBlID0gbmV3IEVycm9yO1xuRS5wcm90b3R5cGUuY29kZSA9IDU7XG5FLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cbmZ1bmN0aW9uIGJ0b2EoaW5wdXQpIHtcbiAgdmFyIHN0ciA9IFN0cmluZyhpbnB1dCk7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgZm9yIChcbiAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgIHZhciBibG9jaywgY2hhckNvZGUsIGlkeCA9IDAsIG1hcCA9IGNoYXJzO1xuICAgIC8vIGlmIHRoZSBuZXh0IHN0ciBpbmRleCBkb2VzIG5vdCBleGlzdDpcbiAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgIC8vICAgY2hlY2sgaWYgZCBoYXMgbm8gZnJhY3Rpb25hbCBkaWdpdHNcbiAgICBzdHIuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgIC8vIFwiOCAtIGlkeCAlIDEgKiA4XCIgZ2VuZXJhdGVzIHRoZSBzZXF1ZW5jZSAyLCA0LCA2LCA4XG4gICAgb3V0cHV0ICs9IG1hcC5jaGFyQXQoNjMgJiBibG9jayA+PiA4IC0gaWR4ICUgMSAqIDgpXG4gICkge1xuICAgIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaWR4ICs9IDMgLyA0KTtcbiAgICBpZiAoY2hhckNvZGUgPiAweEZGKSB7XG4gICAgICB0aHJvdyBuZXcgRSgpO1xuICAgIH1cbiAgICBibG9jayA9IGJsb2NrIDw8IDggfCBjaGFyQ29kZTtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ0b2E7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICB9LFxuXG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgIH1cblxuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltXG59O1xuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvKlxuICogIGJhc2U2NC5qc1xuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG4gKiAgICBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogIFJlZmVyZW5jZXM6XG4gKiAgICBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NFxuICovXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoZ2xvYmFsKVxuICAgICAgICA6IHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZFxuICAgICAgICA/IGRlZmluZShmYWN0b3J5KSA6IGZhY3RvcnkoZ2xvYmFsKVxufSgoXG4gICAgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZlxuICAgICAgICA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93XG4gICAgICAgIDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxcbjogdGhpc1xuKSwgZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIGV4aXN0aW5nIHZlcnNpb24gZm9yIG5vQ29uZmxpY3QoKVxuICAgIHZhciBfQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB2YXIgdmVyc2lvbiA9IFwiMi40LjlcIjtcbiAgICAvLyBpZiBub2RlLmpzIGFuZCBOT1QgUmVhY3QgTmF0aXZlLCB3ZSB1c2UgQnVmZmVyXG4gICAgdmFyIGJ1ZmZlcjtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IGV2YWwoXCJyZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYnVmZmVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnN0YW50c1xuICAgIHZhciBiNjRjaGFyc1xuICAgICAgICA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcbiAgICB2YXIgYjY0dGFiID0gZnVuY3Rpb24oYmluKSB7XG4gICAgICAgIHZhciB0ID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYmluLmxlbmd0aDsgaSA8IGw7IGkrKykgdFtiaW4uY2hhckF0KGkpXSA9IGk7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0oYjY0Y2hhcnMpO1xuICAgIHZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuICAgIC8vIGVuY29kZXIgc3R1ZmZcbiAgICB2YXIgY2JfdXRvYiA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgaWYgKGMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdmFyIGNjID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgcmV0dXJuIGNjIDwgMHg4MCA/IGNcbiAgICAgICAgICAgICAgICA6IGNjIDwgMHg4MDAgPyAoZnJvbUNoYXJDb2RlKDB4YzAgfCAoY2MgPj4+IDYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpKVxuICAgICAgICAgICAgICAgIDogKGZyb21DaGFyQ29kZSgweGUwIHwgKChjYyA+Pj4gMTIpICYgMHgwZikpXG4gICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgPyBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWwuYnRvYShiKTtcbiAgICB9IDogZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5yZXBsYWNlKC9bXFxzXFxTXXsxLDN9L2csIGNiX2VuY29kZSk7XG4gICAgfTtcbiAgICB2YXIgX2VuY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICA/IGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gKHUuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvciA/IHUgOiBidWZmZXIuZnJvbSh1KSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIH1cbiAgICAgICAgOiAgZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIHJldHVybiAodS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yID8gdSA6IG5ldyAgYnVmZmVyKHUpKVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBidG9hKHV0b2IodSkpIH1cbiAgICA7XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuICF1cmlzYWZlXG4gICAgICAgICAgICA/IF9lbmNvZGUoU3RyaW5nKHUpKVxuICAgICAgICAgICAgOiBfZW5jb2RlKFN0cmluZyh1KSkucmVwbGFjZSgvWytcXC9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0wID09ICcrJyA/ICctJyA6ICdfJztcbiAgICAgICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIC8vIGRlY29kZXIgc3R1ZmZcbiAgICB2YXIgcmVfYnRvdSA9IG5ldyBSZWdFeHAoW1xuICAgICAgICAnW1xceEMwLVxceERGXVtcXHg4MC1cXHhCRl0nLFxuICAgICAgICAnW1xceEUwLVxceEVGXVtcXHg4MC1cXHhCRl17Mn0nLFxuICAgICAgICAnW1xceEYwLVxceEY3XVtcXHg4MC1cXHhCRl17M30nXG4gICAgXS5qb2luKCd8JyksICdnJyk7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIGF0b2IgPSBnbG9iYWwuYXRvYiA/IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbC5hdG9iKGEpO1xuICAgIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvW1xcc1xcU117MSw0fS9nLCBjYl9kZWNvZGUpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBidWZmZXIgP1xuICAgICAgICBidWZmZXIuZnJvbSAmJiBVaW50OEFycmF5ICYmIGJ1ZmZlci5mcm9tICE9PSBVaW50OEFycmF5LmZyb21cbiAgICAgICAgPyBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBidWZmZXIuZnJvbShhLCAnYmFzZTY0JykpLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBuZXcgYnVmZmVyKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGJ0b3UoYXRvYihhKSkgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKFxuICAgICAgICAgICAgU3RyaW5nKGEpLnJlcGxhY2UoL1stX10vZywgZnVuY3Rpb24obTApIHsgcmV0dXJuIG0wID09ICctJyA/ICcrJyA6ICcvJyB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL10vZywgJycpXG4gICAgICAgICk7XG4gICAgfTtcbiAgICB2YXIgbm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NCA9IF9CYXNlNjQ7XG4gICAgICAgIHJldHVybiBCYXNlNjQ7XG4gICAgfTtcbiAgICAvLyBleHBvcnQgQmFzZTY0XG4gICAgZ2xvYmFsLkJhc2U2NCA9IHtcbiAgICAgICAgVkVSU0lPTjogdmVyc2lvbixcbiAgICAgICAgYXRvYjogYXRvYixcbiAgICAgICAgYnRvYTogYnRvYSxcbiAgICAgICAgZnJvbUJhc2U2NDogZGVjb2RlLFxuICAgICAgICB0b0Jhc2U2NDogZW5jb2RlLFxuICAgICAgICB1dG9iOiB1dG9iLFxuICAgICAgICBlbmNvZGU6IGVuY29kZSxcbiAgICAgICAgZW5jb2RlVVJJOiBlbmNvZGVVUkksXG4gICAgICAgIGJ0b3U6IGJ0b3UsXG4gICAgICAgIGRlY29kZTogZGVjb2RlLFxuICAgICAgICBub0NvbmZsaWN0OiBub0NvbmZsaWN0LFxuICAgICAgICBfX2J1ZmZlcl9fOiBidWZmZXJcbiAgICB9O1xuICAgIC8vIGlmIEVTNSBpcyBhdmFpbGFibGUsIG1ha2UgQmFzZTY0LmV4dGVuZFN0cmluZygpIGF2YWlsYWJsZVxuICAgIGlmICh0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBub0VudW0gPSBmdW5jdGlvbih2KXtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6dixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9O1xuICAgICAgICB9O1xuICAgICAgICBnbG9iYWwuQmFzZTY0LmV4dGVuZFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAnZnJvbUJhc2U2NCcsIG5vRW51bShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGUodGhpcylcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICh1cmlzYWZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdXJpc2FmZSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0VVJJJywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyBleHBvcnQgQmFzZTY0IHRvIHRoZSBuYW1lc3BhY2VcbiAgICAvL1xuICAgIGlmIChnbG9iYWxbJ01ldGVvciddKSB7IC8vIE1ldGVvci5qc1xuICAgICAgICBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIH1cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBhbmQgQU1EIGFyZSBtdXR1YWxseSBleGNsdXNpdmUuXG4gICAgLy8gbW9kdWxlLmV4cG9ydHMgaGFzIHByZWNlZGVuY2UuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLkJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKXsgcmV0dXJuIGdsb2JhbC5CYXNlNjQgfSk7XG4gICAgfVxuICAgIC8vIHRoYXQncyBpdCFcbiAgICByZXR1cm4ge0Jhc2U2NDogZ2xvYmFsLkJhc2U2NH1cbn0pKTtcbiIsIi8vISBtb21lbnQuanNcblxuOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLm1vbWVudCA9IGZhY3RvcnkoKVxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gaG9va3MgKCkge1xuICAgICAgICByZXR1cm4gaG9va0NhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBkb25lIHRvIHJlZ2lzdGVyIHRoZSBtZXRob2QgY2FsbGVkIHdpdGggbW9tZW50KClcbiAgICAvLyB3aXRob3V0IGNyZWF0aW5nIGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAgICBmdW5jdGlvbiBzZXRIb29rQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgICAgIGhvb2tDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgQXJyYXkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09iamVjdChpbnB1dCkge1xuICAgICAgICAvLyBJRTggd2lsbCB0cmVhdCB1bmRlZmluZWQgYW5kIG51bGwgYXMgb2JqZWN0IGlmIGl0IHdhc24ndCBmb3JcbiAgICAgICAgLy8gaW5wdXQgIT0gbnVsbFxuICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBPYmplY3RdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09iamVjdEVtcHR5KG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5sZW5ndGggPT09IDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGs7XG4gICAgICAgICAgICBmb3IgKGsgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT09IHZvaWQgMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc051bWJlcihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBOdW1iZXJdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRGF0ZSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIHRydWUpLnV0YygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5ICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zICAgIDogW10sXG4gICAgICAgICAgICB1bnVzZWRJbnB1dCAgICAgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93ICAgICAgICA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciAgIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoICAgIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgICAgICBpc28gICAgICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIHBhcnNlZERhdGVQYXJ0cyA6IFtdLFxuICAgICAgICAgICAgbWVyaWRpZW0gICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIHJmYzI4MjIgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgd2Vla2RheU1pc21hdGNoIDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzaW5nRmxhZ3MobSkge1xuICAgICAgICBpZiAobS5fcGYgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX3BmO1xuICAgIH1cblxuICAgIHZhciBzb21lO1xuICAgIGlmIChBcnJheS5wcm90b3R5cGUuc29tZSkge1xuICAgICAgICBzb21lID0gQXJyYXkucHJvdG90eXBlLnNvbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc29tZSA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICAgICAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gdCAmJiBmdW4uY2FsbCh0aGlzLCB0W2ldLCBpLCB0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkKG0pIHtcbiAgICAgICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGZsYWdzID0gZ2V0UGFyc2luZ0ZsYWdzKG0pO1xuICAgICAgICAgICAgdmFyIHBhcnNlZFBhcnRzID0gc29tZS5jYWxsKGZsYWdzLnBhcnNlZERhdGVQYXJ0cywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaSAhPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgaXNOb3dWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICBmbGFncy5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRXZWVrZGF5ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLndlZWtkYXlNaXNtYXRjaCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQgJiZcbiAgICAgICAgICAgICAgICAoIWZsYWdzLm1lcmlkaWVtIHx8IChmbGFncy5tZXJpZGllbSAmJiBwYXJzZWRQYXJ0cykpO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgaXNOb3dWYWxpZCA9IGlzTm93VmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbiA9PSBudWxsIHx8ICFPYmplY3QuaXNGcm96ZW4obSkpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gaXNOb3dWYWxpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc05vd1ZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUludmFsaWQgKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gY3JlYXRlVVRDKE5hTik7XG4gICAgICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgICAgICBleHRlbmQoZ2V0UGFyc2luZ0ZsYWdzKG0pLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkudXNlckludmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIC8vIFBsdWdpbnMgdGhhdCBhZGQgcHJvcGVydGllcyBzaG91bGQgYWxzbyBhZGQgdGhlIGtleSBoZXJlIChudWxsIHZhbHVlKSxcbiAgICAvLyBzbyB3ZSBjYW4gcHJvcGVybHkgY2xvbmUgb3Vyc2VsdmVzLlxuICAgIHZhciBtb21lbnRQcm9wZXJ0aWVzID0gaG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNBTW9tZW50T2JqZWN0KSkge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2kpKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9mKSkge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbCkpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3N0cmljdCkpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl90em0pKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNVVEMpKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX29mZnNldCkpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9wZikpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGdldFBhcnNpbmdGbGFncyhmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2xvY2FsZSkpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbW9tZW50UHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICB2YXIgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5fZCAhPSBudWxsID8gY29uZmlnLl9kLmdldFRpbWUoKSA6IE5hTik7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFByZXZlbnQgaW5maW5pdGUgbG9vcCBpbiBjYXNlIHVwZGF0ZU9mZnNldCBjcmVhdGVzIG5ldyBtb21lbnRcbiAgICAgICAgLy8gb2JqZWN0cy5cbiAgICAgICAgaWYgKHVwZGF0ZUluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50IChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fCAob2JqICE9IG51bGwgJiYgb2JqLl9pc0FNb21lbnRPYmplY3QgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzRmxvb3IgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgLy8gLTAgLT4gMFxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpIHx8IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFic0Zsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICAgICAgaWYgKGhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAodHlwZW9mIGNvbnNvbGUgIT09ICAndW5kZWZpbmVkJykgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobnVsbCwgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBhcmc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnICs9ICdcXG5bJyArIGkgKyAnXSAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZ3VtZW50c1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZyArPSBrZXkgKyAnOiAnICsgYXJndW1lbnRzWzBdW2tleV0gKyAnLCAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKDAsIC0yKTsgLy8gUmVtb3ZlIHRyYWlsaW5nIGNvbW1hIGFuZCBzcGFjZVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXJuKG1zZyArICdcXG5Bcmd1bWVudHM6ICcgKyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKS5qb2luKCcnKSArICdcXG4nICsgKG5ldyBFcnJvcigpKS5zdGFjayk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIHZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobmFtZSwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlciA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIEZ1bmN0aW9uIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0IChjb25maWcpIHtcbiAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihwcm9wKSkge1xuICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLlxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgXCJvcmRpbmFsUGFyc2VcIiBmYWxsYmFjayBpbiBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgICAgIHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICh0aGlzLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlLnNvdXJjZSB8fCB0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlKSArXG4gICAgICAgICAgICAgICAgJ3wnICsgKC9cXGR7MSwyfS8pLnNvdXJjZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY2hpbGRDb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IGV4dGVuZCh7fSwgcGFyZW50Q29uZmlnKSwgcHJvcDtcbiAgICAgICAgZm9yIChwcm9wIGluIGNoaWxkQ29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKSAmJiBpc09iamVjdChjaGlsZENvbmZpZ1twcm9wXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzW3Byb3BdID0ge307XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZChyZXNbcHJvcF0sIHBhcmVudENvbmZpZ1twcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZChyZXNbcHJvcF0sIGNoaWxkQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkQ29uZmlnW3Byb3BdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzW3Byb3BdID0gY2hpbGRDb25maWdbcHJvcF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc1twcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChwcm9wIGluIHBhcmVudENvbmZpZykge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AocGFyZW50Q29uZmlnLCBwcm9wKSAmJlxuICAgICAgICAgICAgICAgICAgICAhaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNPYmplY3QocGFyZW50Q29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBjaGFuZ2VzIHRvIHByb3BlcnRpZXMgZG9uJ3QgbW9kaWZ5IHBhcmVudCBjb25maWdcbiAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSBleHRlbmQoe30sIHJlc1twcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXQoY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXlzO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICAgIGtleXMgPSBPYmplY3Qua2V5cztcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdmFyIGksIHJlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKG9iaiwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENhbGVuZGFyID0ge1xuICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgICAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgbGFzdFdlZWsgOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgICAgIHNhbWVFbHNlIDogJ0wnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldIHx8IHRoaXMuX2NhbGVuZGFyWydzYW1lRWxzZSddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihvdXRwdXQpID8gb3V0cHV0LmNhbGwobW9tLCBub3cpIDogb3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQgPSB7XG4gICAgICAgIExUUyAgOiAnaDptbTpzcyBBJyxcbiAgICAgICAgTFQgICA6ICdoOm1tIEEnLFxuICAgICAgICBMICAgIDogJ01NL0REL1lZWVknLFxuICAgICAgICBMTCAgIDogJ01NTU0gRCwgWVlZWScsXG4gICAgICAgIExMTCAgOiAnTU1NTSBELCBZWVlZIGg6bW0gQScsXG4gICAgICAgIExMTEwgOiAnZGRkZCwgTU1NTSBELCBZWVlZIGg6bW0gQSdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9uZ0RhdGVGb3JtYXQgKGtleSkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSxcbiAgICAgICAgICAgIGZvcm1hdFVwcGVyID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldO1xuXG4gICAgICAgIGlmIChmb3JtYXQgfHwgIWZvcm1hdFVwcGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IGZvcm1hdFVwcGVyLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdEludmFsaWREYXRlID0gJ0ludmFsaWQgZGF0ZSc7XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnO1xuICAgIHZhciBkZWZhdWx0RGF5T2ZNb250aE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbiAgICBmdW5jdGlvbiBvcmRpbmFsIChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0UmVsYXRpdmVUaW1lID0ge1xuICAgICAgICBmdXR1cmUgOiAnaW4gJXMnLFxuICAgICAgICBwYXN0ICAgOiAnJXMgYWdvJyxcbiAgICAgICAgcyAgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgICAgIHNzIDogJyVkIHNlY29uZHMnLFxuICAgICAgICBtICA6ICdhIG1pbnV0ZScsXG4gICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICBoICA6ICdhbiBob3VyJyxcbiAgICAgICAgaGggOiAnJWQgaG91cnMnLFxuICAgICAgICBkICA6ICdhIGRheScsXG4gICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICBNICA6ICdhIG1vbnRoJyxcbiAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeSAgOiAnYSB5ZWFyJyxcbiAgICAgICAgeXkgOiAnJWQgeWVhcnMnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZSAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgcmV0dXJuIChpc0Z1bmN0aW9uKG91dHB1dCkpID9cbiAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUgKGRpZmYsIG91dHB1dCkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihmb3JtYXQpID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgYWxpYXNlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdEFsaWFzICh1bml0LCBzaG9ydGhhbmQpIHtcbiAgICAgICAgdmFyIGxvd2VyQ2FzZSA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYWxpYXNlc1tsb3dlckNhc2VdID0gYWxpYXNlc1tsb3dlckNhc2UgKyAncyddID0gYWxpYXNlc1tzaG9ydGhhbmRdID0gdW5pdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHVuaXRzID09PSAnc3RyaW5nJyA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgdmFyIHByaW9yaXRpZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFVuaXRQcmlvcml0eSh1bml0LCBwcmlvcml0eSkge1xuICAgICAgICBwcmlvcml0aWVzW3VuaXRdID0gcHJpb3JpdHk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0c09iaikge1xuICAgICAgICB2YXIgdW5pdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgdSBpbiB1bml0c09iaikge1xuICAgICAgICAgICAgdW5pdHMucHVzaCh7dW5pdDogdSwgcHJpb3JpdHk6IHByaW9yaXRpZXNbdV19KTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdW5pdHM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgYWJzTnVtYmVyID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgemVyb3NUb0ZpbGwgPSB0YXJnZXRMZW5ndGggLSBhYnNOdW1iZXIubGVuZ3RoLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArXG4gICAgICAgICAgICBNYXRoLnBvdygxMCwgTWF0aC5tYXgoMCwgemVyb3NUb0ZpbGwpKS50b1N0cmluZygpLnN1YnN0cigxKSArIGFic051bWJlcjtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhbSGhdbW0oc3MpP3xNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRbz98WVlZWVlZfFlZWVlZfFlZWVl8WVl8Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98a2s/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbiAgICB2YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxuICAgIHZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxuICAgIHZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuICh0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0b2tlbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnLCBpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGlzRnVuY3Rpb24oYXJyYXlbaV0pID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSB8fCBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHZhciBtYXRjaDEgICAgICAgICA9IC9cXGQvOyAgICAgICAgICAgIC8vICAgICAgIDAgLSA5XG4gICAgdmFyIG1hdGNoMiAgICAgICAgID0gL1xcZFxcZC87ICAgICAgICAgIC8vICAgICAgMDAgLSA5OVxuICAgIHZhciBtYXRjaDMgICAgICAgICA9IC9cXGR7M30vOyAgICAgICAgIC8vICAgICAwMDAgLSA5OTlcbiAgICB2YXIgbWF0Y2g0ICAgICAgICAgPSAvXFxkezR9LzsgICAgICAgICAvLyAgICAwMDAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDYgICAgICAgICA9IC9bKy1dP1xcZHs2fS87ICAgIC8vIC05OTk5OTkgLSA5OTk5OTlcbiAgICB2YXIgbWF0Y2gxdG8yICAgICAgPSAvXFxkXFxkPy87ICAgICAgICAgLy8gICAgICAgMCAtIDk5XG4gICAgdmFyIG1hdGNoM3RvNCAgICAgID0gL1xcZFxcZFxcZFxcZD8vOyAgICAgLy8gICAgIDk5OSAtIDk5OTlcbiAgICB2YXIgbWF0Y2g1dG82ICAgICAgPSAvXFxkXFxkXFxkXFxkXFxkXFxkPy87IC8vICAgOTk5OTkgLSA5OTk5OTlcbiAgICB2YXIgbWF0Y2gxdG8zICAgICAgPSAvXFxkezEsM30vOyAgICAgICAvLyAgICAgICAwIC0gOTk5XG4gICAgdmFyIG1hdGNoMXRvNCAgICAgID0gL1xcZHsxLDR9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2gxdG82ICAgICAgPSAvWystXT9cXGR7MSw2fS87ICAvLyAtOTk5OTk5IC0gOTk5OTk5XG5cbiAgICB2YXIgbWF0Y2hVbnNpZ25lZCAgPSAvXFxkKy87ICAgICAgICAgICAvLyAgICAgICAwIC0gaW5mXG4gICAgdmFyIG1hdGNoU2lnbmVkICAgID0gL1srLV0/XFxkKy87ICAgICAgLy8gICAgLWluZiAtIGluZlxuXG4gICAgdmFyIG1hdGNoT2Zmc2V0ICAgID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICB2YXIgbWF0Y2hTaG9ydE9mZnNldCA9IC9afFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/L2dpOyAvLyArMDAgLTAwICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuXG4gICAgdmFyIG1hdGNoVGltZXN0YW1wID0gL1srLV0/XFxkKyhcXC5cXGR7MSwzfSk/LzsgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcblxuICAgIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgIC8vIGluY2x1ZGVzIHNjb3R0aXNoIGdhZWxpYyB0d28gd29yZCBhbmQgaHlwaGVuYXRlZCBtb250aHNcbiAgICB2YXIgbWF0Y2hXb3JkID0gL1swLTldezAsMjU2fVsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRjA3XFx1RkYxMC1cXHVGRkVGXXsxLDI1Nn18W1xcdTA2MDAtXFx1MDZGRlxcL117MSwyNTZ9KFxccyo/W1xcdTA2MDAtXFx1MDZGRl17MSwyNTZ9KXsxLDJ9L2k7XG5cbiAgICB2YXIgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUmVnZXhUb2tlbiAodG9rZW4sIHJlZ2V4LCBzdHJpY3RSZWdleCkge1xuICAgICAgICByZWdleGVzW3Rva2VuXSA9IGlzRnVuY3Rpb24ocmVnZXgpID8gcmVnZXggOiBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNTdHJpY3QgJiYgc3RyaWN0UmVnZXgpID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4gKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHJlZ2V4ZXMsIHRva2VuKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAodW5lc2NhcGVGb3JtYXQodG9rZW4pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWdleGVzW3Rva2VuXShjb25maWcuX3N0cmljdCwgY29uZmlnLl9sb2NhbGUpO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiByZWdleEVzY2FwZShzLnJlcGxhY2UoJ1xcXFwnLCAnJykucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2V4RXNjYXBlKHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgdmFyIHRva2VucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpLCBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0b2tlbiA9IFt0b2tlbl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTnVtYmVyKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtjYWxsYmFja10gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuW2ldXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFlFQVIgPSAwO1xuICAgIHZhciBNT05USCA9IDE7XG4gICAgdmFyIERBVEUgPSAyO1xuICAgIHZhciBIT1VSID0gMztcbiAgICB2YXIgTUlOVVRFID0gNDtcbiAgICB2YXIgU0VDT05EID0gNTtcbiAgICB2YXIgTUlMTElTRUNPTkQgPSA2O1xuICAgIHZhciBXRUVLID0gNztcbiAgICB2YXIgV0VFS0RBWSA9IDg7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignWScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnllYXIoKTtcbiAgICAgICAgcmV0dXJuIHkgPD0gOTk5OSA/ICcnICsgeSA6ICcrJyArIHk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUFJJT1JJVElFU1xuXG4gICAgYWRkVW5pdFByaW9yaXR5KCd5ZWFyJywgMSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdZJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVknLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVknLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWScsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVlZJywgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ1lZWVlZJywgJ1lZWVlZWSddLCBZRUFSKTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWVlZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IGlucHV0Lmxlbmd0aCA9PT0gMiA/IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KSA6IHRvSW50KGlucHV0KTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIGdldElzTGVhcFllYXIgKCkge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldFNldCAodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzZXQkMSh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldCh0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQgKG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLmlzVmFsaWQoKSA/XG4gICAgICAgICAgICBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKSA6IE5hTjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQkMSAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICBpZiAobW9tLmlzVmFsaWQoKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAodW5pdCA9PT0gJ0Z1bGxZZWFyJyAmJiBpc0xlYXBZZWFyKG1vbS55ZWFyKCkpICYmIG1vbS5tb250aCgpID09PSAxICYmIG1vbS5kYXRlKCkgPT09IDI5KSB7XG4gICAgICAgICAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlLCBtb20ubW9udGgoKSwgZGF5c0luTW9udGgodmFsdWUsIG1vbS5tb250aCgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc3RyaW5nR2V0ICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpc1t1bml0c10pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHN0cmluZ1NldCAodW5pdHMsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHZhciBwcmlvcml0aXplZCA9IGdldFByaW9yaXRpemVkVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmlvcml0aXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXNbcHJpb3JpdGl6ZWRbaV0udW5pdF0odW5pdHNbcHJpb3JpdGl6ZWRbaV0udW5pdF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vZChuLCB4KSB7XG4gICAgICAgIHJldHVybiAoKG4gJSB4KSArIHgpICUgeDtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXhPZjtcblxuICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgICAgICBpbmRleE9mID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2Y7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXhPZiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICAvLyBJIGtub3dcbiAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXSA9PT0gbykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgaWYgKGlzTmFOKHllYXIpIHx8IGlzTmFOKG1vbnRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9kTW9udGggPSBtb2QobW9udGgsIDEyKTtcbiAgICAgICAgeWVhciArPSAobW9udGggLSBtb2RNb250aCkgLyAxMjtcbiAgICAgICAgcmV0dXJuIG1vZE1vbnRoID09PSAxID8gKGlzTGVhcFllYXIoeWVhcikgPyAyOSA6IDI4KSA6ICgzMSAtIG1vZE1vbnRoICUgNyAlIDIpO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbiAgICAvLyBQUklPUklUWVxuXG4gICAgYWRkVW5pdFByaW9yaXR5KCdtb250aCcsIDgpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignTScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU0nLCAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU0nLCAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5tb250aHNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU1NJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5tb250aHNSZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTScsICdNTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgfSk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTU1NJywgJ01NTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB2YXIgbW9udGggPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgIGlmIChtb250aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheVtNT05USF0gPSBtb250aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgTU9OVEhTX0lOX0ZPUk1BVCA9IC9EW29EXT8oXFxbW15cXFtcXF1dKlxcXXxcXHMpK01NTU0/LztcbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRocyA9ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRocyAobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKSA/IHRoaXMuX21vbnRocyA6XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzWydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKSA/IHRoaXMuX21vbnRoc1ttLm1vbnRoKCldIDpcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1sodGhpcy5fbW9udGhzLmlzRm9ybWF0IHx8IE1PTlRIU19JTl9GT1JNQVQpLnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQgPSAnSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWMnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzU2hvcnQgKG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KSA/IHRoaXMuX21vbnRoc1Nob3J0IDpcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFsnc3RhbmRhbG9uZSddO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRoc1Nob3J0KSA/IHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV0gOlxuICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRbTU9OVEhTX0lOX0ZPUk1BVC50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZShtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBpaSwgbW9tLCBsbGMgPSBtb250aE5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3QgdXNlZFxuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHNTaG9ydChtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IHRoaXMubW9udGhzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UuY2FsbCh0aGlzLCBtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IGFkZCBzb3J0aW5nXG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXJcbiAgICAgICAgLy8gc2VlIHNvcnRpbmcgaW4gY29tcHV0ZU1vbnRoc1BhcnNlXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTU0nICYmIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTScgJiYgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIHNldE1vbnRoIChtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0b0ludCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgICAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc2V0TW9udGgodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKCkge1xuICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRNb250aHNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkO1xuICAgIGZ1bmN0aW9uIG1vbnRoc1Nob3J0UmVnZXggKGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNTaG9ydFJlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRTdHJpY3RSZWdleCA6IHRoaXMuX21vbnRoc1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE1vbnRoc1JlZ2V4ID0gbWF0Y2hXb3JkO1xuICAgIGZ1bmN0aW9uIG1vbnRoc1JlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fbW9udGhzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVNb250aHNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUmVnZXggPSBkZWZhdWx0TW9udGhzUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4IDogdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlTW9udGhzUGFyc2UgKCkge1xuICAgICAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2hvcnRQaWVjZXMgPSBbXSwgbG9uZ1BpZWNlcyA9IFtdLCBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgaSwgbW9tO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgIHNob3J0UGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgICAgICBsb25nUGllY2VzLnB1c2godGhpcy5tb250aHMobW9tLCAnJykpO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgbW9udGggKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAgICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgICAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICBzaG9ydFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKHNob3J0UGllY2VzW2ldKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXNbaV0gPSByZWdleEVzY2FwZShsb25nUGllY2VzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMjQ7IGkrKykge1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1peGVkUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fbW9udGhzU2hvcnRSZWdleCA9IHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgICAgICB0aGlzLl9tb250aHNTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGxvbmdQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vIGNhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMTgxMzQ4XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vIHRoZSBkYXRlIGNvbnN0cnVjdG9yIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDAgJiYgaXNGaW5pdGUoZGF0ZS5nZXRGdWxsWWVhcigpKSkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG5cbiAgICAgICAgLy8gdGhlIERhdGUuVVRDIGZ1bmN0aW9uIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDAgJiYgaXNGaW5pdGUoZGF0ZS5nZXRVVENGdWxsWWVhcigpKSkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICAvLyBzdGFydC1vZi1maXJzdC13ZWVrIC0gc3RhcnQtb2YteWVhclxuICAgIGZ1bmN0aW9uIGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSkge1xuICAgICAgICB2YXIgLy8gZmlyc3Qtd2VlayBkYXkgLS0gd2hpY2ggamFudWFyeSBpcyBhbHdheXMgaW4gdGhlIGZpcnN0IHdlZWsgKDQgZm9yIGlzbywgMSBmb3Igb3RoZXIpXG4gICAgICAgICAgICBmd2QgPSA3ICsgZG93IC0gZG95LFxuICAgICAgICAgICAgLy8gZmlyc3Qtd2VlayBkYXkgbG9jYWwgd2Vla2RheSAtLSB3aGljaCBsb2NhbCB3ZWVrZGF5IGlzIGZ3ZFxuICAgICAgICAgICAgZndkbHcgPSAoNyArIGNyZWF0ZVVUQ0RhdGUoeWVhciwgMCwgZndkKS5nZXRVVENEYXkoKSAtIGRvdykgJSA3O1xuXG4gICAgICAgIHJldHVybiAtZndkbHcgKyBmd2QgLSAxO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGUjQ2FsY3VsYXRpbmdfYV9kYXRlX2dpdmVuX3RoZV95ZWFyLjJDX3dlZWtfbnVtYmVyX2FuZF93ZWVrZGF5XG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtzKHllYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciBsb2NhbFdlZWtkYXkgPSAoNyArIHdlZWtkYXkgLSBkb3cpICUgNyxcbiAgICAgICAgICAgIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICAgICAgZGF5T2ZZZWFyID0gMSArIDcgKiAod2VlayAtIDEpICsgbG9jYWxXZWVrZGF5ICsgd2Vla09mZnNldCxcbiAgICAgICAgICAgIHJlc1llYXIsIHJlc0RheU9mWWVhcjtcblxuICAgICAgICBpZiAoZGF5T2ZZZWFyIDw9IDApIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSB5ZWFyIC0gMTtcbiAgICAgICAgICAgIHJlc0RheU9mWWVhciA9IGRheXNJblllYXIocmVzWWVhcikgKyBkYXlPZlllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyKSkge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXIgKyAxO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyIC0gZGF5c0luWWVhcih5ZWFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSB5ZWFyO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5T2ZZZWFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IHJlc1llYXIsXG4gICAgICAgICAgICBkYXlPZlllYXI6IHJlc0RheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBkb3csIGRveSkge1xuICAgICAgICB2YXIgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldChtb20ueWVhcigpLCBkb3csIGRveSksXG4gICAgICAgICAgICB3ZWVrID0gTWF0aC5mbG9vcigobW9tLmRheU9mWWVhcigpIC0gd2Vla09mZnNldCAtIDEpIC8gNykgKyAxLFxuICAgICAgICAgICAgcmVzV2VlaywgcmVzWWVhcjtcblxuICAgICAgICBpZiAod2VlayA8IDEpIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpIC0gMTtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrICsgd2Vla3NJblllYXIocmVzWWVhciwgZG93LCBkb3kpO1xuICAgICAgICB9IGVsc2UgaWYgKHdlZWsgPiB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSkpIHtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrIC0gd2Vla3NJblllYXIobW9tLnllYXIoKSwgZG93LCBkb3kpO1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgKyAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCk7XG4gICAgICAgICAgICByZXNXZWVrID0gd2VlaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiByZXNXZWVrLFxuICAgICAgICAgICAgeWVhcjogcmVzWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSxcbiAgICAgICAgICAgIHdlZWtPZmZzZXROZXh0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIgKyAxLCBkb3csIGRveSk7XG4gICAgICAgIHJldHVybiAoZGF5c0luWWVhcih5ZWFyKSAtIHdlZWtPZmZzZXQgKyB3ZWVrT2Zmc2V0TmV4dCkgLyA3O1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUFJJT1JJVElFU1xuXG4gICAgYWRkVW5pdFByaW9yaXR5KCd3ZWVrJywgNSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrJywgNSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd3JywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignd3cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignVycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1dXJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWyd3JywgJ3d3JywgJ1cnLCAnV1cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDEpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbiAgICBhZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RheScsIDExKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtkYXknLCAxMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrZGF5JywgMTEpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignZCcsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignRScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNNaW5SZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzU2hvcnRSZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpICUgNyB8fCA3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc05hTihpbnB1dCkgPyBudWxsIDogaW5wdXQ7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5cyAobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fd2Vla2RheXMpID8gdGhpcy5fd2Vla2RheXMgOlxuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzWydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fd2Vla2RheXMpID8gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV0gOlxuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNbdGhpcy5fd2Vla2RheXMuaXNGb3JtYXQudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCA9ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gKG0pID8gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXSA6IHRoaXMuX3dlZWtkYXlzU2hvcnQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbiA9ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbiAobSkge1xuICAgICAgICByZXR1cm4gKG0pID8gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV0gOiB0aGlzLl93ZWVrZGF5c01pbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTdHJpY3RQYXJzZSQxKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgaWksIG1vbSwgbGxjID0gd2Vla2RheU5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7ICsraSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2RkZGQnKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlICh3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVN0cmljdFBhcnNlJDEuY2FsbCh0aGlzLCB3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcblxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZGRkJyAmJiB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGRkJyAmJiB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkJyAmJiB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKGlucHV0IC0gd2Vla2RheSwgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09EYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuXG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgd2Vla2RheSA9IHBhcnNlSXNvV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gd2Vla2RheSA6IHdlZWtkYXkgLSA3KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRheSgpIHx8IDc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFdlZWtkYXlzUmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gd2Vla2RheXNSZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBkZWZhdWx0V2Vla2RheXNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0V2Vla2RheXNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkO1xuICAgIGZ1bmN0aW9uIHdlZWtkYXlzU2hvcnRSZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IGRlZmF1bHRXZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdFdlZWtkYXlzTWluUmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gd2Vla2RheXNNaW5SZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzTWluUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSBkZWZhdWx0V2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4IDogdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZVdlZWtkYXlzUGFyc2UgKCkge1xuICAgICAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWluUGllY2VzID0gW10sIHNob3J0UGllY2VzID0gW10sIGxvbmdQaWVjZXMgPSBbXSwgbWl4ZWRQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIGksIG1vbSwgbWlucCwgc2hvcnRwLCBsb25ncDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICBtaW5wID0gdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgIHNob3J0cCA9IHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgIGxvbmdwID0gdGhpcy53ZWVrZGF5cyhtb20sICcnKTtcbiAgICAgICAgICAgIG1pblBpZWNlcy5wdXNoKG1pbnApO1xuICAgICAgICAgICAgc2hvcnRQaWVjZXMucHVzaChzaG9ydHApO1xuICAgICAgICAgICAgbG9uZ1BpZWNlcy5wdXNoKGxvbmdwKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKGxvbmdwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTb3J0aW5nIG1ha2VzIHN1cmUgaWYgb25lIHdlZWtkYXkgKG9yIGFiYnIpIGlzIGEgcHJlZml4IG9mIGFub3RoZXIgaXRcbiAgICAgICAgLy8gd2lsbCBtYXRjaCB0aGUgbG9uZ2VyIHBpZWNlLlxuICAgICAgICBtaW5QaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBzaG9ydFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGxvbmdQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBtaXhlZFBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShtaXhlZFBpZWNlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB0aGlzLl93ZWVrZGF5c01pblJlZ2V4ID0gdGhpcy5fd2Vla2RheXNSZWdleDtcblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIHNob3J0UGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1pblBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgZnVuY3Rpb24gaEZvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtGb3JtYXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgfHwgMjQ7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGhGb3JtYXQpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdrJywgWydraycsIDJdLCAwLCBrRm9ybWF0KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdobW0nLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignaG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIGhGb3JtYXQuYXBwbHkodGhpcykgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgdGhpcy5ob3VycygpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0htbXNzJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmhvdXJzKCkgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMikgK1xuICAgICAgICAgICAgemVyb0ZpbGwodGhpcy5zZWNvbmRzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW0gKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBSSU9SSVRZXG4gICAgYWRkVW5pdFByaW9yaXR5KCdob3VyJywgMTMpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hNZXJpZGllbSAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignQScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdIJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2snLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdraycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2htbScsIG1hdGNoM3RvNCk7XG4gICAgYWRkUmVnZXhUb2tlbignaG1tc3MnLCBtYXRjaDV0bzYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0htbScsIG1hdGNoM3RvNCk7XG4gICAgYWRkUmVnZXhUb2tlbignSG1tc3MnLCBtYXRjaDV0bzYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2snLCAna2snXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBrSW5wdXQgPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGFycmF5W0hPVVJdID0ga0lucHV0ID09PSAyNCA/IDAgOiBrSW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ2htbScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zKSk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ2htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNDtcbiAgICAgICAgdmFyIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgICAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignSG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdIbW1zcycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zMSA9IGlucHV0Lmxlbmd0aCAtIDQ7XG4gICAgICAgIHZhciBwb3MyID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zMSkpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczEsIDIpKTtcbiAgICAgICAgYXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MyKSk7XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVJc1BNIChpbnB1dCkge1xuICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICByZXR1cm4gKChpbnB1dCArICcnKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gJ3AnKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UgPSAvW2FwXVxcLj9tP1xcLj8vaTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNZXJpZGllbSAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgaWYgKGhvdXJzID4gMTEpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdhbScgOiAnQU0nO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbiAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciB0aGV5IHdhbnQuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICB2YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbiAgICB2YXIgYmFzZUNvbmZpZyA9IHtcbiAgICAgICAgY2FsZW5kYXI6IGRlZmF1bHRDYWxlbmRhcixcbiAgICAgICAgbG9uZ0RhdGVGb3JtYXQ6IGRlZmF1bHRMb25nRGF0ZUZvcm1hdCxcbiAgICAgICAgaW52YWxpZERhdGU6IGRlZmF1bHRJbnZhbGlkRGF0ZSxcbiAgICAgICAgb3JkaW5hbDogZGVmYXVsdE9yZGluYWwsXG4gICAgICAgIGRheU9mTW9udGhPcmRpbmFsUGFyc2U6IGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlLFxuICAgICAgICByZWxhdGl2ZVRpbWU6IGRlZmF1bHRSZWxhdGl2ZVRpbWUsXG5cbiAgICAgICAgbW9udGhzOiBkZWZhdWx0TG9jYWxlTW9udGhzLFxuICAgICAgICBtb250aHNTaG9ydDogZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0LFxuXG4gICAgICAgIHdlZWs6IGRlZmF1bHRMb2NhbGVXZWVrLFxuXG4gICAgICAgIHdlZWtkYXlzOiBkZWZhdWx0TG9jYWxlV2Vla2RheXMsXG4gICAgICAgIHdlZWtkYXlzTWluOiBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4sXG4gICAgICAgIHdlZWtkYXlzU2hvcnQ6IGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0LFxuXG4gICAgICAgIG1lcmlkaWVtUGFyc2U6IGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlXG4gICAgfTtcblxuICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxvY2FsZSBjb25maWcgZmlsZXNcbiAgICB2YXIgbG9jYWxlcyA9IHt9O1xuICAgIHZhciBsb2NhbGVGYW1pbGllcyA9IHt9O1xuICAgIHZhciBnbG9iYWxMb2NhbGU7XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbiAgICAvLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgIC8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICBmdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdICYmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgICAgICAgICBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgICAgIHZhciBhbGlhc2VkUmVxdWlyZSA9IHJlcXVpcmU7XG4gICAgICAgICAgICAgICAgYWxpYXNlZFJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIGZ1bmN0aW9uIGdldFNldEdsb2JhbExvY2FsZSAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZCh2YWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gbW9tZW50LmR1cmF0aW9uLl9sb2NhbGUgPSBtb21lbnQuX2xvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgZ2xvYmFsTG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIGNvbnNvbGUgIT09ICAndW5kZWZpbmVkJykgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vd2FybiB1c2VyIGlmIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGJ1dCB0aGUgbG9jYWxlIGNvdWxkIG5vdCBiZSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdMb2NhbGUgJyArIGtleSArICAnIG5vdCBmb3VuZC4gRGlkIHlvdSBmb3JnZXQgdG8gbG9hZCBpdD8nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUxvY2FsZSAobmFtZSwgY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbGUsIHBhcmVudENvbmZpZyA9IGJhc2VDb25maWc7XG4gICAgICAgICAgICBjb25maWcuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKCdkZWZpbmVMb2NhbGVPdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlIG1vbWVudC51cGRhdGVMb2NhbGUobG9jYWxlTmFtZSwgY29uZmlnKSB0byBjaGFuZ2UgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnYW4gZXhpc3RpbmcgbG9jYWxlLiBtb21lbnQuZGVmaW5lTG9jYWxlKGxvY2FsZU5hbWUsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZykgc2hvdWxkIG9ubHkgYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgbG9jYWxlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1NlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2RlZmluZS1sb2NhbGUvIGZvciBtb3JlIGluZm8uJyk7XG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tuYW1lXS5fY29uZmlnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZXNbY29uZmlnLnBhcmVudExvY2FsZV0uX2NvbmZpZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGNvbmZpZy5wYXJlbnRMb2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZS5fY29uZmlnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUobWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY29uZmlnKSk7XG5cbiAgICAgICAgICAgIGlmIChsb2NhbGVGYW1pbGllc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW25hbWVdLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lTG9jYWxlKHgubmFtZSwgeC5jb25maWcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBzZXQgdGhlIGxvY2FsZSBBRlRFUiBhbGwgY2hpbGQgbG9jYWxlcyBoYXZlIGJlZW5cbiAgICAgICAgICAgIC8vIGNyZWF0ZWQsIHNvIHdlIHdvbid0IGVuZCB1cCB3aXRoIHRoZSBjaGlsZCBsb2NhbGUgc2V0LlxuICAgICAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuXG5cbiAgICAgICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdXNlZnVsIGZvciB0ZXN0aW5nXG4gICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxlKG5hbWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbGUsIHRtcExvY2FsZSwgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcbiAgICAgICAgICAgIC8vIE1FUkdFXG4gICAgICAgICAgICB0bXBMb2NhbGUgPSBsb2FkTG9jYWxlKG5hbWUpO1xuICAgICAgICAgICAgaWYgKHRtcExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gdG1wTG9jYWxlLl9jb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWcgPSBtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpO1xuICAgICAgICAgICAgbG9jYWxlID0gbmV3IExvY2FsZShjb25maWcpO1xuICAgICAgICAgICAgbG9jYWxlLnBhcmVudExvY2FsZSA9IGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlO1xuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHBhc3MgbnVsbCBmb3IgY29uZmlnIHRvIHVudXBkYXRlLCB1c2VmdWwgZm9yIHRlc3RzXG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0gW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hvb3NlTG9jYWxlKGtleSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdExvY2FsZXMoKSB7XG4gICAgICAgIHJldHVybiBrZXlzKGxvY2FsZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cgKG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICB2YXIgYSA9IG0uX2E7XG5cbiAgICAgICAgaWYgKGEgJiYgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIGFbTU9OVEhdICAgICAgIDwgMCB8fCBhW01PTlRIXSAgICAgICA+IDExICA/IE1PTlRIIDpcbiAgICAgICAgICAgICAgICBhW0RBVEVdICAgICAgICA8IDEgfHwgYVtEQVRFXSAgICAgICAgPiBkYXlzSW5Nb250aChhW1lFQVJdLCBhW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBhW0hPVVJdICAgICAgICA8IDAgfHwgYVtIT1VSXSAgICAgICAgPiAyNCB8fCAoYVtIT1VSXSA9PT0gMjQgJiYgKGFbTUlOVVRFXSAhPT0gMCB8fCBhW1NFQ09ORF0gIT09IDAgfHwgYVtNSUxMSVNFQ09ORF0gIT09IDApKSA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIGFbTUlOVVRFXSAgICAgIDwgMCB8fCBhW01JTlVURV0gICAgICA+IDU5ICA/IE1JTlVURSA6XG4gICAgICAgICAgICAgICAgYVtTRUNPTkRdICAgICAgPCAwIHx8IGFbU0VDT05EXSAgICAgID4gNTkgID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBhW01JTExJU0VDT05EXSA8IDAgfHwgYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93RGF5T2ZZZWFyICYmIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gREFURTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MobSkuX292ZXJmbG93V2Vla3MgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrZGF5ICYmIG92ZXJmbG93ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gV0VFS0RBWTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICAvLyBob29rcyBpcyBhY3R1YWxseSB0aGUgZXhwb3J0ZWQgbW9tZW50IG9iamVjdFxuICAgICAgICB2YXIgbm93VmFsdWUgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRVVENGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRVVENNb250aCgpLCBub3dWYWx1ZS5nZXRVVENEYXRlKCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbm93VmFsdWUuZ2V0RnVsbFllYXIoKSwgbm93VmFsdWUuZ2V0TW9udGgoKSwgbm93VmFsdWUuZ2V0RGF0ZSgpXTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21BcnJheSAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgZXhwZWN0ZWRXZWVrZGF5LCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkgfHwgY29uZmlnLl9kYXlPZlllYXIgPT09IDApIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGZvciAyNDowMDowMC4wMDBcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlOVVRFXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtTRUNPTkRdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9uZXh0RGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBjcmVhdGVVVENEYXRlIDogY3JlYXRlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICBleHBlY3RlZFdlZWtkYXkgPSBjb25maWcuX3VzZVVUQyA/IGNvbmZpZy5fZC5nZXRVVENEYXkoKSA6IGNvbmZpZy5fZC5nZXREYXkoKTtcblxuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB1dGNPZmZzZXQgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbmV4dERheSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMjQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgbWlzbWF0Y2hpbmcgZGF5IG9mIHdlZWtcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiB0eXBlb2YgY29uZmlnLl93LmQgIT09ICd1bmRlZmluZWQnICYmIGNvbmZpZy5fdy5kICE9PSBleHBlY3RlZFdlZWtkYXkpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLndlZWtkYXlNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXAsIHdlZWtkYXlPdmVyZmxvdztcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgICAgICBpZiAod2Vla2RheSA8IDEgfHwgd2Vla2RheSA+IDcpIHtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB2YXIgY3VyV2VlayA9IHdlZWtPZlllYXIoY3JlYXRlTG9jYWwoKSwgZG93LCBkb3kpO1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgY3VyV2Vlay55ZWFyKTtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IHdlZWsuXG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody53LCBjdXJXZWVrLndlZWspO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgMCB8fCB3ZWVrZGF5ID4gNikge1xuICAgICAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgICAgIGlmICh3LmUgPCAwIHx8IHcuZSA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdlZWsgPCAxIHx8IHdlZWsgPiB3ZWVrc0luWWVhcih3ZWVrWWVhciwgZG93LCBkb3kpKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dXZWVrcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAod2Vla2RheU92ZXJmbG93ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtkYXkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpO1xuICAgICAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlzbyA4NjAxIHJlZ2V4XG4gICAgLy8gMDAwMC0wMC0wMCAwMDAwLVcwMCBvciAwMDAwLVcwMC0wICsgVCArIDAwIG9yIDAwOjAwIG9yIDAwOjAwOjAwIG9yIDAwOjAwOjAwLjAwMCArICswMDowMCBvciArMDAwMCBvciArMDApXG4gICAgdmFyIGV4dGVuZGVkSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OlxcZFxcZC1cXGRcXGR8V1xcZFxcZC1cXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzo6XFxkXFxkKD86OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG4gICAgdmFyIGJhc2ljSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pKD86XFxkXFxkXFxkXFxkfFdcXGRcXGRcXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzpcXGRcXGQoPzpcXGRcXGQoPzpbLixdXFxkKyk/KT8pPykoW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvO1xuXG4gICAgdmFyIHR6UmVnZXggPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy87XG5cbiAgICB2YXIgaXNvRGF0ZXMgPSBbXG4gICAgICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkXFxkLVxcZFxcZC9dLFxuICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZFxcZC1cXGRcXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGRcXGQtXFxkL10sXG4gICAgICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZFxcZC8sIGZhbHNlXSxcbiAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L10sXG4gICAgICAgIFsnWVlZWS1NTScsIC9cXGR7NH0tXFxkXFxkLywgZmFsc2VdLFxuICAgICAgICBbJ1lZWVlZWU1NREQnLCAvWystXVxcZHsxMH0vXSxcbiAgICAgICAgWydZWVlZTU1ERCcsIC9cXGR7OH0vXSxcbiAgICAgICAgLy8gWVlZWU1NIGlzIE5PVCBhbGxvd2VkIGJ5IHRoZSBzdGFuZGFyZFxuICAgICAgICBbJ0dHR0dbV11XV0UnLCAvXFxkezR9V1xcZHszfS9dLFxuICAgICAgICBbJ0dHR0dbV11XVycsIC9cXGR7NH1XXFxkezJ9LywgZmFsc2VdLFxuICAgICAgICBbJ1lZWVlEREQnLCAvXFxkezd9L11cbiAgICBdO1xuXG4gICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgIHZhciBpc29UaW1lcyA9IFtcbiAgICAgICAgWydISDptbTpzcy5TU1NTJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzLFNTU1MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGQsXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEg6bW0nLCAvXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICBbJ0hIbW1zcy5TU1NTJywgL1xcZFxcZFxcZFxcZFxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgWydISG1tc3MsU1NTUycsIC9cXGRcXGRcXGRcXGRcXGRcXGQsXFxkKy9dLFxuICAgICAgICBbJ0hIbW1zcycsIC9cXGRcXGRcXGRcXGRcXGRcXGQvXSxcbiAgICAgICAgWydISG1tJywgL1xcZFxcZFxcZFxcZC9dLFxuICAgICAgICBbJ0hIJywgL1xcZFxcZC9dXG4gICAgXTtcblxuICAgIHZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gZXh0ZW5kZWRJc29SZWdleC5leGVjKHN0cmluZykgfHwgYmFzaWNJc29SZWdleC5leGVjKHN0cmluZyksXG4gICAgICAgICAgICBhbGxvd1RpbWUsIGRhdGVGb3JtYXQsIHRpbWVGb3JtYXQsIHR6Rm9ybWF0O1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaXNvID0gdHJ1ZTtcblxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKG1hdGNoWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRlRm9ybWF0ID0gaXNvRGF0ZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGFsbG93VGltZSA9IGlzb0RhdGVzW2ldWzJdICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFszXSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzb1RpbWVzW2ldWzFdLmV4ZWMobWF0Y2hbM10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFsyXSBzaG91bGQgYmUgJ1QnIG9yIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lRm9ybWF0ID0gKG1hdGNoWzJdIHx8ICcgJykgKyBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aW1lRm9ybWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWFsbG93VGltZSAmJiB0aW1lRm9ybWF0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbNF0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHpSZWdleC5leGVjKG1hdGNoWzRdKSkge1xuICAgICAgICAgICAgICAgICAgICB0ekZvcm1hdCA9ICdaJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbmZpZy5fZiA9IGRhdGVGb3JtYXQgKyAodGltZUZvcm1hdCB8fCAnJykgKyAodHpGb3JtYXQgfHwgJycpO1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSRkMgMjgyMiByZWdleDogRm9yIGRldGFpbHMgc2VlIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyODIyI3NlY3Rpb24tMy4zXG4gICAgdmFyIHJmYzI4MjIgPSAvXig/OihNb258VHVlfFdlZHxUaHV8RnJpfFNhdHxTdW4pLD9cXHMpPyhcXGR7MSwyfSlcXHMoSmFufEZlYnxNYXJ8QXByfE1heXxKdW58SnVsfEF1Z3xTZXB8T2N0fE5vdnxEZWMpXFxzKFxcZHsyLDR9KVxccyhcXGRcXGQpOihcXGRcXGQpKD86OihcXGRcXGQpKT9cXHMoPzooVVR8R01UfFtFQ01QXVtTRF1UKXwoW1p6XSl8KFsrLV1cXGR7NH0pKSQvO1xuXG4gICAgZnVuY3Rpb24gZXh0cmFjdEZyb21SRkMyODIyU3RyaW5ncyh5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyLCBob3VyU3RyLCBtaW51dGVTdHIsIHNlY29uZFN0cikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW1xuICAgICAgICAgICAgdW50cnVuY2F0ZVllYXIoeWVhclN0ciksXG4gICAgICAgICAgICBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQuaW5kZXhPZihtb250aFN0ciksXG4gICAgICAgICAgICBwYXJzZUludChkYXlTdHIsIDEwKSxcbiAgICAgICAgICAgIHBhcnNlSW50KGhvdXJTdHIsIDEwKSxcbiAgICAgICAgICAgIHBhcnNlSW50KG1pbnV0ZVN0ciwgMTApXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKHNlY29uZFN0cikge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VJbnQoc2Vjb25kU3RyLCAxMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSB7XG4gICAgICAgIHZhciB5ZWFyID0gcGFyc2VJbnQoeWVhclN0ciwgMTApO1xuICAgICAgICBpZiAoeWVhciA8PSA0OSkge1xuICAgICAgICAgICAgcmV0dXJuIDIwMDAgKyB5ZWFyO1xuICAgICAgICB9IGVsc2UgaWYgKHllYXIgPD0gOTk5KSB7XG4gICAgICAgICAgICByZXR1cm4gMTkwMCArIHllYXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHllYXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcHJvY2Vzc1JGQzI4MjIocykge1xuICAgICAgICAvLyBSZW1vdmUgY29tbWVudHMgYW5kIGZvbGRpbmcgd2hpdGVzcGFjZSBhbmQgcmVwbGFjZSBtdWx0aXBsZS1zcGFjZXMgd2l0aCBhIHNpbmdsZSBzcGFjZVxuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9cXChbXildKlxcKXxbXFxuXFx0XS9nLCAnICcpLnJlcGxhY2UoLyhcXHNcXHMrKS9nLCAnICcpLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrV2Vla2RheSh3ZWVrZGF5U3RyLCBwYXJzZWRJbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmICh3ZWVrZGF5U3RyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBSZXBsYWNlIHRoZSB2YW5pbGxhIEpTIERhdGUgb2JqZWN0IHdpdGggYW4gaW5kZXBlbnRlbnQgZGF5LW9mLXdlZWsgY2hlY2suXG4gICAgICAgICAgICB2YXIgd2Vla2RheVByb3ZpZGVkID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQuaW5kZXhPZih3ZWVrZGF5U3RyKSxcbiAgICAgICAgICAgICAgICB3ZWVrZGF5QWN0dWFsID0gbmV3IERhdGUocGFyc2VkSW5wdXRbMF0sIHBhcnNlZElucHV0WzFdLCBwYXJzZWRJbnB1dFsyXSkuZ2V0RGF5KCk7XG4gICAgICAgICAgICBpZiAod2Vla2RheVByb3ZpZGVkICE9PSB3ZWVrZGF5QWN0dWFsKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIG9ic09mZnNldHMgPSB7XG4gICAgICAgIFVUOiAwLFxuICAgICAgICBHTVQ6IDAsXG4gICAgICAgIEVEVDogLTQgKiA2MCxcbiAgICAgICAgRVNUOiAtNSAqIDYwLFxuICAgICAgICBDRFQ6IC01ICogNjAsXG4gICAgICAgIENTVDogLTYgKiA2MCxcbiAgICAgICAgTURUOiAtNiAqIDYwLFxuICAgICAgICBNU1Q6IC03ICogNjAsXG4gICAgICAgIFBEVDogLTcgKiA2MCxcbiAgICAgICAgUFNUOiAtOCAqIDYwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU9mZnNldChvYnNPZmZzZXQsIG1pbGl0YXJ5T2Zmc2V0LCBudW1PZmZzZXQpIHtcbiAgICAgICAgaWYgKG9ic09mZnNldCkge1xuICAgICAgICAgICAgcmV0dXJuIG9ic09mZnNldHNbb2JzT2Zmc2V0XTtcbiAgICAgICAgfSBlbHNlIGlmIChtaWxpdGFyeU9mZnNldCkge1xuICAgICAgICAgICAgLy8gdGhlIG9ubHkgYWxsb3dlZCBtaWxpdGFyeSB0eiBpcyBaXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBobSA9IHBhcnNlSW50KG51bU9mZnNldCwgMTApO1xuICAgICAgICAgICAgdmFyIG0gPSBobSAlIDEwMCwgaCA9IChobSAtIG0pIC8gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIGggKiA2MCArIG07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGFuZCB0aW1lIGZyb20gcmVmIDI4MjIgZm9ybWF0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHJmYzI4MjIuZXhlYyhwcmVwcm9jZXNzUkZDMjgyMihjb25maWcuX2kpKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICB2YXIgcGFyc2VkQXJyYXkgPSBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKG1hdGNoWzRdLCBtYXRjaFszXSwgbWF0Y2hbMl0sIG1hdGNoWzVdLCBtYXRjaFs2XSwgbWF0Y2hbN10pO1xuICAgICAgICAgICAgaWYgKCFjaGVja1dlZWtkYXkobWF0Y2hbMV0sIHBhcnNlZEFycmF5LCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25maWcuX2EgPSBwYXJzZWRBcnJheTtcbiAgICAgICAgICAgIGNvbmZpZy5fdHptID0gY2FsY3VsYXRlT2Zmc2V0KG1hdGNoWzhdLCBtYXRjaFs5XSwgbWF0Y2hbMTBdKTtcblxuICAgICAgICAgICAgY29uZmlnLl9kID0gY3JlYXRlVVRDRGF0ZS5hcHBseShudWxsLCBjb25maWcuX2EpO1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucmZjMjgyMiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhjb25maWcuX2kpO1xuXG4gICAgICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5hbCBhdHRlbXB0LCB1c2UgSW5wdXQgRmFsbGJhY2tcbiAgICAgICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICB9XG5cbiAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ3ZhbHVlIHByb3ZpZGVkIGlzIG5vdCBpbiBhIHJlY29nbml6ZWQgUkZDMjgyMiBvciBJU08gZm9ybWF0LiBtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZSgpLCAnICtcbiAgICAgICAgJ3doaWNoIGlzIG5vdCByZWxpYWJsZSBhY3Jvc3MgYWxsIGJyb3dzZXJzIGFuZCB2ZXJzaW9ucy4gTm9uIFJGQzI4MjIvSVNPIGRhdGUgZm9ybWF0cyBhcmUgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGFuIHVwY29taW5nIG1ham9yIHJlbGVhc2UuIFBsZWFzZSByZWZlciB0byAnICtcbiAgICAgICAgJ2h0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvanMtZGF0ZS8gZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBJU08gc3RhbmRhcmRcbiAgICBob29rcy5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIFJGQyAyODIyIGZvcm1cbiAgICBob29rcy5SRkNfMjgyMiA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyB0byBhbm90aGVyIHBhcnQgb2YgdGhlIGNyZWF0aW9uIGZsb3cgdG8gcHJldmVudCBjaXJjdWxhciBkZXBzXG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IGhvb2tzLklTT184NjAxKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuUkZDXzI4MjIpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21SRkMyODIyKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndG9rZW4nLCB0b2tlbiwgJ3BhcnNlZElucHV0JywgcGFyc2VkSW5wdXQsXG4gICAgICAgICAgICAvLyAgICAgICAgICdyZWdleCcsIGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSk7XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYXIgXzEyaCBmbGFnIGlmIGhvdXIgaXMgPD0gMTJcbiAgICAgICAgaWYgKGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJlxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnBhcnNlZERhdGVQYXJ0cyA9IGNvbmZpZy5fYS5zbGljZSgwKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykubWVyaWRpZW0gPSBjb25maWcuX21lcmlkaWVtO1xuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sIGNvbmZpZy5fbWVyaWRpZW0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAgKGxvY2FsZSwgaG91ciwgbWVyaWRpZW0pIHtcbiAgICAgICAgdmFyIGlzUG07XG5cbiAgICAgICAgaWYgKG1lcmlkaWVtID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUubWVyaWRpZW1Ib3VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubWVyaWRpZW1Ib3VyKGhvdXIsIG1lcmlkaWVtKTtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbGUuaXNQTSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICAgICAgaXNQbSA9IGxvY2FsZS5pc1BNKG1lcmlkaWVtKTtcbiAgICAgICAgICAgIGlmIChpc1BtICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzUG0gJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3Qgc3VwcG9zZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGFycmF5IG9mIGZvcm1hdCBzdHJpbmdzXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykudW51c2VkVG9rZW5zLmxlbmd0aCAqIDEwO1xuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gbWFwKFtpLnllYXIsIGkubW9udGgsIGkuZGF5IHx8IGkuZGF0ZSwgaS5ob3VyLCBpLm1pbnV0ZSwgaS5zZWNvbmQsIGkubWlsbGlzZWNvbmRdLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVGcm9tQ29uZmlnIChjb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhwcmVwYXJlQ29uZmlnKGNvbmZpZykpKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVDb25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBnZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKHtudWxsSW5wdXQ6IHRydWV9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGNvbmZpZy5fbG9jYWxlLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3coaW5wdXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBpbnB1dDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkKGNvbmZpZykpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pO1xuICAgICAgICBpZiAoaXNVbmRlZmluZWQoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShob29rcy5ub3coKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQudmFsdWVPZigpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IG1hcChpbnB1dC5zbGljZSgwKSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmIChsb2NhbGUgPT09IHRydWUgfHwgbG9jYWxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChpc09iamVjdChpbnB1dCkgJiYgaXNPYmplY3RFbXB0eShpbnB1dCkpIHx8XG4gICAgICAgICAgICAgICAgKGlzQXJyYXkoaW5wdXQpICYmIGlucHV0Lmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl91c2VVVEMgPSBjLl9pc1VUQyA9IGlzVVRDO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRnJvbUNvbmZpZyhjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbCAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWluIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvbWluLW1heC8nLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdmFyIHByb3RvdHlwZU1heCA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL21pbi1tYXgvJyxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFtb21lbnRzW2ldLmlzVmFsaWQoKSB8fCBtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXggKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgdmFyIG5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERhdGUubm93ID8gRGF0ZS5ub3coKSA6ICsobmV3IERhdGUoKSk7XG4gICAgfTtcblxuICAgIHZhciBvcmRlcmluZyA9IFsneWVhcicsICdxdWFydGVyJywgJ21vbnRoJywgJ3dlZWsnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCcsICdtaWxsaXNlY29uZCddO1xuXG4gICAgZnVuY3Rpb24gaXNEdXJhdGlvblZhbGlkKG0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG0pIHtcbiAgICAgICAgICAgIGlmICghKGluZGV4T2YuY2FsbChvcmRlcmluZywga2V5KSAhPT0gLTEgJiYgKG1ba2V5XSA9PSBudWxsIHx8ICFpc05hTihtW2tleV0pKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdW5pdEhhc0RlY2ltYWwgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlcmluZy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKG1bb3JkZXJpbmdbaV1dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRIYXNEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb25seSBhbGxvdyBub24taW50ZWdlcnMgZm9yIHNtYWxsZXN0IHVuaXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQobVtvcmRlcmluZ1tpXV0pICE9PSB0b0ludChtW29yZGVyaW5nW2ldXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdEhhc0RlY2ltYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW52YWxpZCQxKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oTmFOKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBEdXJhdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgdGhpcy5faXNWYWxpZCA9IGlzRHVyYXRpb25WYWxpZChub3JtYWxpemVkSW5wdXQpO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMTAwMCAqIDYwICogNjA7IC8vdXNpbmcgMTAwMCAqIDYwICogNjAgaW5zdGVhZCBvZiAzNmU1IHRvIGF2b2lkIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjk3OFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRvIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBnZXRMb2NhbGUoKTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic1JvdW5kIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKC0xICogbnVtYmVyKSAqIC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGZ1bmN0aW9uIG9mZnNldCAodG9rZW4sIHNlcGFyYXRvcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgc2lnbiA9ICcrJztcbiAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcbiAgICAgICAgICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyB6ZXJvRmlsbCh+fihvZmZzZXQgLyA2MCksIDIpICsgc2VwYXJhdG9yICsgemVyb0ZpbGwofn4ob2Zmc2V0KSAlIDYwLCAyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2Zmc2V0KCdaJywgJzonKTtcbiAgICBvZmZzZXQoJ1paJywgJycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWicsICBtYXRjaFNob3J0T2Zmc2V0KTtcbiAgICBhZGRSZWdleFRva2VuKCdaWicsIG1hdGNoU2hvcnRPZmZzZXQpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydaJywgJ1paJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGNvbmZpZy5fdHptID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaFNob3J0T2Zmc2V0LCBpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyB0aW1lem9uZSBjaHVua2VyXG4gICAgLy8gJysxMDowMCcgPiBbJzEwJywgICcwMCddXG4gICAgLy8gJy0xNTMwJyAgPiBbJy0xNScsICczMCddXG4gICAgdmFyIGNodW5rT2Zmc2V0ID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpO1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaGVyLCBzdHJpbmcpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSAoc3RyaW5nIHx8ICcnKS5tYXRjaChtYXRjaGVyKTtcblxuICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2h1bmsgICA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICAgICAgdmFyIHBhcnRzICAgPSAoY2h1bmsgKyAnJykubWF0Y2goY2h1bmtPZmZzZXQpIHx8IFsnLScsIDAsIDBdO1xuICAgICAgICB2YXIgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIG1pbnV0ZXMgPT09IDAgP1xuICAgICAgICAgIDAgOlxuICAgICAgICAgIHBhcnRzWzBdID09PSAnKycgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbW9tZW50IGZyb20gaW5wdXQsIHRoYXQgaXMgbG9jYWwvdXRjL3pvbmUgZXF1aXZhbGVudCB0byBtb2RlbC5cbiAgICBmdW5jdGlvbiBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIG1vZGVsKSB7XG4gICAgICAgIHZhciByZXMsIGRpZmY7XG4gICAgICAgIGlmIChtb2RlbC5faXNVVEMpIHtcbiAgICAgICAgICAgIHJlcyA9IG1vZGVsLmNsb25lKCk7XG4gICAgICAgICAgICBkaWZmID0gKGlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID8gaW5wdXQudmFsdWVPZigpIDogY3JlYXRlTG9jYWwoaW5wdXQpLnZhbHVlT2YoKSkgLSByZXMudmFsdWVPZigpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUocmVzLl9kLnZhbHVlT2YoKSArIGRpZmYpO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCkubG9jYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGVPZmZzZXQgKG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIGhvb2tzLnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8ga2VlcExvY2FsVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0XG4gICAgLy8gYWZmZWN0aW5nIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3V0Y09mZnNldCgyLCB0cnVlKV0tLT5cbiAgICAvLyA1OjMxOjI2ICswMjAwIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IHdpdGggb2Zmc2V0XG4gICAgLy8gKzAyMDAsIHNvIHdlIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuICAgIC8vXG4gICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4gICAgLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgIC8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG4gICAgZnVuY3Rpb24gZ2V0U2V0T2Zmc2V0IChpbnB1dCwga2VlcExvY2FsVGltZSwga2VlcE1pbnV0ZXMpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgbG9jYWxBZGp1c3Q7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hTaG9ydE9mZnNldCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2ICYmICFrZWVwTWludXRlcykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkU3VidHJhY3QodGhpcywgY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFpvbmUgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvTG9jYWwgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJ0cmFjdChnZXREYXRlT2Zmc2V0KHRoaXMpLCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0aGlzLl90em0sIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciB0Wm9uZSA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hPZmZzZXQsIHRoaXMuX2kpO1xuICAgICAgICAgICAgaWYgKHRab25lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0Wm9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgwLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldCAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0ID0gaW5wdXQgPyBjcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCkgOiAwO1xuXG4gICAgICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQgKCkge1xuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX2lzRFNUU2hpZnRlZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgICAgIGlmIChjLl9hKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZVVUQyhjLl9hKSA6IGNyZWF0ZUxvY2FsKGMuX2EpO1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gdGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICBjb21wYXJlQXJyYXlzKGMuX2EsIG90aGVyLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTG9jYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyAhdGhpcy5faXNVVEMgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0Y09mZnNldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDAgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBU1AuTkVUIGpzb24gZGF0ZSBmb3JtYXQgcmVnZXhcbiAgICB2YXIgYXNwTmV0UmVnZXggPSAvXihcXC18XFwrKT8oPzooXFxkKilbLiBdKT8oXFxkKylcXDooXFxkKykoPzpcXDooXFxkKykoXFwuXFxkKik/KT8kLztcblxuICAgIC8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4gICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgIC8vIGFuZCBmdXJ0aGVyIG1vZGlmaWVkIHRvIGFsbG93IGZvciBzdHJpbmdzIGNvbnRhaW5pbmcgYm90aCB3ZWVrIGFuZCBkYXlcbiAgICB2YXIgaXNvUmVnZXggPSAvXigtfFxcKyk/UCg/OihbLStdP1swLTksLl0qKVkpPyg/OihbLStdP1swLTksLl0qKU0pPyg/OihbLStdP1swLTksLl0qKVcpPyg/OihbLStdP1swLTksLl0qKUQpPyg/OlQoPzooWy0rXT9bMC05LC5dKilIKT8oPzooWy0rXT9bMC05LC5dKilNKT8oPzooWy0rXT9bMC05LC5dKilTKT8pPyQvO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlRHVyYXRpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtcyA6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZCAgOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNICA6IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRSZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5ICA6IDAsXG4gICAgICAgICAgICAgICAgZCAgOiB0b0ludChtYXRjaFtEQVRFXSkgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIGggIDogdG9JbnQobWF0Y2hbSE9VUl0pICAgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtICA6IHRvSW50KG1hdGNoW01JTlVURV0pICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgcyAgOiB0b0ludChtYXRjaFtTRUNPTkRdKSAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zIDogdG9JbnQoYWJzUm91bmQobWF0Y2hbTUlMTElTRUNPTkRdICogMTAwMCkpICogc2lnbiAvLyB0aGUgbWlsbGlzZWNvbmQgZGVjaW1hbCBwb2ludCBpcyBpbmNsdWRlZCBpbiB0aGUgbWF0Y2hcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBpc29SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IChtYXRjaFsxXSA9PT0gJysnKSA/IDEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSA6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNIDogcGFyc2VJc28obWF0Y2hbM10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHcgOiBwYXJzZUlzbyhtYXRjaFs0XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgZCA6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBoIDogcGFyc2VJc28obWF0Y2hbNl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIG0gOiBwYXJzZUlzbyhtYXRjaFs3XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgcyA6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7Ly8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnICYmICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShjcmVhdGVMb2NhbChkdXJhdGlvbi5mcm9tKSwgY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuICAgIGNyZWF0ZUR1cmF0aW9uLmludmFsaWQgPSBjcmVhdGVJbnZhbGlkJDE7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyAoaW5wLCBzaWduKSB7XG4gICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIGlmICghKGJhc2UuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLiAnICtcbiAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvYWRkLWludmVydGVkLXBhcmFtLyBmb3IgbW9yZSBpbmZvLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IGNyZWF0ZUR1cmF0aW9uKHZhbCwgcGVyaW9kKTtcbiAgICAgICAgICAgIGFkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN1YnRyYWN0IChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGFic1JvdW5kKGR1cmF0aW9uLl9kYXlzKSxcbiAgICAgICAgICAgIG1vbnRocyA9IGFic1JvdW5kKGR1cmF0aW9uLl9tb250aHMpO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBzZXQkMShtb20sICdEYXRlJywgZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUobW9tLl9kLnZhbHVlT2YoKSArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkICAgICAgPSBjcmVhdGVBZGRlcigxLCAnYWRkJyk7XG4gICAgdmFyIHN1YnRyYWN0ID0gY3JlYXRlQWRkZXIoLTEsICdzdWJ0cmFjdCcpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q2FsZW5kYXJGb3JtYXQobXlNb21lbnQsIG5vdykge1xuICAgICAgICB2YXIgZGlmZiA9IG15TW9tZW50LmRpZmYobm93LCAnZGF5cycsIHRydWUpO1xuICAgICAgICByZXR1cm4gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDAgPyAnbGFzdERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDcgPyAnbmV4dFdlZWsnIDogJ3NhbWVFbHNlJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxlbmRhciQxICh0aW1lLCBmb3JtYXRzKSB7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBjcmVhdGVMb2NhbCgpLFxuICAgICAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICBmb3JtYXQgPSBob29rcy5jYWxlbmRhckZvcm1hdCh0aGlzLCBzb2QpIHx8ICdzYW1lRWxzZSc7XG5cbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdHMgJiYgKGlzRnVuY3Rpb24oZm9ybWF0c1tmb3JtYXRdKSA/IGZvcm1hdHNbZm9ybWF0XS5jYWxsKHRoaXMsIG5vdykgOiBmb3JtYXRzW2Zvcm1hdF0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChvdXRwdXQgfHwgdGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBjcmVhdGVMb2NhbChub3cpKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyghaXNVbmRlZmluZWQodW5pdHMpID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPiBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbElucHV0LnZhbHVlT2YoKSA8IHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBsb2NhbElucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBjcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHMoIWlzVW5kZWZpbmVkKHVuaXRzKSA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpIDwgbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKS52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmV0d2VlbiAoZnJvbSwgdG8sIHVuaXRzLCBpbmNsdXNpdml0eSkge1xuICAgICAgICBpbmNsdXNpdml0eSA9IGluY2x1c2l2aXR5IHx8ICcoKSc7XG4gICAgICAgIHJldHVybiAoaW5jbHVzaXZpdHlbMF0gPT09ICcoJyA/IHRoaXMuaXNBZnRlcihmcm9tLCB1bml0cykgOiAhdGhpcy5pc0JlZm9yZShmcm9tLCB1bml0cykpICYmXG4gICAgICAgICAgICAoaW5jbHVzaXZpdHlbMV0gPT09ICcpJyA/IHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKSA6ICF0aGlzLmlzQWZ0ZXIodG8sIHVuaXRzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KSxcbiAgICAgICAgICAgIGlucHV0TXM7XG4gICAgICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpID09PSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykudmFsdWVPZigpIDw9IGlucHV0TXMgJiYgaW5wdXRNcyA8PSB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZU9yQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQWZ0ZXIoaW5wdXQsdW5pdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZU9yQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNTYW1lKGlucHV0LCB1bml0cykgfHwgdGhpcy5pc0JlZm9yZShpbnB1dCx1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlmZiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgIHZhciB0aGF0LFxuICAgICAgICAgICAgem9uZURlbHRhLFxuICAgICAgICAgICAgb3V0cHV0O1xuXG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cblxuICAgICAgICB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKTtcblxuICAgICAgICBpZiAoIXRoYXQuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgem9uZURlbHRhID0gKHRoYXQudXRjT2Zmc2V0KCkgLSB0aGlzLnV0Y09mZnNldCgpKSAqIDZlNDtcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMTI7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW9udGgnOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KSAvIDM7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDFlMzsgYnJlYWs7IC8vIDEwMDBcbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyA2ZTQ7IGJyZWFrOyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMzZlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICBjYXNlICdkYXknOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gODY0ZTU7IGJyZWFrOyAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICBjYXNlICd3ZWVrJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0IC0gem9uZURlbHRhKSAvIDYwNDhlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICBkZWZhdWx0OiBvdXRwdXQgPSB0aGlzIC0gdGhhdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzRmxvb3Iob3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aERpZmYgKGEsIGIpIHtcbiAgICAgICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICAgICAgdmFyIHdob2xlTW9udGhEaWZmID0gKChiLnllYXIoKSAtIGEueWVhcigpKSAqIDEyKSArIChiLm1vbnRoKCkgLSBhLm1vbnRoKCkpLFxuICAgICAgICAgICAgLy8gYiBpcyBpbiAoYW5jaG9yIC0gMSBtb250aCwgYW5jaG9yICsgMSBtb250aClcbiAgICAgICAgICAgIGFuY2hvciA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYsICdtb250aHMnKSxcbiAgICAgICAgICAgIGFuY2hvcjIsIGFkanVzdDtcblxuICAgICAgICBpZiAoYiAtIGFuY2hvciA8IDApIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmIC0gMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IgLSBhbmNob3IyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmICsgMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IyIC0gYW5jaG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2hlY2sgZm9yIG5lZ2F0aXZlIHplcm8sIHJldHVybiB6ZXJvIGlmIG5lZ2F0aXZlIHplcm9cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpIHx8IDA7XG4gICAgfVxuXG4gICAgaG9va3MuZGVmYXVsdEZvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWic7XG4gICAgaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA9ICdZWVlZLU1NLUREVEhIOm1tOnNzW1pdJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSVNPU3RyaW5nKGtlZXBPZmZzZXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHV0YyA9IGtlZXBPZmZzZXQgIT09IHRydWU7XG4gICAgICAgIHZhciBtID0gdXRjID8gdGhpcy5jbG9uZSgpLnV0YygpIDogdGhpcztcbiAgICAgICAgaWYgKG0ueWVhcigpIDwgMCB8fCBtLnllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgdXRjID8gJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSkge1xuICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgIGlmICh1dGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkgKyB0aGlzLnV0Y09mZnNldCgpICogNjAgKiAxMDAwKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1onLCBmb3JtYXRNb21lbnQobSwgJ1onKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCB1dGMgPyAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScgOiAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1onKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBodW1hbiByZWFkYWJsZSByZXByZXNlbnRhdGlvbiBvZiBhIG1vbWVudCB0aGF0IGNhblxuICAgICAqIGFsc28gYmUgZXZhbHVhdGVkIHRvIGdldCBhIG5ldyBtb21lbnQgd2hpY2ggaXMgdGhlIHNhbWVcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHBzOi8vbm9kZWpzLm9yZy9kaXN0L2xhdGVzdC9kb2NzL2FwaS91dGlsLmh0bWwjdXRpbF9jdXN0b21faW5zcGVjdF9mdW5jdGlvbl9vbl9vYmplY3RzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiAnbW9tZW50LmludmFsaWQoLyogJyArIHRoaXMuX2kgKyAnICovKSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZ1bmMgPSAnbW9tZW50JztcbiAgICAgICAgdmFyIHpvbmUgPSAnJztcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9jYWwoKSkge1xuICAgICAgICAgICAgZnVuYyA9IHRoaXMudXRjT2Zmc2V0KCkgPT09IDAgPyAnbW9tZW50LnV0YycgOiAnbW9tZW50LnBhcnNlWm9uZSc7XG4gICAgICAgICAgICB6b25lID0gJ1onO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmVmaXggPSAnWycgKyBmdW5jICsgJyhcIl0nO1xuICAgICAgICB2YXIgeWVhciA9ICgwIDw9IHRoaXMueWVhcigpICYmIHRoaXMueWVhcigpIDw9IDk5OTkpID8gJ1lZWVknIDogJ1lZWVlZWSc7XG4gICAgICAgIHZhciBkYXRldGltZSA9ICctTU0tRERbVF1ISDptbTpzcy5TU1MnO1xuICAgICAgICB2YXIgc3VmZml4ID0gem9uZSArICdbXCIpXSc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHByZWZpeCArIHllYXIgKyBkYXRldGltZSArIHN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0IChpbnB1dFN0cmluZykge1xuICAgICAgICBpZiAoIWlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICBpbnB1dFN0cmluZyA9IHRoaXMuaXNVdGMoKSA/IGhvb2tzLmRlZmF1bHRGb3JtYXRVdGMgOiBob29rcy5kZWZhdWx0Rm9ybWF0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAgICAgKChpc01vbWVudCh0aW1lKSAmJiB0aW1lLmlzVmFsaWQoKSkgfHxcbiAgICAgICAgICAgICAgICAgY3JlYXRlTG9jYWwodGltZSkuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHt0bzogdGhpcywgZnJvbTogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShjcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0byAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fFxuICAgICAgICAgICAgICAgICBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oe2Zyb206IHRoaXMsIHRvOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8oY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcGFzc2VkIGEgbG9jYWxlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxvY2FsZSBmb3IgdGhpc1xuICAgIC8vIGluc3RhbmNlLiAgT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiB0aGUgbG9jYWxlIGNvbmZpZ3VyYXRpb25cbiAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgZnVuY3Rpb24gbG9jYWxlIChrZXkpIHtcbiAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TG9jYWxlRGF0YSA9IGdldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKG5ld0xvY2FsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZURhdGEgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0T2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAnZGF0ZScgaXMgYW4gYWxpYXMgZm9yICdkYXknLCBzbyBpdCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBzdWNoLlxuICAgICAgICBpZiAodW5pdHMgPT09ICdkYXRlJykge1xuICAgICAgICAgICAgdW5pdHMgPSAnZGF5JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgxLCAodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSkuc3VidHJhY3QoMSwgJ21zJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kLnZhbHVlT2YoKSAtICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaXggKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnZhbHVlT2YoKSAvIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFttLnllYXIoKSwgbS5tb250aCgpLCBtLmRhdGUoKSwgbS5ob3VyKCksIG0ubWludXRlKCksIG0uc2Vjb25kKCksIG0ubWlsbGlzZWNvbmQoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9PYmplY3QgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyczogbS55ZWFyKCksXG4gICAgICAgICAgICBtb250aHM6IG0ubW9udGgoKSxcbiAgICAgICAgICAgIGRhdGU6IG0uZGF0ZSgpLFxuICAgICAgICAgICAgaG91cnM6IG0uaG91cnMoKSxcbiAgICAgICAgICAgIG1pbnV0ZXM6IG0ubWludXRlcygpLFxuICAgICAgICAgICAgc2Vjb25kczogbS5zZWNvbmRzKCksXG4gICAgICAgICAgICBtaWxsaXNlY29uZHM6IG0ubWlsbGlzZWNvbmRzKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0pTT04gKCkge1xuICAgICAgICAvLyBuZXcgRGF0ZShOYU4pLnRvSlNPTigpID09PSBudWxsXG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMudG9JU09TdHJpbmcoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZCQyICgpIHtcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2luZ0ZsYWdzICgpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQgKCkge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpLm92ZXJmbG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0aW9uRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlucHV0OiB0aGlzLl9pLFxuICAgICAgICAgICAgZm9ybWF0OiB0aGlzLl9mLFxuICAgICAgICAgICAgbG9jYWxlOiB0aGlzLl9sb2NhbGUsXG4gICAgICAgICAgICBpc1VUQzogdGhpcy5faXNVVEMsXG4gICAgICAgICAgICBzdHJpY3Q6IHRoaXMuX3N0cmljdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuICh0b2tlbiwgZ2V0dGVyKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKDAsIFt0b2tlbiwgdG9rZW4ubGVuZ3RoXSwgMCwgZ2V0dGVyKTtcbiAgICB9XG5cbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnJywgICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2dnJywgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHRycsICAnaXNvV2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtZZWFyJywgMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrWWVhcicsIDEpO1xuXG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdHJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdnZycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHRycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZ2cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZ2dnJywgJ2dnZ2dnJywgJ0dHR0cnLCAnR0dHR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDIpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBnZXRTZXRXZWVrWWVhckhlbHBlci5jYWxsKHRoaXMsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrKCksXG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrZGF5KCksXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LFxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2Vla1llYXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBnZXRTZXRXZWVrWWVhckhlbHBlci5jYWxsKHRoaXMsXG4gICAgICAgICAgICAgICAgaW5wdXQsIHRoaXMuaXNvV2VlaygpLCB0aGlzLmlzb1dlZWtkYXkoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SVNPV2Vla3NJblllYXIgKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWtZZWFySGVscGVyKGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgd2Vla3NUYXJnZXQ7XG4gICAgICAgIGlmIChpbnB1dCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gd2Vla09mWWVhcih0aGlzLCBkb3csIGRveSkueWVhcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdlZWtzVGFyZ2V0ID0gd2Vla3NJblllYXIoaW5wdXQsIGRvdywgZG95KTtcbiAgICAgICAgICAgIGlmICh3ZWVrID4gd2Vla3NUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB3ZWVrID0gd2Vla3NUYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2V0V2Vla0FsbC5jYWxsKHRoaXMsIGlucHV0LCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRXZWVrQWxsKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyRGF0YSA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpLFxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoZGF5T2ZZZWFyRGF0YS55ZWFyLCAwLCBkYXlPZlllYXJEYXRhLmRheU9mWWVhcik7XG5cbiAgICAgICAgdGhpcy55ZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSk7XG4gICAgICAgIHRoaXMubW9udGgoZGF0ZS5nZXRVVENNb250aCgpKTtcbiAgICAgICAgdGhpcy5kYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1EnLCAwLCAnUW8nLCAncXVhcnRlcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdxdWFydGVyJywgJ1EnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3F1YXJ0ZXInLCA3KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1EnLCBtYXRjaDEpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1EnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRRdWFydGVyIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0QnLCBbJ0REJywgMl0sICdEbycsICdkYXRlJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RhdGUnLCAnRCcpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RhdGUnLCA5KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0QnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICAgICAgcmV0dXJuIGlzU3RyaWN0ID9cbiAgICAgICAgICAobG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlIHx8IGxvY2FsZS5fb3JkaW5hbFBhcnNlKSA6XG4gICAgICAgICAgbG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlTGVuaWVudDtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydEJywgJ0REJ10sIERBVEUpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtEQVRFXSA9IHRvSW50KGlucHV0Lm1hdGNoKG1hdGNoMXRvMilbMF0pO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignREREJywgWydEREREJywgM10sICdERERvJywgJ2RheU9mWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXlPZlllYXInLCAnREREJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF5T2ZZZWFyJywgNCk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEREQnLCAgbWF0Y2gxdG8zKTtcbiAgICBhZGRSZWdleFRva2VuKCdEREREJywgbWF0Y2gzKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnREREJywgJ0REREQnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyID0gTWF0aC5yb3VuZCgodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIGRheU9mWWVhciksICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21pbnV0ZScsIDE0KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ20nLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnc2Vjb25kJywgMTUpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigncycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1MnLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTJywgNF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1MnLCA1XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTJywgNl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTJywgN10sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1MnLCA4XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1NTJywgOV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDA7XG4gICAgfSk7XG5cblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWlsbGlzZWNvbmQnLCAnbXMnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21pbGxpc2Vjb25kJywgMTYpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG5cbiAgICB2YXIgdG9rZW47XG4gICAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH1cblxuICAgIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG4gICAgfVxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBwcm90byA9IE1vbWVudC5wcm90b3R5cGU7XG5cbiAgICBwcm90by5hZGQgICAgICAgICAgICAgICA9IGFkZDtcbiAgICBwcm90by5jYWxlbmRhciAgICAgICAgICA9IGNhbGVuZGFyJDE7XG4gICAgcHJvdG8uY2xvbmUgICAgICAgICAgICAgPSBjbG9uZTtcbiAgICBwcm90by5kaWZmICAgICAgICAgICAgICA9IGRpZmY7XG4gICAgcHJvdG8uZW5kT2YgICAgICAgICAgICAgPSBlbmRPZjtcbiAgICBwcm90by5mb3JtYXQgICAgICAgICAgICA9IGZvcm1hdDtcbiAgICBwcm90by5mcm9tICAgICAgICAgICAgICA9IGZyb207XG4gICAgcHJvdG8uZnJvbU5vdyAgICAgICAgICAgPSBmcm9tTm93O1xuICAgIHByb3RvLnRvICAgICAgICAgICAgICAgID0gdG87XG4gICAgcHJvdG8udG9Ob3cgICAgICAgICAgICAgPSB0b05vdztcbiAgICBwcm90by5nZXQgICAgICAgICAgICAgICA9IHN0cmluZ0dldDtcbiAgICBwcm90by5pbnZhbGlkQXQgICAgICAgICA9IGludmFsaWRBdDtcbiAgICBwcm90by5pc0FmdGVyICAgICAgICAgICA9IGlzQWZ0ZXI7XG4gICAgcHJvdG8uaXNCZWZvcmUgICAgICAgICAgPSBpc0JlZm9yZTtcbiAgICBwcm90by5pc0JldHdlZW4gICAgICAgICA9IGlzQmV0d2VlbjtcbiAgICBwcm90by5pc1NhbWUgICAgICAgICAgICA9IGlzU2FtZTtcbiAgICBwcm90by5pc1NhbWVPckFmdGVyICAgICA9IGlzU2FtZU9yQWZ0ZXI7XG4gICAgcHJvdG8uaXNTYW1lT3JCZWZvcmUgICAgPSBpc1NhbWVPckJlZm9yZTtcbiAgICBwcm90by5pc1ZhbGlkICAgICAgICAgICA9IGlzVmFsaWQkMjtcbiAgICBwcm90by5sYW5nICAgICAgICAgICAgICA9IGxhbmc7XG4gICAgcHJvdG8ubG9jYWxlICAgICAgICAgICAgPSBsb2NhbGU7XG4gICAgcHJvdG8ubG9jYWxlRGF0YSAgICAgICAgPSBsb2NhbGVEYXRhO1xuICAgIHByb3RvLm1heCAgICAgICAgICAgICAgID0gcHJvdG90eXBlTWF4O1xuICAgIHByb3RvLm1pbiAgICAgICAgICAgICAgID0gcHJvdG90eXBlTWluO1xuICAgIHByb3RvLnBhcnNpbmdGbGFncyAgICAgID0gcGFyc2luZ0ZsYWdzO1xuICAgIHByb3RvLnNldCAgICAgICAgICAgICAgID0gc3RyaW5nU2V0O1xuICAgIHByb3RvLnN0YXJ0T2YgICAgICAgICAgID0gc3RhcnRPZjtcbiAgICBwcm90by5zdWJ0cmFjdCAgICAgICAgICA9IHN1YnRyYWN0O1xuICAgIHByb3RvLnRvQXJyYXkgICAgICAgICAgID0gdG9BcnJheTtcbiAgICBwcm90by50b09iamVjdCAgICAgICAgICA9IHRvT2JqZWN0O1xuICAgIHByb3RvLnRvRGF0ZSAgICAgICAgICAgID0gdG9EYXRlO1xuICAgIHByb3RvLnRvSVNPU3RyaW5nICAgICAgID0gdG9JU09TdHJpbmc7XG4gICAgcHJvdG8uaW5zcGVjdCAgICAgICAgICAgPSBpbnNwZWN0O1xuICAgIHByb3RvLnRvSlNPTiAgICAgICAgICAgID0gdG9KU09OO1xuICAgIHByb3RvLnRvU3RyaW5nICAgICAgICAgID0gdG9TdHJpbmc7XG4gICAgcHJvdG8udW5peCAgICAgICAgICAgICAgPSB1bml4O1xuICAgIHByb3RvLnZhbHVlT2YgICAgICAgICAgID0gdmFsdWVPZjtcbiAgICBwcm90by5jcmVhdGlvbkRhdGEgICAgICA9IGNyZWF0aW9uRGF0YTtcbiAgICBwcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbiAgICBwcm90by5pc0xlYXBZZWFyID0gZ2V0SXNMZWFwWWVhcjtcbiAgICBwcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xuICAgIHByb3RvLmlzb1dlZWtZZWFyID0gZ2V0U2V0SVNPV2Vla1llYXI7XG4gICAgcHJvdG8ucXVhcnRlciA9IHByb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcbiAgICBwcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xuICAgIHByb3RvLmRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGg7XG4gICAgcHJvdG8ud2VlayAgICAgICAgICAgPSBwcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xuICAgIHByb3RvLmlzb1dlZWsgICAgICAgID0gcHJvdG8uaXNvV2Vla3MgICAgID0gZ2V0U2V0SVNPV2VlaztcbiAgICBwcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIHByb3RvLmlzb1dlZWtzSW5ZZWFyID0gZ2V0SVNPV2Vla3NJblllYXI7XG4gICAgcHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG4gICAgcHJvdG8uZGF5ICAgICAgICA9IHByb3RvLmRheXMgICAgICAgICAgICAgPSBnZXRTZXREYXlPZldlZWs7XG4gICAgcHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbiAgICBwcm90by5pc29XZWVrZGF5ID0gZ2V0U2V0SVNPRGF5T2ZXZWVrO1xuICAgIHByb3RvLmRheU9mWWVhciAgPSBnZXRTZXREYXlPZlllYXI7XG4gICAgcHJvdG8uaG91ciA9IHByb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcbiAgICBwcm90by5taW51dGUgPSBwcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xuICAgIHByb3RvLnNlY29uZCA9IHByb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG4gICAgcHJvdG8ubWlsbGlzZWNvbmQgPSBwcm90by5taWxsaXNlY29uZHMgPSBnZXRTZXRNaWxsaXNlY29uZDtcbiAgICBwcm90by51dGNPZmZzZXQgICAgICAgICAgICA9IGdldFNldE9mZnNldDtcbiAgICBwcm90by51dGMgICAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvVVRDO1xuICAgIHByb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBwcm90by5wYXJzZVpvbmUgICAgICAgICAgICA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xuICAgIHByb3RvLmhhc0FsaWduZWRIb3VyT2Zmc2V0ID0gaGFzQWxpZ25lZEhvdXJPZmZzZXQ7XG4gICAgcHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBwcm90by5pc0xvY2FsICAgICAgICAgICAgICA9IGlzTG9jYWw7XG4gICAgcHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbiAgICBwcm90by5pc1V0YyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuICAgIHByb3RvLmlzVVRDICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgcHJvdG8uem9uZUFiYnIgPSBnZXRab25lQWJicjtcbiAgICBwcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuICAgIHByb3RvLmRhdGVzICA9IGRlcHJlY2F0ZSgnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLCBnZXRTZXREYXlPZk1vbnRoKTtcbiAgICBwcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBwcm90by55ZWFycyAgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQnLCBnZXRTZXRZZWFyKTtcbiAgICBwcm90by56b25lICAgPSBkZXByZWNhdGUoJ21vbWVudCgpLnpvbmUgaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudCgpLnV0Y09mZnNldCBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL3pvbmUvJywgZ2V0U2V0Wm9uZSk7XG4gICAgcHJvdG8uaXNEU1RTaGlmdGVkID0gZGVwcmVjYXRlKCdpc0RTVFNoaWZ0ZWQgaXMgZGVwcmVjYXRlZC4gU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZHN0LXNoaWZ0ZWQvIGZvciBtb3JlIGluZm9ybWF0aW9uJywgaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVuaXggKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbChpbnB1dCAqIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUluWm9uZSAoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdCAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvJDEgPSBMb2NhbGUucHJvdG90eXBlO1xuXG4gICAgcHJvdG8kMS5jYWxlbmRhciAgICAgICAgPSBjYWxlbmRhcjtcbiAgICBwcm90byQxLmxvbmdEYXRlRm9ybWF0ICA9IGxvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvJDEuaW52YWxpZERhdGUgICAgID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG8kMS5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xuICAgIHByb3RvJDEucHJlcGFyc2UgICAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvJDEucG9zdGZvcm1hdCAgICAgID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvJDEucmVsYXRpdmVUaW1lICAgID0gcmVsYXRpdmVUaW1lO1xuICAgIHByb3RvJDEucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90byQxLnNldCAgICAgICAgICAgICA9IHNldDtcblxuICAgIHByb3RvJDEubW9udGhzICAgICAgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xuICAgIHByb3RvJDEubW9udGhzU2hvcnQgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzU2hvcnQ7XG4gICAgcHJvdG8kMS5tb250aHNQYXJzZSAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcbiAgICBwcm90byQxLm1vbnRoc1JlZ2V4ICAgICAgID0gbW9udGhzUmVnZXg7XG4gICAgcHJvdG8kMS5tb250aHNTaG9ydFJlZ2V4ICA9IG1vbnRoc1Nob3J0UmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrID0gbG9jYWxlV2VlaztcbiAgICBwcm90byQxLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG8kMS5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgcHJvdG8kMS53ZWVrZGF5cyAgICAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5cztcbiAgICBwcm90byQxLndlZWtkYXlzTWluICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvJDEud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90byQxLndlZWtkYXlzUGFyc2UgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzUGFyc2U7XG5cbiAgICBwcm90byQxLndlZWtkYXlzUmVnZXggICAgICAgPSAgICAgICAgd2Vla2RheXNSZWdleDtcbiAgICBwcm90byQxLndlZWtkYXlzU2hvcnRSZWdleCAgPSAgICAgICAgd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgIHByb3RvJDEud2Vla2RheXNNaW5SZWdleCAgICA9ICAgICAgICB3ZWVrZGF5c01pblJlZ2V4O1xuXG4gICAgcHJvdG8kMS5pc1BNID0gbG9jYWxlSXNQTTtcbiAgICBwcm90byQxLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBnZXQkMSAoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcikge1xuICAgICAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCk7XG4gICAgICAgIHZhciB1dGMgPSBjcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzSW1wbCAoZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCBpbmRleCwgZmllbGQsICdtb250aCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGdldCQxKGZvcm1hdCwgaSwgZmllbGQsICdtb250aCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLy8gKClcbiAgICAvLyAoNSlcbiAgICAvLyAoZm10LCA1KVxuICAgIC8vIChmbXQpXG4gICAgLy8gKHRydWUpXG4gICAgLy8gKHRydWUsIDUpXG4gICAgLy8gKHRydWUsIGZtdCwgNSlcbiAgICAvLyAodHJ1ZSwgZm10KVxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c0ltcGwgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgZmllbGQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsb2NhbGVTb3J0ZWQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGxvY2FsZVNvcnRlZDtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgbG9jYWxlU29ydGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChpc051bWJlcihmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCksXG4gICAgICAgICAgICBzaGlmdCA9IGxvY2FsZVNvcnRlZCA/IGxvY2FsZS5fd2Vlay5kb3cgOiAwO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0JDEoZm9ybWF0LCAoaW5kZXggKyBzaGlmdCkgJSA3LCBmaWVsZCwgJ2RheScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCAoaSArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdE1vbnRoc1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzU2hvcnQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0V2Vla2RheXMgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5cycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c1Nob3J0IChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c01pbiAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzTWluJyk7XG4gICAgfVxuXG4gICAgZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogL1xcZHsxLDJ9KHRofHN0fG5kfHJkKS8sXG4gICAgICAgIG9yZGluYWwgOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbiAgICBob29rcy5sYW5nID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsIGdldFNldEdsb2JhbExvY2FsZSk7XG4gICAgaG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBnZXRMb2NhbGUpO1xuXG4gICAgdmFyIG1hdGhBYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGFicyAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgICAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTdWJ0cmFjdCQxIChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlRHVyYXRpb24oaW5wdXQsIHZhbHVlKTtcblxuICAgICAgICBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgIGR1cmF0aW9uLl9kYXlzICAgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX2RheXM7XG4gICAgICAgIGR1cmF0aW9uLl9tb250aHMgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX21vbnRocztcblxuICAgICAgICByZXR1cm4gZHVyYXRpb24uX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIGFkZCgxLCAncycpIG9yIGFkZChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBhZGQkMSAoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhZGRTdWJ0cmFjdCQxKHRoaXMsIGlucHV0LCB2YWx1ZSwgMSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgc3VidHJhY3QoMSwgJ3MnKSBvciBzdWJ0cmFjdChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBzdWJ0cmFjdCQxIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAtMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzQ2VpbCAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnViYmxlICgpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICAgICAgdmFyIGRheXMgICAgICAgICA9IHRoaXMuX2RheXM7XG4gICAgICAgIHZhciBtb250aHMgICAgICAgPSB0aGlzLl9tb250aHM7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgPSB0aGlzLl9kYXRhO1xuICAgICAgICB2YXIgc2Vjb25kcywgbWludXRlcywgaG91cnMsIHllYXJzLCBtb250aHNGcm9tRGF5cztcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgbWl4IG9mIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMsIGJ1YmJsZSBkb3duIGZpcnN0XG4gICAgICAgIC8vIGNoZWNrOiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjE2NlxuICAgICAgICBpZiAoISgobWlsbGlzZWNvbmRzID49IDAgJiYgZGF5cyA+PSAwICYmIG1vbnRocyA+PSAwKSB8fFxuICAgICAgICAgICAgICAgIChtaWxsaXNlY29uZHMgPD0gMCAmJiBkYXlzIDw9IDAgJiYgbW9udGhzIDw9IDApKSkge1xuICAgICAgICAgICAgbWlsbGlzZWNvbmRzICs9IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRocykgKyBkYXlzKSAqIDg2NGU1O1xuICAgICAgICAgICAgZGF5cyA9IDA7XG4gICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICBzZWNvbmRzICAgICAgICAgICA9IGFic0Zsb29yKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICBkYXRhLnNlY29uZHMgICAgICA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGRhdGEubWludXRlcyAgICAgID0gbWludXRlcyAlIDYwO1xuXG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgZGF0YS5ob3VycyAgICAgICAgPSBob3VycyAlIDI0O1xuXG4gICAgICAgIGRheXMgKz0gYWJzRmxvb3IoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgLy8gY29udmVydCBkYXlzIHRvIG1vbnRoc1xuICAgICAgICBtb250aHNGcm9tRGF5cyA9IGFic0Zsb29yKGRheXNUb01vbnRocyhkYXlzKSk7XG4gICAgICAgIG1vbnRocyArPSBtb250aHNGcm9tRGF5cztcbiAgICAgICAgZGF5cyAtPSBhYnNDZWlsKG1vbnRoc1RvRGF5cyhtb250aHNGcm9tRGF5cykpO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuICAgICAgICBkYXRhLmRheXMgICA9IGRheXM7XG4gICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgICAgICBkYXRhLnllYXJzICA9IHllYXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNUb01vbnRocyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDEyIG1vbnRocyA9PT0gNDgwMFxuICAgICAgICByZXR1cm4gZGF5cyAqIDQ4MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhzVG9EYXlzIChtb250aHMpIHtcbiAgICAgICAgLy8gdGhlIHJldmVyc2Ugb2YgZGF5c1RvTW9udGhzXG4gICAgICAgIHJldHVybiBtb250aHMgKiAxNDYwOTcgLyA0ODAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzICh1bml0cykge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXlzO1xuICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb01vbnRocyhkYXlzKTtcbiAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKG1vbnRoc1RvRGF5cyh0aGlzLl9tb250aHMpKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJyAgIDogcmV0dXJuIGRheXMgLyA3ICAgICArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXknICAgIDogcmV0dXJuIGRheXMgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInICAgOiByZXR1cm4gZGF5cyAqIDI0ICAgICsgbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnIDogcmV0dXJuIGRheXMgKiAxNDQwICArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnIDogcmV0dXJuIGRheXMgKiA4NjQwMCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogODY0ZTUpICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbiAgICBmdW5jdGlvbiB2YWx1ZU9mJDEgKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBcyAoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG4gICAgdmFyIGFzU2Vjb25kcyAgICAgID0gbWFrZUFzKCdzJyk7XG4gICAgdmFyIGFzTWludXRlcyAgICAgID0gbWFrZUFzKCdtJyk7XG4gICAgdmFyIGFzSG91cnMgICAgICAgID0gbWFrZUFzKCdoJyk7XG4gICAgdmFyIGFzRGF5cyAgICAgICAgID0gbWFrZUFzKCdkJyk7XG4gICAgdmFyIGFzV2Vla3MgICAgICAgID0gbWFrZUFzKCd3Jyk7XG4gICAgdmFyIGFzTW9udGhzICAgICAgID0gbWFrZUFzKCdNJyk7XG4gICAgdmFyIGFzWWVhcnMgICAgICAgID0gbWFrZUFzKCd5Jyk7XG5cbiAgICBmdW5jdGlvbiBjbG9uZSQxICgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCQyICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpc1t1bml0cyArICdzJ10oKSA6IE5hTjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2RhdGFbbmFtZV0gOiBOYU47XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpO1xuICAgIHZhciBzZWNvbmRzICAgICAgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG4gICAgdmFyIG1pbnV0ZXMgICAgICA9IG1ha2VHZXR0ZXIoJ21pbnV0ZXMnKTtcbiAgICB2YXIgaG91cnMgICAgICAgID0gbWFrZUdldHRlcignaG91cnMnKTtcbiAgICB2YXIgZGF5cyAgICAgICAgID0gbWFrZUdldHRlcignZGF5cycpO1xuICAgIHZhciBtb250aHMgICAgICAgPSBtYWtlR2V0dGVyKCdtb250aHMnKTtcbiAgICB2YXIgeWVhcnMgICAgICAgID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzICgpIHtcbiAgICAgICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgfVxuXG4gICAgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbiAgICB2YXIgdGhyZXNob2xkcyA9IHtcbiAgICAgICAgc3M6IDQ0LCAgICAgICAgIC8vIGEgZmV3IHNlY29uZHMgdG8gc2Vjb25kc1xuICAgICAgICBzIDogNDUsICAgICAgICAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbSA6IDQ1LCAgICAgICAgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBoIDogMjIsICAgICAgICAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgIGQgOiAyNiwgICAgICAgICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIE0gOiAxMSAgICAgICAgICAvLyBtb250aHMgdG8geWVhclxuICAgIH07XG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZSQxIChwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZUR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKTtcbiAgICAgICAgdmFyIHNlY29uZHMgID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSk7XG4gICAgICAgIHZhciBtaW51dGVzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpO1xuICAgICAgICB2YXIgaG91cnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKTtcbiAgICAgICAgdmFyIGRheXMgICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSk7XG4gICAgICAgIHZhciBtb250aHMgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpO1xuICAgICAgICB2YXIgeWVhcnMgICAgPSByb3VuZChkdXJhdGlvbi5hcygneScpKTtcblxuICAgICAgICB2YXIgYSA9IHNlY29uZHMgPD0gdGhyZXNob2xkcy5zcyAmJiBbJ3MnLCBzZWNvbmRzXSAgfHxcbiAgICAgICAgICAgICAgICBzZWNvbmRzIDwgdGhyZXNob2xkcy5zICAgJiYgWydzcycsIHNlY29uZHNdIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8PSAxICAgICAgICAgICAgICYmIFsnbSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gICAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDw9IDEgICAgICAgICAgICAgJiYgWydoJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA8IHRocmVzaG9sZHMuaCAgICYmIFsnaGgnLCBob3Vyc10gICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPD0gMSAgICAgICAgICAgICAmJiBbJ2QnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgIDwgdGhyZXNob2xkcy5kICAgJiYgWydkZCcsIGRheXNdICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8PSAxICAgICAgICAgICAgICYmIFsnTSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPCB0aHJlc2hvbGRzLk0gICAmJiBbJ01NJywgbW9udGhzXSAgfHxcbiAgICAgICAgICAgICAgICB5ZWFycyAgIDw9IDEgICAgICAgICAgICAgJiYgWyd5J10gICAgICAgICAgIHx8IFsneXknLCB5ZWFyc107XG5cbiAgICAgICAgYVsyXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgICAgIGFbM10gPSArcG9zTmVnRHVyYXRpb24gPiAwO1xuICAgICAgICBhWzRdID0gbG9jYWxlO1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0ZVRpbWVBZ28uYXBwbHkobnVsbCwgYSk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCB0aGUgcm91bmRpbmcgZnVuY3Rpb24gZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGdldFNldFJlbGF0aXZlVGltZVJvdW5kaW5nIChyb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmIChyb3VuZGluZ0Z1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mKHJvdW5kaW5nRnVuY3Rpb24pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByb3VuZCA9IHJvdW5kaW5nRnVuY3Rpb247XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmICh0aHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICBpZiAodGhyZXNob2xkID09PSAncycpIHtcbiAgICAgICAgICAgIHRocmVzaG9sZHMuc3MgPSBsaW1pdCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHVtYW5pemUgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSByZWxhdGl2ZVRpbWUkMSh0aGlzLCAhd2l0aFN1ZmZpeCwgbG9jYWxlKTtcblxuICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gbG9jYWxlLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYWxlLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgYWJzJDEgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIHNpZ24oeCkge1xuICAgICAgICByZXR1cm4gKCh4ID4gMCkgLSAoeCA8IDApKSB8fCAreDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0lTT1N0cmluZyQxKCkge1xuICAgICAgICAvLyBmb3IgSVNPIHN0cmluZ3Mgd2UgZG8gbm90IHVzZSB0aGUgbm9ybWFsIGJ1YmJsaW5nIHJ1bGVzOlxuICAgICAgICAvLyAgKiBtaWxsaXNlY29uZHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIGhvdXJzXG4gICAgICAgIC8vICAqIGRheXMgZG8gbm90IGJ1YmJsZSBhdCBhbGxcbiAgICAgICAgLy8gICogbW9udGhzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSB5ZWFyc1xuICAgICAgICAvLyBUaGlzIGlzIGJlY2F1c2UgdGhlcmUgaXMgbm8gY29udGV4dC1mcmVlIGNvbnZlcnNpb24gYmV0d2VlbiBob3VycyBhbmQgZGF5c1xuICAgICAgICAvLyAodGhpbmsgb2YgY2xvY2sgY2hhbmdlcylcbiAgICAgICAgLy8gYW5kIGFsc28gbm90IGJldHdlZW4gZGF5cyBhbmQgbW9udGhzICgyOC0zMSBkYXlzIHBlciBtb250aClcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2Vjb25kcyA9IGFicyQxKHRoaXMuX21pbGxpc2Vjb25kcykgLyAxMDAwO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gYWJzJDEodGhpcy5fZGF5cyk7XG4gICAgICAgIHZhciBtb250aHMgICAgICAgPSBhYnMkMSh0aGlzLl9tb250aHMpO1xuICAgICAgICB2YXIgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgICAgIC8vIDM2MDAgc2Vjb25kcyAtPiA2MCBtaW51dGVzIC0+IDEgaG91clxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgc2Vjb25kcyAlPSA2MDtcbiAgICAgICAgbWludXRlcyAlPSA2MDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzICA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG5cbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgdmFyIFkgPSB5ZWFycztcbiAgICAgICAgdmFyIE0gPSBtb250aHM7XG4gICAgICAgIHZhciBEID0gZGF5cztcbiAgICAgICAgdmFyIGggPSBob3VycztcbiAgICAgICAgdmFyIG0gPSBtaW51dGVzO1xuICAgICAgICB2YXIgcyA9IHNlY29uZHMgPyBzZWNvbmRzLnRvRml4ZWQoMykucmVwbGFjZSgvXFwuPzArJC8sICcnKSA6ICcnO1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3RhbFNpZ24gPSB0b3RhbCA8IDAgPyAnLScgOiAnJztcbiAgICAgICAgdmFyIHltU2lnbiA9IHNpZ24odGhpcy5fbW9udGhzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICAgICAgdmFyIGRheXNTaWduID0gc2lnbih0aGlzLl9kYXlzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICAgICAgdmFyIGhtc1NpZ24gPSBzaWduKHRoaXMuX21pbGxpc2Vjb25kcykgIT09IHNpZ24odG90YWwpID8gJy0nIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHRvdGFsU2lnbiArICdQJyArXG4gICAgICAgICAgICAoWSA/IHltU2lnbiArIFkgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgKE0gPyB5bVNpZ24gKyBNICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChEID8gZGF5c1NpZ24gKyBEICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICgoaCB8fCBtIHx8IHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgIChoID8gaG1zU2lnbiArIGggKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgKG0gPyBobXNTaWduICsgbSArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAocyA/IGhtc1NpZ24gKyBzICsgJ1MnIDogJycpO1xuICAgIH1cblxuICAgIHZhciBwcm90byQyID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgcHJvdG8kMi5pc1ZhbGlkICAgICAgICA9IGlzVmFsaWQkMTtcbiAgICBwcm90byQyLmFicyAgICAgICAgICAgID0gYWJzO1xuICAgIHByb3RvJDIuYWRkICAgICAgICAgICAgPSBhZGQkMTtcbiAgICBwcm90byQyLnN1YnRyYWN0ICAgICAgID0gc3VidHJhY3QkMTtcbiAgICBwcm90byQyLmFzICAgICAgICAgICAgID0gYXM7XG4gICAgcHJvdG8kMi5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xuICAgIHByb3RvJDIuYXNTZWNvbmRzICAgICAgPSBhc1NlY29uZHM7XG4gICAgcHJvdG8kMi5hc01pbnV0ZXMgICAgICA9IGFzTWludXRlcztcbiAgICBwcm90byQyLmFzSG91cnMgICAgICAgID0gYXNIb3VycztcbiAgICBwcm90byQyLmFzRGF5cyAgICAgICAgID0gYXNEYXlzO1xuICAgIHByb3RvJDIuYXNXZWVrcyAgICAgICAgPSBhc1dlZWtzO1xuICAgIHByb3RvJDIuYXNNb250aHMgICAgICAgPSBhc01vbnRocztcbiAgICBwcm90byQyLmFzWWVhcnMgICAgICAgID0gYXNZZWFycztcbiAgICBwcm90byQyLnZhbHVlT2YgICAgICAgID0gdmFsdWVPZiQxO1xuICAgIHByb3RvJDIuX2J1YmJsZSAgICAgICAgPSBidWJibGU7XG4gICAgcHJvdG8kMi5jbG9uZSAgICAgICAgICA9IGNsb25lJDE7XG4gICAgcHJvdG8kMi5nZXQgICAgICAgICAgICA9IGdldCQyO1xuICAgIHByb3RvJDIubWlsbGlzZWNvbmRzICAgPSBtaWxsaXNlY29uZHM7XG4gICAgcHJvdG8kMi5zZWNvbmRzICAgICAgICA9IHNlY29uZHM7XG4gICAgcHJvdG8kMi5taW51dGVzICAgICAgICA9IG1pbnV0ZXM7XG4gICAgcHJvdG8kMi5ob3VycyAgICAgICAgICA9IGhvdXJzO1xuICAgIHByb3RvJDIuZGF5cyAgICAgICAgICAgPSBkYXlzO1xuICAgIHByb3RvJDIud2Vla3MgICAgICAgICAgPSB3ZWVrcztcbiAgICBwcm90byQyLm1vbnRocyAgICAgICAgID0gbW9udGhzO1xuICAgIHByb3RvJDIueWVhcnMgICAgICAgICAgPSB5ZWFycztcbiAgICBwcm90byQyLmh1bWFuaXplICAgICAgID0gaHVtYW5pemU7XG4gICAgcHJvdG8kMi50b0lTT1N0cmluZyAgICA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi50b1N0cmluZyAgICAgICA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi50b0pTT04gICAgICAgICA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi5sb2NhbGUgICAgICAgICA9IGxvY2FsZTtcbiAgICBwcm90byQyLmxvY2FsZURhdGEgICAgID0gbG9jYWxlRGF0YTtcblxuICAgIHByb3RvJDIudG9Jc29TdHJpbmcgPSBkZXByZWNhdGUoJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJywgdG9JU09TdHJpbmckMSk7XG4gICAgcHJvdG8kMi5sYW5nID0gbGFuZztcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuICAgIGhvb2tzLnZlcnNpb24gPSAnMi4yMi4yJztcblxuICAgIHNldEhvb2tDYWxsYmFjayhjcmVhdGVMb2NhbCk7XG5cbiAgICBob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBwcm90bztcbiAgICBob29rcy5taW4gICAgICAgICAgICAgICAgICAgPSBtaW47XG4gICAgaG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuICAgIGhvb2tzLm5vdyAgICAgICAgICAgICAgICAgICA9IG5vdztcbiAgICBob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVVVEM7XG4gICAgaG9va3MudW5peCAgICAgICAgICAgICAgICAgID0gY3JlYXRlVW5peDtcbiAgICBob29rcy5tb250aHMgICAgICAgICAgICAgICAgPSBsaXN0TW9udGhzO1xuICAgIGhvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbiAgICBob29rcy5sb2NhbGUgICAgICAgICAgICAgICAgPSBnZXRTZXRHbG9iYWxMb2NhbGU7XG4gICAgaG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gY3JlYXRlSW52YWxpZDtcbiAgICBob29rcy5kdXJhdGlvbiAgICAgICAgICAgICAgPSBjcmVhdGVEdXJhdGlvbjtcbiAgICBob29rcy5pc01vbWVudCAgICAgICAgICAgICAgPSBpc01vbWVudDtcbiAgICBob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0V2Vla2RheXM7XG4gICAgaG9va3MucGFyc2Vab25lICAgICAgICAgICAgID0gY3JlYXRlSW5ab25lO1xuICAgIGhvb2tzLmxvY2FsZURhdGEgICAgICAgICAgICA9IGdldExvY2FsZTtcbiAgICBob29rcy5pc0R1cmF0aW9uICAgICAgICAgICAgPSBpc0R1cmF0aW9uO1xuICAgIGhvb2tzLm1vbnRoc1Nob3J0ICAgICAgICAgICA9IGxpc3RNb250aHNTaG9ydDtcbiAgICBob29rcy53ZWVrZGF5c01pbiAgICAgICAgICAgPSBsaXN0V2Vla2RheXNNaW47XG4gICAgaG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuICAgIGhvb2tzLnVwZGF0ZUxvY2FsZSAgICAgICAgICA9IHVwZGF0ZUxvY2FsZTtcbiAgICBob29rcy5sb2NhbGVzICAgICAgICAgICAgICAgPSBsaXN0TG9jYWxlcztcbiAgICBob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0V2Vla2RheXNTaG9ydDtcbiAgICBob29rcy5ub3JtYWxpemVVbml0cyAgICAgICAgPSBub3JtYWxpemVVbml0cztcbiAgICBob29rcy5yZWxhdGl2ZVRpbWVSb3VuZGluZyAgPSBnZXRTZXRSZWxhdGl2ZVRpbWVSb3VuZGluZztcbiAgICBob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQ7XG4gICAgaG9va3MuY2FsZW5kYXJGb3JtYXQgICAgICAgID0gZ2V0Q2FsZW5kYXJGb3JtYXQ7XG4gICAgaG9va3MucHJvdG90eXBlICAgICAgICAgICAgID0gcHJvdG87XG5cbiAgICAvLyBjdXJyZW50bHkgSFRNTDUgaW5wdXQgdHlwZSBvbmx5IHN1cHBvcnRzIDI0LWhvdXIgZm9ybWF0c1xuICAgIGhvb2tzLkhUTUw1X0ZNVCA9IHtcbiAgICAgICAgREFURVRJTUVfTE9DQUw6ICdZWVlZLU1NLUREVEhIOm1tJywgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIC8+XG4gICAgICAgIERBVEVUSU1FX0xPQ0FMX1NFQ09ORFM6ICdZWVlZLU1NLUREVEhIOm1tOnNzJywgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgIERBVEVUSU1FX0xPQ0FMX01TOiAnWVlZWS1NTS1ERFRISDptbTpzcy5TU1MnLCAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBzdGVwPVwiMC4wMDFcIiAvPlxuICAgICAgICBEQVRFOiAnWVlZWS1NTS1ERCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cImRhdGVcIiAvPlxuICAgICAgICBUSU1FOiAnSEg6bW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiAvPlxuICAgICAgICBUSU1FX1NFQ09ORFM6ICdISDptbTpzcycsICAgICAgICAgICAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgIFRJTUVfTVM6ICdISDptbTpzcy5TU1MnLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgICAgIFdFRUs6ICdZWVlZLVtXXVdXJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwid2Vla1wiIC8+XG4gICAgICAgIE1PTlRIOiAnWVlZWS1NTScgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwibW9udGhcIiAvPlxuICAgIH07XG5cbiAgICByZXR1cm4gaG9va3M7XG5cbn0pKSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
