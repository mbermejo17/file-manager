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
   
   
   const logout = ()=>{
        setCookie('UserName', '', 0)
        setCookie('UserRole', '', 0)
        setCookie('sessionId', '', 0)
        setCookie('token', '', 0)
        setCookie('wssURL', '', 0)
        document.location.href = '/'
    }

  

    $('#modaltrigger').leanModal({ top: 110, overlay: 0.45, closeButton: ".hidemodal" })
    $('a').on('click',function(e){
        console.log(this.id)
        e.preventDefault()
        switch (this.id) {
            case 'refresh':
                $('#logoutmodal').hide()
                logout()
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
                M.toast({html: 'Opcion no disponible'})
                break
            case 'newFolder':
                M.toast({html: 'Opcion no disponible'})
                break
            case 'delete':
                M.toast({html: 'Opcion no disponible'})
                break
            case 'upload':
                M.toast({html: 'Opcion no disponible'})
                break
            case 'download':
                M.toast({html: 'Opcion no disponible'})
                break
        }
    })
})