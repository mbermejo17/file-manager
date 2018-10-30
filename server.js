const https = require('https');
const fs = require('fs');
const app = require('./app');
const url = require('url');
const WebSocketServer = require('ws').Server
const port = process.env.PORT || 8443;
const path = require('path');

global.appRoot = path.resolve(__dirname);
process.env.NODE_ENV = "dev";

//const server = http.createServer(app);
let httpsServer = https.createServer({
  key: fs.readFileSync(global.appRoot + '/app/certs/fileManagerServer.key'),
  cert: fs.readFileSync(global.appRoot + '/app/certs/fileManagerServer.cert')
}, app).listen(port, function () {
  console.log('Enviroment: ',process.env.NODE_ENV);
  console.log("https server listening on port " + port + "...");
});

// ********************************   Configuracion logger
const log4js = require('log4js');
log4js.configure('./app/config/log4js_config.json', { cwd: __dirname + '/app/logs' });
global.logger = log4js.getLogger('FileManager');
global.logger.setLevel('ALL');

logger.info('Shutdown() -> Received kill signal, shutting down gracefully.');

let noop = () => { };

let wss = new WebSocketServer({
  //server: httpsServer,
  path: '/client',
  noServer: true
});

let wssRemoteRoom = new WebSocketServer({
  //server: httpsServer,
  path: '/room',
  noServer: true
});


httpsServer.on('uncaughtException', (request, response, route, error) => {
  console.error(error.stack);
  response.send(error);
});
httpsServer.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === '/client') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else if (pathname === '/room') {
    wssRemoteRoom.handleUpgrade(req, socket, head, (ws) => {
      wssRemoteRoom.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});



wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};
const interval = setInterval(function sendKeepAlive() {
  wss.clients.forEach(function each(ws) {
    console.log('Client.ID ' + ws.id + ' isAlive ' + ws.isAlive);
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.send(JSON.stringify({
      'event': 'KeepAlive',
      'message': ''
    }));
    ws.ping(noop);
  });
  wssRemoteRoom.clients.forEach(function each(wsRemoteRoom) {
    console.log('Room.ID ' + wsRemoteRoom.id + ' isAlive ' + wsRemoteRoom.isAlive);
    if (wsRemoteRoom.isAlive === false) return wsRemoteRoom.terminate();
    wsRemoteRoom.isAlive = false;
    wsRemoteRoom.send(JSON.stringify({
      'event': 'KeepAlive',
      'message': ''
    }));
    wsRemoteRoom.ping(noop);
  });
}, 30000);


///////////////////////////////////
//Eventos WebSockets Salas remotas
//////////////////////////////////
wss.aSockets = [];

wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  if (!wss.aSockets[userName]) {
    wss.aSockets[userName] = [];
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //console.log('HandleID ' + ws._socket._handle.fd);
    ws.id = wss.getUniqueID();
    //wss.clients.forEach(function each(client) {
    console.log('Client.ID: ' + ws.id + ' Connected');
    //});
  }
  wss.aSockets[userName].push(socketID);
  console.log(wss.aSockets);
  //console.dir(req.headers['sec-websocket-key']);
  ws.send(JSON.stringify({
    'event': 'Connected',
    'message': `Client ID -> ${ws.id}  Connected!!!. Your IP  ${ip}`
  }));
  ws.on('message', (data) => {
    let jsonData = JSON.parse(data);
    let eventType = jsonData.event;
    let message = jsonData.message;
    if (eventType === 'KeepAlive')
      ws.isAlive = true;
    //ws.send(`Data received from IP ${ip} : ${data.toString()} `) // echo-server
  })
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  ws.on("close", function () {
    console.log("Client.ID: " + ws.id + ' Disconnected');
  });
});

///////////////////////////////////
//Eventos WebSockets Salas remotas
//////////////////////////////////
wssRemoteRoom.on('connection', function connection(wsRemoteRoom, req) {
  wsRemoteRoom.isAlive = true;
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('HandleID ' + wsRemoteRoom._socket._handle.fd);
  wsRemoteRoom.id = wss.getUniqueID();
  wssRemoteRoom.clients.forEach(function each(client) {
    console.log('Room.ID: ' + client.id + ' Connected');
  });

  //console.dir(req.headers['sec-websocket-key']);
  wsRemoteRoom.send(JSON.stringify({
    'event': 'Connected',
    'message': `Room ID -> ${wsRemoteRoom.id}  Connected!!!. Your IP  ${ip}`
  }));
  wsRemoteRoom.on('message', (data) => {
    let jsonData = JSON.parse(data);
    let eventType = jsonData.event;
    let message = jsonData.message;
    if (eventType === 'KeepAlive')
      wsRemoteRoom.isAlive = true;
    //ws.send(`Data received from IP ${ip} : ${data.toString()} `) // echo-server
  })
  wsRemoteRoom.on('pong', () => {
    wsRemoteRoom.isAlive = true;
  });
  wsRemoteRoom.on("close", function () {
    console.log("Room.ID: " + wsRemoteRoom.id + ' disconnected');
  });
});
//server.listen(port);
