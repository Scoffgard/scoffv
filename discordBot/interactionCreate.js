import { authReply } from "./authReply.js";

export async function interactionCreate(interaction) {
  const handles = {
    'buttons': [
      {
        check: i => i.customId.startsWith('auth'),
        run: authReply,
      },
    ],
    'modals': [],
  };
  
  let usedCategory;
  
  // Check interaction type and save it for execution
  if (interaction.isButton()) usedCategory = 'buttons';
  else if (interaction.isModalSubmit()) usedCategory = 'modals';
  
  // Return if type is not present in handles
  if (!handles[usedCategory]) return;
  
  // Loop over all handles in the handles list, run their check, and if true, execute it
  for (let handle of handles[usedCategory]) {
    if (handle.check(interaction)) return await handle.run(interaction);
  }
}