mp.events.add('playerJoin', (player) => {
  if (player.name.includes("admin")) {
    player.kick();
    return;
  }

  player.setVariable('vehicles', "[]");

  console.log('User : ' + player.name + ' has joined !');

  player.model = mp.joaat('MP_M_Freemode_01');

  player.spawn(new mp.Vector3(413.7945556640625, -977.2393798828125, 29.44662857055664));
});