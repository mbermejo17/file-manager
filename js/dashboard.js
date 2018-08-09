"use sctrict";
import "babel-polyfill";

//import ajax from "./vendor/ajax";
import axios from 'axios';
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
    deleteSelected,
    download,
    upload,
    newFolder
} from "./modules/fileManager";

window.userData = {
    UserName: Cookies.get("UserName"),
    UserRole: Cookies.get("UserRole"),
    CompanyName: Cookies.get("CompanyName"),
    RealRootPath: Cookies.get("RootPath"),
    Token: Cookies.get("token"),
    AccessString: Cookies.get("AccessString"),
    RunMode: Cookies.get("RunMode")
};

window.appData = {
    rootPath: "/",
    currentPath: "/",
    aSelectedFiles: [],
    aSelectedFolders: []
};

(function(w, d) {
    let [
    AllowDownload,
    AllowUpload,
    AllowDeleteFile,
    AllowDeleteFolder,
    AllowNewFolder,
    AllowShareFile
  ] = userData.AccessString.split(",");

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
        document.location.href = "/";
    };

    //////////////////////////////////
    //  Tools module
    //////////////////////////////////

    const hasClass = (el, className) => {
        if (userData.RunMode === "DEBUG") console.log(el);
        return (" " + el.className + " ").indexOf(" " + className + " ") > -1;
    };

    const getClass = elem => {
        return (elem.getAttribute && elem.getAttribute("class")) || "";
    };

    const addClass = (el, className) => {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className += " " + className;
    };

    const removeClass = (el, className) => {
        if (el.classList) {
            if (userData.RunMode === "DEBUG")
                console.log("el class", el.className("active"));
            el.classList.remove(className);
            if (userData.RunMode === "DEBUG")
                console.log("el class after", el.className("active"));
        } else if (hasClass(el, className)) {
            var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
            el.className = el.className.replace(reg, " ");
        }
    };

    const cleanArray = (arr) => {
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

    window.execFetch = async function(uri, met, data) {
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
    }

    window.showToast = (msg, type) => {
        let newTopToast = 0;
        let newCurrentTopToast = 0;
        if (topToast == 0) {
            newTopToast = topToast;
            newCurrentTopToast = currentTopToast;
        } else {
            newTopToast = topToast + 5;
            newCurrentTopToast = currentTopToast + 35;
            topToast = newTopToast;
            currentTopToast = newCurrentTopToast;
        }

        let x = document.getElementById("snackbar");
        x.innerHTML = msg;
        x.className = "show";
        x.classList.remove(type);
        x.classList.add(type);
        x.style.setProperty("--snackbarTop", newTopToast + "px");
        x.style.setProperty("--snackbarCurrentTop", newCurrentTopToast + "px");
        setTimeout(function() {
            x.className = x.className.replace("show", "");
            if (topToast !== 0 && topToast > 5) {
                topToast = topToast - 5;
            }
            if (currentTopToast !== 30 && currentTopToast > 35) {
                currentTopToast = currentTopToast - 35;
            }
        }, 3000);
    };

    /////////////////////////////////
    //  End Tools
    ////////////////////////////////


    ///////////////////////////////
    // Path handler
    //////////////////////////////

    // change path event
    let changePath = newPath => {
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

    // get New path
    let getNewPath = (pathSelected) => {
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

    // go back Folder
    let goBackFolder = folder => {
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

    // refresh path
    let refreshPath = cPath => {
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
            /* cPathArray.forEach((val, idx, array) => {
              if (val.trim() != "") newLinePath.push(val);
            }); */
            //if (userData.RunMode === "DEBUG") console.log("newLinePath: ", newLinePath);
            if (cPathArray.length > 0) {
                for (let x = 0; x < cPathArray.length; x++) {
                    if (x == 0) {
                        newHtmlContent += `<li><spand>&nbsp;</spand><a class="breadcrumb-line-path" href="#!">${
              cPathArray[x]
            }</a></li>`;
                    } else {
                        newHtmlContent += `<li><spand>/&nbsp;</spand><a class="breadcrumb-line-path" href="#!">${
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

        $u('.breadcrumb-line-path').on('click', (e) => {
            changePath(e.target.innerText);
        });

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + userData.Token);
        let realpath = getRealPath(cPath);

        if (userData.RunMode === "DEBUG")
            console.log(
                "userData.RealRootPath: " + userData.RealRootPath + " realpath:" + realpath
            );
        fetch("/files?path=" + encodeURI(realpath), {
                method: "GET",
                headers: headers,
                timeout: 720000
            })
            .then(FetchHandleErrors)
            .then(r => r.json())
            .then(data => {
                if (userData.RunMode === "DEBUG") console.log(data);
                refreshFilesTable(data);
                $u("#waiting").removeClass("active");
            })
            .catch(err => {
                if (userData.RunMode === "DEBUG") console.log(err);
                $u("#waiting").removeClass("active");
            });
    };

    //////////////////////////////////
    // User UI
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
            if (
                element.parentElement.parentElement.children[0].children[0].children[0]
                .checked
            ) {
                appData.aSelectedFiles.push(element.innerHTML);
                checkedFiles.push(element.innerHTML);
                // c(element.children[1].innerHTML)
            } else {
                const idx = appData.aSelectedFiles.indexOf(element.innerHTML);
                if (idx > -1) {
                    appData.aSelectedFiles.splice(idx, 1);
                }
            }
        });
        return checkedFiles;
    };

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

    const renderFilesTable = (aFol, aFil) => {
        let newHtmlContent = ``;
        const tbodyContent = document
            .getElementById("tbl-files")
            .getElementsByTagName("tbody")[0];

        newHtmlContent += `<tr><td><span>&nbsp;</span></td>
              <td><i class="fa fa-folder"></i><a href="#" id="goBackFolder" class="file-Name typeFolder">..</a></td>
              <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`;
        aFol.forEach((val, idx, array) => {
            newHtmlContent += `<tr><td><div class="md-checkbox dashboard-path"><input class="checkFolder check" id="${
        val.name
      }" type="checkbox">
              <label class="checkbox left" for="${
                val.name
              }"></label></div></td>`;
            newHtmlContent += `<td><i class="fa fa-folder"></i><a href="#" class="file-Name typeFolder">${
        val.name
      }</a></td>`;
            newHtmlContent += `<td>&nbsp;</td><td>&nbsp;</td><td>${
        val.date
      }</td></tr>`;
        });

        aFil.forEach((val, idx, array) => {
            let fileSize = formatSize(val.size);

            newHtmlContent += `<tr><td><div class="md-checkbox"><input class="checkFile check" id="${
        val.name
      }" type="checkbox">
            <label class="checkbox left" for="${val.name}"></label></div></td>`;
            newHtmlContent += `<td><i class="fa fa-file"></i><span class="typeFile">${
        val.name
      }</span></td>`;
            newHtmlContent += `<td>${fileSize}</td><td>&nbsp;</td><td>${
        val.date
      }</td></tr>`;
        });
        tbodyContent.innerHTML = newHtmlContent;
    };

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
                aFiles.push({
                    name: val.name,
                    size: val.size,
                    date: val.date
                });
            }
        });
        aFolders.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        aFiles.sort((a, b) => {
            return a.date.localeCompare(b.date);
        });

        renderFilesTable(aFolders, aFiles);

        $u('.file-Name').on('click', (e) => {
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
                if (appData.currentPath !== appData.rootPath) goBackFolder(e.target.innerText);
            }
        });

        $u('.check').on('click', (e) => {
            selectDeselect(e);
            if (userData.RunMode === "DEBUG") console.log(e.target.checked);
            if (userData.RunMode === "DEBUG")
                console.log(e.target.className.split(/\s+/).indexOf("checkFile"));
            if (userData.RunMode === "DEBUG")
                console.log(e.target.parentNode.parentNode.rowIndex);
            if (userData.RunMode === "DEBUG")
                console.log(e.target.parentNode.children[1].htmlFor);
        });


        $u("#goBackFolder").on("click", e => {
            e.preventDefault();
            goBackFolder();
        });
    };

    const selectDeselect = e => {
        const isChecked = e.target.checked;
        const contentType = e.target.className.split(/\s+/).indexOf("checkFile");
        const name = e.target.parentNode.children[1].htmlFor;

        if (contentType != -1) {
            if (isChecked) {
                appData.aSelectedFiles.push(name);
            } else {
                const idx = appData.aSelectedFiles.indexOf(name);
                if (idx > -1) {
                    appData.aSelectedFiles.splice(idx, 1);
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

    const showUserProfile = (w, h, t) => {
        let ModalTitle = t;
        let ModalContent = `<table id="tableUserProfile" class="striped highlight">
                    <tr><td>User Name:</td><td>${userData.UserName}</td></tr>
                    <tr><td>User Role:</td><td>${userData.UserRole}</td></tr> 
                    <tr><td>Company Name:</td><td>${userData.CompanyName}</td></tr>
                    <tr><td colspan="2" style="text-align:center;border-botom:1px solid #CCC">&nbsp;</td></tr>
                    <tr><td>Allow new Folder:</td><td>`;
        ModalContent += AllowNewFolder == "1" ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow Share Files:</td><td>`;
        ModalContent += AllowShareFile == "1" ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow delete Folder:</td><td>`;
        ModalContent += AllowDeleteFolder == "1" ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow delete File:</td><td>`;
        ModalContent += AllowDeleteFile == "1" ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow Upload:</td><td>`;
        ModalContent += AllowUpload == "1" ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                    <tr><td>Allow Download:</td><td>`;
        ModalContent += AllowDownload == "1" ? "Allow" : "Deny";
        ModalContent += `</td></tr>
                </table>`;
        let htmlContent = `<div id="modal-header">
                        <h5>${ModalTitle}</h5>
                        <a class="modal_close" id="modalClose" href="#hola"></a>
                      </div>
                      <div class="modal-content">
                        <p>${ModalContent}</p>
                      </div>
                      <div class="modal-footer">
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>
                      </div>    `;
        $u("#modal")
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
        });
    };

    const showNewFolder = (w, h, t) => {
        let ModalTitle = t;
        let ModalContent = `<div class="row">
                              <div class="input-field col s12">
                                <input id="newFolderName" type="text"/>
                                <label for="newFolderName">New Folder Name</label>
                              </div>
                          </div>`;
        let htmlContent = `<div id="modal-header">
                        <h5>${ModalTitle}</h5>
                        <a class="modal_close" id="modalClose" href="#"></a>
                      </div>
                      <div class="modal-content">
                        <p>${ModalContent}</p>
                      </div>
                      <div class="modal-footer">
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="AcceptNewFolder" href="#!">Accept</a>
                      </div>    `;
        $u("#modal").html(htmlContent);
        $u("#modal").css("width: " + w + "%;height: " + h + "px;text-align: center;");
        //$('.modal-content').css('width: 350px;');
        $u(".modal").css("width: 40% !important");
        $u("#modal").show();
        $u("#lean-overlay").show();
        $u("#AcceptNewFolder").on("click", (e) => {
            let newFolderName = $u("#newFolderName").val();
            if (userData.RunMode === "DEBUG") console.log('newFolderName: ',newFolderName);
            newFolder(newFolderName);
        });
        $u("#modalClose").on("click", (e) => {
            $u("#modal").hide();
            $u("#lean-overlay").hide();
        });
        $u("#ModalClose").on("click", (e) => {
            $u("#modal").hide();
            $u("#lean-overlay").hide();
        });
        document.getElementById("newFolderName").addEventListener("keyup", (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                document.getElementById("AcceptNewFolder").click();
            }
        });
    };

    const showChangeUserPassword = (w, h, t) => {
        let ModalTitle = t;
        let ModalContent = `<div class="row">
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
                        <h5>${ModalTitle}</h5>
                        <a class="modal_close" id="modalClose" href="#hola"></a>
                      </div>
                      <div class="modal-content">
                        <p>${ModalContent}</p>
                      </div>
                      <div class="modal-footer">
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>
                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="AcceptChangeUserPassword" href="#!">Accept</a>
                      </div>    `;
        $u("#modal")
            .html(htmlContent)
            .css("width: " + w + "%;height: " + h + "px;text-align: center;");
        //$('.modal-content').css('width: 350px;');
        $u(".modal").css("width: 40% !important");
        $u("#modal").show();
        $u("#lean-overlay").show();
        $u("#AcceptChangeUserPassword").on("click", e => {
            e.preventDefault();
            let username = userData.UserName;
            let newpassword = $("#newpassword").val();
            if (userData.RunMode === "DEBUG") console.log(username, newpassword);
            ajax({
                type: "POST",
                url: "/changepasswd",
                data: {
                    username: username,
                    newpassword: Base64.encode(md5(newpassword))
                },
                ajaxtimeout: 40000,
                beforeSend: () => {
                    /* waiting.style.display = 'block'
                                                            waiting
                                                                .classList
                                                                .add('active') */
                },
                success: data => {
                    //if (userData.RunMode === 'DEBUG' ) console.log(JSON.parse(data))
                    let {
                        status,
                        message
                    } = JSON.parse(data);
                    if (userData.RunMode === "DEBUG") console.log("status", status);
                    if (status === "FAIL") {
                        showToast(message, "err");
                        d.querySelector("#message").innerHTML = message;
                    } else {
                        showToast(message, "success");
                        if (userData.RunMode === "DEBUG") console.log(message);
                    }
                    $u("#modal").hide();
                },
                complete: (xhr, status) => {
                    if (userData.RunMode === "DEBUG") console.log(xhr, status);
                    //waiting.style.display = 'none'
                    $u("#modal").hide();
                    $u("#lean-overlay").hide();
                },
                error: (xhr, err) => {
                    showToast("Wrong password", "err");
                    if (err === "timeout") {
                        if (userData.RunMode === "DEBUG") console.log("Timeout Error");
                    } else {
                        if (userData.RunMode === "DEBUG") console.log(xhr, err);
                    }
                }
            });
        });
        $u("#modalClose").on("click", () => {
            $u("#modal").hide();
            $u("#lean-overlay").hide();
        });
        $u("#ModalClose").on("click", () => {
            $u("#modal").hide();
            $u("#lean-overlay").hide();
        });
    };

    let refreshBarMenu = () => {
        if (AllowNewFolder === "1") {
            $u("#newFolder").removeClass("disabled");
        } else {
            $u("#newFolder").removeClass("disabled");
            $u("#newFolder").addClass("disabled");
        }
        if (AllowDeleteFolder === "1" && AllowDeleteFile === "1") {
            $u("#delete").removeClass("disabled");
        } else {
            $u("#delete").removeClass("disabled");
            $u("#delete").addClass("disabled");
        }
        if (AllowShareFile === "1") {
            $u("#share").removeClass("disabled");
        } else {
            $u("#share").removeClass("disabled");
            $u("#share").addClass("disabled");
        }
        if (AllowUpload == "1") {
            $u("#upload").removeClass("disabled");
        } else {
            $u("#upload")
                .removeClass("disabled")
                .addClass("disabled");
        }

        if (AllowDownload == "1") {
            $u("#download").removeClass("disabled");
        } else {
            $u("#download")
                .removeClass("disabled")
                .addClass("disabled");
        }
        if (userData.UserRole.toUpperCase() == "ADMIN") {
            $u("#settings").show();
        } else {
            $u("#settings").hide();
        }
        $u("#modaltrigger").html(userData.UserName);
        /* $("#modaltrigger").leanModal({
          top: 110,
          overlay: 0.45,
          closeButton: ".hidemodal"
        }); */
    };

    $("#selectAllFiles").on("click", e => {
        selectAll(e.target.htmlFor);
    });


    const userTrigger = function() {
        if (userData.RunMode === "DEBUG")
            console.log($u("#Usersdropdown").css("display"));
        let position1 = document.getElementById("usertrigger").offsetLeft;
        let position2 = document.getElementById("usertrigger").offsetWidth;
        if (userData.RunMode === "DEBUG")
            console.log("position1: ", position1);
        if (userData.RunMode === "DEBUG")
            console.log("position2: ", position2);
        let newPosition = parseInt(position1 + position2) + "px";
        if (userData.RunMode === "DEBUG")
            console.log("newPosition: ", newPosition);
        if ($u("#Usersdropdown").css("display") === "block") {
            $u("#usertrigger").removeClass("selected");
            $u("#Usersdropdown").hide();
        } else {
            $u("#usertrigger").addClass("selected");
            document.getElementById("Usersdropdown").style.right = newPosition;
            $u("#Usersdropdown").show();
        }
    };


    $u('#userAdd').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) showAddUserForm("New User", null);
    });

    $u('#userMod').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) editUser();
    });

    $u('#settings').on('click', (e) => {});

    $u('#usertrigger').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) userTrigger()
    });

    $u('#refresh').on('click', (e) => {
        refreshPath(appData.currentPath);
    });

    $u('#share').on('click', (e) => {
        if (appData.aSelectedFiles.length > 0) {
            if (appData.aSelectedFiles.length > 1) {
                showToast("No pueden seleccionarse más de un archivo", "err");
            }
            shareFile();
        } else {
            showToast("No se han seleccionado archivo para compartir", "err");
        }
    });

    $u('#userLogout').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            $u("#logoutmodal").show();
            addClass(document.querySelector('#logoutmodal'), 'modal-logout');
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#ModalUserLogout').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            $u("#logoutmodal").hide();
            logout();
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#userChangePassword').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            showChangeUserPassword(32, 440, "Change User Password");
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#userProfile').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            $u("#Usersdropdown").hide();
            showUserProfile(40, 440, "User Profile");
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#cancel').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            $u("#logoutmodal").hide();
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#home').on('click', (e) => {
        console.log(e);
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            appData.currentPath = appData.rootPath;
            refreshPath(appData.currentPath);
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#newFolder').on('click', (e) => {
        console.log(e);
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            showNewFolder(32, 440, "New Folder");
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#delete').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            if (appData.aSelectedFolders.length > 0 || appData.aSelectedFiles.length > 0) {
                deleteSelected();
            } else {
                showToast("No se han seleccionado archivos o carpetas", "err");
            }
        }
    });

    $u('#upload').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            upload(userData.Token);
        } else {
            showToast("Opcion no permitida", "err");
        }
    });

    $u('#download').on('click', (e) => {
        if (!$u('#' + e.target.id).hasClass("disabled")) {
            if (appData.aSelectedFiles.length > 0) {
                if (appData.aSelectedFiles.length > 5) {
                    showToast("No se pueden descargar más de 5 archivos a la vez", "err");
                }
                download(appData.aSelectedFiles, "File");
            } else {
                showToast("No se han seleccionado archivos para descargar", "err");
            }
        } else {
            showToast("Opcion no permitida", "err");
        }
    });


    $u("#usertrigger").html(userData.UserName);

    $u("#usertrigger").attr("title", "Empresa: " + userData.CompanyName);

    $u("#settings").on("click", e => {
        if (userData.RunMode === "DEBUG")
            console.log("setting left:", $u(e.target).position().left);
        if (userData.RunMode === "DEBUG")
            console.log("settingdropdown left:", $u("#Settingdropdown").css("left"));
        if (userData.RunMode === "DEBUG")
            console.log($u("#Settingdropdown").css("display"));
        let position = document.querySelector("#settings").offsetLeft;
        if (userData.RunMode === "DEBUG") console.log("position: ", position);
        let newPosition = position + "px";
        if ($u("#Settingdropdown").css("display") === "block") {
            (document.getElementById("settings").classList) ? document.getElementById("settings").classList.remove("selected"): (document.getElementById("settings").className = "");
            //document.getElementById('Settingdropdown').classList.remove('setting');
            document.getElementById("Settingdropdown").style.display = "none";
        } else {
            if (hasClass(document.getElementById("settings"), "selected") != true) {
                addClass(document.getElementById("settings"), "selected");
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
    $u("#Usersdropdown").on("mouseleave", () => {
        $u("#Usersdropdown").hide();
        $u("#usertrigger").removeClass("selected");
    });
    $u("#Settingdropdown").on("mouseleave", () => {
        $u("#Settingdropdown").hide();
        $u("#settings").removeClass("selected");
    });
    document.querySelector("#bar-preloader").style.Display = "none";
    refreshPath(appData.currentPath);
    refreshBarMenu();
    if (userData.RunMode === "DEBUG")
        console.log(document.querySelector("#selectAllFiles").checked);
    if (userData.RunMode === "DEBUG") console.log();

    // Front-End routing
    ////////////////////////

    // adding routes
})(window, document);