const { registerPage, registerOption } = require('main/systems/browser.js');

exports.registerNeonLightsPage = async function registerNeonLightsPage(rId) {
  const pageTitle = 'Neon & Lights';
  const route = `vehicles/neonlights-${rId}`;
  await registerPage(route, pageTitle);

  const vehicle = mp.vehicles.atRemoteId(rId);

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
    }
  }, { value: neonEnabled })

  const baseNeonColor = vehicle.getNeonLightsColour(1, 1, 1) || {r: 0, g: 0, b: 0};
  registerOption('color', route, 'Neon Color', (val) => {
    const rgb = JSON.parse(val);
    vehicle.setNeonLightsColour(rgb.r, rgb.g, rgb.b);
  }, { value: baseNeonColor });

  registerOption('number', route, 'Lights Color', (val) => {
    if (mp.game.vehicle.getXenonLightsColor(vehicle.handle) === 255)
      mp.events.callRemote('vehicle:setMod', vehicle.remoteId, 22, 1);
    mp.game.vehicle.setXenonLightsColor(vehicle.handle, val);
  }, {
    min: 0,
    max: 12,
    value: mp.game.vehicle.getXenonLightsColor(vehicle.handle) == 255 ? 0 : mp.game.vehicle.getXenonLightsColor(vehicle.handle),
  });

  registerOption('number', route, 'Lights Multiplier', (val) => {
    vehicle.setLightMultiplier(val);
  }, {
    min: 0,
    max: 10,
    step: 0.1,
    value: 1,
  });
}