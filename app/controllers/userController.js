//const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const md5 = require('js-md5');
const Base64 = require("js-base64").Base64;
const config = require("../config/config.json");
const JWT_KEY = config.jwtKey;
const fs = require("fs");
const normalize = require("normalize-path");
const settings = require('../config/config.json');
const pathPrefix = settings.repositoryPath;
//const pathPrefix = ".\\repository\\";
const User = require("../models/user");
const Audit = require("../controllers/auditController");
const moment = require("moment");


const makeUserPathIfNotExist = (p, callback) => {
    let r;
    if (p) {
        let newFolder = normalize(pathPrefix + "/" + p.toUpperCase());
        if (!fs.existsSync(newFolder)) {
            r = fs.mkdir(newFolder);
        }
    }
    if (process.env.NODE_ENV === 'dev') console.log("makeNewPath: newpath ", p);
    if (process.env.NODE_ENV === 'dev') console.log("makeNewPath: result ", r);
    callback(r);
};

exports.Index = (req, res, next) => {
    const cookie = req.cookies.sessionId;
    if (process.env.NODE_ENV === 'dev') console.log("user:Controller.Index");
    if (cookie === undefined) {
        res.render("logon", {
            title: "Logon",
            message: ""
        });
    } else {
        if (req.cookies.token) {
            if (process.env.NODE_ENV === 'dev') console.log("render dashboard");
            res.render("dashboard", {
                UserName: req.UserName,
                UserFullName: req.UserFullName,
                UserEmail: req.UserEmail,
                Token: req.cookies.token,
                Role: req.cookies.UserRole,
                wssURL: req.cookies.wssURL,
                MaxFileSize: req.cookies.MaxFileSize
            });
        }
    }
};

exports.Dashboard = (req, res, next) => {
    if (process.env.NODE_ENV === 'dev') console.log("user:Controller.Dashboard");
    if (process.env.NODE_ENV === 'dev') console.log(req.cookies);
    res.render("dashboard", {
        UserName: req.cookies.UserName,
        UserFullName: req.cookies.UserFullName,
        UserEmail: req.cookies.UserEmail,
        Token: req.cookies.token,
        Role: req.cookies.UserRole,
        wssURL: req.cookies.wssURL,
        MaxFileSize: req.cookies.MaxFileSize
    });
};

exports.changePasswd = (req, res, next) => {
    let userData = {
        userName: req.body.username,
        userPasswd: Base64.decode(req.body.newpassword)
    };
    User.ChangePasswd(userData, data => {
        //let dataJSON = JSON.parse(data);
        if (data.status !== "OK") {
            return res.status(500).json(data);
        } else {
            return res.status(200).json(data);
        }
    });
};

exports.UserAdd = (req, res) => {
    let data = req.body;
    let userName = req.cookies.UserName;
    let userFullName = req.cookies.UserFullName;
    let userEmail = req.cookies.UserEmail;
    let userPassword = Base64.decode(data.userPassword);
    let userRole = data.userRole;
    let rootPath = data.rootPath;
    let expirationDate = data.expirateDate;
    let accessRights = data.accessRights;
    let response = [];
    let browserIP = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[1];

    let clientIP = req.connection.remoteAddress;
    let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
    let currentUnixDate = moment().format('x');

    User.Add(data, d => {
        response.push(d);
        if (process.env.NODE_ENV === 'dev') console.log("user Controller response user ADD : ", d);
        if (d.status === "OK") {
            makeUserPathIfNotExist(rootPath, result => {
                if (!result) {
                    // audit
                    if (process.env.NODE_ENV === 'dev') console.log('opcion 1');
                    Audit.Add({
                        userName: userName
                    }, {
                            clientIP: clientIP || '',
                            browserIP: browserIP || ''
                        }, {
                            fileName: rootPath || '',
                            fileSize: 0
                        }, {
                            dateString: currentDate,
                            unixDate: currentUnixDate
                        }, response[0], 'Add User', 'OK', () => {
                            if (process.env.NODE_ENV === 'dev') console.log(result);
                            return res.status(200).json(response[0]);

                        });

                } else {
                    // audit
                    if (process.env.NODE_ENV === 'dev') console.log('opcion 2');
                    Audit.Add({
                        userName: userName
                    }, {
                            clientIP: clientIP || '',
                            browserIP: browserIP || ''
                        }, {
                            fileName: rootPath || '',
                            fileSize: 0
                        }, {
                            dateString: currentdate,
                            unixDate: currentUnixDate
                        }, response[0].message, 'Add User', 'FAIL', () => {
                            return res
                                .status(200)
                                .json({
                                    status: "FAIL",
                                    message: response[0].message + ".<br>Error al crear Carpeta.",
                                    data: null
                                });
                        });

                }
            });
        } else {
            if (process.env.NODE_ENV === 'dev') console.log('hola');
            // audit
            if (process.env.NODE_ENV === 'dev') console.log('opcion 3');
            Audit.Add({
                userName: userName
            }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, response[0], 'Add User', 'FAIL', () => {

                    if (process.env.NODE_ENV === 'dev') console.log('hola2');
                    return res.status(200).json(response[0]);

                });

        }
    });
};

