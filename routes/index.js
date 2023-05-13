var express = require('express');
const db = require('../database');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.body)
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = new Date().toISOString();
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress 
  db.insert(name, email, comment, date, ip);

  res.redirect('/');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

module.exports = router;
