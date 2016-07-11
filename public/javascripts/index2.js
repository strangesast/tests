//const SOCKURL = 'ws:' + window.location.origin.slice(window.location.protocol.length) + '/sockets';
//var socket = new WebSocket(SOCKURL);

var lastid = 0;
var queue = {};
var timeoutRequest;

// ~= socket.send || worker.postMessage
var send = function(data) {
  setTimeout(function() {
    setInterval(function() {
      receive({
        message: {
          received: data,
          result: 'ok'
        },
        complete: false,
        id: data.id
      });
    }, 100);
  }, 2000);
};

// ~= socket.onmessage || worker.onmessage
var receive = function(data) {
  var id = data.id;
  // hopefully an unnecessary check
  if(queue.hasOwnProperty(id)) {
    if(data.complete == true) { // finished
      queue[id].callback(Promise.resolve(data.message)); // only expose 'message' to sender
      delete queue[id]; // done with it, remove it
      checkTimeout(); // it may have had a timeout

    } else { // not finished (progress)
      if(typeof queue[id].progress == 'function') queue[id].progress(Promise.resolve(data.message));
    }
  } else { // was already removed from queue, may have been timeout, finally responded
    //throw new Error('Already removed from queue');
    console.log('probably timeout');
  }
};

var checkTimeout = function() {
  // setTimeout to earliest timeout, or just clear it if there is none
  clearTimeout(timeoutRequest);
  var keys = Object.keys(queue);
  var timeouts = keys.map((i)=>queue[i].expires);
  var nextTimeout = timeouts.reduce((a, b)=>a==null ? b : (b == null ? a : Math.min(a,b)), null);
  if(nextTimeout != null) {
    console.log('nextTimeout: ');
    console.log(nextTimeout)

    timeoutRequest = setTimeout(function() {
      timeout(keys[timeouts.indexOf(nextTimeout)]);
      checkTimeout();
    }, Math.max(nextTimeout - Date.now(), 0));
  }
};

// pass promise to callbackFunc for resolve / reject
// progressFunc optional
var add = function(message, callbackFunc, progressFunc, timeoutAmt) {
  var id = lastid++;
  var expires;
  if(timeoutAmt!=null) {
    expires = Date.now() + timeoutAmt;
  }
  queue[id] = {
    callback: callbackFunc, progress: progressFunc, expires: expires, timeout: timeout
  }
  send({id: id, message: message});
  checkTimeout();
  return id;
};

cnt = 0;
var timeout = function(i) {
  cnt++
  console.log('timeout called ' + cnt);
  var message = 'timeout ' + queue[i].timeout + ' reached';
  var error = new Error(message);
  error.type = 'timeout';
  queue[i].callback(Promise.reject(error));
  delete queue[i] // remove from queue
};

var completeCallback = function(prom) {
  prom.then(function(result) {
    console.log('success');
    console.log(result);
  }, function(err) {
    console.log('error: ' + err.message);
  });
};
var progressCallback = function(prom) {
  console.log('progress');
  prom.then(function(result) {
    console.log('progress success');
  }, function(err) {
    console.log('progress error');
  });
}
setTimeout(function() {
  add('hello, world!'
  , completeCallback
  , progressCallback
  , 1000);
}, 0);
setTimeout(function() {
  add('another hello, world!'
  , completeCallback
  , progressCallback
  , 0);
}, 0);
setTimeout(function() {
  add('this one works'
  , completeCallback
  , progressCallback
  , 10000);
}, 100);
