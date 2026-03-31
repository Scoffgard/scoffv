const { registerMenuPages } = require('main/ui/menu/index.js');
const { registerBrowser } = require('main/systems/browser.js');

mp.events.add('playerSpawn', async () => {
  mp.players.local.data = {};

  mp.gui.chat.activate(false);

  await registerBrowser();
  mp.players.local.data.lockControls = true;
  mp.gui.cursor.show(true, true);

  await registerMenuPages();
});