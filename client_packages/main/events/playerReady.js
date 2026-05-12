const { registerMenuPages } = require('main/ui/menu/index.js');
const { registerBrowser } = require('main/systems/browser.js');

mp.events.add('playerReady', async () => {
  const player = mp.players.local;
  player.data = {};

  mp.gui.chat.activate(false);

  await registerBrowser();
  if (!mp.storage.data.connection || !(await mp.events.callRemoteProc('auth:tryQuickAuth', mp.storage.data.connection.token, mp.storage.data.connection.id))) {
    player.data.lockControls = true;
    mp.gui.cursor.show(true, true);
    player.data.browser.call('browser:login:setState', true);
    if (mp.storage.data.connection) delete mp.storage.data.connection;  
  }

  // Applying config stored for speedometer (if exists)
  if (mp.storage.data.speedoMode) player.data.browser.call('browser:speedo:setMode', mp.storage.data.speedoMode);
  if (mp.storage.data.speedoDesign) player.data.browser.call('browser:speedo:setDesign', mp.storage.data.speedoDesign);

  await registerMenuPages();
});