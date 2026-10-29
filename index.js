
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot status'),

  new SlashCommandBuilder()
    .setName('announce')
    .setDescription('إرسال إعلان رسمي')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('اكتب نص الإعلان')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function startBot() {
  if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    throw new Error('Missing bot configuration!');
  }

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  await client.login(TOKEN);
}

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply({
      content: 'DZ RESPECT BOT is online!',
      ephemeral: true
    });
  }

  if (interaction.commandName === 'announce') {
    const message = interaction.options.getString('message', true);

    await interaction.reply({
      content: 'تم نشر الإعلان بنجاح.',
      ephemeral: true
    });

    await interaction.channel.send({
      content: `**إعلان رسمي — DZ RESPECT ROLEPLAY**\n\n${message}`,
      allowedMentions: { parse: [] }
    });
  }
});

startBot().catch(console.error);
