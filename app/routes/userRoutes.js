const express = require("express");
const router = express.Router();

const UserController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

////////////////////////
// Gestion de usuarios
////////////////////////

router.get("/", checkUser,UserController.Index);

router.get("/dashboard", checkUser,UserController.Dashboard);
router.get("/users", UserController.UserGetAll);

router.get("/user/:userId", UserController.UserFindById);

router.get("/searchuser", UserController.UserFindByName);

router.post("/changepasswd", UserController.changePasswd);
router.post("/adduser", UserController.UserAdd);
router.post("/updateuser", UserController.UserUpdate);

router.post("/login", UserController.UserLogin);

//router.delete("/:userId", checkAuth, UserController.UserDelete);

/////////////////////////
// Gestion Salas
////////////////////////

// TODO

////////////////////////
// Mantenimiento App
///////////////////////

// TODO

module.exports = router;
