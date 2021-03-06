const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;
const moment = require("moment");

let UtilModel = {};


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

UtilModel.Open = function() {
    dbOpen();
};

UtilModel.CreateTable = function() {
    global.db.run("DROP TABLE IF EXISTS share");
    global.db.run(
        "CREATE TABLE IF NOT EXISTS share (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))"
    );
    console.log("La tabla share ha sido correctamente creada");
};

UtilModel.Close = function() {
    dbClose();
};


UtilModel.getById = function(fileId, callback) {
    let response = {};
    let sql = `SELECT *
               FROM Shared
               WHERE GroupID  = ?`;
    dbOpen();
    console.log("db handler: ", db);

    let _SharedGroup = function(sql, id) {
        return new Promise(function(resolve, reject) {
            let allRows = [];
            global.db.all(sql, [id], (err, rows) => {
                if (err) {
                    dbClose();
                    console.error(err.message);
                    reject({
                        status: 'FAIL',
                        message: `Error ${err.message}`,
                        data: null
                    });
                } else {
                    if (rows) {
                        dbClose();
                        rows.forEach((row) => {
                            allRows.push(row);
                        });
                        console.log("GroupID Files ", rows);
                        resolve({
                            status: "OK",
                            message: allRows.length + " archivos encontrados.",
                            data: allRows
                        });
                    } else {
                        dbClose();
                        console.error("GroupID Files", rows);
                        reject({
                            status: 'FAIL',
                            message: `No se han encontrado archivo con GroupId ${id}`,
                            data: null
                        });
                    }
                }
            });
        });
    };

    let _SharedFile = function(sql, id) {
        return new Promise(function(resolve, reject) {
            global.db.get(sql, [id], (err, row) => {
                if (err) {
                    dbClose();
                    console.error(err.message);
                    reject({
                        status: 'FAIL',
                        message: `Error ${err.message}`,
                        data: null
                    });
                } else {
                    if (row) {
                        dbClose();
                        resolve({
                            status: "OK",
                            message: "Archivo " + id + "encontrado.",
                            data: [row]
                        });
                    } else {
                        dbClose();
                        reject({
                            status: 'FAIL',
                            message: `Archivo con id ${id} no encontrado`,
                            data: null
                        });
                    }
                }
            });
        });
    };


    _SharedGroup(sql, fileId)
        .then(_data => {
            console.log("SharedGroup _data ->", _data);
            if (_data.data.length > 0) {
                callback({
                    status: _data.status,
                    message: _data.message,
                    data: _data.data
                });
            } else {
                sql = `SELECT *
               FROM Shared
               WHERE (UrlCode  = ?)`;
                _SharedFile(sql, fileId)
                    .then((_data) => {
                        console.log("SharedFile _data ->", _data);
                        callback({
                            status: _data.status,
                            message: _data.message,
                            data: _data.data
                        });
                    })
                    .catch((err) => {
                        console.log("SharedFile err ->", err);
                        callback({
                            status: 'FAIL',
                            message: err,
                            data: null
                        });
                    });

            }
        })
        .catch(err => {
            console.log("SharedGroup err ->", err);
            callback({
                status: 'FAIL',
                message: err,
                data: null
            });
        });
}

UtilModel.getByUserName = function(userName, callback) {
    let response = {};
    let allRows = [];
    let where = '';
    let sql = `SELECT *
               FROM Shared
               `;
    dbOpen();
    console.log("db handler: ", db);
    if (userName.toUpperCase() === 'ADMIN') {
        userName = '%';
        where = ` WHERE User like ?`;
    } else {
        where = ` WHERE User = ?`;
    };
    sql += where;
    global.db.all(sql, [userName], (err, rows) => {
        if (err) {
            dbClose();
            console.error(err.message);
            callback({
                status: 'FAIL',
                message: `Error ${err.message}`,
                data: null
            });
        } else {
            if (rows) {
                dbClose();
                rows.forEach((row) => {
                    allRows.push(row);
                });
                //console.log(allRows);
                callback({
                    status: "OK",
                    message: `${allRows.length} registros encontrados`,
                    data: allRows
                });
            } else {
                dbClose();
                callback({
                    status: 'FAIL',
                    message: `Archivo con id ${fileId} no encontrado`,
                    data: null
                });
            }
        }
    });
}

UtilModel.CleanExpiredFiles = function(query, callback) {
    let response = {};
    dbOpen();
    let stmt = global.db.prepare(query);
    stmt.bind(moment(Date.now()).unix());
    stmt.run(function(err) {
        console.log('Cambios: ', this.changes);
        if (err) {
            dbClose();
            console.error(err.message);
            callback({
                status: 'FAIL',
                message: `Error ${err.message}`,
                data: null
            });
        } else {
            if (this.changes > 0) {
                dbClose();
                callback({
                    status: "OK",
                    message: "Borrados " + this.changes + " archivos caducados.",
                    data: this.changes
                });
            } else {
                dbClose();
                callback({
                    status: "OK",
                    message: "No se han encontrado archivos caducados.",
                    data: this.changes
                });
            }
        }
    });
}



UtilModel.AddSharedFiles = function(shareData, callback) {
    let response = {};
    dbOpen();
    console.log("db handler: ", global.db);
    stmt = global.db.prepare("INSERT INTO Shared VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
    stmt.bind(
        null,
        shareData.UrlCode,
        shareData.User,
        shareData.DestUser,
        shareData.RealPath,
        shareData.FileName,
        shareData.Size,
        shareData.State,
        shareData.ExpirationDate,
        shareData.UnixDate,
        shareData.deleteExpiredFile,
        shareData.groupID,
    );
    stmt.run(function(err, result) {
        dbClose();
        if (err) {
            //throw err;
            callback({
                status: "FAIL",
                message: err,
                data: {
                    DestUser: shareData.DestUser,
                    UrlCode: shareData.UrlCode
                }
            });
        } else {
            callback({
                status: "OK",
                message: `Se ha compartido el archivo ${shareData.FileName} con el usuario ${ shareData.DestUser}`,
                data: {
                    DestUser: shareData.DestUser,
                    UrlCode: shareData.UrlCode
                }
            });
        }
    });
};

module.exports = UtilModel;