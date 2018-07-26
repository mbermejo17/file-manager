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

var _general = require("./general");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

////////////////////////////////////
// Files and Folder module
///////////////////////////////////

var RUNMODE = _jsCookie2.default.get("RunMode");
var REAL_ROOT_PATH = _jsCookie2.default.get("RootPath");

var htmlShareFile = "<div id=\"shareFileModal\">\n                        <div id=\"modal-header\">\n                          <h5>Share File</h5>\n                          <a class=\"modal_close\" id=\"sharedModalClose\" href=\"#hola\"></a>\n                        </div>\n                        <br>\n                        <div class=\"row\" id=\"\">\n                          <div class=\"input-field col s1 m1\">\n                          </div>\n                          <div class=\"input-field col s5\">\n                            \n                            <input id=\"destUserName\" type=\"email\" autocomplete=\"off\" pattern=\".+@globex.com\" required/>\n                            <label for=\"destUserName\">Send URL to</label>\n                          </div>\n                          <div class=\"input-field col s3 m3\">\n                              <input class=\"datepicker\" id=\"FileExpirateDate\" type=\"date\"/>\n                              <label for=\"FileExpirateDate\">Expiration Date</label>\n                          </div>\n                          <div class=\"input-field col s3 m3\">\n                          </div>\n                        </div>  \n                        <div class=\"row\"> \n                          <div class=\"input-field col s9 m9\">\n                          </div>\n                          <div class=\"input-field col s1 m1\">\n                            <button class=\"waves-effect waves-teal btn-flat btn2-unify right\" id=\"btn-ShareFileCancel\" type=\"submit\" name=\"action\">Cancel</button>\n                          </div>\n                          <div class=\"input-field col s1 m1\">  \n                            <button class=\"waves-effect waves-teal btn-flat btn2-unify left\" id=\"btn-ShareFileAccept\" type=\"submit\" name=\"action\">Send</button>\n                          </div>\n                        </div>    \n                      </div>";

var htmlUploadDownloadTemplate = "<ul class=\"preloader-file\" id=\"DownloadfileList\">\n    <li id=\"li0\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename0\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar0\"></div>\n                <div class=\"percent\" id=\"percent0\"></div>\n                <a class=\"modal_close\" id=\"abort0\" href=\"#\"></a>\n            </div>\n        </div>\n    </li>\n    <li id=\"li1\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename1\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar1\"></div>\n                <div class=\"percent\" id=\"percent1\"></div>\n                <a class=\"modal_close\" id=\"abort1\" href=\"#\"></a>\n            </div>\n        </div>\n    </li>\n    <li id=\"li2\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename2\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar2\"></div>\n                <div class=\"percent\" id=\"percent2\"></div>\n                <a class=\"modal_close\" id=\"abort2\" href=\"#\"></a>\n            </div>   \n        </div>\n    </li>\n    <li id=\"li3\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename3\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar3\"></div>\n                <div class=\"percent\" id=\"percent3\"></div>\n                <a class=\"modal_close\" id=\"abort3\" href=\"#\"></a>\n            </div>   \n        </div>\n    </li>\n    <li id=\"li4\">\n        <div class=\"li-content\">\n            <div class=\"li-filename\" id=\"li-filename4\"></div>\n            <div class=\"progress-content\">\n                <div class=\"progress-bar\" id=\"progress-bar4\"></div>\n                <div class=\"percent\" id=\"percent4\"></div>\n                <a class=\"modal_close\" id=\"abort4\" href=\"#\"></a>\n            </div>\n        </div>\n    </li>\n</ul>";

var sendEmail = function sendEmail(toEmail, fromEmail, subject, body_message) {
  var mailto_link = "mailto:" + toEmail + "?subject=" + subject + "&body=" + body_message;
  var win = window.open(mailto_link, "emailWindow");
  if (win && window.open && !window.closed) window.close();
};

