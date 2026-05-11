const { registerPage, registerOption } = require('main/systems/browser.js');
const { registerSpeedometerPage } = require('main/ui/menu/config/speedometer.js');

exports.registerConfigPage = async function registerConfigPage() {
  const pageTitle = '⚙️ Config';
  await registerPage('config', pageTitle);
  registerOption('link', 'home', pageTitle, null, { route: 'config'});

  await registerSpeedometerPage();
}