import { GatewayIntentBits, Client, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { interactionCreate } from "./interactionCreate.js";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Actions to do when client is ready
client.on(Events.ClientReady, readyClient => {
	console.log(`[SUCCESS] Discord Bot logged in as ${readyClient.user.tag}!`);
	
	client.user.setPresence({ activities: [{ name: 'Regarde les Joueurs ScoffV', type: 3 }], status: 'online'});
});

// Bind the interactionCreate event to corresponding file
client.on(Events.InteractionCreate, (interaction) => {
  interactionCreate(interaction);
});
	
// Connect the client with the .env defined token
client.login(process.env.DISCORD_TOKEN);

async function sendAuth(username, playerId) {
  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
  const membersList = await guild.members.list();
  const listFiltered = membersList.filter(user => user.user.username == username);

  if (!listFiltered.at(0)) return false;

  const user = listFiltered.at(0).user;

  if (!user.dmChannel) await user.createDM();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`auth-accept-${user.id}_${playerId}`)
      .setLabel('Accept')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`auth-refuse-${user.id}_${playerId}`)
      .setLabel('Refuse')
      .setEmoji('❌')
      .setStyle(ButtonStyle.Secondary)
  )

  user.dmChannel.send({content: '# New connection request on ScoffV', components: [row]});
  return true;
}

const wss = new WebSocketServer({ port: 10001 });

wss.on('connection', (ws) => {
  // if (globalThis.wsClient) return ws.close();
  console.log("[INFO] WS Client connected");

  globalThis.wsClient = { auth: false, client: ws };

  ws.on('message', async message => {
    const data = JSON.parse(message);

    if (!data.type) return ws.send(JSON.stringify({success: false, error: 'Invalid body'}));

    if (
      globalThis.wsClient &&
      globalThis.wsClient.auth === false &&
      data.type != 'auth'
    ) return ws.send(JSON.stringify({success: false, error: 'Please authentificate before action !'}));

    switch (data.type) {
      case 'auth': 
        if (data.token === process.env.WS_TOKEN) {
          globalThis.wsClient.auth = true;
          ws.send(JSON.stringify({success: true, message: 'Auth successful'}));
        } else ws.send(JSON.stringify({success: false, error: 'Invalid token !'}));
        break;
      case 'sendAuth':
        if (!data.username || data.reqId === undefined) return ws.send(JSON.stringify({success: false, error: 'Invalid body'}));
        const auth = await sendAuth(data.username, data.reqId);
        ws.send(JSON.stringify({success: true, authSuccess: auth, reqId: data.reqId}));
        break;
      default:
        ws.send(JSON.stringify({success: false, error: 'Invalid message type'}));
        break;
    }
  });
});