var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index', {title: 'Jammercan'});
});

var connections = [];

io.on('connection', function(socket){
  connections.push(socket);
  console.log(connections.length);
  socket.on('disconnect', function(){
    console.log('user disconnected');
    var i = connections.indexOf(socket);
    if (i > -1) {
      connections.splice(i, 1);
    }
    console.log(connections.length);
  });

  socket.on('message', function(msg) {
    console.log('received message');
    console.log(msg);
    connections.forEach(function(s) {
      s.emit('message', msg);
    });
  });
});

http.listen(process.env.PORT || 3000;, function(){
  console.log('listening on *:3000');
});
