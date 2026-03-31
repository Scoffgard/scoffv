const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerPaintJobPage = async function registerPaintJobPage(rId) {
  const pageTitle = 'Paintjob';
  const route = `vehicles/paintjob-${rId}`;
  await registerPage(route, pageTitle);

  const baseVehicleColorPrimary = (await mp.events.callRemoteProc('vehicle:getColorRGB', rId, 0)) || {r: 0, g: 0, b: 0};
  registerOption('color', route, 'Primary Color RGB', (val) => {
    mp.events.callRemote('vehicle:setColorRGB', rId, val, 0);
  }, { value: baseVehicleColorPrimary });

  const baseVehicleColorSecondary = (await mp.events.callRemoteProc('vehicle:getColorRGB', rId, 1)) || {r: 0, g: 0, b: 0};
  registerOption('color', route, 'Secondary Color RGB', (val) => {
    mp.events.callRemote('vehicle:setColorRGB', rId, val, 1);
  }, { value: baseVehicleColorSecondary });
}