const { Client, GatewayIntentBits, REST, Routes, Events } = require('discord.js');
const { discordBotToken, clientId } = require('../util/env');
const path = require('node:path');
const fs = require('node:fs');

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file => file.endsWith('.js')));
const commandExecuteMap = {};

const DISCORD_INTENTS = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent
];

/**
 * Assigns global.discordClient to the bot client (discord.js)
 * 
 * @returns discord.js client
 */
async function connect() {
    const discordClient = new Client({
        intents: DISCORD_INTENTS
    });
    const loginPromise = await discordClient.login(discordBotToken);
    global.discordClient = discordClient;

    discordClient.once('ready', () => {
        global.logger.log('info', 'connect: Application started...');
    });

    loadCommands(discordClient);
    discordClient.on(Events.InteractionCreate, handleInteraction);

    return loginPromise;
}

function loadCommands(discordClient) {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            global.logger.log('debug', `loadCommands: Setting up command: ${command.data.name}`);
            commands.push(command.data.toJSON());
            commandExecuteMap[command.name] = command.execute;
            //discordClient.commands.set(command.data.name, command);
        }
    }

    const rest = new REST({ version: '10' }).setToken(discordBotToken);

    (async () => {
        try {
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands }
            );
        } catch (err) {
            global.logger.log('error', `loadCommands: ${err?.stack || err}`);
        }
    })();
}

async function handleInteraction(interaction) {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    global.logger.log('info', JSON.stringify(interaction, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value
    }));

    const executeFunction = commandExecuteMap[interaction.commandName];
    if (!executeFunction) {
        global.logger.log('warn', `handleInteraction: Got a command for ${interaction.commandName} but it is not a registered command`);
        return;
    }

    try {
        executeFunction(interaction);
    } catch (err) {
        global.logger.log('error', `handleInteraction: Got an error executing command: ${interaction.commandName}: ${err?.stack || err}`);
    }
}

module.exports = {
    connect,
}

