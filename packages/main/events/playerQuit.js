mp.events.add('playerQuit', (player) => {
  const playerVehicles = JSON.parse(player.getVariable('vehicles') || '[]');
  for (let vehicleId of playerVehicles) {
    let vehicle = mp.vehicles.at(vehicleId);

    vehicle.destroy();
  }
});