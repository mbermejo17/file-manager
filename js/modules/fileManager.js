import moment from "moment";
import axios from "axios";
import { getRealPath, serializeObject } from "./general";
////////////////////////////////////
// Files and Folder module
///////////////////////////////////

let htmlShareFile = `<div id="shareFileModal">
                        <div id="modal-header">
                          <h5>Share File</h5>
                          <a class="modal_close" id="sharedModalClose" href="#hola"></a>
                        </div>
                        <br>
                        <div class="row" id="">
                          <div class="input-field col s1 m1">
                          </div>
                          <div class="input-field col s5">
                            
                            <input id="destUserName" type="email" autocomplete="off" pattern=".+@globex.com" required/>
                            <label for="destUserName">Send URL to</label>
                          </div>
                          <div class="input-field col s3 m3">
                              <input class="datepicker" id="FileExpirateDate" type="date"/>
                              <label for="FileExpirateDate">Expiration Date</label>
                          </div>
                          <div class="input-field col s3 m3">
                          </div>
                        </div>  
                        <div class="row"> 
                          <div class="input-field col s9 m9">
                            <input class="check" id="delFileAfterExpired" type="checkbox">
                            <label class="checkbox" for="delFileAfterExpired"></label> 
                            <span>Delete file when expires</span>  
                          </div>
                          <div class="input-field col s1 m1">
                            <button class="waves-effect waves-teal btn-flat btn2-unify right" id="btn-ShareFileCancel" type="submit" name="action">Cancel</button>
                          </div>
                          <div class="input-field col s1 m1">  
                            <button class="waves-effect waves-teal btn-flat btn2-unify left" id="btn-ShareFileAccept" type="submit" name="action">Send</button>
                          </div>
                        </div>    
                      </div>`;

let htmlUploadDownloadTemplate = `<ul class="preloader-file" id="DownloadfileList">
    <li id="li0">
        <div class="li-content">
            <div class="li-filename" id="li-filename0"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar0"></div>
                <div class="percent" id="percent0"></div>
                <a class="modal_close" id="abort0" href="#"></a>
            </div>
        </div>
    </li>
    <li id="li1">
        <div class="li-content">
            <div class="li-filename" id="li-filename1"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar1"></div>
                <div class="percent" id="percent1"></div>
                <a class="modal_close" id="abort1" href="#"></a>
            </div>
        </div>
    </li>
    <li id="li2">
        <div class="li-content">
            <div class="li-filename" id="li-filename2"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar2"></div>
                <div class="percent" id="percent2"></div>
                <a class="modal_close" id="abort2" href="#"></a>
            </div>   
        </div>
    </li>
    <li id="li3">
        <div class="li-content">
            <div class="li-filename" id="li-filename3"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar3"></div>
                <div class="percent" id="percent3"></div>
                <a class="modal_close" id="abort3" href="#"></a>
            </div>   
        </div>
    </li>
    <li id="li4">
        <div class="li-content">
            <div class="li-filename" id="li-filename4"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar4"></div>
                <div class="percent" id="percent4"></div>
                <a class="modal_close" id="abort4" href="#"></a>
            </div>
        </div>
    </li>
</ul>`;

const sendEmail = (toEmail, fromEmail, subject, body_message) => {
  let mailto_link =
    "mailto:" + toEmail + "?subject=" + subject + "&body=" + body_message;
  let win = window.open(mailto_link, "emailWindow");
  if (win && window.open && !window.closed) window.close();
};

