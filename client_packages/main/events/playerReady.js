const { registerMenuPages } = require('main/ui/menu/index.js');
const { registerBrowser } = require('main/systems/browser.js');

mp.events.add('playerSpawn', async () => {
  const player = mp.players.local;
  player.data = {};

  mp.gui.chat.activate(false);

  await registerBrowser();
  player.data.lockControls = true;
  mp.gui.cursor.show(true, true);

  // Applying config stored for speedometer (if exists)
  if (mp.storage.data.speedoMode) player.data.browser.call('browser:speedo:setMode', mp.storage.data.speedoMode);
  if (mp.storage.data.speedoDesign) player.data.browser.call('browser:speedo:setDesign', mp.storage.data.speedoDesign);

  await registerMenuPages();
});