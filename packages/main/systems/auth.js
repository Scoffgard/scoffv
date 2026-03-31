const { tryDiscordLogin } = require("../discord/main.js");

mp.events.add('auth:tryDiscordLogin', async (player, username) => {
  if (!username) return;
  tryDiscordLogin(player, username, (msg) => {
    if (msg.authSuccess) return;
    player.call('auth:discordLoginError', ['Username invalid or you\'re not on the discord server. Join at : https://scoffv.com/discord']);
  });
});