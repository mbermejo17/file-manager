import axios from "axios";
import { Base64 } from "js-base64";
import md5 from "./vendor/md5.min";
import Cookies from "./vendor/js-cookie";



((c, d) => {
    const READY_STATE_COMPLETE = 4;
    const OK = 200;
    const NOT_FOUND = 404;
    const main = d.querySelector("#main");
    const loginbutton = d.querySelector("#login-button");

    const hasClass = (el, className) => {
        if (el.classList) return el.classList.contains(className);
        else
            return !!el.className.match(
                new RegExp("(\\s|^)" + className + "(\\s|$)")
            );
    };

    const addClass = (el, className) => {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className += " " + className;
    };

    const removeClass = (el, className) => {
        if (el.classList) el.classList.remove(className);
        else if (hasClass(el, className)) {
            var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
            el.className = el.className.replace(reg, " ");
        }
    };

    let logout = function() {
        Cookies.remove("UserName");
        Cookies.remove("UserFullName");
        Cookies.remove("UserEmail");
        Cookies.remove("UserRole");
        Cookies.remove("sessionId");
        Cookies.remove("token");
        Cookies.remove("wssURL");
        Cookies.remove("RootPath");
        Cookies.remove("CompanyName");
        Cookies.remove("AccessString");
        Cookies.remove("MaxFileSize");
        document.location.href = "/";
    };

    let showDashboard = function(data) {
        Cookies.set("UserName", data.UserName);
        Cookies.set("UserFullName", data.UserFullName);
        Cookies.set("UserEmail", data.UserEmail);
        Cookies.set("UserRole", data.Role);
        Cookies.set("wssURL", data.wssURL);
        Cookies.set("CompanyName", data.CompanyName);
        Cookies.set("RootPath", data.RootPath);
        Cookies.set("AccessString", data.AccessString);
        Cookies.set("RunMode", data.RunMode);
        Cookies.set("MaxFileSize", data.MaxFileSize);
        Cookies.set("token", data.Token);
        window.location.href = "/dashboard";
    };

    function showToast(title, msg, type, icon = true) {
        toast.create({
            title: title,
            text: msg,
            type: type,
            icon: icon
        });
    }

    function submit(e) {
        e.preventDefault();
        let username = d.querySelector("#username").value;
        let password = d.querySelector("#password").value;
        let form = d.querySelector("#formLogon");
        if (username.trim() == "" || password.trim() == "") {
            showToast("Error", "Username or Password not provided", "error");
            return false;
        }

        $u("#waiting").addClass("active");

        axios
            .post(
                "/login", {
                    username: username,
                    password: Base64.encode(md5(password))
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }
            )
            .then(d => {
                //let d = JSON.parse(responseData);
                $u("#waiting").addClass("active");
                console.log('Login:', d.data);
                if (d.data.status === "OK") {
                    showDashboard(d.data.data);
                } else {
                    showToast(
                        "Login",
                        d.data.data.message,
                        "error",
                        "fas fa-exclamation-triangle"
                    );
                    document.querySelector("#message").innerHTML = d.data.data.message;
                }
            })
            .catch((e) => {
                $u("#waiting").removeClass("active");
                if (e.response.status === 403) {
                    showToast("Login", e.response.data.message, "error");
                } else {
                    showToast("Login", "Wrong user name or password", "error");
                }
                //console.log('Logon result:',e.response.status);
            });
    }

    loginbutton.addEventListener("click", submit);

    $u("#waiting").removeClass("active");

    [].forEach.call(document.querySelectorAll("input"), function(el) {
        el.addEventListener("blur", function(e) {
            if (e.target.value) $u("#" + e.target.id).addClass("used");
            else $u("#" + e.target.id).removeClass("used");
        });
    });

})(console.log, document);