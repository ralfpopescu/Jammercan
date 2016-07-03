var socket = io();
var keysPressed = {};
var localKeysPressed = {};
var socketId;

socket.on('setup', function(data) {
  socketId = data.socketId;
});

socket.on('startnote', function(data) {
  if (!keysPressed[data.note]) {
    keysPressed[data.note] = {};
  }
  keysPressed[data.note][data.socketId] = getAudioBuffer(data.note, currentInstrumentBuffers);
  keysPressed[data.note][data.socketId].start();
});

socket.on('stopnote', function(data) {
  if (keysPressed[data.note]) {
    keysPressed[data.note][data.socketId].stop();
    delete keysPressed[data.note][data.socketId];
  }
});

addEventListener('keydown', function (e) {
  e.preventDefault();
  var note = keyboardNoteMap[e.keyCode];
  if (note) {
    if (!localKeysPressed[note]) {
      socket.emit('keydown', { socketId: socketId, note: note });
    }
    localKeysPressed[note] = 1;
  }
});

addEventListener('keyup', function (e) {
  var note = keyboardNoteMap[e.keyCode];
  if (note) {
    socket.emit('keyup', { socketId: socketId, note: note });
    delete localKeysPressed[note];
  }
});

function midiKeyDown(key) {
  var note = midiNoteMap[key];
  if (!localKeysPressed[note]) {
    socket.emit('keydown', { socketId: socketId, note: note });
  }
  localKeysPressed[note] = 1;
}

function midiKeyUp(key) {
  var note = midiNoteMap[key];
  if (note) {
    socket.emit('keyup', { socketId: socketId, note: note });
    delete localKeysPressed[note];
  }
}
