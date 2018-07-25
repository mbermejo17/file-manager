(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareFile = shareFile;
exports.deleteSelected = deleteSelected;
exports.upload = upload;
exports.newFolder = newFolder;
exports.deleteFile = deleteFile;
exports.deleteFolder = deleteFolder;
exports.download = download;

var _jsCookie = require("../vendor/js-cookie");

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

////////////////////////////////////
// Files and Folder module
///////////////////////////////////

var RUNMODE = _jsCookie2.default.get("RunMode");
var REAL_ROOT_PATH = _jsCookie2.default.get("RootPath");

var htmlUploadDownloadTemplate = "<ul class=\"preloader-file\" id=\"DownloadfileList\">\n    <li id=\"li0\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename0\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar0\"></div>\n                <div class=\"percent\" id=\"percent0\"></div>\n                <a class=\"modal_close\" id=\"abort0\" href=\"#\"></a>\n            </div>\n        </div>\n    </li>\n    <li id=\"li1\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename1\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar1\"></div>\n                <div class=\"percent\" id=\"percent1\"></div>\n                <a class=\"modal_close\" id=\"abort1\" href=\"#\"></a>\n            </div>\n        </div>\n    </li>\n    <li id=\"li2\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename2\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar2\"></div>\n                <div class=\"percent\" id=\"percent2\"></div>\n                <a class=\"modal_close\" id=\"abort2\" href=\"#\"></a>\n            </div>   \n        </div>\n    </li>\n    <li id=\"li3\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename3\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar3\"></div>\n                <div class=\"percent\" id=\"percent3\"></div>\n                <a class=\"modal_close\" id=\"abort3\" href=\"#\"></a>\n            </div>   \n        </div>\n    </li>\n    <li id=\"li4\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename4\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar4\"></div>\n                <div class=\"percent\" id=\"percent4\"></div>\n                <a class=\"modal_close\" id=\"abort4\" href=\"#\"></a>\n            </div>\n        </div>\n    </li>\n</ul>";

var validateSize = function validateSize(f) {
  return true;
};
function shareFile() {
  var searchUserModalContent = document.getElementById("searchUserModalContent");
  var AddUserModalContent = document.getElementById("AddUserModalContent");
  var containerOverlay = document.querySelector(".container-overlay");

  /**/
  searchUserModalContent.innerHTML = htmlShareFile;
  AddUserModalContent.style.display = "none";
  searchUserModalContent.style.display = "block";
  containerOverlay.style.display = "block";
  document.getElementById("btn-ShareFileCancel").addEventListener("click", function (e) {
    e.preventDefault();
    searchUserModalContent.style.display = "none";
    containerOverlay.style.display = "none";
  });
  document.getElementById("btn-ShareFileAccept").addEventListener("click", function (e) {
    e.preventDefault();
    if (RUNMODE === "DEBUG") console.log(document.getElementById("destUserName").value);
    if (RUNMODE === "DEBUG") console.log(document.getElementById("FileExpirateDate").value);
    var data = {
      fileName: aSelectedFiles[0],
      fileSize: null,
      path: CURRENT_PATH,
      userName: UserName,
      destUserName: document.getElementById("destUserName").value,
      expirationDate: document.getElementById("FileExpirateDate").value
    };
    execFetch("/files/share", "POST", data).then(function (d) {
      if (RUNMODE === "DEBUG") console.log(d);
      if (d.status === "OK") {
        searchUserModalContent.style.display = "none";
        containerOverlay.style.display = "none";
        sendEmail(d.data.DestUser, "mbermejo17@gmail.com", "URL para descarga de archivo", "Descarga de archivo https://194.224.194.134/files/share/" + d.data.UrlCode);
      }
    }).catch(function (e) {
      showToast("Error al compartir archivo " + data.fileName + ".<br>Err:" + e, "err");
      if (RUNMODE === "DEBUG") console.log(e);
    });
  });
}

function deleteSelected() {
  if (RUNMODE === "DEBUG") console.log("aSelectedFolders: ", aSelectedFolders.length);
  if (aSelectedFolders.length > 0) {
    showDialogYesNo("Delete foldes", "Delete selected folders?", function (y) {
      $.when(deleteFolder(CURRENT_PATH)).then(function (result) {
        if (aSelectedFiles.length > 0) {
          showDialogYesNo("Delete Files", "Delete selected files?", function (y) {
            deleteFile(CURRENT_PATH);
          }, function (n) {
            if (RUNMODE === "DEBUG") console.log("Delete Files Canceled");
          });
        }
        document.getElementById("refresh").click();
      });
    }, function (n) {
      if (RUNMODE === "DEBUG") console.log("Delete Folder Canceled");
      if (aSelectedFiles.length > 0) {
        showDialogYesNo("Delete Files", "Delete selected files?", function (y) {
          deleteFile(CURRENT_PATH);
        }, function (n) {
          if (RUNMODE === "DEBUG") console.log("Delete Files Canceled");
        });
      }
    });
  } else {
    if (aSelectedFiles.length > 0) {
      showDialogYesNo("Delete Files", "Delete selected files?", function (y) {
        deleteFile(CURRENT_PATH);
      }, function (n) {
        if (RUNMODE === "DEBUG") console.log("Delete Files Canceled");
      });
    }
  }
}

function upload(Token) {
  var w = 32;
  var h = 440;
  var aListHandler = [];
  var handlerCounter = 0;
  var ModalTitle = "Subida de archivos";
  var ModalContent = "<label class=\"file-input waves-effect waves-teal btn-flat btn2-unify\">Select files<input id=\"upload-input\" type=\"file\" name=\"uploads[]\" multiple=\"multiple\" class=\"modal-action modal-close\"></label>\n                        <span id=\"sFiles\">Ningun archivo seleccionado</span>";
  ModalContent += htmlUploadDownloadTemplate;
  var htmlContent = "<div id=\"modal-header\">\n                          <h5>" + ModalTitle + "</h5>\n                          <a class=\"modal_close\" id=\"modalClose\" href=\"#\"></a>\n                        </div>\n                        <div class=\"modal-content\">\n                          <p>" + ModalContent + "</p>\n                      </div>\n                      <div class=\"modal-footer\">\n                              <!--<input type=\"text\" hidden id=\"destPath\" name=\"destPath\" value=\"\"/>-->\n                              <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"btnCancelAll\" href=\"#!\">Cancel uploads</a>  \n                              <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"btnCloseUpload\" href=\"#!\">Close</a>\n                      </div>";

  $("#upload").removeClass("disabled").addClass("disabled");

  function fnUploadFile(formData, nFile, fileName) {
    $("#li" + nFile).show();
    $("#li-filename" + nFile).show();
    $("#li-filename" + nFile).html(fileName);
    var realpath = getRealPath(CURRENT_PATH);
    if (RUNMODE === "DEBUG") console.log("Upload:CURRENT_PATH " + CURRENT_PATH);
    if (RUNMODE === "DEBUG") console.log("Upload:REAL_ROOT_PATH " + REAL_ROOT_PATH);
    if (RUNMODE === "DEBUG") console.log("Upload:realPath " + realpath);
    $.ajax({
      url: "/files/upload?destPath=" + realpath,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 290000,
      beforeSend: function beforeSend(xhrObj) {
        xhrObj.setRequestHeader("Authorization", "Bearer " + Token);
        xhrObj.setRequestHeader("destPath", realpath);
      },
      success: function success(data) {
        if (RUNMODE === "DEBUG") console.log(fileName + "upload successful!\n" + data);
        showToast(fileName + " uploaded sucessfully", "success");
        $("#abort" + nFile).hide();
        $("#refresh").trigger("click");
        handlerCounter = handlerCounter - 1;
        if (handlerCounter == 0) {
          $("#btnCancelAll").removeClass("disabled").addClass("disabled");
        }
      },
      xhr: function xhr() {
        aListHandler[nFile] = new XMLHttpRequest();
        var percentComplete = 0;
        aListHandler[nFile].upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            $("#percent" + nFile).text(percentComplete + "%");
            $("#progress-bar" + nFile).width(percentComplete + "%");
            /* if (percentComplete === 100) {
              $('#refresh').trigger('click');
            } */
          }
        }, false);
        return aListHandler[nFile];
      }
    });
  }

  $("#modal").html(htmlContent).css("width: " + w + "%;height: " + h + "px;text-align: center;");
  //$('.modal-content').css('width: 350px;');
  $(".modal-container").css("width: 40% !important");
  $(".file-input").show();
  $("#modal").show();
  $("#lean-overlay").show();
  $("#btnCloseUpload").on("click", function (e) {
    $("#upload").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
  });
  $("#modalClose").on("click", function (e) {
    $("#upload").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
  });
  $("#btnCancelAll").removeClass("disabled");
  $(".modal_close").on("click", function (e) {
    e.preventDefault();
    if (RUNMODE === "DEBUG") console.log(e);
    var n = parseInt(e.target.id.slice(-1));
    aListHandler[n].abort();
    var percentLabel = document.querySelector("#percent" + n);
    var progressBar = document.querySelector("#progress-bar" + n);
    progressBar.innerHTML = "Canceled by user";
    percentLabel.innerHTML = "";
    progressBar.style.color = "red";
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "white";
    $(e.target).hide();
  });
  $("#btnCancelAll").on("click", function (e) {
    for (var x = 0; x < 4; x++) {
      aListHandler[x].abort();
      var percentLabel = document.querySelector("#percent" + x);
      var progressBar = document.querySelector("#progress-bar" + x);
      progressBar.innerHTML = "Canceled by user";
      percentLabel.innerHTML = "";
      progressBar.style.color = "red";
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "white";
    }
    $("#btnCancelAll").addClass("disabled");
  });
  $("#upload-input").on("change", function (e) {
    var files = $("#upload-input").get(0).files;
    handlerCounter = files.length;
    files.length > 0 ? $("#sFiles").html(files.length + " archivos seleccionados.") : $("#sFiles").html(files[0]);
    if (RUNMODE === "DEBUG") console.log(files.length);
    $(".file-input").hide();
    if (files.length > 0 && files.length <= 5) {
      $("#btnCloseUpload").removeClass("disabled").addClass("disabled");
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var formData = new FormData();
        // add the files to formData object for the data payload

        formData.append("uploads[]", file, file.name);
        fnUploadFile(formData, i, file.name);
      }
      $("#btnCloseUpload").removeClass("disabled");
    } else {
      showToast("No se pueden subir más de 5 archivos a la vez", "err");
    }
  });
}

