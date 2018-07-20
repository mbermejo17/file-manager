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

UtilModel.Find = function(queryString, callback) {
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

UtilModel.FindById = function(userId, callback) {
  let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate
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

UtilModel.Update = function(data, callback) {
  console.log(data);
  let sql =
    "UPDATE Users SET " +
    data.queryString +
    " WHERE UPPER(UserName) = '" +
    data.userName.toUpperCase() +
    "';";
  console.log(sql);
  dbOpen();
  db.run(sql, (err, row) => {
    console.log("err", err);
    console.log("row", row);
    if (err) {
      dbClose();
      console.error(err.message);
      callback({
        status: "FAIL",
        message: err.message,
        data: null
      });
    } else {
      dbClose();
      callback({
        status: "OK",
        message: "Usuario " + data.userName + "actualizado",
        data: null
      });
    }
  });
};

UtilModel.Remove = function(userId, callback) {
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

UtilModel.FindByName = function(userName, callback) {
  console.log(userName);
  let sql = `SELECT UserName, UserId, UserPasswd, UserRole, CompanyName, RootPath, AccessString, ExpirateDate
               FROM Users
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

UtilModel.All = function(callback) {
  let sql = `SELECT UserName, UserId, UserPasswd, UserRole 
               FROM Users`;
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

UtilModel.Add = function(shareData, callback) {
  let response = {};
  if (!db) dbOpen();
  console.log("db handler: ", db);
  stmt = db.prepare("INSERT INTO share VALUES (?,?,?,?,?,?,?,?)");
  stmt.bind(
          null,
          userData.userName,
          Base64.decode(userData.userPassword),
          userData.userRole,
          userData.companyName,
          userData.rootPath,
          userData.accessRights,
          userData.expirateDate
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
  });
};

module.exports = UtilModel;
