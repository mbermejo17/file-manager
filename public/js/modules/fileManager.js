(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareFile = shareFile;
exports.showSharedFiles = showSharedFiles;
exports.deleteSelected = deleteSelected;
exports.newFolder = newFolder;
exports.deleteFile = deleteFile;
exports.deleteFolder = deleteFolder;
exports.upload = upload;
exports.download = download;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _general = require("./general");

var _modalDialog = require("../vendor/modalDialog");

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

var _dataTables = require("../vendor/dataTables");

var _dataTables2 = _interopRequireDefault(_dataTables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* jshint laxbreak: true */


////////////////////////////////////
// Files and Folder module
///////////////////////////////////

var htmlShareFile = "\n<div id=\"shareFileModal\">\n  <div id=\"modal-header\">\n    <h5>Share File</h5>\n    <a class=\"modal_close\" id=\"sharedModalClose\" href=\"#hola\"></a>\n  </div>\n  <br>\n  <div class=\"userForm-row\" id=\"\">\n    <div class=\"input-field col s1 m1\">\n    </div>\n    <div class=\"input-field col s5\">\n      \n      <input id=\"destUserName\" type=\"email\" autocomplete=\"off\" pattern=\".+@globex.com\" class=\"userForm-input\" required/>\n      <label for=\"destUserName\">Send URL to</label>\n    </div>\n    <div class=\"input-field col s3 m3\">\n        <input class=\"datepicker\" id=\"FileExpirateDate\" type=\"date\" class=\"userForm-input\"/>\n        <label for=\"FileExpirateDate\">Expiration Date</label>\n    </div>\n    <div class=\"input-field col s3 m3\">\n    </div>\n  </div>  \n  <div class=\"row\"> \n    <div class=\"input-field col s9 m9\">\n      <input class=\"check\" id=\"delFileAfterExpired\" type=\"checkbox\">\n      <label class=\"checkbox\" for=\"delFileAfterExpired\"></label> \n      <span>Delete file when expires</span>  \n    </div>\n    <div class=\"input-field col s1 m1\">\n      <button class=\"waves-effect waves-teal btn-flat btn2-unify right\" id=\"btn-ShareFileCancel\" type=\"submit\" name=\"action\">Cancel</button>\n    </div>\n    <div class=\"input-field col s1 m1\">  \n      <button class=\"waves-effect waves-teal btn-flat btn2-unify left\" id=\"btn-ShareFileAccept\" type=\"submit\" name=\"action\">Send</button>\n    </div>\n  </div>    \n</div>";

var htmlSearchSharedFilesTemplate = "\n<div>\n      <div class=\"head-Title\">Edit Shared Files</div> \n      <table id=\"SharedFilesTableList\" class=\"tableList\">\n        <thead>\n          <tr>\n            <th>Id</th>\n            <th>User</th>\n            <th>Dest User Name</th>\n            <th>File Name</th>\n            <th>State</th>\n            <th data-type=\"date\" data-format=\"YYYY/MM/DD\">Expirate Date</th>\n            <th>Delete</div>\n            <th>Group Id</th>\n            <th></th>\n          </tr>\n        </thead>\n        <tbody id=\"bodyList\">    \n        </tbody>\n      </table>\n      <div class=\"AddUserModalContent-footer\">\n        <div class=\"button-container\">\n            <button class=\"waves-effect waves-teal btn-flat btn2-unify\" id=\"btn-EditSharedFileCancel\" type=\"submit\" name=\"action\">Close</button>\n        </div> \n      </div>\n</div>\n";

var htmlUploadDownloadTemplate = "\n<ul class=\"preloader-file\" id=\"DownloadfileList\">\n    <li id=\"li0\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename0\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar0\"></div>\n                <div class=\"percent\" id=\"percent0\"></div>               \n            </div>\n            <div class=\"abort-task\">\n                  <a class=\"file-abort\" id=\"abort0\" href=\"#\" title=\"Cancel file download\"></a>\n            </div>\n        </div>\n    </li>\n    <li id=\"li1\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename1\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar1\"></div>\n                <div class=\"percent\" id=\"percent1\"></div>\n            </div>\n            <div class=\"abort-task\">\n              <a class=\"file-abort\" id=\"abort1\" href=\"#\" title=\"Cancel file download\"></a>\n            </div> \n        </div>\n    </li>\n    <li id=\"li2\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename2\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar2\"></div>\n                <div class=\"percent\" id=\"percent2\"></div>\n            </div>  \n            <div class=\"abort-task\">\n              <a class=\"file-abort\" id=\"abort2\" href=\"#\" title=\"Cancel file download\"></a>\n            </div> \n        </div>\n    </li>\n    <li id=\"li3\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename3\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar3\"></div>\n                <div class=\"percent\" id=\"percent3\"></div>\n            </div>\n            <div class=\"abort-task\">\n                  <a class=\"file-abort\" id=\"abort3\" href=\"#\" title=\"Cancel file download\"></a>\n                </div>   \n        </div>\n    </li>\n    <li id=\"li4\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename4\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar4\"></div>\n                <div class=\"percent\" id=\"percent4\"></div>  \n            </div>\n            <div class=\"abort-task\">\n                  <a class=\"file-abort\" id=\"abort4\" href=\"#\" title=\"Cancel file download\"></a>\n                </div> \n        </div>\n    </li>\n</ul>";

var _getUID = function _getUID() {
  var uid = (0, _v2.default)();
  return uid.replace(/-/g, "");
};

var sendEmail = function sendEmail(toEmail, fromEmail, subject, body_message) {
  var mailto_link = "mailto:" + toEmail + "?subject=" + subject + "&body=" + body_message;
  var win = window.open(mailto_link, "emailWindow");
  if (win && window.open && !window.closed) window.close();
};

var _showAbortMessage = function _showAbortMessage(el, msg) {
  el.style.backgroundColor = "white";
  el.style.color = "red";
  el.innerHTML = msg;
  el.style.width = "100%";
};

var _deselectAllFolders = function _deselectAllFolders() {
  var allElements = document.querySelectorAll(".dashboard-path");
  allElements.forEach(function (v, i) {
    if (v.children[0].checked) {
      v.children[0].checked = false;
    }
  });
  document.querySelector("#selectAllFiles").checked = false;
  appData.aSelectedFolders = [];
};

var _deselectAllFiles = function _deselectAllFiles() {
  var allElements = document.querySelectorAll(".typeFile");
  /* [].call.forEach(document.querySelectorAll(".typeFile"), function(element) {
    if (element.parentElement.parentElement.children[0].children[0].children[0].checked) {
      element.parentElement.parentElement.children[0].children[0].children[0].checked = false;
    }
  }); */
  allElements.forEach(function (element, i) {
    if (element.parentElement.parentElement.children[0].children[0].children[0].checked) {
      element.parentElement.parentElement.children[0].children[0].children[0].checked = false;
    }
  });
  document.querySelector("#selectAllFiles").checked = false;
  appData.aSelectedFiles.name = [];
  appData.aSelectedFiles.size = [];
};

var validateSize = function validateSize(f) {
  return true;
};

function shareFile() {
  var searchUserModalContent = document.getElementById("searchUserModalContent");
  var AddUserModalContent = document.getElementById("AddUserModalContent");
  var containerOverlay = document.querySelector(".container-overlay");
  var validations = {
    email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, "Please enter a valid email address"]
  };

  var _shareFile = function _shareFile(d) {
    var tmpDate = new Date(d.FileExpirateDate);
    var strTime = "";
    var groupID = null;
    var data = {};
    if (d.FileExpirateDate === "") {
      strTime = (0, _moment2.default)(Date.now()).format("YYYY/MM/DD HH:mm:ss");
    } else {
      strTime = (0, _moment2.default)(d.FileExpirateDate).format("YYYY/MM/DD HH:mm:ss");
    }

    if (d.destUserName !== "") {
      (function () {
        if (userData.RunMode === "DEBUG") console.log(d.destUserName);
        if (userData.RunMode === "DEBUG") console.log("FileExpirateDate: ", d.FileExpirateDate);
        if (appData.aSelectedFiles.name.length > 1) {
          groupID = _getUID();
        }
        var nFiles = appData.aSelectedFiles.name.length;
        var fileList = "";

        var _loop = function _loop(x) {
          fileList += "\n                    - " + appData.aSelectedFiles.name[x] + "  " + appData.aSelectedFiles.size[x];
          data = {
            fileName: appData.aSelectedFiles.name[x],
            fileSize: appData.aSelectedFiles.size[x],
            path: appData.currentPath,
            userName: userData.UserName,
            destUserName: d.destUserName,
            expirationDate: strTime,
            unixDate: (0, _moment2.default)(strTime).format("x"),
            deleteExpiredFile: d.delFileAfterExpired ? 1 : 0,
            groupID: groupID
          };
          if (userData.RunMode === "DEBUG") console.log("_shareFile.data: ", data);
          _axios2.default.post("/files/share", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
          }).then(function (d) {
            if (userData.RunMode === "DEBUG") console.log(d.data);
            if (d.data.status === "OK") {
              //containerOverlay.style.display = "none";
              if (nFiles === 1) {
                document.querySelector("#urlFile").innerHTML = "https://filebox.unifyspain.es/files/share/" + d.data.data.UrlCode;
                var emailBody = encodeURIComponent('El usuario ' + userData.UserName.toUpperCase() + ' ha compartido el archivo ' + appData.aSelectedFiles.name[x] + ' ' + appData.aSelectedFiles.size[x] + '\r\n\r\n' + 'puede descargarlo del link: https://filebox.unifyspain.es/files/share/' + d.data.data.UrlCode);
                sendEmail(d.data.data.DestUser, "filemanager@filebox.unifyspain.es", "URL para descarga de archivo", emailBody);
                appData.aSelectedFiles.name = [];
                appData.aSelectedFiles.size = [];
                appData.aSelectedFolders = [];
                document.getElementById("refresh").click();
                document.getElementById("ModalDialog-button-confirm").style.display = "none";
                document.getElementById("ModalDialog-button-cancel").innerHTML = "OK";
              } else {
                console.log('x:', x);
                if (x === nFiles - 1) {
                  document.querySelector("#urlFile").innerHTML = "https://filebox.unifyspain.es/files/share/" + groupID;
                  var _emailBody = encodeURIComponent('El usuario ' + userData.UserName.toUpperCase() + ' ha compartido los archivos: \r\n' + fileList + '\r\n\r\n' + 'puede descargarlos del link: https://filebox.unifyspain.es/files/share/' + groupID);
                  sendEmail(d.data.data.DestUser, "filemanager@filebox.unifyspain.es", "URL para descarga de archivos", _emailBody);
                  appData.aSelectedFiles.name = [];
                  appData.aSelectedFiles.size = [];
                  appData.aSelectedFolders = [];
                  document.getElementById("refresh").click();
                  document.getElementById("ModalDialog-button-confirm").style.display = "none";
                  document.getElementById("ModalDialog-button-cancel").innerHTML = "OK";
                }
              }
            } else {
              var el = document.querySelector("#ModalDialog-wrap");
              el.parentNode.removeChild(el);
              _deselectAllFiles();
              _deselectAllFolders();
              showToast("Share files", "Error al compartir archivo " + data.fileName + ".<br>Err:" + d.data.message, "error");
            }
          }).catch(function (e) {
            var el = document.querySelector("#ModalDialog-wrap");
            el.parentNode.removeChild(el);
            _deselectAllFiles();
            _deselectAllFolders();
            showToast("Share files", "Error al compartir archivo " + data.fileName + ".<br>Err:" + e, "error");
            if (userData.RunMode === "DEBUG") console.log(e);
          });
        };

        for (var x = 0; x < nFiles; x++) {
          _loop(x);
        }
      })();
    }
  };

  var modalDialogOptions = {
    cancel: true,
    cancelText: "Cancel",
    confirm: true,
    confirmText: "Share",
    type: "shareFile"
  };

  modalDialogOptions.confirmCallBack = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e, data) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (userData.RunMode === "DEBUG") console.log("shareFile: ", data);
              if (data || data.destUserName.trim() !== "") {
                _shareFile(data);
              }

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
  modalDialogOptions.cancelCallBack = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e, data) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log(data);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
  (0, _modalDialog.modalDialog)("Share File", "      <input id=\"destUserName\" type=\"email\" autocomplete=\"off\" pattern=\".+@globex.com\" required class=\"ModalDialog-input\"/>\n                    <label for=\"destUserName\" class=\"ModalDialog-label share\">Send URL to</label>\n                    <input class=\"datepicker ModalDialog-input\" id=\"FileExpirateDate\" type=\"date\"/>\n                    <label for=\"FileExpirateDate\" class=\"ModalDialog-label datepicker share\">Expiration Date</label>\n                    <br>\n                    <input id=\"delFileAfterExpired\" type=\"checkbox\" class=\"ModalDialog-check-input share\">\n                    <label for=\"delFileAfterExpired\" class=\"ModalDialog-check-label share\">Delete File</label>\n                    <br><br>\n                    <label id=\"urlFile\" class=\"label-url-share\"></label>", modalDialogOptions);

  /**/
  //htmlShareFile;
}

//////////////////////
// Show Shared Files
//////////////////////

function showSharedFiles() {
  var AddUserModalContent = document.querySelector("#AddUserModalContent");
  var containerOverlay = document.querySelector(".container-overlay");

  AddUserModalContent.innerHTML = htmlSearchSharedFilesTemplate;
  $u("#AddUserModalContent").addClass("edit");
  AddUserModalContent.style.display = "block";
  containerOverlay.style.display = "block";
  document.querySelector("#waiting").classList.add("active");
  _axios2.default.get("/files/shared/user/" + userData.UserName, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userData.Token
    },
    timeout: 30000
  }).then(function (d) {
    document.querySelector("#waiting").classList.remove("active");
    if (userData.RunMode === "DEBUG") console.log("Hello: ", d.data.status);
    if (d.data.status === "OK") {
      var files = d.data.data;
      var i = void 0;
      var htmlListContent = "";
      var bodyList = document.querySelector("#bodyList");
      if (userData.RunMode === "DEBUG") console.log("files: ", files.length);
      for (i = 0; i < files.length; i++) {
        var sDate = files[i].ExpirateDate ? files[i].ExpirateDate : "never";
        var _d = files[i].DeleteExpiredFile === 1 ? true : false;
        htmlListContent += "\n                  <tr class=\"data-row\">\n                    <td>" + files[i].id + "</td>\n                    <td>" + files[i].User + "</td>\n                    <td>" + files[i].DestUser + "</td>\n                    <td>" + files[i].FileName + "</td>\n                    <td>" + files[i].State + "</td>\n                    <td>" + files[i].ExpirateDate + "</td>\n                    <td>" + _d + "</td>\n                    <td>" + files[i].GroupId + "</td>\n                    <td>\n                    <i id=\"" + files[i].Id + "-id\" class=\"fas fa-pencil edit-ShareFile-icon\" title=\"Editar Archivo\"></i>";
        htmlListContent += "\n                    <i id=\"" + files[i].Id + "-id\" class=\"fas fa-times del-SharedFile-icon\" title=\"Borrar Archivo\"></i></td>\n                  </tr>";

        //console.log('User Role. ',users[i].UserRole.trim().toUpperCase());
      }
      bodyList.innerHTML = htmlListContent;

      var table = new _dataTables2.default(document.querySelector("#SharedFilesTableList"), {
        searchable: true,
        fixedHeight: true,
        info: false,
        perPageSelect: null,
        perPage: 200
      });

      [].forEach.call(document.querySelectorAll(".del-SahredFile-icon"), function (el) {
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

      [].forEach.call(document.querySelectorAll(".edit-SharedFile-icon"), function (el) {
        el.addEventListener("click", function (e) {
          var userId = e.target.id.slice(0, -3);
          console.log("userId: ", userId);
          _editUser(userId, function (d) {
            document.querySelector("#AddUserModalContent").style.display = "none";
            $u("#AddUserModalContent").removeClass("edit");
            document.querySelector(".container-overlay").style.display = "none";
            showAddUserForm("Edit User", d);
          });
        });
      });

      document.querySelector("#btn-EditSharedFileCancel").addEventListener("click", function (e) {
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

/////////////////////////////////////
// Delete Files & Folders selected
/////////////////////////////////////

function deleteSelected() {
  var _this2 = this;

  if (userData.RunMode === "DEBUG") console.log("aSelectedFolders: ", appData.aSelectedFolders.length);
  var modalDialogOptions = {
    cancel: true,
    cancelText: "Cancel",
    confirm: true,
    confirmText: "OK",
    width: "340px"
  };
  if (appData.aSelectedFolders.length > 0) {
    var result = 0;
    modalDialogOptions.confirmCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return deleteFolder(appData.currentPath);

            case 2:
              _context4.next = 4;
              return _deselectAllFolders();

            case 4:
              if (appData.aSelectedFiles.name.length > 0) {
                modalDialogOptions.confirmCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return deleteFile(appData.currentPath);

                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this2);
                }));
                modalDialogOptions.confirmText = "OK";
                (0, _modalDialog.modalDialog)("Delete Files", "Delete selected files?", modalDialogOptions);
              } else {
                document.getElementById("refresh").click();
              }

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, _this2);
    }));
    modalDialogOptions.cancelCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _deselectAllFolders();

            case 2:
              if (appData.aSelectedFiles.name.length > 0) {
                modalDialogOptions.confirmCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          _context5.next = 2;
                          return deleteFile(appData.currentPath);

                        case 2:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _callee5, _this2);
                }));
                modalDialogOptions.cancelCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          _context6.next = 2;
                          return _deselectAllFiles();

                        case 2:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this2);
                }));
                modalDialogOptions.confirmText = "OK";
                (0, _modalDialog.modalDialog)("Delete Files", "Delete selected files?", modalDialogOptions);
              }

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, _this2);
    }));
    modalDialogOptions.confirmText = "Yes, I'm very sure";
    (0, _modalDialog.modalDialog)("Delete Folders", "<div class=\"warning-lbl\">WARNING:</div>\n            <div class=\"warning-msg\">All selected folders and their contents will be deleted.!!</div>\n            <div class=\"msg\">Are you sure?</div>", modalDialogOptions);
  } else {
    if (appData.aSelectedFiles.name.length > 0) {
      modalDialogOptions.confirmCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return deleteFile(appData.currentPath);

              case 2:
                document.getElementById("refresh").click();

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, _this2);
      }));
      modalDialogOptions.cancelCallBack = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return _deselectAllFiles();

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, _this2);
      }));
      (0, _modalDialog.modalDialog)("Delete Files", "Delete selected files?", modalDialogOptions);
    }
  }
}

/////////////////////////////////////
// Add new Folder
/////////////////////////////////////

function newFolder(folderName) {
  var headers = new Headers();
  headers.append("Authorization", "Bearer " + userData.Token);
  headers.append("Content-Type", "application/json");
  fetch("/files/newfolder", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      path: (0, _general.getRealPath)(appData.currentPath),
      folderName: folderName
    }),
    timeout: 10000
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    if (userData.RunMode === "DEBUG") console.log(data);
    if (data.status == "OK") {
      $u("#modal").hide();
      $u("#lean-overlay").hide();
      $u("#refresh").trigger("click");
      showToast("New Folder", "Creada nueva carpeta " + data.data.folderName, "success");
    } else {
      showToast("Error", "Error al crear la carpeta " + folderName + " <br>Error: " + data.message, "error");
    }
  }).catch(function (err) {
    showToast("Error", "Error al crear la carpeta " + folderName + " <br>Error: error no identificado", "error");
    if (userData.RunMode === "DEBUG") console.log(err);
  });
}

/////////////////////////////////////
// Delete selected Files
/////////////////////////////////////

function deleteFile(path) {
  var headers = new Headers();
  var x = 0;
  var aF = appData.aSelectedFiles.name.slice();
  if (userData.RunMode === "DEBUG") console.log(aF);
  headers.append("Authorization", "Bearer " + userData.Token);
  headers.append("Content-Type", "application/json");
  $("#waiting").addClass("active");
  for (x = 0; x < aF.length; x++) {
    if (userData.RunMode === "DEBUG") console.log("Deleting file " + aF[x] + " ...");
    fetch("/files/delete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        path: (0, _general.getRealPath)(path),
        fileName: aF[x]
      }),
      timeout: 720000
    }).then(FetchHandleErrors).then(function (r) {
      return r.json();
    }).then(function (d) {
      if (userData.RunMode === "DEBUG") console.log(d);
      if (d.status == "OK") {
        appData.aSelectedFiles.name.shift();
        appData.aSelectedFiles.size.shift();
        showToast("Delete file", "Archivo " + d.data.fileName + " borrado", "success");
        $u("#refresh").trigger("click");
      }
    }).catch(function (err) {
      if (userData.RunMode === "DEBUG") console.log(err);
      showToast("Error", err, "error");
    });
  }
  $("#waiting").removeClass("active");
}

/////////////////////////////////////
// Delete selected Folders
/////////////////////////////////////

function deleteFolder(path) {
  var headers = new Headers();
  var x = 0;
  var aF = appData.aSelectedFolders.slice();
  if (userData.RunMode === "DEBUG") console.log(aF);
  headers.append("Authorization", "Bearer " + userData.Token);
  headers.append("Content-Type", "application/json");
  $("#waiting").addClass("active");
  for (x = 0; x < aF.length; x++) {
    if (userData.RunMode === "DEBUG") console.log("Deleting folder " + aF[x] + " ...");
    fetch("/files/delete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        path: (0, _general.getRealPath)(path),
        fileName: aF[x]
      }),
      timeout: 720000
    }).then(FetchHandleErrors).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (userData.RunMode === "DEBUG") console.log(data);
      if (data.status == "OK") {
        showToast("Delete Folder", "Carpeta " + data.data.fileName + " borrada", "success");
        appData.aSelectedFolders.shift();
        $("#waiting").removeClass("active");
        if (appData.aSelectedFiles.name.length === 0) {
          $u("#refresh").trigger("click");
        }
      }
    }).catch(function (err) {
      if (userData.RunMode === "DEBUG") console.log(err);
      $("#waiting").removeClass("active");
    });
  }
  $("#waiting").removeClass("active");
}

/////////////////////////////////////
// Upload Files
/////////////////////////////////////

function upload(Token) {
  var w = 32;
  var h = 440;
  var aListHandler = [];
  var handlerCounter = 0;
  var uploadFiles = [];

  var ModalTitle = "Upload Files";
  var ModalContent = "\n    <label id=\"label-upload-input\" class=\"btn-input waves-effect waves-teal btn2-unify\">\n      Select files\n      <input id=\"upload-input\" type=\"file\" name=\"uploads[]\" multiple=\"multiple\" class=\"modal-action modal-close\">\n    </label>\n    <span id=\"sFiles\" class=\"upload-input-message\">Ningun archivo seleccionado</span>";

  ModalContent += htmlUploadDownloadTemplate;
  var htmlContent = "\n    <div class=\"ModalDialog-alert\">\n      <div class=\"ModalDialog-mask\"></div>\n      <div class=\"ModalDialog-body download\">\n        <div class=\"ModalDialog-title\">\n          " + ModalTitle + "\n        </div>\n        <a class=\"modal_close\" id=\"modalClose\" href=\"#\"></a>\n        <div class=\"ModalDialog-container\">\n          <div class=\"files-progress-content\">\n            " + ModalContent + "\n          </div>\n        </div>      \n        <div class=\"ModalDialog-button\">\n              <!--<input type=\"text\" hidden id=\"destPath\" name=\"destPath\" value=\"\"/>-->\n              <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify disabled\" id=\"btnCancelAll\" href=\"#!\">Cancel uploads</a>  \n              <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"btnCloseUpload\" href=\"#!\">Close</a>\n        </div>\n      </div>\n    </div>";

  $u("#upload").removeClass("disabled");
  $u("#upload").addClass("disabled");

  function fnUploadFile(formData, nFile, fileName) {
    $u("#li" + nFile).show();
    $u("#li-filename" + nFile).show();
    $u("#li-filename" + nFile).html(fileName);
    var realpath = (0, _general.getRealPath)(appData.currentPath);
    if (userData.RunMode === "DEBUG") console.log("Upload:appData.currentPath " + appData.currentPath);
    if (userData.RunMode === "DEBUG") console.log("Upload:REAL_ROOT_PATH " + userData.REAL_ROOT_PATH);
    if (userData.RunMode === "DEBUG") console.log("Upload:realPath " + realpath);
    var CancelToken = _axios2.default.CancelToken;
    var progressBar = document.querySelector("#progress-bar" + nFile);
    var percentLabel = document.querySelector("#percent" + nFile);

    document.querySelector("#upload-input").disabled = true;

    _axios2.default.post("/files/upload?destPath=" + realpath, formData, {
      headers: {
        Authorization: "Bearer " + userData.Token,
        destPath: realpath
      },
      timeout: 290000,
      cancelToken: new CancelToken(function executor(c) {
        aListHandler[nFile] = c;
      }),
      onUploadProgress: function onUploadProgress(progressEvent) {
        var _this = this;
        //console.log("progressEvent: ", progressEvent);
        var percentComplete = 0;
        var evt = progressEvent;
        //aListHandler[nFile].upload.addEventListener(
        //  "progress",
        //  function(evt) {
        //console.log(fileName + " File size: ", evt.total);
        if (evt.total > userData.MaxFileSize) {
          showToast("Error", fileName + " excede del tama\xF1o soportado (" + userData.MaxFileSize + " Bytes)", "error");
          aListHandler[nFile]();
          _showAbortMessage(progressBar, "Aborted by server");
          percentLabel.style.display = "none";
          document.querySelector("#abort" + nFile).style.display = "none";

          handlerCounter = handlerCounter - 1;
          if (handlerCounter == 0) {
            document.querySelector("#btnCancelAll").classList.remove("disabled");
            document.querySelector("#btnCancelAll").classList.add("disabled");
          }
          //audit(userData.UserName,'UPLOAD',uploadFiles[nFile].fileName + ' [' + uploadFiles[nFile].fileSize + '] ->Upload canceled by Server','FAIL');
          console.log("AUDIT: " + userData.UserName + "UPLOAD" + uploadFiles[nFile].fileName + " [" + uploadFiles[nFile].fileSize + "] ->Upload canceled by Server,FAIL");
        } else {
          if (evt.lengthComputable) {
            if (progressBar.style.width !== "100%") {
              percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              percentLabel.innerHTML = percentComplete + "%";
              progressBar.style.width = percentComplete + "%";
            }
          }
        }
        //false
        //);
        return aListHandler[nFile];
      }
    }).then(function (data) {
      //let data = JSON.parse(d);
      if (userData.RunMode === "DEBUG") console.log("Upload successful!\n", data);
      if (userData.RunMode === "DEBUG") console.log("handlerCounter1: ", handlerCounter);

      if (data.data.status == "OK") {
        showToast("Upload", fileName + " uploaded sucessfully", "success");
        //audit(userData.UserName,'UPLOAD',uploadFiles[nFile].fileName + ' [' + uploadFiles[nFile].fileSize +']','OK');
        if (userData.RunMode === "DEBUG") console.log("ocultando abort", nFile);
        if (userData.RunMode === "DEBUG") console.log("AUDIT: " + userData.UserName + ",UPLOAD,", uploadFiles[nFile].fileName + " [" + uploadFiles[nFile].fileSize + "],OK");
        document.querySelector("#abort" + nFile).style.display = "none";
        $u("#refresh").trigger("click");
        handlerCounter = handlerCounter - 1;
        console.log("handlerCounter2: ", handlerCounter);
        if (handlerCounter == 0) {
          $u("#btnCancelAll").removeClass("disabled");
          $u("#btnCancelAll").addClass("disabled");
        }
      } else {
        if (data.data.status == "FAIL") {
          showToast("Error", "Error: " + data.data.message, "error");
          document.querySelector("#abort" + nFile).style.dsiplay = "none";
          //audit(userData.UserName,'UPLOAD',uploadFiles[nFile].fileName + ' [' + uploadFiles[nFile].fileSize + '] ->' + data.data.message,'FAIL');
          handlerCounter = handlerCounter - 1;
          if (handlerCounter == 0) {
            document.querySelector("#btnCancelAll").classList.remove("disabled");
            document.querySelector("#btnCancelAll").classList.add("disabled");
          }
        }
      }
    }).catch(function (e) {
      console.log("Upload Error:", e);
    });
  }

  var element = document.createElement("div");
  element.id = "ModalDialog-wrap";
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  document.querySelector("#upload-input").style.display = "block";

  document.querySelector("#btnCloseUpload").addEventListener("click", function (e) {
    e.preventDefault();
    var el = document.querySelector("#ModalDialog-wrap");
    el.parentNode.removeChild(el);
    document.querySelector("#upload").classList.remove("disabled");
  });

  document.querySelector("#modalClose").addEventListener("click", function (e) {
    e.preventDefault();
    var el = document.querySelector("#ModalDialog-wrap");
    el.parentNode.removeChild(el);
    document.querySelector("#upload").classList.remove("disabled");
  });

  [].forEach.call(document.querySelectorAll(".file-abort"), function (el) {
    document.querySelector("#" + el.id).addEventListener("click", function (e) {
      e.preventDefault();
      var n = parseInt(e.target.id.slice(-1));
      var percentLabel = document.querySelector("#percent" + n);
      var progressBar = document.querySelector("#progress-bar" + n);
      aListHandler[n]();
      _showAbortMessage(progressBar, "Canceled by user");
      percentLabel.style.display = "none";
      document.querySelector("#abort" + n).style.display = "none";
      handlerCounter = handlerCounter - 1;
      console.log("handlerCounter: ", handlerCounter);
      if (handlerCounter == 0) {
        document.querySelector("#btnCancelAll").classList.remove("disabled");
        document.querySelector("#btnCancelAll").classList.add("disabled");
      }
      //audit(userData.UserName,'UPLOAD',uploadFiles[n].fileName + ' [' + uploadFiles[n].fileSize + '] ->Upload canceled by User','FAIL');
      console.log("AUDIT: " + userData.UserName + "UPLOAD" + uploadFiles[n].fileName + " [" + uploadFiles[n].fileSize + "] ->Upload canceled by User,FAIL");
    });
  });

  document.querySelector("#btnCancelAll").addEventListener("click", function (e) {
    e.preventDefault();
    for (var x = 0; x < 5; x++) {
      var percentLabel = document.querySelector("#percent" + x);
      var progressBar = document.querySelector("#progress-bar" + x);
      if (aListHandler[x]) {
        aListHandler[x]();
        _showAbortMessage(progressBar, "Canceled by User");
        percentLabel.style.display = "none";

        document.querySelector("#abort" + x).style.display = "none";
        //audit(userData.UserName,'UPLOAD',uploadFiles[x].fileName + ' [' + uploadFiles[x].fileSize + '] ->Upload canceled by User','FAIL');
        console.log("AUDIT: " + userData.UserName + "UPLOAD" + uploadFiles[x].fileName + " [" + uploadFiles[x].fileSize + "] ->Upload canceled by User,FAIL");
      }
    }
    handlerCounter = 0;
    document.querySelector("#btnCancelAll").classList.remove("disabled");
    document.querySelector("#btnCancelAll").classList.add("disabled");
  });

  document.querySelector("#upload-input").addEventListener("change", function (e) {
    e.preventDefault();
    var files = document.querySelector("#upload-input").files;
    handlerCounter = files.length;
    var htmlText = files.length > 0 ? '<a href="#" id="selectedFiles">' : "";
    htmlText += files.length > 0 ? files.length + " archivos seleccionados." : files[0];
    htmlText += files.length > 0 ? "</a>" : "";

    if (document.querySelector("#selectedFiles")) {
      document.querySelector("#selectedFiles").addEventListener("click", function (e) {
        e.preventDefault();
        $u("#sFiles").removeClass("select");
        document.querySelector("#label-upload-input").classList.remove("disabled");
        document.querySelector("#label-upload-input").onclick();
      });
    }

    /*  if(files.lenght > 0) {
           $u("#sFiles").addClass('select');
           document.querySelector("#label-upload-input").classList.add("disabled");
           document.querySelector("#btnCancelAll").classList.remove("disabled");
         } else {
           $u("#sFiles").removeClass('select');
           document.querySelector("#label-upload-input").classList.remove("disabled");
           document.querySelector("#btnCancelAll").classList.add("disabled");
         }   */

    document.querySelector("#sFiles").innerHTML = htmlText;

    if (userData.RunMode === "DEBUG") console.log(files.length);
    if (files.length > 0 && files.length <= 5) {
      document.querySelector("#btnCloseUpload").classList.remove("disabled");
      document.querySelector("#btnCloseUpload").classList.add("disabled");
      document.querySelector("#btnCancelAll").classList.remove("disabled");

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var formData = new FormData();
        // add the files to formData object for the data payload
        /* if(file.size > 1000) {
                  showToast(
                    "Error",
                    "El tamaño de archivo excede del límite",
                    "error"
                  );
                } */
        formData.append("uploads[]", file, file.name);
        uploadFiles.push({
          fileName: file.name,
          fileSize: file.size
        });
        fnUploadFile(formData, i, file.name);
      }
      $("#btnCloseUpload").removeClass("disabled");
    } else {
      showToast("Error", "No se pueden subir más de 5 archivos a la vez", "error");
    }
  });
}

/////////////////////////////////////
// Download selected Files
/////////////////////////////////////

function download(fileList, text) {
  var reqList = [],
      handlerCounter = 0,
      responseTimeout = [];
  var w = 32;
  var h = 440;
  var ModalTitle = "Download selected files";
  var ModalContent = htmlUploadDownloadTemplate;
  var htmlContent = "\n    <div class=\"ModalDialog-alert\">\n      <div class=\"ModalDialog-mask\"></div>\n      <div class=\"ModalDialog-body download\">\n        <div class=\"ModalDialog-title\">\n          " + ModalTitle + "\n        </div>\n        <a class=\"modal_close\" id=\"modalClose\" href=\"#\"></a>\n        <div class=\"ModalDialog-container\">\n          <div class=\"files-progress-content\">\n            " + ModalContent + "\n          </div>\n        </div>      \n        <div class=\"ModalDialog-button\">\n              <!--<input type=\"text\" hidden id=\"destPath\" name=\"destPath\" value=\"\"/>-->\n              <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify disabled\" id=\"btnCancelAll\" href=\"#!\">Cancel Downloads</a>  \n              <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"btnCloseDownload\" href=\"#!\">Close</a>\n        </div>\n      </div>\n    </div>";

  var element = document.createElement("div");
  element.id = "ModalDialog-wrap";
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  var _closeModal = function _closeModal() {
    var el = document.querySelector("#ModalDialog-wrap");
    el.parentNode.removeChild(el);
    document.querySelector("#download").classList.remove("disabled");
    _deselectAllFiles();
  };

  document.querySelector("#btnCloseDownload").addEventListener("click", function (e) {
    e.preventDefault();
    _closeModal();
  });

  document.querySelector("#modalClose").addEventListener("click", function (e) {
    e.preventDefault();
    _closeModal();
  });

  document.querySelector("#btnCancelAll").classList.add("disabled");
  document.querySelector("#download").classList.add("disabled");
  document.querySelector("#waiting").classList.add("active");

  document.querySelector("#btnCancelAll").addEventListener("click", function (e) {
    for (var x = 0; x < reqList.length; x++) {
      if (reqList[x]) {
        reqList[x].abort();
        var percentLabel = document.querySelector("#percent" + x);
        var progressBar = document.querySelector("#progress-bar" + x);
        _showAbortMessage(progressBar, "Canceled by user");
        percentLabel.innerHTML = "";
        //audit(userData.UserName,'DOWNLOAD',fileList[x] + ' ->Download canceled by User','FAIL');
        console.log("AUDIT: " + userData.UserName + "DOWNLOAD" + fileList.name[x] + " ->Upload canceled by User,FAIL");
      }
    }
    document.querySelector("#btnCancelAll").classList.add("disabled");
  });

  [].forEach.call(document.querySelectorAll(".file-abort"), function (el) {
    document.querySelector("#" + el.id).addEventListener("click", function (e) {
      e.preventDefault();
      var n = parseInt(e.target.id.slice(-1));
      reqList[n].abort();
      var percentLabel = document.querySelector("#percent" + n);
      var progressBar = document.querySelector("#progress-bar" + n);
      _showAbortMessage(progressBar, "Canceled by user");
      percentLabel.innerHTML = "";
      document.querySelector("#abort" + n).style.display = "none";
      handlerCounter = handlerCounter - 1;
      if (handlerCounter == 0) {
        document.querySelector("#btnCancelAll").classList.remove("disabled");
        document.querySelector("#btnCancelAll").classList.add("disabled");
      }
      document.querySelector("#upload").classList.remove("disabled");
      //audit(userData.UserName,'DOWNLOAD',fileList[n] + ' ->Download canceled by User','FAIL');
      console.log("AUDIT: " + userData.UserName + "DOWNLOAD" + fileList.name[n] + " ->Upload canceled by User,FAIL");
    });
  });

  var _Download_Loop = function _Download_Loop(i) {
    var fName = fileList.name[i];
    var fSize = fileList.size[i];
    var liNumber = document.querySelector("#li" + i);
    var liFilename = document.querySelector("#li-filename" + i);
    var progressBar = document.querySelector("#progress-bar" + i);
    var percentLabel = document.querySelector("#percent" + i);
    responseTimeout[i] = false;
    fName = fName.split("\\").pop().split("/").pop();
    reqList[i] = new XMLHttpRequest();
    reqList[i].open("POST", "/files/download", true);
    reqList[i].responseType = "arraybuffer";
    liNumber.style.display = "block";
    liFilename.innerHTML = fName;
    reqList[i].timeout = 36000;
    reqList[i].ontimeout = function () {
      // Download Timeout
      if (userData.RunMode === "DEBUG") console.log("** Timeout error ->File:" + fName + " " + reqList[i].status + " " + reqList[i].statusText);
      // handlerCount = handlerCount - 1
      _showAbortMessage(progressBar, "Timeout Error");
      progressBar.classList.add("blink");
      responseTimeout[i] = true;
    };
    reqList[i].onprogress = function (evt) {
      // Download progress
      if (evt.lengthComputable) {
        var percentComplete = parseInt(evt.loaded / evt.total * 100);
        progressBar.style.width = percentComplete + "%";
        percentLabel.innerHTML = percentComplete + "%";
      }
    };
    reqList[i].onabort = function () {
      // Download abort
      showToast("Download File", "Descarga de archivo " + fName + " cancelada", "warning");
    };
    reqList[i].onerror = function () {
      // Download error
      if (userData.RunMode === "DEBUG") console.log("** An error occurred during the transaction ->File:" + fName + " " + req.status + " " + req.statusText);
      handlerCounter = handlerCounter - 1;
      percentLabel.innerHTML = "Error";
      percentLabel.style.color = "red";
      document.querySelector("#abort" + i).style.display = "none";
      showToast("Download File", "Error al descargar archivo " + fName + " " + req.statusText, "error");
    };
    reqList[i].onloadend = function (e) {
      // Download End
      console.log("File n:" + i + " ->", reqList[i].readyState);
      handlerCounter = handlerCounter - 1;
      if (!responseTimeout[i]) {
        progressBar.style.width = "100%";
        percentLabel.innerHTML = "100%";
        document.querySelector("#abort" + i).style.display = "none";
      }
      if (handlerCounter === 0) {
        document.querySelector("#btnCancelAll").classList.add("disabled");
      }
    };
    reqList[i].onloadstart = function () {
      handlerCounter = handlerCounter + 1;
      progressBar.style.width = "0";
      percentLabel.innerHTML = "0%";
    };
    reqList[i].onload = function () {
      if (reqList[i].readyState === 4 && reqList[i].status === 200) {
        showToast("Download File", "Archivo " + fName + " descargado", "success");
        var filename = "";
        var disposition = reqList[i].getResponseHeader("Content-Disposition");
        if (disposition && disposition.indexOf("attachment") !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, "");
        }
        var type = reqList[i].getResponseHeader("Content-Type");
        var blob = new Blob([this.response], {
          type: type
        });
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === "undefined") {
              window.location = downloadUrl;
              preloader.style.display = "none";
            } else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }
          } else {
            window.open = downloadUrl;
          }

          setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
          }, 100); // cleanup
        }
      }
    };
    reqList[i].setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (userData.RunMode === "DEBUG") console.log((0, _general.getRealPath)(appData.currentPath) + "/" + fileList.name[i]);
    reqList[i].send((0, _general.serializeObject)({
      filename: (0, _general.getRealPath)(appData.currentPath) + "/" + fileList.name[i]
    }));
  };

  document.querySelector("#btnCancelAll").classList.remove("disabled");
  for (var i = 0; i < fileList.name.length; i++) {
    _Download_Loop(i);
  }
  document.querySelector("#waiting").classList.remove("active");
}

///////////////////////////////////
// End Files and Folders module
/////////////////////////////////

},{"../vendor/dataTables":3,"../vendor/modalDialog":4,"./general":2,"axios":5,"moment":31,"uuid/v4":35}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRealPath = getRealPath;
exports.serializeObject = serializeObject;
function getRealPath(p) {
  var rPath = "";

  if (userData.RunMode === "DEBUG") console.log("getRealPath:p ", p);
  if (userData.RunMode === "DEBUG") console.log("getRealPath:userData.RealRootPath ", userData.RealRootPath);
  if (p == "/" && (userData.RealRootPath === "/" || userData.RealRootPath === "")) {
    rPath = p;
  } else {
    if (p == "/") {
      rPath = "/" + userData.RealRootPath;
    } else {
      if (userData.RealRootPath !== '/') {
        rPath = "/" + userData.RealRootPath + p;
      } else {
        if (p.indexOf('/') !== 0) {
          rPath = userData.RealRootPath + p;
        } else {
          rPath = p;
        }
      }
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"../core/createError":13,"./../core/settle":16,"./../helpers/btoa":20,"./../helpers/buildURL":21,"./../helpers/cookies":23,"./../helpers/isURLSameOrigin":25,"./../helpers/parseHeaders":27,"./../utils":29,"_process":32}],7:[function(require,module,exports){
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

},{"./adapters/http":6,"./adapters/xhr":6,"./helpers/normalizeHeaderName":26,"./utils":29,"_process":32}],19:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;

},{}],34:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],35:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":33,"./lib/rng":34}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbGVNYW5hZ2VyLmpzIiwianMvbW9kdWxlcy9nZW5lcmFsLmpzIiwianMvdmVuZG9yL2RhdGFUYWJsZXMuanMiLCJqcy92ZW5kb3IvbW9kYWxEaWFsb2cuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J0b2EuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwibm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIm5vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2xpYi9ieXRlc1RvVXVpZC5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL3Y0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7UUNrTWdCLFMsR0FBQSxTO1FBNktBLGUsR0FBQSxlO1FBaUlBLGMsR0FBQSxjO1FBd0VBLFMsR0FBQSxTO1FBb0RBLFUsR0FBQSxVO1FBK0NBLFksR0FBQSxZO1FBaURBLE0sR0FBQSxNO1FBOFRBLFEsR0FBQSxROztBQXpnQ2hCOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7QUFFQTs7OztBQUNBOzs7Ozs7MmNBUkE7OztBQVVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLHcvQ0FBSjs7QUFxQ0EsSUFBSSx1NEJBQUo7O0FBNEJBLElBQUksK29GQUFKOztBQWdFQSxJQUFNLFVBQVUsU0FBVixPQUFVLEdBQU07QUFDcEIsTUFBSSxNQUFN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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzE1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIGpzaGludCBsYXhicmVhazogdHJ1ZSAqL1xyXG5pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5pbXBvcnQgeyBnZXRSZWFsUGF0aCwgc2VyaWFsaXplT2JqZWN0IH0gZnJvbSBcIi4vZ2VuZXJhbFwiO1xyXG5cclxuaW1wb3J0IHsgbW9kYWxEaWFsb2cgfSBmcm9tIFwiLi4vdmVuZG9yL21vZGFsRGlhbG9nXCI7XHJcblxyXG5pbXBvcnQgdXVpZHY0IGZyb20gXCJ1dWlkL3Y0XCI7XHJcbmltcG9ydCBEYXRhVGFibGUgZnJvbSBcIi4uL3ZlbmRvci9kYXRhVGFibGVzXCI7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRmlsZXMgYW5kIEZvbGRlciBtb2R1bGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmxldCBodG1sU2hhcmVGaWxlID0gYFxyXG48ZGl2IGlkPVwic2hhcmVGaWxlTW9kYWxcIj5cclxuICA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICA8aDU+U2hhcmUgRmlsZTwvaDU+XHJcbiAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJzaGFyZWRNb2RhbENsb3NlXCIgaHJlZj1cIiNob2xhXCI+PC9hPlxyXG4gIDwvZGl2PlxyXG4gIDxicj5cclxuICA8ZGl2IGNsYXNzPVwidXNlckZvcm0tcm93XCIgaWQ9XCJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczEgbTFcIj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzNVwiPlxyXG4gICAgICBcclxuICAgICAgPGlucHV0IGlkPVwiZGVzdFVzZXJOYW1lXCIgdHlwZT1cImVtYWlsXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgcGF0dGVybj1cIi4rQGdsb2JleC5jb21cIiBjbGFzcz1cInVzZXJGb3JtLWlucHV0XCIgcmVxdWlyZWQvPlxyXG4gICAgICA8bGFiZWwgZm9yPVwiZGVzdFVzZXJOYW1lXCI+U2VuZCBVUkwgdG88L2xhYmVsPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMzIG0zXCI+XHJcbiAgICAgICAgPGlucHV0IGNsYXNzPVwiZGF0ZXBpY2tlclwiIGlkPVwiRmlsZUV4cGlyYXRlRGF0ZVwiIHR5cGU9XCJkYXRlXCIgY2xhc3M9XCJ1c2VyRm9ybS1pbnB1dFwiLz5cclxuICAgICAgICA8bGFiZWwgZm9yPVwiRmlsZUV4cGlyYXRlRGF0ZVwiPkV4cGlyYXRpb24gRGF0ZTwvbGFiZWw+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczMgbTNcIj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PiAgXHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPiBcclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczkgbTlcIj5cclxuICAgICAgPGlucHV0IGNsYXNzPVwiY2hlY2tcIiBpZD1cImRlbEZpbGVBZnRlckV4cGlyZWRcIiB0eXBlPVwiY2hlY2tib3hcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3hcIiBmb3I9XCJkZWxGaWxlQWZ0ZXJFeHBpcmVkXCI+PC9sYWJlbD4gXHJcbiAgICAgIDxzcGFuPkRlbGV0ZSBmaWxlIHdoZW4gZXhwaXJlczwvc3Bhbj4gIFxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxIG0xXCI+XHJcbiAgICAgIDxidXR0b24gY2xhc3M9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5IHJpZ2h0XCIgaWQ9XCJidG4tU2hhcmVGaWxlQ2FuY2VsXCIgdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhY3Rpb25cIj5DYW5jZWw8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMSBtMVwiPiAgXHJcbiAgICAgIDxidXR0b24gY2xhc3M9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5IGxlZnRcIiBpZD1cImJ0bi1TaGFyZUZpbGVBY2NlcHRcIiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImFjdGlvblwiPlNlbmQ8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PiAgICBcclxuPC9kaXY+YDtcclxuXHJcbmxldCBodG1sU2VhcmNoU2hhcmVkRmlsZXNUZW1wbGF0ZSA9IGBcclxuPGRpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImhlYWQtVGl0bGVcIj5FZGl0IFNoYXJlZCBGaWxlczwvZGl2PiBcclxuICAgICAgPHRhYmxlIGlkPVwiU2hhcmVkRmlsZXNUYWJsZUxpc3RcIiBjbGFzcz1cInRhYmxlTGlzdFwiPlxyXG4gICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgPHRoPklkPC90aD5cclxuICAgICAgICAgICAgPHRoPlVzZXI8L3RoPlxyXG4gICAgICAgICAgICA8dGg+RGVzdCBVc2VyIE5hbWU8L3RoPlxyXG4gICAgICAgICAgICA8dGg+RmlsZSBOYW1lPC90aD5cclxuICAgICAgICAgICAgPHRoPlN0YXRlPC90aD5cclxuICAgICAgICAgICAgPHRoIGRhdGEtdHlwZT1cImRhdGVcIiBkYXRhLWZvcm1hdD1cIllZWVkvTU0vRERcIj5FeHBpcmF0ZSBEYXRlPC90aD5cclxuICAgICAgICAgICAgPHRoPkRlbGV0ZTwvZGl2PlxyXG4gICAgICAgICAgICA8dGg+R3JvdXAgSWQ8L3RoPlxyXG4gICAgICAgICAgICA8dGg+PC90aD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHkgaWQ9XCJib2R5TGlzdFwiPiAgICBcclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiQWRkVXNlck1vZGFsQ29udGVudC1mb290ZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwid2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuLUVkaXRTaGFyZWRGaWxlQ2FuY2VsXCIgdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhY3Rpb25cIj5DbG9zZTwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PiBcclxuICAgICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubGV0IGh0bWxVcGxvYWREb3dubG9hZFRlbXBsYXRlID0gYFxyXG48dWwgY2xhc3M9XCJwcmVsb2FkZXItZmlsZVwiIGlkPVwiRG93bmxvYWRmaWxlTGlzdFwiPlxyXG4gICAgPGxpIGlkPVwibGkwXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTBcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjBcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MFwiPjwvZGl2PiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFib3J0LXRhc2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJmaWxlLWFib3J0XCIgaWQ9XCJhYm9ydDBcIiBocmVmPVwiI1wiIHRpdGxlPVwiQ2FuY2VsIGZpbGUgZG93bmxvYWRcIj48L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9saT5cclxuICAgIDxsaSBpZD1cImxpMVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUxXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIxXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDFcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhYm9ydC10YXNrXCI+XHJcbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJmaWxlLWFib3J0XCIgaWQ9XCJhYm9ydDFcIiBocmVmPVwiI1wiIHRpdGxlPVwiQ2FuY2VsIGZpbGUgZG93bmxvYWRcIj48L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PiBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvbGk+XHJcbiAgICA8bGkgaWQ9XCJsaTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMlwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhYm9ydC10YXNrXCI+XHJcbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJmaWxlLWFib3J0XCIgaWQ9XCJhYm9ydDJcIiBocmVmPVwiI1wiIHRpdGxlPVwiQ2FuY2VsIGZpbGUgZG93bmxvYWRcIj48L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PiBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvbGk+XHJcbiAgICA8bGkgaWQ9XCJsaTNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lM1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyM1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWJvcnQtdGFza1wiPlxyXG4gICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImZpbGUtYWJvcnRcIiBpZD1cImFib3J0M1wiIGhyZWY9XCIjXCIgdGl0bGU9XCJDYW5jZWwgZmlsZSBkb3dubG9hZFwiPjwvYT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PiAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9saT5cclxuICAgIDxsaSBpZD1cImxpNFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWU0XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXI0XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDRcIj48L2Rpdj4gIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFib3J0LXRhc2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJmaWxlLWFib3J0XCIgaWQ9XCJhYm9ydDRcIiBocmVmPVwiI1wiIHRpdGxlPVwiQ2FuY2VsIGZpbGUgZG93bmxvYWRcIj48L2E+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj4gXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2xpPlxyXG48L3VsPmA7XHJcblxyXG5jb25zdCBfZ2V0VUlEID0gKCkgPT4ge1xyXG4gIGxldCB1aWQgPSB1dWlkdjQoKTtcclxuICByZXR1cm4gdWlkLnJlcGxhY2UoLy0vZywgXCJcIik7XHJcbn07XHJcblxyXG5jb25zdCBzZW5kRW1haWwgPSAodG9FbWFpbCwgZnJvbUVtYWlsLCBzdWJqZWN0LCBib2R5X21lc3NhZ2UpID0+IHtcclxuICBsZXQgbWFpbHRvX2xpbmsgPVxyXG4gICAgXCJtYWlsdG86XCIgKyB0b0VtYWlsICsgXCI/c3ViamVjdD1cIiArIHN1YmplY3QgKyBcIiZib2R5PVwiICsgYm9keV9tZXNzYWdlO1xyXG4gIGxldCB3aW4gPSB3aW5kb3cub3BlbihtYWlsdG9fbGluaywgXCJlbWFpbFdpbmRvd1wiKTtcclxuICBpZiAod2luICYmIHdpbmRvdy5vcGVuICYmICF3aW5kb3cuY2xvc2VkKSB3aW5kb3cuY2xvc2UoKTtcclxufTtcclxuXHJcbmNvbnN0IF9zaG93QWJvcnRNZXNzYWdlID0gKGVsLCBtc2cpID0+IHtcclxuICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgZWwuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xyXG4gIGVsLmlubmVySFRNTCA9IG1zZztcclxuICBlbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG59O1xyXG5cclxuY29uc3QgX2Rlc2VsZWN0QWxsRm9sZGVycyA9ICgpID0+IHtcclxuICBsZXQgYWxsRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRhc2hib2FyZC1wYXRoXCIpO1xyXG4gIGFsbEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24odiwgaSkge1xyXG4gICAgaWYgKHYuY2hpbGRyZW5bMF0uY2hlY2tlZCkge1xyXG4gICAgICB2LmNoaWxkcmVuWzBdLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9KTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQgPSBmYWxzZTtcclxuICBhcHBEYXRhLmFTZWxlY3RlZEZvbGRlcnMgPSBbXTtcclxufTtcclxuXHJcbmNvbnN0IF9kZXNlbGVjdEFsbEZpbGVzID0gKCkgPT4ge1xyXG4gIGxldCBhbGxFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudHlwZUZpbGVcIik7XHJcbiAgLyogW10uY2FsbC5mb3JFYWNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudHlwZUZpbGVcIiksIGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIGlmIChlbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGVja2VkKSB7XHJcbiAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9KTsgKi9cclxuICBhbGxFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGkpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gIH0pO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIikuY2hlY2tlZCA9IGZhbHNlO1xyXG4gIGFwcERhdGEuYVNlbGVjdGVkRmlsZXMubmFtZSA9IFtdO1xyXG4gIGFwcERhdGEuYVNlbGVjdGVkRmlsZXMuc2l6ZSA9IFtdO1xyXG59O1xyXG5cclxubGV0IHZhbGlkYXRlU2l6ZSA9IGYgPT4ge1xyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlRmlsZSgpIHtcclxuICBsZXQgc2VhcmNoVXNlck1vZGFsQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzZWFyY2hVc2VyTW9kYWxDb250ZW50XCJcclxuICApO1xyXG4gIGxldCBBZGRVc2VyTW9kYWxDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJBZGRVc2VyTW9kYWxDb250ZW50XCIpO1xyXG4gIGxldCBjb250YWluZXJPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXItb3ZlcmxheVwiKTtcclxuICBsZXQgdmFsaWRhdGlvbnMgPSB7XHJcbiAgICBlbWFpbDogW1xyXG4gICAgICAvXihbYS16QS1aMC05Xy4rLV0pK1xcQCgoW2EtekEtWjAtOS1dKStcXC4pKyhbYS16QS1aMC05XXsyLDR9KSskLyxcclxuICAgICAgXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzXCJcclxuICAgIF1cclxuICB9O1xyXG5cclxuICBjb25zdCBfc2hhcmVGaWxlID0gZCA9PiB7XHJcbiAgICBsZXQgdG1wRGF0ZSA9IG5ldyBEYXRlKGQuRmlsZUV4cGlyYXRlRGF0ZSk7XHJcbiAgICBsZXQgc3RyVGltZSA9IFwiXCI7XHJcbiAgICBsZXQgZ3JvdXBJRCA9IG51bGw7XHJcbiAgICBsZXQgZGF0YSA9IHt9O1xyXG4gICAgaWYgKGQuRmlsZUV4cGlyYXRlRGF0ZSA9PT0gXCJcIikge1xyXG4gICAgICBzdHJUaW1lID0gbW9tZW50KERhdGUubm93KCkpLmZvcm1hdChcIllZWVkvTU0vREQgSEg6bW06c3NcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdHJUaW1lID0gbW9tZW50KGQuRmlsZUV4cGlyYXRlRGF0ZSkuZm9ybWF0KFwiWVlZWS9NTS9ERCBISDptbTpzc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZC5kZXN0VXNlck5hbWUgIT09IFwiXCIpIHtcclxuICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZC5kZXN0VXNlck5hbWUpO1xyXG4gICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmlsZUV4cGlyYXRlRGF0ZTogXCIsIGQuRmlsZUV4cGlyYXRlRGF0ZSk7XHJcbiAgICAgIGlmIChhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLm5hbWUubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGdyb3VwSUQgPSBfZ2V0VUlEKCk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IG5GaWxlcyA9IGFwcERhdGEuYVNlbGVjdGVkRmlsZXMubmFtZS5sZW5ndGg7XHJcbiAgICAgIGxldCBmaWxlTGlzdCA9IFwiXCI7XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbkZpbGVzOyB4KyspIHtcclxuICAgICAgICBmaWxlTGlzdCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgLSAke2FwcERhdGEuYVNlbGVjdGVkRmlsZXMubmFtZVt4XX0gICR7YXBwRGF0YS5hU2VsZWN0ZWRGaWxlcy5zaXplW3hdfWA7ICBcclxuICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgZmlsZU5hbWU6IGFwcERhdGEuYVNlbGVjdGVkRmlsZXMubmFtZVt4XSxcclxuICAgICAgICAgIGZpbGVTaXplOiBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLnNpemVbeF0sXHJcbiAgICAgICAgICBwYXRoOiBhcHBEYXRhLmN1cnJlbnRQYXRoLFxyXG4gICAgICAgICAgdXNlck5hbWU6IHVzZXJEYXRhLlVzZXJOYW1lLFxyXG4gICAgICAgICAgZGVzdFVzZXJOYW1lOiBkLmRlc3RVc2VyTmFtZSxcclxuICAgICAgICAgIGV4cGlyYXRpb25EYXRlOiBzdHJUaW1lLFxyXG4gICAgICAgICAgdW5peERhdGU6IG1vbWVudChzdHJUaW1lKS5mb3JtYXQoXCJ4XCIpLFxyXG4gICAgICAgICAgZGVsZXRlRXhwaXJlZEZpbGU6IGQuZGVsRmlsZUFmdGVyRXhwaXJlZCA/IDEgOiAwLFxyXG4gICAgICAgICAgZ3JvdXBJRDogZ3JvdXBJRFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIilcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiX3NoYXJlRmlsZS5kYXRhOiBcIiwgZGF0YSk7XHJcbiAgICAgICAgYXhpb3NcclxuICAgICAgICAgIC5wb3N0KFwiL2ZpbGVzL3NoYXJlXCIsIGRhdGEsIHtcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IFwiQmVhcmVyIFwiICsgdXNlckRhdGEuVG9rZW5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGltZW91dDogMzAwMDBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihkID0+IHtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZC5kYXRhKTtcclxuICAgICAgICAgICAgaWYgKGQuZGF0YS5zdGF0dXMgPT09IFwiT0tcIikge1xyXG4gICAgICAgICAgICAgIC8vY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgICAgaWYgKG5GaWxlcyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXJsRmlsZVwiKS5pbm5lckhUTUwgPSBgaHR0cHM6Ly9maWxlYm94LnVuaWZ5c3BhaW4uZXMvZmlsZXMvc2hhcmUvJHtkLmRhdGEuZGF0YS5VcmxDb2RlfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVtYWlsQm9keSA9IGVuY29kZVVSSUNvbXBvbmVudCgnRWwgdXN1YXJpbyAnKyB1c2VyRGF0YS5Vc2VyTmFtZS50b1VwcGVyQ2FzZSgpICsnIGhhIGNvbXBhcnRpZG8gZWwgYXJjaGl2byAnKyBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLm5hbWVbeF0gKyAnICcgKyBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLnNpemVbeF0gKydcXHJcXG5cXHJcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAncHVlZGUgZGVzY2FyZ2FybG8gZGVsIGxpbms6IGh0dHBzOi8vZmlsZWJveC51bmlmeXNwYWluLmVzL2ZpbGVzL3NoYXJlLycrIGQuZGF0YS5kYXRhLlVybENvZGUpIDtcclxuICAgICAgICAgICAgICAgICAgICBzZW5kRW1haWwoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuZGF0YS5kYXRhLkRlc3RVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZpbGVtYW5hZ2VyQGZpbGVib3gudW5pZnlzcGFpbi5lc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlVSTCBwYXJhIGRlc2NhcmdhIGRlIGFyY2hpdm9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxCb2R5XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLm5hbWUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLnNpemUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZvbGRlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZnJlc2hcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJNb2RhbERpYWxvZy1idXR0b24tY2FuY2VsXCIpLmlubmVySFRNTCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiT0tcIjtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneDonLHgpO1xyXG4gICAgICAgICAgICAgICAgICBpZiggeCA9PT0gbkZpbGVzIC0xICkgeyBcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3VybEZpbGVcIikuaW5uZXJIVE1MID0gYGh0dHBzOi8vZmlsZWJveC51bmlmeXNwYWluLmVzL2ZpbGVzL3NoYXJlLyR7Z3JvdXBJRH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbWFpbEJvZHkgPSBlbmNvZGVVUklDb21wb25lbnQoJ0VsIHVzdWFyaW8gJysgdXNlckRhdGEuVXNlck5hbWUudG9VcHBlckNhc2UoKSArJyBoYSBjb21wYXJ0aWRvIGxvcyBhcmNoaXZvczogXFxyXFxuJysgZmlsZUxpc3QgKyAnXFxyXFxuXFxyXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJ3B1ZWRlIGRlc2NhcmdhcmxvcyBkZWwgbGluazogaHR0cHM6Ly9maWxlYm94LnVuaWZ5c3BhaW4uZXMvZmlsZXMvc2hhcmUvJysgZ3JvdXBJRCkgO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbmRFbWFpbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZC5kYXRhLmRhdGEuRGVzdFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlsZW1hbmFnZXJAZmlsZWJveC51bmlmeXNwYWluLmVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiVVJMIHBhcmEgZGVzY2FyZ2EgZGUgYXJjaGl2b3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxCb2R5XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLm5hbWUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLnNpemUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZvbGRlcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZnJlc2hcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJNb2RhbERpYWxvZy1idXR0b24tY2FuY2VsXCIpLmlubmVySFRNTCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiT0tcIjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcbiAgICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICAgICAgICAgICAgX2Rlc2VsZWN0QWxsRmlsZXMoKTtcclxuICAgICAgICAgICAgICBfZGVzZWxlY3RBbGxGb2xkZXJzKCk7XHJcbiAgICAgICAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgICAgICAgXCJTaGFyZSBmaWxlc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJFcnJvciBhbCBjb21wYXJ0aXIgYXJjaGl2byBcIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZmlsZU5hbWUgK1xyXG4gICAgICAgICAgICAgICAgICBcIi48YnI+RXJyOlwiICtcclxuICAgICAgICAgICAgICAgICAgZC5kYXRhLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBfZGVzZWxlY3RBbGxGaWxlcygpO1xyXG4gICAgICAgICAgICBfZGVzZWxlY3RBbGxGb2xkZXJzKCk7XHJcbiAgICAgICAgICAgIHNob3dUb2FzdChcclxuICAgICAgICAgICAgICBcIlNoYXJlIGZpbGVzXCIsXHJcbiAgICAgICAgICAgICAgXCJFcnJvciBhbCBjb21wYXJ0aXIgYXJjaGl2byBcIiArIGRhdGEuZmlsZU5hbWUgKyBcIi48YnI+RXJyOlwiICsgZSxcclxuICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGxldCBtb2RhbERpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICBjYW5jZWw6IHRydWUsXHJcbiAgICBjYW5jZWxUZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgY29uZmlybTogdHJ1ZSxcclxuICAgIGNvbmZpcm1UZXh0OiBcIlNoYXJlXCIsXHJcbiAgICB0eXBlOiBcInNoYXJlRmlsZVwiXHJcbiAgfTtcclxuXHJcbiAgbW9kYWxEaWFsb2dPcHRpb25zLmNvbmZpcm1DYWxsQmFjayA9IGFzeW5jIGZ1bmN0aW9uKGUsIGRhdGEpIHtcclxuICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwic2hhcmVGaWxlOiBcIiwgZGF0YSk7XHJcbiAgICBpZiAoZGF0YSB8fCBkYXRhLmRlc3RVc2VyTmFtZS50cmltKCkgIT09IFwiXCIpIHtcclxuICAgICAgX3NoYXJlRmlsZShkYXRhKTtcclxuICAgIH1cclxuICB9O1xyXG4gIG1vZGFsRGlhbG9nT3B0aW9ucy5jYW5jZWxDYWxsQmFjayA9IGFzeW5jIGZ1bmN0aW9uKGUsIGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gIH07XHJcbiAgbW9kYWxEaWFsb2coXHJcbiAgICBcIlNoYXJlIEZpbGVcIixcclxuICAgIGAgICAgICA8aW5wdXQgaWQ9XCJkZXN0VXNlck5hbWVcIiB0eXBlPVwiZW1haWxcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBwYXR0ZXJuPVwiLitAZ2xvYmV4LmNvbVwiIHJlcXVpcmVkIGNsYXNzPVwiTW9kYWxEaWFsb2ctaW5wdXRcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImRlc3RVc2VyTmFtZVwiIGNsYXNzPVwiTW9kYWxEaWFsb2ctbGFiZWwgc2hhcmVcIj5TZW5kIFVSTCB0bzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZGF0ZXBpY2tlciBNb2RhbERpYWxvZy1pbnB1dFwiIGlkPVwiRmlsZUV4cGlyYXRlRGF0ZVwiIHR5cGU9XCJkYXRlXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJGaWxlRXhwaXJhdGVEYXRlXCIgY2xhc3M9XCJNb2RhbERpYWxvZy1sYWJlbCBkYXRlcGlja2VyIHNoYXJlXCI+RXhwaXJhdGlvbiBEYXRlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiZGVsRmlsZUFmdGVyRXhwaXJlZFwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiTW9kYWxEaWFsb2ctY2hlY2staW5wdXQgc2hhcmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZGVsRmlsZUFmdGVyRXhwaXJlZFwiIGNsYXNzPVwiTW9kYWxEaWFsb2ctY2hlY2stbGFiZWwgc2hhcmVcIj5EZWxldGUgRmlsZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJyPjxicj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaWQ9XCJ1cmxGaWxlXCIgY2xhc3M9XCJsYWJlbC11cmwtc2hhcmVcIj48L2xhYmVsPmAsXHJcbiAgICBtb2RhbERpYWxvZ09wdGlvbnNcclxuICApO1xyXG5cclxuICAvKiovXHJcbiAgLy9odG1sU2hhcmVGaWxlO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFNob3cgU2hhcmVkIEZpbGVzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG93U2hhcmVkRmlsZXMoKSB7XHJcbiAgbGV0IEFkZFVzZXJNb2RhbENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIik7XHJcbiAgbGV0IGNvbnRhaW5lck92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1vdmVybGF5XCIpO1xyXG5cclxuICBBZGRVc2VyTW9kYWxDb250ZW50LmlubmVySFRNTCA9IGh0bWxTZWFyY2hTaGFyZWRGaWxlc1RlbXBsYXRlO1xyXG4gICR1KFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikuYWRkQ2xhc3MoXCJlZGl0XCIpO1xyXG4gIEFkZFVzZXJNb2RhbENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICBjb250YWluZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgYXhpb3NcclxuICAgIC5nZXQoXCIvZmlsZXMvc2hhcmVkL3VzZXIvXCIgKyB1c2VyRGF0YS5Vc2VyTmFtZSwge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgQXV0aG9yaXphdGlvbjogXCJCZWFyZXIgXCIgKyB1c2VyRGF0YS5Ub2tlblxyXG4gICAgICB9LFxyXG4gICAgICB0aW1lb3V0OiAzMDAwMFxyXG4gICAgfSlcclxuICAgIC50aGVuKGQgPT4ge1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhaXRpbmdcIikuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJIZWxsbzogXCIsIGQuZGF0YS5zdGF0dXMpO1xyXG4gICAgICBpZiAoZC5kYXRhLnN0YXR1cyA9PT0gXCJPS1wiKSB7XHJcbiAgICAgICAgbGV0IGZpbGVzID0gZC5kYXRhLmRhdGE7XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IGh0bWxMaXN0Q29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGJvZHlMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2R5TGlzdFwiKTtcclxuICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcImZpbGVzOiBcIiwgZmlsZXMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBzRGF0ZSA9IGZpbGVzW2ldLkV4cGlyYXRlRGF0ZSA/IGZpbGVzW2ldLkV4cGlyYXRlRGF0ZSA6IFwibmV2ZXJcIjtcclxuICAgICAgICAgIGxldCBkID0gZmlsZXNbaV0uRGVsZXRlRXhwaXJlZEZpbGUgPT09IDEgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICBodG1sTGlzdENvbnRlbnQgKz0gYFxyXG4gICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJkYXRhLXJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD4ke2ZpbGVzW2ldLmlkfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZmlsZXNbaV0uVXNlcn08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD4ke2ZpbGVzW2ldLkRlc3RVc2VyfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZmlsZXNbaV0uRmlsZU5hbWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+JHtmaWxlc1tpXS5TdGF0ZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD4ke2ZpbGVzW2ldLkV4cGlyYXRlRGF0ZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD4ke2R9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+JHtmaWxlc1tpXS5Hcm91cElkfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGlkPVwiJHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZpbGVzW2ldLklkXHJcbiAgICAgICAgICAgICAgICAgICAgfS1pZFwiIGNsYXNzPVwiZmFzIGZhLXBlbmNpbCBlZGl0LVNoYXJlRmlsZS1pY29uXCIgdGl0bGU9XCJFZGl0YXIgQXJjaGl2b1wiPjwvaT5gO1xyXG4gICAgICAgICAgaHRtbExpc3RDb250ZW50ICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8aSBpZD1cIiR7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmaWxlc1tpXS5JZFxyXG4gICAgICAgICAgICAgICAgICAgIH0taWRcIiBjbGFzcz1cImZhcyBmYS10aW1lcyBkZWwtU2hhcmVkRmlsZS1pY29uXCIgdGl0bGU9XCJCb3JyYXIgQXJjaGl2b1wiPjwvaT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPmA7XHJcblxyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnVXNlciBSb2xlLiAnLHVzZXJzW2ldLlVzZXJSb2xlLnRyaW0oKS50b1VwcGVyQ2FzZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYm9keUxpc3QuaW5uZXJIVE1MID0gaHRtbExpc3RDb250ZW50O1xyXG5cclxuICAgICAgICBsZXQgdGFibGUgPSBuZXcgRGF0YVRhYmxlKFxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNTaGFyZWRGaWxlc1RhYmxlTGlzdFwiKSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc2VhcmNoYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZml4ZWRIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIGluZm86IGZhbHNlLFxyXG4gICAgICAgICAgICBwZXJQYWdlU2VsZWN0OiBudWxsLFxyXG4gICAgICAgICAgICBwZXJQYWdlOiAyMDBcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoXHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRlbC1TYWhyZWRGaWxlLWljb25cIiksXHJcbiAgICAgICAgICBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgIGxldCB1c2VySWQgPSBlLnRhcmdldC5pZC5zbGljZSgwLCAtMyk7XHJcbiAgICAgICAgICAgICAgbGV0IHVzZXJOYW1lID1cclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblsxXS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgdXNlck5hbWUgPSB1c2VyTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHVzZXJOYW1lLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlcklkOiBcIiwgdXNlcklkKTtcclxuICAgICAgICAgICAgICBfcmVtb3ZlVXNlcih1c2VySWQsIHVzZXJOYW1lLCBkID0+IHtcclxuICAgICAgICAgICAgICAgIHNob3dUb2FzdChcclxuICAgICAgICAgICAgICAgICAgXCJEZWxldGUgVXNlclwiLFxyXG4gICAgICAgICAgICAgICAgICBgVXN1YXJpbyAke3VzZXJOYW1lfSBib3JyYWRvYCxcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICR1KFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikucmVtb3ZlQ2xhc3MoXCJlZGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJNb2RcIikuY2xpY2soKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKFxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lZGl0LVNoYXJlZEZpbGUtaWNvblwiKSxcclxuICAgICAgICAgIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHVzZXJJZCA9IGUudGFyZ2V0LmlkLnNsaWNlKDAsIC0zKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXJJZDogXCIsIHVzZXJJZCk7XHJcbiAgICAgICAgICAgICAgX2VkaXRVc2VyKHVzZXJJZCwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI0FkZFVzZXJNb2RhbENvbnRlbnRcIikuc3R5bGUuZGlzcGxheSA9XHJcbiAgICAgICAgICAgICAgICAgIFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgJHUoXCIjQWRkVXNlck1vZGFsQ29udGVudFwiKS5yZW1vdmVDbGFzcyhcImVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1vdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPVxyXG4gICAgICAgICAgICAgICAgICBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgIHNob3dBZGRVc2VyRm9ybShcIkVkaXQgVXNlclwiLCBkKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI2J0bi1FZGl0U2hhcmVkRmlsZUNhbmNlbFwiKVxyXG4gICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgJHUoXCIjQWRkVXNlck1vZGFsQ29udGVudFwiKS5yZW1vdmVDbGFzcyhcImVkaXRcIik7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hvd1RvYXN0KFwiVXNlcnNcIiwgZC5kYXRhLmRhdGEubWVzc2FnZSwgXCJlcnJvclwiKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICBzaG93VG9hc3QoXCJVc2Vyc1wiLCBlLCBcImVycm9yXCIpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGVsZXRlIEZpbGVzICYgRm9sZGVycyBzZWxlY3RlZFxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWQoKSB7XHJcbiAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIilcclxuICAgIGNvbnNvbGUubG9nKFwiYVNlbGVjdGVkRm9sZGVyczogXCIsIGFwcERhdGEuYVNlbGVjdGVkRm9sZGVycy5sZW5ndGgpO1xyXG4gIGxldCBtb2RhbERpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICBjYW5jZWw6IHRydWUsXHJcbiAgICBjYW5jZWxUZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgY29uZmlybTogdHJ1ZSxcclxuICAgIGNvbmZpcm1UZXh0OiBcIk9LXCIsXHJcbiAgICB3aWR0aDogXCIzNDBweFwiXHJcbiAgfTtcclxuICBpZiAoYXBwRGF0YS5hU2VsZWN0ZWRGb2xkZXJzLmxlbmd0aCA+IDApIHtcclxuICAgIGxldCByZXN1bHQgPSAwO1xyXG4gICAgbW9kYWxEaWFsb2dPcHRpb25zLmNvbmZpcm1DYWxsQmFjayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgZGVsZXRlRm9sZGVyKGFwcERhdGEuY3VycmVudFBhdGgpO1xyXG4gICAgICBhd2FpdCBfZGVzZWxlY3RBbGxGb2xkZXJzKCk7XHJcbiAgICAgIGlmIChhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLm5hbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIG1vZGFsRGlhbG9nT3B0aW9ucy5jb25maXJtQ2FsbEJhY2sgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICBhd2FpdCBkZWxldGVGaWxlKGFwcERhdGEuY3VycmVudFBhdGgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbW9kYWxEaWFsb2dPcHRpb25zLmNvbmZpcm1UZXh0ID0gXCJPS1wiO1xyXG4gICAgICAgIG1vZGFsRGlhbG9nKFxyXG4gICAgICAgICAgXCJEZWxldGUgRmlsZXNcIixcclxuICAgICAgICAgIFwiRGVsZXRlIHNlbGVjdGVkIGZpbGVzP1wiLFxyXG4gICAgICAgICAgbW9kYWxEaWFsb2dPcHRpb25zXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZnJlc2hcIikuY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIG1vZGFsRGlhbG9nT3B0aW9ucy5jYW5jZWxDYWxsQmFjayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgX2Rlc2VsZWN0QWxsRm9sZGVycygpO1xyXG4gICAgICBpZiAoYXBwRGF0YS5hU2VsZWN0ZWRGaWxlcy5uYW1lLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBtb2RhbERpYWxvZ09wdGlvbnMuY29uZmlybUNhbGxCYWNrID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgYXdhaXQgZGVsZXRlRmlsZShhcHBEYXRhLmN1cnJlbnRQYXRoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIG1vZGFsRGlhbG9nT3B0aW9ucy5jYW5jZWxDYWxsQmFjayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgIGF3YWl0IF9kZXNlbGVjdEFsbEZpbGVzKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBtb2RhbERpYWxvZ09wdGlvbnMuY29uZmlybVRleHQgPSBcIk9LXCI7XHJcbiAgICAgICAgbW9kYWxEaWFsb2coXHJcbiAgICAgICAgICBcIkRlbGV0ZSBGaWxlc1wiLFxyXG4gICAgICAgICAgXCJEZWxldGUgc2VsZWN0ZWQgZmlsZXM/XCIsXHJcbiAgICAgICAgICBtb2RhbERpYWxvZ09wdGlvbnNcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgbW9kYWxEaWFsb2dPcHRpb25zLmNvbmZpcm1UZXh0ID0gXCJZZXMsIEknbSB2ZXJ5IHN1cmVcIjtcclxuICAgIG1vZGFsRGlhbG9nKFxyXG4gICAgICBcIkRlbGV0ZSBGb2xkZXJzXCIsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwid2FybmluZy1sYmxcIj5XQVJOSU5HOjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2FybmluZy1tc2dcIj5BbGwgc2VsZWN0ZWQgZm9sZGVycyBhbmQgdGhlaXIgY29udGVudHMgd2lsbCBiZSBkZWxldGVkLiEhPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2dcIj5BcmUgeW91IHN1cmU/PC9kaXY+YCxcclxuICAgICAgbW9kYWxEaWFsb2dPcHRpb25zXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoYXBwRGF0YS5hU2VsZWN0ZWRGaWxlcy5uYW1lLmxlbmd0aCA+IDApIHtcclxuICAgICAgbW9kYWxEaWFsb2dPcHRpb25zLmNvbmZpcm1DYWxsQmFjayA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCBkZWxldGVGaWxlKGFwcERhdGEuY3VycmVudFBhdGgpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVmcmVzaFwiKS5jbGljaygpO1xyXG4gICAgICB9O1xyXG4gICAgICBtb2RhbERpYWxvZ09wdGlvbnMuY2FuY2VsQ2FsbEJhY2sgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgYXdhaXQgX2Rlc2VsZWN0QWxsRmlsZXMoKTtcclxuICAgICAgfTtcclxuICAgICAgbW9kYWxEaWFsb2coXCJEZWxldGUgRmlsZXNcIiwgXCJEZWxldGUgc2VsZWN0ZWQgZmlsZXM/XCIsIG1vZGFsRGlhbG9nT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFkZCBuZXcgRm9sZGVyXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXdGb2xkZXIoZm9sZGVyTmFtZSkge1xyXG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuKTtcclxuICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgZmV0Y2goXCIvZmlsZXMvbmV3Zm9sZGVyXCIsIHtcclxuICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICBwYXRoOiBnZXRSZWFsUGF0aChhcHBEYXRhLmN1cnJlbnRQYXRoKSxcclxuICAgICAgZm9sZGVyTmFtZTogZm9sZGVyTmFtZVxyXG4gICAgfSksXHJcbiAgICB0aW1lb3V0OiAxMDAwMFxyXG4gIH0pXHJcbiAgICAudGhlbihyID0+IHIuanNvbigpKVxyXG4gICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gXCJPS1wiKSB7XHJcbiAgICAgICAgJHUoXCIjbW9kYWxcIikuaGlkZSgpO1xyXG4gICAgICAgICR1KFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XHJcbiAgICAgICAgJHUoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgXCJOZXcgRm9sZGVyXCIsXHJcbiAgICAgICAgICBcIkNyZWFkYSBudWV2YSBjYXJwZXRhIFwiICsgZGF0YS5kYXRhLmZvbGRlck5hbWUsXHJcbiAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgXCJFcnJvciBhbCBjcmVhciBsYSBjYXJwZXRhIFwiICtcclxuICAgICAgICAgICAgZm9sZGVyTmFtZSArXHJcbiAgICAgICAgICAgIFwiIDxicj5FcnJvcjogXCIgK1xyXG4gICAgICAgICAgICBkYXRhLm1lc3NhZ2UsXHJcbiAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIHNob3dUb2FzdChcclxuICAgICAgICBcIkVycm9yXCIsXHJcbiAgICAgICAgXCJFcnJvciBhbCBjcmVhciBsYSBjYXJwZXRhIFwiICtcclxuICAgICAgICAgIGZvbGRlck5hbWUgK1xyXG4gICAgICAgICAgXCIgPGJyPkVycm9yOiBlcnJvciBubyBpZGVudGlmaWNhZG9cIixcclxuICAgICAgICBcImVycm9yXCJcclxuICAgICAgKTtcclxuICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERlbGV0ZSBzZWxlY3RlZCBGaWxlc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRmlsZShwYXRoKSB7XHJcbiAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgbGV0IHggPSAwO1xyXG4gIGxldCBhRiA9IGFwcERhdGEuYVNlbGVjdGVkRmlsZXMubmFtZS5zbGljZSgpO1xyXG4gIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGFGKTtcclxuICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyB1c2VyRGF0YS5Ub2tlbik7XHJcbiAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICQoXCIjd2FpdGluZ1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICBmb3IgKHggPSAwOyB4IDwgYUYubGVuZ3RoOyB4KyspIHtcclxuICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgZmlsZSBcIiArIGFGW3hdICsgXCIgLi4uXCIpO1xyXG4gICAgZmV0Y2goXCIvZmlsZXMvZGVsZXRlXCIsIHtcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIHBhdGg6IGdldFJlYWxQYXRoKHBhdGgpLFxyXG4gICAgICAgIGZpbGVOYW1lOiBhRlt4XVxyXG4gICAgICB9KSxcclxuICAgICAgdGltZW91dDogNzIwMDAwXHJcbiAgICB9KVxyXG4gICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcclxuICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcclxuICAgICAgLnRoZW4oZCA9PiB7XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZCk7XHJcbiAgICAgICAgaWYgKGQuc3RhdHVzID09IFwiT0tcIikge1xyXG4gICAgICAgICAgYXBwRGF0YS5hU2VsZWN0ZWRGaWxlcy5uYW1lLnNoaWZ0KCk7XHJcbiAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLnNpemUuc2hpZnQoKTtcclxuICAgICAgICAgIHNob3dUb2FzdChcclxuICAgICAgICAgICAgXCJEZWxldGUgZmlsZVwiLFxyXG4gICAgICAgICAgICBcIkFyY2hpdm8gXCIgKyBkLmRhdGEuZmlsZU5hbWUgKyBcIiBib3JyYWRvXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgJHUoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHNob3dUb2FzdChcIkVycm9yXCIsIGVyciwgXCJlcnJvclwiKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG4gICQoXCIjd2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEZWxldGUgc2VsZWN0ZWQgRm9sZGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRm9sZGVyKHBhdGgpIHtcclxuICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICBsZXQgeCA9IDA7XHJcbiAgbGV0IGFGID0gYXBwRGF0YS5hU2VsZWN0ZWRGb2xkZXJzLnNsaWNlKCk7XHJcbiAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coYUYpO1xyXG4gIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuKTtcclxuICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgJChcIiN3YWl0aW5nXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gIGZvciAoeCA9IDA7IHggPCBhRi5sZW5ndGg7IHgrKykge1xyXG4gICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIilcclxuICAgICAgY29uc29sZS5sb2coXCJEZWxldGluZyBmb2xkZXIgXCIgKyBhRlt4XSArIFwiIC4uLlwiKTtcclxuICAgIGZldGNoKFwiL2ZpbGVzL2RlbGV0ZVwiLCB7XHJcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBwYXRoOiBnZXRSZWFsUGF0aChwYXRoKSxcclxuICAgICAgICBmaWxlTmFtZTogYUZbeF1cclxuICAgICAgfSksXHJcbiAgICAgIHRpbWVvdXQ6IDcyMDAwMFxyXG4gICAgfSlcclxuICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXHJcbiAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSBcIk9LXCIpIHtcclxuICAgICAgICAgIHNob3dUb2FzdChcclxuICAgICAgICAgICAgXCJEZWxldGUgRm9sZGVyXCIsXHJcbiAgICAgICAgICAgIFwiQ2FycGV0YSBcIiArIGRhdGEuZGF0YS5maWxlTmFtZSArIFwiIGJvcnJhZGFcIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBhcHBEYXRhLmFTZWxlY3RlZEZvbGRlcnMuc2hpZnQoKTtcclxuICAgICAgICAgICQoXCIjd2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICAgIGlmIChhcHBEYXRhLmFTZWxlY3RlZEZpbGVzLm5hbWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICR1KFwiI3JlZnJlc2hcIikudHJpZ2dlcihcImNsaWNrXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gVXBsb2FkIEZpbGVzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWQoVG9rZW4pIHtcclxuICBsZXQgdyA9IDMyO1xyXG4gIGxldCBoID0gNDQwO1xyXG4gIGxldCBhTGlzdEhhbmRsZXIgPSBbXTtcclxuICBsZXQgaGFuZGxlckNvdW50ZXIgPSAwO1xyXG4gIGxldCB1cGxvYWRGaWxlcyA9IFtdO1xyXG5cclxuICBsZXQgTW9kYWxUaXRsZSA9IFwiVXBsb2FkIEZpbGVzXCI7XHJcbiAgbGV0IE1vZGFsQ29udGVudCA9IGBcclxuICAgIDxsYWJlbCBpZD1cImxhYmVsLXVwbG9hZC1pbnB1dFwiIGNsYXNzPVwiYnRuLWlucHV0IHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bjItdW5pZnlcIj5cclxuICAgICAgU2VsZWN0IGZpbGVzXHJcbiAgICAgIDxpbnB1dCBpZD1cInVwbG9hZC1pbnB1dFwiIHR5cGU9XCJmaWxlXCIgbmFtZT1cInVwbG9hZHNbXVwiIG11bHRpcGxlPVwibXVsdGlwbGVcIiBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZVwiPlxyXG4gICAgPC9sYWJlbD5cclxuICAgIDxzcGFuIGlkPVwic0ZpbGVzXCIgY2xhc3M9XCJ1cGxvYWQtaW5wdXQtbWVzc2FnZVwiPk5pbmd1biBhcmNoaXZvIHNlbGVjY2lvbmFkbzwvc3Bhbj5gO1xyXG5cclxuICBNb2RhbENvbnRlbnQgKz0gaHRtbFVwbG9hZERvd25sb2FkVGVtcGxhdGU7XHJcbiAgbGV0IGh0bWxDb250ZW50ID0gYFxyXG4gICAgPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWFsZXJ0XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1tYXNrXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1ib2R5IGRvd25sb2FkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLXRpdGxlXCI+XHJcbiAgICAgICAgICAke01vZGFsVGl0bGV9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjXCI+PC9hPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250YWluZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlcy1wcm9ncmVzcy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICR7TW9kYWxDb250ZW50fVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+ICAgICAgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgIDwhLS08aW5wdXQgdHlwZT1cInRleHRcIiBoaWRkZW4gaWQ9XCJkZXN0UGF0aFwiIG5hbWU9XCJkZXN0UGF0aFwiIHZhbHVlPVwiXCIvPi0tPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnkgZGlzYWJsZWRcIiBpZD1cImJ0bkNhbmNlbEFsbFwiIGhyZWY9XCIjIVwiPkNhbmNlbCB1cGxvYWRzPC9hPiAgXHJcbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2xvc2VVcGxvYWRcIiBocmVmPVwiIyFcIj5DbG9zZTwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5gO1xyXG5cclxuICAkdShcIiN1cGxvYWRcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAkdShcIiN1cGxvYWRcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgZnVuY3Rpb24gZm5VcGxvYWRGaWxlKGZvcm1EYXRhLCBuRmlsZSwgZmlsZU5hbWUpIHtcclxuICAgICR1KFwiI2xpXCIgKyBuRmlsZSkuc2hvdygpO1xyXG4gICAgJHUoXCIjbGktZmlsZW5hbWVcIiArIG5GaWxlKS5zaG93KCk7XHJcbiAgICAkdShcIiNsaS1maWxlbmFtZVwiICsgbkZpbGUpLmh0bWwoZmlsZU5hbWUpO1xyXG4gICAgbGV0IHJlYWxwYXRoID0gZ2V0UmVhbFBhdGgoYXBwRGF0YS5jdXJyZW50UGF0aCk7XHJcbiAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZDphcHBEYXRhLmN1cnJlbnRQYXRoIFwiICsgYXBwRGF0YS5jdXJyZW50UGF0aCk7XHJcbiAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZDpSRUFMX1JPT1RfUEFUSCBcIiArIHVzZXJEYXRhLlJFQUxfUk9PVF9QQVRIKTtcclxuICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVXBsb2FkOnJlYWxQYXRoIFwiICsgcmVhbHBhdGgpO1xyXG4gICAgbGV0IENhbmNlbFRva2VuID0gYXhpb3MuQ2FuY2VsVG9rZW47XHJcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgbkZpbGUpO1xyXG4gICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgbkZpbGUpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXBsb2FkLWlucHV0XCIpLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICBheGlvc1xyXG4gICAgICAucG9zdChcIi9maWxlcy91cGxvYWQ/ZGVzdFBhdGg9XCIgKyByZWFscGF0aCwgZm9ybURhdGEsIHtcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHVzZXJEYXRhLlRva2VuLFxyXG4gICAgICAgICAgZGVzdFBhdGg6IHJlYWxwYXRoXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aW1lb3V0OiAyOTAwMDAsXHJcbiAgICAgICAgY2FuY2VsVG9rZW46IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XHJcbiAgICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdID0gYztcclxuICAgICAgICB9KSxcclxuICAgICAgICBvblVwbG9hZFByb2dyZXNzOiBmdW5jdGlvbihwcm9ncmVzc0V2ZW50KSB7XHJcbiAgICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb2dyZXNzRXZlbnQ6IFwiLCBwcm9ncmVzc0V2ZW50KTtcclxuICAgICAgICAgIGxldCBwZXJjZW50Q29tcGxldGUgPSAwO1xyXG4gICAgICAgICAgbGV0IGV2dCA9IHByb2dyZXNzRXZlbnQ7XHJcbiAgICAgICAgICAvL2FMaXN0SGFuZGxlcltuRmlsZV0udXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAvLyAgXCJwcm9ncmVzc1wiLFxyXG4gICAgICAgICAgLy8gIGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlTmFtZSArIFwiIEZpbGUgc2l6ZTogXCIsIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICBpZiAoZXZ0LnRvdGFsID4gdXNlckRhdGEuTWF4RmlsZVNpemUpIHtcclxuICAgICAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgICAgIFwiRXJyb3JcIixcclxuICAgICAgICAgICAgICBgJHtmaWxlTmFtZX0gZXhjZWRlIGRlbCB0YW1hw7FvIHNvcG9ydGFkbyAoJHtcclxuICAgICAgICAgICAgICAgIHVzZXJEYXRhLk1heEZpbGVTaXplXHJcbiAgICAgICAgICAgICAgfSBCeXRlcylgLFxyXG4gICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdKCk7XHJcbiAgICAgICAgICAgIF9zaG93QWJvcnRNZXNzYWdlKHByb2dyZXNzQmFyLCBcIkFib3J0ZWQgYnkgc2VydmVyXCIpO1xyXG4gICAgICAgICAgICBwZXJjZW50TGFiZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3J0XCIgKyBuRmlsZSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgICAgICAgaGFuZGxlckNvdW50ZXIgPSBoYW5kbGVyQ291bnRlciAtIDE7XHJcbiAgICAgICAgICAgIGlmIChoYW5kbGVyQ291bnRlciA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKVxyXG4gICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9hdWRpdCh1c2VyRGF0YS5Vc2VyTmFtZSwnVVBMT0FEJyx1cGxvYWRGaWxlc1tuRmlsZV0uZmlsZU5hbWUgKyAnIFsnICsgdXBsb2FkRmlsZXNbbkZpbGVdLmZpbGVTaXplICsgJ10gLT5VcGxvYWQgY2FuY2VsZWQgYnkgU2VydmVyJywnRkFJTCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICBcIkFVRElUOiBcIiArXHJcbiAgICAgICAgICAgICAgICB1c2VyRGF0YS5Vc2VyTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIlVQTE9BRFwiICtcclxuICAgICAgICAgICAgICAgIHVwbG9hZEZpbGVzW25GaWxlXS5maWxlTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIiBbXCIgK1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkRmlsZXNbbkZpbGVdLmZpbGVTaXplICtcclxuICAgICAgICAgICAgICAgIFwiXSAtPlVwbG9hZCBjYW5jZWxlZCBieSBTZXJ2ZXIsRkFJTFwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggIT09IFwiMTAwJVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xyXG4gICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwKTtcclxuICAgICAgICAgICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBwZXJjZW50Q29tcGxldGUgKyBcIiVcIjtcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcGVyY2VudENvbXBsZXRlICsgXCIlXCI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL2ZhbHNlXHJcbiAgICAgICAgICAvLyk7XHJcbiAgICAgICAgICByZXR1cm4gYUxpc3RIYW5kbGVyW25GaWxlXTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIC8vbGV0IGRhdGEgPSBKU09OLnBhcnNlKGQpO1xyXG4gICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBzdWNjZXNzZnVsIVxcblwiLCBkYXRhKTtcclxuICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVyQ291bnRlcjE6IFwiLCBoYW5kbGVyQ291bnRlcik7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmRhdGEuc3RhdHVzID09IFwiT0tcIikge1xyXG4gICAgICAgICAgc2hvd1RvYXN0KFwiVXBsb2FkXCIsIGZpbGVOYW1lICsgXCIgdXBsb2FkZWQgc3VjZXNzZnVsbHlcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgLy9hdWRpdCh1c2VyRGF0YS5Vc2VyTmFtZSwnVVBMT0FEJyx1cGxvYWRGaWxlc1tuRmlsZV0uZmlsZU5hbWUgKyAnIFsnICsgdXBsb2FkRmlsZXNbbkZpbGVdLmZpbGVTaXplICsnXScsJ09LJyk7XHJcbiAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9jdWx0YW5kbyBhYm9ydFwiLCBuRmlsZSk7XHJcbiAgICAgICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgICBcIkFVRElUOiBcIiArIHVzZXJEYXRhLlVzZXJOYW1lICsgXCIsVVBMT0FELFwiLFxyXG4gICAgICAgICAgICAgIHVwbG9hZEZpbGVzW25GaWxlXS5maWxlTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIiBbXCIgK1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkRmlsZXNbbkZpbGVdLmZpbGVTaXplICtcclxuICAgICAgICAgICAgICAgIFwiXSxPS1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3J0XCIgKyBuRmlsZSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgJHUoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgICBoYW5kbGVyQ291bnRlciA9IGhhbmRsZXJDb3VudGVyIC0gMTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlckNvdW50ZXIyOiBcIiwgaGFuZGxlckNvdW50ZXIpO1xyXG4gICAgICAgICAgaWYgKGhhbmRsZXJDb3VudGVyID09IDApIHtcclxuICAgICAgICAgICAgJHUoXCIjYnRuQ2FuY2VsQWxsXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICR1KFwiI2J0bkNhbmNlbEFsbFwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoZGF0YS5kYXRhLnN0YXR1cyA9PSBcIkZBSUxcIikge1xyXG4gICAgICAgICAgICBzaG93VG9hc3QoXCJFcnJvclwiLCBcIkVycm9yOiBcIiArIGRhdGEuZGF0YS5tZXNzYWdlLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3J0XCIgKyBuRmlsZSkuc3R5bGUuZHNpcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAvL2F1ZGl0KHVzZXJEYXRhLlVzZXJOYW1lLCdVUExPQUQnLHVwbG9hZEZpbGVzW25GaWxlXS5maWxlTmFtZSArICcgWycgKyB1cGxvYWRGaWxlc1tuRmlsZV0uZmlsZVNpemUgKyAnXSAtPicgKyBkYXRhLmRhdGEubWVzc2FnZSwnRkFJTCcpO1xyXG4gICAgICAgICAgICBoYW5kbGVyQ291bnRlciA9IGhhbmRsZXJDb3VudGVyIC0gMTtcclxuICAgICAgICAgICAgaWYgKGhhbmRsZXJDb3VudGVyID09IDApIHtcclxuICAgICAgICAgICAgICBkb2N1bWVudFxyXG4gICAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXBsb2FkIEVycm9yOlwiLCBlKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgZWxlbWVudC5pZCA9IFwiTW9kYWxEaWFsb2ctd3JhcFwiO1xyXG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbENvbnRlbnQ7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1cGxvYWQtaW5wdXRcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DbG9zZVVwbG9hZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLXdyYXBcIik7XHJcbiAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXBsb2FkXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb2RhbENsb3NlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctd3JhcFwiKTtcclxuICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1cGxvYWRcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gIH0pO1xyXG5cclxuICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWxlLWFib3J0XCIpLCBmdW5jdGlvbihlbCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIGVsLmlkKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBuID0gcGFyc2VJbnQoZS50YXJnZXQuaWQuc2xpY2UoLTEpKTtcclxuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgbik7XHJcbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyBuKTtcclxuICAgICAgYUxpc3RIYW5kbGVyW25dKCk7XHJcbiAgICAgIF9zaG93QWJvcnRNZXNzYWdlKHByb2dyZXNzQmFyLCBcIkNhbmNlbGVkIGJ5IHVzZXJcIik7XHJcbiAgICAgIHBlcmNlbnRMYWJlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWJvcnRcIiArIG4pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgaGFuZGxlckNvdW50ZXIgPSBoYW5kbGVyQ291bnRlciAtIDE7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlckNvdW50ZXI6IFwiLCBoYW5kbGVyQ291bnRlcik7XHJcbiAgICAgIGlmIChoYW5kbGVyQ291bnRlciA9PSAwKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DYW5jZWxBbGxcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgfVxyXG4gICAgICAvL2F1ZGl0KHVzZXJEYXRhLlVzZXJOYW1lLCdVUExPQUQnLHVwbG9hZEZpbGVzW25dLmZpbGVOYW1lICsgJyBbJyArIHVwbG9hZEZpbGVzW25dLmZpbGVTaXplICsgJ10gLT5VcGxvYWQgY2FuY2VsZWQgYnkgVXNlcicsJ0ZBSUwnKTtcclxuICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgXCJBVURJVDogXCIgK1xyXG4gICAgICAgICAgdXNlckRhdGEuVXNlck5hbWUgK1xyXG4gICAgICAgICAgXCJVUExPQURcIiArXHJcbiAgICAgICAgICB1cGxvYWRGaWxlc1tuXS5maWxlTmFtZSArXHJcbiAgICAgICAgICBcIiBbXCIgK1xyXG4gICAgICAgICAgdXBsb2FkRmlsZXNbbl0uZmlsZVNpemUgK1xyXG4gICAgICAgICAgXCJdIC0+VXBsb2FkIGNhbmNlbGVkIGJ5IFVzZXIsRkFJTFwiXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DYW5jZWxBbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgeCk7XHJcbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyB4KTtcclxuICAgICAgaWYgKGFMaXN0SGFuZGxlclt4XSkge1xyXG4gICAgICAgIGFMaXN0SGFuZGxlclt4XSgpO1xyXG4gICAgICAgIF9zaG93QWJvcnRNZXNzYWdlKHByb2dyZXNzQmFyLCBcIkNhbmNlbGVkIGJ5IFVzZXJcIik7XHJcbiAgICAgICAgcGVyY2VudExhYmVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhYm9ydFwiICsgeCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIC8vYXVkaXQodXNlckRhdGEuVXNlck5hbWUsJ1VQTE9BRCcsdXBsb2FkRmlsZXNbeF0uZmlsZU5hbWUgKyAnIFsnICsgdXBsb2FkRmlsZXNbeF0uZmlsZVNpemUgKyAnXSAtPlVwbG9hZCBjYW5jZWxlZCBieSBVc2VyJywnRkFJTCcpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCJBVURJVDogXCIgK1xyXG4gICAgICAgICAgICB1c2VyRGF0YS5Vc2VyTmFtZSArXHJcbiAgICAgICAgICAgIFwiVVBMT0FEXCIgK1xyXG4gICAgICAgICAgICB1cGxvYWRGaWxlc1t4XS5maWxlTmFtZSArXHJcbiAgICAgICAgICAgIFwiIFtcIiArXHJcbiAgICAgICAgICAgIHVwbG9hZEZpbGVzW3hdLmZpbGVTaXplICtcclxuICAgICAgICAgICAgXCJdIC0+VXBsb2FkIGNhbmNlbGVkIGJ5IFVzZXIsRkFJTFwiXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaGFuZGxlckNvdW50ZXIgPSAwO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DYW5jZWxBbGxcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DYW5jZWxBbGxcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3VwbG9hZC1pbnB1dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGUgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IGZpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1cGxvYWQtaW5wdXRcIikuZmlsZXM7XHJcbiAgICBoYW5kbGVyQ291bnRlciA9IGZpbGVzLmxlbmd0aDtcclxuICAgIGxldCBodG1sVGV4dCA9IGZpbGVzLmxlbmd0aCA+IDAgPyAnPGEgaHJlZj1cIiNcIiBpZD1cInNlbGVjdGVkRmlsZXNcIj4nIDogXCJcIjtcclxuICAgIGh0bWxUZXh0ICs9XHJcbiAgICAgIGZpbGVzLmxlbmd0aCA+IDAgPyBmaWxlcy5sZW5ndGggKyBcIiBhcmNoaXZvcyBzZWxlY2Npb25hZG9zLlwiIDogZmlsZXNbMF07XHJcbiAgICBodG1sVGV4dCArPSBmaWxlcy5sZW5ndGggPiAwID8gXCI8L2E+XCIgOiBcIlwiO1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdGVkRmlsZXNcIikpIHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZWxlY3RlZEZpbGVzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJHUoXCIjc0ZpbGVzXCIpLnJlbW92ZUNsYXNzKFwic2VsZWN0XCIpO1xyXG4gICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcihcIiNsYWJlbC11cGxvYWQtaW5wdXRcIilcclxuICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsYWJlbC11cGxvYWQtaW5wdXRcIikub25jbGljaygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiAgaWYoZmlsZXMubGVuZ2h0ID4gMCkge1xyXG4gICAgICAgICAgICR1KFwiI3NGaWxlc1wiKS5hZGRDbGFzcygnc2VsZWN0Jyk7XHJcbiAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsYWJlbC11cGxvYWQtaW5wdXRcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAkdShcIiNzRmlsZXNcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdCcpO1xyXG4gICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGFiZWwtdXBsb2FkLWlucHV0XCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgIH0gICAqL1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc0ZpbGVzXCIpLmlubmVySFRNTCA9IGh0bWxUZXh0O1xyXG5cclxuICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGZpbGVzLmxlbmd0aCk7XHJcbiAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCAmJiBmaWxlcy5sZW5ndGggPD0gNSkge1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNsb3NlVXBsb2FkXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DbG9zZVVwbG9hZFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIC8vIGFkZCB0aGUgZmlsZXMgdG8gZm9ybURhdGEgb2JqZWN0IGZvciB0aGUgZGF0YSBwYXlsb2FkXHJcbiAgICAgICAgLyogaWYoZmlsZS5zaXplID4gMTAwMCkge1xyXG4gICAgICAgICAgICAgICAgICBzaG93VG9hc3QoXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRWwgdGFtYcOxbyBkZSBhcmNoaXZvIGV4Y2VkZSBkZWwgbMOtbWl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVwbG9hZHNbXVwiLCBmaWxlLCBmaWxlLm5hbWUpO1xyXG4gICAgICAgIHVwbG9hZEZpbGVzLnB1c2goe1xyXG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGUubmFtZSxcclxuICAgICAgICAgIGZpbGVTaXplOiBmaWxlLnNpemVcclxuICAgICAgICB9KTtcclxuICAgICAgICBmblVwbG9hZEZpbGUoZm9ybURhdGEsIGksIGZpbGUubmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgJChcIiNidG5DbG9zZVVwbG9hZFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgIFwiRXJyb3JcIixcclxuICAgICAgICBcIk5vIHNlIHB1ZWRlbiBzdWJpciBtw6FzIGRlIDUgYXJjaGl2b3MgYSBsYSB2ZXpcIixcclxuICAgICAgICBcImVycm9yXCJcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEb3dubG9hZCBzZWxlY3RlZCBGaWxlc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWQoZmlsZUxpc3QsIHRleHQpIHtcclxuICBsZXQgcmVxTGlzdCA9IFtdLFxyXG4gICAgaGFuZGxlckNvdW50ZXIgPSAwLFxyXG4gICAgcmVzcG9uc2VUaW1lb3V0ID0gW107XHJcbiAgbGV0IHcgPSAzMjtcclxuICBsZXQgaCA9IDQ0MDtcclxuICBsZXQgTW9kYWxUaXRsZSA9IFwiRG93bmxvYWQgc2VsZWN0ZWQgZmlsZXNcIjtcclxuICBsZXQgTW9kYWxDb250ZW50ID0gaHRtbFVwbG9hZERvd25sb2FkVGVtcGxhdGU7XHJcbiAgbGV0IGh0bWxDb250ZW50ID0gYFxyXG4gICAgPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWFsZXJ0XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1tYXNrXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1ib2R5IGRvd25sb2FkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLXRpdGxlXCI+XHJcbiAgICAgICAgICAke01vZGFsVGl0bGV9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjXCI+PC9hPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250YWluZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlcy1wcm9ncmVzcy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICR7TW9kYWxDb250ZW50fVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+ICAgICAgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgIDwhLS08aW5wdXQgdHlwZT1cInRleHRcIiBoaWRkZW4gaWQ9XCJkZXN0UGF0aFwiIG5hbWU9XCJkZXN0UGF0aFwiIHZhbHVlPVwiXCIvPi0tPlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnkgZGlzYWJsZWRcIiBpZD1cImJ0bkNhbmNlbEFsbFwiIGhyZWY9XCIjIVwiPkNhbmNlbCBEb3dubG9hZHM8L2E+ICBcclxuICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DbG9zZURvd25sb2FkXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+YDtcclxuXHJcbiAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGVsZW1lbnQuaWQgPSBcIk1vZGFsRGlhbG9nLXdyYXBcIjtcclxuICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gIGNvbnN0IF9jbG9zZU1vZGFsID0gKCkgPT4ge1xyXG4gICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpO1xyXG4gICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rvd25sb2FkXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgIF9kZXNlbGVjdEFsbEZpbGVzKCk7XHJcbiAgfTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DbG9zZURvd25sb2FkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIF9jbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9kYWxDbG9zZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBfY2xvc2VNb2RhbCgpO1xyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkb3dubG9hZFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3YWl0aW5nXCIpLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgcmVxTGlzdC5sZW5ndGg7IHgrKykge1xyXG4gICAgICBpZiAocmVxTGlzdFt4XSkge1xyXG4gICAgICAgIHJlcUxpc3RbeF0uYWJvcnQoKTtcclxuICAgICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50XCIgKyB4KTtcclxuICAgICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgeCk7XHJcbiAgICAgICAgX3Nob3dBYm9ydE1lc3NhZ2UocHJvZ3Jlc3NCYXIsIFwiQ2FuY2VsZWQgYnkgdXNlclwiKTtcclxuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAvL2F1ZGl0KHVzZXJEYXRhLlVzZXJOYW1lLCdET1dOTE9BRCcsZmlsZUxpc3RbeF0gKyAnIC0+RG93bmxvYWQgY2FuY2VsZWQgYnkgVXNlcicsJ0ZBSUwnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgIFwiQVVESVQ6IFwiICtcclxuICAgICAgICAgICAgdXNlckRhdGEuVXNlck5hbWUgK1xyXG4gICAgICAgICAgICBcIkRPV05MT0FEXCIgK1xyXG4gICAgICAgICAgICBmaWxlTGlzdC5uYW1lW3hdICtcclxuICAgICAgICAgICAgXCIgLT5VcGxvYWQgY2FuY2VsZWQgYnkgVXNlcixGQUlMXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgfSk7XHJcblxyXG4gIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbGUtYWJvcnRcIiksIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgZWwuaWQpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IG4gPSBwYXJzZUludChlLnRhcmdldC5pZC5zbGljZSgtMSkpO1xyXG4gICAgICByZXFMaXN0W25dLmFib3J0KCk7XHJcbiAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlcmNlbnRcIiArIG4pO1xyXG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgbik7XHJcbiAgICAgIF9zaG93QWJvcnRNZXNzYWdlKHByb2dyZXNzQmFyLCBcIkNhbmNlbGVkIGJ5IHVzZXJcIik7XHJcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3J0XCIgKyBuKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGhhbmRsZXJDb3VudGVyID0gaGFuZGxlckNvdW50ZXIgLSAxO1xyXG4gICAgICBpZiAoaGFuZGxlckNvdW50ZXIgPT0gMCkge1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYnRuQ2FuY2VsQWxsXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgIH1cclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1cGxvYWRcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAvL2F1ZGl0KHVzZXJEYXRhLlVzZXJOYW1lLCdET1dOTE9BRCcsZmlsZUxpc3Rbbl0gKyAnIC0+RG93bmxvYWQgY2FuY2VsZWQgYnkgVXNlcicsJ0ZBSUwnKTtcclxuICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgXCJBVURJVDogXCIgK1xyXG4gICAgICAgICAgdXNlckRhdGEuVXNlck5hbWUgK1xyXG4gICAgICAgICAgXCJET1dOTE9BRFwiICtcclxuICAgICAgICAgIGZpbGVMaXN0Lm5hbWVbbl0gK1xyXG4gICAgICAgICAgXCIgLT5VcGxvYWQgY2FuY2VsZWQgYnkgVXNlcixGQUlMXCJcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgX0Rvd25sb2FkX0xvb3AgPSBpID0+IHtcclxuICAgIGxldCBmTmFtZSA9IGZpbGVMaXN0Lm5hbWVbaV07XHJcbiAgICBsZXQgZlNpemUgPSBmaWxlTGlzdC5zaXplW2ldO1xyXG4gICAgbGV0IGxpTnVtYmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsaVwiICsgaSk7XHJcbiAgICBsZXQgbGlGaWxlbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGktZmlsZW5hbWVcIiArIGkpO1xyXG4gICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIiArIGkpO1xyXG4gICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgaSk7XHJcbiAgICByZXNwb25zZVRpbWVvdXRbaV0gPSBmYWxzZTtcclxuICAgIGZOYW1lID0gZk5hbWVcclxuICAgICAgLnNwbGl0KFwiXFxcXFwiKVxyXG4gICAgICAucG9wKClcclxuICAgICAgLnNwbGl0KFwiL1wiKVxyXG4gICAgICAucG9wKCk7XHJcbiAgICByZXFMaXN0W2ldID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICByZXFMaXN0W2ldLm9wZW4oXCJQT1NUXCIsIFwiL2ZpbGVzL2Rvd25sb2FkXCIsIHRydWUpO1xyXG4gICAgcmVxTGlzdFtpXS5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XHJcbiAgICBsaU51bWJlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgbGlGaWxlbmFtZS5pbm5lckhUTUwgPSBmTmFtZTtcclxuICAgIHJlcUxpc3RbaV0udGltZW91dCA9IDM2MDAwO1xyXG4gICAgcmVxTGlzdFtpXS5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gRG93bmxvYWQgVGltZW91dFxyXG4gICAgICBpZiAodXNlckRhdGEuUnVuTW9kZSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCIqKiBUaW1lb3V0IGVycm9yIC0+RmlsZTpcIiArXHJcbiAgICAgICAgICAgIGZOYW1lICtcclxuICAgICAgICAgICAgXCIgXCIgK1xyXG4gICAgICAgICAgICByZXFMaXN0W2ldLnN0YXR1cyArXHJcbiAgICAgICAgICAgIFwiIFwiICtcclxuICAgICAgICAgICAgcmVxTGlzdFtpXS5zdGF0dXNUZXh0XHJcbiAgICAgICAgKTtcclxuICAgICAgLy8gaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMVxyXG4gICAgICBfc2hvd0Fib3J0TWVzc2FnZShwcm9ncmVzc0JhciwgXCJUaW1lb3V0IEVycm9yXCIpO1xyXG4gICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKFwiYmxpbmtcIik7XHJcbiAgICAgIHJlc3BvbnNlVGltZW91dFtpXSA9IHRydWU7XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbnByb2dyZXNzID0gZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAgIC8vIERvd25sb2FkIHByb2dyZXNzXHJcbiAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgIGxldCBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludCgoZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkgKiAxMDApO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcGVyY2VudENvbXBsZXRlICsgXCIlXCI7XHJcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IHBlcmNlbnRDb21wbGV0ZSArIFwiJVwiO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIERvd25sb2FkIGFib3J0XHJcbiAgICAgIHNob3dUb2FzdChcclxuICAgICAgICBcIkRvd25sb2FkIEZpbGVcIixcclxuICAgICAgICBcIkRlc2NhcmdhIGRlIGFyY2hpdm8gXCIgKyBmTmFtZSArIFwiIGNhbmNlbGFkYVwiLFxyXG4gICAgICAgIFwid2FybmluZ1wiXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIERvd25sb2FkIGVycm9yXHJcbiAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICBcIioqIEFuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgdHJhbnNhY3Rpb24gLT5GaWxlOlwiICtcclxuICAgICAgICAgICAgZk5hbWUgK1xyXG4gICAgICAgICAgICBcIiBcIiArXHJcbiAgICAgICAgICAgIHJlcS5zdGF0dXMgK1xyXG4gICAgICAgICAgICBcIiBcIiArXHJcbiAgICAgICAgICAgIHJlcS5zdGF0dXNUZXh0XHJcbiAgICAgICAgKTtcclxuICAgICAgaGFuZGxlckNvdW50ZXIgPSBoYW5kbGVyQ291bnRlciAtIDE7XHJcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIkVycm9yXCI7XHJcbiAgICAgIHBlcmNlbnRMYWJlbC5zdHlsZS5jb2xvciA9IFwicmVkXCI7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWJvcnRcIiArIGkpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgIFwiRG93bmxvYWQgRmlsZVwiLFxyXG4gICAgICAgIFwiRXJyb3IgYWwgZGVzY2FyZ2FyIGFyY2hpdm8gXCIgKyBmTmFtZSArIFwiIFwiICsgcmVxLnN0YXR1c1RleHQsXHJcbiAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbmxvYWRlbmQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIC8vIERvd25sb2FkIEVuZFxyXG4gICAgICBjb25zb2xlLmxvZyhcIkZpbGUgbjpcIiArIGkgKyBcIiAtPlwiLCByZXFMaXN0W2ldLnJlYWR5U3RhdGUpO1xyXG4gICAgICBoYW5kbGVyQ291bnRlciA9IGhhbmRsZXJDb3VudGVyIC0gMTtcclxuICAgICAgaWYgKCFyZXNwb25zZVRpbWVvdXRbaV0pIHtcclxuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIjEwMCVcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3J0XCIgKyBpKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGhhbmRsZXJDb3VudGVyID09PSAwKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DYW5jZWxBbGxcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbmxvYWRzdGFydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBoYW5kbGVyQ291bnRlciA9IGhhbmRsZXJDb3VudGVyICsgMTtcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjBcIjtcclxuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiMCVcIjtcclxuICAgIH07XHJcbiAgICByZXFMaXN0W2ldLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAocmVxTGlzdFtpXS5yZWFkeVN0YXRlID09PSA0ICYmIHJlcUxpc3RbaV0uc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICBzaG93VG9hc3QoXHJcbiAgICAgICAgICBcIkRvd25sb2FkIEZpbGVcIixcclxuICAgICAgICAgIFwiQXJjaGl2byBcIiArIGZOYW1lICsgXCIgZGVzY2FyZ2Fkb1wiLFxyXG4gICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBmaWxlbmFtZSA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGRpc3Bvc2l0aW9uID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIik7XHJcbiAgICAgICAgaWYgKGRpc3Bvc2l0aW9uICYmIGRpc3Bvc2l0aW9uLmluZGV4T2YoXCJhdHRhY2htZW50XCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgbGV0IGZpbGVuYW1lUmVnZXggPSAvZmlsZW5hbWVbXjs9XFxuXSo9KChbJ1wiXSkuKj9cXDJ8W147XFxuXSopLztcclxuICAgICAgICAgIGxldCBtYXRjaGVzID0gZmlsZW5hbWVSZWdleC5leGVjKGRpc3Bvc2l0aW9uKTtcclxuICAgICAgICAgIGlmIChtYXRjaGVzICE9IG51bGwgJiYgbWF0Y2hlc1sxXSlcclxuICAgICAgICAgICAgZmlsZW5hbWUgPSBtYXRjaGVzWzFdLnJlcGxhY2UoL1snXCJdL2csIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdHlwZSA9IHJlcUxpc3RbaV0uZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIik7XHJcbiAgICAgICAgbGV0IGJsb2IgPSBuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcclxuICAgICAgICAgIHR5cGU6IHR5cGVcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgLy8gSUUgd29ya2Fyb3VuZCBmb3IgXCJIVE1MNzAwNzogT25lIG9yIG1vcmUgYmxvYiBVUkxzIHdlcmUgcmV2b2tlZCBieSBjbG9zaW5nIHRoZSBibG9iIGZvciB3aGljaCB0aGV5IHdlcmUgY3JlYXRlZC4gVGhlc2UgVVJMcyB3aWxsIG5vIGxvbmdlciByZXNvbHZlIGFzIHRoZSBkYXRhIGJhY2tpbmcgdGhlIFVSTCBoYXMgYmVlbiBmcmVlZC5cIlxyXG4gICAgICAgICAgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iKGJsb2IsIGZpbGVuYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IFVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcclxuICAgICAgICAgIGxldCBkb3dubG9hZFVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcblxyXG4gICAgICAgICAgaWYgKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSBIVE1MNSBhW2Rvd25sb2FkXSBhdHRyaWJ1dGUgdG8gc3BlY2lmeSBmaWxlbmFtZVxyXG4gICAgICAgICAgICBsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgICAgICAvLyBzYWZhcmkgZG9lc24ndCBzdXBwb3J0IHRoaXMgeWV0XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYS5kb3dubG9hZCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRvd25sb2FkVXJsO1xyXG4gICAgICAgICAgICAgIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYS5ocmVmID0gZG93bmxvYWRVcmw7XHJcbiAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgYS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cub3BlbiA9IGRvd25sb2FkVXJsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoZG93bmxvYWRVcmwpO1xyXG4gICAgICAgICAgfSwgMTAwKTsgLy8gY2xlYW51cFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJlcUxpc3RbaV0uc2V0UmVxdWVzdEhlYWRlcihcclxuICAgICAgXCJDb250ZW50LXR5cGVcIixcclxuICAgICAgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIlxyXG4gICAgKTtcclxuICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpXHJcbiAgICAgIGNvbnNvbGUubG9nKGdldFJlYWxQYXRoKGFwcERhdGEuY3VycmVudFBhdGgpICsgXCIvXCIgKyBmaWxlTGlzdC5uYW1lW2ldKTtcclxuICAgIHJlcUxpc3RbaV0uc2VuZChcclxuICAgICAgc2VyaWFsaXplT2JqZWN0KHtcclxuICAgICAgICBmaWxlbmFtZTogZ2V0UmVhbFBhdGgoYXBwRGF0YS5jdXJyZW50UGF0aCkgKyBcIi9cIiArIGZpbGVMaXN0Lm5hbWVbaV1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNidG5DYW5jZWxBbGxcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZUxpc3QubmFtZS5sZW5ndGg7IGkrKykge1xyXG4gICAgX0Rvd25sb2FkX0xvb3AoaSk7XHJcbiAgfVxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FpdGluZ1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBFbmQgRmlsZXMgYW5kIEZvbGRlcnMgbW9kdWxlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0UmVhbFBhdGgocCkge1xyXG4gICAgICBsZXQgclBhdGggPSBcIlwiO1xyXG4gICAgICBcclxuICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDpwIFwiLCBwKTtcclxuICAgICAgaWYgKHVzZXJEYXRhLlJ1bk1vZGUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDp1c2VyRGF0YS5SZWFsUm9vdFBhdGggXCIsIHVzZXJEYXRhLlJlYWxSb290UGF0aCk7XHJcbiAgICAgIGlmIChwID09IFwiL1wiICYmICh1c2VyRGF0YS5SZWFsUm9vdFBhdGggPT09IFwiL1wiIHx8IHVzZXJEYXRhLlJlYWxSb290UGF0aCA9PT0gXCJcIikpIHsgICAgIFxyXG4gICAgICAgIHJQYXRoID0gcDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocCA9PSBcIi9cIikge1xyXG4gICAgICAgICAgclBhdGggPSBcIi9cIiArIHVzZXJEYXRhLlJlYWxSb290UGF0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYodXNlckRhdGEuUmVhbFJvb3RQYXRoICE9PSAnLycpe1xyXG4gICAgICAgICAgICByUGF0aCA9IFwiL1wiICsgdXNlckRhdGEuUmVhbFJvb3RQYXRoICsgcDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHAuaW5kZXhPZignLycpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgclBhdGggPSAgdXNlckRhdGEuUmVhbFJvb3RQYXRoICsgcDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByUGF0aCA9ICBwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiZ2V0UmVhbFBhdGg6clBhdGggXCIsIHJQYXRoKTtcclxuICAgICAgcmV0dXJuIHJQYXRoO1xyXG4gICAgfVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChkYXRhT2JqZWN0KSB7XHJcbiAgICAgIHZhciBzdHJpbmdSZXN1bHQgPSBcIlwiLFxyXG4gICAgICAgIHZhbHVlID0gdm9pZCAwO1xyXG4gICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YU9iamVjdCkge1xyXG4gICAgICAgIGlmICh1c2VyRGF0YS5SdW5Nb2RlID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGFPYmplY3Rba2V5XSwga2V5KTtcclxuICAgICAgICB2YWx1ZSA9IGRhdGFPYmplY3Rba2V5XTtcclxuICAgICAgICBpZiAoc3RyaW5nUmVzdWx0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICBzdHJpbmdSZXN1bHQgKz0gXCImXCIgKyBrZXkgKyBcIj1cIiArIHZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdHJpbmdSZXN1bHQgKz0ga2V5ICsgXCI9XCIgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHN0cmluZ1Jlc3VsdDtcclxuICAgIH0gICBcclxuIiwiLyohXHJcbiAqXHJcbiAqIFZhbmlsbGEtRGF0YVRhYmxlc1xyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNyBLYXJsIFNhdW5kZXJzIChodHRwOi8vbW9iaXVzLm92aClcclxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcclxuICpcclxuICogVmVyc2lvbjogMS42LjE1XHJcbiAqXHJcbiAqL1xyXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xyXG4gIHZhciBwbHVnaW4gPSBcIkRhdGFUYWJsZVwiO1xyXG5cclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHBsdWdpbik7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICBkZWZpbmUoW10sIGZhY3RvcnkocGx1Z2luKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgcm9vdFtwbHVnaW5dID0gZmFjdG9yeShwbHVnaW4pO1xyXG4gIH1cclxufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzLndpbmRvdyB8fCB0aGlzLmdsb2JhbCwgZnVuY3Rpb24ocGx1Z2luKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgdmFyIHdpbiA9IHdpbmRvdyxcclxuICAgICAgZG9jID0gZG9jdW1lbnQsXHJcbiAgICAgIGJvZHkgPSBkb2MuYm9keTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVmYXVsdCBjb25maWd1cmF0aW9uXHJcbiAgICogQHR5cCB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHZhciBkZWZhdWx0Q29uZmlnID0ge1xyXG4gICAgICBwZXJQYWdlOiAxMCxcclxuICAgICAgcGVyUGFnZVNlbGVjdDogWzUsIDEwLCAxNSwgMjAsIDI1XSxcclxuXHJcbiAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxyXG4gICAgICBpbmZvOiB0cnVlLFxyXG5cclxuICAgICAgLy8gUGFnaW5hdGlvblxyXG4gICAgICBuZXh0UHJldjogdHJ1ZSxcclxuICAgICAgZmlyc3RMYXN0OiBmYWxzZSxcclxuICAgICAgcHJldlRleHQ6IFwiJmxzYXF1bztcIixcclxuICAgICAgbmV4dFRleHQ6IFwiJnJzYXF1bztcIixcclxuICAgICAgZmlyc3RUZXh0OiBcIiZsYXF1bztcIixcclxuICAgICAgbGFzdFRleHQ6IFwiJnJhcXVvO1wiLFxyXG4gICAgICBlbGxpcHNpc1RleHQ6IFwiJmhlbGxpcDtcIixcclxuICAgICAgYXNjVGV4dDogXCLilrRcIixcclxuICAgICAgZGVzY1RleHQ6IFwi4pa+XCIsXHJcbiAgICAgIHRydW5jYXRlUGFnZXI6IHRydWUsXHJcbiAgICAgIHBhZ2VyRGVsdGE6IDIsXHJcblxyXG4gICAgICBmaXhlZENvbHVtbnM6IHRydWUsXHJcbiAgICAgIGZpeGVkSGVpZ2h0OiBmYWxzZSxcclxuXHJcbiAgICAgIGhlYWRlcjogdHJ1ZSxcclxuICAgICAgZm9vdGVyOiBmYWxzZSxcclxuXHJcbiAgICAgIC8vIEN1c3RvbWlzZSB0aGUgZGlzcGxheSB0ZXh0XHJcbiAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgcGxhY2Vob2xkZXI6IFwiU2VhcmNoLi4uXCIsIC8vIFRoZSBzZWFyY2ggaW5wdXQgcGxhY2Vob2xkZXJcclxuICAgICAgICAgIHBlclBhZ2U6IFwie3NlbGVjdH0gZW50cmllcyBwZXIgcGFnZVwiLCAvLyBwZXItcGFnZSBkcm9wZG93biBsYWJlbFxyXG4gICAgICAgICAgbm9Sb3dzOiBcIk5vIGVudHJpZXMgZm91bmRcIiwgLy8gTWVzc2FnZSBzaG93biB3aGVuIHRoZXJlIGFyZSBubyBzZWFyY2ggcmVzdWx0c1xyXG4gICAgICAgICAgaW5mbzogXCJTaG93aW5nIHtzdGFydH0gdG8ge2VuZH0gb2Yge3Jvd3N9IGVudHJpZXNcIiAvL1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gQ3VzdG9taXNlIHRoZSBsYXlvdXRcclxuICAgICAgbGF5b3V0OiB7XHJcbiAgICAgICAgICB0b3A6IFwie3NlbGVjdH17c2VhcmNofVwiLFxyXG4gICAgICAgICAgYm90dG9tOiBcIntpbmZvfXtwYWdlcn1cIlxyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaXMgaXRlbSBpcyBvYmplY3RcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHZhciBpc09iamVjdCA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlzIGl0ZW0gaXMgYXJyYXlcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHZhciBpc0FycmF5ID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGZvciB2YWxpZCBKU09OIHN0cmluZ1xyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICBzdHJcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufEFycmF5fE9iamVjdH1cclxuICAgKi9cclxuICB2YXIgaXNKc29uID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICB2YXIgdCA9ICExO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgICAgdCA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgcmV0dXJuICExO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAhKG51bGwgPT09IHQgfHwgKCFpc0FycmF5KHQpICYmICFpc09iamVjdCh0KSkpICYmIHQ7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogTWVyZ2Ugb2JqZWN0cyAocmVjY3Vyc2l2ZSlcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChzcmMsIHByb3BzKSB7XHJcbiAgICAgIGZvciAodmFyIHByb3AgaW4gcHJvcHMpIHtcclxuICAgICAgICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgIHZhciB2YWwgPSBwcm9wc1twcm9wXTtcclxuICAgICAgICAgICAgICBpZiAodmFsICYmIGlzT2JqZWN0KHZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgc3JjW3Byb3BdID0gc3JjW3Byb3BdIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgICBleHRlbmQoc3JjW3Byb3BdLCB2YWwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHNyY1twcm9wXSA9IHZhbDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNyYztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBJdGVyYXRvciBoZWxwZXJcclxuICAgKiBAcGFyYW0gIHsoQXJyYXl8T2JqZWN0KX0gICBhcnIgICAgIEFueSBvYmplY3QsIGFycmF5IG9yIGFycmF5LWxpa2UgY29sbGVjdGlvbi5cclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICBmbiAgICAgIENhbGxiYWNrXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgc2NvcGUgICBDaGFuZ2UgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIHZhciBlYWNoID0gZnVuY3Rpb24gKGFyciwgZm4sIHNjb3BlKSB7XHJcbiAgICAgIHZhciBuO1xyXG4gICAgICBpZiAoaXNPYmplY3QoYXJyKSkge1xyXG4gICAgICAgICAgZm9yIChuIGluIGFycikge1xyXG4gICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJyLCBuKSkge1xyXG4gICAgICAgICAgICAgICAgICBmbi5jYWxsKHNjb3BlLCBhcnJbbl0sIG4pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvciAobiA9IDA7IG4gPCBhcnIubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICBmbi5jYWxsKHNjb3BlLCBhcnJbbl0sIG4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRhcmdldFxyXG4gICAqIEBwYXJhbSAge09iamVjdH0gZWxcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGVcclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cclxuICAgKi9cclxuICB2YXIgb24gPSBmdW5jdGlvbiAoZWwsIGUsIGZuKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZSwgZm4sIGZhbHNlKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgRE9NIGVsZW1lbnQgbm9kZVxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICBhIG5vZGVOYW1lXHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIGIgcHJvcGVydGllcyBhbmQgYXR0cmlidXRlc1xyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICB2YXIgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHZhciBkID0gZG9jLmNyZWF0ZUVsZW1lbnQoYSk7XHJcbiAgICAgIGlmIChiICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIGIpIHtcclxuICAgICAgICAgIHZhciBlO1xyXG4gICAgICAgICAgZm9yIChlIGluIGIpIHtcclxuICAgICAgICAgICAgICBpZiAoXCJodG1sXCIgPT09IGUpIHtcclxuICAgICAgICAgICAgICAgICAgZC5pbm5lckhUTUwgPSBiW2VdO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGQuc2V0QXR0cmlidXRlKGUsIGJbZV0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZDtcclxuICB9O1xyXG5cclxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoZWwsIGllKSB7XHJcbiAgICAgIGlmIChlbCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICBlYWNoKGVsLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgIGZsdXNoKGUsIGllKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGllKSB7XHJcbiAgICAgICAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYnV0dG9uIGhlbHBlclxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICBjXHJcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgIHBcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgdFxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICB2YXIgYnV0dG9uID0gZnVuY3Rpb24gKGMsIHAsIHQpIHtcclxuICAgICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7XHJcbiAgICAgICAgICBjbGFzczogYyxcclxuICAgICAgICAgIGh0bWw6ICc8YSBocmVmPVwiI1wiIGRhdGEtcGFnZT1cIicgKyBwICsgJ1wiPicgKyB0ICsgXCI8L2E+XCJcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogY2xhc3NMaXN0IHNoaW1cclxuICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHZhciBjbGFzc0xpc3QgPSB7XHJcbiAgICAgIGFkZDogZnVuY3Rpb24gKHMsIGEpIHtcclxuICAgICAgICAgIGlmIChzLmNsYXNzTGlzdCkge1xyXG4gICAgICAgICAgICAgIHMuY2xhc3NMaXN0LmFkZChhKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjbGFzc0xpc3QuY29udGFpbnMocywgYSkpIHtcclxuICAgICAgICAgICAgICAgICAgcy5jbGFzc05hbWUgPSBzLmNsYXNzTmFtZS50cmltKCkgKyBcIiBcIiArIGE7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChzLCBhKSB7XHJcbiAgICAgICAgICBpZiAocy5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICBzLmNsYXNzTGlzdC5yZW1vdmUoYSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMocywgYSkpIHtcclxuICAgICAgICAgICAgICAgICAgcy5jbGFzc05hbWUgPSBzLmNsYXNzTmFtZS5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxzKVwiICsgYS5zcGxpdChcIiBcIikuam9pbihcInxcIikgKyBcIihcXFxcc3wkKVwiLCBcImdpXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgXCIgXCJcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAocywgYSkge1xyXG4gICAgICAgICAgaWYgKHMpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHMuY2xhc3NMaXN0ID9cclxuICAgICAgICAgICAgICAgICAgcy5jbGFzc0xpc3QuY29udGFpbnMoYSkgOlxyXG4gICAgICAgICAgICAgICAgICAhIXMuY2xhc3NOYW1lICYmXHJcbiAgICAgICAgICAgICAgICAgICEhcy5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cChcIihcXFxcc3xeKVwiICsgYSArIFwiKFxcXFxzfCQpXCIpKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEJ1YmJsZSBzb3J0IGFsZ29yaXRobVxyXG4gICAqL1xyXG4gIHZhciBzb3J0SXRlbXMgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB2YXIgYywgZDtcclxuICAgICAgaWYgKDEgPT09IGIpIHtcclxuICAgICAgICAgIGMgPSAwO1xyXG4gICAgICAgICAgZCA9IGEubGVuZ3RoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGIgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgYyA9IGEubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICBkID0gLTE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgZSA9ICEwOyBlOykge1xyXG4gICAgICAgICAgZSA9ICExO1xyXG4gICAgICAgICAgZm9yICh2YXIgZiA9IGM7IGYgIT0gZDsgZiArPSBiKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGFbZiArIGJdICYmIGFbZl0udmFsdWUgPiBhW2YgKyBiXS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZyA9IGFbZl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBoID0gYVtmICsgYl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBpID0gZztcclxuICAgICAgICAgICAgICAgICAgYVtmXSA9IGg7XHJcbiAgICAgICAgICAgICAgICAgIGFbZiArIGJdID0gaTtcclxuICAgICAgICAgICAgICAgICAgZSA9ICEwO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBQYWdlciB0cnVuY2F0aW9uIGFsZ29yaXRobVxyXG4gICAqL1xyXG4gIHZhciB0cnVuY2F0ZSA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCBlbGxpcHNpcykge1xyXG4gICAgICBkID0gZCB8fCAyO1xyXG4gICAgICB2YXIgaixcclxuICAgICAgICAgIGUgPSAyICogZCxcclxuICAgICAgICAgIGYgPSBiIC0gZCxcclxuICAgICAgICAgIGcgPSBiICsgZCxcclxuICAgICAgICAgIGggPSBbXSxcclxuICAgICAgICAgIGkgPSBbXTtcclxuICAgICAgaWYgKGIgPCA0IC0gZCArIGUpIHtcclxuICAgICAgICAgIGcgPSAzICsgZTtcclxuICAgICAgfSBlbHNlIGlmIChiID4gYyAtICgzIC0gZCArIGUpKSB7XHJcbiAgICAgICAgICBmID0gYyAtICgyICsgZSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgayA9IDE7IGsgPD0gYzsgaysrKSB7XHJcbiAgICAgICAgICBpZiAoMSA9PSBrIHx8IGsgPT0gYyB8fCAoayA+PSBmICYmIGsgPD0gZykpIHtcclxuICAgICAgICAgICAgICB2YXIgbCA9IGFbayAtIDFdO1xyXG4gICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUobCwgXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgaC5wdXNoKGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVhY2goaCwgZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgIHZhciBkID0gYy5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VcIik7XHJcbiAgICAgICAgICBpZiAoaikge1xyXG4gICAgICAgICAgICAgIHZhciBlID0gai5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VcIik7XHJcbiAgICAgICAgICAgICAgaWYgKGQgLSBlID09IDIpIGkucHVzaChhW2VdKTtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChkIC0gZSAhPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBmID0gY3JlYXRlRWxlbWVudChcImxpXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImVsbGlwc2lzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBodG1sOiAnPGEgaHJlZj1cIiNcIj4nICsgZWxsaXBzaXMgKyBcIjwvYT5cIlxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgaS5wdXNoKGYpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGkucHVzaChjKTtcclxuICAgICAgICAgIGogPSBjO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIGRhdGEgdG8gSFRNTCB0YWJsZVxyXG4gICAqL1xyXG4gIHZhciBkYXRhVG9UYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgIHZhciB0aGVhZCA9IGZhbHNlLFxyXG4gICAgICAgICAgdGJvZHkgPSBmYWxzZTtcclxuXHJcbiAgICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMub3B0aW9ucy5kYXRhO1xyXG5cclxuICAgICAgaWYgKGRhdGEuaGVhZGluZ3MpIHtcclxuICAgICAgICAgIHRoZWFkID0gY3JlYXRlRWxlbWVudChcInRoZWFkXCIpO1xyXG4gICAgICAgICAgdmFyIHRyID0gY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICAgICAgZWFjaChkYXRhLmhlYWRpbmdzLCBmdW5jdGlvbiAoY29sKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHRkID0gY3JlYXRlRWxlbWVudChcInRoXCIsIHtcclxuICAgICAgICAgICAgICAgICAgaHRtbDogY29sXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhlYWQuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRib2R5ID0gY3JlYXRlRWxlbWVudChcInRib2R5XCIpO1xyXG4gICAgICAgICAgZWFjaChkYXRhLmRhdGEsIGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuaGVhZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGVhZGluZ3MubGVuZ3RoICE9PSByb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhlIG51bWJlciBvZiByb3dzIGRvIG5vdCBtYXRjaCB0aGUgbnVtYmVyIG9mIGhlYWRpbmdzLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHZhciB0ciA9IGNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuICAgICAgICAgICAgICBlYWNoKHJvd3MsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdGQgPSBjcmVhdGVFbGVtZW50KFwidGRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaHRtbDogdmFsdWVcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoZWFkKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy50YWJsZS50SGVhZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlQ2hpbGQodGhpcy50YWJsZS50SGVhZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnRhYmxlLmFwcGVuZENoaWxkKHRoZWFkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRib2R5KSB7XHJcbiAgICAgICAgICBpZiAodGhpcy50YWJsZS50Qm9kaWVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlQ2hpbGQodGhpcy50YWJsZS50Qm9kaWVzWzBdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGFibGUuYXBwZW5kQ2hpbGQodGJvZHkpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVXNlIG1vbWVudC5qcyB0byBwYXJzZSBjZWxsIGNvbnRlbnRzIGZvciBzb3J0aW5nXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBjb250ZW50ICAgICBUaGUgZGF0ZXRpbWUgc3RyaW5nIHRvIHBhcnNlXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBmb3JtYXQgICAgICBUaGUgZm9ybWF0IGZvciBtb21lbnQgdG8gdXNlXHJcbiAgICogQHJldHVybiB7U3RyaW5nfEJvb2xlYW59ICAgICBEYXRhdGltZSBzdHJpbmcgb3IgZmFsc2VcclxuICAgKi9cclxuICB2YXIgcGFyc2VEYXRlID0gZnVuY3Rpb24gKGNvbnRlbnQsIGZvcm1hdCkge1xyXG4gICAgICB2YXIgZGF0ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgLy8gbW9tZW50KCkgdGhyb3dzIGEgZml0IGlmIHRoZSBzdHJpbmcgaXNuJ3QgYSB2YWxpZCBkYXRldGltZSBzdHJpbmdcclxuICAgICAgLy8gc28gd2UgbmVlZCB0byBzdXBwbHkgdGhlIGZvcm1hdCB0byB0aGUgY29uc3RydWN0b3IgKGh0dHBzOi8vbW9tZW50anMuY29tL2RvY3MvIy9wYXJzaW5nL3N0cmluZy1mb3JtYXQvKVxyXG5cclxuICAgICAgLy8gQ29udmVydGluZyB0byBZWVlZTU1ERCBlbnN1cmVzIHdlIGNhbiBhY2N1cmF0ZWx5IHNvcnQgdGhlIGNvbHVtbiBudW1lcmljYWxseVxyXG5cclxuICAgICAgaWYgKGZvcm1hdCkge1xyXG4gICAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICAgIGNhc2UgXCJJU09fODYwMVwiOlxyXG4gICAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoY29udGVudCwgbW9tZW50LklTT184NjAxKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgXCJSRkNfMjgyMlwiOlxyXG4gICAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoY29udGVudCwgXCJkZGQsIE1NIE1NTSBZWVlZIEhIOm1tOnNzIFpaXCIpLmZvcm1hdChcIllZWVlNTUREXCIpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSBcIk1ZU1FMXCI6XHJcbiAgICAgICAgICAgICAgZGF0ZSA9IG1vbWVudChjb250ZW50LCBcIllZWVktTU0tREQgaGg6bW06c3NcIikuZm9ybWF0KFwiWVlZWU1NRERcIik7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIFwiVU5JWFwiOlxyXG4gICAgICAgICAgICAgIGRhdGUgPSBtb21lbnQoY29udGVudCkudW5peCgpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIC8vIFVzZXIgZGVmaW5lZCBmb3JtYXQgdXNpbmcgdGhlIGRhdGEtZm9ybWF0IGF0dHJpYnV0ZSBvciBjb2x1bW5zW25dLmZvcm1hdCBvcHRpb25cclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgZGF0ZSA9IG1vbWVudChjb250ZW50LCBmb3JtYXQpLmZvcm1hdChcIllZWVlNTUREXCIpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGF0ZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDb2x1bW5zIEFQSVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZSBEYXRhVGFibGUgaW5zdGFuY2VcclxuICAgKiBAcGFyYW0ge01peGVkfSBjb2x1bW5zICBDb2x1bW4gaW5kZXggb3IgYXJyYXkgb2YgY29sdW1uIGluZGV4ZXNcclxuICAgKi9cclxuICB2YXIgQ29sdW1ucyA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFN3YXAgdHdvIGNvbHVtbnNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIENvbHVtbnMucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiAoY29sdW1ucykge1xyXG4gICAgICBpZiAoY29sdW1ucy5sZW5ndGggJiYgY29sdW1ucy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgIHZhciBjb2xzID0gW107XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbHVtbiBpbmRleGVzXHJcbiAgICAgICAgICBlYWNoKHRoaXMuZHQuaGVhZGluZ3MsIGZ1bmN0aW9uIChoLCBpKSB7XHJcbiAgICAgICAgICAgICAgY29scy5wdXNoKGkpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdmFyIHggPSBjb2x1bW5zWzBdO1xyXG4gICAgICAgICAgdmFyIHkgPSBjb2x1bW5zWzFdO1xyXG4gICAgICAgICAgdmFyIGIgPSBjb2xzW3ldO1xyXG4gICAgICAgICAgY29sc1t5XSA9IGNvbHNbeF07XHJcbiAgICAgICAgICBjb2xzW3hdID0gYjtcclxuXHJcbiAgICAgICAgICB0aGlzLm9yZGVyKGNvbHMpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVvcmRlciB0aGUgY29sdW1uc1xyXG4gICAqIEByZXR1cm4ge0FycmF5fSBjb2x1bW5zICBBcnJheSBvZiBvcmRlcmVkIGNvbHVtbiBpbmRleGVzXHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUub3JkZXIgPSBmdW5jdGlvbiAoY29sdW1ucykge1xyXG5cclxuICAgICAgdmFyIGEsIGIsIGMsIGQsIGgsIHMsIGNlbGwsXHJcbiAgICAgICAgICB0ZW1wID0gW1xyXG4gICAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICAgIFtdXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgZHQgPSB0aGlzLmR0O1xyXG5cclxuICAgICAgLy8gT3JkZXIgdGhlIGhlYWRpbmdzXHJcbiAgICAgIGVhY2goY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbiwgeCkge1xyXG4gICAgICAgICAgaCA9IGR0LmhlYWRpbmdzW2NvbHVtbl07XHJcbiAgICAgICAgICBzID0gaC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNvcnRhYmxlXCIpICE9PSBcImZhbHNlXCI7XHJcbiAgICAgICAgICBhID0gaC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICBhLm9yaWdpbmFsQ2VsbEluZGV4ID0geDtcclxuICAgICAgICAgIGEuc29ydGFibGUgPSBzO1xyXG5cclxuICAgICAgICAgIHRlbXBbMF0ucHVzaChhKTtcclxuXHJcbiAgICAgICAgICBpZiAoZHQuaGlkZGVuQ29sdW1ucy5pbmRleE9mKGNvbHVtbikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgYiA9IGguY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgIGIub3JpZ2luYWxDZWxsSW5kZXggPSB4O1xyXG4gICAgICAgICAgICAgIGIuc29ydGFibGUgPSBzO1xyXG5cclxuICAgICAgICAgICAgICB0ZW1wWzFdLnB1c2goYik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gT3JkZXIgdGhlIHJvdyBjZWxsc1xyXG4gICAgICBlYWNoKGR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIGMgPSByb3cuY2xvbmVOb2RlKCk7XHJcbiAgICAgICAgICBkID0gcm93LmNsb25lTm9kZSgpO1xyXG5cclxuICAgICAgICAgIGMuZGF0YUluZGV4ID0gZC5kYXRhSW5kZXggPSBpO1xyXG5cclxuICAgICAgICAgIGlmIChyb3cuc2VhcmNoSW5kZXggIT09IG51bGwgJiYgcm93LnNlYXJjaEluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBjLnNlYXJjaEluZGV4ID0gZC5zZWFyY2hJbmRleCA9IHJvdy5zZWFyY2hJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBcHBlbmQgdGhlIGNlbGwgdG8gdGhlIGZyYWdtZW50IGluIHRoZSBjb3JyZWN0IG9yZGVyXHJcbiAgICAgICAgICBlYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4sIHgpIHtcclxuICAgICAgICAgICAgICBjZWxsID0gcm93LmNlbGxzW2NvbHVtbl0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgIGNlbGwuZGF0YSA9IHJvdy5jZWxsc1tjb2x1bW5dLmRhdGE7XHJcbiAgICAgICAgICAgICAgYy5hcHBlbmRDaGlsZChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW4pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsID0gcm93LmNlbGxzW2NvbHVtbl0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLmRhdGEgPSByb3cuY2VsbHNbY29sdW1uXS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICBkLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRlbXBbMl0ucHVzaChjKTtcclxuICAgICAgICAgIHRlbXBbM10ucHVzaChkKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkdC5oZWFkaW5ncyA9IHRlbXBbMF07XHJcbiAgICAgIGR0LmFjdGl2ZUhlYWRpbmdzID0gdGVtcFsxXTtcclxuXHJcbiAgICAgIGR0LmRhdGEgPSB0ZW1wWzJdO1xyXG4gICAgICBkdC5hY3RpdmVSb3dzID0gdGVtcFszXTtcclxuXHJcbiAgICAgIC8vIFVwZGF0ZVxyXG4gICAgICBkdC51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBIaWRlIGNvbHVtbnNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIENvbHVtbnMucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY29sdW1ucykge1xyXG4gICAgICBpZiAoY29sdW1ucy5sZW5ndGgpIHtcclxuICAgICAgICAgIHZhciBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICAgICAgZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW4pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBkdC5oaWRkZW5Db2x1bW5zLnB1c2goY29sdW1uKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3cgY29sdW1uc1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XHJcbiAgICAgIGlmIChjb2x1bW5zLmxlbmd0aCkge1xyXG4gICAgICAgICAgdmFyIGluZGV4LCBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICAgICAgZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgaW5kZXggPSBkdC5oaWRkZW5Db2x1bW5zLmluZGV4T2YoY29sdW1uKTtcclxuICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBkdC5oaWRkZW5Db2x1bW5zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBjb2x1bW4ocykgdmlzaWJpbGl0eVxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUudmlzaWJsZSA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XHJcbiAgICAgIHZhciBjb2xzLCBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICBjb2x1bW5zID0gY29sdW1ucyB8fCBkdC5oZWFkaW5ncy5tYXAoZnVuY3Rpb24gKHRoKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGgub3JpZ2luYWxDZWxsSW5kZXg7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCFpc05hTihjb2x1bW5zKSkge1xyXG4gICAgICAgICAgY29scyA9IGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW5zKSA8IDA7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb2x1bW5zKSkge1xyXG4gICAgICAgICAgY29scyA9IFtdO1xyXG4gICAgICAgICAgZWFjaChjb2x1bW5zLCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgY29scy5wdXNoKGR0LmhpZGRlbkNvbHVtbnMuaW5kZXhPZihjb2x1bW4pIDwgMCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbHM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgbmV3IGNvbHVtblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgQ29sdW1ucy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgdGQsIHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmR0LmhlYWRpbmdzLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5kdC5pbnNlcnQoe1xyXG4gICAgICAgICAgICAgIGhlYWRpbmdzOiBbZGF0YS5oZWFkaW5nXSxcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEubWFwKGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBbaV07XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5kdC5oaWRkZW5IZWFkZXIpIHtcclxuICAgICAgICAgIGlmIChkYXRhLmhlYWRpbmcubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICB0aC5hcHBlbmRDaGlsZChkYXRhLmhlYWRpbmcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aC5pbm5lckhUTUwgPSBkYXRhLmhlYWRpbmc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmR0LmhlYWRpbmdzLnB1c2godGgpO1xyXG5cclxuICAgICAgZWFjaCh0aGlzLmR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIGlmIChkYXRhLmRhdGFbaV0pIHtcclxuICAgICAgICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YVtpXS5ub2RlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZChkYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHRkLmlubmVySFRNTCA9IGRhdGEuZGF0YVtpXTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHRkLmRhdGEgPSB0ZC5pbm5lckhUTUw7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkYXRhLnJlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICB0ZC5pbm5lckhUTUwgPSBkYXRhLnJlbmRlci5jYWxsKHRoYXQsIHRkLmRhdGEsIHRkLCByb3cpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoZGF0YS50eXBlKSB7XHJcbiAgICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiwgZGF0YS50eXBlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5mb3JtYXQpIHtcclxuICAgICAgICAgIHRoLnNldEF0dHJpYnV0ZShcImRhdGEtZm9ybWF0XCIsIGRhdGEuZm9ybWF0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJzb3J0YWJsZVwiKSkge1xyXG4gICAgICAgICAgdGguc29ydGFibGUgPSBkYXRhLnNvcnRhYmxlO1xyXG4gICAgICAgICAgdGguc2V0QXR0cmlidXRlKFwiZGF0YS1zb3J0YWJsZVwiLCBkYXRhLnNvcnRhYmxlID09PSB0cnVlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnJlYnVpbGQoKTtcclxuXHJcbiAgICAgIHRoaXMuZHQucmVuZGVySGVhZGVyKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGNvbHVtbihzKVxyXG4gICAqIEBwYXJhbSAge0FycmF5fE51bWJlcn0gc2VsZWN0XHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBDb2x1bW5zLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoc2VsZWN0KSB7XHJcbiAgICAgIGlmIChpc0FycmF5KHNlbGVjdCkpIHtcclxuICAgICAgICAgIC8vIFJlbW92ZSBpbiByZXZlcnNlIG90aGVyd2lzZSB0aGUgaW5kZXhlcyB3aWxsIGJlIGluY29ycmVjdFxyXG4gICAgICAgICAgc2VsZWN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gYiAtIGE7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBlYWNoKHNlbGVjdCwgZnVuY3Rpb24gKGNvbHVtbikge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGNvbHVtbik7XHJcbiAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZHQuaGVhZGluZ3Muc3BsaWNlKHNlbGVjdCwgMSk7XHJcblxyXG4gICAgICAgICAgZWFjaCh0aGlzLmR0LmRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICByb3cucmVtb3ZlQ2hpbGQocm93LmNlbGxzW3NlbGVjdF0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNvcnQgYnkgY29sdW1uXHJcbiAgICogQHBhcmFtICB7aW50fSBjb2x1bW4gLSBUaGUgY29sdW1uIG5vLlxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGlyZWN0aW9uIC0gYXNjIG9yIGRlc2NcclxuICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAqL1xyXG4gIENvbHVtbnMucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiAoY29sdW1uLCBkaXJlY3Rpb24sIGluaXQpIHtcclxuXHJcbiAgICAgIHZhciBkdCA9IHRoaXMuZHQ7XHJcblxyXG4gICAgICAvLyBDaGVjayBjb2x1bW4gaXMgcHJlc2VudFxyXG4gICAgICBpZiAoZHQuaGFzSGVhZGluZ3MgJiYgKGNvbHVtbiA8IDEgfHwgY29sdW1uID4gZHQuYWN0aXZlSGVhZGluZ3MubGVuZ3RoKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkdC5zb3J0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIENvbnZlcnQgdG8gemVyby1pbmRleGVkXHJcbiAgICAgIGNvbHVtbiA9IGNvbHVtbiAtIDE7XHJcblxyXG4gICAgICB2YXIgZGlyLFxyXG4gICAgICAgICAgcm93cyA9IGR0LmRhdGEsXHJcbiAgICAgICAgICBhbHBoYSA9IFtdLFxyXG4gICAgICAgICAgbnVtZXJpYyA9IFtdLFxyXG4gICAgICAgICAgYSA9IDAsXHJcbiAgICAgICAgICBuID0gMCxcclxuICAgICAgICAgIHRoID0gZHQuYWN0aXZlSGVhZGluZ3NbY29sdW1uXTtcclxuXHJcbiAgICAgIGNvbHVtbiA9IHRoLm9yaWdpbmFsQ2VsbEluZGV4O1xyXG5cclxuICAgICAgZWFjaChyb3dzLCBmdW5jdGlvbiAodHIpIHtcclxuICAgICAgICAgIHZhciBjZWxsID0gdHIuY2VsbHNbY29sdW1uXTtcclxuICAgICAgICAgIHZhciBjb250ZW50ID0gY2VsbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpID8gY2VsbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpIDogY2VsbC5kYXRhO1xyXG4gICAgICAgICAgdmFyIG51bSA9IGNvbnRlbnQucmVwbGFjZSgvKFxcJHxcXCx8XFxzfCUpL2csIFwiXCIpO1xyXG5cclxuICAgICAgICAgIC8vIENoZWNrIGZvciBkYXRlIGZvcm1hdCBhbmQgbW9tZW50LmpzXHJcbiAgICAgICAgICBpZiAodGguZ2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIpID09PSBcImRhdGVcIiAmJiB3aW4ubW9tZW50KSB7XHJcbiAgICAgICAgICAgICAgdmFyIGZvcm1hdCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBmb3JtYXR0ZWQgPSB0aC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZvcm1hdFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlZCkge1xyXG4gICAgICAgICAgICAgICAgICBmb3JtYXQgPSB0aC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZvcm1hdFwiKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIG51bSA9IHBhcnNlRGF0ZShjb250ZW50LCBmb3JtYXQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG51bSkgPT0gbnVtKSB7XHJcbiAgICAgICAgICAgICAgbnVtZXJpY1tuKytdID0ge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogTnVtYmVyKG51bSksXHJcbiAgICAgICAgICAgICAgICAgIHJvdzogdHJcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbHBoYVthKytdID0ge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgcm93OiB0clxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLyogU29ydCBhY2NvcmRpbmcgdG8gZGlyZWN0aW9uIChhc2NlbmRpbmcgb3IgZGVzY2VuZGluZykgKi9cclxuICAgICAgdmFyIHRvcCwgYnRtO1xyXG4gICAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKHRoLCBcImFzY1wiKSB8fCBkaXJlY3Rpb24gPT0gXCJhc2NcIikge1xyXG4gICAgICAgICAgdG9wID0gc29ydEl0ZW1zKGFscGhhLCAtMSk7XHJcbiAgICAgICAgICBidG0gPSBzb3J0SXRlbXMobnVtZXJpYywgLTEpO1xyXG4gICAgICAgICAgZGlyID0gXCJkZXNjZW5kaW5nXCI7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKHRoLCBcImFzY1wiKTtcclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGgsIFwiZGVzY1wiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRvcCA9IHNvcnRJdGVtcyhudW1lcmljLCAxKTtcclxuICAgICAgICAgIGJ0bSA9IHNvcnRJdGVtcyhhbHBoYSwgMSk7XHJcbiAgICAgICAgICBkaXIgPSBcImFzY2VuZGluZ1wiO1xyXG4gICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZSh0aCwgXCJkZXNjXCIpO1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aCwgXCJhc2NcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qIENsZWFyIGFzYy9kZXNjIGNsYXNzIG5hbWVzIGZyb20gdGhlIGxhc3Qgc29ydGVkIGNvbHVtbidzIHRoIGlmIGl0IGlzbid0IHRoZSBzYW1lIGFzIHRoZSBvbmUgdGhhdCB3YXMganVzdCBjbGlja2VkICovXHJcbiAgICAgIGlmIChkdC5sYXN0VGggJiYgdGggIT0gZHQubGFzdFRoKSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGR0Lmxhc3RUaCwgXCJkZXNjXCIpO1xyXG4gICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShkdC5sYXN0VGgsIFwiYXNjXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkdC5sYXN0VGggPSB0aDtcclxuXHJcbiAgICAgIC8qIFJlb3JkZXIgdGhlIHRhYmxlICovXHJcbiAgICAgIHJvd3MgPSB0b3AuY29uY2F0KGJ0bSk7XHJcblxyXG4gICAgICBkdC5kYXRhID0gW107XHJcbiAgICAgIHZhciBpbmRleGVzID0gW107XHJcblxyXG4gICAgICBlYWNoKHJvd3MsIGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgICAgICBkdC5kYXRhLnB1c2godi5yb3cpO1xyXG5cclxuICAgICAgICAgIGlmICh2LnJvdy5zZWFyY2hJbmRleCAhPT0gbnVsbCAmJiB2LnJvdy5zZWFyY2hJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LCBkdCk7XHJcblxyXG4gICAgICBkdC5zZWFyY2hEYXRhID0gaW5kZXhlcztcclxuXHJcbiAgICAgIHRoaXMucmVidWlsZCgpO1xyXG5cclxuICAgICAgZHQudXBkYXRlKCk7XHJcblxyXG4gICAgICBpZiAoIWluaXQpIHtcclxuICAgICAgICAgIGR0LmVtaXQoXCJkYXRhdGFibGUuc29ydFwiLCBjb2x1bW4sIGRpcik7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZWJ1aWxkIHRoZSBjb2x1bW5zXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBDb2x1bW5zLnByb3RvdHlwZS5yZWJ1aWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYSwgYiwgYywgZCwgZHQgPSB0aGlzLmR0LFxyXG4gICAgICAgICAgdGVtcCA9IFtdO1xyXG5cclxuICAgICAgZHQuYWN0aXZlUm93cyA9IFtdO1xyXG4gICAgICBkdC5hY3RpdmVIZWFkaW5ncyA9IFtdO1xyXG5cclxuICAgICAgZWFjaChkdC5oZWFkaW5ncywgZnVuY3Rpb24gKHRoLCBpKSB7XHJcbiAgICAgICAgICB0aC5vcmlnaW5hbENlbGxJbmRleCA9IGk7XHJcbiAgICAgICAgICB0aC5zb3J0YWJsZSA9IHRoLmdldEF0dHJpYnV0ZShcImRhdGEtc29ydGFibGVcIikgIT09IFwiZmFsc2VcIjtcclxuICAgICAgICAgIGlmIChkdC5oaWRkZW5Db2x1bW5zLmluZGV4T2YoaSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgZHQuYWN0aXZlSGVhZGluZ3MucHVzaCh0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgLy8gTG9vcCBvdmVyIHRoZSByb3dzIGFuZCByZW9yZGVyIHRoZSBjZWxsc1xyXG4gICAgICBlYWNoKGR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIGEgPSByb3cuY2xvbmVOb2RlKCk7XHJcbiAgICAgICAgICBiID0gcm93LmNsb25lTm9kZSgpO1xyXG5cclxuICAgICAgICAgIGEuZGF0YUluZGV4ID0gYi5kYXRhSW5kZXggPSBpO1xyXG5cclxuICAgICAgICAgIGlmIChyb3cuc2VhcmNoSW5kZXggIT09IG51bGwgJiYgcm93LnNlYXJjaEluZGV4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBhLnNlYXJjaEluZGV4ID0gYi5zZWFyY2hJbmRleCA9IHJvdy5zZWFyY2hJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBcHBlbmQgdGhlIGNlbGwgdG8gdGhlIGZyYWdtZW50IGluIHRoZSBjb3JyZWN0IG9yZGVyXHJcbiAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICBjID0gY2VsbC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgYy5kYXRhID0gY2VsbC5kYXRhO1xyXG4gICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoYyk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkdC5oaWRkZW5Db2x1bW5zLmluZGV4T2YoY2VsbC5jZWxsSW5kZXgpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBkID0gY2VsbC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgIGQuZGF0YSA9IGNlbGwuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgYi5hcHBlbmRDaGlsZChkKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBBcHBlbmQgdGhlIGZyYWdtZW50IHdpdGggdGhlIG9yZGVyZWQgY2VsbHNcclxuICAgICAgICAgIHRlbXAucHVzaChhKTtcclxuICAgICAgICAgIGR0LmFjdGl2ZVJvd3MucHVzaChiKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkdC5kYXRhID0gdGVtcDtcclxuXHJcbiAgICAgIGR0LnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJvd3MgQVBJXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlIERhdGFUYWJsZSBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSB7QXJyYXl9IHJvd3NcclxuICAgKi9cclxuICB2YXIgUm93cyA9IGZ1bmN0aW9uIChkdCwgcm93cykge1xyXG4gICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAgIHRoaXMucm93cyA9IHJvd3M7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCBhIG5ldyByb3dcclxuICAgKiBAcGFyYW0gIHtBcnJheX0gcm93XHJcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgUm93cy5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgIHZhciB0ZCwgdHIgPSBjcmVhdGVFbGVtZW50KFwidHJcIik7XHJcblxyXG4gICAgICB2YXIgaGVhZGluZ3MgPSB0aGlzLmR0LmhlYWRpbmdzO1xyXG5cclxuICAgICAgaWYgKCFoZWFkaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgIGhlYWRpbmdzID0gcm93Lm1hcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWFjaChoZWFkaW5ncywgZnVuY3Rpb24gKGgsIGkpIHtcclxuICAgICAgICAgIHRkID0gY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG5cclxuICAgICAgICAgIC8vIEZpeGVzICMyOVxyXG4gICAgICAgICAgaWYgKCFyb3dbaV0gJiYgIXJvd1tpXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICByb3dbaV0gPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRkLmlubmVySFRNTCA9IHJvd1tpXTtcclxuXHJcbiAgICAgICAgICB0ZC5kYXRhID0gcm93W2ldO1xyXG5cclxuICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gdHI7XHJcbiAgfTtcclxuXHJcbiAgUm93cy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICByZXR1cm4gcm93O1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBuZXcgcm93XHJcbiAgICogQHBhcmFtIHtBcnJheX0gc2VsZWN0XHJcbiAgICovXHJcbiAgUm93cy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICB2YXIgZHQgPSB0aGlzLmR0O1xyXG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIG11bHRpcGxlIHJvd3NcclxuICAgICAgICAgIGlmIChpc0FycmF5KGRhdGFbMF0pKSB7XHJcbiAgICAgICAgICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbiAocm93LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGR0LmRhdGEucHVzaCh0aGlzLmJ1aWxkKHJvdykpO1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBkdC5kYXRhLnB1c2godGhpcy5idWlsZChkYXRhKSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gV2UgbWF5IGhhdmUgYWRkZWQgZGF0YSB0byBhbiBlbXB0eSB0YWJsZVxyXG4gICAgICAgICAgaWYgKCBkdC5kYXRhLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICBkdC5oYXNSb3dzID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICBkdC5jb2x1bW5zKCkucmVidWlsZCgpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIHJvdyhzKVxyXG4gICAqIEBwYXJhbSAge0FycmF5fE51bWJlcn0gc2VsZWN0XHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBSb3dzLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoc2VsZWN0KSB7XHJcblxyXG4gICAgICB2YXIgZHQgPSB0aGlzLmR0O1xyXG5cclxuICAgICAgaWYgKGlzQXJyYXkoc2VsZWN0KSkge1xyXG4gICAgICAgICAgLy8gUmVtb3ZlIGluIHJldmVyc2Ugb3RoZXJ3aXNlIHRoZSBpbmRleGVzIHdpbGwgYmUgaW5jb3JyZWN0XHJcbiAgICAgICAgICBzZWxlY3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBiIC0gYTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGVhY2goc2VsZWN0LCBmdW5jdGlvbiAocm93LCBpKSB7XHJcbiAgICAgICAgICAgICAgZHQuZGF0YS5zcGxpY2Uocm93LCAxKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZHQuZGF0YS5zcGxpY2Uoc2VsZWN0LCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgZHQuY29sdW1ucygpLnJlYnVpbGQoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgcm93IGluZGV4ZXNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIFJvd3MucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZWFjaCh0aGlzLmR0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgIHJvdy5kYXRhSW5kZXggPSBpO1xyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vICAgIE1BSU4gTElCICAgIC8vXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgdmFyIERhdGFUYWJsZSA9IGZ1bmN0aW9uICh0YWJsZSwgb3B0aW9ucykge1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgICAvLyB1c2VyIG9wdGlvbnNcclxuICAgICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRDb25maWcsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0YWJsZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhYmxlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbml0aWFsTGF5b3V0ID0gdGFibGUuaW5uZXJIVE1MO1xyXG4gICAgICB0aGlzLmluaXRpYWxTb3J0YWJsZSA9IHRoaXMub3B0aW9ucy5zb3J0YWJsZTtcclxuXHJcbiAgICAgIC8vIERpc2FibGUgbWFudWFsIHNvcnRpbmcgaWYgbm8gaGVhZGVyIGlzIHByZXNlbnQgKCM0KVxyXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5oZWFkZXIpIHtcclxuICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3J0YWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGFibGUudEhlYWQgPT09IG51bGwpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmRhdGEgfHxcclxuICAgICAgICAgICAgICAodGhpcy5vcHRpb25zLmRhdGEgJiYgIXRoaXMub3B0aW9ucy5kYXRhLmhlYWRpbmdzKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvcnRhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0YWJsZS50Qm9kaWVzLmxlbmd0aCAmJiAhdGFibGUudEJvZGllc1swXS5yb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgIFwiWW91IHNlZW0gdG8gYmUgdXNpbmcgdGhlIGRhdGEgb3B0aW9uLCBidXQgeW91J3ZlIG5vdCBkZWZpbmVkIGFueSByb3dzLlwiXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcblxyXG4gICAgICB0aGlzLmluaXQoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGQgY3VzdG9tIHByb3BlcnR5IG9yIG1ldGhvZCB0byBleHRlbmQgRGF0YVRhYmxlXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBwcm9wICAgIC0gTWV0aG9kIG5hbWUgb3IgcHJvcGVydHlcclxuICAgKiBAcGFyYW0gIHtNaXhlZH0gdmFsICAgICAgLSBGdW5jdGlvbiBvciBwcm9wZXJ0eSB2YWx1ZVxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgRGF0YVRhYmxlLmV4dGVuZCA9IGZ1bmN0aW9uKHByb3AsIHZhbCkge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICBEYXRhVGFibGUucHJvdG90eXBlW3Byb3BdID0gdmFsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgRGF0YVRhYmxlW3Byb3BdID0gdmFsO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHByb3RvID0gRGF0YVRhYmxlLnByb3RvdHlwZTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgaW5zdGFuY2VcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcclxuICAgKiBAcmV0dXJuIHtWb2lkfVxyXG4gICAqL1xyXG4gIHByb3RvLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZCB8fCBjbGFzc0xpc3QuY29udGFpbnModGhpcy50YWJsZSwgXCJkYXRhVGFibGUtdGFibGVcIikpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyB8fCB7fSk7XHJcblxyXG4gICAgICAvLyBJRSBkZXRlY3Rpb25cclxuICAgICAgdGhpcy5pc0lFID0gISEvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgIHRoaXMub25GaXJzdFBhZ2UgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5oaWRkZW5Db2x1bW5zID0gW107XHJcbiAgICAgIHRoaXMuY29sdW1uUmVuZGVyZXJzID0gW107XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRDb2x1bW5zID0gW107XHJcblxyXG4gICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuaW5pdFwiKTtcclxuICAgICAgICAgIHRoYXQuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMucGx1Z2lucykge1xyXG4gICAgICAgICAgICAgIGVhY2godGhhdC5vcHRpb25zLnBsdWdpbnMsIGZ1bmN0aW9uKG9wdGlvbnMsIHBsdWdpbikge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodGhhdFtwbHVnaW5dICYmIHR5cGVvZiB0aGF0W3BsdWdpbl0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhhdFtwbHVnaW5dID0gdGhhdFtwbHVnaW5dKG9wdGlvbnMsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoOiBlYWNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZDogZXh0ZW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdDogY2xhc3NMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIEluaXQgcGx1Z2luXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVkICYmIHRoYXRbcGx1Z2luXS5pbml0ICYmIHR5cGVvZiB0aGF0W3BsdWdpbl0uaW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdFtwbHVnaW5dLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LCAxMCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVuZGVyIHRoZSBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdHlwZVxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgY2FzZSBcInBhZ2VcIjpcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlclBhZ2UoKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgXCJwYWdlclwiOlxyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyUGFnZXIoKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgXCJoZWFkZXJcIjpcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckhlYWRlcigpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgbyA9IHRoYXQub3B0aW9ucyxcclxuICAgICAgICAgIHRlbXBsYXRlID0gXCJcIjtcclxuXHJcbiAgICAgIC8vIENvbnZlcnQgZGF0YSB0byBIVE1MXHJcbiAgICAgIGlmIChvLmRhdGEpIHtcclxuICAgICAgICAgIGRhdGFUb1RhYmxlLmNhbGwodGhhdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLmFqYXgpIHtcclxuICAgICAgICAgIHZhciBhamF4ID0gby5hamF4O1xyXG4gICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgIHZhciB4aHJQcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5lbWl0KFwiZGF0YXRhYmxlLmFqYXgucHJvZ3Jlc3NcIiwgZSwgeGhyKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIHhockxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5sb2FkZWRcIiwgZSwgeGhyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgIG9iai5kYXRhID0gYWpheC5sb2FkID8gYWpheC5sb2FkLmNhbGwodGhhdCwgeGhyKSA6IHhoci5yZXNwb25zZVRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSBcImpzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoYWpheC5jb250ZW50ICYmIGFqYXguY29udGVudC50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSBhamF4LmNvbnRlbnQudHlwZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gZXh0ZW5kKG9iaiwgYWpheC5jb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmltcG9ydChvYmopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0Q29sdW1ucyh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5zdWNjZXNzXCIsIGUsIHhocik7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5lcnJvclwiLCBlLCB4aHIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB2YXIgeGhyRmFpbGVkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5lcnJvclwiLCBlLCB4aHIpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB2YXIgeGhyQ2FuY2VsbGVkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICB0aGF0LmVtaXQoXCJkYXRhdGFibGUuYWpheC5hYm9ydFwiLCBlLCB4aHIpO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBvbih4aHIsIFwicHJvZ3Jlc3NcIiwgeGhyUHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgb24oeGhyLCBcImxvYWRcIiwgeGhyTG9hZCk7XHJcbiAgICAgICAgICBvbih4aHIsIFwiZXJyb3JcIiwgeGhyRmFpbGVkKTtcclxuICAgICAgICAgIG9uKHhociwgXCJhYm9ydFwiLCB4aHJDYW5jZWxsZWQpO1xyXG5cclxuICAgICAgICAgIHRoYXQuZW1pdChcImRhdGF0YWJsZS5hamF4LmxvYWRpbmdcIiwgeGhyKTtcclxuXHJcbiAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB0eXBlb2YgYWpheCA9PT0gXCJzdHJpbmdcIiA/IG8uYWpheCA6IG8uYWpheC51cmwpO1xyXG4gICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU3RvcmUgcmVmZXJlbmNlc1xyXG4gICAgICB0aGF0LmJvZHkgPSB0aGF0LnRhYmxlLnRCb2RpZXNbMF07XHJcbiAgICAgIHRoYXQuaGVhZCA9IHRoYXQudGFibGUudEhlYWQ7XHJcbiAgICAgIHRoYXQuZm9vdCA9IHRoYXQudGFibGUudEZvb3Q7XHJcblxyXG4gICAgICBpZiAoIXRoYXQuYm9keSkge1xyXG4gICAgICAgICAgdGhhdC5ib2R5ID0gY3JlYXRlRWxlbWVudChcInRib2R5XCIpO1xyXG5cclxuICAgICAgICAgIHRoYXQudGFibGUuYXBwZW5kQ2hpbGQodGhhdC5ib2R5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC5oYXNSb3dzID0gdGhhdC5ib2R5LnJvd3MubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgIC8vIE1ha2UgYSB0SGVhZCBpZiB0aGVyZSBpc24ndCBvbmUgKGZpeGVzICM4KVxyXG4gICAgICBpZiAoIXRoYXQuaGVhZCkge1xyXG4gICAgICAgICAgdmFyIGggPSBjcmVhdGVFbGVtZW50KFwidGhlYWRcIik7XHJcbiAgICAgICAgICB2YXIgdCA9IGNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcclxuXHJcbiAgICAgICAgICBpZiAodGhhdC5oYXNSb3dzKSB7XHJcbiAgICAgICAgICAgICAgZWFjaCh0aGF0LmJvZHkucm93c1swXS5jZWxscywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICB0LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW1lbnQoXCJ0aFwiKSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGguYXBwZW5kQ2hpbGQodCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhhdC5oZWFkID0gaDtcclxuXHJcbiAgICAgICAgICB0aGF0LnRhYmxlLmluc2VydEJlZm9yZSh0aGF0LmhlYWQsIHRoYXQuYm9keSk7XHJcblxyXG4gICAgICAgICAgdGhhdC5oaWRkZW5IZWFkZXIgPSAhby5hamF4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGF0LmhlYWRpbmdzID0gW107XHJcbiAgICAgIHRoYXQuaGFzSGVhZGluZ3MgPSB0aGF0LmhlYWQucm93cy5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgaWYgKHRoYXQuaGFzSGVhZGluZ3MpIHtcclxuICAgICAgICAgIHRoYXQuaGVhZGVyID0gdGhhdC5oZWFkLnJvd3NbMF07XHJcbiAgICAgICAgICB0aGF0LmhlYWRpbmdzID0gW10uc2xpY2UuY2FsbCh0aGF0LmhlYWRlci5jZWxscyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhlYWRlclxyXG4gICAgICBpZiAoIW8uaGVhZGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhhdC5oZWFkKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC50YWJsZS5yZW1vdmVDaGlsZCh0aGF0LnRhYmxlLnRIZWFkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRm9vdGVyXHJcbiAgICAgIGlmIChvLmZvb3Rlcikge1xyXG4gICAgICAgICAgaWYgKHRoYXQuaGVhZCAmJiAhdGhhdC5mb290KSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5mb290ID0gY3JlYXRlRWxlbWVudChcInRmb290XCIsIHtcclxuICAgICAgICAgICAgICAgICAgaHRtbDogdGhhdC5oZWFkLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHRoYXQudGFibGUuYXBwZW5kQ2hpbGQodGhhdC5mb290KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGF0LmZvb3QpIHtcclxuICAgICAgICAgICAgICB0aGF0LnRhYmxlLnJlbW92ZUNoaWxkKHRoYXQudGFibGUudEZvb3QpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBCdWlsZFxyXG4gICAgICB0aGF0LndyYXBwZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcclxuICAgICAgICAgIGNsYXNzOiBcImRhdGFUYWJsZS13cmFwcGVyIGRhdGFUYWJsZS1sb2FkaW5nXCJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBUZW1wbGF0ZSBmb3IgY3VzdG9tIGxheW91dHNcclxuICAgICAgdGVtcGxhdGUgKz0gXCI8ZGl2IGNsYXNzPSdkYXRhVGFibGUtdG9wJz5cIjtcclxuICAgICAgdGVtcGxhdGUgKz0gby5sYXlvdXQudG9wO1xyXG4gICAgICB0ZW1wbGF0ZSArPSBcIjwvZGl2PlwiO1xyXG4gICAgICB0ZW1wbGF0ZSArPSBcIjxkaXYgY2xhc3M9J2RhdGFUYWJsZS1jb250YWluZXInPjwvZGl2PlwiO1xyXG4gICAgICBpZihkZWZhdWx0Q29uZmlnLmluZm8pIHtcclxuICAgICAgICB0ZW1wbGF0ZSArPSBcIjxkaXYgY2xhc3M9J2RhdGFUYWJsZS1ib3R0b20nPlwiO1xyXG4gICAgICAgIHRlbXBsYXRlICs9IG8ubGF5b3V0LmJvdHRvbTtcclxuICAgICAgICB0ZW1wbGF0ZSArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgIC8vIEluZm8gcGxhY2VtZW50XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie2luZm99XCIsIFwiPGRpdiBjbGFzcz0nZGF0YVRhYmxlLWluZm8nPjwvZGl2PlwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgXHJcblxyXG4gICAgICAvLyBQZXIgUGFnZSBTZWxlY3RcclxuICAgICAgaWYgKG8ucGVyUGFnZVNlbGVjdCkge1xyXG4gICAgICAgICAgdmFyIHdyYXAgPSBcIjxkaXYgY2xhc3M9J2RhdGFUYWJsZS1kcm9wZG93bic+PGxhYmVsPlwiO1xyXG4gICAgICAgICAgd3JhcCArPSBvLmxhYmVscy5wZXJQYWdlO1xyXG4gICAgICAgICAgd3JhcCArPSBcIjwvbGFiZWw+PC9kaXY+XCI7XHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBzZWxlY3RcclxuICAgICAgICAgIHZhciBzZWxlY3QgPSBjcmVhdGVFbGVtZW50KFwic2VsZWN0XCIsIHtcclxuICAgICAgICAgICAgICBjbGFzczogXCJkYXRhVGFibGUtc2VsZWN0b3JcIlxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBvcHRpb25zXHJcbiAgICAgICAgICBlYWNoKG8ucGVyUGFnZVNlbGVjdCwgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHZhbCA9PT0gby5wZXJQYWdlO1xyXG4gICAgICAgICAgICAgIHZhciBvcHRpb24gPSBuZXcgT3B0aW9uKHZhbCwgdmFsLCBzZWxlY3RlZCwgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgIHNlbGVjdC5hZGQob3B0aW9uKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIEN1c3RvbSBsYWJlbFxyXG4gICAgICAgICAgd3JhcCA9IHdyYXAucmVwbGFjZShcIntzZWxlY3R9XCIsIHNlbGVjdC5vdXRlckhUTUwpO1xyXG5cclxuICAgICAgICAgIC8vIFNlbGVjdG9yIHBsYWNlbWVudFxyXG4gICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3NlbGVjdH1cIiwgd3JhcCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoXCJ7c2VsZWN0fVwiLCBcIlwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU2VhcmNoYWJsZVxyXG4gICAgICBpZiAoby5zZWFyY2hhYmxlKSB7XHJcbiAgICAgICAgICB2YXIgZm9ybSA9XHJcbiAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdkYXRhVGFibGUtc2VhcmNoJz48aW5wdXQgY2xhc3M9J2RhdGFUYWJsZS1pbnB1dCcgcGxhY2Vob2xkZXI9J1wiICtcclxuICAgICAgICAgICAgICBvLmxhYmVscy5wbGFjZWhvbGRlciArXHJcbiAgICAgICAgICAgICAgXCInIHR5cGU9J3RleHQnPjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAgIC8vIFNlYXJjaCBpbnB1dCBwbGFjZW1lbnRcclxuICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShcIntzZWFyY2h9XCIsIGZvcm0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3NlYXJjaH1cIiwgXCJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGF0Lmhhc0hlYWRpbmdzKSB7XHJcbiAgICAgICAgICAvLyBTb3J0YWJsZVxyXG4gICAgICAgICAgdGhpcy5yZW5kZXIoXCJoZWFkZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkZCB0YWJsZSBjbGFzc1xyXG4gICAgICBjbGFzc0xpc3QuYWRkKHRoYXQudGFibGUsIFwiZGF0YVRhYmxlLXRhYmxlXCIpO1xyXG5cclxuICAgICAgLy8gUGFnaW5hdG9yXHJcbiAgICAgIHZhciB3ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgICBjbGFzczogXCJkYXRhVGFibGUtcGFnaW5hdGlvblwiXHJcbiAgICAgIH0pO1xyXG4gICAgICB2YXIgcGFnaW5hdG9yID0gY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgICB3LmFwcGVuZENoaWxkKHBhZ2luYXRvcik7XHJcblxyXG4gICAgICAvLyBQYWdlcihzKSBwbGFjZW1lbnRcclxuICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHtwYWdlclxcfS9nLCB3Lm91dGVySFRNTCk7XHJcblxyXG4gICAgICB0aGF0LndyYXBwZXIuaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcblxyXG4gICAgICB0aGF0LmNvbnRhaW5lciA9IHRoYXQud3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmRhdGFUYWJsZS1jb250YWluZXJcIik7XHJcblxyXG4gICAgICB0aGF0LnBhZ2VycyA9IHRoYXQud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwiLmRhdGFUYWJsZS1wYWdpbmF0aW9uXCIpO1xyXG5cclxuICAgICAgdGhhdC5sYWJlbCA9IHRoYXQud3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmRhdGFUYWJsZS1pbmZvXCIpO1xyXG5cclxuICAgICAgLy8gSW5zZXJ0IGluIHRvIERPTSB0cmVlXHJcbiAgICAgIHRoYXQudGFibGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQodGhhdC53cmFwcGVyLCB0aGF0LnRhYmxlKTtcclxuICAgICAgdGhhdC5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhhdC50YWJsZSk7XHJcblxyXG4gICAgICAvLyBTdG9yZSB0aGUgdGFibGUgZGltZW5zaW9uc1xyXG4gICAgICB0aGF0LnJlY3QgPSB0aGF0LnRhYmxlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgLy8gQ29udmVydCByb3dzIHRvIGFycmF5IGZvciBwcm9jZXNzaW5nXHJcbiAgICAgIHRoYXQuZGF0YSA9IFtdLnNsaWNlLmNhbGwodGhhdC5ib2R5LnJvd3MpO1xyXG4gICAgICB0aGF0LmFjdGl2ZVJvd3MgPSB0aGF0LmRhdGEuc2xpY2UoKTtcclxuICAgICAgdGhhdC5hY3RpdmVIZWFkaW5ncyA9IHRoYXQuaGVhZGluZ3Muc2xpY2UoKTtcclxuXHJcbiAgICAgIC8vIFVwZGF0ZVxyXG4gICAgICB0aGF0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKCFvLmFqYXgpIHtcclxuICAgICAgICAgIHRoYXQuc2V0Q29sdW1ucygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBGaXggaGVpZ2h0XHJcbiAgICAgIHRoaXMuZml4SGVpZ2h0KCk7XHJcblxyXG4gICAgICAvLyBGaXggY29sdW1uc1xyXG4gICAgICB0aGF0LmZpeENvbHVtbnMoKTtcclxuXHJcbiAgICAgIC8vIENsYXNzIG5hbWVzXHJcbiAgICAgIGlmICghby5oZWFkZXIpIHtcclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGhhdC53cmFwcGVyLCBcIm5vLWhlYWRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFvLmZvb3Rlcikge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aGF0LndyYXBwZXIsIFwibm8tZm9vdGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoby5zb3J0YWJsZSkge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aGF0LndyYXBwZXIsIFwic29ydGFibGVcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLnNlYXJjaGFibGUpIHtcclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGhhdC53cmFwcGVyLCBcInNlYXJjaGFibGVcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLmZpeGVkSGVpZ2h0KSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QuYWRkKHRoYXQud3JhcHBlciwgXCJmaXhlZC1oZWlnaHRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvLmZpeGVkQ29sdW1ucykge1xyXG4gICAgICAgICAgY2xhc3NMaXN0LmFkZCh0aGF0LndyYXBwZXIsIFwiZml4ZWQtY29sdW1uc1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC5iaW5kRXZlbnRzKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVuZGVyIHRoZSBwYWdlXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBwcm90by5yZW5kZXJQYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5oYXNSb3dzICYmIHRoaXMudG90YWxQYWdlcykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPiB0aGlzLnRvdGFsUGFnZXMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBVc2UgYSBmcmFnbWVudCB0byBsaW1pdCB0b3VjaGluZyB0aGUgRE9NXHJcbiAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmN1cnJlbnRQYWdlIC0gMSxcclxuICAgICAgICAgICAgICBmcmFnID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5oYXNIZWFkaW5ncykge1xyXG4gICAgICAgICAgICAgIGZsdXNoKHRoaXMuaGVhZGVyLCB0aGlzLmlzSUUpO1xyXG5cclxuICAgICAgICAgICAgICBlYWNoKHRoaXMuYWN0aXZlSGVhZGluZ3MsIGZ1bmN0aW9uICh0aCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWFjaCh0aGlzLnBhZ2VzW2luZGV4XSwgZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQodGhpcy5yb3dzKCkucmVuZGVyKHJvdykpO1xyXG4gICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jbGVhcihmcmFnKTtcclxuXHJcbiAgICAgICAgICB0aGlzLm9uRmlyc3RQYWdlID0gdGhpcy5jdXJyZW50UGFnZSA9PT0gMTtcclxuICAgICAgICAgIHRoaXMub25MYXN0UGFnZSA9IHRoaXMuY3VycmVudFBhZ2UgPT09IHRoaXMubGFzdFBhZ2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFVwZGF0ZSB0aGUgaW5mb1xyXG4gICAgICB2YXIgY3VycmVudCA9IDAsXHJcbiAgICAgICAgICBmID0gMCxcclxuICAgICAgICAgIHQgPSAwLFxyXG4gICAgICAgICAgaXRlbXM7XHJcblxyXG4gICAgICBpZiAodGhpcy50b3RhbFBhZ2VzKSB7XHJcbiAgICAgICAgICBjdXJyZW50ID0gdGhpcy5jdXJyZW50UGFnZSAtIDE7XHJcbiAgICAgICAgICBmID0gY3VycmVudCAqIHRoaXMub3B0aW9ucy5wZXJQYWdlO1xyXG4gICAgICAgICAgdCA9IGYgKyB0aGlzLnBhZ2VzW2N1cnJlbnRdLmxlbmd0aDtcclxuICAgICAgICAgIGYgPSBmICsgMTtcclxuICAgICAgICAgIGl0ZW1zID0gISF0aGlzLnNlYXJjaGluZyA/IHRoaXMuc2VhcmNoRGF0YS5sZW5ndGggOiB0aGlzLmRhdGEubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5sYWJlbCAmJiB0aGlzLm9wdGlvbnMubGFiZWxzLmluZm8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAvLyBDVVNUT00gTEFCRUxTXHJcbiAgICAgICAgICB2YXIgc3RyaW5nID0gdGhpcy5vcHRpb25zLmxhYmVscy5pbmZvXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7c3RhcnR9XCIsIGYpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7ZW5kfVwiLCB0KVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKFwie3BhZ2V9XCIsIHRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ7cGFnZXN9XCIsIHRoaXMudG90YWxQYWdlcylcclxuICAgICAgICAgICAgICAucmVwbGFjZShcIntyb3dzfVwiLCBpdGVtcyk7XHJcblxyXG4gICAgICAgICAgdGhpcy5sYWJlbC5pbm5lckhUTUwgPSBpdGVtcyA/IHN0cmluZyA6IFwiXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IDEpIHtcclxuICAgICAgICAgIHRoaXMuZml4SGVpZ2h0KCk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW5kZXIgdGhlIHBhZ2VyKHMpXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBwcm90by5yZW5kZXJQYWdlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgZmx1c2godGhpcy5wYWdlcnMsIHRoaXMuaXNJRSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50b3RhbFBhZ2VzID4gMSkge1xyXG4gICAgICAgICAgdmFyIGMgPSBcInBhZ2VyXCIsXHJcbiAgICAgICAgICAgICAgZnJhZyA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgICAgcHJldiA9IHRoaXMub25GaXJzdFBhZ2UgPyAxIDogdGhpcy5jdXJyZW50UGFnZSAtIDEsXHJcbiAgICAgICAgICAgICAgbmV4dCA9IHRoaXMub25sYXN0UGFnZSA/IHRoaXMudG90YWxQYWdlcyA6IHRoaXMuY3VycmVudFBhZ2UgKyAxO1xyXG5cclxuICAgICAgICAgIC8vIGZpcnN0IGJ1dHRvblxyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maXJzdExhc3QpIHtcclxuICAgICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGJ1dHRvbihjLCAxLCB0aGlzLm9wdGlvbnMuZmlyc3RUZXh0KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gcHJldiBidXR0b25cclxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubmV4dFByZXYpIHtcclxuICAgICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGJ1dHRvbihjLCBwcmV2LCB0aGlzLm9wdGlvbnMucHJldlRleHQpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgcGFnZXIgPSB0aGlzLmxpbmtzO1xyXG5cclxuICAgICAgICAgIC8vIHRydW5jYXRlIHRoZSBsaW5rc1xyXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50cnVuY2F0ZVBhZ2VyKSB7XHJcbiAgICAgICAgICAgICAgcGFnZXIgPSB0cnVuY2F0ZShcclxuICAgICAgICAgICAgICAgICAgdGhpcy5saW5rcyxcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSxcclxuICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlckRlbHRhLFxyXG4gICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxsaXBzaXNUZXh0XHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBhY3RpdmUgcGFnZSBsaW5rXHJcbiAgICAgICAgICBjbGFzc0xpc3QuYWRkKHRoaXMubGlua3NbdGhpcy5jdXJyZW50UGFnZSAtIDFdLCBcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAvLyBhcHBlbmQgdGhlIGxpbmtzXHJcbiAgICAgICAgICBlYWNoKHBhZ2VyLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUocCwgXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsYXNzTGlzdC5hZGQodGhpcy5saW5rc1t0aGlzLmN1cnJlbnRQYWdlIC0gMV0sIFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgIC8vIG5leHQgYnV0dG9uXHJcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm5leHRQcmV2KSB7XHJcbiAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChidXR0b24oYywgbmV4dCwgdGhpcy5vcHRpb25zLm5leHRUZXh0KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gZmlyc3QgYnV0dG9uXHJcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpcnN0TGFzdCkge1xyXG4gICAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoYnV0dG9uKGMsIHRoaXMudG90YWxQYWdlcywgdGhpcy5vcHRpb25zLmxhc3RUZXh0KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gV2UgbWF5IGhhdmUgbW9yZSB0aGFuIG9uZSBwYWdlclxyXG4gICAgICAgICAgZWFjaCh0aGlzLnBhZ2VycywgZnVuY3Rpb24gKHBhZ2VyKSB7XHJcbiAgICAgICAgICAgICAgcGFnZXIuYXBwZW5kQ2hpbGQoZnJhZy5jbG9uZU5vZGUodHJ1ZSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZW5kZXIgdGhlIGhlYWRlclxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucmVuZGVySGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICB0aGF0LmxhYmVscyA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoYXQuaGVhZGluZ3MgJiYgdGhhdC5oZWFkaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgIGVhY2godGhhdC5oZWFkaW5ncywgZnVuY3Rpb24gKHRoLCBpKSB7XHJcblxyXG4gICAgICAgICAgICAgIHRoYXQubGFiZWxzW2ldID0gdGgudGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnModGguZmlyc3RFbGVtZW50Q2hpbGQsIFwiZGF0YVRhYmxlLXNvcnRlclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICB0aC5pbm5lckhUTUwgPSB0aC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB0aC5zb3J0YWJsZSA9IHRoLmdldEF0dHJpYnV0ZShcImRhdGEtc29ydGFibGVcIikgIT09IFwiZmFsc2VcIjtcclxuXHJcbiAgICAgICAgICAgICAgdGgub3JpZ2luYWxDZWxsSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc29ydGFibGUgJiYgdGguc29ydGFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBjcmVhdGVFbGVtZW50KFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBocmVmOiBcIiNcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImRhdGFUYWJsZS1zb3J0ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IHRoLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgIHRoLnNldEF0dHJpYnV0ZShcImRhdGEtc29ydGFibGVcIiwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgIHRoLmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGF0LmZpeENvbHVtbnMoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBCaW5kIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHByb3RvLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcyxcclxuICAgICAgICAgIG8gPSB0aGF0Lm9wdGlvbnM7XHJcblxyXG4gICAgICAvLyBQZXIgcGFnZSBzZWxlY3RvclxyXG4gICAgICBpZiAoby5wZXJQYWdlU2VsZWN0KSB7XHJcbiAgICAgICAgICB2YXIgc2VsZWN0b3IgPSB0aGF0LndyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5kYXRhVGFibGUtc2VsZWN0b3JcIik7XHJcbiAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGVyIHBhZ2VcclxuICAgICAgICAgICAgICBvbihzZWxlY3RvciwgXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgby5wZXJQYWdlID0gcGFyc2VJbnQodGhpcy52YWx1ZSwgMTApO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC5maXhIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuZW1pdChcImRhdGF0YWJsZS5wZXJwYWdlXCIsIG8ucGVyUGFnZSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbnB1dFxyXG4gICAgICBpZiAoby5zZWFyY2hhYmxlKSB7XHJcbiAgICAgICAgICB0aGF0LmlucHV0ID0gdGhhdC53cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YVRhYmxlLWlucHV0XCIpO1xyXG4gICAgICAgICAgaWYgKHRoYXQuaW5wdXQpIHtcclxuICAgICAgICAgICAgICBvbih0aGF0LmlucHV0LCBcImtleXVwXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuc2VhcmNoKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBQYWdlcihzKSAvIHNvcnRpbmdcclxuICAgICAgb24odGhhdC53cmFwcGVyLCBcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgaWYgKHQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhXCIpIHtcclxuICAgICAgICAgICAgICBpZiAodC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBhZ2VcIikpIHtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5wYWdlKHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYWdlXCIpKTtcclxuICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAgIG8uc29ydGFibGUgJiZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmNvbnRhaW5zKHQsIFwiZGF0YVRhYmxlLXNvcnRlclwiKSAmJlxyXG4gICAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb3J0YWJsZVwiKSAhPSBcImZhbHNlXCJcclxuICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5jb2x1bW5zKCkuc29ydCh0aGF0LmFjdGl2ZUhlYWRpbmdzLmluZGV4T2YodC5wYXJlbnROb2RlKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXQgdXAgY29sdW1uc1xyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHByb3RvLnNldENvbHVtbnMgPSBmdW5jdGlvbiAoYWpheCkge1xyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKCFhamF4KSB7XHJcbiAgICAgICAgICBlYWNoKHRoYXQuZGF0YSwgZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgIGVhY2gocm93LmNlbGxzLCBmdW5jdGlvbiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLmRhdGEgPSBjZWxsLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgdGhlIGNvbHVtbnMgb3B0aW9uXHJcbiAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY29sdW1ucyAmJiB0aGF0LmhlYWRpbmdzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgIGVhY2godGhhdC5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIGNvbnZlcnQgc2luZ2xlIGNvbHVtbiBzZWxlY3Rpb24gdG8gYXJyYXlcclxuICAgICAgICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YS5zZWxlY3QpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuc2VsZWN0ID0gW2RhdGEuc2VsZWN0XTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwicmVuZGVyXCIpICYmIHR5cGVvZiBkYXRhLnJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRDb2x1bW5zID0gdGhhdC5zZWxlY3RlZENvbHVtbnMuY29uY2F0KGRhdGEuc2VsZWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuY29sdW1uUmVuZGVyZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uczogZGF0YS5zZWxlY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlcjogZGF0YS5yZW5kZXJcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgYXR0cmlidXRlcyB0byB0aGUgdGggZWxlbWVudHNcclxuICAgICAgICAgICAgICBlYWNoKGRhdGEuc2VsZWN0LCBmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aCA9IHRoYXQuaGVhZGluZ3NbY29sdW1uXTtcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGguc2V0QXR0cmlidXRlKFwiZGF0YS10eXBlXCIsIGRhdGEudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWZvcm1hdFwiLCBkYXRhLmZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJzb3J0YWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGguc2V0QXR0cmlidXRlKFwiZGF0YS1zb3J0YWJsZVwiLCBkYXRhLnNvcnRhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJoaWRkZW5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmhpZGRlbiAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbHVtbnMoKS5oaWRlKGNvbHVtbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwic29ydFwiKSAmJiBkYXRhLnNlbGVjdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY29sdW1ucygpLnNvcnQoZGF0YS5zZWxlY3RbMF0gKyAxLCBkYXRhLnNvcnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoYXQuaGFzUm93cykge1xyXG4gICAgICAgICAgZWFjaCh0aGF0LmRhdGEsIGZ1bmN0aW9uIChyb3csIGkpIHtcclxuICAgICAgICAgICAgICByb3cuZGF0YUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICAgICAgY2VsbC5kYXRhID0gY2VsbC5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZENvbHVtbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgZWFjaCh0aGF0LmRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICAgICAgZWFjaChyb3cuY2VsbHMsIGZ1bmN0aW9uIChjZWxsLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5zZWxlY3RlZENvbHVtbnMuaW5kZXhPZihpKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaCh0aGF0LmNvbHVtblJlbmRlcmVycywgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8uY29sdW1ucy5pbmRleE9mKGkpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MID0gby5yZW5kZXJlci5jYWxsKHRoYXQsIGNlbGwuZGF0YSwgY2VsbCwgcm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGF0LmNvbHVtbnMoKS5yZWJ1aWxkKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoYXQucmVuZGVyKFwiaGVhZGVyXCIpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc3Ryb3kgdGhlIGluc3RhbmNlXHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnRhYmxlLmlubmVySFRNTCA9IHRoaXMuaW5pdGlhbExheW91dDtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0aGUgY2xhc3NOYW1lXHJcbiAgICAgIGNsYXNzTGlzdC5yZW1vdmUodGhpcy50YWJsZSwgXCJkYXRhVGFibGUtdGFibGVcIik7XHJcblxyXG4gICAgICAvLyBSZW1vdmUgdGhlIGNvbnRhaW5lcnNcclxuICAgICAgdGhpcy53cmFwcGVyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRoaXMudGFibGUsIHRoaXMud3JhcHBlcik7XHJcblxyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBpbnN0YW5jZVxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8udXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBjbGFzc0xpc3QucmVtb3ZlKHRoaXMud3JhcHBlciwgXCJkYXRhVGFibGUtZW1wdHlcIik7XHJcblxyXG4gICAgICB0aGlzLnBhZ2luYXRlKHRoaXMpO1xyXG4gICAgICB0aGlzLnJlbmRlcihcInBhZ2VcIik7XHJcblxyXG4gICAgICB0aGlzLmxpbmtzID0gW107XHJcblxyXG4gICAgICB2YXIgaSA9IHRoaXMucGFnZXMubGVuZ3RoO1xyXG4gICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICB2YXIgbnVtID0gaSArIDE7XHJcbiAgICAgICAgICB0aGlzLmxpbmtzW2ldID0gYnV0dG9uKGkgPT09IDAgPyBcImFjdGl2ZVwiIDogXCJcIiwgbnVtLCBudW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNvcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgIHRoaXMucmVuZGVyKFwicGFnZXJcIik7XHJcblxyXG4gICAgICB0aGlzLnJvd3MoKS51cGRhdGUoKTtcclxuXHJcbiAgICAgIHRoaXMuZW1pdChcImRhdGF0YWJsZS51cGRhdGVcIik7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU29ydCByb3dzIGludG8gcGFnZXNcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgcHJvdG8ucGFnaW5hdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwZXJQYWdlID0gdGhpcy5vcHRpb25zLnBlclBhZ2UsXHJcbiAgICAgICAgICByb3dzID0gdGhpcy5hY3RpdmVSb3dzO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2VhcmNoaW5nKSB7XHJcbiAgICAgICAgICByb3dzID0gW107XHJcblxyXG4gICAgICAgICAgZWFjaCh0aGlzLnNlYXJjaERhdGEsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgIHJvd3MucHVzaCh0aGlzLmFjdGl2ZVJvd3NbaW5kZXhdKTtcclxuICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDaGVjayBmb3IgaGlkZGVuIGNvbHVtbnNcclxuICAgICAgdGhpcy5wYWdlcyA9IHJvd3NcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHRyLCBpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGkgJSBwZXJQYWdlID09PSAwID8gcm93cy5zbGljZShpLCBpICsgcGVyUGFnZSkgOiBudWxsO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHBhZ2UpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy50b3RhbFBhZ2VzID0gdGhpcy5sYXN0UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoO1xyXG5cclxuICAgICAgcmV0dXJuIHRoaXMudG90YWxQYWdlcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBGaXggY29sdW1uIHdpZHRoc1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uZml4Q29sdW1ucyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZml4ZWRDb2x1bW5zICYmIHRoaXMuYWN0aXZlSGVhZGluZ3MgJiYgdGhpcy5hY3RpdmVIZWFkaW5ncy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICB2YXIgY2VsbHMsXHJcbiAgICAgICAgICAgICAgaGQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbHVtbldpZHRocyA9IFtdO1xyXG5cclxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgaGVhZGluZ3Mgd2UgbmVlZCBvbmx5IHNldCB0aGUgd2lkdGhzIG9uIHRoZW1cclxuICAgICAgICAgIC8vIG90aGVyd2lzZSB3ZSBuZWVkIGEgdGVtcCBoZWFkZXIgYW5kIHRoZSB3aWR0aHMgbmVlZCBhcHBseWluZyB0byBhbGwgY2VsbHNcclxuICAgICAgICAgIGlmICh0aGlzLnRhYmxlLnRIZWFkKSB7XHJcbiAgICAgICAgICAgICAgLy8gUmVzZXQgd2lkdGhzXHJcbiAgICAgICAgICAgICAgZWFjaCh0aGlzLmFjdGl2ZUhlYWRpbmdzLCBmdW5jdGlvbiAoY2VsbCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLndpZHRoID0gXCJcIjtcclxuICAgICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgZWFjaCh0aGlzLmFjdGl2ZUhlYWRpbmdzLCBmdW5jdGlvbiAoY2VsbCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgb3cgPSBjZWxsLm9mZnNldFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdyA9IG93IC8gdGhpcy5yZWN0LndpZHRoICogMTAwO1xyXG4gICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLndpZHRoID0gdyArIFwiJVwiO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbldpZHRoc1tpXSA9IG93O1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjZWxscyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAvLyBNYWtlIHRlbXBlcmFyeSBoZWFkaW5nc1xyXG4gICAgICAgICAgICAgIGhkID0gY3JlYXRlRWxlbWVudChcInRoZWFkXCIpO1xyXG4gICAgICAgICAgICAgIHZhciByID0gY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICAgICAgICAgIHZhciBjID0gdGhpcy50YWJsZS50Qm9kaWVzWzBdLnJvd3NbMF0uY2VsbHM7XHJcbiAgICAgICAgICAgICAgZWFjaChjLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aCA9IGNyZWF0ZUVsZW1lbnQoXCJ0aFwiKTtcclxuICAgICAgICAgICAgICAgICAgci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2godGgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBoZC5hcHBlbmRDaGlsZChyKTtcclxuICAgICAgICAgICAgICB0aGlzLnRhYmxlLmluc2VydEJlZm9yZShoZCwgdGhpcy5ib2R5KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIHdpZHRocyA9IFtdO1xyXG4gICAgICAgICAgICAgIGVhY2goY2VsbHMsIGZ1bmN0aW9uIChjZWxsLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBvdyA9IGNlbGwub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB3ID0gb3cgLyB0aGlzLnJlY3Qud2lkdGggKiAxMDA7XHJcbiAgICAgICAgICAgICAgICAgIHdpZHRocy5wdXNoKHcpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbldpZHRoc1tpXSA9IG93O1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICBlYWNoKHRoaXMuZGF0YSwgZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbHVtbnMoY2VsbC5jZWxsSW5kZXgpLnZpc2libGUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLndpZHRoID0gd2lkdGhzW2ldICsgXCIlXCI7XHJcbiAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBEaXNjYXJkIHRoZSB0ZW1wIGhlYWRlclxyXG4gICAgICAgICAgICAgIHRoaXMudGFibGUucmVtb3ZlQ2hpbGQoaGQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRml4IHRoZSBjb250YWluZXIgaGVpZ2h0O1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uZml4SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmZpeGVkSGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgdGhpcy5yZWN0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSB0aGlzLnJlY3QuaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybSBhIHNlYXJjaCBvZiB0aGUgZGF0YSBzZXRcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHF1ZXJ5XHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5zZWFyY2ggPSBmdW5jdGlvbiAocXVlcnkpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgIHF1ZXJ5ID0gcXVlcnkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICB0aGlzLnNlYXJjaGluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuc2VhcmNoRGF0YSA9IFtdO1xyXG5cclxuICAgICAgaWYgKCFxdWVyeS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRoaXMuc2VhcmNoaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgdGhpcy5lbWl0KFwiZGF0YXRhYmxlLnNlYXJjaFwiLCBxdWVyeSwgdGhpcy5zZWFyY2hEYXRhKTtcclxuICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUodGhpcy53cmFwcGVyLCBcInNlYXJjaC1yZXN1bHRzXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICBlYWNoKHRoaXMuZGF0YSwgZnVuY3Rpb24gKHJvdywgaWR4KSB7XHJcbiAgICAgICAgICB2YXIgaW5BcnJheSA9IHRoaXMuc2VhcmNoRGF0YS5pbmRleE9mKHJvdykgPiAtMTtcclxuXHJcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9iaXVzMS9WYW5pbGxhLURhdGFUYWJsZXMvaXNzdWVzLzEyXHJcbiAgICAgICAgICB2YXIgZG9lc1F1ZXJ5TWF0Y2ggPSBxdWVyeS5zcGxpdChcIiBcIikucmVkdWNlKGZ1bmN0aW9uIChib29sLCB3b3JkKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGluY2x1ZGVzID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGNlbGwgPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByb3cuY2VsbHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgY2VsbCA9IHJvdy5jZWxsc1t4XTtcclxuICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNlbGwuaGFzQXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKSA/IGNlbGwuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKSA6IGNlbGwudGV4dENvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih3b3JkKSA+IC0xICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbHVtbnMoY2VsbC5jZWxsSW5kZXgpLnZpc2libGUoKVxyXG4gICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gYm9vbCAmJiBpbmNsdWRlcztcclxuICAgICAgICAgIH0sIHRydWUpO1xyXG5cclxuICAgICAgICAgIGlmIChkb2VzUXVlcnlNYXRjaCAmJiAhaW5BcnJheSkge1xyXG4gICAgICAgICAgICAgIHJvdy5zZWFyY2hJbmRleCA9IGlkeDtcclxuICAgICAgICAgICAgICB0aGlzLnNlYXJjaERhdGEucHVzaChpZHgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByb3cuc2VhcmNoSW5kZXggPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgIGNsYXNzTGlzdC5hZGQodGhpcy53cmFwcGVyLCBcInNlYXJjaC1yZXN1bHRzXCIpO1xyXG5cclxuICAgICAgaWYgKCF0aGF0LnNlYXJjaERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKHRoYXQud3JhcHBlciwgXCJzZWFyY2gtcmVzdWx0c1wiKTtcclxuXHJcbiAgICAgICAgICB0aGF0LnNldE1lc3NhZ2UodGhhdC5vcHRpb25zLmxhYmVscy5ub1Jvd3MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5lbWl0KFwiZGF0YXRhYmxlLnNlYXJjaFwiLCBxdWVyeSwgdGhpcy5zZWFyY2hEYXRhKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGFuZ2UgcGFnZVxyXG4gICAqIEBwYXJhbSAge2ludH0gcGFnZVxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucGFnZSA9IGZ1bmN0aW9uIChwYWdlKSB7XHJcbiAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gbG9hZCB0aGUgY3VycmVudCBwYWdlIGFnYWluLlxyXG4gICAgICBpZiAocGFnZSA9PSB0aGlzLmN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghaXNOYU4ocGFnZSkpIHtcclxuICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBwYXJzZUludChwYWdlLCAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYWdlID4gdGhpcy5wYWdlcy5sZW5ndGggfHwgcGFnZSA8IDApIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5yZW5kZXIoXCJwYWdlXCIpO1xyXG4gICAgICB0aGlzLnJlbmRlcihcInBhZ2VyXCIpO1xyXG5cclxuICAgICAgdGhpcy5lbWl0KFwiZGF0YXRhYmxlLnBhZ2VcIiwgcGFnZSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU29ydCBieSBjb2x1bW5cclxuICAgKiBAcGFyYW0gIHtpbnR9IGNvbHVtbiAtIFRoZSBjb2x1bW4gbm8uXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSBkaXJlY3Rpb24gLSBhc2Mgb3IgZGVzY1xyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uc29ydENvbHVtbiA9IGZ1bmN0aW9uIChjb2x1bW4sIGRpcmVjdGlvbikge1xyXG4gICAgICAvLyBVc2UgY29sdW1ucyBBUEkgdW50aWwgc29ydENvbHVtbiBtZXRob2QgaXMgcmVtb3ZlZFxyXG4gICAgICB0aGlzLmNvbHVtbnMoKS5zb3J0KGNvbHVtbiwgZGlyZWN0aW9uKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGQgbmV3IHJvdyBkYXRhXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFcclxuICAgKi9cclxuICBwcm90by5pbnNlcnQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgdmFyIHRoYXQgPSB0aGlzLFxyXG4gICAgICAgICAgcm93cyA9IFtdO1xyXG4gICAgICBpZiAoaXNPYmplY3QoZGF0YSkpIHtcclxuICAgICAgICAgIGlmIChkYXRhLmhlYWRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCF0aGF0Lmhhc0hlYWRpbmdzICYmICF0aGF0Lmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRyID0gY3JlYXRlRWxlbWVudChcInRyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGg7XHJcbiAgICAgICAgICAgICAgICAgIGVhY2goZGF0YS5oZWFkaW5ncywgZnVuY3Rpb24gKGhlYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoID0gY3JlYXRlRWxlbWVudChcInRoXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sOiBoZWFkaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0LmhlYWQuYXBwZW5kQ2hpbGQodHIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIgPSB0cjtcclxuICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkaW5ncyA9IFtdLnNsaWNlLmNhbGwodHIuY2VsbHMpO1xyXG4gICAgICAgICAgICAgICAgICB0aGF0Lmhhc0hlYWRpbmdzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFJlLWVuYWJsZSBzb3J0aW5nIGlmIGl0IHdhcyBkaXNhYmxlZCBkdWVcclxuICAgICAgICAgICAgICAgICAgLy8gdG8gbWlzc2luZyBoZWFkZXJcclxuICAgICAgICAgICAgICAgICAgdGhhdC5vcHRpb25zLnNvcnRhYmxlID0gdGhhdC5pbml0aWFsU29ydGFibGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBBbGxvdyBzb3J0aW5nIG9uIG5ldyBoZWFkZXJcclxuICAgICAgICAgICAgICAgICAgdGhhdC5yZW5kZXIoXCJoZWFkZXJcIik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgaXNBcnJheShkYXRhLmRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgcm93cyA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgICBlYWNoKGRhdGEsIGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICB2YXIgciA9IFtdO1xyXG4gICAgICAgICAgICAgIGVhY2gocm93LCBmdW5jdGlvbiAoY2VsbCwgaGVhZGluZykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhhdC5sYWJlbHMuaW5kZXhPZihoZWFkaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByW2luZGV4XSA9IGNlbGw7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByb3dzLnB1c2gocik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJvd3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGF0LnJvd3MoKS5hZGQocm93cyk7XHJcblxyXG4gICAgICAgICAgdGhhdC5oYXNSb3dzID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhhdC51cGRhdGUoKTtcclxuXHJcbiAgICAgIHRoYXQuZml4Q29sdW1ucygpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZnJlc2ggdGhlIGluc3RhbmNlXHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNlYXJjaGFibGUpIHtcclxuICAgICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgdGhpcy5zZWFyY2hpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgdGhpcy5vbkZpcnN0UGFnZSA9IHRydWU7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICB0aGlzLmVtaXQoXCJkYXRhdGFibGUucmVmcmVzaFwiKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUcnVuY2F0ZSB0aGUgdGFibGVcclxuICAgKiBAcGFyYW0gIHttaXhlc30gaHRtbCAtIEhUTUwgc3RyaW5nIG9yIEhUTUxFbGVtZW50XHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICBwcm90by5jbGVhciA9IGZ1bmN0aW9uIChodG1sKSB7XHJcbiAgICAgIGlmICh0aGlzLmJvZHkpIHtcclxuICAgICAgICAgIGZsdXNoKHRoaXMuYm9keSwgdGhpcy5pc0lFKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHBhcmVudCA9IHRoaXMuYm9keTtcclxuICAgICAgaWYgKCF0aGlzLmJvZHkpIHtcclxuICAgICAgICAgIHBhcmVudCA9IHRoaXMudGFibGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChodG1sKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIGh0bWwgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgZnJhZyA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgICAgICAgZnJhZy5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChodG1sKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydCB0YWJsZSB0byB2YXJpb3VzIGZvcm1hdHMgKGNzdiwgdHh0IG9yIHNxbClcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgVXNlciBvcHRpb25zXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBwcm90by5leHBvcnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzSGVhZGluZ3MgJiYgIXRoaXMuaGFzUm93cykgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgdmFyIGhlYWRlcnMgPSB0aGlzLmFjdGl2ZUhlYWRpbmdzLFxyXG4gICAgICAgICAgcm93cyA9IFtdLFxyXG4gICAgICAgICAgYXJyID0gW10sXHJcbiAgICAgICAgICBpLFxyXG4gICAgICAgICAgeCxcclxuICAgICAgICAgIHN0cixcclxuICAgICAgICAgIGxpbms7XHJcblxyXG4gICAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICBkb3dubG9hZDogdHJ1ZSxcclxuICAgICAgICAgIHNraXBDb2x1bW46IFtdLFxyXG5cclxuICAgICAgICAgIC8vIGNzdlxyXG4gICAgICAgICAgbGluZURlbGltaXRlcjogXCJcXG5cIixcclxuICAgICAgICAgIGNvbHVtbkRlbGltaXRlcjogXCIsXCIsXHJcblxyXG4gICAgICAgICAgLy8gc3FsXHJcbiAgICAgICAgICB0YWJsZU5hbWU6IFwibXlUYWJsZVwiLFxyXG5cclxuICAgICAgICAgIC8vIGpzb25cclxuICAgICAgICAgIHJlcGxhY2VyOiBudWxsLFxyXG4gICAgICAgICAgc3BhY2U6IDRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciB0aGUgb3B0aW9ucyBvYmplY3RcclxuICAgICAgaWYgKCFpc09iamVjdChvcHRpb25zKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgbyA9IGV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICBpZiAoby50eXBlKSB7XHJcbiAgICAgICAgICBpZiAoby50eXBlID09PSBcInR4dFwiIHx8IG8udHlwZSA9PT0gXCJjc3ZcIikge1xyXG4gICAgICAgICAgICAgIC8vIEluY2x1ZGUgaGVhZGluZ3NcclxuICAgICAgICAgICAgICByb3dzWzBdID0gdGhpcy5oZWFkZXI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gU2VsZWN0aW9uIG9yIHdob2xlIHRhYmxlXHJcbiAgICAgICAgICBpZiAoby5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAvLyBQYWdlIG51bWJlclxyXG4gICAgICAgICAgICAgIGlmICghaXNOYU4oby5zZWxlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJvd3MgPSByb3dzLmNvbmNhdCh0aGlzLnBhZ2VzW28uc2VsZWN0aW9uIC0gMV0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShvLnNlbGVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb2YgcGFnZSBudW1iZXJzXHJcbiAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvLnNlbGVjdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcm93cyA9IHJvd3MuY29uY2F0KHRoaXMucGFnZXNbby5zZWxlY3Rpb25baV0gLSAxXSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJvd3MgPSByb3dzLmNvbmNhdCh0aGlzLmFjdGl2ZVJvd3MpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIE9ubHkgcHJvY2VlZCBpZiB3ZSBoYXZlIGRhdGFcclxuICAgICAgICAgIGlmIChyb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGlmIChvLnR5cGUgPT09IFwidHh0XCIgfHwgby50eXBlID09PSBcImNzdlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIHN0ciA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHJvd3NbaV0uY2VsbHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sdW1uIHNraXAgYW5kIHZpc2liaWxpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2tpcENvbHVtbi5pbmRleE9mKGhlYWRlcnNbeF0ub3JpZ2luYWxDZWxsSW5kZXgpIDwgMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbnMoaGVhZGVyc1t4XS5vcmlnaW5hbENlbGxJbmRleCkudmlzaWJsZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gcm93c1tpXS5jZWxsc1t4XS50ZXh0Q29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHN7Mix9L2csICcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcbi9nLCAnICAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXCIvZywgJ1wiXCInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQuaW5kZXhPZihcIixcIikgPiAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAnXCInICsgdGV4dCArICdcIic7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IHRleHQgKyBvLmNvbHVtbkRlbGltaXRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgY29sdW1uIGRlbGltaXRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnRyaW0oKS5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGx5IGxpbmUgZGVsaW1pdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gby5saW5lRGVsaW1pdGVyO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgbGluZSBkZWxpbWl0ZXJcclxuICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnRyaW0oKS5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFwiICsgc3RyO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnR5cGUgPT09IFwic3FsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gQmVnaW4gSU5TRVJUIHN0YXRlbWVudFxyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBcIklOU0VSVCBJTlRPIGBcIiArIG8udGFibGVOYW1lICsgXCJgIChcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGFibGUgaGVhZGluZ3MgdG8gY29sdW1uIG5hbWVzXHJcbiAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sdW1uIHNraXAgYW5kIGNvbHVtbiB2aXNpYmlsaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgby5za2lwQ29sdW1uLmluZGV4T2YoaGVhZGVyc1tpXS5vcmlnaW5hbENlbGxJbmRleCkgPCAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5zKGhlYWRlcnNbaV0ub3JpZ2luYWxDZWxsSW5kZXgpLnZpc2libGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiYFwiICsgaGVhZGVyc1tpXS50ZXh0Q29udGVudCArIFwiYCxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIGNvbW1hXHJcbiAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci50cmltKCkuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIEJlZ2luIFZBTFVFU1xyXG4gICAgICAgICAgICAgICAgICBzdHIgKz0gXCIpIFZBTFVFUyBcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgcm93cyBhbmQgY29udmVydCBjZWxsIGRhdGEgdG8gY29sdW1uIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFwiKFwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCByb3dzW2ldLmNlbGxzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGNvbHVtbiBza2lwIGFuZCBjb2x1bW4gdmlzaWJpbGl0eVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5za2lwQ29sdW1uLmluZGV4T2YoaGVhZGVyc1t4XS5vcmlnaW5hbENlbGxJbmRleCkgPCAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sdW1ucyhoZWFkZXJzW3hdLm9yaWdpbmFsQ2VsbEluZGV4KS52aXNpYmxlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcIicgKyByb3dzW2ldLmNlbGxzW3hdLnRleHRDb250ZW50ICsgJ1wiLCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBjb21tYVxyXG4gICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnRyaW0oKS5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIC8vIGVuZCBWQUxVRVNcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBcIiksXCI7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBjb21tYVxyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBzdHIudHJpbSgpLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBBZGQgdHJhaWxpbmcgY29sb25cclxuICAgICAgICAgICAgICAgICAgc3RyICs9IFwiO1wiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiZGF0YTphcHBsaWNhdGlvbi9zcWw7Y2hhcnNldD11dGYtOCxcIiArIHN0cjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoby50eXBlID09PSBcImpzb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIHJvd3NcclxuICAgICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHJvd3MubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGFyclt4XSA9IGFyclt4XSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZXJhdGUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgY29sdW1uIHNraXAgYW5kIGNvbHVtbiB2aXNpYmlsaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnNraXBDb2x1bW4uaW5kZXhPZihoZWFkZXJzW2ldLm9yaWdpbmFsQ2VsbEluZGV4KSA8IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5zKGhlYWRlcnNbaV0ub3JpZ2luYWxDZWxsSW5kZXgpLnZpc2libGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJbeF1baGVhZGVyc1tpXS50ZXh0Q29udGVudF0gPSByb3dzW3hdLmNlbGxzW2ldLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgYXJyYXkgb2Ygb2JqZWN0cyB0byBKU09OIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBKU09OLnN0cmluZ2lmeShhcnIsIG8ucmVwbGFjZXIsIG8uc3BhY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IFwiZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgsXCIgKyBzdHI7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIERvd25sb2FkXHJcbiAgICAgICAgICAgICAgaWYgKG8uZG93bmxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gRmlsZW5hbWVcclxuICAgICAgICAgICAgICAgICAgby5maWxlbmFtZSA9IG8uZmlsZW5hbWUgfHwgXCJkYXRhdGFibGVfZXhwb3J0XCI7XHJcbiAgICAgICAgICAgICAgICAgIG8uZmlsZW5hbWUgKz0gXCIuXCIgKyBvLnR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICBzdHIgPSBlbmNvZGVVUkkoc3RyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGxpbmsgdG8gdHJpZ2dlciB0aGUgZG93bmxvYWRcclxuICAgICAgICAgICAgICAgICAgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBzdHI7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmsuZG93bmxvYWQgPSBvLmZpbGVuYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBsaW5rXHJcbiAgICAgICAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIHRoZSBkb3dubG9hZFxyXG4gICAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGxpbmtcclxuICAgICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBJbXBvcnQgZGF0YSB0byB0aGUgdGFibGVcclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgVXNlciBvcHRpb25zXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBwcm90by5pbXBvcnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICB2YXIgb2JqID0gZmFsc2U7XHJcbiAgICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICAgIC8vIGNzdlxyXG4gICAgICAgICAgbGluZURlbGltaXRlcjogXCJcXG5cIixcclxuICAgICAgICAgIGNvbHVtbkRlbGltaXRlcjogXCIsXCJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciB0aGUgb3B0aW9ucyBvYmplY3RcclxuICAgICAgaWYgKCFpc09iamVjdChvcHRpb25zKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmRhdGEubGVuZ3RoIHx8IGlzT2JqZWN0KG9wdGlvbnMuZGF0YSkpIHtcclxuICAgICAgICAgIC8vIEltcG9ydCBDU1ZcclxuICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09IFwiY3N2XCIpIHtcclxuICAgICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gU3BsaXQgdGhlIHN0cmluZyBpbnRvIHJvd3NcclxuICAgICAgICAgICAgICB2YXIgcm93cyA9IG9wdGlvbnMuZGF0YS5zcGxpdChvcHRpb25zLmxpbmVEZWxpbWl0ZXIpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhlYWRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvYmouaGVhZGluZ3MgPSByb3dzWzBdLnNwbGl0KG9wdGlvbnMuY29sdW1uRGVsaW1pdGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICByb3dzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGVhY2gocm93cywgZnVuY3Rpb24gKHJvdywgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb2JqLmRhdGFbaV0gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBTcGxpdCB0aGUgcm93cyBpbnRvIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHJvdy5zcGxpdChvcHRpb25zLmNvbHVtbkRlbGltaXRlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoKHZhbHVlcywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5kYXRhW2ldLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PT0gXCJqc29uXCIpIHtcclxuICAgICAgICAgICAgICB2YXIganNvbiA9IGlzSnNvbihvcHRpb25zLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAvLyBWYWxpZCBKU09OIHN0cmluZ1xyXG4gICAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGhlYWRpbmdzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICBlYWNoKGpzb24sIGZ1bmN0aW9uIChkYXRhLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvYmouZGF0YVtpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbiAodmFsdWUsIGNvbHVtbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmouaGVhZGluZ3MuaW5kZXhPZihjb2x1bW4pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaGVhZGluZ3MucHVzaChjb2x1bW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmRhdGFbaV0ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVGhhdCdzIG5vdCB2YWxpZCBKU09OIVwiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlzT2JqZWN0KG9wdGlvbnMuZGF0YSkpIHtcclxuICAgICAgICAgICAgICBvYmogPSBvcHRpb25zLmRhdGE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICAgIC8vIEFkZCB0aGUgcm93c1xyXG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KG9iaik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIFByaW50IHRoZSB0YWJsZVxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ucHJpbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBoZWFkaW5ncyA9IHRoaXMuYWN0aXZlSGVhZGluZ3M7XHJcbiAgICAgIHZhciByb3dzID0gdGhpcy5hY3RpdmVSb3dzO1xyXG4gICAgICB2YXIgdGFibGUgPSBjcmVhdGVFbGVtZW50KFwidGFibGVcIik7XHJcbiAgICAgIHZhciB0aGVhZCA9IGNyZWF0ZUVsZW1lbnQoXCJ0aGVhZFwiKTtcclxuICAgICAgdmFyIHRib2R5ID0gY3JlYXRlRWxlbWVudChcInRib2R5XCIpO1xyXG5cclxuICAgICAgdmFyIHRyID0gY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICBlYWNoKGhlYWRpbmdzLCBmdW5jdGlvbiAodGgpIHtcclxuICAgICAgICAgIHRyLmFwcGVuZENoaWxkKFxyXG4gICAgICAgICAgICAgIGNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgIGh0bWw6IHRoLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhlYWQuYXBwZW5kQ2hpbGQodHIpO1xyXG5cclxuICAgICAgZWFjaChyb3dzLCBmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgICAgICB2YXIgdHIgPSBjcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgICAgICBlYWNoKHJvdy5jZWxscywgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZChcclxuICAgICAgICAgICAgICAgICAgY3JlYXRlRWxlbWVudChcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IGNlbGwudGV4dENvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGFibGUuYXBwZW5kQ2hpbGQodGhlYWQpO1xyXG4gICAgICB0YWJsZS5hcHBlbmRDaGlsZCh0Ym9keSk7XHJcblxyXG4gICAgICAvLyBPcGVuIG5ldyB3aW5kb3dcclxuICAgICAgdmFyIHcgPSB3aW4ub3BlbigpO1xyXG5cclxuICAgICAgLy8gQXBwZW5kIHRoZSB0YWJsZSB0byB0aGUgYm9keVxyXG4gICAgICB3LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGFibGUpO1xyXG5cclxuICAgICAgLy8gUHJpbnRcclxuICAgICAgdy5wcmludCgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3cgYSBtZXNzYWdlIGluIHRoZSB0YWJsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXHJcbiAgICovXHJcbiAgcHJvdG8uc2V0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgIHZhciBjb2xzcGFuID0gMTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgIGNvbHNwYW4gPSB0aGlzLmRhdGFbMF0uY2VsbHMubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGFzc0xpc3QuYWRkKHRoaXMud3JhcHBlciwgXCJkYXRhVGFibGUtZW1wdHlcIik7XHJcblxyXG4gICAgICB0aGlzLmNsZWFyKFxyXG4gICAgICAgICAgY3JlYXRlRWxlbWVudChcInRyXCIsIHtcclxuICAgICAgICAgICAgICBodG1sOiAnPHRkIGNsYXNzPVwiZGF0YVRhYmxlcy1lbXB0eVwiIGNvbHNwYW49XCInICtcclxuICAgICAgICAgICAgICAgICAgY29sc3BhbiArXHJcbiAgICAgICAgICAgICAgICAgICdcIj4nICtcclxuICAgICAgICAgICAgICAgICAgbWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAgIFwiPC90ZD5cIlxyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDb2x1bW5zIEFQSSBhY2Nlc3NcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IG5ldyBDb2x1bW5zIGluc3RhbmNlXHJcbiAgICovXHJcbiAgcHJvdG8uY29sdW1ucyA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ29sdW1ucyh0aGlzLCBjb2x1bW5zKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSb3dzIEFQSSBhY2Nlc3NcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IG5ldyBSb3dzIGluc3RhbmNlXHJcbiAgICovXHJcbiAgcHJvdG8ucm93cyA9IGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUm93cyh0aGlzLCByb3dzKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBBZGQgY3VzdG9tIGV2ZW50IGxpc3RlbmVyXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBldmVudFxyXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8ub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XHJcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHRoaXMuZXZlbnRzW2V2ZW50XSB8fCBbXTtcclxuICAgICAgdGhpcy5ldmVudHNbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBjdXN0b20gZXZlbnQgbGlzdGVuZXJcclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGV2ZW50XHJcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICogQHJldHVybiB7Vm9pZH1cclxuICAgKi9cclxuICBwcm90by5vZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XHJcbiAgICAgIGlmIChldmVudCBpbiB0aGlzLmV2ZW50cyA9PT0gZmFsc2UpIHJldHVybjtcclxuICAgICAgdGhpcy5ldmVudHNbZXZlbnRdLnNwbGljZSh0aGlzLmV2ZW50c1tldmVudF0uaW5kZXhPZihjYWxsYmFjayksIDEpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpcmUgY3VzdG9tIGV2ZW50XHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBldmVudFxyXG4gICAqIEByZXR1cm4ge1ZvaWR9XHJcbiAgICovXHJcbiAgcHJvdG8uZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9O1xyXG4gICAgICBpZiAoZXZlbnQgaW4gdGhpcy5ldmVudHMgPT09IGZhbHNlKSByZXR1cm47XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnRdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF1baV0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gRGF0YVRhYmxlO1xyXG59KTsiLCIvKiBqc2hpbnQgbGF4YnJlYWs6IHRydWUgKi9cclxuLyogZXhwZXJpbWVudGFsOiBbYXN5bmNhd2FpdCwgYXN5bmNyZXFhd2FpdF0gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtb2RhbERpYWxvZyh0aXRsZSwgbWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgbGV0IG1lc3NhZ2VDb250ZW50ID0gXCJcIjtcclxuICAgIC8vbGV0IE1vZGFsRGlhbG9nT2JqZWN0ID0ge307XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwid2luZG93Lm1vZGFsRGlhbG9nQWxlcnQ6IFwiLCB3aW5kb3cubW9kYWxEaWFsb2dBbGVydCk7XHJcbiAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBcIi5Nb2RhbERpYWxvZy1hbGVydDogXCIsXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5Nb2RhbERpYWxvZy1hbGVydFwiKVxyXG4gICAgKTtcclxuXHJcbiAgICAvL2lmICh3aW5kb3cubW9kYWxEaWFsb2dBbGVydC5lbGVtZW50KSBkZWxldGUgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQ7XHJcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpKSB7XHJcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpO1xyXG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuTW9kYWxEaWFsb2ctYWxlcnRcIikpIHtcclxuICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLk1vZGFsRGlhbG9nLWFsZXJ0XCIpO1xyXG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3cubW9kYWxEaWFsb2dBbGVydCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cubW9kYWxEaWFsb2dBbGVydC5lbGVtZW50KSBkZWxldGUgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQ7XHJcbiAgICAgICAgZGVsZXRlIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0O1xyXG4gICAgfVxyXG4gICAgaWYgKCF3aW5kb3cubW9kYWxEaWFsb2dBbGVydCkge1xyXG4gICAgICAgIHZhciBNb2RhbERpYWxvZ09iamVjdCA9IHtcclxuICAgICAgICAgICAgZWxlbWVudDogbnVsbCxcclxuICAgICAgICAgICAgY2FuY2VsRWxlbWVudDogbnVsbCxcclxuICAgICAgICAgICAgY29uZmlybUVsZW1lbnQ6IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLWFsZXJ0XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERlZmluZSBkZWZhdWx0IG9wdGlvbnNcclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0LnR5cGUgPVxyXG4gICAgICAgIG9wdGlvbnMudHlwZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy50eXBlIDogXCJPa0NhbmNlbFwiO1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3Qud2lkdGggPVxyXG4gICAgICAgIG9wdGlvbnMud2lkdGggIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMud2lkdGggOiBcIjY0MHB4XCI7XHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5jYW5jZWwgPVxyXG4gICAgICAgIG9wdGlvbnMuY2FuY2VsICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNhbmNlbCA6IGZhbHNlO1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QuY2FuY2VsVGV4dCA9XHJcbiAgICAgICAgb3B0aW9ucy5jYW5jZWxUZXh0ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNhbmNlbFRleHQgOiBcIkNhbmNlbFwiO1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybSA9XHJcbiAgICAgICAgb3B0aW9ucy5jb25maXJtICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNvbmZpcm0gOiB0cnVlO1xyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybVRleHQgPVxyXG4gICAgICAgIG9wdGlvbnMuY29uZmlybVRleHQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY29uZmlybVRleHQgOiBcIkNvbmZpcm1cIjtcclxuXHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5jYW5jZWxDYWxsQmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtZGlhbG9nLW9wZW5cIik7XHJcbiAgICAgICAgd2luZG93Lm1vZGFsRGlhbG9nQWxlcnQuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgLy8gQ2FuY2VsIGNhbGxiYWNrXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNhbmNlbENhbGxCYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpO1xyXG4gICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5jYW5jZWxDYWxsQmFjayhldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDYW5jZWxsZWRcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENsb3NlIGFsZXJ0IG9uIGNsaWNrIG91dHNpZGVcclxuICAgIC8qIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLk1vZGFsRGlhbG9nLW1hc2tcIikpIHtcclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIi5Nb2RhbERpYWxvZy1tYXNrXCIpXHJcbiAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtZGlhbG9nLW9wZW5cIik7XHJcbiAgICAgICAgICB3aW5kb3cubW9kYWxEaWFsb2dBbGVydC5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgIC8vIENhbmNlbCBjYWxsYmFja1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNhbmNlbENhbGxCYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpO1xyXG4gICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5jYW5jZWxDYWxsQmFjayhldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBDbGlja2VkIG91dHNpZGVcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH0gKi9cclxuXHJcbiAgICBNb2RhbERpYWxvZ09iamVjdC5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0LnRpdGxlID0gdGl0bGU7XHJcblxyXG4gICAgTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybUNhbGxCYWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgbGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy13cmFwXCIpO1xyXG5cclxuICAgICAgICAvLyBDb25maXJtIGNhbGxiYWNrXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNvbmZpcm1DYWxsQmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoTW9kYWxEaWFsb2dPYmplY3QudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInByb21wdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWRpYWxvZy1vcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyBcclxuICAgICAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbmZpcm1DYWxsQmFjayhldmVudCwgTW9kYWxEaWFsb2dPYmplY3QuaW5wdXRJZC52YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImNoYW5nZVBhc3N3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coTW9kYWxEaWFsb2dPYmplY3QubmV3cGFzc3dvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm1vZGFsLWRpYWxvZy1vcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0LmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyBcclxuICAgICAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbmZpcm1DYWxsQmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm5ld3Bhc3N3b3JkLnZhbHVlLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QubmV3cGFzc3dvcmQyLnZhbHVlLnRyaW0oKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNoYXJlRmlsZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29uZmlybUNhbGxCYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RVc2VyTmFtZTogTW9kYWxEaWFsb2dPYmplY3QuZGVzdFVzZXJOYW1lLnZhbHVlLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBGaWxlRXhwaXJhdGVEYXRlOiBNb2RhbERpYWxvZ09iamVjdC5GaWxlRXhwaXJhdGVEYXRlLnZhbHVlLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxGaWxlQWZ0ZXJFeHBpcmVkOiBNb2RhbERpYWxvZ09iamVjdC5kZWxGaWxlQWZ0ZXJFeHBpcmVkLmNoZWNrZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgIFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1kaWFsb2ctb3BlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW9kYWxEaWFsb2dBbGVydC5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjsgXHJcbiAgICAgICAgICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb25maXJtQ2FsbEJhY2soZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ29uZmlybWVkXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0Ll9JZlVzZWQgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGxldCBlbCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICBpZiAoZWwudmFsdWUudHJpbSgpICE9PSAnJykge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCd1c2VkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgndXNlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gQnV0dG9uIENsb3NlIFdpbmRvdyBEaWFsb2dcclxuICAgIE1vZGFsRGlhbG9nT2JqZWN0Lk1vZGFsQ2xvc2UgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctd3JhcFwiKTtcclxuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcclxuICAgICAgICAvKiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2RhbC1kaWFsb2ctb3BlblwiKTtcclxuICAgICAgICB3aW5kb3cubW9kYWxEaWFsb2dBbGVydC5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjsgKi9cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIFdpbmRvdyBEaWFsb2cgY29udGVudFxyXG4gICAgaWYgKCFNb2RhbERpYWxvZ09iamVjdC5lbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGh0bWxDb250ZW50ID0gXCJcIjtcclxuXHJcbiAgICAgICAgaHRtbENvbnRlbnQgPVxyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWFsZXJ0XCIgaWQ9XCJNb2RhbERpYWxvZy1hbGVydFwiPicgK1xyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLW1hc2tcIj48L2Rpdj4nICtcclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1ib2R5XCIgYXJpYS1yZWxldmFudD1cImFsbFwiPicgK1xyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLXRpdGxlXCI+JyArXHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LnRpdGxlICtcclxuICAgICAgICAgICAgXCI8L2Rpdj5cIiArXHJcbiAgICAgICAgICAgICc8YSBjbGFzcz1cIk1vZGFsRGlhbG9nLWNsb3NlXCIgaWQ9XCJNb2RhbERpYWxvZ0Nsb3NlXCIgaHJlZj1cIiNcIj48L2E+JztcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJNb2RhbERpYWxvZ09iamVjdC50eXBlOiBcIiwgTW9kYWxEaWFsb2dPYmplY3QudHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEJvZHkgY29udGVudFxyXG5cclxuICAgICAgICBzd2l0Y2ggKE1vZGFsRGlhbG9nT2JqZWN0LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInByb21wdFwiOlxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZUNvbnRlbnQgPVxyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiTW9kYWxEaWFsb2ctY29udGFpbmVyXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250ZW50XCIgaWQ9XCJNb2RhbERpYWxvZy1jb250ZW50XCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1pbnB1dC1maWVsZFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgaWQ9XCJpbnB1dElkXCIgY2xhc3M9XCJNb2RhbERpYWxvZy1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxsYWJlbCBmb3I9XCJpbnB1dElkXCIgY2xhc3M9XCJNb2RhbERpYWxvZy1sYWJlbFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm1lc3NhZ2UgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2xhYmVsPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImNoYW5nZVBhc3N3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlQ29udGVudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250YWluZXJcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIk1vZGFsRGlhbG9nLWNvbnRlbnRcIiBpZD1cIk1vZGFsRGlhbG9nLWNvbnRlbnRcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5tZXNzYWdlICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInByb21wdFwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwcm9tcHRcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZUNvbnRlbnQgPVxyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiTW9kYWxEaWFsb2ctY29udGFpbmVyXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1jb250ZW50XCIgaWQ9XCJNb2RhbERpYWxvZy1jb250ZW50XCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QubWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQnV0dG9uIGNvbnRhaW5lciBjb250ZW50IFxyXG4gICAgICAgIGh0bWxDb250ZW50ICs9IG1lc3NhZ2VDb250ZW50ICtcclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJNb2RhbERpYWxvZy1idXR0b25cIj4nO1xyXG4gICAgICAgIGlmIChNb2RhbERpYWxvZ09iamVjdC5jYW5jZWwgfHwgdHJ1ZSkge1xyXG4gICAgICAgICAgICBodG1sQ29udGVudCArPVxyXG4gICAgICAgICAgICAgICAgJzxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0bjItdW5pZnkgTW9kYWxEaWFsb2ctYnV0dG9uLWNhbmNlbFwiICBpZD1cIk1vZGFsRGlhbG9nLWJ1dHRvbi1jYW5jZWxcIj4nICtcclxuICAgICAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbFRleHQgK1xyXG4gICAgICAgICAgICAgICAgXCI8L2E+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTW9kYWxEaWFsb2dPYmplY3QuY29uZmlybSB8fCB0cnVlKSB7XHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50ICs9XHJcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuMi11bmlmeSBNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiIGlkPVwiTW9kYWxEaWFsb2ctYnV0dG9uLWNvbmZpcm1cIj4nICtcclxuICAgICAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNvbmZpcm1UZXh0ICtcclxuICAgICAgICAgICAgICAgIFwiPC9hPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbENvbnRlbnQgKz0gJzwvZGl2PjwvZGl2PjwvZGl2Pic7XHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuaHRtbCA9IGh0bWxDb250ZW50O1xyXG5cclxuXHJcbiAgICAgICAgLy8gQWRkIGNvbnRlbnQgdG8gRE9NXHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGVsZW1lbnQuaWQgPSBcIk1vZGFsRGlhbG9nLXdyYXBcIjtcclxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWxDb250ZW50O1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm1vZGFsQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nQ2xvc2VcIik7XHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuTW9kYWxEaWFsb2ctYWxlcnRcIik7XHJcbiAgICAgICAgTW9kYWxEaWFsb2dPYmplY3QuY2FuY2VsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctYnV0dG9uLWNhbmNlbFwiKTtcclxuICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5jb25maXJtRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctYnV0dG9uLWNvbmZpcm1cIik7XHJcblxyXG4gICAgICAgIGlmIChNb2RhbERpYWxvZ09iamVjdC50eXBlID09PSBcInByb21wdFwiKSB7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmlucHV0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2lucHV0SWRcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmlucHV0SWQub25ibHVyID0gTW9kYWxEaWFsb2dPYmplY3QuX0lmVXNlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKE1vZGFsRGlhbG9nT2JqZWN0LnR5cGUgPT09IFwiY2hhbmdlUGFzc3dvcmRcIikge1xyXG4gICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5uZXdwYXNzd29yZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmV3cGFzc3dvcmRcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0Lm5ld3Bhc3N3b3JkMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmV3cGFzc3dvcmQyXCIpO1xyXG4gICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5uZXdwYXNzd29yZC5vbmJsdXIgPSBNb2RhbERpYWxvZ09iamVjdC5fSWZVc2VkO1xyXG4gICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5uZXdwYXNzd29yZDIub25ibHVyID0gTW9kYWxEaWFsb2dPYmplY3QuX0lmVXNlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKE1vZGFsRGlhbG9nT2JqZWN0LnR5cGUgPT09IFwic2hhcmVGaWxlXCIpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5Nb2RhbERpYWxvZy1ib2R5XCIpLmNsYXNzTGlzdC5hZGQoXCJzaGFyZUZpbGVcIik7XHJcbiAgICAgICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmRlc3RVc2VyTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzdFVzZXJOYW1lXCIpO1xyXG4gICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5GaWxlRXhwaXJhdGVEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNGaWxlRXhwaXJhdGVEYXRlXCIpO1xyXG4gICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5kZWxGaWxlQWZ0ZXJFeHBpcmVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkZWxGaWxlQWZ0ZXJFeHBpcmVkXCIpO1xyXG4gICAgICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5kZXN0VXNlck5hbWUub25ibHVyID0gTW9kYWxEaWFsb2dPYmplY3QuX0lmVXNlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5hYmxlZCBjYW5jZWwgYnV0dG9uIGNhbGxiYWNrXHJcbiAgICAgICAgaWYgKE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLWJ1dHRvbi1jYW5jZWxcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI01vZGFsRGlhbG9nLWJ1dHRvbi1jYW5jZWxcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRW5hYmxlZCBjYW5jZWwgYnV0dG9uIGNhbGxiYWNrXHJcbiAgICAgICAgaWYgKE1vZGFsRGlhbG9nT2JqZWN0LmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNNb2RhbERpYWxvZy1idXR0b24tY29uZmlybVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjTW9kYWxEaWFsb2ctYnV0dG9uLWNvbmZpcm1cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBNb2RhbERpYWxvZ09iamVjdC5tb2RhbENsb3NlLm9uY2xpY2sgPSBNb2RhbERpYWxvZ09iamVjdC5Nb2RhbENsb3NlO1xyXG4gICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbEVsZW1lbnQub25jbGljayA9IE1vZGFsRGlhbG9nT2JqZWN0LmNhbmNlbENhbGxCYWNrO1xyXG4gICAgICAgIE1vZGFsRGlhbG9nT2JqZWN0LmNvbmZpcm1FbGVtZW50Lm9uY2xpY2sgPSBNb2RhbERpYWxvZ09iamVjdC5jb25maXJtQ2FsbEJhY2s7XHJcblxyXG4gICAgICAgIHdpbmRvdy5tb2RhbERpYWxvZ0FsZXJ0ID0gTW9kYWxEaWFsb2dPYmplY3Q7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xudmFyIGJ0b2EgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmJ0b2EgJiYgd2luZG93LmJ0b2EuYmluZCh3aW5kb3cpKSB8fCByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnRvYScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBsb2FkRXZlbnQgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbiAgICB2YXIgeERvbWFpbiA9IGZhbHNlO1xuXG4gICAgLy8gRm9yIElFIDgvOSBDT1JTIHN1cHBvcnRcbiAgICAvLyBPbmx5IHN1cHBvcnRzIFBPU1QgYW5kIEdFVCBjYWxscyBhbmQgZG9lc24ndCByZXR1cm5zIHRoZSByZXNwb25zZSBoZWFkZXJzLlxuICAgIC8vIERPTidUIGRvIHRoaXMgZm9yIHRlc3RpbmcgYi9jIFhNTEh0dHBSZXF1ZXN0IGlzIG1vY2tlZCwgbm90IFhEb21haW5SZXF1ZXN0LlxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmXG4gICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCAmJiAhKCd3aXRoQ3JlZGVudGlhbHMnIGluIHJlcXVlc3QpICYmXG4gICAgICAgICFpc1VSTFNhbWVPcmlnaW4oY29uZmlnLnVybCkpIHtcbiAgICAgIHJlcXVlc3QgPSBuZXcgd2luZG93LlhEb21haW5SZXF1ZXN0KCk7XG4gICAgICBsb2FkRXZlbnQgPSAnb25sb2FkJztcbiAgICAgIHhEb21haW4gPSB0cnVlO1xuICAgICAgcmVxdWVzdC5vbnByb2dyZXNzID0gZnVuY3Rpb24gaGFuZGxlUHJvZ3Jlc3MoKSB7fTtcbiAgICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHt9O1xuICAgIH1cblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgfHwgJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3RbbG9hZEV2ZW50XSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCAmJiAheERvbWFpbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgLy8gSUUgc2VuZHMgMTIyMyBpbnN0ZWFkIG9mIDIwNCAoaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy8yMDEpXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXMgPT09IDEyMjMgPyAnTm8gQ29udGVudCcgOiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIHZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcblxuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGNvbmZpZy51cmwpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKHV0aWxzLm1lcmdlKGRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi8uLi9kZWZhdWx0cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IHV0aWxzLm1lcmdlKHtcbiAgICAgIHVybDogYXJndW1lbnRzWzBdXG4gICAgfSwgYXJndW1lbnRzWzFdKTtcbiAgfVxuXG4gIGNvbmZpZyA9IHV0aWxzLm1lcmdlKGRlZmF1bHRzLCB7bWV0aG9kOiAnZ2V0J30sIHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHV0aWxzLm1lcmdlKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybFxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1dGlscy5tZXJnZShjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIFN1cHBvcnQgYmFzZVVSTCBjb25maWdcbiAgaWYgKGNvbmZpZy5iYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKGNvbmZpZy51cmwpKSB7XG4gICAgY29uZmlnLnVybCA9IGNvbWJpbmVVUkxzKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnMgfHwge31cbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgcmV0dXJuIGVycm9yO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgLy8gTm90ZTogc3RhdHVzIGlzIG5vdCBleHBvc2VkIGJ5IFhEb21haW5SZXF1ZXN0XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBidG9hIHBvbHlmaWxsIGZvciBJRTwxMCBjb3VydGVzeSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRjaGFtYmVycy9CYXNlNjQuanNcblxudmFyIGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcblxuZnVuY3Rpb24gRSgpIHtcbiAgdGhpcy5tZXNzYWdlID0gJ1N0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3Rlcic7XG59XG5FLnByb3RvdHlwZSA9IG5ldyBFcnJvcjtcbkUucHJvdG90eXBlLmNvZGUgPSA1O1xuRS5wcm90b3R5cGUubmFtZSA9ICdJbnZhbGlkQ2hhcmFjdGVyRXJyb3InO1xuXG5mdW5jdGlvbiBidG9hKGlucHV0KSB7XG4gIHZhciBzdHIgPSBTdHJpbmcoaW5wdXQpO1xuICB2YXIgb3V0cHV0ID0gJyc7XG4gIGZvciAoXG4gICAgLy8gaW5pdGlhbGl6ZSByZXN1bHQgYW5kIGNvdW50ZXJcbiAgICB2YXIgYmxvY2ssIGNoYXJDb2RlLCBpZHggPSAwLCBtYXAgPSBjaGFycztcbiAgICAvLyBpZiB0aGUgbmV4dCBzdHIgaW5kZXggZG9lcyBub3QgZXhpc3Q6XG4gICAgLy8gICBjaGFuZ2UgdGhlIG1hcHBpbmcgdGFibGUgdG8gXCI9XCJcbiAgICAvLyAgIGNoZWNrIGlmIGQgaGFzIG5vIGZyYWN0aW9uYWwgZGlnaXRzXG4gICAgc3RyLmNoYXJBdChpZHggfCAwKSB8fCAobWFwID0gJz0nLCBpZHggJSAxKTtcbiAgICAvLyBcIjggLSBpZHggJSAxICogOFwiIGdlbmVyYXRlcyB0aGUgc2VxdWVuY2UgMiwgNCwgNiwgOFxuICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuICApIHtcbiAgICBjaGFyQ29kZSA9IHN0ci5jaGFyQ29kZUF0KGlkeCArPSAzIC8gNCk7XG4gICAgaWYgKGNoYXJDb2RlID4gMHhGRikge1xuICAgICAgdGhyb3cgbmV3IEUoKTtcbiAgICB9XG4gICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidG9hO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgfSxcblxuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHJldHVybiB7XG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgdmFyIG9yaWdpblVSTDtcblxuICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICB9XG5cbiAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICByZXR1cm4ge1xuICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgIH07XG4gIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbVxufTtcbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiLy8hIG1vbWVudC5qc1xuXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwubW9tZW50ID0gZmFjdG9yeSgpXG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBob29rQ2FsbGJhY2s7XG5cbiAgICBmdW5jdGlvbiBob29rcyAoKSB7XG4gICAgICAgIHJldHVybiBob29rQ2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGRvbmUgdG8gcmVnaXN0ZXIgdGhlIG1ldGhvZCBjYWxsZWQgd2l0aCBtb21lbnQoKVxuICAgIC8vIHdpdGhvdXQgY3JlYXRpbmcgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICAgIGZ1bmN0aW9uIHNldEhvb2tDYWxsYmFjayAoY2FsbGJhY2spIHtcbiAgICAgICAgaG9va0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBBcnJheSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KGlucHV0KSB7XG4gICAgICAgIC8vIElFOCB3aWxsIHRyZWF0IHVuZGVmaW5lZCBhbmQgbnVsbCBhcyBvYmplY3QgaWYgaXQgd2Fzbid0IGZvclxuICAgICAgICAvLyBpbnB1dCAhPSBudWxsXG4gICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzT2JqZWN0RW1wdHkob2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgICAgcmV0dXJuIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PT0gdm9pZCAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgICAgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0ICAgICA6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3cgICAgICAgIDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyICAgOiAwLFxuICAgICAgICAgICAgbnVsbElucHV0ICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGggICAgOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdCAgIDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbyAgICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgcGFyc2VkRGF0ZVBhcnRzIDogW10sXG4gICAgICAgICAgICBtZXJpZGllbSAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgcmZjMjgyMiAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB3ZWVrZGF5TWlzbWF0Y2ggOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNpbmdGbGFncyhtKSB7XG4gICAgICAgIGlmIChtLl9wZiA9PSBudWxsKSB7XG4gICAgICAgICAgICBtLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5fcGY7XG4gICAgfVxuXG4gICAgdmFyIHNvbWU7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5zb21lKSB7XG4gICAgICAgIHNvbWUgPSBBcnJheS5wcm90b3R5cGUuc29tZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzb21lID0gZnVuY3Rpb24gKGZ1bikge1xuICAgICAgICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiB0ICYmIGZ1bi5jYWxsKHRoaXMsIHRbaV0sIGksIHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MobSk7XG4gICAgICAgICAgICB2YXIgcGFyc2VkUGFydHMgPSBzb21lLmNhbGwoZmxhZ3MucGFyc2VkRGF0ZVBhcnRzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpICE9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBpc05vd1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZFdlZWtkYXkgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3Mud2Vla2RheU1pc21hdGNoICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLnVzZXJJbnZhbGlkYXRlZCAmJlxuICAgICAgICAgICAgICAgICghZmxhZ3MubWVyaWRpZW0gfHwgKGZsYWdzLm1lcmlkaWVtICYmIHBhcnNlZFBhcnRzKSk7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBpc05vd1ZhbGlkID0gaXNOb3dWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuID09IG51bGwgfHwgIU9iamVjdC5pc0Zyb3plbihtKSkge1xuICAgICAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBpc05vd1ZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTm93VmFsaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW52YWxpZCAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBjcmVhdGVVVEMoTmFOKTtcbiAgICAgICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dGVuZChnZXRQYXJzaW5nRmxhZ3MobSksIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgLy8gUGx1Z2lucyB0aGF0IGFkZCBwcm9wZXJ0aWVzIHNob3VsZCBhbHNvIGFkZCB0aGUga2V5IGhlcmUgKG51bGwgdmFsdWUpLFxuICAgIC8vIHNvIHdlIGNhbiBwcm9wZXJseSBjbG9uZSBvdXJzZWx2ZXMuXG4gICAgdmFyIG1vbWVudFByb3BlcnRpZXMgPSBob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pc0FNb21lbnRPYmplY3QpKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faSkpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2YpKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9sKSkge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fc3RyaWN0KSkge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3R6bSkpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9pc1VUQykpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fb2Zmc2V0KSkge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3BmKSkge1xuICAgICAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbG9jYWxlKSkge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNNb21lbnQgKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8IChvYmogIT0gbnVsbCAmJiBvYmouX2lzQU1vbWVudE9iamVjdCAhPSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNGbG9vciAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICAvLyAtMCAtPiAwXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcikgfHwgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYWJzRmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gY29tcGFyZSB0d28gYXJyYXlzLCByZXR1cm4gdGhlIG51bWJlciBvZiBkaWZmZXJlbmNlc1xuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YXJuKG1zZykge1xuICAgICAgICBpZiAoaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICh0eXBlb2YgY29uc29sZSAhPT0gICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChob29rcy5kZXByZWNhdGlvbkhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihudWxsLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGFyZztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgKz0gJ1xcblsnICsgaSArICddICc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnICs9IGtleSArICc6ICcgKyBhcmd1bWVudHNbMF1ba2V5XSArICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2UoMCwgLTIpOyAvLyBSZW1vdmUgdHJhaWxpbmcgY29tbWEgYW5kIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdhcm4obXNnICsgJ1xcbkFyZ3VtZW50czogJyArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLmpvaW4oJycpICsgJ1xcbicgKyAobmV3IEVycm9yKCkpLnN0YWNrKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihuYW1lLCBtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG4gICAgaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRnVuY3Rpb24gfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQgKGNvbmZpZykge1xuICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX2RheU9mTW9udGhPcmRpbmFsUGFyc2UuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICAgICAgdGhpcy5fZGF5T2ZNb250aE9yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgKHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2Uuc291cmNlIHx8IHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UpICtcbiAgICAgICAgICAgICAgICAnfCcgKyAoL1xcZHsxLDJ9Lykuc291cmNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjaGlsZENvbmZpZykge1xuICAgICAgICB2YXIgcmVzID0gZXh0ZW5kKHt9LCBwYXJlbnRDb25maWcpLCBwcm9wO1xuICAgICAgICBmb3IgKHByb3AgaW4gY2hpbGRDb25maWcpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pICYmIGlzT2JqZWN0KGNoaWxkQ29uZmlnW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgcGFyZW50Q29uZmlnW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKHJlc1twcm9wXSwgY2hpbGRDb25maWdbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGRDb25maWdbcHJvcF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXNbcHJvcF0gPSBjaGlsZENvbmZpZ1twcm9wXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHByb3AgaW4gcGFyZW50Q29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChwYXJlbnRDb25maWcsIHByb3ApICYmXG4gICAgICAgICAgICAgICAgICAgICFoYXNPd25Qcm9wKGNoaWxkQ29uZmlnLCBwcm9wKSAmJlxuICAgICAgICAgICAgICAgICAgICBpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGNoYW5nZXMgdG8gcHJvcGVydGllcyBkb24ndCBtb2RpZnkgcGFyZW50IGNvbmZpZ1xuICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IGV4dGVuZCh7fSwgcmVzW3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvY2FsZShjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnNldChjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleXM7XG5cbiAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICB2YXIgaSwgcmVzID0gW107XG4gICAgICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc093blByb3Aob2JqLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0Q2FsZW5kYXIgPSB7XG4gICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgIGxhc3REYXkgOiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgICAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsZW5kYXIgKGtleSwgbW9tLCBub3cpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV0gfHwgdGhpcy5fY2FsZW5kYXJbJ3NhbWVFbHNlJ107XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKG91dHB1dCkgPyBvdXRwdXQuY2FsbChtb20sIG5vdykgOiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb25nRGF0ZUZvcm1hdCA9IHtcbiAgICAgICAgTFRTICA6ICdoOm1tOnNzIEEnLFxuICAgICAgICBMVCAgIDogJ2g6bW0gQScsXG4gICAgICAgIEwgICAgOiAnTU0vREQvWVlZWScsXG4gICAgICAgIExMICAgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgTExMICA6ICdNTU1NIEQsIFlZWVkgaDptbSBBJyxcbiAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgaDptbSBBJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb25nRGF0ZUZvcm1hdCAoa2V5KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldLFxuICAgICAgICAgICAgZm9ybWF0VXBwZXIgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGZvcm1hdCB8fCAhZm9ybWF0VXBwZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gZm9ybWF0VXBwZXIucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0SW52YWxpZERhdGUgPSAnSW52YWxpZCBkYXRlJztcblxuICAgIGZ1bmN0aW9uIGludmFsaWREYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCc7XG4gICAgdmFyIGRlZmF1bHREYXlPZk1vbnRoT3JkaW5hbFBhcnNlID0gL1xcZHsxLDJ9LztcblxuICAgIGZ1bmN0aW9uIG9yZGluYWwgKG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgIHBhc3QgICA6ICclcyBhZ28nLFxuICAgICAgICBzICA6ICdhIGZldyBzZWNvbmRzJyxcbiAgICAgICAgc3MgOiAnJWQgc2Vjb25kcycsXG4gICAgICAgIG0gIDogJ2EgbWludXRlJyxcbiAgICAgICAgbW0gOiAnJWQgbWludXRlcycsXG4gICAgICAgIGggIDogJ2FuIGhvdXInLFxuICAgICAgICBoaCA6ICclZCBob3VycycsXG4gICAgICAgIGQgIDogJ2EgZGF5JyxcbiAgICAgICAgZGQgOiAnJWQgZGF5cycsXG4gICAgICAgIE0gIDogJ2EgbW9udGgnLFxuICAgICAgICBNTSA6ICclZCBtb250aHMnLFxuICAgICAgICB5ICA6ICdhIHllYXInLFxuICAgICAgICB5eSA6ICclZCB5ZWFycydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICByZXR1cm4gKGlzRnVuY3Rpb24ob3V0cHV0KSkgP1xuICAgICAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFzdEZ1dHVyZSAoZGlmZiwgb3V0cHV0KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKGZvcm1hdCkgPyBmb3JtYXQob3V0cHV0KSA6IGZvcm1hdC5yZXBsYWNlKC8lcy9pLCBvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICB2YXIgcHJpb3JpdGllcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdFByaW9yaXR5KHVuaXQsIHByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXRpZXNbdW5pdF0gPSBwcmlvcml0eTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcmlvcml0aXplZFVuaXRzKHVuaXRzT2JqKSB7XG4gICAgICAgIHZhciB1bml0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB1IGluIHVuaXRzT2JqKSB7XG4gICAgICAgICAgICB1bml0cy5wdXNoKHt1bml0OiB1LCBwcmlvcml0eTogcHJpb3JpdGllc1t1XX0pO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB1bml0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB6ZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBhYnNOdW1iZXIgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICB6ZXJvc1RvRmlsbCA9IHRhcmdldExlbmd0aCAtIGFic051bWJlci5sZW5ndGgsXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG4gICAgICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICtcbiAgICAgICAgICAgIE1hdGgucG93KDEwLCBNYXRoLm1heCgwLCB6ZXJvc1RvRmlsbCkpLnRvU3RyaW5nKCkuc3Vic3RyKDEpICsgYWJzTnVtYmVyO1xuICAgIH1cblxuICAgIHZhciBmb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KFtIaF1tbShzcyk/fE1vfE1NP00/TT98RG98REREb3xERD9EP0Q/fGRkZD9kP3xkbz98d1tvfHddP3xXW298V10/fFFvP3xZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xraz98bW0/fHNzP3xTezEsOX18eHxYfHp6P3xaWj98LikvZztcblxuICAgIHZhciBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nO1xuXG4gICAgdmFyIGZvcm1hdEZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgdmFyIGZvcm1hdFRva2VuRnVuY3Rpb25zID0ge307XG5cbiAgICAvLyB0b2tlbjogICAgJ00nXG4gICAgLy8gcGFkZGVkOiAgIFsnTU0nLCAyXVxuICAgIC8vIG9yZGluYWw6ICAnTW8nXG4gICAgLy8gY2FsbGJhY2s6IGZ1bmN0aW9uICgpIHsgdGhpcy5tb250aCgpICsgMSB9XG4gICAgZnVuY3Rpb24gYWRkRm9ybWF0VG9rZW4gKHRva2VuLCBwYWRkZWQsIG9yZGluYWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdW5jID0gY2FsbGJhY2s7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2NhbGxiYWNrXSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZGRlZCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbcGFkZGVkWzBdXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gemVyb0ZpbGwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBwYWRkZWRbMV0sIHBhZGRlZFsyXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRpbmFsKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tvcmRpbmFsXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRva2VuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJycsIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gaXNGdW5jdGlvbihhcnJheVtpXSkgPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdIHx8IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoMSAgICAgICAgID0gL1xcZC87ICAgICAgICAgICAgLy8gICAgICAgMCAtIDlcbiAgICB2YXIgbWF0Y2gyICAgICAgICAgPSAvXFxkXFxkLzsgICAgICAgICAgLy8gICAgICAwMCAtIDk5XG4gICAgdmFyIG1hdGNoMyAgICAgICAgID0gL1xcZHszfS87ICAgICAgICAgLy8gICAgIDAwMCAtIDk5OVxuICAgIHZhciBtYXRjaDQgICAgICAgICA9IC9cXGR7NH0vOyAgICAgICAgIC8vICAgIDAwMDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoNiAgICAgICAgID0gL1srLV0/XFxkezZ9LzsgICAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzIgICAgICA9IC9cXGRcXGQ/LzsgICAgICAgICAvLyAgICAgICAwIC0gOTlcbiAgICB2YXIgbWF0Y2gzdG80ICAgICAgPSAvXFxkXFxkXFxkXFxkPy87ICAgICAvLyAgICAgOTk5IC0gOTk5OVxuICAgIHZhciBtYXRjaDV0bzYgICAgICA9IC9cXGRcXGRcXGRcXGRcXGRcXGQ/LzsgLy8gICA5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzMgICAgICA9IC9cXGR7MSwzfS87ICAgICAgIC8vICAgICAgIDAgLSA5OTlcbiAgICB2YXIgbWF0Y2gxdG80ICAgICAgPSAvXFxkezEsNH0vOyAgICAgICAvLyAgICAgICAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDF0bzYgICAgICA9IC9bKy1dP1xcZHsxLDZ9LzsgIC8vIC05OTk5OTkgLSA5OTk5OTlcblxuICAgIHZhciBtYXRjaFVuc2lnbmVkICA9IC9cXGQrLzsgICAgICAgICAgIC8vICAgICAgIDAgLSBpbmZcbiAgICB2YXIgbWF0Y2hTaWduZWQgICAgPSAvWystXT9cXGQrLzsgICAgICAvLyAgICAtaW5mIC0gaW5mXG5cbiAgICB2YXIgbWF0Y2hPZmZzZXQgICAgPSAvWnxbKy1dXFxkXFxkOj9cXGRcXGQvZ2k7IC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuICAgIHZhciBtYXRjaFNob3J0T2Zmc2V0ID0gL1p8WystXVxcZFxcZCg/Ojo/XFxkXFxkKT8vZ2k7IC8vICswMCAtMDAgKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG5cbiAgICB2YXIgbWF0Y2hUaW1lc3RhbXAgPSAvWystXT9cXGQrKFxcLlxcZHsxLDN9KT8vOyAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuXG4gICAgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgLy8gaW5jbHVkZXMgc2NvdHRpc2ggZ2FlbGljIHR3byB3b3JkIGFuZCBoeXBoZW5hdGVkIG1vbnRoc1xuICAgIHZhciBtYXRjaFdvcmQgPSAvWzAtOV17MCwyNTZ9WydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGMDdcXHVGRjEwLVxcdUZGRUZdezEsMjU2fXxbXFx1MDYwMC1cXHUwNkZGXFwvXXsxLDI1Nn0oXFxzKj9bXFx1MDYwMC1cXHUwNkZGXXsxLDI1Nn0pezEsMn0vaTtcblxuICAgIHZhciByZWdleGVzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRSZWdleFRva2VuICh0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gaXNGdW5jdGlvbihyZWdleCkgPyByZWdleCA6IGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIChpc1N0cmljdCAmJiBzdHJpY3RSZWdleCkgPyBzdHJpY3RSZWdleCA6IHJlZ2V4O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbiAodG9rZW4sIGNvbmZpZykge1xuICAgICAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2V4RXNjYXBlKHMucmVwbGFjZSgnXFxcXCcsICcnKS5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVnZXhFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW5zID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGksIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRva2VuID0gW3Rva2VuXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOdW1iZXIoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2NhbGxiYWNrXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5baV1dID0gZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgWUVBUiA9IDA7XG4gICAgdmFyIE1PTlRIID0gMTtcbiAgICB2YXIgREFURSA9IDI7XG4gICAgdmFyIEhPVVIgPSAzO1xuICAgIHZhciBNSU5VVEUgPSA0O1xuICAgIHZhciBTRUNPTkQgPSA1O1xuICAgIHZhciBNSUxMSVNFQ09ORCA9IDY7XG4gICAgdmFyIFdFRUsgPSA3O1xuICAgIHZhciBXRUVLREFZID0gODtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdZJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgeSA9IHRoaXMueWVhcigpO1xuICAgICAgICByZXR1cm4geSA8PSA5OTk5ID8gJycgKyB5IDogJysnICsgeTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCAgIDRdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVknLCAgNV0sICAgICAgIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQUklPUklUSUVTXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3llYXInLCAxKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1knLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWScsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWScsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gaW5wdXQubGVuZ3RoID09PSAyID8gaG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpIDogdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgaG9va3MucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldFllYXIgPSBtYWtlR2V0U2V0KCdGdWxsWWVhcicsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNMZWFwWWVhciAoKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHNldCQxKHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0KHRoaXMsIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCAobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uaXNWYWxpZCgpID9cbiAgICAgICAgICAgIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpIDogTmFOO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldCQxIChtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIGlmIChtb20uaXNWYWxpZCgpICYmICFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICh1bml0ID09PSAnRnVsbFllYXInICYmIGlzTGVhcFllYXIobW9tLnllYXIoKSkgJiYgbW9tLm1vbnRoKCkgPT09IDEgJiYgbW9tLmRhdGUoKSA9PT0gMjkpIHtcbiAgICAgICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUsIG1vbS5tb250aCgpLCBkYXlzSW5Nb250aCh2YWx1ZSwgbW9tLm1vbnRoKCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzdHJpbmdHZXQgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbih0aGlzW3VuaXRzXSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc3RyaW5nU2V0ICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplT2JqZWN0VW5pdHModW5pdHMpO1xuICAgICAgICAgICAgdmFyIHByaW9yaXRpemVkID0gZ2V0UHJpb3JpdGl6ZWRVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByaW9yaXRpemVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpc1twcmlvcml0aXplZFtpXS51bml0XSh1bml0c1twcmlvcml0aXplZFtpXS51bml0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXNbdW5pdHNdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9kKG4sIHgpIHtcbiAgICAgICAgcmV0dXJuICgobiAlIHgpICsgeCkgJSB4O1xuICAgIH1cblxuICAgIHZhciBpbmRleE9mO1xuXG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgICAgIGluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleE9mID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgIC8vIEkga25vd1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICBpZiAoaXNOYU4oeWVhcikgfHwgaXNOYU4obW9udGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtb2RNb250aCA9IG1vZChtb250aCwgMTIpO1xuICAgICAgICB5ZWFyICs9IChtb250aCAtIG1vZE1vbnRoKSAvIDEyO1xuICAgICAgICByZXR1cm4gbW9kTW9udGggPT09IDEgPyAoaXNMZWFwWWVhcih5ZWFyKSA/IDI5IDogMjgpIDogKDMxIC0gbW9kTW9udGggJSA3ICUgMik7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ00nLCBbJ01NJywgMl0sICdNbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU1NJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21vbnRoJywgJ00nKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ21vbnRoJywgOCk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdNJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTScsICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLm1vbnRoc1Nob3J0UmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLm1vbnRoc1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNJywgJ01NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNTU0nLCAnTU1NTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciBtb250aCA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICAgICAgaWYgKG1vbnRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFycmF5W01PTlRIXSA9IG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBNT05USFNfSU5fRk9STUFUID0gL0Rbb0RdPyhcXFtbXlxcW1xcXV0qXFxdfFxccykrTU1NTT8vO1xuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzID0gJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzIChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpID8gdGhpcy5fbW9udGhzIDpcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNbJ3N0YW5kYWxvbmUnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHMpID8gdGhpcy5fbW9udGhzW20ubW9udGgoKV0gOlxuICAgICAgICAgICAgdGhpcy5fbW9udGhzWyh0aGlzLl9tb250aHMuaXNGb3JtYXQgfHwgTU9OVEhTX0lOX0ZPUk1BVCkudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSddW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCA9ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHNTaG9ydCAobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpID8gdGhpcy5fbW9udGhzU2hvcnQgOlxuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0WydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpID8gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXSA6XG4gICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFtNT05USFNfSU5fRk9STUFULnRlc3QoZm9ybWF0KSA/ICdmb3JtYXQnIDogJ3N0YW5kYWxvbmUnXVttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIGlpLCBtb20sIGxsYyA9IG1vbnRoTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCB1c2VkXG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7ICsraSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gdGhpcy5tb250aHMobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdNTU0nKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdNTU0nKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzUGFyc2UgKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVTdHJpY3RQYXJzZS5jYWxsKHRoaXMsIG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogYWRkIHNvcnRpbmdcbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlclxuICAgICAgICAvLyBzZWUgc29ydGluZyBpbiBjb21wdXRlTW9udGhzUGFyc2VcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NJyAmJiB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc2V0TW9udGggKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgaWYgKCFtb20uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAvLyBObyBvcFxuICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoL15cXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRvSW50KHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtb20ubG9jYWxlRGF0YSgpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgICAgIGlmICghaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TW9udGggKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQodGhpcywgJ01vbnRoJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzSW5Nb250aCAoKSB7XG4gICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE1vbnRoc1Nob3J0UmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gbW9udGhzU2hvcnRSZWdleCAoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlTW9udGhzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0UmVnZXggPSBkZWZhdWx0TW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0ID9cbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4IDogdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TW9udGhzUmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gbW9udGhzUmVnZXggKGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19tb250aHNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZU1vbnRoc1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNSZWdleCA9IGRlZmF1bHRNb250aHNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTdHJpY3RSZWdleCAmJiBpc1N0cmljdCA/XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzU3RyaWN0UmVnZXggOiB0aGlzLl9tb250aHNSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVNb250aHNQYXJzZSAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaG9ydFBpZWNlcyA9IFtdLCBsb25nUGllY2VzID0gW10sIG1peGVkUGllY2VzID0gW10sXG4gICAgICAgICAgICBpLCBtb207XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgc2hvcnRQaWVjZXMucHVzaCh0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzKG1vbSwgJycpKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgICAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vbnRoc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbG9uZ1BpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX21vbnRoc1Nob3J0U3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBzaG9ydFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSAoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy8gY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcS8xODEzNDhcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy8gdGhlIGRhdGUgY29uc3RydWN0b3IgcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCAmJiBpc0Zpbml0ZShkYXRlLmdldEZ1bGxZZWFyKCkpKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQ0RhdGUgKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcblxuICAgICAgICAvLyB0aGUgRGF0ZS5VVEMgZnVuY3Rpb24gcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCAmJiBpc0Zpbml0ZShkYXRlLmdldFVUQ0Z1bGxZZWFyKCkpKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0LW9mLWZpcnN0LXdlZWsgLSBzdGFydC1vZi15ZWFyXG4gICAgZnVuY3Rpb24gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHZhciAvLyBmaXJzdC13ZWVrIGRheSAtLSB3aGljaCBqYW51YXJ5IGlzIGFsd2F5cyBpbiB0aGUgZmlyc3Qgd2VlayAoNCBmb3IgaXNvLCAxIGZvciBvdGhlcilcbiAgICAgICAgICAgIGZ3ZCA9IDcgKyBkb3cgLSBkb3ksXG4gICAgICAgICAgICAvLyBmaXJzdC13ZWVrIGRheSBsb2NhbCB3ZWVrZGF5IC0tIHdoaWNoIGxvY2FsIHdlZWtkYXkgaXMgZndkXG4gICAgICAgICAgICBmd2RsdyA9ICg3ICsgY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCBmd2QpLmdldFVUQ0RheSgpIC0gZG93KSAlIDc7XG5cbiAgICAgICAgcmV0dXJuIC1md2RsdyArIGZ3ZCAtIDE7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIGxvY2FsV2Vla2RheSA9ICg3ICsgd2Vla2RheSAtIGRvdykgJSA3LFxuICAgICAgICAgICAgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldCh5ZWFyLCBkb3csIGRveSksXG4gICAgICAgICAgICBkYXlPZlllYXIgPSAxICsgNyAqICh3ZWVrIC0gMSkgKyBsb2NhbFdlZWtkYXkgKyB3ZWVrT2Zmc2V0LFxuICAgICAgICAgICAgcmVzWWVhciwgcmVzRGF5T2ZZZWFyO1xuXG4gICAgICAgIGlmIChkYXlPZlllYXIgPD0gMCkge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXIgLSAxO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5c0luWWVhcihyZXNZZWFyKSArIGRheU9mWWVhcjtcbiAgICAgICAgfSBlbHNlIGlmIChkYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXIpKSB7XG4gICAgICAgICAgICByZXNZZWFyID0geWVhciArIDE7XG4gICAgICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXIgLSBkYXlzSW5ZZWFyKHllYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXI7XG4gICAgICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogcmVzWWVhcixcbiAgICAgICAgICAgIGRheU9mWWVhcjogcmVzRGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla09mWWVhcihtb20sIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KG1vbS55ZWFyKCksIGRvdywgZG95KSxcbiAgICAgICAgICAgIHdlZWsgPSBNYXRoLmZsb29yKChtb20uZGF5T2ZZZWFyKCkgLSB3ZWVrT2Zmc2V0IC0gMSkgLyA3KSArIDEsXG4gICAgICAgICAgICByZXNXZWVrLCByZXNZZWFyO1xuXG4gICAgICAgIGlmICh3ZWVrIDwgMSkge1xuICAgICAgICAgICAgcmVzWWVhciA9IG1vbS55ZWFyKCkgLSAxO1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWsgKyB3ZWVrc0luWWVhcihyZXNZZWFyLCBkb3csIGRveSk7XG4gICAgICAgIH0gZWxzZSBpZiAod2VlayA+IHdlZWtzSW5ZZWFyKG1vbS55ZWFyKCksIGRvdywgZG95KSkge1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWsgLSB3ZWVrc0luWWVhcihtb20ueWVhcigpLCBkb3csIGRveSk7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKSArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKTtcbiAgICAgICAgICAgIHJlc1dlZWsgPSB3ZWVrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdlZWs6IHJlc1dlZWssXG4gICAgICAgICAgICB5ZWFyOiByZXNZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICAgICAgd2Vla09mZnNldE5leHQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciArIDEsIGRvdywgZG95KTtcbiAgICAgICAgcmV0dXJuIChkYXlzSW5ZZWFyKHllYXIpIC0gd2Vla09mZnNldCArIHdlZWtPZmZzZXROZXh0KSAvIDc7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3cnLCBbJ3d3JywgMl0sICd3bycsICd3ZWVrJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ1cnLCBbJ1dXJywgMl0sICdXbycsICdpc29XZWVrJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWsnLCAndycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2VlaycsICdXJyk7XG5cbiAgICAvLyBQUklPUklUSUVTXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWsnLCA1KTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWsnLCA1KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignV1cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ3cnLCAnd3cnLCAnVycsICdXVyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMSldID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2VlayAobW9tKSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2VlayA9IHtcbiAgICAgICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZldlZWsgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlRmlyc3REYXlPZlllYXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3k7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB0aGlzLmxvY2FsZURhdGEoKS53ZWVrKHRoaXMpO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWsgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLndlZWs7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF5JywgMTEpO1xuICAgIGFkZFVuaXRQcmlvcml0eSgnd2Vla2RheScsIDExKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtkYXknLCAxMSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdkJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdlJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdFJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZCcsICAgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c01pblJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGQnLCAgIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgICBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkZCcsICdkZGQnLCAnZGRkZCddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgaWYgKHdlZWtkYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgd2Vlay5kID0gd2Vla2RheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZCcsICdlJywgJ0UnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VJc29XZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCkgJSA3IHx8IDc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzTmFOKGlucHV0KSA/IG51bGwgOiBpbnB1dDtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzID0gJ1N1bmRheV9Nb25kYXlfVHVlc2RheV9XZWRuZXNkYXlfVGh1cnNkYXlfRnJpZGF5X1NhdHVyZGF5Jy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzIChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl93ZWVrZGF5cykgPyB0aGlzLl93ZWVrZGF5cyA6XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNbJ3N0YW5kYWxvbmUnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl93ZWVrZGF5cykgPyB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXSA6XG4gICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1t0aGlzLl93ZWVrZGF5cy5pc0Zvcm1hdC50ZXN0KGZvcm1hdCkgPyAnZm9ybWF0JyA6ICdzdGFuZGFsb25lJ11bbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0ID0gJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiAobSkgPyB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldIDogdGhpcy5fd2Vla2RheXNTaG9ydDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluIChtKSB7XG4gICAgICAgIHJldHVybiAobSkgPyB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXSA6IHRoaXMuX3dlZWtkYXlzTWluO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlJDEod2Vla2RheU5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBpaSwgbW9tLCBsbGMgPSB3ZWVrZGF5TmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgKytpKSB7XG4gICAgICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXMobW9tLCAnJykudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICdkZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnZGRkJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzUGFyc2UgKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UkMS5jYWxsKHRoaXMsIHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuXG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICdcXFxcLj8nKSArICckJywgJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ2RkZGQnICYmIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdkZGQnICYmIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnZGQnICYmIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZldlZWsgKGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCAhPSBudWxsID8gdGhpcyA6IE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3cpICUgNztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT0RheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG5cbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gcGFyc2VJc29XZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyB3ZWVrZGF5IDogd2Vla2RheSAtIDcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCkgfHwgNztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0V2Vla2RheXNSZWdleCA9IG1hdGNoV29yZDtcbiAgICBmdW5jdGlvbiB3ZWVrZGF5c1JlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNSZWdleCA9IGRlZmF1bHRXZWVrZGF5c1JlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRXZWVrZGF5c1Nob3J0UmVnZXggPSBtYXRjaFdvcmQ7XG4gICAgZnVuY3Rpb24gd2Vla2RheXNTaG9ydFJlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzU2hvcnRSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0U3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA6IHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkZWZhdWx0V2Vla2RheXNNaW5SZWdleCA9IG1hdGNoV29yZDtcbiAgICBmdW5jdGlvbiB3ZWVrZGF5c01pblJlZ2V4IChpc1N0cmljdCkge1xuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlV2Vla2RheXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNNaW5SZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNNaW5SZWdleCA9IGRlZmF1bHRXZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggJiYgaXNTdHJpY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggOiB0aGlzLl93ZWVrZGF5c01pblJlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBjb21wdXRlV2Vla2RheXNQYXJzZSAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtaW5QaWVjZXMgPSBbXSwgc2hvcnRQaWVjZXMgPSBbXSwgbG9uZ1BpZWNlcyA9IFtdLCBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgaSwgbW9tLCBtaW5wLCBzaG9ydHAsIGxvbmdwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgIG1pbnAgPSB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgc2hvcnRwID0gdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgbG9uZ3AgPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpO1xuICAgICAgICAgICAgbWluUGllY2VzLnB1c2gobWlucCk7XG4gICAgICAgICAgICBzaG9ydFBpZWNlcy5wdXNoKHNob3J0cCk7XG4gICAgICAgICAgICBsb25nUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChtaW5wKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2goc2hvcnRwKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gobG9uZ3ApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvcnRpbmcgbWFrZXMgc3VyZSBpZiBvbmUgd2Vla2RheSAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgICAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgICAgIG1pblBpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgc2hvcnRQaWVjZXNbaV0gPSByZWdleEVzY2FwZShzaG9ydFBpZWNlc1tpXSk7XG4gICAgICAgICAgICBsb25nUGllY2VzW2ldID0gcmVnZXhFc2NhcGUobG9uZ1BpZWNlc1tpXSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBtaXhlZFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBsb25nUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl93ZWVrZGF5c01pblN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWluUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBmdW5jdGlvbiBoRm9ybWF0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga0Zvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSB8fCAyNDtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgaEZvcm1hdCk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2snLCBbJ2trJywgMl0sIDAsIGtGb3JtYXQpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdobW1zcycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSG1tJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmhvdXJzKCkgKyB6ZXJvRmlsbCh0aGlzLm1pbnV0ZXMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSG1tc3MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuaG91cnMoKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMik7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbSAodG9rZW4sIGxvd2VyY2FzZSkge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGxvd2VyY2FzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1lcmlkaWVtKCdhJywgdHJ1ZSk7XG4gICAgbWVyaWRpZW0oJ0EnLCBmYWxzZSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2hvdXInLCAnaCcpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2hvdXInLCAxMyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBmdW5jdGlvbiBtYXRjaE1lcmlkaWVtIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuX21lcmlkaWVtUGFyc2U7XG4gICAgfVxuXG4gICAgYWRkUmVnZXhUb2tlbignYScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdBJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdoJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0hIJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2hoJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2trJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkUmVnZXhUb2tlbignaG1tJywgbWF0Y2gzdG80KTtcbiAgICBhZGRSZWdleFRva2VuKCdobW1zcycsIG1hdGNoNXRvNik7XG4gICAgYWRkUmVnZXhUb2tlbignSG1tJywgbWF0Y2gzdG80KTtcbiAgICBhZGRSZWdleFRva2VuKCdIbW1zcycsIG1hdGNoNXRvNik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnSCcsICdISCddLCBIT1VSKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaycsICdrayddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIGtJbnB1dCA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSBrSW5wdXQgPT09IDI0ID8gMCA6IGtJbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnYScsICdBJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgY29uZmlnLl9tZXJpZGllbSA9IGlucHV0O1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oWydoJywgJ2hoJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignaG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignaG1tc3MnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHBvczEgPSBpbnB1dC5sZW5ndGggLSA0O1xuICAgICAgICB2YXIgcG9zMiA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvczEpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MxLCAyKSk7XG4gICAgICAgIGFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMikpO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdIbW0nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgdmFyIHBvcyA9IGlucHV0Lmxlbmd0aCAtIDI7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQuc3Vic3RyKDAsIHBvcykpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvcykpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNDtcbiAgICAgICAgdmFyIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgICAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUlzUE0gKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSA9IC9bYXBdXFwuP20/XFwuPy9pO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIHRoZXkgd2FudC4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4gICAgLy8gdGhpcyBydWxlLlxuICAgIHZhciBnZXRTZXRIb3VyID0gbWFrZUdldFNldCgnSG91cnMnLCB0cnVlKTtcblxuICAgIHZhciBiYXNlQ29uZmlnID0ge1xuICAgICAgICBjYWxlbmRhcjogZGVmYXVsdENhbGVuZGFyLFxuICAgICAgICBsb25nRGF0ZUZvcm1hdDogZGVmYXVsdExvbmdEYXRlRm9ybWF0LFxuICAgICAgICBpbnZhbGlkRGF0ZTogZGVmYXVsdEludmFsaWREYXRlLFxuICAgICAgICBvcmRpbmFsOiBkZWZhdWx0T3JkaW5hbCxcbiAgICAgICAgZGF5T2ZNb250aE9yZGluYWxQYXJzZTogZGVmYXVsdERheU9mTW9udGhPcmRpbmFsUGFyc2UsXG4gICAgICAgIHJlbGF0aXZlVGltZTogZGVmYXVsdFJlbGF0aXZlVGltZSxcblxuICAgICAgICBtb250aHM6IGRlZmF1bHRMb2NhbGVNb250aHMsXG4gICAgICAgIG1vbnRoc1Nob3J0OiBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQsXG5cbiAgICAgICAgd2VlazogZGVmYXVsdExvY2FsZVdlZWssXG5cbiAgICAgICAgd2Vla2RheXM6IGRlZmF1bHRMb2NhbGVXZWVrZGF5cyxcbiAgICAgICAgd2Vla2RheXNNaW46IGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbixcbiAgICAgICAgd2Vla2RheXNTaG9ydDogZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQsXG5cbiAgICAgICAgbWVyaWRpZW1QYXJzZTogZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2VcbiAgICB9O1xuXG4gICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbG9jYWxlIGNvbmZpZyBmaWxlc1xuICAgIHZhciBsb2NhbGVzID0ge307XG4gICAgdmFyIGxvY2FsZUZhbWlsaWVzID0ge307XG4gICAgdmFyIGdsb2JhbExvY2FsZTtcblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuICAgIC8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgIGZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgICAgICB2YXIgaSA9IDAsIGosIG5leHQsIGxvY2FsZSwgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZWdpc3RlciBhbmQgbG9hZCBhbGwgdGhlIGxvY2FsZXMgaW4gTm9kZVxuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSAmJlxuICAgICAgICAgICAgICAgIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICAgICAgdmFyIGFsaWFzZWRSZXF1aXJlID0gcmVxdWlyZTtcbiAgICAgICAgICAgICAgICBhbGlhc2VkUmVxdWlyZSgnLi9sb2NhbGUvJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShvbGRMb2NhbGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxvY2FsZSBrZXkuXG4gICAgZnVuY3Rpb24gZ2V0U2V0R2xvYmFsTG9jYWxlIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgY29uc29sZSAhPT0gICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgLy93YXJuIHVzZXIgaWYgYXJndW1lbnRzIGFyZSBwYXNzZWQgYnV0IHRoZSBsb2NhbGUgY291bGQgbm90IGJlIHNldFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xvY2FsZSAnICsga2V5ICsgICcgbm90IGZvdW5kLiBEaWQgeW91IGZvcmdldCB0byBsb2FkIGl0PycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lTG9jYWxlIChuYW1lLCBjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZSwgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcbiAgICAgICAgICAgIGNvbmZpZy5hYmJyID0gbmFtZTtcbiAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUoJ2RlZmluZUxvY2FsZU92ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd1c2UgbW9tZW50LnVwZGF0ZUxvY2FsZShsb2NhbGVOYW1lLCBjb25maWcpIHRvIGNoYW5nZSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhbiBleGlzdGluZyBsb2NhbGUuIG1vbWVudC5kZWZpbmVMb2NhbGUobG9jYWxlTmFtZSwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uZmlnKSBzaG91bGQgb25seSBiZSB1c2VkIGZvciBjcmVhdGluZyBhIG5ldyBsb2NhbGUgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZGVmaW5lLWxvY2FsZS8gZm9yIG1vcmUgaW5mby4nKTtcbiAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSBsb2NhbGVzW25hbWVdLl9jb25maWc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXS5fY29uZmlnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoY29uZmlnLnBhcmVudExvY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlLl9jb25maWc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbY29uZmlnLnBhcmVudExvY2FsZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZShtZXJnZUNvbmZpZ3MocGFyZW50Q29uZmlnLCBjb25maWcpKTtcblxuICAgICAgICAgICAgaWYgKGxvY2FsZUZhbWlsaWVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlRmFtaWxpZXNbbmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVMb2NhbGUoeC5uYW1lLCB4LmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIHNldCB0aGUgbG9jYWxlIEFGVEVSIGFsbCBjaGlsZCBsb2NhbGVzIGhhdmUgYmVlblxuICAgICAgICAgICAgLy8gY3JlYXRlZCwgc28gd2Ugd29uJ3QgZW5kIHVwIHdpdGggdGhlIGNoaWxkIGxvY2FsZSBzZXQuXG4gICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbGUobmFtZSwgY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZSwgdG1wTG9jYWxlLCBwYXJlbnRDb25maWcgPSBiYXNlQ29uZmlnO1xuICAgICAgICAgICAgLy8gTUVSR0VcbiAgICAgICAgICAgIHRtcExvY2FsZSA9IGxvYWRMb2NhbGUobmFtZSk7XG4gICAgICAgICAgICBpZiAodG1wTG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSB0bXBMb2NhbGUuX2NvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNvbmZpZyk7XG4gICAgICAgICAgICBsb2NhbGUgPSBuZXcgTG9jYWxlKGNvbmZpZyk7XG4gICAgICAgICAgICBsb2NhbGUucGFyZW50TG9jYWxlID0gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGU7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgZ2V0U2V0R2xvYmFsTG9jYWxlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcGFzcyBudWxsIGZvciBjb25maWcgdG8gdW51cGRhdGUsIHVzZWZ1bCBmb3IgdGVzdHNcbiAgICAgICAgICAgIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlc1tuYW1lXS5wYXJlbnRMb2NhbGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsb2NhbGVzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgbG9jYWxlIGRhdGFcbiAgICBmdW5jdGlvbiBnZXRMb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TG9jYWxlcygpIHtcbiAgICAgICAgcmV0dXJuIGtleXMobG9jYWxlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyAobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIHZhciBhID0gbS5fYTtcblxuICAgICAgICBpZiAoYSAmJiBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgYVtNT05USF0gICAgICAgPCAwIHx8IGFbTU9OVEhdICAgICAgID4gMTEgID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIGFbREFURV0gICAgICAgIDwgMSB8fCBhW0RBVEVdICAgICAgICA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIGFbSE9VUl0gICAgICAgIDwgMCB8fCBhW0hPVVJdICAgICAgICA+IDI0IHx8IChhW0hPVVJdID09PSAyNCAmJiAoYVtNSU5VVEVdICE9PSAwIHx8IGFbU0VDT05EXSAhPT0gMCB8fCBhW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICAgICAgYVtNSU5VVEVdICAgICAgPCAwIHx8IGFbTUlOVVRFXSAgICAgID4gNTkgID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBhW1NFQ09ORF0gICAgICA8IDAgfHwgYVtTRUNPTkRdICAgICAgPiA1OSAgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdIDwgMCB8fCBhW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrcyAmJiBvdmVyZmxvdyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IFdFRUs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd1dlZWtkYXkgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLREFZO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy5cbiAgICBmdW5jdGlvbiBkZWZhdWx0cyhhLCBiLCBjKSB7XG4gICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIC8vIGhvb2tzIGlzIGFjdHVhbGx5IHRoZSBleHBvcnRlZCBtb21lbnQgb2JqZWN0XG4gICAgICAgIHZhciBub3dWYWx1ZSA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgICAgICByZXR1cm4gW25vd1ZhbHVlLmdldFVUQ0Z1bGxZZWFyKCksIG5vd1ZhbHVlLmdldFVUQ01vbnRoKCksIG5vd1ZhbHVlLmdldFVUQ0RhdGUoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRNb250aCgpLCBub3dWYWx1ZS5nZXREYXRlKCldO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5IChjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCBleHBlY3RlZFdlZWtkYXksIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSB8fCBjb25maWcuX2RheU9mWWVhciA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIDI0OjAwOjAwLjAwMFxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX25leHREYXkgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IGNyZWF0ZVVUQ0RhdGUgOiBjcmVhdGVEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIGV4cGVjdGVkV2Vla2RheSA9IGNvbmZpZy5fdXNlVVRDID8gY29uZmlnLl9kLmdldFVUQ0RheSgpIDogY29uZmlnLl9kLmdldERheSgpO1xuXG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGZvciBtaXNtYXRjaGluZyBkYXkgb2Ygd2Vla1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIHR5cGVvZiBjb25maWcuX3cuZCAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uZmlnLl93LmQgIT09IGV4cGVjdGVkV2Vla2RheSkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykud2Vla2RheU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcCwgd2Vla2RheU92ZXJmbG93O1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGNyZWF0ZUxvY2FsKCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGVmYXVsdHMody5FLCAxKTtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgMSB8fCB3ZWVrZGF5ID4gNykge1xuICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHZhciBjdXJXZWVrID0gd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCBkb3csIGRveSk7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCBjdXJXZWVrLnllYXIpO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgd2Vlay5cbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIGN1cldlZWsud2Vlayk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCAwIHx8IHdlZWtkYXkgPiA2KSB7XG4gICAgICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICAgICAgaWYgKHcuZSA8IDAgfHwgdy5lID4gNikge1xuICAgICAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAod2VlayA8IDEgfHwgd2VlayA+IHdlZWtzSW5ZZWFyKHdlZWtZZWFyLCBkb3csIGRveSkpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd1dlZWtzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh3ZWVrZGF5T3ZlcmZsb3cgIT0gbnVsbCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93V2Vla2RheSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSk7XG4gICAgICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaXNvIDg2MDEgcmVnZXhcbiAgICAvLyAwMDAwLTAwLTAwIDAwMDAtVzAwIG9yIDAwMDAtVzAwLTAgKyBUICsgMDAgb3IgMDA6MDAgb3IgMDA6MDA6MDAgb3IgMDA6MDA6MDAuMDAwICsgKzAwOjAwIG9yICswMDAwIG9yICswMClcbiAgICB2YXIgZXh0ZW5kZWRJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86XFxkXFxkLVxcZFxcZHxXXFxkXFxkLVxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OjpcXGRcXGQoPzo6XFxkXFxkKD86Wy4sXVxcZCspPyk/KT8pKFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcbiAgICB2YXIgYmFzaWNJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSkoPzpcXGRcXGRcXGRcXGR8V1xcZFxcZFxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGQpKSg/OihUfCApKFxcZFxcZCg/OlxcZFxcZCg/OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG5cbiAgICB2YXIgdHpSZWdleCA9IC9afFsrLV1cXGRcXGQoPzo6P1xcZFxcZCk/LztcblxuICAgIHZhciBpc29EYXRlcyA9IFtcbiAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGRcXGQtXFxkXFxkL10sXG4gICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkXFxkLVxcZFxcZC9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZFxcZC1cXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkXFxkLywgZmFsc2VdLFxuICAgICAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXSxcbiAgICAgICAgWydZWVlZLU1NJywgL1xcZHs0fS1cXGRcXGQvLCBmYWxzZV0sXG4gICAgICAgIFsnWVlZWVlZTU1ERCcsIC9bKy1dXFxkezEwfS9dLFxuICAgICAgICBbJ1lZWVlNTUREJywgL1xcZHs4fS9dLFxuICAgICAgICAvLyBZWVlZTU0gaXMgTk9UIGFsbG93ZWQgYnkgdGhlIHN0YW5kYXJkXG4gICAgICAgIFsnR0dHR1tXXVdXRScsIC9cXGR7NH1XXFxkezN9L10sXG4gICAgICAgIFsnR0dHR1tXXVdXJywgL1xcZHs0fVdcXGR7Mn0vLCBmYWxzZV0sXG4gICAgICAgIFsnWVlZWURERCcsIC9cXGR7N30vXVxuICAgIF07XG5cbiAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgdmFyIGlzb1RpbWVzID0gW1xuICAgICAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MsU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZCxcXGQrL10sXG4gICAgICAgIFsnSEg6bW06c3MnLCAvXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISDptbScsIC9cXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEhtbXNzLlNTU1MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIbW1zcyxTU1NTJywgL1xcZFxcZFxcZFxcZFxcZFxcZCxcXGQrL10sXG4gICAgICAgIFsnSEhtbXNzJywgL1xcZFxcZFxcZFxcZFxcZFxcZC9dLFxuICAgICAgICBbJ0hIbW0nLCAvXFxkXFxkXFxkXFxkL10sXG4gICAgICAgIFsnSEgnLCAvXFxkXFxkL11cbiAgICBdO1xuXG4gICAgdmFyIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2k7XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBleHRlbmRlZElzb1JlZ2V4LmV4ZWMoc3RyaW5nKSB8fCBiYXNpY0lzb1JlZ2V4LmV4ZWMoc3RyaW5nKSxcbiAgICAgICAgICAgIGFsbG93VGltZSwgZGF0ZUZvcm1hdCwgdGltZUZvcm1hdCwgdHpGb3JtYXQ7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pc28gPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMobWF0Y2hbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGVGb3JtYXQgPSBpc29EYXRlc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dUaW1lID0gaXNvRGF0ZXNbaV1bMl0gIT09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0ZUZvcm1hdCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoWzNdKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhtYXRjaFszXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzJdIHNob3VsZCBiZSAnVCcgb3Igc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVGb3JtYXQgPSAobWF0Y2hbMl0gfHwgJyAnKSArIGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVGb3JtYXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYWxsb3dUaW1lICYmIHRpbWVGb3JtYXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFs0XSkge1xuICAgICAgICAgICAgICAgIGlmICh0elJlZ2V4LmV4ZWMobWF0Y2hbNF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHR6Rm9ybWF0ID0gJ1onO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnLl9mID0gZGF0ZUZvcm1hdCArICh0aW1lRm9ybWF0IHx8ICcnKSArICh0ekZvcm1hdCB8fCAnJyk7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJGQyAyODIyIHJlZ2V4OiBGb3IgZGV0YWlscyBzZWUgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzI4MjIjc2VjdGlvbi0zLjNcbiAgICB2YXIgcmZjMjgyMiA9IC9eKD86KE1vbnxUdWV8V2VkfFRodXxGcml8U2F0fFN1biksP1xccyk/KFxcZHsxLDJ9KVxccyhKYW58RmVifE1hcnxBcHJ8TWF5fEp1bnxKdWx8QXVnfFNlcHxPY3R8Tm92fERlYylcXHMoXFxkezIsNH0pXFxzKFxcZFxcZCk6KFxcZFxcZCkoPzo6KFxcZFxcZCkpP1xccyg/OihVVHxHTVR8W0VDTVBdW1NEXVQpfChbWnpdKXwoWystXVxcZHs0fSkpJC87XG5cbiAgICBmdW5jdGlvbiBleHRyYWN0RnJvbVJGQzI4MjJTdHJpbmdzKHllYXJTdHIsIG1vbnRoU3RyLCBkYXlTdHIsIGhvdXJTdHIsIG1pbnV0ZVN0ciwgc2Vjb25kU3RyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXG4gICAgICAgICAgICB1bnRydW5jYXRlWWVhcih5ZWFyU3RyKSxcbiAgICAgICAgICAgIGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydC5pbmRleE9mKG1vbnRoU3RyKSxcbiAgICAgICAgICAgIHBhcnNlSW50KGRheVN0ciwgMTApLFxuICAgICAgICAgICAgcGFyc2VJbnQoaG91clN0ciwgMTApLFxuICAgICAgICAgICAgcGFyc2VJbnQobWludXRlU3RyLCAxMClcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAoc2Vjb25kU3RyKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludChzZWNvbmRTdHIsIDEwKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVudHJ1bmNhdGVZZWFyKHllYXJTdHIpIHtcbiAgICAgICAgdmFyIHllYXIgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XG4gICAgICAgIGlmICh5ZWFyIDw9IDQ5KSB7XG4gICAgICAgICAgICByZXR1cm4gMjAwMCArIHllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoeWVhciA8PSA5OTkpIHtcbiAgICAgICAgICAgIHJldHVybiAxOTAwICsgeWVhcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geWVhcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwcm9jZXNzUkZDMjgyMihzKSB7XG4gICAgICAgIC8vIFJlbW92ZSBjb21tZW50cyBhbmQgZm9sZGluZyB3aGl0ZXNwYWNlIGFuZCByZXBsYWNlIG11bHRpcGxlLXNwYWNlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcKFteKV0qXFwpfFtcXG5cXHRdL2csICcgJykucmVwbGFjZSgvKFxcc1xccyspL2csICcgJykucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tXZWVrZGF5KHdlZWtkYXlTdHIsIHBhcnNlZElucHV0LCBjb25maWcpIHtcbiAgICAgICAgaWYgKHdlZWtkYXlTdHIpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IFJlcGxhY2UgdGhlIHZhbmlsbGEgSlMgRGF0ZSBvYmplY3Qgd2l0aCBhbiBpbmRlcGVudGVudCBkYXktb2Ytd2VlayBjaGVjay5cbiAgICAgICAgICAgIHZhciB3ZWVrZGF5UHJvdmlkZWQgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydC5pbmRleE9mKHdlZWtkYXlTdHIpLFxuICAgICAgICAgICAgICAgIHdlZWtkYXlBY3R1YWwgPSBuZXcgRGF0ZShwYXJzZWRJbnB1dFswXSwgcGFyc2VkSW5wdXRbMV0sIHBhcnNlZElucHV0WzJdKS5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5UHJvdmlkZWQgIT09IHdlZWtkYXlBY3R1YWwpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS53ZWVrZGF5TWlzbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgb2JzT2Zmc2V0cyA9IHtcbiAgICAgICAgVVQ6IDAsXG4gICAgICAgIEdNVDogMCxcbiAgICAgICAgRURUOiAtNCAqIDYwLFxuICAgICAgICBFU1Q6IC01ICogNjAsXG4gICAgICAgIENEVDogLTUgKiA2MCxcbiAgICAgICAgQ1NUOiAtNiAqIDYwLFxuICAgICAgICBNRFQ6IC02ICogNjAsXG4gICAgICAgIE1TVDogLTcgKiA2MCxcbiAgICAgICAgUERUOiAtNyAqIDYwLFxuICAgICAgICBQU1Q6IC04ICogNjBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlT2Zmc2V0KG9ic09mZnNldCwgbWlsaXRhcnlPZmZzZXQsIG51bU9mZnNldCkge1xuICAgICAgICBpZiAob2JzT2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gb2JzT2Zmc2V0c1tvYnNPZmZzZXRdO1xuICAgICAgICB9IGVsc2UgaWYgKG1pbGl0YXJ5T2Zmc2V0KSB7XG4gICAgICAgICAgICAvLyB0aGUgb25seSBhbGxvd2VkIG1pbGl0YXJ5IHR6IGlzIFpcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGhtID0gcGFyc2VJbnQobnVtT2Zmc2V0LCAxMCk7XG4gICAgICAgICAgICB2YXIgbSA9IGhtICUgMTAwLCBoID0gKGhtIC0gbSkgLyAxMDA7XG4gICAgICAgICAgICByZXR1cm4gaCAqIDYwICsgbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgYW5kIHRpbWUgZnJvbSByZWYgMjgyMiBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tUkZDMjgyMihjb25maWcpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcmZjMjgyMi5leGVjKHByZXByb2Nlc3NSRkMyODIyKGNvbmZpZy5faSkpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZWRBcnJheSA9IGV4dHJhY3RGcm9tUkZDMjgyMlN0cmluZ3MobWF0Y2hbNF0sIG1hdGNoWzNdLCBtYXRjaFsyXSwgbWF0Y2hbNV0sIG1hdGNoWzZdLCBtYXRjaFs3XSk7XG4gICAgICAgICAgICBpZiAoIWNoZWNrV2Vla2RheShtYXRjaFsxXSwgcGFyc2VkQXJyYXksIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IHBhcnNlZEFycmF5O1xuICAgICAgICAgICAgY29uZmlnLl90em0gPSBjYWxjdWxhdGVPZmZzZXQobWF0Y2hbOF0sIG1hdGNoWzldLCBtYXRjaFsxMF0pO1xuXG4gICAgICAgICAgICBjb25maWcuX2QgPSBjcmVhdGVVVENEYXRlLmFwcGx5KG51bGwsIGNvbmZpZy5fYSk7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpIC0gY29uZmlnLl90em0pO1xuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5yZmMyODIyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGNvbmZpZy5faSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tUkZDMjgyMihjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmFsIGF0dGVtcHQsIHVzZSBJbnB1dCBGYWxsYmFja1xuICAgICAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgIH1cblxuICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAndmFsdWUgcHJvdmlkZWQgaXMgbm90IGluIGEgcmVjb2duaXplZCBSRkMyODIyIG9yIElTTyBmb3JtYXQuIG1vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlKCksICcgK1xuICAgICAgICAnd2hpY2ggaXMgbm90IHJlbGlhYmxlIGFjcm9zcyBhbGwgYnJvd3NlcnMgYW5kIHZlcnNpb25zLiBOb24gUkZDMjgyMi9JU08gZGF0ZSBmb3JtYXRzIGFyZSAnICtcbiAgICAgICAgJ2Rpc2NvdXJhZ2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYW4gdXBjb21pbmcgbWFqb3IgcmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9qcy1kYXRlLyBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIElTTyBzdGFuZGFyZFxuICAgIGhvb2tzLklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgUkZDIDI4MjIgZm9ybVxuICAgIGhvb2tzLlJGQ18yODIyID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIHRvIGFub3RoZXIgcGFydCBvZiB0aGUgY3JlYXRpb24gZmxvdyB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHNcbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gaG9va3MuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnLl9mID09PSBob29rcy5SRkNfMjgyMikge1xuICAgICAgICAgICAgY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBzdHJpbmcgPSAnJyArIGNvbmZpZy5faSxcbiAgICAgICAgICAgIGksIHBhcnNlZElucHV0LCB0b2tlbnMsIHRva2VuLCBza2lwcGVkLFxuICAgICAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwO1xuXG4gICAgICAgIHRva2VucyA9IGV4cGFuZEZvcm1hdChjb25maWcuX2YsIGNvbmZpZy5fbG9jYWxlKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b2tlbicsIHRva2VuLCAncGFyc2VkSW5wdXQnLCBwYXJzZWRJbnB1dCxcbiAgICAgICAgICAgIC8vICAgICAgICAgJ3JlZ2V4JywgZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGVhciBfMTJoIGZsYWcgaWYgaG91ciBpcyA8PSAxMlxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdIDw9IDEyICYmXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmXG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykucGFyc2VkRGF0ZVBhcnRzID0gY29uZmlnLl9hLnNsaWNlKDApO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5tZXJpZGllbSA9IGNvbmZpZy5fbWVyaWRpZW07XG4gICAgICAgIC8vIGhhbmRsZSBtZXJpZGllbVxuICAgICAgICBjb25maWcuX2FbSE9VUl0gPSBtZXJpZGllbUZpeFdyYXAoY29uZmlnLl9sb2NhbGUsIGNvbmZpZy5fYVtIT1VSXSwgY29uZmlnLl9tZXJpZGllbSk7XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtRml4V3JhcCAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgYXJyYXkgb2YgZm9ybWF0IHN0cmluZ3NcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICAgICAgaWYgKHNjb3JlVG9CZWF0ID09IG51bGwgfHwgY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgICAgICBzY29yZVRvQmVhdCA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbU9iamVjdChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpO1xuICAgICAgICBjb25maWcuX2EgPSBtYXAoW2kueWVhciwgaS5tb250aCwgaS5kYXkgfHwgaS5kYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF0sIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgcmVzID0gbmV3IE1vbWVudChjaGVja092ZXJmbG93KHByZXBhcmVDb25maWcoY29uZmlnKSkpO1xuICAgICAgICBpZiAocmVzLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICAvLyBBZGRpbmcgaXMgc21hcnQgZW5vdWdoIGFyb3VuZCBEU1RcbiAgICAgICAgICAgIHJlcy5hZGQoMSwgJ2QnKTtcbiAgICAgICAgICAgIHJlcy5fbmV4dERheSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZUNvbmZpZyAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IGdldExvY2FsZShjb25maWcuX2wpO1xuXG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCAoZm9ybWF0ID09PSB1bmRlZmluZWQgJiYgaW5wdXQgPT09ICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IGlucHV0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWQoY29uZmlnKSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpc1VuZGVmaW5lZChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGhvb2tzLm5vdygpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dC52YWx1ZU9mKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTG9jYWxPclVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGlzVVRDKSB7XG4gICAgICAgIHZhciBjID0ge307XG5cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gdHJ1ZSB8fCBsb2NhbGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKGlzT2JqZWN0KGlucHV0KSAmJiBpc09iamVjdEVtcHR5KGlucHV0KSkgfHxcbiAgICAgICAgICAgICAgICAoaXNBcnJheShpbnB1dCkgJiYgaW5wdXQubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgaW5wdXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGVNaW4gPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9taW4tbWF4LycsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUludmFsaWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG5cbiAgICB2YXIgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWluIGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvbWluLW1heC8nLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpICYmIG90aGVyLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gUGljayBhIG1vbWVudCBtIGZyb20gbW9tZW50cyBzbyB0aGF0IG1bZm5dKG90aGVyKSBpcyB0cnVlIGZvciBhbGxcbiAgICAvLyBvdGhlci4gVGhpcyByZWxpZXMgb24gdGhlIGZ1bmN0aW9uIGZuIHRvIGJlIHRyYW5zaXRpdmUuXG4gICAgLy9cbiAgICAvLyBtb21lbnRzIHNob3VsZCBlaXRoZXIgYmUgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMgb3IgYW4gYXJyYXksIHdob3NlXG4gICAgLy8gZmlyc3QgZWxlbWVudCBpcyBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cy5cbiAgICBmdW5jdGlvbiBwaWNrQnkoZm4sIG1vbWVudHMpIHtcbiAgICAgICAgdmFyIHJlcywgaTtcbiAgICAgICAgaWYgKG1vbWVudHMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobW9tZW50c1swXSkpIHtcbiAgICAgICAgICAgIG1vbWVudHMgPSBtb21lbnRzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbW9tZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVMb2NhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIW1vbWVudHNbaV0uaXNWYWxpZCgpIHx8IG1vbWVudHNbaV1bZm5dKHJlcykpIHtcbiAgICAgICAgICAgICAgICByZXMgPSBtb21lbnRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIFtdLnNvcnQgaW5zdGVhZD9cbiAgICBmdW5jdGlvbiBtaW4gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1heCAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3cgPyBEYXRlLm5vdygpIDogKyhuZXcgRGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgdmFyIG9yZGVyaW5nID0gWyd5ZWFyJywgJ3F1YXJ0ZXInLCAnbW9udGgnLCAnd2VlaycsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJywgJ21pbGxpc2Vjb25kJ107XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uVmFsaWQobSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbSkge1xuICAgICAgICAgICAgaWYgKCEoaW5kZXhPZi5jYWxsKG9yZGVyaW5nLCBrZXkpICE9PSAtMSAmJiAobVtrZXldID09IG51bGwgfHwgIWlzTmFOKG1ba2V5XSkpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1bml0SGFzRGVjaW1hbCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZGVyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobVtvcmRlcmluZ1tpXV0pIHtcbiAgICAgICAgICAgICAgICBpZiAodW5pdEhhc0RlY2ltYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBvbmx5IGFsbG93IG5vbi1pbnRlZ2VycyBmb3Igc21hbGxlc3QgdW5pdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChtW29yZGVyaW5nW2ldXSkgIT09IHRvSW50KG1bb3JkZXJpbmdbaV1dKSkge1xuICAgICAgICAgICAgICAgICAgICB1bml0SGFzRGVjaW1hbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZCQxKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVJbnZhbGlkJDEoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbihOYU4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIER1cmF0aW9uIChkdXJhdGlvbikge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IDAsXG4gICAgICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgICAgICB0aGlzLl9pc1ZhbGlkID0gaXNEdXJhdGlvblZhbGlkKG5vcm1hbGl6ZWRJbnB1dCk7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAxMDAwICogNjAgKiA2MDsgLy91c2luZyAxMDAwICogNjAgKiA2MCBpbnN0ZWFkIG9mIDM2ZTUgdG8gYXZvaWQgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yOTc4XG4gICAgICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgICAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX2RheXMgPSArZGF5cyArXG4gICAgICAgICAgICB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdG8gdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgK1xuICAgICAgICAgICAgcXVhcnRlcnMgKiAzICtcbiAgICAgICAgICAgIHllYXJzICogMTI7XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGdldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzUm91bmQgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoLTEgKiBudW1iZXIpICogLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgIG1hdGNoU2hvcnRPZmZzZXQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hTaG9ydE9mZnNldCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1onLCAnWlonXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl90em0gPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoU2hvcnRPZmZzZXQsIGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIHRpbWV6b25lIGNodW5rZXJcbiAgICAvLyAnKzEwOjAwJyA+IFsnMTAnLCAgJzAwJ11cbiAgICAvLyAnLTE1MzAnICA+IFsnLTE1JywgJzMwJ11cbiAgICB2YXIgY2h1bmtPZmZzZXQgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2k7XG5cbiAgICBmdW5jdGlvbiBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoZXIsIHN0cmluZykge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoZXIpO1xuXG4gICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gbWludXRlcyA9PT0gMCA/XG4gICAgICAgICAgMCA6XG4gICAgICAgICAgcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyBpbnB1dC52YWx1ZU9mKCkgOiBjcmVhdGVMb2NhbChpbnB1dCkudmFsdWVPZigpKSAtIHJlcy52YWx1ZU9mKCk7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZShyZXMuX2QudmFsdWVPZigpICsgZGlmZik7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQocmVzLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZU9mZnNldCAobSkge1xuICAgICAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgcmV0dXJuIC1NYXRoLnJvdW5kKG0uX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgaG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbiAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgLy9cbiAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICBmdW5jdGlvbiBnZXRTZXRPZmZzZXQgKGlucHV0LCBrZWVwTG9jYWxUaW1lLCBrZWVwTWludXRlcykge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaFNob3J0T2Zmc2V0LCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYgJiYgIWtlZXBNaW51dGVzKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9mZnNldCAhPT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBhZGRTdWJ0cmFjdCh0aGlzLCBjcmVhdGVEdXJhdGlvbihpbnB1dCAtIG9mZnNldCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0Wm9uZSAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAtaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KGlucHV0LCBrZWVwTG9jYWxUaW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLXRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1VUQyAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICByZXR1cm4gdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9Mb2NhbCAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGdldERhdGVPZmZzZXQodGhpcyksICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQgKCkge1xuICAgICAgICBpZiAodGhpcy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIHRab25lID0gb2Zmc2V0RnJvbVN0cmluZyhtYXRjaE9mZnNldCwgdGhpcy5faSk7XG4gICAgICAgICAgICBpZiAodFpvbmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRab25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0IChpbnB1dCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQgPSBpbnB1dCA/IGNyZWF0ZUxvY2FsKGlucHV0KS51dGNPZmZzZXQoKSA6IDA7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnV0Y09mZnNldCgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWUgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCgwKS51dGNPZmZzZXQoKSB8fFxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoKSA+IHRoaXMuY2xvbmUoKS5tb250aCg1KS51dGNPZmZzZXQoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZCAoKSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5faXNEU1RTaGlmdGVkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjID0ge307XG5cbiAgICAgICAgY29weUNvbmZpZyhjLCB0aGlzKTtcbiAgICAgICAgYyA9IHByZXBhcmVDb25maWcoYyk7XG5cbiAgICAgICAgaWYgKGMuX2EpIHtcbiAgICAgICAgICAgIHZhciBvdGhlciA9IGMuX2lzVVRDID8gY3JlYXRlVVRDKGMuX2EpIDogY3JlYXRlTG9jYWwoYy5fYSk7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSB0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgICAgIGNvbXBhcmVBcnJheXMoYy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/ICF0aGlzLl9pc1VUQyA6IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjT2Zmc2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5faXNVVEMgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0YyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/IHRoaXMuX2lzVVRDICYmIHRoaXMuX29mZnNldCA9PT0gMCA6IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgIHZhciBhc3BOZXRSZWdleCA9IC9eKFxcLXxcXCspPyg/OihcXGQqKVsuIF0pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKShcXC5cXGQqKT8pPyQvO1xuXG4gICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgLy8gYW5kIGZ1cnRoZXIgbW9kaWZpZWQgdG8gYWxsb3cgZm9yIHN0cmluZ3MgY29udGFpbmluZyBib3RoIHdlZWsgYW5kIGRheVxuICAgIHZhciBpc29SZWdleCA9IC9eKC18XFwrKT9QKD86KFstK10/WzAtOSwuXSopWSk/KD86KFstK10/WzAtOSwuXSopTSk/KD86KFstK10/WzAtOSwuXSopVyk/KD86KFstK10/WzAtOSwuXSopRCk/KD86VCg/OihbLStdP1swLTksLl0qKUgpPyg/OihbLStdP1swLTksLl0qKU0pPyg/OihbLStdP1swLTksLl0qKVMpPyk/JC87XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVEdXJhdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgZGlmZlJlcztcblxuICAgICAgICBpZiAoaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zIDogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkICA6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE0gIDogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgIDogMCxcbiAgICAgICAgICAgICAgICBkICA6IHRvSW50KG1hdGNoW0RBVEVdKSAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaCAgOiB0b0ludChtYXRjaFtIT1VSXSkgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG0gIDogdG9JbnQobWF0Y2hbTUlOVVRFXSkgICAgICAgICAgICAgICAgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBzICA6IHRvSW50KG1hdGNoW1NFQ09ORF0pICAgICAgICAgICAgICAgICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbXMgOiB0b0ludChhYnNSb3VuZChtYXRjaFtNSUxMSVNFQ09ORF0gKiAxMDAwKSkgKiBzaWduIC8vIHRoZSBtaWxsaXNlY29uZCBkZWNpbWFsIHBvaW50IGlzIGluY2x1ZGVkIGluIHRoZSBtYXRjaFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb1JlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogKG1hdGNoWzFdID09PSAnKycpID8gMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5IDogcGFyc2VJc28obWF0Y2hbMl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIE0gOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdyA6IHBhcnNlSXNvKG1hdGNoWzRdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBkIDogcGFyc2VJc28obWF0Y2hbNV0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGggOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbSA6IHBhcnNlSXNvKG1hdGNoWzddLCBzaWduKSxcbiAgICAgICAgICAgICAgICBzIDogcGFyc2VJc28obWF0Y2hbOF0sIHNpZ24pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IG51bGwpIHsvLyBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiYgKCdmcm9tJyBpbiBkdXJhdGlvbiB8fCAndG8nIGluIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgZGlmZlJlcyA9IG1vbWVudHNEaWZmZXJlbmNlKGNyZWF0ZUxvY2FsKGR1cmF0aW9uLmZyb20pLCBjcmVhdGVMb2NhbChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgY3JlYXRlRHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG4gICAgY3JlYXRlRHVyYXRpb24uaW52YWxpZCA9IGNyZWF0ZUludmFsaWQkMTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvIChpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgaWYgKCEoYmFzZS5pc1ZhbGlkKCkgJiYgb3RoZXIuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG4gICAgICAgIH1cblxuICAgICAgICBvdGhlciA9IGNsb25lV2l0aE9mZnNldChvdGhlciwgYmFzZSk7XG4gICAgICAgIGlmIChiYXNlLmlzQmVmb3JlKG90aGVyKSkge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKG90aGVyLCBiYXNlKTtcbiAgICAgICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSAtcmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHJlcy5tb250aHMgPSAtcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVtb3ZlICduYW1lJyBhcmcgYWZ0ZXIgZGVwcmVjYXRpb24gaXMgcmVtb3ZlZFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuICcgK1xuICAgICAgICAgICAgICAgICdTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9hZGQtaW52ZXJ0ZWQtcGFyYW0vIGZvciBtb3JlIGluZm8uJyk7XG4gICAgICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gY3JlYXRlRHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICAgICAgYWRkU3VidHJhY3QodGhpcywgZHVyLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3VidHJhY3QgKG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gYWJzUm91bmQoZHVyYXRpb24uX2RheXMpLFxuICAgICAgICAgICAgbW9udGhzID0gYWJzUm91bmQoZHVyYXRpb24uX21vbnRocyk7XG5cbiAgICAgICAgaWYgKCFtb20uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAvLyBObyBvcFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKG1vbSwgZ2V0KG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIHNldCQxKG1vbSwgJ0RhdGUnLCBnZXQobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZShtb20uX2QudmFsdWVPZigpICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhZGQgICAgICA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbiAgICB2YXIgc3VidHJhY3QgPSBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0Jyk7XG5cbiAgICBmdW5jdGlvbiBnZXRDYWxlbmRhckZvcm1hdChteU1vbWVudCwgbm93KSB7XG4gICAgICAgIHZhciBkaWZmID0gbXlNb21lbnQuZGlmZihub3csICdkYXlzJywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGVuZGFyJDEgKHRpbWUsIGZvcm1hdHMpIHtcbiAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgICAgIHZhciBub3cgPSB0aW1lIHx8IGNyZWF0ZUxvY2FsKCksXG4gICAgICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGhvb2tzLmNhbGVuZGFyRm9ybWF0KHRoaXMsIHNvZCkgfHwgJ3NhbWVFbHNlJztcblxuICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0cyAmJiAoaXNGdW5jdGlvbihmb3JtYXRzW2Zvcm1hdF0pID8gZm9ybWF0c1tmb3JtYXRdLmNhbGwodGhpcywgbm93KSA6IGZvcm1hdHNbZm9ybWF0XSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KG91dHB1dCB8fCB0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMsIGNyZWF0ZUxvY2FsKG5vdykpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW9tZW50KHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWZ0ZXIgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKCFpc1VuZGVmaW5lZCh1bml0cykgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA+IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsSW5wdXQudmFsdWVPZigpIDwgdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmVmb3JlIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyghaXNVbmRlZmluZWQodW5pdHMpID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPCBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKSA8IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZXR3ZWVuIChmcm9tLCB0bywgdW5pdHMsIGluY2x1c2l2aXR5KSB7XG4gICAgICAgIGluY2x1c2l2aXR5ID0gaW5jbHVzaXZpdHkgfHwgJygpJztcbiAgICAgICAgcmV0dXJuIChpbmNsdXNpdml0eVswXSA9PT0gJygnID8gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSA6ICF0aGlzLmlzQmVmb3JlKGZyb20sIHVuaXRzKSkgJiZcbiAgICAgICAgICAgIChpbmNsdXNpdml0eVsxXSA9PT0gJyknID8gdGhpcy5pc0JlZm9yZSh0bywgdW5pdHMpIDogIXRoaXMuaXNBZnRlcih0bywgdW5pdHMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpLFxuICAgICAgICAgICAgaW5wdXRNcztcbiAgICAgICAgaWYgKCEodGhpcy5pc1ZhbGlkKCkgJiYgbG9jYWxJbnB1dC5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyB8fCAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCkgPT09IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKS52YWx1ZU9mKCkgPD0gaW5wdXRNcyAmJiBpbnB1dE1zIDw9IHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lT3JBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzU2FtZShpbnB1dCwgdW5pdHMpIHx8IHRoaXMuaXNBZnRlcihpbnB1dCx1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lT3JCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQmVmb3JlKGlucHV0LHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaWZmIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgdmFyIHRoYXQsXG4gICAgICAgICAgICB6b25lRGVsdGEsXG4gICAgICAgICAgICBvdXRwdXQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoYXQgPSBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIHRoaXMpO1xuXG4gICAgICAgIGlmICghdGhhdC5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cblxuICAgICAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0O1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOiBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCkgLyAxMjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb250aCc6IG91dHB1dCA9IG1vbnRoRGlmZih0aGlzLCB0aGF0KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzogb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpIC8gMzsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMWUzOyBicmVhazsgLy8gMTAwMFxuICAgICAgICAgICAgY2FzZSAnbWludXRlJzogb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDZlNDsgYnJlYWs7IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgY2FzZSAnaG91cic6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyAzNmU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6IG91dHB1dCA9ICh0aGlzIC0gdGhhdCAtIHpvbmVEZWx0YSkgLyA4NjRlNTsgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOiBvdXRwdXQgPSAodGhpcyAtIHRoYXQgLSB6b25lRGVsdGEpIC8gNjA0OGU1OyBicmVhazsgLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgIGRlZmF1bHQ6IG91dHB1dCA9IHRoaXMgLSB0aGF0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoRGlmZiAoYSwgYikge1xuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jaGVjayBmb3IgbmVnYXRpdmUgemVybywgcmV0dXJuIHplcm8gaWYgbmVnYXRpdmUgemVyb1xuICAgICAgICByZXR1cm4gLSh3aG9sZU1vbnRoRGlmZiArIGFkanVzdCkgfHwgMDtcbiAgICB9XG5cbiAgICBob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcbiAgICBob29rcy5kZWZhdWx0Rm9ybWF0VXRjID0gJ1lZWVktTU0tRERUSEg6bW06c3NbWl0nO1xuXG4gICAgZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JU09TdHJpbmcoa2VlcE9mZnNldCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXRjID0ga2VlcE9mZnNldCAhPT0gdHJ1ZTtcbiAgICAgICAgdmFyIG0gPSB1dGMgPyB0aGlzLmNsb25lKCkudXRjKCkgOiB0aGlzO1xuICAgICAgICBpZiAobS55ZWFyKCkgPCAwIHx8IG0ueWVhcigpID4gOTk5OSkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCB1dGMgPyAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NaJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpKSB7XG4gICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICAgICAgaWYgKHV0Yykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSArIHRoaXMudXRjT2Zmc2V0KCkgKiA2MCAqIDEwMDApLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnWicsIGZvcm1hdE1vbWVudChtLCAnWicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sIHV0YyA/ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHJlcHJlc2VudGF0aW9uIG9mIGEgbW9tZW50IHRoYXQgY2FuXG4gICAgICogYWxzbyBiZSBldmFsdWF0ZWQgdG8gZ2V0IGEgbmV3IG1vbWVudCB3aGljaCBpcyB0aGUgc2FtZVxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cHM6Ly9ub2RlanMub3JnL2Rpc3QvbGF0ZXN0L2RvY3MvYXBpL3V0aWwuaHRtbCN1dGlsX2N1c3RvbV9pbnNwZWN0X2Z1bmN0aW9uX29uX29iamVjdHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdtb21lbnQuaW52YWxpZCgvKiAnICsgdGhpcy5faSArICcgKi8pJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVuYyA9ICdtb21lbnQnO1xuICAgICAgICB2YXIgem9uZSA9ICcnO1xuICAgICAgICBpZiAoIXRoaXMuaXNMb2NhbCgpKSB7XG4gICAgICAgICAgICBmdW5jID0gdGhpcy51dGNPZmZzZXQoKSA9PT0gMCA/ICdtb21lbnQudXRjJyA6ICdtb21lbnQucGFyc2Vab25lJztcbiAgICAgICAgICAgIHpvbmUgPSAnWic7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZWZpeCA9ICdbJyArIGZ1bmMgKyAnKFwiXSc7XG4gICAgICAgIHZhciB5ZWFyID0gKDAgPD0gdGhpcy55ZWFyKCkgJiYgdGhpcy55ZWFyKCkgPD0gOTk5OSkgPyAnWVlZWScgOiAnWVlZWVlZJztcbiAgICAgICAgdmFyIGRhdGV0aW1lID0gJy1NTS1ERFtUXUhIOm1tOnNzLlNTUyc7XG4gICAgICAgIHZhciBzdWZmaXggPSB6b25lICsgJ1tcIildJztcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQocHJlZml4ICsgeWVhciArIGRhdGV0aW1lICsgc3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQgKGlucHV0U3RyaW5nKSB7XG4gICAgICAgIGlmICghaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIGlucHV0U3RyaW5nID0gdGhpcy5pc1V0YygpID8gaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA6IGhvb2tzLmRlZmF1bHRGb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbSAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkgJiZcbiAgICAgICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fFxuICAgICAgICAgICAgICAgICBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbU5vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tKGNyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgICAgICgoaXNNb21lbnQodGltZSkgJiYgdGltZS5pc1ZhbGlkKCkpIHx8XG4gICAgICAgICAgICAgICAgIGNyZWF0ZUxvY2FsKHRpbWUpLmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih7ZnJvbTogdGhpcywgdG86IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b05vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy50byhjcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICAvLyBJZiBwYXNzZWQgYSBsb2NhbGUga2V5LCBpdCB3aWxsIHNldCB0aGUgbG9jYWxlIGZvciB0aGlzXG4gICAgLy8gaW5zdGFuY2UuICBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIHRoZSBsb2NhbGUgY29uZmlndXJhdGlvblxuICAgIC8vIHZhcmlhYmxlcyBmb3IgdGhpcyBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiBsb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbmV3TG9jYWxlRGF0YTtcblxuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRGF0YSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdkYXRlJyBpcyBhbiBhbGlhcyBmb3IgJ2RheScsIHNvIGl0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHN1Y2guXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ2RhdGUnKSB7XG4gICAgICAgICAgICB1bml0cyA9ICdkYXknO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWx1ZU9mICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2QudmFsdWVPZigpIC0gKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMudmFsdWVPZigpIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9EYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMudmFsdWVPZigpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4gW20ueWVhcigpLCBtLm1vbnRoKCksIG0uZGF0ZSgpLCBtLmhvdXIoKSwgbS5taW51dGUoKSwgbS5zZWNvbmQoKSwgbS5taWxsaXNlY29uZCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b09iamVjdCAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXJzOiBtLnllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoczogbS5tb250aCgpLFxuICAgICAgICAgICAgZGF0ZTogbS5kYXRlKCksXG4gICAgICAgICAgICBob3VyczogbS5ob3VycygpLFxuICAgICAgICAgICAgbWludXRlczogbS5taW51dGVzKCksXG4gICAgICAgICAgICBzZWNvbmRzOiBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kczogbS5taWxsaXNlY29uZHMoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gICAgICAgIC8vIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGxcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy50b0lTT1N0cmluZygpIDogbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkJDIgKCkge1xuICAgICAgICByZXR1cm4gaXNWYWxpZCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzaW5nRmxhZ3MgKCkge1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCBnZXRQYXJzaW5nRmxhZ3ModGhpcykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludmFsaWRBdCAoKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzaW5nRmxhZ3ModGhpcykub3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRpb25EYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5wdXQ6IHRoaXMuX2ksXG4gICAgICAgICAgICBmb3JtYXQ6IHRoaXMuX2YsXG4gICAgICAgICAgICBsb2NhbGU6IHRoaXMuX2xvY2FsZSxcbiAgICAgICAgICAgIGlzVVRDOiB0aGlzLl9pc1VUQyxcbiAgICAgICAgICAgIHN0cmljdDogdGhpcy5fc3RyaWN0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4gKHRva2VuLCBnZXR0ZXIpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCB0b2tlbi5sZW5ndGhdLCAwLCBnZXR0ZXIpO1xuICAgIH1cblxuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2cnLCAgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZ2cnLCAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHJywgICdpc29XZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnd2Vla1llYXInLCAxKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWtZZWFyJywgMSk7XG5cblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0dHJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnZ2cnLCAnZ2dnZ2cnLCAnR0dHRycsICdHR0dHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwodGhpcyxcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICB0aGlzLndlZWsoKSxcbiAgICAgICAgICAgICAgICB0aGlzLndlZWtkYXkoKSxcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFNldFdlZWtZZWFySGVscGVyLmNhbGwodGhpcyxcbiAgICAgICAgICAgICAgICBpbnB1dCwgdGhpcy5pc29XZWVrKCksIHRoaXMuaXNvV2Vla2RheSgpLCAxLCA0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJU09XZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIgKCkge1xuICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLmxvY2FsZURhdGEoKS5fd2VlaztcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXJIZWxwZXIoaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrc1RhcmdldDtcbiAgICAgICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKHRoaXMsIGRvdywgZG95KS55ZWFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2Vla3NUYXJnZXQgPSB3ZWVrc0luWWVhcihpbnB1dCwgZG93LCBkb3kpO1xuICAgICAgICAgICAgaWYgKHdlZWsgPiB3ZWVrc1RhcmdldCkge1xuICAgICAgICAgICAgICAgIHdlZWsgPSB3ZWVrc1RhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXRXZWVrQWxsLmNhbGwodGhpcywgaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFdlZWtBbGwod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXJEYXRhID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSksXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZShkYXlPZlllYXJEYXRhLnllYXIsIDAsIGRheU9mWWVhckRhdGEuZGF5T2ZZZWFyKTtcblxuICAgICAgICB0aGlzLnllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpKTtcbiAgICAgICAgdGhpcy5tb250aChkYXRlLmdldFVUQ01vbnRoKCkpO1xuICAgICAgICB0aGlzLmRhdGUoZGF0ZS5nZXRVVENEYXRlKCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignUScsIDAsICdRbycsICdxdWFydGVyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3F1YXJ0ZXInLCAnUScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgncXVhcnRlcicsIDcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUScsIG1hdGNoMSk7XG4gICAgYWRkUGFyc2VUb2tlbignUScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFF1YXJ0ZXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF0ZScsIDkpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIFwib3JkaW5hbFBhcnNlXCIgZmFsbGJhY2sgaW4gbmV4dCBtYWpvciByZWxlYXNlLlxuICAgICAgICByZXR1cm4gaXNTdHJpY3QgP1xuICAgICAgICAgIChsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2UgfHwgbG9jYWxlLl9vcmRpbmFsUGFyc2UpIDpcbiAgICAgICAgICBsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG4gICAgYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0RGF5T2ZNb250aCA9IG1ha2VHZXRTZXQoJ0RhdGUnLCB0cnVlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdEREQnLCBbJ0REREQnLCAzXSwgJ0RERG8nLCAnZGF5T2ZZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheU9mWWVhcicsICdEREQnKTtcblxuICAgIC8vIFBSSU9SSVRZXG4gICAgYWRkVW5pdFByaW9yaXR5KCdkYXlPZlllYXInLCA0KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0RERCcsICBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZlllYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXIgPSBNYXRoLnJvdW5kKCh0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykgLSB0aGlzLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbWludXRlJywgMTQpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQUklPUklUWVxuXG4gICAgYWRkVW5pdFByaW9yaXR5KCdzZWNvbmQnLCAxNSk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTUycsIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1MnLCA0XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTUycsIDVdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1MnLCA2XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1MnLCA3XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTUycsIDhdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTU1MnLCA5XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwMDtcbiAgICB9KTtcblxuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbWlsbGlzZWNvbmQnLCAxNik7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdTJywgICAgbWF0Y2gxdG8zLCBtYXRjaDEpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTJywgICBtYXRjaDF0bzMsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTJywgIG1hdGNoMXRvMywgbWF0Y2gzKTtcblxuICAgIHZhciB0b2tlbjtcbiAgICBmb3IgKHRva2VuID0gJ1NTU1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgICAgIGFkZFJlZ2V4VG9rZW4odG9rZW4sIG1hdGNoVW5zaWduZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTXMoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgfVxuXG4gICAgZm9yICh0b2tlbiA9ICdTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBwYXJzZU1zKTtcbiAgICB9XG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbGxpc2Vjb25kID0gbWFrZUdldFNldCgnTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3onLCAgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJiciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZU5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIHByb3RvLmFkZCAgICAgICAgICAgICAgID0gYWRkO1xuICAgIHByb3RvLmNhbGVuZGFyICAgICAgICAgID0gY2FsZW5kYXIkMTtcbiAgICBwcm90by5jbG9uZSAgICAgICAgICAgICA9IGNsb25lO1xuICAgIHByb3RvLmRpZmYgICAgICAgICAgICAgID0gZGlmZjtcbiAgICBwcm90by5lbmRPZiAgICAgICAgICAgICA9IGVuZE9mO1xuICAgIHByb3RvLmZvcm1hdCAgICAgICAgICAgID0gZm9ybWF0O1xuICAgIHByb3RvLmZyb20gICAgICAgICAgICAgID0gZnJvbTtcbiAgICBwcm90by5mcm9tTm93ICAgICAgICAgICA9IGZyb21Ob3c7XG4gICAgcHJvdG8udG8gICAgICAgICAgICAgICAgPSB0bztcbiAgICBwcm90by50b05vdyAgICAgICAgICAgICA9IHRvTm93O1xuICAgIHByb3RvLmdldCAgICAgICAgICAgICAgID0gc3RyaW5nR2V0O1xuICAgIHByb3RvLmludmFsaWRBdCAgICAgICAgID0gaW52YWxpZEF0O1xuICAgIHByb3RvLmlzQWZ0ZXIgICAgICAgICAgID0gaXNBZnRlcjtcbiAgICBwcm90by5pc0JlZm9yZSAgICAgICAgICA9IGlzQmVmb3JlO1xuICAgIHByb3RvLmlzQmV0d2VlbiAgICAgICAgID0gaXNCZXR3ZWVuO1xuICAgIHByb3RvLmlzU2FtZSAgICAgICAgICAgID0gaXNTYW1lO1xuICAgIHByb3RvLmlzU2FtZU9yQWZ0ZXIgICAgID0gaXNTYW1lT3JBZnRlcjtcbiAgICBwcm90by5pc1NhbWVPckJlZm9yZSAgICA9IGlzU2FtZU9yQmVmb3JlO1xuICAgIHByb3RvLmlzVmFsaWQgICAgICAgICAgID0gaXNWYWxpZCQyO1xuICAgIHByb3RvLmxhbmcgICAgICAgICAgICAgID0gbGFuZztcbiAgICBwcm90by5sb2NhbGUgICAgICAgICAgICA9IGxvY2FsZTtcbiAgICBwcm90by5sb2NhbGVEYXRhICAgICAgICA9IGxvY2FsZURhdGE7XG4gICAgcHJvdG8ubWF4ICAgICAgICAgICAgICAgPSBwcm90b3R5cGVNYXg7XG4gICAgcHJvdG8ubWluICAgICAgICAgICAgICAgPSBwcm90b3R5cGVNaW47XG4gICAgcHJvdG8ucGFyc2luZ0ZsYWdzICAgICAgPSBwYXJzaW5nRmxhZ3M7XG4gICAgcHJvdG8uc2V0ICAgICAgICAgICAgICAgPSBzdHJpbmdTZXQ7XG4gICAgcHJvdG8uc3RhcnRPZiAgICAgICAgICAgPSBzdGFydE9mO1xuICAgIHByb3RvLnN1YnRyYWN0ICAgICAgICAgID0gc3VidHJhY3Q7XG4gICAgcHJvdG8udG9BcnJheSAgICAgICAgICAgPSB0b0FycmF5O1xuICAgIHByb3RvLnRvT2JqZWN0ICAgICAgICAgID0gdG9PYmplY3Q7XG4gICAgcHJvdG8udG9EYXRlICAgICAgICAgICAgPSB0b0RhdGU7XG4gICAgcHJvdG8udG9JU09TdHJpbmcgICAgICAgPSB0b0lTT1N0cmluZztcbiAgICBwcm90by5pbnNwZWN0ICAgICAgICAgICA9IGluc3BlY3Q7XG4gICAgcHJvdG8udG9KU09OICAgICAgICAgICAgPSB0b0pTT047XG4gICAgcHJvdG8udG9TdHJpbmcgICAgICAgICAgPSB0b1N0cmluZztcbiAgICBwcm90by51bml4ICAgICAgICAgICAgICA9IHVuaXg7XG4gICAgcHJvdG8udmFsdWVPZiAgICAgICAgICAgPSB2YWx1ZU9mO1xuICAgIHByb3RvLmNyZWF0aW9uRGF0YSAgICAgID0gY3JlYXRpb25EYXRhO1xuICAgIHByb3RvLnllYXIgICAgICAgPSBnZXRTZXRZZWFyO1xuICAgIHByb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuICAgIHByb3RvLndlZWtZZWFyICAgID0gZ2V0U2V0V2Vla1llYXI7XG4gICAgcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcbiAgICBwcm90by5xdWFydGVyID0gcHJvdG8ucXVhcnRlcnMgPSBnZXRTZXRRdWFydGVyO1xuICAgIHByb3RvLm1vbnRoICAgICAgID0gZ2V0U2V0TW9udGg7XG4gICAgcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcbiAgICBwcm90by53ZWVrICAgICAgICAgICA9IHByb3RvLndlZWtzICAgICAgICA9IGdldFNldFdlZWs7XG4gICAgcHJvdG8uaXNvV2VlayAgICAgICAgPSBwcm90by5pc29XZWVrcyAgICAgPSBnZXRTZXRJU09XZWVrO1xuICAgIHByb3RvLndlZWtzSW5ZZWFyICAgID0gZ2V0V2Vla3NJblllYXI7XG4gICAgcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcbiAgICBwcm90by5kYXRlICAgICAgID0gZ2V0U2V0RGF5T2ZNb250aDtcbiAgICBwcm90by5kYXkgICAgICAgID0gcHJvdG8uZGF5cyAgICAgICAgICAgICA9IGdldFNldERheU9mV2VlaztcbiAgICBwcm90by53ZWVrZGF5ICAgID0gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrO1xuICAgIHByb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgcHJvdG8uZGF5T2ZZZWFyICA9IGdldFNldERheU9mWWVhcjtcbiAgICBwcm90by5ob3VyID0gcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xuICAgIHByb3RvLm1pbnV0ZSA9IHByb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG4gICAgcHJvdG8uc2Vjb25kID0gcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcbiAgICBwcm90by5taWxsaXNlY29uZCA9IHByb3RvLm1pbGxpc2Vjb25kcyA9IGdldFNldE1pbGxpc2Vjb25kO1xuICAgIHByb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xuICAgIHByb3RvLnV0YyAgICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9VVEM7XG4gICAgcHJvdG8ubG9jYWwgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb0xvY2FsO1xuICAgIHByb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG4gICAgcHJvdG8uaGFzQWxpZ25lZEhvdXJPZmZzZXQgPSBoYXNBbGlnbmVkSG91ck9mZnNldDtcbiAgICBwcm90by5pc0RTVCAgICAgICAgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lO1xuICAgIHByb3RvLmlzTG9jYWwgICAgICAgICAgICAgID0gaXNMb2NhbDtcbiAgICBwcm90by5pc1V0Y09mZnNldCAgICAgICAgICA9IGlzVXRjT2Zmc2V0O1xuICAgIHByb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgcHJvdG8uaXNVVEMgICAgICAgICAgICAgICAgPSBpc1V0YztcbiAgICBwcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xuICAgIHByb3RvLnpvbmVOYW1lID0gZ2V0Wm9uZU5hbWU7XG4gICAgcHJvdG8uZGF0ZXMgID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIGdldFNldERheU9mTW9udGgpO1xuICAgIHByb3RvLm1vbnRocyA9IGRlcHJlY2F0ZSgnbW9udGhzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb250aCBpbnN0ZWFkJywgZ2V0U2V0TW9udGgpO1xuICAgIHByb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xuICAgIHByb3RvLnpvbmUgICA9IGRlcHJlY2F0ZSgnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3Mvem9uZS8nLCBnZXRTZXRab25lKTtcbiAgICBwcm90by5pc0RTVFNoaWZ0ZWQgPSBkZXByZWNhdGUoJ2lzRFNUU2hpZnRlZCBpcyBkZXByZWNhdGVkLiBTZWUgaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9kc3Qtc2hpZnRlZC8gZm9yIG1vcmUgaW5mb3JtYXRpb24nLCBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlVW5peCAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW5ab25lICgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlUGFyc2VQb3N0Rm9ybWF0IChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG5cbiAgICB2YXIgcHJvdG8kMSA9IExvY2FsZS5wcm90b3R5cGU7XG5cbiAgICBwcm90byQxLmNhbGVuZGFyICAgICAgICA9IGNhbGVuZGFyO1xuICAgIHByb3RvJDEubG9uZ0RhdGVGb3JtYXQgID0gbG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG8kMS5pbnZhbGlkRGF0ZSAgICAgPSBpbnZhbGlkRGF0ZTtcbiAgICBwcm90byQxLm9yZGluYWwgICAgICAgICA9IG9yZGluYWw7XG4gICAgcHJvdG8kMS5wcmVwYXJzZSAgICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG8kMS5wb3N0Zm9ybWF0ICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG8kMS5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG8kMS5wYXN0RnV0dXJlICAgICAgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvJDEuc2V0ICAgICAgICAgICAgID0gc2V0O1xuXG4gICAgcHJvdG8kMS5tb250aHMgICAgICAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHM7XG4gICAgcHJvdG8kMS5tb250aHNTaG9ydCAgICAgICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90byQxLm1vbnRoc1BhcnNlICAgICAgID0gICAgICAgIGxvY2FsZU1vbnRoc1BhcnNlO1xuICAgIHByb3RvJDEubW9udGhzUmVnZXggICAgICAgPSBtb250aHNSZWdleDtcbiAgICBwcm90byQxLm1vbnRoc1Nob3J0UmVnZXggID0gbW9udGhzU2hvcnRSZWdleDtcbiAgICBwcm90byQxLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvJDEuZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbiAgICBwcm90byQxLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbiAgICBwcm90byQxLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvJDEud2Vla2RheXNNaW4gICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNNaW47XG4gICAgcHJvdG8kMS53ZWVrZGF5c1Nob3J0ICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvJDEud2Vla2RheXNQYXJzZSAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNQYXJzZTtcblxuICAgIHByb3RvJDEud2Vla2RheXNSZWdleCAgICAgICA9ICAgICAgICB3ZWVrZGF5c1JlZ2V4O1xuICAgIHByb3RvJDEud2Vla2RheXNTaG9ydFJlZ2V4ICA9ICAgICAgICB3ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrZGF5c01pblJlZ2V4ICAgID0gICAgICAgIHdlZWtkYXlzTWluUmVnZXg7XG5cbiAgICBwcm90byQxLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvJDEubWVyaWRpZW0gPSBsb2NhbGVNZXJpZGllbTtcblxuICAgIGZ1bmN0aW9uIGdldCQxIChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKTtcbiAgICAgICAgdmFyIHV0YyA9IGNyZWF0ZVVUQygpLnNldChzZXR0ZXIsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGxvY2FsZVtmaWVsZF0odXRjLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RNb250aHNJbXBsIChmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIGluZGV4LCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCBpLCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvLyAoKVxuICAgIC8vICg1KVxuICAgIC8vIChmbXQsIDUpXG4gICAgLy8gKGZtdClcbiAgICAvLyAodHJ1ZSlcbiAgICAvLyAodHJ1ZSwgNSlcbiAgICAvLyAodHJ1ZSwgZm10LCA1KVxuICAgIC8vICh0cnVlLCBmbXQpXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzSW1wbCAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgICAgICBpZiAodHlwZW9mIGxvY2FsZVNvcnRlZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybWF0ID0gbG9jYWxlU29ydGVkO1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBsb2NhbGVTb3J0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhbGUgPSBnZXRMb2NhbGUoKSxcbiAgICAgICAgICAgIHNoaWZ0ID0gbG9jYWxlU29ydGVkID8gbG9jYWxlLl93ZWVrLmRvdyA6IDA7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIChpbmRleCArIHNoaWZ0KSAlIDcsIGZpZWxkLCAnZGF5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBnZXQkMShmb3JtYXQsIChpICsgc2hpZnQpICUgNywgZmllbGQsICdkYXknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RNb250aHMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHNTaG9ydCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5cyAobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0V2Vla2RheXNJbXBsKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzU2hvcnQgKGxvY2FsZVNvcnRlZCwgZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c1Nob3J0Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzTWluIChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNNaW4nKTtcbiAgICB9XG5cbiAgICBnZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBkYXlPZk1vbnRoT3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIGhvb2tzLmxhbmcgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlIGluc3RlYWQuJywgZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICBob29rcy5sYW5nRGF0YSA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsIGdldExvY2FsZSk7XG5cbiAgICB2YXIgbWF0aEFicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gYWJzICgpIHtcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICAgID0gdGhpcy5fZGF0YTtcblxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBtYXRoQWJzKHRoaXMuX21pbGxpc2Vjb25kcyk7XG4gICAgICAgIHRoaXMuX2RheXMgICAgICAgICA9IG1hdGhBYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHRoaXMuX21vbnRocyAgICAgICA9IG1hdGhBYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyAgPSBtYXRoQWJzKGRhdGEubWlsbGlzZWNvbmRzKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzICAgICAgID0gbWF0aEFicyhkYXRhLnNlY29uZHMpO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgICAgICAgPSBtYXRoQWJzKGRhdGEubWludXRlcyk7XG4gICAgICAgIGRhdGEuaG91cnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS5ob3Vycyk7XG4gICAgICAgIGRhdGEubW9udGhzICAgICAgICA9IG1hdGhBYnMoZGF0YS5tb250aHMpO1xuICAgICAgICBkYXRhLnllYXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEueWVhcnMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN1YnRyYWN0JDEgKGR1cmF0aW9uLCBpbnB1dCwgdmFsdWUsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGFkZCQxIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFkZFN1YnRyYWN0JDEodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIHN1YnRyYWN0JDEgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYWRkU3VidHJhY3QkMSh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNDZWlsIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUgKCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMsIG1vbnRoc0Zyb21EYXlzO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtaXggb2YgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcywgYnViYmxlIGRvd24gZmlyc3RcbiAgICAgICAgLy8gY2hlY2s6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMTY2XG4gICAgICAgIGlmICghKChtaWxsaXNlY29uZHMgPj0gMCAmJiBkYXlzID49IDAgJiYgbW9udGhzID49IDApIHx8XG4gICAgICAgICAgICAgICAgKG1pbGxpc2Vjb25kcyA8PSAwICYmIGRheXMgPD0gMCAmJiBtb250aHMgPD0gMCkpKSB7XG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgICAgIHNlY29uZHMgICAgICAgICAgID0gYWJzRmxvb3IobWlsbGlzZWNvbmRzIC8gMTAwMCk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgZGF5cyArPSBhYnNGbG9vcihob3VycyAvIDI0KTtcblxuICAgICAgICAvLyBjb252ZXJ0IGRheXMgdG8gbW9udGhzXG4gICAgICAgIG1vbnRoc0Zyb21EYXlzID0gYWJzRmxvb3IoZGF5c1RvTW9udGhzKGRheXMpKTtcbiAgICAgICAgbW9udGhzICs9IG1vbnRoc0Zyb21EYXlzO1xuICAgICAgICBkYXlzIC09IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRoc0Zyb21EYXlzKSk7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgIGRhdGEuZGF5cyAgID0gZGF5cztcbiAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgIGRhdGEueWVhcnMgID0geWVhcnM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c1RvTW9udGhzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgLy8gNDAwIHllYXJzIGhhdmUgMTIgbW9udGhzID09PSA0ODAwXG4gICAgICAgIHJldHVybiBkYXlzICogNDgwMCAvIDE0NjA5NztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aHNUb0RheXMgKG1vbnRocykge1xuICAgICAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICAgICAgcmV0dXJuIG1vbnRocyAqIDE0NjA5NyAvIDQ4MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheXM7XG4gICAgICAgIHZhciBtb250aHM7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgIGRheXMgICA9IHRoaXMuX2RheXMgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzICsgZGF5c1RvTW9udGhzKGRheXMpO1xuICAgICAgICAgICAgcmV0dXJuIHVuaXRzID09PSAnbW9udGgnID8gbW9udGhzIDogbW9udGhzIC8gMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIE1hdGgucm91bmQobW9udGhzVG9EYXlzKHRoaXMuX21vbnRocykpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnICAgOiByZXR1cm4gZGF5cyAvIDcgICAgICsgbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RheScgICAgOiByZXR1cm4gZGF5cyAgICAgICAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnaG91cicgICA6IHJldHVybiBkYXlzICogMjQgICAgKyBtaWxsaXNlY29uZHMgLyAzNmU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZScgOiByZXR1cm4gZGF5cyAqIDE0NDAgICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCcgOiByZXR1cm4gZGF5cyAqIDg2NDAwICsgbWlsbGlzZWNvbmRzIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiA4NjRlNSkgKyBtaWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSB0aGlzLmFzKCdtcycpP1xuICAgIGZ1bmN0aW9uIHZhbHVlT2YkMSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFzIChhbGlhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKTtcbiAgICB2YXIgYXNTZWNvbmRzICAgICAgPSBtYWtlQXMoJ3MnKTtcbiAgICB2YXIgYXNNaW51dGVzICAgICAgPSBtYWtlQXMoJ20nKTtcbiAgICB2YXIgYXNIb3VycyAgICAgICAgPSBtYWtlQXMoJ2gnKTtcbiAgICB2YXIgYXNEYXlzICAgICAgICAgPSBtYWtlQXMoJ2QnKTtcbiAgICB2YXIgYXNXZWVrcyAgICAgICAgPSBtYWtlQXMoJ3cnKTtcbiAgICB2YXIgYXNNb250aHMgICAgICAgPSBtYWtlQXMoJ00nKTtcbiAgICB2YXIgYXNZZWFycyAgICAgICAgPSBtYWtlQXMoJ3knKTtcblxuICAgIGZ1bmN0aW9uIGNsb25lJDEgKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24odGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0JDIgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzW3VuaXRzICsgJ3MnXSgpIDogTmFOO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5fZGF0YVtuYW1lXSA6IE5hTjtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyk7XG4gICAgdmFyIHNlY29uZHMgICAgICA9IG1ha2VHZXR0ZXIoJ3NlY29uZHMnKTtcbiAgICB2YXIgbWludXRlcyAgICAgID0gbWFrZUdldHRlcignbWludXRlcycpO1xuICAgIHZhciBob3VycyAgICAgICAgPSBtYWtlR2V0dGVyKCdob3VycycpO1xuICAgIHZhciBkYXlzICAgICAgICAgPSBtYWtlR2V0dGVyKCdkYXlzJyk7XG4gICAgdmFyIG1vbnRocyAgICAgICA9IG1ha2VHZXR0ZXIoJ21vbnRocycpO1xuICAgIHZhciB5ZWFycyAgICAgICAgPSBtYWtlR2V0dGVyKCd5ZWFycycpO1xuXG4gICAgZnVuY3Rpb24gd2Vla3MgKCkge1xuICAgICAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbiAgICB9XG5cbiAgICB2YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xuICAgIHZhciB0aHJlc2hvbGRzID0ge1xuICAgICAgICBzczogNDQsICAgICAgICAgLy8gYSBmZXcgc2Vjb25kcyB0byBzZWNvbmRzXG4gICAgICAgIHMgOiA0NSwgICAgICAgICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICBtIDogNDUsICAgICAgICAgLy8gbWludXRlcyB0byBob3VyXG4gICAgICAgIGggOiAyMiwgICAgICAgICAvLyBob3VycyB0byBkYXlcbiAgICAgICAgZCA6IDI2LCAgICAgICAgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgTSA6IDExICAgICAgICAgIC8vIG1vbnRocyB0byB5ZWFyXG4gICAgfTtcblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lJDEgKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgICAgICB2YXIgc2Vjb25kcyAgPSByb3VuZChkdXJhdGlvbi5hcygncycpKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSk7XG4gICAgICAgIHZhciBob3VycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpO1xuICAgICAgICB2YXIgZGF5cyAgICAgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICAgICAgdmFyIG1vbnRocyAgID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSk7XG4gICAgICAgIHZhciB5ZWFycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpO1xuXG4gICAgICAgIHZhciBhID0gc2Vjb25kcyA8PSB0aHJlc2hvbGRzLnNzICYmIFsncycsIHNlY29uZHNdICB8fFxuICAgICAgICAgICAgICAgIHNlY29uZHMgPCB0aHJlc2hvbGRzLnMgICAmJiBbJ3NzJywgc2Vjb25kc10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzIDw9IDEgICAgICAgICAgICAgJiYgWydtJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHRocmVzaG9sZHMubSAgICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPD0gMSAgICAgICAgICAgICAmJiBbJ2gnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDwgdGhyZXNob2xkcy5oICAgJiYgWydoaCcsIGhvdXJzXSAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA8PSAxICAgICAgICAgICAgICYmIFsnZCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPCB0aHJlc2hvbGRzLmQgICAmJiBbJ2RkJywgZGF5c10gICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgIDw9IDEgICAgICAgICAgICAgJiYgWydNJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8IHRocmVzaG9sZHMuTSAgICYmIFsnTU0nLCBtb250aHNdICB8fFxuICAgICAgICAgICAgICAgIHllYXJzICAgPD0gMSAgICAgICAgICAgICAmJiBbJ3knXSAgICAgICAgICAgfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IHRoZSByb3VuZGluZyBmdW5jdGlvbiBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgZnVuY3Rpb24gZ2V0U2V0UmVsYXRpdmVUaW1lUm91bmRpbmcgKHJvdW5kaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHJvdW5kaW5nRnVuY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Yocm91bmRpbmdGdW5jdGlvbikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJvdW5kID0gcm91bmRpbmdGdW5jdGlvbjtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQgKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgICAgIH1cbiAgICAgICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgICAgIGlmICh0aHJlc2hvbGQgPT09ICdzJykge1xuICAgICAgICAgICAgdGhyZXNob2xkcy5zcyA9IGxpbWl0IC0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBodW1hbml6ZSAod2l0aFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IHJlbGF0aXZlVGltZSQxKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBhYnMkMSA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gc2lnbih4KSB7XG4gICAgICAgIHJldHVybiAoKHggPiAwKSAtICh4IDwgMCkpIHx8ICt4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSVNPU3RyaW5nJDEoKSB7XG4gICAgICAgIC8vIGZvciBJU08gc3RyaW5ncyB3ZSBkbyBub3QgdXNlIHRoZSBub3JtYWwgYnViYmxpbmcgcnVsZXM6XG4gICAgICAgIC8vICAqIG1pbGxpc2Vjb25kcyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgaG91cnNcbiAgICAgICAgLy8gICogZGF5cyBkbyBub3QgYnViYmxlIGF0IGFsbFxuICAgICAgICAvLyAgKiBtb250aHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIHllYXJzXG4gICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBpcyBubyBjb250ZXh0LWZyZWUgY29udmVyc2lvbiBiZXR3ZWVuIGhvdXJzIGFuZCBkYXlzXG4gICAgICAgIC8vICh0aGluayBvZiBjbG9jayBjaGFuZ2VzKVxuICAgICAgICAvLyBhbmQgYWxzbyBub3QgYmV0d2VlbiBkYXlzIGFuZCBtb250aHMgKDI4LTMxIGRheXMgcGVyIG1vbnRoKVxuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWNvbmRzID0gYWJzJDEodGhpcy5fbWlsbGlzZWNvbmRzKSAvIDEwMDA7XG4gICAgICAgIHZhciBkYXlzICAgICAgICAgPSBhYnMkMSh0aGlzLl9kYXlzKTtcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IGFicyQxKHRoaXMuX21vbnRocyk7XG4gICAgICAgIHZhciBtaW51dGVzLCBob3VycywgeWVhcnM7XG5cbiAgICAgICAgLy8gMzYwMCBzZWNvbmRzIC0+IDYwIG1pbnV0ZXMgLT4gMSBob3VyXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBzZWNvbmRzICU9IDYwO1xuICAgICAgICBtaW51dGVzICU9IDYwO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cblxuICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICB2YXIgWSA9IHllYXJzO1xuICAgICAgICB2YXIgTSA9IG1vbnRocztcbiAgICAgICAgdmFyIEQgPSBkYXlzO1xuICAgICAgICB2YXIgaCA9IGhvdXJzO1xuICAgICAgICB2YXIgbSA9IG1pbnV0ZXM7XG4gICAgICAgIHZhciBzID0gc2Vjb25kcyA/IHNlY29uZHMudG9GaXhlZCgzKS5yZXBsYWNlKC9cXC4/MCskLywgJycpIDogJyc7XG4gICAgICAgIHZhciB0b3RhbCA9IHRoaXMuYXNTZWNvbmRzKCk7XG5cbiAgICAgICAgaWYgKCF0b3RhbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvdGFsU2lnbiA9IHRvdGFsIDwgMCA/ICctJyA6ICcnO1xuICAgICAgICB2YXIgeW1TaWduID0gc2lnbih0aGlzLl9tb250aHMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgICAgICB2YXIgZGF5c1NpZ24gPSBzaWduKHRoaXMuX2RheXMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgICAgICB2YXIgaG1zU2lnbiA9IHNpZ24odGhpcy5fbWlsbGlzZWNvbmRzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcblxuICAgICAgICByZXR1cm4gdG90YWxTaWduICsgJ1AnICtcbiAgICAgICAgICAgIChZID8geW1TaWduICsgWSArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAoTSA/IHltU2lnbiArIE0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKEQgPyBkYXlzU2lnbiArIEQgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgKChoIHx8IG0gfHwgcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgKGggPyBobXNTaWduICsgaCArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAobSA/IGhtc1NpZ24gKyBtICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChzID8gaG1zU2lnbiArIHMgKyAnUycgOiAnJyk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvJDIgPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBwcm90byQyLmlzVmFsaWQgICAgICAgID0gaXNWYWxpZCQxO1xuICAgIHByb3RvJDIuYWJzICAgICAgICAgICAgPSBhYnM7XG4gICAgcHJvdG8kMi5hZGQgICAgICAgICAgICA9IGFkZCQxO1xuICAgIHByb3RvJDIuc3VidHJhY3QgICAgICAgPSBzdWJ0cmFjdCQxO1xuICAgIHByb3RvJDIuYXMgICAgICAgICAgICAgPSBhcztcbiAgICBwcm90byQyLmFzTWlsbGlzZWNvbmRzID0gYXNNaWxsaXNlY29uZHM7XG4gICAgcHJvdG8kMi5hc1NlY29uZHMgICAgICA9IGFzU2Vjb25kcztcbiAgICBwcm90byQyLmFzTWludXRlcyAgICAgID0gYXNNaW51dGVzO1xuICAgIHByb3RvJDIuYXNIb3VycyAgICAgICAgPSBhc0hvdXJzO1xuICAgIHByb3RvJDIuYXNEYXlzICAgICAgICAgPSBhc0RheXM7XG4gICAgcHJvdG8kMi5hc1dlZWtzICAgICAgICA9IGFzV2Vla3M7XG4gICAgcHJvdG8kMi5hc01vbnRocyAgICAgICA9IGFzTW9udGhzO1xuICAgIHByb3RvJDIuYXNZZWFycyAgICAgICAgPSBhc1llYXJzO1xuICAgIHByb3RvJDIudmFsdWVPZiAgICAgICAgPSB2YWx1ZU9mJDE7XG4gICAgcHJvdG8kMi5fYnViYmxlICAgICAgICA9IGJ1YmJsZTtcbiAgICBwcm90byQyLmNsb25lICAgICAgICAgID0gY2xvbmUkMTtcbiAgICBwcm90byQyLmdldCAgICAgICAgICAgID0gZ2V0JDI7XG4gICAgcHJvdG8kMi5taWxsaXNlY29uZHMgICA9IG1pbGxpc2Vjb25kcztcbiAgICBwcm90byQyLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbiAgICBwcm90byQyLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbiAgICBwcm90byQyLmhvdXJzICAgICAgICAgID0gaG91cnM7XG4gICAgcHJvdG8kMi5kYXlzICAgICAgICAgICA9IGRheXM7XG4gICAgcHJvdG8kMi53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xuICAgIHByb3RvJDIubW9udGhzICAgICAgICAgPSBtb250aHM7XG4gICAgcHJvdG8kMi55ZWFycyAgICAgICAgICA9IHllYXJzO1xuICAgIHByb3RvJDIuaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbiAgICBwcm90byQyLnRvSVNPU3RyaW5nICAgID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLnRvU3RyaW5nICAgICAgID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLnRvSlNPTiAgICAgICAgID0gdG9JU09TdHJpbmckMTtcbiAgICBwcm90byQyLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xuICAgIHByb3RvJDIubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG4gICAgcHJvdG8kMi50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCB0b0lTT1N0cmluZyQxKTtcbiAgICBwcm90byQyLmxhbmcgPSBsYW5nO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1gnLCAwLCAwLCAndW5peCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd4JywgMCwgMCwgJ3ZhbHVlT2YnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3gnLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWCcsIG1hdGNoVGltZXN0YW1wKTtcbiAgICBhZGRQYXJzZVRva2VuKCdYJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQsIDEwKSAqIDEwMDApO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ3gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuXG4gICAgaG9va3MudmVyc2lvbiA9ICcyLjIyLjInO1xuXG4gICAgc2V0SG9va0NhbGxiYWNrKGNyZWF0ZUxvY2FsKTtcblxuICAgIGhvb2tzLmZuICAgICAgICAgICAgICAgICAgICA9IHByb3RvO1xuICAgIGhvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbiAgICBob29rcy5tYXggICAgICAgICAgICAgICAgICAgPSBtYXg7XG4gICAgaG9va3Mubm93ICAgICAgICAgICAgICAgICAgID0gbm93O1xuICAgIGhvb2tzLnV0YyAgICAgICAgICAgICAgICAgICA9IGNyZWF0ZVVUQztcbiAgICBob29rcy51bml4ICAgICAgICAgICAgICAgICAgPSBjcmVhdGVVbml4O1xuICAgIGhvb2tzLm1vbnRocyAgICAgICAgICAgICAgICA9IGxpc3RNb250aHM7XG4gICAgaG9va3MuaXNEYXRlICAgICAgICAgICAgICAgID0gaXNEYXRlO1xuICAgIGhvb2tzLmxvY2FsZSAgICAgICAgICAgICAgICA9IGdldFNldEdsb2JhbExvY2FsZTtcbiAgICBob29rcy5pbnZhbGlkICAgICAgICAgICAgICAgPSBjcmVhdGVJbnZhbGlkO1xuICAgIGhvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZUR1cmF0aW9uO1xuICAgIGhvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuICAgIGhvb2tzLndlZWtkYXlzICAgICAgICAgICAgICA9IGxpc3RXZWVrZGF5cztcbiAgICBob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBjcmVhdGVJblpvbmU7XG4gICAgaG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gZ2V0TG9jYWxlO1xuICAgIGhvb2tzLmlzRHVyYXRpb24gICAgICAgICAgICA9IGlzRHVyYXRpb247XG4gICAgaG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdE1vbnRoc1Nob3J0O1xuICAgIGhvb2tzLndlZWtkYXlzTWluICAgICAgICAgICA9IGxpc3RXZWVrZGF5c01pbjtcbiAgICBob29rcy5kZWZpbmVMb2NhbGUgICAgICAgICAgPSBkZWZpbmVMb2NhbGU7XG4gICAgaG9va3MudXBkYXRlTG9jYWxlICAgICAgICAgID0gdXBkYXRlTG9jYWxlO1xuICAgIGhvb2tzLmxvY2FsZXMgICAgICAgICAgICAgICA9IGxpc3RMb2NhbGVzO1xuICAgIGhvb2tzLndlZWtkYXlzU2hvcnQgICAgICAgICA9IGxpc3RXZWVrZGF5c1Nob3J0O1xuICAgIGhvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIGhvb2tzLnJlbGF0aXZlVGltZVJvdW5kaW5nICA9IGdldFNldFJlbGF0aXZlVGltZVJvdW5kaW5nO1xuICAgIGhvb2tzLnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGdldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZDtcbiAgICBob29rcy5jYWxlbmRhckZvcm1hdCAgICAgICAgPSBnZXRDYWxlbmRhckZvcm1hdDtcbiAgICBob29rcy5wcm90b3R5cGUgICAgICAgICAgICAgPSBwcm90bztcblxuICAgIC8vIGN1cnJlbnRseSBIVE1MNSBpbnB1dCB0eXBlIG9ubHkgc3VwcG9ydHMgMjQtaG91ciBmb3JtYXRzXG4gICAgaG9va3MuSFRNTDVfRk1UID0ge1xuICAgICAgICBEQVRFVElNRV9MT0NBTDogJ1lZWVktTU0tRERUSEg6bW0nLCAgICAgICAgICAgICAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgLz5cbiAgICAgICAgREFURVRJTUVfTE9DQUxfU0VDT05EUzogJ1lZWVktTU0tRERUSEg6bW06c3MnLCAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIxXCIgLz5cbiAgICAgICAgREFURVRJTUVfTE9DQUxfTVM6ICdZWVlZLU1NLUREVEhIOm1tOnNzLlNTUycsICAgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgICAgIERBVEU6ICdZWVlZLU1NLUREJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIC8+XG4gICAgICAgIFRJTUU6ICdISDptbScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIC8+XG4gICAgICAgIFRJTUVfU0VDT05EUzogJ0hIOm1tOnNzJywgICAgICAgICAgICAgICAgICAgICAgIC8vIDxpbnB1dCB0eXBlPVwidGltZVwiIHN0ZXA9XCIxXCIgLz5cbiAgICAgICAgVElNRV9NUzogJ0hIOm1tOnNzLlNTUycsICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgc3RlcD1cIjAuMDAxXCIgLz5cbiAgICAgICAgV0VFSzogJ1lZWVktW1ddV1cnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJ3ZWVrXCIgLz5cbiAgICAgICAgTU9OVEg6ICdZWVlZLU1NJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPGlucHV0IHR5cGU9XCJtb250aFwiIC8+XG4gICAgfTtcblxuICAgIHJldHVybiBob29rcztcblxufSkpKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMDtcbiAgdmFyIGJ0aCA9IGJ5dGVUb0hleDtcbiAgLy8gam9pbiB1c2VkIHRvIGZpeCBtZW1vcnkgaXNzdWUgY2F1c2VkIGJ5IGNvbmNhdGVuYXRpb246IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxNzUjYzRcbiAgcmV0dXJuIChbYnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXV0pLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuIiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gIEluIHRoZVxuLy8gYnJvd3NlciB0aGlzIGlzIGEgbGl0dGxlIGNvbXBsaWNhdGVkIGR1ZSB0byB1bmtub3duIHF1YWxpdHkgb2YgTWF0aC5yYW5kb20oKVxuLy8gYW5kIGluY29uc2lzdGVudCBzdXBwb3J0IGZvciB0aGUgYGNyeXB0b2AgQVBJLiAgV2UgZG8gdGhlIGJlc3Qgd2UgY2FuIHZpYVxuLy8gZmVhdHVyZS1kZXRlY3Rpb25cblxuLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvXG4vLyBpbXBsZW1lbnRhdGlvbi4gQWxzbywgZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIG9uIElFMTEuXG52YXIgZ2V0UmFuZG9tVmFsdWVzID0gKHR5cGVvZihjcnlwdG8pICE9ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZihtc0NyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0bykpO1xuXG5pZiAoZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8gUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICB2YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xuICAgIHJldHVybiBybmRzODtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyIHJuZHMgPSBuZXcgQXJyYXkoMTYpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWF0aFJORygpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5kcztcbiAgfTtcbn1cbiIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09PSAnYmluYXJ5JyA/IG5ldyBBcnJheSgxNikgOiBudWxsO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyArK2lpKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgYnl0ZXNUb1V1aWQocm5kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjQ7XG4iXX0=