let validateSize = f => {
  return true;
};
export function shareFile() {
  let searchUserModalContent = document.getElementById(
    "searchUserModalContent"
  );
  let AddUserModalContent = document.getElementById("AddUserModalContent");
  let containerOverlay = document.querySelector(".container-overlay");
  let validations = {
    email: [
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      "Please enter a valid email address"
    ]
  };

  /**/
  searchUserModalContent.innerHTML = htmlShareFile;

  AddUserModalContent.style.display = "none";
  searchUserModalContent.style.display = "block";
  containerOverlay.style.display = "block";
  document
    .getElementById("btn-ShareFileCancel")
    .addEventListener("click", e => {
      e.preventDefault();
      searchUserModalContent.style.display = "none";
      containerOverlay.style.display = "none";
    });

  document.getElementById("sharedModalClose").addEventListener("click", e => {
    e.preventDefault();
    searchUserModalContent.style.display = "none";
    containerOverlay.style.display = "none";
  });

  document
    .getElementById("btn-ShareFileAccept")
    .addEventListener("click", e => {
      e.preventDefault();
      let tmpDate = new Date(document.getElementById("FileExpirateDate").value);
      let strTime = "";
      if (document.getElementById("FileExpirateDate").value === "") {
        strTime = moment(Date.now()).format("YYYY/MM/DD h:mm");
      } else {
        strTime = moment(
          document.getElementById("FileExpirateDate").value
        ).format("YYYY/MM/DD h:mm");
      }

      if (document.getElementById("destUserName").value !== "") {
        if (userData.RunMode === "DEBUG")
          console.log(document.getElementById("destUserName").value);
        if (userData.RunMode === "DEBUG")
          console.log(document.getElementById("FileExpirateDate").value);
        let data = {
          fileName: appData.aSelectedFiles[0],
          fileSize: null,
          path: appData.currentPath,
          userName: userData.UserName,
          destUserName: document.getElementById("destUserName").value,
          expirationDate: strTime,
          unixDate: moment(strTime).unix(),
          deleteExpiredFile: document.getElementById("delFileAfterExpired")
            .checked
            ? 1
            : 0
        };
        axios
          .post("/files/share", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.Token
            },
            timeout: 30000
          })
          .then(d => {
            if (userData.RunMode === "DEBUG") console.log(d.data);
            if (d.data.status === "OK") {
              searchUserModalContent.style.display = "none";
              containerOverlay.style.display = "none";
              sendEmail(
                d.data.data.DestUser,
                "mbermejo17@gmail.com",
                "URL para descarga de archivo",
                `Descarga de archivo https://194.224.194.134/files/share/${
                  d.data.data.UrlCode
                }`
              );
              appData.aSelectedFiles = [];
              appData.aSelectedFolders = [];
              document.getElementById("refresh").click();
            }
          })
          .catch(e => {
            showToast(
              "Error al compartir archivo " + data.fileName + ".<br>Err:" + e,
              "err"
            );
            if (userData.RunMode === "DEBUG") console.log(e);
          });
      }
    });
}

export function deleteSelected() {
  if (userData.RunMode === "DEBUG")
    console.log("aSelectedFolders: ", appData.aSelectedFolders.length);
  if (appData.aSelectedFolders.length > 0) {
    showDialogYesNo(
      "Delete foldes",
      "Delete selected folders?",
      y => {
        $.when(deleteFolder(appData.currentPath)).then(result => {
          if (appData.aSelectedFiles.length > 0) {
            showDialogYesNo(
              "Delete Files",
              "Delete selected files?",
              y => {
                deleteFile(appData.currentPath);
              },
              n => {
                if (userData.RunMode === "DEBUG")
                  console.log("Delete Files Canceled");
              }
            );
          }
          document.getElementById("refresh").click();
        });
      },
      n => {
        if (userData.RunMode === "DEBUG") console.log("Delete Folder Canceled");
        if (appData.aSelectedFiles.length > 0) {
          showDialogYesNo(
            "Delete Files",
            "Delete selected files?",
            y => {
              deleteFile(appData.currentPath);
            },
            n => {
              if (userData.RunMode === "DEBUG")
                console.log("Delete Files Canceled");
            }
          );
        }
      }
    );
  } else {
    if (appData.aSelectedFiles.length > 0) {
      showDialogYesNo(
        "Delete Files",
        "Delete selected files?",
        y => {
          deleteFile(appData.currentPath);
        },
        n => {
          if (userData.RunMode === "DEBUG")
            console.log("Delete Files Canceled");
        }
      );
    }
  }
}

