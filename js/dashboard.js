/* jshint laxbreak: true */
/* experimental: [asyncawait, asyncreqawait] */

"use sctrict";
import "babel-polyfill";

//import ajax from "./vendor/ajax";
import axios from "axios";
//import axiosMethodOverride from 'axios-method-override';
import {
    Base64
} from "js-base64";
import md5 from "./vendor/md5.min";
import Cookies from "./vendor/js-cookie";
import {
    editUser,
    showAddUserForm
} from "./modules/user";

import {
    getRealPath,
    serializeObject
} from "./modules/general";
import {
    shareFile,
    shareFileManage,
    deleteSelected,
    download,
    socketDownloadFile,
    upload,
    newFolder,
    showSharedFiles
} from "./modules/fileManager";
import {
    modalDialog
} from "./vendor/modalDialog";

window.userData = {
    UserName: Cookies.get("UserName"),
    UserRole: Cookies.get("UserRole"),
    CompanyName: Cookies.get("CompanyName"),
    RealRootPath: Cookies.get("RootPath"),
    Token: Cookies.get("token"),
    AccessString: JSON.parse(Cookies.get("AccessString")),
    RunMode: Cookies.get("RunMode"),
    MaxFileSize: Cookies.get('MaxFileSize')
};

window.appData = {
    rootPath: "/",
    currentPath: "/",
    aSelectedFiles: {name:[], size: []}, 
    aSelectedFolders: []
};


