const config = require("../config/config.json");
const Admin = require("../models/admin");
const moment = require("moment");


exports.getAll = (req, res) => {
    Admin.getLogFile(null, data => {
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