mp.events.add('playerDeath', (player, reason, killer) => {
  setTimeout(() => {
    player.spawn(new mp.Vector3(413.7945556640625, -977.2393798828125, 29.44662857055664));
  }, 3000)
});