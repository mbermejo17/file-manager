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

  var deleteSelected = function deleteSelected() {
    if (aSelectedFolders.length > 0) {
      showDialogYesNo('Borrar carpetas', '¿Quiere borrar las carpetas seleccionadas?', function (result) {
        if (result == 'YES') {
          $.when(deleteFolder(currentPath)).then(function () {
            if (aSelectedFiles.length > 0) {
              showDialogYesNo('Borrar archivos', '¿Quiere borrar los archivos seleccionados?', function (result) {
                console.log('yesNo', result);
                if (result == 'YES') deleteFile(currentPath);
              });
            }
          });
        }
      });
    } else {
      if (aSelectedFiles.length > 0) {
        showDialogYesNo('Borrar archivos', '¿Quiere borrar los archivos seleccionados?', function (result) {
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
    var ModalTitle = "Subida de archivos";
    var ModalContent = '<label class="file-input waves-effect waves-teal btn-flat btn2-unify">Select files<input id="upload-input" type="file" name="uploads[]" multiple="multiple" class="modal-action modal-close"></label>\n        <span id="sFiles">Ningun archivo seleccionado</span>\n                    <ul class="preloader-file" id="DownloadfileList">\n                    <li id="li0">\n                        <div class="li-content">\n                            <div class="li-filename" id="li-filename0"></div>\n                            <div class="progress-content">\n                                <div class="progress-bar" id="progress-bar0"></div>\n                                <div class="percent" id="percent0"></div>\n                            </div>\n                        </div>\n                    </li>\n                    <li id="li1">\n                        <div class="li-content">\n                            <div class="li-filename" id="li-filename1"></div>\n                            <div class="progress-content">\n                                <div class="progress-bar" id="progress-bar1"></div>\n                                <div class="percent" id="percent1"></div>\n                            </div>\n                        </div>\n                    </li>\n                    <li id="li2">\n                        <div class="li-content">\n                            <div class="li-filename" id="li-filename2"></div>\n                            <div class="progress-content">\n                                <div class="progress-bar" id="progress-bar2"></div>\n                                <div class="percent" id="percent2"></div>\n                            </div>\n                        </div>\n                    </li>\n                    <li id="li3">\n                        <div class="li-content">\n                            <div class="li-filename" id="li-filename3"></div>\n                            <div class="progress-content">\n                                <div class="progress-bar" id="progress-bar3"></div>\n                                <div class="percent" id="percent3"></div>\n                            </div>\n                        </div>\n                    </li>\n                    <li id="li4">\n                        <div class="li-content">\n                            <div class="li-filename" id="li-filename4"></div>\n                            <div class="progress-content">\n                                <div class="progress-bar" id="progress-bar4"></div>\n                                <div class="percent" id="percent4"></div>\n                            </div>\n                        </div>\n                    </li>\n                </ul>';
    var htmlContent = '<div id="modal-header">\n                            <h5>' + ModalTitle + '</h5>\n                            <a class="modal_close" id="modalClose" href="#"></a>\n                          </div>\n                          <div class="modal-content">\n                            <p>' + ModalContent + '</p>\n                          </div>\n                          <div class="modal-footer">\n                              <input type="text" hidden id="destPath" name="destPath" value=""/>  \n                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseUpload" href="#!">Cerrar</a>\n                          </div>    ';

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
        },
        xhr: function xhr() {
          var xhr = new XMLHttpRequest();
          var percentComplete = 0;
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
    $('#upload-input').on('change', function () {
      var files = $(this).get(0).files;
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
    $('#btnNo').on('click', function (e) {
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
    var ModalContent = '<ul class="preloader-file" id="DownloadfileList">\n            <li id="li0">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename0"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar0"></div>\n                        <div class="percent" id="percent0"></div>\n                        <a class="modal_close" id="abort0" href="#"></a>\n                    </div>\n                </div>\n            </li>\n            <li id="li1">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename1"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar1"></div>\n                        <div class="percent" id="percent1"></div>\n                        <a class="modal_close" id="abort1" href="#"></a>\n                    </div>\n                </div>\n            </li>\n            <li id="li2">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename2"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar2"></div>\n                        <div class="percent" id="percent2"></div>\n                        <a class="modal_close" id="abort2" href="#"></a>\n                    </div>   \n                </div>\n            </li>\n            <li id="li3">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename3"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar3"></div>\n                        <div class="percent" id="percent3"></div>\n                        <a class="modal_close" id="abort3" href="#"></a>\n                    </div>   \n                </div>\n            </li>\n            <li id="li4">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename4"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar4"></div>\n                        <div class="percent" id="percent4"></div>\n                        <a class="modal_close" id="abort4" href="#"></a>\n                    </div>\n                </div>\n            </li>\n        </ul>';
    var htmlContent = '<div id="modal-header">\n                            <h5>' + ModalTitle + '</h5>\n                            <a class="modal_close" id="modalClose" href="#"></a>\n                          </div>\n                          <div class="modal-content">\n                            <p>' + ModalContent + '</p>\n                          </div>\n                          <div class="modal-footer">\n                          <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCancelAll" href="#!">Cancelar descargas</a>\n                              <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="btnCloseDownload" href="#!">Cerrar</a>\n                          </div>    ';
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
    $('#waiting').removeClass('active');
  };

  var refreshPath = function refreshPath(cPath) {
    console.log('init path: ', cPath);
    var newHtmlContent = '<li><label id="currentpath">Path:</label></li>\n                              <li><spand>&nbsp;</spand><a class="breadcrumb" href="#!">/</a></li>';
    console.log('cPath lenght:', cPath.length);
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
    }).catch(function (err) {
      console.log(err);
    });
  };

  var selectAll = function selectAll(e) {
    var allCkeckbox = document.querySelectorAll('.check');
    var v = document.querySelector("#selectAllFiles").checked;
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

  var getCheckedFiles = function getCheckedFiles() {
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
    console.log($('#Settingdropdown').css('display'));
    if ($('#Settingdropdown').css('display') === 'block') {
      $('#settings').removeClass('selected');
      $('#Settingdropdown').removeClass('setting').hide();
    } else {
      $('#settings').addClass('selected');
      $('#Settingdropdown').addClass('setting').show();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kYXNoYm9hcmQuanMiLCJqcy92ZW5kb3IvYWpheC5qcyIsImpzL3ZlbmRvci9qcy1jb29raWUuanMiLCJqcy92ZW5kb3IvbWQ1Lm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtYmFzZTY0L2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdHlwZS1vZi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7O0FBR0E7Ozs7QUFDQTs7Ozs7O0FBRUEsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZOztBQUU1QixNQUFNLFdBQVcsbUJBQVEsR0FBUixDQUFZLFVBQVosQ0FBakI7QUFDQSxNQUFNLFdBQVcsbUJBQVEsR0FBUixDQUFZLFVBQVosQ0FBakI7QUFDQSxNQUFNLGNBQWMsbUJBQVEsR0FBUixDQUFZLGFBQVosQ0FBcEI7QUFDQSxNQUFNLGVBQWUsbUJBQVEsR0FBUixDQUFZLFVBQVosQ0FBckI7QUFDQSxNQUFNLFFBQVEsbUJBQVEsR0FBUixDQUFZLE9BQVosQ0FBZDtBQUNBLE1BQU0sZUFBZSxtQkFBUSxHQUFSLENBQVksY0FBWixDQUFyQjs7QUFQNEIsNEJBZXhCLGFBQWEsS0FBYixDQUFtQixHQUFuQixDQWZ3QjtBQUFBO0FBQUEsTUFRckIsY0FScUI7QUFBQSxNQVMxQixpQkFUMEI7QUFBQSxNQVUxQixlQVYwQjtBQUFBLE1BVzFCLGlCQVgwQjtBQUFBLE1BWTFCLGVBWjBCO0FBQUEsTUFhMUIsV0FiMEI7QUFBQSxNQWMxQixhQWQwQjs7QUFnQjVCLE1BQUksV0FBVyxHQUFmO0FB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QVc7QUFBRSxlQUFPLENBQVA7QUFBVSxLQUE5QixDQUExQztBQUE0RSxDQWpEOUUsRUFBRjs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc2N0cmljdCc7XG5pbXBvcnQgYWpheCBmcm9tICcuL3ZlbmRvci9hamF4JztcbmltcG9ydCB7XG4gIEJhc2U2NFxufSBmcm9tICdqcy1iYXNlNjQnO1xuaW1wb3J0IG1kNSBmcm9tICcuL3ZlbmRvci9tZDUubWluJztcbmltcG9ydCBDb29raWVzIGZyb20gJy4vdmVuZG9yL2pzLWNvb2tpZSc7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICBjb25zdCBVc2VyTmFtZSA9IENvb2tpZXMuZ2V0KCdVc2VyTmFtZScpO1xuICBjb25zdCBVc2VyUm9sZSA9IENvb2tpZXMuZ2V0KCdVc2VyUm9sZScpO1xuICBjb25zdCBDb21wYW55TmFtZSA9IENvb2tpZXMuZ2V0KCdDb21wYW55TmFtZScpO1xuICBjb25zdCByZWFsUm9vdFBhdGggPSBDb29raWVzLmdldCgnUm9vdFBhdGgnKTtcbiAgY29uc3QgVG9rZW4gPSBDb29raWVzLmdldCgndG9rZW4nKTtcbiAgY29uc3QgQWNjZXNzU3RyaW5nID0gQ29va2llcy5nZXQoJ0FjY2Vzc1N0cmluZycpO1xuICBjb25zdCBbQWxsb3dOZXdGb2xkZXIsXG4gICAgQWxsb3dSZW5hbWVGb2xkZXIsXG4gICAgQWxsb3dSZW5hbWVGaWxlLFxuICAgIEFsbG93RGVsZXRlRm9sZGVyLFxuICAgIEFsbG93RGVsZXRlRmlsZSxcbiAgICBBbGxvd1VwbG9hZCxcbiAgICBBbGxvd0Rvd25sb2FkXG4gIF0gPSBBY2Nlc3NTdHJpbmcuc3BsaXQoJywnKTtcbiAgbGV0IFJvb3RQYXRoID0gJy8nO1xuICBsZXQgY3VycmVudFBhdGggPSBSb290UGF0aDtcbiAgbGV0IGFTZWxlY3RlZEZpbGVzID0gW107XG4gIGxldCBhU2VsZWN0ZWRGb2xkZXJzID0gW107XG4gIGxldCBhRm9sZGVycyA9IFtdO1xuICBsZXQgYUZpbGVzID0gW107XG5cblxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiB7XG4gICAgQ29va2llcy5yZW1vdmUoJ1VzZXJOYW1lJyk7XG4gICAgQ29va2llcy5yZW1vdmUoJ1VzZXJSb2xlJyk7XG4gICAgQ29va2llcy5yZW1vdmUoJ3Nlc3Npb25JZCcpO1xuICAgIENvb2tpZXMucmVtb3ZlKCd0b2tlbicpO1xuICAgIENvb2tpZXMucmVtb3ZlKCd3c3NVUkwnKTtcbiAgICBDb29raWVzLnJlbW92ZSgnUm9vdFBhdGgnKTtcbiAgICBDb29raWVzLnJlbW92ZSgnQ29tcGFueU5hbWUnKTtcbiAgICBDb29raWVzLnJlbW92ZSgnQWNjZXNzU3RyaW5nJyk7XG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9ICcvJztcbiAgfTtcblxuICBjb25zdCBzZXJpYWxpemVPYmplY3QgPSAoZGF0YU9iamVjdCkgPT4ge1xuICAgIHZhciBzdHJpbmdSZXN1bHQgPSAnJyxcbiAgICAgIHZhbHVlID0gdm9pZCAwO1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhT2JqZWN0KSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhT2JqZWN0W2tleV0sIGtleSk7XG4gICAgICB2YWx1ZSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICAgIGlmIChzdHJpbmdSZXN1bHQgIT09ICcnKSB7XG4gICAgICAgIHN0cmluZ1Jlc3VsdCArPSAnJicgKyBrZXkgKyAnPScgKyB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0cmluZ1Jlc3VsdCArPSBrZXkgKyAnPScgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZ1Jlc3VsdDtcbiAgfTtcblxuICBjb25zdCBjaGFuZ2VQYXRoID0gKG5ld1BhdGgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnY2hhbmdlUGF0aDpuZXdQYXRoICcsIG5ld1BhdGgpO1xuICAgIGN1cnJlbnRQYXRoID0gbmV3UGF0aC50cmltKCk7XG4gICAgcmVmcmVzaFBhdGgoY3VycmVudFBhdGgpO1xuICAgIHJlZnJlc2hCYXJNZW51KCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlU2VsZWN0ZWQgPSAoKSA9PiB7XG4gICAgaWYgKGFTZWxlY3RlZEZvbGRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc2hvd0RpYWxvZ1llc05vKCdCb3JyYXIgY2FycGV0YXMnLCAnwr9RdWllcmUgYm9ycmFyIGxhcyBjYXJwZXRhcyBzZWxlY2Npb25hZGFzPycsIChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdCA9PSAnWUVTJykge1xuICAgICAgICAgICQud2hlbihkZWxldGVGb2xkZXIoY3VycmVudFBhdGgpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNob3dEaWFsb2dZZXNObygnQm9ycmFyIGFyY2hpdm9zJywgJ8K/UXVpZXJlIGJvcnJhciBsb3MgYXJjaGl2b3Mgc2VsZWNjaW9uYWRvcz8nLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneWVzTm8nLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSAnWUVTJykgZGVsZXRlRmlsZShjdXJyZW50UGF0aCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaG93RGlhbG9nWWVzTm8oJ0JvcnJhciBhcmNoaXZvcycsICfCv1F1aWVyZSBib3JyYXIgbG9zIGFyY2hpdm9zIHNlbGVjY2lvbmFkb3M/JywgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd5ZXNObycsIHJlc3VsdCk7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PSAnWUVTJykgZGVsZXRlRmlsZShjdXJyZW50UGF0aCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgRmV0Y2hIYW5kbGVFcnJvcnMgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAvL3Rocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gNDAxKSB7XG4gICAgICAgIGxvZ291dCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cbiAgY29uc3QgdXBsb2FkID0gKCkgPT4ge1xuICAgIGxldCB3ID0gMzI7XG4gICAgbGV0IGggPSA0NDA7XG4gICAgbGV0IE1vZGFsVGl0bGUgPSBcIlN1YmlkYSBkZSBhcmNoaXZvc1wiO1xuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGxhYmVsIGNsYXNzPVwiZmlsZS1pbnB1dCB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCI+U2VsZWN0IGZpbGVzPGlucHV0IGlkPVwidXBsb2FkLWlucHV0XCIgdHlwZT1cImZpbGVcIiBuYW1lPVwidXBsb2Fkc1tdXCIgbXVsdGlwbGU9XCJtdWx0aXBsZVwiIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlXCI+PC9sYWJlbD5cbiAgICAgICAgPHNwYW4gaWQ9XCJzRmlsZXNcIj5OaW5ndW4gYXJjaGl2byBzZWxlY2Npb25hZG88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInByZWxvYWRlci1maWxlXCIgaWQ9XCJEb3dubG9hZGZpbGVMaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZD1cImxpMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQwXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGlkPVwibGkxXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUxXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDFcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgaWQ9XCJsaTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MlwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZD1cImxpM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lM1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQzXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGlkPVwibGk0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWU0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyNFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+YDtcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7TW9kYWxDb250ZW50fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGhpZGRlbiBpZD1cImRlc3RQYXRoXCIgbmFtZT1cImRlc3RQYXRoXCIgdmFsdWU9XCJcIi8+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNsb3NlVXBsb2FkXCIgaHJlZj1cIiMhXCI+Q2VycmFyPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgYDtcblxuICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuICAgIGZ1bmN0aW9uIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgbkZpbGUsIGZpbGVOYW1lKSB7XG4gICAgICAkKCcjbGknICsgbkZpbGUpLnNob3coKTtcbiAgICAgICQoJyNsaS1maWxlbmFtZScgKyBuRmlsZSkuc2hvdygpO1xuICAgICAgJCgnI2xpLWZpbGVuYW1lJyArIG5GaWxlKS5odG1sKGZpbGVOYW1lKTtcbiAgICAgIGxldCByZWFscGF0aCA9ICcnO1xuICAgICAgaWYgKGN1cnJlbnRQYXRoID09ICcvJykge1xuICAgICAgICByZWFscGF0aCA9IGN1cnJlbnRQYXRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVhbHBhdGggPSByZWFsUm9vdFBhdGggKyBjdXJyZW50UGF0aDtcbiAgICAgIH1cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogJy9maWxlcy91cGxvYWQ/ZGVzdFBhdGg9JyArIHJlYWxwYXRoLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgdGltZW91dDogMjcwMDAwLFxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyT2JqKSB7XG4gICAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBUb2tlbik7XG4gICAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoXCJkZXN0UGF0aFwiLCByZWFscGF0aCk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsZU5hbWUgKyAndXBsb2FkIHN1Y2Nlc3NmdWwhXFxuJyArIGRhdGEpO1xuICAgICAgICAgICQoJy50b2FzdCcpLnJlbW92ZUNsYXNzKCdzdWNjZXNzJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICBNLnRvYXN0KHtcbiAgICAgICAgICAgIGh0bWw6IGZpbGVOYW1lICsgJyB1cGxvYWRlZCBzdWNlc3NmdWxseSdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgeGhyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIGxldCBwZXJjZW50Q29tcGxldGUgPSAwO1xuICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcbiAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwKTtcbiAgICAgICAgICAgICAgJCgnI3BlcmNlbnQnICsgbkZpbGUpLnRleHQocGVyY2VudENvbXBsZXRlICsgJyUnKTtcbiAgICAgICAgICAgICAgJCgnI3Byb2dyZXNzLWJhcicgKyBuRmlsZSkud2lkdGgocGVyY2VudENvbXBsZXRlICsgJyUnKTtcbiAgICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgJCgnI3JlZnJlc2gnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAkKCcjbW9kYWwnKS5odG1sKGh0bWxDb250ZW50KS5jc3MoJ3dpZHRoOiAnICsgdyArICclO2hlaWdodDogJyArIGggKyAncHg7dGV4dC1hbGlnbjogY2VudGVyOycpO1xuICAgIC8vJCgnLm1vZGFsLWNvbnRlbnQnKS5jc3MoJ3dpZHRoOiAzNTBweDsnKTtcbiAgICAkKCcubW9kYWwtY29udGFpbmVyJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcbiAgICAkKCcuZmlsZS1pbnB1dCcpLnNob3coKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjYnRuQ2xvc2VVcGxvYWQnKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgJCgnI3VwbG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICB9KTtcbiAgICAkKCcjbW9kYWxDbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAkKCcjdXBsb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICAgICQoJyN1cGxvYWQtaW5wdXQnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZpbGVzID0gJCh0aGlzKS5nZXQoMCkuZmlsZXM7XG4gICAgICAoZmlsZXMubGVuZ3RoID4gMCkgPyAkKCcjc0ZpbGVzJykuaHRtbChmaWxlcy5sZW5ndGggKyAnIGFyY2hpdm9zIHNlbGVjY2lvbmFkb3MuJyk6ICQoJyNzRmlsZXMnKS5odG1sKGZpbGVzWzBdKTtcbiAgICAgIGNvbnNvbGUubG9nKGZpbGVzLmxlbmd0aCk7XG4gICAgICAkKCcuZmlsZS1pbnB1dCcpLmhpZGUoKTtcbiAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwICYmIGZpbGVzLmxlbmd0aCA8PSA1KSB7XG4gICAgICAgICQoJyNidG5DbG9zZVVwbG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1tpXTtcbiAgICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAvLyBhZGQgdGhlIGZpbGVzIHRvIGZvcm1EYXRhIG9iamVjdCBmb3IgdGhlIGRhdGEgcGF5bG9hZFxuXG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKCd1cGxvYWRzW10nLCBmaWxlLCBmaWxlLm5hbWUpO1xuICAgICAgICAgIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgaSwgZmlsZS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjYnRuQ2xvc2VVcGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgIGh0bWw6ICdObyBzZSBwdWVkZW4gZGVzY2FyZ2FyIG3DoXMgZGUgNSBhcmNoaXZvcyBhIGxhIHZleidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfTtcblxuICBjb25zdCBuZXdGb2xkZXIgPSAoZm9sZGVyTmFtZSkgPT4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgVG9rZW4pO1xuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIGZldGNoKCcvZmlsZXMvbmV3Zm9sZGVyJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIFwicGF0aFwiOiBjdXJyZW50UGF0aCxcbiAgICAgICAgICBcImZvbGRlck5hbWVcIjogZm9sZGVyTmFtZVxuICAgICAgICB9KSxcbiAgICAgICAgdGltZW91dDogMTAwMDBcbiAgICAgIH0pXG4gICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcbiAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09ICdPSycpIHtcbiAgICAgICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICBodG1sOiAnQ3JlYWRhIG51ZXZhIGNhcnBldGEgJyArIGRhdGEuZGF0YS5mb2xkZXJOYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2hvd0RpYWxvZ1llc05vID0gKHRpdGxlLCBjb250ZW50LCBjYikgPT4ge1xuICAgIGxldCB3ID0gMzI7XG4gICAgbGV0IGggPSA0NDA7XG4gICAgbGV0IGh0bWxDb250ZW50ID0gYDxkaXYgaWQ9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHt0aXRsZX08L2g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImxvZ291dE1vZGFsQ2xvc2VcIiBocmVmPVwiI2hvbGFcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtjb250ZW50fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0blllc1wiIGhyZWY9XCIjXCI+WWVzPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bk5PXCIgaHJlZj1cIiNcIj5OTzwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgJCgnI21vZGFsJykuaHRtbChodG1sQ29udGVudCkuY3NzKCd3aWR0aDogJyArIHcgKyAnJTtoZWlnaHQ6ICcgKyBoICsgJ3B4O3RleHQtYWxpZ246IGNlbnRlcjsnKTtcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjYnRuWWVzJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgICByZXR1cm4gY2IoJ1lFUycpO1xuICAgIH0pO1xuICAgICQoJyNidG5ObycpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgICAgcmV0dXJuIGNiKCdOTycpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUZpbGUgPSAocGF0aCkgPT4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgYUYgPSBhU2VsZWN0ZWRGaWxlcy5zbGljZSgpO1xuICAgIGNvbnNvbGUubG9nKGFGKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFRva2VuKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAkKCcjd2FpdGluZycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBmb3IgKHggPSAwOyB4IDwgYUYubGVuZ3RoOyB4KyspIHtcbiAgICAgIGNvbnNvbGUubG9nKCdEZWxldGluZyBmaWxlICcgKyBhRlt4XSArICcgLi4uJyk7XG4gICAgICBmZXRjaCgnL2ZpbGVzL2RlbGV0ZScsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIFwicGF0aFwiOiBwYXRoLFxuICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBhRlt4XVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRpbWVvdXQ6IDcyMDAwMFxuICAgICAgICB9KVxuICAgICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcbiAgICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ09LJykge1xuICAgICAgICAgICAgYVNlbGVjdGVkRmlsZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICQoJy50b2FzdCcpLnJlbW92ZUNsYXNzKCdzdWNjZXNzJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgIE0udG9hc3Qoe1xuICAgICAgICAgICAgICBodG1sOiAnQXJjaGl2byAnICsgZGF0YS5kYXRhLmZpbGVOYW1lICsgJyBib3JyYWRvJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgJCgnLnRvYXN0JykucmVtb3ZlQ2xhc3MoJ2VycicpLmFkZENsYXNzKCdlcnInKTtcbiAgICAgICAgICBNLnRvYXN0KHtcbiAgICAgICAgICAgIGh0bWw6IGVyclxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJCgnI3dhaXRpbmcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlRm9sZGVyID0gKHBhdGgpID0+IHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IGFGID0gYVNlbGVjdGVkRm9sZGVycy5zbGljZSgpO1xuICAgIGNvbnNvbGUubG9nKGFGKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFRva2VuKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAkKCcjd2FpdGluZycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBmb3IgKHggPSAwOyB4IDwgYUYubGVuZ3RoOyB4KyspIHtcbiAgICAgIGNvbnNvbGUubG9nKCdEZWxldGluZyBmb2xkZXIgJyArIGFGW3hdICsgJyAuLi4nKTtcbiAgICAgIGZldGNoKCcvZmlsZXMvZGVsZXRlJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgXCJwYXRoXCI6IHBhdGgsXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IGFGW3hdXG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGltZW91dDogNzIwMDAwXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKEZldGNoSGFuZGxlRXJyb3JzKVxuICAgICAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAnT0snKSB7XG4gICAgICAgICAgICAkKCcudG9hc3QnKS5yZW1vdmVDbGFzcygnc3VjY2VzcycpLmFkZENsYXNzKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICBNLnRvYXN0KHtcbiAgICAgICAgICAgICAgaHRtbDogJ0NhcnBldGEgJyArIGRhdGEuZGF0YS5maWxlTmFtZSArICcgYm9ycmFkYSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5zaGlmdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJCgnI3dhaXRpbmcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH07XG5cblxuXG4gIC8vVE9ETzogT3B0aW1pemFyIHJlbmRlcml6YWRvIGRlIGVsZW1lbnRvcyBsaSBcbiAgLy9pbmNvcnBvcmFuZG8gZWwgY29udGVuaWRvIGVuIGVsIGJ1Y2xlIF9sb29wXG4gIGNvbnN0IGRvd25sb2FkID0gKGZpbGVMaXN0LCB0ZXh0KSA9PiB7XG4gICAgbGV0IHJlcUxpc3QgPSBbXSxcbiAgICAgIGhhbmRsZXJDb3VudCA9IDAsXG4gICAgICByZXNwb25zZVRpbWVvdXQgPSBbXTtcbiAgICBsZXQgdyA9IDMyO1xuICAgIGxldCBoID0gNDQwO1xuICAgIGxldCBNb2RhbFRpdGxlID0gXCJEZXNjYXJnYSBkZSBhcmNoaXZvcyBzZWxlY2Npb25hZG9zXCI7XG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGA8dWwgY2xhc3M9XCJwcmVsb2FkZXItZmlsZVwiIGlkPVwiRG93bmxvYWRmaWxlTGlzdFwiPlxuICAgICAgICAgICAgPGxpIGlkPVwibGkwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50MFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQwXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBpZD1cImxpMVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUxXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXIxXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDFcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0MVwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkgaWQ9XCJsaTJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktZmlsZW5hbWVcIiBpZD1cImxpLWZpbGVuYW1lMlwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMlwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBlcmNlbnRcIiBpZD1cInBlcmNlbnQyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJhYm9ydDJcIiBocmVmPVwiI1wiPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPGxpIGlkPVwibGkzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpLWZpbGVuYW1lXCIgaWQ9XCJsaS1maWxlbmFtZTNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiBpZD1cInByb2dyZXNzLWJhcjNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwZXJjZW50XCIgaWQ9XCJwZXJjZW50M1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQzXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBpZD1cImxpNFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWU0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXI0XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImFib3J0NFwiIGhyZWY9XCIjXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+YDtcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7TW9kYWxDb250ZW50fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2FuY2VsQWxsXCIgaHJlZj1cIiMhXCI+Q2FuY2VsYXIgZGVzY2FyZ2FzPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2xvc2VEb3dubG9hZFwiIGhyZWY9XCIjIVwiPkNlcnJhcjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgIGA7XG4gICAgJCgnI21vZGFsJykuaHRtbChodG1sQ29udGVudCkuY3NzKCd3aWR0aDogJyArIHcgKyAnJTtoZWlnaHQ6ICcgKyBoICsgJ3B4O3RleHQtYWxpZ246IGNlbnRlcjsnKTtcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjZG93bmxvYWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAkKCcjYnRuQ2xvc2VEb3dubG9hZCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAkKCcjZG93bmxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICBhU2VsZWN0ZWRGaWxlcyA9IFtdO1xuICAgIH0pO1xuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICQoJyNkb3dubG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgICQoJyNyZWZyZXNoJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgIGFTZWxlY3RlZEZpbGVzID0gW107XG4gICAgfSk7XG4gICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnI2J0bkNhbmNlbEFsbCcpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDQ7IHgrKykge1xuICAgICAgICByZXFMaXN0W3hdLmFib3J0KCk7XG4gICAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGVyY2VudCcgKyB4KTtcbiAgICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyB4KTtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ0NhbmNlbGVkIGJ5IHVzZXInO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgfVxuICAgICAgJCgnI2J0bkNhbmNlbEFsbCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH0pO1xuICAgICQoJy5tb2RhbF9jbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgbiA9IHBhcnNlSW50KGUudGFyZ2V0LmlkLnNsaWNlKC0xKSk7XG4gICAgICByZXFMaXN0W25dLmFib3J0KCk7XG4gICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BlcmNlbnQnICsgbik7XG4gICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvZ3Jlc3MtYmFyJyArIG4pO1xuICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ0NhbmNlbGVkIGJ5IHVzZXInO1xuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcnO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICB9KTtcbiAgICBsZXQgX2xvb3AgPSAoaSkgPT4ge1xuICAgICAgbGV0IGZOYW1lID0gZmlsZUxpc3RbaV07XG4gICAgICBsZXQgbGlOdW1iZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGknICsgaSk7XG4gICAgICBsZXQgbGlGaWxlbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsaS1maWxlbmFtZScgKyBpKTtcbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcy1iYXInICsgaSk7XG4gICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BlcmNlbnQnICsgaSk7XG4gICAgICByZXNwb25zZVRpbWVvdXRbaV0gPSBmYWxzZTtcbiAgICAgIGZOYW1lID0gZk5hbWUuc3BsaXQoJ1xcXFwnKS5wb3AoKS5zcGxpdCgnLycpLnBvcCgpO1xuICAgICAgcmVxTGlzdFtpXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmVxTGlzdFtpXS5vcGVuKCdQT1NUJywgJy9maWxlcy9kb3dubG9hZCcsIHRydWUpO1xuICAgICAgcmVxTGlzdFtpXS5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgbGlOdW1iZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBsaUZpbGVuYW1lLmlubmVySFRNTCA9IGZOYW1lO1xuICAgICAgcmVxTGlzdFtpXS50aW1lb3V0ID0gMzYwMDA7XG4gICAgICByZXFMaXN0W2ldLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJyoqIFRpbWVvdXQgZXJyb3IgLT5GaWxlOicgKyBmTmFtZSArICcgJyArIHJlcUxpc3RbaV0uc3RhdHVzICsgJyAnICsgcmVxTGlzdFtpXS5zdGF0dXNUZXh0KTtcbiAgICAgICAgLy8gaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMVxuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSAnVGltZW91dCBFcnJvcic7XG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoJ2JsaW5rJyk7XG4gICAgICAgIHJlc3BvbnNlVGltZW91dFtpXSA9IHRydWU7XG4gICAgICB9O1xuICAgICAgcmVxTGlzdFtpXS5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQoZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCAqIDEwMCk7XG4gICAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBwZXJjZW50Q29tcGxldGUgKyAnJSc7XG4gICAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9IHBlcmNlbnRDb21wbGV0ZSArICclJztcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcUxpc3RbaV0ub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJyoqIEFuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgdHJhbnNhY3Rpb24gLT5GaWxlOicgKyBmTmFtZSArICcgJyArIHJlcS5zdGF0dXMgKyAnICcgKyByZXEuc3RhdHVzVGV4dCk7XG4gICAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCAtIDE7XG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnRXJyb3InO1xuICAgICAgICBwZXJjZW50TGFiZWwuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgICAgJCgnI2Fib3J0JyArIGkpLmhpZGUoKTtcbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMTtcbiAgICAgICAgaWYgKCFyZXNwb25zZVRpbWVvdXRbaV0pIHtcbiAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJzEwMCUnO1xuICAgICAgICAgICQoJyNhYm9ydCcgKyBpKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZXJDb3VudCA9PT0gMCkge1xuICAgICAgICAgICQoXCIjZG93bmxvYWQtZW5kXCIpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcUxpc3RbaV0ub25sb2Fkc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCArIDE7XG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzAnO1xuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJzAlJztcbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHJlcUxpc3RbaV0ucmVhZHlTdGF0ZSA9PT0gNCAmJiByZXFMaXN0W2ldLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gJyc7XG4gICAgICAgICAgdmFyIGRpc3Bvc2l0aW9uID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicpO1xuICAgICAgICAgIGlmIChkaXNwb3NpdGlvbiAmJiBkaXNwb3NpdGlvbi5pbmRleE9mKCdhdHRhY2htZW50JykgIT09IC0xKSB7XG4gICAgICAgICAgICB2YXIgZmlsZW5hbWVSZWdleCA9IC9maWxlbmFtZVteOz1cXG5dKj0oKFsnXCJdKS4qP1xcMnxbXjtcXG5dKikvO1xuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBmaWxlbmFtZVJlZ2V4LmV4ZWMoZGlzcG9zaXRpb24pO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgIT0gbnVsbCAmJiBtYXRjaGVzWzFdKSBmaWxlbmFtZSA9IG1hdGNoZXNbMV0ucmVwbGFjZSgvWydcIl0vZywgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdHlwZSA9IHJlcUxpc3RbaV0uZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3RoaXMucmVzcG9uc2VdLCB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvLyBJRSB3b3JrYXJvdW5kIGZvciBcIkhUTUw3MDA3OiBPbmUgb3IgbW9yZSBibG9iIFVSTHMgd2VyZSByZXZva2VkIGJ5IGNsb3NpbmcgdGhlIGJsb2IgZm9yIHdoaWNoIHRoZXkgd2VyZSBjcmVhdGVkLiBUaGVzZSBVUkxzIHdpbGwgbm8gbG9uZ2VyIHJlc29sdmUgYXMgdGhlIGRhdGEgYmFja2luZyB0aGUgVVJMIGhhcyBiZWVuIGZyZWVkLlwiXG4gICAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYmxvYiwgZmlsZW5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuICAgICAgICAgICAgdmFyIGRvd25sb2FkVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuICAgICAgICAgICAgaWYgKGZpbGVuYW1lKSB7XG4gICAgICAgICAgICAgIC8vIHVzZSBIVE1MNSBhW2Rvd25sb2FkXSBhdHRyaWJ1dGUgdG8gc3BlY2lmeSBmaWxlbmFtZVxuICAgICAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgICAgLy8gc2FmYXJpIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHlldFxuICAgICAgICAgICAgICBpZiAodHlwZW9mIGEuZG93bmxvYWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAgICAgcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgICAgICAgICAgYS5jbGljaygpO1xuICAgICAgICAgICAgICAgIC8vIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuID0gZG93bmxvYWRVcmw7XG4gICAgICAgICAgICAgIC8vIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGRvd25sb2FkVXJsKTtcbiAgICAgICAgICAgIH0sIDEwMCk7IC8vIGNsZWFudXBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXFMaXN0W2ldLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRQYXRoICsgJy8nICsgZmlsZUxpc3RbaV0pO1xuICAgICAgcmVxTGlzdFtpXS5zZW5kKHNlcmlhbGl6ZU9iamVjdCh7XG4gICAgICAgICdmaWxlbmFtZSc6IGN1cnJlbnRQYXRoICsgJy8nICsgZmlsZUxpc3RbaV1cbiAgICAgIH0pKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIF9sb29wKGkpO1xuICAgIH1cbiAgICAkKCcjd2FpdGluZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfTtcblxuICBjb25zdCByZWZyZXNoUGF0aCA9IChjUGF0aCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdpbml0IHBhdGg6ICcsIGNQYXRoKTtcbiAgICBsZXQgbmV3SHRtbENvbnRlbnQgPSBgPGxpPjxsYWJlbCBpZD1cImN1cnJlbnRwYXRoXCI+UGF0aDo8L2xhYmVsPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PHNwYW5kPiZuYnNwOzwvc3BhbmQ+PGEgY2xhc3M9XCJicmVhZGNydW1iXCIgaHJlZj1cIiMhXCI+LzwvYT48L2xpPmA7XG4gICAgY29uc29sZS5sb2coJ2NQYXRoIGxlbmdodDonLCBjUGF0aC5sZW5ndGgpO1xuICAgIGlmIChjUGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAkKCcjd2FpdGluZycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIGxldCBjUGF0aEFycmF5ID0gY1BhdGguc3BsaXQoJy8nKTtcbiAgICAgIGNvbnNvbGUubG9nKCdyZWZyZXNoUGF0aDpjUGF0aEFycmF5ICcsIGNQYXRoQXJyYXkpO1xuICAgICAgY1BhdGhBcnJheS5mb3JFYWNoKCh2YWwsIGlkeCwgYXJyYXkpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcbiAgICAgICAgaWYgKHZhbC50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICBpZiAoaWR4ID09IDApIHtcbiAgICAgICAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8bGk+PGEgY2xhc3M9XCJicmVhZGNydW1iXCIgaHJlZj1cIiMhXCI+JHt2YWx9PC9hPjwvbGk+YDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGlkeCA9PSAxKSB7XG4gICAgICAgICAgICBuZXdIdG1sQ29udGVudCArPSBgPGxpPjxzcGFuZD4mbmJzcDs8L3NwYW5kPjxhIGNsYXNzPVwiYnJlYWRjcnVtYlwiIGhyZWY9XCIjIVwiPiR7dmFsfTwvYT48L2xpPmA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8bGk+PHNwYW5kPi8mbmJzcDs8L3NwYW5kPjxhIGNsYXNzPVwiYnJlYWRjcnVtYlwiIGhyZWY9XCIjIVwiPiR7dmFsfTwvYT48L2xpPmA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgICQoJyNjdXJyZW50UGF0aCcpLmh0bWwobmV3SHRtbENvbnRlbnQpO1xuXG4gICAgJCgnLmJyZWFkY3J1bWInKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY2hhbmdlUGF0aChlLnRhcmdldC5pbm5lclRleHQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBUb2tlbik7XG4gICAgbGV0IHJlYWxwYXRoID0gJyc7XG4gICAgaWYgKHJlYWxSb290UGF0aCAhPT0gJy8nKSB7XG4gICAgICByZWFscGF0aCA9ICcvJyArIHJlYWxSb290UGF0aCArIGNQYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY1BhdGggPT0gJy8nKSB7XG4gICAgICAgIHJlYWxwYXRoID0gY1BhdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWFscGF0aCA9IHJlYWxSb290UGF0aCArIGNQYXRoO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdyZWFsUm9vdFBhdGg6ICcgKyByZWFsUm9vdFBhdGggKyAnIHJlYWxwYXRoOicgKyByZWFscGF0aCk7XG4gICAgZmV0Y2goJy9maWxlcz9wYXRoPScgKyBlbmNvZGVVUkkocmVhbHBhdGgpLCB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIHRpbWVvdXQ6IDcyMDAwMFxuICAgICAgfSlcbiAgICAgIC50aGVuKEZldGNoSGFuZGxlRXJyb3JzKVxuICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICByZWZyZXNoRmlsZXNUYWJsZShkYXRhKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2VsZWN0QWxsID0gKGUpID0+IHtcbiAgICB2YXIgYWxsQ2tlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2snKTtcbiAgICBsZXQgdiA9IGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvcihcIiNzZWxlY3RBbGxGaWxlc1wiKVxuICAgICAgLmNoZWNrZWQ7XG4gICAgY29uc29sZS5sb2codik7XG4gICAgYWxsQ2tlY2tib3guZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgICAgaWYgKCFhbGxDa2Vja2JveFtpXS5kaXNhYmxlZCkge1xuICAgICAgICBpZiAodiA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuXG4gICAgICAgICAgLy9hbGxDa2Vja2JveFtpXS5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnY2hlY2tlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgIC8vYWxsQ2tlY2tib3hbaV0udHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAvL2FsbENrZWNrYm94W2ldLnJlbW92ZUF0dHJpYnV0ZSgnY2hlY2tlZCcpO1xuICAgICAgICB9XG4gICAgICAgICQoJyMnICsgZWxlbWVudC5pZCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhnZXRDaGVja2VkRmlsZXMoKSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0Q2hlY2tlZEZpbGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGVja2VkRmlsZXMgPSBbXTtcbiAgICB2YXIgYWxsRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHlwZUZpbGUnKTtcbiAgICBhbGxFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICAvLyBjKGVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uY2hlY2tlZClcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmNoZWNrZWQpIHtcbiAgICAgICAgY2hlY2tlZEZpbGVzLnB1c2goY3VycmVudFBhdGggKyAnLycgKyBlbGVtZW50LmNoaWxkcmVuWzFdLmlubmVySFRNTCk7XG4gICAgICAgIC8vIGMoZWxlbWVudC5jaGlsZHJlblsxXS5pbm5lckhUTUwpXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNoZWNrZWRGaWxlcztcbiAgfTtcblxuICBjb25zdCBnZXRDaGVja2VkRm9sZGVyID0gZnVuY3Rpb24gZ2V0Q2hlY2tlZEZvbGRlcigpIHtcbiAgICB2YXIgY2hlY2tlZEZvbGRlcnMgPSBbXTtcbiAgICB2YXIgYWxsRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGFzaGJvYXJkLXBhdGgnKTtcbiAgICBhbGxFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICB2XG4gICAgICAgIC5jaGlsZHJlblswXVxuICAgICAgICAuY2hpbGROb2Rlc1xuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAobCwgaWR4KSB7XG4gICAgICAgICAgaWYgKGwuY2hpbGRyZW5bMF0uY2hlY2tlZCkge1xuICAgICAgICAgICAgY2hlY2tlZEZvbGRlcnMucHVzaChjdXJyZW50UGF0aCArICcvJyArIGwuY2hpbGRyZW5bMl0udGV4dCk7XG4gICAgICAgICAgICAvLyBjKGN1cnJlbnRQYXRoICsgbC5jaGlsZHJlblsyXS50ZXh0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNoZWNrZWRGb2xkZXJzO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckZpbGVzVGFibGUgPSAoYUZvbCwgYUZpbCkgPT4ge1xuICAgIGxldCBuZXdIdG1sQ29udGVudCA9IGBgO1xuICAgIGNvbnN0IHRib2R5Q29udGVudCA9IGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJ0YmwtZmlsZXNcIilcbiAgICAgIC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXTtcblxuICAgIG5ld0h0bWxDb250ZW50ICs9IGA8dHI+PHRkPjxzcGFuPiZuYnNwOzwvc3Bhbj48L3RkPlxuICAgICAgICAgICAgICA8dGQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyXCI+PC9pPjxhIGhyZWY9XCIjXCIgaWQ9XCJnb0JhY2tGb2xkZXJcIiBjbGFzcz1cImZpbGUtTmFtZSB0eXBlRm9sZGVyXCI+Li48L2E+PC90ZD5cbiAgICAgICAgICAgICAgPHRkPiZuYnNwOzwvdGQ+PHRkPiZuYnNwOzwvdGQ+PHRkPiZuYnNwOzwvdGQ+PC90cj5gO1xuICAgIGFGb2wuZm9yRWFjaCgodmFsLCBpZHgsIGFycmF5KSA9PiB7XG4gICAgICBuZXdIdG1sQ29udGVudCArPSBgPHRyPjx0ZD48aW5wdXQgY2xhc3M9XCJmaWxsZWQtaW4gY2hlY2tGb2xkZXIgY2hlY2tcIiBpZD1cIiR7dmFsLm5hbWV9XCIgdHlwZT1cImNoZWNrYm94XCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94IGxlZnRcIiBmb3I9XCIke3ZhbC5uYW1lfVwiPjwvbGFiZWw+PC90ZD5gO1xuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0ZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXJcIj48L2k+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImZpbGUtTmFtZSB0eXBlRm9sZGVyXCI+JHt2YWwubmFtZX08L2E+PC90ZD5gO1xuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0ZD4mbmJzcDs8L3RkPjx0ZD4mbmJzcDs8L3RkPjx0ZD4ke3ZhbC5kYXRlfTwvdGQ+PC90cj5gO1xuICAgIH0pO1xuXG4gICAgYUZpbC5mb3JFYWNoKCh2YWwsIGlkeCwgYXJyYXkpID0+IHtcbiAgICAgIGxldCBmaWxlU2l6ZSA9IHBhcnNlSW50KHZhbC5zaXplIC8gMTAyNCk7XG4gICAgICBuZXdIdG1sQ29udGVudCArPSBgPHRyPjx0ZD48aW5wdXQgY2xhc3M9XCJmaWxsZWQtaW4gY2hlY2tGaWxlIGNoZWNrXCIgaWQ9XCIke3ZhbC5uYW1lfVwiIHR5cGU9XCJjaGVja2JveFwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3ggbGVmdFwiIGZvcj1cIiR7dmFsLm5hbWV9XCI+PC9sYWJlbD48L3RkPmA7XG4gICAgICBuZXdIdG1sQ29udGVudCArPSBgPHRkPjxpIGNsYXNzPVwiZmFyIGZhLWZpbGVcIj48L2k+PHNwYW4gY2xhc3M9XCJ0eXBlRmlsZVwiPiR7dmFsLm5hbWV9PC9zcGFuPjwvdGQ+YDtcbiAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8dGQ+JHtmaWxlU2l6ZX0gS0I8L3RkPjx0ZD4mbmJzcDs8L3RkPjx0ZD4ke3ZhbC5kYXRlfTwvdGQ+PC90cj5gO1xuICAgIH0pO1xuICAgIHRib2R5Q29udGVudC5pbm5lckhUTUwgPSBuZXdIdG1sQ29udGVudDtcbiAgfTtcblxuXG4gIGNvbnN0IGdvQmFja0ZvbGRlciA9IChmb2xkZXIpID0+IHtcbiAgICBsZXQgbmV3UGF0aCA9ICcnO1xuICAgIGNvbnNvbGUubG9nKCdnb0JhY2tGb2xkZXI6Zm9sZGVyICcsIGZvbGRlcik7XG4gICAgY29uc29sZS5sb2coJ2dvQmFja0ZvbGRlcjpjdXJyZW50UGF0aCAnLCBjdXJyZW50UGF0aCk7XG4gICAgaWYgKGN1cnJlbnRQYXRoICE9PSAnLycgJiYgZm9sZGVyID09ICcuLicpIHtcbiAgICAgIGxldCBsYXN0Rm9sZGVyID0gY3VycmVudFBhdGgubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgIGlmIChsYXN0Rm9sZGVyID09IDApIHtcbiAgICAgICAgbmV3UGF0aCA9ICcvJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1BhdGggPSBjdXJyZW50UGF0aC5zdWJzdHIoMCwgbGFzdEZvbGRlcik7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygnZ29CYWNrRm9sZGVyOmxhc3RGb2xkZXItPiAnICsgbGFzdEZvbGRlciArICcgZ29CYWNrRm9sZGVyOm5ld1BhdGgtPicgKyBuZXdQYXRoKTtcbiAgICAgIGNoYW5nZVBhdGgobmV3UGF0aC50cmltKCkpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcmVmcmVzaEZpbGVzVGFibGUgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IHRib2R5Q29udGVudCA9IGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJ0YmwtZmlsZXNcIilcbiAgICAgIC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXTtcblxuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGFGb2xkZXJzID0gW107XG4gICAgYUZpbGVzID0gW107XG4gICAgaWYgKGRhdGEubWVzc2FnZSkgcmV0dXJuIG51bGw7XG4gICAgZGF0YS5mb3JFYWNoKCh2YWwsIGlkeCwgYXJyYXkpID0+IHtcbiAgICAgIGxldCBmaWxlU2l6ZSA9IHBhcnNlSW50KHZhbC5zaXplIC8gMTAyNCk7XG4gICAgICBpZiAodmFsLmlzRm9sZGVyKSB7XG4gICAgICAgIGFGb2xkZXJzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IHZhbC5uYW1lLFxuICAgICAgICAgIGRhdGU6IHZhbC5kYXRlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYUZpbGVzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IHZhbC5uYW1lLFxuICAgICAgICAgIHNpemU6IHZhbC5zaXplLFxuICAgICAgICAgIGRhdGU6IHZhbC5kYXRlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGFGb2xkZXJzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xuICAgIH0pO1xuICAgIGFGaWxlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5kYXRlLmxvY2FsZUNvbXBhcmUoYi5kYXRlKTtcbiAgICB9KTtcblxuICAgIHJlbmRlckZpbGVzVGFibGUoYUZvbGRlcnMsIGFGaWxlcyk7XG5cbiAgICAkKCcuZmlsZS1OYW1lJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgY29uc29sZS5sb2coJ0N1cnJlbnQgUGF0aDogJywgY3VycmVudFBhdGgpO1xuICAgICAgbGV0IG5ld1BhdGggPSAnJztcbiAgICAgIGlmIChlLnRhcmdldC5pbm5lclRleHQgIT0gJy4uJykge1xuICAgICAgICBpZiAoY3VycmVudFBhdGgudHJpbSgpID09ICcvJykge1xuICAgICAgICAgIG5ld1BhdGggPSBjdXJyZW50UGF0aC50cmltKCkgKyBlLnRhcmdldC5pbm5lclRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UGF0aCA9IGN1cnJlbnRQYXRoLnRyaW0oKSArICcvJyArIGUudGFyZ2V0LmlubmVyVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdOZXcgUGF0aDogJywgbmV3UGF0aC50cmltKCkpO1xuICAgICAgICByZWZyZXNoUGF0aChuZXdQYXRoLnRyaW0oKSk7XG4gICAgICAgIGN1cnJlbnRQYXRoID0gbmV3UGF0aC50cmltKCk7XG4gICAgICAgIHJlZnJlc2hCYXJNZW51KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY3VycmVudFBhdGggIT09IFJvb3RQYXRoKSBnb0JhY2tGb2xkZXIoZS50YXJnZXQuaW5uZXJUZXh0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcuY2hlY2snKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgc2VsZWN0RGVzZWxlY3QoZSk7XG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5jaGVja2VkKTtcbiAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmluZGV4T2YoXCJjaGVja0ZpbGVcIikpO1xuICAgICAgY29uc29sZS5sb2coZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJvd0luZGV4KTtcbiAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGRyZW5bMV0uaHRtbEZvcik7XG4gICAgfSk7XG4gICAgJCgnI2dvQmFja0ZvbGRlcicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBnb0JhY2tGb2xkZXIoKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzZWxlY3REZXNlbGVjdCA9IChlKSA9PiB7XG4gICAgY29uc3QgaXNDaGVja2VkID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmluZGV4T2YoXCJjaGVja0ZpbGVcIik7XG4gICAgY29uc3QgbmFtZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGRyZW5bMV0uaHRtbEZvcjtcblxuICAgIGlmIChjb250ZW50VHlwZSAhPSAtMSkge1xuICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICBhU2VsZWN0ZWRGaWxlcy5wdXNoKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYVNlbGVjdGVkRmlsZXMuaW5kZXhPZihuYW1lKTtcbiAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgYVNlbGVjdGVkRmlsZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICBhU2VsZWN0ZWRGb2xkZXJzLnB1c2gobmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpZHggPSBhU2VsZWN0ZWRGb2xkZXJzLmluZGV4T2YobmFtZSk7XG4gICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgIGFTZWxlY3RlZEZvbGRlcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhhU2VsZWN0ZWRGaWxlcywgYVNlbGVjdGVkRm9sZGVycyk7XG4gIH07XG5cbiAgY29uc3Qgc2hvd1VzZXJQcm9maWxlID0gKHcsIGgsIHQpID0+IHtcbiAgICBsZXQgTW9kYWxUaXRsZSA9IHQ7XG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGA8dGFibGUgaWQ9XCJ0YWJsZVVzZXJQcm9maWxlXCIgY2xhc3M9XCJzdHJpcGVkIGhpZ2hsaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPlVzZXIgTmFtZTo8L3RkPjx0ZD4ke1VzZXJOYW1lfTwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5Vc2VyIFJvbGU6PC90ZD48dGQ+JHtVc2VyUm9sZX08L3RkPjwvdHI+IFxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkNvbXBhbnkgTmFtZTo8L3RkPjx0ZD4ke0NvbXBhbnlOYW1lfTwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZCBjb2xzcGFuPVwiMlwiIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXI7Ym9yZGVyLWJvdG9tOjFweCBzb2xpZCAjQ0NDXCI+Jm5ic3A7PC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IG5ldyBGb2xkZXI6PC90ZD48dGQ+YDtcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93TmV3Rm9sZGVyID09ICcxJykgP1xuICAgICAgJ0FsbG93JyA6XG4gICAgICAnRGVueSc7XG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgcmVuYW1lIEZvbGRlcjo8L3RkPjx0ZD5gO1xuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dSZW5hbWVGb2xkZXIgPT0gJzEnKSA/XG4gICAgICAnQWxsb3cnIDpcbiAgICAgICdEZW55JztcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5BbGxvdyByZW5hbWUgRmlsZTo8L3RkPjx0ZD5gO1xuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dSZW5hbWVGaWxlID09ICcxJykgP1xuICAgICAgJ0FsbG93JyA6XG4gICAgICAnRGVueSc7XG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgZGVsZXRlIEZvbGRlcjo8L3RkPjx0ZD5gO1xuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dEZWxldGVGb2xkZXIgPT0gJzEnKSA/XG4gICAgICAnQWxsb3cnIDpcbiAgICAgICdEZW55JztcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5BbGxvdyBkZWxldGUgRmlsZTo8L3RkPjx0ZD5gO1xuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dEZWxldGVGaWxlID09ICcxJykgP1xuICAgICAgJ0FsbG93JyA6XG4gICAgICAnRGVueSc7XG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgVXBsb2FkOjwvdGQ+PHRkPmA7XG4gICAgTW9kYWxDb250ZW50ICs9IChBbGxvd1VwbG9hZCA9PSAnMScpID9cbiAgICAgICdBbGxvdycgOlxuICAgICAgJ0RlbnknO1xuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IERvd25sb2FkOjwvdGQ+PHRkPmA7XG4gICAgTW9kYWxDb250ZW50ICs9IChBbGxvd0Rvd25sb2FkID09ICcxJykgP1xuICAgICAgJ0FsbG93JyA6XG4gICAgICAnRGVueSc7XG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNob2xhXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD4ke01vZGFsQ29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJNb2RhbENsb3NlXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgIGA7XG4gICAgJCgnI21vZGFsJylcbiAgICAgIC5odG1sKGh0bWxDb250ZW50KVxuICAgICAgLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDsnKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjTW9kYWxDbG9zZScpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJCgnI21vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBzaG93TmV3Rm9sZGVyID0gKHcsIGgsIHQpID0+IHtcbiAgICBsZXQgTW9kYWxUaXRsZSA9IHQ7XG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJuZXdGb2xkZXJOYW1lXCIgdHlwZT1cInRleHRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJuZXdGb2xkZXJOYW1lXCI+TmV3IEZvbGRlciBOYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7TW9kYWxDb250ZW50fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cIk1vZGFsQ2xvc2VcIiBocmVmPVwiIyFcIj5DbG9zZTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiQWNjZXB0TmV3Rm9sZGVyXCIgaHJlZj1cIiMhXCI+QWNjZXB0PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICBgO1xuICAgICQoJyNtb2RhbCcpXG4gICAgICAuaHRtbChodG1sQ29udGVudClcbiAgICAgIC5jc3MoJ3dpZHRoOiAnICsgdyArICclO2hlaWdodDogJyArIGggKyAncHg7dGV4dC1hbGlnbjogY2VudGVyOycpO1xuICAgIC8vJCgnLm1vZGFsLWNvbnRlbnQnKS5jc3MoJ3dpZHRoOiAzNTBweDsnKTtcbiAgICAkKCcubW9kYWwnKS5jc3MoJ3dpZHRoOiA0MCUgIWltcG9ydGFudCcpO1xuICAgICQoJyNtb2RhbCcpLnNob3coKTtcbiAgICAkKCcjbGVhbi1vdmVybGF5Jykuc2hvdygpO1xuICAgICQoJyNBY2NlcHROZXdGb2xkZXInKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbGV0IG5ld0ZvbGRlck5hbWUgPSAkKCcjbmV3Rm9sZGVyTmFtZScpLnZhbCgpO1xuICAgICAgY29uc29sZS5sb2cobmV3Rm9sZGVyTmFtZSk7XG4gICAgICBuZXdGb2xkZXIobmV3Rm9sZGVyTmFtZSk7XG4gICAgfSk7XG4gICAgJCgnI21vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICAgICQoJyNNb2RhbENsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzaG93Q2hhbmdlVXNlclBhc3N3b3JkID0gKHcsIGgsIHQpID0+IHtcbiAgICBsZXQgTW9kYWxUaXRsZSA9IHQ7XG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJuZXdwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5ld3Bhc3N3b3JkXCI+TmV3IFBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibmV3cGFzc3dvcmQyXCIgdHlwZT1cInBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibmV3cGFzc3dvcmQyXCI+UmVwZWF0IFBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNob2xhXCI+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD4ke01vZGFsQ29udGVudH08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJNb2RhbENsb3NlXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cIkFjY2VwdENoYW5nZVVzZXJQYXNzd29yZFwiIGhyZWY9XCIjIVwiPkFjY2VwdDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgYDtcbiAgICAkKCcjbW9kYWwnKVxuICAgICAgLmh0bWwoaHRtbENvbnRlbnQpXG4gICAgICAuY3NzKCd3aWR0aDogJyArIHcgKyAnJTtoZWlnaHQ6ICcgKyBoICsgJ3B4O3RleHQtYWxpZ246IGNlbnRlcjsnKTtcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcbiAgICAkKCcjQWNjZXB0Q2hhbmdlVXNlclBhc3N3b3JkJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCB1c2VybmFtZSA9IFVzZXJOYW1lO1xuICAgICAgbGV0IG5ld3Bhc3N3b3JkID0gJCgnI25ld3Bhc3N3b3JkJykudmFsKCk7XG4gICAgICBjb25zb2xlLmxvZyh1c2VybmFtZSwgbmV3cGFzc3dvcmQpO1xuICAgICAgYWpheCh7XG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnL2NoYW5nZXBhc3N3ZCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgbmV3cGFzc3dvcmQ6IEJhc2U2NC5lbmNvZGUobWQ1KG5ld3Bhc3N3b3JkKSlcbiAgICAgICAgfSxcbiAgICAgICAgYWpheHRpbWVvdXQ6IDQwMDAwLFxuICAgICAgICBiZWZvcmVTZW5kOiAoKSA9PiB7XG4gICAgICAgICAgLyogd2FpdGluZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWl0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2xhc3NMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkKCdhY3RpdmUnKSAqL1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5wYXJzZShkYXRhKSlcbiAgICAgICAgICBsZXQge1xuICAgICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgIH0gPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGF0dXMnLCBzdGF0dXMpO1xuICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdGQUlMJykge1xuICAgICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICAgIGh0bWw6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZFxuICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignI21lc3NhZ2UnKVxuICAgICAgICAgICAgICAuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICAgIGh0bWw6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGU6ICh4aHIsIHN0YXR1cykgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHhociwgc3RhdHVzKTtcbiAgICAgICAgICAvL3dhaXRpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKHhociwgZXJyKSA9PiB7XG4gICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICBodG1sOiAnV3JvbmcgcGFzc3dvcmQnXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGVyciA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVGltZW91dCBFcnJvcicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIsIGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcjbW9kYWxDbG9zZScpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJCgnI01vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCByZWZyZXNoQmFyTWVudSA9ICgpID0+IHtcbiAgICBpZiAoQWxsb3dOZXdGb2xkZXIgPT09ICcxJykge1xuICAgICAgJCgnI05ld0ZvbGRlcicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjTmV3Rm9sZGVyJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICAgIGlmIChBbGxvd0RlbGV0ZUZvbGRlciA9PT0gJzEnICYmIEFsbG93RGVsZXRlRmlsZSA9PT0gJzEnKSB7XG4gICAgICAkKCcjZGVsZXRlJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNkZWxldGUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICQoJyNkZWxldGUnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgaWYgKEFsbG93UmVuYW1lRm9sZGVyID09PSAnMScgJiYgQWxsb3dSZW5hbWVGaWxlID09PSAnMScpIHtcbiAgICAgICQoJyNyZW5hbWUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3JlbmFtZScpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgJCgnI3JlbmFtZScpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH1cbiAgICBpZiAoQWxsb3dVcGxvYWQgPT0gJzEnKSB7XG4gICAgICAkKCcjdXBsb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoQWxsb3dEb3dubG9hZCA9PSAnMScpIHtcbiAgICAgICQoJyNkb3dubG9hZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjZG93bmxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICB9XG4gICAgaWYgKFVzZXJSb2xlID09ICdhZG1pbicpIHtcbiAgICAgICQoJyNzZXR0aW5ncycpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3NldHRpbmdzJykuaGlkZSgpO1xuICAgIH1cbiAgICAkKCcjbW9kYWx0cmlnZ2VyJykuaHRtbChVc2VyTmFtZSk7XG4gICAgJCgnI21vZGFsdHJpZ2dlcicpLmxlYW5Nb2RhbCh7XG4gICAgICB0b3A6IDExMCxcbiAgICAgIG92ZXJsYXk6IDAuNDUsXG4gICAgICBjbG9zZUJ1dHRvbjogXCIuaGlkZW1vZGFsXCJcbiAgICB9KTtcbiAgfTtcblxuICAkKCcjc2VsZWN0QWxsRmlsZXMnKS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZWxlY3RBbGxGaWxlc1wiKS5jaGVja2VkID09PSBmYWxzZSkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZWxlY3RBbGxGaWxlc1wiKS5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnY2hlY2tlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLnJlbW92ZUF0dHJpYnV0ZSgnY2hlY2tlZCcpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQpO1xuICAgIHNlbGVjdEFsbChlLnRhcmdldC5odG1sRm9yKTtcbiAgfSk7XG5cbiAgJCgnYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5pZCk7XG4gICAgY29uc29sZS5sb2coJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSk7XG5cbiAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5pZCkge1xuICAgICAgICBjYXNlICdzZXR0aW5ncyc6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VzZXJ0cmlnZ2VyJzpcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCQoJyNVc2Vyc2Ryb3Bkb3duJykuY3NzKCdkaXNwbGF5JykpO1xuICAgICAgICAgIGlmICgkKCcjVXNlcnNkcm9wZG93bicpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAkKCcjdXNlcnRyaWdnZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICQoJyNVc2Vyc2Ryb3Bkb3duJykuaGlkZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcjdXNlcnRyaWdnZXInKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICQoJyNVc2Vyc2Ryb3Bkb3duJykuc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICAgICAgcmVmcmVzaFBhdGgoY3VycmVudFBhdGgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1c2VyTG9nb3V0JzpcbiAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcbiAgICAgICAgICAkKCcjbG9nb3V0bW9kYWwnKS5zaG93KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01vZGFsVXNlckxvZ291dCc6XG4gICAgICAgICAgJCgnI2xvZ291dG1vZGFsJykuaGlkZSgpO1xuICAgICAgICAgIGxvZ291dCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1c2VyQ2hhbmdlUGFzc3dvcmQnOlxuICAgICAgICAgICQoJyNVc2Vyc2Ryb3Bkb3duJykuaGlkZSgpO1xuICAgICAgICAgIHNob3dDaGFuZ2VVc2VyUGFzc3dvcmQoMzIsIDQ0MCwgJ0NoYW5nZSBVc2VyIFBhc3N3b3JkJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VzZXJQcm9maWxlJzpcbiAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcbiAgICAgICAgICBzaG93VXNlclByb2ZpbGUoNDAsIDQ0MCwgJ1VzZXIgUHJvZmlsZScpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdsb2dvdXRNb2RhbENsb3NlJzpcbiAgICAgICAgY2FzZSAnY2FuY2VsJzpcbiAgICAgICAgICAkKCcjbG9nb3V0bW9kYWwnKS5oaWRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgICAgIGN1cnJlbnRQYXRoID0gUm9vdFBhdGg7XG4gICAgICAgICAgcmVmcmVzaFBhdGgoY3VycmVudFBhdGgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICduZXdGb2xkZXInOlxuICAgICAgICAgIHNob3dOZXdGb2xkZXIoMzIsIDQ0MCwgJ05ldyBGb2xkZXInKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICBkZWxldGVTZWxlY3RlZCgpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwbG9hZCc6XG4gICAgICAgICAgdXBsb2FkKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Rvd25sb2FkJzpcbiAgICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGFTZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDUpIHtcbiAgICAgICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICAgICAgaHRtbDogJ05vIHNlIHB1ZWRlbiBkZXNjYXJnYXIgbcOhcyBkZSA1IGFyY2hpdm9zIGEgbGEgdmV6J1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb3dubG9hZChhU2VsZWN0ZWRGaWxlcywgJ0ZpbGUnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgTS50b2FzdCh7XG4gICAgICAgICAgICAgIGh0bWw6ICdObyBzZSBoYW4gc2VsZWNjaW9uYWRvIGFyY2hpdm9zIHBhcmEgZGVzY2FyZ2FyJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBNLnRvYXN0KHtcbiAgICAgICAgaHRtbDogJ09wY2lvbiBubyBwZXJtaXRpZGEnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICAkKCcjdXNlcnRyaWdnZXInKVxuICAgIC5odG1sKFVzZXJOYW1lKVxuICAgIC5hdHRyKCd0aXRsZScsICdFbXByZXNhOiAnICsgQ29tcGFueU5hbWUpO1xuXG4gICQoJyNzZXR0aW5ncycpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJCgnI1NldHRpbmdkcm9wZG93bicpLmNzcygnZGlzcGxheScpKTtcbiAgICBpZiAoJCgnI1NldHRpbmdkcm9wZG93bicpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XG4gICAgICAkKCcjc2V0dGluZ3MnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICQoJyNTZXR0aW5nZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnc2V0dGluZycpLmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3NldHRpbmdzJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAkKCcjU2V0dGluZ2Ryb3Bkb3duJykuYWRkQ2xhc3MoJ3NldHRpbmcnKS5zaG93KCk7XG4gICAgfVxuICB9KTtcbiAgJCgnI1VzZXJzZHJvcGRvd24nKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcbiAgICAkKCcjdXNlcnRyaWdnZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfSk7XG4gICQoJyNTZXR0aW5nZHJvcGRvd24nKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAkKCcjU2V0dGluZ2Ryb3Bkb3duJykuaGlkZSgpO1xuICAgICQoJyNzZXR0aW5ncycpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICB9KTtcbiAgcmVmcmVzaFBhdGgoY3VycmVudFBhdGgpO1xuICByZWZyZXNoQmFyTWVudSgpO1xuICBjb25zb2xlLmxvZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQpO1xufSk7XG4iLCJ2YXIgdHlwZVxudHJ5IHtcbiAgdHlwZSA9IHJlcXVpcmUoJ3R5cGUtb2YnKVxufSBjYXRjaCAoZXgpIHtcbiAgICAvLyBoaWRlIGZyb20gYnJvd3NlcmlmeVxuICB2YXIgciA9IHJlcXVpcmVcbiAgdHlwZSA9IHIoJ3R5cGUnKVxufVxuXG52YXIganNvbnBJRCA9IDBcbnZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudFxudmFyIGtleVxudmFyIG5hbWVcbiAgICAvLyB2YXIgcnNjcmlwdCA9IC88c2NyaXB0XFxiW148XSooPzooPyE8XFwvc2NyaXB0Pik8W148XSopKjxcXC9zY3JpcHQ+L2dpXG52YXIgc2NyaXB0VHlwZVJFID0gL14oPzp0ZXh0fGFwcGxpY2F0aW9uKVxcL2phdmFzY3JpcHQvaVxudmFyIHhtbFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC94bWwvaVxudmFyIGpzb25UeXBlID0gJ2FwcGxpY2F0aW9uL2pzb24nXG52YXIgaHRtbFR5cGUgPSAndGV4dC9odG1sJ1xudmFyIGJsYW5rUkUgPSAvXlxccyokL1xuXG52YXIgYWpheCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHNldHRpbmdzID0gZXh0ZW5kKHt9LCBvcHRpb25zIHx8IHt9KVxuICBmb3IgKGtleSBpbiBhamF4LnNldHRpbmdzKSB7IGlmIChzZXR0aW5nc1trZXldID09PSB1bmRlZmluZWQpIHNldHRpbmdzW2tleV0gPSBhamF4LnNldHRpbmdzW2tleV0gfVxuXG4gIGFqYXhTdGFydChzZXR0aW5ncylcblxuICBpZiAoIXNldHRpbmdzLmNyb3NzRG9tYWluKSB7XG4gICAgc2V0dGluZ3MuY3Jvc3NEb21haW4gPSAvXihbXFx3LV0rOik/XFwvXFwvKFteXFwvXSspLy50ZXN0KHNldHRpbmdzLnVybCkgJiZcbiAgICAgICAgICAgIFJlZ0V4cC4kMiAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3RcbiAgfVxuXG4gIHZhciBkYXRhVHlwZSA9IHNldHRpbmdzLmRhdGFUeXBlXG4gIHZhciBoYXNQbGFjZWhvbGRlciA9IC89XFw/Ly50ZXN0KHNldHRpbmdzLnVybClcbiAgaWYgKGRhdGFUeXBlID09PSAnanNvbnAnIHx8IGhhc1BsYWNlaG9sZGVyKSB7XG4gICAgaWYgKCFoYXNQbGFjZWhvbGRlcikgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLCAnY2FsbGJhY2s9PycpXG4gICAgcmV0dXJuIGFqYXguSlNPTlAoc2V0dGluZ3MpXG4gIH1cblxuICBpZiAoIXNldHRpbmdzLnVybCkgc2V0dGluZ3MudXJsID0gd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKClcbiAgc2VyaWFsaXplRGF0YShzZXR0aW5ncylcblxuICB2YXIgbWltZSA9IHNldHRpbmdzLmFjY2VwdHNbZGF0YVR5cGVdXG4gIHZhciBiYXNlSGVhZGVycyA9IHt9XG4gIHZhciBwcm90b2NvbCA9IC9eKFtcXHctXSs6KVxcL1xcLy8udGVzdChzZXR0aW5ncy51cmwpID8gUmVnRXhwLiQxIDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sXG4gIHZhciB4aHIgPSBhamF4LnNldHRpbmdzLnhocigpXG4gIHZhciBhYm9ydFRpbWVvdXRcblxuICBpZiAoc2V0dGluZ3MuYWpheHRpbWVvdXQpIHhoci50aW1lb3V0ID0gc2V0dGluZ3MuYWpheHRpbWVvdXRcbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikgYmFzZUhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXSA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgaWYgKG1pbWUpIHtcbiAgICBiYXNlSGVhZGVyc1snQWNjZXB0J10gPSBtaW1lXG4gICAgaWYgKG1pbWUuaW5kZXhPZignLCcpID4gLTEpIG1pbWUgPSBtaW1lLnNwbGl0KCcsJywgMilbMF1cbiAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSAmJiB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lKVxuICB9XG4gIGlmIChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAoc2V0dGluZ3MuZGF0YSAmJiBzZXR0aW5ncy50eXBlLnRvVXBwZXJDYXNlKCkgIT09ICdHRVQnKSkgeyBiYXNlSGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIH1cbiAgc2V0dGluZ3MuaGVhZGVycyA9IGV4dGVuZChiYXNlSGVhZGVycywgc2V0dGluZ3MuaGVhZGVycyB8fCB7fSlcbiAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzKVxuICB9XG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxuICAgICAgdmFyIHJlc3VsdFxuICAgICAgdmFyIGVycm9yID0gZmFsc2VcbiAgICAgIGlmICgoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgfHwgeGhyLnN0YXR1cyA9PT0gMzA0IHx8ICh4aHIuc3RhdHVzID09PSAwICYmIHByb3RvY29sID09PSAnZmlsZTonKSkge1xuICAgICAgICBkYXRhVHlwZSA9IGRhdGFUeXBlIHx8IG1pbWVUb0RhdGFUeXBlKHhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJykpXG4gICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gJ3NjcmlwdCcpKDEsIGV2YWwpKHJlc3VsdClcbiAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gJ3htbCcpIHJlc3VsdCA9IHhoci5yZXNwb25zZVhNTFxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSAnanNvbicpIHJlc3VsdCA9IGJsYW5rUkUudGVzdChyZXN1bHQpID8gbnVsbCA6IEpTT04ucGFyc2UocmVzdWx0KVxuICAgICAgICB9IGNhdGNoIChlKSB7IGVycm9yID0gZSB9XG5cbiAgICAgICAgaWYgKGVycm9yKSBhamF4RXJyb3IoZXJyb3IsICdwYXJzZXJlcnJvcicsIHhociwgc2V0dGluZ3MpXG4gICAgICAgIGVsc2UgYWpheFN1Y2Nlc3MocmVzdWx0LCB4aHIsIHNldHRpbmdzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDApIHtcbiAgICAgICAgICBhamF4RXJyb3IobnVsbCwgJ2Vycm9yJywgeGhyLCBzZXR0aW5ncylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBhc3luYyA9ICdhc3luYycgaW4gc2V0dGluZ3MgPyBzZXR0aW5ncy5hc3luYyA6IHRydWVcbiAgeGhyLm9wZW4oc2V0dGluZ3MudHlwZSwgc2V0dGluZ3MudXJsLCBhc3luYylcblxuICBmb3IgKG5hbWUgaW4gc2V0dGluZ3MuaGVhZGVycykgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgc2V0dGluZ3MuaGVhZGVyc1tuYW1lXSlcblxuICBpZiAoYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlKSB7XG4gICAgeGhyLmFib3J0KClcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gICAgLyogaWYgKHNldHRpbmdzLnRpbWVvdXQgPiAwKSBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHlcbiAgICAgICAgeGhyLmFib3J0KClcbiAgICAgICAgYWpheEVycm9yKG51bGwsICd0aW1lb3V0JywgeGhyLCBzZXR0aW5ncylcbiAgICB9LCBzZXR0aW5ncy50aW1lb3V0KSAqL1xuXG4gICAgLy8gYXZvaWQgc2VuZGluZyBlbXB0eSBzdHJpbmcgKCMzMTkpXG4gIHhoci5zZW5kKHNldHRpbmdzLmRhdGEgPyBzZXR0aW5ncy5kYXRhIDogbnVsbClcbiAgcmV0dXJuIHhoclxufVxuXG4vLyB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IGFuZCByZXR1cm4gZmFsc2UgaWYgaXQgd2FzIGNhbmNlbGxlZFxuZnVuY3Rpb24gdHJpZ2dlckFuZFJldHVybiAoY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgLy8gdG9kbzogRmlyZSBvZmYgc29tZSBldmVudHNcbiAgICAvLyB2YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50TmFtZSlcbiAgICAvLyAkKGNvbnRleHQpLnRyaWdnZXIoZXZlbnQsIGRhdGEpXG4gIHJldHVybiB0cnVlIC8vISBldmVudC5kZWZhdWx0UHJldmVudGVkXG59XG5cbi8vIHRyaWdnZXIgYW4gQWpheCBcImdsb2JhbFwiIGV2ZW50XG5mdW5jdGlvbiB0cmlnZ2VyR2xvYmFsIChzZXR0aW5ncywgY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChzZXR0aW5ncy5nbG9iYWwpIHJldHVybiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQgfHwgZG9jdW1lbnQsIGV2ZW50TmFtZSwgZGF0YSlcbn1cblxuLy8gTnVtYmVyIG9mIGFjdGl2ZSBBamF4IHJlcXVlc3RzXG5hamF4LmFjdGl2ZSA9IDBcblxuZnVuY3Rpb24gYWpheFN0YXJ0IChzZXR0aW5ncykge1xuICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmIGFqYXguYWN0aXZlKysgPT09IDApIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RhcnQnKVxufVxuXG5mdW5jdGlvbiBhamF4U3RvcCAoc2V0dGluZ3MpIHtcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiAhKC0tYWpheC5hY3RpdmUpKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0b3AnKVxufVxuXG4vLyB0cmlnZ2VycyBhbiBleHRyYSBnbG9iYWwgZXZlbnQgXCJhamF4QmVmb3JlU2VuZFwiIHRoYXQncyBsaWtlIFwiYWpheFNlbmRcIiBidXQgY2FuY2VsYWJsZVxuZnVuY3Rpb24gYWpheEJlZm9yZVNlbmQgKHhociwgc2V0dGluZ3MpIHtcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XG4gIGlmIChzZXR0aW5ncy5iZWZvcmVTZW5kLmNhbGwoY29udGV4dCwgeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlIHx8XG4gICAgICAgIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4QmVmb3JlU2VuZCcsIFt4aHIsIHNldHRpbmdzXSkgPT09IGZhbHNlKSB7IHJldHVybiBmYWxzZSB9XG5cbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTZW5kJywgW3hociwgc2V0dGluZ3NdKVxufVxuXG5mdW5jdGlvbiBhamF4U3VjY2VzcyAoZGF0YSwgeGhyLCBzZXR0aW5ncykge1xuICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgdmFyIHN0YXR1cyA9ICdzdWNjZXNzJ1xuICBzZXR0aW5ncy5zdWNjZXNzLmNhbGwoY29udGV4dCwgZGF0YSwgc3RhdHVzLCB4aHIpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4U3VjY2VzcycsIFt4aHIsIHNldHRpbmdzLCBkYXRhXSlcbiAgYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncylcbn1cbi8vIHR5cGU6IFwidGltZW91dFwiLCBcImVycm9yXCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXG5mdW5jdGlvbiBhamF4RXJyb3IgKGVycm9yLCB0eXBlLCB4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICBzZXR0aW5ncy5lcnJvci5jYWxsKGNvbnRleHQsIHhociwgdHlwZSwgZXJyb3IpXG4gIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4RXJyb3InLCBbeGhyLCBzZXR0aW5ncywgZXJyb3JdKVxuICBhamF4Q29tcGxldGUodHlwZSwgeGhyLCBzZXR0aW5ncylcbn1cbi8vIHN0YXR1czogXCJzdWNjZXNzXCIsIFwibm90bW9kaWZpZWRcIiwgXCJlcnJvclwiLCBcInRpbWVvdXRcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcbmZ1bmN0aW9uIGFqYXhDb21wbGV0ZSAoc3RhdHVzLCB4aHIsIHNldHRpbmdzKSB7XG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICBzZXR0aW5ncy5jb21wbGV0ZS5jYWxsKGNvbnRleHQsIHhociwgc3RhdHVzKVxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheENvbXBsZXRlJywgW3hociwgc2V0dGluZ3NdKVxuICBhamF4U3RvcChzZXR0aW5ncylcbn1cblxuLy8gRW1wdHkgZnVuY3Rpb24sIHVzZWQgYXMgZGVmYXVsdCBjYWxsYmFja1xuZnVuY3Rpb24gZW1wdHkgKCkge31cblxuYWpheC5KU09OUCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmICghKCd0eXBlJyBpbiBvcHRpb25zKSkgcmV0dXJuIGFqYXgob3B0aW9ucylcbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdqc29ucCcgKyAoKytqc29ucElEKVxuICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgdmFyIGFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0b2RvOiByZW1vdmUgc2NyaXB0XG4gICAgICAgIC8vICQoc2NyaXB0KS5yZW1vdmUoKVxuICAgIGlmIChjYWxsYmFja05hbWUgaW4gd2luZG93KSB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGVtcHR5XG4gICAgYWpheENvbXBsZXRlKCdhYm9ydCcsIHhociwgb3B0aW9ucylcbiAgfVxuICB2YXIgeGhyID0geyBhYm9ydDogYWJvcnQgfVxuICB2YXIgYWJvcnRUaW1lb3V0XG4gIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSB8fFxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblxuICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICAgIG9wdGlvbnMuZXJyb3IoKVxuICAgIH1cbiAgfVxuXG4gIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxuICAgICAgICAgICAgLy8gdG9kbzogcmVtb3ZlIHNjcmlwdFxuICAgICAgICAgICAgLy8gJChzY3JpcHQpLnJlbW92ZSgpXG4gICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja05hbWVdXG4gICAgYWpheFN1Y2Nlc3MoZGF0YSwgeGhyLCBvcHRpb25zKVxuICB9XG5cbiAgc2VyaWFsaXplRGF0YShvcHRpb25zKVxuICBzY3JpcHQuc3JjID0gb3B0aW9ucy51cmwucmVwbGFjZSgvPVxcPy8sICc9JyArIGNhbGxiYWNrTmFtZSlcblxuICAgIC8vIFVzZSBpbnNlcnRCZWZvcmUgaW5zdGVhZCBvZiBhcHBlbmRDaGlsZCB0byBjaXJjdW12ZW50IGFuIElFNiBidWcuXG4gICAgLy8gVGhpcyBhcmlzZXMgd2hlbiBhIGJhc2Ugbm9kZSBpcyB1c2VkIChzZWUgalF1ZXJ5IGJ1Z3MgIzI3MDkgYW5kICM0Mzc4KS5cbiAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQpXG5cbiAgaWYgKG9wdGlvbnMudGltZW91dCA+IDApIHtcbiAgICBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgICBhamF4Q29tcGxldGUoJ3RpbWVvdXQnLCB4aHIsIG9wdGlvbnMpXG4gICAgfSwgb3B0aW9ucy50aW1lb3V0KVxuICB9XG5cbiAgcmV0dXJuIHhoclxufVxuXG5hamF4LnNldHRpbmdzID0ge1xuICAgIC8vIERlZmF1bHQgdHlwZSBvZiByZXF1ZXN0XG4gIHR5cGU6ICdHRVQnLFxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgYmVmb3JlIHJlcXVlc3RcbiAgYmVmb3JlU2VuZDogZW1wdHksXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBpZiB0aGUgcmVxdWVzdCBzdWNjZWVkc1xuICBzdWNjZXNzOiBlbXB0eSxcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIHRoZSB0aGUgc2VydmVyIGRyb3BzIGVycm9yXG4gIGVycm9yOiBlbXB0eSxcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIG9uIHJlcXVlc3QgY29tcGxldGUgKGJvdGg6IGVycm9yIGFuZCBzdWNjZXNzKVxuICBjb21wbGV0ZTogZW1wdHksXG4gICAgLy8gVGhlIGNvbnRleHQgZm9yIHRoZSBjYWxsYmFja3NcbiAgY29udGV4dDogbnVsbCxcbiAgICAvLyBXaGV0aGVyIHRvIHRyaWdnZXIgXCJnbG9iYWxcIiBBamF4IGV2ZW50c1xuICBnbG9iYWw6IHRydWUsXG4gICAgLy8gVHJhbnNwb3J0XG4gIHhocjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcbiAgfSxcbiAgICAvLyBNSU1FIHR5cGVzIG1hcHBpbmdcbiAgYWNjZXB0czoge1xuICAgIHNjcmlwdDogJ3RleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCcsXG4gICAganNvbjoganNvblR5cGUsXG4gICAgeG1sOiAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCcsXG4gICAgaHRtbDogaHRtbFR5cGUsXG4gICAgdGV4dDogJ3RleHQvcGxhaW4nXG4gIH0sXG4gICAgLy8gV2hldGhlciB0aGUgcmVxdWVzdCBpcyB0byBhbm90aGVyIGRvbWFpblxuICBjcm9zc0RvbWFpbjogZmFsc2UsXG4gICAgLy8gRGVmYXVsdCB0aW1lb3V0XG4gIHRpbWVvdXQ6IDBcbn1cblxuZnVuY3Rpb24gbWltZVRvRGF0YVR5cGUgKG1pbWUpIHtcbiAgcmV0dXJuIG1pbWUgJiYgKG1pbWUgPT09IGh0bWxUeXBlID8gJ2h0bWwnXG4gICAgICAgIDogbWltZSA9PT0ganNvblR5cGUgPyAnanNvbidcbiAgICAgICAgOiBzY3JpcHRUeXBlUkUudGVzdChtaW1lKSA/ICdzY3JpcHQnXG4gICAgICAgIDogeG1sVHlwZVJFLnRlc3QobWltZSkgJiYgJ3htbCcpIHx8ICd0ZXh0J1xufVxuXG5mdW5jdGlvbiBhcHBlbmRRdWVyeSAodXJsLCBxdWVyeSkge1xuICByZXR1cm4gKHVybCArICcmJyArIHF1ZXJ5KS5yZXBsYWNlKC9bJj9dezEsMn0vLCAnPycpXG59XG5cbi8vIHNlcmlhbGl6ZSBwYXlsb2FkIGFuZCBhcHBlbmQgaXQgdG8gdGhlIFVSTCBmb3IgR0VUIHJlcXVlc3RzXG5mdW5jdGlvbiBzZXJpYWxpemVEYXRhIChvcHRpb25zKSB7XG4gIGlmICh0eXBlKG9wdGlvbnMuZGF0YSkgPT09ICdvYmplY3QnKSBvcHRpb25zLmRhdGEgPSBwYXJhbShvcHRpb25zLmRhdGEpXG4gIGlmIChvcHRpb25zLmRhdGEgJiYgKCFvcHRpb25zLnR5cGUgfHwgb3B0aW9ucy50eXBlLnRvVXBwZXJDYXNlKCkgPT09ICdHRVQnKSkgeyBvcHRpb25zLnVybCA9IGFwcGVuZFF1ZXJ5KG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEpIH1cbn1cblxuYWpheC5nZXQgPSBmdW5jdGlvbiAodXJsLCBzdWNjZXNzKSB7IHJldHVybiBhamF4KHsgdXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3MgfSkgfVxuXG5hamF4LnBvc3QgPSBmdW5jdGlvbiAodXJsLCBkYXRhLCBzdWNjZXNzLCBkYXRhVHlwZSkge1xuICBpZiAodHlwZShkYXRhKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRhdGFUeXBlID0gZGF0YVR5cGUgfHwgc3VjY2Vzc1xuICAgIHN1Y2Nlc3MgPSBkYXRhXG4gICAgZGF0YSA9IG51bGxcbiAgfVxuICByZXR1cm4gYWpheCh7IHR5cGU6ICdQT1NUJywgdXJsOiB1cmwsIGRhdGE6IGRhdGEsIHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGFUeXBlOiBkYXRhVHlwZSB9KVxufVxuXG5hamF4LmdldEpTT04gPSBmdW5jdGlvbiAodXJsLCBzdWNjZXNzKSB7XG4gIHJldHVybiBhamF4KHsgdXJsOiB1cmwsIHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGFUeXBlOiAnanNvbicgfSlcbn1cblxudmFyIGVzY2FwZSA9IGVuY29kZVVSSUNvbXBvbmVudFxuXG5mdW5jdGlvbiBzZXJpYWxpemUgKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbCwgc2NvcGUpIHtcbiAgdmFyIGFycmF5ID0gdHlwZShvYmopID09PSAnYXJyYXknXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICB2YXIgdmFsdWUgPSBvYmpba2V5XVxuXG4gICAgaWYgKHNjb3BlKSBrZXkgPSB0cmFkaXRpb25hbCA/IHNjb3BlIDogc2NvcGUgKyAnWycgKyAoYXJyYXkgPyAnJyA6IGtleSkgKyAnXSdcbiAgICAgICAgICAgIC8vIGhhbmRsZSBkYXRhIGluIHNlcmlhbGl6ZUFycmF5KCkgZm9ybWF0XG4gICAgaWYgKCFzY29wZSAmJiBhcnJheSkgcGFyYW1zLmFkZCh2YWx1ZS5uYW1lLCB2YWx1ZS52YWx1ZSlcbiAgICAgICAgICAgIC8vIHJlY3Vyc2UgaW50byBuZXN0ZWQgb2JqZWN0c1xuICAgIGVsc2UgaWYgKHRyYWRpdGlvbmFsID8gKHR5cGUodmFsdWUpID09PSAnYXJyYXknKSA6ICh0eXBlKHZhbHVlKSA9PT0gJ29iamVjdCcpKSB7IHNlcmlhbGl6ZShwYXJhbXMsIHZhbHVlLCB0cmFkaXRpb25hbCwga2V5KSB9IGVsc2UgcGFyYW1zLmFkZChrZXksIHZhbHVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhcmFtIChvYmosIHRyYWRpdGlvbmFsKSB7XG4gIHZhciBwYXJhbXMgPSBbXVxuICBwYXJhbXMuYWRkID0gZnVuY3Rpb24gKGssIHYpIHsgdGhpcy5wdXNoKGVzY2FwZShrKSArICc9JyArIGVzY2FwZSh2KSkgfVxuICBzZXJpYWxpemUocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsKVxuICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKCclMjAnLCAnKycpXG59XG5cbmZ1bmN0aW9uIGV4dGVuZCAodGFyZ2V0KSB7XG4gIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuICBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlW2tleV0gIT09IHVuZGVmaW5lZCkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldIH1cbiAgICB9XG4gIH0pXG4gIHJldHVybiB0YXJnZXRcbn1cbiIsIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCAoY29udmVydGVyKSB7XG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdyaXRlXG5cblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRhdHRyaWJ1dGVzID0gZXh0ZW5kKHtcblx0XHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdFx0fSwgYXBpLmRlZmF1bHRzLCBhdHRyaWJ1dGVzKTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpICogMSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSdyZSB1c2luZyBcImV4cGlyZXNcIiBiZWNhdXNlIFwibWF4LWFnZVwiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUVcblx0XHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlID9cblx0XHRcdFx0XHRjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgOlxuXHRcdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8M0F8M0N8M0V8M0R8MkZ8M0Z8NDB8NUJ8NUR8NUV8NjB8N0J8N0R8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKVxuXHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXG5cdFx0XHRcdFx0LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XG5cblx0XHRcdFx0dmFyIHN0cmluZ2lmaWVkQXR0cmlidXRlcyA9ICcnO1xuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcblx0XHRcdFx0XHQvLyAuLi5cblx0XHRcdFx0XHQvLyAzLiAgSWYgdGhlIHJlbWFpbmluZyB1bnBhcnNlZC1hdHRyaWJ1dGVzIGNvbnRhaW5zIGEgJXgzQiAoXCI7XCIpXG5cdFx0XHRcdFx0Ly8gICAgIGNoYXJhY3Rlcjpcblx0XHRcdFx0XHQvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuXHRcdFx0XHRcdC8vIG5vdCBpbmNsdWRpbmcsIHRoZSBmaXJzdCAleDNCIChcIjtcIikgY2hhcmFjdGVyLlxuXHRcdFx0XHRcdC8vIC4uLlxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9IGtleSArICc9JyArIHZhbHVlICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVhZFxuXG5cdFx0XHR2YXIgamFyID0ge307XG5cdFx0XHR2YXIgZGVjb2RlID0gZnVuY3Rpb24gKHMpIHtcblx0XHRcdFx0cmV0dXJuIHMucmVwbGFjZSgvKCVbMC05QS1aXXsyfSkrL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHR9O1xuXHRcdFx0Ly8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuXHRcdFx0Ly8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0XHR2YXIgY29va2llID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG5cdFx0XHRcdGlmICghdGhpcy5qc29uICYmIGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IGRlY29kZShwYXJ0c1swXSk7XG5cdFx0XHRcdFx0Y29va2llID0gKGNvbnZlcnRlci5yZWFkIHx8IGNvbnZlcnRlcikoY29va2llLCBuYW1lKSB8fFxuXHRcdFx0XHRcdFx0ZGVjb2RlKGNvb2tpZSk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGphcltuYW1lXSA9IGNvb2tpZTtcblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyO1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbCh7XG5cdFx0XHRcdGpzb246IHRydWVcblx0XHRcdH0sIGtleSk7XG5cdFx0fTtcblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcbiIsIi8qKlxuICogW2pzLW1kNV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2VtbjE3OC9qcy1tZDV9XG4gKlxuICogQG5hbWVzcGFjZSBtZDVcbiAqIEB2ZXJzaW9uIDAuNy4zXG4gKiBAYXV0aG9yIENoZW4sIFlpLUN5dWFuIFtlbW4xNzhAZ21haWwuY29tXVxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMTdcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4hIGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtcblxuICAgIGZ1bmN0aW9uIHQodCkgeyBpZiAodCkgZFswXSA9IGRbMTZdID0gZFsxXSA9IGRbMl0gPSBkWzNdID0gZFs0XSA9IGRbNV0gPSBkWzZdID0gZFs3XSA9IGRbOF0gPSBkWzldID0gZFsxMF0gPSBkWzExXSA9IGRbMTJdID0gZFsxM10gPSBkWzE0XSA9IGRbMTVdID0gMCwgdGhpcy5ibG9ja3MgPSBkLCB0aGlzLmJ1ZmZlcjggPSBsO1xuICAgICAgICBlbHNlIGlmIChhKSB7IHZhciByID0gbmV3IEFycmF5QnVmZmVyKDY4KTtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyOCA9IG5ldyBVaW50OEFycmF5KHIpLCB0aGlzLmJsb2NrcyA9IG5ldyBVaW50MzJBcnJheShyKSB9IGVsc2UgdGhpcy5ibG9ja3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgICAgIHRoaXMuaDAgPSB0aGlzLmgxID0gdGhpcy5oMiA9IHRoaXMuaDMgPSB0aGlzLnN0YXJ0ID0gdGhpcy5ieXRlcyA9IHRoaXMuaEJ5dGVzID0gMCwgdGhpcy5maW5hbGl6ZWQgPSB0aGlzLmhhc2hlZCA9ICExLCB0aGlzLmZpcnN0ID0gITAgfSB2YXIgciA9IFwiaW5wdXQgaXMgaW52YWxpZCB0eXBlXCIsXG4gICAgICAgIGUgPSBcIm9iamVjdFwiID09IHR5cGVvZiB3aW5kb3csXG4gICAgICAgIGkgPSBlID8gd2luZG93IDoge307XG4gICAgaS5KU19NRDVfTk9fV0lORE9XICYmIChlID0gITEpOyB2YXIgcyA9ICFlICYmIFwib2JqZWN0XCIgPT0gdHlwZW9mIHNlbGYsXG4gICAgICAgIGggPSAhaS5KU19NRDVfTk9fTk9ERV9KUyAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xuICAgIGggPyBpID0gZ2xvYmFsIDogcyAmJiAoaSA9IHNlbGYpOyB2YXIgZiA9ICFpLkpTX01ENV9OT19DT01NT05fSlMgJiYgXCJvYmplY3RcIiA9PSB0eXBlb2YgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzLFxuICAgICAgICBvID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCxcbiAgICAgICAgYSA9ICFpLkpTX01ENV9OT19BUlJBWV9CVUZGRVIgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgQXJyYXlCdWZmZXIsXG4gICAgICAgIG4gPSBcIjAxMjM0NTY3ODlhYmNkZWZcIi5zcGxpdChcIlwiKSxcbiAgICAgICAgdSA9IFsxMjgsIDMyNzY4LCA4Mzg4NjA4LCAtMjE0NzQ4MzY0OF0sXG4gICAgICAgIHkgPSBbMCwgOCwgMTYsIDI0XSxcbiAgICAgICAgYyA9IFtcImhleFwiLCBcImFycmF5XCIsIFwiZGlnZXN0XCIsIFwiYnVmZmVyXCIsIFwiYXJyYXlCdWZmZXJcIiwgXCJiYXNlNjRcIl0sXG4gICAgICAgIHAgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5zcGxpdChcIlwiKSxcbiAgICAgICAgZCA9IFtdLFxuICAgICAgICBsOyBpZiAoYSkgeyB2YXIgQSA9IG5ldyBBcnJheUJ1ZmZlcig2OCk7XG4gICAgICAgIGwgPSBuZXcgVWludDhBcnJheShBKSwgZCA9IG5ldyBVaW50MzJBcnJheShBKSB9IWkuSlNfTUQ1X05PX05PREVfSlMgJiYgQXJyYXkuaXNBcnJheSB8fCAoQXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIFwiW29iamVjdCBBcnJheV1cIiA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpIH0pLCAhYSB8fCAhaS5KU19NRDVfTk9fQVJSQVlfQlVGRkVSX0lTX1ZJRVcgJiYgQXJyYXlCdWZmZXIuaXNWaWV3IHx8IChBcnJheUJ1ZmZlci5pc1ZpZXcgPSBmdW5jdGlvbih0KSB7IHJldHVybiBcIm9iamVjdFwiID09IHR5cGVvZiB0ICYmIHQuYnVmZmVyICYmIHQuYnVmZmVyLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlciB9KTsgdmFyIGIgPSBmdW5jdGlvbihyKSB7IHJldHVybiBmdW5jdGlvbihlKSB7IHJldHVybiBuZXcgdCghMCkudXBkYXRlKGUpW3JdKCkgfSB9LFxuICAgICAgICB2ID0gZnVuY3Rpb24oKSB7IHZhciByID0gYihcImhleFwiKTtcbiAgICAgICAgICAgIGggJiYgKHIgPSB3KHIpKSwgci5jcmVhdGUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyB0IH0sIHIudXBkYXRlID0gZnVuY3Rpb24odCkgeyByZXR1cm4gci5jcmVhdGUoKS51cGRhdGUodCkgfTsgZm9yICh2YXIgZSA9IDA7IGUgPCBjLmxlbmd0aDsgKytlKSB7IHZhciBpID0gY1tlXTtcbiAgICAgICAgICAgICAgICByW2ldID0gYihpKSB9IHJldHVybiByIH0sXG4gICAgICAgIHcgPSBmdW5jdGlvbih0KSB7IHZhciBlID0gZXZhbChcInJlcXVpcmUoJ2NyeXB0bycpXCIpLFxuICAgICAgICAgICAgICAgIGkgPSBldmFsKFwicmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyXCIpLFxuICAgICAgICAgICAgICAgIHMgPSBmdW5jdGlvbihzKSB7IGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBzKSByZXR1cm4gZS5jcmVhdGVIYXNoKFwibWQ1XCIpLnVwZGF0ZShzLCBcInV0ZjhcIikuZGlnZXN0KFwiaGV4XCIpOyBpZiAobnVsbCA9PT0gcyB8fCB2b2lkIDAgPT09IHMpIHRocm93IHI7IHJldHVybiBzLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlciAmJiAocyA9IG5ldyBVaW50OEFycmF5KHMpKSwgQXJyYXkuaXNBcnJheShzKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcocykgfHwgcy5jb25zdHJ1Y3RvciA9PT0gaSA/IGUuY3JlYXRlSGFzaChcIm1kNVwiKS51cGRhdGUobmV3IGkocykpLmRpZ2VzdChcImhleFwiKSA6IHQocykgfTsgcmV0dXJuIHMgfTtcbiAgICB0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0KSB7IGlmICghdGhpcy5maW5hbGl6ZWQpIHsgdmFyIGUsIGkgPSB0eXBlb2YgdDsgaWYgKFwic3RyaW5nXCIgIT09IGkpIHsgaWYgKFwib2JqZWN0XCIgIT09IGkpIHRocm93IHI7IGlmIChudWxsID09PSB0KSB0aHJvdyByOyBpZiAoYSAmJiB0LmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcikgdCA9IG5ldyBVaW50OEFycmF5KHQpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCEoQXJyYXkuaXNBcnJheSh0KSB8fCBhICYmIEFycmF5QnVmZmVyLmlzVmlldyh0KSkpIHRocm93IHI7XG4gICAgICAgICAgICAgICAgZSA9ICEwIH0gZm9yICh2YXIgcywgaCwgZiA9IDAsIG8gPSB0Lmxlbmd0aCwgbiA9IHRoaXMuYmxvY2tzLCB1ID0gdGhpcy5idWZmZXI4OyBmIDwgbzspIHsgaWYgKHRoaXMuaGFzaGVkICYmICh0aGlzLmhhc2hlZCA9ICExLCBuWzBdID0gblsxNl0sIG5bMTZdID0gblsxXSA9IG5bMl0gPSBuWzNdID0gbls0XSA9IG5bNV0gPSBuWzZdID0gbls3XSA9IG5bOF0gPSBuWzldID0gblsxMF0gPSBuWzExXSA9IG5bMTJdID0gblsxM10gPSBuWzE0XSA9IG5bMTVdID0gMCksIGUpXG4gICAgICAgICAgICAgICAgICAgIGlmIChhKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChoID0gdGhpcy5zdGFydDsgZiA8IG8gJiYgaCA8IDY0OyArK2YpIHVbaCsrXSA9IHRbZl07XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKSBuW2ggPj4gMl0gfD0gdFtmXSA8PCB5WzMgJiBoKytdO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGEpXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKShzID0gdC5jaGFyQ29kZUF0KGYpKSA8IDEyOCA/IHVbaCsrXSA9IHMgOiBzIDwgMjA0OCA/ICh1W2grK10gPSAxOTIgfCBzID4+IDYsIHVbaCsrXSA9IDEyOCB8IDYzICYgcykgOiBzIDwgNTUyOTYgfHwgcyA+PSA1NzM0NCA/ICh1W2grK10gPSAyMjQgfCBzID4+IDEyLCB1W2grK10gPSAxMjggfCBzID4+IDYgJiA2MywgdVtoKytdID0gMTI4IHwgNjMgJiBzKSA6IChzID0gNjU1MzYgKyAoKDEwMjMgJiBzKSA8PCAxMCB8IDEwMjMgJiB0LmNoYXJDb2RlQXQoKytmKSksIHVbaCsrXSA9IDI0MCB8IHMgPj4gMTgsIHVbaCsrXSA9IDEyOCB8IHMgPj4gMTIgJiA2MywgdVtoKytdID0gMTI4IHwgcyA+PiA2ICYgNjMsIHVbaCsrXSA9IDEyOCB8IDYzICYgcyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikocyA9IHQuY2hhckNvZGVBdChmKSkgPCAxMjggPyBuW2ggPj4gMl0gfD0gcyA8PCB5WzMgJiBoKytdIDogcyA8IDIwNDggPyAobltoID4+IDJdIHw9ICgxOTIgfCBzID4+IDYpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgNjMgJiBzKSA8PCB5WzMgJiBoKytdKSA6IHMgPCA1NTI5NiB8fCBzID49IDU3MzQ0ID8gKG5baCA+PiAyXSB8PSAoMjI0IHwgcyA+PiAxMikgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCBzID4+IDYgJiA2MykgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pIDogKHMgPSA2NTUzNiArICgoMTAyMyAmIHMpIDw8IDEwIHwgMTAyMyAmIHQuY2hhckNvZGVBdCgrK2YpKSwgbltoID4+IDJdIHw9ICgyNDAgfCBzID4+IDE4KSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gMTIgJiA2MykgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCBzID4+IDYgJiA2MykgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdEJ5dGVJbmRleCA9IGgsIHRoaXMuYnl0ZXMgKz0gaCAtIHRoaXMuc3RhcnQsIGggPj0gNjQgPyAodGhpcy5zdGFydCA9IGggLSA2NCwgdGhpcy5oYXNoKCksIHRoaXMuaGFzaGVkID0gITApIDogdGhpcy5zdGFydCA9IGggfSByZXR1cm4gdGhpcy5ieXRlcyA+IDQyOTQ5NjcyOTUgJiYgKHRoaXMuaEJ5dGVzICs9IHRoaXMuYnl0ZXMgLyA0Mjk0OTY3Mjk2IDw8IDAsIHRoaXMuYnl0ZXMgPSB0aGlzLmJ5dGVzICUgNDI5NDk2NzI5NiksIHRoaXMgfSB9LCB0LnByb3RvdHlwZS5maW5hbGl6ZSA9IGZ1bmN0aW9uKCkgeyBpZiAoIXRoaXMuZmluYWxpemVkKSB7IHRoaXMuZmluYWxpemVkID0gITA7IHZhciB0ID0gdGhpcy5ibG9ja3MsXG4gICAgICAgICAgICAgICAgciA9IHRoaXMubGFzdEJ5dGVJbmRleDtcbiAgICAgICAgICAgIHRbciA+PiAyXSB8PSB1WzMgJiByXSwgciA+PSA1NiAmJiAodGhpcy5oYXNoZWQgfHwgdGhpcy5oYXNoKCksIHRbMF0gPSB0WzE2XSwgdFsxNl0gPSB0WzFdID0gdFsyXSA9IHRbM10gPSB0WzRdID0gdFs1XSA9IHRbNl0gPSB0WzddID0gdFs4XSA9IHRbOV0gPSB0WzEwXSA9IHRbMTFdID0gdFsxMl0gPSB0WzEzXSA9IHRbMTRdID0gdFsxNV0gPSAwKSwgdFsxNF0gPSB0aGlzLmJ5dGVzIDw8IDMsIHRbMTVdID0gdGhpcy5oQnl0ZXMgPDwgMyB8IHRoaXMuYnl0ZXMgPj4+IDI5LCB0aGlzLmhhc2goKSB9IH0sIHQucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbigpIHsgdmFyIHQsIHIsIGUsIGksIHMsIGgsIGYgPSB0aGlzLmJsb2NrcztcbiAgICAgICAgdGhpcy5maXJzdCA/IHIgPSAoKHIgPSAoKHQgPSAoKHQgPSBmWzBdIC0gNjgwODc2OTM3KSA8PCA3IHwgdCA+Pj4gMjUpIC0gMjcxNzMzODc5IDw8IDApIF4gKGUgPSAoKGUgPSAoLTI3MTczMzg3OSBeIChpID0gKChpID0gKC0xNzMyNTg0MTk0IF4gMjAwNDMxODA3MSAmIHQpICsgZlsxXSAtIDExNzgzMDcwOCkgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKC0yNzE3MzM4NzkgXiB0KSkgKyBmWzJdIC0gMTEyNjQ3ODM3NSkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzNdIC0gMTMxNjI1OTIwOSkgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAgOiAodCA9IHRoaXMuaDAsIHIgPSB0aGlzLmgxLCBlID0gdGhpcy5oMiwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKChpID0gdGhpcy5oMykgXiByICYgKGUgXiBpKSkgKyBmWzBdIC0gNjgwODc2OTM2KSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzFdIC0gMzg5NTY0NTg2KSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbMl0gKyA2MDYxMDU4MTkpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlszXSAtIDEwNDQ1MjUzMzApIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwKSwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKGkgXiByICYgKGUgXiBpKSkgKyBmWzRdIC0gMTc2NDE4ODk3KSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzVdICsgMTIwMDA4MDQyNikgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzZdIC0gMTQ3MzIzMTM0MSkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzddIC0gNDU3MDU5ODMpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwLCByID0gKChyICs9ICgodCA9ICgodCArPSAoaSBeIHIgJiAoZSBeIGkpKSArIGZbOF0gKyAxNzcwMDM1NDE2KSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzldIC0gMTk1ODQxNDQxNykgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzEwXSAtIDQyMDYzKSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbMTFdIC0gMTk5MDQwNDE2MikgPDwgMjIgfCByID4+PiAxMCkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9IChpIF4gciAmIChlIF4gaSkpICsgZlsxMl0gKyAxODA0NjAzNjgyKSA8PCA3IHwgdCA+Pj4gMjUpICsgciA8PCAwKSBeIChlID0gKChlICs9IChyIF4gKGkgPSAoKGkgKz0gKGUgXiB0ICYgKHIgXiBlKSkgKyBmWzEzXSAtIDQwMzQxMTAxKSA8PCAxMiB8IGkgPj4+IDIwKSArIHQgPDwgMCkgJiAodCBeIHIpKSArIGZbMTRdIC0gMTUwMjAwMjI5MCkgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzE1XSArIDEyMzY1MzUzMjkpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzFdIC0gMTY1Nzk2NTEwKSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbNl0gLSAxMDY5NTAxNjMyKSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzExXSArIDY0MzcxNzcxMykgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZlswXSAtIDM3Mzg5NzMwMikgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gZSAmICgodCA9ICgodCArPSAoZSBeIGkgJiAociBeIGUpKSArIGZbNV0gLSA3MDE1NTg2OTEpIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZlsxMF0gKyAzODAxNjA4MykgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZlsxNV0gLSA2NjA0NzgzMzUpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbNF0gLSA0MDU1Mzc4NDgpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzldICsgNTY4NDQ2NDM4KSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbMTRdIC0gMTAxOTgwMzY5MCkgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZlszXSAtIDE4NzM2Mzk2MSkgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZls4XSArIDExNjM1MzE1MDEpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzEzXSAtIDE0NDQ2ODE0NjcpIDw8IDUgfCB0ID4+PiAyNykgKyByIDw8IDApIF4gcikpICsgZlsyXSAtIDUxNDAzNzg0KSA8PCA5IHwgaSA+Pj4gMjMpICsgdCA8PCAwKSBeIHQgJiAoKGUgPSAoKGUgKz0gKHQgXiByICYgKGkgXiB0KSkgKyBmWzddICsgMTczNTMyODQ3MykgPDwgMTQgfCBlID4+PiAxOCkgKyBpIDw8IDApIF4gaSkpICsgZlsxMl0gLSAxOTI2NjA3NzM0KSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZls1XSAtIDM3ODU1OCkgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZls4XSAtIDIwMjI1NzQ0NjMpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbMTFdICsgMTgzOTAzMDU2MikgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbMTRdIC0gMzUzMDk1NTYpIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbMV0gLSAxNTMwOTkyMDYwKSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzRdICsgMTI3Mjg5MzM1MykgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZls3XSAtIDE1NTQ5NzYzMikgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbMTBdIC0gMTA5NDczMDY0MCkgPDwgMjMgfCByID4+PiA5KSArIGUgPDwgMCwgciA9ICgociArPSAoKGggPSAoaSA9ICgoaSArPSAoKHMgPSByIF4gZSkgXiAodCA9ICgodCArPSAocyBeIGkpICsgZlsxM10gKyA2ODEyNzkxNzQpIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbMF0gLSAzNTg1MzcyMjIpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbM10gLSA3MjI1MjE5NzkpIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzZdICsgNzYwMjkxODkpIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbOV0gLSA2NDAzNjQ0ODcpIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbMTJdIC0gNDIxODE1ODM1KSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzE1XSArIDUzMDc0MjUyMCkgPDwgMTYgfCBlID4+PiAxNikgKyBpIDw8IDApKSArIGZbMl0gLSA5OTUzMzg2NTEpIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZlswXSAtIDE5ODYzMDg0NCkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZls3XSArIDExMjY4OTE0MTUpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbMTRdIC0gMTQxNjM1NDkwNSkgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbNV0gLSA1NzQzNDA1NSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZlsxMl0gKyAxNzAwNDg1NTcxKSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzNdIC0gMTg5NDk4NjYwNikgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZlsxMF0gLSAxMDUxNTIzKSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZlsxXSAtIDIwNTQ5MjI3OTkpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbOF0gKyAxODczMzEzMzU5KSA8PCA2IHwgdCA+Pj4gMjYpICsgciA8PCAwKSB8IH5lKSkgKyBmWzE1XSAtIDMwNjExNzQ0KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzZdIC0gMTU2MDE5ODM4MCkgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbMTNdICsgMTMwOTE1MTY0OSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChpID0gKChpICs9IChyIF4gKCh0ID0gKCh0ICs9IChlIF4gKHIgfCB+aSkpICsgZls0XSAtIDE0NTUyMzA3MCkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZlsxMV0gLSAxMTIwMjEwMzc5KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzJdICsgNzE4Nzg3MjU5KSA8PCAxNSB8IGUgPj4+IDE3KSArIGkgPDwgMCkgfCB+dCkpICsgZls5XSAtIDM0MzQ4NTU1MSkgPDwgMjEgfCByID4+PiAxMSkgKyBlIDw8IDAsIHRoaXMuZmlyc3QgPyAodGhpcy5oMCA9IHQgKyAxNzMyNTg0MTkzIDw8IDAsIHRoaXMuaDEgPSByIC0gMjcxNzMzODc5IDw8IDAsIHRoaXMuaDIgPSBlIC0gMTczMjU4NDE5NCA8PCAwLCB0aGlzLmgzID0gaSArIDI3MTczMzg3OCA8PCAwLCB0aGlzLmZpcnN0ID0gITEpIDogKHRoaXMuaDAgPSB0aGlzLmgwICsgdCA8PCAwLCB0aGlzLmgxID0gdGhpcy5oMSArIHIgPDwgMCwgdGhpcy5oMiA9IHRoaXMuaDIgKyBlIDw8IDAsIHRoaXMuaDMgPSB0aGlzLmgzICsgaSA8PCAwKSB9LCB0LnByb3RvdHlwZS5oZXggPSBmdW5jdGlvbigpIHsgdGhpcy5maW5hbGl6ZSgpOyB2YXIgdCA9IHRoaXMuaDAsXG4gICAgICAgICAgICByID0gdGhpcy5oMSxcbiAgICAgICAgICAgIGUgPSB0aGlzLmgyLFxuICAgICAgICAgICAgaSA9IHRoaXMuaDM7IHJldHVybiBuW3QgPj4gNCAmIDE1XSArIG5bMTUgJiB0XSArIG5bdCA+PiAxMiAmIDE1XSArIG5bdCA+PiA4ICYgMTVdICsgblt0ID4+IDIwICYgMTVdICsgblt0ID4+IDE2ICYgMTVdICsgblt0ID4+IDI4ICYgMTVdICsgblt0ID4+IDI0ICYgMTVdICsgbltyID4+IDQgJiAxNV0gKyBuWzE1ICYgcl0gKyBuW3IgPj4gMTIgJiAxNV0gKyBuW3IgPj4gOCAmIDE1XSArIG5bciA+PiAyMCAmIDE1XSArIG5bciA+PiAxNiAmIDE1XSArIG5bciA+PiAyOCAmIDE1XSArIG5bciA+PiAyNCAmIDE1XSArIG5bZSA+PiA0ICYgMTVdICsgblsxNSAmIGVdICsgbltlID4+IDEyICYgMTVdICsgbltlID4+IDggJiAxNV0gKyBuW2UgPj4gMjAgJiAxNV0gKyBuW2UgPj4gMTYgJiAxNV0gKyBuW2UgPj4gMjggJiAxNV0gKyBuW2UgPj4gMjQgJiAxNV0gKyBuW2kgPj4gNCAmIDE1XSArIG5bMTUgJiBpXSArIG5baSA+PiAxMiAmIDE1XSArIG5baSA+PiA4ICYgMTVdICsgbltpID4+IDIwICYgMTVdICsgbltpID4+IDE2ICYgMTVdICsgbltpID4+IDI4ICYgMTVdICsgbltpID4+IDI0ICYgMTVdIH0sIHQucHJvdG90eXBlLnRvU3RyaW5nID0gdC5wcm90b3R5cGUuaGV4LCB0LnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbigpIHsgdGhpcy5maW5hbGl6ZSgpOyB2YXIgdCA9IHRoaXMuaDAsXG4gICAgICAgICAgICByID0gdGhpcy5oMSxcbiAgICAgICAgICAgIGUgPSB0aGlzLmgyLFxuICAgICAgICAgICAgaSA9IHRoaXMuaDM7IHJldHVybiBbMjU1ICYgdCwgdCA+PiA4ICYgMjU1LCB0ID4+IDE2ICYgMjU1LCB0ID4+IDI0ICYgMjU1LCAyNTUgJiByLCByID4+IDggJiAyNTUsIHIgPj4gMTYgJiAyNTUsIHIgPj4gMjQgJiAyNTUsIDI1NSAmIGUsIGUgPj4gOCAmIDI1NSwgZSA+PiAxNiAmIDI1NSwgZSA+PiAyNCAmIDI1NSwgMjU1ICYgaSwgaSA+PiA4ICYgMjU1LCBpID4+IDE2ICYgMjU1LCBpID4+IDI0ICYgMjU1XSB9LCB0LnByb3RvdHlwZS5hcnJheSA9IHQucHJvdG90eXBlLmRpZ2VzdCwgdC5wcm90b3R5cGUuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHsgdGhpcy5maW5hbGl6ZSgpOyB2YXIgdCA9IG5ldyBBcnJheUJ1ZmZlcigxNiksXG4gICAgICAgICAgICByID0gbmV3IFVpbnQzMkFycmF5KHQpOyByZXR1cm4gclswXSA9IHRoaXMuaDAsIHJbMV0gPSB0aGlzLmgxLCByWzJdID0gdGhpcy5oMiwgclszXSA9IHRoaXMuaDMsIHQgfSwgdC5wcm90b3R5cGUuYnVmZmVyID0gdC5wcm90b3R5cGUuYXJyYXlCdWZmZXIsIHQucHJvdG90eXBlLmJhc2U2NCA9IGZ1bmN0aW9uKCkgeyBmb3IgKHZhciB0LCByLCBlLCBpID0gXCJcIiwgcyA9IHRoaXMuYXJyYXkoKSwgaCA9IDA7IGggPCAxNTspIHQgPSBzW2grK10sIHIgPSBzW2grK10sIGUgPSBzW2grK10sIGkgKz0gcFt0ID4+PiAyXSArIHBbNjMgJiAodCA8PCA0IHwgciA+Pj4gNCldICsgcFs2MyAmIChyIDw8IDIgfCBlID4+PiA2KV0gKyBwWzYzICYgZV07IHJldHVybiB0ID0gc1toXSwgaSArPSBwW3QgPj4+IDJdICsgcFt0IDw8IDQgJiA2M10gKyBcIj09XCIgfTsgdmFyIF8gPSB2KCk7XG4gICAgZiA/IG1vZHVsZS5leHBvcnRzID0gXyA6IChpLm1kNSA9IF8sIG8gJiYgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gXyB9KSkgfSgpOyIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbi8vIFN1cHBvcnQgZGVjb2RpbmcgVVJMLXNhZmUgYmFzZTY0IHN0cmluZ3MsIGFzIE5vZGUuanMgZG9lcy5cbi8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0I1VSTF9hcHBsaWNhdGlvbnNcbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIGdldExlbnMgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyBUcmltIG9mZiBleHRyYSBieXRlcyBhZnRlciBwbGFjZWhvbGRlciBieXRlcyBhcmUgZm91bmRcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanMvaXNzdWVzLzQyXG4gIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKCc9JylcbiAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW5cblxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gdmFsaWRMZW4gPT09IGxlblxuICAgID8gMFxuICAgIDogNCAtICh2YWxpZExlbiAlIDQpXG5cbiAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXVxufVxuXG4vLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiBfYnl0ZUxlbmd0aCAoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuXG4gIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpXG5cbiAgdmFyIGN1ckJ5dGUgPSAwXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICB2YXIgbGVuID0gcGxhY2VIb2xkZXJzTGVuID4gMFxuICAgID8gdmFsaWRMZW4gLSA0XG4gICAgOiB2YWxpZExlblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHxcbiAgICAgIHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAyKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMSkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArXG4gICAgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9XG4gICAgICAoKHVpbnQ4W2ldIDw8IDE2KSAmIDB4RkYwMDAwKSArXG4gICAgICAoKHVpbnQ4W2kgKyAxXSA8PCA4KSAmIDB4RkYwMCkgK1xuICAgICAgKHVpbnQ4W2kgKyAyXSAmIDB4RkYpXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsoXG4gICAgICB1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpXG4gICAgKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDJdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl0gK1xuICAgICAgJz09J1xuICAgIClcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAxMF0gK1xuICAgICAgbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdICtcbiAgICAgICc9J1xuICAgIClcbiAgfVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbnZhciBLX01BWF9MRU5HVEggPSAweDdmZmZmZmZmXG5leHBvcnRzLmtNYXhMZW5ndGggPSBLX01BWF9MRU5HVEhcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgUHJpbnQgd2FybmluZyBhbmQgcmVjb21tZW5kIHVzaW5nIGBidWZmZXJgIHY0Lnggd2hpY2ggaGFzIGFuIE9iamVjdFxuICogICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogV2UgcmVwb3J0IHRoYXQgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0eXBlZCBhcnJheXMgaWYgdGhlIGFyZSBub3Qgc3ViY2xhc3NhYmxlXG4gKiB1c2luZyBfX3Byb3RvX18uIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgXG4gKiAoU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzgpLiBJRSAxMCBsYWNrcyBzdXBwb3J0XG4gKiBmb3IgX19wcm90b19fIGFuZCBoYXMgYSBidWdneSB0eXBlZCBhcnJheSBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbmlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgY29uc29sZS5lcnJvcihcbiAgICAnVGhpcyBicm93c2VyIGxhY2tzIHR5cGVkIGFycmF5IChVaW50OEFycmF5KSBzdXBwb3J0IHdoaWNoIGlzIHJlcXVpcmVkIGJ5ICcgK1xuICAgICdgYnVmZmVyYCB2NS54LiBVc2UgYGJ1ZmZlcmAgdjQueCBpZiB5b3UgcmVxdWlyZSBvbGQgYnJvd3NlciBzdXBwb3J0LidcbiAgKVxufVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIC8vIENhbiB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZD9cbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuX19wcm90b19fID0ge19fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfX1cbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmJ1ZmZlclxuICB9XG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ29mZnNldCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYnl0ZU9mZnNldFxuICB9XG59KVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZShhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20oYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG5pZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICB2YWx1ZTogbnVsbCxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlXG4gIH0pXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG5mdW5jdGlvbiBmcm9tICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChpc0FycmF5QnVmZmVyKHZhbHVlKSB8fCAodmFsdWUgJiYgaXNBcnJheUJ1ZmZlcih2YWx1ZS5idWZmZXIpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSBidWYud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcIm9mZnNldFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wibGVuZ3RoXCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIHZhciBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAob2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhvYmopIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBBcnJheS5pc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgQXJyYXktbGlrZSBPYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGJ1ZikpIHtcbiAgICAgIGJ1ZiA9IEJ1ZmZlci5mcm9tKGJ1ZilcbiAgICB9XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgaXNBcnJheUJ1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZ1xuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKG51bWJlcklzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKG51bWJlcklzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoID4+PiAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgKGJ5dGVzW2kgKyAxXSAqIDI1NikpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlcicpXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVXNlIGJ1aWx0LWluIHdoZW4gYXZhaWxhYmxlLCBtaXNzaW5nIGZyb20gSUUxMVxuICAgIHRoaXMuY29weVdpdGhpbih0YXJnZXRTdGFydCwgc3RhcnQsIGVuZClcbiAgfSBlbHNlIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAodmFyIGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKChlbmNvZGluZyA9PT0gJ3V0ZjgnICYmIGNvZGUgPCAxMjgpIHx8XG4gICAgICAgICAgZW5jb2RpbmcgPT09ICdsYXRpbjEnKSB7XG4gICAgICAgIC8vIEZhc3QgcGF0aDogSWYgYHZhbGAgZml0cyBpbnRvIGEgc2luZ2xlIGJ5dGUsIHVzZSB0aGF0IG51bWVyaWMgdmFsdWUuXG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiBuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSB0YWtlcyBlcXVhbCBzaWducyBhcyBlbmQgb2YgdGhlIEJhc2U2NCBlbmNvZGluZ1xuICBzdHIgPSBzdHIuc3BsaXQoJz0nKVswXVxuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbi8vIEFycmF5QnVmZmVycyBmcm9tIGFub3RoZXIgY29udGV4dCAoaS5lLiBhbiBpZnJhbWUpIGRvIG5vdCBwYXNzIHRoZSBgaW5zdGFuY2VvZmAgY2hlY2tcbi8vIGJ1dCB0aGV5IHNob3VsZCBiZSB0cmVhdGVkIGFzIHZhbGlkLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNjZcbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIgKG9iaikge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHxcbiAgICAob2JqICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBcnJheUJ1ZmZlcicgJiZcbiAgICAgIHR5cGVvZiBvYmouYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpXG59XG5cbmZ1bmN0aW9uIG51bWJlcklzTmFOIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPT0gb2JqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCIvKlxuICogIGJhc2U2NC5qc1xuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG4gKiAgICBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogIFJlZmVyZW5jZXM6XG4gKiAgICBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NFxuICovXG47KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoZ2xvYmFsKVxuICAgICAgICA6IHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZFxuICAgICAgICA/IGRlZmluZShmYWN0b3J5KSA6IGZhY3RvcnkoZ2xvYmFsKVxufSgoXG4gICAgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZlxuICAgICAgICA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93XG4gICAgICAgIDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxcbjogdGhpc1xuKSwgZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIGV4aXN0aW5nIHZlcnNpb24gZm9yIG5vQ29uZmxpY3QoKVxuICAgIHZhciBfQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB2YXIgdmVyc2lvbiA9IFwiMi40LjVcIjtcbiAgICAvLyBpZiBub2RlLmpzLCB3ZSB1c2UgQnVmZmVyXG4gICAgdmFyIGJ1ZmZlcjtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgIH1cbiAgICAvLyBjb25zdGFudHNcbiAgICB2YXIgYjY0Y2hhcnNcbiAgICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4gICAgdmFyIGI2NHRhYiA9IGZ1bmN0aW9uKGJpbikge1xuICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJpbi5sZW5ndGg7IGkgPCBsOyBpKyspIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIHJldHVybiBjYyA8IDB4ODAgPyBjXG4gICAgICAgICAgICAgICAgOiBjYyA8IDB4ODAwID8gKGZyb21DaGFyQ29kZSgweGMwIHwgKGNjID4+PiA2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8IChjYyAmIDB4M2YpKSlcbiAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAgNikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjYyA9IDB4MTAwMDBcbiAgICAgICAgICAgICAgICArIChjLmNoYXJDb2RlQXQoMCkgLSAweEQ4MDApICogMHg0MDBcbiAgICAgICAgICAgICAgICArIChjLmNoYXJDb2RlQXQoMSkgLSAweERDMDApO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoMHhmMCB8ICgoY2MgPj4+IDE4KSAmIDB4MDcpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gMTIpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAgNikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICggY2MgICAgICAgICAmIDB4M2YpKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciByZV91dG9iID0gL1tcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRkZdfFteXFx4MDAtXFx4N0ZdL2c7XG4gICAgdmFyIHV0b2IgPSBmdW5jdGlvbih1KSB7XG4gICAgICAgIHJldHVybiB1LnJlcGxhY2UocmVfdXRvYiwgY2JfdXRvYik7XG4gICAgfTtcbiAgICB2YXIgY2JfZW5jb2RlID0gZnVuY3Rpb24oY2NjKSB7XG4gICAgICAgIHZhciBwYWRsZW4gPSBbMCwgMiwgMV1bY2NjLmxlbmd0aCAlIDNdLFxuICAgICAgICBvcmQgPSBjY2MuY2hhckNvZGVBdCgwKSA8PCAxNlxuICAgICAgICAgICAgfCAoKGNjYy5sZW5ndGggPiAxID8gY2NjLmNoYXJDb2RlQXQoMSkgOiAwKSA8PCA4KVxuICAgICAgICAgICAgfCAoKGNjYy5sZW5ndGggPiAyID8gY2NjLmNoYXJDb2RlQXQoMikgOiAwKSksXG4gICAgICAgIGNoYXJzID0gW1xuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KCBvcmQgPj4+IDE4KSxcbiAgICAgICAgICAgIGI2NGNoYXJzLmNoYXJBdCgob3JkID4+PiAxMikgJiA2MyksXG4gICAgICAgICAgICBwYWRsZW4gPj0gMiA/ICc9JyA6IGI2NGNoYXJzLmNoYXJBdCgob3JkID4+PiA2KSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAxID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KG9yZCAmIDYzKVxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gICAgfTtcbiAgICB2YXIgYnRvYSA9IGdsb2JhbC5idG9hID8gZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmJ0b2EoYik7XG4gICAgfSA6IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgcmV0dXJuIGIucmVwbGFjZSgvW1xcc1xcU117MSwzfS9nLCBjYl9lbmNvZGUpO1xuICAgIH07XG4gICAgdmFyIF9lbmNvZGUgPSBidWZmZXIgP1xuICAgICAgICBidWZmZXIuZnJvbSAmJiBVaW50OEFycmF5ICYmIGJ1ZmZlci5mcm9tICE9PSBVaW50OEFycmF5LmZyb21cbiAgICAgICAgPyBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgcmV0dXJuICh1LmNvbnN0cnVjdG9yID09PSBidWZmZXIuY29uc3RydWN0b3IgPyB1IDogYnVmZmVyLmZyb20odSkpXG4gICAgICAgICAgICAgICAgLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICB9XG4gICAgICAgIDogIGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gKHUuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvciA/IHUgOiBuZXcgIGJ1ZmZlcih1KSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAodSkgeyByZXR1cm4gYnRvYSh1dG9iKHUpKSB9XG4gICAgO1xuICAgIHZhciBlbmNvZGUgPSBmdW5jdGlvbih1LCB1cmlzYWZlKSB7XG4gICAgICAgIHJldHVybiAhdXJpc2FmZVxuICAgICAgICAgICAgPyBfZW5jb2RlKFN0cmluZyh1KSlcbiAgICAgICAgICAgIDogX2VuY29kZShTdHJpbmcodSkpLnJlcGxhY2UoL1srXFwvXS9nLCBmdW5jdGlvbihtMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtMCA9PSAnKycgPyAnLScgOiAnXyc7XG4gICAgICAgICAgICB9KS5yZXBsYWNlKC89L2csICcnKTtcbiAgICB9O1xuICAgIHZhciBlbmNvZGVVUkkgPSBmdW5jdGlvbih1KSB7IHJldHVybiBlbmNvZGUodSwgdHJ1ZSkgfTtcbiAgICAvLyBkZWNvZGVyIHN0dWZmXG4gICAgdmFyIHJlX2J0b3UgPSBuZXcgUmVnRXhwKFtcbiAgICAgICAgJ1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdJyxcbiAgICAgICAgJ1tcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9JyxcbiAgICAgICAgJ1tcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9J1xuICAgIF0uam9pbignfCcpLCAnZycpO1xuICAgIHZhciBjYl9idG91ID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICBzd2l0Y2goY2NjYy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdmFyIGNwID0gKCgweDA3ICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCAxOClcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgxKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgfCAgICAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMikpIDw8ICA2KVxuICAgICAgICAgICAgICAgIHwgICAgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDMpKSxcbiAgICAgICAgICAgIG9mZnNldCA9IGNwIC0gMHgxMDAwMDtcbiAgICAgICAgICAgIHJldHVybiAoZnJvbUNoYXJDb2RlKChvZmZzZXQgID4+PiAxMCkgKyAweEQ4MDApXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKChvZmZzZXQgJiAweDNGRikgKyAweERDMDApKTtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MGYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDEyKVxuICAgICAgICAgICAgICAgICAgICB8ICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgxKSkgPDwgNilcbiAgICAgICAgICAgICAgICAgICAgfCAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMikpXG4gICAgICAgICAgICApO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICBmcm9tQ2hhckNvZGUoXG4gICAgICAgICAgICAgICAgKCgweDFmICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgxKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBidG91ID0gZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5yZXBsYWNlKHJlX2J0b3UsIGNiX2J0b3UpO1xuICAgIH07XG4gICAgdmFyIGNiX2RlY29kZSA9IGZ1bmN0aW9uKGNjY2MpIHtcbiAgICAgICAgdmFyIGxlbiA9IGNjY2MubGVuZ3RoLFxuICAgICAgICBwYWRsZW4gPSBsZW4gJSA0LFxuICAgICAgICBuID0gKGxlbiA+IDAgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMCldIDw8IDE4IDogMClcbiAgICAgICAgICAgIHwgKGxlbiA+IDEgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMSldIDw8IDEyIDogMClcbiAgICAgICAgICAgIHwgKGxlbiA+IDIgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMildIDw8ICA2IDogMClcbiAgICAgICAgICAgIHwgKGxlbiA+IDMgPyBiNjR0YWJbY2NjYy5jaGFyQXQoMyldICAgICAgIDogMCksXG4gICAgICAgIGNoYXJzID0gW1xuICAgICAgICAgICAgZnJvbUNoYXJDb2RlKCBuID4+PiAxNiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoKG4gPj4+ICA4KSAmIDB4ZmYpLFxuICAgICAgICAgICAgZnJvbUNoYXJDb2RlKCBuICAgICAgICAgJiAweGZmKVxuICAgICAgICBdO1xuICAgICAgICBjaGFycy5sZW5ndGggLT0gWzAsIDAsIDIsIDFdW3BhZGxlbl07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBhdG9iID0gZ2xvYmFsLmF0b2IgPyBmdW5jdGlvbihhKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWwuYXRvYihhKTtcbiAgICB9IDogZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBhLnJlcGxhY2UoL1tcXHNcXFNdezEsNH0vZywgY2JfZGVjb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZGVjb2RlID0gYnVmZmVyID9cbiAgICAgICAgYnVmZmVyLmZyb20gJiYgVWludDhBcnJheSAmJiBidWZmZXIuZnJvbSAhPT0gVWludDhBcnJheS5mcm9tXG4gICAgICAgID8gZnVuY3Rpb24oYSkge1xuICAgICAgICAgICAgcmV0dXJuIChhLmNvbnN0cnVjdG9yID09PSBidWZmZXIuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAgICAgPyBhIDogYnVmZmVyLmZyb20oYSwgJ2Jhc2U2NCcpKS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24oYSkge1xuICAgICAgICAgICAgcmV0dXJuIChhLmNvbnN0cnVjdG9yID09PSBidWZmZXIuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAgICAgPyBhIDogbmV3IGJ1ZmZlcihhLCAnYmFzZTY0JykpLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiBidG91KGF0b2IoYSkpIH07XG4gICAgdmFyIGRlY29kZSA9IGZ1bmN0aW9uKGEpe1xuICAgICAgICByZXR1cm4gX2RlY29kZShcbiAgICAgICAgICAgIFN0cmluZyhhKS5yZXBsYWNlKC9bLV9dL2csIGZ1bmN0aW9uKG0wKSB7IHJldHVybiBtMCA9PSAnLScgPyAnKycgOiAnLycgfSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9dL2csICcnKVxuICAgICAgICApO1xuICAgIH07XG4gICAgdmFyIG5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgICAgIGdsb2JhbC5CYXNlNjQgPSBfQmFzZTY0O1xuICAgICAgICByZXR1cm4gQmFzZTY0O1xuICAgIH07XG4gICAgLy8gZXhwb3J0IEJhc2U2NFxuICAgIGdsb2JhbC5CYXNlNjQgPSB7XG4gICAgICAgIFZFUlNJT046IHZlcnNpb24sXG4gICAgICAgIGF0b2I6IGF0b2IsXG4gICAgICAgIGJ0b2E6IGJ0b2EsXG4gICAgICAgIGZyb21CYXNlNjQ6IGRlY29kZSxcbiAgICAgICAgdG9CYXNlNjQ6IGVuY29kZSxcbiAgICAgICAgdXRvYjogdXRvYixcbiAgICAgICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgICAgIGVuY29kZVVSSTogZW5jb2RlVVJJLFxuICAgICAgICBidG91OiBidG91LFxuICAgICAgICBkZWNvZGU6IGRlY29kZSxcbiAgICAgICAgbm9Db25mbGljdDogbm9Db25mbGljdFxuICAgIH07XG4gICAgLy8gaWYgRVM1IGlzIGF2YWlsYWJsZSwgbWFrZSBCYXNlNjQuZXh0ZW5kU3RyaW5nKCkgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG5vRW51bSA9IGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTp2LGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5CYXNlNjQuZXh0ZW5kU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICdmcm9tQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZSh0aGlzKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKHVyaXNhZmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB1cmlzYWZlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjRVUkknLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHRydWUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvL1xuICAgIC8vIGV4cG9ydCBCYXNlNjQgdG8gdGhlIG5hbWVzcGFjZVxuICAgIC8vXG4gICAgaWYgKGdsb2JhbFsnTWV0ZW9yJ10pIHsgLy8gTWV0ZW9yLmpzXG4gICAgICAgIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGFuZCBBTUQgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZS5cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBoYXMgcHJlY2VkZW5jZS5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZ2xvYmFsLkJhc2U2NCB9KTtcbiAgICB9XG4gICAgLy8gdGhhdCdzIGl0IVxuICAgIHJldHVybiB7QmFzZTY0OiBnbG9iYWwuQmFzZTY0fVxufSkpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsKXtcclxuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xyXG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOiByZXR1cm4gJ2Z1bmN0aW9uJ1xyXG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSdcclxuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJ1xyXG4gICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzogcmV0dXJuICdhcmd1bWVudHMnXHJcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknXHJcbiAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOiByZXR1cm4gJ3N0cmluZydcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgdmFsID09ICdvYmplY3QnICYmIHZhbCAmJiB0eXBlb2YgdmFsLmxlbmd0aCA9PSAnbnVtYmVyJykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKHR5cGVvZiB2YWwuY2FsbGVlID09ICdmdW5jdGlvbicpIHJldHVybiAnYXJndW1lbnRzJztcclxuICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgIGlmIChleCBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xyXG4gICAgICAgIHJldHVybiAnYXJndW1lbnRzJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJ1xyXG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnXHJcbiAgaWYgKHZhbCAmJiB2YWwubm9kZVR5cGUgPT09IDEpIHJldHVybiAnZWxlbWVudCdcclxuICBpZiAodmFsID09PSBPYmplY3QodmFsKSkgcmV0dXJuICdvYmplY3QnXHJcblxyXG4gIHJldHVybiB0eXBlb2YgdmFsXHJcbn1cclxuIl19