var validateSize = function validateSize(f) {
  return true;
};
function shareFile() {
  var searchUserModalContent = document.getElementById("searchUserModalContent");
  var AddUserModalContent = document.getElementById("AddUserModalContent");
  var containerOverlay = document.querySelector(".container-overlay");
  var validations = {
    email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Please enter a valid email address']
  };
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

  document.getElementById('sharedModalClose').addEventListener('click', function (e) {
    e.preventDefault();
    searchUserModalContent.style.display = "none";
    containerOverlay.style.display = "none";
  });

  document.getElementById("btn-ShareFileAccept").addEventListener("click", function (e) {
    e.preventDefault();
    if (document.getElementById("destUserName").value !== '') {
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
          document.getElementById("refresh").click();
        }
      }).catch(function (e) {
        showToast("Error al compartir archivo " + data.fileName + ".<br>Err:" + e, "err");
        if (RUNMODE === "DEBUG") console.log(e);
      });
    }
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
    var realpath = (0, _general.getRealPath)(CURRENT_PATH);
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
      path: (0, _general.getRealPath)(CURRENT_PATH),
      folderName: folderName
    }),
    timeout: 10000
  }).then(function (r) {
    return r.json();
  }).then(function (data) {
    if (RUNMODE === "DEBUG") console.log(data);
    if (data.status == "OK") {
      $("#modal").hide();
      $("#lean-overlay").hide();
      $("#refresh").trigger("click");
      showToast("Creada nueva carpeta " + data.data.folderName, "success");
    } else {
      showToast("Error al crear la carpeta " + folderName + " <br>Error: " + data.message, "err");
    }
  }).catch(function (err) {
    showToast("Error al crear la carpeta " + folderName + " <br>Error: error no identificado", "err");
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
        path: (0, _general.getRealPath)(path),
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
        path: (0, _general.getRealPath)(path),
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
    if (RUNMODE === "DEBUG") console.log((0, _general.getRealPath)(CURRENT_PATH) + "/" + fileList[i]);
    reqList[i].send((0, _general.serializeObject)({
      filename: (0, _general.getRealPath)(CURRENT_PATH) + "/" + fileList[i]
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

},{"../vendor/js-cookie":3,"./general":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRealPath = getRealPath;
exports.serializeObject = serializeObject;

var _jsCookie = require("../vendor/js-cookie");

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRealPath(p) {
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
}

function serializeObject(dataObject) {
  var stringResult = "",
      value = void 0;
  for (var key in dataObject) {
    if (RUNMODE === "DEBUG") console.log(dataObject[key], key);
    value = dataObject[key];
    if (stringResult !== "") {
      stringResult += "&" + key + "=" + value;
    } else {
      stringResult += key + "=" + value;
    }
  }
  return stringResult;
}

},{"../vendor/js-cookie":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbGVNYW5hZ2VyLmpzIiwianMvbW9kdWxlcy9nZW5lcmFsLmpzIiwianMvdmVuZG9yL2pzLWNvb2tpZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDMEdnQixTLEdBQUEsUztRQXlFQSxjLEdBQUEsYztRQXdEQSxNLEdBQUEsTTtRQTJKQSxTLEdBQUEsUztRQStCQSxVLEdBQUEsVTtRQTJDQSxZLEdBQUEsWTtRQTBDQSxRLEdBQUEsUTs7QUExZmhCOzs7O0FBQ0E7Ozs7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxVQUFVLG1CQUFRLEdBQVIsQ0FBWSxTQUFaLENBQWQ7QUFDQSxJQUFJLGlCQUFpQixtQkFBUSxHQUFSLENBQVksVUFBWixDQUFyQjs7QUFHQSxJQUFJLG02REFBSjs7QUFpQ0EsSUFBSSw4cUVBQUo7O0FBcURBLElBQU0sWUFBWSxTQUFaLFNBQVksQ0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixPQUFyQixFQUE4QixZQUE5QixFQUErQztBQUMvRCxNQUFJLGNBQ0YsWUFBWSxPQUFaLEdBQXNCLFdBQXRCLEdBQW9DLE9BQXBDLEdBQThDLFFBQTlDLEdBQXlELFlBRDNEO0FBRUEsTUFBSSxNQUFNLE9BQU8sSUFBUCxDQUFZLFdBQVosRUFBeUIsYUFBekIsQ0FBVjtBQUNBLE1BQUksT0FBTyxPQUFPLElBQWQsSUFBc0IsQ0FBQyxPQUFPLE1BQWxDLEVBQTBDLE9BQU8sS0FBUDtBQUMzQyxDQUxEOztBQU9BLElBQUksZUFBZSxTQUFmLFlBQWUsSUFBSztBQUN0QixTQUFPLElBQVA7QUFDRCxDQUZEO0FBR08sU0FBUyxTQUFULEdBQXFCO0FBQzFCLE1BQUkseUJBQXlCLFNBQVMsY0FBVCxDQUMzQix3QkFEMkIsQ0FBN0I7QUFHQSxNQUFJLHNCQUFzQixTQUFTLGNBQVQsQ0FBd0IscUJBQXhCLENBQTFCO0FBQ0EsTUFBSSxtQkFB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VUFBVSxJQUFWLElBQWtCLFNBQW5CLEVBQThCLE1BQTlCLEVBQXNDLElBQXRDLEtBQ1IsT0FBTyxNQUFQLENBREQ7O0FBR0EsU0FBSSxLQUFLLElBQVQsRUFBZTtBQUNkLFVBQUk7QUFDSCxnQkFBUyxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQVQ7QUFDQSxPQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNkOztBQUVELFNBQUksSUFBSixJQUFZLE1BQVo7O0FBRUEsU0FBSSxRQUFRLElBQVosRUFBa0I7QUFDakI7QUFDQTtBQUNELEtBaEJELENBZ0JFLE9BQU8sQ0FBUCxFQUFVLENBQUU7QUFDZDs7QUFFRCxVQUFPLE1BQU0sSUFBSSxHQUFKLENBQU4sR0FBaUIsR0FBeEI7QUFDQTs7QUFFRCxNQUFJLEdBQUosR0FBVSxHQUFWO0FBQ0EsTUFBSSxHQUFKLEdBQVUsVUFBVSxHQUFWLEVBQWU7QUFDeEIsVUFBTyxJQUFJLElBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUFQO0FBQ0EsR0FGRDtBQUdBLE1BQUksT0FBSixHQUFjLFVBQVUsR0FBVixFQUFlO0FBQzVCLFVBQU8sSUFBSSxJQUFKLENBQVM7QUFDZixVQUFNO0FBRFMsSUFBVCxFQUVKLEdBRkksQ0FBUDtBQUdBLEdBSkQ7QUFLQSxNQUFJLE1BQUosR0FBYSxVQUFVLEdBQVYsRUFBZSxVQUFmLEVBQTJCO0FBQ3ZDLE9BQUksR0FBSixFQUFTLEVBQVQsRUFBYSxPQUFPLFVBQVAsRUFBbUI7QUFDL0IsYUFBUyxDQUFDO0FBRHFCLElBQW5CLENBQWI7QUFHQSxHQUpEOztBQU1BLE1BQUksUUFBSixHQUFlLEVBQWY7O0FBRUEsTUFBSSxhQUFKLEdBQW9CLElBQXBCOztBQUVBLFNBQU8sR0FBUDtBQUNBOztBQUVELFFBQU8sS0FBSyxZQUFZLENBQUUsQ0FBbkIsQ0FBUDtBQUNBLENBMUpDLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ29va2llcyBmcm9tIFwiLi4vdmVuZG9yL2pzLWNvb2tpZVwiO1xuaW1wb3J0IHtnZXRSZWFsUGF0aCwgc2VyaWFsaXplT2JqZWN0fSBmcm9tIFwiLi9nZW5lcmFsXCI7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZpbGVzIGFuZCBGb2xkZXIgbW9kdWxlXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5sZXQgUlVOTU9ERSA9IENvb2tpZXMuZ2V0KFwiUnVuTW9kZVwiKTtcbmxldCBSRUFMX1JPT1RfUEFUSCA9IENvb2tpZXMuZ2V0KFwiUm9vdFBhdGhcIik7XG5cblxubGV0IGh0bWxTaGFyZUZpbGUgPSBgPGRpdiBpZD1cInNoYXJlRmlsZU1vZGFsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT5TaGFyZSBGaWxlPC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwic2hhcmVkTW9kYWxDbG9zZVwiIGhyZWY9XCIjaG9sYVwiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIGlkPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczEgbTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJkZXN0VXNlck5hbWVcIiB0eXBlPVwiZW1haWxcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBwYXR0ZXJuPVwiLitAZ2xvYmV4LmNvbVwiIHJlcXVpcmVkLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZGVzdFVzZXJOYW1lXCI+U2VuZCBVUkwgdG88L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMyBtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZGF0ZXBpY2tlclwiIGlkPVwiRmlsZUV4cGlyYXRlRGF0ZVwiIHR5cGU9XCJkYXRlXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIkZpbGVFeHBpcmF0ZURhdGVcIj5FeHBpcmF0aW9uIERhdGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMyBtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+IFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHM5IG05XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxIG0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIndhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnkgcmlnaHRcIiBpZD1cImJ0bi1TaGFyZUZpbGVDYW5jZWxcIiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImFjdGlvblwiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMSBtMVwiPiAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIndhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnkgbGVmdFwiIGlkPVwiYnRuLVNoYXJlRmlsZUFjY2VwdFwiIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYWN0aW9uXCI+U2VuZDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICBcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuXG5sZXQgaHRtbFVwbG9hZERvd25sb2FkVGVtcGxhdGUgPSBgPHVsIGNsYXNzPVwicHJlbG9hZGVyLWZpbGVcIiBpZD1cIkRvd25sb2FkZmlsZUxpc3RcIj5cbiAgICA8bGkgaWQ9XCJsaTBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUwXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDBcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2xpPlxuICAgIDxsaSBpZD1cImxpMVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTFcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0MVwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvbGk+XG4gICAgPGxpIGlkPVwibGkyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMlwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQyXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICA8L2Rpdj4gICBcbiAgICAgICAgPC9kaXY+XG4gICAgPC9saT5cbiAgICA8bGkgaWQ9XCJsaTNcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUzXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDNcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgIDwvZGl2PiAgIFxuICAgICAgICA8L2Rpdj5cbiAgICA8L2xpPlxuICAgIDxsaSBpZD1cImxpNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTRcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyNFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50NFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0NFwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvbGk+XG48L3VsPmA7XG5cbmNvbnN0IHNlbmRFbWFpbCA9ICh0b0VtYWlsLCBmcm9tRW1haWwsIHN1YmplY3QsIGJvZHlfbWVzc2FnZSkgPT4ge1xuICBsZXQgbWFpbHRvX2xpbmsgPVxuICAgIFwibWFpbHRvOlwiICsgdG9FbWFpbCArIFwiP3N1YmplY3Q9XCIgKyBzdWJqZWN0ICsgXCImYm9keT1cIiArIGJvZHlfbWVzc2FnZTtcbiAgbGV0IHdpbiA9IHdpbmRvdy5vcGVuKG1haWx0b19saW5rLCBcImVtYWlsV2luZG93XCIpO1xuICBpZiAod2luICYmIHdpbmRvdy5vcGVuICYmICF3aW5kb3cuY2xvc2VkKSB3aW5kb3cuY2xvc2UoKTtcbn07XG5cbmxldCB2YWxpZGF0ZVNpemUgPSBmID0+IHtcbiAgcmV0dXJuIHRydWU7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlRmlsZSgpIHtcbiAgbGV0IHNlYXJjaFVzZXJNb2RhbENvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICBcInNlYXJjaFVzZXJNb2RhbENvbnRlbnRcIlxuICApO1xuICBsZXQgQWRkVXNlck1vZGFsQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiQWRkVXNlck1vZGFsQ29udGVudFwiKTtcbiAgbGV0IGNvbnRhaW5lck92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lci1vdmVybGF5XCIpO1xuICBsZXQgdmFsaWRhdGlvbnMgPXtcbiAgICBlbWFpbDogWy9eKFthLXpBLVowLTlfListXSkrXFxAKChbYS16QS1aMC05LV0pK1xcLikrKFthLXpBLVowLTldezIsNH0pKyQvLCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcyddXG4gIH07XG4gIC8qKi9cbiAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5pbm5lckhUTUwgPSBodG1sU2hhcmVGaWxlO1xuICBBZGRVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBjb250YWluZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIGRvY3VtZW50XG4gICAgLmdldEVsZW1lbnRCeUlkKFwiYnRuLVNoYXJlRmlsZUNhbmNlbFwiKVxuICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBzZWFyY2hVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH0pO1xuICAgIFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGFyZWRNb2RhbENsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+e1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBjb250YWluZXJPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9KTtcblxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChcImJ0bi1TaGFyZUZpbGVBY2NlcHRcIilcbiAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVzdFVzZXJOYW1lXCIpLnZhbHVlICE9PSAnJykge1xuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcbiAgICAgICAgY29uc29sZS5sb2coZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZXN0VXNlck5hbWVcIikudmFsdWUpO1xuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcbiAgICAgICAgY29uc29sZS5sb2coZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJGaWxlRXhwaXJhdGVEYXRlXCIpLnZhbHVlKTtcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICBmaWxlTmFtZTogYVNlbGVjdGVkRmlsZXNbMF0sXG4gICAgICAgIGZpbGVTaXplOiBudWxsLFxuICAgICAgICBwYXRoOiBDVVJSRU5UX1BBVEgsXG4gICAgICAgIHVzZXJOYW1lOiBVc2VyTmFtZSxcbiAgICAgICAgZGVzdFVzZXJOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc3RVc2VyTmFtZVwiKS52YWx1ZSxcbiAgICAgICAgZXhwaXJhdGlvbkRhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiRmlsZUV4cGlyYXRlRGF0ZVwiKS52YWx1ZVxuICAgICAgfTtcbiAgICAgIGV4ZWNGZXRjaChcIi9maWxlcy9zaGFyZVwiLCBcIlBPU1RcIiwgZGF0YSlcbiAgICAgICAgLnRoZW4oZCA9PiB7XG4gICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZCk7XG4gICAgICAgICAgaWYgKGQuc3RhdHVzID09PSBcIk9LXCIpIHtcbiAgICAgICAgICAgIHNlYXJjaFVzZXJNb2RhbENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBzZW5kRW1haWwoXG4gICAgICAgICAgICAgIGQuZGF0YS5EZXN0VXNlcixcbiAgICAgICAgICAgICAgXCJtYmVybWVqbzE3QGdtYWlsLmNvbVwiLFxuICAgICAgICAgICAgICBcIlVSTCBwYXJhIGRlc2NhcmdhIGRlIGFyY2hpdm9cIixcbiAgICAgICAgICAgICAgYERlc2NhcmdhIGRlIGFyY2hpdm8gaHR0cHM6Ly8xOTQuMjI0LjE5NC4xMzQvZmlsZXMvc2hhcmUvJHtcbiAgICAgICAgICAgICAgICBkLmRhdGEuVXJsQ29kZVxuICAgICAgICAgICAgICB9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVmcmVzaFwiKS5jbGljaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgIHNob3dUb2FzdChcbiAgICAgICAgICAgIFwiRXJyb3IgYWwgY29tcGFydGlyIGFyY2hpdm8gXCIgKyBkYXRhLmZpbGVOYW1lICsgXCIuPGJyPkVycjpcIiArIGUsXG4gICAgICAgICAgICBcImVyclwiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZCgpIHtcbiAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcbiAgICBjb25zb2xlLmxvZyhcImFTZWxlY3RlZEZvbGRlcnM6IFwiLCBhU2VsZWN0ZWRGb2xkZXJzLmxlbmd0aCk7XG4gIGlmIChhU2VsZWN0ZWRGb2xkZXJzLmxlbmd0aCA+IDApIHtcbiAgICBzaG93RGlhbG9nWWVzTm8oXG4gICAgICBcIkRlbGV0ZSBmb2xkZXNcIixcbiAgICAgIFwiRGVsZXRlIHNlbGVjdGVkIGZvbGRlcnM/XCIsXG4gICAgICB5ID0+IHtcbiAgICAgICAgJC53aGVuKGRlbGV0ZUZvbGRlcihDVVJSRU5UX1BBVEgpKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgaWYgKGFTZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNob3dEaWFsb2dZZXNObyhcbiAgICAgICAgICAgICAgXCJEZWxldGUgRmlsZXNcIixcbiAgICAgICAgICAgICAgXCJEZWxldGUgc2VsZWN0ZWQgZmlsZXM/XCIsXG4gICAgICAgICAgICAgIHkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZUZpbGUoQ1VSUkVOVF9QQVRIKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGUgRmlsZXMgQ2FuY2VsZWRcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVmcmVzaFwiKS5jbGljaygpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBuID0+IHtcbiAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGUgRm9sZGVyIENhbmNlbGVkXCIpO1xuICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNob3dEaWFsb2dZZXNObyhcbiAgICAgICAgICAgIFwiRGVsZXRlIEZpbGVzXCIsXG4gICAgICAgICAgICBcIkRlbGV0ZSBzZWxlY3RlZCBmaWxlcz9cIixcbiAgICAgICAgICAgIHkgPT4ge1xuICAgICAgICAgICAgICBkZWxldGVGaWxlKENVUlJFTlRfUEFUSCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbiA9PiB7XG4gICAgICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiRGVsZXRlIEZpbGVzIENhbmNlbGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGlmIChhU2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBzaG93RGlhbG9nWWVzTm8oXG4gICAgICAgIFwiRGVsZXRlIEZpbGVzXCIsXG4gICAgICAgIFwiRGVsZXRlIHNlbGVjdGVkIGZpbGVzP1wiLFxuICAgICAgICB5ID0+IHtcbiAgICAgICAgICBkZWxldGVGaWxlKENVUlJFTlRfUEFUSCk7XG4gICAgICAgIH0sXG4gICAgICAgIG4gPT4ge1xuICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiRGVsZXRlIEZpbGVzIENhbmNlbGVkXCIpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkKFRva2VuKSB7XG4gIGxldCB3ID0gMzI7XG4gIGxldCBoID0gNDQwO1xuICBsZXQgYUxpc3RIYW5kbGVyID0gW107XG4gIGxldCBoYW5kbGVyQ291bnRlciA9IDA7XG4gIGxldCBNb2RhbFRpdGxlID0gXCJTdWJpZGEgZGUgYXJjaGl2b3NcIjtcbiAgbGV0IE1vZGFsQ29udGVudCA9IGA8bGFiZWwgY2xhc3M9XCJmaWxlLWlucHV0IHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIj5TZWxlY3QgZmlsZXM8aW5wdXQgaWQ9XCJ1cGxvYWQtaW5wdXRcIiB0eXBlPVwiZmlsZVwiIG5hbWU9XCJ1cGxvYWRzW11cIiBtdWx0aXBsZT1cIm11bHRpcGxlXCIgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2VcIj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJzRmlsZXNcIj5OaW5ndW4gYXJjaGl2byBzZWxlY2Npb25hZG88L3NwYW4+YDtcbiAgTW9kYWxDb250ZW50ICs9IGh0bWxVcGxvYWREb3dubG9hZFRlbXBsYXRlO1xuICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cIm1vZGFsQ2xvc2VcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS08aW5wdXQgdHlwZT1cInRleHRcIiBoaWRkZW4gaWQ9XCJkZXN0UGF0aFwiIG5hbWU9XCJkZXN0UGF0aFwiIHZhbHVlPVwiXCIvPi0tPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2FuY2VsQWxsXCIgaHJlZj1cIiMhXCI+Q2FuY2VsIHVwbG9hZHM8L2E+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNsb3NlVXBsb2FkXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcblxuICAkKFwiI3VwbG9hZFwiKVxuICAgIC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpXG4gICAgLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG5cbiAgZnVuY3Rpb24gZm5VcGxvYWRGaWxlKGZvcm1EYXRhLCBuRmlsZSwgZmlsZU5hbWUpIHtcbiAgICAkKFwiI2xpXCIgKyBuRmlsZSkuc2hvdygpO1xuICAgICQoXCIjbGktZmlsZW5hbWVcIiArIG5GaWxlKS5zaG93KCk7XG4gICAgJChcIiNsaS1maWxlbmFtZVwiICsgbkZpbGUpLmh0bWwoZmlsZU5hbWUpO1xuICAgIGxldCByZWFscGF0aCA9IGdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCk7XG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJVcGxvYWQ6Q1VSUkVOVF9QQVRIIFwiICsgQ1VSUkVOVF9QQVRIKTtcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxuICAgICAgY29uc29sZS5sb2coXCJVcGxvYWQ6UkVBTF9ST09UX1BBVEggXCIgKyBSRUFMX1JPT1RfUEFUSCk7XG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJVcGxvYWQ6cmVhbFBhdGggXCIgKyByZWFscGF0aCk7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogXCIvZmlsZXMvdXBsb2FkP2Rlc3RQYXRoPVwiICsgcmVhbHBhdGgsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgdGltZW91dDogMjkwMDAwLFxuICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhock9iaikge1xuICAgICAgICB4aHJPYmouc2V0UmVxdWVzdEhlYWRlcihcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBUb2tlbik7XG4gICAgICAgIHhock9iai5zZXRSZXF1ZXN0SGVhZGVyKFwiZGVzdFBhdGhcIiwgcmVhbHBhdGgpO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXG4gICAgICAgICAgY29uc29sZS5sb2coZmlsZU5hbWUgKyBcInVwbG9hZCBzdWNjZXNzZnVsIVxcblwiICsgZGF0YSk7XG4gICAgICAgIHNob3dUb2FzdChmaWxlTmFtZSArIFwiIHVwbG9hZGVkIHN1Y2Vzc2Z1bGx5XCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgJChcIiNhYm9ydFwiICsgbkZpbGUpLmhpZGUoKTtcbiAgICAgICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICAgICAgaGFuZGxlckNvdW50ZXIgPSBoYW5kbGVyQ291bnRlciAtIDE7XG4gICAgICAgIGlmIChoYW5kbGVyQ291bnRlciA9PSAwKSB7XG4gICAgICAgICAgJChcIiNidG5DYW5jZWxBbGxcIilcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHhocjogZnVuY3Rpb24gKCkge1xuICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIGxldCBwZXJjZW50Q29tcGxldGUgPSAwO1xuICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwicHJvZ3Jlc3NcIixcbiAgICAgICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcbiAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwKTtcbiAgICAgICAgICAgICAgJChcIiNwZXJjZW50XCIgKyBuRmlsZSkudGV4dChwZXJjZW50Q29tcGxldGUgKyBcIiVcIik7XG4gICAgICAgICAgICAgICQoXCIjcHJvZ3Jlc3MtYmFyXCIgKyBuRmlsZSkud2lkdGgocGVyY2VudENvbXBsZXRlICsgXCIlXCIpO1xuICAgICAgICAgICAgICAvKiBpZiAocGVyY2VudENvbXBsZXRlID09PSAxMDApIHtcbiAgICAgICAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBhTGlzdEhhbmRsZXJbbkZpbGVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgJChcIiNtb2RhbFwiKVxuICAgIC5odG1sKGh0bWxDb250ZW50KVxuICAgIC5jc3MoXCJ3aWR0aDogXCIgKyB3ICsgXCIlO2hlaWdodDogXCIgKyBoICsgXCJweDt0ZXh0LWFsaWduOiBjZW50ZXI7XCIpO1xuICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XG4gICQoXCIubW9kYWwtY29udGFpbmVyXCIpLmNzcyhcIndpZHRoOiA0MCUgIWltcG9ydGFudFwiKTtcbiAgJChcIi5maWxlLWlucHV0XCIpLnNob3coKTtcbiAgJChcIiNtb2RhbFwiKS5zaG93KCk7XG4gICQoXCIjbGVhbi1vdmVybGF5XCIpLnNob3coKTtcbiAgJChcIiNidG5DbG9zZVVwbG9hZFwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgICQoXCIjdXBsb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XG4gICAgJChcIiNsZWFuLW92ZXJsYXlcIikuaGlkZSgpO1xuICB9KTtcbiAgJChcIiNtb2RhbENsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgJChcIiN1cGxvYWRcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAkKFwiI21vZGFsXCIpLmhpZGUoKTtcbiAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gIH0pO1xuICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAkKFwiLm1vZGFsX2Nsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGUpO1xuICAgIGxldCBuID0gcGFyc2VJbnQoZS50YXJnZXQuaWQuc2xpY2UoLTEpKTtcbiAgICBhTGlzdEhhbmRsZXJbbl0uYWJvcnQoKTtcbiAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50XCIgKyBuKTtcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgbik7XG4gICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gXCJDYW5jZWxlZCBieSB1c2VyXCI7XG4gICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICQoZS50YXJnZXQpLmhpZGUoKTtcbiAgfSk7XG4gICQoXCIjYnRuQ2FuY2VsQWxsXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCA0OyB4KyspIHtcbiAgICAgIGFMaXN0SGFuZGxlclt4XS5hYm9ydCgpO1xuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgeCk7XG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgeCk7XG4gICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIkNhbmNlbGVkIGJ5IHVzZXJcIjtcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICB9XG4gICAgJChcIiNidG5DYW5jZWxBbGxcIikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgfSk7XG4gICQoXCIjdXBsb2FkLWlucHV0XCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgbGV0IGZpbGVzID0gJChcIiN1cGxvYWQtaW5wdXRcIikuZ2V0KDApLmZpbGVzO1xuICAgIGhhbmRsZXJDb3VudGVyID0gZmlsZXMubGVuZ3RoO1xuICAgIGZpbGVzLmxlbmd0aCA+IDAgP1xuICAgICAgJChcIiNzRmlsZXNcIikuaHRtbChmaWxlcy5sZW5ndGggKyBcIiBhcmNoaXZvcyBzZWxlY2Npb25hZG9zLlwiKSA6XG4gICAgICAkKFwiI3NGaWxlc1wiKS5odG1sKGZpbGVzWzBdKTtcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhmaWxlcy5sZW5ndGgpO1xuICAgICQoXCIuZmlsZS1pbnB1dFwiKS5oaWRlKCk7XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDAgJiYgZmlsZXMubGVuZ3RoIDw9IDUpIHtcbiAgICAgICQoXCIjYnRuQ2xvc2VVcGxvYWRcIilcbiAgICAgICAgLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIilcbiAgICAgICAgLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBmaWxlID0gZmlsZXNbaV07XG4gICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICAvLyBhZGQgdGhlIGZpbGVzIHRvIGZvcm1EYXRhIG9iamVjdCBmb3IgdGhlIGRhdGEgcGF5bG9hZFxuXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVwbG9hZHNbXVwiLCBmaWxlLCBmaWxlLm5hbWUpO1xuICAgICAgICBmblVwbG9hZEZpbGUoZm9ybURhdGEsIGksIGZpbGUubmFtZSk7XG4gICAgICB9XG4gICAgICAkKFwiI2J0bkNsb3NlVXBsb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dUb2FzdChcIk5vIHNlIHB1ZWRlbiBzdWJpciBtw6FzIGRlIDUgYXJjaGl2b3MgYSBsYSB2ZXpcIiwgXCJlcnJcIik7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld0ZvbGRlcihmb2xkZXJOYW1lKSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBUb2tlbik7XG4gIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgZmV0Y2goXCIvZmlsZXMvbmV3Zm9sZGVyXCIsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBwYXRoOiBnZXRSZWFsUGF0aChDVVJSRU5UX1BBVEgpLFxuICAgICAgICBmb2xkZXJOYW1lOiBmb2xkZXJOYW1lXG4gICAgICB9KSxcbiAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgfSlcbiAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gXCJPS1wiKSB7XG4gICAgICAgICQoXCIjbW9kYWxcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gICAgICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgIHNob3dUb2FzdChcIkNyZWFkYSBudWV2YSBjYXJwZXRhIFwiICsgZGF0YS5kYXRhLmZvbGRlck5hbWUsIFwic3VjY2Vzc1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dUb2FzdChcIkVycm9yIGFsIGNyZWFyIGxhIGNhcnBldGEgXCIgKyBmb2xkZXJOYW1lICsgXCIgPGJyPkVycm9yOiBcIiArIGRhdGEubWVzc2FnZSwgXCJlcnJcIik7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIHNob3dUb2FzdChcIkVycm9yIGFsIGNyZWFyIGxhIGNhcnBldGEgXCIgKyBmb2xkZXJOYW1lICsgXCIgPGJyPkVycm9yOiBlcnJvciBubyBpZGVudGlmaWNhZG9cIiwgXCJlcnJcIik7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRmlsZShwYXRoKSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICBsZXQgeCA9IDA7XG4gIGxldCBhRiA9IGFTZWxlY3RlZEZpbGVzLnNsaWNlKCk7XG4gIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGFGKTtcbiAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgVG9rZW4pO1xuICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICQoXCIjd2FpdGluZ1wiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgZm9yICh4ID0gMDsgeCA8IGFGLmxlbmd0aDsgeCsrKSB7XG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGluZyBmaWxlIFwiICsgYUZbeF0gKyBcIiAuLi5cIik7XG4gICAgZmV0Y2goXCIvZmlsZXMvZGVsZXRlXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHBhdGg6IGdldFJlYWxQYXRoKHBhdGgpLFxuICAgICAgICAgIGZpbGVOYW1lOiBhRlt4XVxuICAgICAgICB9KSxcbiAgICAgICAgdGltZW91dDogNzIwMDAwXG4gICAgICB9KVxuICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gXCJPS1wiKSB7XG4gICAgICAgICAgYVNlbGVjdGVkRmlsZXMuc2hpZnQoKTtcbiAgICAgICAgICAkKFwiLnRvYXN0XCIpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJzdWNjZXNzXCIpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIHNob3dUb2FzdChcIkFyY2hpdm8gXCIgKyBkYXRhLmRhdGEuZmlsZU5hbWUgKyBcIiBib3JyYWRvXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAkKFwiI3JlZnJlc2hcIikudHJpZ2dlcihcImNsaWNrXCIpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICQoXCIudG9hc3RcIilcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJlcnJcIilcbiAgICAgICAgICAuYWRkQ2xhc3MoXCJlcnJcIik7XG4gICAgICAgIHNob3dUb2FzdChlcnIsIFwiZXJyXCIpO1xuICAgICAgfSk7XG4gIH1cbiAgJChcIiN3YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRm9sZGVyKHBhdGgpIHtcbiAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gIGxldCB4ID0gMDtcbiAgbGV0IGFGID0gYVNlbGVjdGVkRm9sZGVycy5zbGljZSgpO1xuICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhhRik7XG4gIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIFRva2VuKTtcbiAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAkKFwiI3dhaXRpbmdcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gIGZvciAoeCA9IDA7IHggPCBhRi5sZW5ndGg7IHgrKykge1xuICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiRGVsZXRpbmcgZm9sZGVyIFwiICsgYUZbeF0gKyBcIiAuLi5cIik7XG4gICAgZmV0Y2goXCIvZmlsZXMvZGVsZXRlXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHBhdGg6IGdldFJlYWxQYXRoKHBhdGgpLFxuICAgICAgICAgIGZpbGVOYW1lOiBhRlt4XVxuICAgICAgICB9KSxcbiAgICAgICAgdGltZW91dDogNzIwMDAwXG4gICAgICB9KVxuICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gXCJPS1wiKSB7XG4gICAgICAgICAgJChcIi50b2FzdFwiKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwic3VjY2Vzc1wiKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICBzaG93VG9hc3QoXCJDYXJwZXRhIFwiICsgZGF0YS5kYXRhLmZpbGVOYW1lICsgXCIgYm9ycmFkYVwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5zaGlmdCgpO1xuICAgICAgICAgICQoXCIjd2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICB9KTtcbiAgfVxuICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG59XG5cbi8vVE9ETzogT3B0aW1pemFyIHJlbmRlcml6YWRvIGRlIGVsZW1lbnRvcyBsaVxuLy9pbmNvcnBvcmFuZG8gZWwgY29udGVuaWRvIGVuIGVsIGJ1Y2xlIF9sb29wXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWQoZmlsZUxpc3QsIHRleHQpIHtcbiAgbGV0IHJlcUxpc3QgPSBbXSxcbiAgICBoYW5kbGVyQ291bnQgPSAwLFxuICAgIHJlc3BvbnNlVGltZW91dCA9IFtdO1xuICBsZXQgdyA9IDMyO1xuICBsZXQgaCA9IDQ0MDtcbiAgbGV0IE1vZGFsVGl0bGUgPSBcIkRlc2NhcmdhIGRlIGFyY2hpdm9zIHNlbGVjY2lvbmFkb3NcIjtcbiAgbGV0IE1vZGFsQ29udGVudCA9IGh0bWxVcGxvYWREb3dubG9hZFRlbXBsYXRlO1xuICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cIm1vZGFsQ2xvc2VcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cD4ke01vZGFsQ29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DYW5jZWxBbGxcIiBocmVmPVwiIyFcIj5DYW5jZWwgZG93bmxvYWRzPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DbG9zZURvd25sb2FkXCIgaHJlZj1cIiMhXCI+Q2VycmFyPC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICQoXCIjbW9kYWxcIilcbiAgICAuaHRtbChodG1sQ29udGVudClcbiAgICAuY3NzKFwid2lkdGg6IFwiICsgdyArIFwiJTtoZWlnaHQ6IFwiICsgaCArIFwicHg7dGV4dC1hbGlnbjogY2VudGVyO1wiKTtcbiAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xuICAkKFwiLm1vZGFsXCIpLmNzcyhcIndpZHRoOiA0MCUgIWltcG9ydGFudFwiKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb2RhbFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xlYW4tb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG5cbiAgJChcIiNkb3dubG9hZFwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAkKFwiI2J0bkNsb3NlRG93bmxvYWRcIikub24oXCJjbGlja1wiLCBlID0+IHtcbiAgICAkKFwiI2Rvd25sb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XG4gICAgJChcIiNsZWFuLW92ZXJsYXlcIikuaGlkZSgpO1xuICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgYVNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgfSk7XG4gICQoXCIjbW9kYWxDbG9zZVwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgICQoXCIjZG93bmxvYWRcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAkKFwiI21vZGFsXCIpLmhpZGUoKTtcbiAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICBhU2VsZWN0ZWRGaWxlcyA9IFtdO1xuICB9KTtcbiAgJChcIiN3YWl0aW5nXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgNDsgeCsrKSB7XG4gICAgICByZXFMaXN0W3hdLmFib3J0KCk7XG4gICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50XCIgKyB4KTtcbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyB4KTtcbiAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IFwiQ2FuY2VsZWQgYnkgdXNlclwiO1xuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgIH1cbiAgICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICB9KTtcbiAgJChcIi5tb2RhbF9jbG9zZVwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgbiA9IHBhcnNlSW50KGUudGFyZ2V0LmlkLnNsaWNlKC0xKSk7XG4gICAgcmVxTGlzdFtuXS5hYm9ydCgpO1xuICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlcmNlbnRcIiArIG4pO1xuICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyBuKTtcbiAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIkNhbmNlbGVkIGJ5IHVzZXJcIjtcbiAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gIH0pO1xuXG4gICQoXCIjYnRuQ2FuY2VsQWxsXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gIGxldCBfbG9vcCA9IGkgPT4ge1xuICAgIGxldCBmTmFtZSA9IGZpbGVMaXN0W2ldO1xuICAgIGxldCBsaU51bWJlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGlcIiArIGkpO1xuICAgIGxldCBsaUZpbGVuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsaS1maWxlbmFtZVwiICsgaSk7XG4gICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9ncmVzcy1iYXJcIiArIGkpO1xuICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlcmNlbnRcIiArIGkpO1xuICAgIHJlc3BvbnNlVGltZW91dFtpXSA9IGZhbHNlO1xuICAgIGZOYW1lID0gZk5hbWVcbiAgICAgIC5zcGxpdChcIlxcXFxcIilcbiAgICAgIC5wb3AoKVxuICAgICAgLnNwbGl0KFwiL1wiKVxuICAgICAgLnBvcCgpO1xuICAgIHJlcUxpc3RbaV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXFMaXN0W2ldLm9wZW4oXCJQT1NUXCIsIFwiL2ZpbGVzL2Rvd25sb2FkXCIsIHRydWUpO1xuICAgIHJlcUxpc3RbaV0ucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgIGxpTnVtYmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgbGlGaWxlbmFtZS5pbm5lckhUTUwgPSBmTmFtZTtcbiAgICByZXFMaXN0W2ldLnRpbWVvdXQgPSAzNjAwMDtcbiAgICByZXFMaXN0W2ldLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiKiogVGltZW91dCBlcnJvciAtPkZpbGU6XCIgK1xuICAgICAgICAgIGZOYW1lICtcbiAgICAgICAgICBcIiBcIiArXG4gICAgICAgICAgcmVxTGlzdFtpXS5zdGF0dXMgK1xuICAgICAgICAgIFwiIFwiICtcbiAgICAgICAgICByZXFMaXN0W2ldLnN0YXR1c1RleHRcbiAgICAgICAgKTtcbiAgICAgIC8vIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCAtIDFcbiAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IFwiVGltZW91dCBFcnJvclwiO1xuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcImJsaW5rXCIpO1xuICAgICAgcmVzcG9uc2VUaW1lb3V0W2ldID0gdHJ1ZTtcbiAgICB9O1xuICAgIHJlcUxpc3RbaV0ub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICBsZXQgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQoKGV2dC5sb2FkZWQgLyBldnQudG90YWwpICogMTAwKTtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBwZXJjZW50Q29tcGxldGUgKyBcIiVcIjtcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IHBlcmNlbnRDb21wbGV0ZSArIFwiJVwiO1xuICAgICAgfVxuICAgIH07XG4gICAgcmVxTGlzdFtpXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCIqKiBBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgdGhlIHRyYW5zYWN0aW9uIC0+RmlsZTpcIiArXG4gICAgICAgICAgZk5hbWUgK1xuICAgICAgICAgIFwiIFwiICtcbiAgICAgICAgICByZXEuc3RhdHVzICtcbiAgICAgICAgICBcIiBcIiArXG4gICAgICAgICAgcmVxLnN0YXR1c1RleHRcbiAgICAgICAgKTtcbiAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCAtIDE7XG4gICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCJFcnJvclwiO1xuICAgICAgcGVyY2VudExhYmVsLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICAgICQoXCIjYWJvcnRcIiArIGkpLmhpZGUoKTtcbiAgICB9O1xuICAgIHJlcUxpc3RbaV0ub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMTtcbiAgICAgIGlmICghcmVzcG9uc2VUaW1lb3V0W2ldKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIjEwMCVcIjtcbiAgICAgICAgJChcIiNhYm9ydFwiICsgaSkuaGlkZSgpO1xuICAgICAgfVxuICAgICAgaWYgKGhhbmRsZXJDb3VudCA9PT0gMCkge1xuICAgICAgICAkKFwiI2Rvd25sb2FkLWVuZFwiKS5zaG93KCk7XG4gICAgICAgICQoXCIjYnRuQ2FuY2VsQWxsXCIpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIilcbiAgICAgICAgICAuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmlsZSBcIiArIGhhbmRsZXJDb3VudCArIFwiIGRvd25sb2FkZWRcIik7XG4gICAgfTtcbiAgICByZXFMaXN0W2ldLm9ubG9hZHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50ICsgMTtcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIwXCI7XG4gICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCIwJVwiO1xuICAgIH07XG4gICAgcmVxTGlzdFtpXS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocmVxTGlzdFtpXS5yZWFkeVN0YXRlID09PSA0ICYmIHJlcUxpc3RbaV0uc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgbGV0IGZpbGVuYW1lID0gXCJcIjtcbiAgICAgICAgbGV0IGRpc3Bvc2l0aW9uID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIik7XG4gICAgICAgIGlmIChkaXNwb3NpdGlvbiAmJiBkaXNwb3NpdGlvbi5pbmRleE9mKFwiYXR0YWNobWVudFwiKSAhPT0gLTEpIHtcbiAgICAgICAgICBsZXQgZmlsZW5hbWVSZWdleCA9IC9maWxlbmFtZVteOz1cXG5dKj0oKFsnXCJdKS4qP1xcMnxbXjtcXG5dKikvO1xuICAgICAgICAgIGxldCBtYXRjaGVzID0gZmlsZW5hbWVSZWdleC5leGVjKGRpc3Bvc2l0aW9uKTtcbiAgICAgICAgICBpZiAobWF0Y2hlcyAhPSBudWxsICYmIG1hdGNoZXNbMV0pXG4gICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoZXNbMV0ucmVwbGFjZSgvWydcIl0vZywgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHR5cGUgPSByZXFMaXN0W2ldLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpO1xuICAgICAgICBsZXQgYmxvYiA9IG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge1xuICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgLy8gSUUgd29ya2Fyb3VuZCBmb3IgXCJIVE1MNzAwNzogT25lIG9yIG1vcmUgYmxvYiBVUkxzIHdlcmUgcmV2b2tlZCBieSBjbG9zaW5nIHRoZSBibG9iIGZvciB3aGljaCB0aGV5IHdlcmUgY3JlYXRlZC4gVGhlc2UgVVJMcyB3aWxsIG5vIGxvbmdlciByZXNvbHZlIGFzIHRoZSBkYXRhIGJhY2tpbmcgdGhlIFVSTCBoYXMgYmVlbiBmcmVlZC5cIlxuICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihibG9iLCBmaWxlbmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IFVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcbiAgICAgICAgICBsZXQgZG93bmxvYWRVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICAgICAgaWYgKGZpbGVuYW1lKSB7XG4gICAgICAgICAgICAvLyB1c2UgSFRNTDUgYVtkb3dubG9hZF0gYXR0cmlidXRlIHRvIHNwZWNpZnkgZmlsZW5hbWVcbiAgICAgICAgICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAvLyBzYWZhcmkgZG9lc24ndCBzdXBwb3J0IHRoaXMgeWV0XG4gICAgICAgICAgICBpZiAodHlwZW9mIGEuZG93bmxvYWQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAgIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhLmhyZWYgPSBkb3dubG9hZFVybDtcbiAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgICAgIC8vIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAvLyBwcmVsb2FkZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTChkb3dubG9hZFVybCk7XG4gICAgICAgICAgfSwgMTAwKTsgLy8gY2xlYW51cFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICByZXFMaXN0W2ldLnNldFJlcXVlc3RIZWFkZXIoXG4gICAgICBcIkNvbnRlbnQtdHlwZVwiLFxuICAgICAgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIlxuICAgICk7XG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIilcbiAgICAgIGNvbnNvbGUubG9nKGdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCkgKyBcIi9cIiArIGZpbGVMaXN0W2ldKTtcbiAgICByZXFMaXN0W2ldLnNlbmQoXG4gICAgICBzZXJpYWxpemVPYmplY3Qoe1xuICAgICAgICBmaWxlbmFtZTogZ2V0UmVhbFBhdGgoQ1VSUkVOVF9QQVRIKSArIFwiL1wiICsgZmlsZUxpc3RbaV1cbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIF9sb29wKGkpO1xuICB9XG4gICQoXCIjd2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEVuZCBGaWxlcyBhbmQgZkZvbGRlcnMgbW9kdWxlXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiIsImltcG9ydCBDb29raWVzIGZyb20gXCIuLi92ZW5kb3IvanMtY29va2llXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlYWxQYXRoKHApIHtcbiAgICAgIGxldCByUGF0aCA9IFwiXCI7XG4gICAgICBsZXQgUlVOTU9ERSA9IENvb2tpZXMuZ2V0KFwiUnVuTW9kZVwiKTtcbiAgICAgIGxldCBSRUFMX1JPT1RfUEFUSCA9IENvb2tpZXMuZ2V0KFwiUm9vdFBhdGhcIik7XG5cbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiZ2V0UmVhbFBhdGg6cCBcIiwgcCk7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcImdldFJlYWxQYXRoOlJFQUxfUk9PVF9QQVRIIFwiLCBSRUFMX1JPT1RfUEFUSCk7XG4gICAgICBpZiAocCA9PSBcIi9cIiAmJiAoUkVBTF9ST09UX1BBVEggPT09IFwiL1wiIHx8IFJFQUxfUk9PVF9QQVRIID09PSBcIlwiKSkge1xuICAgICAgICByUGF0aCA9IHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocCA9PSBcIi9cIikge1xuICAgICAgICAgIHJQYXRoID0gXCIvXCIgKyBSRUFMX1JPT1RfUEFUSDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL3JQYXRoID0gXCIvXCIgKyBSRUFMX1JPT1RfX1BBVEggKyBwO1xuICAgICAgICAgIHJQYXRoID0gcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJnZXRSZWFsUGF0aDpyUGF0aCBcIiwgclBhdGgpO1xuICAgICAgcmV0dXJuIHJQYXRoO1xuICAgIH1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChkYXRhT2JqZWN0KSB7XG4gICAgICB2YXIgc3RyaW5nUmVzdWx0ID0gXCJcIixcbiAgICAgICAgdmFsdWUgPSB2b2lkIDA7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YU9iamVjdCkge1xuICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhkYXRhT2JqZWN0W2tleV0sIGtleSk7XG4gICAgICAgIHZhbHVlID0gZGF0YU9iamVjdFtrZXldO1xuICAgICAgICBpZiAoc3RyaW5nUmVzdWx0ICE9PSBcIlwiKSB7XG4gICAgICAgICAgc3RyaW5nUmVzdWx0ICs9IFwiJlwiICsga2V5ICsgXCI9XCIgKyB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHJpbmdSZXN1bHQgKz0ga2V5ICsgXCI9XCIgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cmluZ1Jlc3VsdDtcbiAgICB9ICAgXG4iLCIvKiFcbiAqIEphdmFTY3JpcHQgQ29va2llIHYyLjIuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcbiAqXG4gKiBDb3B5cmlnaHQgMjAwNiwgMjAxNSBLbGF1cyBIYXJ0bCAmIEZhZ25lciBCcmFja1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcjtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXcml0ZVxuXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XG5cdFx0XHRcdFx0cGF0aDogJy8nXG5cdFx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUobmV3IERhdGUoKSAqIDEgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlKzUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UncmUgdXNpbmcgXCJleHBpcmVzXCIgYmVjYXVzZSBcIm1heC1hZ2VcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHRcdFx0XHRcdGlmICgvXltcXHtcXFtdLy50ZXN0KHJlc3VsdCkpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblxuXHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSA/XG5cdFx0XHRcdFx0Y29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpIDpcblx0XHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRcdGtleSA9IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoa2V5KSlcblx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuXHRcdFx0XHRcdC5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcblx0XHRcdFx0Zm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG5cdFx0XHRcdFx0Ly8gLi4uXG5cdFx0XHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuXHRcdFx0XHRcdC8vICAgICBjaGFyYWN0ZXI6XG5cdFx0XHRcdFx0Ly8gQ29uc3VtZSB0aGUgY2hhcmFjdGVycyBvZiB0aGUgdW5wYXJzZWQtYXR0cmlidXRlcyB1cCB0byxcblx0XHRcdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cblx0XHRcdFx0XHQvLyAuLi5cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJz0nICsgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXS5zcGxpdCgnOycpWzBdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIChkb2N1bWVudC5jb29raWUgPSBrZXkgKyAnPScgKyB2YWx1ZSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlYWRcblxuXHRcdFx0dmFyIGphciA9IHt9O1xuXHRcdFx0dmFyIGRlY29kZSA9IGZ1bmN0aW9uIChzKSB7XG5cdFx0XHRcdHJldHVybiBzLnJlcGxhY2UoLyglWzAtOUEtWl17Mn0pKy9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0fTtcblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIXRoaXMuanNvbiAmJiBjb29raWUuY2hhckF0KDApID09PSAnXCInKSB7XG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBkZWNvZGUocGFydHNbMF0pO1xuXHRcdFx0XHRcdGNvb2tpZSA9IChjb252ZXJ0ZXIucmVhZCB8fCBjb252ZXJ0ZXIpKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGRlY29kZShjb29raWUpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuanNvbikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0Y29va2llID0gSlNPTi5wYXJzZShjb29raWUpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRqYXJbbmFtZV0gPSBjb29raWU7XG5cblx0XHRcdFx0XHRpZiAoa2V5ID09PSBuYW1lKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBrZXkgPyBqYXJba2V5XSA6IGphcjtcblx0XHR9XG5cblx0XHRhcGkuc2V0ID0gYXBpO1xuXHRcdGFwaS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLmdldEpTT04gPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBrZXkpO1xuXHRcdH07XG5cdFx0YXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGFwaShrZXksICcnLCBleHRlbmQoYXR0cmlidXRlcywge1xuXHRcdFx0XHRleHBpcmVzOiAtMVxuXHRcdFx0fSkpO1xuXHRcdH07XG5cblx0XHRhcGkuZGVmYXVsdHMgPSB7fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=
