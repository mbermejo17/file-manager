((c, d) => {
   
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

    $('#logout').on('click',(e)=>{
        e.preventDefault()
        $('#logoutmodal').hide()
        logout()
    })
    $('#cancel').on('click',(e)=>{
        e.preventDefault()
        $('#logoutmodal').hide()
    })
    $('#modaltrigger').leanModal({ top: 110, overlay: 0.45, closeButton: ".hidemodal" })
   
})(console.log,document)