const { savePlaytime } = require("../systems/auth.js");

mp.events.add('playerQuit', async (player) => {
  const playerVehicles = JSON.parse(player.getVariable('vehicles') || '[]');
  for (let vehicleId of playerVehicles) {
    let vehicle = mp.vehicles.at(vehicleId);

    vehicle.destroy();
  }

  if (player.getVariable('dbId')) await savePlaytime(player.getVariable('dbId'))
});