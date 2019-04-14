var WebSocketServer = require("websocket").server;
var http = require("http");
var ghpages = require("gh-pages");

const { fork } = require("child_process");

class DevPipeServer {
  constructor(port, buildPath, buildWith) {
    var server = http.createServer(function(request, response) {
      // process HTTP request. Since we're writing just WebSockets
      // server we don't have to implement anything.
    });
    server.listen(port, function() {
      console.log("new connection");
    });

    let wsServer = new WebSocketServer({
      httpServer: server
    });

    this.clientConnections = [];

    wsServer.on("request", request => {
      console.log(`new connection from ${request.origin}`);
      var connection = request.accept(null, request.origin);
      this.clientConnections.push(connection);
      connection.send(
        JSON.stringify({
          html: this.html || "<h1>I Dont Have Any HTML Yet</h1>",
          type: "new-view"
        })
      );
      connection.on("message", message => {
        try {
          let { type, homepage, frameName } = JSON.parse(message.utf8Data);
          if (type !== "publish") return;
          console.log(`starting build, expecting output at ${buildPath}`);
          fork(buildWith.script, [], {
            cwd: buildWith.workingDir,
            env: { PUBLIC_URL: `${homepage}/${frameName}/` }
          }).on("close", code => {
            if (code !== 0) {
              console.log("error with build");
              return;
            }
            console.log("build finshed");
            console.log(`publishing ${buildPath} to ${homepage}/${frameName}`);
            ghpages.publish(buildPath, { dest: frameName }, function(err) {
              if (err) console.log(err);
              console.log(
                "publish done, it might take a little while before your app is fully updated"
              );
            });
          });
        } catch (error) {
          console.log(error);
        }
      });
      connection.on("close", function(connection) {
        console.log("connection closed");
      });
    });
  }

  publishHtml(html) {
    this.html = html;
    this.clientConnections.forEach(connection =>
      connection.send(
        JSON.stringify({
          type: "new-view",
          html: html
        })
      )
    );
  }
}

class FrameGodWebpackPlugin {
  constructor({ buildPath, devPipePort, webpackPort, buildWith, isDev }) {
    this.isDev = isDev;
    this.webpackPort = webpackPort;
    this.devPipeServer = isDev
      ? new DevPipeServer(devPipePort || 9000, buildPath, buildWith)
      : { publishHtml: function() {} };
  }
  apply(compiler) {
    let { webpackPort, devPipeServer, isDev } = this;
    if (isDev)
      compiler.hooks.done.tap("FrameGodWebpackPlugin", stats => {
        devPipeServer.publishHtml(
          `<script>window.location.href = "http://127.0.0.1:${webpackPort}";</script>`
        );
      });
  }
}

module.exports = FrameGodWebpackPlugin;