export function upload(Token) {
  let w = 32;
  let h = 440;
  let aListHandler = [];
  let handlerCounter = 0;
  let ModalTitle = "Subida de archivos";
  let ModalContent = `<label class="file-input waves-effect waves-teal btn-flat btn2-unify">Select files<input id="upload-input" type="file" name="uploads[]" multiple="multiple" class="modal-action modal-close"></label>
                        <span id="sFiles">Ningun archivo seleccionado</span>`;
  ModalContent += htmlUploadDownloadTemplate;
  let htmlContent = `<div id="modal-header">
                          <h5>${ModalTitle}</h5>
                          <a class="modal_close" id="modalClose" href="#"></a>
                        </div>
                        <div class="modal-content">
                          <p>${ModalContent}</p>
                      </div>
                      <div class="modal-footer">
                              <!--<input type="text" hidden id="destPath" name="destPath" value=""/>-->
                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancel uploads</a>  
                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseUpload" href="#!">Close</a>
                      </div>`;

  $u("#upload").removeClass("disabled");
  $u("#upload").addClass("disabled");

  function fnUploadFile(formData, nFile, fileName) {
    $u("#li" + nFile).show();
    $u("#li-filename" + nFile).show();
    $u("#li-filename" + nFile).html(fileName);
    let realpath = getRealPath(appData.currentPath);
    if (userData.RunMode === "DEBUG")
      console.log("Upload:appData.currentPath " + appData.currentPath);
    if (userData.RunMode === "DEBUG")
      console.log("Upload:REAL_ROOT_PATH " + userData.REAL_ROOT_PATH);
    if (userData.RunMode === "DEBUG")
      console.log("Upload:realPath " + realpath);
    let CancelToken = axios.CancelToken;
    axios
      .post("/files/upload?destPath=" + realpath, formData, {
        headers: {
          Authorization: "Bearer " + userData.Token,
          destPath: realpath
        },
        timeout: 290000,
        cancelToken: new CancelToken(
          function executor(c) {
            aListHandler[nFile] = c;
           }),
        onUploadProgress: function(progressEvent) {
          let _this = this;
          console.log('progressEvent: ',progressEvent);
        let percentComplete = 0;
        let evt = progressEvent;
        //aListHandler[nFile].upload.addEventListener(
        //  "progress",
        //  function(evt) {
            console.log(fileName + " File size: ", evt.total);
            if (evt.total > 700000000) {
              showToast(
                fileName + " excede del tamaño soportado (700MB)",
                "err"
              );
              aListHandler[nFile]();
              let percentLabel = document.querySelector("#percent" + nFile);
              let progressBar = document.querySelector("#progress-bar" + nFile);
              progressBar.innerHTML = "Aborted by server";
              percentLabel.innerHTML = "";
              progressBar.style.color = "red";
              progressBar.style.width = "100%";
              progressBar.style.backgroundColor = "white";
              handlerCounter = handlerCounter - 1;
              if (handlerCounter == 0) {
                $u("#btnCancelAll").removeClass("disabled");
                  $u("#btnCancelAll").addClass("disabled");
              }
            } else {
              if (evt.lengthComputable) {
                percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);
                $("#percent" + nFile).text(percentComplete + "%");
                $("#progress-bar" + nFile).width(percentComplete + "%");
              }
            }
          //false
        //);
        return aListHandler[nFile];
      }
      })
      .then(d => {
        let data = JSON.parse(d);
        if (userData.RunMode === "DEBUG")
          console.log(data.data + "upload successful!\n" + data);
        console.log("handlerCounter1: ", handlerCounter);
        if (data.status == "OK") {
          showToast(fileName + " uploaded sucessfully", "success");
          $("#abort" + nFile).hide();
          $("#refresh").trigger("click");
          handlerCounter = handlerCounter - 1;
          console.log("handlerCounter2: ", handlerCounter);
          if (handlerCounter == 0) {
            $("#btnCancelAll")
              .removeClass("disabled")
              .addClass("disabled");
          }
        } else {
          if (data.status == "FAIL") {
            showToast("Error: " + data.message, "err");
            $("#abort" + nFile).hide();
            handlerCounter = handlerCounter - 1;
            if (handlerCounter == 0) {
              $("#btnCancelAll")
                .removeClass("disabled")
                .addClass("disabled");
            }
          }
        }
      })
      .catch(e => {});
  }

  $("#modal")
    .html(htmlContent)
    .css("width: " + w + "%;height: " + h + "px;text-align: center;");
  //$('.modal-content').css('width: 350px;');
  $(".modal-container").css("width: 40% !important");
  $(".file-input").show();
  $("#modal").show();
  $("#lean-overlay").show();
  $("#btnCloseUpload").on("click", e => {
    $("#upload").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
  });
  $("#modalClose").on("click", e => {
    $("#upload").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
  });
  $("#btnCancelAll").removeClass("disabled");
  $(".modal_close").on("click", e => {
    e.preventDefault();
    if (userData.RunMode === "DEBUG") console.log(e);
    let n = parseInt(e.target.id.slice(-1));
    aListHandler[n]();
    let percentLabel = document.querySelector("#percent" + n);
    let progressBar = document.querySelector("#progress-bar" + n);
    progressBar.innerHTML = "Canceled by user";
    percentLabel.innerHTML = "";
    progressBar.style.color = "red";
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "white";
    $(e.target).hide();
  });
  $("#btnCancelAll").on("click", e => {
    for (let x = 0; x < 4; x++) {
      aListHandler[x]();
      let percentLabel = document.querySelector("#percent" + x);
      let progressBar = document.querySelector("#progress-bar" + x);
      progressBar.innerHTML = "Canceled by user";
      percentLabel.innerHTML = "";
      progressBar.style.color = "red";
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "white";
    }
    $("#btnCancelAll").addClass("disabled");
  });
  $("#upload-input").on("change", function(e) {
    let files = $("#upload-input").get(0).files;
    handlerCounter = files.length;
    files.length > 0
      ? $("#sFiles").html(files.length + " archivos seleccionados.")
      : $("#sFiles").html(files[0]);
    if (userData.RunMode === "DEBUG") console.log(files.length);
    $(".file-input").hide();
    if (files.length > 0 && files.length <= 5) {
      $("#btnCloseUpload")
        .removeClass("disabled")
        .addClass("disabled");
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let formData = new FormData();
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

export function newFolder(folderName) {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + userData.Token);
  headers.append("Content-Type", "application/json");
  fetch("/files/newfolder", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      path: getRealPath(appData.currentPath),
      folderName: folderName
    }),
    timeout: 10000
  })
    .then(r => r.json())
    .then(data => {
      if (userData.RunMode === "DEBUG") console.log(data);
      if (data.status == "OK") {
        $u("#modal").hide();
        $u("#lean-overlay").hide();
        $u('#refresh').trigger('click');
        showToast("Creada nueva carpeta " + data.data.folderName, "success");
      } else {
        showToast(
          "Error al crear la carpeta " +
            folderName +
            " <br>Error: " +
            data.message,
          "err"
        );
      }
    })
    .catch(err => {
      showToast(
        "Error al crear la carpeta " +
          folderName +
          " <br>Error: error no identificado",
        "err"
      );
      if (userData.RunMode === "DEBUG") console.log(err);
    });
}