function newFolder(folderName) {
  var headers = new Headers();
  headers.append("Authorization", "Bearer " + Token);
  headers.append("Content-Type", "application/json");
  fetch("/files/newfolder", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      path: getRealPath(CURRENT_PATH),
      folderName: folderName
    }),
    timeout: 10000
  }).then(FetchHandleErrors).then(function (r) {
    return r.json();
  }).then(function (data) {
    if (RUNMODE === "DEBUG") console.log(data);
    if (data.status == "OK") {
      $("#modal").hide();
      $("#lean-overlay").hide();
      $("#refresh").trigger("click");
      showToast("Creada nueva carpeta " + data.data.folderName, "success");
    }
  }).catch(function (err) {
    if (RUNMODE === "DEBUG") console.log(err);
  });
}

function deleteFile(path) {
  var headers = new Headers();
  var x = 0;
  var aF = aSelectedFiles.slice();
  if (RUNMODE === "DEBUG") console.log(aF);
  headers.append("Authorization", "Bearer " + Token);
  headers.append("Content-Type", "application/json");
  $("#waiting").addClass("active");
  for (x = 0; x < aF.length; x++) {
    if (RUNMODE === "DEBUG") console.log("Deleting file " + aF[x] + " ...");
    fetch("/files/delete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        path: getRealPath(path),
        fileName: aF[x]
      }),
      timeout: 720000
    }).then(FetchHandleErrors).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (RUNMODE === "DEBUG") console.log(data);
      if (data.status == "OK") {
        aSelectedFiles.shift();
        $(".toast").removeClass("success").addClass("success");
        showToast("Archivo " + data.data.fileName + " borrado", "success");
        $("#refresh").trigger("click");
      }
    }).catch(function (err) {
      if (RUNMODE === "DEBUG") console.log(err);
      $(".toast").removeClass("err").addClass("err");
      showToast(err, "err");
    });
  }
  $("#waiting").removeClass("active");
}

function deleteFolder(path) {
  var headers = new Headers();
  var x = 0;
  var aF = aSelectedFolders.slice();
  if (RUNMODE === "DEBUG") console.log(aF);
  headers.append("Authorization", "Bearer " + Token);
  headers.append("Content-Type", "application/json");
  $("#waiting").addClass("active");
  for (x = 0; x < aF.length; x++) {
    if (RUNMODE === "DEBUG") console.log("Deleting folder " + aF[x] + " ...");
    fetch("/files/delete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        path: getRealPath(path),
        fileName: aF[x]
      }),
      timeout: 720000
    }).then(FetchHandleErrors).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (RUNMODE === "DEBUG") console.log(data);
      if (data.status == "OK") {
        $(".toast").removeClass("success").addClass("success");
        showToast("Carpeta " + data.data.fileName + " borrada", "success");
        aSelectedFolders.shift();
        $("#waiting").removeClass("active");
      }
    }).catch(function (err) {
      if (RUNMODE === "DEBUG") console.log(err);
      $("#waiting").removeClass("active");
    });
  }
  $("#waiting").removeClass("active");
}

