const Logger = require('./logger');
const DiscordClient = require('../modules/discordClient');

function initializeApplication() {
    Logger.makeLogger();
    DiscordClient.connect();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadUtils() {
    global.Util = {
        initializeApplication,
        sleep
    };
}

module.exports = {
    loadUtils
};
