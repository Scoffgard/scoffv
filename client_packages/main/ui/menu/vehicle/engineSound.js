const { vehicleData } = require('main/consts/vehicleData.js');
const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerEngineSoundPage = async function registerEngineSoundPage() {
  const pageTitle = 'Engine Sound';
  const route = 'vehicles/enginesound';
  await registerPage(route, pageTitle);

  for (let vehData of vehicleData) {
    await registerOption('button', route, vehData.name, () => {
      const currentVehicleRId = mp.players.local.data.menuSelectedVehicleRId;
      if (currentVehicleRId == undefined) return;
      const vehicle = mp.vehicles.atRemoteId(currentVehicleRId);
      mp.game.audio.forceVehicleEngine(vehicle.handle, vehData.spawnname);
    });
  }
}