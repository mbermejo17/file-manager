const fs = require('fs'),
    fsextra = require('fs-extra'),
    mime = require('mime-type'),
    mimeType = require('mime'),
    path = require('path'),
    settings = require('../config/config.json'),
    //pathPrefix = '.\\repository\\',
    pathPrefix = settings.repositoryPath,
    platform = require('os').platform,
    normalize = require('normalize-path'),
    formidable = require('formidable'),
    uuidv4 = require('uuid/v4'),
    Util = require('./../models/util'),
    moment = require('moment'),
    mail = require('mail').Mail({
        host: settings.emailServer,
        port: settings.emailPort,
        username: settings.emailUserName,
        password: settings.emailUserPassword,
        secure: true,
        insecureAuth: true
      });
const Audit = require("../controllers/auditController");   

    
let _getStats = (p) => {
    fs.stat(p, (err, stats) => {
        return {
            name: stats.name,
            mime: mime.lookup(stats.name),
            folder: stats.isDirectory(),
            size: stats.size,
            mtime: stats.mtime.getTime(),
            mode: stats.mode
        }
    })
}


let _getUID = () => {
    let uid = uuidv4();
    return uid.replace(/-/g, '');
};


let _cleanExpiredSharedFiles = (query, callback) => {
    Util.CleanExpiredFiles(query, (response) => {
        callback(response);
    });
};

/* const read = (dir) =>
fs.readdirSync(dir)
  .reduce((files, file) =>
    fs.statSync(path.join(dir, file)).isDirectory() ?
      files.concat(read(path.join(dir, file))) :
      files.concat(path.join(dir, file)),
    []);
 */

const _sendMail = async function(userName,destName, aFile, Url) {
    /* await mail.message({
        from: "filemanager@filebox.unifyspain.es",
        to: [ destName],
        subject: "URL para descarga de archivos" 
    })
    .body(`El usuario ${userName} ha compartido el archivo ${aFile}, para descargarlo use la  URL: ${Url}
    NOTA: Favor, no responder este mensaje. Este mensaje ha sido emitido 
    automáticamente por la apliación File Manager.

    The user ${userName} has shared the file ${aFile}, to download it use the URL: ${Url}
     NOTE: Please, do not answer this message. This message has been issued
     automatically by the File Manager application.
    `)
    .send(function(err){
        if(err) {
            console.log(err);
        }
    }); */
};


class FileController {
    getFiles(req, res, next) {
        let result = {},
            response = [],
            // dirPath = req.body.dirPath
            dirPath = req.query.path;

        if (process.env.NODE_ENV === 'dev') console.log('fileController::req.userData: ', req.userData)
        if (process.env.NODE_ENV === 'dev') console.log('fileController::getFiles:dirPath: ', dirPath)
        let userData = JSON.parse(req.userData)
        if (process.env.NODE_ENV === 'dev') console.log('fileController::getFiles:userData: ', userData)
        let rPath = userData.RootPath
        if (process.env.NODE_ENV === 'dev') console.log('getFiles:dirPath.indexOf(rPath) ', dirPath.indexOf(rPath))
        if (dirPath.indexOf(rPath) != 1 && rPath != '/') {
            return res.send(JSON.stringify({}))
        }
        dirPath = normalize(pathPrefix + dirPath)
        if (process.env.NODE_ENV === 'dev') console.log('fileController::getFiles:realPath ' + dirPath)
        response = (dirPath) => {
            return fs.readdirSync(dirPath)
                .reduce((list, file) => {
                    let name = path.join(dirPath, file),
                        isFolder = fs.statSync(name).isDirectory(),
                        isFile = fs.statSync(name).isFile(),
                        stat = fs.statSync(name),
                        date = new Date(stat.mtime).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    list = list || []
                    list.push({
                        'name': name.split(path.sep).slice(-1)[0],
                        'size': stat.size,
                        'date': date,
                        'isFolder': isFolder,
                        'isFile': isFile,
                        // "mode": parseInt(stat.mode.toString(8), 10)
                        'mode': stat.mode,
                        'type': mimeType.getType(name)
                    })
                    if (isFile) console.log('mode: ', stat.mode)
                    return list
                }, [])
        }
        if (process.env.NODE_ENV === 'dev') console.log(response(dirPath))
        res.send(JSON.stringify(response(dirPath)))
    }

