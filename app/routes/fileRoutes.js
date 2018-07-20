const express = require("express");
const router = express.Router();

const FileController = require('../controllers/fileController');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

////////////////////////
// Gestion de usuarios
////////////////////////

router.get("/", checkAuth,FileController.getFiles);

//router.post('/download', checkAuth,FileController.download)
router.post('/download',FileController.download)
router.post('/newfolder', checkAuth,FileController.newFolder)
router.post('/delete', checkAuth,FileController.deleteFiles)
router.post('/deletefolder', checkAuth,FileController.deleteFolder)
router.post('/upload',FileController.upload)
router.post('/share',FileController.shareFile)
router.get('/share/:id',FileController.shareFileDownload)

module.exports = router;
