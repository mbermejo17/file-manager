


//const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const md5 = require('js-md5');
const Base64 = require("js-base64").Base64;
const config = require("../config/config.json");
const JWT_KEY = config.jwtKey;
const fs = require("fs");
const normalize = require("normalize-path");
const pathPrefix = ".\\repository\\";
const User = require("../models/user");
const moment = require("moment");

const makeUserPathIfNotExist = (p, callback) => {
  let r;
  if(p) {
    let newFolder = normalize(pathPrefix + "/" + p.toUpperCase());
    if (!fs.existsSync(newFolder)) {
      r = fs.mkdir(newFolder);
    }
  }
  console.log("makeNewPath: newpath ", p);
  console.log("makeNewPath: result ", r);
  callback(r);
};

exports.Index = (req, res, next) => {
  const cookie = req.cookies.sessionId;
  console.log("user:Controller.Index");
  if (cookie === undefined) {
    res.render("logon", { title: "Logon", message: "" });
  } else {
    if (req.cookies.token) {
      console.log("render dashboard");
      res.render("dashboard", {
        UserName: req.UserName,
        Token: req.cookies.token,
        Role: req.cookies.UserRole,
        wssURL: req.cookies.wssURL
      });
    }
  }
};

exports.Dashboard = (req, res, next) => {
  console.log("user:Controller.Dashboard");
  console.log(req.cookies);
  res.render("dashboard", {
    UserName: req.cookies.UserName,
    Token: req.cookies.token,
    Role: req.cookies.UserRole,
    wssURL: req.cookies.wssURL
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
  let userName = data.userName;
  let userPassword = Base64.decode(data.userPassword);
  let userRole = data.userRole;
  let rootPath = data.rootPath;
  let expirationDate = data.expirateDate;
  let accessRights = data.accessRights;
  let response = [];
  User.Add(data, d => {
    response.push(d);
    console.log("d : ", d);
    if (d.status === "OK") {
      makeUserPathIfNotExist(rootPath, result => {
        if (!result) {
          return res.status(200).json(response[0]);
          console.log(result);
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
    } else {
      return res.status(200).json(d);
    }
  });
};

exports.UserUpdate = (req, res) => {
  let data = req.body;
  let userName = data.userName;
  let userId = data.userId;
  let queryString = data.queryString;
  let accessString = "";
  let response = [];
  let newData = {};
  let newRootPath ='';

  for (var propertyName in queryString) {
    if (propertyName == 'RootPath') { newRootPath = queryString[propertyName]; }
    if(propertyName === 'AccessString') {
      let newAccessString = decodeURI(queryString[propertyName]);
      accessString += `${propertyName} = '${newAccessString}',`;
    } else  {
      accessString += `${propertyName} = '${queryString[propertyName]}',`;
    }
    
  }

  console.log("before:", accessString);
  accessString = accessString.slice(0, -1);
  console.log("after:", accessString);
  newData = { userId: userId, queryString: accessString };

  User.Update(newData, d => {
    response.push(d);
    console.log("d : ", d);
    if (d.status === "OK") {
      if(newRootPath === '') {
        return res.status(200).json(response[0]);
      } else {
        makeUserPathIfNotExist(newRootPath, result => {
            if (!result) {
              return res.status(200).json(response[0]);
              console.log(result);
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
      return res.status(200).json(d);
    }
  });
};


exports.UserGetAll = (req, res, next) => {
  User.All(data => {
    if (data.status == "FAIL") {
      console.log(status);
      res.status(500).json({ status: "FAIL", message: status, data: null });
    } else {
      console.log(data);
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
        console.log(status);
        res.status(500).json({ status: "FAIL", message: status, data: null });
      } else {
        if (data) {
          console.log(data);
          return res.status(200).json({
            status: "OK",
            message: "User found",
            data: {
              UserName: data.UserName,
              Role: data.UserRole,
              UserPasswd: Base64.encode(data.UserPasswd),
              CompanyName: data.CompanyName,
              RootPath: data.UserRole.toUpperCase() === "ADMIN" ? "/" : data.RootPath,
              AccessString: data.AccessString,
              ExpirateDate: data.ExpirateDate
            }
          });
        } else {
          return res
            .status(401)
            .json({ status: "FAIL", message: "Auth failed", data: null });
        }
      }
    }
  );
};

exports.UserFindById = (req, res, next) => {
  let userId =req.params.userId;
  User.FindById(userId,
    (d) => {
      if (d.status == 'FAIL') {
        console.log(status);
        res.status(500).json({ status: "FAIL", message: status, data: null });
      } else {
        if (d.data) {
          console.log(d.data);
          return res.status(200).json({
            status: "OK",
            message: "User found",
            data: {
              UserId: d.data.UserId,
              UserName: d.data.UserName,
              UserRole: d.data.UserRole,
              UserPasswd: Base64.encode(d.data.UserPasswd),
              CompanyName: d.data.CompanyName,
              RootPath: d.data.UserRole.toUpperCase() === "ADMIN" ? "/" : d.data.RootPath,
              AccessString: d.data.AccessString,
              ExpirateDate: d.data.ExpirateDate
            }
          });
        } 
      }
    }
  );
};

exports.UserLogin = (req, res, next) => {
  User.Find(
    `SELECT UserName, UserPasswd, UserRole, CompanyName, RootPath, AccessString, UnixDate FROM Users WHERE UPPER(UserName) = '${req.body.username.toUpperCase()}'`,
    (status, data) => {
      //console.log("User Find : " + status);
      //console.dir(data);
      if (status) {
        console.log(status);
        res.status(500).json({ status: "FAIL", message: status });
      } else {
        if (data) {
          //console.log(req.body.password);
          //console.log(Base64.decode(req.body.password))
          if (Base64.decode(req.body.password) === data.UserPasswd) {
            let currentUnixDate = moment(Date()).unix();
            console.log('data.UnixDate:',data.UnixDate);
            console.log('currentUnixDate:',currentUnixDate);
            if (data.UnixDate && data.UnixDate < currentUnixDate) {
              return res
                .status(403)
                .json({
                  status: "FAIL",
                  message: "Expired user account",
                  data: {"status":403}
                });
            }
            /* const token = jwt.sign({
                        UserName: data.UserName,
                        UserId: data._id
                    }, process.env.JWT_KEY, { expiresIn: "1h" }); */

            makeUserPathIfNotExist(data.RootPath,(result)=>{
              console.log("result: ",result);
              let wsPath = data.UserRole === "assistant" ? config.wssURL + "/room" : config.wssURL + "/client";
              const token = jwt.sign(
                {
                  UserName: data.UserName,
                  UserId: data._id,
                  Role: data.UserRole,
                  wssURL: wsPath,
                  RootPath: data.UserRole.toUpperCase() === "ADMIN" ? "/" : data.RootPath,
                  AccessString: data.AccessString
                },
                JWT_KEY,
                { expiresIn: "24h" }
              );
              console.log("token", token);
              res.cookie("sessionId", Base64.encode(data.UserName), {
                maxAge: 900000
               });
              return res.status(200).json({
                status: "OK",
                message: "User authenticated",
                data: {
                  UserName: data.UserName,
                  Token: token,
                  Role: data.UserRole,
                  wssURL: wsPath,
                  CompanyName: data.CompanyName,
                  RootPath: data.UserRole.toUpperCase() === "ADMIN" ? "/" : data.RootPath,
                  AccessString: data.AccessString,
                  RunMode: "DEBUG"
                }
              });
            });        
            
          } else {
            return res
              .status(401)
              .json({ status: "FAIL", message: "Auth failed", data: null });
          }
        } else {
          return res
            .status(401)
            .json({ status: "FAIL", message: "Auth failed", data: null });
        }
      }
    }
  );
};