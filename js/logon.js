import ajax from './vendor/ajax';
import {
  Base64
} from 'js-base64';
import md5 from './vendor/md5.min';
import Cookies from './vendor/js-cookie';

((c, d) => {
  console.log(navigator.userAgent.indexOf("MSIE"));
  console.log(navigator.userAgent.indexOf("Edge"));
  if(navigator.userAgent.indexOf("MSIE")!=-1 || navigator.userAgent.indexOf("Edge") !=-1 || navigator.userAgent.indexOf("rv:11")!=-1) {
    document.getElementById("password-field").style.display ="none"; 
  }

  let waiting = d.querySelector('#waiting')
  const READY_STATE_COMPLETE = 4
  const OK = 200
  const NOT_FOUND = 404
  const loader = d.querySelector('#loader')
  const main = d.querySelector('#main')
  const loginbutton = d.querySelector('#login-button')

  const hasClass = (el, className) => {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }

  const addClass = (el, className) => {
    if (el.classList)
      el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
  }

  const removeClass = (el, className) => {
    if (el.classList)
      el.classList.remove(className)
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className = el.className.replace(reg, ' ')
    }
  }

  let logout = function () {
    Cookies.remove('UserName');
    Cookies.remove('UserRole');
    Cookies.remove('sessionId');
    Cookies.remove('token');
    Cookies.remove('wssURL');
    Cookies.remove('RootPath');
    Cookies.remove('CompanyName');
    Cookies.remove('AccessString');
    document.location.href = '/';
  }

  let showDashboard = function (data) {
    console.log("data::showDashboard: ",data);
    Cookies.set('token', data.Token);
    Cookies.set('UserName', data.UserName);
    Cookies.set('UserRole', data.Role);
    Cookies.set('wssURL', data.wssURL);
    Cookies.set('CompanyName', data.CompanyName);
    Cookies.set('RootPath', data.RootPath);
    Cookies.set('AccessString', data.AccessString);
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
      data: {
        username: username,
        password: Base64.encode(md5(password))
      },
      ajaxtimeout: 40000,
      beforeSend: () => {
        addClass(waiting, 'active')
      },
      success: (data) => {
        console.log(data);
        //console.log(JSON.parse(data))
        let dataJSON = JSON.parse(data)
        console.log('status', dataJSON.status)
        if (status === 'FAIL') {
          M.toast({
            html: dataJSON.message
          })
          document.querySelector('#message').innerHTML = dataJSON.message
        } else {
          showDashboard(dataJSON.data)
        }
      },
      complete: (xhr, status) => {
        console.log(xhr, status)
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
        removeClass(waiting, 'active')
      }
    })
  }
  loader.style.display = 'none'
  loginbutton.addEventListener('click', submit)
  
  d.getElementById("password-field").addEventListener('mouseout',(e)=>{
    d.querySelector("#password").setAttribute("type","password")
  })

  d.getElementById("password-field").addEventListener('click',(e)=> {
    c('password-field click',e)

    let cName = d.getElementById("password-field").className;
    if(cName.indexOf("fa-eye") > -1) {
      e.target.classList.add("fa-eye")
    } else {
      e.target.classList.remove("fa-eye")
    }
    if(cName.indexOf("fa-eye-slash") >-1) {
      e.target.classList.add("fa-eye-slash")
    }else {
      e.target.classList.remove("fa-eye-sl")
    }
   
    var input =  d.querySelector("#password");
    console.log(input)
    if (input.getAttribute("type") == "password") {
      input.setAttribute("type","text")
    } else {
      input.setAttribute("type","password")
    }
  });
  document.querySelector('#bar-preloader').style.display='none';
  
})(console.log, document)
