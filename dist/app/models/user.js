const path = require('path')
const config = require('../config/config.json');
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require('sqlite3').verbose();

let UserModel = {};
let db;

let dbOpen = function() {
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`Connected to ${config.dbName} database.`);
    });
};

let dbClose = function() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
    });
};

UserModel.Open = function() {
    dbOpen();
}

UserModel.CreateTable = function() {
    db.run("DROP TABLE IF EXISTS Users");
    db.run("CREATE TABLE IF NOT EXISTS Users (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))");
    console.log("La tabla usuarios ha sido correctamente creada");
};


UserModel.Close = function() {
    dbClose();
};

UserModel.Find = function(queryString, callback) {
    dbOpen();

    db.get(queryString, (err, row) => {
        if (err) {
            dbClose();
            console.error(err.message);
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

UserModel.FindById = function(userId, callback) {
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole
               FROM Users
               WHERE UserId  = ?`;
    dbOpen();
    db.get(sql, [userId], (err, row) => {
        if (err) {
            dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                dbClose();
                callback(null, row);
            } else {
                dbClose();
                callback(`Usuario con id ${userId} no encontrado`, null);
            }
        }
    });
};


UserModel.Remove = function(userId, callback) {
    let sql = `DELETE *
             FROM Users
             WHERE UserId  = ?`;
    dbOpen();
    db.get(sql, [userId], (err, row) => {
        if (err) {
            dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                dbClose();
                console.log(row);
                callback(null, row);
            } else {
                dbClose();
                callback(`Usuario con id ${userId} no encontrado`, null);
            }
        }
    });
};


UserModel.FindByName = function(userName, callback) {
    console.log(userName);
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole
               FROM Users
               WHERE UPPER(UserName)  = ?`;
    dbOpen();
    db.get(sql, [userName.toUpperCase()], (err, row) => {
        if (err) {
            console.error(err.message);
            dbClose();
            callback(err.message, null);
        } else {
            if (row) {
                dbClose();
                callback(null, row);
            } else {
                dbClose();
                callback(`Usuario ${userName} no encontrado`, null);
            }
        }
    });

};

UserModel.All = function(callback) {
    let sql = `SELECT UserName, UserId, UserPasswd, UserRole 
               FROM Users`;
    dbOpen();
    let allRows = [];
    db.each(sql, (err, row) => {
        if (err) {
            dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            allRows.push(row);
        }
    }, (err, count) => {
        if (allRows.length >= 1) {
            dbClose();
            console.log(allRows);
            callback(null, allRows);
        } else {
            dbClose();
            callback(`No se encuentran registros`, null);
        }
    });

    /* db.get(sql, (err, row) => {
        if (err) {
            dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            dbClose();
            console.log(row);
            if (row) {
                callback(null, row);
            } else {
                callback('No se encuentran registros', null);
            }
        }
    }); */
};

UserModel.Add = function(userData, callback) {
    let response = {}; 
    dbOpen();
    let stmt = db.prepare("SELECT * FROM Users WHERE UserName = ?");
    console.log('PASSWD:',userData.password);
    stmt.bind(userData.username);
    stmt.get(function(error, rows) {
        //console.log(JSON.stringify(error)); return;
        if (error) {
            dbClose();
            throw err;
        } else {
            if (rows) {
                dbClose();
                callback({ msg: `El usuario ${userData.username} ya existe` });
            } else {
                stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?)");
                stmt.bind(null, userData.username, userData.password, userData.userrole);
                stmt.run(function(err, result) {
                    dbClose();
                    if (err) {
                        throw err;
                    } else {
                        callback({ msg: `Usuario ${userData.username} añadido` });
                    }
                });
            }
        }
    });
};

module.exports = UserModel;