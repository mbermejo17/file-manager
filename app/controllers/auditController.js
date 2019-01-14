const config = require("../config/config.json");
const Audit = require("../models/audit");
const moment = require("moment");

exports.Add = (user, ip, file, d, msg, action, result, callback) => {
    let data = {};
    let response;
    if (process.env.NODE_ENV === 'dev') console.log('========================================');
    if (process.env.NODE_ENV === 'dev') console.log('                  AUDIT INIT');
    if (process.env.NODE_ENV === 'dev') console.log('========================================');
    data.browserIP = ip.browserIP;
    data.clientIP = ip.clientIP;
    data.userName = user.userName;
    data.fileName = file.fileName;
    data.fileSize = file.fileSize;
    data.dateString = d.dateString;
    data.unixDate = d.unixDate;
    data.message = (typeof msg == 'object') ? JSON.stringify(msg) : msg;
    data.action = action;
    data.result = result;

    Audit.Add(data, (d) => {
        if (process.env.NODE_ENV === 'dev') console.log("audit controller response : ", d);
        if (process.env.NODE_ENV === 'dev') console.log('========================================');
        if (process.env.NODE_ENV === 'dev') console.log('                  AUDIT END');
        if (process.env.NODE_ENV === 'dev') console.log('========================================');
        callback(d);
    });
};

exports.getAll = (req, res) => {
    Audit.All(data => {
        if (data.status == "FAIL") {
            if (process.env.NODE_ENV === 'dev') console.log(status);
            res.status(500).json({
                status: "FAIL",
                message: status,
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

exports.findByName = (userName) => {
    Audit.Find(
        `SELECT * FROM Users WHERE UPPER(UserName) = '${userName.toUpperCase()}'`,
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
                    return res.status(200).json({
                        status: "OK",
                        message: "User found",
                        data: data
                    });
                } else {
                    return res
                        .status(401)
                        .json({
                            status: "FAIL",
                            message: "User not found",
                            data: null
                        });
                }
            }
        }
    );
};