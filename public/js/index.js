var socket = io();
socket.emit('message', 'hello whats up');
socket.on('message', function(msg) {
  var messages = $('#messages');
  messages.append('<li>' + msg + '</li>')
});
