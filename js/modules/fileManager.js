/* jshint laxbreak: true */
import moment from "moment";
import axios from "axios";
import { getRealPath, serializeObject } from "./general";

import { modalDialog } from "../vendor/modalDialog";

import uuidv4 from "uuid/v4";
import DataTable from "../vendor/dataTables";
import WebSocket from "wss";





////////////////////////////////////
// Files and Folder module
///////////////////////////////////

let htmlMoveTemplate = `
<div id="move-popup">
  <div id="modal-header">
    <h5>Share File</h5>
    <a class="modal_close" id="sharedModalClose" href="#hola"></a>
  </div>
  <br>
  <div class="userForm-row" id="tree-container">
    
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


let htmlShareFile = `
<div id="shareFileModal">
  <div id="modal-header">
    <h5>Share File</h5>
    <a class="modal_close" id="sharedModalClose" href="#hola"></a>
  </div>
  <br>
  <div class="userForm-row" id="">
    <div class="input-field col s1 m1">
    </div>
    <div class="input-field col s5">
      
      <input id="destUserName" type="email" autocomplete="off" pattern=".+@globex.com" class="userForm-input" required/>
      <label for="destUserName">Send URL to</label>
    </div>
    <div class="input-field col s3 m3">
        <input class="datepicker" id="FileExpirateDate" type="date" class="userForm-input"/>
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

let htmlSearchSharedFilesTemplate = `
<div>
      <div class="head-Title">Edit Shared Files</div> 
      <table id="SharedFilesTableList" class="tableList">
        <thead>
          <tr>
            <th>Id</th>
            <th>User</th>
            <th>Dest User Name</th>
            <th>File Name</th>
            <th>State</th>
            <th data-type="date" data-format="YYYY/MM/DD">Expirate Date</th>
            <th>Delete</div>
            <th>Group Id</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="bodyList">    
        </tbody>
      </table>
      <div class="AddUserModalContent-footer">
        <div class="button-container">
            <button class="waves-effect waves-teal btn-flat btn2-unify" id="btn-EditSharedFileCancel" type="submit" name="action">Close</button>
        </div> 
      </div>
</div>
`;

let htmlUploadDownloadTemplate = `
<ul class="preloader-file" id="DownloadfileList">
    <li id="li0">
        <div class="li-content">
            <div class="li-filename" id="li-filename0"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar0"></div>
                <div class="percent" id="percent0"></div>
                <div id="speedData0"></div>               
            </div>
            <div class="abort-task">
                  <a class="file-abort" id="abort0" href="#" title="Cancel file download"></a>
            </div>
        </div>
    </li>
    <li id="li1">
        <div class="li-content">
            <div class="li-filename" id="li-filename1"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar1"></div>
                <div class="percent" id="percent1"></div>
                <div id="speedData1"></div>
            </div>
            <div class="abort-task">
              <a class="file-abort" id="abort1" href="#" title="Cancel file download"></a>
            </div> 
        </div>
    </li>
    <li id="li2">
        <div class="li-content">
            <div class="li-filename" id="li-filename2"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar2"></div>
                <div class="percent" id="percent2"></div>
                <div id="speedData2"></div>
            </div>  
            <div class="abort-task">
              <a class="file-abort" id="abort2" href="#" title="Cancel file download"></a>
            </div> 
        </div>
    </li>
    <li id="li3">
        <div class="li-content">
            <div class="li-filename" id="li-filename3"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar3"></div>
                <div class="percent" id="percent3"></div>
                <div id="speedData3"></div>
            </div>
            <div class="abort-task">
                  <a class="file-abort" id="abort3" href="#" title="Cancel file download"></a>
                </div>   
        </div>
    </li>
    <li id="li4">
        <div class="li-content">
            <div class="li-filename" id="li-filename4"></div>
            <div class="progress-content">
                <div class="progress-bar" id="progress-bar4"></div>
                <div class="percent" id="percent4"></div>
                <div id="speedData4"></div>  
            </div>
            <div class="abort-task">
                  <a class="file-abort" id="abort4" href="#" title="Cancel file download"></a>
                </div> 
        </div>
    </li>
</ul>`;

const _getUID = () => {
    let uid = uuidv4();
    return uid.replace(/-/g, "");
};

const sendEmail = (toEmail, fromEmail, subject, body_message) => {
    let mailto_link =
        "mailto:" + toEmail + "?subject=" + subject + "&body=" + body_message;
    let win = window.open(mailto_link, "emailWindow");
    if (win && window.open && !window.closed) window.close();
};

const _showAbortMessage = (el, msg) => {
    el.style.backgroundColor = "white";
    el.style.color = "red";
    el.innerHTML = msg;
    el.style.width = "100%";
};

const _deselectAllFolders = () => {
    let allElements = document.querySelectorAll(".dashboard-path");
    allElements.forEach(function(v, i) {
        if (v.children[0].checked) {
            v.children[0].checked = false;
        }
    });
    document.querySelector("#selectAllFiles").checked = false;
    appData.aSelectedFolders = [];
};

