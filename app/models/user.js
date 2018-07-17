const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const sqlite3 = require("sqlite3").verbose();
const Base64 = require("js-base64").Base64;

let UserModel = {};
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

UserModel.Open = function() {
  dbOpen();
};

UserModel.CreateTable = function() {
  db.run("DROP TABLE IF EXISTS Users");
  db.run(
    "CREATE TABLE IF NOT EXISTS Users (UserId INTEGER PRIMARY KEY AUTOINCREMENT, UserName NCHAR(55), UserPasswd NCHAR(55),  UserRole NCHAR(55))"
  );
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

UserModel.Update = function(data, callback) {
  console.log(data);
  let sql = "UPDATE Users SET "+ data.queryString +" WHERE UPPER(UserName) = '"+ data.userName.toUpperCase() + "';";
  console.log(sql);
  dbOpen();
  db.run(sql, (err, row) => {
    console.log('err',err);
    console.log('row',row);
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
        message: 'Usuario ' + data.userName + 'actualizado',
        data: null
      });
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

UserModel.ChangePasswd = function(userData, callback) {
  console.log(userData.userName, userData.userPasswd);
  let sql = `UPDATE Users SET UserPasswd = ? WHERE UPPER(UserName)  = ?`;
  dbOpen();
  let stmt = db.prepare(sql);
  stmt.bind(userData.userPasswd, userData.userName.toUpperCase());
  stmt.run(function(err) {
    if (err) {
      console.error(err.message);
      //dbClose();
      callback(err.message, null);
    }
    //dbClose();
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

UserModel.All = function(callback) {
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
        callback(err.message, null);
      } else {
        allRows.push(row);
      }
    },
    (err, count) => {
      if (allRows.length >= 1) {
        dbClose();
        console.log(allRows);
        callback(null, allRows);
      } else {
        dbClose();
        callback(`No se encuentran registros`, null);
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

UserModel.Add = function(userData, callback) {
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
        stmt = db.prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?)");
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
    }
  });
};

module.exports = UserModel;
