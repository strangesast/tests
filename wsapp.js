var WebSocketServer = require('ws').Server;
var parse = JSON.parse;
var stringify = JSON.stringify;

var senderFactory = function(ws) {
  return function(data) {
    return new Promise(function(resolve, reject) {
      ws.send(stringify(data), function(err) {
        if(err) return reject(err);
        return resolve();
      });
    });
  };
};

module.exports = function(server) {
  var wss = new WebSocketServer({server: server});
  wss.on('connection', function(ws) {
    var sender = senderFactory(ws);

    ws.on('message', function(message) {
      var data = parse(message);
      var id = data.id; // request id
      // do something
      setTimeout(function() {
        sender({
          id: id,
          result: {
            message: 'ok',
            complete: true
          },
          sent: data
        });
      }, 1000);
    });

    ws.on('close', function() {

    });
  });
};
