const fs = require('fs'),
    fsextra = require('fs-extra'),
    mime = require('mime-type'),
    mimeType = require('mime'),
    path = require('path'),
    md5File = require('md5-file'),
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
const log = global.logger;
const base64 = require('base-64');



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

const _sendMail = async function(userName, destName, aFile, Url) {
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

const _formatSize = (bytes) => {
    if (bytes >= 1073741824) {
        bytes = parseInt(bytes / 1000000000) + " GB";
    } else if (bytes >= 1048576) {
        bytes = parseInt(bytes / 1000000) + " MB";
    } else if (bytes >= 1024) {
        bytes = parseInt(bytes / 1000) + " KB";
    } else if (bytes > 1) {
        bytes = bytes + " bytes";
    } else if (bytes == 1) {
        bytes = bytes + " byte";
    } else {
        bytes = "0 byte";
    }
    return bytes;
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
                }, 'Carpeta ' + folderName + ' creada', 'Add new Folder', 'OK', (result) => {
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
                global.logger.error(`[${userName}] fileController::FileController deleteFiles() ->Error deleting file ${fullName} ${err}`);
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: fullName || '',
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
            global.logger.info(`[${userName}] fileController::FileController deleteFiles() ->${fullName} File deleted successfully!`);
            Audit.Add({
                userName: userName
            }, {
                clientIP: clientIP || '',
                browserIP: browserIP || ''
            }, {
                fileName: fullName || '',
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
                global.logger.error(`[${userName}] fileController::FileController deleteFolder() ->${newFolder} ${err}`);
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: fullName || '',
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
            global.logger.info(`[${userName}] fileController::FileController deleteFolder() ->${newFolder} Folder deleted successfully!`);
            Audit.Add({
                userName: userName
            }, {
                clientIP: clientIP || '',
                browserIP: browserIP || ''
            }, {
                fileName: fullName || '',
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

    makeMd5File(req, res, next) {
        let repoPath = req.query.destPath;
        let fileName = req.query.fileName;
        let fullFileName = path.join(normalize(pathPrefix + repoPath), fileName);
        // Calcula MD5

        console.log(fullFileName);
        md5File(fullFileName, (err, hash) => {
            if (err) console.log('******* err MD5 *******'.err);
            console.log(`********* The MD5 sum : ${hash} ************`);
            fs.writeFile(fullFileName + ".md5", hash, function(err) {
                if (err) {
                    res.send(JSON.stringify({
                        status: 'FAIL',
                        message: err,
                        data: {
                            fileName: fileName
                        }
                    }))
                }
                console.log("The file " + fullFileName + ".md5 was saved!");
                res.send(JSON.stringify({
                    status: 'OK',
                    message: "MD5 created",
                    data: {
                        fileName: fileName,
                        md5: hash
                    }
                }))
            });
        });
        ////////////////  
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
            fs.rename(file.path, path.join(form.uploadDir, file.name), function(err) {
                if (err) throw err;
                fs.stat(path.join(form.uploadDir, file.name), function(err, stats) {
                    if (err) throw err;
                    console.log('stats: ' + JSON.stringify(stats));
                });
            });

        });

        // log any errors that occur
        form.on('error', function(err) {
            if (process.env.NODE_ENV === 'dev') console.log('An error has occured: \n' + err)
            global.logger.error(`[${userName}] fileController::FileController upload() ->${fileName} ${err}`);
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
            global.logger.info(`[${userName}] fileController::FileController upload() ->${fileName} File Uploaded successfully!`);
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
            }));
        });

        // parse the incoming request containing the form data
        form.parse(req)


    }

    postDownload(req, res, next) {
        let data = req.body;
        let fileName = data.name;
        let userName = data.userName;
        let fileSize = data.size;
        let path = data.path;
        console.log("downloading ->", data);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
        res.setHeader('Content-Transfer-Encoding', 'binary')
        if (process.env.NODE_ENV === 'dev') console.log(normalize(pathPrefix + '\\' + fileName))
        global.logger.info(`[${userName}] fileController::FileController download() ->Downloading ${path}/${fileName} size ${fileSize}`);
        return res.status(200).json({
            "status": "OK",
            "message": "",
            "data": encodeURIComponent(base64.encode(normalize(pathPrefix + path + '/' + fileName)))
        });
        //res.download(normalize(pathPrefix + path + '/' + fileName), fileName)             
        //res.download(normalize(pathPrefix + '\\' + fileName), fileName)
    }

    postDownloadSmallFiles(req, res, next) {
        let data = req.body;
        let fileName = data.name;
        let userName = data.userName;
        let fileSize = data.size;
        let path = data.path;
        console.log("downloading ->", data);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
        res.setHeader('Content-Transfer-Encoding', 'binary')
        if (process.env.NODE_ENV === 'dev') console.log(normalize(pathPrefix + '\\' + fileName))
        global.logger.info(`[${userName}] fileController::FileController download() ->Downloading ${path}/${fileName} size ${fileSize}`);
        /*return res.status(200).json({
            "status": "OK",
            "message": "",
            "data": encodeURIComponent(base64.encode(normalize(pathPrefix + path + '/' + fileName)))
        });*/
        return res.download(normalize(pathPrefix + path + '/' + fileName), fileName)
            //res.download(normalize(pathPrefix + '\\' + fileName), fileName)
    }

    getDownload(req, res, next) {
        let fullName = decodeURIComponent(base64.decode(req.params.id));
        let fileName = fullName.substring(fullName.lastIndexOf('/') + 1);
        console.log("downloading ->", fullName);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
        res.setHeader('Content-Transfer-Encoding', 'binary')
        res.cookie('downloadFile', fileName);
        //if (process.env.NODE_ENV === 'dev') console.log(normalize(pathPrefix + '\\' + fileName))
        //global.logger.info(`[${userName}] fileController::FileController download() ->Downloading ${path}/${fileName} size ${fileSize}`);
        res.download(fullName);
        //res.download(normalize(pathPrefix + '\\' + fileName), fileName)
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
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment(new Date()).format('x');

        let renderDownloadPage = (d) => {
            let sharedFilesContent = '';
            d.forEach((f, idx) => {
                console.log(f.UnixDate);
                console.log(currentUnixDate);
                sharedFilesContent += `
                <div class="sharedFile-item">
                    <span class="firstColItem">${f.FileName}</span>
                    <span class="colItem">${f.Size}</span>`;
                if ((f.UnixDate !== 1) && (f.UnixDate < currentUnixDate)) {
                    sharedFilesContent += `
                        <a href = "#" data-title="El enlace ha expirado" class="expirated" id="expiratedLink"><i class = "fas fa-download expirated" data-title="El enlace ha expirado"></i></a >
                        </div>`;
                } else {
                    sharedFilesContent += `
                        <a href = "/files/share/${f.UrlCode}"><i class ="fas fa-download" ></i></a >
                        </div>`;
                }
            });
            let downloadPageHTML = `
                        <!DOCTYPE html>
                        <html lang = "es">
                        <head>
                            <meta charset = "UTF-8" >
                            <meta name = "viewport" content = "width=device-width, initial-scale=1.0" >
                            <meta http - equiv = "X-UA-Compatible" content = "ie=edge" >
                            <title> Download Page</title> 
                            <link type = "text/css" rel = "stylesheet" href = "/css/fontawesome.all.min.css" media = "screen,projection">
                            <link type = "text/css" rel = "stylesheet" href = "/css/style.css" media = "screen,projection">
                            <link rel = "shortcut icon" href = "/favicon.ico">
                            <link rel = "shortcut icon" href = "/favicon_64.png">
                        </head> 
                        <body>
                            <div class = "row head-container">
                                <div class = "container">
                                    <div class = "col m3 logo"></div> 
                                    <div class = "col m12 center title"> File Manager</div> 
                                    <div class = "col m3 status right"></div> 
                                </div> 
                            </div> 
                            <div class = "row nav-unify" ></div> 
                            <div class = "row" ></div> 
                            <form class = "sharedFilesDownload">
                                <span class = "form-title"> Download Files </span>  
                                <div id = "sharedFiles-container"> ${sharedFilesContent} </div>
                            </form> 
                            <div class = "footer-unify" >
                                <div class = "container" ></div> 
                            </div> 
                        </body> 
                        </html>`;
            res.send(downloadPageHTML);
        };

        if (process.env.NODE_ENV === 'dev') console.log(fileId);
        Util.getById(fileId, (d) => {
            if (d.status == 'OK') {
                if (process.env.NODE_ENV === 'dev') console.log(d)
                    //fileRealPath = d.data.RealPath
                fileName = d.data[0].FileName
                global.logger.info(` [$ { userName }] fileController::FileController shareFileDownload() - > $ { fileName }
                    Shared File downloaded successfully!`);
                /*  Audit.Add({
                     userName: userName
                 }, {
                     clientIP: clientIP,
                     browserIP: browserIP
                 }, {
                     fileName: fileName,
                     fileSize: 0
                 }, {
                     dateString: currentDate,
                     unixDate: currentUnixDate
                 }, normalize(pathPrefix + fileRealPath + '/' + fileName), 'Download Shared File', 'OK', () => {
                     if (process.env.NODE_ENV === 'dev') console.log(result);
                 }); */
                console.log(d.data.length);
                if (d.data.length > 1) {
                    renderDownloadPage(d.data);
                } else {
                    return res.status(200).download(normalize(pathPrefix + d.data[0].RealPath + '/' + fileName), fileName, err => {
                        if (err) {
                            // Actualiza Audit
                        } else {
                            // Cambia estado en DB
                        }
                    });
                }
            } else {
                global.logger.error(` [$ { userName }] fileController::FileController shareFileDownload() - > $ { fileName }
                    $ { d.message }
                    `);
                /*Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP,
                    browserIP: browserIP
                }, {
                    fileName: '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, d.message, 'Download Shared File', 'FAIL', () => {
                    if (process.env.NODE_ENV === 'dev') console.log(result);
                });*/
                return res.status(200).json({
                    "status": "FAIL",
                    "message": d.message + ".<br>Enlace no disponible.",
                    "data": null
                });
            }
        })

    }


    shareFileManage(req, res, next) {
        let userName = req.params.name;
        //let userName = req.cookies.UserName;
        let browserIP = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).split(",")[1];

        let clientIP = req.connection.remoteAddress;
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment().format('x');
        console.log('hello');
        if (process.env.NODE_ENV === 'dev') console.log(userName);
        Util.getByUserName(userName, (d) => {
            if (process.env.NODE_ENV === 'dev') console.log(d);
            if (d.status == 'OK') {
                if (process.env.NODE_ENV === 'dev') console.log('shareFileManage->', d.data);
                Audit.Add({
                    userName: userName
                }, {
                    clientIP: clientIP || '',
                    browserIP: browserIP || ''
                }, {
                    fileName: '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, d.data, 'Share File', 'OK', (result) => {
                    if (process.env.NODE_ENV === 'dev') console.log(result);
                });
                return res.status(200).json({
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
                    fileName: fullName || '',
                    fileSize: 0
                }, {
                    dateString: currentDate,
                    unixDate: currentUnixDate
                }, d.message, 'Share File', 'FAIL', (result) => {
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
        let sqlQuery = 'DELETE FROM Shared WHERE ((UnixDate >1 ) AND (UnixDate  < ?));';
        let currentDate = moment(new Date()).format('DD/MM/YYYY  HH:mm:ss');
        let currentUnixDate = moment().format('x');
        if (process.env.NODE_ENV === 'dev') console.log(sqlQuery);
        _cleanExpiredSharedFiles(sqlQuery, (response) => {
            if (process.env.NODE_ENV === 'dev') console.log(response);
            global.logger.info(` [$ { userName }] fileController::shareFile _cleanExpiredSharedFiles() - > $ { response.message }
                    `);
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
                    _sendMail(userName, destUserName, fileName, `
                    https: //filebox.unifyspain.es/files/share/${uid}`);
                    d.data.hostServer = req.get('host');
                    return res.status(200).json(d);
                }
            })
        });
    }

}
module.exports = new FileController()