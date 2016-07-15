var formToObject = function(form) {
  var fd = new FormData(form);
  var ob = {};
  for(var elems of fd.entries()) {
    ob[elems[0]] = elems[1];
  }
  return ob;
};
// hijack submit
var forms = document.getElementsByTagName('form');
for(var i=0,form; form = forms[i], i < forms.length; i++) {
  form.addEventListener('submit', function(e) {
    if(e.preventDefault) e.preventDefault();
    var ob = formToObject(this);
    console.log(ob);
    return false;
  });
}


const SOCKET_URL = 'ws:' + window.location.origin.slice(window.location.protocol.length);

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

// should test this
workerMessenger.send({'data': 'hellooooooo1'}).then(function(response) {
  console.log('worker response');
  console.log(response);
});

workerMessenger.send({url: SOCKET_URL}, '/sockets/connect', {method: 'GET'}).then(function(response) {
  console.log('connection response...');
  console.log(response);

  //workerMessenger.send({
  //});
});
