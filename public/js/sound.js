var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
var volume = 0.2;
var frequency = 3000;

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

oscillator.type = 'sine';
oscillator.frequency.value = frequency;
gainNode.gain.value = volume;

var currentInstrumentBuffers = {};
$.ajax({url: '/js/soundfonts/acoustic_grand_piano.json', success: function(result) {
  setupInstrument(result);
}});

function setupInstrument(instrument) {
  currentInstrumentBuffers = {};
  for (var key in instrument) {
    addNoteToBuffer(key, instrument, currentInstrumentBuffers);
  }
}

function addNoteToBuffer(key, instrumentData, instrumentBuffers) {
  var noteBuffer = base64ToArrayBuffer(instrumentData[key]);
  audioCtx.decodeAudioData(noteBuffer, function(buffer) {
    instrumentBuffers[key] = buffer;
    if (Object.keys(instrumentData).length === Object.keys(instrumentBuffers).length) {
    }
  });
}

function getAudioBuffer(key, instrumentBuffers) {
  var sound = audioCtx.createBufferSource();
  sound.buffer = instrumentBuffers[key];
  sound.connect(audioCtx.destination);
  return sound;
}

function base64ToArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
