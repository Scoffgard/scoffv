
mp.events.add('entityStreamIn', (entity) => {
  switch (entity.type) {
    case 'vehicle': 
      if (entity.remoteId == mp.players.local.data.vehicleToEnter) {
        mp.players.local.setIntoVehicle(entity.handle, -1);
        mp.players.local.data.vehicleToEnter = undefined;
      }
      break;
  }
})