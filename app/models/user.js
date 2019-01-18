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
    if (process.env.NODE_ENV === 'dev') console.log('dbPath: ', dbPath);
    if (process.env.NODE_ENV === 'dev') console.log("db handler:", global.db);
    if (global.db == null || (global.db !== null && !global.db.open)) {
        global.db = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            err => {
                if (err) {
                    if (process.env.NODE_ENV === 'dev') console.error(err.message);
                    return false;
                }
                if (process.env.NODE_ENV === 'dev') console.log(`****** Connected to ${config.dbName} database. *********`);
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
    if (!global.db == null || global.db.open) {
        global.db.close(err => {
            if (err) {
                if (process.env.NODE_ENV === 'dev') console.error(err.message);
            }
            if (process.env.NODE_ENV === 'dev') console.log("******** Database connection closed. **********");
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
        "CREATE TABLE 'Users' ( 'UserId' INTEGER PRIMARY KEY AUTOINCREMENT, 'UserName' NCHAR ( 55 ), 'UserPasswd' NCHAR ( 55 ), 'UserRole' NCHAR ( 55 ), 'CompanyName' TEXT, 'RootPath' TEXT, 'AccessString' TEXT, 'ExpirateDate' TEXT, 'UnixDate' NUMERIC, 'UserEmail' TEXT, 'UserFullName' TEXT )"
    );
    if (process.env.NODE_ENV === 'dev') console.log("La tabla usuarios ha sido correctamente creada");
};



/////////////////////////////////////////
//  Search users with filters
/////////////////////////////////////////

UserModel.Find = function(queryString, callback) {
    dbOpen();
    global.db.get(queryString, (err, row) => {
        if (err) {
            dbClose();
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                dbClose();
                callback(null, row);
            } else {
                dbClose();
                callback(`No se encuentran registros`, null);
            }
        }
    });
};



/////////////////////////////////////////
//  Search User by userId
/////////////////////////////////////////

UserModel.FindById = function(userId, callback) {
    let sql = `SELECT UserId, UserName, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate, UserEmail, UserFullName
               FROM Users
               WHERE UserId  = ?`;
    dbOpen();
    global.db.get(sql, [userId], (err, row) => {
        if (err) {
            dbClose();
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
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
                dbClose();
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
    if (process.env.NODE_ENV === 'dev') console.log('data: ', data);
    let sql =
        "UPDATE Users SET " +
        data.queryString +
        " WHERE UserId = '" +
        data.userId +
        "';";
    if (process.env.NODE_ENV === 'dev') console.log(sql);
    dbOpen();
    global.db.run(sql, (err, row) => {
        if (process.env.NODE_ENV === 'dev') console.log("err", err);
        if (process.env.NODE_ENV === 'dev') console.log("row", row);
        if (err) {
            dbClose();
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            dbClose();
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
    if (process.env.NODE_ENV === 'dev') console.log('global.db: ', global.db);
    dbOpen();
    let stmt = global.db.prepare(sql);
    stmt.bind(userId);
    stmt.run(function(err, row) {
        if (err) {
            dbClose();
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            dbClose();
            if (process.env.NODE_ENV === 'dev') console.log(row);
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
    if (process.env.NODE_ENV === 'dev') console.log(userName);
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate, UserEmail, UserFullName
               FROM Users
               WHERE UPPER(UserName)  = ?`;
    dbOpen();
    global.db.get(sql, [userName.toUpperCase()], (err, row) => {
        if (err) {
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
            dbClose();
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        } else {
            if (row) {
                dbClose();
                callback(null, row);
            } else {
                dbClose();
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
    if (process.env.NODE_ENV === 'dev') console.log(userData.userName, userData.userPasswd);
    let sql = `UPDATE Users SET UserPasswd = ? WHERE UPPER(UserName)  = ?`;
    dbOpen();
    let stmt = global.db.prepare(sql);
    stmt.bind(userData.userPasswd, userData.userName.toUpperCase());
    stmt.run(function(err) {
        if (err) {
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
            //dbClose();
            callback(err.message, null);
        }
        dbClose();
        if (this.changes === 1) {
            if (process.env.NODE_ENV === 'dev') console.log(`Row(s) updated: ${this.changes}`);
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
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate, UnixDate, UserEmail, UserFullName  
               FROM Users`;
    dbOpen();
    if (process.env.NODE_ENV === 'dev') console.log('db: ', global.db);
    let allRows = [];

    global.db.all(sql, [], (err, rows) => {
        if (err) {
            dbClose();
            callback({
                status: "FAIL",
                message: err.message,
                data: null
            });
        }
        rows.forEach((row) => {
            allRows.push(row);
        });
        dbClose();
        callback({
            status: "OK",
            message: `${allRows.length} registros encontrados`,
            data: allRows
        });
    });
};


/////////////////////////////////////////
//  Add User
/////////////////////////////////////////

UserModel.Add = function(userData, callback) {
    let response = {};
    dbOpen();
    if (process.env.NODE_ENV === 'dev') console.log("db handler: ", global.db);
    let stmt = global.db.prepare("SELECT * FROM Users WHERE UserName = ?");
    if (process.env.NODE_ENV === 'dev') console.log("PASSWD:", userData.userPassword);
    stmt.bind(userData.userName);
    stmt.get(function(error, rows) {
        if (process.env.NODE_ENV === 'dev') console.log("error: ", error);
        if (error) {
            dbClose();
            callback({
                status: "FAIL",
                msg: `Error ${error}`,
                data: null
            });
        } else {
            if (rows) {
                if (process.env.NODE_ENV === 'dev') console.log("rows: ", rows);
                //dbClose();
                callback({
                    status: "FAIL",
                    msg: `El usuario ${userData.userName} ya existe`,
                    data: null
                });
            } else {
                dbOpen();
                stmt = global.db.prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?,?,?)");
                stmt.bind(
                    null,
                    userData.userName,
                    Base64.decode(userData.userPassword),
                    userData.userRole,
                    userData.companyName,
                    userData.rootPath.toUpperCase(),
                    decodeURI(userData.accessRights),
                    userData.expirateDate,
                    userData.unixDate,
                    userData.userEmail,
                    userData.userFullName
                );
                stmt.run(function(err, result) {
                    dbClose();
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