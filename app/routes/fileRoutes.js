const express = require("express");
const router = express.Router();

const FileController = require('../controllers/fileController');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

////////////////////////
// Gestion de usuarios
////////////////////////

router.get("/", checkAuth, FileController.getFiles);

//router.post('/download', checkAuth,FileController.download)
router.post('/downloadSmall', FileController.postDownloadSmallFiles)
router.post('/download', FileController.postDownload)
router.post('/newfolder', checkAuth, FileController.newFolder)
router.post('/delete', checkAuth, FileController.deleteFiles)
router.post('/deletefolder', checkAuth, FileController.deleteFolder)
router.post('/upload', FileController.upload)
router.post('/upload/md5', FileController.makeMd5File)
router.post('/share', FileController.shareFile)
router.get('/share/:id', FileController.shareFileDownload)
router.get('/download/:id', FileController.getDownload)
router.get('/shared/user/:name', FileController.shareFileManage)

module.exports = router;