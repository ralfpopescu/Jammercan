var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index', {title: 'Jam Circle'});
});

var connections = {};
var connectionIds = [];

io.on('connection', function(socket){
  var newId = socket.id;
  connections[newId] = {
    socket: socket,
    keysPressed: {}
  };
  connectionIds.push(newId);
  console.log('user connected');
  console.log(connectionIds.length + ' users connected');

  socket.on('disconnect', function(){
    var i = connectionIds.indexOf(socket.id);
    if (i > -1) {
      connectionIds.splice(i, 1);
    }
    delete connections[newId];
    console.log('user disconnected');
    console.log(connectionIds.length + ' users connected');
  });

  socket.on('message', function(msg) {
    emitAll('message', {id: socket.id, message: msg});
  });

  socket.on('keydown', function(keyCode) {
    var id = socket.id;
    connections[id].keysPressed[keyCode] = true;
    var keysPressed = connections[id].keysPressed;
    emitAll('keysUpdated', {id: id, keysPressed: keysPressed});
  });

  socket.on('keyup', function(keyCode) {
    var id = socket.id;
    delete connections[id].keysPressed[keyCode];
    var keysPressed = connections[id].keysPressed;
    emitAll('keysUpdated', {id: id, keysPressed: keysPressed});
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

function emitAll(type, data) {
  connectionIds.forEach(function(id) {
    connections[id].socket.emit(type, data);
  });
}