const _deselectAllFiles = () => {
    let allElements = document.querySelectorAll(".typeFile");
    /* [].call.forEach(document.querySelectorAll(".typeFile"), function(element) {
      if (element.parentElement.parentElement.children[0].children[0].children[0].checked) {
        element.parentElement.parentElement.children[0].children[0].children[0].checked = false;
      }
    }); */
    allElements.forEach(function(element, i) {
        if (element.parentElement.parentElement.children[0].children[0].children[0].checked) {
            element.parentElement.parentElement.children[0].children[0].children[0].checked = false;
        }
    });
    document.querySelector("#selectAllFiles").checked = false;
    appData.aSelectedFiles.name = [];
    appData.aSelectedFiles.size = [];
    appData.aSelectedFiles.fullsize = [];
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

    const _shareFile = d => {
        let tmpDate = new Date(d.FileExpirateDate);
        let strTime = "";
        let groupID = null;
        let data = {};
        if (d.FileExpirateDate === "") {
            strTime = moment(Date.now()).format("YYYY/MM/DD HH:mm:ss");
        } else {
            strTime = moment(d.FileExpirateDate).format("YYYY/MM/DD HH:mm:ss");
        }

        if (d.destUserName !== "") {
            if (userData.RunMode === "DEBUG") console.log(d.destUserName);
            if (userData.RunMode === "DEBUG")
                console.log("FileExpirateDate: ", d.FileExpirateDate);
            if (appData.aSelectedFiles.name.length > 1) {
                groupID = _getUID();
            }
            let nFiles = appData.aSelectedFiles.name.length;
            let fileList = "";
            for (let x = 0; x < nFiles; x++) {
                fileList += `
                    - ${appData.aSelectedFiles.name[x]}\t\t${appData.aSelectedFiles.size[x]}`;
                data = {
                    fileName: appData.aSelectedFiles.name[x],
                    fileSize: appData.aSelectedFiles.size[x],
                    //filefullSize: appData.aSelectedFiles.fullsize[x];
                    path: appData.currentPath,
                    userName: userData.UserName,
                    userFullName: userData.UserFullName || userData.UserName,
                    userEmail: userData.UserEmail,
                    destUserName: d.destUserName,
                    expirationDate: strTime,
                    unixDate: moment(strTime).format("x"),
                    deleteExpiredFile: d.delFileAfterExpired ? 1 : 0,
                    groupID: groupID
                };
                if (userData.RunMode === "DEBUG")
                    console.log("_shareFile.data: ", data);
                axios
                    .post("/files/share", data, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + userData.Token
                        },
                        timeout: 10800000
                    })
                    .then(d => {
                        if (userData.RunMode === "DEBUG") console.log(d.data);
                        if (d.data.status === "OK") {
                            //containerOverlay.style.display = "none";
                            let user = userData.UserFullName || userData.UserName;
                            let mail = userData.UserEmail || '';
                            mail = '<' + mail + '>';
                            if (nFiles === 1) {
                                document.querySelector("#urlFile").innerHTML = `https://filebox.unifyspain.es/files/share/${d.data.data.UrlCode}`;
                                let emailBody = encodeURIComponent('El usuario ' + user.toUpperCase() + ' ' + mail + ' ha compartido el archivo:\r\n\r\n\t- ' + appData.aSelectedFiles.name[x] + '\t\t' + appData.aSelectedFiles.size[x] + '\r\n\r\n' +
                                    'puede descargarlo del link: https://filebox.unifyspain.es/files/share/' + d.data.data.UrlCode);
                                console.log(emailBody);
                                sendEmail(
                                    d.data.data.DestUser,
                                    "filemanager@filebox.unifyspain.es",
                                    "URL para descarga de archivo",
                                    emailBody
                                );
                                appData.aSelectedFiles.name = [];
                                appData.aSelectedFiles.size = [];
                                appData.aSelectedFiles.fullsize = [];
                                appData.aSelectedFolders = [];
                                document.getElementById("refresh").click();
                                document.getElementById(
                                    "ModalDialog-button-confirm"
                                ).style.display = "none";
                                document.getElementById("ModalDialog-button-cancel").innerHTML =
                                    "OK";
                            } else {
                                console.log('x:', x);
                                if (x === nFiles - 1) {
                                    document.querySelector("#urlFile").innerHTML = `https://filebox.unifyspain.es/files/share/${groupID}`;
                                    let emailBody = encodeURIComponent('El usuario ' + user.toUpperCase() + ' ' + mail + ' ha compartido los archivos:\r\n' + fileList + '\r\n\r\n' +
                                        'puede descargarlos del link: https://filebox.unifyspain.es/files/share/' + groupID);
                                    console.log(emailBody);
                                    sendEmail(
                                        d.data.data.DestUser,
                                        "filemanager@filebox.unifyspain.es",
                                        "URL para descarga de archivos",
                                        emailBody
                                    );
                                    appData.aSelectedFiles.name = [];
                                    appData.aSelectedFiles.size = [];
                                    appData.aSelectedFiles.fullsize = [];
                                    appData.aSelectedFolders = [];
                                    document.getElementById("refresh").click();
                                    document.getElementById(
                                        "ModalDialog-button-confirm"
                                    ).style.display = "none";
                                    document.getElementById("ModalDialog-button-cancel").innerHTML =
                                        "OK";
                                }
                            }
                        } else {
                            let el = document.querySelector("#ModalDialog-wrap");
                            el.parentNode.removeChild(el);
                            _deselectAllFiles();
                            _deselectAllFolders();
                            showToast(
                                "Share files",
                                "Error al compartir archivo " +
                                data.fileName +
                                ".<br>Err:" +
                                d.data.message,
                                "error"
                            );
                        }
                    })
                    .catch(e => {
                        let el = document.querySelector("#ModalDialog-wrap");
                        el.parentNode.removeChild(el);
                        _deselectAllFiles();
                        _deselectAllFolders();
                        showToast(
                            "Share files",
                            "Error al compartir archivo " + data.fileName + ".<br>Err:" + e,
                            "error"
                        );
                        if (userData.RunMode === "DEBUG") console.log(e);
                    });
            }
        }
    };

    let modalDialogOptions = {
        cancel: true,
        cancelText: "Cancel",
        confirm: true,
        confirmText: "Share",
        type: "shareFile"
    };

    modalDialogOptions.confirmCallBack = async function(e, data) {
        if (userData.RunMode === "DEBUG") console.log("shareFile: ", data);
        if (data || data.destUserName.trim() !== "") {
            _shareFile(data);
        }
    };
    modalDialogOptions.cancelCallBack = async function(e, data) {
        console.log(data);
    };
    modalDialog(
        "Share File",
        `      <input id="destUserName" type="email" autocomplete="off" pattern=".+@globex.com" required class="ModalDialog-input"/>
                    <label for="destUserName" class="ModalDialog-label share">Send URL to</label>
                    <input class="datepicker ModalDialog-input" id="FileExpirateDate" type="date"/>
                    <label for="FileExpirateDate" class="ModalDialog-label datepicker share">Expiration Date</label>
                    <br>
                    <input id="delFileAfterExpired" type="checkbox" class="ModalDialog-check-input share">
                    <label for="delFileAfterExpired" class="ModalDialog-check-label share">Delete File</label>
                    <br><br>
                    <label id="urlFile" class="label-url-share"></label>`,
        modalDialogOptions
    );

    /**/
    //htmlShareFile;
}