    newFolder(req, res, next) {
        let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        let destPath = req.body.path
        let folderName = req.body.folderName
        let newFolder = normalize(pathPrefix + destPath + '/' + folderName.toUpperCase())
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment().format('x');
        if (process.env.NODE_ENV === 'dev') console.log('Creating new folder ' + newFolder + ' ...')
        fs.mkdir(newFolder, function(err) {
            if (err) {
                if (process.env.NODE_ENV === 'dev') console.error(err)
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: newFolder || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, err, 'Add new Folder', 'FAIL', (result) => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                if (err.code == 'EEXIST') {
                    res.send(JSON.stringify({
                        status: 'FAIL',
                        message: 'folder already exists',
                        data: null
                    }))
                } else {
                    res.send(JSON.stringify({
                        status: 'FAIL',
                        message: 'Error code: ' + err.code,
                        data: null
                    }))
                }
            } else {
                if (process.env.NODE_ENV === 'dev') console.log('Directory created successfully!')
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: newFolder || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, 'Carpeta ' + folderName + ' creada' , 'Add new Folder', 'OK', (result) => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                res.send(JSON.stringify({
                    status: 'OK',
                    message: 'Carpeta ' + folderName + ' creada',
                    data: {
                        'folderName': req.body.folderName,
                        'Path': req.body.path
                    }
                }))
            }

        })
    }

    deleteFiles(req, res, next) {
        if (process.env.NODE_ENV === 'dev') console.log(req.body);
        let destPath = req.body.path
        let fileName = req.body.fileName
        let fullName = normalize(pathPrefix + destPath + '/' + fileName)
        let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment().format('x');
        if (process.env.NODE_ENV === 'dev') console.log('Deleting file ' + fullName + ' ...')
        fsextra.remove(fullName, function(err) {
            if (err) {
                if (process.env.NODE_ENV === 'dev') console.error(err)
                global.logger.error('fileController::FileController deleteFiles() ->Error deleting file ' + fullName + ' ' + err );
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, err, 'Delete File', 'FAIL', () => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                res.send(JSON.stringify({
                    status: 'FAIL',
                    data: err
                }))
            }
            if (process.env.NODE_ENV === 'dev') console.log('File deleted successfully!')
            global.logger.info('fileController::FileController deleteFiles() ->' + fullName + ' File deleted successfully!');
            Audit.Add({
                userName: userName
            }, {
                clientIP: clientIP || '',
                browserIP: browserIP || ''
            }, {
                fileName: rootPath || '',
                fileSize: 0
            }, {
                dateString: currentDate,
                unixDate: currentUnixDate
            }, fullName, 'Delete File', 'OK', () => {
              if (process.env.NODE_ENV === 'dev') console.log(result);  
            });
            res.send(JSON.stringify({
                status: 'OK',
                data: {
                    'fileName': req.body.fileName,
                    'Path': req.body.path
                }
            }))
        })
    }
    deleteFolder(req, res, next) {
        let newFolder = req.body.path
        let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment().format('x');

        newFolder = normalize(pathPrefix + newFolder)
        fsextra.remove(newFolder, function(err) {
            if (err) {
                console.error(err)
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, err, 'Delete Folder', 'FAIL', () => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                res.send(JSON.stringify({
                    status: 'FAIL',
                    data: err
                }))
            }
            console.log('Directory deleted successfully!')
            Audit.Add({
                userName: userName
            }, {
                clientIP: clientIP || '',
                browserIP: browserIP || ''
            }, {
                fileName: rootPath || '',
                fileSize: 0
            }, {
                dateString: currentDate,
                unixDate: currentUnixDate
            }, newFolder, 'Delete Folder', 'OK', () => {
              if (process.env.NODE_ENV === 'dev') console.log(result);  
            });
            res.send(JSON.stringify({
                status: 'OK',
                data: req.body.path
            }))
        })
    }

