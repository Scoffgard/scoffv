const { tryDiscordLogin, createWebSocketClient } = require("../discord/main.js");
const { queryAsync } = require("./database.js");

createWebSocketClient(authSuccess);

mp.events.add('auth:tryDiscordLogin', async (player, username) => {
  if (!username) return;
  tryDiscordLogin(player, username, (msg) => {
    if (msg.authSuccess) return;
    player.call('auth:discordLoginError', ['Username invalid or you\'re not on the discord server. Join at : https://scoffv.com/discord']);
  });
});

async function authSuccess(player, discordId) {
  const [results] = await queryAsync('SELECT * FROM user WHERE discord_id = ?', [discordId]);
  if (!results[0]) {
    const [rkIdResults] = await queryAsync('SELECT * FROM user WHERE rk_id = ?', [player.rgscId]);
    if (rkIdResults[0]) player.call('auth:discordLoginError', ['Your rockstar account is already associated with another discord account']);
    const [insert] = await queryAsync(
      'INSERT INTO user (discord_id, rk_id, username, username_data, playtime, last_connection, sanctions)' +
      'VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(? / 1000), ?)',
      [
        discordId,
        player.rgscId,
        player.name,
        JSON.stringify({}),
        0,
        (new Date()).getTime(),
        JSON.stringify({})
      ]
    );
    player.setVariable('dbId', insert.insertId);
  } else {
    player.setVariable('dbId', results[0].id);
  }
  player.call('auth:discordLoginSuccess');
}

module.exports = {
  authSuccess,
}