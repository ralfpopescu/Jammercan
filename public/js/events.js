var socket = io();
var messages = $('#messages');
var keys = $('#keys');

socket.emit('message', 'hello what\'s up');
socket.on('message', function(msgData) {
  var msg = msgData.message;
  var id = msgData.id;
  messages.append('<li>' + id + ': ' + msg + '</li>')
});

socket.on('keysUpdated', function(keyData) {
  var id = keyData.id;
  var keysPressedForId = $('#keys .' + id);
  if (!keysPressedForId.length) {
    keys.append('<pre class="' + id + '"></pre>');
    keysPressedForId = $('#keys .' + id);
  }
  keysPressedForId.html(JSON.stringify(keyData, null, 2));
});

addEventListener('keydown', function (e) {
  socket.emit('keydown', e.keyCode);
});

addEventListener('keyup', function (e) {
  socket.emit('keyup', e.keyCode);
});
