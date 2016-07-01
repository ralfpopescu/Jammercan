var socket = io();
var keysPressed = {};
var localKeysPressed = {};
var socketId;

socket.on('setup', function(data) {
  socketId = data.socketId;
});

socket.on('start', function(data) {
  if (noteMap[data.keyCode]) {
    if (!keysPressed[data.keyCode]) {
      keysPressed[data.keyCode] = {};
    }

    keysPressed[data.keyCode][data.socketId] = getAudioBuffer(noteMap[data.keyCode], currentInstrumentBuffers);
    keysPressed[data.keyCode][data.socketId].start();
    console.log('started ' + data.keyCode);
  }
});

socket.on('stop', function(data) {
  if (keysPressed[data.keyCode]) {
    keysPressed[data.keyCode][data.socketId].stop();
    delete keysPressed[data.keyCode];
    console.log('stopped ' + data.keyCode);
  }
});

addEventListener('keydown', function (e) {
  e.preventDefault();
  if (!localKeysPressed[e.keyCode]) {
    socket.emit('keydown', { socketId: socketId, keyCode: e.keyCode });
  }

  localKeysPressed[e.keyCode] = 1;
});

addEventListener('keyup', function (e) {
  socket.emit('keyup', { socketId: socketId, keyCode: e.keyCode });
  delete localKeysPressed[e.keyCode];
});
