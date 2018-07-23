(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

////////////////////////////////////
// Files and Folder module
///////////////////////////////////
window.fileManager = function () {

  window.htmlUploadDownloadTemplate = '<ul class="preloader-file" id="DownloadfileList">\n    <li id="li0">\n        <div class="li-content">\n            <div class="li-filename" id="li-filename0"></div>\n            <div class="progress-content">\n                <div class="progress-bar" id="progress-bar0"></div>\n                <div class="percent" id="percent0"></div>\n                <a class="modal_close" id="abort0" href="#"></a>\n            </div>\n        </div>\n    </li>\n    <li id="li1">\n        <div class="li-content">\n            <div class="li-filename" id="li-filename1"></div>\n            <div class="progress-content">\n                <div class="progress-bar" id="progress-bar1"></div>\n                <div class="percent" id="percent1"></div>\n                <a class="modal_close" id="abort1" href="#"></a>\n            </div>\n        </div>\n    </li>\n    <li id="li2">\n        <div class="li-content">\n            <div class="li-filename" id="li-filename2"></div>\n            <div class="progress-content">\n                <div class="progress-bar" id="progress-bar2"></div>\n                <div class="percent" id="percent2"></div>\n                <a class="modal_close" id="abort2" href="#"></a>\n            </div>   \n        </div>\n    </li>\n    <li id="li3">\n        <div class="li-content">\n            <div class="li-filename" id="li-filename3"></div>\n            <div class="progress-content">\n                <div class="progress-bar" id="progress-bar3"></div>\n                <div class="percent" id="percent3"></div>\n                <a class="modal_close" id="abort3" href="#"></a>\n            </div>   \n        </div>\n    </li>\n    <li id="li4">\n        <div class="li-content">\n            <div class="li-filename" id="li-filename4"></div>\n            <div class="progress-content">\n                <div class="progress-bar" id="progress-bar4"></div>\n                <div class="percent" id="percent4"></div>\n                <a class="modal_close" id="abort4" href="#"></a>\n            </div>\n        </div>\n    </li>\n</ul>';

  return {
    validateSize: function validateSize(f) {
      return true;
    },
    shareFile: function shareFile() {
      var searchUserModalContent = document.getElementById('searchUserModalContent');
      var AddUserModalContent = document.getElementById('AddUserModalContent');
      var containerOverlay = document.querySelector(".container-overlay");

      /**/
      searchUserModalContent.innerHTML = htmlShareFile;
      AddUserModalContent.style.display = "none";
      searchUserModalContent.style.display = "block";
      containerOverlay.style.display = "block";
      document.getElementById('btn-ShareFileCancel').addEventListener('click', function (e) {
        e.preventDefault();
        searchUserModalContent.style.display = "none";
        containerOverlay.style.display = "none";
      });
      document.getElementById('btn-ShareFileAccept').addEventListener('click', function (e) {
        e.preventDefault();
        if (RUNMODE === 'DEBUG') console.log(document.getElementById('destUserName').value);
        if (RUNMODE === 'DEBUG') console.log(document.getElementById('FileExpirateDate').value);
        var data = {
          fileName: aSelectedFiles[0],
          fileSize: null,
          path: CURRENT_PATH,
          userName: UserName,
          destUserName: document.getElementById('destUserName').value,
          expirationDate: document.getElementById('FileExpirateDate').value
        };
        execFetch("/files/share", "POST", data).then(function (d) {
          if (RUNMODE === "DEBUG") console.log(d);
          if (d.status === 'OK') {
            searchUserModalContent.style.display = "none";
            containerOverlay.style.display = "none";
            sendEmail(d.data.DestUser, "mbermejo17@gmail.com", "URL para descarga de archivo", 'Descarga de archivo https://194.224.194.134/files/share/' + d.data.UrlCode);
          }
        }).catch(function (e) {
          showToast("Error al compartir archivo " + data.fileName + ".<br>Err:" + e, "err");
          if (RUNMODE === "DEBUG") console.log(e);
        });
      });
    },
    deleteSelected: function deleteSelected() {
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
    },

    upload: function upload(Token) {
      var w = 32;
      var h = 440;
      var aListHandler = [];
      var handlerCounter = 0;
      var ModalTitle = "Subida de archivos";
      var ModalContent = '<label class="file-input waves-effect waves-teal btn-flat btn2-unify">Select files<input id="upload-input" type="file" name="uploads[]" multiple="multiple" class="modal-action modal-close"></label>\n                        <span id="sFiles">Ningun archivo seleccionado</span>';
      ModalContent += htmlUploadDownloadTemplate;
      var htmlContent = '<div id="modal-header">\n                          <h5>' + ModalTitle + '</h5>\n                          <a class="modal_close" id="modalClose" href="#"></a>\n                        </div>\n                        <div class="modal-content">\n                          <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                              <!--<input type="text" hidden id="destPath" name="destPath" value=""/>-->\n                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancel uploads</a>  \n                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseUpload" href="#!">Close</a>\n                      </div>';

      $("#upload").removeClass("disabled").addClass("disabled");

      function fnUploadFile(formData, nFile, fileName) {
        $("#li" + nFile).show();
        $("#li-filename" + nFile).show();
        $("#li-filename" + nFile).html(fileName);
        var realpath = general.getRealPath(CURRENT_PATH);
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
        var files = $('#upload-input').get(0).files;
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
    },

    newFolder: function newFolder(folderName) {
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + Token);
      headers.append("Content-Type", "application/json");
      fetch("/files/newfolder", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          path: general.getRealPath(CURRENT_PATH),
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
    },

    deleteFile: function deleteFile(path) {
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
            path: general.getRealPath(path),
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
    },

    deleteFolder: function deleteFolder(path) {
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
            path: general.getRealPath(path),
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
    },

    //TODO: Optimizar renderizado de elementos li
    //incorporando el contenido en el bucle _loop
    download: function download(fileList, text) {
      var reqList = [],
          handlerCount = 0,
          responseTimeout = [];
      var w = 32;
      var h = 440;
      var ModalTitle = "Descarga de archivos seleccionados";
      var ModalContent = htmlUploadDownloadTemplate;
      var htmlContent = '<div id="modal-header">\n                          <h5>' + ModalTitle + '</h5>\n                          <a class="modal_close" id="modalClose" href="#"></a>\n                      </div>\n                      <div class="modal-content">\n                          <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancel downloads</a>\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Cerrar</a>\n                      </div>';
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
        if (RUNMODE === "DEBUG") console.log(general.getRealPath(CURRENT_PATH) + "/" + fileList[i]);
        reqList[i].send(serializeObject({
          filename: general.getRealPath(CURRENT_PATH) + "/" + fileList[i]
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
  };
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2ZpbGVNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBRTtBQUNBO0FBQ0E7QUFDQSxPQUFPLFdBQVAsR0FBc0IsWUFBVzs7QUFFakMsU0FBTywwQkFBUDs7QUFzREEsU0FBTztBQUNMLGtCQUFjLHlCQUFLO0FBQ2pCLGFBQU8sSUFBUDtBQUNELEtBSEk7QUFJTCxlQUFZLHFCQUFNO0FBQ2xCLFVBQUkseUJBQXlCLFNBQVMsY0FBVCxDQUF3Qix3QkFBeEIsQ0FBN0I7QUFDQSxVQUFJLHNCQUFzQixTQUFTLGNBQVQsQ0FBd0IscUJBQXhCLENBQTFCO0FBQ0EsVUFBSSxtQkFBbUIsU0FBUyxhQUFULENBQXVCLG9CQUF2QixDQUF2Qjs7QUFFQTtBQUNBLDZCQUF1QixTQUF2QixHQUFtQyxhQUFuQztBQUNBLDBCQUFvQixLQUFwQixDQUEwQixPQUExQixHQUFvQyxNQUFwQztBQUNBLDZCQUF1QixLQUF2QixDQUE2QixPQUE3QixHQUF1QyxPQUF2QztBQUNBLHVCQUFpQixLQUFqQixDQUF1QixPQUF2QixHQUFpQyxPQUFqQztBQUNBLGVBQVMsY0FBVCxDQUF3QixxQkFBeEIsRUFBK0MsZ0JBQS9DLENBQWdFLE9BQWhFLEVBQXlFLFVBQUMsQ0FBRCxFQUFPO0FBQzlFLFVBQUUsY0FBRjtBQUNBLCtCQUF1QixLQUF2QixDQUE2QixPQUE3QixHQUF1QyxNQUF2QztBQUNBLHlCQUFpQixLQUFqQixDQUF1QixPQUF2QixHQUFpQyxNQUFqQztBQUNELE9BSkQ7QUFLQSxlQUFTLGNBQVQsQ0FBd0IscUJBQXhCLEVBQStDLGdCQUEvQyxDQUFnRSxPQUFoRSxFQUF5RSxVQUFDLENBQUQsRUFBTztBQUM5RSxVQUFFLGNBQUY7QUFDQSxZQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksU0FBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLEtBQXBEO0FBQ3pCLFlBQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSxTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLEVBQTRDLEtBQXhEO0FBQ3pCLFlBQUksT0FBTztBQUNULG9CQUFVLGVBQWUsQ0FBZixDQUREO0FBRVQsb0JBQVUsSUFGRDtBQUdULGdCQUFNLFlBSEc7QUFJVCxvQkFBVSxRQUpEO0FBS1Qsd0JBQWMsU0FBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLEtBTDdDO0FBTVQsMEJBQWdCLFNBQVMsY0FBVCxDQUF3QixrQkFBeEIsRUFBNEM7QUFObkQsU0FBWDtBQVFBLGtCQUFVLGNBQVYsRUFBMEIsTUFBMUIsRUFBa0MsSUFBbEMsRUFDRyxJQURILENBQ1EsVUFBQyxDQUFELEVBQU87QUFDWCxjQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksQ0FBWjtBQUN6QixjQUFJLEVBQUUsTUFBRixLQUFhLElBQWpCLEVBQXVCO0FBQ3JCLG1DQUF1QixLQUF2QixDQUE2QixPQUE3QixHQUF1QyxNQUF2QztBQUNBLDZCQUFpQixLQUFqQixDQUF1QixPQUF2QixHQUFpQyxNQUFqQztBQUNBLHNCQUFVLEVBQUUsSUFBRixDQUFPLFFBQWpCLEVBQ0Usc0JBREYsRUFFRSw4QkFGRiwrREFHNkQsRUFBRSxJQUFGLENBQU8sT0FIcEU7QUFJRDtBQUNGLFNBWEgsRUFZRyxLQVpILENBWVMsYUFBSztBQUNWLG9CQUFVLGdDQUFnQyxLQUFLLFFBQXJDLEdBQWdELFdBQWhELEdBQThELENBQXhFLEVBQTJFLEtBQTNFO0FBQ0EsY0FBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLENBQVo7QUFDMUIsU0FmSDtBQWdCRCxPQTVCRDtBQTZCRCxLQWhETTtBQWlEUixvQkFBZ0IsMEJBQUs7QUFDbEIsVUFBSSxZQUFZLE9BQWhCLEVBQ0UsUUFBUSxHQUFSLENBQVksb0JBQVosRUFBa0MsaUJBQWlCLE1BQW5EO0FBQ0YsVUFBSSxpQkFBaUIsTUFBakIsR0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0Isd0JBQ0UsZUFERixFQUVFLDBCQUZGLEVBR0UsYUFBSztBQUNILFlBQUUsSUFBRixDQUFPLGFBQWEsWUFBYixDQUFQLEVBQW1DLElBQW5DLENBQXdDLGtCQUFVO0FBQ2hELGdCQUFJLGVBQWUsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUM3Qiw4QkFDRSxjQURGLEVBRUUsd0JBRkYsRUFHRSxhQUFLO0FBQ0gsMkJBQVcsWUFBWDtBQUNELGVBTEgsRUFNRSxhQUFLO0FBQ0gsb0JBQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSx1QkFBWjtBQUMxQixlQVJIO0FBVUQ7QUFDRCxxQkFBUyxjQUFULENBQXdCLFNBQXhCLEVBQW1DLEtBQW5DO0FBQ0QsV0FkRDtBQWVELFNBbkJILEVBb0JFLGFBQUs7QUFDSCxjQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksd0JBQVo7QUFDekIsY0FBSSxlQUFlLE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDN0IsNEJBQ0UsY0FERixFQUVFLHdCQUZGLEVBR0UsYUFBSztBQUNILHlCQUFXLFlBQVg7QUFDRCxhQUxILEVBTUUsYUFBSztBQUNILGtCQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksdUJBQVo7QUFDMUIsYUFSSDtBQVVEO0FBQ0YsU0FsQ0g7QUFvQ0QsT0FyQ0QsTUFxQ087QUFDTCxZQUFJLGVBQWUsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUM3QiwwQkFDRSxjQURGLEVBRUUsd0JBRkYsRUFHRSxhQUFLO0FBQ0gsdUJBQVcsWUFBWDtBQUNELFdBTEgsRUFNRSxhQUFLO0FBQ0gsZ0JBQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSx1QkFBWjtBQUMxQixXQVJIO0FBVUQ7QUFDRjtBQUNGLEtBdkdNOztBQXlHUCxZQUFRLGdCQUFDLEtBQUQsRUFBVztBQUNqQixVQUFJLElBQUksRUFBUjtBQUNBLFVBQUksSUFBSSxHQUFSO0FBQ0EsVUFBSSxlQUFlLEVBQW5CO0FBQ0EsVUFBSSxpQkFBaUIsQ0FBckI7QUFDQSxVQUFJLGFBQWEsb0JBQWpCO0FBQ0EsVUFBSSxvU0FBSjtBQUVBLHNCQUFnQiwwQkFBaEI7QUFDQSxVQUFJLDBFQUN3QixVQUR4QixpTkFLdUIsWUFMdkIsdWhCQUFKOztBQWFBLFFBQUUsU0FBRixFQUNHLFdBREgsQ0FDZSxVQURmLEVBRUcsUUFGSCxDQUVZLFVBRlo7O0FBSUEsZUFBUyxZQUFULENBQXNCLFFBQXRCLEVBQWdDLEtBQWhDLEVBQXVDLFFBQXZDLEVBQWlEO0FBQy9DLFVBQUUsUUFBUSxLQUFWLEVBQWlCLElBQWpCO0FBQ0EsVUFBRSxpQkFBaUIsS0FBbkIsRUFBMEIsSUFBMUI7QUFDQSxVQUFFLGlCQUFpQixLQUFuQixFQUEwQixJQUExQixDQUErQixRQUEvQjtBQUNBLFlBQUksV0FBVyxRQUFRLFdBQVIsQ0FBb0IsWUFBcEIsQ0FBZjtBQUNBLFlBQUksWUFBWSxPQUFoQixFQUF5QixRQUFRLEdBQVIsQ0FBWSx5QkFBeUIsWUFBckM7QUFDekIsWUFBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLDJCQUEyQixjQUF2QztBQUN6QixZQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVkscUJBQXFCLFFBQWpDO0FBQ3pCLFVBQUUsSUFBRixDQUFPO0FBQ0wsZUFBSyw0QkFBNEIsUUFENUI7QUFFTCxnQkFBTSxNQUZEO0FBR0wsZ0JBQU0sUUFIRDtBQUlMLHVCQUFhLEtBSlI7QUFLTCx1QkFBYSxLQUxSO0FBTUwsbUJBQVMsTUFOSjtBQU9MLHNCQUFZLG9CQUFVLE1BQVYsRUFBa0I7QUFDNUIsbUJBQU8sZ0JBQVAsQ0FBd0IsZUFBeEIsRUFBeUMsWUFBWSxLQUFyRDtBQUNBLG1CQUFPLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DLFFBQXBDO0FBQ0QsV0FWSTtBQVdMLG1CQUFTLGlCQUFVLElBQVYsRUFBZ0I7QUFDdkIsZ0JBQUksWUFBWSxPQUFoQixFQUNFLFFBQVEsR0FBUixDQUFZLFdBQVcsc0JBQVgsR0FBb0MsSUFBaEQ7QUFDRixzQkFBVSxXQUFXLHVCQUFyQixFQUE4QyxTQUE5QztBQUNBLGNBQUUsV0FBVyxLQUFiLEVBQW9CLElBQXBCO0FBQ0EsY0FBRSxVQUFGLEVBQWMsT0FBZCxDQUFzQixPQUF0QjtBQUNBLDZCQUFpQixpQkFBaUIsQ0FBbEM7QUFDQSxnQkFBSSxrQkFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsZ0JBQUUsZUFBRixFQUNHLFdBREgsQ0FDZSxVQURmLEVBRUcsUUFGSCxDQUVZLFVBRlo7QUFHRDtBQUNGLFdBdkJJO0FBd0JMLGVBQUssZUFBWTtBQUNmLHlCQUFhLEtBQWIsSUFBc0IsSUFBSSxjQUFKLEVBQXRCO0FBQ0EsZ0JBQUksa0JBQWtCLENBQXRCO0FBQ0EseUJBQWEsS0FBYixFQUFvQixNQUFwQixDQUEyQixnQkFBM0IsQ0FDRSxVQURGLEVBRUUsVUFBVSxHQUFWLEVBQWU7QUFDYixrQkFBSSxJQUFJLGdCQUFSLEVBQTBCO0FBQ3hCLGtDQUFrQixJQUFJLE1BQUosR0FBYSxJQUFJLEtBQW5DO0FBQ0Esa0NBQWtCLFNBQVMsa0JBQWtCLEdBQTNCLENBQWxCO0FBQ0Esa0JBQUUsYUFBYSxLQUFmLEVBQXNCLElBQXRCLENBQTJCLGtCQUFrQixHQUE3QztBQUNBLGtCQUFFLGtCQUFrQixLQUFwQixFQUEyQixLQUEzQixDQUFpQyxrQkFBa0IsR0FBbkQ7QUFDQTs7O0FBR0Q7QUFDRixhQVpILEVBYUUsS0FiRjtBQWVBLG1CQUFPLGFBQWEsS0FBYixDQUFQO0FBQ0Q7QUEzQ0ksU0FBUDtBQTZDRDs7QUFFRCxRQUFFLFFBQUYsRUFDRyxJQURILENBQ1EsV0FEUixFQUVHLEdBRkgsQ0FFTyxZQUFZLENBQVosR0FBZ0IsWUFBaEIsR0FBK0IsQ0FBL0IsR0FBbUMsd0JBRjFDO0FBR0E7QUFDQSxRQUFFLGtCQUFGLEVBQXNCLEdBQXRCLENBQTBCLHVCQUExQjtBQUNBLFFBQUUsYUFBRixFQUFpQixJQUFqQjtBQUNBLFFBQUUsUUFBRixFQUFZLElBQVo7QUFDQSxRQUFFLGVBQUYsRUFBbUIsSUFBbkI7QUFDQSxRQUFFLGlCQUFGLEVBQXFCLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDLGFBQUs7QUFDcEMsVUFBRSxTQUFGLEVBQWEsV0FBYixDQUF5QixVQUF6QjtBQUNBLFVBQUUsUUFBRixFQUFZLElBQVo7QUFDQSxVQUFFLGVBQUYsRUFBbUIsSUFBbkI7QUFDRCxPQUpEO0FBS0EsUUFBRSxhQUFGLEVBQWlCLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLGFBQUs7QUFDaEMsVUFBRSxTQUFGLEVBQWEsV0FBYixDQUF5QixVQUF6QjtBQUNBLFVBQUUsUUFBRixFQUFZLElBQVo7QUFDQSxVQUFFLGVBQUYsRUFBbUIsSUFBbkI7QUFDRCxPQUpEO0FBS0EsUUFBRSxlQUFGLEVBQW1CLFdBQW5CLENBQStCLFVBQS9CO0FBQ0EsUUFBRSxjQUFGLEVBQWtCLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLGFBQUs7QUFDakMsVUFBRSxjQUFGO0FBQ0EsWUFBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLENBQVo7QUFDekIsWUFBSSxJQUFJLFNBQVMsRUFBRSxNQUFGLENBQVMsRUFBVCxDQUFZLEtBQVosQ0FBa0IsQ0FBQyxDQUFuQixDQUFULENBQVI7QUFDQSxxQkFBYSxDQUFiLEVBQWdCLEtBQWhCO0FBQ0EsWUFBSSxlQUFlLFNBQVMsYUFBVCxDQUF1QixhQUFhLENBQXBDLENBQW5CO0FBQ0EsWUFBSSxjQUFjLFNBQVMsYUFBVCxDQUF1QixrQkFBa0IsQ0FBekMsQ0FBbEI7QUFDQSxvQkFBWSxTQUFaLEdBQXdCLGtCQUF4QjtBQUNBLHFCQUFhLFNBQWIsR0FBeUIsRUFBekI7QUFDQSxvQkFBWSxLQUFaLENBQWtCLEtBQWxCLEdBQTBCLEtBQTFCO0FBQ0Esb0JBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixNQUExQjtBQUNBLG9CQUFZLEtBQVosQ0FBa0IsZUFBbEIsR0FBb0MsT0FBcEM7QUFDQSxVQUFFLEVBQUUsTUFBSixFQUFZLElBQVo7QUFDRCxPQWJEO0FBY0EsUUFBRSxlQUFGLEVBQW1CLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLGFBQUs7QUFDbEMsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLHVCQUFhLENBQWIsRUFBZ0IsS0FBaEI7QUFDQSxjQUFJLGVBQWUsU0FBUyxhQUFULENBQXVCLGFBQWEsQ0FBcEMsQ0FBbkI7QUFDQSxjQUFJLGNBQWMsU0FBUyxhQUFULENBQXVCLGtCQUFrQixDQUF6QyxDQUFsQjtBQUNBLHNCQUFZLFNBQVosR0FBd0Isa0JBQXhCO0FBQ0EsdUJBQWEsU0FBYixHQUF5QixFQUF6QjtBQUNBLHNCQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsS0FBMUI7QUFDQSxzQkFBWSxLQUFaLENBQWtCLEtBQWxCLEdBQTBCLE1BQTFCO0FBQ0Esc0JBQVksS0FBWixDQUFrQixlQUFsQixHQUFvQyxPQUFwQztBQUNEO0FBQ0QsVUFBRSxlQUFGLEVBQW1CLFFBQW5CLENBQTRCLFVBQTVCO0FBQ0QsT0FaRDtBQWFBLFFBQUUsZUFBRixFQUFtQixFQUFuQixDQUFzQixRQUF0QixFQUFnQyxVQUFVLENBQVYsRUFBYTtBQUMzQyxZQUFJLFFBQVEsRUFBRSxlQUFGLEVBQW1CLEdBQW5CLENBQXVCLENBQXZCLEVBQTBCLEtBQXRDO0FBQ0UseUJBQWlCLE1BQU0sTUFBdkI7QUFDQSxjQUFNLE1BQU4sR0FBZSxDQUFmLEdBQ0UsRUFBRSxTQUFGLEVBQWEsSUFBYixDQUFrQixNQUFNLE1BQU4sR0FBZSwwQkFBakMsQ0FERixHQUVFLEVBQUUsU0FBRixFQUFhLElBQWIsQ0FBa0IsTUFBTSxDQUFOLENBQWxCLENBRkY7QUFHQSxZQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksTUFBTSxNQUFsQjtBQUN6QixVQUFFLGFBQUYsRUFBaUIsSUFBakI7QUFDQSxZQUFJLE1BQU0sTUFBTixHQUFlLENBQWYsSUFBb0IsTUFBTSxNQUFOLElBQWdCLENBQXhDLEVBQTJDO0FBQ3pDLFlBQUUsaUJBQUYsRUFDRyxXQURILENBQ2UsVUFEZixFQUVHLFFBRkgsQ0FFWSxVQUZaO0FBR0EsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsZ0JBQUksT0FBTyxNQUFNLENBQU4sQ0FBWDtBQUNBLGdCQUFJLFdBQVcsSUFBSSxRQUFKLEVBQWY7QUFDQTs7QUFFQSxxQkFBUyxNQUFULENBQWdCLFdBQWhCLEVBQTZCLElBQTdCLEVBQW1DLEtBQUssSUFBeEM7QUFDQSx5QkFBYSxRQUFiLEVBQXVCLENBQXZCLEVBQTBCLEtBQUssSUFBL0I7QUFDRDtBQUNELFlBQUUsaUJBQUYsRUFBcUIsV0FBckIsQ0FBaUMsVUFBakM7QUFDRCxTQWJELE1BYU87QUFDTCxvQkFBVSwrQ0FBVixFQUEyRCxLQUEzRDtBQUNEO0FBQ0osT0F4QkQ7QUF5QkQsS0FqUU07O0FBbVFQLGVBQVcsbUJBQUMsVUFBRCxFQUFnQjtBQUN6QixVQUFNLFVBQVUsSUFBSSxPQUFKLEVBQWhCO0FBQ0EsY0FBUSxNQUFSLENBQWUsZUFBZixFQUFnQyxZQUFZLEtBQTVDO0FBQ0EsY0FBUSxNQUFSLENBQWUsY0FBZixFQUErQixrQkFBL0I7QUFDQSxZQUFNLGtCQUFOLEVBQTBCO0FBQ3RCLGdCQUFRLE1BRGM7QUFFdEIsaUJBQVMsT0FGYTtBQUd0QixjQUFNLEtBQUssU0FBTCxDQUFlO0FBQ25CLGdCQUFNLFFBQVEsV0FBUixDQUFvQixZQUFwQixDQURhO0FBRW5CLHNCQUFZO0FBRk8sU0FBZixDQUhnQjtBQU90QixpQkFBUztBQVBhLE9BQTFCLEVBU0csSUFUSCxDQVNRLGlCQVRSLEVBVUcsSUFWSCxDQVVRO0FBQUEsZUFBSyxFQUFFLElBQUYsRUFBTDtBQUFBLE9BVlIsRUFXRyxJQVhILENBV1EsZ0JBQVE7QUFDWixZQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksSUFBWjtBQUN6QixZQUFJLEtBQUssTUFBTCxJQUFlLElBQW5CLEVBQXlCO0FBQ3ZCLFlBQUUsUUFBRixFQUFZLElBQVo7QUFDQSxZQUFFLGVBQUYsRUFBbUIsSUFBbkI7QUFDQSxZQUFFLFVBQUYsRUFBYyxPQUFkLENBQXNCLE9BQXRCO0FBQ0Esb0JBQVUsMEJBQTBCLEtBQUssSUFBTCxDQUFVLFVBQTlDLEVBQTBELFNBQTFEO0FBQ0Q7QUFDRixPQW5CSCxFQW9CRyxLQXBCSCxDQW9CUyxlQUFPO0FBQ1osWUFBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLEdBQVo7QUFDMUIsT0F0Qkg7QUF1QkQsS0E5Uk07O0FBZ1NQLGdCQUFZLG9CQUFDLElBQUQsRUFBVTtBQUNwQixVQUFNLFVBQVUsSUFBSSxPQUFKLEVBQWhCO0FBQ0EsVUFBSSxJQUFJLENBQVI7QUFDQSxVQUFJLEtBQUssZUFBZSxLQUFmLEVBQVQ7QUFDQSxVQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksRUFBWjtBQUN6QixjQUFRLE1BQVIsQ0FBZSxlQUFmLEVBQWdDLFlBQVksS0FBNUM7QUFDQSxjQUFRLE1BQVIsQ0FBZSxjQUFmLEVBQStCLGtCQUEvQjtBQUNBLFFBQUUsVUFBRixFQUFjLFFBQWQsQ0FBdUIsUUFBdkI7QUFDQSxXQUFLLElBQUksQ0FBVCxFQUFZLElBQUksR0FBRyxNQUFuQixFQUEyQixHQUEzQixFQUFnQztBQUM5QixZQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksbUJBQW1CLEdBQUcsQ0FBSCxDQUFuQixHQUEyQixNQUF2QztBQUN6QixjQUFNLGVBQU4sRUFBdUI7QUFDbkIsa0JBQVEsTUFEVztBQUVuQixtQkFBUyxPQUZVO0FBR25CLGdCQUFNLEtBQUssU0FBTCxDQUFlO0FBQ25CLGtCQUFNLFFBQVEsV0FBUixDQUFvQixJQUFwQixDQURhO0FBRW5CLHNCQUFVLEdBQUcsQ0FBSDtBQUZTLFdBQWYsQ0FIYTtBQU9uQixtQkFBUztBQVBVLFNBQXZCLEVBU0csSUFUSCxDQVNRLGlCQVRSLEVBVUcsSUFWSCxDQVVRO0FBQUEsaUJBQUssRUFBRSxJQUFGLEVBQUw7QUFBQSxTQVZSLEVBV0csSUFYSCxDQVdRLGdCQUFRO0FBQ1osY0FBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLElBQVo7QUFDekIsY0FBSSxLQUFLLE1BQUwsSUFBZSxJQUFuQixFQUF5QjtBQUN2QiwyQkFBZSxLQUFmO0FBQ0EsY0FBRSxRQUFGLEVBQ0csV0FESCxDQUNlLFNBRGYsRUFFRyxRQUZILENBRVksU0FGWjtBQUdBLHNCQUFVLGFBQWEsS0FBSyxJQUFMLENBQVUsUUFBdkIsR0FBa0MsVUFBNUMsRUFBd0QsU0FBeEQ7QUFDQSxjQUFFLFVBQUYsRUFBYyxPQUFkLENBQXNCLE9BQXRCO0FBQ0Q7QUFDRixTQXJCSCxFQXNCRyxLQXRCSCxDQXNCUyxlQUFPO0FBQ1osY0FBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLEdBQVo7QUFDekIsWUFBRSxRQUFGLEVBQ0csV0FESCxDQUNlLEtBRGYsRUFFRyxRQUZILENBRVksS0FGWjtBQUdBLG9CQUFVLEdBQVYsRUFBZSxLQUFmO0FBQ0QsU0E1Qkg7QUE2QkQ7QUFDRCxRQUFFLFVBQUYsRUFBYyxXQUFkLENBQTBCLFFBQTFCO0FBQ0QsS0F6VU07O0FBMlVQLGtCQUFjLHNCQUFDLElBQUQsRUFBUztBQUNyQixVQUFNLFVBQVUsSUFBSSxPQUFKLEVBQWhCO0FBQ0EsVUFBSSxJQUFJLENBQVI7QUFDQSxVQUFJLEtBQUssaUJBQWlCLEtBQWpCLEVBQVQ7QUFDQSxVQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksRUFBWjtBQUN6QixjQUFRLE1BQVIsQ0FBZSxlQUFmLEVBQWdDLFlBQVksS0FBNUM7QUFDQSxjQUFRLE1BQVIsQ0FBZSxjQUFmLEVBQStCLGtCQUEvQjtBQUNBLFFBQUUsVUFBRixFQUFjLFFBQWQsQ0FBdUIsUUFBdkI7QUFDQSxXQUFLLElBQUksQ0FBVCxFQUFZLElBQUksR0FBRyxNQUFuQixFQUEyQixHQUEzQixFQUFnQztBQUM5QixZQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVkscUJBQXFCLEdBQUcsQ0FBSCxDQUFyQixHQUE2QixNQUF6QztBQUN6QixjQUFNLGVBQU4sRUFBdUI7QUFDbkIsa0JBQVEsTUFEVztBQUVuQixtQkFBUyxPQUZVO0FBR25CLGdCQUFNLEtBQUssU0FBTCxDQUFlO0FBQ25CLGtCQUFNLFFBQVEsV0FBUixDQUFvQixJQUFwQixDQURhO0FBRW5CLHNCQUFVLEdBQUcsQ0FBSDtBQUZTLFdBQWYsQ0FIYTtBQU9uQixtQkFBUztBQVBVLFNBQXZCLEVBU0csSUFUSCxDQVNRLGlCQVRSLEVBVUcsSUFWSCxDQVVRO0FBQUEsaUJBQUssRUFBRSxJQUFGLEVBQUw7QUFBQSxTQVZSLEVBV0csSUFYSCxDQVdRLGdCQUFRO0FBQ1osY0FBSSxZQUFZLE9BQWhCLEVBQXlCLFFBQVEsR0FBUixDQUFZLElBQVo7QUFDekIsY0FBSSxLQUFLLE1BQUwsSUFBZSxJQUFuQixFQUF5QjtBQUN2QixjQUFFLFFBQUYsRUFDRyxXQURILENBQ2UsU0FEZixFQUVHLFFBRkgsQ0FFWSxTQUZaO0FBR0Esc0JBQVUsYUFBYSxLQUFLLElBQUwsQ0FBVSxRQUF2QixHQUFrQyxVQUE1QyxFQUF3RCxTQUF4RDtBQUNBLDZCQUFpQixLQUFqQjtBQUNBLGNBQUUsVUFBRixFQUFjLFdBQWQsQ0FBMEIsUUFBMUI7QUFDRDtBQUNGLFNBckJILEVBc0JHLEtBdEJILENBc0JTLGVBQU87QUFDWixjQUFJLFlBQVksT0FBaEIsRUFBeUIsUUFBUSxHQUFSLENBQVksR0FBWjtBQUN6QixZQUFFLFVBQUYsRUFBYyxXQUFkLENBQTBCLFFBQTFCO0FBQ0QsU0F6Qkg7QUEwQkQ7QUFDRCxRQUFFLFVBQUYsRUFBYyxXQUFkLENBQTBCLFFBQTFCO0FBQ0QsS0FqWE07O0FBbVhQO0FBQ0E7QUFDQSxjQUFVLGtCQUFDLFFBQUQsRUFBVyxJQUFYLEVBQW9CO0FBQzVCLFVBQUksVUFBVSxFQUFkO0FBQUEsVUFDRSxlQUFlLENBRGpCO0FBQUEsVUFFRSxrQkFBa0IsRUFGcEI7QUFHQSxVQUFJLElBQUksRUFBUjtBQUNBLFVBQUksSUFBSSxHQUFSO0FBQ0EsVUFBSSxhQUFhLG9DQUFqQjtBQUNBLFVBQUksZUFBZSwwQkFBbkI7QUFDQSxVQUFJLDBFQUN3QixVQUR4Qiw2TUFLdUIsWUFMdkIseWFBQUo7QUFXQSxRQUFFLFFBQUYsRUFDRyxJQURILENBQ1EsV0FEUixFQUVHLEdBRkgsQ0FFTyxZQUFZLENBQVosR0FBZ0IsWUFBaEIsR0FBK0IsQ0FBL0IsR0FBbUMsd0JBRjFDO0FBR0E7QUFDQSxRQUFFLFFBQUYsRUFBWSxHQUFaLENBQWdCLHVCQUFoQjtBQUNBLGVBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQyxLQUFqQyxDQUF1QyxPQUF2QyxHQUFpRCxPQUFqRDtBQUNBLGVBQVMsYUFBVCxDQUF1QixlQUF2QixFQUF3QyxLQUF4QyxDQUE4QyxPQUE5QyxHQUF3RCxPQUF4RDtBQUNBLGVBQVMsYUFBVCxDQUF1QixlQUF2QixFQUF3QyxTQUF4QyxDQUFrRCxHQUFsRCxDQUFzRCxVQUF0RDs7QUFFQSxRQUFFLFdBQUYsRUFBZSxRQUFmLENBQXdCLFVBQXhCO0FBQ0EsUUFBRSxtQkFBRixFQUF1QixFQUF2QixDQUEwQixPQUExQixFQUFtQyxhQUFLO0FBQ3RDLFVBQUUsV0FBRixFQUFlLFdBQWYsQ0FBMkIsVUFBM0I7QUFDQSxVQUFFLFFBQUYsRUFBWSxJQUFaO0FBQ0EsVUFBRSxlQUFGLEVBQW1CLElBQW5CO0FBQ0EsVUFBRSxVQUFGLEVBQWMsT0FBZCxDQUFzQixPQUF0QjtBQUNBLHlCQUFpQixFQUFqQjtBQUNELE9BTkQ7QUFPQSxRQUFFLGFBQUYsRUFBaUIsRUFBakIsQ0FBb0IsT0FBcEIsRUFBNkIsYUFBSztBQUNoQyxVQUFFLFdBQUYsRUFBZSxXQUFmLENBQTJCLFVBQTNCO0FBQ0EsVUFBRSxRQUFGLEVBQVksSUFBWjtBQUNBLFVBQUUsZUFBRixFQUFtQixJQUFuQjtBQUNBLFVBQUUsVUFBRixFQUFjLE9BQWQsQ0FBc0IsT0FBdEI7QUFDQSx5QkFBaUIsRUFBakI7QUFDRCxPQU5EO0FBT0EsUUFBRSxVQUFGLEVBQWMsUUFBZCxDQUF1QixRQUF2QjtBQUNBLFFBQUUsZUFBRixFQUFtQixFQUFuQixDQUFzQixPQUF0QixFQUErQixhQUFLO0FBQ2xDLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUMxQixrQkFBUSxDQUFSLEVBQVcsS0FBWDtBQUNBLGNBQUksZUFBZSxTQUFTLGFBQVQsQ0FBdUIsYUFBYSxDQUFwQyxDQUFuQjtBQUNBLGNBQUksY0FBYyxTQUFTLGFBQVQsQ0FBdUIsa0JBQWtCLENBQXpDLENBQWxCO0FBQ0Esc0JBQVksU0FBWixHQUF3QixrQkFBeEI7QUFDQSx1QkFBYSxTQUFiLEdBQXlCLEVBQXpCO0FBQ0Esc0JBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixLQUExQjtBQUNBLHNCQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsTUFBMUI7QUFDQSxzQkFBWSxLQUFaLENBQWtCLGVBQWxCLEdBQW9DLE9BQXBDO0FBQ0Q7QUFDRCxVQUFFLGVBQUYsRUFBbUIsUUFBbkIsQ0FBNEIsVUFBNUI7QUFDRCxPQVpEO0FBYUEsUUFBRSxjQUFGLEVBQWtCLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLGFBQUs7QUFDakMsVUFBRSxjQUFGO0FBQ0EsWUFBSSxJQUFJLFNBQVMsRUFBRSxNQUFGLENBQVMsRUFBVCxDQUFZLEtBQVosQ0FBa0IsQ0FBQyxDQUFuQixDQUFULENBQVI7QUFDQSxnQkFBUSxDQUFSLEVBQVcsS0FBWDtBQUNBLFlBQUksZUFBZSxTQUFTLGFBQVQsQ0FBdUIsYUFBYSxDQUFwQyxDQUFuQjtBQUNBLFlBQUksY0FBYyxTQUFTLGFBQVQsQ0FBdUIsa0JBQWtCLENBQXpDLENBQWxCO0FBQ0Esb0JBQVksU0FBWixHQUF3QixrQkFBeEI7QUFDQSxxQkFBYSxTQUFiLEdBQXlCLEVBQXpCO0FBQ0Esb0JBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixLQUExQjtBQUNBLG9CQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsTUFBMUI7QUFDQSxvQkFBWSxLQUFaLENBQWtCLGVBQWxCLEdBQW9DLE9BQXBDO0FBQ0QsT0FYRDs7QUFhQSxRQUFFLGVBQUYsRUFBbUIsV0FBbkIsQ0FBK0IsVUFBL0I7QUFDQSxVQUFJLFFBQVEsU0FBUixLQUFRLElBQUs7QUFDZixZQUFJLFFBQVEsU0FBUyxDQUFULENBQVo7QUFDQSxZQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLFFBQVEsQ0FBL0IsQ0FBZjtBQUNBLFlBQUksYUFBYSxTQUFTLGFBQVQsQ0FBdUIsaUJBQWlCLENBQXhDLENBQWpCO0FBQ0EsWUFBSSxjQUFjLFNBQVMsYUFBVCxDQUF1QixrQkFBa0IsQ0FBekMsQ0FBbEI7QUFDQSxZQUFJLGVBQWUsU0FBUyxhQUFULENBQXVCLGFBQWEsQ0FBcEMsQ0FBbkI7QUFDQSx3QkFBZ0IsQ0FBaEIsSUFBcUIsS0FBckI7QUFDQSxnQkFBUSxNQUNMLEtBREssQ0FDQyxJQURELEVBRUwsR0FGSyxHQUdMLEtBSEssQ0FHQyxHQUhELEVBSUwsR0FKSyxFQUFSO0FBS0EsZ0JBQVEsQ0FBUixJQUFhLElBQUksY0FBSixFQUFiO0FBQ0EsZ0JBQVEsQ0FBUixFQUFXLElBQVgsQ0FBZ0IsTUFBaEIsRUFBd0IsaUJBQXhCLEVBQTJDLElBQTNDO0FBQ0EsZ0JBQVEsQ0FBUixFQUFXLFlBQVgsR0FBMEIsYUFBMUI7QUFDQSxpQkFBUyxLQUFULENBQWUsT0FBZixHQUF5QixPQUF6QjtBQUNBLG1CQUFXLFNBQVgsR0FBdUIsS0FBdkI7QUFDQSxnQkFBUSxDQUFSLEVBQVcsT0FBWCxHQUFxQixLQUFyQjtBQUNBLGdCQUFRLENBQVIsRUFBVyxTQUFYLEdBQXVCLFlBQVk7QUFDakMsY0FBSSxZQUFZLE9BQWhCLEVBQ0UsUUFBUSxHQUFSLENBQ0UsNkJBQ0EsS0FEQSxHQUVBLEdBRkEsR0FHQSxRQUFRLENBQVIsRUFBVyxNQUhYLEdBSUEsR0FKQSxHQUtBLFFBQVEsQ0FBUixFQUFXLFVBTmI7QUFRRjtBQUNBLHNCQUFZLFNBQVosR0FBd0IsZUFBeEI7QUFDQSx1QkFBYSxTQUFiLEdBQXlCLEVBQXpCO0FBQ0Esc0JBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixLQUExQjtBQUNBLHNCQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsTUFBMUI7QUFDQSxzQkFBWSxLQUFaLENBQWtCLGVBQWxCLEdBQW9DLE9BQXBDO0FBQ0Esc0JBQVksU0FBWixDQUFzQixHQUF0QixDQUEwQixPQUExQjtBQUNBLDBCQUFnQixDQUFoQixJQUFxQixJQUFyQjtBQUNELFNBbEJEO0FBbUJBLGdCQUFRLENBQVIsRUFBVyxVQUFYLEdBQXdCLFVBQVUsR0FBVixFQUFlO0FBQ3JDLGNBQUksSUFBSSxnQkFBUixFQUEwQjtBQUN4QixnQkFBSSxrQkFBa0IsU0FBVSxJQUFJLE1BQUosR0FBYSxJQUFJLEtBQWxCLEdBQTJCLEdBQXBDLENBQXRCO0FBQ0Esd0JBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixrQkFBa0IsR0FBNUM7QUFDQSx5QkFBYSxTQUFiLEdBQXlCLGtCQUFrQixHQUEzQztBQUNEO0FBQ0YsU0FORDtBQU9BLGdCQUFRLENBQVIsRUFBVyxPQUFYLEdBQXFCLFlBQVk7QUFDL0IsY0FBSSxZQUFZLE9BQWhCLEVBQ0UsUUFBUSxHQUFSLENBQ0Usd0RBQ0EsS0FEQSxHQUVBLEdBRkEsR0FHQSxJQUFJLE1BSEosR0FJQSxHQUpBLEdBS0EsSUFBSSxVQU5OO0FBUUYseUJBQWUsZUFBZSxDQUE5QjtBQUNBLHVCQUFhLFNBQWIsR0FBeUIsT0FBekI7QUFDQSx1QkFBYSxLQUFiLENBQW1CLEtBQW5CLEdBQTJCLEtBQTNCO0FBQ0EsWUFBRSxXQUFXLENBQWIsRUFBZ0IsSUFBaEI7QUFDRCxTQWREO0FBZUEsZ0JBQVEsQ0FBUixFQUFXLFNBQVgsR0FBdUIsWUFBWTtBQUNqQyx5QkFBZSxlQUFlLENBQTlCO0FBQ0EsY0FBSSxDQUFDLGdCQUFnQixDQUFoQixDQUFMLEVBQXlCO0FBQ3ZCLHdCQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsTUFBMUI7QUFDQSx5QkFBYSxTQUFiLEdBQXlCLE1BQXpCO0FBQ0EsY0FBRSxXQUFXLENBQWIsRUFBZ0IsSUFBaEI7QUFDRDtBQUNELGNBQUksaUJBQWlCLENBQXJCLEVBQXdCO0FBQ3RCLGNBQUUsZUFBRixFQUFtQixJQUFuQjtBQUNBLGNBQUUsZUFBRixFQUNHLFdBREgsQ0FDZSxVQURmLEVBRUcsUUFGSCxDQUVZLFVBRlo7QUFHQSxjQUFFLFVBQUYsRUFBYyxPQUFkLENBQXNCLE9BQXRCO0FBQ0Q7QUFDRCxjQUFJLFlBQVksT0FBaEIsRUFDRSxRQUFRLEdBQVIsQ0FBWSxVQUFVLFlBQVYsR0FBeUIsYUFBckM7QUFDSCxTQWhCRDtBQWlCQSxnQkFBUSxDQUFSLEVBQVcsV0FBWCxHQUF5QixZQUFZO0FBQ25DLHlCQUFlLGVBQWUsQ0FBOUI7QUFDQSxzQkFBWSxLQUFaLENBQWtCLEtBQWxCLEdBQTBCLEdBQTFCO0FBQ0EsdUJBQWEsU0FBYixHQUF5QixJQUF6QjtBQUNELFNBSkQ7QUFLQSxnQkFBUSxDQUFSLEVBQVcsTUFBWCxHQUFvQixZQUFZO0FBQzlCLGNBQUksUUFBUSxDQUFSLEVBQVcsVUFBWCxLQUEwQixDQUExQixJQUErQixRQUFRLENBQVIsRUFBVyxNQUFYLEtBQXNCLEdBQXpELEVBQThEO0FBQzVELGdCQUFJLFdBQVcsRUFBZjtBQUNBLGdCQUFJLGNBQWMsUUFBUSxDQUFSLEVBQVcsaUJBQVgsQ0FBNkIscUJBQTdCLENBQWxCO0FBQ0EsZ0JBQUksZUFBZSxZQUFZLE9BQVosQ0FBb0IsWUFBcEIsTUFBc0MsQ0FBQyxDQUExRCxFQUE2RDtBQUMzRCxrQkFBSSxnQkFBZ0Isd0NBQXBCO0FBQ0Esa0JBQUksVUFBVSxjQUFjLElBQWQsQ0FBbUIsV0FBbkIsQ0FBZDtBQUNBLGtCQUFJLFdBQVcsSUFBWCxJQUFtQixRQUFRLENBQVIsQ0FBdkIsRUFDRSxXQUFXLFFBQVEsQ0FBUixFQUFXLE9BQVgsQ0FBbUIsT0FBbkIsRUFBNEIsRUFBNUIsQ0FBWDtBQUNIO0FBQ0QsZ0JBQUksT0FBTyxRQUFRLENBQVIsRUFBVyxpQkFBWCxDQUE2QixjQUE3QixDQUFYO0FBQ0EsZ0JBQUksT0FBTyxJQUFJLElBQUosQ0FBUyxDQUFDLEtBQUssUUFBTixDQUFULEVBQTBCO0FBQ25DLG9CQUFNO0FBRDZCLGFBQTFCLENBQVg7QUFHQSxnQkFBSSxPQUFPLE9BQU8sU0FBUCxDQUFpQixVQUF4QixLQUF1QyxXQUEzQyxFQUF3RDtBQUN0RDtBQUNBLHFCQUFPLFNBQVAsQ0FBaUIsVUFBakIsQ0FBNEIsSUFBNUIsRUFBa0MsUUFBbEM7QUFDRCxhQUhELE1BR087QUFDTCxrQkFBSSxNQUFNLE9BQU8sR0FBUCxJQUFjLE9BQU8sU0FBL0I7QUFDQSxrQkFBSSxjQUFjLElBQUksZUFBSixDQUFvQixJQUFwQixDQUFsQjs7QUFFQSxrQkFBSSxRQUFKLEVBQWM7QUFDWjtBQUNBLG9CQUFJLElBQUksU0FBUyxhQUFULENBQXVCLEdBQXZCLENBQVI7QUFDQTtBQUNBLG9CQUFJLE9BQU8sRUFBRSxRQUFULEtBQXNCLFdBQTFCLEVBQXVDO0FBQ3JDLHlCQUFPLFFBQVAsR0FBa0IsV0FBbEI7QUFDQSw0QkFBVSxLQUFWLENBQWdCLE9BQWhCLEdBQTBCLE1BQTFCO0FBQ0QsaUJBSEQsTUFHTztBQUNMLG9CQUFFLElBQUYsR0FBUyxXQUFUO0FBQ0Esb0JBQUUsUUFBRixHQUFhLFFBQWI7QUFDQSwyQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixDQUExQjtBQUNBLG9CQUFFLEtBQUY7QUFDQTtBQUNEO0FBQ0YsZUFkRCxNQWNPO0FBQ0wsdUJBQU8sSUFBUCxHQUFjLFdBQWQ7QUFDQTtBQUNEOztBQUVELHlCQUFXLFlBQVk7QUFDckIsb0JBQUksZUFBSixDQUFvQixXQUFwQjtBQUNELGVBRkQsRUFFRyxHQUZILEVBdkJLLENBeUJJO0FBQ1Y7QUFDRjtBQUNGLFNBN0NEO0FBOENBLGdCQUFRLENBQVIsRUFBVyxnQkFBWCxDQUNFLGNBREYsRUFFRSxtQ0FGRjtBQUlBLFlBQUksWUFBWSxPQUFoQixFQUNFLFFBQVEsR0FBUixDQUFZLFFBQVEsV0FBUixDQUFvQixZQUFwQixJQUFvQyxHQUFwQyxHQUEwQyxTQUFTLENBQVQsQ0FBdEQ7QUFDRixnQkFBUSxDQUFSLEVBQVcsSUFBWCxDQUNFLGdCQUFnQjtBQUNkLG9CQUFVLFFBQVEsV0FBUixDQUFvQixZQUFwQixJQUFvQyxHQUFwQyxHQUEwQyxTQUFTLENBQVQ7QUFEdEMsU0FBaEIsQ0FERjtBQUtELE9BMUlEO0FBMklBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLGNBQU0sQ0FBTjtBQUNEO0FBQ0QsUUFBRSxVQUFGLEVBQWMsV0FBZCxDQUEwQixRQUExQjtBQUNEOztBQUdEO0FBQ0E7QUFDQTtBQWhsQk8sR0FBUDtBQWlsQkQsQ0F6b0J1QixFQUF0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIEZpbGVzIGFuZCBGb2xkZXIgbW9kdWxlXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIHdpbmRvdy5maWxlTWFuYWdlciAgPSBmdW5jdGlvbigpIHtcbiAgXG4gIHdpbmRvdy5odG1sVXBsb2FkRG93bmxvYWRUZW1wbGF0ZSA9IGA8dWwgY2xhc3M9XCJwcmVsb2FkZXItZmlsZVwiIGlkPVwiRG93bmxvYWRmaWxlTGlzdFwiPlxuICAgIDxsaSBpZD1cImxpMFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTBcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0MFwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvbGk+XG4gICAgPGxpIGlkPVwibGkxXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIxXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQxXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQxXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9saT5cbiAgICA8bGkgaWQ9XCJsaTJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUyXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDJcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgIDwvZGl2PiAgIFxuICAgICAgICA8L2Rpdj5cbiAgICA8L2xpPlxuICAgIDxsaSBpZD1cImxpM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTNcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyM1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50M1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0M1wiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgPC9kaXY+ICAgXG4gICAgICAgIDwvZGl2PlxuICAgIDwvbGk+XG4gICAgPGxpIGlkPVwibGk0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lNFwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXI0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQ0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQ0XCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9saT5cbjwvdWw+YDtcblxuICAgIFxuICByZXR1cm4ge1xuICAgIHZhbGlkYXRlU2l6ZTogZiA9PiB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHNoYXJlRmlsZTogICgpID0+IHtcbiAgICBsZXQgc2VhcmNoVXNlck1vZGFsQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hVc2VyTW9kYWxDb250ZW50Jyk7XG4gICAgbGV0IEFkZFVzZXJNb2RhbENvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQWRkVXNlck1vZGFsQ29udGVudCcpO1xuICAgIGxldCBjb250YWluZXJPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb250YWluZXItb3ZlcmxheVwiKTtcblxuICAgIC8qKi9cbiAgICBzZWFyY2hVc2VyTW9kYWxDb250ZW50LmlubmVySFRNTCA9IGh0bWxTaGFyZUZpbGU7XG4gICAgQWRkVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc2VhcmNoVXNlck1vZGFsQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuLVNoYXJlRmlsZUNhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNlYXJjaFVzZXJNb2RhbENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgY29udGFpbmVyT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1TaGFyZUZpbGVBY2NlcHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gJ0RFQlVHJykgY29uc29sZS5sb2coZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc3RVc2VyTmFtZScpLnZhbHVlKTtcbiAgICAgIGlmIChSVU5NT0RFID09PSAnREVCVUcnKSBjb25zb2xlLmxvZyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRmlsZUV4cGlyYXRlRGF0ZScpLnZhbHVlKTtcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICBmaWxlTmFtZTogYVNlbGVjdGVkRmlsZXNbMF0sXG4gICAgICAgIGZpbGVTaXplOiBudWxsLFxuICAgICAgICBwYXRoOiBDVVJSRU5UX1BBVEgsXG4gICAgICAgIHVzZXJOYW1lOiBVc2VyTmFtZSxcbiAgICAgICAgZGVzdFVzZXJOYW1lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzdFVzZXJOYW1lJykudmFsdWUsXG4gICAgICAgIGV4cGlyYXRpb25EYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRmlsZUV4cGlyYXRlRGF0ZScpLnZhbHVlXG4gICAgICB9XG4gICAgICBleGVjRmV0Y2goXCIvZmlsZXMvc2hhcmVcIiwgXCJQT1NUXCIsIGRhdGEpXG4gICAgICAgIC50aGVuKChkKSA9PiB7XG4gICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZCk7XG4gICAgICAgICAgaWYgKGQuc3RhdHVzID09PSAnT0snKSB7XG4gICAgICAgICAgICBzZWFyY2hVc2VyTW9kYWxDb250ZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGNvbnRhaW5lck92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgc2VuZEVtYWlsKGQuZGF0YS5EZXN0VXNlcixcbiAgICAgICAgICAgICAgXCJtYmVybWVqbzE3QGdtYWlsLmNvbVwiLFxuICAgICAgICAgICAgICBcIlVSTCBwYXJhIGRlc2NhcmdhIGRlIGFyY2hpdm9cIixcbiAgICAgICAgICAgICAgYERlc2NhcmdhIGRlIGFyY2hpdm8gaHR0cHM6Ly8xOTQuMjI0LjE5NC4xMzQvZmlsZXMvc2hhcmUvJHtkLmRhdGEuVXJsQ29kZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICBzaG93VG9hc3QoXCJFcnJvciBhbCBjb21wYXJ0aXIgYXJjaGl2byBcIiArIGRhdGEuZmlsZU5hbWUgKyBcIi48YnI+RXJyOlwiICsgZSwgXCJlcnJcIik7XG4gICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuIGRlbGV0ZVNlbGVjdGVkOiAoKSA9PntcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxuICAgICAgY29uc29sZS5sb2coXCJhU2VsZWN0ZWRGb2xkZXJzOiBcIiwgYVNlbGVjdGVkRm9sZGVycy5sZW5ndGgpO1xuICAgIGlmIChhU2VsZWN0ZWRGb2xkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNob3dEaWFsb2dZZXNObyhcbiAgICAgICAgXCJEZWxldGUgZm9sZGVzXCIsXG4gICAgICAgIFwiRGVsZXRlIHNlbGVjdGVkIGZvbGRlcnM/XCIsXG4gICAgICAgIHkgPT4ge1xuICAgICAgICAgICQud2hlbihkZWxldGVGb2xkZXIoQ1VSUkVOVF9QQVRIKSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKGFTZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgc2hvd0RpYWxvZ1llc05vKFxuICAgICAgICAgICAgICAgIFwiRGVsZXRlIEZpbGVzXCIsXG4gICAgICAgICAgICAgICAgXCJEZWxldGUgc2VsZWN0ZWQgZmlsZXM/XCIsXG4gICAgICAgICAgICAgICAgeSA9PiB7XG4gICAgICAgICAgICAgICAgICBkZWxldGVGaWxlKENVUlJFTlRfUEFUSCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiRGVsZXRlIEZpbGVzIENhbmNlbGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVmcmVzaFwiKS5jbGljaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBuID0+IHtcbiAgICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIkRlbGV0ZSBGb2xkZXIgQ2FuY2VsZWRcIik7XG4gICAgICAgICAgaWYgKGFTZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNob3dEaWFsb2dZZXNObyhcbiAgICAgICAgICAgICAgXCJEZWxldGUgRmlsZXNcIixcbiAgICAgICAgICAgICAgXCJEZWxldGUgc2VsZWN0ZWQgZmlsZXM/XCIsXG4gICAgICAgICAgICAgIHkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZUZpbGUoQ1VSUkVOVF9QQVRIKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGUgRmlsZXMgQ2FuY2VsZWRcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaG93RGlhbG9nWWVzTm8oXG4gICAgICAgICAgXCJEZWxldGUgRmlsZXNcIixcbiAgICAgICAgICBcIkRlbGV0ZSBzZWxlY3RlZCBmaWxlcz9cIixcbiAgICAgICAgICB5ID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZUZpbGUoQ1VSUkVOVF9QQVRIKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG4gPT4ge1xuICAgICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGUgRmlsZXMgQ2FuY2VsZWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB1cGxvYWQ6IChUb2tlbikgPT4ge1xuICAgIGxldCB3ID0gMzI7XG4gICAgbGV0IGggPSA0NDA7XG4gICAgbGV0IGFMaXN0SGFuZGxlciA9IFtdO1xuICAgIGxldCBoYW5kbGVyQ291bnRlciA9IDA7XG4gICAgbGV0IE1vZGFsVGl0bGUgPSBcIlN1YmlkYSBkZSBhcmNoaXZvc1wiO1xuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGxhYmVsIGNsYXNzPVwiZmlsZS1pbnB1dCB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCI+U2VsZWN0IGZpbGVzPGlucHV0IGlkPVwidXBsb2FkLWlucHV0XCIgdHlwZT1cImZpbGVcIiBuYW1lPVwidXBsb2Fkc1tdXCIgbXVsdGlwbGU9XCJtdWx0aXBsZVwiIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlXCI+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwic0ZpbGVzXCI+TmluZ3VuIGFyY2hpdm8gc2VsZWNjaW9uYWRvPC9zcGFuPmA7XG4gICAgTW9kYWxDb250ZW50ICs9IGh0bWxVcGxvYWREb3dubG9hZFRlbXBsYXRlO1xuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cD4ke01vZGFsQ29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLTxpbnB1dCB0eXBlPVwidGV4dFwiIGhpZGRlbiBpZD1cImRlc3RQYXRoXCIgbmFtZT1cImRlc3RQYXRoXCIgdmFsdWU9XCJcIi8+LS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DYW5jZWxBbGxcIiBocmVmPVwiIyFcIj5DYW5jZWwgdXBsb2FkczwvYT4gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2xvc2VVcGxvYWRcIiBocmVmPVwiIyFcIj5DbG9zZTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuXG4gICAgJChcIiN1cGxvYWRcIilcbiAgICAgIC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpXG4gICAgICAuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcblxuICAgIGZ1bmN0aW9uIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgbkZpbGUsIGZpbGVOYW1lKSB7XG4gICAgICAkKFwiI2xpXCIgKyBuRmlsZSkuc2hvdygpO1xuICAgICAgJChcIiNsaS1maWxlbmFtZVwiICsgbkZpbGUpLnNob3coKTtcbiAgICAgICQoXCIjbGktZmlsZW5hbWVcIiArIG5GaWxlKS5odG1sKGZpbGVOYW1lKTtcbiAgICAgIGxldCByZWFscGF0aCA9IGdlbmVyYWwuZ2V0UmVhbFBhdGgoQ1VSUkVOVF9QQVRIKTtcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiVXBsb2FkOkNVUlJFTlRfUEFUSCBcIiArIENVUlJFTlRfUEFUSCk7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIlVwbG9hZDpSRUFMX1JPT1RfUEFUSCBcIiArIFJFQUxfUk9PVF9QQVRIKTtcbiAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKFwiVXBsb2FkOnJlYWxQYXRoIFwiICsgcmVhbHBhdGgpO1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9maWxlcy91cGxvYWQ/ZGVzdFBhdGg9XCIgKyByZWFscGF0aCxcbiAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgdGltZW91dDogMjkwMDAwLFxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyT2JqKSB7XG4gICAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgVG9rZW4pO1xuICAgICAgICAgIHhock9iai5zZXRSZXF1ZXN0SGVhZGVyKFwiZGVzdFBhdGhcIiwgcmVhbHBhdGgpO1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlTmFtZSArIFwidXBsb2FkIHN1Y2Nlc3NmdWwhXFxuXCIgKyBkYXRhKTtcbiAgICAgICAgICBzaG93VG9hc3QoZmlsZU5hbWUgKyBcIiB1cGxvYWRlZCBzdWNlc3NmdWxseVwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgJChcIiNhYm9ydFwiICsgbkZpbGUpLmhpZGUoKTtcbiAgICAgICAgICAkKFwiI3JlZnJlc2hcIikudHJpZ2dlcihcImNsaWNrXCIpO1xuICAgICAgICAgIGhhbmRsZXJDb3VudGVyID0gaGFuZGxlckNvdW50ZXIgLSAxO1xuICAgICAgICAgIGlmIChoYW5kbGVyQ291bnRlciA9PSAwKSB7XG4gICAgICAgICAgICAkKFwiI2J0bkNhbmNlbEFsbFwiKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKVxuICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHhocjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGFMaXN0SGFuZGxlcltuRmlsZV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICBsZXQgcGVyY2VudENvbXBsZXRlID0gMDtcbiAgICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJwcm9ncmVzc1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xuICAgICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSA9IHBhcnNlSW50KHBlcmNlbnRDb21wbGV0ZSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgJChcIiNwZXJjZW50XCIgKyBuRmlsZSkudGV4dChwZXJjZW50Q29tcGxldGUgKyBcIiVcIik7XG4gICAgICAgICAgICAgICAgJChcIiNwcm9ncmVzcy1iYXJcIiArIG5GaWxlKS53aWR0aChwZXJjZW50Q29tcGxldGUgKyBcIiVcIik7XG4gICAgICAgICAgICAgICAgLyogaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgJCgnI3JlZnJlc2gnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICB9ICovXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIGFMaXN0SGFuZGxlcltuRmlsZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgICQoXCIjbW9kYWxcIilcbiAgICAgIC5odG1sKGh0bWxDb250ZW50KVxuICAgICAgLmNzcyhcIndpZHRoOiBcIiArIHcgKyBcIiU7aGVpZ2h0OiBcIiArIGggKyBcInB4O3RleHQtYWxpZ246IGNlbnRlcjtcIik7XG4gICAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xuICAgICQoXCIubW9kYWwtY29udGFpbmVyXCIpLmNzcyhcIndpZHRoOiA0MCUgIWltcG9ydGFudFwiKTtcbiAgICAkKFwiLmZpbGUtaW5wdXRcIikuc2hvdygpO1xuICAgICQoXCIjbW9kYWxcIikuc2hvdygpO1xuICAgICQoXCIjbGVhbi1vdmVybGF5XCIpLnNob3coKTtcbiAgICAkKFwiI2J0bkNsb3NlVXBsb2FkXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAkKFwiI3VwbG9hZFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XG4gICAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJChcIiNtb2RhbENsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAkKFwiI3VwbG9hZFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XG4gICAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJChcIiNidG5DYW5jZWxBbGxcIikucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAkKFwiLm1vZGFsX2Nsb3NlXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlKTtcbiAgICAgIGxldCBuID0gcGFyc2VJbnQoZS50YXJnZXQuaWQuc2xpY2UoLTEpKTtcbiAgICAgIGFMaXN0SGFuZGxlcltuXS5hYm9ydCgpO1xuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgbik7XG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgbik7XG4gICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIkNhbmNlbGVkIGJ5IHVzZXJcIjtcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICQoZS50YXJnZXQpLmhpZGUoKTtcbiAgICB9KTtcbiAgICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCA0OyB4KyspIHtcbiAgICAgICAgYUxpc3RIYW5kbGVyW3hdLmFib3J0KCk7XG4gICAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlcmNlbnRcIiArIHgpO1xuICAgICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgeCk7XG4gICAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IFwiQ2FuY2VsZWQgYnkgdXNlclwiO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICB9XG4gICAgICAkKFwiI2J0bkNhbmNlbEFsbFwiKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgIH0pO1xuICAgICQoXCIjdXBsb2FkLWlucHV0XCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgZmlsZXMgPSAkKCcjdXBsb2FkLWlucHV0JykuZ2V0KDApLmZpbGVzO1xuICAgICAgICBoYW5kbGVyQ291bnRlciA9IGZpbGVzLmxlbmd0aDtcbiAgICAgICAgZmlsZXMubGVuZ3RoID4gMCA/XG4gICAgICAgICAgJChcIiNzRmlsZXNcIikuaHRtbChmaWxlcy5sZW5ndGggKyBcIiBhcmNoaXZvcyBzZWxlY2Npb25hZG9zLlwiKSA6XG4gICAgICAgICAgJChcIiNzRmlsZXNcIikuaHRtbChmaWxlc1swXSk7XG4gICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGZpbGVzLmxlbmd0aCk7XG4gICAgICAgICQoXCIuZmlsZS1pbnB1dFwiKS5oaWRlKCk7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwICYmIGZpbGVzLmxlbmd0aCA8PSA1KSB7XG4gICAgICAgICAgJChcIiNidG5DbG9zZVVwbG9hZFwiKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIilcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbaV07XG4gICAgICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgZmlsZXMgdG8gZm9ybURhdGEgb2JqZWN0IGZvciB0aGUgZGF0YSBwYXlsb2FkXG5cbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVwbG9hZHNbXVwiLCBmaWxlLCBmaWxlLm5hbWUpO1xuICAgICAgICAgICAgZm5VcGxvYWRGaWxlKGZvcm1EYXRhLCBpLCBmaWxlLm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKFwiI2J0bkNsb3NlVXBsb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2hvd1RvYXN0KFwiTm8gc2UgcHVlZGVuIHN1YmlyIG3DoXMgZGUgNSBhcmNoaXZvcyBhIGxhIHZlelwiLCBcImVyclwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIG5ld0ZvbGRlcjogKGZvbGRlck5hbWUpID0+IHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkF1dGhvcml6YXRpb25cIiwgXCJCZWFyZXIgXCIgKyBUb2tlbik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIGZldGNoKFwiL2ZpbGVzL25ld2ZvbGRlclwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBwYXRoOiBnZW5lcmFsLmdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCksXG4gICAgICAgICAgZm9sZGVyTmFtZTogZm9sZGVyTmFtZVxuICAgICAgICB9KSxcbiAgICAgICAgdGltZW91dDogMTAwMDBcbiAgICAgIH0pXG4gICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcbiAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSBcIk9LXCIpIHtcbiAgICAgICAgICAkKFwiI21vZGFsXCIpLmhpZGUoKTtcbiAgICAgICAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gICAgICAgICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICAgICAgICBzaG93VG9hc3QoXCJDcmVhZGEgbnVldmEgY2FycGV0YSBcIiArIGRhdGEuZGF0YS5mb2xkZXJOYW1lLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIH0pO1xuICB9LFxuICBcbiAgZGVsZXRlRmlsZTogKHBhdGgpID0+IHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IGFGID0gYVNlbGVjdGVkRmlsZXMuc2xpY2UoKTtcbiAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhhRik7XG4gICAgaGVhZGVycy5hcHBlbmQoXCJBdXRob3JpemF0aW9uXCIsIFwiQmVhcmVyIFwiICsgVG9rZW4pO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAkKFwiI3dhaXRpbmdcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgZm9yICh4ID0gMDsgeCA8IGFGLmxlbmd0aDsgeCsrKSB7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhcIkRlbGV0aW5nIGZpbGUgXCIgKyBhRlt4XSArIFwiIC4uLlwiKTtcbiAgICAgIGZldGNoKFwiL2ZpbGVzL2RlbGV0ZVwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHBhdGg6IGdlbmVyYWwuZ2V0UmVhbFBhdGgocGF0aCksXG4gICAgICAgICAgICBmaWxlTmFtZTogYUZbeF1cbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0aW1lb3V0OiA3MjAwMDBcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSBcIk9LXCIpIHtcbiAgICAgICAgICAgIGFTZWxlY3RlZEZpbGVzLnNoaWZ0KCk7XG4gICAgICAgICAgICAkKFwiLnRvYXN0XCIpXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcInN1Y2Nlc3NcIilcbiAgICAgICAgICAgICAgLmFkZENsYXNzKFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHNob3dUb2FzdChcIkFyY2hpdm8gXCIgKyBkYXRhLmRhdGEuZmlsZU5hbWUgKyBcIiBib3JyYWRvXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKSBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICQoXCIudG9hc3RcIilcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImVyclwiKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiZXJyXCIpO1xuICAgICAgICAgIHNob3dUb2FzdChlcnIsIFwiZXJyXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJChcIiN3YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICB9LFxuXG4gIGRlbGV0ZUZvbGRlcjogKHBhdGgpPT4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgYUYgPSBhU2VsZWN0ZWRGb2xkZXJzLnNsaWNlKCk7XG4gICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coYUYpO1xuICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBcIkJlYXJlciBcIiArIFRva2VuKTtcbiAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgJChcIiN3YWl0aW5nXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIGZvciAoeCA9IDA7IHggPCBhRi5sZW5ndGg7IHgrKykge1xuICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coXCJEZWxldGluZyBmb2xkZXIgXCIgKyBhRlt4XSArIFwiIC4uLlwiKTtcbiAgICAgIGZldGNoKFwiL2ZpbGVzL2RlbGV0ZVwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHBhdGg6IGdlbmVyYWwuZ2V0UmVhbFBhdGgocGF0aCksXG4gICAgICAgICAgICBmaWxlTmFtZTogYUZbeF1cbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0aW1lb3V0OiA3MjAwMDBcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgIGlmIChSVU5NT0RFID09PSBcIkRFQlVHXCIpIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSBcIk9LXCIpIHtcbiAgICAgICAgICAgICQoXCIudG9hc3RcIilcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwic3VjY2Vzc1wiKVxuICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgc2hvd1RvYXN0KFwiQ2FycGV0YSBcIiArIGRhdGEuZGF0YS5maWxlTmFtZSArIFwiIGJvcnJhZGFcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5zaGlmdCgpO1xuICAgICAgICAgICAgJChcIiN3YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgaWYgKFJVTk1PREUgPT09IFwiREVCVUdcIikgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gIH0sXG5cbiAgLy9UT0RPOiBPcHRpbWl6YXIgcmVuZGVyaXphZG8gZGUgZWxlbWVudG9zIGxpXG4gIC8vaW5jb3Jwb3JhbmRvIGVsIGNvbnRlbmlkbyBlbiBlbCBidWNsZSBfbG9vcFxuICBkb3dubG9hZDogKGZpbGVMaXN0LCB0ZXh0KSA9PiB7XG4gICAgbGV0IHJlcUxpc3QgPSBbXSxcbiAgICAgIGhhbmRsZXJDb3VudCA9IDAsXG4gICAgICByZXNwb25zZVRpbWVvdXQgPSBbXTtcbiAgICBsZXQgdyA9IDMyO1xuICAgIGxldCBoID0gNDQwO1xuICAgIGxldCBNb2RhbFRpdGxlID0gXCJEZXNjYXJnYSBkZSBhcmNoaXZvcyBzZWxlY2Npb25hZG9zXCI7XG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGh0bWxVcGxvYWREb3dubG9hZFRlbXBsYXRlO1xuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7TW9kYWxDb250ZW50fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNhbmNlbEFsbFwiIGhyZWY9XCIjIVwiPkNhbmNlbCBkb3dubG9hZHM8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNsb3NlRG93bmxvYWRcIiBocmVmPVwiIyFcIj5DZXJyYXI8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAkKFwiI21vZGFsXCIpXG4gICAgICAuaHRtbChodG1sQ29udGVudClcbiAgICAgIC5jc3MoXCJ3aWR0aDogXCIgKyB3ICsgXCIlO2hlaWdodDogXCIgKyBoICsgXCJweDt0ZXh0LWFsaWduOiBjZW50ZXI7XCIpO1xuICAgIC8vJCgnLm1vZGFsLWNvbnRlbnQnKS5jc3MoJ3dpZHRoOiAzNTBweDsnKTtcbiAgICAkKFwiLm1vZGFsXCIpLmNzcyhcIndpZHRoOiA0MCUgIWltcG9ydGFudFwiKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vZGFsXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsZWFuLW92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2J0bkNhbmNlbEFsbFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG5cbiAgICAkKFwiI2Rvd25sb2FkXCIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgJChcIiNidG5DbG9zZURvd25sb2FkXCIpLm9uKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAkKFwiI2Rvd25sb2FkXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAkKFwiI21vZGFsXCIpLmhpZGUoKTtcbiAgICAgICQoXCIjbGVhbi1vdmVybGF5XCIpLmhpZGUoKTtcbiAgICAgICQoXCIjcmVmcmVzaFwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICBhU2VsZWN0ZWRGaWxlcyA9IFtdO1xuICAgIH0pO1xuICAgICQoXCIjbW9kYWxDbG9zZVwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgJChcIiNkb3dubG9hZFwiKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgJChcIiNtb2RhbFwiKS5oaWRlKCk7XG4gICAgICAkKFwiI2xlYW4tb3ZlcmxheVwiKS5oaWRlKCk7XG4gICAgICAkKFwiI3JlZnJlc2hcIikudHJpZ2dlcihcImNsaWNrXCIpO1xuICAgICAgYVNlbGVjdGVkRmlsZXMgPSBbXTtcbiAgICB9KTtcbiAgICAkKFwiI3dhaXRpbmdcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgJChcIiNidG5DYW5jZWxBbGxcIikub24oXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgNDsgeCsrKSB7XG4gICAgICAgIHJlcUxpc3RbeF0uYWJvcnQoKTtcbiAgICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgeCk7XG4gICAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyB4KTtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gXCJDYW5jZWxlZCBieSB1c2VyXCI7XG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgIH1cbiAgICAgICQoXCIjYnRuQ2FuY2VsQWxsXCIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgfSk7XG4gICAgJChcIi5tb2RhbF9jbG9zZVwiKS5vbihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbGV0IG4gPSBwYXJzZUludChlLnRhcmdldC5pZC5zbGljZSgtMSkpO1xuICAgICAgcmVxTGlzdFtuXS5hYm9ydCgpO1xuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudFwiICsgbik7XG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2dyZXNzLWJhclwiICsgbik7XG4gICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBcIkNhbmNlbGVkIGJ5IHVzZXJcIjtcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICB9KTtcblxuICAgICQoXCIjYnRuQ2FuY2VsQWxsXCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgbGV0IF9sb29wID0gaSA9PiB7XG4gICAgICBsZXQgZk5hbWUgPSBmaWxlTGlzdFtpXTtcbiAgICAgIGxldCBsaU51bWJlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGlcIiArIGkpO1xuICAgICAgbGV0IGxpRmlsZW5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xpLWZpbGVuYW1lXCIgKyBpKTtcbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZ3Jlc3MtYmFyXCIgKyBpKTtcbiAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlcmNlbnRcIiArIGkpO1xuICAgICAgcmVzcG9uc2VUaW1lb3V0W2ldID0gZmFsc2U7XG4gICAgICBmTmFtZSA9IGZOYW1lXG4gICAgICAgIC5zcGxpdChcIlxcXFxcIilcbiAgICAgICAgLnBvcCgpXG4gICAgICAgIC5zcGxpdChcIi9cIilcbiAgICAgICAgLnBvcCgpO1xuICAgICAgcmVxTGlzdFtpXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmVxTGlzdFtpXS5vcGVuKFwiUE9TVFwiLCBcIi9maWxlcy9kb3dubG9hZFwiLCB0cnVlKTtcbiAgICAgIHJlcUxpc3RbaV0ucmVzcG9uc2VUeXBlID0gXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgbGlOdW1iZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGxpRmlsZW5hbWUuaW5uZXJIVE1MID0gZk5hbWU7XG4gICAgICByZXFMaXN0W2ldLnRpbWVvdXQgPSAzNjAwMDtcbiAgICAgIHJlcUxpc3RbaV0ub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxuICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCIqKiBUaW1lb3V0IGVycm9yIC0+RmlsZTpcIiArXG4gICAgICAgICAgICBmTmFtZSArXG4gICAgICAgICAgICBcIiBcIiArXG4gICAgICAgICAgICByZXFMaXN0W2ldLnN0YXR1cyArXG4gICAgICAgICAgICBcIiBcIiArXG4gICAgICAgICAgICByZXFMaXN0W2ldLnN0YXR1c1RleHRcbiAgICAgICAgICApO1xuICAgICAgICAvLyBoYW5kbGVyQ291bnQgPSBoYW5kbGVyQ291bnQgLSAxXG4gICAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IFwiVGltZW91dCBFcnJvclwiO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoXCJibGlua1wiKTtcbiAgICAgICAgcmVzcG9uc2VUaW1lb3V0W2ldID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIHZhciBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludCgoZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkgKiAxMDApO1xuICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcGVyY2VudENvbXBsZXRlICsgXCIlXCI7XG4gICAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IHBlcmNlbnRDb21wbGV0ZSArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxTGlzdFtpXS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxuICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCIqKiBBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgdGhlIHRyYW5zYWN0aW9uIC0+RmlsZTpcIiArXG4gICAgICAgICAgICBmTmFtZSArXG4gICAgICAgICAgICBcIiBcIiArXG4gICAgICAgICAgICByZXEuc3RhdHVzICtcbiAgICAgICAgICAgIFwiIFwiICtcbiAgICAgICAgICAgIHJlcS5zdGF0dXNUZXh0XG4gICAgICAgICAgKTtcbiAgICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMTtcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiRXJyb3JcIjtcbiAgICAgICAgcGVyY2VudExhYmVsLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgJChcIiNhYm9ydFwiICsgaSkuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgIHJlcUxpc3RbaV0ub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBoYW5kbGVyQ291bnQgPSBoYW5kbGVyQ291bnQgLSAxO1xuICAgICAgICBpZiAoIXJlc3BvbnNlVGltZW91dFtpXSkge1xuICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiMTAwJVwiO1xuICAgICAgICAgICQoXCIjYWJvcnRcIiArIGkpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZGxlckNvdW50ID09PSAwKSB7XG4gICAgICAgICAgJChcIiNkb3dubG9hZC1lbmRcIikuc2hvdygpO1xuICAgICAgICAgICQoXCIjYnRuQ2FuY2VsQWxsXCIpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJkaXNhYmxlZFwiKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgJChcIiNyZWZyZXNoXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmlsZSBcIiArIGhhbmRsZXJDb3VudCArIFwiIGRvd25sb2FkZWRcIik7XG4gICAgICB9O1xuICAgICAgcmVxTGlzdFtpXS5vbmxvYWRzdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50ICsgMTtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBcIjBcIjtcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IFwiMCVcIjtcbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHJlcUxpc3RbaV0ucmVhZHlTdGF0ZSA9PT0gNCAmJiByZXFMaXN0W2ldLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gXCJcIjtcbiAgICAgICAgICB2YXIgZGlzcG9zaXRpb24gPSByZXFMaXN0W2ldLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiKTtcbiAgICAgICAgICBpZiAoZGlzcG9zaXRpb24gJiYgZGlzcG9zaXRpb24uaW5kZXhPZihcImF0dGFjaG1lbnRcIikgIT09IC0xKSB7XG4gICAgICAgICAgICB2YXIgZmlsZW5hbWVSZWdleCA9IC9maWxlbmFtZVteOz1cXG5dKj0oKFsnXCJdKS4qP1xcMnxbXjtcXG5dKikvO1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBmaWxlbmFtZVJlZ2V4LmV4ZWMoZGlzcG9zaXRpb24pO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgIT0gbnVsbCAmJiBtYXRjaGVzWzFdKVxuICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoZXNbMV0ucmVwbGFjZSgvWydcIl0vZywgXCJcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0eXBlID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKTtcbiAgICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge1xuICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAvLyBJRSB3b3JrYXJvdW5kIGZvciBcIkhUTUw3MDA3OiBPbmUgb3IgbW9yZSBibG9iIFVSTHMgd2VyZSByZXZva2VkIGJ5IGNsb3NpbmcgdGhlIGJsb2IgZm9yIHdoaWNoIHRoZXkgd2VyZSBjcmVhdGVkLiBUaGVzZSBVUkxzIHdpbGwgbm8gbG9uZ2VyIHJlc29sdmUgYXMgdGhlIGRhdGEgYmFja2luZyB0aGUgVVJMIGhhcyBiZWVuIGZyZWVkLlwiXG4gICAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYmxvYiwgZmlsZW5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuICAgICAgICAgICAgdmFyIGRvd25sb2FkVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuICAgICAgICAgICAgaWYgKGZpbGVuYW1lKSB7XG4gICAgICAgICAgICAgIC8vIHVzZSBIVE1MNSBhW2Rvd25sb2FkXSBhdHRyaWJ1dGUgdG8gc3BlY2lmeSBmaWxlbmFtZVxuICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAvLyBzYWZhcmkgZG9lc24ndCBzdXBwb3J0IHRoaXMgeWV0XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgYS5kb3dubG9hZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRvd25sb2FkVXJsO1xuICAgICAgICAgICAgICAgIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xuICAgICAgICAgICAgICAgIC8vIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAgIC8vIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGRvd25sb2FkVXJsKTtcbiAgICAgICAgICAgIH0sIDEwMCk7IC8vIGNsZWFudXBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLnNldFJlcXVlc3RIZWFkZXIoXG4gICAgICAgIFwiQ29udGVudC10eXBlXCIsXG4gICAgICAgIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcbiAgICAgICk7XG4gICAgICBpZiAoUlVOTU9ERSA9PT0gXCJERUJVR1wiKVxuICAgICAgICBjb25zb2xlLmxvZyhnZW5lcmFsLmdldFJlYWxQYXRoKENVUlJFTlRfUEFUSCkgKyBcIi9cIiArIGZpbGVMaXN0W2ldKTtcbiAgICAgIHJlcUxpc3RbaV0uc2VuZChcbiAgICAgICAgc2VyaWFsaXplT2JqZWN0KHtcbiAgICAgICAgICBmaWxlbmFtZTogZ2VuZXJhbC5nZXRSZWFsUGF0aChDVVJSRU5UX1BBVEgpICsgXCIvXCIgKyBmaWxlTGlzdFtpXVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIF9sb29wKGkpO1xuICAgIH1cbiAgICAkKFwiI3dhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gIH1cbn1cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLyBFbmQgRmlsZXMgYW5kIGZGb2xkZXJzIG1vZHVsZVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbn0oKTtcbiJdfQ==
