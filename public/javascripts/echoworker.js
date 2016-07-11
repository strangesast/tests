var ports = [];

self.addEventListener('connect', function(evt) {
  var port = evt.ports[0];

  port.addEventListener('message', function(evt) {
    var data = evt.data;
    var id = data.id;

    port.postMessage({
      id: id,
      data: {
        message: 'ok'
      },
      complete: true,
      sent: data
    });
  });

  port.start();
});
