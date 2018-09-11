const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;

let AuditModel = {};
let db;

let dbOpen = function() {
  console.log('dbPath: ',dbPath);
  console.log("db handler:", db);
  db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    err => {
      if (err) {
        return false;
        console.error(err.message);
      }
      return true;
      console.log(`Connected to ${config.dbName} database.`);
    }
  );
};

let dbClose = function() {
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
  });
};

AuditModel.Open = function() {
  dbOpen();
};

AuditModel.CreateTable = function() {
  db.run("DROP TABLE IF EXISTS Audit");
  db.run(
    "CREATE TABLE IF NOT EXISTS Audit ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 'UserName' TEXT, 'FileName' TEXT, 'Size' INTEGER, 'DateString' TEXT, 'Result' TEXT )");
  console.log("La tabla usuarios ha sido correctamente creada");
};

AuditModel.Close = function() {
  dbClose();
};

AuditModel.Find = function(queryString, callback) {
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


AuditModel.Remove = function(Id, callback) {
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
  console.log(userName);
  let sql = `SELECT UserName, Filename, Size, DateString , Result, Message
               FROM Audit
               WHERE UPPER(UserName)  = ?`;
  dbOpen();
  db.get(sql, [userName.toUpperCase()], (err, row) => {
    if (err) {
      console.error(err.message);
      dbClose();
      callback({ status: "FAIL", message: err.message, data: null });
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

/* AuditModel.Add = function(userData, callback) {
  let response = {};
  if (!db) dbOpen();
  console.log("db handler: ", db);
  let stmt = db.prepare("SELECT * FROM Users WHERE UserName = ?");
  console.log("PASSWD:", userData.userPassword);
  stmt.bind(userData.userName);
  stmt.get(function(error, rows) {
    console.log("error: ", error);
    if (error) {
      dbClose();
      throw err;
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
        stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?)");
        stmt.bind(
          null,
          userData.userName,
          Base64.decode(userData.userPassword),
          userData.userRole,
          userData.companyName,
          userData.rootPath,
          decodeURI(userData.accessRights),
          userData.expirateDate,
          userData.unixDate
        );
        stmt.run(function(err, result) {
          //dbClose();
          if (err) {
            throw err;
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
  }); */
};

module.exports = AuditModel;
