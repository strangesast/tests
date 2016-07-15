var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

var data = {};
data.count = 0;

router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Express' });
});
router.post('/', upload.single(), function(req, res, next) {
  var ob = req.body;
  ob._id = data.count++;
  return res.json(ob);
});

router.post('/data/:object', upload.single(), function(req, res, next) {
  var object = req.params.object;

  return res.json(object);
});

module.exports = router;
