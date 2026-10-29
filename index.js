const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check if DZ RESPECT BOT is online')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function startBot() {
    if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
        console.error('Missing bot configuration!');
        process.exit(1);
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
});

startBot().catch(console.error);