//////////////////////
// Show Shared Files
//////////////////////

export function showSharedFiles() {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");

    AddUserModalContent.innerHTML = htmlSearchSharedFilesTemplate;
    $u("#AddUserModalContent").addClass("edit");
    AddUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    document.querySelector("#waiting").classList.add("active");
    axios
        .get("/files/shared/user/" + userData.UserName, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userData.Token
            },
            timeout: 10800000
        })
        .then(d => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log("Hello: ", d.data.status);
            if (d.data.status === "OK") {
                let files = d.data.data;
                let i;
                let htmlListContent = "";
                let bodyList = document.querySelector("#bodyList");
                if (userData.RunMode === "DEBUG") console.log("files: ", files.length);
                for (i = 0; i < files.length; i++) {
                    let sDate = files[i].ExpirateDate ? files[i].ExpirateDate : "never";
                    let d = files[i].DeleteExpiredFile === 1 ? true : false;
                    htmlListContent += `
                  <tr class="data-row">
                    <td>${files[i].id}</td>
                    <td>${files[i].User}</td>
                    <td>${files[i].DestUser}</td>
                    <td>${files[i].FileName}</td>
                    <td>${files[i].State}</td>
                    <td>${files[i].ExpirateDate}</td>
                    <td>${d}</td>
                    <td>${files[i].GroupId}</td>
                    <td>
                    <i id="${
                      files[i].Id
                    }-id" class="fas fa-pencil edit-ShareFile-icon" title="Editar Archivo"></i>`;
                    htmlListContent += `
                    <i id="${
                      files[i].Id
                    }-id" class="fas fa-times del-SharedFile-icon" title="Borrar Archivo"></i></td>
                  </tr>`;

                    //console.log('User Role. ',users[i].UserRole.trim().toUpperCase());
                }
                bodyList.innerHTML = htmlListContent;

                let table = new DataTable(
                    document.querySelector("#SharedFilesTableList"), {
                        searchable: true,
                        fixedHeight: true,
                        info: false,
                        perPageSelect: null,
                        perPage: 200
                    }
                );

                [].forEach.call(
                    document.querySelectorAll(".del-SahredFile-icon"),
                    function(el) {
                        el.addEventListener("click", function(e) {
                            let userId = e.target.id.slice(0, -3);
                            let userName =
                                e.target.parentNode.parentNode.children[1].innerHTML;
                            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
                            console.log("userId: ", userId);
                            _removeUser(userId, userName, d => {
                                showToast(
                                    "Delete User",
                                    `Usuario ${userName} borrado`,
                                    "success"
                                );
                                AddUserModalContent.style.display = "none";
                                $u("#AddUserModalContent").removeClass("edit");
                                containerOverlay.style.display = "none";
                                document.getElementById("userMod").click();
                            });
                        });
                    }
                );

                [].forEach.call(
                    document.querySelectorAll(".edit-SharedFile-icon"),
                    function(el) {
                        el.addEventListener("click", function(e) {
                            let userId = e.target.id.slice(0, -3);
                            console.log("userId: ", userId);
                            _editUser(userId, d => {
                                document.querySelector("#AddUserModalContent").style.display =
                                    "none";
                                $u("#AddUserModalContent").removeClass("edit");
                                document.querySelector(".container-overlay").style.display =
                                    "none";
                                showAddUserForm("Edit User", d);
                            });
                        });
                    }
                );

                document
                    .querySelector("#btn-EditSharedFileCancel")
                    .addEventListener("click", e => {
                        e.preventDefault();
                        AddUserModalContent.style.display = "none";
                        $u("#AddUserModalContent").removeClass("edit");
                        containerOverlay.style.display = "none";
                    });
            } else {
                showToast("Users", d.data.data.message, "error");
            }
        })
        .catch(e => {
            document.querySelector("#waiting").classList.remove("active");
            if (userData.RunMode === "DEBUG") console.log(e);
            showToast("Users", e, "error");
        });
}

