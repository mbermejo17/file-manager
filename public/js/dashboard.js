(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
'use sctrict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ajax = require('./vendor/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _jsBase = require('js-base64');

var _md = require('./vendor/md5.min');

var _md2 = _interopRequireDefault(_md);

var _jsCookie = require('./vendor/js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
  var _this = this;

  var UserName = _jsCookie2.default.get('UserName');
  var UserRole = _jsCookie2.default.get('UserRole');
  var CompanyName = _jsCookie2.default.get('CompanyName');
  var realRootPath = _jsCookie2.default.get('RootPath');
  var Token = _jsCookie2.default.get('token');
  var AccessString = _jsCookie2.default.get('AccessString');

  var _AccessString$split = AccessString.split(','),
      _AccessString$split2 = _slicedToArray(_AccessString$split, 7),
      AllowNewFolder = _AccessString$split2[0],
      AllowRenameFolder = _AccessString$split2[1],
      AllowRenameFile = _AccessString$split2[2],
      AllowDeleteFolder = _AccessString$split2[3],
      AllowDeleteFile = _AccessString$split2[4],
      AllowUpload = _AccessString$split2[5],
      AllowDownload = _AccessString$split2[6];

  var RootPath = '/';
  var currentPath = RootPath;
  var aSelectedFiles = [];
  var aSelectedFolders = [];
  var aFolders = [];
  var aFiles = [];

  var htmlUserFormTemplate = '<div class="card-panel">\n    <h4 class="header2">New User</h4>\n    <div class="row">\n      <form class="col s12">\n        <div class="row">\n          <div class="input-field col s12">\n            <i class="mdi-action-account-circle prefix"></i>\n            <input id="name3" type="text">\n            <label for="first_name">Name</label>\n          </div>\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <i class="mdi-communication-business prefix"></i>\n            <input id="companyName" type="text">\n            <label for="companyName">Company Name</label>\n          </div>\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <i class="mdi-action-lock-outline prefix"></i>\n            <input id="password3" type="password">\n            <label for="password3">Password</label>\n          </div>\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <i class="mdi-action-lock-outline prefix"></i>\n            <input id="repeatpassword3" type="password">\n            <label for="repeatpassword3">Repeat Password</label>\n          </div>\n        </div>\n        <div class="row">\n            <div class="input-field col s12">\n              <i class="mdi-file-folder prefix"></i>\n              <input id="rootPath" type="text">\n              <label for="rootPath">Root Path</label>\n            </div>\n        </div> \n        <div class="row">\n        <div class="switch-container left">\n          <!-- Switch -->\n          <div class="switch">\n            Allow Download : \n            <label>\n              Off\n              <input type="checkbox">\n              <span class="lever"></span> On\n            </label>\n          </div>\n          <br>\n          <div class="switch">\n            Allow New Folder : \n            <label>\n              Off\n              <input type="checkbox">\n              <span class="lever"></span> On\n            </label>\n          </div>\n          <br>\n          <div class="switch">\n            Allow Delete Folder: \n            <label>\n              Off\n              <input type="checkbox">\n              <span class="lever"></span> On\n            </label>\n          </div>\n          </div>\n          <div class="switch-container right">\n          <div class="switch">\n            Allow Upload : \n            <label>\n              Off\n              <input type="checkbox">\n              <span class="lever"></span> On\n            </label>\n          </div>\n          <br>\n          <div class="switch">\n            Allow Rename : \n            <label>\n              Off\n              <input type="checkbox">\n              <span class="lever"></span> On\n            </label>\n          </div>\n          <br>\n          <div class="switch">\n            Allow Delete File: \n            <label>\n              Off\n              <input type="checkbox">\n              <span class="lever"></span> On\n            </label>\n          </div>\n          \n          </div>\n        </div>   \n        <div class="row">\n            <div class="input-field col s12">\n              <button class="btn cyan waves-effect waves-light right" type="submit" name="action">Add User\n                <i class="mdi-action-done right"></i>\n              </button>\n            </div>\n        </div>\n      </form>\n    </div>\n  </div>';

  var htmlUploadDownloadTemplate = '<ul class="preloader-file" id="DownloadfileList">\n            <li id="li0">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename0"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar0"></div>\n                        <div class="percent" id="percent0"></div>\n                        <a class="modal_close" id="abort0" href="#"></a>\n                    </div>\n                </div>\n            </li>\n            <li id="li1">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename1"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar1"></div>\n                        <div class="percent" id="percent1"></div>\n                        <a class="modal_close" id="abort1" href="#"></a>\n                    </div>\n                </div>\n            </li>\n            <li id="li2">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename2"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar2"></div>\n                        <div class="percent" id="percent2"></div>\n                        <a class="modal_close" id="abort2" href="#"></a>\n                    </div>   \n                </div>\n            </li>\n            <li id="li3">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename3"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar3"></div>\n                        <div class="percent" id="percent3"></div>\n                        <a class="modal_close" id="abort3" href="#"></a>\n                    </div>   \n                </div>\n            </li>\n            <li id="li4">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename4"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar4"></div>\n                        <div class="percent" id="percent4"></div>\n                        <a class="modal_close" id="abort4" href="#"></a>\n                    </div>\n                </div>\n            </li>\n        </ul>';

  var logout = function logout() {
    _jsCookie2.default.remove('UserName');
    _jsCookie2.default.remove('UserRole');
    _jsCookie2.default.remove('sessionId');
    _jsCookie2.default.remove('token');
    _jsCookie2.default.remove('wssURL');
    _jsCookie2.default.remove('RootPath');
    _jsCookie2.default.remove('CompanyName');
    _jsCookie2.default.remove('AccessString');
    document.location.href = '/';
  };

  var serializeObject = function serializeObject(dataObject) {
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

  var changePath = function changePath(newPath) {
    console.log('changePath:newPath ', newPath);
    currentPath = newPath.trim();
    refreshPath(currentPath);
    refreshBarMenu();
  };

  var showAddUserForm = function showAddUserForm() {
    $("#userForm").html(htmlUserFormTemplate).show();
  };

  var deleteSelected = function deleteSelected() {
    if (aSelectedFolders.length > 0) {
      showDialogYesNo('Delete foldes', 'Delete selected folders?', function (result) {
        if (result == 'YES') {
          $.when(deleteFolder(currentPath)).then(function () {
            if (aSelectedFiles.length > 0) {
              showDialogYesNo('Delete Files', 'Delete selected files?', function (result) {
                console.log('yesNo', result);
                if (result == 'YES') deleteFile(currentPath);
              });
            }
          });
        }
      });
    } else {
      if (aSelectedFiles.length > 0) {
        showDialogYesNo('Delete Files', 'Delete selected files?', function (result) {
          console.log('yesNo', result);
          if (result == 'YES') deleteFile(currentPath, function (result) {
            return;
          });
        });
      }
    }
  };

  var FetchHandleErrors = function FetchHandleErrors(response) {
    if (!response.ok) {
      //throw Error(response.statusText);
      if (response.statusCode == 401) {
        logout();
      }
    }
    return response;
  };
  var upload = function upload() {
    var w = 32;
    var h = 440;
    var aListHandler = [];
    var handlerCounter = 0;
    var ModalTitle = "Subida de archivos";
    var ModalContent = '<label class="file-input waves-effect waves-teal btn-flat btn2-unify">Select files<input id="upload-input" type="file" name="uploads[]" multiple="multiple" class="modal-action modal-close"></label>\n                        <span id="sFiles">Ningun archivo seleccionado</span>';
    ModalContent += htmlUploadDownloadTemplate;
    var htmlContent = '<div id="modal-header">\n                          <h5>' + ModalTitle + '</h5>\n                          <a class="modal_close" id="modalClose" href="#"></a>\n                        </div>\n                        <div class="modal-content">\n                          <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                              <input type="text" hidden id="destPath" name="destPath" value=""/>\n                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancel uploads</a>  \n                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseUpload" href="#!">Close</a>\n                      </div>';

    $('#upload').removeClass('disabled').addClass('disabled');

    function fnUploadFile(formData, nFile, fileName) {
      $('#li' + nFile).show();
      $('#li-filename' + nFile).show();
      $('#li-filename' + nFile).html(fileName);
      var realpath = '';
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
        timeout: 270000,
        beforeSend: function beforeSend(xhrObj) {
          xhrObj.setRequestHeader('Authorization', 'Bearer ' + Token);
          xhrObj.setRequestHeader("destPath", realpath);
        },
        success: function success(data) {
          console.log(fileName + 'upload successful!\n' + data);
          $('.toast').removeClass('success').addClass('success');
          M.toast({
            html: fileName + ' uploaded sucessfully'
          });
          $('#abort' + nFile).hide();
          $('#refresh').trigger('click');
          handlerCounter = handlerCounter - 1;
          if (handlerCounter == 0) {
            $('#btnCancelAll').removeClass('disabled').addClass('disabled');
          }
        },
        xhr: function xhr() {
          aListHandler[nFile] = new XMLHttpRequest();
          var percentComplete = 0;
          aListHandler[nFile].upload.addEventListener('progress', function (evt) {
            if (evt.lengthComputable) {
              percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              $('#percent' + nFile).text(percentComplete + '%');
              $('#progress-bar' + nFile).width(percentComplete + '%');
              /* if (percentComplete === 100) {
                $('#refresh').trigger('click');
              } */
            }
          }, false);
          return aListHandler[nFile];
        }
      });
    }

    $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
    //$('.modal-content').css('width: 350px;');
    $('.modal-container').css('width: 40% !important');
    $('.file-input').show();
    $('#modal').show();
    $('#lean-overlay').show();
    $('#btnCloseUpload').on('click', function (e) {
      $('#upload').removeClass('disabled');
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
    $('#modalClose').on('click', function (e) {
      $('#upload').removeClass('disabled');
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
    $('#btnCancelAll').removeClass('disabled');
    $('.modal_close').on('click', function (e) {
      e.preventDefault();
      console.log(e);
      var n = parseInt(e.target.id.slice(-1));
      aListHandler[n].abort();
      var percentLabel = document.querySelector('#percent' + n);
      var progressBar = document.querySelector('#progress-bar' + n);
      progressBar.innerHTML = 'Canceled by user';
      percentLabel.innerHTML = '';
      progressBar.style.color = 'red';
      progressBar.style.width = '100%';
      progressBar.style.backgroundColor = 'white';
      $(e.target).hide();
    });
    $('#btnCancelAll').on('click', function (e) {
      for (var x = 0; x < 4; x++) {
        aListHandler[x].abort();
        var percentLabel = document.querySelector('#percent' + x);
        var progressBar = document.querySelector('#progress-bar' + x);
        progressBar.innerHTML = 'Canceled by user';
        percentLabel.innerHTML = '';
        progressBar.style.color = 'red';
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = 'white';
      }
      $('#btnCancelAll').addClass('disabled');
    });
    $('#upload-input').on('change', function () {
      var files = $(this).get(0).files;
      handlerCounter = files.length;
      files.length > 0 ? $('#sFiles').html(files.length + ' archivos seleccionados.') : $('#sFiles').html(files[0]);
      console.log(files.length);
      $('.file-input').hide();
      if (files.length > 0 && files.length <= 5) {
        $('#btnCloseUpload').removeClass('disabled').addClass('disabled');
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var formData = new FormData();
          // add the files to formData object for the data payload

          formData.append('uploads[]', file, file.name);
          fnUploadFile(formData, i, file.name);
        }
        $('#btnCloseUpload').removeClass('disabled');
      } else {
        M.toast({
          html: 'No se pueden descargar más de 5 archivos a la vez'
        });
      }
    });
  };

  var newFolder = function newFolder(folderName) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + Token);
    headers.append('Content-Type', 'application/json');
    fetch('/files/newfolder', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "path": currentPath,
        "folderName": folderName
      }),
      timeout: 10000
    }).then(FetchHandleErrors).then(function (r) {
      return r.json();
    }).then(function (data) {
      console.log(data);
      if (data.status == 'OK') {
        $('#modal').hide();
        $('#lean-overlay').hide();
        $('#refresh').trigger('click');
        M.toast({
          html: 'Creada nueva carpeta ' + data.data.folderName
        });
      }
    }).catch(function (err) {
      console.log(err);
    });
  };

  var showDialogYesNo = function showDialogYesNo(title, content, cb) {
    var w = 32;
    var h = 440;
    var htmlContent = '<div id="modal-header">\n                            <h5>' + title + '</h5>\n                            <a class="modal_close" id="logoutModalClose" href="#hola"></a>\n                        </div>\n                        <div class="modal-content">\n                            <p>' + content + '</p>\n                        </div>\n                        <div class="modal-footer">\n                            <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnYes" href="#">Yes</a>\n                            <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnNO" href="#">NO</a>\n                        </div>';
    $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
    //$('.modal-content').css('width: 350px;');
    $('.modal').css('width: 40% !important');
    $('#modal').show();
    $('#lean-overlay').show();
    $('#btnYes').on('click', function (e) {
      e.preventDefault();
      $('#modal').hide();
      $('#lean-overlay').hide();
      return cb('YES');
    });
    $('#btnNO').on('click', function (e) {
      e.preventDefault();
      $('#modal').hide();
      $('#lean-overlay').hide();
      return cb('NO');
    });
  };

  var deleteFile = function deleteFile(path) {
    var headers = new Headers();
    var x = 0;
    var aF = aSelectedFiles.slice();
    console.log(aF);
    headers.append('Authorization', 'Bearer ' + Token);
    headers.append('Content-Type', 'application/json');
    $('#waiting').addClass('active');
    for (x = 0; x < aF.length; x++) {
      console.log('Deleting file ' + aF[x] + ' ...');
      fetch('/files/delete', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          "path": path,
          "fileName": aF[x]
        }),
        timeout: 720000
      }).then(FetchHandleErrors).then(function (r) {
        return r.json();
      }).then(function (data) {
        console.log(data);
        if (data.status == 'OK') {
          aSelectedFiles.shift();
          $('.toast').removeClass('success').addClass('success');
          M.toast({
            html: 'Archivo ' + data.data.fileName + ' borrado'
          });
          $('#refresh').trigger('click');
        }
      }).catch(function (err) {
        console.log(err);
        $('.toast').removeClass('err').addClass('err');
        M.toast({
          html: err
        });
      });
    }
    $('#waiting').removeClass('active');
  };

  var deleteFolder = function deleteFolder(path) {
    var headers = new Headers();
    var x = 0;
    var aF = aSelectedFolders.slice();
    console.log(aF);
    headers.append('Authorization', 'Bearer ' + Token);
    headers.append('Content-Type', 'application/json');
    $('#waiting').addClass('active');
    for (x = 0; x < aF.length; x++) {
      console.log('Deleting folder ' + aF[x] + ' ...');
      fetch('/files/delete', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          "path": path,
          "fileName": aF[x]
        }),
        timeout: 720000
      }).then(FetchHandleErrors).then(function (r) {
        return r.json();
      }).then(function (data) {
        console.log(data);
        if (data.status == 'OK') {
          $('.toast').removeClass('success').addClass('success');
          M.toast({
            html: 'Carpeta ' + data.data.fileName + ' borrada'
          });
          aSelectedFolders.shift();
        }
      }).catch(function (err) {
        console.log(err);
      });
    }
    $('#waiting').removeClass('active');
  };

  //TODO: Optimizar renderizado de elementos li 
  //incorporando el contenido en el bucle _loop
  var download = function download(fileList, text) {
    var reqList = [],
        handlerCount = 0,
        responseTimeout = [];
    var w = 32;
    var h = 440;
    var ModalTitle = "Descarga de archivos seleccionados";
    var ModalContent = htmlUploadDownloadTemplate;
    var htmlContent = '<div id="modal-header">\n                          <h5>' + ModalTitle + '</h5>\n                          <a class="modal_close" id="modalClose" href="#"></a>\n                      </div>\n                      <div class="modal-content">\n                          <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancel downloads</a>\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Cerrar</a>\n                      </div>';
    $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
    //$('.modal-content').css('width: 350px;');
    $('.modal').css('width: 40% !important');
    $('#modal').show();
    $('#lean-overlay').show();
    $('#download').addClass('disabled');
    $('#btnCloseDownload').on('click', function (e) {
      $('#download').removeClass('disabled');
      $('#modal').hide();
      $('#lean-overlay').hide();
      $('#refresh').trigger('click');
      aSelectedFiles = [];
    });
    $('#modalClose').on('click', function (e) {
      $('#download').removeClass('disabled');
      $('#modal').hide();
      $('#lean-overlay').hide();
      $('#refresh').trigger('click');
      aSelectedFiles = [];
    });
    $('#waiting').addClass('active');
    $('#btnCancelAll').on('click', function (e) {
      for (var x = 0; x < 4; x++) {
        reqList[x].abort();
        var percentLabel = document.querySelector('#percent' + x);
        var progressBar = document.querySelector('#progress-bar' + x);
        progressBar.innerHTML = 'Canceled by user';
        percentLabel.innerHTML = '';
        progressBar.style.color = 'red';
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = 'white';
      }
      $('#btnCancelAll').addClass('disabled');
    });
    $('.modal_close').on('click', function (e) {
      e.preventDefault();
      var n = parseInt(e.target.id.slice(-1));
      reqList[n].abort();
      var percentLabel = document.querySelector('#percent' + n);
      var progressBar = document.querySelector('#progress-bar' + n);
      progressBar.innerHTML = 'Canceled by user';
      percentLabel.innerHTML = '';
      progressBar.style.color = 'red';
      progressBar.style.width = '100%';
      progressBar.style.backgroundColor = 'white';
    });
    $('#btnCancelAll').removeClass('disabled');
    var _loop = function _loop(i) {
      var fName = fileList[i];
      var liNumber = document.querySelector('#li' + i);
      var liFilename = document.querySelector('#li-filename' + i);
      var progressBar = document.querySelector('#progress-bar' + i);
      var percentLabel = document.querySelector('#percent' + i);
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
        $('#abort' + i).hide();
      };
      reqList[i].onloadend = function () {
        handlerCount = handlerCount - 1;
        if (!responseTimeout[i]) {
          progressBar.style.width = '100%';
          percentLabel.innerHTML = '100%';
          $('#abort' + i).hide();
        }
        if (handlerCount === 0) {
          $("#download-end").show();
          $('#btnCancelAll').removeClass('disabled').addClass('disabled');
          $('#refresh').trigger('click');
        }
        console.log('File ' + handlerCount + ' downloaded');
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
    $('#waiting').removeClass('active');
  };

  var refreshPath = function refreshPath(cPath) {
    console.log('init path: ', cPath);
    var newHtmlContent = '<li><label id="currentpath">Path:</label></li>\n                              <li><spand>&nbsp;</spand><a class="breadcrumb" href="#!">/</a></li>';
    console.log('cPath lenght:', cPath.length);
    $('#waiting').addClass('active');
    if (cPath.length > 1) {
      $('#waiting').addClass('active');
      var cPathArray = cPath.split('/');
      console.log('refreshPath:cPathArray ', cPathArray);
      cPathArray.forEach(function (val, idx, array) {
        console.log(val);
        if (val.trim() == '') {
          if (idx == 0) {
            newHtmlContent += '<li><a class="breadcrumb" href="#!">' + val + '</a></li>';
          }
        } else {
          if (idx == 1) {
            newHtmlContent += '<li><spand>&nbsp;</spand><a class="breadcrumb" href="#!">' + val + '</a></li>';
          } else {
            newHtmlContent += '<li><spand>/&nbsp;</spand><a class="breadcrumb" href="#!">' + val + '</a></li>';
          }
        }
      });
      $('#waiting').removeClass('active');
    }

    $('#currentPath').html(newHtmlContent);

    $('.breadcrumb').on('click', function (e) {
      changePath(e.target.innerText);
    });

    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + Token);
    var realpath = '';
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
      headers: headers,
      timeout: 720000
    }).then(FetchHandleErrors).then(function (r) {
      return r.json();
    }).then(function (data) {
      console.log(data);
      refreshFilesTable(data);
      $('#waiting').removeClass('active');
    }).catch(function (err) {
      console.log(err);
      $('#waiting').removeClass('active');
    });
  };

  var selectAll = function selectAll(e) {
    console.log('selectAll:e ', e);
    var allCkeckbox = document.querySelectorAll('.check');
    var v = document.querySelector("#selectAllFiles").checked;
    $(_this).prop('checked', !$(_this).is(':checked'));
    console.log($(_this).is(':checked'));
    allCkeckbox.forEach(function (element, i) {
      if (!allCkeckbox[i].disabled) {
        if (v === true) {
          $(element).trigger('click');
        }
      }
    });
    console.log(getCheckedFiles());
  };

  var getCheckedFiles = function getCheckedFiles() {
    var checkedFiles = [];
    var allElements = document.querySelectorAll('.typeFile');
    allElements.forEach(function (element, i) {
      console.log('element: ', element);
      console.log('children: ', element.parentElement.parentElement.children[0].children[0].checked);
      if (element.parentElement.parentElement.children[0].children[0].checked) {
        checkedFiles.push(currentPath + '/' + element.innerHTML);
        // c(element.children[1].innerHTML)
      }
    });
    return checkedFiles;
  };

  var getCheckedFolder = function getCheckedFolder() {
    var checkedFolders = [];
    var allElements = document.querySelectorAll('.dashboard-path');
    allElements.forEach(function (v, i) {
      v.children[0].childNodes.forEach(function (l, idx) {
        if (l.children[0].checked) {
          checkedFolders.push(currentPath + '/' + l.children[2].text);
          // c(currentPath + l.children[2].text)
        }
      });
    });
    return checkedFolders;
  };

  var renderFilesTable = function renderFilesTable(aFol, aFil) {
    var newHtmlContent = '';
    var tbodyContent = document.getElementById("tbl-files").getElementsByTagName('tbody')[0];

    newHtmlContent += '<tr><td><span>&nbsp;</span></td>\n              <td><i class="fas fa-folder"></i><a href="#" id="goBackFolder" class="file-Name typeFolder">..</a></td>\n              <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
    aFol.forEach(function (val, idx, array) {
      newHtmlContent += '<tr><td><input class="filled-in checkFolder check" id="' + val.name + '" type="checkbox">\n              <label class="checkbox left" for="' + val.name + '"></label></td>';
      newHtmlContent += '<td><i class="fas fa-folder"></i><a href="#" class="file-Name typeFolder">' + val.name + '</a></td>';
      newHtmlContent += '<td>&nbsp;</td><td>&nbsp;</td><td>' + val.date + '</td></tr>';
    });

    aFil.forEach(function (val, idx, array) {
      var fileSize = parseInt(val.size / 1024);
      newHtmlContent += '<tr><td><input class="filled-in checkFile check" id="' + val.name + '" type="checkbox">\n            <label class="checkbox left" for="' + val.name + '"></label></td>';
      newHtmlContent += '<td><i class="far fa-file"></i><span class="typeFile">' + val.name + '</span></td>';
      newHtmlContent += '<td>' + fileSize + ' KB</td><td>&nbsp;</td><td>' + val.date + '</td></tr>';
    });
    tbodyContent.innerHTML = newHtmlContent;
  };

  var goBackFolder = function goBackFolder(folder) {
    var newPath = '';
    console.log('goBackFolder:folder ', folder);
    console.log('goBackFolder:currentPath ', currentPath);
    if (currentPath !== '/' && folder == '..') {
      var lastFolder = currentPath.lastIndexOf('/');
      if (lastFolder == 0) {
        newPath = '/';
      } else {
        newPath = currentPath.substr(0, lastFolder);
      }
      console.log('goBackFolder:lastFolder-> ' + lastFolder + ' goBackFolder:newPath->' + newPath);
      changePath(newPath.trim());
    }
  };
  var refreshFilesTable = function refreshFilesTable(data) {
    var tbodyContent = document.getElementById("tbl-files").getElementsByTagName('tbody')[0];

    console.log(data);
    aFolders = [];
    aFiles = [];
    if (data.message) return null;
    data.forEach(function (val, idx, array) {
      var fileSize = parseInt(val.size / 1024);
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
    aFolders.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    aFiles.sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });

    renderFilesTable(aFolders, aFiles);

    $('.file-Name').on('click', function (e) {
      console.log(e);
      console.log('Current Path: ', currentPath);
      var newPath = '';
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
    $('.check').on('click', function (e) {
      selectDeselect(e);
      console.log(e.target.checked);
      console.log(e.target.className.split(/\s+/).indexOf("checkFile"));
      console.log(e.target.parentNode.parentNode.rowIndex);
      console.log(e.target.parentNode.children[1].htmlFor);
    });
    $('#goBackFolder').on('click', function (e) {
      e.preventDefault();
      goBackFolder();
    });
  };

  var selectDeselect = function selectDeselect(e) {
    var isChecked = e.target.checked;
    var contentType = e.target.className.split(/\s+/).indexOf("checkFile");
    var name = e.target.parentNode.children[1].htmlFor;

    if (contentType != -1) {
      if (isChecked) {
        aSelectedFiles.push(name);
      } else {
        var idx = aSelectedFiles.indexOf(name);
        if (idx > -1) {
          aSelectedFiles.splice(idx, 1);
        }
      }
    } else {
      if (isChecked) {
        aSelectedFolders.push(name);
      } else {
        var _idx = aSelectedFolders.indexOf(name);
        if (_idx > -1) {
          aSelectedFolders.splice(_idx, 1);
        }
      }
    }
    console.log(aSelectedFiles, aSelectedFolders);
  };

  var showUserProfile = function showUserProfile(w, h, t) {
    var ModalTitle = t;
    var ModalContent = '<table id="tableUserProfile" class="striped highlight">\n                    <tr><td>User Name:</td><td>' + UserName + '</td></tr>\n                    <tr><td>User Role:</td><td>' + UserRole + '</td></tr> \n                    <tr><td>Company Name:</td><td>' + CompanyName + '</td></tr>\n                    <tr><td colspan="2" style="text-align:center;border-botom:1px solid #CCC">&nbsp;</td></tr>\n                    <tr><td>Allow new Folder:</td><td>';
    ModalContent += AllowNewFolder == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                    <tr><td>Allow rename Folder:</td><td>';
    ModalContent += AllowRenameFolder == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                    <tr><td>Allow rename File:</td><td>';
    ModalContent += AllowRenameFile == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                    <tr><td>Allow delete Folder:</td><td>';
    ModalContent += AllowDeleteFolder == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                    <tr><td>Allow delete File:</td><td>';
    ModalContent += AllowDeleteFile == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                    <tr><td>Allow Upload:</td><td>';
    ModalContent += AllowUpload == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                    <tr><td>Allow Download:</td><td>';
    ModalContent += AllowDownload == '1' ? 'Allow' : 'Deny';
    ModalContent += '</td></tr>\n                </table>';
    var htmlContent = '<div id="modal-header">\n                        <h5>' + ModalTitle + '</h5>\n                        <a class="modal_close" id="modalClose" href="#hola"></a>\n                      </div>\n                      <div class="modal-content">\n                        <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>\n                      </div>    ';
    $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;');
    $('#modal').show();
    $('#lean-overlay').show();
    $('#ModalClose').on('click', function () {
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
    $('#modalClose').on('click', function () {
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
  };
  var showNewFolder = function showNewFolder(w, h, t) {
    var ModalTitle = t;
    var ModalContent = '<div class="row">\n                              <div class="input-field col s12">\n                                <input id="newFolderName" type="text"/>\n                                <label for="newFolderName">New Folder Name</label>\n                              </div>\n                          </div>';
    var htmlContent = '<div id="modal-header">\n                        <h5>' + ModalTitle + '</h5>\n                        <a class="modal_close" id="modalClose" href="#"></a>\n                      </div>\n                      <div class="modal-content">\n                        <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="AcceptNewFolder" href="#!">Accept</a>\n                      </div>    ';
    $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
    //$('.modal-content').css('width: 350px;');
    $('.modal').css('width: 40% !important');
    $('#modal').show();
    $('#lean-overlay').show();
    $('#AcceptNewFolder').on('click', function (e) {
      e.preventDefault();
      var newFolderName = $('#newFolderName').val();
      console.log(newFolderName);
      newFolder(newFolderName);
    });
    $('#modalClose').on('click', function () {
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
    $('#ModalClose').on('click', function () {
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
  };

  var showChangeUserPassword = function showChangeUserPassword(w, h, t) {
    var ModalTitle = t;
    var ModalContent = '<div class="row">\n                              <div class="input-field col s12">\n                                <input id="newpassword" type="password"/>\n                                <label for="newpassword">New Password</label>\n                              </div>\n                              <div class="input-field col s12">\n                                <input id="newpassword2" type="password"/>\n                                <label for="newpassword2">Repeat Password</label>\n                              </div>\n                          </div>';
    var htmlContent = '<div id="modal-header">\n                        <h5>' + ModalTitle + '</h5>\n                        <a class="modal_close" id="modalClose" href="#hola"></a>\n                      </div>\n                      <div class="modal-content">\n                        <p>' + ModalContent + '</p>\n                      </div>\n                      <div class="modal-footer">\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="AcceptChangeUserPassword" href="#!">Accept</a>\n                      </div>    ';
    $('#modal').html(htmlContent).css('width: ' + w + '%;height: ' + h + 'px;text-align: center;');
    //$('.modal-content').css('width: 350px;');
    $('.modal').css('width: 40% !important');
    $('#modal').show();
    $('#lean-overlay').show();
    $('#AcceptChangeUserPassword').on('click', function (e) {
      e.preventDefault();
      var username = UserName;
      var newpassword = $('#newpassword').val();
      console.log(username, newpassword);
      (0, _ajax2.default)({
        type: 'POST',
        url: '/changepasswd',
        data: {
          username: username,
          newpassword: _jsBase.Base64.encode((0, _md2.default)(newpassword))
        },
        ajaxtimeout: 40000,
        beforeSend: function beforeSend() {
          /* waiting.style.display = 'block'
                                                  waiting
                                                      .classList
                                                      .add('active') */
        },
        success: function success(data) {
          //console.log(JSON.parse(data))
          var _JSON$parse = JSON.parse(data),
              status = _JSON$parse.status,
              message = _JSON$parse.message;

          console.log('status', status);
          if (status === 'FAIL') {
            M.toast({
              html: message
            });
            d.querySelector('#message').innerHTML = message;
          } else {
            M.toast({
              html: message
            });
            console.log(message);
          }
          $('#modal').hide();
        },
        complete: function complete(xhr, status) {
          console.log(xhr, status);
          //waiting.style.display = 'none'
          $('#modal').hide();
          $('#lean-overlay').hide();
        },
        error: function error(xhr, err) {
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
    $('#modalClose').on('click', function () {
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
    $('#ModalClose').on('click', function () {
      $('#modal').hide();
      $('#lean-overlay').hide();
    });
  };

  var refreshBarMenu = function refreshBarMenu() {
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

  $('#selectAllFiles').on('click', function (e) {
    e.preventDefault();
    console.log('isChecked: ', $(e).is(':checked'));
    $(e).prop('checked', $(e).is(':checked') ? null : 'checked');
    if (document.querySelector("#selectAllFiles").checked === false) {
      document.querySelector("#selectAllFiles").setAttribute('checked', 'checked');
    } else {
      document.querySelector("#selectAllFiles").removeAttribute('checked');
    }
    console.log('selectAllFiles:click ', document.querySelector("#selectAllFiles").checked);
    selectAll(e.target.htmlFor);
  });

  $('a').on('click', function (e) {
    console.log(this.id);
    console.log($(this).hasClass('disabled'));

    if (!$(this).hasClass('disabled')) {
      switch (this.id) {
        case 'userAdd':
          showAddUserForm();
          break;
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
          showNewFolder(32, 440, 'New Folder');
          break;
        case 'delete':
          deleteSelected();
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
  $('#usertrigger').html(UserName).attr('title', 'Empresa: ' + CompanyName);

  $('#settings').on('click', function (e) {
    console.log('setting left:', $(e.target).position().left);
    console.log('settingdropdown left:', $('#Settingdropdown').css('left'));
    console.log($('#Settingdropdown').css('display'));
    var position = parseInt($(e.target).position().left);
    if ($('#Settingdropdown').css('display') === 'block') {
      $('#settings').removeClass('selected');
      $('#Settingdropdown').removeClass('setting').hide();
    } else {
      $('#settings').addClass('selected');
      $('#Settingdropdown').addClass('setting').show();
      $('#Settingdropdown').css('left', position);
    }
  });
  $('#Usersdropdown').on('mouseleave', function () {
    $('#Usersdropdown').hide();
    $('#usertrigger').removeClass('selected');
  });
  $('#Settingdropdown').on('mouseleave', function () {
    $('#Settingdropdown').hide();
    $('#settings').removeClass('selected');
  });
  refreshPath(currentPath);
  refreshBarMenu();
  console.log(document.querySelector("#selectAllFiles").checked);
});

},{"./vendor/ajax":2,"./vendor/js-cookie":3,"./vendor/md5.min":4,"js-base64":8}],2:[function(require,module,exports){
'use strict';

var type;
try {
  type = require('type-of');
} catch (ex) {
  // hide from browserify
  var r = require;
  type = r('type');
}

var jsonpID = 0;
var document = window.document;
var key;
var name;
// var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
var scriptTypeRE = /^(?:text|application)\/javascript/i;
var xmlTypeRE = /^(?:text|application)\/xml/i;
var jsonType = 'application/json';
var htmlType = 'text/html';
var blankRE = /^\s*$/;

var ajax = module.exports = function (options) {
  var settings = extend({}, options || {});
  for (key in ajax.settings) {
    if (settings[key] === undefined) settings[key] = ajax.settings[key];
  }

  ajaxStart(settings);

  if (!settings.crossDomain) {
    settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
  }

  var dataType = settings.dataType;
  var hasPlaceholder = /=\?/.test(settings.url);
  if (dataType === 'jsonp' || hasPlaceholder) {
    if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?');
    return ajax.JSONP(settings);
  }

  if (!settings.url) settings.url = window.location.toString();
  serializeData(settings);

  var mime = settings.accepts[dataType];
  var baseHeaders = {};
  var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
  var xhr = ajax.settings.xhr();
  var abortTimeout;

  if (settings.ajaxtimeout) xhr.timeout = settings.ajaxtimeout;
  if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
  if (mime) {
    baseHeaders['Accept'] = mime;
    if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
    xhr.overrideMimeType && xhr.overrideMimeType(mime);
  }
  if (settings.contentType || settings.data && settings.type.toUpperCase() !== 'GET') {
    baseHeaders['Content-Type'] = settings.contentType || 'application/x-www-form-urlencoded';
  }
  settings.headers = extend(baseHeaders, settings.headers || {});
  xhr.ontimeout = function () {
    ajaxError(null, 'timeout', xhr, settings);
  };
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      clearTimeout(abortTimeout);
      var result;
      var error = false;
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 0 && protocol === 'file:') {
        dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
        result = xhr.responseText;

        try {
          if (dataType === 'script') (1, eval)(result);else if (dataType === 'xml') result = xhr.responseXML;else if (dataType === 'json') result = blankRE.test(result) ? null : JSON.parse(result);
        } catch (e) {
          error = e;
        }

        if (error) ajaxError(error, 'parsererror', xhr, settings);else ajaxSuccess(result, xhr, settings);
      } else {
        if (xhr.status !== 0) {
          ajaxError(null, 'error', xhr, settings);
        }
      }
    }
  };

  var async = 'async' in settings ? settings.async : true;
  xhr.open(settings.type, settings.url, async);

  for (name in settings.headers) {
    xhr.setRequestHeader(name, settings.headers[name]);
  }if (ajaxBeforeSend(xhr, settings) === false) {
    xhr.abort();
    return false;
  }

  /* if (settings.timeout > 0) abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, settings)
  }, settings.timeout) */

  // avoid sending empty string (#319)
  xhr.send(settings.data ? settings.data : null);
  return xhr;
};

// trigger a custom event and return false if it was cancelled
function triggerAndReturn(context, eventName, data) {
  // todo: Fire off some events
  // var event = $.Event(eventName)
  // $(context).trigger(event, data)
  return true; //! event.defaultPrevented
}

// trigger an Ajax "global" event
function triggerGlobal(settings, context, eventName, data) {
  if (settings.global) return triggerAndReturn(context || document, eventName, data);
}

// Number of active Ajax requests
ajax.active = 0;

function ajaxStart(settings) {
  if (settings.global && ajax.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
}

function ajaxStop(settings) {
  if (settings.global && ! --ajax.active) triggerGlobal(settings, null, 'ajaxStop');
}

// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
function ajaxBeforeSend(xhr, settings) {
  var context = settings.context;
  if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) {
    return false;
  }

  triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
}

function ajaxSuccess(data, xhr, settings) {
  var context = settings.context;
  var status = 'success';
  settings.success.call(context, data, status, xhr);
  triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
  ajaxComplete(status, xhr, settings);
}
// type: "timeout", "error", "abort", "parsererror"
function ajaxError(error, type, xhr, settings) {
  var context = settings.context;
  settings.error.call(context, xhr, type, error);
  triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
  ajaxComplete(type, xhr, settings);
}
// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
function ajaxComplete(status, xhr, settings) {
  var context = settings.context;
  settings.complete.call(context, xhr, status);
  triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
  ajaxStop(settings);
}

// Empty function, used as default callback
function empty() {}

ajax.JSONP = function (options) {
  if (!('type' in options)) return ajax(options);
  var callbackName = 'jsonp' + ++jsonpID;
  var script = document.createElement('script');
  var abort = function abort() {
    // todo: remove script
    // $(script).remove()
    if (callbackName in window) window[callbackName] = empty;
    ajaxComplete('abort', xhr, options);
  };
  var xhr = { abort: abort };
  var abortTimeout;
  var head = document.getElementsByTagName('head')[0] || document.documentElement;

  if (options.error) {
    script.onerror = function () {
      xhr.abort();
      options.error();
    };
  }

  window[callbackName] = function (data) {
    clearTimeout(abortTimeout);
    // todo: remove script
    // $(script).remove()
    delete window[callbackName];
    ajaxSuccess(data, xhr, options);
  };

  serializeData(options);
  script.src = options.url.replace(/=\?/, '=' + callbackName);

  // Use insertBefore instead of appendChild to circumvent an IE6 bug.
  // This arises when a base node is used (see jQuery bugs #2709 and #4378).
  head.insertBefore(script, head.firstChild);

  if (options.timeout > 0) {
    abortTimeout = setTimeout(function () {
      xhr.abort();
      ajaxComplete('timeout', xhr, options);
    }, options.timeout);
  }

  return xhr;
};

ajax.settings = {
  // Default type of request
  type: 'GET',
  // Callback that is executed before request
  beforeSend: empty,
  // Callback that is executed if the request succeeds
  success: empty,
  // Callback that is executed the the server drops error
  error: empty,
  // Callback that is executed on request complete (both: error and success)
  complete: empty,
  // The context for the callbacks
  context: null,
  // Whether to trigger "global" Ajax events
  global: true,
  // Transport
  xhr: function xhr() {
    return new window.XMLHttpRequest();
  },
  // MIME types mapping
  accepts: {
    script: 'text/javascript, application/javascript',
    json: jsonType,
    xml: 'application/xml, text/xml',
    html: htmlType,
    text: 'text/plain'
  },
  // Whether the request is to another domain
  crossDomain: false,
  // Default timeout
  timeout: 0
};

function mimeToDataType(mime) {
  return mime && (mime === htmlType ? 'html' : mime === jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
}

function appendQuery(url, query) {
  return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}

// serialize payload and append it to the URL for GET requests
function serializeData(options) {
  if (type(options.data) === 'object') options.data = param(options.data);
  if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
    options.url = appendQuery(options.url, options.data);
  }
}

ajax.get = function (url, success) {
  return ajax({ url: url, success: success });
};

ajax.post = function (url, data, success, dataType) {
  if (type(data) === 'function') {
    dataType = dataType || success;
    success = data;
    data = null;
  }
  return ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
};

ajax.getJSON = function (url, success) {
  return ajax({ url: url, success: success, dataType: 'json' });
};

var escape = encodeURIComponent;

function serialize(params, obj, traditional, scope) {
  var array = type(obj) === 'array';
  for (var key in obj) {
    var value = obj[key];

    if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
    // handle data in serializeArray() format
    if (!scope && array) params.add(value.name, value.value);
    // recurse into nested objects
    else if (traditional ? type(value) === 'array' : type(value) === 'object') {
        serialize(params, value, traditional, key);
      } else params.add(key, value);
  }
}

function param(obj, traditional) {
  var params = [];
  params.add = function (k, v) {
    this.push(escape(k) + '=' + escape(v));
  };
  serialize(params, obj, traditional);
  return params.join('&').replace('%20', '+');
}

function extend(target) {
  var slice = Array.prototype.slice;
  slice.call(arguments, 1).forEach(function (source) {
    for (key in source) {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  });
  return target;
}

},{"type-of":10}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"_process":9}],5:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],6:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":5,"ieee754":7}],7:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(require,module,exports){
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
    var version = "2.4.5";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {}
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
        noConflict: noConflict
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

},{"buffer":6}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var toString = Object.prototype.toString

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function'
    case '[object Date]': return 'date'
    case '[object RegExp]': return 'regexp'
    case '[object Arguments]': return 'arguments'
    case '[object Array]': return 'array'
    case '[object String]': return 'string'
  }

  if (typeof val == 'object' && val && typeof val.length == 'number') {
    try {
      if (typeof val.callee == 'function') return 'arguments';
    } catch (ex) {
      if (ex instanceof TypeError) {
        return 'arguments';
      }
    }
  }

  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (val && val.nodeType === 1) return 'element'
  if (val === Object(val)) return 'object'

  return typeof val
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kYXNoYm9hcmQuanMiLCJqcy92ZW5kb3IvYWpheC5qcyIsImpzL3ZlbmRvci9qcy1jb29raWUuanMiLCJqcy92ZW5kb3IvbWQ1Lm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtYmFzZTY0L2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdHlwZS1vZi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7O0FBR0E7Ozs7QUFDQTs7Ozs7O0FBRUEsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQUE7O0FBRTVCLE1BQU0sV0FBVyxtQkFBUSxHQUFSLENBQVksVUFBWixDQUFqQjtBQUNBLE1BQU0sV0FBVyxtQkFBUSxHQUFSLENBQVksVUFBWixDQUFqQjtBQUNBLE1BQU0sY0FBYyxtQkFBUSxHQUFSLENBQVksYUFBWixDQUFwQjtBQUNBLE1BQU0sZUFBZSxtQkFBUSxHQUFSLENBQVksVUFBWixDQUFyQjtBQUNBLE1BQU0sUUFBUSxtQkFBUSxHQUFSLENBQVksT0FBWixDQUFkO0FBQ0EsTUFBTSxlQUFlLG1CQUFRLEdBQVIsQ0FBWSxjQUFaLENBQXJCOztBQVA0Qiw0QkFleEIsYUFBYSxLQUFiLENBQW1CLEdBQW5CLENBZndCO0FBQUE7QUFBQSxNQVFyQixjQVJxQjtBQUFBLE1BUzFCLGlCQVQwQjtBQUFBLE1BVTFCLGVBVjBCO0FBQUEsTUFXMUIsaUJBWDBCO0FBQUEsTUFZMUIsZUFaMEI7QUFBQSxNQWExQixXQWIwQjtBQUFBLE1BYzFCLGFBZDBCOztBQWdCNUIsTUFBSSxXQUFXLEdB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc2N0cmljdCc7XG5pbXBvcnQgYWpheCBmcm9tICcuL3ZlbmRvci9hamF4JztcbmltcG9ydCB7XG4gIEJhc2U2NFxufSBmcm9tICdqcy1iYXNlNjQnO1xuaW1wb3J0IG1kNSBmcm9tICcuL3ZlbmRvci9tZDUubWluJztcbmltcG9ydCBDb29raWVzIGZyb20gJy4vdmVuZG9yL2pzLWNvb2tpZSc7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICBjb25zdCBVc2VyTmFtZSA9IENvb2tpZXMuZ2V0KCdVc2VyTmFtZScpO1xuICBjb25zdCBVc2VyUm9sZSA9IENvb2tpZXMuZ2V0KCdVc2VyUm9sZScpO1xuICBjb25zdCBDb21wYW55TmFtZSA9IENvb2tpZXMuZ2V0KCdDb21wYW55TmFtZScpO1xuICBjb25zdCByZWFsUm9vdFBhdGggPSBDb29raWVzLmdldCgnUm9vdFBhdGgnKTtcbiAgY29uc3QgVG9rZW4gPSBDb29raWVzLmdldCgndG9rZW4nKTtcbiAgY29uc3QgQWNjZXNzU3RyaW5nID0gQ29va2llcy5nZXQoJ0FjY2Vzc1N0cmluZycpO1xuICBjb25zdCBbQWxsb3dOZXdGb2xkZXIsXG4gICAgQWxsb3dSZW5hbWVGb2xkZXIsXG4gICAgQWxsb3dSZW5hbWVGaWxlLFxuICAgIEFsbG93RGVsZXRlRm9sZGVyLFxuICAgIEFsbG93RGVsZXRlRmlsZSxcbiAgICBBbGxvd1VwbG9hZCxcbiAgICBBbGxvd0Rvd25sb2FkXG4gIF0gPSBBY2Nlc3NTdHJpbmcuc3BsaXQoJywnKTtcbiAgbGV0IFJvb3RQYXRoID0gJy8nO1xuICBsZXQgY3VycmVudFBhdGggPSBSb290UGF0aDtcbiAgbGV0IGFTZWxlY3RlZEZpbGVzID0gW107XG4gIGxldCBhU2VsZWN0ZWRGb2xkZXJzID0gW107XG4gIGxldCBhRm9sZGVycyA9IFtdO1xuICBsZXQgYUZpbGVzID0gW107XG5cbiAgbGV0IGh0bWxVc2VyRm9ybVRlbXBsYXRlID0gYDxkaXYgY2xhc3M9XCJjYXJkLXBhbmVsXCI+XG4gICAgPGg0IGNsYXNzPVwiaGVhZGVyMlwiPk5ldyBVc2VyPC9oND5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8Zm9ybSBjbGFzcz1cImNvbCBzMTJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczEyXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cIm1kaS1hY3Rpb24tYWNjb3VudC1jaXJjbGUgcHJlZml4XCI+PC9pPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwibmFtZTNcIiB0eXBlPVwidGV4dFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpcnN0X25hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtZGktY29tbXVuaWNhdGlvbi1idXNpbmVzcyBwcmVmaXhcIj48L2k+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJjb21wYW55TmFtZVwiIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29tcGFueU5hbWVcIj5Db21wYW55IE5hbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczEyXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cIm1kaS1hY3Rpb24tbG9jay1vdXRsaW5lIHByZWZpeFwiPjwvaT5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInBhc3N3b3JkM1wiIHR5cGU9XCJwYXNzd29yZFwiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBhc3N3b3JkM1wiPlBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtZGktYWN0aW9uLWxvY2stb3V0bGluZSBwcmVmaXhcIj48L2k+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJyZXBlYXRwYXNzd29yZDNcIiB0eXBlPVwicGFzc3dvcmRcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyZXBlYXRwYXNzd29yZDNcIj5SZXBlYXQgUGFzc3dvcmQ8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJtZGktZmlsZS1mb2xkZXIgcHJlZml4XCI+PC9pPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJyb290UGF0aFwiIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyb290UGF0aFwiPlJvb3QgUGF0aDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+IFxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2l0Y2gtY29udGFpbmVyIGxlZnRcIj5cbiAgICAgICAgICA8IS0tIFN3aXRjaCAtLT5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpdGNoXCI+XG4gICAgICAgICAgICBBbGxvdyBEb3dubG9hZCA6IFxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBPZmZcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxldmVyXCI+PC9zcGFuPiBPblxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXRjaFwiPlxuICAgICAgICAgICAgQWxsb3cgTmV3IEZvbGRlciA6IFxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICBPZmZcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxldmVyXCI+PC9zcGFuPiBPblxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXRjaFwiPlxuICAgICAgICAgICAgQWxsb3cgRGVsZXRlIEZvbGRlcjogXG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIE9mZlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGV2ZXJcIj48L3NwYW4+IE9uXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2l0Y2gtY29udGFpbmVyIHJpZ2h0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXRjaFwiPlxuICAgICAgICAgICAgQWxsb3cgVXBsb2FkIDogXG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIE9mZlxuICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGV2ZXJcIj48L3NwYW4+IE9uXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxicj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpdGNoXCI+XG4gICAgICAgICAgICBBbGxvdyBSZW5hbWUgOiBcbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgT2ZmXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsZXZlclwiPjwvc3Bhbj4gT25cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJyPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2l0Y2hcIj5cbiAgICAgICAgICAgIEFsbG93IERlbGV0ZSBGaWxlOiBcbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgT2ZmXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsZXZlclwiPjwvc3Bhbj4gT25cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PiAgIFxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGN5YW4gd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJpZ2h0XCIgdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhY3Rpb25cIj5BZGQgVXNlclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibWRpLWFjdGlvbi1kb25lIHJpZ2h0XCI+PC9pPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZm9ybT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+YDtcblxuICBsZXQgaHRtbFVwbG9hZERvd25sb2FkVGVtcGxhdGUgPSBgPHVsIGNsYXNzPVwicHJlbG9hZGVyLWZpbGVcIiBpZD1cIkRvd25sb2FkZmlsZUxpc3RcIj5cbiAgICAgICAgICAgIDxsaSBpZD1cImxpMFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUwXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIwXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0MFwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkgaWQ9XCJsaTFcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQxXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDFcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPGxpIGlkPVwibGkyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MlwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQyXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBpZD1cImxpM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUzXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIzXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0M1wiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkgaWQ9XCJsaTRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lNFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyNFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQ0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDRcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPmA7XG5cbiAgY29uc3QgbG9nb3V0ID0gKCkgPT4ge1xuICAgIENvb2tpZXMucmVtb3ZlKCdVc2VyTmFtZScpO1xuICAgIENvb2tpZXMucmVtb3ZlKCdVc2VyUm9sZScpO1xuICAgIENvb2tpZXMucmVtb3ZlKCdzZXNzaW9uSWQnKTtcbiAgICBDb29raWVzLnJlbW92ZSgndG9rZW4nKTtcbiAgICBDb29raWVzLnJlbW92ZSgnd3NzVVJMJyk7XG4gICAgQ29va2llcy5yZW1vdmUoJ1Jvb3RQYXRoJyk7XG4gICAgQ29va2llcy5yZW1vdmUoJ0NvbXBhbnlOYW1lJyk7XG4gICAgQ29va2llcy5yZW1vdmUoJ0FjY2Vzc1N0cmluZycpO1xuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gIH07XG5cbiAgY29uc3Qgc2VyaWFsaXplT2JqZWN0ID0gKGRhdGFPYmplY3QpID0+IHtcbiAgICB2YXIgc3RyaW5nUmVzdWx0ID0gJycsXG4gICAgICB2YWx1ZSA9IHZvaWQgMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YU9iamVjdCkge1xuICAgICAgY29uc29sZS5sb2coZGF0YU9iamVjdFtrZXldLCBrZXkpO1xuICAgICAgdmFsdWUgPSBkYXRhT2JqZWN0W2tleV07XG4gICAgICBpZiAoc3RyaW5nUmVzdWx0ICE9PSAnJykge1xuICAgICAgICBzdHJpbmdSZXN1bHQgKz0gJyYnICsga2V5ICsgJz0nICsgdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHJpbmdSZXN1bHQgKz0ga2V5ICsgJz0nICsgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHJpbmdSZXN1bHQ7XG4gIH07XG5cbiAgY29uc3QgY2hhbmdlUGF0aCA9IChuZXdQYXRoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2NoYW5nZVBhdGg6bmV3UGF0aCAnLCBuZXdQYXRoKTtcbiAgICBjdXJyZW50UGF0aCA9IG5ld1BhdGgudHJpbSgpO1xuICAgIHJlZnJlc2hQYXRoKGN1cnJlbnRQYXRoKTtcbiAgICByZWZyZXNoQmFyTWVudSgpO1xuICB9O1xuXG4gIGNvbnN0IHNob3dBZGRVc2VyRm9ybSA9ICgpID0+IHtcbiAgICAkKFwiI3VzZXJGb3JtXCIpLmh0bWwoaHRtbFVzZXJGb3JtVGVtcGxhdGUpLnNob3coKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVTZWxlY3RlZCA9ICgpID0+IHtcbiAgICBpZiAoYVNlbGVjdGVkRm9sZGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzaG93RGlhbG9nWWVzTm8oJ0RlbGV0ZSBmb2xkZXMnLCAnRGVsZXRlIHNlbGVjdGVkIGZvbGRlcnM/JywgKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0ID09ICdZRVMnKSB7XG4gICAgICAgICAgJC53aGVuKGRlbGV0ZUZvbGRlcihjdXJyZW50UGF0aCkpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChhU2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgc2hvd0RpYWxvZ1llc05vKCdEZWxldGUgRmlsZXMnLCAnRGVsZXRlIHNlbGVjdGVkIGZpbGVzPycsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd5ZXNObycsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09ICdZRVMnKSBkZWxldGVGaWxlKGN1cnJlbnRQYXRoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhU2VsZWN0ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNob3dEaWFsb2dZZXNObygnRGVsZXRlIEZpbGVzJywgJ0RlbGV0ZSBzZWxlY3RlZCBmaWxlcz8nLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3llc05vJywgcmVzdWx0KTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09ICdZRVMnKSBkZWxldGVGaWxlKGN1cnJlbnRQYXRoLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBGZXRjaEhhbmRsZUVycm9ycyA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIC8vdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSA0MDEpIHtcbiAgICAgICAgbG9nb3V0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuICBjb25zdCB1cGxvYWQgPSAoKSA9PiB7XG4gICAgbGV0IHcgPSAzMjtcbiAgICBsZXQgaCA9IDQ0MDtcbiAgICBsZXQgYUxpc3RIYW5kbGVyID0gW107XG4gICAgbGV0IGhhbmRsZXJDb3VudGVyID0gMDtcbiAgICBsZXQgTW9kYWxUaXRsZSA9IFwiU3ViaWRhIGRlIGFyY2hpdm9zXCI7XG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGA8bGFiZWwgY2xhc3M9XCJmaWxlLWlucHV0IHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIj5TZWxlY3QgZmlsZXM8aW5wdXQgaWQ9XCJ1cGxvYWQtaW5wdXRcIiB0eXBlPVwiZmlsZVwiIG5hbWU9XCJ1cGxvYWRzW11cIiBtdWx0aXBsZT1cIm11bHRpcGxlXCIgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2VcIj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJzRmlsZXNcIj5OaW5ndW4gYXJjaGl2byBzZWxlY2Npb25hZG88L3NwYW4+YDtcbiAgICBNb2RhbENvbnRlbnQgKz0gaHRtbFVwbG9hZERvd25sb2FkVGVtcGxhdGU7XG4gICAgbGV0IGh0bWxDb250ZW50ID0gYDxkaXYgaWQ9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7TW9kYWxUaXRsZX08L2g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7TW9kYWxDb250ZW50fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBoaWRkZW4gaWQ9XCJkZXN0UGF0aFwiIG5hbWU9XCJkZXN0UGF0aFwiIHZhbHVlPVwiXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2FuY2VsQWxsXCIgaHJlZj1cIiMhXCI+Q2FuY2VsIHVwbG9hZHM8L2E+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNsb3NlVXBsb2FkXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcblxuICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuICAgIGZ1bmN0aW9uIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgbkZpbGUsIGZpbGVOYW1lKSB7XG4gICAgICAkKCcjbGknICsgbkZpbGUpLnNob3coKTtcbiAgICAgICQoJyNsaS1maWxlbmFtZScgKyBuRmlsZSkuc2hvdygpO1xuICAgICAgJCgnI2xpLWZpbGVuYW1lJyArIG5GaWxlKS5odG1sKGZpbGVOYW1lKTtcbiAgICAgIGxldCByZWFscGF0aCA9ICcnO1xuICAgICAgaWYgKGN1cnJlbnRQYXRoID09ICcvJykge1xuICAgICAgICByZWFscGF0aCA9IGN1cnJlbnRQYXRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVhbHBhdGggPSByZWFsUm9vdFBhdGggKyBjdXJyZW50UGF0aDtcbiAgICAgIH1cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJy9maWxlcy91cGxvYWQ/ZGVzdFBhdGg9JyArIHJlYWxwYXRoLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgdGltZW91dDogMjcwMDAwLFxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyT2JqKSB7XG4gICAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBUb2tlbik7XG4gICAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoXCJkZXN0UGF0aFwiLCByZWFscGF0aCk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsZU5hbWUgKyAndXBsb2FkIHN1Y2Nlc3NmdWwhXFxuJyArIGRhdGEpO1xuICAgICAgICAgICQoJy50b2FzdCcpLnJlbW92ZUNsYXNzKCdzdWNjZXNzJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICBNLnRvYXN0KHtcbiAgICAgICAgICAgIGh0bWw6IGZpbGVOYW1lICsgJyB1cGxvYWRlZCBzdWNlc3NmdWxseSdcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkKCcjYWJvcnQnICsgbkZpbGUpLmhpZGUoKTtcbiAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgaGFuZGxlckNvdW50ZXIgPSBoYW5kbGVyQ291bnRlciAtIDE7XG4gICAgICAgICAgaWYgKGhhbmRsZXJDb3VudGVyID09IDApIHtcbiAgICAgICAgICAgICQoJyNidG5DYW5jZWxBbGwnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHhocjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGFMaXN0SGFuZGxlcltuRmlsZV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICBsZXQgcGVyY2VudENvbXBsZXRlID0gMDtcbiAgICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xuICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludChwZXJjZW50Q29tcGxldGUgKiAxMDApO1xuICAgICAgICAgICAgICAkKCcjcGVyY2VudCcgKyBuRmlsZSkudGV4dChwZXJjZW50Q29tcGxldGUgKyAnJScpO1xuICAgICAgICAgICAgICAkKCcjcHJvZ3Jlc3MtYmFyJyArIG5GaWxlKS53aWR0aChwZXJjZW50Q29tcGxldGUgKyAnJScpO1xuICAgICAgICAgICAgICAvKiBpZiAocGVyY2VudENvbXBsZXRlID09PSAxMDApIHtcbiAgICAgICAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGFMaXN0SGFuZGxlcltuRmlsZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgICQoJyNtb2RhbCcpLmh0bWwoaHRtbENvbnRlbnQpLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDt0ZXh0LWFsaWduOiBjZW50ZXI7Jyk7XG4gICAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xuICAgICQoJy5tb2RhbC1jb250YWluZXInKS5jc3MoJ3dpZHRoOiA0MCUgIWltcG9ydGFudCcpO1xuICAgICQoJy5maWxlLWlucHV0Jykuc2hvdygpO1xuICAgICQoJyNtb2RhbCcpLnNob3coKTtcbiAgICAkKCcjbGVhbi1vdmVybGF5Jykuc2hvdygpO1xuICAgICQoJyNidG5DbG9zZVVwbG9hZCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAkKCcjdXBsb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJCgnI2J0bkNhbmNlbEFsbCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICQoJy5tb2RhbF9jbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIGxldCBuID0gcGFyc2VJbnQoZS50YXJnZXQuaWQuc2xpY2UoLTEpKTtcbiAgICAgIGFMaXN0SGFuZGxlcltuXS5hYm9ydCgpO1xuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwZXJjZW50JyArIG4pO1xuICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyBuKTtcbiAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9ICdDYW5jZWxlZCBieSB1c2VyJztcbiAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAkKGUudGFyZ2V0KS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJCgnI2J0bkNhbmNlbEFsbCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDQ7IHgrKykge1xuICAgICAgICBhTGlzdEhhbmRsZXJbeF0uYWJvcnQoKTtcbiAgICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwZXJjZW50JyArIHgpO1xuICAgICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvZ3Jlc3MtYmFyJyArIHgpO1xuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSAnQ2FuY2VsZWQgYnkgdXNlcic7XG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gICAgICB9XG4gICAgICAkKCcjYnRuQ2FuY2VsQWxsJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfSk7XG4gICAgJCgnI3VwbG9hZC1pbnB1dCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZmlsZXMgPSAkKHRoaXMpLmdldCgwKS5maWxlcztcbiAgICAgIGhhbmRsZXJDb3VudGVyID0gZmlsZXMubGVuZ3RoO1xuICAgICAgKGZpbGVzLmxlbmd0aCA+IDApID8gJCgnI3NGaWxlcycpLmh0bWwoZmlsZXMubGVuZ3RoICsgJyBhcmNoaXZvcyBzZWxlY2Npb25hZG9zLicpOiAkKCcjc0ZpbGVzJykuaHRtbChmaWxlc1swXSk7XG4gICAgICBjb25zb2xlLmxvZyhmaWxlcy5sZW5ndGgpO1xuICAgICAgJCgnLmZpbGUtaW5wdXQnKS5oaWRlKCk7XG4gICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCAmJiBmaWxlcy5sZW5ndGggPD0gNSkge1xuICAgICAgICAkKCcjYnRuQ2xvc2VVcGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbaV07XG4gICAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgLy8gYWRkIHRoZSBmaWxlcyB0byBmb3JtRGF0YSBvYmplY3QgZm9yIHRoZSBkYXRhIHBheWxvYWRcblxuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgndXBsb2Fkc1tdJywgZmlsZSwgZmlsZS5uYW1lKTtcbiAgICAgICAgICBmblVwbG9hZEZpbGUoZm9ybURhdGEsIGksIGZpbGUubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI2J0bkNsb3NlVXBsb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBNLnRvYXN0KHtcbiAgICAgICAgICBodG1sOiAnTm8gc2UgcHVlZGVuIGRlc2NhcmdhciBtw6FzIGRlIDUgYXJjaGl2b3MgYSBsYSB2ZXonXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH07XG5cbiAgY29uc3QgbmV3Rm9sZGVyID0gKGZvbGRlck5hbWUpID0+IHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFRva2VuKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICBmZXRjaCgnL2ZpbGVzL25ld2ZvbGRlcicsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBcInBhdGhcIjogY3VycmVudFBhdGgsXG4gICAgICAgICAgXCJmb2xkZXJOYW1lXCI6IGZvbGRlck5hbWVcbiAgICAgICAgfSksXG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgICB9KVxuICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAnT0snKSB7XG4gICAgICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgICAgICAgJCgnI3JlZnJlc2gnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgaHRtbDogJ0NyZWFkYSBudWV2YSBjYXJwZXRhICcgKyBkYXRhLmRhdGEuZm9sZGVyTmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNob3dEaWFsb2dZZXNObyA9ICh0aXRsZSwgY29udGVudCwgY2IpID0+IHtcbiAgICBsZXQgdyA9IDMyO1xuICAgIGxldCBoID0gNDQwO1xuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7dGl0bGV9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJsb2dvdXRNb2RhbENsb3NlXCIgaHJlZj1cIiNob2xhXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7Y29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5ZZXNcIiBocmVmPVwiI1wiPlllczwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5OT1wiIGhyZWY9XCIjXCI+Tk88L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgICQoJyNtb2RhbCcpLmh0bWwoaHRtbENvbnRlbnQpLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDt0ZXh0LWFsaWduOiBjZW50ZXI7Jyk7XG4gICAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xuICAgICQoJy5tb2RhbCcpLmNzcygnd2lkdGg6IDQwJSAhaW1wb3J0YW50Jyk7XG4gICAgJCgnI21vZGFsJykuc2hvdygpO1xuICAgICQoJyNsZWFuLW92ZXJsYXknKS5zaG93KCk7XG4gICAgJCgnI2J0blllcycpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgICAgcmV0dXJuIGNiKCdZRVMnKTtcbiAgICB9KTtcbiAgICAkKCcjYnRuTk8nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgIHJldHVybiBjYignTk8nKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVGaWxlID0gKHBhdGgpID0+IHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IGFGID0gYVNlbGVjdGVkRmlsZXMuc2xpY2UoKTtcbiAgICBjb25zb2xlLmxvZyhhRik7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBUb2tlbik7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgZm9yICh4ID0gMDsgeCA8IGFGLmxlbmd0aDsgeCsrKSB7XG4gICAgICBjb25zb2xlLmxvZygnRGVsZXRpbmcgZmlsZSAnICsgYUZbeF0gKyAnIC4uLicpO1xuICAgICAgZmV0Y2goJy9maWxlcy9kZWxldGUnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBcInBhdGhcIjogcGF0aCxcbiAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogYUZbeF1cbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0aW1lb3V0OiA3MjAwMDBcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09ICdPSycpIHtcbiAgICAgICAgICAgIGFTZWxlY3RlZEZpbGVzLnNoaWZ0KCk7XG4gICAgICAgICAgICAkKCcudG9hc3QnKS5yZW1vdmVDbGFzcygnc3VjY2VzcycpLmFkZENsYXNzKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICBNLnRvYXN0KHtcbiAgICAgICAgICAgICAgaHRtbDogJ0FyY2hpdm8gJyArIGRhdGEuZGF0YS5maWxlTmFtZSArICcgYm9ycmFkbydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3JlZnJlc2gnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICQoJy50b2FzdCcpLnJlbW92ZUNsYXNzKCdlcnInKS5hZGRDbGFzcygnZXJyJyk7XG4gICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICBodG1sOiBlcnJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUZvbGRlciA9IChwYXRoKSA9PiB7XG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCBhRiA9IGFTZWxlY3RlZEZvbGRlcnMuc2xpY2UoKTtcbiAgICBjb25zb2xlLmxvZyhhRik7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBUb2tlbik7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgZm9yICh4ID0gMDsgeCA8IGFGLmxlbmd0aDsgeCsrKSB7XG4gICAgICBjb25zb2xlLmxvZygnRGVsZXRpbmcgZm9sZGVyICcgKyBhRlt4XSArICcgLi4uJyk7XG4gICAgICBmZXRjaCgnL2ZpbGVzL2RlbGV0ZScsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIFwicGF0aFwiOiBwYXRoLFxuICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBhRlt4XVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRpbWVvdXQ6IDcyMDAwMFxuICAgICAgICB9KVxuICAgICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcbiAgICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ09LJykge1xuICAgICAgICAgICAgJCgnLnRvYXN0JykucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKS5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICAgIGh0bWw6ICdDYXJwZXRhICcgKyBkYXRhLmRhdGEuZmlsZU5hbWUgKyAnIGJvcnJhZGEnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFTZWxlY3RlZEZvbGRlcnMuc2hpZnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9O1xuXG5cblxuICAvL1RPRE86IE9wdGltaXphciByZW5kZXJpemFkbyBkZSBlbGVtZW50b3MgbGkgXG4gIC8vaW5jb3Jwb3JhbmRvIGVsIGNvbnRlbmlkbyBlbiBlbCBidWNsZSBfbG9vcFxuICBjb25zdCBkb3dubG9hZCA9IChmaWxlTGlzdCwgdGV4dCkgPT4ge1xuICAgIGxldCByZXFMaXN0ID0gW10sXG4gICAgICBoYW5kbGVyQ291bnQgPSAwLFxuICAgICAgcmVzcG9uc2VUaW1lb3V0ID0gW107XG4gICAgbGV0IHcgPSAzMjtcbiAgICBsZXQgaCA9IDQ0MDtcbiAgICBsZXQgTW9kYWxUaXRsZSA9IFwiRGVzY2FyZ2EgZGUgYXJjaGl2b3Mgc2VsZWNjaW9uYWRvc1wiO1xuICAgIGxldCBNb2RhbENvbnRlbnQgPSBodG1sVXBsb2FkRG93bmxvYWRUZW1wbGF0ZTtcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cIm1vZGFsQ2xvc2VcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cD4ke01vZGFsQ29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DYW5jZWxBbGxcIiBocmVmPVwiIyFcIj5DYW5jZWwgZG93bmxvYWRzPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DbG9zZURvd25sb2FkXCIgaHJlZj1cIiMhXCI+Q2VycmFyPC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgJCgnI21vZGFsJykuaHRtbChodG1sQ29udGVudCkuY3NzKCd3aWR0aDogJyArIHcgKyAnJTtoZWlnaHQ6ICcgKyBoICsgJ3B4O3RleHQtYWxpZ246IGNlbnRlcjsnKTtcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjZG93bmxvYWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAkKCcjYnRuQ2xvc2VEb3dubG9hZCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAkKCcjZG93bmxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICBhU2VsZWN0ZWRGaWxlcyA9IFtdO1xuICAgIH0pO1xuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICQoJyNkb3dubG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgICQoJyNyZWZyZXNoJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgIGFTZWxlY3RlZEZpbGVzID0gW107XG4gICAgfSk7XG4gICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnI2J0bkNhbmNlbEFsbCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDQ7IHgrKykge1xuICAgICAgICByZXFMaXN0W3hdLmFib3J0KCk7XG4gICAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGVyY2VudCcgKyB4KTtcbiAgICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyB4KTtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ0NhbmNlbGVkIGJ5IHVzZXInO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgfVxuICAgICAgJCgnI2J0bkNhbmNlbEFsbCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH0pO1xuICAgICQoJy5tb2RhbF9jbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgbiA9IHBhcnNlSW50KGUudGFyZ2V0LmlkLnNsaWNlKC0xKSk7XG4gICAgICByZXFMaXN0W25dLmFib3J0KCk7XG4gICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BlcmNlbnQnICsgbik7XG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvZ3Jlc3MtYmFyJyArIG4pO1xuICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ0NhbmNlbGVkIGJ5IHVzZXInO1xuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICB9KTtcbiAgICAkKCcjYnRuQ2FuY2VsQWxsJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgbGV0IF9sb29wID0gKGkpID0+IHtcbiAgICAgIGxldCBmTmFtZSA9IGZpbGVMaXN0W2ldO1xuICAgICAgbGV0IGxpTnVtYmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xpJyArIGkpO1xuICAgICAgbGV0IGxpRmlsZW5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGktZmlsZW5hbWUnICsgaSk7XG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvZ3Jlc3MtYmFyJyArIGkpO1xuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwZXJjZW50JyArIGkpO1xuICAgICAgcmVzcG9uc2VUaW1lb3V0W2ldID0gZmFsc2U7XG4gICAgICBmTmFtZSA9IGZOYW1lLnNwbGl0KCdcXFxcJykucG9wKCkuc3BsaXQoJy8nKS5wb3AoKTtcbiAgICAgIHJlcUxpc3RbaV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHJlcUxpc3RbaV0ub3BlbignUE9TVCcsICcvZmlsZXMvZG93bmxvYWQnLCB0cnVlKTtcbiAgICAgIHJlcUxpc3RbaV0ucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAgIGxpTnVtYmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgbGlGaWxlbmFtZS5pbm5lckhUTUwgPSBmTmFtZTtcbiAgICAgIHJlcUxpc3RbaV0udGltZW91dCA9IDM2MDAwO1xuICAgICAgcmVxTGlzdFtpXS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCcqKiBUaW1lb3V0IGVycm9yIC0+RmlsZTonICsgZk5hbWUgKyAnICcgKyByZXFMaXN0W2ldLnN0YXR1cyArICcgJyArIHJlcUxpc3RbaV0uc3RhdHVzVGV4dCk7XG4gICAgICAgIC8vIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCAtIDFcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ1RpbWVvdXQgRXJyb3InO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdibGluaycpO1xuICAgICAgICByZXNwb25zZVRpbWVvdXRbaV0gPSB0cnVlO1xuICAgICAgfTtcbiAgICAgIHJlcUxpc3RbaV0ub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IHBhcnNlSW50KGV2dC5sb2FkZWQgLyBldnQudG90YWwgKiAxMDApO1xuICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gcGVyY2VudENvbXBsZXRlICsgJyUnO1xuICAgICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBwZXJjZW50Q29tcGxldGUgKyAnJSc7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCcqKiBBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgdGhlIHRyYW5zYWN0aW9uIC0+RmlsZTonICsgZk5hbWUgKyAnICcgKyByZXEuc3RhdHVzICsgJyAnICsgcmVxLnN0YXR1c1RleHQpO1xuICAgICAgICBoYW5kbGVyQ291bnQgPSBoYW5kbGVyQ291bnQgLSAxO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJ0Vycm9yJztcbiAgICAgICAgcGVyY2VudExhYmVsLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgICQoJyNhYm9ydCcgKyBpKS5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgcmVxTGlzdFtpXS5vbmxvYWRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCAtIDE7XG4gICAgICAgIGlmICghcmVzcG9uc2VUaW1lb3V0W2ldKSB7XG4gICAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcxMDAlJztcbiAgICAgICAgICAkKCcjYWJvcnQnICsgaSkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kbGVyQ291bnQgPT09IDApIHtcbiAgICAgICAgICAkKFwiI2Rvd25sb2FkLWVuZFwiKS5zaG93KCk7XG4gICAgICAgICAgJCgnI2J0bkNhbmNlbEFsbCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICQoJyNyZWZyZXNoJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnRmlsZSAnICsgaGFuZGxlckNvdW50ICsgJyBkb3dubG9hZGVkJyk7XG4gICAgICB9O1xuICAgICAgcmVxTGlzdFtpXS5vbmxvYWRzdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50ICsgMTtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMCc7XG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnMCUnO1xuICAgICAgfTtcbiAgICAgIHJlcUxpc3RbaV0ub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAocmVxTGlzdFtpXS5yZWFkeVN0YXRlID09PSA0ICYmIHJlcUxpc3RbaV0uc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB2YXIgZmlsZW5hbWUgPSAnJztcbiAgICAgICAgICB2YXIgZGlzcG9zaXRpb24gPSByZXFMaXN0W2ldLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJyk7XG4gICAgICAgICAgaWYgKGRpc3Bvc2l0aW9uICYmIGRpc3Bvc2l0aW9uLmluZGV4T2YoJ2F0dGFjaG1lbnQnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZVJlZ2V4ID0gL2ZpbGVuYW1lW147PVxcbl0qPSgoWydcIl0pLio/XFwyfFteO1xcbl0qKS87XG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGZpbGVuYW1lUmVnZXguZXhlYyhkaXNwb3NpdGlvbik7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcyAhPSBudWxsICYmIG1hdGNoZXNbMV0pIGZpbGVuYW1lID0gbWF0Y2hlc1sxXS5yZXBsYWNlKC9bJ1wiXS9nLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0eXBlID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdGhpcy5yZXNwb25zZV0sIHtcbiAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vIElFIHdvcmthcm91bmQgZm9yIFwiSFRNTDcwMDc6IE9uZSBvciBtb3JlIGJsb2IgVVJMcyB3ZXJlIHJldm9rZWQgYnkgY2xvc2luZyB0aGUgYmxvYiBmb3Igd2hpY2ggdGhleSB3ZXJlIGNyZWF0ZWQuIFRoZXNlIFVSTHMgd2lsbCBubyBsb25nZXIgcmVzb2x2ZSBhcyB0aGUgZGF0YSBiYWNraW5nIHRoZSBVUkwgaGFzIGJlZW4gZnJlZWQuXCJcbiAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihibG9iLCBmaWxlbmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBVUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XG4gICAgICAgICAgICB2YXIgZG93bmxvYWRVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUpIHtcbiAgICAgICAgICAgICAgLy8gdXNlIEhUTUw1IGFbZG93bmxvYWRdIGF0dHJpYnV0ZSB0byBzcGVjaWZ5IGZpbGVuYW1lXG4gICAgICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAvLyBzYWZhcmkgZG9lc24ndCBzdXBwb3J0IHRoaXMgeWV0XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgYS5kb3dubG9hZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkb3dubG9hZFVybDtcbiAgICAgICAgICAgICAgICBwcmVsb2FkZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSBkb3dubG9hZFVybDtcbiAgICAgICAgICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgLy8gcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2luZG93Lm9wZW4gPSBkb3dubG9hZFVybDtcbiAgICAgICAgICAgICAgLy8gcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoZG93bmxvYWRVcmwpO1xuICAgICAgICAgICAgfSwgMTAwKTsgLy8gY2xlYW51cFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcUxpc3RbaV0uc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgY29uc29sZS5sb2coY3VycmVudFBhdGggKyAnLycgKyBmaWxlTGlzdFtpXSk7XG4gICAgICByZXFMaXN0W2ldLnNlbmQoc2VyaWFsaXplT2JqZWN0KHtcbiAgICAgICAgJ2ZpbGVuYW1lJzogY3VycmVudFBhdGggKyAnLycgKyBmaWxlTGlzdFtpXVxuICAgICAgfSkpO1xuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgX2xvb3AoaSk7XG4gICAgfVxuICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9O1xuXG4gIGNvbnN0IHJlZnJlc2hQYXRoID0gKGNQYXRoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2luaXQgcGF0aDogJywgY1BhdGgpO1xuICAgIGxldCBuZXdIdG1sQ29udGVudCA9IGA8bGk+PGxhYmVsIGlkPVwiY3VycmVudHBhdGhcIj5QYXRoOjwvbGFiZWw+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48c3BhbmQ+Jm5ic3A7PC9zcGFuZD48YSBjbGFzcz1cImJyZWFkY3J1bWJcIiBocmVmPVwiIyFcIj4vPC9hPjwvbGk+YDtcbiAgICBjb25zb2xlLmxvZygnY1BhdGggbGVuZ2h0OicsIGNQYXRoLmxlbmd0aCk7XG4gICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgaWYgKGNQYXRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICQoJyN3YWl0aW5nJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgbGV0IGNQYXRoQXJyYXkgPSBjUGF0aC5zcGxpdCgnLycpO1xuICAgICAgY29uc29sZS5sb2coJ3JlZnJlc2hQYXRoOmNQYXRoQXJyYXkgJywgY1BhdGhBcnJheSk7XG4gICAgICBjUGF0aEFycmF5LmZvckVhY2goKHZhbCwgaWR4LCBhcnJheSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xuICAgICAgICBpZiAodmFsLnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgIGlmIChpZHggPT0gMCkge1xuICAgICAgICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDxsaT48YSBjbGFzcz1cImJyZWFkY3J1bWJcIiBocmVmPVwiIyFcIj4ke3ZhbH08L2E+PC9saT5gO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaWR4ID09IDEpIHtcbiAgICAgICAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8bGk+PHNwYW5kPiZuYnNwOzwvc3BhbmQ+PGEgY2xhc3M9XCJicmVhZGNydW1iXCIgaHJlZj1cIiMhXCI+JHt2YWx9PC9hPjwvbGk+YDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDxsaT48c3BhbmQ+LyZuYnNwOzwvc3BhbmQ+PGEgY2xhc3M9XCJicmVhZGNydW1iXCIgaHJlZj1cIiMhXCI+JHt2YWx9PC9hPjwvbGk+YDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJCgnI3dhaXRpbmcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgJCgnI2N1cnJlbnRQYXRoJykuaHRtbChuZXdIdG1sQ29udGVudCk7XG5cbiAgICAkKCcuYnJlYWRjcnVtYicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjaGFuZ2VQYXRoKGUudGFyZ2V0LmlubmVyVGV4dCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFRva2VuKTtcbiAgICBsZXQgcmVhbHBhdGggPSAnJztcbiAgICBpZiAocmVhbFJvb3RQYXRoICE9PSAnLycpIHtcbiAgICAgIHJlYWxwYXRoID0gJy8nICsgcmVhbFJvb3RQYXRoICsgY1BhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjUGF0aCA9PSAnLycpIHtcbiAgICAgICAgcmVhbHBhdGggPSBjUGF0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWxwYXRoID0gcmVhbFJvb3RQYXRoICsgY1BhdGg7XG4gICAgICB9XG5cbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3JlYWxSb290UGF0aDogJyArIHJlYWxSb290UGF0aCArICcgcmVhbHBhdGg6JyArIHJlYWxwYXRoKTtcbiAgICBmZXRjaCgnL2ZpbGVzP3BhdGg9JyArIGVuY29kZVVSSShyZWFscGF0aCksIHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgdGltZW91dDogNzIwMDAwXG4gICAgICB9KVxuICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXG4gICAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHJlZnJlc2hGaWxlc1RhYmxlKGRhdGEpO1xuICAgICAgICAkKCcjd2FpdGluZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAkKCcjd2FpdGluZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNlbGVjdEFsbCA9IChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NlbGVjdEFsbDplICcsIGUpO1xuICAgIHZhciBhbGxDa2Vja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGVjaycpO1xuICAgIGxldCB2ID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpXG4gICAgICAuY2hlY2tlZDtcbiAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCAhKCQodGhpcykuaXMoJzpjaGVja2VkJykpKTtcbiAgICBjb25zb2xlLmxvZygkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKTtcbiAgICBhbGxDa2Vja2JveC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICBpZiAoIWFsbENrZWNrYm94W2ldLmRpc2FibGVkKSB7XG4gICAgICAgIGlmICh2ID09PSB0cnVlKSB7XG4gICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coZ2V0Q2hlY2tlZEZpbGVzKCkpO1xuICB9O1xuXG4gIGNvbnN0IGdldENoZWNrZWRGaWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hlY2tlZEZpbGVzID0gW107XG4gICAgdmFyIGFsbEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnR5cGVGaWxlJyk7XG4gICAgYWxsRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgICAgY29uc29sZS5sb2coJ2VsZW1lbnQ6ICcsIGVsZW1lbnQpO1xuICAgICAgY29uc29sZS5sb2coJ2NoaWxkcmVuOiAnLCBlbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGVja2VkKTtcbiAgICAgIGlmIChlbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGVja2VkKSB7XG4gICAgICAgIGNoZWNrZWRGaWxlcy5wdXNoKGN1cnJlbnRQYXRoICsgJy8nICsgZWxlbWVudC5pbm5lckhUTUwpO1xuICAgICAgICAvLyBjKGVsZW1lbnQuY2hpbGRyZW5bMV0uaW5uZXJIVE1MKVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjaGVja2VkRmlsZXM7XG4gIH07XG5cbiAgY29uc3QgZ2V0Q2hlY2tlZEZvbGRlciA9IGZ1bmN0aW9uIGdldENoZWNrZWRGb2xkZXIoKSB7XG4gICAgdmFyIGNoZWNrZWRGb2xkZXJzID0gW107XG4gICAgdmFyIGFsbEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRhc2hib2FyZC1wYXRoJyk7XG4gICAgYWxsRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgdlxuICAgICAgICAuY2hpbGRyZW5bMF1cbiAgICAgICAgLmNoaWxkTm9kZXNcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGwsIGlkeCkge1xuICAgICAgICAgIGlmIChsLmNoaWxkcmVuWzBdLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGNoZWNrZWRGb2xkZXJzLnB1c2goY3VycmVudFBhdGggKyAnLycgKyBsLmNoaWxkcmVuWzJdLnRleHQpO1xuICAgICAgICAgICAgLy8gYyhjdXJyZW50UGF0aCArIGwuY2hpbGRyZW5bMl0udGV4dClcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjaGVja2VkRm9sZGVycztcbiAgfTtcblxuICBjb25zdCByZW5kZXJGaWxlc1RhYmxlID0gKGFGb2wsIGFGaWwpID0+IHtcbiAgICBsZXQgbmV3SHRtbENvbnRlbnQgPSBgYDtcbiAgICBjb25zdCB0Ym9keUNvbnRlbnQgPSBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwidGJsLWZpbGVzXCIpXG4gICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3Rib2R5JylbMF07XG5cbiAgICBuZXdIdG1sQ29udGVudCArPSBgPHRyPjx0ZD48c3Bhbj4mbmJzcDs8L3NwYW4+PC90ZD5cbiAgICAgICAgICAgICAgPHRkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlclwiPjwvaT48YSBocmVmPVwiI1wiIGlkPVwiZ29CYWNrRm9sZGVyXCIgY2xhc3M9XCJmaWxlLU5hbWUgdHlwZUZvbGRlclwiPi4uPC9hPjwvdGQ+XG4gICAgICAgICAgICAgIDx0ZD4mbmJzcDs8L3RkPjx0ZD4mbmJzcDs8L3RkPjx0ZD4mbmJzcDs8L3RkPjwvdHI+YDtcbiAgICBhRm9sLmZvckVhY2goKHZhbCwgaWR4LCBhcnJheSkgPT4ge1xuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0cj48dGQ+PGlucHV0IGNsYXNzPVwiZmlsbGVkLWluIGNoZWNrRm9sZGVyIGNoZWNrXCIgaWQ9XCIke3ZhbC5uYW1lfVwiIHR5cGU9XCJjaGVja2JveFwiPlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveCBsZWZ0XCIgZm9yPVwiJHt2YWwubmFtZX1cIj48L2xhYmVsPjwvdGQ+YDtcbiAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8dGQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyXCI+PC9pPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJmaWxlLU5hbWUgdHlwZUZvbGRlclwiPiR7dmFsLm5hbWV9PC9hPjwvdGQ+YDtcbiAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8dGQ+Jm5ic3A7PC90ZD48dGQ+Jm5ic3A7PC90ZD48dGQ+JHt2YWwuZGF0ZX08L3RkPjwvdHI+YDtcbiAgICB9KTtcblxuICAgIGFGaWwuZm9yRWFjaCgodmFsLCBpZHgsIGFycmF5KSA9PiB7XG4gICAgICBsZXQgZmlsZVNpemUgPSBwYXJzZUludCh2YWwuc2l6ZSAvIDEwMjQpO1xuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0cj48dGQ+PGlucHV0IGNsYXNzPVwiZmlsbGVkLWluIGNoZWNrRmlsZSBjaGVja1wiIGlkPVwiJHt2YWwubmFtZX1cIiB0eXBlPVwiY2hlY2tib3hcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94IGxlZnRcIiBmb3I9XCIke3ZhbC5uYW1lfVwiPjwvbGFiZWw+PC90ZD5gO1xuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0ZD48aSBjbGFzcz1cImZhciBmYS1maWxlXCI+PC9pPjxzcGFuIGNsYXNzPVwidHlwZUZpbGVcIj4ke3ZhbC5uYW1lfTwvc3Bhbj48L3RkPmA7XG4gICAgICBuZXdIdG1sQ29udGVudCArPSBgPHRkPiR7ZmlsZVNpemV9IEtCPC90ZD48dGQ+Jm5ic3A7PC90ZD48dGQ+JHt2YWwuZGF0ZX08L3RkPjwvdHI+YDtcbiAgICB9KTtcbiAgICB0Ym9keUNvbnRlbnQuaW5uZXJIVE1MID0gbmV3SHRtbENvbnRlbnQ7XG4gIH07XG5cblxuICBjb25zdCBnb0JhY2tGb2xkZXIgPSAoZm9sZGVyKSA9PiB7XG4gICAgbGV0IG5ld1BhdGggPSAnJztcbiAgICBjb25zb2xlLmxvZygnZ29CYWNrRm9sZGVyOmZvbGRlciAnLCBmb2xkZXIpO1xuICAgIGNvbnNvbGUubG9nKCdnb0JhY2tGb2xkZXI6Y3VycmVudFBhdGggJywgY3VycmVudFBhdGgpO1xuICAgIGlmIChjdXJyZW50UGF0aCAhPT0gJy8nICYmIGZvbGRlciA9PSAnLi4nKSB7XG4gICAgICBsZXQgbGFzdEZvbGRlciA9IGN1cnJlbnRQYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICBpZiAobGFzdEZvbGRlciA9PSAwKSB7XG4gICAgICAgIG5ld1BhdGggPSAnLyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdQYXRoID0gY3VycmVudFBhdGguc3Vic3RyKDAsIGxhc3RGb2xkZXIpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ2dvQmFja0ZvbGRlcjpsYXN0Rm9sZGVyLT4gJyArIGxhc3RGb2xkZXIgKyAnIGdvQmFja0ZvbGRlcjpuZXdQYXRoLT4nICsgbmV3UGF0aCk7XG4gICAgICBjaGFuZ2VQYXRoKG5ld1BhdGgudHJpbSgpKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHJlZnJlc2hGaWxlc1RhYmxlID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCB0Ym9keUNvbnRlbnQgPSBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwidGJsLWZpbGVzXCIpXG4gICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3Rib2R5JylbMF07XG5cbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBhRm9sZGVycyA9IFtdO1xuICAgIGFGaWxlcyA9IFtdO1xuICAgIGlmIChkYXRhLm1lc3NhZ2UpIHJldHVybiBudWxsO1xuICAgIGRhdGEuZm9yRWFjaCgodmFsLCBpZHgsIGFycmF5KSA9PiB7XG4gICAgICBsZXQgZmlsZVNpemUgPSBwYXJzZUludCh2YWwuc2l6ZSAvIDEwMjQpO1xuICAgICAgaWYgKHZhbC5pc0ZvbGRlcikge1xuICAgICAgICBhRm9sZGVycy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiB2YWwubmFtZSxcbiAgICAgICAgICBkYXRlOiB2YWwuZGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFGaWxlcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiB2YWwubmFtZSxcbiAgICAgICAgICBzaXplOiB2YWwuc2l6ZSxcbiAgICAgICAgICBkYXRlOiB2YWwuZGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhRm9sZGVycy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcbiAgICB9KTtcbiAgICBhRmlsZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuZGF0ZS5sb2NhbGVDb21wYXJlKGIuZGF0ZSk7XG4gICAgfSk7XG5cbiAgICByZW5kZXJGaWxlc1RhYmxlKGFGb2xkZXJzLCBhRmlsZXMpO1xuXG4gICAgJCgnLmZpbGUtTmFtZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50IFBhdGg6ICcsIGN1cnJlbnRQYXRoKTtcbiAgICAgIGxldCBuZXdQYXRoID0gJyc7XG4gICAgICBpZiAoZS50YXJnZXQuaW5uZXJUZXh0ICE9ICcuLicpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRQYXRoLnRyaW0oKSA9PSAnLycpIHtcbiAgICAgICAgICBuZXdQYXRoID0gY3VycmVudFBhdGgudHJpbSgpICsgZS50YXJnZXQuaW5uZXJUZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1BhdGggPSBjdXJyZW50UGF0aC50cmltKCkgKyAnLycgKyBlLnRhcmdldC5pbm5lclRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnTmV3IFBhdGg6ICcsIG5ld1BhdGgudHJpbSgpKTtcbiAgICAgICAgcmVmcmVzaFBhdGgobmV3UGF0aC50cmltKCkpO1xuICAgICAgICBjdXJyZW50UGF0aCA9IG5ld1BhdGgudHJpbSgpO1xuICAgICAgICByZWZyZXNoQmFyTWVudSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGN1cnJlbnRQYXRoICE9PSBSb290UGF0aCkgZ29CYWNrRm9sZGVyKGUudGFyZ2V0LmlubmVyVGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJCgnLmNoZWNrJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHNlbGVjdERlc2VsZWN0KGUpO1xuICAgICAgY29uc29sZS5sb2coZS50YXJnZXQuY2hlY2tlZCk7XG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoL1xccysvKS5pbmRleE9mKFwiY2hlY2tGaWxlXCIpKTtcbiAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5yb3dJbmRleCk7XG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5wYXJlbnROb2RlLmNoaWxkcmVuWzFdLmh0bWxGb3IpO1xuICAgIH0pO1xuICAgICQoJyNnb0JhY2tGb2xkZXInKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZ29CYWNrRm9sZGVyKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2VsZWN0RGVzZWxlY3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGlzQ2hlY2tlZCA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgY29uc3QgY29udGVudFR5cGUgPSBlLnRhcmdldC5jbGFzc05hbWUuc3BsaXQoL1xccysvKS5pbmRleE9mKFwiY2hlY2tGaWxlXCIpO1xuICAgIGNvbnN0IG5hbWUgPSBlLnRhcmdldC5wYXJlbnROb2RlLmNoaWxkcmVuWzFdLmh0bWxGb3I7XG5cbiAgICBpZiAoY29udGVudFR5cGUgIT0gLTEpIHtcbiAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgYVNlbGVjdGVkRmlsZXMucHVzaChuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGlkeCA9IGFTZWxlY3RlZEZpbGVzLmluZGV4T2YobmFtZSk7XG4gICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgIGFTZWxlY3RlZEZpbGVzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5wdXNoKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYVNlbGVjdGVkRm9sZGVycy5pbmRleE9mKG5hbWUpO1xuICAgICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgICBhU2VsZWN0ZWRGb2xkZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gICAgY29uc29sZS5sb2coYVNlbGVjdGVkRmlsZXMsIGFTZWxlY3RlZEZvbGRlcnMpO1xuICB9O1xuXG4gIGNvbnN0IHNob3dVc2VyUHJvZmlsZSA9ICh3LCBoLCB0KSA9PiB7XG4gICAgbGV0IE1vZGFsVGl0bGUgPSB0O1xuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPHRhYmxlIGlkPVwidGFibGVVc2VyUHJvZmlsZVwiIGNsYXNzPVwic3RyaXBlZCBoaWdobGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5Vc2VyIE5hbWU6PC90ZD48dGQ+JHtVc2VyTmFtZX08L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+VXNlciBSb2xlOjwvdGQ+PHRkPiR7VXNlclJvbGV9PC90ZD48L3RyPiBcbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5Db21wYW55IE5hbWU6PC90ZD48dGQ+JHtDb21wYW55TmFtZX08L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQgY29sc3Bhbj1cIjJcIiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyO2JvcmRlci1ib3RvbToxcHggc29saWQgI0NDQ1wiPiZuYnNwOzwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5BbGxvdyBuZXcgRm9sZGVyOjwvdGQ+PHRkPmA7XG4gICAgTW9kYWxDb250ZW50ICs9IChBbGxvd05ld0ZvbGRlciA9PSAnMScpID9cbiAgICAgICdBbGxvdycgOlxuICAgICAgJ0RlbnknO1xuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IHJlbmFtZSBGb2xkZXI6PC90ZD48dGQ+YDtcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93UmVuYW1lRm9sZGVyID09ICcxJykgP1xuICAgICAgJ0FsbG93JyA6XG4gICAgICAnRGVueSc7XG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgcmVuYW1lIEZpbGU6PC90ZD48dGQ+YDtcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93UmVuYW1lRmlsZSA9PSAnMScpID9cbiAgICAgICdBbGxvdycgOlxuICAgICAgJ0RlbnknO1xuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IGRlbGV0ZSBGb2xkZXI6PC90ZD48dGQ+YDtcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93RGVsZXRlRm9sZGVyID09ICcxJykgP1xuICAgICAgJ0FsbG93JyA6XG4gICAgICAnRGVueSc7XG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgZGVsZXRlIEZpbGU6PC90ZD48dGQ+YDtcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93RGVsZXRlRmlsZSA9PSAnMScpID9cbiAgICAgICdBbGxvdycgOlxuICAgICAgJ0RlbnknO1xuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IFVwbG9hZDo8L3RkPjx0ZD5gO1xuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dVcGxvYWQgPT0gJzEnKSA/XG4gICAgICAnQWxsb3cnIDpcbiAgICAgICdEZW55JztcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5BbGxvdyBEb3dubG9hZDo8L3RkPjx0ZD5gO1xuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dEb3dubG9hZCA9PSAnMScpID9cbiAgICAgICdBbGxvdycgOlxuICAgICAgJ0RlbnknO1xuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxuICAgICAgICAgICAgICAgIDwvdGFibGU+YDtcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7TW9kYWxUaXRsZX08L2g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjaG9sYVwiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiTW9kYWxDbG9zZVwiIGhyZWY9XCIjIVwiPkNsb3NlPC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICBgO1xuICAgICQoJyNtb2RhbCcpXG4gICAgICAuaHRtbChodG1sQ29udGVudClcbiAgICAgIC5jc3MoJ3dpZHRoOiAnICsgdyArICclO2hlaWdodDogJyArIGggKyAncHg7Jyk7XG4gICAgJCgnI21vZGFsJykuc2hvdygpO1xuICAgICQoJyNsZWFuLW92ZXJsYXknKS5zaG93KCk7XG4gICAgJCgnI01vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3Qgc2hvd05ld0ZvbGRlciA9ICh3LCBoLCB0KSA9PiB7XG4gICAgbGV0IE1vZGFsVGl0bGUgPSB0O1xuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibmV3Rm9sZGVyTmFtZVwiIHR5cGU9XCJ0ZXh0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibmV3Rm9sZGVyTmFtZVwiPk5ldyBGb2xkZXIgTmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7TW9kYWxUaXRsZX08L2g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD4ke01vZGFsQ29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJNb2RhbENsb3NlXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cIkFjY2VwdE5ld0ZvbGRlclwiIGhyZWY9XCIjIVwiPkFjY2VwdDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgYDtcbiAgICAkKCcjbW9kYWwnKVxuICAgICAgLmh0bWwoaHRtbENvbnRlbnQpXG4gICAgICAuY3NzKCd3aWR0aDogJyArIHcgKyAnJTtoZWlnaHQ6ICcgKyBoICsgJ3B4O3RleHQtYWxpZ246IGNlbnRlcjsnKTtcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjQWNjZXB0TmV3Rm9sZGVyJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCBuZXdGb2xkZXJOYW1lID0gJCgnI25ld0ZvbGRlck5hbWUnKS52YWwoKTtcbiAgICAgIGNvbnNvbGUubG9nKG5ld0ZvbGRlck5hbWUpO1xuICAgICAgbmV3Rm9sZGVyKG5ld0ZvbGRlck5hbWUpO1xuICAgIH0pO1xuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICB9KTtcbiAgICAkKCcjTW9kYWxDbG9zZScpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2hvd0NoYW5nZVVzZXJQYXNzd29yZCA9ICh3LCBoLCB0KSA9PiB7XG4gICAgbGV0IE1vZGFsVGl0bGUgPSB0O1xuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibmV3cGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJuZXdwYXNzd29yZFwiPk5ldyBQYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZCBjb2wgczEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cIm5ld3Bhc3N3b3JkMlwiIHR5cGU9XCJwYXNzd29yZFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5ld3Bhc3N3b3JkMlwiPlJlcGVhdCBQYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7TW9kYWxUaXRsZX08L2g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjaG9sYVwiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiTW9kYWxDbG9zZVwiIGhyZWY9XCIjIVwiPkNsb3NlPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJBY2NlcHRDaGFuZ2VVc2VyUGFzc3dvcmRcIiBocmVmPVwiIyFcIj5BY2NlcHQ8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgIGA7XG4gICAgJCgnI21vZGFsJylcbiAgICAgIC5odG1sKGh0bWxDb250ZW50KVxuICAgICAgLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDt0ZXh0LWFsaWduOiBjZW50ZXI7Jyk7XG4gICAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xuICAgICQoJy5tb2RhbCcpLmNzcygnd2lkdGg6IDQwJSAhaW1wb3J0YW50Jyk7XG4gICAgJCgnI21vZGFsJykuc2hvdygpO1xuICAgICQoJyNsZWFuLW92ZXJsYXknKS5zaG93KCk7XG4gICAgJCgnI0FjY2VwdENoYW5nZVVzZXJQYXNzd29yZCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgdXNlcm5hbWUgPSBVc2VyTmFtZTtcbiAgICAgIGxldCBuZXdwYXNzd29yZCA9ICQoJyNuZXdwYXNzd29yZCcpLnZhbCgpO1xuICAgICAgY29uc29sZS5sb2codXNlcm5hbWUsIG5ld3Bhc3N3b3JkKTtcbiAgICAgIGFqYXgoe1xuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIHVybDogJy9jaGFuZ2VwYXNzd2QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgIG5ld3Bhc3N3b3JkOiBCYXNlNjQuZW5jb2RlKG1kNShuZXdwYXNzd29yZCkpXG4gICAgICAgIH0sXG4gICAgICAgIGFqYXh0aW1lb3V0OiA0MDAwMCxcbiAgICAgICAgYmVmb3JlU2VuZDogKCkgPT4ge1xuICAgICAgICAgIC8qIHdhaXRpbmcuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FpdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCgnYWN0aXZlJykgKi9cbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04ucGFyc2UoZGF0YSkpXG4gICAgICAgICAgbGV0IHtcbiAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICB9ID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnc3RhdHVzJywgc3RhdHVzKTtcbiAgICAgICAgICBpZiAoc3RhdHVzID09PSAnRkFJTCcpIHtcbiAgICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgICBodG1sOiBtZXNzYWdlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRcbiAgICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJyNtZXNzYWdlJylcbiAgICAgICAgICAgICAgLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgICBodG1sOiBtZXNzYWdlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlOiAoeGhyLCBzdGF0dXMpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh4aHIsIHN0YXR1cyk7XG4gICAgICAgICAgLy93YWl0aW5nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6ICh4aHIsIGVycikgPT4ge1xuICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgaHRtbDogJ1dyb25nIHBhc3N3b3JkJ1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChlcnIgPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1RpbWVvdXQgRXJyb3InKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLCBlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnI21vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICAgICQoJyNNb2RhbENsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgcmVmcmVzaEJhck1lbnUgPSAoKSA9PiB7XG4gICAgaWYgKEFsbG93TmV3Rm9sZGVyID09PSAnMScpIHtcbiAgICAgICQoJyNOZXdGb2xkZXInKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI05ld0ZvbGRlcicpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH1cbiAgICBpZiAoQWxsb3dEZWxldGVGb2xkZXIgPT09ICcxJyAmJiBBbGxvd0RlbGV0ZUZpbGUgPT09ICcxJykge1xuICAgICAgJCgnI2RlbGV0ZScpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjZGVsZXRlJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAkKCcjZGVsZXRlJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICAgIGlmIChBbGxvd1JlbmFtZUZvbGRlciA9PT0gJzEnICYmIEFsbG93UmVuYW1lRmlsZSA9PT0gJzEnKSB7XG4gICAgICAkKCcjcmVuYW1lJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNyZW5hbWUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICQoJyNyZW5hbWUnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgaWYgKEFsbG93VXBsb2FkID09ICcxJykge1xuICAgICAgJCgnI3VwbG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjdXBsb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKEFsbG93RG93bmxvYWQgPT0gJzEnKSB7XG4gICAgICAkKCcjZG93bmxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI2Rvd25sb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICAgIGlmIChVc2VyUm9sZSA9PSAnYWRtaW4nKSB7XG4gICAgICAkKCcjc2V0dGluZ3MnKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNzZXR0aW5ncycpLmhpZGUoKTtcbiAgICB9XG4gICAgJCgnI21vZGFsdHJpZ2dlcicpLmh0bWwoVXNlck5hbWUpO1xuICAgICQoJyNtb2RhbHRyaWdnZXInKS5sZWFuTW9kYWwoe1xuICAgICAgdG9wOiAxMTAsXG4gICAgICBvdmVybGF5OiAwLjQ1LFxuICAgICAgY2xvc2VCdXR0b246IFwiLmhpZGVtb2RhbFwiXG4gICAgfSk7XG4gIH07XG5cbiAgJCgnI3NlbGVjdEFsbEZpbGVzJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ2lzQ2hlY2tlZDogJywgJChlKS5pcygnOmNoZWNrZWQnKSk7XG4gICAgJChlKS5wcm9wKCdjaGVja2VkJywgJChlKS5pcygnOmNoZWNrZWQnKSA/IG51bGwgOiAnY2hlY2tlZCcpO1xuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQgPT09IGZhbHNlKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdjaGVja2VkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIikucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJyk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdzZWxlY3RBbGxGaWxlczpjbGljayAnLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQpO1xuICAgIHNlbGVjdEFsbChlLnRhcmdldC5odG1sRm9yKTtcbiAgfSk7XG5cbiAgJCgnYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5pZCk7XG4gICAgY29uc29sZS5sb2coJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSk7XG5cbiAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5pZCkge1xuICAgICAgICBjYXNlICd1c2VyQWRkJzpcbiAgICAgICAgICBzaG93QWRkVXNlckZvcm0oKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2V0dGluZ3MnOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1c2VydHJpZ2dlcic6XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygkKCcjVXNlcnNkcm9wZG93bicpLmNzcygnZGlzcGxheScpKTtcbiAgICAgICAgICBpZiAoJCgnI1VzZXJzZHJvcGRvd24nKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgJCgnI3VzZXJ0cmlnZ2VyJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI3VzZXJ0cmlnZ2VyJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZnJlc2gnOlxuICAgICAgICAgIHJlZnJlc2hQYXRoKGN1cnJlbnRQYXRoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXNlckxvZ291dCc6XG4gICAgICAgICAgJCgnI1VzZXJzZHJvcGRvd24nKS5oaWRlKCk7XG4gICAgICAgICAgJCgnI2xvZ291dG1vZGFsJykuc2hvdygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdNb2RhbFVzZXJMb2dvdXQnOlxuICAgICAgICAgICQoJyNsb2dvdXRtb2RhbCcpLmhpZGUoKTtcbiAgICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXNlckNoYW5nZVBhc3N3b3JkJzpcbiAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcbiAgICAgICAgICBzaG93Q2hhbmdlVXNlclBhc3N3b3JkKDMyLCA0NDAsICdDaGFuZ2UgVXNlciBQYXNzd29yZCcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1c2VyUHJvZmlsZSc6XG4gICAgICAgICAgJCgnI1VzZXJzZHJvcGRvd24nKS5oaWRlKCk7XG4gICAgICAgICAgc2hvd1VzZXJQcm9maWxlKDQwLCA0NDAsICdVc2VyIFByb2ZpbGUnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbG9nb3V0TW9kYWxDbG9zZSc6XG4gICAgICAgIGNhc2UgJ2NhbmNlbCc6XG4gICAgICAgICAgJCgnI2xvZ291dG1vZGFsJykuaGlkZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICBjdXJyZW50UGF0aCA9IFJvb3RQYXRoO1xuICAgICAgICAgIHJlZnJlc2hQYXRoKGN1cnJlbnRQYXRoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbmV3Rm9sZGVyJzpcbiAgICAgICAgICBzaG93TmV3Rm9sZGVyKDMyLCA0NDAsICdOZXcgRm9sZGVyJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgZGVsZXRlU2VsZWN0ZWQoKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cGxvYWQnOlxuICAgICAgICAgIHVwbG9hZCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkb3dubG9hZCc6XG4gICAgICAgICAgaWYgKGFTZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChhU2VsZWN0ZWRGaWxlcy5sZW5ndGggPiA1KSB7XG4gICAgICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgICAgIGh0bWw6ICdObyBzZSBwdWVkZW4gZGVzY2FyZ2FyIG3DoXMgZGUgNSBhcmNoaXZvcyBhIGxhIHZleidcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG93bmxvYWQoYVNlbGVjdGVkRmlsZXMsICdGaWxlJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgICBodG1sOiAnTm8gc2UgaGFuIHNlbGVjY2lvbmFkbyBhcmNoaXZvcyBwYXJhIGRlc2NhcmdhcidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgTS50b2FzdCh7XG4gICAgICAgIGh0bWw6ICdPcGNpb24gbm8gcGVybWl0aWRhJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgJCgnI3VzZXJ0cmlnZ2VyJylcbiAgICAuaHRtbChVc2VyTmFtZSlcbiAgICAuYXR0cigndGl0bGUnLCAnRW1wcmVzYTogJyArIENvbXBhbnlOYW1lKTtcblxuICAkKCcjc2V0dGluZ3MnKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdzZXR0aW5nIGxlZnQ6JywgJChlLnRhcmdldCkucG9zaXRpb24oKS5sZWZ0KTtcbiAgICBjb25zb2xlLmxvZygnc2V0dGluZ2Ryb3Bkb3duIGxlZnQ6JywgJCgnI1NldHRpbmdkcm9wZG93bicpLmNzcygnbGVmdCcpKTtcbiAgICBjb25zb2xlLmxvZygkKCcjU2V0dGluZ2Ryb3Bkb3duJykuY3NzKCdkaXNwbGF5JykpO1xuICAgIGxldCBwb3NpdGlvbiA9IHBhcnNlSW50KCQoZS50YXJnZXQpLnBvc2l0aW9uKCkubGVmdCk7XG4gICAgaWYgKCQoJyNTZXR0aW5nZHJvcGRvd24nKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xuICAgICAgJCgnI3NldHRpbmdzJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAkKCcjU2V0dGluZ2Ryb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ3NldHRpbmcnKS5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNzZXR0aW5ncycpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgJCgnI1NldHRpbmdkcm9wZG93bicpLmFkZENsYXNzKCdzZXR0aW5nJykuc2hvdygpO1xuICAgICAgJCgnI1NldHRpbmdkcm9wZG93bicpLmNzcygnbGVmdCcsIHBvc2l0aW9uKTtcbiAgICB9XG4gIH0pO1xuICAkKCcjVXNlcnNkcm9wZG93bicpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICQoJyNVc2Vyc2Ryb3Bkb3duJykuaGlkZSgpO1xuICAgICQoJyN1c2VydHJpZ2dlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICB9KTtcbiAgJCgnI1NldHRpbmdkcm9wZG93bicpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICQoJyNTZXR0aW5nZHJvcGRvd24nKS5oaWRlKCk7XG4gICAgJCgnI3NldHRpbmdzJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH0pO1xuICByZWZyZXNoUGF0aChjdXJyZW50UGF0aCk7XG4gIHJlZnJlc2hCYXJNZW51KCk7XG4gIGNvbnNvbGUubG9nKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIikuY2hlY2tlZCk7XG59KTtcbiIsInZhciB0eXBlXG50cnkge1xuICB0eXBlID0gcmVxdWlyZSgndHlwZS1vZicpXG59IGNhdGNoIChleCkge1xuICAgIC8vIGhpZGUgZnJvbSBicm93c2VyaWZ5XG4gIHZhciByID0gcmVxdWlyZVxuICB0eXBlID0gcigndHlwZScpXG59XG5cbnZhciBqc29ucElEID0gMFxudmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50XG52YXIga2V5XG52YXIgbmFtZVxuICAgIC8vIHZhciByc2NyaXB0ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2lcbnZhciBzY3JpcHRUeXBlUkUgPSAvXig/OnRleHR8YXBwbGljYXRpb24pXFwvamF2YXNjcmlwdC9pXG52YXIgeG1sVHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL3htbC9pXG52YXIganNvblR5cGUgPSAnYXBwbGljYXRpb24vanNvbidcbnZhciBodG1sVHlwZSA9ICd0ZXh0L2h0bWwnXG52YXIgYmxhbmtSRSA9IC9eXFxzKiQvXG5cbnZhciBhamF4ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2V0dGluZ3MgPSBleHRlbmQoe30sIG9wdGlvbnMgfHwge30pXG4gIGZvciAoa2V5IGluIGFqYXguc2V0dGluZ3MpIHsgaWYgKHNldHRpbmdzW2tleV0gPT09IHVuZGVmaW5lZCkgc2V0dGluZ3Nba2V5XSA9IGFqYXguc2V0dGluZ3Nba2V5XSB9XG5cbiAgYWpheFN0YXJ0KHNldHRpbmdzKVxuXG4gIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIHtcbiAgICBzZXR0aW5ncy5jcm9zc0RvbWFpbiA9IC9eKFtcXHctXSs6KT9cXC9cXC8oW15cXC9dKykvLnRlc3Qoc2V0dGluZ3MudXJsKSAmJlxuICAgICAgICAgICAgUmVnRXhwLiQyICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdFxuICB9XG5cbiAgdmFyIGRhdGFUeXBlID0gc2V0dGluZ3MuZGF0YVR5cGVcbiAgdmFyIGhhc1BsYWNlaG9sZGVyID0gLz1cXD8vLnRlc3Qoc2V0dGluZ3MudXJsKVxuICBpZiAoZGF0YVR5cGUgPT09ICdqc29ucCcgfHwgaGFzUGxhY2Vob2xkZXIpIHtcbiAgICBpZiAoIWhhc1BsYWNlaG9sZGVyKSBzZXR0aW5ncy51cmwgPSBhcHBlbmRRdWVyeShzZXR0aW5ncy51cmwsICdjYWxsYmFjaz0/JylcbiAgICByZXR1cm4gYWpheC5KU09OUChzZXR0aW5ncylcbiAgfVxuXG4gIGlmICghc2V0dGluZ3MudXJsKSBzZXR0aW5ncy51cmwgPSB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKVxuICBzZXJpYWxpemVEYXRhKHNldHRpbmdzKVxuXG4gIHZhciBtaW1lID0gc2V0dGluZ3MuYWNjZXB0c1tkYXRhVHlwZV1cbiAgdmFyIGJhc2VIZWFkZXJzID0ge31cbiAgdmFyIHByb3RvY29sID0gL14oW1xcdy1dKzopXFwvXFwvLy50ZXN0KHNldHRpbmdzLnVybCkgPyBSZWdFeHAuJDEgOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2xcbiAgdmFyIHhociA9IGFqYXguc2V0dGluZ3MueGhyKClcbiAgdmFyIGFib3J0VGltZW91dFxuXG4gIGlmIChzZXR0aW5ncy5hamF4dGltZW91dCkgeGhyLnRpbWVvdXQgPSBzZXR0aW5ncy5hamF4dGltZW91dFxuICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSBiYXNlSGVhZGVyc1snWC1SZXF1ZXN0ZWQtV2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICBpZiAobWltZSkge1xuICAgIGJhc2VIZWFkZXJzWydBY2NlcHQnXSA9IG1pbWVcbiAgICBpZiAobWltZS5pbmRleE9mKCcsJykgPiAtMSkgbWltZSA9IG1pbWUuc3BsaXQoJywnLCAyKVswXVxuICAgIHhoci5vdmVycmlkZU1pbWVUeXBlICYmIHhoci5vdmVycmlkZU1pbWVUeXBlKG1pbWUpXG4gIH1cbiAgaWYgKHNldHRpbmdzLmNvbnRlbnRUeXBlIHx8IChzZXR0aW5ncy5kYXRhICYmIHNldHRpbmdzLnR5cGUudG9VcHBlckNhc2UoKSAhPT0gJ0dFVCcpKSB7IGJhc2VIZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykgfVxuICBzZXR0aW5ncy5oZWFkZXJzID0gZXh0ZW5kKGJhc2VIZWFkZXJzLCBzZXR0aW5ncy5oZWFkZXJzIHx8IHt9KVxuICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGFqYXhFcnJvcihudWxsLCAndGltZW91dCcsIHhociwgc2V0dGluZ3MpXG4gIH1cbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXG4gICAgICB2YXIgcmVzdWx0XG4gICAgICB2YXIgZXJyb3IgPSBmYWxzZVxuICAgICAgaWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09PSAzMDQgfHwgKHhoci5zdGF0dXMgPT09IDAgJiYgcHJvdG9jb2wgPT09ICdmaWxlOicpKSB7XG4gICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUgfHwgbWltZVRvRGF0YVR5cGUoeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKSlcbiAgICAgICAgcmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dFxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGRhdGFUeXBlID09PSAnc2NyaXB0JykoMSwgZXZhbCkocmVzdWx0KVxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSAneG1sJykgcmVzdWx0ID0geGhyLnJlc3BvbnNlWE1MXG4gICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT09ICdqc29uJykgcmVzdWx0ID0gYmxhbmtSRS50ZXN0KHJlc3VsdCkgPyBudWxsIDogSlNPTi5wYXJzZShyZXN1bHQpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgZXJyb3IgPSBlIH1cblxuICAgICAgICBpZiAoZXJyb3IpIGFqYXhFcnJvcihlcnJvciwgJ3BhcnNlcmVycm9yJywgeGhyLCBzZXR0aW5ncylcbiAgICAgICAgZWxzZSBhamF4U3VjY2VzcyhyZXN1bHQsIHhociwgc2V0dGluZ3MpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyAhPT0gMCkge1xuICAgICAgICAgIGFqYXhFcnJvcihudWxsLCAnZXJyb3InLCB4aHIsIHNldHRpbmdzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGFzeW5jID0gJ2FzeW5jJyBpbiBzZXR0aW5ncyA/IHNldHRpbmdzLmFzeW5jIDogdHJ1ZVxuICB4aHIub3BlbihzZXR0aW5ncy50eXBlLCBzZXR0aW5ncy51cmwsIGFzeW5jKVxuXG4gIGZvciAobmFtZSBpbiBzZXR0aW5ncy5oZWFkZXJzKSB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBzZXR0aW5ncy5oZWFkZXJzW25hbWVdKVxuXG4gIGlmIChhamF4QmVmb3JlU2VuZCh4aHIsIHNldHRpbmdzKSA9PT0gZmFsc2UpIHtcbiAgICB4aHIuYWJvcnQoKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgICAvKiBpZiAoc2V0dGluZ3MudGltZW91dCA+IDApIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBlbXB0eVxuICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzKVxuICAgIH0sIHNldHRpbmdzLnRpbWVvdXQpICovXG5cbiAgICAvLyBhdm9pZCBzZW5kaW5nIGVtcHR5IHN0cmluZyAoIzMxOSlcbiAgeGhyLnNlbmQoc2V0dGluZ3MuZGF0YSA/IHNldHRpbmdzLmRhdGEgOiBudWxsKVxuICByZXR1cm4geGhyXG59XG5cbi8vIHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgYW5kIHJldHVybiBmYWxzZSBpZiBpdCB3YXMgY2FuY2VsbGVkXG5mdW5jdGlvbiB0cmlnZ2VyQW5kUmV0dXJuIChjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcbiAgICAvLyB0b2RvOiBGaXJlIG9mZiBzb21lIGV2ZW50c1xuICAgIC8vIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnROYW1lKVxuICAgIC8vICQoY29udGV4dCkudHJpZ2dlcihldmVudCwgZGF0YSlcbiAgcmV0dXJuIHRydWUgLy8hIGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWRcbn1cblxuLy8gdHJpZ2dlciBhbiBBamF4IFwiZ2xvYmFsXCIgZXZlbnRcbmZ1bmN0aW9uIHRyaWdnZXJHbG9iYWwgKHNldHRpbmdzLCBjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCkgcmV0dXJuIHRyaWdnZXJBbmRSZXR1cm4oY29udGV4dCB8fCBkb2N1bWVudCwgZXZlbnROYW1lLCBkYXRhKVxufVxuXG4vLyBOdW1iZXIgb2YgYWN0aXZlIEFqYXggcmVxdWVzdHNcbmFqYXguYWN0aXZlID0gMFxuXG5mdW5jdGlvbiBhamF4U3RhcnQgKHNldHRpbmdzKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwgJiYgYWpheC5hY3RpdmUrKyA9PT0gMCkgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgbnVsbCwgJ2FqYXhTdGFydCcpXG59XG5cbmZ1bmN0aW9uIGFqYXhTdG9wIChzZXR0aW5ncykge1xuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmICEoLS1hamF4LmFjdGl2ZSkpIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RvcCcpXG59XG5cbi8vIHRyaWdnZXJzIGFuIGV4dHJhIGdsb2JhbCBldmVudCBcImFqYXhCZWZvcmVTZW5kXCIgdGhhdCdzIGxpa2UgXCJhamF4U2VuZFwiIGJ1dCBjYW5jZWxhYmxlXG5mdW5jdGlvbiBhamF4QmVmb3JlU2VuZCAoeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgaWYgKHNldHRpbmdzLmJlZm9yZVNlbmQuY2FsbChjb250ZXh0LCB4aHIsIHNldHRpbmdzKSA9PT0gZmFsc2UgfHxcbiAgICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhCZWZvcmVTZW5kJywgW3hociwgc2V0dGluZ3NdKSA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlIH1cblxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFNlbmQnLCBbeGhyLCBzZXR0aW5nc10pXG59XG5cbmZ1bmN0aW9uIGFqYXhTdWNjZXNzIChkYXRhLCB4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICB2YXIgc3RhdHVzID0gJ3N1Y2Nlc3MnXG4gIHNldHRpbmdzLnN1Y2Nlc3MuY2FsbChjb250ZXh0LCBkYXRhLCBzdGF0dXMsIHhocilcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTdWNjZXNzJywgW3hociwgc2V0dGluZ3MsIGRhdGFdKVxuICBhamF4Q29tcGxldGUoc3RhdHVzLCB4aHIsIHNldHRpbmdzKVxufVxuLy8gdHlwZTogXCJ0aW1lb3V0XCIsIFwiZXJyb3JcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcbmZ1bmN0aW9uIGFqYXhFcnJvciAoZXJyb3IsIHR5cGUsIHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIHNldHRpbmdzLmVycm9yLmNhbGwoY29udGV4dCwgeGhyLCB0eXBlLCBlcnJvcilcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhFcnJvcicsIFt4aHIsIHNldHRpbmdzLCBlcnJvcl0pXG4gIGFqYXhDb21wbGV0ZSh0eXBlLCB4aHIsIHNldHRpbmdzKVxufVxuLy8gc3RhdHVzOiBcInN1Y2Nlc3NcIiwgXCJub3Rtb2RpZmllZFwiLCBcImVycm9yXCIsIFwidGltZW91dFwiLCBcImFib3J0XCIsIFwicGFyc2VyZXJyb3JcIlxuZnVuY3Rpb24gYWpheENvbXBsZXRlIChzdGF0dXMsIHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIHNldHRpbmdzLmNvbXBsZXRlLmNhbGwoY29udGV4dCwgeGhyLCBzdGF0dXMpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4Q29tcGxldGUnLCBbeGhyLCBzZXR0aW5nc10pXG4gIGFqYXhTdG9wKHNldHRpbmdzKVxufVxuXG4vLyBFbXB0eSBmdW5jdGlvbiwgdXNlZCBhcyBkZWZhdWx0IGNhbGxiYWNrXG5mdW5jdGlvbiBlbXB0eSAoKSB7fVxuXG5hamF4LkpTT05QID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKCEoJ3R5cGUnIGluIG9wdGlvbnMpKSByZXR1cm4gYWpheChvcHRpb25zKVxuICB2YXIgY2FsbGJhY2tOYW1lID0gJ2pzb25wJyArICgrK2pzb25wSUQpXG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICB2YXIgYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvZG86IHJlbW92ZSBzY3JpcHRcbiAgICAgICAgLy8gJChzY3JpcHQpLnJlbW92ZSgpXG4gICAgaWYgKGNhbGxiYWNrTmFtZSBpbiB3aW5kb3cpIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZW1wdHlcbiAgICBhamF4Q29tcGxldGUoJ2Fib3J0JywgeGhyLCBvcHRpb25zKVxuICB9XG4gIHZhciB4aHIgPSB7IGFib3J0OiBhYm9ydCB9XG4gIHZhciBhYm9ydFRpbWVvdXRcbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdIHx8XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuXG4gIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB4aHIuYWJvcnQoKVxuICAgICAgb3B0aW9ucy5lcnJvcigpXG4gICAgfVxuICB9XG5cbiAgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXG4gICAgICAgICAgICAvLyB0b2RvOiByZW1vdmUgc2NyaXB0XG4gICAgICAgICAgICAvLyAkKHNjcmlwdCkucmVtb3ZlKClcbiAgICBkZWxldGUgd2luZG93W2NhbGxiYWNrTmFtZV1cbiAgICBhamF4U3VjY2VzcyhkYXRhLCB4aHIsIG9wdGlvbnMpXG4gIH1cblxuICBzZXJpYWxpemVEYXRhKG9wdGlvbnMpXG4gIHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybC5yZXBsYWNlKC89XFw/LywgJz0nICsgY2FsbGJhY2tOYW1lKVxuXG4gICAgLy8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkIHRvIGNpcmN1bXZlbnQgYW4gSUU2IGJ1Zy5cbiAgICAvLyBUaGlzIGFyaXNlcyB3aGVuIGEgYmFzZSBub2RlIGlzIHVzZWQgKHNlZSBqUXVlcnkgYnVncyAjMjcwOSBhbmQgIzQzNzgpLlxuICBoZWFkLmluc2VydEJlZm9yZShzY3JpcHQsIGhlYWQuZmlyc3RDaGlsZClcblxuICBpZiAob3B0aW9ucy50aW1lb3V0ID4gMCkge1xuICAgIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICAgIGFqYXhDb21wbGV0ZSgndGltZW91dCcsIHhociwgb3B0aW9ucylcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQpXG4gIH1cblxuICByZXR1cm4geGhyXG59XG5cbmFqYXguc2V0dGluZ3MgPSB7XG4gICAgLy8gRGVmYXVsdCB0eXBlIG9mIHJlcXVlc3RcbiAgdHlwZTogJ0dFVCcsXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBiZWZvcmUgcmVxdWVzdFxuICBiZWZvcmVTZW5kOiBlbXB0eSxcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXG4gIHN1Y2Nlc3M6IGVtcHR5LFxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgdGhlIHRoZSBzZXJ2ZXIgZHJvcHMgZXJyb3JcbiAgZXJyb3I6IGVtcHR5LFxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgb24gcmVxdWVzdCBjb21wbGV0ZSAoYm90aDogZXJyb3IgYW5kIHN1Y2Nlc3MpXG4gIGNvbXBsZXRlOiBlbXB0eSxcbiAgICAvLyBUaGUgY29udGV4dCBmb3IgdGhlIGNhbGxiYWNrc1xuICBjb250ZXh0OiBudWxsLFxuICAgIC8vIFdoZXRoZXIgdG8gdHJpZ2dlciBcImdsb2JhbFwiIEFqYXggZXZlbnRzXG4gIGdsb2JhbDogdHJ1ZSxcbiAgICAvLyBUcmFuc3BvcnRcbiAgeGhyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKVxuICB9LFxuICAgIC8vIE1JTUUgdHlwZXMgbWFwcGluZ1xuICBhY2NlcHRzOiB7XG4gICAgc2NyaXB0OiAndGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcbiAgICBqc29uOiBqc29uVHlwZSxcbiAgICB4bWw6ICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJyxcbiAgICBodG1sOiBodG1sVHlwZSxcbiAgICB0ZXh0OiAndGV4dC9wbGFpbidcbiAgfSxcbiAgICAvLyBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIHRvIGFub3RoZXIgZG9tYWluXG4gIGNyb3NzRG9tYWluOiBmYWxzZSxcbiAgICAvLyBEZWZhdWx0IHRpbWVvdXRcbiAgdGltZW91dDogMFxufVxuXG5mdW5jdGlvbiBtaW1lVG9EYXRhVHlwZSAobWltZSkge1xuICByZXR1cm4gbWltZSAmJiAobWltZSA9PT0gaHRtbFR5cGUgPyAnaHRtbCdcbiAgICAgICAgOiBtaW1lID09PSBqc29uVHlwZSA/ICdqc29uJ1xuICAgICAgICA6IHNjcmlwdFR5cGVSRS50ZXN0KG1pbWUpID8gJ3NjcmlwdCdcbiAgICAgICAgOiB4bWxUeXBlUkUudGVzdChtaW1lKSAmJiAneG1sJykgfHwgJ3RleHQnXG59XG5cbmZ1bmN0aW9uIGFwcGVuZFF1ZXJ5ICh1cmwsIHF1ZXJ5KSB7XG4gIHJldHVybiAodXJsICsgJyYnICsgcXVlcnkpLnJlcGxhY2UoL1smP117MSwyfS8sICc/Jylcbn1cblxuLy8gc2VyaWFsaXplIHBheWxvYWQgYW5kIGFwcGVuZCBpdCB0byB0aGUgVVJMIGZvciBHRVQgcmVxdWVzdHNcbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEgKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGUob3B0aW9ucy5kYXRhKSA9PT0gJ29iamVjdCcpIG9wdGlvbnMuZGF0YSA9IHBhcmFtKG9wdGlvbnMuZGF0YSlcbiAgaWYgKG9wdGlvbnMuZGF0YSAmJiAoIW9wdGlvbnMudHlwZSB8fCBvcHRpb25zLnR5cGUudG9VcHBlckNhc2UoKSA9PT0gJ0dFVCcpKSB7IG9wdGlvbnMudXJsID0gYXBwZW5kUXVlcnkob3B0aW9ucy51cmwsIG9wdGlvbnMuZGF0YSkgfVxufVxuXG5hamF4LmdldCA9IGZ1bmN0aW9uICh1cmwsIHN1Y2Nlc3MpIHsgcmV0dXJuIGFqYXgoeyB1cmw6IHVybCwgc3VjY2Vzczogc3VjY2VzcyB9KSB9XG5cbmFqYXgucG9zdCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIHN1Y2Nlc3MsIGRhdGFUeXBlKSB7XG4gIGlmICh0eXBlKGRhdGEpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBzdWNjZXNzXG4gICAgc3VjY2VzcyA9IGRhdGFcbiAgICBkYXRhID0gbnVsbFxuICB9XG4gIHJldHVybiBhamF4KHsgdHlwZTogJ1BPU1QnLCB1cmw6IHVybCwgZGF0YTogZGF0YSwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6IGRhdGFUeXBlIH0pXG59XG5cbmFqYXguZ2V0SlNPTiA9IGZ1bmN0aW9uICh1cmwsIHN1Y2Nlc3MpIHtcbiAgcmV0dXJuIGFqYXgoeyB1cmw6IHVybCwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6ICdqc29uJyB9KVxufVxuXG52YXIgZXNjYXBlID0gZW5jb2RlVVJJQ29tcG9uZW50XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZSAocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsLCBzY29wZSkge1xuICB2YXIgYXJyYXkgPSB0eXBlKG9iaikgPT09ICdhcnJheSdcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIHZhciB2YWx1ZSA9IG9ialtrZXldXG5cbiAgICBpZiAoc2NvcGUpIGtleSA9IHRyYWRpdGlvbmFsID8gc2NvcGUgOiBzY29wZSArICdbJyArIChhcnJheSA/ICcnIDoga2V5KSArICddJ1xuICAgICAgICAgICAgLy8gaGFuZGxlIGRhdGEgaW4gc2VyaWFsaXplQXJyYXkoKSBmb3JtYXRcbiAgICBpZiAoIXNjb3BlICYmIGFycmF5KSBwYXJhbXMuYWRkKHZhbHVlLm5hbWUsIHZhbHVlLnZhbHVlKVxuICAgICAgICAgICAgLy8gcmVjdXJzZSBpbnRvIG5lc3RlZCBvYmplY3RzXG4gICAgZWxzZSBpZiAodHJhZGl0aW9uYWwgPyAodHlwZSh2YWx1ZSkgPT09ICdhcnJheScpIDogKHR5cGUodmFsdWUpID09PSAnb2JqZWN0JykpIHsgc2VyaWFsaXplKHBhcmFtcywgdmFsdWUsIHRyYWRpdGlvbmFsLCBrZXkpIH0gZWxzZSBwYXJhbXMuYWRkKGtleSwgdmFsdWUpXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyYW0gKG9iaiwgdHJhZGl0aW9uYWwpIHtcbiAgdmFyIHBhcmFtcyA9IFtdXG4gIHBhcmFtcy5hZGQgPSBmdW5jdGlvbiAoaywgdikgeyB0aGlzLnB1c2goZXNjYXBlKGspICsgJz0nICsgZXNjYXBlKHYpKSB9XG4gIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwpXG4gIHJldHVybiBwYXJhbXMuam9pbignJicpLnJlcGxhY2UoJyUyMCcsICcrJylcbn1cblxuZnVuY3Rpb24gZXh0ZW5kICh0YXJnZXQpIHtcbiAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2Vba2V5XSAhPT0gdW5kZWZpbmVkKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV0gfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHRhcmdldFxufVxuIiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXI7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdFx0cmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyID0gdHJ1ZTtcblx0fVxuXHRpZiAoIXJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcikge1xuXHRcdHZhciBPbGRDb29raWVzID0gd2luZG93LkNvb2tpZXM7XG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xuXHRcdGFwaS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0d2luZG93LkNvb2tpZXMgPSBPbGRDb29raWVzO1xuXHRcdFx0cmV0dXJuIGFwaTtcblx0XHR9O1xuXHR9XG59KGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gZXh0ZW5kICgpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50c1sgaSBdO1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkgKiAxICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMgPyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoL15bXFx7XFxbXS8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cblx0XHRcdFx0dmFsdWUgPSBjb252ZXJ0ZXIud3JpdGUgP1xuXHRcdFx0XHRcdGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KSA6XG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXG5cdFx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnwzQXwzQ3wzRXwzRHwyRnwzRnw0MHw1Qnw1RHw1RXw2MHw3Qnw3RHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpXG5cdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcblx0XHRcdFx0XHQucmVwbGFjZSgvW1xcKFxcKV0vZywgZXNjYXBlKTtcblxuXHRcdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cdFx0XHRcdGZvciAodmFyIGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxuXHRcdFx0XHRcdC8vIC4uLlxuXHRcdFx0XHRcdC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcblx0XHRcdFx0XHQvLyAgICAgY2hhcmFjdGVyOlxuXHRcdFx0XHRcdC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG5cdFx0XHRcdFx0Ly8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG5cdFx0XHRcdFx0Ly8gLi4uXG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWFkXG5cblx0XHRcdHZhciBqYXIgPSB7fTtcblx0XHRcdHZhciBkZWNvZGUgPSBmdW5jdGlvbiAocykge1xuXHRcdFx0XHRyZXR1cm4gcy5yZXBsYWNlKC8oJVswLTlBLVpdezJ9KSsvZywgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdH07XG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG5cdFx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cblx0XHRcdHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gZGVjb2RlKHBhcnRzWzBdKTtcblx0XHRcdFx0XHRjb29raWUgPSAoY29udmVydGVyLnJlYWQgfHwgY29udmVydGVyKShjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRkZWNvZGUoY29va2llKTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZSA9IEpTT04ucGFyc2UoY29va2llKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0amFyW25hbWVdID0gY29va2llO1xuXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gbmFtZSkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXI7XG5cdFx0fVxuXG5cdFx0YXBpLnNldCA9IGFwaTtcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKGFwaSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIGFwaS5jYWxsKHtcblx0XHRcdFx0anNvbjogdHJ1ZVxuXHRcdFx0fSwga2V5KTtcblx0XHR9O1xuXHRcdGFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcblx0XHRcdFx0ZXhwaXJlczogLTFcblx0XHRcdH0pKTtcblx0XHR9O1xuXG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkud2l0aENvbnZlcnRlciA9IGluaXQ7XG5cblx0XHRyZXR1cm4gYXBpO1xuXHR9XG5cblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xufSkpO1xuIiwiLyoqXG4gKiBbanMtbWQ1XXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZW1uMTc4L2pzLW1kNX1cbiAqXG4gKiBAbmFtZXNwYWNlIG1kNVxuICogQHZlcnNpb24gMC43LjNcbiAqIEBhdXRob3IgQ2hlbiwgWWktQ3l1YW4gW2VtbjE3OEBnbWFpbC5jb21dXG4gKiBAY29weXJpZ2h0IENoZW4sIFlpLUN5dWFuIDIwMTQtMjAxN1xuICogQGxpY2Vuc2UgTUlUXG4gKi9cbiEgZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO1xuXG4gICAgZnVuY3Rpb24gdCh0KSB7IGlmICh0KSBkWzBdID0gZFsxNl0gPSBkWzFdID0gZFsyXSA9IGRbM10gPSBkWzRdID0gZFs1XSA9IGRbNl0gPSBkWzddID0gZFs4XSA9IGRbOV0gPSBkWzEwXSA9IGRbMTFdID0gZFsxMl0gPSBkWzEzXSA9IGRbMTRdID0gZFsxNV0gPSAwLCB0aGlzLmJsb2NrcyA9IGQsIHRoaXMuYnVmZmVyOCA9IGw7XG4gICAgICAgIGVsc2UgaWYgKGEpIHsgdmFyIHIgPSBuZXcgQXJyYXlCdWZmZXIoNjgpO1xuICAgICAgICAgICAgdGhpcy5idWZmZXI4ID0gbmV3IFVpbnQ4QXJyYXkociksIHRoaXMuYmxvY2tzID0gbmV3IFVpbnQzMkFycmF5KHIpIH0gZWxzZSB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcbiAgICAgICAgdGhpcy5oMCA9IHRoaXMuaDEgPSB0aGlzLmgyID0gdGhpcy5oMyA9IHRoaXMuc3RhcnQgPSB0aGlzLmJ5dGVzID0gdGhpcy5oQnl0ZXMgPSAwLCB0aGlzLmZpbmFsaXplZCA9IHRoaXMuaGFzaGVkID0gITEsIHRoaXMuZmlyc3QgPSAhMCB9IHZhciByID0gXCJpbnB1dCBpcyBpbnZhbGlkIHR5cGVcIixcbiAgICAgICAgZSA9IFwib2JqZWN0XCIgPT0gdHlwZW9mIHdpbmRvdyxcbiAgICAgICAgaSA9IGUgPyB3aW5kb3cgOiB7fTtcbiAgICBpLkpTX01ENV9OT19XSU5ET1cgJiYgKGUgPSAhMSk7IHZhciBzID0gIWUgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2Ygc2VsZixcbiAgICAgICAgaCA9ICFpLkpTX01ENV9OT19OT0RFX0pTICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XG4gICAgaCA/IGkgPSBnbG9iYWwgOiBzICYmIChpID0gc2VsZik7IHZhciBmID0gIWkuSlNfTUQ1X05PX0NPTU1PTl9KUyAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIG8gPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kLFxuICAgICAgICBhID0gIWkuSlNfTUQ1X05PX0FSUkFZX0JVRkZFUiAmJiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBBcnJheUJ1ZmZlcixcbiAgICAgICAgbiA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiLnNwbGl0KFwiXCIpLFxuICAgICAgICB1ID0gWzEyOCwgMzI3NjgsIDgzODg2MDgsIC0yMTQ3NDgzNjQ4XSxcbiAgICAgICAgeSA9IFswLCA4LCAxNiwgMjRdLFxuICAgICAgICBjID0gW1wiaGV4XCIsIFwiYXJyYXlcIiwgXCJkaWdlc3RcIiwgXCJidWZmZXJcIiwgXCJhcnJheUJ1ZmZlclwiLCBcImJhc2U2NFwiXSxcbiAgICAgICAgcCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLnNwbGl0KFwiXCIpLFxuICAgICAgICBkID0gW10sXG4gICAgICAgIGw7IGlmIChhKSB7IHZhciBBID0gbmV3IEFycmF5QnVmZmVyKDY4KTtcbiAgICAgICAgbCA9IG5ldyBVaW50OEFycmF5KEEpLCBkID0gbmV3IFVpbnQzMkFycmF5KEEpIH0haS5KU19NRDVfTk9fTk9ERV9KUyAmJiBBcnJheS5pc0FycmF5IHx8IChBcnJheS5pc0FycmF5ID0gZnVuY3Rpb24odCkgeyByZXR1cm4gXCJbb2JqZWN0IEFycmF5XVwiID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkgfSksICFhIHx8ICFpLkpTX01ENV9OT19BUlJBWV9CVUZGRVJfSVNfVklFVyAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgKEFycmF5QnVmZmVyLmlzVmlldyA9IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIFwib2JqZWN0XCIgPT0gdHlwZW9mIHQgJiYgdC5idWZmZXIgJiYgdC5idWZmZXIuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyIH0pOyB2YXIgYiA9IGZ1bmN0aW9uKHIpIHsgcmV0dXJuIGZ1bmN0aW9uKGUpIHsgcmV0dXJuIG5ldyB0KCEwKS51cGRhdGUoZSlbcl0oKSB9IH0sXG4gICAgICAgIHYgPSBmdW5jdGlvbigpIHsgdmFyIHIgPSBiKFwiaGV4XCIpO1xuICAgICAgICAgICAgaCAmJiAociA9IHcocikpLCByLmNyZWF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IHQgfSwgci51cGRhdGUgPSBmdW5jdGlvbih0KSB7IHJldHVybiByLmNyZWF0ZSgpLnVwZGF0ZSh0KSB9OyBmb3IgKHZhciBlID0gMDsgZSA8IGMubGVuZ3RoOyArK2UpIHsgdmFyIGkgPSBjW2VdO1xuICAgICAgICAgICAgICAgIHJbaV0gPSBiKGkpIH0gcmV0dXJuIHIgfSxcbiAgICAgICAgdyA9IGZ1bmN0aW9uKHQpIHsgdmFyIGUgPSBldmFsKFwicmVxdWlyZSgnY3J5cHRvJylcIiksXG4gICAgICAgICAgICAgICAgaSA9IGV2YWwoXCJyZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcIiksXG4gICAgICAgICAgICAgICAgcyA9IGZ1bmN0aW9uKHMpIHsgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIHMpIHJldHVybiBlLmNyZWF0ZUhhc2goXCJtZDVcIikudXBkYXRlKHMsIFwidXRmOFwiKS5kaWdlc3QoXCJoZXhcIik7IGlmIChudWxsID09PSBzIHx8IHZvaWQgMCA9PT0gcykgdGhyb3cgcjsgcmV0dXJuIHMuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyICYmIChzID0gbmV3IFVpbnQ4QXJyYXkocykpLCBBcnJheS5pc0FycmF5KHMpIHx8IEFycmF5QnVmZmVyLmlzVmlldyhzKSB8fCBzLmNvbnN0cnVjdG9yID09PSBpID8gZS5jcmVhdGVIYXNoKFwibWQ1XCIpLnVwZGF0ZShuZXcgaShzKSkuZGlnZXN0KFwiaGV4XCIpIDogdChzKSB9OyByZXR1cm4gcyB9O1xuICAgIHQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHQpIHsgaWYgKCF0aGlzLmZpbmFsaXplZCkgeyB2YXIgZSwgaSA9IHR5cGVvZiB0OyBpZiAoXCJzdHJpbmdcIiAhPT0gaSkgeyBpZiAoXCJvYmplY3RcIiAhPT0gaSkgdGhyb3cgcjsgaWYgKG51bGwgPT09IHQpIHRocm93IHI7IGlmIChhICYmIHQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKSB0ID0gbmV3IFVpbnQ4QXJyYXkodCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIShBcnJheS5pc0FycmF5KHQpIHx8IGEgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KHQpKSkgdGhyb3cgcjtcbiAgICAgICAgICAgICAgICBlID0gITAgfSBmb3IgKHZhciBzLCBoLCBmID0gMCwgbyA9IHQubGVuZ3RoLCBuID0gdGhpcy5ibG9ja3MsIHUgPSB0aGlzLmJ1ZmZlcjg7IGYgPCBvOykgeyBpZiAodGhpcy5oYXNoZWQgJiYgKHRoaXMuaGFzaGVkID0gITEsIG5bMF0gPSBuWzE2XSwgblsxNl0gPSBuWzFdID0gblsyXSA9IG5bM10gPSBuWzRdID0gbls1XSA9IG5bNl0gPSBuWzddID0gbls4XSA9IG5bOV0gPSBuWzEwXSA9IG5bMTFdID0gblsxMl0gPSBuWzEzXSA9IG5bMTRdID0gblsxNV0gPSAwKSwgZSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikgdVtoKytdID0gdFtmXTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpIG5baCA+PiAyXSB8PSB0W2ZdIDw8IHlbMyAmIGgrK107XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYSlcbiAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpKHMgPSB0LmNoYXJDb2RlQXQoZikpIDwgMTI4ID8gdVtoKytdID0gcyA6IHMgPCAyMDQ4ID8gKHVbaCsrXSA9IDE5MiB8IHMgPj4gNiwgdVtoKytdID0gMTI4IHwgNjMgJiBzKSA6IHMgPCA1NTI5NiB8fCBzID49IDU3MzQ0ID8gKHVbaCsrXSA9IDIyNCB8IHMgPj4gMTIsIHVbaCsrXSA9IDEyOCB8IHMgPj4gNiAmIDYzLCB1W2grK10gPSAxMjggfCA2MyAmIHMpIDogKHMgPSA2NTUzNiArICgoMTAyMyAmIHMpIDw8IDEwIHwgMTAyMyAmIHQuY2hhckNvZGVBdCgrK2YpKSwgdVtoKytdID0gMjQwIHwgcyA+PiAxOCwgdVtoKytdID0gMTI4IHwgcyA+PiAxMiAmIDYzLCB1W2grK10gPSAxMjggfCBzID4+IDYgJiA2MywgdVtoKytdID0gMTI4IHwgNjMgJiBzKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKShzID0gdC5jaGFyQ29kZUF0KGYpKSA8IDEyOCA/IG5baCA+PiAyXSB8PSBzIDw8IHlbMyAmIGgrK10gOiBzIDwgMjA0OCA/IChuW2ggPj4gMl0gfD0gKDE5MiB8IHMgPj4gNikgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pIDogcyA8IDU1Mjk2IHx8IHMgPj0gNTczNDQgPyAobltoID4+IDJdIHw9ICgyMjQgfCBzID4+IDEyKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gNiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSkgOiAocyA9IDY1NTM2ICsgKCgxMDIzICYgcykgPDwgMTAgfCAxMDIzICYgdC5jaGFyQ29kZUF0KCsrZikpLCBuW2ggPj4gMl0gfD0gKDI0MCB8IHMgPj4gMTgpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgcyA+PiAxMiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gNiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0Qnl0ZUluZGV4ID0gaCwgdGhpcy5ieXRlcyArPSBoIC0gdGhpcy5zdGFydCwgaCA+PSA2NCA/ICh0aGlzLnN0YXJ0ID0gaCAtIDY0LCB0aGlzLmhhc2goKSwgdGhpcy5oYXNoZWQgPSAhMCkgOiB0aGlzLnN0YXJ0ID0gaCB9IHJldHVybiB0aGlzLmJ5dGVzID4gNDI5NDk2NzI5NSAmJiAodGhpcy5oQnl0ZXMgKz0gdGhpcy5ieXRlcyAvIDQyOTQ5NjcyOTYgPDwgMCwgdGhpcy5ieXRlcyA9IHRoaXMuYnl0ZXMgJSA0Mjk0OTY3Mjk2KSwgdGhpcyB9IH0sIHQucHJvdG90eXBlLmZpbmFsaXplID0gZnVuY3Rpb24oKSB7IGlmICghdGhpcy5maW5hbGl6ZWQpIHsgdGhpcy5maW5hbGl6ZWQgPSAhMDsgdmFyIHQgPSB0aGlzLmJsb2NrcyxcbiAgICAgICAgICAgICAgICByID0gdGhpcy5sYXN0Qnl0ZUluZGV4O1xuICAgICAgICAgICAgdFtyID4+IDJdIHw9IHVbMyAmIHJdLCByID49IDU2ICYmICh0aGlzLmhhc2hlZCB8fCB0aGlzLmhhc2goKSwgdFswXSA9IHRbMTZdLCB0WzE2XSA9IHRbMV0gPSB0WzJdID0gdFszXSA9IHRbNF0gPSB0WzVdID0gdFs2XSA9IHRbN10gPSB0WzhdID0gdFs5XSA9IHRbMTBdID0gdFsxMV0gPSB0WzEyXSA9IHRbMTNdID0gdFsxNF0gPSB0WzE1XSA9IDApLCB0WzE0XSA9IHRoaXMuYnl0ZXMgPDwgMywgdFsxNV0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjksIHRoaXMuaGFzaCgpIH0gfSwgdC5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uKCkgeyB2YXIgdCwgciwgZSwgaSwgcywgaCwgZiA9IHRoaXMuYmxvY2tzO1xuICAgICAgICB0aGlzLmZpcnN0ID8gciA9ICgociA9ICgodCA9ICgodCA9IGZbMF0gLSA2ODA4NzY5MzcpIDw8IDcgfCB0ID4+PiAyNSkgLSAyNzE3MzM4NzkgPDwgMCkgXiAoZSA9ICgoZSA9ICgtMjcxNzMzODc5IF4gKGkgPSAoKGkgPSAoLTE3MzI1ODQxOTQgXiAyMDA0MzE4MDcxICYgdCkgKyBmWzFdIC0gMTE3ODMwNzA4KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAoLTI3MTczMzg3OSBeIHQpKSArIGZbMl0gLSAxMTI2NDc4Mzc1KSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbM10gLSAxMzE2MjU5MjA5KSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCA6ICh0ID0gdGhpcy5oMCwgciA9IHRoaXMuaDEsIGUgPSB0aGlzLmgyLCByID0gKChyICs9ICgodCA9ICgodCArPSAoKGkgPSB0aGlzLmgzKSBeIHIgJiAoZSBeIGkpKSArIGZbMF0gLSA2ODA4NzY5MzYpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbMV0gLSAzODk1NjQ1ODYpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZlsyXSArIDYwNjEwNTgxOSkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzNdIC0gMTA0NDUyNTMzMCkgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDApLCByID0gKChyICs9ICgodCA9ICgodCArPSAoaSBeIHIgJiAoZSBeIGkpKSArIGZbNF0gLSAxNzY0MTg4OTcpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbNV0gKyAxMjAwMDgwNDI2KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbNl0gLSAxNDczMjMxMzQxKSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbN10gLSA0NTcwNTk4MykgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9IChpIF4gciAmIChlIF4gaSkpICsgZls4XSArIDE3NzAwMzU0MTYpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbOV0gLSAxOTU4NDE0NDE3KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbMTBdIC0gNDIwNjMpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlsxMV0gLSAxOTkwNDA0MTYyKSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKGkgXiByICYgKGUgXiBpKSkgKyBmWzEyXSArIDE4MDQ2MDM2ODIpIDw8IDcgfCB0ID4+PiAyNSkgKyByIDw8IDApIF4gKGUgPSAoKGUgKz0gKHIgXiAoaSA9ICgoaSArPSAoZSBeIHQgJiAociBeIGUpKSArIGZbMTNdIC0gNDAzNDExMDEpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZlsxNF0gLSAxNTAyMDAyMjkwKSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbMTVdICsgMTIzNjUzNTMyOSkgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbMV0gLSAxNjU3OTY1MTApIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZls2XSAtIDEwNjk1MDE2MzIpIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbMTFdICsgNjQzNzE3NzEzKSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzBdIC0gMzczODk3MzAyKSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZls1XSAtIDcwMTU1ODY5MSkgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzEwXSArIDM4MDE2MDgzKSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzE1XSAtIDY2MDQ3ODMzNSkgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZls0XSAtIDQwNTUzNzg0OCkgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbOV0gKyA1Njg0NDY0MzgpIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZlsxNF0gLSAxMDE5ODAzNjkwKSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzNdIC0gMTg3MzYzOTYxKSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzhdICsgMTE2MzUzMTUwMSkgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbMTNdIC0gMTQ0NDY4MTQ2NykgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzJdIC0gNTE0MDM3ODQpIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbN10gKyAxNzM1MzI4NDczKSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzEyXSAtIDE5MjY2MDc3MzQpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzVdIC0gMzc4NTU4KSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzhdIC0gMjAyMjU3NDQ2MykgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZlsxMV0gKyAxODM5MDMwNTYyKSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZlsxNF0gLSAzNTMwOTU1NikgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZlsxXSAtIDE1MzA5OTIwNjApIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbNF0gKyAxMjcyODkzMzUzKSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzddIC0gMTU1NDk3NjMyKSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZlsxMF0gLSAxMDk0NzMwNjQwKSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzEzXSArIDY4MTI3OTE3NCkgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZlswXSAtIDM1ODUzNzIyMikgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZlszXSAtIDcyMjUyMTk3OSkgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbNl0gKyA3NjAyOTE4OSkgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZls5XSAtIDY0MDM2NDQ4NykgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZlsxMl0gLSA0MjE4MTU4MzUpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbMTVdICsgNTMwNzQyNTIwKSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZlsyXSAtIDk5NTMzODY1MSkgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzBdIC0gMTk4NjMwODQ0KSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzddICsgMTEyNjg5MTQxNSkgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZlsxNF0gLSAxNDE2MzU0OTA1KSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZls1XSAtIDU3NDM0MDU1KSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzEyXSArIDE3MDA0ODU1NzEpIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbM10gLSAxODk0OTg2NjA2KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzEwXSAtIDEwNTE1MjMpIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzFdIC0gMjA1NDkyMjc5OSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZls4XSArIDE4NzMzMTMzNTkpIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbMTVdIC0gMzA2MTE3NDQpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbNl0gLSAxNTYwMTk4MzgwKSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZlsxM10gKyAxMzA5MTUxNjQ5KSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzRdIC0gMTQ1NTIzMDcwKSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzExXSAtIDExMjAyMTAzNzkpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbMl0gKyA3MTg3ODcyNTkpIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzldIC0gMzQzNDg1NTUxKSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgdGhpcy5maXJzdCA/ICh0aGlzLmgwID0gdCArIDE3MzI1ODQxOTMgPDwgMCwgdGhpcy5oMSA9IHIgLSAyNzE3MzM4NzkgPDwgMCwgdGhpcy5oMiA9IGUgLSAxNzMyNTg0MTk0IDw8IDAsIHRoaXMuaDMgPSBpICsgMjcxNzMzODc4IDw8IDAsIHRoaXMuZmlyc3QgPSAhMSkgOiAodGhpcy5oMCA9IHRoaXMuaDAgKyB0IDw8IDAsIHRoaXMuaDEgPSB0aGlzLmgxICsgciA8PCAwLCB0aGlzLmgyID0gdGhpcy5oMiArIGUgPDwgMCwgdGhpcy5oMyA9IHRoaXMuaDMgKyBpIDw8IDApIH0sIHQucHJvdG90eXBlLmhleCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmZpbmFsaXplKCk7IHZhciB0ID0gdGhpcy5oMCxcbiAgICAgICAgICAgIHIgPSB0aGlzLmgxLFxuICAgICAgICAgICAgZSA9IHRoaXMuaDIsXG4gICAgICAgICAgICBpID0gdGhpcy5oMzsgcmV0dXJuIG5bdCA+PiA0ICYgMTVdICsgblsxNSAmIHRdICsgblt0ID4+IDEyICYgMTVdICsgblt0ID4+IDggJiAxNV0gKyBuW3QgPj4gMjAgJiAxNV0gKyBuW3QgPj4gMTYgJiAxNV0gKyBuW3QgPj4gMjggJiAxNV0gKyBuW3QgPj4gMjQgJiAxNV0gKyBuW3IgPj4gNCAmIDE1XSArIG5bMTUgJiByXSArIG5bciA+PiAxMiAmIDE1XSArIG5bciA+PiA4ICYgMTVdICsgbltyID4+IDIwICYgMTVdICsgbltyID4+IDE2ICYgMTVdICsgbltyID4+IDI4ICYgMTVdICsgbltyID4+IDI0ICYgMTVdICsgbltlID4+IDQgJiAxNV0gKyBuWzE1ICYgZV0gKyBuW2UgPj4gMTIgJiAxNV0gKyBuW2UgPj4gOCAmIDE1XSArIG5bZSA+PiAyMCAmIDE1XSArIG5bZSA+PiAxNiAmIDE1XSArIG5bZSA+PiAyOCAmIDE1XSArIG5bZSA+PiAyNCAmIDE1XSArIG5baSA+PiA0ICYgMTVdICsgblsxNSAmIGldICsgbltpID4+IDEyICYgMTVdICsgbltpID4+IDggJiAxNV0gKyBuW2kgPj4gMjAgJiAxNV0gKyBuW2kgPj4gMTYgJiAxNV0gKyBuW2kgPj4gMjggJiAxNV0gKyBuW2kgPj4gMjQgJiAxNV0gfSwgdC5wcm90b3R5cGUudG9TdHJpbmcgPSB0LnByb3RvdHlwZS5oZXgsIHQucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmZpbmFsaXplKCk7IHZhciB0ID0gdGhpcy5oMCxcbiAgICAgICAgICAgIHIgPSB0aGlzLmgxLFxuICAgICAgICAgICAgZSA9IHRoaXMuaDIsXG4gICAgICAgICAgICBpID0gdGhpcy5oMzsgcmV0dXJuIFsyNTUgJiB0LCB0ID4+IDggJiAyNTUsIHQgPj4gMTYgJiAyNTUsIHQgPj4gMjQgJiAyNTUsIDI1NSAmIHIsIHIgPj4gOCAmIDI1NSwgciA+PiAxNiAmIDI1NSwgciA+PiAyNCAmIDI1NSwgMjU1ICYgZSwgZSA+PiA4ICYgMjU1LCBlID4+IDE2ICYgMjU1LCBlID4+IDI0ICYgMjU1LCAyNTUgJiBpLCBpID4+IDggJiAyNTUsIGkgPj4gMTYgJiAyNTUsIGkgPj4gMjQgJiAyNTVdIH0sIHQucHJvdG90eXBlLmFycmF5ID0gdC5wcm90b3R5cGUuZGlnZXN0LCB0LnByb3RvdHlwZS5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkgeyB0aGlzLmZpbmFsaXplKCk7IHZhciB0ID0gbmV3IEFycmF5QnVmZmVyKDE2KSxcbiAgICAgICAgICAgIHIgPSBuZXcgVWludDMyQXJyYXkodCk7IHJldHVybiByWzBdID0gdGhpcy5oMCwgclsxXSA9IHRoaXMuaDEsIHJbMl0gPSB0aGlzLmgyLCByWzNdID0gdGhpcy5oMywgdCB9LCB0LnByb3RvdHlwZS5idWZmZXIgPSB0LnByb3RvdHlwZS5hcnJheUJ1ZmZlciwgdC5wcm90b3R5cGUuYmFzZTY0ID0gZnVuY3Rpb24oKSB7IGZvciAodmFyIHQsIHIsIGUsIGkgPSBcIlwiLCBzID0gdGhpcy5hcnJheSgpLCBoID0gMDsgaCA8IDE1OykgdCA9IHNbaCsrXSwgciA9IHNbaCsrXSwgZSA9IHNbaCsrXSwgaSArPSBwW3QgPj4+IDJdICsgcFs2MyAmICh0IDw8IDQgfCByID4+PiA0KV0gKyBwWzYzICYgKHIgPDwgMiB8IGUgPj4+IDYpXSArIHBbNjMgJiBlXTsgcmV0dXJuIHQgPSBzW2hdLCBpICs9IHBbdCA+Pj4gMl0gKyBwW3QgPDwgNCAmIDYzXSArIFwiPT1cIiB9OyB2YXIgXyA9IHYoKTtcbiAgICBmID8gbW9kdWxlLmV4cG9ydHMgPSBfIDogKGkubWQ1ID0gXywgbyAmJiBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBfIH0pKSB9KCk7IiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayhcbiAgICAgIHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aClcbiAgICApKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxudmFyIEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ3BhcmVudCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ieXRlT2Zmc2V0XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKGlzQXJyYXlCdWZmZXIodmFsdWUpIHx8ICh2YWx1ZSAmJiBpc0FycmF5QnVmZmVyKHZhbHVlLmJ1ZmZlcikpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIE5vdGU6IENoYW5nZSBwcm90b3R5cGUgKmFmdGVyKiBCdWZmZXIuZnJvbSBpcyBkZWZpbmVkIHRvIHdvcmthcm91bmQgQ2hyb21lIGJ1Zzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvMTQ4XG5CdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG5CdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAoc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IGJ1Zi53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgYnVmID0gYnVmLnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGJ1ZltpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wib2Zmc2V0XCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJsZW5ndGhcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgdmFyIGJ1ZlxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgYnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0IChvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW4pXG5cbiAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJ1ZlxuICAgIH1cblxuICAgIG9iai5jb3B5KGJ1ZiwgMCwgMCwgbGVuKVxuICAgIHJldHVybiBidWZcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KG9iaikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IG51bWJlcklzTmFOKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBBcnJheS1saWtlIE9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwgS19NQVhfTEVOR1RIYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBLX01BWF9MRU5HVEgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICE9IG51bGwgJiYgYi5faXNCdWZmZXIgPT09IHRydWVcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYnVmKSkge1xuICAgICAgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBpc0FycmF5QnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgKGFuZCB0aGUgYGlzLWJ1ZmZlcmAgbnBtIHBhY2thZ2UpXG4vLyB0byBkZXRlY3QgYSBCdWZmZXIgaW5zdGFuY2UuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHVzZSBgaW5zdGFuY2VvZiBCdWZmZXJgXG4vLyByZWxpYWJseSBpbiBhIGJyb3dzZXJpZnkgY29udGV4dCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG11bHRpcGxlIGRpZmZlcmVudFxuLy8gY29waWVzIG9mIHRoZSAnYnVmZmVyJyBwYWNrYWdlIGluIHVzZS4gVGhpcyBtZXRob2Qgd29ya3MgZXZlbiBmb3IgQnVmZmVyXG4vLyBpbnN0YW5jZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZnJvbSBhbm90aGVyIGNvcHkgb2YgdGhlIGBidWZmZXJgIHBhY2thZ2UuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNTRcbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nXG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBVc2UgYnVpbHQtaW4gd2hlbiBhdmFpbGFibGUsIG1pc3NpbmcgZnJvbSBJRTExXG4gICAgdGhpcy5jb3B5V2l0aGluKHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKVxuICB9IGVsc2UgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yICh2YXIgaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZylcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHZhbHVlIFwiJyArIHZhbCArXG4gICAgICAgICdcIiBpcyBpbnZhbGlkIGZvciBhcmd1bWVudCBcInZhbHVlXCInKVxuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXisvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHRha2VzIGVxdWFsIHNpZ25zIGFzIGVuZCBvZiB0aGUgQmFzZTY0IGVuY29kaW5nXG4gIHN0ciA9IHN0ci5zcGxpdCgnPScpWzBdXG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuLy8gQXJyYXlCdWZmZXJzIGZyb20gYW5vdGhlciBjb250ZXh0IChpLmUuIGFuIGlmcmFtZSkgZG8gbm90IHBhc3MgdGhlIGBpbnN0YW5jZW9mYCBjaGVja1xuLy8gYnV0IHRoZXkgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgdmFsaWQuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gJ0FycmF5QnVmZmVyJyAmJlxuICAgICAgdHlwZW9mIG9iai5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJylcbn1cblxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICByZXR1cm4gb2JqICE9PSBvYmogLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsIi8qXG4gKiAgYmFzZTY0LmpzXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbiAqICAgIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiAgUmVmZXJlbmNlczpcbiAqICAgIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0XG4gKi9cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShnbG9iYWwpXG4gICAgICAgIDogdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKGZhY3RvcnkpIDogZmFjdG9yeShnbG9iYWwpXG59KChcbiAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3dcbiAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFxuOiB0aGlzXG4pLCBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gZXhpc3RpbmcgdmVyc2lvbiBmb3Igbm9Db25mbGljdCgpXG4gICAgdmFyIF9CYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIHZhciB2ZXJzaW9uID0gXCIyLjQuNVwiO1xuICAgIC8vIGlmIG5vZGUuanMsIHdlIHVzZSBCdWZmZXJcbiAgICB2YXIgYnVmZmVyO1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgfVxuICAgIC8vIGNvbnN0YW50c1xuICAgIHZhciBiNjRjaGFyc1xuICAgICAgICA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcbiAgICB2YXIgYjY0dGFiID0gZnVuY3Rpb24oYmluKSB7XG4gICAgICAgIHZhciB0ID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYmluLmxlbmd0aDsgaSA8IGw7IGkrKykgdFtiaW4uY2hhckF0KGkpXSA9IGk7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0oYjY0Y2hhcnMpO1xuICAgIHZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuICAgIC8vIGVuY29kZXIgc3R1ZmZcbiAgICB2YXIgY2JfdXRvYiA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgaWYgKGMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdmFyIGNjID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgcmV0dXJuIGNjIDwgMHg4MCA/IGNcbiAgICAgICAgICAgICAgICA6IGNjIDwgMHg4MDAgPyAoZnJvbUNoYXJDb2RlKDB4YzAgfCAoY2MgPj4+IDYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpKVxuICAgICAgICAgICAgICAgIDogKGZyb21DaGFyQ29kZSgweGUwIHwgKChjYyA+Pj4gMTIpICYgMHgwZikpXG4gICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgPyBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWwuYnRvYShiKTtcbiAgICB9IDogZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5yZXBsYWNlKC9bXFxzXFxTXXsxLDN9L2csIGNiX2VuY29kZSk7XG4gICAgfTtcbiAgICB2YXIgX2VuY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICA/IGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gKHUuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvciA/IHUgOiBidWZmZXIuZnJvbSh1KSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIH1cbiAgICAgICAgOiAgZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIHJldHVybiAodS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yID8gdSA6IG5ldyAgYnVmZmVyKHUpKVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBidG9hKHV0b2IodSkpIH1cbiAgICA7XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuICF1cmlzYWZlXG4gICAgICAgICAgICA/IF9lbmNvZGUoU3RyaW5nKHUpKVxuICAgICAgICAgICAgOiBfZW5jb2RlKFN0cmluZyh1KSkucmVwbGFjZSgvWytcXC9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0wID09ICcrJyA/ICctJyA6ICdfJztcbiAgICAgICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIC8vIGRlY29kZXIgc3R1ZmZcbiAgICB2YXIgcmVfYnRvdSA9IG5ldyBSZWdFeHAoW1xuICAgICAgICAnW1xceEMwLVxceERGXVtcXHg4MC1cXHhCRl0nLFxuICAgICAgICAnW1xceEUwLVxceEVGXVtcXHg4MC1cXHhCRl17Mn0nLFxuICAgICAgICAnW1xceEYwLVxceEY3XVtcXHg4MC1cXHhCRl17M30nXG4gICAgXS5qb2luKCd8JyksICdnJyk7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIGF0b2IgPSBnbG9iYWwuYXRvYiA/IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbC5hdG9iKGEpO1xuICAgIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvW1xcc1xcU117MSw0fS9nLCBjYl9kZWNvZGUpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBidWZmZXIgP1xuICAgICAgICBidWZmZXIuZnJvbSAmJiBVaW50OEFycmF5ICYmIGJ1ZmZlci5mcm9tICE9PSBVaW50OEFycmF5LmZyb21cbiAgICAgICAgPyBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBidWZmZXIuZnJvbShhLCAnYmFzZTY0JykpLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBuZXcgYnVmZmVyKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGJ0b3UoYXRvYihhKSkgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKFxuICAgICAgICAgICAgU3RyaW5nKGEpLnJlcGxhY2UoL1stX10vZywgZnVuY3Rpb24obTApIHsgcmV0dXJuIG0wID09ICctJyA/ICcrJyA6ICcvJyB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL10vZywgJycpXG4gICAgICAgICk7XG4gICAgfTtcbiAgICB2YXIgbm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NCA9IF9CYXNlNjQ7XG4gICAgICAgIHJldHVybiBCYXNlNjQ7XG4gICAgfTtcbiAgICAvLyBleHBvcnQgQmFzZTY0XG4gICAgZ2xvYmFsLkJhc2U2NCA9IHtcbiAgICAgICAgVkVSU0lPTjogdmVyc2lvbixcbiAgICAgICAgYXRvYjogYXRvYixcbiAgICAgICAgYnRvYTogYnRvYSxcbiAgICAgICAgZnJvbUJhc2U2NDogZGVjb2RlLFxuICAgICAgICB0b0Jhc2U2NDogZW5jb2RlLFxuICAgICAgICB1dG9iOiB1dG9iLFxuICAgICAgICBlbmNvZGU6IGVuY29kZSxcbiAgICAgICAgZW5jb2RlVVJJOiBlbmNvZGVVUkksXG4gICAgICAgIGJ0b3U6IGJ0b3UsXG4gICAgICAgIGRlY29kZTogZGVjb2RlLFxuICAgICAgICBub0NvbmZsaWN0OiBub0NvbmZsaWN0XG4gICAgfTtcbiAgICAvLyBpZiBFUzUgaXMgYXZhaWxhYmxlLCBtYWtlIEJhc2U2NC5leHRlbmRTdHJpbmcoKSBhdmFpbGFibGVcbiAgICBpZiAodHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgbm9FbnVtID0gZnVuY3Rpb24odil7XG4gICAgICAgICAgICByZXR1cm4ge3ZhbHVlOnYsZW51bWVyYWJsZTpmYWxzZSx3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlfTtcbiAgICAgICAgfTtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NC5leHRlbmRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ2Zyb21CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlKHRoaXMpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICd0b0Jhc2U2NCcsIG5vRW51bShmdW5jdGlvbiAodXJpc2FmZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHVyaXNhZmUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICd0b0Jhc2U2NFVSSScsIG5vRW51bShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vXG4gICAgLy8gZXhwb3J0IEJhc2U2NCB0byB0aGUgbmFtZXNwYWNlXG4gICAgLy9cbiAgICBpZiAoZ2xvYmFsWydNZXRlb3InXSkgeyAvLyBNZXRlb3IuanNcbiAgICAgICAgQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgLy8gbW9kdWxlLmV4cG9ydHMgYW5kIEFNRCBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLlxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGhhcyBwcmVjZWRlbmNlLlxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cy5CYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCl7IHJldHVybiBnbG9iYWwuQmFzZTY0IH0pO1xuICAgIH1cbiAgICAvLyB0aGF0J3MgaXQhXG4gICAgcmV0dXJuIHtCYXNlNjQ6IGdsb2JhbC5CYXNlNjR9XG59KSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xyXG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XHJcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6IHJldHVybiAnZnVuY3Rpb24nXHJcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJ1xyXG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnXHJcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cydcclxuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSdcclxuICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6IHJldHVybiAnc3RyaW5nJ1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcgJiYgdmFsICYmIHR5cGVvZiB2YWwubGVuZ3RoID09ICdudW1iZXInKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbC5jYWxsZWUgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuICdhcmd1bWVudHMnO1xyXG4gICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuICdhcmd1bWVudHMnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnXHJcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCdcclxuICBpZiAodmFsICYmIHZhbC5ub2RlVHlwZSA9PT0gMSkgcmV0dXJuICdlbGVtZW50J1xyXG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCdcclxuXHJcbiAgcmV0dXJuIHR5cGVvZiB2YWxcclxufVxyXG4iXX0=