exports.UserUpdate = (req, res) => {
    let data = req.body;
    let userName = data.userName;
    let userFullName = data.userFullName;
    let userEmail = data.userEmail;
    let userId = data.userId;
    let queryString = data.queryString;
    let accessString = "";
    let response = [];
    let newData = {};
    let newRootPath = '';
    let browserIP = req.header('x-forwarded-for') || req.connection.remoteAddress;
    let clientIP = req.connection.remoteAddress;

    for (var propertyName in queryString) {
        if (propertyName == 'RootPath') {
            newRootPath = queryString[propertyName];
        }
        if (propertyName === 'AccessString') {
            let newAccessString = decodeURI(queryString[propertyName]);
            accessString += `${propertyName} = '${newAccessString}',`;
        } else {
            accessString += `${propertyName} = '${queryString[propertyName]}',`;
        }

    }

    if (process.env.NODE_ENV === 'dev') console.log("before:", accessString);
    accessString = accessString.slice(0, -1);
    if (process.env.NODE_ENV === 'dev') console.log("after:", accessString);
    newData = {
        userId: userId,
        queryString: accessString
    };

    User.Update(newData, d => {
        response.push(d);
        if (process.env.NODE_ENV === 'dev') console.log("d : ", d);
        if (d.status === "OK") {
            global.logger.info(`[${req.body.username}] userController::UserController UserUpdate() ->User ${newData.userName} data modified. Data: ${newData.queryString}`);
            // audit
            if (newRootPath === '') {
                return res.status(200).json(response[0]);
            } else {
                makeUserPathIfNotExist(newRootPath, result => {
                    if (!result) {
                        return res.status(200).json(response[0]);
                        if (process.env.NODE_ENV === 'dev') console.log(result);
                    } else {
                        return res
                            .status(200)
                            .json({
                                status: "FAIL",
                                message: response[0].message + ".<br>Error al crear Carpeta.",
                                data: null
                            });
                    }
                });
            }
        } else {
            global.logger.error(`[${req.body.username}] userController::UserController UserUpdate() ->User ${newData.userName} modify data error. ${response[0]}`);
            //audit
            return res.status(200).json(d);
        }
    });
};


exports.UserGetAll = (req, res, next) => {
    User.All(data => {
        if (data.status == "FAIL") {
            if (process.env.NODE_ENV === 'dev') console.log(data.status);
            res.status(500).json({
                status: "FAIL",
                message: data.status,
                data: null
            });
        } else {
            if (process.env.NODE_ENV === 'dev') console.log(data);
            return res.status(200).json({
                status: "OK",
                message: "Users found",
                data: data.data
            });
        }
    });
};

