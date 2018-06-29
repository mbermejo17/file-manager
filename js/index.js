'use sctrict';
import ajax from './vendor/ajax';
import {
    Base64
} from 'js-base64';
import md5 from './vendor/md5.min';
import Cookies from './vendor/js-cookie';

$(document).ready(function () {

    const UserName = Cookies.get('UserName');
    const UserRole = Cookies.get('UserRole');
    const CompanyName = Cookies.get('CompanyName');
    const realRootPath = Cookies.get('RootPath');
    const Token = Cookies.get('token');
    const AccessString = Cookies.get('AccessString');
    const [AllowNewFolder,
        AllowRenameFolder,
        AllowRenameFile,
        AllowDeleteFolder,
        AllowDeleteFile,
        AllowUpload,
        AllowDownload
    ] = AccessString.split(',');
    let RootPath = '/';
    let currentPath = RootPath;
    let aSelectedFiles = [];
    let aSelectedFolders = [];
    let aFolders = [];
    let aFiles = [];


    /* const setCookie = function (name, value, days) {
          var expires = "";
          if (days) {
              var date = new Date();
              date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
              expires = "; expires=" + date.toUTCString();
          }
          document.cookie = name + "=" + (value || "") + expires + ";path='/'";
      };
      
      const getCookie = function (cname) {
          let name = cname + "=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for (let i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return '';
      }; */

    const logout = () => {
        Cookies.set('UserName', '', {
            expires: 0,
            path: ''
        });
        Cookies.set('UserRole', '', {
            expires: 0,
            path: ''
        });
        Cookies.set('sessionId', '', {
            expires: 0,
            path: ''
        });
        Cookies.set('token', '', {
            expires: 0,
            path: ''
        });
        Cookies.set('wssURL', '', {
            expires: 0,
            path: ''
        });
        Cookies.remove('UserName');
        Cookies.remove('UserRole');
        Cookies.remove('sessionId');
        Cookies.remove('token');
        Cookies.remove('wssURL');
        document.location.href = '/';
    };

    const serializeObject = (dataObject) => {
        var stringResult = '',
            value = void 0;
        for (var key in dataObject) {
            console.log(dataObject[key], key);
            value = dataObject[key];
            if (stringResult !== '') {
                stringResult += '&' + key + '=' + value;
            } else {
                stringResult += key + '=' + value;
            }
        }
        return stringResult;
    };

    const changePath = (newPath) => {
        console.log('changePath:newPath ', newPath);
        currentPath = newPath.trim();
        refreshPath(currentPath);
        refreshBarMenu();
    };

    const FetchHandleErrors = function (response) {
        if (!response.ok) {
            //throw Error(response.statusText);
            if(response.statusCode == 401) {
                logout();
            }
        }
        return response;
    }
    const upload = () => {
        let w = 32;
        let h = 440;
        let ModalTitle = "Subida de archivos";
        let ModalContent = `<input id="upload-input" type="file" name="uploads[]" multiple="multiple" class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify">
                    <ul class="preloader-file" id="DownloadfileList">
                    <li id="li0">
                        <div class="li-content">
                            <div class="li-filename" id="li-filename0"></div>
                            <div class="progress-content">
                                <div class="progress-bar" id="progress-bar0"></div>
                                <div class="percent" id="percent0"></div>
                            </div>
                        </div>
                    </li>
                    <li id="li1">
                        <div class="li-content">
                            <div class="li-filename" id="li-filename1"></div>
                            <div class="progress-content">
                                <div class="progress-bar" id="progress-bar1"></div>
                                <div class="percent" id="percent1"></div>
                            </div>
                        </div>
                    </li>
                    <li id="li2">
                        <div class="li-content">
                            <div class="li-filename" id="li-filename2"></div>
                            <div class="progress-content">
                                <div class="progress-bar" id="progress-bar2"></div>
                                <div class="percent" id="percent2"></div>
                            </div>
                        </div>
                    </li>
                    <li id="li3">
                        <div class="li-content">
                            <div class="li-filename" id="li-filename3"></div>
                            <div class="progress-content">
                                <div class="progress-bar" id="progress-bar3"></div>
                                <div class="percent" id="percent3"></div>
                            </div>
                        </div>
                    </li>
                    <li id="li4">
                        <div class="li-content">
                            <div class="li-filename" id="li-filename4"></div>
                            <div class="progress-content">
                                <div class="progress-bar" id="progress-bar4"></div>
                                <div class="percent" id="percent4"></div>
                            </div>
                        </div>
                    </li>
                </ul>`;
        let htmlContent = `<div id="modal-header">
                            <h5>${ModalTitle}</h5>
                            <a class="modal_close" id="modalClose" href="#"></a>
                          </div>
                          <div class="modal-content">
                            <p>${ModalContent}</p>
                          </div>
                          <div class="modal-footer">
                              <input type="text" hidden id="destPath" name="destPath" value=""/>  
                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Cerrar</a>
                          </div>    `;


        function fnUploadFile(formData, nFile, fileName) {
            $('#li' + nFile).show();
            $('#li-fileName' + nFile).show();
            $('#li-fileName' + nFile).html(fileName);
            let realpath = '';
            if (currentPath == '/') {
                realpath = currentPath;
            } else {
                realpath = realRootPath + currentPath;
            }
            $.ajax({
                url: '/files/upload?destPath=' + realpath,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader('Authorization', 'Bearer ' + Token);
                    xhrObj.setRequestHeader("destPath",realpath);
            },
                success: function (data) {
                    console.log(fileName + 'upload successful!\n' + data);
                },
                xhr: function () {
                    let xhr = new XMLHttpRequest();
                    let percentComplete = 0;
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            $('#percent' + nFile).text(percentComplete + '%');
                            $('#progress-bar' + nFile).width(percentComplete + '%');
                            if (percentComplete === 100) {
                                $('#refresh').trigger('click');
                            }
                        }
                    }, false);
                    return xhr;
                }
            });
        }
        $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
        //$('.modal-content').css('width: 350px;');
        $('.modal').css('width: 40% !important');
        $('#modal').show();
        $('#btnCloseDownload').on('click', (e) => {
            $('#download').removeClass('disabled');
            $('#modal').hide();
        });
        $('#modalClose').on('click', (e) => {
            $('#download').removeClass('disabled');
            $('#modal').hide();
        });
        $('#upload-input').on('change', function () {

            var files = $(this).get(0).files;
            console.log(files.length);
            if (files.length > 0 && files.length < 5) {
                // create a FormData object which will be sent as the data payload in the
                // AJAX request
                // loop through all the selected files and add them to the formData object
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var formData = new FormData();
                    // add the files to formData object for the data payload
                  
                    formData.append('uploads[]', file, file.name);
                    fnUploadFile(formData, i, file.name);
                }
            } else {
                M.toast({
                    html: 'No se pueden descargar más de 5 archivos a la vez'
                });
            }
        });
    };


    //TODO: Optimizar renderizado de elementos li 
    //incorporando el contenido en el bucle _loop
    const download = (fileList, text) => {
        let reqList = [],
            handlerCount = 0,
            responseTimeout = [];
        let w = 32;
        let h = 440;
        let ModalTitle = "Descarga de archivos seleccionados";
        let ModalContent = `<ul class="preloader-file" id="DownloadfileList">
            <li id="li0">
                <div class="li-content">
                    <div class="li-filename" id="li-filename0"></div>
                    <div class="progress-content">
                        <div class="progress-bar" id="progress-bar0"></div>
                        <div class="percent" id="percent0"></div>
                    </div>
                </div>
            </li>
            <li id="li1">
                <div class="li-content">
                    <div class="li-filename" id="li-filename1"></div>
                    <div class="progress-content">
                        <div class="progress-bar" id="progress-bar1"></div>
                        <div class="percent" id="percent1"></div>
                    </div>
                </div>
            </li>
            <li id="li2">
                <div class="li-content">
                    <div class="li-filename" id="li-filename2"></div>
                    <div class="progress-content">
                        <div class="progress-bar" id="progress-bar2"></div>
                        <div class="percent" id="percent2"></div>
                    </div>
                </div>
            </li>
            <li id="li3">
                <div class="li-content">
                    <div class="li-filename" id="li-filename3"></div>
                    <div class="progress-content">
                        <div class="progress-bar" id="progress-bar3"></div>
                        <div class="percent" id="percent3"></div>
                    </div>
                </div>
            </li>
            <li id="li4">
                <div class="li-content">
                    <div class="li-filename" id="li-filename4"></div>
                    <div class="progress-content">
                        <div class="progress-bar" id="progress-bar4"></div>
                        <div class="percent" id="percent4"></div>
                    </div>
                </div>
            </li>
        </ul>`;
        let htmlContent = `<div id="modal-header">
                            <h5>${ModalTitle}</h5>
                            <a class="modal_close" id="modalClose" href="#"></a>
                          </div>
                          <div class="modal-content">
                            <p>${ModalContent}</p>
                          </div>
                          <div class="modal-footer">
                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Cerrar</a>
                          </div>    `;
        $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
        //$('.modal-content').css('width: 350px;');
        $('.modal').css('width: 40% !important');
        $('#modal').show();
        $('#download').addClass('disabled');
        $('#btnCloseDownload').on('click', (e) => {
            $('#download').removeClass('disabled');
            $('#modal').hide();
            $('#refresh').trigger('click');
        });
        $('#modalClose').on('click', (e) => {
            $('#download').removeClass('disabled');
            $('#modal').hide();
            $('#refresh').trigger('click');
        });
        let _loop = (i) => {
            let fName = fileList[i];
            let liNumber = document.querySelector('#li' + i);
            let liFilename = document.querySelector('#li-filename' + i);
            let progressBar = document.querySelector('#progress-bar' + i);
            let percentLabel = document.querySelector('#percent' + i);
            responseTimeout[i] = false;
            fName = fName.split('\\').pop().split('/').pop();
            reqList[i] = new XMLHttpRequest();
            reqList[i].open('POST', '/files/download', true);
            reqList[i].responseType = 'arraybuffer';
            liNumber.style.display = 'block';
            liFilename.innerHTML = fName;
            reqList[i].timeout = 36000;
            reqList[i].ontimeout = function () {
                console.log('** Timeout error ->File:' + fName + ' ' + reqList[i].status + ' ' + reqList[i].statusText);
                // handlerCount = handlerCount - 1
                progressBar.innerHTML = 'Timeout Error';
                percentLabel.innerHTML = '';
                progressBar.style.color = 'red';
                progressBar.style.width = '100%';
                progressBar.style.backgroundColor = 'white';
                progressBar.classList.add('blink');
                responseTimeout[i] = true;
            };
            reqList[i].onprogress = function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = parseInt(evt.loaded / evt.total * 100);
                    progressBar.style.width = percentComplete + '%';
                    percentLabel.innerHTML = percentComplete + '%';
                }
            };
            reqList[i].onerror = function () {
                console.log('** An error occurred during the transaction ->File:' + fName + ' ' + req.status + ' ' + req.statusText);
                handlerCount = handlerCount - 1;
                percentLabel.innerHTML = 'Error';
                percentLabel.style.color = 'red';
            };
            reqList[i].onloadend = function () {
                handlerCount = handlerCount - 1;
                if (!responseTimeout[i]) {
                    progressBar.style.width = '100%';
                    percentLabel.innerHTML = '100%';
                }
                if (handlerCount === 0) {
                    $("#download-end").show();
                }
            };
            reqList[i].onloadstart = function () {
                handlerCount = handlerCount + 1;
                progressBar.style.width = '0';
                percentLabel.innerHTML = '0%';
            };
            reqList[i].onload = function () {
                if (reqList[i].readyState === 4 && reqList[i].status === 200) {
                    var filename = '';
                    var disposition = reqList[i].getResponseHeader('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
                    var type = reqList[i].getResponseHeader('Content-Type');
                    var blob = new Blob([this.response], {
                        type: type
                    });
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);

                        if (filename) {
                            // use HTML5 a[download] attribute to specify filename
                            var a = document.createElement('a');
                            // safari doesn't support this yet
                            if (typeof a.download === 'undefined') {
                                window.location = downloadUrl;
                                preloader.style.display = 'none';
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
            reqList[i].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            console.log(currentPath + '/' + fileList[i]);
            reqList[i].send(serializeObject({
                'filename': currentPath + '/' + fileList[i]
            }));
        };
        for (var i = 0; i < fileList.length; i++) {
            _loop(i);
        }
    };

    const refreshPath = (cPath) => {
        console.log('init path: ', cPath);
        let newHtmlContent = `<li><label id="currentpath">Path:</label></li>
                              <li><spand>&nbsp;</spand><a class="breadcrumb" href="#!">/</a></li>`;
        console.log('cPath lenght:', cPath.length);
        if (cPath.length > 1) {
            let cPathArray = cPath.split('/');
            console.log('refreshPath:cPathArray ', cPathArray);
            cPathArray.forEach((val, idx, array) => {
                console.log(val);
                if (val.trim() == '') {
                    if (idx == 0) {
                        newHtmlContent += `<li><a class="breadcrumb" href="#!">${val}</a></li>`;
                    }
                } else {
                    if (idx == 1) {
                        newHtmlContent += `<li><spand>&nbsp;</spand><a class="breadcrumb" href="#!">${val}</a></li>`;
                    } else {
                        newHtmlContent += `<li><spand>/&nbsp;</spand><a class="breadcrumb" href="#!">${val}</a></li>`;
                    }
                }
            });
        }

        $('#currentPath').html(newHtmlContent);

        $('.breadcrumb').on('click', (e) => {
            changePath(e.target.innerText);
        });

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + Token);
        let realpath = '';
        if (realRootPath !== '/') {
            realpath = '/' + realRootPath + cPath;
        } else {
            if (cPath == '/') {
                realpath = cPath;
            } else {
                realpath = realRootPath + cPath;
            }

        }
        console.log('realRootPath: ' + realRootPath + ' realpath:' + realpath);
        fetch('/files?path=' + encodeURI(realpath), {
                method: 'GET',
                headers: headers
            })
            .then(FetchHandleErrors)
            .then(r => r.json())
            .then((data) => {
                console.log(data);
                refreshFilesTable(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectAll = (e) => {
        var allCkeckbox = document.querySelectorAll('.check');
        let v = document
            .querySelector("#selectAllFiles")
            .checked;
        console.log(v);
        allCkeckbox.forEach(function (element, i) {
            if (!allCkeckbox[i].disabled) {
                if (v === true) {
                    console.log(element);

                    //allCkeckbox[i].setAttribute('checked', 'checked');
                } else {
                    console.log(element);
                    //allCkeckbox[i].trigger('click');
                    //allCkeckbox[i].removeAttribute('checked');
                }
                $('#' + element.id).trigger('click');
            }
        });
        console.log(getCheckedFiles());
    };

    const getCheckedFiles = function () {
        var checkedFiles = [];
        var allElements = document.querySelectorAll('.typeFile');
        allElements.forEach(function (element, i) {
            // c(element.children[0].children[0].checked)
            if (element.children[0].children[0].checked) {
                checkedFiles.push(currentPath + '/' + element.children[1].innerHTML);
                // c(element.children[1].innerHTML)
            }
        });
        return checkedFiles;
    };

    const getCheckedFolder = function getCheckedFolder() {
        var checkedFolders = [];
        var allElements = document.querySelectorAll('.dashboard-path');
        allElements.forEach(function (v, i) {
            v
                .children[0]
                .childNodes
                .forEach(function (l, idx) {
                    if (l.children[0].checked) {
                        checkedFolders.push(currentPath + '/' + l.children[2].text);
                        // c(currentPath + l.children[2].text)
                    }
                });
        });
        return checkedFolders;
    };

    const renderFilesTable = (aFol, aFil) => {
        let newHtmlContent = ``;
        const tbodyContent = document
            .getElementById("tbl-files")
            .getElementsByTagName('tbody')[0];

        newHtmlContent += `<tr><td><span>&nbsp;</span></td>
              <td><i class="fas fa-folder"></i><a href="#" id="goBackFolder" class="file-Name typeFolder">..</a></td>
              <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`;
        aFol.forEach((val, idx, array) => {
            newHtmlContent += `<tr><td><input class="filled-in checkFolder check" id="${val.name}" type="checkbox">
              <label class="checkbox left" for="${val.name}"></label></td>`;
            newHtmlContent += `<td><i class="fas fa-folder"></i><a href="#" class="file-Name typeFolder">${val.name}</a></td>`;
            newHtmlContent += `<td>&nbsp;</td><td>&nbsp;</td><td>${val.date}</td></tr>`;
        });

        aFil.forEach((val, idx, array) => {
            let fileSize = parseInt(val.size / 1024);
            newHtmlContent += `<tr><td><input class="filled-in checkFile check" id="${val.name}" type="checkbox">
            <label class="checkbox left" for="${val.name}"></label></td>`;
            newHtmlContent += `<td><i class="far fa-file"></i><span class="typeFile">${val.name}</span></td>`;
            newHtmlContent += `<td>${fileSize} KB</td><td>&nbsp;</td><td>${val.date}</td></tr>`;
        });
        tbodyContent.innerHTML = newHtmlContent;
    };


    const goBackFolder = (folder) => {
        let newPath = '';
        console.log('goBackFolder:folder ', folder);
        console.log('goBackFolder:currentPath ', currentPath);
        if (currentPath !== '/' && folder == '..') {
            let lastFolder = currentPath.lastIndexOf('/');
            if (lastFolder == 0) {
                newPath = '/';
            } else {
                newPath = currentPath.substr(0, lastFolder);
            }
            console.log('goBackFolder:lastFolder-> ' + lastFolder + ' goBackFolder:newPath->' + newPath);
            changePath(newPath.trim());
        }
    };
    const refreshFilesTable = (data) => {
        const tbodyContent = document
            .getElementById("tbl-files")
            .getElementsByTagName('tbody')[0];

        console.log(data);
        aFolders = [];
        aFiles = [];
        if (data.message) return null;
        data.forEach((val, idx, array) => {
            let fileSize = parseInt(val.size / 1024);
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

        $('.file-Name').on('click', (e) => {
            console.log(e);
            console.log('Current Path: ', currentPath);
            let newPath = '';
            if (e.target.innerText != '..') {
                if (currentPath.trim() == '/') {
                    newPath = currentPath.trim() + e.target.innerText;
                } else {
                    newPath = currentPath.trim() + '/' + e.target.innerText;
                }

                console.log('New Path: ', newPath.trim());
                refreshPath(newPath.trim());
                currentPath = newPath.trim();
                refreshBarMenu();
            } else {
                if (currentPath !== RootPath) goBackFolder(e.target.innerText);
            }
        });
        $('.check').on('click', (e) => {
            selectDeselect(e);
            console.log(e.target.checked);
            console.log(e.target.className.split(/\s+/).indexOf("checkFile"));
            console.log(e.target.parentNode.parentNode.rowIndex);
            console.log(e.target.parentNode.children[1].htmlFor);
        });
        $('#goBackFolder').on('click', (e) => {
            e.preventDefault();
            goBackFolder();
        });
    };

    const selectDeselect = (e) => {
        const isChecked = e.target.checked;
        const contentType = e.target.className.split(/\s+/).indexOf("checkFile");
        const name = e.target.parentNode.children[1].htmlFor;

        if (contentType != -1) {
            if (isChecked) {
                aSelectedFiles.push(name);
            } else {
                const idx = aSelectedFiles.indexOf(name);
                if (idx > -1) {
                    aSelectedFiles.splice(idx, 1);
                }
            }
        } else {
            if (isChecked) {
                aSelectedFolders.push(name);
            } else {
                const idx = aSelectedFolders.indexOf(name);
                if (idx > -1) {
                    aSelectedFolders.splice(idx, 1);
                }
            }

        }
        console.log(aSelectedFiles, aSelectedFolders);
    };

    const showUserProfile = (w, h, t) => {
        let ModalTitle = t;
        let ModalContent = `<table id="tableUserProfile" class="striped highlight">
                    <tr><td>User Name:</td><td>${UserName}</td></tr>
                    <tr><td>User Role:</td><td>${UserRole}</td></tr> 
                    <tr><td>Company Name:</td><td>${CompanyName}</td></tr>
                    <tr><td colspan="2" style="text-align:center;border-botom:1px solid #CCC">&nbsp;</td></tr>
                    <tr><td>Allow new Folder:</td><td>`;
        ModalContent += (AllowNewFolder == '1') ?
            'Allow' :
            'Deny';
        ModalContent += `</td></tr>
                    <tr><td>Allow rename Folder:</td><td>`;
        ModalContent += (AllowRenameFolder == '1') ?
            'Allow' :
            'Deny';
        ModalContent += `</td></tr>
                    <tr><td>Allow rename File:</td><td>`;
        ModalContent += (AllowRenameFile == '1') ?
            'Allow' :
            'Deny';
        ModalContent += `</td></tr>
                    <tr><td>Allow delete Folder:</td><td>`;
        ModalContent += (AllowDeleteFolder == '1') ?
            'Allow' :
            'Deny';
        ModalContent += `</td></tr>
                    <tr><td>Allow delete File:</td><td>`;
        ModalContent += (AllowDeleteFile == '1') ?
            'Allow' :
            'Deny';
        ModalContent += `</td></tr>
                    <tr><td>Allow Upload:</td><td>`;
        ModalContent += (AllowUpload == '1') ?
            'Allow' :
            'Deny';
        ModalContent += `</td></tr>
                    <tr><td>Allow Download:</td><td>`;
        ModalContent += (AllowDownload == '1') ?
            'Allow' :
            'Deny';
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
        $('#modal')
            .html(htmlContent)
            .css('width: ' + w + '%;height: ' + h + 'px;');
        $('#modal').show();
        $('#ModalClose').on('click', () => {
            $('#modal').hide();
        });
        $('#modalClose').on('click', () => {
            $('#modal').hide();
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
        $('#modal')
            .html(htmlContent)
            .css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
        //$('.modal-content').css('width: 350px;');
        $('.modal').css('width: 40% !important');
        $('#modal').show();
        $('#AcceptChangeUserPassword').on('click', (e) => {
            e.preventDefault();
            let username = UserName;
            let newpassword = $('#newpassword').val();
            console.log(username, newpassword);
            ajax({
                type: 'POST',
                url: '/changepasswd',
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
                success: (data) => {
                    //console.log(JSON.parse(data))
                    let {
                        status,
                        message
                    } = JSON.parse(data);
                    console.log('status', status);
                    if (status === 'FAIL') {
                        M.toast({
                            html: message
                        });
                        d
                            .querySelector('#message')
                            .innerHTML = message;
                    } else {
                        M.toast({
                            html: message
                        });
                        console.log(message);
                    }
                    $('#modal').hide();
                },
                complete: (xhr, status) => {
                    console.log(xhr, status);
                    //waiting.style.display = 'none'
                    $('#modal').hide();
                },
                error: (xhr, err) => {
                    M.toast({
                        html: 'Wrong password'
                    });
                    if (err === 'timeout') {
                        console.log('Timeout Error');
                    } else {
                        console.log(xhr, err);
                    }
                }
            });
        });
        $('#modalClose').on('click', () => {
            $('#modal').hide();
        });
        $('#ModalClose').on('click', () => {
            $('#modal').hide();
        });
    };

    let refreshBarMenu = () => {
        if (AllowNewFolder === '1') {
            $('#NewFolder').removeClass('disabled');
        } else {
            $('#NewFolder').addClass('disabled');
        }
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
        if (AllowUpload == '1') {
            $('#upload').removeClass('disabled');
        } else {
            $('#upload').removeClass('disabled').addClass('disabled');
        }

        if (AllowDownload == '1') {
            $('#download').removeClass('disabled');
        } else {
            $('#download').removeClass('disabled').addClass('disabled');
        }
        if (UserRole == 'admin') {
            $('#settings').show();
        } else {
            $('#settings').hide();
        }
        $('#modaltrigger').html(UserName);
        $('#modaltrigger').leanModal({
            top: 110,
            overlay: 0.45,
            closeButton: ".hidemodal"
        });
    };

    $('#selectAllFiles').on('click', (e) => {
        e.preventDefault();
        if (document.querySelector("#selectAllFiles").checked === false) {
            document.querySelector("#selectAllFiles").setAttribute('checked', 'checked');
        } else {
            document.querySelector("#selectAllFiles").removeAttribute('checked');
        }
        console.log(document.querySelector("#selectAllFiles").checked);
        selectAll(e.target.htmlFor);
    });

    $('a').on('click', function (e) {
        console.log(this.id);
        console.log($(this).hasClass('disabled'));

        if (!$(this).hasClass('disabled')) {
            switch (this.id) {
                case 'settings':
                    break;
                case 'usertrigger':
                    e.stopPropagation();
                    console.log($('#Usersdropdown').css('display'));
                    if ($('#Usersdropdown').css('display') === 'block') {
                        $('#usertrigger').removeClass('selected');
                        $('#Usersdropdown').hide();
                    } else {
                        $('#usertrigger').addClass('selected');
                        $('#Usersdropdown').show();
                    }
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
                    showChangeUserPassword(32, 440, 'Change User Password');
                    break;
                case 'userProfile':
                    $('#Usersdropdown').hide();
                    showUserProfile(40, 440, 'User Profile');
                    break;
                case 'logoutModalClose':
                case 'cancel':
                    $('#logoutmodal').hide();
                    break;
                case 'home':
                    currentPath = RootPath;
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
                    upload();
                    break;
                case 'download':
                    if (aSelectedFiles.length > 0) {
                        if (aSelectedFiles.length > 5) {
                            M.toast({
                                html: 'No se pueden descargar más de 5 archivos a la vez'
                            });
                            break;
                        }
                        download(aSelectedFiles, 'File');
                    } else {
                        M.toast({
                            html: 'No se han seleccionado archivos para descargar'
                        });
                    }
                    break;
            }
        } else {
            M.toast({
                html: 'Opcion no permitida'
            });
        }
    });
    $('#usertrigger')
        .html(UserName)
        .attr('title', 'Empresa: ' + CompanyName);

    $('#settings').on('click', (e) => {
        console.log($('#Settingdropdown').css('display'));
        if ($('#Settingdropdown').css('display') === 'block') {
            $('#settings').removeClass('selected');
            $('#Settingdropdown').removeClass('setting').hide();
        } else {
            $('#settings').addClass('selected');
            $('#Settingdropdown').addClass('setting').show();
        }
    });
    $('#Usersdropdown').on('mouseleave', () => {
        $('#Usersdropdown').hide();
        $('#usertrigger').removeClass('selected');
    });
    $('#Settingdropdown').on('mouseleave', () => {
        $('#Settingdropdown').hide();
        $('#settings').removeClass('selected');
    });
    refreshPath(currentPath);
    refreshBarMenu();
    console.log(document.querySelector("#selectAllFiles").checked);
});