//TODO: Optimizar renderizado de elementos li
//incorporando el contenido en el bucle _loop
function download(fileList, text) {
  var reqList = [],
      handlerCount = 0,
      responseTimeout = [];
  var w = 32;
  var h = 440;
  var ModalTitle = "Descarga de archivos seleccionados";
  var ModalContent = htmlUploadDownloadTemplate;
  var htmlContent = "<div id=\"modal-header\">\n                          <h5>" + ModalTitle + "</h5>\n                          <a class=\"modal_close\" id=\"modalClose\" href=\"#\"></a>\n                      </div>\n                      <div class=\"modal-content\">\n                          <p>" + ModalContent + "</p>\n                      </div>\n                      <div class=\"modal-footer\">\n                          <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"btnCancelAll\" href=\"#!\">Cancel downloads</a>\n                          <a class=\"modal-action modal-close waves-effect waves-teal btn-flat btn2-unify\" id=\"btnCloseDownload\" href=\"#!\">Cerrar</a>\n                      </div>";
  $("#modal").html(htmlContent).css("width: " + w + "%;height: " + h + "px;text-align: center;");
  //$('.modal-content').css('width: 350px;');
  $(".modal").css("width: 40% !important");
  document.querySelector("#modal").style.display = "block";
  document.querySelector("#lean-overlay").style.display = "block";
  document.querySelector("#btnCancelAll").classList.add("disabled");

  $("#download").addClass("disabled");
  $("#btnCloseDownload").on("click", function (e) {
    $("#download").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
    $("#refresh").trigger("click");
    aSelectedFiles = [];
  });
  $("#modalClose").on("click", function (e) {
    $("#download").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
    $("#refresh").trigger("click");
    aSelectedFiles = [];
  });
  $("#waiting").addClass("active");
  $("#btnCancelAll").on("click", function (e) {
    for (var x = 0; x < 4; x++) {
      reqList[x].abort();
      var percentLabel = document.querySelector("#percent" + x);
      var progressBar = document.querySelector("#progress-bar" + x);
      progressBar.innerHTML = "Canceled by user";
      percentLabel.innerHTML = "";
      progressBar.style.color = "red";
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "white";
    }
    $("#btnCancelAll").addClass("disabled");
  });
  $(".modal_close").on("click", function (e) {
    e.preventDefault();
    var n = parseInt(e.target.id.slice(-1));
    reqList[n].abort();
    var percentLabel = document.querySelector("#percent" + n);
    var progressBar = document.querySelector("#progress-bar" + n);
    progressBar.innerHTML = "Canceled by user";
    percentLabel.innerHTML = "";
    progressBar.style.color = "red";
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "white";
  });

  $("#btnCancelAll").removeClass("disabled");
  var _loop = function _loop(i) {
    var fName = fileList[i];
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
      if (RUNMODE === "DEBUG") console.log("** Timeout error ->File:" + fName + " " + reqList[i].status + " " + reqList[i].statusText);
      // handlerCount = handlerCount - 1
      progressBar.innerHTML = "Timeout Error";
      percentLabel.innerHTML = "";
      progressBar.style.color = "red";
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "white";
      progressBar.classList.add("blink");
      responseTimeout[i] = true;
    };
    reqList[i].onprogress = function (evt) {
      if (evt.lengthComputable) {
        var percentComplete = parseInt(evt.loaded / evt.total * 100);
        progressBar.style.width = percentComplete + "%";
        percentLabel.innerHTML = percentComplete + "%";
      }
    };
    reqList[i].onerror = function () {
      if (RUNMODE === "DEBUG") console.log("** An error occurred during the transaction ->File:" + fName + " " + req.status + " " + req.statusText);
      handlerCount = handlerCount - 1;
      percentLabel.innerHTML = "Error";
      percentLabel.style.color = "red";
      $("#abort" + i).hide();
    };
    reqList[i].onloadend = function () {
      handlerCount = handlerCount - 1;
      if (!responseTimeout[i]) {
        progressBar.style.width = "100%";
        percentLabel.innerHTML = "100%";
        $("#abort" + i).hide();
      }
      if (handlerCount === 0) {
        $("#download-end").show();
        $("#btnCancelAll").removeClass("disabled").addClass("disabled");
        $("#refresh").trigger("click");
      }
      if (RUNMODE === "DEBUG") console.log("File " + handlerCount + " downloaded");
    };
    reqList[i].onloadstart = function () {
      handlerCount = handlerCount + 1;
      progressBar.style.width = "0";
      percentLabel.innerHTML = "0%";
    };
    reqList[i].onload = function () {
      if (reqList[i].readyState === 4 && reqList[i].status === 200) {
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
              // preloader.style.display = 'none'
            }
          } else {
            window.open = downloadUrl;
            // preloader.style.display = 'none'
          }

          setTimeout(function () {
            URL.revokeObjectURL(downloadUrl);
          }, 100); // cleanup
        }
      }
    };
    reqList[i].setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (RUNMODE === "DEBUG") console.log(getRealPath(CURRENT_PATH) + "/" + fileList[i]);
    reqList[i].send(serializeObject({
      filename: getRealPath(CURRENT_PATH) + "/" + fileList[i]
    }));
  };
  for (var i = 0; i < fileList.length; i++) {
    _loop(i);
  }
  $("#waiting").removeClass("active");
}

