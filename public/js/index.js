var socket = io();
socket.emit('message', 'hello whats up');
socket.on('message', function(msg) {
  var messages = document.getElementById('messages');
  var newMessage = document.createTextNode(msg);
  messages.appendChild(newMessage);
});
