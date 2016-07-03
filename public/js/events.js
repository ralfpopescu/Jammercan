var socket = io();
var keysPressed = {};
var localKeysPressed = {};
var socketId;
var eventTriggeredByServer = false;

socket.on('setup', function(data) {
  socketId = data.socketId;
});

socket.on('startnote', function(data) {
  if (!keysPressed[data.note]) {
    keysPressed[data.note] = {};
  }
  keysPressed[data.note][data.id] = getAudioBuffer(data.note, currentInstrumentBuffers);
  keysPressed[data.note][data.id].start();
});

socket.on('stopnote', function(data) {
  if (keysPressed[data.note]) {
    keysPressed[data.note][data.id].stop();
    delete keysPressed[data.note][data.id];
  }
});

socket.on('startloop', function(data) {
  eventTriggeredByServer = true;
  $('#' + data.loopname).prop('checked', true);
});
socket.on('stoploop', function(data) {
  eventTriggeredByServer = true;
  $('#' + data.loopname).prop('checked', false);
});

addEventListener('keydown', function (e) {
  e.preventDefault();
  var note = keyboardNoteMap[e.keyCode];
  if (note) {
    if (!localKeysPressed[note]) {
      socket.emit('startnote', { id: socketId, note: note });
    }
    localKeysPressed[note] = 1;
  }
});

addEventListener('keyup', function (e) {
  var note = keyboardNoteMap[e.keyCode];
  if (note) {
    socket.emit('stopnote', { id: socketId, note: note });
    delete localKeysPressed[note];
  }
});

function midiKeyDown(key) {
  var note = midiNoteMap[key];
  if (!localKeysPressed[note]) {
    socket.emit('startnote', { id: socketId, note: note });
  }
  localKeysPressed[note] = 1;
}

function midiKeyUp(key) {
  var note = midiNoteMap[key];
  if (note) {
    socket.emit('stopnote', { id: socketId, note: note });
    delete localKeysPressed[note];
  }
}
