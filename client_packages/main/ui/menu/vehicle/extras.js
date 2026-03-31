const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerExtrasPage = async function registerExtrasPage(rId) {
  const pageTitle = 'Extras';
  const route = `vehicles/extras-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);

  const extras = [];
  for (let i = 0; i <= 16; i++) {
    if (vehicle.doesExtraExist(i)) extras.push(i);
  }

  for (let extraId of extras) {
    registerOption('checkbox', route, `Extra #${extraId}`, (val) => {
      vehicle.setExtra(extraId, val);
    }, { value: vehicle.isExtraTurnedOn(extraId) })
  }
}