/////////////////////////////////////
// Delete Files & Folders selected
/////////////////////////////////////

export function deleteSelected() {
    if (userData.RunMode === "DEBUG")
        console.log("aSelectedFolders: ", appData.aSelectedFolders.length);
    let modalDialogOptions = {
        cancel: true,
        cancelText: "Cancel",
        confirm: true,
        confirmText: "OK",
        width: "340px"
    };
    if (appData.aSelectedFolders.length > 0) {
        let result = 0;
        modalDialogOptions.confirmCallBack = async() => {
            await deleteFolder(appData.currentPath);
            await _deselectAllFolders();
            if (appData.aSelectedFiles.name.length > 0) {
                modalDialogOptions.confirmCallBack = async() => {
                    await deleteFile(appData.currentPath);
                };
                modalDialogOptions.confirmText = "OK";
                modalDialog(
                    "Delete Files",
                    "Delete selected files?",
                    modalDialogOptions
                );
            } else {
                document.getElementById("refresh").click();
            }
        };
        modalDialogOptions.cancelCallBack = async() => {
            await _deselectAllFolders();
            if (appData.aSelectedFiles.name.length > 0) {
                modalDialogOptions.confirmCallBack = async() => {
                    await deleteFile(appData.currentPath);
                };
                modalDialogOptions.cancelCallBack = async() => {
                    await _deselectAllFiles();
                };
                modalDialogOptions.confirmText = "OK";
                modalDialog(
                    "Delete Files",
                    "Delete selected files?",
                    modalDialogOptions
                );
            }
        };
        modalDialogOptions.confirmText = "Yes, I'm very sure";
        modalDialog(
            "Delete Folders",
            `<div class="warning-lbl">WARNING:</div>
            <div class="warning-msg">All selected folders and their contents will be deleted.!!</div>
            <div class="msg">Are you sure?</div>`,
            modalDialogOptions
        );
    } else {
        if (appData.aSelectedFiles.name.length > 0) {
            modalDialogOptions.confirmCallBack = async() => {
                await deleteFile(appData.currentPath);
                document.getElementById("refresh").click();
            };
            modalDialogOptions.cancelCallBack = async() => {
                await _deselectAllFiles();
            };
            modalDialog("Delete Files", "Delete selected files?", modalDialogOptions);
        }
    }
}

/////////////////////////////////////
// Add new Folder
/////////////////////////////////////

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
            timeout: 10800000
        })
        .then(r => r.json())
        .then(data => {
            if (userData.RunMode === "DEBUG") console.log(data);
            if (data.status == "OK") {
                $u("#modal").hide();
                $u("#lean-overlay").hide();
                $u("#refresh").trigger("click");
                showToast(
                    "New Folder",
                    "Creada nueva carpeta " + data.data.folderName,
                    "success"
                );
            } else {
                showToast(
                    "Error",
                    "Error al crear la carpeta " +
                    folderName +
                    " <br>Error: " +
                    data.message,
                    "error"
                );
            }
        })
        .catch(err => {
            showToast(
                "Error",
                "Error al crear la carpeta " +
                folderName +
                " <br>Error: error no identificado",
                "error"
            );
            if (userData.RunMode === "DEBUG") console.log(err);
        });
}

/////////////////////////////////////
// Move files/folders
/////////////////////////////////////

export function moveSelected() {
    let AddUserModalContent = document.querySelector("#AddUserModalContent");
    let containerOverlay = document.querySelector(".container-overlay");

    AddUserModalContent.innerHTML = htmlMoveTemplate;
    AddUserModalContent.style.display = "block";
    containerOverlay.style.display = "block";
    let dtreeContainer = document.querySelector("#move-popup");
    let d = new dTree('d');

    d.add(0, -1, 'My example tree');
    d.add(1, 0, 'Node 1', 'example01.html');
    d.add(2, 0, 'Node 2', 'example01.html');
    d.add(3, 1, 'Node 1.1', 'example01.html');
    d.add(4, 0, 'Node 3', 'example01.html');
    d.add(5, 3, 'Node 1.1.1', 'example01.html');
    d.add(6, 5, 'Node 1.1.1.1', 'example01.html');
    d.add(7, 0, 'Node 4', 'example01.html');
    d.add(8, 1, 'Node 1.2', 'example01.html');
    d.add(9, 0, 'My Pictures', 'example01.html', 'Pictures I\'ve taken over the years', '', '', 'img/imgfolder.gif');
    d.add(10, 9, 'The trip to Iceland', 'example01.html', 'Pictures of Gullfoss and Geysir');
    d.add(11, 9, 'Mom\'s birthday', 'example01.html');
    d.add(12, 0, 'Recycle Bin', 'example01.html', '', '', 'img/trash.gif');

    //document.write(d);
    console.log(d);

    dtreeContainer.appendChild(d);

}

