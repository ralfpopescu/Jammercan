var midiAccess;
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDIInit);
}

function onMIDIInit(midi) {
  midiAccess = midi;
  hookUpMIDIInput();
  midiAccess.onstatechange = hookUpMIDIInput;
}

function hookUpMIDIInput() {
  var inputs = midiAccess.inputs.values();
  midiAccess.inputs.forEach(function(entry) {
    entry.onmidimessage = MIDIMessageEventHandler;
  });
}

function MIDIMessageEventHandler(event) {
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2] != 0) {
        midiKeyDown(event.data[1]);
        return;
      }
    case 0x80:
      midiKeyUp(event.data[1]);
      return;
  }
}
