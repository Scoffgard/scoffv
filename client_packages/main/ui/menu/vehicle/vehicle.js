const { registerPage, registerOption } = require('main/systems/browser.js');
const { registerEngineSoundPage } = require('main/ui/menu/vehicle/engineSound.js');
const { registerSpawnVehiclePage } = require('main/ui/menu/vehicle/spawn.js');

exports.registerVehiclePage = async function registerVehiclePage() {
  const pageTitle = '🚗 Vehicles';
  await registerPage('vehicles', pageTitle);
  registerOption('link', 'home', pageTitle, null, { route: 'vehicles'})

  await registerSpawnVehiclePage();

  await registerEngineSoundPage();
}