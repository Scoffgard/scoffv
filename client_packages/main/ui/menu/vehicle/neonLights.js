const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerNeonLightsPage = async function registerNeonLightsPage(rId) {
  const pageTitle = 'Neon & Lights';
  const route = `vehicles/neonlights-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);
  const vehicleAsData = vehicle.data && vehicle.data.preset;

  let neonEnabled = false;
  for (let i = 0; i < 4; i++) {
    if (vehicle.isNeonLightEnabled(i)) {
      neonEnabled = true;
      break;
    }
  }

  registerOption('checkbox', route, 'Neon', (val) => {
    for (let i = 0; i < 4; i++) {
      vehicle.setNeonLightEnabled(i, val);
      if (vehicle.data && vehicle.data.preset) vehicle.data.preset.neonEnabled = val;
    }
  }, { value: vehicleAsData && vehicle.data.preset.neonEnabled ? vehicle.data.preset.neonEnabled : neonEnabled })

  const baseNeonColor = vehicle.getNeonLightsColour(1, 1, 1) || {r: 0, g: 0, b: 0};
  registerOption('color', route, 'Neon Color', (val) => {
    const rgb = JSON.parse(val);
    vehicle.setNeonLightsColour(rgb.r, rgb.g, rgb.b);
    if (vehicle.data && vehicle.data.preset) vehicle.data.preset.neonColor = rgb;
  }, { value: vehicleAsData && vehicle.data.preset.neonColor ? vehicle.data.preset.neonColor : baseNeonColor });

  registerOption('number', route, 'Lights Color', (val) => {
    if (mp.game.vehicle.getXenonLightsColor(vehicle.handle) === 255)
      mp.events.callRemote('vehicle:setMod', vehicle.remoteId, 22, 1);
    mp.game.vehicle.setXenonLightsColor(vehicle.handle, val);
    if (vehicle.data && vehicle.data.preset) vehicle.data.preset.lightColor = val;
  }, {
    min: 0,
    max: 12,
    value: vehicleAsData && vehicle.data.preset.lightColor ? vehicle.data.preset.lightColor : (mp.game.vehicle.getXenonLightsColor(vehicle.handle) == 255 ? 0 : mp.game.vehicle.getXenonLightsColor(vehicle.handle)),
  });

  registerOption('number', route, 'Lights Multiplier', (val) => {
    vehicle.setLightMultiplier(val);
    if (vehicle.data && vehicle.data.preset) vehicle.data.preset.lightMult = val;
  }, {
    min: 0,
    max: 10,
    step: 0.1,
    value: vehicleAsData && vehicle.data.preset.lightMult ? Math.round(vehicle.data.preset.lightMult * 10) / 10 : 1,
  });
}