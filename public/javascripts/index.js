// {
//   id : {
//     expires: <Date>,
//     progress: <func>,
//     callback: <func>
//   }
// }


// message, location, method, header
// params = {method:, header:}

var Messenger = (function() {
  var Messenger = function () {
    this.queue = {};
    this.pendingTimeout = null;
    this.transport = null;
  };
  var lastid = 0;
  Messenger.prototype.init = function(ob, transport) {
    var _this = this;
    ob.addEventListener('message', function(e) {
      _this.transport.receive(e);
    });
    this.transport = transport || {
      send: function(stuff) {
        ob.send(JSON.stringify(stuff));
      },
      receive: function(e) {
        _this.receive(JSON.parse(e.data));
      }
    }
  };
  Messenger.prototype.send = function(message, path, params, progress, timeout) {
    var _this = this;
    var id = lastid++;
    var expires = timeout != null ? Date.now() + timeout : undefined;
    var method = (params && params.method != null) ? params.method : undefined;
    return new Promise(function(resolve, reject) {
      _this.queue[id] = {callback: resolve, progress: progress, expires: expires};
      // might also be useful to send expires to server
      _this.transport.send({data: message, path: path, method: method, id: id});
      _this.updateTimeout();
    });
  };
  Messenger.prototype.updateTimeout = function() { // set new setTimeout for timeout
    clearTimeout(this.pendingTimeout);
    var _this = this;
    var ids = Object.keys(this.queue).map((e)=>Number(e));
    var timeouts = ids.map((a)=>isNaN(_this.queue[a].expires) ? Infinity : _this.queue[a].expires-Date.now());
    var min = Math.min.apply(null, timeouts);
    if(min < Infinity) {
      var i = ids[timeouts.indexOf(min)];
      var cb = this.queue[i].callback;
      this.pendingTimeout = setTimeout(function() {
        cb(Promise.reject('timeout reached'));
        delete _this.queue[i];
        _this.updateTimeout();
      }, Math.max(min, 0));
    }
  };
  Messenger.prototype.receive = function(resp) {
    if(this.queue.hasOwnProperty(resp.id)) {
      var ob = this.queue[resp.id];
      if(resp.complete) {
        ob.callback(Promise.resolve(resp.data));
        delete this.queue[resp.id]; // done, remove from queue
        this.updateTimeout();
  
      } else {
        // incomplete, it's a progress call (hopefully)
        if(typeof ob.progress == 'function') ob.progress(Promise.resolve(resp.data));
      }
  
    } else {
      console.warn('id (' + resp.id + ') already removed from queue or was never there');
    }
  };

  return Messenger;
})();

var socketMessenger = new Messenger();

var url = 'ws:' + window.location.origin.slice(window.location.protocol.length);
socket = new WebSocket(url);
socket.addEventListener('open', function() {
  console.log('connected at ' + url);
  socketMessenger.init(socket);
  // this will occasionally fail
  socketMessenger.send({message: 'hello!'}, null, {}, null, 1020).then(function(response) {
    console.log('socket response');
    console.log(response)
  }).catch(function(err) {
    console.warn(err);
  });
});

var worker = new SharedWorker('javascripts/echoworker.js');
worker.port.start(); // required
var workerMessenger = new Messenger();

workerMessenger.init(worker.port, {
  send: function(stuff) {
    worker.port.postMessage(stuff);
  },
  receive: function(e) {
    workerMessenger.receive(e.data);
  }
});
workerMessenger.send({'data': 'hellooooooo1'}).then(function(response) {
  console.log('worker response');
  console.log(response);
});
