import ajax from './vendor/ajax'
import { Base64 } from 'js-base64';
import md5 from './vendor/md5.min'
$(document).ready(function() {
    const setCookie = function(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + ";path='/'";
    };

    const getCookie = function(cname) {
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
        return ""
    };

    const UserName = getCookie('UserName');
    const UserRole = getCookie('UserRole');
    const CompanyName = getCookie('CompanyName');
    const RootPath = getCookie('RootPath');
    const Token = getCookie('token');
    const AccessString = getCookie('AccessString');
    const [AllowNewFolder,
        AllowRenameFolder,
        AllowRenameFile,
        AllowDeleteFolder,
        AllowDeleteFile,
        AllowUpload,
        AllowDownload
    ] = AccessString.split(',');
    let currentPath = RootPath + '\\';

    console.log(AccessString.split(','));
    console.log('AllowNewFolder', AllowNewFolder);
    console.log('AllowDeleteFolder', AllowDeleteFolder);
    console.log('AllowDeleteFile', AllowDeleteFile);
    console.log('AllowUpload', AllowUpload);
    console.log('AllowDownload', AllowDownload);

    const logout = () => {
        setCookie('UserName', '', 0);
        setCookie('UserRole', '', 0);
        setCookie('sessionId', '', 0);
        setCookie('token', '', 0);
        setCookie('wssURL', '', 0);
        document.location.href = '/';
    };
    const changePath = (newPath) => {
        const p1 = currentPath.split(newPath);
        console.log(p1[0] + "\\" + newPath);
        currentPath = p1[0] + "\\" + newPath;
        refreshPath(currentPath);
        refreshBarMenu();
    };
    const refreshPath = (cPath) => {
        let cPathArray = cPath.split('\\');
        let newHtmlContent = `<li><label id="currentpath">Path:</label></li>`;
        const headers = new Headers();
         
        console.log(cPath);
        headers.append( 'Authorization', 'Bearer ' + Token);
        cPathArray.forEach((val, idx, array) => {
            newHtmlContent += `<li><a class="breadcrumb" href="#!">${val}</a></li><li></li>`;
        });
        $('#currentPath').html(newHtmlContent);

        $('.breadcrumb').on('click',(e)=>{
            changePath(e.target.innerText);
        });
        fetch('/files?path=' + encodeURI(cPath),{
            method: 'GET',
            headers: headers
        }).then(r =>r.json()).then((data)=>{
            console.log(data);
            refreshFilesTable(data);
        }).catch((err)=>{
            console.log(err)    
        });
    };



    const refreshFilesTable = (data) => {
        const tbodyContent = document.getElementById("tbl-files").getElementsByTagName('tbody')[0];
        let newHtmlContent = ``;
        console.log(data);
        data.forEach((val, idx, array) => {
            let fileSize = parseInt(val.size /1024);
            newHtmlContent += `<tr><td><input class="filled-in" id="${val.name}" type="checkbox">
                               <label class="checkbox left" for="${val.name}"></label></td>`;
            if(val.isFolder) {
                newHtmlContent += `<td><a href="#" class="file-Name">${val.name}</a></td>`;       
            } else {
                newHtmlContent += `<td>${val.name}</td>`;
            }                  
            newHtmlContent += `<td>${fileSize} KB</td><td>${val.date}</td></tr>`;
        });
        tbodyContent.innerHTML= newHtmlContent;
        $('.file-Name').on('click',(e)=>{
            console.log(e);
            refreshPath(currentPath + '\\'+ e.target.innerText);
            currentPath = currentPath + '\\'+ e.target.innerText;
            refreshBarMenu();
        });
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
        $('.modal-content').css('width: 400px;');
        $('#modal').show();
        $('#AcceptChangeUserPassword').on('click', (e) => {
            e.preventDefault();
            let username = UserName;
            let newpassword = $('#newpassword').val();
            console.log(username, newpassword);
            ajax({
                type: 'POST',
                url: '/user/changePassword',
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
                    let { status, message } = JSON.parse(data)
                    console.log('status', status)
                    if (status === 'FAIL') {
                        M.toast({ html: message })
                        d
                            .querySelector('#message')
                            .innerHTML = message
                    } else {
                        showDashboard(message)
                        console.log(message)
                    }
                },
                complete: (xhr, status) => {
                    console.log(xhr, status)
                        //waiting.style.display = 'none'
                    $('#modal').hide()
                },
                error: (xhr, err) => {
                    M.toast({ html: 'Wrong password' })
                    if (err === 'timeout') {
                        console.log('Timeout Error')
                    } else {
                        console.log(xhr, err)
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
        (AllowNewFolder === '1') ?
        $('#NewFolder').removeClass('disabled'): $('#NewFolder').addClass('disabled');
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
        (AllowUpload == '1') ?
        $('#upload').removeClass('disabled'): $('#upload')
            .removeClass('disabled')
            .addClass('disabled');

        (AllowDownload == '1') ?
        $('#download').removeClass('disabled'): $('#download')
            .removeClass('disabled')
            .addClass('disabled');
        (UserRole == 'admin') ?
        $('#settings').show(): $('#settings').hide();
        $('#modaltrigger').html(UserName);
        $('#modaltrigger').leanModal({ top: 110, overlay: 0.45, closeButton: ".hidemodal" });
    };
    $('a').on('click', function(e) {
        console.log(this.id);
        console.log($(this).hasClass('disabled'));
        e.preventDefault();
        
        if (!$(this).hasClass('disabled')) {
            switch (this.id) {
                case 'settings':
                    break;
                case 'usertrigger':
                    $('#Usersdropdown').show();
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
                    currentPath = RootPath + '\\';
                    refreshPath(currentPath);
                    break;
                case 'newFolder':
                    M.toast({ html: 'Opcion no disponible' });
                    break;
                case 'delete':
                    M.toast({ html: 'Opcion no disponible' });
                    break;
                case 'upload':
                    M.toast({ html: 'Opcion no disponible' });
                    break;
                case 'download':
                    M.toast({ html: 'Opcion no disponible' });
                    break;
            }
        } else {
            M.toast({ html: 'Opcion no permitida' });
        }
    });
    $('#usertrigger').html(UserName).attr('title','Empresa: '+UserCompany);
    refreshPath(currentPath);
    refreshBarMenu();
});