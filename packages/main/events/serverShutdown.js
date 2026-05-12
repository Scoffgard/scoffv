const { savePlaytime } = require("../systems/auth.js");

mp.events.add("serverShutdown", async () => {
  mp.events.delayShutdown = true;
  for (let player of mp.players.toArray()) {
    if (player.getVariable('dbId')) await savePlaytime(player.getVariable('dbId'))
  }
  mp.events.delayShutdown = false;
});