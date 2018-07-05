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

  var htmlContentTemplate = '<ul class="preloader-file" id="DownloadfileList">\n            <li id="li0">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename0"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar0"></div>\n                        <div class="percent" id="percent0"></div>\n                        <a class="modal_close" id="abort0" href="#"></a>\n                    </div>\n                </div>\n            </li>\n            <li id="li1">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename1"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar1"></div>\n                        <div class="percent" id="percent1"></div>\n                        <a class="modal_close" id="abort1" href="#"></a>\n                    </div>\n                </div>\n            </li>\n            <li id="li2">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename2"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar2"></div>\n                        <div class="percent" id="percent2"></div>\n                        <a class="modal_close" id="abort2" href="#"></a>\n                    </div>   \n                </div>\n            </li>\n            <li id="li3">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename3"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar3"></div>\n                        <div class="percent" id="percent3"></div>\n                        <a class="modal_close" id="abort3" href="#"></a>\n                    </div>   \n                </div>\n            </li>\n            <li id="li4">\n                <div class="li-content">\n                    <div class="li-filename" id="li-filename4"></div>\n                    <div class="progress-content">\n                        <div class="progress-bar" id="progress-bar4"></div>\n                        <div class="percent" id="percent4"></div>\n                        <a class="modal_close" id="abort4" href="#"></a>\n                    </div>\n                </div>\n            </li>\n        </ul>';

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
    ModalContent += htmlContentTemplate;
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
    var ModalContent = htmlContentTemplate;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kYXNoYm9hcmQuanMiLCJqcy92ZW5kb3IvYWpheC5qcyIsImpzL3ZlbmRvci9qcy1jb29raWUuanMiLCJqcy92ZW5kb3IvbWQ1Lm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMtYmFzZTY0L2Jhc2U2NC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdHlwZS1vZi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7O0FBR0E7Ozs7QUFDQTs7Ozs7O0FBRUEsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFZO0FBQUE7O0FBRTVCLE1BQU0sV0FBVyxtQkFBUSxHQUFSLENBQVksVUFBWixDQUFqQjtBQUNBLE1BQU0sV0FBVyxtQkFBUSxHQUFSLENBQVksVUFBWixDQUFqQjtBQUNBLE1BQU0sY0FBYyxtQkFBUSxHQUFSLENBQVksYUFBWixDQUFwQjtBQUNBLE1BQU0sZUFBZSxtQkFBUSxHQUFSLENBQVksVUFBWixDQUFyQjtBQUNBLE1BQU0sUUFBUSxtQkFBUSxHQUFSLENBQVksT0FBWixDQUFkO0FBQ0EsTUFBTSxlQUFlLG1CQUFRLEdBQVIsQ0FBWSxjQUFaLENBQXJCOztBQVA0Qiw0QkFleEIsYUFBYSxLQUFiLENBQW1CLEdBQW5CLENBZndCO0FBQUE7QUFBQSxNQVFyQixjQVJxQjtBQUFBLE1BUzFCLGlCQVQwQjtBQUFBLE1BVTFCLGVBVjBCO0FBQUEsTUFXMUIsaUJBWDBCO0FBQUEsTUFZMUIsZUFaMEI7QUFBQSxNQWExQixXQWIwQjtBQUFBLE1BYzFCLGFBZDBCOztBQWdCNUIsTUFBSSxXQUFXLEdB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHNjdHJpY3QnO1xyXG5pbXBvcnQgYWpheCBmcm9tICcuL3ZlbmRvci9hamF4JztcclxuaW1wb3J0IHtcclxuICBCYXNlNjRcclxufSBmcm9tICdqcy1iYXNlNjQnO1xyXG5pbXBvcnQgbWQ1IGZyb20gJy4vdmVuZG9yL21kNS5taW4nO1xyXG5pbXBvcnQgQ29va2llcyBmcm9tICcuL3ZlbmRvci9qcy1jb29raWUnO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICBjb25zdCBVc2VyTmFtZSA9IENvb2tpZXMuZ2V0KCdVc2VyTmFtZScpO1xyXG4gIGNvbnN0IFVzZXJSb2xlID0gQ29va2llcy5nZXQoJ1VzZXJSb2xlJyk7XHJcbiAgY29uc3QgQ29tcGFueU5hbWUgPSBDb29raWVzLmdldCgnQ29tcGFueU5hbWUnKTtcclxuICBjb25zdCByZWFsUm9vdFBhdGggPSBDb29raWVzLmdldCgnUm9vdFBhdGgnKTtcclxuICBjb25zdCBUb2tlbiA9IENvb2tpZXMuZ2V0KCd0b2tlbicpO1xyXG4gIGNvbnN0IEFjY2Vzc1N0cmluZyA9IENvb2tpZXMuZ2V0KCdBY2Nlc3NTdHJpbmcnKTtcclxuICBjb25zdCBbQWxsb3dOZXdGb2xkZXIsXHJcbiAgICBBbGxvd1JlbmFtZUZvbGRlcixcclxuICAgIEFsbG93UmVuYW1lRmlsZSxcclxuICAgIEFsbG93RGVsZXRlRm9sZGVyLFxyXG4gICAgQWxsb3dEZWxldGVGaWxlLFxyXG4gICAgQWxsb3dVcGxvYWQsXHJcbiAgICBBbGxvd0Rvd25sb2FkXHJcbiAgXSA9IEFjY2Vzc1N0cmluZy5zcGxpdCgnLCcpO1xyXG4gIGxldCBSb290UGF0aCA9ICcvJztcclxuICBsZXQgY3VycmVudFBhdGggPSBSb290UGF0aDtcclxuICBsZXQgYVNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICBsZXQgYVNlbGVjdGVkRm9sZGVycyA9IFtdO1xyXG4gIGxldCBhRm9sZGVycyA9IFtdO1xyXG4gIGxldCBhRmlsZXMgPSBbXTtcclxuXHJcbiAgbGV0IGh0bWxDb250ZW50VGVtcGxhdGUgPSBgPHVsIGNsYXNzPVwicHJlbG9hZGVyLWZpbGVcIiBpZD1cIkRvd25sb2FkZmlsZUxpc3RcIj5cclxuICAgICAgICAgICAgPGxpIGlkPVwibGkwXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDBcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQwXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGlkPVwibGkxXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUxXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDFcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQxXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGlkPVwibGkyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyMlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQyXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGlkPVwibGkzXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWUzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyM1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQzXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGlkPVwibGk0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaS1maWxlbmFtZVwiIGlkPVwibGktZmlsZW5hbWU0XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyNFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGVyY2VudFwiIGlkPVwicGVyY2VudDRcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwiYWJvcnQ0XCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPmA7XHJcblxyXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcclxuICAgIENvb2tpZXMucmVtb3ZlKCdVc2VyTmFtZScpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoJ1VzZXJSb2xlJyk7XHJcbiAgICBDb29raWVzLnJlbW92ZSgnc2Vzc2lvbklkJyk7XHJcbiAgICBDb29raWVzLnJlbW92ZSgndG9rZW4nKTtcclxuICAgIENvb2tpZXMucmVtb3ZlKCd3c3NVUkwnKTtcclxuICAgIENvb2tpZXMucmVtb3ZlKCdSb290UGF0aCcpO1xyXG4gICAgQ29va2llcy5yZW1vdmUoJ0NvbXBhbnlOYW1lJyk7XHJcbiAgICBDb29raWVzLnJlbW92ZSgnQWNjZXNzU3RyaW5nJyk7XHJcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gJy8nO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlcmlhbGl6ZU9iamVjdCA9IChkYXRhT2JqZWN0KSA9PiB7XHJcbiAgICB2YXIgc3RyaW5nUmVzdWx0ID0gJycsXHJcbiAgICAgIHZhbHVlID0gdm9pZCAwO1xyXG4gICAgZm9yICh2YXIga2V5IGluIGRhdGFPYmplY3QpIHtcclxuICAgICAgY29uc29sZS5sb2coZGF0YU9iamVjdFtrZXldLCBrZXkpO1xyXG4gICAgICB2YWx1ZSA9IGRhdGFPYmplY3Rba2V5XTtcclxuICAgICAgaWYgKHN0cmluZ1Jlc3VsdCAhPT0gJycpIHtcclxuICAgICAgICBzdHJpbmdSZXN1bHQgKz0gJyYnICsga2V5ICsgJz0nICsgdmFsdWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3RyaW5nUmVzdWx0ICs9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyaW5nUmVzdWx0O1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGNoYW5nZVBhdGggPSAobmV3UGF0aCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2NoYW5nZVBhdGg6bmV3UGF0aCAnLCBuZXdQYXRoKTtcclxuICAgIGN1cnJlbnRQYXRoID0gbmV3UGF0aC50cmltKCk7XHJcbiAgICByZWZyZXNoUGF0aChjdXJyZW50UGF0aCk7XHJcbiAgICByZWZyZXNoQmFyTWVudSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGRlbGV0ZVNlbGVjdGVkID0gKCkgPT4ge1xyXG4gICAgaWYgKGFTZWxlY3RlZEZvbGRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBzaG93RGlhbG9nWWVzTm8oJ0RlbGV0ZSBmb2xkZXMnLCAnRGVsZXRlIHNlbGVjdGVkIGZvbGRlcnM/JywgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT0gJ1lFUycpIHtcclxuICAgICAgICAgICQud2hlbihkZWxldGVGb2xkZXIoY3VycmVudFBhdGgpKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFTZWxlY3RlZEZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNob3dEaWFsb2dZZXNObygnRGVsZXRlIEZpbGVzJywgJ0RlbGV0ZSBzZWxlY3RlZCBmaWxlcz8nLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd5ZXNObycsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gJ1lFUycpIGRlbGV0ZUZpbGUoY3VycmVudFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHNob3dEaWFsb2dZZXNObygnRGVsZXRlIEZpbGVzJywgJ0RlbGV0ZSBzZWxlY3RlZCBmaWxlcz8nLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygneWVzTm8nLCByZXN1bHQpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PSAnWUVTJykgZGVsZXRlRmlsZShjdXJyZW50UGF0aCwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IEZldGNoSGFuZGxlRXJyb3JzID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIC8vdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09IDQwMSkge1xyXG4gICAgICAgIGxvZ291dCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgfVxyXG4gIGNvbnN0IHVwbG9hZCA9ICgpID0+IHtcclxuICAgIGxldCB3ID0gMzI7XHJcbiAgICBsZXQgaCA9IDQ0MDtcclxuICAgIGxldCBhTGlzdEhhbmRsZXIgPVtdO1xyXG4gICAgbGV0IGhhbmRsZXJDb3VudGVyID0gMDtcclxuICAgIGxldCBNb2RhbFRpdGxlID0gXCJTdWJpZGEgZGUgYXJjaGl2b3NcIjtcclxuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGxhYmVsIGNsYXNzPVwiZmlsZS1pbnB1dCB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCI+U2VsZWN0IGZpbGVzPGlucHV0IGlkPVwidXBsb2FkLWlucHV0XCIgdHlwZT1cImZpbGVcIiBuYW1lPVwidXBsb2Fkc1tdXCIgbXVsdGlwbGU9XCJtdWx0aXBsZVwiIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlXCI+PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJzRmlsZXNcIj5OaW5ndW4gYXJjaGl2byBzZWxlY2Npb25hZG88L3NwYW4+YDtcclxuICAgIE1vZGFsQ29udGVudCArPSBodG1sQ29udGVudFRlbXBsYXRlOyAgICAgICAgICAgICAgICAgICBcclxuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7TW9kYWxUaXRsZX08L2g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cIm1vZGFsQ2xvc2VcIiBocmVmPVwiI1wiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGhpZGRlbiBpZD1cImRlc3RQYXRoXCIgbmFtZT1cImRlc3RQYXRoXCIgdmFsdWU9XCJcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNhbmNlbEFsbFwiIGhyZWY9XCIjIVwiPkNhbmNlbCB1cGxvYWRzPC9hPiAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0bkNsb3NlVXBsb2FkXCIgaHJlZj1cIiMhXCI+Q2xvc2U8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG5cclxuICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBmblVwbG9hZEZpbGUoZm9ybURhdGEsIG5GaWxlLCBmaWxlTmFtZSkge1xyXG4gICAgICAkKCcjbGknICsgbkZpbGUpLnNob3coKTtcclxuICAgICAgJCgnI2xpLWZpbGVuYW1lJyArIG5GaWxlKS5zaG93KCk7XHJcbiAgICAgICQoJyNsaS1maWxlbmFtZScgKyBuRmlsZSkuaHRtbChmaWxlTmFtZSk7XHJcbiAgICAgIGxldCByZWFscGF0aCA9ICcnO1xyXG4gICAgICBpZiAoY3VycmVudFBhdGggPT0gJy8nKSB7XHJcbiAgICAgICAgcmVhbHBhdGggPSBjdXJyZW50UGF0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZWFscGF0aCA9IHJlYWxSb290UGF0aCArIGN1cnJlbnRQYXRoO1xyXG4gICAgICB9XHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiAnL2ZpbGVzL3VwbG9hZD9kZXN0UGF0aD0nICsgcmVhbHBhdGgsXHJcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgIGRhdGE6IGZvcm1EYXRhLFxyXG4gICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgdGltZW91dDogMjcwMDAwLFxyXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHJPYmopIHtcclxuICAgICAgICAgIHhock9iai5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgVG9rZW4pO1xyXG4gICAgICAgICAgeGhyT2JqLnNldFJlcXVlc3RIZWFkZXIoXCJkZXN0UGF0aFwiLCByZWFscGF0aCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZmlsZU5hbWUgKyAndXBsb2FkIHN1Y2Nlc3NmdWwhXFxuJyArIGRhdGEpO1xyXG4gICAgICAgICAgJCgnLnRvYXN0JykucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAgICAgTS50b2FzdCh7XHJcbiAgICAgICAgICAgIGh0bWw6IGZpbGVOYW1lICsgJyB1cGxvYWRlZCBzdWNlc3NmdWxseSdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJCgnI2Fib3J0JyArIG5GaWxlKS5oaWRlKCk7XHJcbiAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICBoYW5kbGVyQ291bnRlciA9IGhhbmRsZXJDb3VudGVyIC0gMTtcclxuICAgICAgICAgIGlmIChoYW5kbGVyQ291bnRlciA9PSAwKSB7XHJcbiAgICAgICAgICAgICQoJyNidG5DYW5jZWxBbGwnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHhocjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgYUxpc3RIYW5kbGVyW25GaWxlXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgbGV0IHBlcmNlbnRDb21wbGV0ZSA9IDA7XHJcbiAgICAgICAgICBhTGlzdEhhbmRsZXJbbkZpbGVdLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcclxuICAgICAgICAgICAgICBwZXJjZW50Q29tcGxldGUgPSBwYXJzZUludChwZXJjZW50Q29tcGxldGUgKiAxMDApO1xyXG4gICAgICAgICAgICAgICQoJyNwZXJjZW50JyArIG5GaWxlKS50ZXh0KHBlcmNlbnRDb21wbGV0ZSArICclJyk7XHJcbiAgICAgICAgICAgICAgJCgnI3Byb2dyZXNzLWJhcicgKyBuRmlsZSkud2lkdGgocGVyY2VudENvbXBsZXRlICsgJyUnKTtcclxuICAgICAgICAgICAgICAvKiBpZiAocGVyY2VudENvbXBsZXRlID09PSAxMDApIHtcclxuICAgICAgICAgICAgICAgICQoJyNyZWZyZXNoJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgICB9ICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgIHJldHVybiBhTGlzdEhhbmRsZXJbbkZpbGVdO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgICQoJyNtb2RhbCcpLmh0bWwoaHRtbENvbnRlbnQpLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDt0ZXh0LWFsaWduOiBjZW50ZXI7Jyk7XHJcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XHJcbiAgICAkKCcubW9kYWwtY29udGFpbmVyJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcclxuICAgICQoJy5maWxlLWlucHV0Jykuc2hvdygpO1xyXG4gICAgJCgnI21vZGFsJykuc2hvdygpO1xyXG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcclxuICAgICQoJyNidG5DbG9zZVVwbG9hZCcpLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjbW9kYWxDbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjYnRuQ2FuY2VsQWxsJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAkKCcubW9kYWxfY2xvc2UnKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICBsZXQgbiA9IHBhcnNlSW50KGUudGFyZ2V0LmlkLnNsaWNlKC0xKSk7XHJcbiAgICAgIGFMaXN0SGFuZGxlcltuXS5hYm9ydCgpO1xyXG4gICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BlcmNlbnQnICsgbik7XHJcbiAgICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcy1iYXInICsgbik7XHJcbiAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9ICdDYW5jZWxlZCBieSB1c2VyJztcclxuICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9ICdyZWQnO1xyXG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcclxuICAgICAgJChlLnRhcmdldCkuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjYnRuQ2FuY2VsQWxsJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCA0OyB4KyspIHtcclxuICAgICAgICBhTGlzdEhhbmRsZXJbeF0uYWJvcnQoKTtcclxuICAgICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BlcmNlbnQnICsgeCk7XHJcbiAgICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyB4KTtcclxuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSAnQ2FuY2VsZWQgYnkgdXNlcic7XHJcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcclxuICAgICAgfVxyXG4gICAgICAkKCcjYnRuQ2FuY2VsQWxsJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9KTtcclxuICAgICQoJyN1cGxvYWQtaW5wdXQnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgZmlsZXMgPSAkKHRoaXMpLmdldCgwKS5maWxlcztcclxuICAgICAgaGFuZGxlckNvdW50ZXIgPSBmaWxlcy5sZW5ndGg7XHJcbiAgICAgIChmaWxlcy5sZW5ndGggPiAwKSA/ICQoJyNzRmlsZXMnKS5odG1sKGZpbGVzLmxlbmd0aCArICcgYXJjaGl2b3Mgc2VsZWNjaW9uYWRvcy4nKTogJCgnI3NGaWxlcycpLmh0bWwoZmlsZXNbMF0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhmaWxlcy5sZW5ndGgpO1xyXG4gICAgICAkKCcuZmlsZS1pbnB1dCcpLmhpZGUoKTtcclxuICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDAgJiYgZmlsZXMubGVuZ3RoIDw9IDUpIHtcclxuICAgICAgICAkKCcjYnRuQ2xvc2VVcGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAvLyBhZGQgdGhlIGZpbGVzIHRvIGZvcm1EYXRhIG9iamVjdCBmb3IgdGhlIGRhdGEgcGF5bG9hZFxyXG5cclxuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgndXBsb2Fkc1tdJywgZmlsZSwgZmlsZS5uYW1lKTtcclxuICAgICAgICAgIGZuVXBsb2FkRmlsZShmb3JtRGF0YSwgaSwgZmlsZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnI2J0bkNsb3NlVXBsb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTS50b2FzdCh7XHJcbiAgICAgICAgICBodG1sOiAnTm8gc2UgcHVlZGVuIGRlc2NhcmdhciBtw6FzIGRlIDUgYXJjaGl2b3MgYSBsYSB2ZXonXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9O1xyXG5cclxuICBjb25zdCBuZXdGb2xkZXIgPSAoZm9sZGVyTmFtZSkgPT4ge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFRva2VuKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgZmV0Y2goJy9maWxlcy9uZXdmb2xkZXInLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICBcInBhdGhcIjogY3VycmVudFBhdGgsXHJcbiAgICAgICAgICBcImZvbGRlck5hbWVcIjogZm9sZGVyTmFtZVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKEZldGNoSGFuZGxlRXJyb3JzKVxyXG4gICAgICAudGhlbihyID0+IHIuanNvbigpKVxyXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAnT0snKSB7XHJcbiAgICAgICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XHJcbiAgICAgICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICAgICAgJCgnI3JlZnJlc2gnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgTS50b2FzdCh7XHJcbiAgICAgICAgICAgIGh0bWw6ICdDcmVhZGEgbnVldmEgY2FycGV0YSAnICsgZGF0YS5kYXRhLmZvbGRlck5hbWVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzaG93RGlhbG9nWWVzTm8gPSAodGl0bGUsIGNvbnRlbnQsIGNiKSA9PiB7XHJcbiAgICBsZXQgdyA9IDMyO1xyXG4gICAgbGV0IGggPSA0NDA7XHJcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1PiR7dGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cImxvZ291dE1vZGFsQ2xvc2VcIiBocmVmPVwiI2hvbGFcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtjb250ZW50fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cImJ0blllc1wiIGhyZWY9XCIjXCI+WWVzPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuTk9cIiBocmVmPVwiI1wiPk5PPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG4gICAgJCgnI21vZGFsJykuaHRtbChodG1sQ29udGVudCkuY3NzKCd3aWR0aDogJyArIHcgKyAnJTtoZWlnaHQ6ICcgKyBoICsgJ3B4O3RleHQtYWxpZ246IGNlbnRlcjsnKTtcclxuICAgIC8vJCgnLm1vZGFsLWNvbnRlbnQnKS5jc3MoJ3dpZHRoOiAzNTBweDsnKTtcclxuICAgICQoJy5tb2RhbCcpLmNzcygnd2lkdGg6IDQwJSAhaW1wb3J0YW50Jyk7XHJcbiAgICAkKCcjbW9kYWwnKS5zaG93KCk7XHJcbiAgICAkKCcjbGVhbi1vdmVybGF5Jykuc2hvdygpO1xyXG4gICAgJCgnI2J0blllcycpLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICByZXR1cm4gY2IoJ1lFUycpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjYnRuTk8nKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcclxuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgcmV0dXJuIGNiKCdOTycpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZGVsZXRlRmlsZSA9IChwYXRoKSA9PiB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCBhRiA9IGFTZWxlY3RlZEZpbGVzLnNsaWNlKCk7XHJcbiAgICBjb25zb2xlLmxvZyhhRik7XHJcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFRva2VuKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBmb3IgKHggPSAwOyB4IDwgYUYubGVuZ3RoOyB4KyspIHtcclxuICAgICAgY29uc29sZS5sb2coJ0RlbGV0aW5nIGZpbGUgJyArIGFGW3hdICsgJyAuLi4nKTtcclxuICAgICAgZmV0Y2goJy9maWxlcy9kZWxldGUnLCB7XHJcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIFwicGF0aFwiOiBwYXRoLFxyXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IGFGW3hdXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIHRpbWVvdXQ6IDcyMDAwMFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oRmV0Y2hIYW5kbGVFcnJvcnMpXHJcbiAgICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcclxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ09LJykge1xyXG4gICAgICAgICAgICBhU2VsZWN0ZWRGaWxlcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAkKCcudG9hc3QnKS5yZW1vdmVDbGFzcygnc3VjY2VzcycpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIE0udG9hc3Qoe1xyXG4gICAgICAgICAgICAgIGh0bWw6ICdBcmNoaXZvICcgKyBkYXRhLmRhdGEuZmlsZU5hbWUgKyAnIGJvcnJhZG8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICQoJy50b2FzdCcpLnJlbW92ZUNsYXNzKCdlcnInKS5hZGRDbGFzcygnZXJyJyk7XHJcbiAgICAgICAgICBNLnRvYXN0KHtcclxuICAgICAgICAgICAgaHRtbDogZXJyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGRlbGV0ZUZvbGRlciA9IChwYXRoKSA9PiB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCBhRiA9IGFTZWxlY3RlZEZvbGRlcnMuc2xpY2UoKTtcclxuICAgIGNvbnNvbGUubG9nKGFGKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgVG9rZW4pO1xyXG4gICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAkKCcjd2FpdGluZycpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIGZvciAoeCA9IDA7IHggPCBhRi5sZW5ndGg7IHgrKykge1xyXG4gICAgICBjb25zb2xlLmxvZygnRGVsZXRpbmcgZm9sZGVyICcgKyBhRlt4XSArICcgLi4uJyk7XHJcbiAgICAgIGZldGNoKCcvZmlsZXMvZGVsZXRlJywge1xyXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBcInBhdGhcIjogcGF0aCxcclxuICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBhRlt4XVxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICB0aW1lb3V0OiA3MjAwMDBcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKEZldGNoSGFuZGxlRXJyb3JzKVxyXG4gICAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09ICdPSycpIHtcclxuICAgICAgICAgICAgJCgnLnRvYXN0JykucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBNLnRvYXN0KHtcclxuICAgICAgICAgICAgICBodG1sOiAnQ2FycGV0YSAnICsgZGF0YS5kYXRhLmZpbGVOYW1lICsgJyBib3JyYWRhJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5zaGlmdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKCcjd2FpdGluZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9O1xyXG5cclxuXHJcblxyXG4gIC8vVE9ETzogT3B0aW1pemFyIHJlbmRlcml6YWRvIGRlIGVsZW1lbnRvcyBsaSBcclxuICAvL2luY29ycG9yYW5kbyBlbCBjb250ZW5pZG8gZW4gZWwgYnVjbGUgX2xvb3BcclxuICBjb25zdCBkb3dubG9hZCA9IChmaWxlTGlzdCwgdGV4dCkgPT4ge1xyXG4gICAgbGV0IHJlcUxpc3QgPSBbXSxcclxuICAgICAgaGFuZGxlckNvdW50ID0gMCxcclxuICAgICAgcmVzcG9uc2VUaW1lb3V0ID0gW107XHJcbiAgICBsZXQgdyA9IDMyO1xyXG4gICAgbGV0IGggPSA0NDA7XHJcbiAgICBsZXQgTW9kYWxUaXRsZSA9IFwiRGVzY2FyZ2EgZGUgYXJjaGl2b3Mgc2VsZWNjaW9uYWRvc1wiO1xyXG4gICAgbGV0IE1vZGFsQ29udGVudCA9IGh0bWxDb250ZW50VGVtcGxhdGU7XHJcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsX2Nsb3NlXCIgaWQ9XCJtb2RhbENsb3NlXCIgaHJlZj1cIiNcIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiYnRuQ2FuY2VsQWxsXCIgaHJlZj1cIiMhXCI+Q2FuY2VsIGRvd25sb2FkczwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1vZGFsLWFjdGlvbiBtb2RhbC1jbG9zZSB3YXZlcy1lZmZlY3Qgd2F2ZXMtdGVhbCBidG4tZmxhdCBidG4yLXVuaWZ5XCIgaWQ9XCJidG5DbG9zZURvd25sb2FkXCIgaHJlZj1cIiMhXCI+Q2VycmFyPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcclxuICAgICQoJyNtb2RhbCcpLmh0bWwoaHRtbENvbnRlbnQpLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDt0ZXh0LWFsaWduOiBjZW50ZXI7Jyk7XHJcbiAgICAvLyQoJy5tb2RhbC1jb250ZW50JykuY3NzKCd3aWR0aDogMzUwcHg7Jyk7XHJcbiAgICAkKCcubW9kYWwnKS5jc3MoJ3dpZHRoOiA0MCUgIWltcG9ydGFudCcpO1xyXG4gICAgJCgnI21vZGFsJykuc2hvdygpO1xyXG4gICAgJCgnI2xlYW4tb3ZlcmxheScpLnNob3coKTtcclxuICAgICQoJyNkb3dubG9hZCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgJCgnI2J0bkNsb3NlRG93bmxvYWQnKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAkKCcjZG93bmxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgIGFTZWxlY3RlZEZpbGVzID0gW107XHJcbiAgICB9KTtcclxuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgJCgnI2Rvd25sb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcclxuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgJCgnI3JlZnJlc2gnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICBhU2VsZWN0ZWRGaWxlcyA9IFtdO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjd2FpdGluZycpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJyNidG5DYW5jZWxBbGwnKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDQ7IHgrKykge1xyXG4gICAgICAgIHJlcUxpc3RbeF0uYWJvcnQoKTtcclxuICAgICAgICBsZXQgcGVyY2VudExhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BlcmNlbnQnICsgeCk7XHJcbiAgICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyB4KTtcclxuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSAnQ2FuY2VsZWQgYnkgdXNlcic7XHJcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcclxuICAgICAgfVxyXG4gICAgICAkKCcjYnRuQ2FuY2VsQWxsJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9KTtcclxuICAgICQoJy5tb2RhbF9jbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IG4gPSBwYXJzZUludChlLnRhcmdldC5pZC5zbGljZSgtMSkpO1xyXG4gICAgICByZXFMaXN0W25dLmFib3J0KCk7XHJcbiAgICAgIGxldCBwZXJjZW50TGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGVyY2VudCcgKyBuKTtcclxuICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyBuKTtcclxuICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ0NhbmNlbGVkIGJ5IHVzZXInO1xyXG4gICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmNvbG9yID0gJ3JlZCc7XHJcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjYnRuQ2FuY2VsQWxsJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICBsZXQgX2xvb3AgPSAoaSkgPT4ge1xyXG4gICAgICBsZXQgZk5hbWUgPSBmaWxlTGlzdFtpXTtcclxuICAgICAgbGV0IGxpTnVtYmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xpJyArIGkpO1xyXG4gICAgICBsZXQgbGlGaWxlbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsaS1maWxlbmFtZScgKyBpKTtcclxuICAgICAgbGV0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2dyZXNzLWJhcicgKyBpKTtcclxuICAgICAgbGV0IHBlcmNlbnRMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwZXJjZW50JyArIGkpO1xyXG4gICAgICByZXNwb25zZVRpbWVvdXRbaV0gPSBmYWxzZTtcclxuICAgICAgZk5hbWUgPSBmTmFtZS5zcGxpdCgnXFxcXCcpLnBvcCgpLnNwbGl0KCcvJykucG9wKCk7XHJcbiAgICAgIHJlcUxpc3RbaV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgcmVxTGlzdFtpXS5vcGVuKCdQT1NUJywgJy9maWxlcy9kb3dubG9hZCcsIHRydWUpO1xyXG4gICAgICByZXFMaXN0W2ldLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcbiAgICAgIGxpTnVtYmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICBsaUZpbGVuYW1lLmlubmVySFRNTCA9IGZOYW1lO1xyXG4gICAgICByZXFMaXN0W2ldLnRpbWVvdXQgPSAzNjAwMDtcclxuICAgICAgcmVxTGlzdFtpXS5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyoqIFRpbWVvdXQgZXJyb3IgLT5GaWxlOicgKyBmTmFtZSArICcgJyArIHJlcUxpc3RbaV0uc3RhdHVzICsgJyAnICsgcmVxTGlzdFtpXS5zdGF0dXNUZXh0KTtcclxuICAgICAgICAvLyBoYW5kbGVyQ291bnQgPSBoYW5kbGVyQ291bnQgLSAxXHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gJ1RpbWVvdXQgRXJyb3InO1xyXG4gICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS5jb2xvciA9ICdyZWQnO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZCgnYmxpbmsnKTtcclxuICAgICAgICByZXNwb25zZVRpbWVvdXRbaV0gPSB0cnVlO1xyXG4gICAgICB9O1xyXG4gICAgICByZXFMaXN0W2ldLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XHJcbiAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQoZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCAqIDEwMCk7XHJcbiAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IHBlcmNlbnRDb21wbGV0ZSArICclJztcclxuICAgICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSBwZXJjZW50Q29tcGxldGUgKyAnJSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICByZXFMaXN0W2ldLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyoqIEFuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgdHJhbnNhY3Rpb24gLT5GaWxlOicgKyBmTmFtZSArICcgJyArIHJlcS5zdGF0dXMgKyAnICcgKyByZXEuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgaGFuZGxlckNvdW50ID0gaGFuZGxlckNvdW50IC0gMTtcclxuICAgICAgICBwZXJjZW50TGFiZWwuaW5uZXJIVE1MID0gJ0Vycm9yJztcclxuICAgICAgICBwZXJjZW50TGFiZWwuc3R5bGUuY29sb3IgPSAncmVkJztcclxuICAgICAgICAkKCcjYWJvcnQnICsgaSkuaGlkZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICByZXFMaXN0W2ldLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBoYW5kbGVyQ291bnQgPSBoYW5kbGVyQ291bnQgLSAxO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2VUaW1lb3V0W2ldKSB7XHJcbiAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgICAgICAgIHBlcmNlbnRMYWJlbC5pbm5lckhUTUwgPSAnMTAwJSc7XHJcbiAgICAgICAgICAkKCcjYWJvcnQnICsgaSkuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaGFuZGxlckNvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAkKFwiI2Rvd25sb2FkLWVuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAkKCcjYnRuQ2FuY2VsQWxsJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAkKCcjcmVmcmVzaCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdGaWxlICcraGFuZGxlckNvdW50KycgZG93bmxvYWRlZCcpO1xyXG4gICAgICB9O1xyXG4gICAgICByZXFMaXN0W2ldLm9ubG9hZHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGhhbmRsZXJDb3VudCA9IGhhbmRsZXJDb3VudCArIDE7XHJcbiAgICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAnMCc7XHJcbiAgICAgICAgcGVyY2VudExhYmVsLmlubmVySFRNTCA9ICcwJSc7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlcUxpc3RbaV0ub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChyZXFMaXN0W2ldLnJlYWR5U3RhdGUgPT09IDQgJiYgcmVxTGlzdFtpXS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgdmFyIGZpbGVuYW1lID0gJyc7XHJcbiAgICAgICAgICB2YXIgZGlzcG9zaXRpb24gPSByZXFMaXN0W2ldLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJyk7XHJcbiAgICAgICAgICBpZiAoZGlzcG9zaXRpb24gJiYgZGlzcG9zaXRpb24uaW5kZXhPZignYXR0YWNobWVudCcpICE9PSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZW5hbWVSZWdleCA9IC9maWxlbmFtZVteOz1cXG5dKj0oKFsnXCJdKS4qP1xcMnxbXjtcXG5dKikvO1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGZpbGVuYW1lUmVnZXguZXhlYyhkaXNwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaGVzICE9IG51bGwgJiYgbWF0Y2hlc1sxXSkgZmlsZW5hbWUgPSBtYXRjaGVzWzFdLnJlcGxhY2UoL1snXCJdL2csICcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciB0eXBlID0gcmVxTGlzdFtpXS5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJyk7XHJcbiAgICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFt0aGlzLnJlc3BvbnNlXSwge1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAvLyBJRSB3b3JrYXJvdW5kIGZvciBcIkhUTUw3MDA3OiBPbmUgb3IgbW9yZSBibG9iIFVSTHMgd2VyZSByZXZva2VkIGJ5IGNsb3NpbmcgdGhlIGJsb2IgZm9yIHdoaWNoIHRoZXkgd2VyZSBjcmVhdGVkLiBUaGVzZSBVUkxzIHdpbGwgbm8gbG9uZ2VyIHJlc29sdmUgYXMgdGhlIGRhdGEgYmFja2luZyB0aGUgVVJMIGhhcyBiZWVuIGZyZWVkLlwiXHJcbiAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihibG9iLCBmaWxlbmFtZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xyXG4gICAgICAgICAgICB2YXIgZG93bmxvYWRVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgICAgLy8gdXNlIEhUTUw1IGFbZG93bmxvYWRdIGF0dHJpYnV0ZSB0byBzcGVjaWZ5IGZpbGVuYW1lXHJcbiAgICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgLy8gc2FmYXJpIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHlldFxyXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgYS5kb3dubG9hZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRvd25sb2FkVXJsO1xyXG4gICAgICAgICAgICAgICAgcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9IGRvd25sb2FkVXJsO1xyXG4gICAgICAgICAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIC8vIHByZWxvYWRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuID0gZG93bmxvYWRVcmw7XHJcbiAgICAgICAgICAgICAgLy8gcHJlbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTChkb3dubG9hZFVybCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7IC8vIGNsZWFudXBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIHJlcUxpc3RbaV0uc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICBjb25zb2xlLmxvZyhjdXJyZW50UGF0aCArICcvJyArIGZpbGVMaXN0W2ldKTtcclxuICAgICAgcmVxTGlzdFtpXS5zZW5kKHNlcmlhbGl6ZU9iamVjdCh7XHJcbiAgICAgICAgJ2ZpbGVuYW1lJzogY3VycmVudFBhdGggKyAnLycgKyBmaWxlTGlzdFtpXVxyXG4gICAgICB9KSk7XHJcbiAgICB9O1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBfbG9vcChpKTtcclxuICAgIH1cclxuICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlZnJlc2hQYXRoID0gKGNQYXRoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnaW5pdCBwYXRoOiAnLCBjUGF0aCk7XHJcbiAgICBsZXQgbmV3SHRtbENvbnRlbnQgPSBgPGxpPjxsYWJlbCBpZD1cImN1cnJlbnRwYXRoXCI+UGF0aDo8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48c3BhbmQ+Jm5ic3A7PC9zcGFuZD48YSBjbGFzcz1cImJyZWFkY3J1bWJcIiBocmVmPVwiIyFcIj4vPC9hPjwvbGk+YDtcclxuICAgIGNvbnNvbGUubG9nKCdjUGF0aCBsZW5naHQ6JywgY1BhdGgubGVuZ3RoKTtcclxuICAgICQoJyN3YWl0aW5nJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgaWYgKGNQYXRoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgJCgnI3dhaXRpbmcnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIGxldCBjUGF0aEFycmF5ID0gY1BhdGguc3BsaXQoJy8nKTtcclxuICAgICAgY29uc29sZS5sb2coJ3JlZnJlc2hQYXRoOmNQYXRoQXJyYXkgJywgY1BhdGhBcnJheSk7XHJcbiAgICAgIGNQYXRoQXJyYXkuZm9yRWFjaCgodmFsLCBpZHgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcclxuICAgICAgICBpZiAodmFsLnRyaW0oKSA9PSAnJykge1xyXG4gICAgICAgICAgaWYgKGlkeCA9PSAwKSB7XHJcbiAgICAgICAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8bGk+PGEgY2xhc3M9XCJicmVhZGNydW1iXCIgaHJlZj1cIiMhXCI+JHt2YWx9PC9hPjwvbGk+YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGlkeCA9PSAxKSB7XHJcbiAgICAgICAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8bGk+PHNwYW5kPiZuYnNwOzwvc3BhbmQ+PGEgY2xhc3M9XCJicmVhZGNydW1iXCIgaHJlZj1cIiMhXCI+JHt2YWx9PC9hPjwvbGk+YDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8bGk+PHNwYW5kPi8mbmJzcDs8L3NwYW5kPjxhIGNsYXNzPVwiYnJlYWRjcnVtYlwiIGhyZWY9XCIjIVwiPiR7dmFsfTwvYT48L2xpPmA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgJCgnI3dhaXRpbmcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgnI2N1cnJlbnRQYXRoJykuaHRtbChuZXdIdG1sQ29udGVudCk7XHJcblxyXG4gICAgJCgnLmJyZWFkY3J1bWInKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBjaGFuZ2VQYXRoKGUudGFyZ2V0LmlubmVyVGV4dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgVG9rZW4pO1xyXG4gICAgbGV0IHJlYWxwYXRoID0gJyc7XHJcbiAgICBpZiAocmVhbFJvb3RQYXRoICE9PSAnLycpIHtcclxuICAgICAgcmVhbHBhdGggPSAnLycgKyByZWFsUm9vdFBhdGggKyBjUGF0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChjUGF0aCA9PSAnLycpIHtcclxuICAgICAgICByZWFscGF0aCA9IGNQYXRoO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlYWxwYXRoID0gcmVhbFJvb3RQYXRoICsgY1BhdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygncmVhbFJvb3RQYXRoOiAnICsgcmVhbFJvb3RQYXRoICsgJyByZWFscGF0aDonICsgcmVhbHBhdGgpO1xyXG4gICAgZmV0Y2goJy9maWxlcz9wYXRoPScgKyBlbmNvZGVVUkkocmVhbHBhdGgpLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgIHRpbWVvdXQ6IDcyMDAwMFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihGZXRjaEhhbmRsZUVycm9ycylcclxuICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcclxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICByZWZyZXNoRmlsZXNUYWJsZShkYXRhKTtcclxuICAgICAgICAkKCcjd2FpdGluZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICQoJyN3YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzZWxlY3RBbGwgPSAoZSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3NlbGVjdEFsbDplICcsZSk7XHJcbiAgICB2YXIgYWxsQ2tlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hlY2snKTtcclxuICAgIGxldCB2ID0gZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIilcclxuICAgICAgLmNoZWNrZWQ7XHJcbiAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsICEoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkpO1xyXG4gICAgY29uc29sZS5sb2coJCh0aGlzKS5pcygnOmNoZWNrZWQnKSk7XHJcbiAgICBhbGxDa2Vja2JveC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XHJcbiAgICAgIGlmICghYWxsQ2tlY2tib3hbaV0uZGlzYWJsZWQpIHtcclxuICAgICAgICBpZiAodiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2coZ2V0Q2hlY2tlZEZpbGVzKCkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdldENoZWNrZWRGaWxlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjaGVja2VkRmlsZXMgPSBbXTtcclxuICAgIHZhciBhbGxFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50eXBlRmlsZScpO1xyXG4gICAgYWxsRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnZWxlbWVudDogJyxlbGVtZW50KTtcclxuICAgICAgY29uc29sZS5sb2coJ2NoaWxkcmVuOiAnLGVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmNoZWNrZWQpO1xyXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uY2hlY2tlZCkge1xyXG4gICAgICAgIGNoZWNrZWRGaWxlcy5wdXNoKGN1cnJlbnRQYXRoICsgJy8nICsgZWxlbWVudC5pbm5lckhUTUwpO1xyXG4gICAgICAgIC8vIGMoZWxlbWVudC5jaGlsZHJlblsxXS5pbm5lckhUTUwpXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNoZWNrZWRGaWxlcztcclxuICB9O1xyXG5cclxuICBjb25zdCBnZXRDaGVja2VkRm9sZGVyID0gZnVuY3Rpb24gZ2V0Q2hlY2tlZEZvbGRlcigpIHtcclxuICAgIHZhciBjaGVja2VkRm9sZGVycyA9IFtdO1xyXG4gICAgdmFyIGFsbEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRhc2hib2FyZC1wYXRoJyk7XHJcbiAgICBhbGxFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XHJcbiAgICAgIHZcclxuICAgICAgICAuY2hpbGRyZW5bMF1cclxuICAgICAgICAuY2hpbGROb2Rlc1xyXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChsLCBpZHgpIHtcclxuICAgICAgICAgIGlmIChsLmNoaWxkcmVuWzBdLmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgY2hlY2tlZEZvbGRlcnMucHVzaChjdXJyZW50UGF0aCArICcvJyArIGwuY2hpbGRyZW5bMl0udGV4dCk7XHJcbiAgICAgICAgICAgIC8vIGMoY3VycmVudFBhdGggKyBsLmNoaWxkcmVuWzJdLnRleHQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjaGVja2VkRm9sZGVycztcclxuICB9O1xyXG5cclxuICBjb25zdCByZW5kZXJGaWxlc1RhYmxlID0gKGFGb2wsIGFGaWwpID0+IHtcclxuICAgIGxldCBuZXdIdG1sQ29udGVudCA9IGBgO1xyXG4gICAgY29uc3QgdGJvZHlDb250ZW50ID0gZG9jdW1lbnRcclxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwidGJsLWZpbGVzXCIpXHJcbiAgICAgIC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXTtcclxuXHJcbiAgICBuZXdIdG1sQ29udGVudCArPSBgPHRyPjx0ZD48c3Bhbj4mbmJzcDs8L3NwYW4+PC90ZD5cclxuICAgICAgICAgICAgICA8dGQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyXCI+PC9pPjxhIGhyZWY9XCIjXCIgaWQ9XCJnb0JhY2tGb2xkZXJcIiBjbGFzcz1cImZpbGUtTmFtZSB0eXBlRm9sZGVyXCI+Li48L2E+PC90ZD5cclxuICAgICAgICAgICAgICA8dGQ+Jm5ic3A7PC90ZD48dGQ+Jm5ic3A7PC90ZD48dGQ+Jm5ic3A7PC90ZD48L3RyPmA7XHJcbiAgICBhRm9sLmZvckVhY2goKHZhbCwgaWR4LCBhcnJheSkgPT4ge1xyXG4gICAgICBuZXdIdG1sQ29udGVudCArPSBgPHRyPjx0ZD48aW5wdXQgY2xhc3M9XCJmaWxsZWQtaW4gY2hlY2tGb2xkZXIgY2hlY2tcIiBpZD1cIiR7dmFsLm5hbWV9XCIgdHlwZT1cImNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3ggbGVmdFwiIGZvcj1cIiR7dmFsLm5hbWV9XCI+PC9sYWJlbD48L3RkPmA7XHJcbiAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8dGQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyXCI+PC9pPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJmaWxlLU5hbWUgdHlwZUZvbGRlclwiPiR7dmFsLm5hbWV9PC9hPjwvdGQ+YDtcclxuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0ZD4mbmJzcDs8L3RkPjx0ZD4mbmJzcDs8L3RkPjx0ZD4ke3ZhbC5kYXRlfTwvdGQ+PC90cj5gO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYUZpbC5mb3JFYWNoKCh2YWwsIGlkeCwgYXJyYXkpID0+IHtcclxuICAgICAgbGV0IGZpbGVTaXplID0gcGFyc2VJbnQodmFsLnNpemUgLyAxMDI0KTtcclxuICAgICAgbmV3SHRtbENvbnRlbnQgKz0gYDx0cj48dGQ+PGlucHV0IGNsYXNzPVwiZmlsbGVkLWluIGNoZWNrRmlsZSBjaGVja1wiIGlkPVwiJHt2YWwubmFtZX1cIiB0eXBlPVwiY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3ggbGVmdFwiIGZvcj1cIiR7dmFsLm5hbWV9XCI+PC9sYWJlbD48L3RkPmA7XHJcbiAgICAgIG5ld0h0bWxDb250ZW50ICs9IGA8dGQ+PGkgY2xhc3M9XCJmYXIgZmEtZmlsZVwiPjwvaT48c3BhbiBjbGFzcz1cInR5cGVGaWxlXCI+JHt2YWwubmFtZX08L3NwYW4+PC90ZD5gO1xyXG4gICAgICBuZXdIdG1sQ29udGVudCArPSBgPHRkPiR7ZmlsZVNpemV9IEtCPC90ZD48dGQ+Jm5ic3A7PC90ZD48dGQ+JHt2YWwuZGF0ZX08L3RkPjwvdHI+YDtcclxuICAgIH0pO1xyXG4gICAgdGJvZHlDb250ZW50LmlubmVySFRNTCA9IG5ld0h0bWxDb250ZW50O1xyXG4gIH07XHJcblxyXG5cclxuICBjb25zdCBnb0JhY2tGb2xkZXIgPSAoZm9sZGVyKSA9PiB7XHJcbiAgICBsZXQgbmV3UGF0aCA9ICcnO1xyXG4gICAgY29uc29sZS5sb2coJ2dvQmFja0ZvbGRlcjpmb2xkZXIgJywgZm9sZGVyKTtcclxuICAgIGNvbnNvbGUubG9nKCdnb0JhY2tGb2xkZXI6Y3VycmVudFBhdGggJywgY3VycmVudFBhdGgpO1xyXG4gICAgaWYgKGN1cnJlbnRQYXRoICE9PSAnLycgJiYgZm9sZGVyID09ICcuLicpIHtcclxuICAgICAgbGV0IGxhc3RGb2xkZXIgPSBjdXJyZW50UGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICBpZiAobGFzdEZvbGRlciA9PSAwKSB7XHJcbiAgICAgICAgbmV3UGF0aCA9ICcvJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdQYXRoID0gY3VycmVudFBhdGguc3Vic3RyKDAsIGxhc3RGb2xkZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdnb0JhY2tGb2xkZXI6bGFzdEZvbGRlci0+ICcgKyBsYXN0Rm9sZGVyICsgJyBnb0JhY2tGb2xkZXI6bmV3UGF0aC0+JyArIG5ld1BhdGgpO1xyXG4gICAgICBjaGFuZ2VQYXRoKG5ld1BhdGgudHJpbSgpKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGNvbnN0IHJlZnJlc2hGaWxlc1RhYmxlID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHRib2R5Q29udGVudCA9IGRvY3VtZW50XHJcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcInRibC1maWxlc1wiKVxyXG4gICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3Rib2R5JylbMF07XHJcblxyXG4gICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICBhRm9sZGVycyA9IFtdO1xyXG4gICAgYUZpbGVzID0gW107XHJcbiAgICBpZiAoZGF0YS5tZXNzYWdlKSByZXR1cm4gbnVsbDtcclxuICAgIGRhdGEuZm9yRWFjaCgodmFsLCBpZHgsIGFycmF5KSA9PiB7XHJcbiAgICAgIGxldCBmaWxlU2l6ZSA9IHBhcnNlSW50KHZhbC5zaXplIC8gMTAyNCk7XHJcbiAgICAgIGlmICh2YWwuaXNGb2xkZXIpIHtcclxuICAgICAgICBhRm9sZGVycy5wdXNoKHtcclxuICAgICAgICAgIG5hbWU6IHZhbC5uYW1lLFxyXG4gICAgICAgICAgZGF0ZTogdmFsLmRhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhRmlsZXMucHVzaCh7XHJcbiAgICAgICAgICBuYW1lOiB2YWwubmFtZSxcclxuICAgICAgICAgIHNpemU6IHZhbC5zaXplLFxyXG4gICAgICAgICAgZGF0ZTogdmFsLmRhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBhRm9sZGVycy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xyXG4gICAgfSk7XHJcbiAgICBhRmlsZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gYS5kYXRlLmxvY2FsZUNvbXBhcmUoYi5kYXRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJlbmRlckZpbGVzVGFibGUoYUZvbGRlcnMsIGFGaWxlcyk7XHJcblxyXG4gICAgJCgnLmZpbGUtTmFtZScpLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICBjb25zb2xlLmxvZygnQ3VycmVudCBQYXRoOiAnLCBjdXJyZW50UGF0aCk7XHJcbiAgICAgIGxldCBuZXdQYXRoID0gJyc7XHJcbiAgICAgIGlmIChlLnRhcmdldC5pbm5lclRleHQgIT0gJy4uJykge1xyXG4gICAgICAgIGlmIChjdXJyZW50UGF0aC50cmltKCkgPT0gJy8nKSB7XHJcbiAgICAgICAgICBuZXdQYXRoID0gY3VycmVudFBhdGgudHJpbSgpICsgZS50YXJnZXQuaW5uZXJUZXh0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXdQYXRoID0gY3VycmVudFBhdGgudHJpbSgpICsgJy8nICsgZS50YXJnZXQuaW5uZXJUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ05ldyBQYXRoOiAnLCBuZXdQYXRoLnRyaW0oKSk7XHJcbiAgICAgICAgcmVmcmVzaFBhdGgobmV3UGF0aC50cmltKCkpO1xyXG4gICAgICAgIGN1cnJlbnRQYXRoID0gbmV3UGF0aC50cmltKCk7XHJcbiAgICAgICAgcmVmcmVzaEJhck1lbnUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoY3VycmVudFBhdGggIT09IFJvb3RQYXRoKSBnb0JhY2tGb2xkZXIoZS50YXJnZXQuaW5uZXJUZXh0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKCcuY2hlY2snKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBzZWxlY3REZXNlbGVjdChlKTtcclxuICAgICAgY29uc29sZS5sb2coZS50YXJnZXQuY2hlY2tlZCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmluZGV4T2YoXCJjaGVja0ZpbGVcIikpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucm93SW5kZXgpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5wYXJlbnROb2RlLmNoaWxkcmVuWzFdLmh0bWxGb3IpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjZ29CYWNrRm9sZGVyJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBnb0JhY2tGb2xkZXIoKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdERlc2VsZWN0ID0gKGUpID0+IHtcclxuICAgIGNvbnN0IGlzQ2hlY2tlZCA9IGUudGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IGUudGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmluZGV4T2YoXCJjaGVja0ZpbGVcIik7XHJcbiAgICBjb25zdCBuYW1lID0gZS50YXJnZXQucGFyZW50Tm9kZS5jaGlsZHJlblsxXS5odG1sRm9yO1xyXG5cclxuICAgIGlmIChjb250ZW50VHlwZSAhPSAtMSkge1xyXG4gICAgICBpZiAoaXNDaGVja2VkKSB7XHJcbiAgICAgICAgYVNlbGVjdGVkRmlsZXMucHVzaChuYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBpZHggPSBhU2VsZWN0ZWRGaWxlcy5pbmRleE9mKG5hbWUpO1xyXG4gICAgICAgIGlmIChpZHggPiAtMSkge1xyXG4gICAgICAgICAgYVNlbGVjdGVkRmlsZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaXNDaGVja2VkKSB7XHJcbiAgICAgICAgYVNlbGVjdGVkRm9sZGVycy5wdXNoKG5hbWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGlkeCA9IGFTZWxlY3RlZEZvbGRlcnMuaW5kZXhPZihuYW1lKTtcclxuICAgICAgICBpZiAoaWR4ID4gLTEpIHtcclxuICAgICAgICAgIGFTZWxlY3RlZEZvbGRlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coYVNlbGVjdGVkRmlsZXMsIGFTZWxlY3RlZEZvbGRlcnMpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNob3dVc2VyUHJvZmlsZSA9ICh3LCBoLCB0KSA9PiB7XHJcbiAgICBsZXQgTW9kYWxUaXRsZSA9IHQ7XHJcbiAgICBsZXQgTW9kYWxDb250ZW50ID0gYDx0YWJsZSBpZD1cInRhYmxlVXNlclByb2ZpbGVcIiBjbGFzcz1cInN0cmlwZWQgaGlnaGxpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5Vc2VyIE5hbWU6PC90ZD48dGQ+JHtVc2VyTmFtZX08L3RkPjwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5Vc2VyIFJvbGU6PC90ZD48dGQ+JHtVc2VyUm9sZX08L3RkPjwvdHI+IFxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+Q29tcGFueSBOYW1lOjwvdGQ+PHRkPiR7Q29tcGFueU5hbWV9PC90ZD48L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQgY29sc3Bhbj1cIjJcIiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyO2JvcmRlci1ib3RvbToxcHggc29saWQgI0NDQ1wiPiZuYnNwOzwvdGQ+PC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IG5ldyBGb2xkZXI6PC90ZD48dGQ+YDtcclxuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dOZXdGb2xkZXIgPT0gJzEnKSA/XHJcbiAgICAgICdBbGxvdycgOlxyXG4gICAgICAnRGVueSc7XHJcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IHJlbmFtZSBGb2xkZXI6PC90ZD48dGQ+YDtcclxuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dSZW5hbWVGb2xkZXIgPT0gJzEnKSA/XHJcbiAgICAgICdBbGxvdycgOlxyXG4gICAgICAnRGVueSc7XHJcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IHJlbmFtZSBGaWxlOjwvdGQ+PHRkPmA7XHJcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93UmVuYW1lRmlsZSA9PSAnMScpID9cclxuICAgICAgJ0FsbG93JyA6XHJcbiAgICAgICdEZW55JztcclxuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgZGVsZXRlIEZvbGRlcjo8L3RkPjx0ZD5gO1xyXG4gICAgTW9kYWxDb250ZW50ICs9IChBbGxvd0RlbGV0ZUZvbGRlciA9PSAnMScpID9cclxuICAgICAgJ0FsbG93JyA6XHJcbiAgICAgICdEZW55JztcclxuICAgIE1vZGFsQ29udGVudCArPSBgPC90ZD48L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+QWxsb3cgZGVsZXRlIEZpbGU6PC90ZD48dGQ+YDtcclxuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dEZWxldGVGaWxlID09ICcxJykgP1xyXG4gICAgICAnQWxsb3cnIDpcclxuICAgICAgJ0RlbnknO1xyXG4gICAgTW9kYWxDb250ZW50ICs9IGA8L3RkPjwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPjx0ZD5BbGxvdyBVcGxvYWQ6PC90ZD48dGQ+YDtcclxuICAgIE1vZGFsQ29udGVudCArPSAoQWxsb3dVcGxvYWQgPT0gJzEnKSA/XHJcbiAgICAgICdBbGxvdycgOlxyXG4gICAgICAnRGVueSc7XHJcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPkFsbG93IERvd25sb2FkOjwvdGQ+PHRkPmA7XHJcbiAgICBNb2RhbENvbnRlbnQgKz0gKEFsbG93RG93bmxvYWQgPT0gJzEnKSA/XHJcbiAgICAgICdBbGxvdycgOlxyXG4gICAgICAnRGVueSc7XHJcbiAgICBNb2RhbENvbnRlbnQgKz0gYDwvdGQ+PC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+YDtcclxuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjaG9sYVwiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiTW9kYWxDbG9zZVwiIGhyZWY9XCIjIVwiPkNsb3NlPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgIGA7XHJcbiAgICAkKCcjbW9kYWwnKVxyXG4gICAgICAuaHRtbChodG1sQ29udGVudClcclxuICAgICAgLmNzcygnd2lkdGg6ICcgKyB3ICsgJyU7aGVpZ2h0OiAnICsgaCArICdweDsnKTtcclxuICAgICQoJyNtb2RhbCcpLnNob3coKTtcclxuICAgICQoJyNsZWFuLW92ZXJsYXknKS5zaG93KCk7XHJcbiAgICAkKCcjTW9kYWxDbG9zZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjbW9kYWxDbG9zZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgJCgnI21vZGFsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuICBjb25zdCBzaG93TmV3Rm9sZGVyID0gKHcsIGgsIHQpID0+IHtcclxuICAgIGxldCBNb2RhbFRpdGxlID0gdDtcclxuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cIm5ld0ZvbGRlck5hbWVcIiB0eXBlPVwidGV4dFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibmV3Rm9sZGVyTmFtZVwiPk5ldyBGb2xkZXIgTmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XHJcbiAgICBsZXQgaHRtbENvbnRlbnQgPSBgPGRpdiBpZD1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDU+JHtNb2RhbFRpdGxlfTwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWxfY2xvc2VcIiBpZD1cIm1vZGFsQ2xvc2VcIiBocmVmPVwiI1wiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiTW9kYWxDbG9zZVwiIGhyZWY9XCIjIVwiPkNsb3NlPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cIkFjY2VwdE5ld0ZvbGRlclwiIGhyZWY9XCIjIVwiPkFjY2VwdDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICBgO1xyXG4gICAgJCgnI21vZGFsJylcclxuICAgICAgLmh0bWwoaHRtbENvbnRlbnQpXHJcbiAgICAgIC5jc3MoJ3dpZHRoOiAnICsgdyArICclO2hlaWdodDogJyArIGggKyAncHg7dGV4dC1hbGlnbjogY2VudGVyOycpO1xyXG4gICAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xyXG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcclxuICAgICQoJyNtb2RhbCcpLnNob3coKTtcclxuICAgICQoJyNsZWFuLW92ZXJsYXknKS5zaG93KCk7XHJcbiAgICAkKCcjQWNjZXB0TmV3Rm9sZGVyJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgbmV3Rm9sZGVyTmFtZSA9ICQoJyNuZXdGb2xkZXJOYW1lJykudmFsKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKG5ld0ZvbGRlck5hbWUpO1xyXG4gICAgICBuZXdGb2xkZXIobmV3Rm9sZGVyTmFtZSk7XHJcbiAgICB9KTtcclxuICAgICQoJyNtb2RhbENsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XHJcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgICQoJyNNb2RhbENsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XHJcbiAgICAgICQoJyNsZWFuLW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzaG93Q2hhbmdlVXNlclBhc3N3b3JkID0gKHcsIGgsIHQpID0+IHtcclxuICAgIGxldCBNb2RhbFRpdGxlID0gdDtcclxuICAgIGxldCBNb2RhbENvbnRlbnQgPSBgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cIm5ld3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJuZXdwYXNzd29yZFwiPk5ldyBQYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGQgY29sIHMxMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cIm5ld3Bhc3N3b3JkMlwiIHR5cGU9XCJwYXNzd29yZFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibmV3cGFzc3dvcmQyXCI+UmVwZWF0IFBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcclxuICAgIGxldCBodG1sQ29udGVudCA9IGA8ZGl2IGlkPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNT4ke01vZGFsVGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbF9jbG9zZVwiIGlkPVwibW9kYWxDbG9zZVwiIGhyZWY9XCIjaG9sYVwiPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+JHtNb2RhbENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2Ugd2F2ZXMtZWZmZWN0IHdhdmVzLXRlYWwgYnRuLWZsYXQgYnRuMi11bmlmeVwiIGlkPVwiTW9kYWxDbG9zZVwiIGhyZWY9XCIjIVwiPkNsb3NlPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibW9kYWwtYWN0aW9uIG1vZGFsLWNsb3NlIHdhdmVzLWVmZmVjdCB3YXZlcy10ZWFsIGJ0bi1mbGF0IGJ0bjItdW5pZnlcIiBpZD1cIkFjY2VwdENoYW5nZVVzZXJQYXNzd29yZFwiIGhyZWY9XCIjIVwiPkFjY2VwdDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICBgO1xyXG4gICAgJCgnI21vZGFsJylcclxuICAgICAgLmh0bWwoaHRtbENvbnRlbnQpXHJcbiAgICAgIC5jc3MoJ3dpZHRoOiAnICsgdyArICclO2hlaWdodDogJyArIGggKyAncHg7dGV4dC1hbGlnbjogY2VudGVyOycpO1xyXG4gICAgLy8kKCcubW9kYWwtY29udGVudCcpLmNzcygnd2lkdGg6IDM1MHB4OycpO1xyXG4gICAgJCgnLm1vZGFsJykuY3NzKCd3aWR0aDogNDAlICFpbXBvcnRhbnQnKTtcclxuICAgICQoJyNtb2RhbCcpLnNob3coKTtcclxuICAgICQoJyNsZWFuLW92ZXJsYXknKS5zaG93KCk7XHJcbiAgICAkKCcjQWNjZXB0Q2hhbmdlVXNlclBhc3N3b3JkJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgdXNlcm5hbWUgPSBVc2VyTmFtZTtcclxuICAgICAgbGV0IG5ld3Bhc3N3b3JkID0gJCgnI25ld3Bhc3N3b3JkJykudmFsKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHVzZXJuYW1lLCBuZXdwYXNzd29yZCk7XHJcbiAgICAgIGFqYXgoe1xyXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICB1cmw6ICcvY2hhbmdlcGFzc3dkJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICBuZXdwYXNzd29yZDogQmFzZTY0LmVuY29kZShtZDUobmV3cGFzc3dvcmQpKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWpheHRpbWVvdXQ6IDQwMDAwLFxyXG4gICAgICAgIGJlZm9yZVNlbmQ6ICgpID0+IHtcclxuICAgICAgICAgIC8qIHdhaXRpbmcuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWl0aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCgnYWN0aXZlJykgKi9cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04ucGFyc2UoZGF0YSkpXHJcbiAgICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICBzdGF0dXMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VcclxuICAgICAgICAgIH0gPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXR1cycsIHN0YXR1cyk7XHJcbiAgICAgICAgICBpZiAoc3RhdHVzID09PSAnRkFJTCcpIHtcclxuICAgICAgICAgICAgTS50b2FzdCh7XHJcbiAgICAgICAgICAgICAgaHRtbDogbWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZFxyXG4gICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCcjbWVzc2FnZScpXHJcbiAgICAgICAgICAgICAgLmlubmVySFRNTCA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBNLnRvYXN0KHtcclxuICAgICAgICAgICAgICBodG1sOiBtZXNzYWdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBsZXRlOiAoeGhyLCBzdGF0dXMpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHhociwgc3RhdHVzKTtcclxuICAgICAgICAgIC8vd2FpdGluZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAkKCcjbW9kYWwnKS5oaWRlKCk7XHJcbiAgICAgICAgICAkKCcjbGVhbi1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3I6ICh4aHIsIGVycikgPT4ge1xyXG4gICAgICAgICAgTS50b2FzdCh7XHJcbiAgICAgICAgICAgIGh0bWw6ICdXcm9uZyBwYXNzd29yZCdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgaWYgKGVyciA9PT0gJ3RpbWVvdXQnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaW1lb3V0IEVycm9yJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIsIGVycik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgJCgnI21vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcclxuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gICAgJCgnI01vZGFsQ2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICQoJyNtb2RhbCcpLmhpZGUoKTtcclxuICAgICAgJCgnI2xlYW4tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGxldCByZWZyZXNoQmFyTWVudSA9ICgpID0+IHtcclxuICAgIGlmIChBbGxvd05ld0ZvbGRlciA9PT0gJzEnKSB7XHJcbiAgICAgICQoJyNOZXdGb2xkZXInKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNOZXdGb2xkZXInKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgIH1cclxuICAgIGlmIChBbGxvd0RlbGV0ZUZvbGRlciA9PT0gJzEnICYmIEFsbG93RGVsZXRlRmlsZSA9PT0gJzEnKSB7XHJcbiAgICAgICQoJyNkZWxldGUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNkZWxldGUnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgJCgnI2RlbGV0ZScpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgfVxyXG4gICAgaWYgKEFsbG93UmVuYW1lRm9sZGVyID09PSAnMScgJiYgQWxsb3dSZW5hbWVGaWxlID09PSAnMScpIHtcclxuICAgICAgJCgnI3JlbmFtZScpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI3JlbmFtZScpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAkKCcjcmVuYW1lJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoQWxsb3dVcGxvYWQgPT0gJzEnKSB7XHJcbiAgICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyN1cGxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQWxsb3dEb3dubG9hZCA9PSAnMScpIHtcclxuICAgICAgJCgnI2Rvd25sb2FkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjZG93bmxvYWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgIH1cclxuICAgIGlmIChVc2VyUm9sZSA9PSAnYWRtaW4nKSB7XHJcbiAgICAgICQoJyNzZXR0aW5ncycpLnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNzZXR0aW5ncycpLmhpZGUoKTtcclxuICAgIH1cclxuICAgICQoJyNtb2RhbHRyaWdnZXInKS5odG1sKFVzZXJOYW1lKTtcclxuICAgICQoJyNtb2RhbHRyaWdnZXInKS5sZWFuTW9kYWwoe1xyXG4gICAgICB0b3A6IDExMCxcclxuICAgICAgb3ZlcmxheTogMC40NSxcclxuICAgICAgY2xvc2VCdXR0b246IFwiLmhpZGVtb2RhbFwiXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAkKCcjc2VsZWN0QWxsRmlsZXMnKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc29sZS5sb2coJ2lzQ2hlY2tlZDogJywkKGUpLmlzKCc6Y2hlY2tlZCcpKTtcclxuICAgICQoZSkucHJvcCgnY2hlY2tlZCcsJChlKS5pcygnOmNoZWNrZWQnKSA/IG51bGw6J2NoZWNrZWQnKTtcclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIikuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIikucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJyk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygnc2VsZWN0QWxsRmlsZXM6Y2xpY2sgJyxkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdEFsbEZpbGVzXCIpLmNoZWNrZWQpO1xyXG4gICAgc2VsZWN0QWxsKGUudGFyZ2V0Lmh0bWxGb3IpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuaWQpO1xyXG4gICAgY29uc29sZS5sb2coJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSk7XHJcblxyXG4gICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgIHN3aXRjaCAodGhpcy5pZCkge1xyXG4gICAgICAgIGNhc2UgJ3NldHRpbmdzJzpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3VzZXJ0cmlnZ2VyJzpcclxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygkKCcjVXNlcnNkcm9wZG93bicpLmNzcygnZGlzcGxheScpKTtcclxuICAgICAgICAgIGlmICgkKCcjVXNlcnNkcm9wZG93bicpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XHJcbiAgICAgICAgICAgICQoJyN1c2VydHJpZ2dlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJyN1c2VydHJpZ2dlcicpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLnNob3coKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3JlZnJlc2gnOlxyXG4gICAgICAgICAgcmVmcmVzaFBhdGgoY3VycmVudFBhdGgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAndXNlckxvZ291dCc6XHJcbiAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcclxuICAgICAgICAgICQoJyNsb2dvdXRtb2RhbCcpLnNob3coKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ01vZGFsVXNlckxvZ291dCc6XHJcbiAgICAgICAgICAkKCcjbG9nb3V0bW9kYWwnKS5oaWRlKCk7XHJcbiAgICAgICAgICBsb2dvdXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3VzZXJDaGFuZ2VQYXNzd29yZCc6XHJcbiAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcclxuICAgICAgICAgIHNob3dDaGFuZ2VVc2VyUGFzc3dvcmQoMzIsIDQ0MCwgJ0NoYW5nZSBVc2VyIFBhc3N3b3JkJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICd1c2VyUHJvZmlsZSc6XHJcbiAgICAgICAgICAkKCcjVXNlcnNkcm9wZG93bicpLmhpZGUoKTtcclxuICAgICAgICAgIHNob3dVc2VyUHJvZmlsZSg0MCwgNDQwLCAnVXNlciBQcm9maWxlJyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdsb2dvdXRNb2RhbENsb3NlJzpcclxuICAgICAgICBjYXNlICdjYW5jZWwnOlxyXG4gICAgICAgICAgJCgnI2xvZ291dG1vZGFsJykuaGlkZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnaG9tZSc6XHJcbiAgICAgICAgICBjdXJyZW50UGF0aCA9IFJvb3RQYXRoO1xyXG4gICAgICAgICAgcmVmcmVzaFBhdGgoY3VycmVudFBhdGgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbmV3Rm9sZGVyJzpcclxuICAgICAgICAgIHNob3dOZXdGb2xkZXIoMzIsIDQ0MCwgJ05ldyBGb2xkZXInKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2RlbGV0ZSc6XHJcbiAgICAgICAgICBkZWxldGVTZWxlY3RlZCgpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICd1cGxvYWQnOlxyXG4gICAgICAgICAgdXBsb2FkKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdkb3dubG9hZCc6XHJcbiAgICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoYVNlbGVjdGVkRmlsZXMubGVuZ3RoID4gNSkge1xyXG4gICAgICAgICAgICAgIE0udG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgaHRtbDogJ05vIHNlIHB1ZWRlbiBkZXNjYXJnYXIgbcOhcyBkZSA1IGFyY2hpdm9zIGEgbGEgdmV6J1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvd25sb2FkKGFTZWxlY3RlZEZpbGVzLCAnRmlsZScpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgTS50b2FzdCh7XHJcbiAgICAgICAgICAgICAgaHRtbDogJ05vIHNlIGhhbiBzZWxlY2Npb25hZG8gYXJjaGl2b3MgcGFyYSBkZXNjYXJnYXInXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIE0udG9hc3Qoe1xyXG4gICAgICAgIGh0bWw6ICdPcGNpb24gbm8gcGVybWl0aWRhJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuICAkKCcjdXNlcnRyaWdnZXInKVxyXG4gICAgLmh0bWwoVXNlck5hbWUpXHJcbiAgICAuYXR0cigndGl0bGUnLCAnRW1wcmVzYTogJyArIENvbXBhbnlOYW1lKTtcclxuXHJcbiAgJCgnI3NldHRpbmdzJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdzZXR0aW5nIGxlZnQ6JywkKGUudGFyZ2V0KS5wb3NpdGlvbigpLmxlZnQpO1xyXG4gICAgY29uc29sZS5sb2coJ3NldHRpbmdkcm9wZG93biBsZWZ0OicsJCgnI1NldHRpbmdkcm9wZG93bicpLmNzcygnbGVmdCcpKTtcclxuICAgIGNvbnNvbGUubG9nKCQoJyNTZXR0aW5nZHJvcGRvd24nKS5jc3MoJ2Rpc3BsYXknKSk7XHJcbiAgICBsZXQgcG9zaXRpb24gPSBwYXJzZUludCgkKGUudGFyZ2V0KS5wb3NpdGlvbigpLmxlZnQpO1xyXG4gICAgaWYgKCQoJyNTZXR0aW5nZHJvcGRvd24nKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAkKCcjc2V0dGluZ3MnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgJCgnI1NldHRpbmdkcm9wZG93bicpLnJlbW92ZUNsYXNzKCdzZXR0aW5nJykuaGlkZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI3NldHRpbmdzJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICQoJyNTZXR0aW5nZHJvcGRvd24nKS5hZGRDbGFzcygnc2V0dGluZycpLnNob3coKTtcclxuICAgICAgJCgnI1NldHRpbmdkcm9wZG93bicpLmNzcygnbGVmdCcsIHBvc2l0aW9uICk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgJCgnI1VzZXJzZHJvcGRvd24nKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICQoJyNVc2Vyc2Ryb3Bkb3duJykuaGlkZSgpO1xyXG4gICAgJCgnI3VzZXJ0cmlnZ2VyJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgfSk7XHJcbiAgJCgnI1NldHRpbmdkcm9wZG93bicpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgJCgnI1NldHRpbmdkcm9wZG93bicpLmhpZGUoKTtcclxuICAgICQoJyNzZXR0aW5ncycpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gIH0pO1xyXG4gIHJlZnJlc2hQYXRoKGN1cnJlbnRQYXRoKTtcclxuICByZWZyZXNoQmFyTWVudSgpO1xyXG4gIGNvbnNvbGUubG9nKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0QWxsRmlsZXNcIikuY2hlY2tlZCk7XHJcbn0pO1xyXG4iLCJ2YXIgdHlwZVxyXG50cnkge1xyXG4gIHR5cGUgPSByZXF1aXJlKCd0eXBlLW9mJylcclxufSBjYXRjaCAoZXgpIHtcclxuICAgIC8vIGhpZGUgZnJvbSBicm93c2VyaWZ5XHJcbiAgdmFyIHIgPSByZXF1aXJlXHJcbiAgdHlwZSA9IHIoJ3R5cGUnKVxyXG59XHJcblxyXG52YXIganNvbnBJRCA9IDBcclxudmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50XHJcbnZhciBrZXlcclxudmFyIG5hbWVcclxuICAgIC8vIHZhciByc2NyaXB0ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2lcclxudmFyIHNjcmlwdFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC9qYXZhc2NyaXB0L2lcclxudmFyIHhtbFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC94bWwvaVxyXG52YXIganNvblR5cGUgPSAnYXBwbGljYXRpb24vanNvbidcclxudmFyIGh0bWxUeXBlID0gJ3RleHQvaHRtbCdcclxudmFyIGJsYW5rUkUgPSAvXlxccyokL1xyXG5cclxudmFyIGFqYXggPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgdmFyIHNldHRpbmdzID0gZXh0ZW5kKHt9LCBvcHRpb25zIHx8IHt9KVxyXG4gIGZvciAoa2V5IGluIGFqYXguc2V0dGluZ3MpIHsgaWYgKHNldHRpbmdzW2tleV0gPT09IHVuZGVmaW5lZCkgc2V0dGluZ3Nba2V5XSA9IGFqYXguc2V0dGluZ3Nba2V5XSB9XHJcblxyXG4gIGFqYXhTdGFydChzZXR0aW5ncylcclxuXHJcbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikge1xyXG4gICAgc2V0dGluZ3MuY3Jvc3NEb21haW4gPSAvXihbXFx3LV0rOik/XFwvXFwvKFteXFwvXSspLy50ZXN0KHNldHRpbmdzLnVybCkgJiZcclxuICAgICAgICAgICAgUmVnRXhwLiQyICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdFxyXG4gIH1cclxuXHJcbiAgdmFyIGRhdGFUeXBlID0gc2V0dGluZ3MuZGF0YVR5cGVcclxuICB2YXIgaGFzUGxhY2Vob2xkZXIgPSAvPVxcPy8udGVzdChzZXR0aW5ncy51cmwpXHJcbiAgaWYgKGRhdGFUeXBlID09PSAnanNvbnAnIHx8IGhhc1BsYWNlaG9sZGVyKSB7XHJcbiAgICBpZiAoIWhhc1BsYWNlaG9sZGVyKSBzZXR0aW5ncy51cmwgPSBhcHBlbmRRdWVyeShzZXR0aW5ncy51cmwsICdjYWxsYmFjaz0/JylcclxuICAgIHJldHVybiBhamF4LkpTT05QKHNldHRpbmdzKVxyXG4gIH1cclxuXHJcbiAgaWYgKCFzZXR0aW5ncy51cmwpIHNldHRpbmdzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpXHJcbiAgc2VyaWFsaXplRGF0YShzZXR0aW5ncylcclxuXHJcbiAgdmFyIG1pbWUgPSBzZXR0aW5ncy5hY2NlcHRzW2RhdGFUeXBlXVxyXG4gIHZhciBiYXNlSGVhZGVycyA9IHt9XHJcbiAgdmFyIHByb3RvY29sID0gL14oW1xcdy1dKzopXFwvXFwvLy50ZXN0KHNldHRpbmdzLnVybCkgPyBSZWdFeHAuJDEgOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2xcclxuICB2YXIgeGhyID0gYWpheC5zZXR0aW5ncy54aHIoKVxyXG4gIHZhciBhYm9ydFRpbWVvdXRcclxuXHJcbiAgaWYgKHNldHRpbmdzLmFqYXh0aW1lb3V0KSB4aHIudGltZW91dCA9IHNldHRpbmdzLmFqYXh0aW1lb3V0XHJcbiAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikgYmFzZUhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXSA9ICdYTUxIdHRwUmVxdWVzdCdcclxuICBpZiAobWltZSkge1xyXG4gICAgYmFzZUhlYWRlcnNbJ0FjY2VwdCddID0gbWltZVxyXG4gICAgaWYgKG1pbWUuaW5kZXhPZignLCcpID4gLTEpIG1pbWUgPSBtaW1lLnNwbGl0KCcsJywgMilbMF1cclxuICAgIHhoci5vdmVycmlkZU1pbWVUeXBlICYmIHhoci5vdmVycmlkZU1pbWVUeXBlKG1pbWUpXHJcbiAgfVxyXG4gIGlmIChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAoc2V0dGluZ3MuZGF0YSAmJiBzZXR0aW5ncy50eXBlLnRvVXBwZXJDYXNlKCkgIT09ICdHRVQnKSkgeyBiYXNlSGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIH1cclxuICBzZXR0aW5ncy5oZWFkZXJzID0gZXh0ZW5kKGJhc2VIZWFkZXJzLCBzZXR0aW5ncy5oZWFkZXJzIHx8IHt9KVxyXG4gIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzKVxyXG4gIH1cclxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXHJcbiAgICAgIHZhciByZXN1bHRcclxuICAgICAgdmFyIGVycm9yID0gZmFsc2VcclxuICAgICAgaWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09PSAzMDQgfHwgKHhoci5zdGF0dXMgPT09IDAgJiYgcHJvdG9jb2wgPT09ICdmaWxlOicpKSB7XHJcbiAgICAgICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBtaW1lVG9EYXRhVHlwZSh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKVxyXG4gICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gJ3NjcmlwdCcpKDEsIGV2YWwpKHJlc3VsdClcclxuICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09PSAneG1sJykgcmVzdWx0ID0geGhyLnJlc3BvbnNlWE1MXHJcbiAgICAgICAgICBlbHNlIGlmIChkYXRhVHlwZSA9PT0gJ2pzb24nKSByZXN1bHQgPSBibGFua1JFLnRlc3QocmVzdWx0KSA/IG51bGwgOiBKU09OLnBhcnNlKHJlc3VsdClcclxuICAgICAgICB9IGNhdGNoIChlKSB7IGVycm9yID0gZSB9XHJcblxyXG4gICAgICAgIGlmIChlcnJvcikgYWpheEVycm9yKGVycm9yLCAncGFyc2VyZXJyb3InLCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICAgIGVsc2UgYWpheFN1Y2Nlc3MocmVzdWx0LCB4aHIsIHNldHRpbmdzKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzICE9PSAwKSB7XHJcbiAgICAgICAgICBhamF4RXJyb3IobnVsbCwgJ2Vycm9yJywgeGhyLCBzZXR0aW5ncylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhc3luYyA9ICdhc3luYycgaW4gc2V0dGluZ3MgPyBzZXR0aW5ncy5hc3luYyA6IHRydWVcclxuICB4aHIub3BlbihzZXR0aW5ncy50eXBlLCBzZXR0aW5ncy51cmwsIGFzeW5jKVxyXG5cclxuICBmb3IgKG5hbWUgaW4gc2V0dGluZ3MuaGVhZGVycykgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgc2V0dGluZ3MuaGVhZGVyc1tuYW1lXSlcclxuXHJcbiAgaWYgKGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpID09PSBmYWxzZSkge1xyXG4gICAgeGhyLmFib3J0KClcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgICAvKiBpZiAoc2V0dGluZ3MudGltZW91dCA+IDApIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGVtcHR5XHJcbiAgICAgICAgeGhyLmFib3J0KClcclxuICAgICAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzKVxyXG4gICAgfSwgc2V0dGluZ3MudGltZW91dCkgKi9cclxuXHJcbiAgICAvLyBhdm9pZCBzZW5kaW5nIGVtcHR5IHN0cmluZyAoIzMxOSlcclxuICB4aHIuc2VuZChzZXR0aW5ncy5kYXRhID8gc2V0dGluZ3MuZGF0YSA6IG51bGwpXHJcbiAgcmV0dXJuIHhoclxyXG59XHJcblxyXG4vLyB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IGFuZCByZXR1cm4gZmFsc2UgaWYgaXQgd2FzIGNhbmNlbGxlZFxyXG5mdW5jdGlvbiB0cmlnZ2VyQW5kUmV0dXJuIChjb250ZXh0LCBldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIC8vIHRvZG86IEZpcmUgb2ZmIHNvbWUgZXZlbnRzXHJcbiAgICAvLyB2YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50TmFtZSlcclxuICAgIC8vICQoY29udGV4dCkudHJpZ2dlcihldmVudCwgZGF0YSlcclxuICByZXR1cm4gdHJ1ZSAvLyEgZXZlbnQuZGVmYXVsdFByZXZlbnRlZFxyXG59XHJcblxyXG4vLyB0cmlnZ2VyIGFuIEFqYXggXCJnbG9iYWxcIiBldmVudFxyXG5mdW5jdGlvbiB0cmlnZ2VyR2xvYmFsIChzZXR0aW5ncywgY29udGV4dCwgZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCkgcmV0dXJuIHRyaWdnZXJBbmRSZXR1cm4oY29udGV4dCB8fCBkb2N1bWVudCwgZXZlbnROYW1lLCBkYXRhKVxyXG59XHJcblxyXG4vLyBOdW1iZXIgb2YgYWN0aXZlIEFqYXggcmVxdWVzdHNcclxuYWpheC5hY3RpdmUgPSAwXHJcblxyXG5mdW5jdGlvbiBhamF4U3RhcnQgKHNldHRpbmdzKSB7XHJcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiBhamF4LmFjdGl2ZSsrID09PSAwKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0YXJ0JylcclxufVxyXG5cclxuZnVuY3Rpb24gYWpheFN0b3AgKHNldHRpbmdzKSB7XHJcbiAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiAhKC0tYWpheC5hY3RpdmUpKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0b3AnKVxyXG59XHJcblxyXG4vLyB0cmlnZ2VycyBhbiBleHRyYSBnbG9iYWwgZXZlbnQgXCJhamF4QmVmb3JlU2VuZFwiIHRoYXQncyBsaWtlIFwiYWpheFNlbmRcIiBidXQgY2FuY2VsYWJsZVxyXG5mdW5jdGlvbiBhamF4QmVmb3JlU2VuZCAoeGhyLCBzZXR0aW5ncykge1xyXG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxyXG4gIGlmIChzZXR0aW5ncy5iZWZvcmVTZW5kLmNhbGwoY29udGV4dCwgeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlIHx8XHJcbiAgICAgICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhCZWZvcmVTZW5kJywgW3hociwgc2V0dGluZ3NdKSA9PT0gZmFsc2UpIHsgcmV0dXJuIGZhbHNlIH1cclxuXHJcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTZW5kJywgW3hociwgc2V0dGluZ3NdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBhamF4U3VjY2VzcyAoZGF0YSwgeGhyLCBzZXR0aW5ncykge1xyXG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxyXG4gIHZhciBzdGF0dXMgPSAnc3VjY2VzcydcclxuICBzZXR0aW5ncy5zdWNjZXNzLmNhbGwoY29udGV4dCwgZGF0YSwgc3RhdHVzLCB4aHIpXHJcbiAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTdWNjZXNzJywgW3hociwgc2V0dGluZ3MsIGRhdGFdKVxyXG4gIGFqYXhDb21wbGV0ZShzdGF0dXMsIHhociwgc2V0dGluZ3MpXHJcbn1cclxuLy8gdHlwZTogXCJ0aW1lb3V0XCIsIFwiZXJyb3JcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcclxuZnVuY3Rpb24gYWpheEVycm9yIChlcnJvciwgdHlwZSwgeGhyLCBzZXR0aW5ncykge1xyXG4gIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxyXG4gIHNldHRpbmdzLmVycm9yLmNhbGwoY29udGV4dCwgeGhyLCB0eXBlLCBlcnJvcilcclxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEVycm9yJywgW3hociwgc2V0dGluZ3MsIGVycm9yXSlcclxuICBhamF4Q29tcGxldGUodHlwZSwgeGhyLCBzZXR0aW5ncylcclxufVxyXG4vLyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBcIm5vdG1vZGlmaWVkXCIsIFwiZXJyb3JcIiwgXCJ0aW1lb3V0XCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXHJcbmZ1bmN0aW9uIGFqYXhDb21wbGV0ZSAoc3RhdHVzLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XHJcbiAgc2V0dGluZ3MuY29tcGxldGUuY2FsbChjb250ZXh0LCB4aHIsIHN0YXR1cylcclxuICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheENvbXBsZXRlJywgW3hociwgc2V0dGluZ3NdKVxyXG4gIGFqYXhTdG9wKHNldHRpbmdzKVxyXG59XHJcblxyXG4vLyBFbXB0eSBmdW5jdGlvbiwgdXNlZCBhcyBkZWZhdWx0IGNhbGxiYWNrXHJcbmZ1bmN0aW9uIGVtcHR5ICgpIHt9XHJcblxyXG5hamF4LkpTT05QID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICBpZiAoISgndHlwZScgaW4gb3B0aW9ucykpIHJldHVybiBhamF4KG9wdGlvbnMpXHJcbiAgdmFyIGNhbGxiYWNrTmFtZSA9ICdqc29ucCcgKyAoKytqc29ucElEKVxyXG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxyXG4gIHZhciBhYm9ydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyB0b2RvOiByZW1vdmUgc2NyaXB0XHJcbiAgICAgICAgLy8gJChzY3JpcHQpLnJlbW92ZSgpXHJcbiAgICBpZiAoY2FsbGJhY2tOYW1lIGluIHdpbmRvdykgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBlbXB0eVxyXG4gICAgYWpheENvbXBsZXRlKCdhYm9ydCcsIHhociwgb3B0aW9ucylcclxuICB9XHJcbiAgdmFyIHhociA9IHsgYWJvcnQ6IGFib3J0IH1cclxuICB2YXIgYWJvcnRUaW1lb3V0XHJcbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdIHx8XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcblxyXG4gIGlmIChvcHRpb25zLmVycm9yKSB7XHJcbiAgICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgeGhyLmFib3J0KClcclxuICAgICAgb3B0aW9ucy5lcnJvcigpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxyXG4gICAgICAgICAgICAvLyB0b2RvOiByZW1vdmUgc2NyaXB0XHJcbiAgICAgICAgICAgIC8vICQoc2NyaXB0KS5yZW1vdmUoKVxyXG4gICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja05hbWVdXHJcbiAgICBhamF4U3VjY2VzcyhkYXRhLCB4aHIsIG9wdGlvbnMpXHJcbiAgfVxyXG5cclxuICBzZXJpYWxpemVEYXRhKG9wdGlvbnMpXHJcbiAgc2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsLnJlcGxhY2UoLz1cXD8vLCAnPScgKyBjYWxsYmFja05hbWUpXHJcblxyXG4gICAgLy8gVXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIGFwcGVuZENoaWxkIHRvIGNpcmN1bXZlbnQgYW4gSUU2IGJ1Zy5cclxuICAgIC8vIFRoaXMgYXJpc2VzIHdoZW4gYSBiYXNlIG5vZGUgaXMgdXNlZCAoc2VlIGpRdWVyeSBidWdzICMyNzA5IGFuZCAjNDM3OCkuXHJcbiAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQpXHJcblxyXG4gIGlmIChvcHRpb25zLnRpbWVvdXQgPiAwKSB7XHJcbiAgICBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgeGhyLmFib3J0KClcclxuICAgICAgYWpheENvbXBsZXRlKCd0aW1lb3V0JywgeGhyLCBvcHRpb25zKVxyXG4gICAgfSwgb3B0aW9ucy50aW1lb3V0KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHhoclxyXG59XHJcblxyXG5hamF4LnNldHRpbmdzID0ge1xyXG4gICAgLy8gRGVmYXVsdCB0eXBlIG9mIHJlcXVlc3RcclxuICB0eXBlOiAnR0VUJyxcclxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgYmVmb3JlIHJlcXVlc3RcclxuICBiZWZvcmVTZW5kOiBlbXB0eSxcclxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZHNcclxuICBzdWNjZXNzOiBlbXB0eSxcclxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgdGhlIHRoZSBzZXJ2ZXIgZHJvcHMgZXJyb3JcclxuICBlcnJvcjogZW1wdHksXHJcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIG9uIHJlcXVlc3QgY29tcGxldGUgKGJvdGg6IGVycm9yIGFuZCBzdWNjZXNzKVxyXG4gIGNvbXBsZXRlOiBlbXB0eSxcclxuICAgIC8vIFRoZSBjb250ZXh0IGZvciB0aGUgY2FsbGJhY2tzXHJcbiAgY29udGV4dDogbnVsbCxcclxuICAgIC8vIFdoZXRoZXIgdG8gdHJpZ2dlciBcImdsb2JhbFwiIEFqYXggZXZlbnRzXHJcbiAgZ2xvYmFsOiB0cnVlLFxyXG4gICAgLy8gVHJhbnNwb3J0XHJcbiAgeGhyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXHJcbiAgfSxcclxuICAgIC8vIE1JTUUgdHlwZXMgbWFwcGluZ1xyXG4gIGFjY2VwdHM6IHtcclxuICAgIHNjcmlwdDogJ3RleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCcsXHJcbiAgICBqc29uOiBqc29uVHlwZSxcclxuICAgIHhtbDogJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnLFxyXG4gICAgaHRtbDogaHRtbFR5cGUsXHJcbiAgICB0ZXh0OiAndGV4dC9wbGFpbidcclxuICB9LFxyXG4gICAgLy8gV2hldGhlciB0aGUgcmVxdWVzdCBpcyB0byBhbm90aGVyIGRvbWFpblxyXG4gIGNyb3NzRG9tYWluOiBmYWxzZSxcclxuICAgIC8vIERlZmF1bHQgdGltZW91dFxyXG4gIHRpbWVvdXQ6IDBcclxufVxyXG5cclxuZnVuY3Rpb24gbWltZVRvRGF0YVR5cGUgKG1pbWUpIHtcclxuICByZXR1cm4gbWltZSAmJiAobWltZSA9PT0gaHRtbFR5cGUgPyAnaHRtbCdcclxuICAgICAgICA6IG1pbWUgPT09IGpzb25UeXBlID8gJ2pzb24nXHJcbiAgICAgICAgOiBzY3JpcHRUeXBlUkUudGVzdChtaW1lKSA/ICdzY3JpcHQnXHJcbiAgICAgICAgOiB4bWxUeXBlUkUudGVzdChtaW1lKSAmJiAneG1sJykgfHwgJ3RleHQnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGVuZFF1ZXJ5ICh1cmwsIHF1ZXJ5KSB7XHJcbiAgcmV0dXJuICh1cmwgKyAnJicgKyBxdWVyeSkucmVwbGFjZSgvWyY/XXsxLDJ9LywgJz8nKVxyXG59XHJcblxyXG4vLyBzZXJpYWxpemUgcGF5bG9hZCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBVUkwgZm9yIEdFVCByZXF1ZXN0c1xyXG5mdW5jdGlvbiBzZXJpYWxpemVEYXRhIChvcHRpb25zKSB7XHJcbiAgaWYgKHR5cGUob3B0aW9ucy5kYXRhKSA9PT0gJ29iamVjdCcpIG9wdGlvbnMuZGF0YSA9IHBhcmFtKG9wdGlvbnMuZGF0YSlcclxuICBpZiAob3B0aW9ucy5kYXRhICYmICghb3B0aW9ucy50eXBlIHx8IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpID09PSAnR0VUJykpIHsgb3B0aW9ucy51cmwgPSBhcHBlbmRRdWVyeShvcHRpb25zLnVybCwgb3B0aW9ucy5kYXRhKSB9XHJcbn1cclxuXHJcbmFqYXguZ2V0ID0gZnVuY3Rpb24gKHVybCwgc3VjY2VzcykgeyByZXR1cm4gYWpheCh7IHVybDogdXJsLCBzdWNjZXNzOiBzdWNjZXNzIH0pIH1cclxuXHJcbmFqYXgucG9zdCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIHN1Y2Nlc3MsIGRhdGFUeXBlKSB7XHJcbiAgaWYgKHR5cGUoZGF0YSkgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGRhdGFUeXBlID0gZGF0YVR5cGUgfHwgc3VjY2Vzc1xyXG4gICAgc3VjY2VzcyA9IGRhdGFcclxuICAgIGRhdGEgPSBudWxsXHJcbiAgfVxyXG4gIHJldHVybiBhamF4KHsgdHlwZTogJ1BPU1QnLCB1cmw6IHVybCwgZGF0YTogZGF0YSwgc3VjY2Vzczogc3VjY2VzcywgZGF0YVR5cGU6IGRhdGFUeXBlIH0pXHJcbn1cclxuXHJcbmFqYXguZ2V0SlNPTiA9IGZ1bmN0aW9uICh1cmwsIHN1Y2Nlc3MpIHtcclxuICByZXR1cm4gYWpheCh7IHVybDogdXJsLCBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhVHlwZTogJ2pzb24nIH0pXHJcbn1cclxuXHJcbnZhciBlc2NhcGUgPSBlbmNvZGVVUklDb21wb25lbnRcclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZSAocGFyYW1zLCBvYmosIHRyYWRpdGlvbmFsLCBzY29wZSkge1xyXG4gIHZhciBhcnJheSA9IHR5cGUob2JqKSA9PT0gJ2FycmF5J1xyXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgIHZhciB2YWx1ZSA9IG9ialtrZXldXHJcblxyXG4gICAgaWYgKHNjb3BlKSBrZXkgPSB0cmFkaXRpb25hbCA/IHNjb3BlIDogc2NvcGUgKyAnWycgKyAoYXJyYXkgPyAnJyA6IGtleSkgKyAnXSdcclxuICAgICAgICAgICAgLy8gaGFuZGxlIGRhdGEgaW4gc2VyaWFsaXplQXJyYXkoKSBmb3JtYXRcclxuICAgIGlmICghc2NvcGUgJiYgYXJyYXkpIHBhcmFtcy5hZGQodmFsdWUubmFtZSwgdmFsdWUudmFsdWUpXHJcbiAgICAgICAgICAgIC8vIHJlY3Vyc2UgaW50byBuZXN0ZWQgb2JqZWN0c1xyXG4gICAgZWxzZSBpZiAodHJhZGl0aW9uYWwgPyAodHlwZSh2YWx1ZSkgPT09ICdhcnJheScpIDogKHR5cGUodmFsdWUpID09PSAnb2JqZWN0JykpIHsgc2VyaWFsaXplKHBhcmFtcywgdmFsdWUsIHRyYWRpdGlvbmFsLCBrZXkpIH0gZWxzZSBwYXJhbXMuYWRkKGtleSwgdmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJhbSAob2JqLCB0cmFkaXRpb25hbCkge1xyXG4gIHZhciBwYXJhbXMgPSBbXVxyXG4gIHBhcmFtcy5hZGQgPSBmdW5jdGlvbiAoaywgdikgeyB0aGlzLnB1c2goZXNjYXBlKGspICsgJz0nICsgZXNjYXBlKHYpKSB9XHJcbiAgc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbClcclxuICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKCclMjAnLCAnKycpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4dGVuZCAodGFyZ2V0KSB7XHJcbiAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXHJcbiAgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xyXG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgIGlmIChzb3VyY2Vba2V5XSAhPT0gdW5kZWZpbmVkKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV0gfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgcmV0dXJuIHRhcmdldFxyXG59XHJcbiIsIi8qIVxyXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4yLjBcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2pzLWNvb2tpZS9qcy1jb29raWVcclxuICpcclxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAqL1xyXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblx0dmFyIHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlcjtcclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0XHRkZWZpbmUoZmFjdG9yeSk7XHJcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xyXG5cdH1cclxuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XHJcblx0fVxyXG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XHJcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xyXG5cdFx0dmFyIGFwaSA9IHdpbmRvdy5Db29raWVzID0gZmFjdG9yeSgpO1xyXG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcclxuXHRcdFx0cmV0dXJuIGFwaTtcclxuXHRcdH07XHJcblx0fVxyXG59KGZ1bmN0aW9uICgpIHtcclxuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xyXG5cdFx0ZnVuY3Rpb24gYXBpIChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XHJcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBXcml0ZVxyXG5cclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0YXR0cmlidXRlcyA9IGV4dGVuZCh7XHJcblx0XHRcdFx0XHRwYXRoOiAnLydcclxuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xyXG5cclxuXHRcdFx0XHRpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkgKiAxICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxyXG5cdFx0XHRcdGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcyA/IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xyXG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHJlc3VsdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cclxuXHRcdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSA/XHJcblx0XHRcdFx0XHRjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyh2YWx1ZSkpXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cclxuXHRcdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvJSgyM3wyNHwyNnwyQnw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxyXG5cdFx0XHRcdFx0LnJlcGxhY2UoL1tcXChcXCldL2csIGVzY2FwZSk7XHJcblxyXG5cdFx0XHRcdHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcclxuXHRcdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcclxuXHRcdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnOyAnICsgYXR0cmlidXRlTmFtZTtcclxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxyXG5cdFx0XHRcdFx0Ly8gICAgIGNoYXJhY3RlcjpcclxuXHRcdFx0XHRcdC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXHJcblx0XHRcdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cclxuXHRcdFx0XHRcdC8vIC4uLlxyXG5cdFx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBSZWFkXHJcblxyXG5cdFx0XHR2YXIgamFyID0ge307XHJcblx0XHRcdHZhciBkZWNvZGUgPSBmdW5jdGlvbiAocykge1xyXG5cdFx0XHRcdHJldHVybiBzLnJlcGxhY2UoLyglWzAtOUEtWl17Mn0pKy9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XHJcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxyXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cdFx0XHR2YXIgaSA9IDA7XHJcblxyXG5cdFx0XHRmb3IgKDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLmpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xyXG5cdFx0XHRcdFx0Y29va2llID0gY29va2llLnNsaWNlKDEsIC0xKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgbmFtZSA9IGRlY29kZShwYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRjb29raWUgPSAoY29udmVydGVyLnJlYWQgfHwgY29udmVydGVyKShjb29raWUsIG5hbWUpIHx8XHJcblx0XHRcdFx0XHRcdGRlY29kZShjb29raWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmpzb24pIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0amFyW25hbWVdID0gY29va2llO1xyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFwaS5zZXQgPSBhcGk7XHJcblx0XHRhcGkuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoYXBpLCBrZXkpO1xyXG5cdFx0fTtcclxuXHRcdGFwaS5nZXRKU09OID0gZnVuY3Rpb24gKGtleSkge1xyXG5cdFx0XHRyZXR1cm4gYXBpLmNhbGwoe1xyXG5cdFx0XHRcdGpzb246IHRydWVcclxuXHRcdFx0fSwga2V5KTtcclxuXHRcdH07XHJcblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xyXG5cdFx0XHRhcGkoa2V5LCAnJywgZXh0ZW5kKGF0dHJpYnV0ZXMsIHtcclxuXHRcdFx0XHRleHBpcmVzOiAtMVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xyXG5cclxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcclxuXHJcblx0XHRyZXR1cm4gYXBpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGluaXQoZnVuY3Rpb24gKCkge30pO1xyXG59KSk7XHJcbiIsIi8qKlxyXG4gKiBbanMtbWQ1XXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZW1uMTc4L2pzLW1kNX1cclxuICpcclxuICogQG5hbWVzcGFjZSBtZDVcclxuICogQHZlcnNpb24gMC43LjNcclxuICogQGF1dGhvciBDaGVuLCBZaS1DeXVhbiBbZW1uMTc4QGdtYWlsLmNvbV1cclxuICogQGNvcHlyaWdodCBDaGVuLCBZaS1DeXVhbiAyMDE0LTIwMTdcclxuICogQGxpY2Vuc2UgTUlUXHJcbiAqL1xyXG4hIGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBmdW5jdGlvbiB0KHQpIHsgaWYgKHQpIGRbMF0gPSBkWzE2XSA9IGRbMV0gPSBkWzJdID0gZFszXSA9IGRbNF0gPSBkWzVdID0gZFs2XSA9IGRbN10gPSBkWzhdID0gZFs5XSA9IGRbMTBdID0gZFsxMV0gPSBkWzEyXSA9IGRbMTNdID0gZFsxNF0gPSBkWzE1XSA9IDAsIHRoaXMuYmxvY2tzID0gZCwgdGhpcy5idWZmZXI4ID0gbDtcclxuICAgICAgICBlbHNlIGlmIChhKSB7IHZhciByID0gbmV3IEFycmF5QnVmZmVyKDY4KTtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXI4ID0gbmV3IFVpbnQ4QXJyYXkociksIHRoaXMuYmxvY2tzID0gbmV3IFVpbnQzMkFycmF5KHIpIH0gZWxzZSB0aGlzLmJsb2NrcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgICAgICB0aGlzLmgwID0gdGhpcy5oMSA9IHRoaXMuaDIgPSB0aGlzLmgzID0gdGhpcy5zdGFydCA9IHRoaXMuYnl0ZXMgPSB0aGlzLmhCeXRlcyA9IDAsIHRoaXMuZmluYWxpemVkID0gdGhpcy5oYXNoZWQgPSAhMSwgdGhpcy5maXJzdCA9ICEwIH0gdmFyIHIgPSBcImlucHV0IGlzIGludmFsaWQgdHlwZVwiLFxyXG4gICAgICAgIGUgPSBcIm9iamVjdFwiID09IHR5cGVvZiB3aW5kb3csXHJcbiAgICAgICAgaSA9IGUgPyB3aW5kb3cgOiB7fTtcclxuICAgIGkuSlNfTUQ1X05PX1dJTkRPVyAmJiAoZSA9ICExKTsgdmFyIHMgPSAhZSAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBzZWxmLFxyXG4gICAgICAgIGggPSAhaS5KU19NRDVfTk9fTk9ERV9KUyAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xyXG4gICAgaCA/IGkgPSBnbG9iYWwgOiBzICYmIChpID0gc2VsZik7IHZhciBmID0gIWkuSlNfTUQ1X05PX0NPTU1PTl9KUyAmJiBcIm9iamVjdFwiID09IHR5cGVvZiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMsXHJcbiAgICAgICAgbyA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGVmaW5lICYmIGRlZmluZS5hbWQsXHJcbiAgICAgICAgYSA9ICFpLkpTX01ENV9OT19BUlJBWV9CVUZGRVIgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgQXJyYXlCdWZmZXIsXHJcbiAgICAgICAgbiA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiLnNwbGl0KFwiXCIpLFxyXG4gICAgICAgIHUgPSBbMTI4LCAzMjc2OCwgODM4ODYwOCwgLTIxNDc0ODM2NDhdLFxyXG4gICAgICAgIHkgPSBbMCwgOCwgMTYsIDI0XSxcclxuICAgICAgICBjID0gW1wiaGV4XCIsIFwiYXJyYXlcIiwgXCJkaWdlc3RcIiwgXCJidWZmZXJcIiwgXCJhcnJheUJ1ZmZlclwiLCBcImJhc2U2NFwiXSxcclxuICAgICAgICBwID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuc3BsaXQoXCJcIiksXHJcbiAgICAgICAgZCA9IFtdLFxyXG4gICAgICAgIGw7IGlmIChhKSB7IHZhciBBID0gbmV3IEFycmF5QnVmZmVyKDY4KTtcclxuICAgICAgICBsID0gbmV3IFVpbnQ4QXJyYXkoQSksIGQgPSBuZXcgVWludDMyQXJyYXkoQSkgfSFpLkpTX01ENV9OT19OT0RFX0pTICYmIEFycmF5LmlzQXJyYXkgfHwgKEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbih0KSB7IHJldHVybiBcIltvYmplY3QgQXJyYXldXCIgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KSB9KSwgIWEgfHwgIWkuSlNfTUQ1X05PX0FSUkFZX0JVRkZFUl9JU19WSUVXICYmIEFycmF5QnVmZmVyLmlzVmlldyB8fCAoQXJyYXlCdWZmZXIuaXNWaWV3ID0gZnVuY3Rpb24odCkgeyByZXR1cm4gXCJvYmplY3RcIiA9PSB0eXBlb2YgdCAmJiB0LmJ1ZmZlciAmJiB0LmJ1ZmZlci5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIgfSk7IHZhciBiID0gZnVuY3Rpb24ocikgeyByZXR1cm4gZnVuY3Rpb24oZSkgeyByZXR1cm4gbmV3IHQoITApLnVwZGF0ZShlKVtyXSgpIH0gfSxcclxuICAgICAgICB2ID0gZnVuY3Rpb24oKSB7IHZhciByID0gYihcImhleFwiKTtcclxuICAgICAgICAgICAgaCAmJiAociA9IHcocikpLCByLmNyZWF0ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IHQgfSwgci51cGRhdGUgPSBmdW5jdGlvbih0KSB7IHJldHVybiByLmNyZWF0ZSgpLnVwZGF0ZSh0KSB9OyBmb3IgKHZhciBlID0gMDsgZSA8IGMubGVuZ3RoOyArK2UpIHsgdmFyIGkgPSBjW2VdO1xyXG4gICAgICAgICAgICAgICAgcltpXSA9IGIoaSkgfSByZXR1cm4gciB9LFxyXG4gICAgICAgIHcgPSBmdW5jdGlvbih0KSB7IHZhciBlID0gZXZhbChcInJlcXVpcmUoJ2NyeXB0bycpXCIpLFxyXG4gICAgICAgICAgICAgICAgaSA9IGV2YWwoXCJyZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcIiksXHJcbiAgICAgICAgICAgICAgICBzID0gZnVuY3Rpb24ocykgeyBpZiAoXCJzdHJpbmdcIiA9PSB0eXBlb2YgcykgcmV0dXJuIGUuY3JlYXRlSGFzaChcIm1kNVwiKS51cGRhdGUocywgXCJ1dGY4XCIpLmRpZ2VzdChcImhleFwiKTsgaWYgKG51bGwgPT09IHMgfHwgdm9pZCAwID09PSBzKSB0aHJvdyByOyByZXR1cm4gcy5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIgJiYgKHMgPSBuZXcgVWludDhBcnJheShzKSksIEFycmF5LmlzQXJyYXkocykgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHMpIHx8IHMuY29uc3RydWN0b3IgPT09IGkgPyBlLmNyZWF0ZUhhc2goXCJtZDVcIikudXBkYXRlKG5ldyBpKHMpKS5kaWdlc3QoXCJoZXhcIikgOiB0KHMpIH07IHJldHVybiBzIH07XHJcbiAgICB0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0KSB7IGlmICghdGhpcy5maW5hbGl6ZWQpIHsgdmFyIGUsIGkgPSB0eXBlb2YgdDsgaWYgKFwic3RyaW5nXCIgIT09IGkpIHsgaWYgKFwib2JqZWN0XCIgIT09IGkpIHRocm93IHI7IGlmIChudWxsID09PSB0KSB0aHJvdyByOyBpZiAoYSAmJiB0LmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcikgdCA9IG5ldyBVaW50OEFycmF5KHQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIShBcnJheS5pc0FycmF5KHQpIHx8IGEgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KHQpKSkgdGhyb3cgcjtcclxuICAgICAgICAgICAgICAgIGUgPSAhMCB9IGZvciAodmFyIHMsIGgsIGYgPSAwLCBvID0gdC5sZW5ndGgsIG4gPSB0aGlzLmJsb2NrcywgdSA9IHRoaXMuYnVmZmVyODsgZiA8IG87KSB7IGlmICh0aGlzLmhhc2hlZCAmJiAodGhpcy5oYXNoZWQgPSAhMSwgblswXSA9IG5bMTZdLCBuWzE2XSA9IG5bMV0gPSBuWzJdID0gblszXSA9IG5bNF0gPSBuWzVdID0gbls2XSA9IG5bN10gPSBuWzhdID0gbls5XSA9IG5bMTBdID0gblsxMV0gPSBuWzEyXSA9IG5bMTNdID0gblsxNF0gPSBuWzE1XSA9IDApLCBlKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikgdVtoKytdID0gdFtmXTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKSBuW2ggPj4gMl0gfD0gdFtmXSA8PCB5WzMgJiBoKytdO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYSlcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGggPSB0aGlzLnN0YXJ0OyBmIDwgbyAmJiBoIDwgNjQ7ICsrZikocyA9IHQuY2hhckNvZGVBdChmKSkgPCAxMjggPyB1W2grK10gPSBzIDogcyA8IDIwNDggPyAodVtoKytdID0gMTkyIHwgcyA+PiA2LCB1W2grK10gPSAxMjggfCA2MyAmIHMpIDogcyA8IDU1Mjk2IHx8IHMgPj0gNTczNDQgPyAodVtoKytdID0gMjI0IHwgcyA+PiAxMiwgdVtoKytdID0gMTI4IHwgcyA+PiA2ICYgNjMsIHVbaCsrXSA9IDEyOCB8IDYzICYgcykgOiAocyA9IDY1NTM2ICsgKCgxMDIzICYgcykgPDwgMTAgfCAxMDIzICYgdC5jaGFyQ29kZUF0KCsrZikpLCB1W2grK10gPSAyNDAgfCBzID4+IDE4LCB1W2grK10gPSAxMjggfCBzID4+IDEyICYgNjMsIHVbaCsrXSA9IDEyOCB8IHMgPj4gNiAmIDYzLCB1W2grK10gPSAxMjggfCA2MyAmIHMpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaCA9IHRoaXMuc3RhcnQ7IGYgPCBvICYmIGggPCA2NDsgKytmKShzID0gdC5jaGFyQ29kZUF0KGYpKSA8IDEyOCA/IG5baCA+PiAyXSB8PSBzIDw8IHlbMyAmIGgrK10gOiBzIDwgMjA0OCA/IChuW2ggPj4gMl0gfD0gKDE5MiB8IHMgPj4gNikgPDwgeVszICYgaCsrXSwgbltoID4+IDJdIHw9ICgxMjggfCA2MyAmIHMpIDw8IHlbMyAmIGgrK10pIDogcyA8IDU1Mjk2IHx8IHMgPj0gNTczNDQgPyAobltoID4+IDJdIHw9ICgyMjQgfCBzID4+IDEyKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gNiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSkgOiAocyA9IDY1NTM2ICsgKCgxMDIzICYgcykgPDwgMTAgfCAxMDIzICYgdC5jaGFyQ29kZUF0KCsrZikpLCBuW2ggPj4gMl0gfD0gKDI0MCB8IHMgPj4gMTgpIDw8IHlbMyAmIGgrK10sIG5baCA+PiAyXSB8PSAoMTI4IHwgcyA+PiAxMiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IHMgPj4gNiAmIDYzKSA8PCB5WzMgJiBoKytdLCBuW2ggPj4gMl0gfD0gKDEyOCB8IDYzICYgcykgPDwgeVszICYgaCsrXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RCeXRlSW5kZXggPSBoLCB0aGlzLmJ5dGVzICs9IGggLSB0aGlzLnN0YXJ0LCBoID49IDY0ID8gKHRoaXMuc3RhcnQgPSBoIC0gNjQsIHRoaXMuaGFzaCgpLCB0aGlzLmhhc2hlZCA9ICEwKSA6IHRoaXMuc3RhcnQgPSBoIH0gcmV0dXJuIHRoaXMuYnl0ZXMgPiA0Mjk0OTY3Mjk1ICYmICh0aGlzLmhCeXRlcyArPSB0aGlzLmJ5dGVzIC8gNDI5NDk2NzI5NiA8PCAwLCB0aGlzLmJ5dGVzID0gdGhpcy5ieXRlcyAlIDQyOTQ5NjcyOTYpLCB0aGlzIH0gfSwgdC5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbigpIHsgaWYgKCF0aGlzLmZpbmFsaXplZCkgeyB0aGlzLmZpbmFsaXplZCA9ICEwOyB2YXIgdCA9IHRoaXMuYmxvY2tzLFxyXG4gICAgICAgICAgICAgICAgciA9IHRoaXMubGFzdEJ5dGVJbmRleDtcclxuICAgICAgICAgICAgdFtyID4+IDJdIHw9IHVbMyAmIHJdLCByID49IDU2ICYmICh0aGlzLmhhc2hlZCB8fCB0aGlzLmhhc2goKSwgdFswXSA9IHRbMTZdLCB0WzE2XSA9IHRbMV0gPSB0WzJdID0gdFszXSA9IHRbNF0gPSB0WzVdID0gdFs2XSA9IHRbN10gPSB0WzhdID0gdFs5XSA9IHRbMTBdID0gdFsxMV0gPSB0WzEyXSA9IHRbMTNdID0gdFsxNF0gPSB0WzE1XSA9IDApLCB0WzE0XSA9IHRoaXMuYnl0ZXMgPDwgMywgdFsxNV0gPSB0aGlzLmhCeXRlcyA8PCAzIHwgdGhpcy5ieXRlcyA+Pj4gMjksIHRoaXMuaGFzaCgpIH0gfSwgdC5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uKCkgeyB2YXIgdCwgciwgZSwgaSwgcywgaCwgZiA9IHRoaXMuYmxvY2tzO1xyXG4gICAgICAgIHRoaXMuZmlyc3QgPyByID0gKChyID0gKCh0ID0gKCh0ID0gZlswXSAtIDY4MDg3NjkzNykgPDwgNyB8IHQgPj4+IDI1KSAtIDI3MTczMzg3OSA8PCAwKSBeIChlID0gKChlID0gKC0yNzE3MzM4NzkgXiAoaSA9ICgoaSA9ICgtMTczMjU4NDE5NCBeIDIwMDQzMTgwNzEgJiB0KSArIGZbMV0gLSAxMTc4MzA3MDgpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICgtMjcxNzMzODc5IF4gdCkpICsgZlsyXSAtIDExMjY0NzgzNzUpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlszXSAtIDEzMTYyNTkyMDkpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwIDogKHQgPSB0aGlzLmgwLCByID0gdGhpcy5oMSwgZSA9IHRoaXMuaDIsIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9ICgoaSA9IHRoaXMuaDMpIF4gciAmIChlIF4gaSkpICsgZlswXSAtIDY4MDg3NjkzNikgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZlsxXSAtIDM4OTU2NDU4NikgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzJdICsgNjA2MTA1ODE5KSA8PCAxNyB8IGUgPj4+IDE1KSArIGkgPDwgMCkgJiAoaSBeIHQpKSArIGZbM10gLSAxMDQ0NTI1MzMwKSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCksIHIgPSAoKHIgKz0gKCh0ID0gKCh0ICs9IChpIF4gciAmIChlIF4gaSkpICsgZls0XSAtIDE3NjQxODg5NykgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZls1XSArIDEyMDAwODA0MjYpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZls2XSAtIDE0NzMyMzEzNDEpIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZls3XSAtIDQ1NzA1OTgzKSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCwgciA9ICgociArPSAoKHQgPSAoKHQgKz0gKGkgXiByICYgKGUgXiBpKSkgKyBmWzhdICsgMTc3MDAzNTQxNikgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZls5XSAtIDE5NTg0MTQ0MTcpIDw8IDEyIHwgaSA+Pj4gMjApICsgdCA8PCAwKSAmICh0IF4gcikpICsgZlsxMF0gLSA0MjA2MykgPDwgMTcgfCBlID4+PiAxNSkgKyBpIDw8IDApICYgKGkgXiB0KSkgKyBmWzExXSAtIDE5OTA0MDQxNjIpIDw8IDIyIHwgciA+Pj4gMTApICsgZSA8PCAwLCByID0gKChyICs9ICgodCA9ICgodCArPSAoaSBeIHIgJiAoZSBeIGkpKSArIGZbMTJdICsgMTgwNDYwMzY4MikgPDwgNyB8IHQgPj4+IDI1KSArIHIgPDwgMCkgXiAoZSA9ICgoZSArPSAociBeIChpID0gKChpICs9IChlIF4gdCAmIChyIF4gZSkpICsgZlsxM10gLSA0MDM0MTEwMSkgPDwgMTIgfCBpID4+PiAyMCkgKyB0IDw8IDApICYgKHQgXiByKSkgKyBmWzE0XSAtIDE1MDIwMDIyOTApIDw8IDE3IHwgZSA+Pj4gMTUpICsgaSA8PCAwKSAmIChpIF4gdCkpICsgZlsxNV0gKyAxMjM2NTM1MzI5KSA8PCAyMiB8IHIgPj4+IDEwKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZlsxXSAtIDE2NTc5NjUxMCkgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzZdIC0gMTA2OTUwMTYzMikgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZlsxMV0gKyA2NDM3MTc3MTMpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbMF0gLSAzNzM4OTczMDIpIDw8IDIwIHwgciA+Pj4gMTIpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeIGUgJiAoKHQgPSAoKHQgKz0gKGUgXiBpICYgKHIgXiBlKSkgKyBmWzVdIC0gNzAxNTU4NjkxKSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbMTBdICsgMzgwMTYwODMpIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbMTVdIC0gNjYwNDc4MzM1KSA8PCAxNCB8IGUgPj4+IDE4KSArIGkgPDwgMCkgXiBpKSkgKyBmWzRdIC0gNDA1NTM3ODQ4KSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZls5XSArIDU2ODQ0NjQzOCkgPDwgNSB8IHQgPj4+IDI3KSArIHIgPDwgMCkgXiByKSkgKyBmWzE0XSAtIDEwMTk4MDM2OTApIDw8IDkgfCBpID4+PiAyMykgKyB0IDw8IDApIF4gdCAmICgoZSA9ICgoZSArPSAodCBeIHIgJiAoaSBeIHQpKSArIGZbM10gLSAxODczNjM5NjEpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbOF0gKyAxMTYzNTMxNTAxKSA8PCAyMCB8IHIgPj4+IDEyKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiBlICYgKCh0ID0gKCh0ICs9IChlIF4gaSAmIChyIF4gZSkpICsgZlsxM10gLSAxNDQ0NjgxNDY3KSA8PCA1IHwgdCA+Pj4gMjcpICsgciA8PCAwKSBeIHIpKSArIGZbMl0gLSA1MTQwMzc4NCkgPDwgOSB8IGkgPj4+IDIzKSArIHQgPDwgMCkgXiB0ICYgKChlID0gKChlICs9ICh0IF4gciAmIChpIF4gdCkpICsgZls3XSArIDE3MzUzMjg0NzMpIDw8IDE0IHwgZSA+Pj4gMTgpICsgaSA8PCAwKSBeIGkpKSArIGZbMTJdIC0gMTkyNjYwNzczNCkgPDwgMjAgfCByID4+PiAxMikgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbNV0gLSAzNzg1NTgpIDw8IDQgfCB0ID4+PiAyOCkgKyByIDw8IDApKSArIGZbOF0gLSAyMDIyNTc0NDYzKSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzExXSArIDE4MzkwMzA1NjIpIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzE0XSAtIDM1MzA5NTU2KSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzFdIC0gMTUzMDk5MjA2MCkgPDwgNCB8IHQgPj4+IDI4KSArIHIgPDwgMCkpICsgZls0XSArIDEyNzI4OTMzNTMpIDw8IDExIHwgaSA+Pj4gMjEpICsgdCA8PCAwKSBeIHQpIF4gKGUgPSAoKGUgKz0gKGggXiByKSArIGZbN10gLSAxNTU0OTc2MzIpIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzEwXSAtIDEwOTQ3MzA2NDApIDw8IDIzIHwgciA+Pj4gOSkgKyBlIDw8IDAsIHIgPSAoKHIgKz0gKChoID0gKGkgPSAoKGkgKz0gKChzID0gciBeIGUpIF4gKHQgPSAoKHQgKz0gKHMgXiBpKSArIGZbMTNdICsgNjgxMjc5MTc0KSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzBdIC0gMzU4NTM3MjIyKSA8PCAxMSB8IGkgPj4+IDIxKSArIHQgPDwgMCkgXiB0KSBeIChlID0gKChlICs9IChoIF4gcikgKyBmWzNdIC0gNzIyNTIxOTc5KSA8PCAxNiB8IGUgPj4+IDE2KSArIGkgPDwgMCkpICsgZls2XSArIDc2MDI5MTg5KSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaCA9IChpID0gKChpICs9ICgocyA9IHIgXiBlKSBeICh0ID0gKCh0ICs9IChzIF4gaSkgKyBmWzldIC0gNjQwMzY0NDg3KSA8PCA0IHwgdCA+Pj4gMjgpICsgciA8PCAwKSkgKyBmWzEyXSAtIDQyMTgxNTgzNSkgPDwgMTEgfCBpID4+PiAyMSkgKyB0IDw8IDApIF4gdCkgXiAoZSA9ICgoZSArPSAoaCBeIHIpICsgZlsxNV0gKyA1MzA3NDI1MjApIDw8IDE2IHwgZSA+Pj4gMTYpICsgaSA8PCAwKSkgKyBmWzJdIC0gOTk1MzM4NjUxKSA8PCAyMyB8IHIgPj4+IDkpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbMF0gLSAxOTg2MzA4NDQpIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbN10gKyAxMTI2ODkxNDE1KSA8PCAxMCB8IGkgPj4+IDIyKSArIHQgPDwgMCkgXiAoKGUgPSAoKGUgKz0gKHQgXiAoaSB8IH5yKSkgKyBmWzE0XSAtIDE0MTYzNTQ5MDUpIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzVdIC0gNTc0MzQwNTUpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbMTJdICsgMTcwMDQ4NTU3MSkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZlszXSAtIDE4OTQ5ODY2MDYpIDw8IDEwIHwgaSA+Pj4gMjIpICsgdCA8PCAwKSBeICgoZSA9ICgoZSArPSAodCBeIChpIHwgfnIpKSArIGZbMTBdIC0gMTA1MTUyMykgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbMV0gLSAyMDU0OTIyNzk5KSA8PCAyMSB8IHIgPj4+IDExKSArIGUgPDwgMCwgciA9ICgociArPSAoKGkgPSAoKGkgKz0gKHIgXiAoKHQgPSAoKHQgKz0gKGUgXiAociB8IH5pKSkgKyBmWzhdICsgMTg3MzMxMzM1OSkgPDwgNiB8IHQgPj4+IDI2KSArIHIgPDwgMCkgfCB+ZSkpICsgZlsxNV0gLSAzMDYxMTc0NCkgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZls2XSAtIDE1NjAxOTgzODApIDw8IDE1IHwgZSA+Pj4gMTcpICsgaSA8PCAwKSB8IH50KSkgKyBmWzEzXSArIDEzMDkxNTE2NDkpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCByID0gKChyICs9ICgoaSA9ICgoaSArPSAociBeICgodCA9ICgodCArPSAoZSBeIChyIHwgfmkpKSArIGZbNF0gLSAxNDU1MjMwNzApIDw8IDYgfCB0ID4+PiAyNikgKyByIDw8IDApIHwgfmUpKSArIGZbMTFdIC0gMTEyMDIxMDM3OSkgPDwgMTAgfCBpID4+PiAyMikgKyB0IDw8IDApIF4gKChlID0gKChlICs9ICh0IF4gKGkgfCB+cikpICsgZlsyXSArIDcxODc4NzI1OSkgPDwgMTUgfCBlID4+PiAxNykgKyBpIDw8IDApIHwgfnQpKSArIGZbOV0gLSAzNDM0ODU1NTEpIDw8IDIxIHwgciA+Pj4gMTEpICsgZSA8PCAwLCB0aGlzLmZpcnN0ID8gKHRoaXMuaDAgPSB0ICsgMTczMjU4NDE5MyA8PCAwLCB0aGlzLmgxID0gciAtIDI3MTczMzg3OSA8PCAwLCB0aGlzLmgyID0gZSAtIDE3MzI1ODQxOTQgPDwgMCwgdGhpcy5oMyA9IGkgKyAyNzE3MzM4NzggPDwgMCwgdGhpcy5maXJzdCA9ICExKSA6ICh0aGlzLmgwID0gdGhpcy5oMCArIHQgPDwgMCwgdGhpcy5oMSA9IHRoaXMuaDEgKyByIDw8IDAsIHRoaXMuaDIgPSB0aGlzLmgyICsgZSA8PCAwLCB0aGlzLmgzID0gdGhpcy5oMyArIGkgPDwgMCkgfSwgdC5wcm90b3R5cGUuaGV4ID0gZnVuY3Rpb24oKSB7IHRoaXMuZmluYWxpemUoKTsgdmFyIHQgPSB0aGlzLmgwLFxyXG4gICAgICAgICAgICByID0gdGhpcy5oMSxcclxuICAgICAgICAgICAgZSA9IHRoaXMuaDIsXHJcbiAgICAgICAgICAgIGkgPSB0aGlzLmgzOyByZXR1cm4gblt0ID4+IDQgJiAxNV0gKyBuWzE1ICYgdF0gKyBuW3QgPj4gMTIgJiAxNV0gKyBuW3QgPj4gOCAmIDE1XSArIG5bdCA+PiAyMCAmIDE1XSArIG5bdCA+PiAxNiAmIDE1XSArIG5bdCA+PiAyOCAmIDE1XSArIG5bdCA+PiAyNCAmIDE1XSArIG5bciA+PiA0ICYgMTVdICsgblsxNSAmIHJdICsgbltyID4+IDEyICYgMTVdICsgbltyID4+IDggJiAxNV0gKyBuW3IgPj4gMjAgJiAxNV0gKyBuW3IgPj4gMTYgJiAxNV0gKyBuW3IgPj4gMjggJiAxNV0gKyBuW3IgPj4gMjQgJiAxNV0gKyBuW2UgPj4gNCAmIDE1XSArIG5bMTUgJiBlXSArIG5bZSA+PiAxMiAmIDE1XSArIG5bZSA+PiA4ICYgMTVdICsgbltlID4+IDIwICYgMTVdICsgbltlID4+IDE2ICYgMTVdICsgbltlID4+IDI4ICYgMTVdICsgbltlID4+IDI0ICYgMTVdICsgbltpID4+IDQgJiAxNV0gKyBuWzE1ICYgaV0gKyBuW2kgPj4gMTIgJiAxNV0gKyBuW2kgPj4gOCAmIDE1XSArIG5baSA+PiAyMCAmIDE1XSArIG5baSA+PiAxNiAmIDE1XSArIG5baSA+PiAyOCAmIDE1XSArIG5baSA+PiAyNCAmIDE1XSB9LCB0LnByb3RvdHlwZS50b1N0cmluZyA9IHQucHJvdG90eXBlLmhleCwgdC5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24oKSB7IHRoaXMuZmluYWxpemUoKTsgdmFyIHQgPSB0aGlzLmgwLFxyXG4gICAgICAgICAgICByID0gdGhpcy5oMSxcclxuICAgICAgICAgICAgZSA9IHRoaXMuaDIsXHJcbiAgICAgICAgICAgIGkgPSB0aGlzLmgzOyByZXR1cm4gWzI1NSAmIHQsIHQgPj4gOCAmIDI1NSwgdCA+PiAxNiAmIDI1NSwgdCA+PiAyNCAmIDI1NSwgMjU1ICYgciwgciA+PiA4ICYgMjU1LCByID4+IDE2ICYgMjU1LCByID4+IDI0ICYgMjU1LCAyNTUgJiBlLCBlID4+IDggJiAyNTUsIGUgPj4gMTYgJiAyNTUsIGUgPj4gMjQgJiAyNTUsIDI1NSAmIGksIGkgPj4gOCAmIDI1NSwgaSA+PiAxNiAmIDI1NSwgaSA+PiAyNCAmIDI1NV0gfSwgdC5wcm90b3R5cGUuYXJyYXkgPSB0LnByb3RvdHlwZS5kaWdlc3QsIHQucHJvdG90eXBlLmFycmF5QnVmZmVyID0gZnVuY3Rpb24oKSB7IHRoaXMuZmluYWxpemUoKTsgdmFyIHQgPSBuZXcgQXJyYXlCdWZmZXIoMTYpLFxyXG4gICAgICAgICAgICByID0gbmV3IFVpbnQzMkFycmF5KHQpOyByZXR1cm4gclswXSA9IHRoaXMuaDAsIHJbMV0gPSB0aGlzLmgxLCByWzJdID0gdGhpcy5oMiwgclszXSA9IHRoaXMuaDMsIHQgfSwgdC5wcm90b3R5cGUuYnVmZmVyID0gdC5wcm90b3R5cGUuYXJyYXlCdWZmZXIsIHQucHJvdG90eXBlLmJhc2U2NCA9IGZ1bmN0aW9uKCkgeyBmb3IgKHZhciB0LCByLCBlLCBpID0gXCJcIiwgcyA9IHRoaXMuYXJyYXkoKSwgaCA9IDA7IGggPCAxNTspIHQgPSBzW2grK10sIHIgPSBzW2grK10sIGUgPSBzW2grK10sIGkgKz0gcFt0ID4+PiAyXSArIHBbNjMgJiAodCA8PCA0IHwgciA+Pj4gNCldICsgcFs2MyAmIChyIDw8IDIgfCBlID4+PiA2KV0gKyBwWzYzICYgZV07IHJldHVybiB0ID0gc1toXSwgaSArPSBwW3QgPj4+IDJdICsgcFt0IDw8IDQgJiA2M10gKyBcIj09XCIgfTsgdmFyIF8gPSB2KCk7XHJcbiAgICBmID8gbW9kdWxlLmV4cG9ydHMgPSBfIDogKGkubWQ1ID0gXywgbyAmJiBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBfIH0pKSB9KCk7IiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayhcbiAgICAgIHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aClcbiAgICApKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxudmFyIEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ3BhcmVudCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ieXRlT2Zmc2V0XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gRml4IHN1YmFycmF5KCkgaW4gRVMyMDE2LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvOTdcbmlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wuc3BlY2llcyAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKGlzQXJyYXlCdWZmZXIodmFsdWUpIHx8ICh2YWx1ZSAmJiBpc0FycmF5QnVmZmVyKHZhbHVlLmJ1ZmZlcikpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIHJldHVybiBmcm9tT2JqZWN0KHZhbHVlKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIE5vdGU6IENoYW5nZSBwcm90b3R5cGUgKmFmdGVyKiBCdWZmZXIuZnJvbSBpcyBkZWZpbmVkIHRvIHdvcmthcm91bmQgQ2hyb21lIGJ1Zzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvMTQ4XG5CdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG5CdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAoc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IGJ1Zi53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgYnVmID0gYnVmLnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGJ1ZltpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wib2Zmc2V0XCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJsZW5ndGhcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgdmFyIGJ1ZlxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgYnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0IChvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW4pXG5cbiAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJ1ZlxuICAgIH1cblxuICAgIG9iai5jb3B5KGJ1ZiwgMCwgMCwgbGVuKVxuICAgIHJldHVybiBidWZcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KG9iaikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IG51bWJlcklzTmFOKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBBcnJheS1saWtlIE9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwgS19NQVhfTEVOR1RIYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBLX01BWF9MRU5HVEgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICE9IG51bGwgJiYgYi5faXNCdWZmZXIgPT09IHRydWVcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYnVmKSkge1xuICAgICAgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgIH1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBpc0FycmF5QnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgKGFuZCB0aGUgYGlzLWJ1ZmZlcmAgbnBtIHBhY2thZ2UpXG4vLyB0byBkZXRlY3QgYSBCdWZmZXIgaW5zdGFuY2UuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHVzZSBgaW5zdGFuY2VvZiBCdWZmZXJgXG4vLyByZWxpYWJseSBpbiBhIGJyb3dzZXJpZnkgY29udGV4dCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG11bHRpcGxlIGRpZmZlcmVudFxuLy8gY29waWVzIG9mIHRoZSAnYnVmZmVyJyBwYWNrYWdlIGluIHVzZS4gVGhpcyBtZXRob2Qgd29ya3MgZXZlbiBmb3IgQnVmZmVyXG4vLyBpbnN0YW5jZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZnJvbSBhbm90aGVyIGNvcHkgb2YgdGhlIGBidWZmZXJgIHBhY2thZ2UuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNTRcbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nXG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLm1hdGNoKC8uezJ9L2cpLmpvaW4oJyAnKVxuICAgIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0ICAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBVc2UgYnVpbHQtaW4gd2hlbiBhdmFpbGFibGUsIG1pc3NpbmcgZnJvbSBJRTExXG4gICAgdGhpcy5jb3B5V2l0aGluKHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKVxuICB9IGVsc2UgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yICh2YXIgaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZylcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHZhbHVlIFwiJyArIHZhbCArXG4gICAgICAgICdcIiBpcyBpbnZhbGlkIGZvciBhcmd1bWVudCBcInZhbHVlXCInKVxuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXisvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHRha2VzIGVxdWFsIHNpZ25zIGFzIGVuZCBvZiB0aGUgQmFzZTY0IGVuY29kaW5nXG4gIHN0ciA9IHN0ci5zcGxpdCgnPScpWzBdXG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuLy8gQXJyYXlCdWZmZXJzIGZyb20gYW5vdGhlciBjb250ZXh0IChpLmUuIGFuIGlmcmFtZSkgZG8gbm90IHBhc3MgdGhlIGBpbnN0YW5jZW9mYCBjaGVja1xuLy8gYnV0IHRoZXkgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgdmFsaWQuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlciAob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gJ0FycmF5QnVmZmVyJyAmJlxuICAgICAgdHlwZW9mIG9iai5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJylcbn1cblxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICByZXR1cm4gb2JqICE9PSBvYmogLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsImV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsIi8qXG4gKiAgYmFzZTY0LmpzXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbiAqICAgIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiAgUmVmZXJlbmNlczpcbiAqICAgIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0XG4gKi9cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShnbG9iYWwpXG4gICAgICAgIDogdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKGZhY3RvcnkpIDogZmFjdG9yeShnbG9iYWwpXG59KChcbiAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3dcbiAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFxuOiB0aGlzXG4pLCBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gZXhpc3RpbmcgdmVyc2lvbiBmb3Igbm9Db25mbGljdCgpXG4gICAgdmFyIF9CYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIHZhciB2ZXJzaW9uID0gXCIyLjQuNVwiO1xuICAgIC8vIGlmIG5vZGUuanMsIHdlIHVzZSBCdWZmZXJcbiAgICB2YXIgYnVmZmVyO1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgfVxuICAgIC8vIGNvbnN0YW50c1xuICAgIHZhciBiNjRjaGFyc1xuICAgICAgICA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcbiAgICB2YXIgYjY0dGFiID0gZnVuY3Rpb24oYmluKSB7XG4gICAgICAgIHZhciB0ID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYmluLmxlbmd0aDsgaSA8IGw7IGkrKykgdFtiaW4uY2hhckF0KGkpXSA9IGk7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0oYjY0Y2hhcnMpO1xuICAgIHZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuICAgIC8vIGVuY29kZXIgc3R1ZmZcbiAgICB2YXIgY2JfdXRvYiA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgaWYgKGMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdmFyIGNjID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgcmV0dXJuIGNjIDwgMHg4MCA/IGNcbiAgICAgICAgICAgICAgICA6IGNjIDwgMHg4MDAgPyAoZnJvbUNoYXJDb2RlKDB4YzAgfCAoY2MgPj4+IDYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpKVxuICAgICAgICAgICAgICAgIDogKGZyb21DaGFyQ29kZSgweGUwIHwgKChjYyA+Pj4gMTIpICYgMHgwZikpXG4gICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgPyBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWwuYnRvYShiKTtcbiAgICB9IDogZnVuY3Rpb24oYikge1xuICAgICAgICByZXR1cm4gYi5yZXBsYWNlKC9bXFxzXFxTXXsxLDN9L2csIGNiX2VuY29kZSk7XG4gICAgfTtcbiAgICB2YXIgX2VuY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICA/IGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICByZXR1cm4gKHUuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvciA/IHUgOiBidWZmZXIuZnJvbSh1KSlcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIH1cbiAgICAgICAgOiAgZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgICAgIHJldHVybiAodS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yID8gdSA6IG5ldyAgYnVmZmVyKHUpKVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh1KSB7IHJldHVybiBidG9hKHV0b2IodSkpIH1cbiAgICA7XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuICF1cmlzYWZlXG4gICAgICAgICAgICA/IF9lbmNvZGUoU3RyaW5nKHUpKVxuICAgICAgICAgICAgOiBfZW5jb2RlKFN0cmluZyh1KSkucmVwbGFjZSgvWytcXC9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0wID09ICcrJyA/ICctJyA6ICdfJztcbiAgICAgICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIC8vIGRlY29kZXIgc3R1ZmZcbiAgICB2YXIgcmVfYnRvdSA9IG5ldyBSZWdFeHAoW1xuICAgICAgICAnW1xceEMwLVxceERGXVtcXHg4MC1cXHhCRl0nLFxuICAgICAgICAnW1xceEUwLVxceEVGXVtcXHg4MC1cXHhCRl17Mn0nLFxuICAgICAgICAnW1xceEYwLVxceEY3XVtcXHg4MC1cXHhCRl17M30nXG4gICAgXS5qb2luKCd8JyksICdnJyk7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIGF0b2IgPSBnbG9iYWwuYXRvYiA/IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbC5hdG9iKGEpO1xuICAgIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvW1xcc1xcU117MSw0fS9nLCBjYl9kZWNvZGUpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBidWZmZXIgP1xuICAgICAgICBidWZmZXIuZnJvbSAmJiBVaW50OEFycmF5ICYmIGJ1ZmZlci5mcm9tICE9PSBVaW50OEFycmF5LmZyb21cbiAgICAgICAgPyBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBidWZmZXIuZnJvbShhLCAnYmFzZTY0JykpLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBuZXcgYnVmZmVyKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGJ0b3UoYXRvYihhKSkgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKFxuICAgICAgICAgICAgU3RyaW5nKGEpLnJlcGxhY2UoL1stX10vZywgZnVuY3Rpb24obTApIHsgcmV0dXJuIG0wID09ICctJyA/ICcrJyA6ICcvJyB9KVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL10vZywgJycpXG4gICAgICAgICk7XG4gICAgfTtcbiAgICB2YXIgbm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NCA9IF9CYXNlNjQ7XG4gICAgICAgIHJldHVybiBCYXNlNjQ7XG4gICAgfTtcbiAgICAvLyBleHBvcnQgQmFzZTY0XG4gICAgZ2xvYmFsLkJhc2U2NCA9IHtcbiAgICAgICAgVkVSU0lPTjogdmVyc2lvbixcbiAgICAgICAgYXRvYjogYXRvYixcbiAgICAgICAgYnRvYTogYnRvYSxcbiAgICAgICAgZnJvbUJhc2U2NDogZGVjb2RlLFxuICAgICAgICB0b0Jhc2U2NDogZW5jb2RlLFxuICAgICAgICB1dG9iOiB1dG9iLFxuICAgICAgICBlbmNvZGU6IGVuY29kZSxcbiAgICAgICAgZW5jb2RlVVJJOiBlbmNvZGVVUkksXG4gICAgICAgIGJ0b3U6IGJ0b3UsXG4gICAgICAgIGRlY29kZTogZGVjb2RlLFxuICAgICAgICBub0NvbmZsaWN0OiBub0NvbmZsaWN0XG4gICAgfTtcbiAgICAvLyBpZiBFUzUgaXMgYXZhaWxhYmxlLCBtYWtlIEJhc2U2NC5leHRlbmRTdHJpbmcoKSBhdmFpbGFibGVcbiAgICBpZiAodHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgbm9FbnVtID0gZnVuY3Rpb24odil7XG4gICAgICAgICAgICByZXR1cm4ge3ZhbHVlOnYsZW51bWVyYWJsZTpmYWxzZSx3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlfTtcbiAgICAgICAgfTtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NC5leHRlbmRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgU3RyaW5nLnByb3RvdHlwZSwgJ2Zyb21CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlKHRoaXMpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICd0b0Jhc2U2NCcsIG5vRW51bShmdW5jdGlvbiAodXJpc2FmZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHVyaXNhZmUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICd0b0Jhc2U2NFVSSScsIG5vRW51bShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vXG4gICAgLy8gZXhwb3J0IEJhc2U2NCB0byB0aGUgbmFtZXNwYWNlXG4gICAgLy9cbiAgICBpZiAoZ2xvYmFsWydNZXRlb3InXSkgeyAvLyBNZXRlb3IuanNcbiAgICAgICAgQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgLy8gbW9kdWxlLmV4cG9ydHMgYW5kIEFNRCBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLlxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGhhcyBwcmVjZWRlbmNlLlxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cy5CYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCl7IHJldHVybiBnbG9iYWwuQmFzZTY0IH0pO1xuICAgIH1cbiAgICAvLyB0aGF0J3MgaXQhXG4gICAgcmV0dXJuIHtCYXNlNjQ6IGdsb2JhbC5CYXNlNjR9XG59KSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xyXG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XHJcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6IHJldHVybiAnZnVuY3Rpb24nXHJcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJ1xyXG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnXHJcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cydcclxuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSdcclxuICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6IHJldHVybiAnc3RyaW5nJ1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcgJiYgdmFsICYmIHR5cGVvZiB2YWwubGVuZ3RoID09ICdudW1iZXInKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodHlwZW9mIHZhbC5jYWxsZWUgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuICdhcmd1bWVudHMnO1xyXG4gICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuICdhcmd1bWVudHMnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnXHJcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCdcclxuICBpZiAodmFsICYmIHZhbC5ub2RlVHlwZSA9PT0gMSkgcmV0dXJuICdlbGVtZW50J1xyXG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCdcclxuXHJcbiAgcmV0dXJuIHR5cGVvZiB2YWxcclxufVxyXG4iXX0=
