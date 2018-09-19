const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;

let AuditModel = {};


let dbOpen = function() {
  let db = global.db;
    console.log('dbPath: ', dbPath);
    console.log("db handler:", db);
    if (!db) {
      db = new sqlite3.Database(
          dbPath,
          sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
          err => {
              if (err) {
                  return false;
                  console.error(err.message);
              }
              //db.run('PRAGMA journal_mode = WAL;');
              global.db = db;
              return db;
              console.log(`Connected to ${config.dbName} database.`);
          }
      );
    } 
};

let dbClose = function() {
  let db = global.db;
  if(db){ 
    db.close(err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Database connection closed.");
    });
    global.db= db;
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
    console.log("La tabla usuarios ha sido correctamente creada");
};

AuditModel.Close = function() {
    dbClose();
};

AuditModel.Find = function(queryString, callback) {
  let db = global.db;
    if(!db || !db.open) dbOpen();

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


AuditModel.Remove = function(Id, callback) {
  let db = global.db;
    let sql = `DELETE *
             FROM audit
             WHERE id  = ?`;
    dbOpen();
    db.get(sql, [Id], (err, row) => {
        if (err) {
            dbClose();
            console.error(err.message);
            callback(err.message, null);
        } else {
            if (row) {
                dbClose();
                console.log(row);
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
    console.log(userName);
    let sql = `SELECT UserName, Filename, Size, DateString , Result, Message
               FROM Audit
               WHERE UPPER(UserName)  = ?`;
    dbOpen();
    db.get(sql, [userName.toUpperCase()], (err, row) => {
        if (err) {
            console.error(err.message);
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
  let db = global.db;
    let sql = `SELECT *  
               FROM Audit`;
    dbOpen();
    let allRows = [];
    db.each(
        sql,
        (err, row) => {
            if (err) {
                dbClose();
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
                dbClose();
                console.log(allRows);
                callback({
                    status: "OK",
                    message: `${allRows.length} registros encontrados`,
                    data: allRows
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
    );
};



const _insert = async (data,callback) =>{
  let db = global.db;
  try {
    if(!db) dbOpen();
    //db.configure("busyTimeout", 60000);
      let sql = `INSERT INTO Audit (BrowserIP,ClientIP,UserName,FileName,Size,DateString,UnixDate,Message,Action,Result) VALUES ('${data.browserIP}','${data.clientIP}','${data.userName}','${data.fileName}',${data.fileSize},'${data.dateString}',${data.unixDate},'${data.message}','${data.action}','${data.result}');`;
      console.log('Audit add:',sql);
      await db.run(sql);
      callback({
        status: "OK",
        message: `Registro añadido`,
        data: null
    });
  } catch(e) {
    console.log('ERROR :',e);
    callback({
      status: "FAIL",
      message: e,
      data: null
  });
  }
};


AuditModel.Add = function(data, callback) {
    let response = {};
    _insert(data,callback);
};

module.exports = AuditModel;