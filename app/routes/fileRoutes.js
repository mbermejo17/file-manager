const express = require("express");
const router = express.Router();

const FileController = require('../controllers/fileController');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

////////////////////////
// Gestion de usuarios
////////////////////////

router.get("/", FileController.getFiles);

router.post('/download', checkAuth,FileController.download)
router.post('/files/newfolder', checkAuth,FileController.newFolder)
router.post('/files/delete', checkAuth,FileController.deleteFiles)
router.post('/files/deletefolder', checkAuth,FileController.deleteFolder)
router.post('/files/upload', checkAuth,FileController.upload)

module.exports = router;