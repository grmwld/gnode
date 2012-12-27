/**
 * Home page
 */

var express = require('express');
var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('view');
});
