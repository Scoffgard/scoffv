mp.events.add("vehicleDeath", (vehicle) => {
  const ownerId = vehicle.getVariable('owner_id');
  if (ownerId === undefined) return;
  const player = mp.players.at(ownerId);
  player.call('hud:notification', ['Your vehicle has been destroyed, it will be automaticaly deleted in 30 seconds', 'red', 3]);
  vehicle.setVariable('preventDelete', false);
  setTimeout(() => {
    if (!mp.vehicles.exists(vehicle)) return;
    if (vehicle.getVariable('preventDelete')) return vehicle.setVariable('preventDelete', false);
    player.call('vehicle:deleteOwn', [vehicle.id]);
  }, 30000);
});