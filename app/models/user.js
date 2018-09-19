const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;

let UserModel = {};



/////////////////////////////////////////
//  Open DB connection
/////////////////////////////////////////

let dbOpen = function() {
  let db = global.db;
    console.log('dbPath: ', dbPath);
    console.log("db handler:", db);
    if (!db || !db.open) {
      db = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            err => {
                if (err) {
                    return false;
                    console.error(err.message);
                }
                global.db = db;
                return db;
                console.log(`Connected to ${config.dbName} database.`);
            }
        );
    }
};

UserModel.Open = function() {
    dbOpen();
};


/////////////////////////////////////////
//  Close DB connection
/////////////////////////////////////////

let dbClose = function() {
  let db = global.db;
  if(db.open) {
    db.close(err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Database connection closed.");
    });
    global.db = db;
  }
};

UserModel.Close = function() {
    dbClose();
};



/////////////////////////////////////////
//  Drop and create table Users
/////////////////////////////////////////

UserModel.CreateTable = function() {
  let db = global.db;
    db.run("DROP TABLE IF EXISTS Users");
    db.run(
        "CREATE TABLE IF NOT EXISTS Users (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))"
    );
    console.log("La tabla usuarios ha sido correctamente creada");
};



/////////////////////////////////////////
//  Search users with filters
/////////////////////////////////////////

UserModel.Find = function(queryString, callback) {
  let db = global.db;
    if (!db || !db.open) dbOpen();

    db.get(queryString, (err, row) => {
        if (err) {
            if(db) dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
              if(db) dbClose();
                callback(null, row);
            } else {
              if(db) dbClose();
                callback(`No se encuentran registros`, null);
            }
        }
    });
};



/////////////////////////////////////////
//  Search User by userId
/////////////////////////////////////////

UserModel.FindById = function(userId, callback) {
  let db = global.db;
    let sql = `SELECT UserId, UserName, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate
               FROM Users
               WHERE UserId  = ?`;
    dbOpen();
    db.get(sql, [userId], (err, row) => {
        if (err) {
          if(db) dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
              if(db) dbClose();
                callback({
                    status: "OK",
                    message: '',
                    data: row
                });
            } else {
              if(db) dbClose();
                callback({
                    status: "FAIL",
                    message: err.message,
                    data: null
                });
            }
        }
    });
};


/////////////////////////////////////////
//  Update user Data
/////////////////////////////////////////

UserModel.Update = function(data, callback) {
  let db = global.db;
    console.log(data);
    let sql =
        "UPDATE Users SET " +
        data.queryString +
        " WHERE UserId = '" +
        data.userId +
        "';";
    console.log(sql);
    dbOpen();
    db.run(sql, (err, row) => {
        console.log("err", err);
        console.log("row", row);
        if (err) {
          if(db) dbClose();
            console.error(err.message);
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
          if(db) dbClose();
            callback({
                status: "OK",
                message: "Usuario " + data.userName + " actualizado",
                data: null
            });
        }
    });
};


/////////////////////////////////////////
//  Remove User
/////////////////////////////////////////

UserModel.Remove = function(userId, callback) {
  let db = global.db;
    let sql = `DELETE
             FROM Users
             WHERE UserId  = ?`;      
    if (!db.open) dbOpen();
    let stmt = db.prepare(sql);
    stmt.bind(userId);
    stmt.run(function(err, row) {
        if (err) {
          if(db) dbClose();
            console.error(err.message);
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
          if(db) dbClose();
            console.log(row);
            callback({
                status: "OK",
                message: `1 registro encontrado`,
                data: row
            });
        }
    });
};


/////////////////////////////////////////
//  Find User by Name
/////////////////////////////////////////

UserModel.FindByName = function(userName, callback) {
  let db = global.db;
    console.log(userName);
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate
               FROM Users
               WHERE UPPER(UserName)  = ?`;
    dbOpen();
    db.get(sql, [userName.toUpperCase()], (err, row) => {
        if (err) {
            console.error(err.message);
            if(db) dbClose();
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            if (row) {
              if(db) dbClose();
                callback(null, row);
            } else {
              if(db) dbClose();
                callback({
                    status: "FAIL",
                    message: `Usuario ${userName} no encontrado`,
                    data: null
                });
            }
        }
    });
};


/////////////////////////////////////////
//  Cahnge User password
/////////////////////////////////////////

UserModel.ChangePasswd = function(userData, callback) {
  let db = global.db;
    console.log(userData.userName, userData.userPasswd);
    let sql = `UPDATE Users SET UserPasswd = ? WHERE UPPER(UserName)  = ?`;
    dbOpen();
    let stmt = db.prepare(sql);
    stmt.bind(userData.userPasswd, userData.userName.toUpperCase());
    stmt.run(function(err) {
        if (err) {
            console.error(err.message);
            //dbClose();
            callback(err.message, null);
        }
        //dbClose();
        if (this.changes === 1) {
            console.log(`Row(s) updated: ${this.changes}`);
            callback({
                status: "OK",
                message: `Se ha cambiado la clave del usuario ${userData.userName}`,
                data: null
            });
        } else {
            callback({
                status: "FAIL",
                message: `Usuario ${userData.userName} no encontrado`,
                data: null
            });
        }
    });
};


/////////////////////////////////////////
//  Get All Users
/////////////////////////////////////////

UserModel.All = function(callback) {
  let db = global.db;
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate  
               FROM Users`;
    dbOpen();
    let allRows = [];
    db.each(
        sql,
        (err, row) => {
            if (err) {
              if(db) dbClose();
                console.error(err.message);
                callback({
                    status: "FAIL",
                    message: err.message,
                    data: null
                });
            } else {
                allRows.push(row);
            }
        },
        (err, count) => {
            if (allRows.length >= 1) {
              if(db) dbClose();
                console.log(allRows);
                callback({
                    status: "OK",
                    message: `${allRows.length} registros encontrados`,
                    data: allRows
                });
            } else {
              if(db) dbClose();
                callback({
                    status: "FAIL",
                    message: err.message,
                    data: null
                });
            }
        }
    );
};


/////////////////////////////////////////
//  Add User
/////////////////////////////////////////

UserModel.Add = function(userData, callback) {
  let db = global.db;
    let response = {};
    if(!db || !db.open) dbOpen();
    console.log("db handler: ", db);
    let stmt = db.prepare("SELECT * FROM Users WHERE UserName = ?");
    console.log("PASSWD:", userData.userPassword);
    stmt.bind(userData.userName);
    stmt.get(function(error, rows) {
        console.log("error: ", error);
        if (error) {
            if (db) dbClose();
            callback({
              status: "FAIL",
              msg: `Error ${error}`,
              data: null
          });
        } else {
            if (rows) {
                console.log("rows: ", rows);
                //dbClose();
                callback({
                    status: "FAIL",
                    msg: `El usuario ${userData.userName} ya existe`,
                    data: null
                });
            } else {
                if (!db) dbOpen();
                stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?)");
                stmt.bind(
                    null,
                    userData.userName,
                    Base64.decode(userData.userPassword),
                    userData.userRole,
                    userData.companyName,
                    userData.rootPath.toUpperCase(),
                    decodeURI(userData.accessRights),
                    userData.expirateDate,
                    userData.unixDate
                );
                stmt.run(function(err, result) {
                    if (db) dbClose();
                    if (err) {
                      callback({
                        status: "FAIL",
                        msg: `Error ${err}`,
                        data: null
                    });
                    } else {
                        callback({
                            status: "OK",
                            message: `Usuario ${userData.userName} añadido`,
                            data: null
                        });
                    }
                });
            }
        }
    });
};

module.exports = UserModel;