function moveFileFolder(origFullPath, destFullPath, type) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + userData.Token);
    headers.append("Content-Type", "application/json");
    fetch("/files/move", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                path: getRealPath(appData.currentPath),
                orig: origFullPath,
                dest: destFullPath
            }),
            timeout: 10800000
        })
        .then(r => r.json())
        .then(data => {
            if (userData.RunMode === "DEBUG") console.log(data);
            if (data.status == "OK") {
                $u("#modal").hide();
                $u("#lean-overlay").hide();
                $u("#refresh").trigger("click");
                showToast(
                    "Move",
                    type + (type === "folder") ? " movida a" : " movido a" + destFullPath,
                    "success"
                );
            } else {
                showToast(
                    "Error",
                    "Error al mover " + (type === "folder") ? "la carpeta " : "el archivo " +
                    origFullPath +
                    " <br>Error: " +
                    data.message,
                    "error"
                );
            }
        })
        .catch(err => {
            showToast(
                "Error",
                "Error al crear la carpeta " +
                folderName +
                " <br>Error: error no identificado",
                "error"
            );
            if (userData.RunMode === "DEBUG") console.log(err);
        });
}


/////////////////////////////////////
// Delete selected Files
/////////////////////////////////////

export function deleteFile(path) {
    const headers = new Headers();
    let x = 0;
    let aF = appData.aSelectedFiles.name.slice();
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
                timeout: 10800000
            })
            .then(FetchHandleErrors)
            .then(r => r.json())
            .then(d => {
                if (userData.RunMode === "DEBUG") console.log(d);
                if (d.status == "OK") {
                    appData.aSelectedFiles.name.shift();
                    appData.aSelectedFiles.size.shift();
                    appData.aSelectedFiles.fullsize.shift();
                    showToast(
                        "Delete file",
                        "Archivo " + d.data.fileName + " borrado",
                        "success"
                    );
                    $u("#refresh").trigger("click");
                }
            })
            .catch(err => {
                if (userData.RunMode === "DEBUG") console.log(err);
                showToast("Error", err, "error");
            });
    }
    $("#waiting").removeClass("active");
}

/////////////////////////////////////
// Delete selected Folders
/////////////////////////////////////

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
                timeout: 10800000
            })
            .then(FetchHandleErrors)
            .then(r => r.json())
            .then(data => {
                if (userData.RunMode === "DEBUG") console.log(data);
                if (data.status == "OK") {
                    showToast(
                        "Delete Folder",
                        "Carpeta " + data.data.fileName + " borrada",
                        "success"
                    );
                    appData.aSelectedFolders.shift();
                    $("#waiting").removeClass("active");
                    if (appData.aSelectedFiles.name.length === 0) {
                        $u("#refresh").trigger("click");
                    }
                }
            })
            .catch(err => {
                if (userData.RunMode === "DEBUG") console.log(err);
                $("#waiting").removeClass("active");
            });
    }
    $("#waiting").removeClass("active");
}

/////////////////////////////////////
// Upload Files
/////////////////////////////////////

