const { SlashCommandBuilder } = require('@discordjs/builders');

const name = 'ban';
const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription('Ban the user from all mirrors')
  .addUserOption((option) => {
    return option
      .setName('user')
      .setDescription('User to be banned')
      .setRequired(true)
  });

async function execute(interaction) {
  await interaction.reply(`Would have banned ${JSON.stringify(interaction.options?.getUser('user'))}`);
}


module.exports = {
  name,
  data,
  execute
}