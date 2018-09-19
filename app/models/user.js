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
    console.log('dbPath: ', dbPath);
    console.log("db handler:", global.db);
    if (global.db == null || (global.db !== null && !global.db.open )) {
      global.db = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            err => {
                if (err) {
                    return false;
                    console.error(err.message);
                }
                console.log(`****** Connected to ${config.dbName} database. *********`);
                return global.db;
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
    if (global.db.open) {
      global.db.close(err => {
            if (err) {
                console.error(err.message);
            }
            console.log("******** Database connection closed. **********");
        });
    }
};

UserModel.Close = function() {
    dbClose();
};



/////////////////////////////////////////
//  Drop and create table Users
/////////////////////////////////////////

UserModel.CreateTable = function() {
  global.db.run("DROP TABLE IF EXISTS Users");
  global.db.run(
        "CREATE TABLE IF NOT EXISTS Users (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))"
    );
    console.log("La tabla usuarios ha sido correctamente creada");
};



/////////////////////////////////////////
//  Search users with filters
/////////////////////////////////////////

UserModel.Find = function(queryString, callback) {
    if (global.db === null ) dbOpen();

    global.db.get(queryString, (err, row) => {
        if (err) {
            if (global.db.open) dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                if (global.db.open) dbClose();
                callback(null, row);
            } else {
                if (global.db.open) dbClose();
                callback(`No se encuentran registros`, null);
            }
        }
    });
};



/////////////////////////////////////////
//  Search User by userId
/////////////////////////////////////////

UserModel.FindById = function(userId, callback) {
    let sql = `SELECT UserId, UserName, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate
               FROM Users
               WHERE UserId  = ?`;
    dbOpen();
    global.db.get(sql, [userId], (err, row) => {
        if (err) {
            if (global.db.open) dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                if (global.db.open) dbClose();
                callback({
                    status: "OK",
                    message: '',
                    data: row
                });
            } else {
                if (global.db.open) dbClose();
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
    console.log(data);
    let sql =
        "UPDATE Users SET " +
        data.queryString +
        " WHERE UserId = '" +
        data.userId +
        "';";
    console.log(sql);
    if (!global.db.open) dbOpen();
    global.db.run(sql, (err, row) => {
        console.log("err", err);
        console.log("row", row);
        if (err) {
            if (global.db.open) dbClose();
            console.error(err.message);
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            if (global.db.open) dbClose();
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
    let sql = `DELETE
             FROM Users
             WHERE UserId  = ?`;
    console.log('global.db: ',global.db);         
    dbOpen();
    let stmt = global.db.prepare(sql);
    stmt.bind(userId);
    stmt.run(function(err, row) {
        if (err) {
            if (global.db.open) dbClose();
            console.error(err.message);
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            if (global.db.open) dbClose();
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
    console.log(userName);
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate
               FROM Users
               WHERE UPPER(UserName)  = ?`;
    dbOpen();
    global.db.get(sql, [userName.toUpperCase()], (err, row) => {
        if (err) {
            console.error(err.message);
            if (global.db.open) dbClose();
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            if (row) {
                if (global.db.open) dbClose();
                callback(null, row);
            } else {
                if (global.db.open) dbClose();
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
    console.log(userData.userName, userData.userPasswd);
    let sql = `UPDATE Users SET UserPasswd = ? WHERE UPPER(UserName)  = ?`;
    dbOpen();
    let stmt = global.db.prepare(sql);
    stmt.bind(userData.userPasswd, userData.userName.toUpperCase());
    stmt.run(function(err) {
        if (err) {
            console.error(err.message);
            //dbClose();
            callback(err.message, null);
        }
        if (global.db.open) dbClose();
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
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate  
               FROM Users`;
    dbOpen();
    console.log('db: ',global.db); 
    let allRows = [];

    global.db.all(sql, [], (err, rows) => {
        if (err) {
          global.db.close();
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        }
        rows.forEach((row) => {
            allRows.push(row);
        });
        global.db.close();
        callback({
            status: "OK",
            message: `${allRows.length} registros encontrados`,
            data: allRows
        });
    });



    /* db.each(sql,
        (err, row) => {
            if (err) {
              if(db.open) dbClose();
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
    ); */
};


/////////////////////////////////////////
//  Add User
/////////////////////////////////////////

UserModel.Add = function(userData, callback) {
    let response = {};
    if (!global.db.open) dbOpen();
    console.log("db handler: ", global.db);
    let stmt = global.db.prepare("SELECT * FROM Users WHERE UserName = ?");
    console.log("PASSWD:", userData.userPassword);
    stmt.bind(userData.userName);
    stmt.get(function(error, rows) {
        console.log("error: ", error);
        if (error) {
            if (global.db.open) dbClose();
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
                if (!global.db.open) dbOpen();
                stmt = global.db.prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?)");
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
                    if (global.db.open) dbClose();
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