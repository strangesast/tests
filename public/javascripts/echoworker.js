self.importScripts('/javascripts/Messenger.js');

var ports = [];

var socketMessenger = null;

var connect = function(url) {
  if(socketMessenger != null) return Promise.reject('already connected');

  var m = new Messenger();
  socket = new WebSocket(url);

  return new Promise(function(resolve, reject) {
    socket.addEventListener('open', function() {
      console.log('connected at ' + url);
      m.init(socket);
      // this will occasionally fail
      return resolve(m);
    });
    socket.onerror = function(err) {
      return reject(err);
    };
  });
}

self.addEventListener('connect', function(evt) {
  var port = evt.ports[0];

  port.addEventListener('message', function(evt) {
    var data = evt.data;
    var path = data.path;
    var id = data.id;

    var method = data.method;
    var data = data.data; // uugly

    var ob = {}
    ob.id = id;
    ob.data = {};
    ob.complete = false;
    ob.send = data;

    var prom = Promise.resolve();
    switch(path) {
      case '/sockets/connect':
        prom = connect(data.url).then(function(m) {
          socketMessenger = m;
          ob.data = {result: 'ok'};
          ob.complete = true;
        }).catch(function(err) {
          ob.data = {error: err};
          ob.complete = true;
        });;
        break;

      default:
        ob.complete = true;
        ob.data = {error: 'unknown action'};
    }

    prom.then(function(result) {
      port.postMessage(ob);

    });
  });

  port.start();
});
