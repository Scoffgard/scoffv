const { queryAsync } = require("./database.js");

mp.events.addProc('vehicle:spawn', (player, model, pos) => {
  const vehicle = mp.vehicles.new(model, pos, { dimension: player.dimension, numberPlate: 'SCOFFV' });

  const newVehicles = JSON.parse(player.getVariable('vehicles') || "[]");
  newVehicles.push(vehicle.id);
  player.setVariable('vehicles', JSON.stringify(newVehicles));

  vehicle.setVariable('owner_id', player.id);

  vehicle.controller = player;

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
  vehicle.setVariable('preventDelete', true);
  vehicle.repair();
});

mp.events.add('vehicle:syncOption', (player, option, vehId, value) => {
  const vehicle = mp.vehicles.at(vehId);
  vehicle.setVariable(`option_${option}`, value);
  if (option == 'godmode') vehicle.setVariable('preventDelete', true);
  vehicle.streamedPlayers.forEach(p => {
    p.call('vehicle:syncOptionClient', option, vehId, value);
  });
});

mp.events.addProc('vehicle:getColorRGB', (player, vehId, colorId = 0) => {
  const vehicle = mp.vehicles.at(vehId);
  const rgb = vehicle.getColorRGB(colorId);
  if (rgb) return JSON.stringify({r: rgb[0], g: rgb[1], b: rgb[2]});
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

mp.events.addProc('vehicle:canSaveVehicle', async (player) => {
  const [results] = await queryAsync('SELECT COUNT(id) AS count FROM saved_vehicles WHERE owner_id = ?', [player.getVariable('dbId')]);
  return results[0].count < 10;
});

mp.events.addProc('vehicle:save', async (player, name, data) => {
  if (!player.getVariable('dbId') || !name || !data) return false;
  const [res] = await queryAsync(
    'INSERT INTO saved_vehicles(owner_id, display_name, public, data) ' +
    'VALUES (?, ?, ?, ?)', 
    [
      player.getVariable('dbId'),
      name,
      false,
      data,
    ]
  );
  return res.insertId;
});

mp.events.addProc('vehicle:saved:getData', async (player, vehId) => {
  if (!player.getVariable('dbId') || !vehId) return false;
  const [results] = await queryAsync('SELECT * FROM saved_vehicles WHERE id = ?', [vehId]);
  return JSON.stringify(results[0]);
});

mp.events.addProc('vehicle:getSavedVehicles', async (player) => {
  const [results] = await queryAsync('SELECT * FROM saved_vehicles WHERE owner_id = ?', [ player.getVariable('dbId') ]);
  return JSON.stringify(results);
});

mp.events.addProc('vehicle:getPublicVehicles', async (player) => {
  const [results] = await queryAsync('SELECT * FROM saved_vehicles WHERE public = TRUE', []);
  return [player.getVariable('dbId'), JSON.stringify(results)];
});

mp.events.addProc('vehicle:saved:action', async (player, vehId, option, value) => {
  if (!player.getVariable('dbId') || !option || !vehId) return false;
  const [vehs] = await queryAsync('SELECT * FROM saved_vehicles WHERE id = ?', [ vehId ]);
  if (!vehs[0]) return false;
  if (player.getVariable('dbId') != vehs[0].owner_id) return false; 
  switch (option) {
    case 'delete':
      await queryAsync('DELETE FROM saved_vehicles WHERE id = ?', [ vehId ]);
      break;
    case 'rename':
      if (!value) return false;
      if (value == vehs[0].display_name) return true;
      await queryAsync('UPDATE saved_vehicles SET display_name = ? WHERE id = ?', [ value, vehId ]);
      break;
    case 'public':
      if (value == undefined) return false;
      if (value == vehs[0].public) return true;
      await queryAsync('UPDATE saved_vehicles SET public = ? WHERE id = ?', [ value, vehId ]);
      break;
    case 'data':
      if (value == undefined) return false;
      await queryAsync('UPDATE saved_vehicles SET data = ? WHERE id = ?', [ value, vehId ]);
      break;
  }
  return true;
});