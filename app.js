var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

var connections = {};
var numConnections = 0;

io.on('connection', function(socket) {
  connections[socket.id] = socket;
  numConnections ++;
  socket.emit('setup', { socketId: socket.id });

  console.log('user connected');
  console.log(numConnections + ' users connected');

  socket.on('disconnect', function(){
    delete connections[socket.id];
    numConnections --;

    console.log('user disconnected');
    console.log(numConnections + ' users connected');
  });

  socket.on('keyup', function(data) {
    emitAll('stopnote', data);
  });

  socket.on('keydown', function(data) {
    emitAll('startnote', data);
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});

function emitAll(eventType, data) {
  for (socketId in connections) {
    if (connections.hasOwnProperty(socketId)) {
      connections[socketId].emit(eventType, data)
    }
  }
}
