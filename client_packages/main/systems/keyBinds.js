// KEYS LIST : https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
const keys = [];

for (let key of keys) {
  mp.keys.bind(key.code, true, key.callback);
}