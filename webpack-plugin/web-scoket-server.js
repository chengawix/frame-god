var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(9000, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

let connections = []; 

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  connections.push(connection);
  // var interval = 0
  // setInterval(()=>{
  //   interval++;
  //   console.log(`<input value="${interval}">`);
  //   connection.send(`<input value="${interval}">`)
  // },1000)
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
    }
  });

  connection.on('close', function(connection) {
    // close user connection
  });
});

// filename

fs.watch("D:/git/wix-repos/Security_tools/securi-tate/dist/charts.html", (eventType, filename) => {
  fs.readFile("D:/git/wix-repos/Security_tools/securi-tate/dist/charts.html",(err,data)=>{
    connections.forEach(connection=>connection.send(data.toString()));
  })
  // connections.forEach()
  // console.log(`event type is: ${eventType}`);
  // if (filename) {
  //   console.log(`filename provided: ${filename}`);
  // } else {
  //   console.log('filename not provided');
  // }
});