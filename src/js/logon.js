import ajax from './vendor/ajax'
import { Base64 } from 'js-base64';
import md5 from './vendor/md5.min'
((c, d) => {
    let waiting = d.querySelector('#waiting')
    const READY_STATE_COMPLETE = 4
    const OK = 200
    const NOT_FOUND = 404
    const preload = d.querySelector('#loader')
    const main = d.querySelector('#main')
    const loginbutton = d.querySelector('#login-button')

    c(loginbutton)

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
            url: '/filemanager/login',
            data: { username: username, password: Base64.encode(md5(password)) },
            ajaxtimeout: 40000,
            beforeSend: () => {
                waiting.style.display = 'block'
                waiting.classList.add('active')
            },
            success: (data) => {
                console.log(JSON.parse(data))
                let { status, message } = JSON.parse(data)
                if (status === 'FAIL') {
                    d.querySelector('#message').innerHTML = message
                } else {
                    //d.location.href = message
                    console.log(message)
                }
            },
            complete: (xhr, status) => {
                console.log(xhr, status)
                waiting.style.display = 'none'
            },
            error: (xhr, err) => {
                if (err === 'timeout') {
                    console.log('Timeout Error')
                } else {
                    console.log(xhr, err)
                }
            }
        })
    }
    main.style.display = 'block'
    preload.style.display = 'none'
    loginbutton.addEventListener('click', submit)
})(console.log, document)