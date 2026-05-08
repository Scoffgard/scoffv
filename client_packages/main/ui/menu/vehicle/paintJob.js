const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerPaintJobPage = async function registerPaintJobPage(rId) {
  const pageTitle = 'Paintjob';
  const route = `vehicles/paintjob-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);
  const vehicleAsData = vehicle.data && vehicle.data.preset;

  const defaultColor = JSON.stringify({r: 0, g: 0, b: 0});

  const baseVehicleColorPrimary = JSON.parse((await mp.events.callRemoteProc('vehicle:getColorRGB', rId, 0)) || defaultColor);
  registerOption('color', route, 'Primary Color RGB', (val) => {
    mp.events.callRemote('vehicle:setColorRGB', rId, val, 0);
    if (vehicle.data && vehicle.data.preset) vehicle.data.preset.primPaint = val;
  }, { value: vehicleAsData && vehicle.data.preset.primPaint ? JSON.parse(vehicle.data.preset.primPaint) : baseVehicleColorPrimary });

  const baseVehicleColorSecondary = JSON.parse((await mp.events.callRemoteProc('vehicle:getColorRGB', rId, 1)) || defaultColor);
  registerOption('color', route, 'Secondary Color RGB', (val) => {
    mp.events.callRemote('vehicle:setColorRGB', rId, val, 1);
    if (vehicle.data && vehicle.data.preset) vehicle.data.preset.secPaint = val;
  }, { value: vehicleAsData && vehicle.data.preset.secPaint ? JSON.parse(vehicle.data.preset.secPaint) : baseVehicleColorSecondary });
}