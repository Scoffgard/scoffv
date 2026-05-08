const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerExtrasPage = async function registerExtrasPage(rId) {
  const pageTitle = 'Extras';
  const route = `vehicles/extras-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);
  const vehicleAsData = vehicle.data && vehicle.data.preset;

  const extras = [];
  for (let i = 0; i <= 16; i++) {
    if (vehicle.doesExtraExist(i)) extras.push(i);
  }

  for (let extraId of extras) {
    registerOption('checkbox', route, `Extra #${extraId}`, (val) => {
      vehicle.setExtra(extraId, val);
      if (vehicle.data && vehicle.data.preset) {
        if (!vehicle.data.preset.extras) vehicle.data.preset.extras = {};
        vehicle.data.preset.extras[extraId] = val;
      }
    }, { value: vehicleAsData && vehicle.data.preset.extras && vehicle.data.preset.extras[extraId] != undefined ? vehicle.data.preset.extras[extraId] : vehicle.isExtraTurnedOn(extraId) })
  }
}