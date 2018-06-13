$(document).ready(function() {

    const setCookie = function(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + ";path='/'";
    }

    const getCookie = function(cname) {
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
    const UserRole = getCookie('UserName')
    const CompanyName = getCookie('CompanyName')
    const RootPath = getCookie('RootPath')
    const AccessString = getCookie('AccessString')
    const [AllowNewFolder, AllowDeleteFolder, AllowDeleteFile, AllowUpload, AllowDownload] = AccessString.split(',')
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

    AllowNewFolder === '1' ? $('#NewFolder').removeClass('disabled') : $('#NewFolder').addClass('disabled')
    if (AllowDeleteFolder === '1' && AllowDeleteFile === '1') {
        $('#delete').removeClass('disabled')
    } else {
        $('#delete').removeClass('disabled')
        $('#delete').addClass('disabled')
    }
    AllowUpload == '1' ? $('#upload').removeClass('disabled') : $('#upload').removeClass('disabled').addClass('disabled')
    AllowDownload == '1' ? $('#download').removeClass('disabled') : $('#download').removeClass('disabled').addClass('disabled')

    $('#modaltrigger').html(UserName)
    $('#modaltrigger').leanModal({
        top: 110,
        overlay: 0.45,
        closeButton: ".hidemodal"
    })
    $('a').on('click', function(e) {
        console.log(this.id)
        console.log($(this).hasClass('disabled'))
        e.preventDefault()
        if (!$(this).hasClass('disabled')) {
            switch (this.id) {
                case 'refresh':
                    refreshPath(currentPath)
                    break
                case 'logout':
                    $('#logoutmodal').hide()
                    logout()
                    break
                case 'modalClose':
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