export function upload(Token) {
    let w = 32;
    let h = 440;
    let aListHandler = [];
    let handlerCounter = 0;
    let uploadFiles = [];

    let ModalTitle = "Upload Files";
    let ModalContent = `
    <label id="label-upload-input" class="btn-input waves-effect waves-teal btn2-unify">
      Select files
      <input id="upload-input" type="file" name="uploads[]" multiple="multiple" class="modal-action modal-close">
    </label>
    <span id="sFiles" class="upload-input-message">Ningun archivo seleccionado</span>`;

    ModalContent += htmlUploadDownloadTemplate;
    let htmlContent = `
    <div class="ModalDialog-alert">
      <div class="ModalDialog-mask"></div>
      <div class="ModalDialog-body download">
        <div class="ModalDialog-title">
          ${ModalTitle}
        </div>
        <a class="modal_close" id="modalClose" href="#"></a>
        <div class="ModalDialog-container">
          <div class="files-progress-content">
            ${ModalContent}
          </div>
        </div>      
        <div class="ModalDialog-button">
              <!--<input type="text" hidden id="destPath" name="destPath" value=""/>-->
              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify disabled" id="btnCancelAll" href="#!">Cancel uploads</a>  
              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseUpload" href="#!">Close</a>
        </div>
      </div>
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
        let progressBar = document.querySelector("#progress-bar" + nFile);
        let percentLabel = document.querySelector("#percent" + nFile);
        let speedData = document.querySelector("#speedData" + nFile);
        let started_at = new Date();

        document.querySelector("#upload-input").disabled = true;

        axios
            .post("/files/upload?destPath=" + realpath, formData, {
                headers: {
                    Authorization: "Bearer " + userData.Token,
                    destPath: realpath
                },
                timeout: 10800000,
                cancelToken: new CancelToken(function executor(c) {
                    aListHandler[nFile] = c;
                }),
                onUploadProgress: function(progressEvent) {
                    let _this = this;
                    //console.log("progressEvent: ", progressEvent);
                    let percentComplete = 0;
                    let evt = progressEvent;
                    let seconds_elapsed = (new Date().getTime() - started_at.getTime()) / 1000;
                    let bytes_per_second = 0;
                    let Kbytes_per_second = 0;
                    let Mbytes_per_second = 0;
                    //aListHandler[nFile].upload.addEventListener(
                    //  "progress",
                    //  function(evt) {
                    console.log(fileName + " File size: " + evt.total + " Max. FileSize: " + userData.MaxFileSize);
                    if (evt.total > userData.MaxFileSize) {
                        showToast(
                            "Error",
                            `${fileName} excede del tamaño soportado (${
                userData.MaxFileSize
              } Bytes)`,
                            "error"
                        );
                        aListHandler[nFile]();
                        _showAbortMessage(progressBar, "Aborted by server");
                        percentLabel.style.display = "none";
                        document.querySelector("#abort" + nFile).style.display = "none";

                        handlerCounter = handlerCounter - 1;
                        if (handlerCounter == 0) {
                            document
                                .querySelector("#btnCancelAll")
                                .classList.remove("disabled");
                            document.querySelector("#btnCancelAll").classList.add("disabled");
                        }
                        //audit(userData.UserName,'UPLOAD',uploadFiles[nFile].fileName + ' [' + uploadFiles[nFile].fileSize + '] ->Upload canceled by Server','FAIL');
                        console.log(
                            "AUDIT: " +
                            userData.UserName +
                            "UPLOAD" +
                            uploadFiles[nFile].fileName +
                            " [" +
                            uploadFiles[nFile].fileSize +
                            "] ->Upload canceled by Server,FAIL"
                        );
                    } else {
                        if (evt.lengthComputable) {
                            bytes_per_second = seconds_elapsed ? evt.loaded / seconds_elapsed : 0;
                            Kbytes_per_second = bytes_per_second / 1000;
                            Mbytes_per_second = Kbytes_per_second / 1000;
                            if (progressBar.style.width !== "100%") {
                                percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);
                                percentLabel.innerHTML = percentComplete + "%";
                                progressBar.style.width = percentComplete + "%";
                                speedData.innerHTML = Mbytes_per_second.toFixed(2) + ' Mbits/s';
                            }
                        }
                    }
                    //false
                    //);
                    return aListHandler[nFile];
                }
            })
            .then(data => {
                //let data = JSON.parse(d);
                if (userData.RunMode === "DEBUG")
                    console.log("Upload successful!\n", data);
                if (userData.RunMode === "DEBUG")
                    console.log("handlerCounter1: ", handlerCounter);

                if (data.data.status == "OK") {
                    showToast("Upload", fileName + " uploaded sucessfully", "success");
                    document.querySelector("#speedData" + nFile).innerHTML="";
                    //audit(userData.UserName,'UPLOAD',uploadFiles[nFile].fileName + ' [' + uploadFiles[nFile].fileSize +']','OK');
                    if (userData.RunMode === "DEBUG")
                        console.log("ocultando abort", nFile);
                    if (userData.RunMode === "DEBUG")
                        console.log(
                            "AUDIT: " + userData.UserName + ",UPLOAD,",
                            uploadFiles[nFile].fileName +
                            " [" +
                            uploadFiles[nFile].fileSize +
                            "],OK"
                        );
                    document.querySelector("#abort" + nFile).style.display = "none";
                    $u("#refresh").trigger("click");
                    handlerCounter = handlerCounter - 1;
                    console.log("handlerCounter2: ", handlerCounter);
                    if (handlerCounter == 0) {
                        $u("#btnCancelAll").removeClass("disabled");
                        $u("#btnCancelAll").addClass("disabled");
                    }
                    axios
                        .post("/files/upload/md5?destPath=" + realpath + "&fileName=" + uploadFiles[nFile].fileName, {
                            headers: {
                                Authorization: "Bearer " + userData.Token,
                                destPath: realpath
                            },
                            timeout: 10800000,
                            cancelToken: new CancelToken(function executor(c) {
                                aListHandler[nFile] = c;
                            })
                        })
                        .then(d => {
                            console.log("d.data", d.data);
                            $u("#refresh").trigger("click");
                            showToast("Upload", "MD5 from file " + d.data.data.fileName + " : " + d.data.data.md5, "success");
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    if (data.data.status == "FAIL") {
                        showToast("Error", "Error: " + data.data.message, "error");
                        document.querySelector("#abort" + nFile).style.dsiplay = "none";
                        //audit(userData.UserName,'UPLOAD',uploadFiles[nFile].fileName + ' [' + uploadFiles[nFile].fileSize + '] ->' + data.data.message,'FAIL');
                        handlerCounter = handlerCounter - 1;
                        if (handlerCounter == 0) {
                            document
                                .querySelector("#btnCancelAll")
                                .classList.remove("disabled");
                            document.querySelector("#btnCancelAll").classList.add("disabled");
                        }
                    }
                }
            })
            .catch(e => {
                console.log("Upload Error:", e);
            });
    }

    let element = document.createElement("div");
    element.id = "ModalDialog-wrap";
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    document.querySelector("#upload-input").style.display = "block";

    document.querySelector("#btnCloseUpload").addEventListener("click", e => {
        e.preventDefault();
        let el = document.querySelector("#ModalDialog-wrap");
        el.parentNode.removeChild(el);
        document.querySelector("#upload").classList.remove("disabled");
    });

    document.querySelector("#modalClose").addEventListener("click", e => {
        e.preventDefault();
        let el = document.querySelector("#ModalDialog-wrap");
        el.parentNode.removeChild(el);
        document.querySelector("#upload").classList.remove("disabled");
    });

    [].forEach.call(document.querySelectorAll(".file-abort"), function(el) {
        document.querySelector("#" + el.id).addEventListener("click", function(e) {
            e.preventDefault();
            let n = parseInt(e.target.id.slice(-1));
            let percentLabel = document.querySelector("#percent" + n);
            let progressBar = document.querySelector("#progress-bar" + n);
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
            console.log(
                "AUDIT: " +
                userData.UserName +
                "UPLOAD" +
                uploadFiles[n].fileName +
                " [" +
                uploadFiles[n].fileSize +
                "] ->Upload canceled by User,FAIL"
            );
        });
    });

    document.querySelector("#btnCancelAll").addEventListener("click", e => {
        e.preventDefault();
        for (let x = 0; x < 5; x++) {
            let percentLabel = document.querySelector("#percent" + x);
            let progressBar = document.querySelector("#progress-bar" + x);
            if (aListHandler[x]) {
                aListHandler[x]();
                _showAbortMessage(progressBar, "Canceled by User");
                percentLabel.style.display = "none";

                document.querySelector("#abort" + x).style.display = "none";
                //audit(userData.UserName,'UPLOAD',uploadFiles[x].fileName + ' [' + uploadFiles[x].fileSize + '] ->Upload canceled by User','FAIL');
                console.log(
                    "AUDIT: " +
                    userData.UserName +
                    "UPLOAD" +
                    uploadFiles[x].fileName +
                    " [" +
                    uploadFiles[x].fileSize +
                    "] ->Upload canceled by User,FAIL"
                );
            }
        }
        handlerCounter = 0;
        document.querySelector("#btnCancelAll").classList.remove("disabled");
        document.querySelector("#btnCancelAll").classList.add("disabled");
    });

    document.querySelector("#upload-input").addEventListener("change", e => {
        e.preventDefault();
        let files = document.querySelector("#upload-input").files;
        handlerCounter = files.length;
        let htmlText = files.length > 0 ? '<a href="#" id="selectedFiles">' : "";
        htmlText +=
            files.length > 0 ? files.length + " archivos seleccionados." : files[0];
        htmlText += files.length > 0 ? "</a>" : "";

        if (document.querySelector("#selectedFiles")) {
            document.querySelector("#selectedFiles").addEventListener("click", e => {
                e.preventDefault();
                $u("#sFiles").removeClass("select");
                document
                    .querySelector("#label-upload-input")
                    .classList.remove("disabled");
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

            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let formData = new FormData();
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
            showToast(
                "Error",
                "No se pueden subir más de 5 archivos a la vez",
                "error"
            );
        }
    });
}

/////////////////////////////////////
// Download selected Files
/////////////////////////////////////

export function download(fileList, text) {
    let smallFileList = { name: [], size: [], fullsize: [] };
    console.log("Download fileList", fileList);

    let _Download_big_files_Loop = (d) => {
        console.log("Download post data", d);
        axios
            .post("/files/download", d, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userData.Token
                },
                timeout: 10800000
            })
            .then(responseData => {
                var getUrl = window.location;
                var baseUrl = getUrl.protocol + "//" + getUrl.host;
                let fileId = responseData.data.data;
                console.log('download data', responseData.data);
                console.log(baseUrl + '/files/download/' + fileId);

                // Others
                var URL = window.URL || window.webkitURL;
                if (URL) {
                    var a = document.createElement("a")
                    a.href = 'files/download/' + fileId;
                    a.download = d.name;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        //window.URL.revokeObjectURL(url);  
                    }, 10);
                    showToast(
                        "Download",
                        "Descargando archivo " + d.name + ' ...',
                        "success"
                    );
                }
            })
            .catch(e => {
                console.log(e);
            });
    };

    for (let i = 0; i < fileList.name.length; i++) {
        let downloadData = {
            "name": fileList.name[i],
            "path": appData.currentPath,
            "size": fileList.size[i],
            "fullsize": fileList.fullsize[i],
            "userName": userData.UserName
        };
        console.log('userData.fileSize: ', userData.MaxFileSize);
        if (fileList.fullsize[i] > 2000000000) {
            _Download_big_files_Loop(downloadData);
        } else {
            smallFileList.name.push(fileList.name[i]);
            smallFileList.size.push(fileList.size[i]);
            smallFileList.fullsize.push(fileList.fullsize[i]);
        }
    }

    console.log('smallfileList: ', smallFileList);
    if (smallFileList.name.length > 0) {
        _Download_small_files(smallFileList, 'File');
        //smallFileList = { name: [], size: [], fullsize: [] };
    } else {
        document.querySelector("#refresh").click();
        _deselectAllFolders();
        _deselectAllFiles();
    }


};


let _Download_small_files = function(fileList, text) {

    // !streamSaver.supported && prompt(
    //     'ReadableStream is not supported, you can enable it in chrome, or wait until v52',
    //     'chrome://flags/#enable-experimental-web-platform-features'
    // )

    let reqList = [],
        handlerCounter = 0,
        responseTimeout = [];
    let w = 32;
    let h = 440;
    let ModalTitle = "Download selected files";
    let ModalContent = htmlUploadDownloadTemplate;
    let htmlContent = `
    <div class="ModalDialog-alert">
      <div class="ModalDialog-mask"></div>
      <div class="ModalDialog-body download">
        <div class="ModalDialog-title">
          ${ModalTitle}
        </div>
        <a class="modal_close" id="modalClose" href="#"></a>
        <div class="ModalDialog-container">
          <div class="files-progress-content">
            ${ModalContent}
          </div>
        </div>      
        <div class="ModalDialog-button">
              <!--<input type="text" hidden id="destPath" name="destPath" value=""/>-->
              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify disabled" id="btnCancelAll" href="#!">Cancel Downloads</a>  
              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Close</a>
        </div>
      </div>
    </div>`;

    let element = document.createElement("div");
    element.id = "ModalDialog-wrap";
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    const _closeModal = () => {
        let el = document.querySelector("#ModalDialog-wrap");
        el.parentNode.removeChild(el);
        document.querySelector("#download").classList.remove("disabled");
        _deselectAllFiles();
    };

    document.querySelector("#btnCloseDownload").addEventListener("click", e => {
        e.preventDefault();
        _closeModal();
    });

    document.querySelector("#modalClose").addEventListener("click", e => {
        e.preventDefault();
        _closeModal();
    });

    document.querySelector("#btnCancelAll").classList.add("disabled");
    document.querySelector("#download").classList.add("disabled");
    document.querySelector("#waiting").classList.add("active");

    document.querySelector("#btnCancelAll").addEventListener("click", e => {
        for (let x = 0; x < reqList.length; x++) {
            if (reqList[x]) {
                reqList[x].abort();
                let percentLabel = document.querySelector("#percent" + x);
                let progressBar = document.querySelector("#progress-bar" + x);
                _showAbortMessage(progressBar, "Canceled by user");
                percentLabel.innerHTML = "";
                //audit(userData.UserName,'DOWNLOAD',fileList[x] + ' ->Download canceled by User','FAIL');
                console.log(
                    "AUDIT: " +
                    userData.UserName +
                    "DOWNLOAD" +
                    fileList.name[x] +
                    " ->Upload canceled by User,FAIL"
                );
            }
        }
        document.querySelector("#btnCancelAll").classList.add("disabled");
    });

    [].forEach.call(document.querySelectorAll(".file-abort"), function(el) {
        document.querySelector("#" + el.id).addEventListener("click", function(e) {
            e.preventDefault();
            let n = parseInt(e.target.id.slice(-1));
            reqList[n].abort();
            let percentLabel = document.querySelector("#percent" + n);
            let progressBar = document.querySelector("#progress-bar" + n);
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
            console.log(
                "AUDIT: " +
                userData.UserName +
                "DOWNLOAD" +
                fileList.name[n] +
                " ->Upload canceled by User,FAIL"
            );
        });
    });

    let _Download_Small_Files_Loop = i => {
        let fName = fileList.name[i];
        let fSize = fileList.size[i];
        let fFullSize = fileList.fullsize[i];
        let liNumber = document.querySelector("#li" + i);
        let liFilename = document.querySelector("#li-filename" + i);
        let progressBar = document.querySelector("#progress-bar" + i);
        let percentLabel = document.querySelector("#percent" + i);
        let downloadData = {
            "name": fileList.name[i],
            "path": getRealPath(appData.currentPath),
            "size": fileList.size[i],
            "fullsize": fileList.fullsize[i],
            "userName": userData.UserName
        };

        responseTimeout[i] = false;
        fName = fName.split("\\").pop().split("/").pop();
        console.log('file Name: ', fName);
        reqList[i] = new XMLHttpRequest();
        reqList[i].open("POST", "/files/downloadSmall", true);
        reqList[i].responseType = "blob";
        liNumber.style.display = "block";
        liFilename.innerHTML = fName;
        reqList[i].timeout = 10800000;
        reqList[i].ontimeout = function() {
            // Download Timeout
            if (userData.RunMode === "DEBUG") console.log("** Timeout error ->File:" + fName + " " + reqList[i].status + " " + reqList[i].statusText);
            // handlerCount = handlerCount - 1
            _showAbortMessage(progressBar, "Timeout Error");
            progressBar.classList.add("blink");
            responseTimeout[i] = true;
        };
        reqList[i].onprogress = function(evt) {
            // Download progress
            if (evt.lengthComputable) {
                let percentComplete = parseInt((evt.loaded / evt.total) * 100);
                progressBar.style.width = percentComplete + "%";
                percentLabel.innerHTML = percentComplete + "%";
            }
        };
        reqList[i].onabort = function() {
            // Download abort
            showToast(
                "Download File",
                "Descarga de archivo " + fName + " cancelada",
                "warning"
            );
        };
        reqList[i].onerror = function() {
            // Download error
            if (userData.RunMode === "DEBUG")
                console.log(
                    "** An error occurred during the transaction ->File:" +
                    fName +
                    " " +
                    req.status +
                    " " +
                    req.statusText
                );
            handlerCounter = handlerCounter - 1;
            percentLabel.innerHTML = "Error";
            percentLabel.style.color = "red";
            document.querySelector("#abort" + i).style.display = "none";
            showToast(
                "Download File",
                "Error al descargar archivo " + fName + " " + req.statusText,
                "error"
            );
        };
        reqList[i].onloadend = function(e) {
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
        reqList[i].onloadstart = function() {
            handlerCounter = handlerCounter + 1;
            progressBar.style.width = "0";
            percentLabel.innerHTML = "0%";
        };
        reqList[i].onload = function() {
            if (reqList[i].readyState === 4 && reqList[i].status === 200) {
                showToast(
                    "Download File",
                    "Archivo " + fName + " descargado",
                    "success"
                );
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
                        }
                    } else {
                        window.open = downloadUrl;
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
            console.log(getRealPath(appData.currentPath) + "/" + fileList.name[i]);
        reqList[i].send(serializeObject(downloadData));
        //serializeObject({
        //    filename: getRealPath(appData.currentPath) + "/" + fileList.name[i]
        //})   
    };

    document.querySelector("#btnCancelAll").classList.remove("disabled");
    for (let i = 0; i < fileList.name.length; i++) {
        _Download_Small_Files_Loop(i);
    }
    document.querySelector("#waiting").classList.remove("active");
}

///////////////////////////////////
// End Files and Folders module
/////////////////////////////////