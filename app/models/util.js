const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;

let UtilModel = {};
let db;

let dbOpen = function() {
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

let dbClose = function() {
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
  });
};

UtilModel.Open = function() {
  dbOpen();
};

UtilModel.CreateTable = function() {
  db.run("DROP TABLE IF EXISTS share");
  db.run(
    "CREATE TABLE IF NOT EXISTS share (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))"
  );
  console.log("La tabla share ha sido correctamente creada");
};

UtilModel.Close = function() {
  dbClose();
};


UtilModel.Add = function(shareData, callback) {
  let response = {};
  if (!db) dbOpen();
  console.log("db handler: ", db);
  stmt = db.prepare("INSERT INTO Shared VALUES (?,?,?,?,?,?,?,?,?)");
  stmt.bind(
          null,
          shareData.UrlCode,
          shareData.User,
          shareData.DestUser,
          shareData.RealPath,
          shareData.FileName,
          shareData.Size,
          shareData.ExpirationDate,
          shareData.State
        );
        stmt.run(function(err, result) {
          //dbClose();
          if (err) {
            throw err;
          } else {
            callback({
              status: "OK",
              message: `Se ha compartido el archivo ${shareData.FileName} con el usuario ${ shareData.DestUser}`,
              data: {DestUser:  shareData.DestUser,
                     UrlCode:  shareData.UrlCode
                    }
            });
          }
        });
  };

module.exports = UtilModel;