(function(w, d) {
    let
        AllowDownload = userData.AccessString.download,
        AllowUpload = userData.AccessString.upload,
        AllowDeleteFile = userData.AccessString.deletefile,
        AllowDeleteFolder = userData.AccessString.deletefolder,
        AllowNewFolder = userData.AccessString.addfolder,
        AllowShareFile = userData.AccessString.sharefiles;


    let aFolders = [];
    let aFiles = [];
    let currentTopToast = 30;
    let topToast = 0;

    const logout = () => {
        Cookies.remove("UserName");
        Cookies.remove("UserRole");
        Cookies.remove("sessionId");
        Cookies.remove("token");
        Cookies.remove("wssURL");
        Cookies.remove("RootPath");
        Cookies.remove("CompanyName");
        Cookies.remove("AccessString");
        Cookies.remove("MaxFileSize");
        document.location.href = "/";
    };


    /* axiosMethodOverride(axios);

    const instance = axios.create();
    axiosMethodOverride(instance); */

    //////////////////////////////////
    //  Tools module
    //////////////////////////////////

    const cleanArray = arr => {
        let temp = [];
        for (let i of arr) i && temp.push(i);
        return temp;
    };

    window.FetchHandleErrors = function(response) {
        if (!response.ok) {
            //throw Error(response.statusText);
            if (response.statusCode == 401) {
                logout();
            }
        }
        return response;
    };

    // TODO --> replace execFetch by axios

    /* window.execFetch = async function(uri, met, data) {
    const header = new Headers();
    const bodyData = data ? JSON.stringify(data) : null;
    header.append("Content-Type", "application/json");
    header.append("Authorization", "Bearer " + userData.Token);

    const initData = {
      method: met,
      headers: header,
      body: bodyData
    };

    const resp = await fetch(uri, initData);
    const json = await resp.json();
    return json;
  };
 */

    ////////////////////////////////////////
    // Global Function Show Toast notifications
    ////////////////////////////////////////
    window.showToast = function(title, msg, type, icon = true) {
        toast.create({
            title: title,
            text: msg,
            type: type,
            icon: icon
        });
    };

    /////////////////////////////////
    //  End Tools
    ////////////////////////////////

    ////////////////////////////////////////
    // Change Path
    ////////////////////////////////////////
    const changePath = newPath => {
        let fullNewPath = "";
        if (userData.RunMode === "DEBUG")
            console.log("changePath:newPath ", newPath);
        if (newPath !== "/") {
            fullNewPath = getNewPath(newPath);
        } else {
            fullNewPath = newPath;
        }
        if (userData.RunMode === "DEBUG")
            console.log("changePath:fullNewPath ", fullNewPath);
        appData.currentPath = fullNewPath.trim();
        refreshPath(appData.currentPath);
        refreshBarMenu();
    };

    ////////////////////////////////////////
    // Get content from new Path
    ////////////////////////////////////////
    let getNewPath = pathSelected => {
        let splitPath = appData.currentPath.split("/");
        let newPath = "";
        let temp = [];

        splitPath = cleanArray(splitPath);

        if (userData.RunMode === "DEBUG")
            console.log("Current Path: ", appData.currentPath);
        if (userData.RunMode === "DEBUG")
            console.log("Path Selected: ", pathSelected);
        if (userData.RunMode === "DEBUG") console.log("splitPath : ", splitPath);
        if (splitPath.length == 0) {
            newPath += "/" + pathSelected;
        } else {
            for (let x = 0; x < splitPath.length; x++) {
                if (splitPath[x] !== pathSelected) {
                    newPath += "/" + splitPath[x];
                } else {
                    if (splitPath[x] === pathSelected) {
                        newPath += "/" + splitPath[x];
                        if (userData.RunMode === "DEBUG")
                            console.log("New Path: ", newPath);
                        return newPath;
                    }
                }
            }
            newPath += "/" + pathSelected;
        }
        if (userData.RunMode === "DEBUG") console.log("New Path: ", newPath);
        return newPath;
    };

    ////////////////////////////////////////
    // Got to back Folder
    ////////////////////////////////////////
    const goBackFolder = folder => {
        let newPath = "";
        let splitPath = appData.currentPath.split("/");

        if (userData.RunMode === "DEBUG")
            console.log("goBackFolder:folder ", folder);
        if (userData.RunMode === "DEBUG")
            console.log("goBackFolder:appData.currentPath ", appData.currentPath);

        splitPath = cleanArray(splitPath);
        splitPath.pop();

        if (appData.currentPath !== "/" && folder == "..") {
            if (splitPath.length > 0) {
                newPath += splitPath[splitPath.length - 1];
            } else {
                newPath = "/";
            }
        }

        if (userData.RunMode === "DEBUG")
            console.log("goBackFolder:newPath " + newPath);
        changePath(newPath.trim());
    };

    ////////////////////////////////////////
    // Refres Content Path
    ////////////////////////////////////////
    const refreshPath = cPath => {
        let newLinePath = [];
        let newHtmlContent = `<li><label id="currentpath">Path:</label></li>
                              <li><spand>&nbsp;</spand><a class="breadcrumb-line-path" href="#!">/</a></li>`;

        if (userData.RunMode === "DEBUG") console.log("init path: ", cPath);
        if (userData.RunMode === "DEBUG")
            console.log("cPath lenght:", cPath.length);
        $u("#waiting").addClass("active");

        if (cPath.length > 1) {
            let cPathArray = cPath.split("/");
            cPathArray = cleanArray(cPathArray);

            if (userData.RunMode === "DEBUG")
                console.log("refreshPath:cPathArray ", cPathArray);

            if (cPathArray.length > 0) {
                for (let x = 0; x < cPathArray.length; x++) {
                    if (x == 0) {
                        newHtmlContent += `<li><spand>&nbsp;</spand><a class="breadcrumb-line-path" href="#!">${
              cPathArray[x]
            }</a></li>`;
                    } else {
                        newHtmlContent += `<li><spand>&nbsp/&nbsp;</spand><a class="breadcrumb-line-path" href="#!">${
              cPathArray[x]
            }</a></li>`;
                    }
                    if (cPathArray[x] === cPath) {
                        break;
                    }
                }
            }
            $u("#waiting").removeClass("active");
        }

        $u("#currentPath").html(newHtmlContent);

        $u(".breadcrumb-line-path").on("click", e => {
            changePath(e.target.innerText);
        });

        //const headers = new Headers();
        //headers.append("Authorization", "Bearer " + userData.Token);
        let realpath = getRealPath(cPath);

        if (userData.RunMode === "DEBUG")
            console.log(
                "userData.RealRootPath: " +
                userData.RealRootPath +
                " realpath:" +
                realpath
            );
        /* fetch("/files?path=" + encodeURI(realpath), {
      method: "GET",
      headers: {"Authorization": "Bearer " + userData.Token},
      timeout: 720000
    }) */

        axios.get(
                "/files?path=" + encodeURI(realpath), {
                    headers: {
                        "Authorization": "Bearer " + userData.Token,
                        "Content-Type": "application/json"
                    },
                    timeout: 720000
                }
            )
            .then(data => {
                if (userData.RunMode === "DEBUG") console.log(data);
                refreshFilesTable(data.data);
                $u("#waiting").removeClass("active");
            })
            .catch(err => {
                if (userData.RunMode === "DEBUG") console.log(err);
                $u("#waiting").removeClass("active");
            });
    };

    //////////////////////////////////
    // Select all Files & Folders
    /////////////////////////////////

    const selectAll = e => {
        var allCkeckbox = document.querySelectorAll(".check");
        let v = document.querySelector("#selectAllFiles").checked;
        if (userData.RunMode === "DEBUG") console.log("selectAllFiles :", v);
        allCkeckbox.forEach(function(element, i) {
            if (!allCkeckbox[i].disabled) {
                allCkeckbox[i].checked = v;
            }
        });
        if (userData.RunMode === "DEBUG") console.log(getCheckedFiles());
        if (userData.RunMode === "DEBUG") console.log(getCheckedFolder());
    };

    ////////////////////////////////////////
    // Get List Checked Files
    ////////////////////////////////////////
    const getCheckedFiles = function() {
        var checkedFiles = [];
        var allElements = document.querySelectorAll(".typeFile");
        allElements.forEach(function(element, i) {
            if (userData.RunMode === "DEBUG") console.log("element: ", element);
            if (userData.RunMode === "DEBUG")
                console.log(
                    "children: ",
                    element.parentElement.parentElement.children[0].children[0]
                    .children[0].checked
                );
                if (userData.RunMode === "DEBUG")
                console.log(
                    "size: ",
                    element.parentElement.parentElement.children[2].innerHTML
                );    
            if (element.parentElement.parentElement.children[0].children[0].children[0].checked) {
                appData.aSelectedFiles.name.push(element.innerHTML);
                appData.aSelectedFiles.size.push(element.parentElement.parentElement.children[2].innerHTML);
                checkedFiles.push(element.innerHTML);
                // c(element.children[1].innerHTML)
            } else {
                const idx = appData.aSelectedFiles.name.indexOf(element.innerHTML);
                if (idx > -1) {
                    appData.aSelectedFiles.name.splice(idx, 1);
                    appData.aSelectedFiles.size.splice(idx, 1);
                }
            }
        });
        return checkedFiles;
    };

    ////////////////////////////////////////
    // Get List Checked Folders
    ////////////////////////////////////////
    const getCheckedFolder = function() {
        var checkedFolders = [];
        var allElements = document.querySelectorAll(".dashboard-path");
        allElements.forEach(function(v, i) {
            if (userData.RunMode === "DEBUG") console.log("element v: ", v);
            if (userData.RunMode === "DEBUG")
                console.log("check ", v.children[0].checked);
            if (userData.RunMode === "DEBUG")
                console.log(
                    "text ",
                    v.parentElement.parentElement.children[1].children[1].text
                );
            if (v.children[0].checked) {
                appData.aSelectedFolders.push(
                    v.parentElement.parentElement.children[1].children[1].text
                );
                checkedFolders.push(
                    v.parentElement.parentElement.children[1].children[1].text
                );
            } else {
                const idx = appData.aSelectedFolders.indexOf(
                    v.parentElement.parentElement.children[1].children[1].text
                );
                if (idx > -1) {
                    appData.aSelectedFolders.splice(idx, 1);
                }
            }
        });
        return checkedFolders;
    };

    ////////////////////////////////////////
    // Modal Daialog
    ////////////////////////////////////////
    window.showDialogYesNo = (title, content, yesCb, noCb) => {
        let w = 32;
        let h = 440;
        let result = null;
        let htmlContent = `<div id="modal-header">
                            <h5>${title}</h5>
                            <a class="modal_close" id="logoutModalClose" href="#hola"></a>
                        </div>
                        <div class="modal-content">
                            <p>${content}</p>
                        </div>
                        <div class="modal-footer">
                            <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnYes" href="#">Yes</a>
                            <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnNO" href="#">NO</a>
                        </div>`;
        $u("#modal")
            .html(htmlContent)
            .css("width: " + w + "%;height: " + h + "px;text-align: center;");
        //$('.modal-content').css('width: 350px;');
        $u(".modal").css("width: 40% !important");
        $u("#modal").show();
        $u("#lean-overlay").show();
        $u("#btnYes").on("click", e => {
            e.preventDefault();
            $u("#modal").hide();
            $u("#lean-overlay").hide();
            yesCb("YES");
        });
        $u("#btnNO").on("click", e => {
            e.preventDefault();
            $u("#modal").hide();
            $u("#lean-overlay").hide();
            noCb("NO");
        });
    };

    ////////////////////////////////////////
    // Format file size
    ////////////////////////////////////////
    const formatSize = bytes => {
        if (bytes >= 1073741824) {
            bytes = parseInt(bytes / 1000000000) + " GB";
        } else if (bytes >= 1048576) {
            bytes = parseInt(bytes / 1000000) + " MB";
        } else if (bytes >= 1024) {
            bytes = parseInt(bytes / 1000) + " KB";
        } else if (bytes > 1) {
            bytes = bytes + " bytes";
        } else if (bytes == 1) {
            bytes = bytes + " byte";
        } else {
            bytes = "0 byte";
        }
        return bytes;
    };

    ////////////////////////////////////////
    // Render View Files & Folders
    ////////////////////////////////////////
    const renderFilesTable = (aFol, aFil) => {
        let newHtmlContent = ``;
        const tbodyContent = document
            .getElementById("tbl-files")
            .getElementsByTagName("tbody")[0];

        newHtmlContent += `<tr><td><span>&nbsp;</span></td>
              <td><i class="fa fa-folder filesTable"></i><a href="#" id="goBackFolder" class="file-Name typeFolder">..</a></td>
              <td>&nbsp;</td><td>&nbsp;</td></tr>`;
        aFol.forEach((val, idx, array) => {
            newHtmlContent += `<tr><td><div class="md-checkbox dashboard-path"><input class="checkFolder check" id="${
        val.name
      }" type="checkbox">
              <label class="checkbox left" for="${
                val.name
              }"></label></div></td>`;
            newHtmlContent += `<td><i class="fa fa-folder filesTable"></i><a href="#" class="file-Name typeFolder">${
        val.name
      }</a></td>`;
            newHtmlContent += `<td>&nbsp;</td><td>${
        val.date
      }</td></tr>`;
        });

        aFil.forEach((val, idx, array) => {
            let fileSize = formatSize(val.size);
            newHtmlContent += `<tr><td><div class="md-checkbox"><input class="checkFile check" id="${
        val.name
      }" type="checkbox">
            <label class="checkbox left" for="${val.name}"></label></div></td>`;
            newHtmlContent += `<td><i class="fa fa-file filesTable"></i><span class="typeFile">${
        val.name
      }</span></td>`;
            newHtmlContent += `<td>${fileSize}</td><td>${
        val.date
      }</td></tr>`;
        });
        tbodyContent.innerHTML = newHtmlContent;
    };

    ////////////////////////////////////////
    // Refresh Files and Folders View
    ////////////////////////////////////////
    const refreshFilesTable = data => {
        const tbodyContent = document
            .getElementById("tbl-files")
            .getElementsByTagName("tbody")[0];

        if (userData.RunMode === "DEBUG") console.log(data);
        aFolders = [];
        aFiles = [];
        if (data.message) return null;
        data.forEach((val, idx, array) => {
            let fileSize = val.size / 1024;
            if (val.isFolder) {
                aFolders.push({
                    name: val.name,
                    date: val.date
                });
            } else {
                if (!val.name.startsWith("upload_")) {
                    aFiles.push({
                        name: val.name,
                        size: val.size,
                        date: val.date
                    });
                }
            }
        });
        aFolders.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        aFiles.sort((a, b) => {
            return a.date.localeCompare(b.date);
        });

        renderFilesTable(aFolders, aFiles);

        $u(".file-Name").on("click", e => {
            if (userData.RunMode === "DEBUG") console.log(e);
            if (userData.RunMode === "DEBUG")
                console.log("Current Path: ", appData.currentPath);
            let newPath = "";
            if (e.target.innerText != "..") {
                newPath = getNewPath(e.target.innerText);
                if (userData.RunMode === "DEBUG")
                    console.log("New Path: ", newPath.trim());
                refreshPath(newPath.trim());
                appData.currentPath = newPath.trim();
                refreshBarMenu();
            } else {
                if (appData.currentPath !== appData.rootPath)
                    goBackFolder(e.target.innerText);
            }
        });

        $u(".check").on("click", e => {
            console.log("check: ", e);
            selectDeselect(e);
            if (userData.RunMode === "DEBUG") {
                console.log("checked: ", e.target.checked);
                console.log(e.target.className.split(/\s+/).indexOf("checkFile"));
                console.log(e.target.parentNode.parentNode.parentNode.rowIndex);
                console.log(e.target.parentNode.children[1].htmlFor);
            }
        });

        $u("#goBackFolder").on("click", e => {
            e.preventDefault();
            goBackFolder();
        });
    };

    ////////////////////////////////////////
    // Select / Deselect Files & Folders
    ////////////////////////////////////////
    const selectDeselect = e => {
        const isChecked = e.target.checked;
        const contentType = e.target.className.split(/\s+/).indexOf("checkFile");
        const name = e.target.parentNode.children[1].htmlFor;
        const size = e.target.parentNode.parentNode.parentNode.children[2].innerHTML;

        if (contentType != -1) {
            if (isChecked) {
                appData.aSelectedFiles.name.push(name);
                appData.aSelectedFiles.size.push(size);
            } else {
                const idx = appData.aSelectedFiles.name.indexOf(name);
                if (idx > -1) {
                    appData.aSelectedFiles.name.splice(idx, 1);
                    appData.aSelectedFiles.size.splice(idx, 1);
                }
            }
        } else {
            if (isChecked) {
                appData.aSelectedFolders.push(name);
            } else {
                const idx = appData.aSelectedFolders.indexOf(name);
                if (idx > -1) {
                    appData.aSelectedFolders.splice(idx, 1);
                }
            }
        }
        if (userData.RunMode === "DEBUG")
            console.log(appData.aSelectedFiles, appData.aSelectedFolders);
    };

    ////////////////////////////////////////
    // User Profile
    ////////////////////////////////////////
    const showUserProfile = (w, h, t) => {
        let ModalTitle = t;
        console.log('access string: ', userData.AccessString);
        let ModalContent = `<table id="tableUserProfile" class="striped highlight">
                    <tr><td>User Name:</td><td>${userData.UserName}</td></tr>
                    <tr><td>User Role:</td><td>${userData.UserRole}</td></tr> 
                    <tr><td>Company Name:</td><td>${
                      userData.CompanyName
                    }</td></tr>
                    <tr><td colspan="2" style="text-align:center;border-botom:1px solid #CCC">&nbsp;</td></tr>
                    <tr><td>Allow new Folder:</td><td>`;
        ModalContent += userData.AccessString.addfolder === true ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow Share Files:</td><td>`;
        ModalContent += userData.AccessString.sharefiles === true ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow delete Folder:</td><td>`;
        ModalContent += userData.AccessString.deletefolder === true ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow delete File:</td><td>`;
        ModalContent += userData.AccessString.deletefile === true ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow Upload:</td><td>`;
        ModalContent += userData.AccessString.upload === true ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow Download:</td><td>`;
        ModalContent += userData.AccessString.download === true ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                </table>`;
        let htmlContent = `${ModalContent}`;
        /* $u("#modal")
          .html(htmlContent)
          .css("width: " + w + "%;height: " + h + "px;");
        $u("#modal").show();
        $u("#lean-overlay").show();
        $u("#ModalClose").on("click", () => {
          $u("#modal").hide();
          $u("#lean-overlay").hide();
        });
        $u("#modalClose").on("click", () => {
          $u("#modal").hide();
          $u("#lean-overlay").hide();
        }); */

        let modalDialogOptions = {
            cancel: true,
            cancelText: "Close",
            confirm: false,
            confirmText: "",
            type: '',
            width: '400px'
        };
        modalDialog(
            "User Profile",
            htmlContent,
            modalDialogOptions
        );

    };

    ////////////////////////////////////////
    // New Folder
    ////////////////////////////////////////
    const showNewFolder = (w, h, t) => {
        let modalDialogOptions = {
            cancel: true,
            cancelText: "Cancel",
            confirm: true,
            confirmText: "OK",
            type: 'prompt',
            width: '400px'
        };

        modalDialogOptions.confirmCallBack = async (e, data) => {
            if (userData.RunMode === "DEBUG") console.log("newFolderName: ", data);
            if (data || data.trim() !== '') {
                let parseFolderName = data.replace(/\s/g, "_");
                newFolder(parseFolderName);
            }
        };
        modalDialogOptions.cancelCallBack = async (e, data) => {
            console.log(data);
        };
        modalDialog(
            "New Folder",
            "Folder Name",
            modalDialogOptions
        );

        /*  document.getElementById("newFolderName").addEventListener("keyup", e => {
           e.preventDefault();
           if (e.keyCode === 13) {
             document.getElementById("AcceptNewFolder").click();
           }
         }); */

    };

    ////////////////////////////////////////
    // Change User Password
    ////////////////////////////////////////
    const showChangeUserPassword = (w, h, t) => {
        let ModalTitle = t;
        /* let ModalContent = `<div class="row">
                              <div class="input-field col s12">
                                <input id="newpassword" type="password"/>
                                <label for="newpassword">New Password</label>
                              </div>
                              <div class="input-field col s12">
                                <input id="newpassword2" type="password"/>
                                <label for="newpassword2">Repeat Password</label>
                              </div>
                          </div>`;
    let htmlContent = `<div id="modal-header">
                          <h5><i class="fas fa-user-lock icon-title"></i>${ModalTitle}</h5>
                        <a class="modal_close" id="modalClose" href="#hola"></a>
                      </div>
                      <div class="modal-content">
                        <p>${ModalContent}</p>
                      </div>
                      <div class="modal-footer">
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="AcceptChangeUserPassword" href="#!">Accept</a>
                      </div>    `;
 */
        let modalDialogOptions = {
            cancel: true,
            cancelText: "Cancel",
            confirm: true,
            confirmText: "OK",
            type: 'changePassword',
            width: '340px'
        };
        modalDialogOptions.confirmCallBack = async (e, data1, data2) => {
            await axios
                .post(
                    "/changepasswd", {
                        username: userData.UserName,
                        newpassword: Base64.encode(md5(data1))
                    }, {
                        headers: {
                            Authorization: "Bearer " + userData.Token,
                            "Content-Type": "application/json"
                        },
                        timeout: 290000
                    }
                )
                .then(d => {
                    $u("#waiting").removeClass("active");
                    if (userData.RunMode === "DEBUG") console.log("changePassword: ", d);
                    if (d.data.status === "FAIL") {
                        showToast("Change User Password", d.data.message, "error");
                        d.querySelector("#message").innerHTML = d.data.message;
                    } else {
                        showToast("Change User Password", d.data.message, "success");
                        if (userData.RunMode === "DEBUG") console.log(d.data.message);
                    }
                })
                .catch(e => {
                    $u("#waiting").removeClass("active");
                    showToast("Change User Password", e, "error");
                    if (userData.RunMode === "DEBUG") console.log(e);
                });
        };
        modalDialog(
            "Change User Password",
            '<div class="input-field">' +
            '<input id="newpassword" class="ModalDialog-input" type="password"/>' +
            '<label for="newpassword" class="ModalDialog-label">New Password</label>' +
            '</div>' +
            '<div class="input-field">' +
            '<input id="newpassword2" class="ModalDialog-input" type="password"/>' +
            '<label for="newpassword2" class="ModalDialog-label">Repeat Password</label>' +
            '</div>',
            modalDialogOptions
        );



        /* $u("#modal").html(htmlContent);
        $u("#modal").removeClass("modal-changePassword");
        $u("#modal").addClass("modal-changePassword");
        $u(".modal-changePassword").css("height: " + h + "px;text-align: center;");
        $u("#modal").show();
        $u("#lean-overlay").show();
        $u("#AcceptChangeUserPassword").on("click", e => {
          e.preventDefault();
          let username = userData.UserName;
          let newpassword = $("#newpassword").val();
          if (userData.RunMode === "DEBUG") console.log(username, newpassword);
          $u("#waiting").addClass("active");
          
        });
        $u("#modalClose").on("click", () => {
          $u("#modal").hide();
          $u("#lean-overlay").hide();
        });
        $u("#ModalClose").on("click", () => {
          $u("#modal").hide();
          $u("#lean-overlay").hide();
        }); */
    };

    const refreshBarMenu = () => {
        if (userData.AccessString.addfolder === true) {
            $u("#newFolder").removeClass("disabled");
        } else {
            $u("#newFolder").removeClass("disabled");
            $u("#newFolder").addClass("disabled");
        }
        if (userData.AccessString.deletefolder === true && userData.AccessString.deletefile === true) {
            $u("#delete").removeClass("disabled");
        } else {
            $u("#delete").removeClass("disabled");
            $u("#delete").addClass("disabled");
        }
        if (userData.AccessString.sharefiles === true) {
            $u("#share").removeClass("disabled");
        } else {
            $u("#share").removeClass("disabled");
            $u("#share").addClass("disabled");
        }
        if (userData.AccessString.upload == true) {
            $u("#upload").removeClass("disabled");
        } else {
            $u("#upload").removeClass("disabled")
            $u("#upload").addClass("disabled");
        }

        if (userData.AccessString.download == true) {
            $u("#download").removeClass("disabled");
        } else {
            $u("#download").removeClass("disabled")
            $u("#download").addClass("disabled");
        }
        if (userData.UserRole.toUpperCase() == "ADMIN") {
            $u("#settings").removeClass("hide");
        } else {
            $u("#settings").addClass("hide");
        }
        $u("#usertrigger").html(userData.UserName);
    };

    $u("#selectAllFiles").on("click", e => {
        selectAll(e.target.htmlFor);
    });

    const userTrigger = function() {
        if (userData.RunMode === "DEBUG")
            console.log($u("#Usersdropdown").css("display"));
        let position1 = document.getElementById("usertrigger").offsetLeft;
        let position2 = document.getElementById("usertrigger").offsetWidth;
        if (userData.RunMode === "DEBUG") console.log("position1: ", position1);
        if (userData.RunMode === "DEBUG") console.log("position2: ", position2);
        let newPosition = parseInt(position1 + position2) + "px";
        if (userData.RunMode === "DEBUG") console.log("newPosition: ", newPosition);
        if (userData.RunMode === "DEBUG")
            console.log("Desiplay: ", $u("#Usersdropdown").css("display"));
        if (
            $u("#Usersdropdown").css("display") === "block" ||
            $u("#Usersdropdown").css("display") == ""
        ) {
            $u("#usertrigger").removeClass("selected");
            $u("#Usersdropdown").hide();
        } else {
            $u("#usertrigger").addClass("selected");
            document.getElementById("Usersdropdown").style.right =
                position2 + 10 + "px";
            document.getElementById("Usersdropdown").style.top = "60px";
            $u("#Usersdropdown").show();
        }
    };

    /////////////////////////////////////////
    //  Events handlers
    /////////////////////////////////////////

    // Add User

    $u("#userAdd").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled"))
            showAddUserForm("New User", null);
    });

    // Edit user

    $u("#userMod").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) editUser();
    });

    // Edit App Settings

    $u("#settings").on("click", e => {
        e.preventDefault();
        if (userData.RunMode === "DEBUG") console.log(e);
        console.log("setting left:", $u(e.target.id).position().left);
        if (userData.RunMode === "DEBUG")
            console.log("settingdropdown left:", $u("#Settingdropdown").css("left"));
        if (userData.RunMode === "DEBUG")
            console.log($u("#Settingdropdown").css("display"));
        let position = document.querySelector("#settings").offsetLeft;
        if (userData.RunMode === "DEBUG") console.log("position: ", position);
        let newPosition = position + "px";
        if ($u("#Settingdropdown").css("display") === "block") {
            document.getElementById("settings").classList ?
                document.getElementById("settings").classList.remove("selected") :
                (document.getElementById("settings").className = "");
            //document.getElementById('Settingdropdown').classList.remove('setting');
            document.getElementById("Settingdropdown").style.display = "none";
        } else {
            if (!$u("#settings").hasClass("selected")) {
                $u("#settings").addClass("selected");
            }
            //addClass(document.getElementById('Settingdropdown'),'setting');
            document.getElementById("Settingdropdown").style.left = newPosition;
            document.getElementById("Settingdropdown").style.display = "block";
            if (userData.RunMode === "DEBUG")
                console.log("newPosition: ", newPosition);
            if (userData.RunMode === "DEBUG")
                console.log(
                    "Settingdropdown new position",
                    document.getElementById("Settingdropdown").style.left
                );
        }
    });

    // Hide User Options Panel

    $u("#Usersdropdown").on("mouseleave", () => {
        $u("#Usersdropdown").hide();
        $u("#usertrigger").removeClass("selected");
    });
    $u("#Settingdropdown").on("mouseleave", () => {
        $u("#Settingdropdown").hide();
        $u("#settings").removeClass("selected");
    });

    // User Options

    $u("#usertrigger").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) userTrigger();
    });

    // Refresh view

    $u("#refresh").on("click", e => {
        e.preventDefault();
        refreshPath(appData.currentPath);
    });

    // Share File

    $u("#share").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            if (appData.aSelectedFiles.name.length > 0) {
                /* if (appData.aSelectedFiles.length > 1) {
                    showToast(
                        "Share File",
                        "No pueden seleccionarse más de un archivo",
                        "warning"
                    );
                } */
                shareFile();
            } else {
                showToast(
                    "Share File",
                    "No se ha seleccionado archivo para compartir",
                    "warning"
                );
            }
        }
    });

    // User Logout

    $u("#userLogout").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            let modalDialogOptions = {
                cancel: true,
                cancelText: "No",
                confirm: true,
                confirmText: "Yes",
                type: '',
                width: '400px'
            };

            modalDialogOptions.confirmCallBack = async (e, data) => {
                if (userData.RunMode === "DEBUG") console.log("data: ", data);
                logout();
            };
            modalDialogOptions.cancelCallBack = async (e, data) => {
                console.log(data);
            };
            modalDialog(
                "Close User session",
                "Do you want to exit?",
                modalDialogOptions
            );
        } else {
            showToast("User Logout", "Opcion no permitida", "error");
        }
    });

    // Show modal User Logout

    $u("#ModalUserLogout").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            $u("#logoutmodal").hide();
            logout();
        } else {
            showToast("User Logout", "Opcion no permitida", "error");
        }
    });

    // Show Modal Dialog Change User Password

    $u("#userChangePassword").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            showChangeUserPassword(32, 380, "Change User Password");
        } else {
            showToast("Change User Password", "Opcion no permitida", "error");
        }
    });


    // Manage Shared Files

    $u("#userSharedFiles").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            showSharedFiles(32, 380, "Manage Shared Files");
        } else {
            showToast("Change User Password", "Opcion no permitida", "error");
        }
    });


    // Show User Profile

    $u("#userProfile").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            showUserProfile(40, 440, "User Profile");
        } else {
            showToast("User Profile", "Opcion no permitida", "error");
        }
    });

    // Cancel Modal Dialog option

    $u("#cancel").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            $u("#logoutmodal").hide();
        } else {
            showToast("User Logout", "Opcion no permitida", "error");
        }
    });

    // Go to Home Path

    $u("#home").on("click", e => {
        e.preventDefault();
        console.log(e);
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            appData.currentPath = appData.rootPath;
            refreshPath(appData.currentPath);
        } else {
            showToast("Home", "Opcion no permitida", "error");
        }
    });

    // Show Modal Dialog Add New Folder

    $u("#newFolder").on("click", e => {
        e.preventDefault();
        console.log(e);
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            showNewFolder(32, 440, "New Folder");
        } else {
            showToast("New Folder", "Opcion no permitida", "error");
        }
    });

    // Delete Files / Folders

    $u("#delete").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            if (
                appData.aSelectedFolders.length > 0 ||
                appData.aSelectedFiles.name.length > 0
            ) {
                deleteSelected();
            } else {
                showToast(
                    "Delete",
                    "No se han seleccionado archivos o carpetas",
                    "error"
                );
            }
        }
    });

    // Upload Files

    $u("#upload").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            upload(userData.Token);
        } else {
            showToast("Upload", "Opcion no permitida", "error");
        }
    });

    // Download Files

    $u("#download").on("click", e => {
        e.preventDefault();
        if (!$u("#" + e.target.id).hasClass("disabled")) {
            if (appData.aSelectedFiles.name.length > 0) {
                if (appData.aSelectedFiles.name.length > 5) {
                    showToast(
                        "Download",
                        "No se pueden descargar más de 5 archivos a la vez",
                        "error"
                    );
                }
                //download(appData.aSelectedFiles, "File");
                socketDownloadFile(appData.aSelectedFiles, "File");
            } else {
                showToast(
                    "Download",
                    "No se han seleccionado archivos para descargar",
                    "error"
                );
            }
        } else {
            showToast("Download", "Opcion no permitida", "error");
        }
    });

    ///////////////////////////////////
    //  End event handlers
    ///////////////////////////////////

    $u("#usertrigger").html(userData.UserName);
    $u("#usertrigger").attr("title", "Empresa: " + userData.CompanyName);

    $u("#waiting").removeClass("active");

    console.log(userData.AccessString);

    refreshPath(appData.currentPath);
    refreshBarMenu();

})(window, document);