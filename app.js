var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index', {title: 'Jammercan'});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
