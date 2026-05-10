const { toggleNoClip, registerInput } = require("main/systems/noClip.js");

// KEYS LIST : https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
const keys = [
  {
    code: 0x71, // F2
    callback: toggleNoClip,
  },
];

const noClipInputs = [
  0x20, // Spacebar 
  0xA2, // Left Control 
  0x5A, // Z key 
  0x51, // Q key 
  0x53, // S key 
  0x44, // D key 
  0xA0, // Left Shift
];

for (let input of noClipInputs) {
  keys.push({
    code: input,
    callback: () => registerInput(input, true),
    onUp: () => registerInput(input, false),
  })
}

for (let key of keys) {
  mp.keys.bind(key.code, true, key.callback);
  if (key.onUp) mp.keys.bind(key.code, false, key.onUp)
}