export function deleteFile(path) {
  const headers = new Headers();
  let x = 0;
  let aF = appData.aSelectedFiles.slice();
  if (userData.RunMode === "DEBUG") console.log(aF);
  headers.append("Authorization", "Bearer " + userData.Token);
  headers.append("Content-Type", "application/json");
  $("#waiting").addClass("active");
  for (x = 0; x < aF.length; x++) {
    if (userData.RunMode === "DEBUG")
      console.log("Deleting file " + aF[x] + " ...");
    fetch("/files/delete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        path: getRealPath(path),
        fileName: aF[x]
      }),
      timeout: 720000
    })
      .then(FetchHandleErrors)
      .then(r => r.json())
      .then(data => {
        if (userData.RunMode === "DEBUG") console.log(data);
        if (data.status == "OK") {
          appData.aSelectedFiles.shift();
          $(".toast")
            .removeClass("success")
            .addClass("success");
          showToast("Archivo " + data.data.fileName + " borrado", "success");
          $("#refresh").trigger("click");
        }
      })
      .catch(err => {
        if (userData.RunMode === "DEBUG") console.log(err);
        $(".toast")
          .removeClass("err")
          .addClass("err");
        showToast(err, "err");
      });
  }
  $("#waiting").removeClass("active");
}

export function deleteFolder(path) {
  const headers = new Headers();
  let x = 0;
  let aF = appData.aSelectedFolders.slice();
  if (userData.RunMode === "DEBUG") console.log(aF);
  headers.append("Authorization", "Bearer " + userData.Token);
  headers.append("Content-Type", "application/json");
  $("#waiting").addClass("active");
  for (x = 0; x < aF.length; x++) {
    if (userData.RunMode === "DEBUG")
      console.log("Deleting folder " + aF[x] + " ...");
    fetch("/files/delete", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        path: getRealPath(path),
        fileName: aF[x]
      }),
      timeout: 720000
    })
      .then(FetchHandleErrors)
      .then(r => r.json())
      .then(data => {
        if (userData.RunMode === "DEBUG") console.log(data);
        if (data.status == "OK") {
          $(".toast")
            .removeClass("success")
            .addClass("success");
          showToast("Carpeta " + data.data.fileName + " borrada", "success");
          appData.aSelectedFolders.shift();
          $("#waiting").removeClass("active");
        }
      })
      .catch(err => {
        if (userData.RunMode === "DEBUG") console.log(err);
        $("#waiting").removeClass("active");
      });
  }
  $("#waiting").removeClass("active");
}