    upload(req, res, next) {
        if (process.env.NODE_ENV === 'dev') console.log(req.query)
        // create an incoming form object
        let form = new formidable.IncomingForm();
        let repoPath = req.query.destPath;
        let fileName = '';
        let fileSize = '';
        let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment().format('x');

        form.maxFileSize = settings.maxFileSize * 1024 * 1024;
        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true

        // store all uploads in the /uploads directory
        form.uploadDir = normalize(pathPrefix + repoPath);


        if (process.env.NODE_ENV === 'dev') console.log('upload:repoPath ' + form.uploadDir)
        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            if (process.env.NODE_ENV === 'dev') console.log(file);
            fileName = file.name;
            fileSize = file.size;
            fs.rename(file.path, path.join(form.uploadDir, file.name), function (err) {
                if (err) throw err;
                fs.stat(path.join(form.uploadDir, file.name), function (err, stats) {
                  if (err) throw err;
                  console.log('stats: ' + JSON.stringify(stats));
                });
            });
        });

        // log any errors that occur
        form.on('error', function(err) {
            if (process.env.NODE_ENV === 'dev') console.log('An error has occured: \n' + err)
            Audit.Add({
                userName: userName
            }, {
                clientIP: clientIP || '',
                browserIP: browserIP || ''
            }, {
                fileName: repoPath || '',
                fileSize: fileSize
            }, {
                dateString: currentDate,
                unixDate: currentUnixDate
            }, err, 'Upload File', 'FAIL', () => {
              if (process.env.NODE_ENV === 'dev') console.log(result);  
            });
            res.send(JSON.stringify({
                status: 'FAIL',
                message: err,
                data: {
                    fileName: fileName
                }
            }))
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            Audit.Add({
                userName: userName
            }, {
                clientIP: clientIP || '',
                browserIP: browserIP || ''
            }, {
                fileName: repoPath || '',
                fileSize: fileSize
            }, {
                dateString: currentDate,
                unixDate: currentUnixDate
            }, fileName, 'Upload File', 'OK', () => {
              if (process.env.NODE_ENV === 'dev') console.log(result);  
            });
            res.send(JSON.stringify({
                status: 'OK',
                message: '',
                data: {
                    fileName: fileName
                }
            }))
        });

        // parse the incoming request containing the form data
        form.parse(req)


    }

    download(req, res, next) {
        let fileName = req.body.filename
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
        res.setHeader('Content-Transfer-Encoding', 'binary')
        if (process.env.NODE_ENV === 'dev') console.log(normalize(pathPrefix + '\\' + fileName))
        res.download(normalize(pathPrefix + '\\' + fileName), fileName)
    }

    shareFileDownload(req, res, next) {
        let fileId = req.params.id
        let fileRealPath = ''
        let fileName = ''
        let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        if (process.env.NODE_ENV === 'dev') console.log(fileId)
        Util.getById(fileId, (d) => {
            if (d.status == 'OK') {
                if (process.env.NODE_ENV === 'dev') console.log(d)
                fileRealPath = d.data.RealPath
                fileName = d.data.FileName
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, normalize(pathPrefix + fileRealPath + '/' + fileName), 'Download Shared File', 'OK', () => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                
                res.download(normalize(pathPrefix + fileRealPath + '/' + fileName), fileName)
            } else {
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, d.message, 'Download Shared File', 'FAIL', () => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                return res.status(200).json({
                    "status": "FAIL",
                    "message": d.message + ".<br>Enlace no disponible.",
                    "data": null
                });
            }
        })

    }

    shareFileManage(req,res,next) {
        let userName = req.params.name;
        let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        console.log('hello');
        if (process.env.NODE_ENV === 'dev') console.log(userName);
        Util.getByUserName(userName,(d) =>{
            if(d.status == 'OK') {
                if (process.env.NODE_ENV === 'dev') console.log('shareFileManage->',d.data);
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, data, 'Share File', 'OK', () => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                return  res.status(200).json({
                    "status": "OK",
                    "message": "",
                    "data": d.data
                });
            } else {
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: rootPath || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, d.message, 'Share File', 'FAIL', () => {
                  if (process.env.NODE_ENV === 'dev') console.log(result);  
                });
                return res.status(200).json({
                    "status": "FAIL",
                    "message": d.message + "No hay archivos compartidos.",
                    "data": null
                });
            }
        })
    }

    shareFile(req, res, next) {
        if (process.env.NODE_ENV === 'dev') console.log(req.get('host'));
        let fileName = req.body.fileName
        let fileSize = req.body.fileSize
        let path = req.body.path
        let userName = req.body.userName
        let destUserName = req.body.destUserName
        let expirationDate = req.body.expirationDate
        let deleteExpiredFile = req.body.deleteExpiredFile
        let groupID = req.body.groupID
        let uid = _getUID()
        let date = new Date();
        let newDate = new Date(date.setDate(date.getDate() + 1));
        if (process.env.NODE_ENV === 'dev') console.log(newDate);
        let data = {
            UrlCode: uid,
            User: userName,
            DestUser: destUserName,
            RealPath: path,
            FileName: fileName,
            Size: fileSize,
            ExpirationDate: expirationDate,
            UnixDate: moment(expirationDate).unix(),
            State: 'Pending',
            deleteExpiredFile: deleteExpiredFile,
            groupID: groupID
        }
        let sqlQuery = 'DELETE FROM Shared WHERE (UnixDate  < ?);';
        if (process.env.NODE_ENV === 'dev') console.log(sqlQuery);
        _cleanExpiredSharedFiles(sqlQuery, (response) => {
            if (process.env.NODE_ENV === 'dev') console.log(response);
            Util.AddSharedFiles(data, (d) => {
                if (process.env.NODE_ENV === 'dev') console.log("d : ", d);
                if (d.status === 'FAIL') {
                    return res.status(200).json({
                        "status": "FAIL",
                        "message": d.message + ".<br>Error al crear enlace compartido.",
                        "data": null
                    });
                } else {
                    // send email
                    _sendMail(userName,destUserName,fileName,`https://filebox.unifyspain.es/files/share/${uid}`);
                    d.data.hostServer = req.get('host');
                    return res.status(200).json(d);
                }
            })
        });
    }

}

module.exports = new FileController()