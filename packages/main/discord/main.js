const { WebSocket } = require("ws");

const callbacks = {};

const ws = new WebSocket("ws://localhost:10001");  

function createWebSocketClient(authSuccessCB) {
  
  ws.on('open', async () => {
    console.log('[INFO] Connection to discord WS opened');
  
    await ws.send(JSON.stringify({
      type: 'auth',
      token: process.env.WS_TOKEN,
    }));
  }); 
  
  ws.on('close', () => {
    console.log('[INFO] Connection to discord WS closed by server');
  });
  
  ws.on('message', data => {
    const msg = JSON.parse(data);
  
    if (!msg.success) console.log('[ERROR] Discord WS :', msg.error);
    else if (msg.reqId != undefined) {
      callbacks[msg.reqId](msg);
      delete callbacks[msg.reqId];
    }
    else if (msg.type == 'auth') {
      const player = mp.players.at(msg.playerId);
      if (!player) return console.log('Unable to find user !');
      if (msg.accept) authSuccessCB(player, msg.discordId);
      else player.call('auth:discordLoginError', ['User refused connection']);
    }
    else console.log('[SUCCESS] Discord WS :', msg.message);
  });
}

function tryDiscordLogin(player, username, callback) {
  if (callbacks[player.id]) return;
  ws.send(JSON.stringify({
    type: 'sendAuth',
    username: username,
    reqId: player.id,
  }));
  callbacks[player.id] = callback;
}

module.exports = {
  tryDiscordLogin,
  createWebSocketClient,
}