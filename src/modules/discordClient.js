const { Client, GatewayIntentBits } = require('discord.js');
const { discordBotToken } = require('../util/env');
const commands = [require('../commands/banUser')]

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
        global.logger.log('info', 'Application started...');
    });

    loadCommands(discordClient);

    return loginPromise;
}

function loadCommands(discordClient) {
    for (const command of commands) {
        global.discordClient.api.applications(discordClient.user.id)
            .commands.post({
                ...command
            });
    }
}

module.exports = {
    connect,
}

