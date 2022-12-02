const { Client, GatewayIntentBits, IntentsBitField, Collection, IntegrationApplication } = require('discord.js');
const { discordBotToken } = require('../util/env');

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
    const loginPromise = discordClient.login(discordBotToken);
    global.discordClient = discordClient;

    //Load all commands for slash commands and inject hooks
    discordClient.once('ready', () => {
        global.logger.log('info', 'Application started...');
    });

    return loginPromise;
}

module.exports = {
    connect,
}

