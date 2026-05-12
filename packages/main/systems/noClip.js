// Actions on noclip toggle to be done server-side
mp.events.add('noclip:toggle', (player, state) => {
  if (state) {
    if (player.vehicle) player.vehicle.controller = player;
    player.alpha = 0;
  } else {
    player.alpha = 255;
  }
});