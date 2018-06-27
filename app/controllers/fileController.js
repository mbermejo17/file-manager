const fs = require('fs'),
  fsextra = require('fs-extra'),
  mime = require('mime-type'),
  mimeType = require('mime'),
  path = require('path'),
  pathPrefix = '.\\repository\\',
  platform = require('os').platform,
  normalize = require('normalize-path')

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

/* const read = (dir) =>
fs.readdirSync(dir)
  .reduce((files, file) =>
    fs.statSync(path.join(dir, file)).isDirectory() ?
      files.concat(read(path.join(dir, file))) :
      files.concat(path.join(dir, file)),
    []);
 */

class FileController {
  getFiles (req, res, next) {
    let result = {},
      response = [],
            // dirPath = req.body.dirPath
      dirPath = req.query.path
    
    console.log('fileController::req.userData: ',req.userData)
    console.log('fileController::getFiles:dirPath: ',dirPath)
    let userData = JSON.parse(req.userData)
    console.log('fileController::getFiles:userData: ',userData)
    let rPath = userData.RootPath
      console.log('getFiles:dirPath.indexOf(rPath) ',dirPath.indexOf(rPath))
      if(dirPath.indexOf(rPath) != 0) {
        return res.send(JSON.stringify({}))
      }  
    dirPath = normalize(pathPrefix + dirPath)
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
  
  newFolder (req, res, next) {
    let newFolder = req.body.path
    newFolder = normalize(pathPrefix + newFolder)
    fs.mkdir(newFolder, function (err) {
      if (err) {
        console.error(err)
        res.send(JSON.stringify({ status: 'FAIL', data: err }))
      }
      console.log('Directory created successfully!')
      res.send(JSON.stringify({ status: 'OK', data: req.body.path }))
    })
  }
  deleteFiles (req, res, next) {
    let fileName = req.body.path
    fileName = normalize(pathPrefix + fileName)
    fsextra.remove(fileName, function (err) {
      if (err) {
        console.error(err)
        res.send(JSON.stringify({ status: 'FAIL', data: err }))
      }
      console.log('File deleted successfully!')
      res.send(JSON.stringify({ status: 'OK', data: req.body.path }))
    })
  }
  deleteFolder (req, res, next) {
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

  upload () {

  }
  download (req, res, next) {
    let fileName = req.body.filename
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName)
    res.setHeader('Content-Transfer-Encoding', 'binary')
    console.log(normalize(pathPrefix + '\\' + fileName))
    res.download(normalize(pathPrefix + '\\' + fileName), fileName)
  }
}

module.exports = new FileController()