//TODO: Optimizar renderizado de elementos li
//incorporando el contenido en el bucle _loop
export function download(fileList, text) {
  let reqList = [],
    handlerCount = 0,
    responseTimeout = [];
  let w = 32;
  let h = 440;
  let ModalTitle = "Descarga de archivos seleccionados";
  let ModalContent = htmlUploadDownloadTemplate;
  let htmlContent = `<div id="modal-header">
                          <h5>${ModalTitle}</h5>
                          <a class="modal_close" id="modalClose" href="#"></a>
                      </div>
                      <div class="modal-content">
                          <p>${ModalContent}</p>
                      </div>
                      <div class="modal-footer">
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancel downloads</a>
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Cerrar</a>
                      </div>`;
  $("#modal")
    .html(htmlContent)
    .css("width: " + w + "%;height: " + h + "px;text-align: center;");
  //$('.modal-content').css('width: 350px;');
  $(".modal").css("width: 40% !important");
  document.querySelector("#modal").style.display = "block";
  document.querySelector("#lean-overlay").style.display = "block";
  document.querySelector("#btnCancelAll").classList.add("disabled");

  $("#download").addClass("disabled");
  $("#btnCloseDownload").on("click", e => {
    $("#download").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
    $("#refresh").trigger("click");
    appData.aSelectedFiles = [];
  });
  $("#modalClose").on("click", e => {
    $("#download").removeClass("disabled");
    $("#modal").hide();
    $("#lean-overlay").hide();
    $("#refresh").trigger("click");
    appData.aSelectedFiles = [];
  });
  $("#waiting").addClass("active");
  $("#btnCancelAll").on("click", e => {
    for (let x = 0; x < 4; x++) {
      reqList[x].abort();
      let percentLabel = document.querySelector("#percent" + x);
      let progressBar = document.querySelector("#progress-bar" + x);
      progressBar.innerHTML = "Canceled by user";
      percentLabel.innerHTML = "";
      progressBar.style.color = "red";
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "white";
    }
    $("#btnCancelAll").addClass("disabled");
  });
  $(".modal_close").on("click", e => {
    e.preventDefault();
    let n = parseInt(e.target.id.slice(-1));
    reqList[n].abort();
    let percentLabel = document.querySelector("#percent" + n);
    let progressBar = document.querySelector("#progress-bar" + n);
    progressBar.innerHTML = "Canceled by user";
    percentLabel.innerHTML = "";
    progressBar.style.color = "red";
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "white";
  });

  $("#btnCancelAll").removeClass("disabled");
  let _loop = i => {
    let fName = fileList[i];
    let liNumber = document.querySelector("#li" + i);
    let liFilename = document.querySelector("#li-filename" + i);
    let progressBar = document.querySelector("#progress-bar" + i);
    let percentLabel = document.querySelector("#percent" + i);
    responseTimeout[i] = false;
    fName = fName
      .split("\\")
      .pop()
      .split("/")
      .pop();
    reqList[i] = new XMLHttpRequest();
    reqList[i].open("POST", "/files/download", true);
    reqList[i].responseType = "arraybuffer";
    liNumber.style.display = "block";
    liFilename.innerHTML = fName;
    reqList[i].timeout = 36000;
    reqList[i].ontimeout = function() {
      if (userData.RunMode === "DEBUG")
        console.log(
          "** Timeout error ->File:" +
            fName +
            " " +
            reqList[i].status +
            " " +
            reqList[i].statusText
        );
      // handlerCount = handlerCount - 1
      progressBar.innerHTML = "Timeout Error";
      percentLabel.innerHTML = "";
      progressBar.style.color = "red";
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "white";
      progressBar.classList.add("blink");
      responseTimeout[i] = true;
    };
    reqList[i].onprogress = function(evt) {
      if (evt.lengthComputable) {
        let percentComplete = parseInt((evt.loaded / evt.total) * 100);
        progressBar.style.width = percentComplete + "%";
        percentLabel.innerHTML = percentComplete + "%";
      }
    };
    reqList[i].onerror = function() {
      if (userData.RunMode === "DEBUG")
        console.log(
          "** An error occurred during the transaction ->File:" +
            fName +
            " " +
            req.status +
            " " +
            req.statusText
        );
      handlerCount = handlerCount - 1;
      percentLabel.innerHTML = "Error";
      percentLabel.style.color = "red";
      $("#abort" + i).hide();
    };
    reqList[i].onloadend = function() {
      handlerCount = handlerCount - 1;
      if (!responseTimeout[i]) {
        progressBar.style.width = "100%";
        percentLabel.innerHTML = "100%";
        $("#abort" + i).hide();
      }
      if (handlerCount === 0) {
        $("#download-end").show();
        $("#btnCancelAll")
          .removeClass("disabled")
          .addClass("disabled");
        $("#refresh").trigger("click");
      }
      if (userData.RunMode === "DEBUG")
        console.log("File " + handlerCount + " downloaded");
    };
    reqList[i].onloadstart = function() {
      handlerCount = handlerCount + 1;
      progressBar.style.width = "0";
      percentLabel.innerHTML = "0%";
    };
    reqList[i].onload = function() {
      if (reqList[i].readyState === 4 && reqList[i].status === 200) {
        let filename = "";
        let disposition = reqList[i].getResponseHeader("Content-Disposition");
        if (disposition && disposition.indexOf("attachment") !== -1) {
          let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          let matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1])
            filename = matches[1].replace(/['"]/g, "");
        }
        let type = reqList[i].getResponseHeader("Content-Type");
        let blob = new Blob([this.response], {
          type: type
        });
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        } else {
          let URL = window.URL || window.webkitURL;
          let downloadUrl = URL.createObjectURL(blob);

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            let a = document.createElement("a");
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

          setTimeout(function() {
            URL.revokeObjectURL(downloadUrl);
          }, 100); // cleanup
        }
      }
    };
    reqList[i].setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    if (userData.RunMode === "DEBUG")
      console.log(getRealPath(appData.currentPath) + "/" + fileList[i]);
    reqList[i].send(
      serializeObject({
        filename: getRealPath(appData.currentPath) + "/" + fileList[i]
      })
    );
  };
  for (let i = 0; i < fileList.length; i++) {
    _loop(i);
  }
  $("#waiting").removeClass("active");
}

///////////////////////////////////
// End Files and fFolders module
/////////////////////////////////
