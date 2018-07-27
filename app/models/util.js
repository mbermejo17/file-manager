const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;
const moment = require("moment");

let UtilModel = {};
let db;

let dbOpen = function () {
  console.log(dbPath);
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

let dbClose = function () {
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
  });
};

UtilModel.Open = function () {
  dbOpen();
};

UtilModel.CreateTable = function () {
  db.run("DROP TABLE IF EXISTS share");
  db.run(
    "CREATE TABLE IF NOT EXISTS share (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))"
  );
  console.log("La tabla share ha sido correctamente creada");
};

UtilModel.Close = function () {
  dbClose();
};


UtilModel.getById = function (fileId, callback) {
  let response = {};
  let sql = `SELECT *
               FROM Shared
               WHERE UrlCode  = ?`;
  if (!db) dbOpen();
  console.log("db handler: ", db);
  db.get(sql, [fileId], (err, row) => {
    if (err) {
      dbClose();
      console.error(err.message);
      callback({
        status: 'FAIL',
        message: `Error ${err.message}`,
        data: null
      });
    } else {
      if (row) {
        dbClose();
        callback({
          status: "OK",
          message: "Archivo " + fileId + "encontrado.",
          data: row
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

UtilModel.CleanExpiredFiles = function (query, callback) {
  let response = {};
  
  if (!db) dbOpen();
  let stmt = db.prepare(query);
  stmt.bind(moment(Date.now()).format('YYYY/MM/DD h:mm').unix());
  stmt.run(function(err) {
    console.log('Cambios: ',this.changes);
    if (err) {
      //dbClose();
      console.error(err.message);
      callback({
        status: 'FAIL',
        message: `Error ${err.message}`,
        data: null
      });
    } else {
    //dbClose();
    if (this.changes >0 ) {
      //dbClose();
        callback({
          status: "OK",
          message: "Borrados " + this.changes + " archivos caducados.",
          data: this.changes
        });
    } else {
      //dbClose();
        callback({
          status: "OK",
          message: "No se han encontrado archivos caducados.",
          data: this.changes
        });
    }
  }
});
}



UtilModel.Add = function (shareData, callback) {
  let response = {};
  if (!db) dbOpen();
  console.log("db handler: ", db);
  stmt = db.prepare("INSERT INTO Shared VALUES (?,?,?,?,?,?,?,?,?,?)");
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
    shareData.UnixDate
  );
  stmt.run(function (err, result) {
    //dbClose();
    if (err) {
      throw err;
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