exports.UserFindByName = (req, res, next) => {
    User.Find(
        `SELECT UserName, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate FROM Users WHERE UPPER(UserName) = '${req.query.userName.toUpperCase()}'`,
        (status, data) => {
            if (status) {
                if (process.env.NODE_ENV === 'dev') console.log(status);
                res.status(500).json({
                    status: "FAIL",
                    message: status,
                    data: null
                });
            } else {
                if (data) {
                    if (process.env.NODE_ENV === 'dev') console.log(data);
                    let rootPath = '';
                    if ((data.UserRole.toUpperCase() === "ADMIN") || (data.UserRole.toUpperCase() === "CUSTOM")) {
                        rootPath = data.RootPath ? data.RootPath : "/";
                    } else {
                        rootPath = data.RootPath ? data.RootPath : "GUEST";
                    }
                    return res.status(200).json({
                        status: "OK",
                        message: "User found",
                        data: {
                            UserName: data.UserName,
                            UserFullName: data.UserFullName,
                            UserEmail: data.UserEmail,
                            Role: data.UserRole,
                            UserPasswd: Base64.encode(data.UserPasswd),
                            CompanyName: data.CompanyName,
                            RootPath: rootPath,
                            AccessString: data.AccessString,
                            ExpirateDate: data.ExpirateDate,
                            MaxFileSize: settings.maxFileSize * 1024 * 1024
                        }
                    });
                } else {
                    return res
                        .status(401)
                        .json({
                            status: "FAIL",
                            message: "Auth failed",
                            data: null
                        });
                }
            }
        }
    );
};

exports.UserFindById = (req, res, next) => {
    let userId = req.params.userId;
    User.FindById(userId,
        (d) => {
            if (d.status == 'FAIL') {
                if (process.env.NODE_ENV === 'dev') console.log(status);
                res.status(500).json({
                    status: "FAIL",
                    message: status,
                    data: null
                });
            } else {
                if (d.data) {
                    if (process.env.NODE_ENV === 'dev') console.log(d.data);
                    let rootPath = '';
                    if ((d.data.UserRole.toUpperCase() === "ADMIN") || (d.data.UserRole.toUpperCase() === "CUSTOM")) {
                        rootPath = d.data.RootPath ? d.data.RootPath : "/";
                    } else {
                        rootPath = d.data.RootPath ? d.data.RootPath : "GUEST";
                    }
                    return res.status(200).json({
                        status: "OK",
                        message: "User found",
                        data: {
                            UserId: d.data.UserId,
                            UserName: d.data.UserName,
                            UserFullName: d.data.UserFullName,
                            UserEmail: d.data.UserEmail,
                            UserRole: d.data.UserRole,
                            UserPasswd: Base64.encode(d.data.UserPasswd),
                            CompanyName: d.data.CompanyName,
                            RootPath: rootPath,
                            AccessString: d.data.AccessString,
                            ExpirateDate: d.data.ExpirateDate,
                            MaxFileSize: settings.maxFileSize * 1024 * 1024
                        }
                    });
                }
            }
        }
    );
};


exports.UserRemove = (req, res, next) => {
    let userId = req.params.userId;
    let userName = req.body.userName;
    let browserIP = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[1];

    let clientIP = req.connection.remoteAddress;
    let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
    let currentUnixDate = moment().format('x');
    User.Remove(userId,
        (d) => {
            let action = "Delete User";
            let AuditAdd = Audit.Add({
                userName: userName
            }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, d.message, action, d.status);

            if (process.env.NODE_ENV === 'dev') console.log(d);
            // audit
            global.logger.error(`[${userName}] userController::UserController UserRemove() ->${action} ${d.status}. ${d.message}`);
                console.log("===== Promise ========\n"); 
                console.log(AuditAdd); 
                console.log("===== Promise End ========\n"); 
                AuditAdd.then((data) => {
                    if (process.env.NODE_ENV === 'dev') console.log('hola2');
                    res.status(200).json({
                        status: d.status,
                        message: d.message,
                        data: d.data
                    });
                });
        });
};

