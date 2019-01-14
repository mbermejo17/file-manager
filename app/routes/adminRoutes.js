const express = require("express");
const router = express.Router();

const auditController = require('../controllers/auditController');
const adminController = require('../controllers/adminController');
//const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

router.get("/audit", checkUser, auditController.getAll);
router.get("/log", checkUser, adminController.getAll);
router.get("/audit/:name", checkUser, auditController.findByName);

//router.post("/add", auditController.auditAdd);

module.exports = router;