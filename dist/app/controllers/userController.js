//const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const md5 = require('js-md5');
const Base64 = require('js-base64').Base64;
const config = require('../config/config.json');
const JWT_KEY = config.jwtKey;


const User = require("../models/user");

exports.Index = (req, res, next) => {
    const cookie = req.cookies.sessionId;
    console.log('user:Controller.Index');
    if (cookie === undefined) {
        res.render('index', { title: 'Logon', message: '' });
    } else {
        if (req.cookies.token) {
            res.render('dashboard', {
                "UserName": data.UserName,
                "Token": req.cookies.token,
                "Role": req.cookies.UserRole,
                "wssURL": req.cookies.wssURL
            });
        }
    }
};

exports.Dashboard = (req, res, next) => {
    console.log('user:Controller.Dashboard');
    res.render('dashboard', {
        "UserName": req.cookies.UserName,
        "Token": req.cookies.token,
        "Role": req.cookies.UserRole,
        "wssURL": req.cookies.wssURL
    });
};

exports.UserLogin = (req, res, next) => {
    User.Find(`SELECT UserName, UserPasswd, UserRole FROM Users WHERE UPPER(UserName) = '${req.body.username.toUpperCase()}'`, (status, data) => {
        console.log("User Find : " + status);
        console.dir(data);
        if (status) {
            console.log(status);
            res.status(500).json({ "status": 'FAIL', "message": status });
        } else {
            if (data) {
                //bcrypt.compare(req.body.password, data.UserPasswd, (err, result) => {
                //console.log(Base64.encode(req.body.userpasswd));     
                //console.log(Base64.decode(data.UserPasswd));  
                if (Base64.decode(req.body.userpasswd) === data.UserPasswd) {
                    /* const token = jwt.sign({
                        UserName: data.UserName,
                        UserId: data._id
                    }, process.env.JWT_KEY, { expiresIn: "1h" }); */
                    let wsPath = (data.UserRole === 'assistant') ? config.wssURL + '/room' : config.wssURL + '/client';
                    const token = jwt.sign({
                        "UserName": data.UserName,
                        "UserId": data._id,
                        "Role": data.UserRole,
                        "wssURL": wsPath
                    }, JWT_KEY, { expiresIn: "10min" });

                    res.cookie('sessionId', Base64.encode(data.UserName), { maxAge: 900000 });
                    return res.status(200).json({
                        "status": 'OK',
                        "message": {
                            "UserName": data.UserName,
                            "Token": token,
                            "Role": data.UserRole,
                            "wssURL": wsPath
                        }
                    });
                } else {
                    return res.status(401).json({ "status": 'FAIL', "message": "Auth failed" });
                }
            } else {
                return res.status(401).json({ "status": 'FAIL', "message": "Auth failed" });
            }
        }
    });
};

