mp.events.addProc('vehicle:spawn', (player, model) => {
  const vehicle = mp.vehicles.new(model, player.position, { dimension: player.dimension, numberPlate: 'SCOFFV' });

  const newVehicles = JSON.parse(player.getVariable('vehicles') || "[]");
  newVehicles.push(vehicle.id);
  player.setVariable('vehicles', JSON.stringify(newVehicles));

  return vehicle.id;
});

mp.events.addProc('vehicle:delete', (player, vehId) => {
  const vehicle = mp.vehicles.at(vehId);

  if (!vehicle) return false;

  vehicle.destroy();

  const newVehicles = JSON.parse(player.getVariable('vehicles') || "[]");
  const vehIndex = newVehicles.indexOf(vehId);
  if (vehIndex == -1) return true;
  newVehicles.splice(vehIndex, 1);
  player.setVariable('vehicles', JSON.stringify(newVehicles));

  return true;
});

mp.events.add('vehicle:repair', (player, vehId) => {
  const vehicle = mp.vehicles.at(vehId);
  vehicle.repair();
});

mp.events.add('vehicle:syncOption', (player, option, vehId, value) => {
  const vehicle = mp.vehicles.at(vehId);
  vehicle.setVariable(`option_${option}`, value);
  vehicle.streamedPlayers.forEach(p => {
    p.call('vehicle:syncOptionClient', option, vehId, value);
  });
});

mp.events.addProc('vehicle:getColorRGB', (player, vehId, colorId = 0) => {
  const vehicle = mp.vehicles.at(vehId);
  const rgb = vehicle.getColorRGB(colorId);
  if (rgb) return {r: rgb[0], g: rgb[1], b: rgb[2]};
  return false;
});

mp.events.add('vehicle:setColorRGB', (player, vehId, rgbUnparsed, colorId = 0) => {
  const vehicle = mp.vehicles.at(vehId);
  const rgb = JSON.parse(rgbUnparsed);
  const [r2, g2, b2] = vehicle.getColorRGB(colorId == 0 ? 1 : 0) || [0, 0, 0];
  if (colorId == 0) vehicle.setColorRGB(rgb.r, rgb.g, rgb.b, r2, g2, b2);
  else vehicle.setColorRGB(r2, g2, b2, rgb.r, rgb.g, rgb.b);
});

mp.events.add('vehicle:setMod', (player, vehId, type, value) => {
  const vehicle = mp.vehicles.at(vehId);
  vehicle.setMod(Number(type), Number(value));
});
