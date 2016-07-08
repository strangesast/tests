var connections = [];
var objects = [];

var xhr = function(url, method, data) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = function() {
      return resolve(req);
    };
    req.onerror = function(e) {
      return reject(e);
    };
    req.send(data);
  });
};

self.addEventListener('connect', function(e) {
  var port = e.ports[0];

  console.log({objects: objects});
  port.postMessage({objects: objects});

  port.addEventListener('message', function(e) {
    var prom;
    if(e.data.hasOwnProperty('new')){
      var newObject = e.data['new'];
      prom = xhr('/', 'post', data);
    }
    prom.then(function(result) {
      port.postMessage({result: result});
    }).catch(function(err) {
      port.postMessage({error: err, result: null});
    });
  });
  port.start();
});
