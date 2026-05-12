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

mp.events.addProc('auth:tryQuickAuth', async (player, token, id) => {
  const [results] = await queryAsync('SELECT connect_token FROM user WHERE id = ?', [id]);
  if (!results[0] || results[0].connect_token != token) return false;
  player.setVariable('dbId', id);
  await queryAsync(
    'UPDATE user SET last_connection = FROM_UNIXTIME(? / 1000) WHERE id = ?',
    [
      (new Date()).getTime(),
      id
    ]
  );
  return true;
});

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

async function authSuccess(player, discordId) {
  const [results] = await queryAsync('SELECT * FROM user WHERE discord_id = ?', [discordId]);
  if (!results[0]) {
    const [rkIdResults] = await queryAsync('SELECT * FROM user WHERE rk_id = ?', [player.rgscId]);
    if (rkIdResults[0]) player.call('auth:discordLoginError', ['Your rockstar account is already associated with another discord account']);
    const token = genRanHex(128);
    const [insert] = await queryAsync(
      'INSERT INTO user (discord_id, rk_id, username, username_data, playtime, last_connection, connect_token, sanctions)' +
      'VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(? / 1000), ?)',
      [
        discordId,
        player.rgscId,
        player.name,
        JSON.stringify({}),
        0,
        (new Date()).getTime(),
        token,
        JSON.stringify({})
      ]
    );
    player.setVariable('dbId', insert.insertId);
    player.call('auth:saveConnection', [token, insert.insertId]);
  } else {
    const token = genRanHex(128);
    await queryAsync(
    'UPDATE user SET connect_token = ?, last_connection = FROM_UNIXTIME(? / 1000) WHERE id = ?',
      [
        token,
        (new Date()).getTime(),
        results[0].id
      ]
    );
    player.setVariable('dbId', results[0].id);
    player.call('auth:saveConnection', [token, results[0].id]);
  }
  player.call('auth:discordLoginSuccess');
}

async function savePlaytime(dbId) {
  const [results] = await queryAsync('SELECT playtime, UNIX_TIMESTAMP(last_connection) as last_connection FROM user WHERE id = ?', [dbId]);
  if (!results[0]) return;
  const prevDate = (new Date()).setTime(results[0].last_connection * 1000);
  const currentDate = new Date();
  const diffMs = (currentDate - prevDate);
  const diffMins = Math.round(diffMs / 1000 / 60);
  await queryAsync(
    'UPDATE user SET playtime = ? WHERE id = ?',
    [
      results[0].playtime + diffMins,
      dbId
    ]
  );
}

module.exports = {
  authSuccess,
  savePlaytime,
}