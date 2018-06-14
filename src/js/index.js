$(document).ready(function () {

    const setCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + ";path='/'";
    }

    const getCookie = function (cname) {
        let name = cname + "="
        let decodedCookie = decodeURIComponent(document.cookie)
        let ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ""
    }

    const UserName = getCookie('UserName')
    const UserRole = getCookie('UserRole')
    const CompanyName = getCookie('CompanyName')
    const RootPath = getCookie('RootPath')
    const AccessString = getCookie('AccessString')
    const [AllowNewFolder, AllowRenameFolder, AllowRenameFile, AllowDeleteFolder, AllowDeleteFile, AllowUpload, AllowDownload] = AccessString.split(',')
    let currentPath = RootPath + '\\'

    console.log(AccessString.split(','))
    console.log('AllowNewFolder', AllowNewFolder)
    console.log('AllowDeleteFolder', AllowDeleteFolder)
    console.log('AllowDeleteFile', AllowDeleteFile)
    console.log('AllowUpload', AllowUpload)
    console.log('AllowDownload', AllowDownload)


    const logout = () => {
        setCookie('UserName', '', 0)
        setCookie('UserRole', '', 0)
        setCookie('sessionId', '', 0)
        setCookie('token', '', 0)
        setCookie('wssURL', '', 0)
        document.location.href = '/'
    }


    const refreshPath = (cPath) => {
        let cPathArray = cPath.split('\\')
        let newHtmlContent = `<li><label id="currentpath">Path:</label></li>`

        cPathArray.forEach((val, idx, array) => {
            newHtmlContent += `<li><a class="breadcrumb" href="#!">${val}</a></li><li>\</li>`
        })
        $('#currentPath').html(newHtmlContent)
    }

    const showUserProfile = ()=>{
        let ModalTitle = 'User Profile'
        let ModalContent = `<table id="tableUserProfile" class="striped highlight">
                               <tr><td>User Name:</td><td>${UserName}</td></tr>
                               <tr><td>User Role:</td><td>${UserRole}</td></tr> 
                               <tr><td>Company Name:</td><td>${CompanyName}</td></tr>
                               <tr><td colspan="2" style="text-align:center;border-botom:1px solid #CCC"><strong>Access</strong></td></tr>
                               <tr><td>Allow new Folder:</td><td>${AllowNewFolder}</td></tr>
                               <tr><td>Allow rename Folder:</td><td>${AllowRenameFolder}</td></tr>
                               <tr><td>Allow rename File:</td><td>${AllowRenameFile}</td></tr>
                               <tr><td>Allow delete Folder:</td><td>${AllowDeleteFolder}</td></tr>
                               <tr><td>Allow delete File:</td><td>${AllowDeleteFile}</td></tr>
                               <tr><td>Allow Upload:</td><td>${AllowUpload}</td></tr>
                               <tr><td>Allow Download:</td><td>${AllowDownload}</td></tr>
                            </table>`
        let htmlContent = `<div id="modal-header">
          <h5>${ModalTitle}</h5>
          <a class="modal_close" id="modalClose" href="#hola"></a>
        </div>
        <div class="modal-content">
          <p>${ModalContent}</p>
        </div>
        <div class="modal-footer">
            <a class="modal-action modal-close waves-effect waves-teal btn-flat btn2-unify" id="ModalClose" href="#!">Close</a>
        </div>    `
        $('#modal').html(htmlContent)
        $('#modal').show()
    }

    AllowNewFolder === '1' ? $('#NewFolder').removeClass('disabled') : $('#NewFolder').addClass('disabled')
    if (AllowDeleteFolder === '1' && AllowDeleteFile === '1') {
        $('#delete').removeClass('disabled')
    } else {
        $('#delete').removeClass('disabled')
        $('#delete').addClass('disabled')
    }
    if (AllowRenameFolder === '1' && AllowRenameFile === '1') {
        $('#rename').removeClass('disabled')
    } else {
        $('#rename').removeClass('disabled')
        $('#rename').addClass('disabled')
    }
    AllowUpload == '1' ? $('#upload').removeClass('disabled') : $('#upload').removeClass('disabled').addClass('disabled')
    AllowDownload == '1' ? $('#download').removeClass('disabled') : $('#download').removeClass('disabled').addClass('disabled')

    UserRole == 'admin'? $('#settings').show() : $('#settings').hide()

    $('#modaltrigger').html(UserName)
    $('#modaltrigger').leanModal({
        top: 110,
        overlay: 0.45,
        closeButton: ".hidemodal"
    })


    

    $('a').on('click', function (e) {
        console.log(this.id)
        console.log($(this).hasClass('disabled'))

        e.preventDefault()
        if (!$(this).hasClass('disabled')) {
            switch (this.id) {
                case 'settings':
                    break
                case 'usertrigger':
                    $('#Usersdropdown').show()
                    break
                case 'refresh':
                    refreshPath(currentPath)
                    break
                case 'userLogout':
                    $('#Usersdropdown').hide()
                    $('#logoutmodal').show()
                    break
                case 'ModalUserLogout':
                    $('#logoutmodal').hide()
                    logout()
                    break
                case 'userChangePassword':
                    $('#Usersdropdown').hide()
                    logout()
                    break
                case 'userProfile':
                    $('#Usersdropdown').hide()
                    showUserProfile()
                    break
                case 'modalClose':    
                case 'ModalClose':
                    $('#modal').hide()
                    break
                case 'logoutModalClose':
                case 'cancel':
                    $('#logoutmodal').hide()
                    break
                case 'home':
                    currentPath = RootPath + '\\'
                    refreshPath(currentPath)
                    break
                case 'newFolder':
                    M.toast({
                        html: 'Opcion no disponible'
                    })
                    break
                case 'delete':
                    M.toast({
                        html: 'Opcion no disponible'
                    })
                    break
                case 'upload':
                    M.toast({
                        html: 'Opcion no disponible'
                    })
                    break
                case 'download':
                    M.toast({
                        html: 'Opcion no disponible'
                    })
                    break
            }
        } else {
            M.toast({
                html: 'Opcion no permitida'
            })
        }
    })

    refreshPath(currentPath)
})