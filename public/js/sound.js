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

oscillator.start();
setTimeout(function() {
  oscillator.stop();
}, 1000);
