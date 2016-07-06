var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

var count = 0;
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Express' });
});
router.post('/', upload.single(), function(req, res, next) {
  var ob = req.body;
  ob._id = count++;
  return res.json(ob);
});

module.exports = router;
