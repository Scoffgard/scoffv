import { MessageFlags } from "discord.js";

export async function authReply(interaction) {
  const accept = interaction.customId.includes('accept');
  const playerId = interaction.customId.split('_')[1];
  if (!interaction.user.dmChannel) await interaction.user.createDM();
  const message = await interaction.user.dmChannel.messages.fetch(interaction.message.id);
  message.delete();
  if (globalThis.wsClient) 
    globalThis.wsClient.client.send(JSON.stringify({
      success: true,
      type: 'auth',
      accept,
      playerId,
      discordId: interaction.user.id,
    }));
  interaction.reply({content: `Connection ${accept ? 'accepted' : 'refused'}`, flags: MessageFlags.Ephemeral});
}