exports.UserLogin = (req, res, next) => {
    let browserIP = req.header('x-forwarded-for') || req.connection.remoteAddress;
    let clientIP = req.connection.remoteAddress;
    User.Find(
        `SELECT UserName, UserPasswd, UserRole, CompanyName, RootPath, AccessString, UnixDate, UserEmail, UserFullName FROM Users WHERE UPPER(UserName) = '${req.body.username.toUpperCase()}'`,
        (status, data) => {
            //console.log("User Find : " + status);
            //console.dir(data);
            if (status) {
                //audit 
                if (process.env.NODE_ENV === 'dev') console.log(status);
                global.logger.error(`[${req.body.username}] userController::UserController UserLogin() ->logon error. ${status}`);
                res.status(500).json({
                    status: "FAIL",
                    message: status
                });
            } else {
                if (data) {
                    console.log("******** LOGON DATA **********", data);
                    console.log(req.body.username);
                    //console.log(req.body.password);
                    //console.log(Base64.decode(req.body.password))
                    if (Base64.decode(req.body.password) === data.UserPasswd) {
                        let currentUnixDate = moment(Date()).unix();
                        if (process.env.NODE_ENV === 'dev') console.log('data.UnixDate:', data.UnixDate);
                        if (process.env.NODE_ENV === 'dev') console.log('currentUnixDate:', currentUnixDate);
                        if (data.UnixDate && data.UnixDate < currentUnixDate) {
                            global.logger.error(`[${req.body.username}] userController::UserController UserLogin() ->Expired user account`);

                            // audit
                            return res
                                .status(403)
                                .json({
                                    status: "FAIL",
                                    message: "Expired user account",
                                    data: {
                                        "status": 403
                                    }
                                });
                        }
                        /* const token = jwt.sign({
                                    UserName: data.UserName,
                                    UserId: data._id
                                }, process.env.JWT_KEY, { expiresIn: "1h" }); */

                        makeUserPathIfNotExist(data.RootPath, (result) => {
                            if (process.env.NODE_ENV === 'dev') console.log("result: ", result);
                            let wsPath = data.UserRole === "assistant" ? config.wssURL + "/room" : config.wssURL + "/client";

                            const token = jwt.sign({
                                UserName: data.UserName,
                                UserFullName: data.UserFullName || data.UserName,
                                UserEmail: data.UserEmail || '',
                                UserId: data._id,
                                Role: data.UserRole,
                                wssURL: wsPath,
                                RootPath: data.UserRole.toUpperCase() === "ADMIN" ? "/" : data.RootPath,
                                AccessString: data.AccessString,
                                MaxFileSize: settings.maxFileSize * 1024 * 1024
                            },
                                JWT_KEY, {
                                    expiresIn: "24h"
                                }
                            );
                            console.log('data.UserName :', data.UserName);
                            // audit
                            if (process.env.NODE_ENV === 'dev') console.log("token", token);
                            res.cookie("sessionId", Base64.encode(data.UserName), {
                                maxAge: 900000
                            });
                            let rootPath = '';
                            if ((data.UserRole.toUpperCase() === "ADMIN") || (data.UserRole.toUpperCase() === "CUSTOM")) {
                                rootPath = data.RootPath ? data.RootPath : "/";
                            } else {
                                rootPath = data.RootPath ? data.RootPath : "GUEST";
                            }
                            if (process.env.NODE_ENV === 'dev') console.log("===========================> MaxFileSize:", settings.maxFileSize * 1024 * 1024);
                            global.logger.info(`[${req.body.username}] userController::UserController UserLogin() ->User authenticated!`);
                            return res.json({
                                "status": "OK",
                                "message": "User authenticated",
                                "data": {
                                    "UserName": data.UserName,
                                    "UserFullName": data.UserFullName || data.UserName,
                                    "UserEmail": data.UserEmail || '',
                                    "Token": token,
                                    "Role": data.UserRole,
                                    "wssURL": wsPath,
                                    "CompanyName": data.CompanyName,
                                    "RootPath": rootPath,
                                    "MaxFileSize": settings.maxFileSize * 1024 * 1024,
                                    "AccessString": data.AccessString,
                                    "RunMode": "DEBUG"
                                }
                            });
                        });

                    } else {
                        // audit
                        return res
                            .status(401)
                            .json({
                                status: "FAIL",
                                message: "Auth failed",
                                data: null
                            });
                    }
                } else {
                    // audit
                    return res
                        .status(401)
                        .json({
                            status: "FAIL",
                            message: "Auth failed",
                            data: null
                        });
                }
            }
        }
    );
};