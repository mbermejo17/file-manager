import ajax from './vendor/ajax'
import { Base64 } from 'js-base64';
import md5 from './vendor/md5.min'
((c, d) => {
    let waiting = d.querySelector('#waiting')
    const READY_STATE_COMPLETE = 4
    const OK = 200
    const NOT_FOUND = 404
    const loader = d.querySelector('#loader')
    const main = d.querySelector('#main')
    const loginbutton = d.querySelector('#login-button')

    let setCookie = function(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + ";path='/'";
    }


    let getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    let logout = function() {
        setCookie('UserName', '', 0)
        setCookie('UserRole', '', 0)
        setCookie('sessionId', '', 0)
        setCookie('token', '', 0)
        setCookie('wssURL', '', 0)
        setCookie('CompanyName', '', 0);
        setCookie('RootPath', '', 0);
        setCookie('AccessString', '', 0);
        document.location.href = '/'
    }

    let showDashboard = function(data) {
        console.log("hola");
        setCookie('token', data.Token, 1);
        setCookie('UserName', data.UserName, 1);
        setCookie('UserRole', data.Role, 1);
        setCookie('wssURL', data.wssURL, 1);
        setCookie('CompanyName', data.CompanyName, 1);
        setCookie('RootPath', data.RootPath, 1);
        setCookie('AccessString', data.AccessString, 1);
        window.location.href = '/dashboard';
    };


    function submit(e) {
        e.preventDefault()
        let username = d.querySelector('#username').value
        let password = d.querySelector('#password').value
        let form = d.querySelector('#formLogon')
            //d.querySelector('#password').value = Base64.encode(md5(password)
        console.log(password)
        console.log(md5(password))
        console.log(Base64.encode(md5(password)))
        ajax({
            type: 'POST',
            url: '/login',
            data: { username: username, password: Base64.encode(md5(password)) },
            ajaxtimeout: 40000,
            beforeSend: () => {
                waiting.style.display = 'block'
                waiting.classList.add('active')
            },
            success: (data) => {
                //console.log(JSON.parse(data))
                let { status, message } = JSON.parse(data)
                console.log('status', status)
                if (status === 'FAIL') {
                    M.toast({
                        html: message
                    })
                    d.querySelector('#message').innerHTML = message
                } else {
                    showDashboard(message)
                    console.log(message)
                }
            },
            complete: (xhr, status) => {
                console.log(xhr, status)
                waiting.style.display = 'none'
            },
            error: (xhr, err) => {
                M.toast({
                    html: 'Wrong user name or password'
                })
                if (err === 'timeout') {
                    console.log('Timeout Error')
                } else {
                    console.log(xhr, err)
                }
            }
        })
    }
    //logout()
    //main.style.display = 'block'
    waiting.style.display = 'none'
    loader.style.display = 'none'
    loginbutton.addEventListener('click', submit)
})(console.log, document)
