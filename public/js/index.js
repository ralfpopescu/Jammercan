var socket = io();
var messages = $('#messages');

socket.emit('message', 'hello what\'s up');
socket.on('message', function(msgData) {
  var msg = msgData.message;
  var id = msgData.id;
  messages.append('<li>' + id + ': ' + msg + '</li>')
});
