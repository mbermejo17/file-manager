const express = require("express");
const router = express.Router();

const UserController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

router.get("/user/name/:name", checkUser,auditController.AuditFindByName);

router.post("/add", auditController.AuditAdd);

module.exports = router;