///////////////////////////////////
// End Files and fFolders module
/////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbGVNYW5hZ2VyLmpzIiwianMvdmVuZG9yL2pzLWNvb2tpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDZ0VnQixTLEdBQUEsUztRQTZEQSxjLEdBQUEsYztRQXdEQSxNLEdBQUEsTTtRQTJKQyxTLEdBQUEsUztRQTZCRCxVLEdBQUEsVTtRQTJDQSxZLEdBQUEsWTtRQTBDQSxRLEdBQUEsUTs7QUFsY2hCOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxVQUFVLG1CQUFRLEdBQVIsQ0FBWSxTQUFaLENBQWQ7QUFDQSxJQUFJLGlCQUFpQixtQkFBUSxHQUFSLENBQVksVUFBWixDQUFyQjs7QUFFQSxJQUFJLDhxRUFBSjs7QUFxREEsSUFBSSxlQUFlLFNBQWYsWUFBZSxJQUFLO0FBQ3RCLFNBQU8sSUFBUDtBQUNELENBRkQ7QUFHTyxTQUFTLFNBQVQsR0FBcUI7QUFDMUIsTUFBSSx5QkFBeUIsU0FBUyxjQUFULENBQzNCLHdCQUQyQixDQUE3QjtBQUdBLE1BQUksc0JBQXNCLFNBQVMsY0FBVCxDQUF3QixxQkFBeEIsQ0FBMUI7QUFDQSxNQUFJLG1CQUFtQixTQUFTLGFBQVQsQ0FBdUIsb0JBQXZCLENBQXZCOztBQUVBO0FBQ0EseUJBQXVCLFNBQXZCLEdBQW1DLGFBQW5DO0FBQ0Esc0JBQW9CLEtBQXBCLENBQTBCLE9BQTFCLEdBQW9DLE1BQXBDO0FBQ0EseUJBQXVCLEtBQXZCLENBQTZCLE9BQTdCLEdBQXVDLE9BQXZDO0FBQ0EsbUJBQWlCLEtBQWpCLENBQXVCLE9BQXZCLEdBQWlDLE9BQWpDO0FBQ0EsV0FDRyxjQURILENBQ2tCLHFCQURsQixFQUVHLGdCQUZILENBRW9CLE9BRnBCLEVBRTZCLGFBQUs7QUFDOUIsTUFBRSxjQUFGO0FBQ0EsMkJBQXVCLEtBQXZCLENBQTZCLE9BQTdCLEdBQXVDLE1BQXZDO0FBQ0EscUJBQWlC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c291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ29va2llcyBmcm9tIFwiLi4vdmVuZG9yL2pzLWNvb2tpZVwiO1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRmlsZXMgYW5kIEZvbGRlciBtb2R1bGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmxldCBSVU5NT0RFID0gQ29va2llcy5nZXQoXCJSdW5Nb2RlXCIpO1xyXG5sZXQgUkVBTF9ST09UX1BBVEggPSBDb29raWVzLmdldChcIlJvb3RQYXRoXCIpO1xyXG5cclxubGV0IGh0bWxVcGxvYWREb3dubG9hZFRlbXBsYXRlID0gYDx1bCBjbGFzcz1cInByZWxvYWRlci1maWxlXCIgaWQ9XCJEb3dubG9hZGZpbGVMaXN0XCI+XHJcbiAgICA8bGkgaWQ9XCJsaTBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDBcIiBocmVmPVwiI1wiPjwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2xpPlxyXG4gICAgPGxpIGlkPVwibGkxXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTFcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjFcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQxXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9saT5cclxuICAgIDxsaSBpZD1cImxpMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0MlwiIGhyZWY9XCIjXCI+PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj4gICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvbGk+XHJcbiAgICA8bGkgaWQ9XCJsaTNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lM1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyM1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDNcIiBocmVmPVwiI1wiPjwvYT5cclxuICAgICAgICAgICAgPC9kaXY+ICAgXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2xpPlxyXG4gICAgPGxpIGlkPVwibGk0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTRcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjRcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50NFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQ0XCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9saT5cclxuPC91bD5gO1xyXG5cclxubGV0IHZhbGlkYXRlU2l6ZSA9IGYgPT4ge1xyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5leHBvcnQgZnVuY3Rpb24gc2hhcmVGaWxlKCkge1xyXG4gIGxldCBzZWFyY2hVc2VyTW9kYWxDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNlYXJjaFVzZXJNb2RhbENvbnRlbnRcIlxyXG4gICk7XHJcbiAgbGV0IEFkZFVzZXJNb2RhbENvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIkFkZFVzZXJNb2RhbENvbnRlbnRcIik7XHJcbiAgbGV0IGNvbnRhaW5lck92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1vdmVybGF5XCIpO1xyXG5cclxuICAvKiovXHJcbiAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5pbm5lckhUTUwgPSBodG1sU2hhcmVGaWxlO1xyXG4gIEFkZFVzZXJNb2RhbENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIHNlYXJjaFVzZXJNb2RhbENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICBjb250YWluZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgZG9jdW1lbnRcclxuICAgIC5nZXRFbGVtZW50QnlJZChcImJ0bi1TaGFyZUZpbGVDYW5jZWxcIilcclxuICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfSk7XHJcbiAgZG9jdW1lbnRcclxuICAgIC5nZXRFbGVtZW50QnlJZChcImJ0bi1TaGFyZUZpbGVBY2NlcHRcIilcclxuICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcclxuICAgICAgICBjb25zb2xlLmxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc3RVc2VyTmFtZVwiKS52YWx1ZSk7XHJcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2coZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJGaWxlRXhwaXJhdGVEYXRlXCIpLnZhbHVlKTtcclxuICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgZmlsZU5hbWU6IGFTZWxlY3RlZEZpbGVzWzBdLFxyXG4gICAgICAgIGZpbGVTaXplOiBudWxsLFxyXG4gICAgICAgIHBhdGg6IENVUlJFTlRfUEFUSCxcclxuICAgICAgICB1c2VyTmFtZTogVXNlck5hbWUsXHJcbiAgICAgICAgZGVzdFVzZXJOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc3RVc2VyTmFtZVwiKS52YWx1ZSxcclxuICAgICAgICBleHBpcmF0aW9uRGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJGaWxlRXhwaXJhdGVEYXRlXCIpLnZhbHVlXHJcbiAgICAgIH07XHJcbiAgICAgIGV4ZWNGZXRjaChcIi9maWxlcy9zaGFyZVwiLCBcIlBPU1RcIiwgZGF0YSlcclxuICAgICAgICAudGhlbihkID0+IHtcclxuICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGQpO1xyXG4gICAgICAgICAgaWYgKGQuc3RhdHVzID09PSBcIk9LXCIpIHtcclxuICAgICAgICAgICAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBzZW5kRW1haWwoXHJcbiAgICAgICAgICAgICAgZC5kYXRhLkRlc3RVc2VyLFxyXG4gICAgICAgICAgICAgIFwibWJlcm1lam8xN0BnbWFpbC5jb21cIixcclxuICAgICAgICAgICAgICBcIlVSTCBwYXJhIGRlc2NhcmdhIGRlIGFyY2hpdm9cIixcclxuICAgICAgICAgICAgICBgRGVzY2FyZ2EgZGUgYXJjaGl2byBodHRwczovLzE5NC4yMjQuMTk0LjEzNC9maWxlcy9zaGFyZS8ke1xyXG4gICAgICAgICAgICAgICAgZC5kYXRhLlVybENvZGVcclxuICAgICAgICAgICAgICB9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgc2hvd1RvYXN0KFxyXG4gICAgICAgICAgICBcIkVycm9yIGFsIGNvbXBhcnRpciBhcmNoaXZvIFwiICsgZGF0YS5maWxlTmFtZSArIFwiLjxicj5FcnI6XCIgKyBlLFxyXG4gICAgICAgICAgICBcImVyclwiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkKCkge1xyXG4gIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXHJcbiAgICBjb25zb2xlLmxvZyhcImFTZWxlY3RlZEZvbGRlcnM6IFwiLCBhU2VsZWN0ZWRGb2xkZXJzLmxlbmd0aCk7XHJcbiAgaWYgKGFTZWxlY3RlZEZvbGRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgc2hvd0RpYWxvZ1llc05vKFxyXG4gICAgICBcIkRlbGV0ZSBmb2xkZXNcIixcclxuICAgICAgXCJEZWxldGUgc2VsZWN0ZWQgZm9sZGVycz9cIixcclxuICAgICAgeSA9PiB7XHJcbiAgICAgICAgJC53aGVuKGRlbGV0ZUZvbGRlcihDVVJSRU5UX1BBVEgpKS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBzaG93RGlhbG9nWWVzTm8oXHJcbiAgICAgICAgICAgICAgXCJEZWxldGUgRmlsZXNcIixcclxuICAgICAgICAgICAgICBcIkRlbGV0ZSBzZWxlY3RlZCBmaWxlcz9cIixcclxuICAgICAgICAgICAgICB5ID0+IHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZUZpbGUoQ1VSUkVOVF9QQVRIKTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG4gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGUgRmlsZXMgQ2FuY2VsZWRcIik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWZyZXNoXCIpLmNsaWNrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG4gPT4ge1xyXG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiRGVsZXRlIEZvbGRlciBDYW5jZWxlZFwiKTtcclxuICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgc2hvd0RpYWxvZ1llc05vKFxyXG4gICAgICAgICAgICBcIkRlbGV0ZSBGaWxlc1wiLFxyXG4gICAgICAgICAgICBcIkRlbGV0ZSBzZWxlY3RlZCBmaWxlcz9cIixcclxuICAgICAgICAgICAgeSA9PiB7XHJcbiAgICAgICAgICAgICAgZGVsZXRlRmlsZShDVVJSRU5UX1BBVEgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuID0+IHtcclxuICAgICAgICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIkRlbGV0ZSBGaWxlcyBDYW5jZWxlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChhU2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHNob3dEaWFsb2dZZXNObyhcclxuICAgICAgICBcIkRlbGV0ZSBGaWxlc1wiLFxyXG4gICAgICAgIFwiRGVsZXRlIHNlbGVjdGVkIGZpbGVzP1wiLFxyXG4gICAgICAgIHkgPT4ge1xyXG4gICAgICAgICAgZGVsZXRlRmlsZShDVVJSRU5UX1BBVEgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbiA9PiB7XHJcbiAgICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIkRlbGV0ZSBGaWxlcyBDYW5jZWxlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkKFRva2VuKSB7XHJcbiAgbGV0IHcgPSAzMjtcclxuICBsZXQgaCA9IDQ0MDtcclxuICBsZXQgYUxpc3RIYW5kbGVyID0gW107XHJcbiAgbGV0IGhhbmRsZXJDb3VudGVyID0gMDtcclxuICBsZXQgTW9kYWxUaXRsZSA9IFwiU3ViaWRhIGRlIGFyY2hpdm9zXCI7XHJcbiAgbGV0IE1vZGFsQ29udGVudCA9IGA8bGFiZWwgY2xhc3M9XCJmaWxlLWlucHV0IHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIj5TZWxlY3QgZmlsZXM8aW5wdXQgaWQ9XCJ1cGxvYWQtaW5wdXRcIiB0eXBlPVwiZmlsZVwiIG5hbWU9XCJ1cGxvYWRzW11cIiBtdWx0aXBsZT1cIm11bHRpcGxlXCIgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2VcIj48L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInNGaWxlc1wiPk5pbmd1biBhcmNoaXZvIHNlbGVjY2lvbmFkbzwvc3Bhbj5gO1xyXG4gIE1vZGFsQ29udGVudCArPSBodG1sVXBsb2FkRG93bmxvYWRUZW1wbGF0ZTtcclxuICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7TW9kYWxDb250ZW50fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaGlkZGVuIGlkPVwiZGVzdFBhdGhcIiBuYW1lPVwiZGVzdFBhdGhcIiB2YWx1ZT1cIlwiLz4tLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2FuY2VsQWxsXCIgaHJlZj1cIiMhXCI+Q2FuY2VsIHVwbG9hZHM8L2E+ICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2xvc2VVcGxvYWRcIiBocmVmPVwiIyFcIj5DbG9zZTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoXCIjdXBsb2FkXCIpXHJcbiAgICAucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKVxyXG4gICAgLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XHJcblxyXG4gIGZ1bmN0aW9uIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgbkZpbGUsIGZpbGVOYW1lKSB7XHJcbiAgICAkKFwiI2xpXCIgKyBuRmlsZSkuc2hvdygpO1xyXG4gICAgJChcIiNsaS1maWxlbmFtZVwiICsgbkZpbGUpLnNob3coKTtcclxuICAgICQoXCIjbGktZmlsZW5hbWVcIiArIG5GaWxlKS5odG1sKGZpbGVOYW1lKTtcclxuICAgIGxldCByZWFscGF0aCA9IGdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCk7XHJcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIlVwbG9hZDpDVVJSRU5UX1BBVEggXCIgKyBDVVJSRU5UX1BBVEgpO1xyXG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcclxuICAgICAgY29uc29sZS5sb2coXCJVcGxvYWQ6UkVBTF9ST09UX1BBVEggXCIgKyBSRUFMX1JPT1RfUEFUSCk7XHJcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIlVwbG9hZDpyZWFsUGF0aCBcIiArIHJlYWxwYXRoKTtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogXCIvZmlsZXMvdXBsb2FkP2Rlc3RQYXRoPVwiICsgcmVhbHBhdGgsXHJcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcclxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgIHRpbWVvdXQ6IDI5MDAwMCxcclxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyT2JqKSB7XHJcbiAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgVG9rZW4pO1xyXG4gICAgICAgIHhock9iai5zZXRSZXF1ZXN0SGVhZGVyKFwiZGVzdFBhdGhcIiwgcmVhbHBhdGgpO1xyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGVOYW1lICsgXCJ1cGxvYWQgc3VjY2Vzc2Z1bCFcXG5cIiArIGRhdGEpO1xyXG4gICAgICAgIHNob3dUb2FzdChmaWxlTmFtZSArIFwiIHVwbG9hZGVkIHN1Y2Vzc2Z1bGx5XCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAkKFwiI2Fib3J0XCIgKyBuRmlsZSkuaGlkZSgpO1xyXG4gICAgICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgaGFuZGxlckNvdW50ZXIgPSBoYW5kbGVyQ291bnRlciAtIDE7XHJcbiAgICAgICAgaWYgKGhhbmRsZXJDb3VudGVyID09IDApIHtcclxuICAgICAgICAgICQoXCIjYnRuQ2FuY2VsQWxsXCIpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgeGhyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgbGV0IHBlcmNlbnRDb21wbGV0ZSA9IDA7XHJcbiAgICAgICAgYUxpc3RIYW5kbGVyW25GaWxlXS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgIFwicHJvZ3Jlc3NcIixcclxuICAgICAgICAgIGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xyXG4gICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSA9IHBhcnNlSW50KHBlcmNlbnRDb21wbGV0ZSAqIDEwMCk7XHJcbiAgICAgICAgICAgICAgJChcIiNwZXJjZW50XCIgKyBuRmlsZSkudGV4dChwZXJjZW50Q29tcGxldGUgKyBcIiVcIik7XHJcbiAgICAgICAgICAgICAgJChcIiNwcm9ncmVzcy1iYXJcIiArIG5GaWxlKS53aWR0aChwZXJjZW50Q29tcGxldGUgKyBcIiVcIik7XHJcbiAgICAgICAgICAgICAgLyogaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmFsc2VcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiBhTGlzdEhhbmRsZXJbbkZpbGVdO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICQoXCIjbW9kYWxcIilcclxuICAgIC5odG1sKGh0bWxDb250ZW50KVxyXG4gICAgLmNzcyhcIndpZHRoOiBcIiArIHcgKyBcIiU7aGVpZ2h0OiBcIiArIGggKyBcInB4O3RleHQtYWxpZ246IGNlbnRlcjtcIik7XHJcbiAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xyXG4gICQoXCIubW9kYWwtY29udGFpbmVyXCIpLmNzcyhcIndpZHRoOiA0MCUgIWltcG9ydGFudFwiKTtcclxuICAkKFwiLmZpbGUtaW5wdXRcIikuc2hvdygpO1xyXG4gICQoXCIjbW9kYWxcIikuc2hvdygpO1xyXG4gICQoXCIjbGVhbi1vdmVybGF5XCIpLnNob3coKTtcclxuICAkKFwiI2J0bkNsb3NlVXBsb2FkXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAkKFwiI3VwbG9hZFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XHJcbiAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XHJcbiAgfSk7XHJcbiAgJChcIiNtb2RhbENsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAkKFwiI3VwbG9hZFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XHJcbiAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XHJcbiAgfSk7XHJcbiAgJChcIiNidG5DYW5jZWxBbGxcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAkKFwiLm1vZGFsX2Nsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlKTtcclxuICAgIGxldCBuID0gcGFyc2VJbnQoZS50YXJnZXQuaWQuc2xpY2UoLTEpKTtcclxuICAgIGFMaXN0SGFuZGxlcltuXS5hYm9ydCgpO1xyXG4gICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgbik7XHJcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgbik7XHJcbiAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIkNhbmNlbGVkIGJ5IHVzZXJcIjtcclxuICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xyXG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICQoZS50YXJnZXQpLmhpZGUoKTtcclxuICB9KTtcclxuICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA0OyB4KyspIHtcclxuICAgICAgYUxpc3RIYW5kbGVyW3hdLmFib3J0KCk7XHJcbiAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlcmNlbnRcIiArIHgpO1xyXG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgeCk7XHJcbiAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IFwiQ2FuY2VsZWQgYnkgdXNlclwiO1xyXG4gICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xyXG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICB9XHJcbiAgICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gIH0pO1xyXG4gICQoXCIjdXBsb2FkLWlucHV0XCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGxldCBmaWxlcyA9ICQoXCIjdXBsb2FkLWlucHV0XCIpLmdldCgwKS5maWxlcztcclxuICAgIGhhbmRsZXJDb3VudGVyID0gZmlsZXMubGVuZ3RoO1xyXG4gICAgZmlsZXMubGVuZ3RoID4gMFxyXG4gICAgICA/ICQoXCIjc0ZpbGVzXCIpLmh0bWwoZmlsZXMubGVuZ3RoICsgXCIgYXJjaGl2b3Mgc2VsZWNjaW9uYWRvcy5cIilcclxuICAgICAgOiAkKFwiI3NGaWxlc1wiKS5odG1sKGZpbGVzWzBdKTtcclxuICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGZpbGVzLmxlbmd0aCk7XHJcbiAgICAkKFwiLmZpbGUtaW5wdXRcIikuaGlkZSgpO1xyXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDAgJiYgZmlsZXMubGVuZ3RoIDw9IDUpIHtcclxuICAgICAgJChcIiNidG5DbG9zZVVwbG9hZFwiKVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpXHJcbiAgICAgICAgLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIC8vIGFkZCB0aGUgZmlsZXMgdG8gZm9ybURhdGEgb2JqZWN0IGZvciB0aGUgZGF0YSBwYXlsb2FkXHJcblxyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVwbG9hZHNbXVwiLCBmaWxlLCBmaWxlLm5hbWUpO1xyXG4gICAgICAgIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgaSwgZmlsZS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICAkKFwiI2J0bkNsb3NlVXBsb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaG93VG9hc3QoXCJObyBzZSBwdWVkZW4gc3ViaXIgbcOhcyBkZSA1IGFyY2hpdm9zIGEgbGEgdmV6XCIsIFwiZXJyXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4gZXhwb3J0IGZ1bmN0aW9uIG5ld0ZvbGRlcihmb2xkZXJOYW1lKSB7XHJcbiAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgVG9rZW4pO1xyXG4gIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICBmZXRjaChcIi9maWxlcy9uZXdmb2xkZXJcIiwge1xyXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgIHBhdGg6IGdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCksXHJcbiAgICAgIGZvbGRlck5hbWU6IGZvbGRlck5hbWVcclxuICAgIH0pLFxyXG4gICAgdGltZW91dDogMTAwMDBcclxuICB9KVxyXG4gICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXHJcbiAgICAudGhlbihyID0+IHIuanNvbigpKVxyXG4gICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gXCJPS1wiKSB7XHJcbiAgICAgICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XHJcbiAgICAgICAgJChcIiNsZWFuLW92ZXJsYXlcIikuaGlkZSgpO1xyXG4gICAgICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgc2hvd1RvYXN0KFwiQ3JlYWRhIG51ZXZhIGNhcnBldGEgXCIgKyBkYXRhLmRhdGEuZm9sZGVyTmFtZSwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUZpbGUocGF0aCkge1xyXG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gIGxldCB4ID0gMDtcclxuICBsZXQgYUYgPSBhU2VsZWN0ZWRGaWxlcy5zbGljZSgpO1xyXG4gIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGFGKTtcclxuICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBUb2tlbik7XHJcbiAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICQoXCIjd2FpdGluZ1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICBmb3IgKHggPSAwOyB4IDwgYUYubGVuZ3RoOyB4KyspIHtcclxuICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgZmlsZSBcIiArIGFGW3hdICsgXCIgLi4uXCIpO1xyXG4gICAgZmV0Y2goXCIvZmlsZXMvZGVsZXRlXCIsIHtcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIHBhdGg6IGdldFJlYWxQYXRoKHBhdGgpLFxyXG4gICAgICAgIGZpbGVOYW1lOiBhRlt4XVxyXG4gICAgICB9KSxcclxuICAgICAgdGltZW91dDogNzIwMDAwXHJcbiAgICB9KVxyXG4gICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcclxuICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcclxuICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09IFwiT0tcIikge1xyXG4gICAgICAgICAgYVNlbGVjdGVkRmlsZXMuc2hpZnQoKTtcclxuICAgICAgICAgICQoXCIudG9hc3RcIilcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwic3VjY2Vzc1wiKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgc2hvd1RvYXN0KFwiQXJjaGl2byBcIiArIGRhdGEuZGF0YS5maWxlTmFtZSArIFwiIGJvcnJhZG9cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgJChcIi50b2FzdFwiKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKFwiZXJyXCIpXHJcbiAgICAgICAgICAuYWRkQ2xhc3MoXCJlcnJcIik7XHJcbiAgICAgICAgc2hvd1RvYXN0KGVyciwgXCJlcnJcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVGb2xkZXIocGF0aCkge1xyXG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xyXG4gIGxldCB4ID0gMDtcclxuICBsZXQgYUYgPSBhU2VsZWN0ZWRGb2xkZXJzLnNsaWNlKCk7XHJcbiAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coYUYpO1xyXG4gIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIFRva2VuKTtcclxuICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgJChcIiN3YWl0aW5nXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gIGZvciAoeCA9IDA7IHggPCBhRi5sZW5ndGg7IHgrKykge1xyXG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGluZyBmb2xkZXIgXCIgKyBhRlt4XSArIFwiIC4uLlwiKTtcclxuICAgIGZldGNoKFwiL2ZpbGVzL2RlbGV0ZVwiLCB7XHJcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBwYXRoOiBnZXRSZWFsUGF0aChwYXRoKSxcclxuICAgICAgICBmaWxlTmFtZTogYUZbeF1cclxuICAgICAgfSksXHJcbiAgICAgIHRpbWVvdXQ6IDcyMDAwMFxyXG4gICAgfSlcclxuICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXHJcbiAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXHJcbiAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSBcIk9LXCIpIHtcclxuICAgICAgICAgICQoXCIudG9hc3RcIilcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwic3VjY2Vzc1wiKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgc2hvd1RvYXN0KFwiQ2FycGV0YSBcIiArIGRhdGEuZGF0YS5maWxlTmFtZSArIFwiIGJvcnJhZGFcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5zaGlmdCgpO1xyXG4gICAgICAgICAgJChcIiN3YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbn1cclxuXHJcbi8vVE9ETzogT3B0aW1pemFyIHJlbmRlcml6YWRvIGRlIGVsZW1lbnRvcyBsaVxyXG4vL2luY29ycG9yYW5kbyBlbCBjb250ZW5pZG8gZW4gZWwgYnVjbGUgX2xvb3BcclxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkIChmaWxlTGlzdCwgdGV4dCkge1xyXG4gIGxldCByZXFMaXN0ID0gW10sXHJcbiAgICBoYW5kbGVyQ291bnQgPSAwLFxyXG4gICAgcmVzcG9uc2VUaW1lb3V0ID0gW107XHJcbiAgbGV0IHcgPSAzMjtcclxuICBsZXQgaCA9IDQ0MDtcclxuICBsZXQgTW9kYWxUaXRsZSA9IFwiRGVzY2FyZ2EgZGUgYXJjaGl2b3Mgc2VsZWNjaW9uYWRvc1wiO1xyXG4gIGxldCBNb2RhbENvbnRlbnQgPSBodG1sVXBsb2FkRG93bmxvYWRUZW1wbGF0ZTtcclxuICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2FuY2VsQWxsXCIgaHJlZj1cIiMhXCI+Q2FuY2VsIGRvd25sb2FkczwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DbG9zZURvd25sb2FkXCIgaHJlZj1cIiMhXCI+Q2VycmFyPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcclxuICAkKFwiI21vZGFsXCIpXHJcbiAgICAuaHRtbChodG1sQ29udGVudClcclxuICAgIC5jc3MoXCJ3aWR0aDogXCIgKyB3ICsgXCIlO2hlaWdodDogXCIgKyBoICsgXCJweDt0ZXh0LWFsaWduOiBjZW50ZXI7XCIpO1xyXG4gIC8vJCgnLm1vZGFsLWNvbnRlbnQnKS5jc3MoJ3dpZHRoOiAzNTBweDsnKTtcclxuICAkKFwiLm1vZGFsXCIpLmNzcyhcIndpZHRoOiA0MCUgIWltcG9ydGFudFwiKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vZGFsXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsZWFuLW92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcblxyXG4gICQoXCIjZG93bmxvYWRcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAkKFwiI2J0bkNsb3NlRG93bmxvYWRcIikub24oXCJjbGlja1wiLCBlID0+IHtcclxuICAgICQoXCIjZG93bmxvYWRcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgICQoXCIjbW9kYWxcIikuaGlkZSgpO1xyXG4gICAgJChcIiNsZWFuLW92ZXJsYXlcIikuaGlkZSgpO1xyXG4gICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuICAgIGFTZWxlY3RlZEZpbGVzID0gW107XHJcbiAgfSk7XHJcbiAgJChcIiNtb2RhbENsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAkKFwiI2Rvd25sb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XHJcbiAgICAkKFwiI21vZGFsXCIpLmhpZGUoKTtcclxuICAgICQoXCIjbGVhbi1vdmVybGF5XCIpLmhpZGUoKTtcclxuICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICBhU2VsZWN0ZWRGaWxlcyA9IFtdO1xyXG4gIH0pO1xyXG4gICQoXCIjd2FpdGluZ1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA0OyB4KyspIHtcclxuICAgICAgcmVxTGlzdFt4XS5hYm9ydCgpO1xyXG4gICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50XCIgKyB4KTtcclxuICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIiArIHgpO1xyXG4gICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIkNhbmNlbGVkIGJ5IHVzZXJcIjtcclxuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgfVxyXG4gICAgJChcIiNidG5DYW5jZWxBbGxcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICB9KTtcclxuICAkKFwiLm1vZGFsX2Nsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgbiA9IHBhcnNlSW50KGUudGFyZ2V0LmlkLnNsaWNlKC0xKSk7XHJcbiAgICByZXFMaXN0W25dLmFib3J0KCk7XHJcbiAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50XCIgKyBuKTtcclxuICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyBuKTtcclxuICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IFwiQ2FuY2VsZWQgYnkgdXNlclwiO1xyXG4gICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9IFwicmVkXCI7XHJcbiAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gIH0pO1xyXG5cclxuICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xyXG4gIGxldCBfbG9vcCA9IGkgPT4ge1xyXG4gICAgbGV0IGZOYW1lID0gZmlsZUxpc3RbaV07XHJcbiAgICBsZXQgbGlOdW1iZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xpXCIgKyBpKTtcclxuICAgIGxldCBsaUZpbGVuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsaS1maWxlbmFtZVwiICsgaSk7XHJcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgaSk7XHJcbiAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50XCIgKyBpKTtcclxuICAgIHJlc3BvbnNlVGltZW91dFtpXSA9IGZhbHNlO1xyXG4gICAgZk5hbWUgPSBmTmFtZVxyXG4gICAgICAuc3BsaXQoXCJcXFxcXCIpXHJcbiAgICAgIC5wb3AoKVxyXG4gICAgICAuc3BsaXQoXCIvXCIpXHJcbiAgICAgIC5wb3AoKTtcclxuICAgIHJlcUxpc3RbaV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHJlcUxpc3RbaV0ub3BlbihcIlBPU1RcIiwgXCIvZmlsZXMvZG93bmxvYWRcIiwgdHJ1ZSk7XHJcbiAgICByZXFMaXN0W2ldLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcclxuICAgIGxpTnVtYmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBsaUZpbGVuYW1lLmlubmVySFRNTCA9IGZOYW1lO1xyXG4gICAgcmVxTGlzdFtpXS50aW1lb3V0ID0gMzYwMDA7XHJcbiAgICByZXFMaXN0W2ldLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgXCIqKiBUaW1lb3V0IGVycm9yIC0+RmlsZTpcIiArXHJcbiAgICAgICAgICAgIGZOYW1lICtcclxuICAgICAgICAgICAgXCIgXCIgK1xyXG4gICAgICAgICAgICByZXFMaXN0W2ldLnN0YXR1cyArXHJcbiAgICAgICAgICAgIFwiIFwiICtcclxuICAgICAgICAgICAgcmVxTGlzdFtpXS5zdGF0dXNUZXh0XHJcbiAgICAgICAgKTtcclxuICAgICAgLy8gaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMVxyXG4gICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIlRpbWVvdXQgRXJyb3JcIjtcclxuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKFwiYmxpbmtcIik7XHJcbiAgICAgIHJlc3BvbnNlVGltZW91dFtpXSA9IHRydWU7XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbnByb2dyZXNzID0gZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgIGxldCBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludCgoZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkgKiAxMDApO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcGVyY2VudENvbXBsZXRlICsgXCIlXCI7XHJcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IHBlcmNlbnRDb21wbGV0ZSArIFwiJVwiO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICBcIioqIEFuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgdHJhbnNhY3Rpb24gLT5GaWxlOlwiICtcclxuICAgICAgICAgICAgZk5hbWUgK1xyXG4gICAgICAgICAgICBcIiBcIiArXHJcbiAgICAgICAgICAgIHJlcS5zdGF0dXMgK1xyXG4gICAgICAgICAgICBcIiBcIiArXHJcbiAgICAgICAgICAgIHJlcS5zdGF0dXNUZXh0XHJcbiAgICAgICAgKTtcclxuICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMTtcclxuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiRXJyb3JcIjtcclxuICAgICAgcGVyY2VudExhYmVsLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcclxuICAgICAgJChcIiNhYm9ydFwiICsgaSkuaGlkZSgpO1xyXG4gICAgfTtcclxuICAgIHJlcUxpc3RbaV0ub25sb2FkZW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCAtIDE7XHJcbiAgICAgIGlmICghcmVzcG9uc2VUaW1lb3V0W2ldKSB7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCIxMDAlXCI7XHJcbiAgICAgICAgJChcIiNhYm9ydFwiICsgaSkuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChoYW5kbGVyQ291bnQgPT09IDApIHtcclxuICAgICAgICAkKFwiI2Rvd25sb2FkLWVuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgJChcIiNidG5DYW5jZWxBbGxcIilcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpXHJcbiAgICAgICAgICAuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAkKFwiI3JlZnJlc2hcIikudHJpZ2dlcihcImNsaWNrXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJGaWxlIFwiICsgaGFuZGxlckNvdW50ICsgXCIgZG93bmxvYWRlZFwiKTtcclxuICAgIH07XHJcbiAgICByZXFMaXN0W2ldLm9ubG9hZHN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCArIDE7XHJcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIwXCI7XHJcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIjAlXCI7XHJcbiAgICB9O1xyXG4gICAgcmVxTGlzdFtpXS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHJlcUxpc3RbaV0ucmVhZHlTdGF0ZSA9PT0gNCAmJiByZXFMaXN0W2ldLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgbGV0IGZpbGVuYW1lID0gXCJcIjtcclxuICAgICAgICBsZXQgZGlzcG9zaXRpb24gPSByZXFMaXN0W2ldLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiKTtcclxuICAgICAgICBpZiAoZGlzcG9zaXRpb24gJiYgZGlzcG9zaXRpb24uaW5kZXhPZihcImF0dGFjaG1lbnRcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICBsZXQgZmlsZW5hbWVSZWdleCA9IC9maWxlbmFtZVteOz1cXG5dKj0oKFsnXCJdKS4qP1xcMnxbXjtcXG5dKikvO1xyXG4gICAgICAgICAgbGV0IG1hdGNoZXMgPSBmaWxlbmFtZVJlZ2V4LmV4ZWMoZGlzcG9zaXRpb24pO1xyXG4gICAgICAgICAgaWYgKG1hdGNoZXMgIT0gbnVsbCAmJiBtYXRjaGVzWzFdKVxyXG4gICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoZXNbMV0ucmVwbGFjZSgvWydcIl0vZywgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0eXBlID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKTtcclxuICAgICAgICBsZXQgYmxvYiA9IG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge1xyXG4gICAgICAgICAgdHlwZTogdHlwZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAvLyBJRSB3b3JrYXJvdW5kIGZvciBcIkhUTUw3MDA3OiBPbmUgb3IgbW9yZSBibG9iIFVSTHMgd2VyZSByZXZva2VkIGJ5IGNsb3NpbmcgdGhlIGJsb2IgZm9yIHdoaWNoIHRoZXkgd2VyZSBjcmVhdGVkLiBUaGVzZSBVUkxzIHdpbGwgbm8gbG9uZ2VyIHJlc29sdmUgYXMgdGhlIGRhdGEgYmFja2luZyB0aGUgVVJMIGhhcyBiZWVuIGZyZWVkLlwiXHJcbiAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYmxvYiwgZmlsZW5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xyXG4gICAgICAgICAgbGV0IGRvd25sb2FkVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcbiAgICAgICAgICBpZiAoZmlsZW5hbWUpIHtcclxuICAgICAgICAgICAgLy8gdXNlIEhUTUw1IGFbZG93bmxvYWRdIGF0dHJpYnV0ZSB0byBzcGVjaWZ5IGZpbGVuYW1lXHJcbiAgICAgICAgICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICAgIC8vIHNhZmFyaSBkb2Vzbid0IHN1cHBvcnQgdGhpcyB5ZXRcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhLmRvd25sb2FkID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZG93bmxvYWRVcmw7XHJcbiAgICAgICAgICAgICAgcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhLmhyZWYgPSBkb3dubG9hZFVybDtcclxuICAgICAgICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgLy8gcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93Lm9wZW4gPSBkb3dubG9hZFVybDtcclxuICAgICAgICAgICAgLy8gcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGRvd25sb2FkVXJsKTtcclxuICAgICAgICAgIH0sIDEwMCk7IC8vIGNsZWFudXBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXFMaXN0W2ldLnNldFJlcXVlc3RIZWFkZXIoXHJcbiAgICAgIFwiQ29udGVudC10eXBlXCIsXHJcbiAgICAgIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcclxuICAgICk7XHJcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxyXG4gICAgICBjb25zb2xlLmxvZyhnZXRSZWFsUGF0aChDVVJSRU5UX1BBVEgpICsgXCIvXCIgKyBmaWxlTGlzdFtpXSk7XHJcbiAgICByZXFMaXN0W2ldLnNlbmQoXHJcbiAgICAgIHNlcmlhbGl6ZU9iamVjdCh7XHJcbiAgICAgICAgZmlsZW5hbWU6IGdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCkgKyBcIi9cIiArIGZpbGVMaXN0W2ldXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH07XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgX2xvb3AoaSk7XHJcbiAgfVxyXG4gICQoXCIjd2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRW5kIEZpbGVzIGFuZCBmRm9sZGVycyBtb2R1bGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiIsIi8qIVxyXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcclxuICpcclxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcjtcclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0XHRkZWZpbmUoZmFjdG9yeSk7XHJcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XHJcblx0fVxyXG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XHJcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xyXG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xyXG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcclxuXHRcdFx0cmV0dXJuIGFwaTtcclxuXHRcdH07XHJcblx0fVxyXG59KGZ1bmN0aW9uICgpIHtcclxuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xyXG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBXcml0ZVxyXG5cclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XHJcblx0XHRcdFx0XHRwYXRoOiAnLydcclxuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkgKiAxICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxyXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xyXG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSA/XHJcblx0XHRcdFx0XHRjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cclxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxyXG5cdFx0XHRcdFx0LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XHJcblxyXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcclxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcclxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxyXG5cdFx0XHRcdFx0Ly8gICAgIGNoYXJhY3RlcjpcclxuXHRcdFx0XHRcdC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXHJcblx0XHRcdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBSZWFkXHJcblxyXG5cdFx0XHR2YXIgamFyID0ge307XHJcblx0XHRcdHZhciBkZWNvZGUgPSBmdW5jdGlvbiAocykge1xyXG5cdFx0XHRcdHJldHVybiBzLnJlcGxhY2UoLyglWzAtOUEtWl17Mn0pKy9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XHJcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxyXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cdFx0XHR2YXIgaSA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xyXG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgbmFtZSA9IGRlY29kZShwYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRjb29raWUgPSAoY29udmVydGVyLnJlYWQgfHwgY29udmVydGVyKShjb29raWUsIG5hbWUpIHx8XHJcblx0XHRcdFx0XHRcdGRlY29kZShjb29raWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0amFyW25hbWVdID0gY29va2llO1xyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFwaS5zZXQgPSBhcGk7XHJcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xyXG5cdFx0fTtcclxuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoe1xyXG5cdFx0XHRcdGpzb246IHRydWVcclxuXHRcdFx0fSwga2V5KTtcclxuXHRcdH07XHJcblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xyXG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcclxuXHRcdFx0XHRleHBpcmVzOiAtMVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xyXG5cclxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcclxuXHJcblx0XHRyZXR1cm4gYXBpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xyXG59KSk7XHJcbiJdfQ==
