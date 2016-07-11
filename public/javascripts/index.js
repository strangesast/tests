// {
//   id : {
//     expires: <Date>,
//     progress: <func>,
//     callback: <func>
//   }
// }


// message, location, method, header
// params = {method:, header:}

var Messenger = {
  lastid: 0,
  queue: {},
  pendingTimeout: null,
  init: function(ob, transport) {
    var _this = this;
    ob.addEventListener('message', function(e) {
      _this.receive(JSON.parse(e.data));
    });
    this.transport = transport || {
      send: function(stuff) {
        ob.send(JSON.stringify(stuff));
      }
    }
  },
  send: function(message, path, params, progress, timeout) {
    var _this = this;
    var id = _this.lastid++;
    var expires = timeout != null ? Date.now() + timeout : undefined;
    var method = (params && params.method != null) ? params.method : undefined;
    console.log('expires: ' + expires);
    return new Promise(function(resolve, reject) {
      _this.queue[id] = {callback: resolve, progress: progress, expires: expires};
      // might also be useful to send expires to server
      _this.transport.send({data: message, path: path, method: method, id: id});
      _this.updateTimeout();
    });
  },
  // set new setTimeout for timeout
  updateTimeout: function() {
    clearTimeout(this.pendingTimeout);
    var _this = this;
    var ids = Object.keys(this.queue);
    var timeouts = ids.map((a)=>isNaN(_this.queue[a].expires) ? Infinity : _this.queue[a].expires-Date.now());
    var min = Math.min.apply(null, timeouts);
    if(min < Infinity) {
      var i = timeouts.indexOf(min);
      var cb = this.queue[i].callback;
      this.pendingTimeout = setTimeout(function() {
        cb(Promise.reject('timeout reached'));
        delete _this.queue[i];
        _this.updateTimeout();
      }, Math.max(min, 0));
    }
  },
  receive: function(resp) {
    if(this.queue.hasOwnProperty(resp.id)) {
      var ob = this.queue[resp.id];
      if(resp.complete) {
        ob.callback(Promise.resolve(resp.data));
        delete this.queue[resp.id]; // done, remove from queue
        this.updateTimeout();

      } else {
        if(typeof ob.progress == 'function') ob.progress(Promise.resolve(resp.data));
      }

    } else {
      console.warn('id (' + resp.id + ') already removed from queue or was never there');
    }
  },
  transport: null
};

var m = Object.create(Messenger);
var url = 'ws:' + window.location.origin.slice(window.location.protocol.length);
socket = new WebSocket(url);
socket.addEventListener('open', function() {
  console.log('connected at ' + url);
  m.init(socket);
  // this will occasionally fail
  m.send({message: 'hello!'}, null, {}, null, 1020).then(function(response) {
    console.log('response');
    console.log(response)
  }).catch(function(err) {
    console.warn(err);
  });
});

/*
var m2 = Object.create(Messenger);
m2.init(worker.port, function(ob, transport) {
  var _this = this;
  ob.addEventListener('message', function(e) {
    _this.receive(JSON.parse(e.data));
  });
  ob.start();
  this.transport = transport || {
    send: ob.postMessage
  }
});

var worker = new SharedWorker('javascripts/echoworker.js');
worker.port.addEventListener('message', function(e) {
  console.log(e.data);
});
worker.port.start();
*/
