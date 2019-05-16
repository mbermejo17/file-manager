const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;

let AuditModel = {};


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

/////////////////////////////////////////
//  Close DB connection
/////////////////////////////////////////

let dbClose = function() {
    if (!global.db == null && global.db.open) {
        global.db.close(err => {
            if (err) {
                if (process.env.NODE_ENV === 'dev') console.error(err.message);
            }
            if (process.env.NODE_ENV === 'dev') console.log("******** Database connection closed. **********");
        });
    }
};


AuditModel.Open = function() {
    dbOpen();
};

AuditModel.CreateTable = function() {
    let db = global.db;
    db.run("DROP TABLE IF EXISTS Audit");
    db.run(
        "CREATE TABLE IF NOT EXISTS Audit ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 'UserName' TEXT, 'FileName' TEXT, 'Size' INTEGER, 'DateString' TEXT, 'Result' TEXT )");
    if (process.env.NODE_ENV === 'dev') console.log("La tabla usuarios ha sido correctamente creada");
};

AuditModel.Close = function() {
    dbClose();
};

AuditModel.Find = function(queryString, callback) {
    let db = global.db;
    if (!db || !db.open) dbOpen();

    db.get(queryString, (err, row) => {
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


AuditModel.Remove = function(Id, callback) {
    let db = global.db;
    let sql = `DELETE *
             FROM audit
             WHERE id  = ?`;
    dbOpen();
    db.get(sql, [Id], (err, row) => {
        if (err) {
            dbClose();
            if (process.env.NODE_ENV === 'dev') console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                dbClose();
                if (process.env.NODE_ENV === 'dev') console.log(row);
                callback({
                    status: "OK",
                    message: `1 registro encontrado`,
                    data: row
                });
            } else {
                dbClose();
                callback({
                    status: "FAIL",
                    message: `Registro no encontrado`,
                    data: null
                });
            }
        }
    });
};

AuditModel.FindByName = function(userName, callback) {
    let db = global.db;
    if (process.env.NODE_ENV === 'dev') console.log(userName);
    let sql = `SELECT UserName, Filename, Size, DateString , Result, Message
               FROM Audit
               WHERE UPPER(UserName)  = ?`;
    dbOpen();
    db.get(sql, [userName.toUpperCase()], (err, row) => {
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



AuditModel.All = function(callback) {
    let response = {};
    let allRows = [];
    //let where = {};
    let sql = `SELECT *  
               FROM Audit`;
    dbOpen();
    global.db.all(sql, (err, rows) => {
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
        };
    });
};


/* const _insert = async(data, callback) => {
    dbOpen();
    try {
        //db.configure("busyTimeout", 60000);
        let sql = `INSERT INTO Audit (BrowserIP,ClientIP,UserName,FileName,Size,DateString,UnixDate,Message,Action,Result) VALUES ('${data.browserIP}','${data.clientIP}','${data.userName}','${data.fileName}',${data.fileSize},'${data.dateString}',${data.unixDate},'${data.message}','${data.action}','${data.result}');`;
        if (process.env.NODE_ENV === 'dev') console.log('Audit add:', sql);
        await global.db.run(sql);
        callback({
            status: "OK",
            message: `Registro añadido`,
            data: null
        });
    } catch (e) {
        if (process.env.NODE_ENV === 'dev') console.log('ERROR :', e);
        callback({
            status: "FAIL",
            message: e,
            data: null
        });
    }
};


AuditModel.Add = function(data, callback) {
    let response = {};
    _insert(data, callback);
}; */

AuditModel.Add = function(data) {
    return new Promise((resolve,reject)=>{
        dbOpen();
        try {
            //db.configure("busyTimeout", 60000);
            let sql = `INSERT INTO Audit (BrowserIP,ClientIP,UserName,FileName,Size,DateString,UnixDate,Message,Action,Result) VALUES ('${data.browserIP}','${data.clientIP}','${data.userName}','${data.fileName}',${data.fileSize},'${data.dateString}',${data.unixDate},'${data.message}','${data.action}','${data.result}');`;
            if (process.env.NODE_ENV === 'dev') console.log('Audit add:', sql);
            global.db.run(sql);
            resolve({
                status: "OK",
                message: `Registro añadido`,
                data: null
            });
        } catch (e) {
            if (process.env.NODE_ENV === 'dev') console.log('ERROR :', e);
            reject({
                status: "FAIL",
                message: e,
                data: null
            });
        }
    });     
};


module.exports = AuditModel;