const fs = require('fs'),
  fsextra = require('fs-extra'),
  mime = require('mime-type'),
  mimeType = require('mime'),
  path = require('path'),
  pathPrefix = '.\\repository\\',
  platform = require('os').platform,
  normalize = require('normalize-path'),
  formidable = require('formidable'),
  uuidv4 = require('uuid/v4'),
  Util = require('./../models/util'),
  moment = require('moment')

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
  return uid.replace(/-/g,'');
};


let  _cleanExpiredSharedFiles = (query,callback)=>{
  Util.CleanExpiredFiles(query,(response)=>{
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

class FileController {
  getFiles(req, res, next) {
    let result = {},
      response = [],
      // dirPath = req.body.dirPath
      dirPath = req.query.path

    console.log('fileController::req.userData: ', req.userData)
    console.log('fileController::getFiles:dirPath: ', dirPath)
    let userData = JSON.parse(req.userData)
    console.log('fileController::getFiles:userData: ', userData)
    let rPath = userData.RootPath
    console.log('getFiles:dirPath.indexOf(rPath) ', dirPath.indexOf(rPath))
    if (dirPath.indexOf(rPath) != 1 && rPath != '/') {
      return res.send(JSON.stringify({}))
    }
    dirPath = normalize(pathPrefix + dirPath)
    console.log('fileController::getFiles:realPath '+ dirPath)
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
    console.log(response(dirPath))
    res.send(JSON.stringify(response(dirPath)))
  }

  newFolder(req, res, next) {
    let destPath = req.body.path
    let folderName = req.body.folderName 
    let newFolder = normalize(pathPrefix + destPath + '/'+ folderName.toUpperCase())
    console.log('Creating new folder '+ newFolder + ' ...')
    fs.mkdir(newFolder, function (err) {
      if (err) {
        console.error(err)
        if(err.code == 'EEXIST') {
          res.send(JSON.stringify({ status: 'FAIL', message: 'folder already exists',data: null }))
        } else {
          res.send(JSON.stringify({ status: 'FAIL', message: 'Error code: '+ err.code,data: null }))
        } 
      } else {
        console.log('Directory created successfully!')
        res.send(JSON.stringify({ status: 'OK', message: 'Carpeta '+ folderName +' creada',data: { 'folderName': req.body.folderName,'Path': req.body.path } }))
      }
      
    })
  }

  deleteFiles(req, res, next) {
    console.log(req.body);
    let destPath = req.body.path
    let fileName = req.body.fileName 
    let fullName = normalize(pathPrefix + destPath + '/' + fileName)
    console.log('Deleting file '+ fullName + ' ...')
    fsextra.remove(fullName, function (err) {
      if (err) {
        console.error(err)
        res.send(JSON.stringify({ status: 'FAIL', data: err }))
      }
      console.log('File deleted successfully!')
      res.send(JSON.stringify({ status: 'OK', data: { 'fileName': req.body.fileName,'Path': req.body.path }}))
    })
  }
  deleteFolder(req, res, next) {
    let newFolder = req.body.path
    newFolder = normalize(pathPrefix + newFolder)
    fsextra.remove(newFolder, function (err) {
      if (err) {
        console.error(err)
        res.send(JSON.stringify({ status: 'FAIL', data: err }))
      }
      console.log('Directory deleted successfully!')
      res.send(JSON.stringify({ status: 'OK', data: req.body.path }))
    })
  }

  upload(req,res,next) {
    console.log(req.query)
     // create an incoming form object
     let form = new formidable.IncomingForm()
     let repoPath = req.query.destPath
     let fileName = ''
     
     form.maxFileSize = 700 * 1024 * 1024;    
     // specify that we want to allow the user to upload multiple files in a single request
     form.multiples = true

     // store all uploads in the /uploads directory
     form.uploadDir = normalize(pathPrefix + repoPath)
     
     
     console.log('upload:repoPath '+form.uploadDir)
     // every time a file has been uploaded successfully,
     // rename it to it's orignal name
     form.on('file', function(field, file) {
         console.log(file);
         fileName = file.name;
         fs.rename(file.path, path.join(form.uploadDir, file.name))
     });

     // log any errors that occur
     form.on('error', function(err) {
         console.log('An error has occured: \n' + err)
         res.send(JSON.stringify({ status: 'FAIL', message: err,data:{fileName: fileName} }))
     });

     // once all the files have been uploaded, send a response to the client
     form.on('end', function() {
         res.send(JSON.stringify({ status: 'OK', message: '',data:{fileName: fileName} }))
     });

     // parse the incoming request containing the form data
     form.parse(req)
     

    }
  
  download(req, res, next) {
    let fileName = req.body.filename
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    res.setHeader('Content-Transfer-Encoding', 'binary')
    console.log(normalize(pathPrefix + '\\' + fileName))
    res.download(normalize(pathPrefix + '\\' + fileName), fileName)
  }

  shareFileDownload(req, res, next) {
    let fileId = req.params.id
    let fileRealPath = ''
    let fileName = ''
    console.log(fileId) 
    Util.getById(fileId, (d) =>{
      if(d.status == 'OK'){
        console.log(d)
        fileRealPath = d.data.RealPath
        fileName = d.data.FileName
        res.download(normalize(pathPrefix + fileRealPath +'/' +fileName), fileName)
      } else {
        return res.status(200).json({"status":"FAIL","message":d.message +".<br>Enlace no disponible.","data":null });
      }
    })
    
  }

  shareFile( req, res, next ) {
    console.log(req.get('host'));
    let fileName = req.body.fileName
    let fileSize = req.body.fileSize
    let path = req.body.path
    let userName = req.body.userName
    let destUserName = req.body.destUserName
    let expirationDate = req.body.expirationDate
    let deleteExpiredFile = req.body.deleteExpiredFile
    let uid = _getUID()
    let date = new Date();
    let newDate = new Date(date.setDate(date.getDate() + 1));
    console.log(newDate); 
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
      deleteExpiredFile: deleteExpiredFile
    }
    let sqlQuery = 'DELETE FROM Shared WHERE (UnixDate  < ?);';
    console.log(sqlQuery);
   _cleanExpiredSharedFiles(sqlQuery,(response)=>{
    console.log(response);
    Util.Add(data,(d)=>{
      console.log("d : ", d);
      if (d.status === 'FAIL') {
          return res.status(200).json({"status":"FAIL","message":d.message +".<br>Error al crear enlace compartido.","data":null });
      } else {
          d.data.hostServer = req.get('host');
          return res.status(200).json(d); 
      }
    })
   });
  }
  
}

module.exports = new FileController()
