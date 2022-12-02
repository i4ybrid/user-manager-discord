const commands = [
    require('./backfill.js'), require('./syncRoles'), require('./syncChannels'),
    require('./whois'), require('./saveData'), require('./syncDMs')
];
const { backfill, backfillOriginalIds } = require('../modules/messageBackfill');
const { syncRoles, syncChannels } = require('../modules/syncServer');
const { createDmMirror } = require('../modules/channelManager');
const MessageTemplates = require('../alerts/messageTemplates');
const { sendWebhook } = require('../alerts/sendDiscordWebhook');
const { heapDump } = require('../modules/heapDump');

const discordUrlRegex = /^http[s?]:\/\/discord.com\/channels\/[0-9]{18,20}\/[0-9]{18,20}/;
const guildChannelRegex = /[0-9]{18,20}\/[0-9]{18,20}$/;

async function interactionHandler(interaction, message) {
    //If it's not a command or the command came from a user not in one of the guilds this instance is working on (this will happen if you share bot api keys)
    if (!interaction.isCommand() || !global.guildMapping[interaction.guildId]) {
        return;
    }

    if ('backfill' === interaction.commandName) {
        const channelOption = interaction.options?.getChannel('channel');
        const limitOption = interaction.options?.getInteger('limit');
        const urlOption = interaction.options?.getString('url');
        const channelName = channelOption?.name ? `#${channelOption.name}` : `#${interaction.channel.name}`;
        const serverId = interaction.guildId;
        const channelId = channelOption?.id ? channelOption.id : interaction.channelId;

        if (urlOption && !channelOption) {
            const matchResult = urlOption.match(discordUrlRegex);
            if (!matchResult || matchResult.length !== 1) {
                interaction.reply({ content: `This is not a valid discord URL channel. It should look like https://discord.com/channels/1234/5678`, ephemeral: true });
            } else {
                const guildChannelText = matchResult[0].match(guildChannelRegex)[0];
                const [urlGuildId, urlChannelId] = guildChannelText.split('/');
                if (global.guildMapping[serverId] !== urlGuildId) {
                    interaction.reply({ content: `This is server is not mirroring guildId [${urlGuildId}]`, ephemeral: true });
                } else {
                    interaction.reply({ content: `Attempting to backfill channel ID [${urlChannelId}] for the last ${limitOption ? limitOption : 100} messages...`, ephemeral: true });
                    backfillOriginalIds(urlGuildId, urlChannelId, limitOption, serverId);
                }
            }
        } else {
            interaction.reply({ content: `Starting backfill for ${channelName} for the last ${limitOption ? limitOption : 100} messages...`, ephemeral: true });
            backfill(serverId, channelId, limitOption);
        }
    } else if ('syncroles' === interaction.commandName) {
        const serverId = interaction.guildId;
        syncRoles(serverId);
        interaction.reply({ content: `Syncing roles...`, ephemeral: true });
    } else if ('syncchannels' === interaction.commandName) {
        const saveOption = interaction.options?.getBoolean('save');
        let dontSaveCloneMap = false;
        if (typeof shouldSave === 'boolean') {
            dontSaveCloneMap = !shouldSave;
        }
        const clobberOption = interaction.options?.getBoolean('clobber');
        let removeDeletedFromCloneMap = false;
        if (typeof clobberOption === 'boolean') {
            removeDeletedFromCloneMap = clobberOption;
        }
        
        const serverId = interaction.guildId;
        syncChannels(serverId, dontSaveCloneMap, removeDeletedFromCloneMap);
        interaction.reply({ content: `Syncing channels...`, ephemeral: true });
    } else if ('whois' === interaction.commandName) {
        const requestedUser = interaction.options?.getUser('user');
        const payload = {
            email_address: "test@test.com",
            stripe_subscription_id: "1234",
            current_period_start: '1111',
            thumbnailUrl: requestedUser.avatarURL(),
            discord_username: requestedUser.tag,
            discord_user_id: requestedUser.id
        };
        const embedData = MessageTemplates.embedFromPayload(payload);
        interaction.reply({ content: '✅', ephemeral: true});
        sendWebhook(embedData);
    } else if ('savedata' === interaction.commandName) {
        interaction.reply({ content: '✅', ephemeral: true});
        global.Util.saveCloneMap(true);
    } else if ('rolecontrol' === interaction.commandName) {
        interaction.reply({ content: 'This is not yet implemented...', ephemeral: true});
        //TODO Implement this
    } else if ('bind' === interaction.commandName) {
        interaction.reply({ content: 'This is not yet implemented...', ephemeral: true});
        //TODO Implement this
    } else if ('unbind' === interaction.commandName) {
        interaction.reply({ content: 'This is not yet implemented...', ephemeral: true});
        //TODO Implement this
    } else if ('heapdump' === interaction.commandName) {
        interaction.reply({ content: '✅', ephemeral: true})
            .catch((err) => {
                global.logger.log(err?.stack || err);
            });
        heapDump();
    } else if ('syncdms' === interaction.commandName) {
        const mirrorChannel = interaction.options?.getChannel('channel');
        const sourceChannelId = interaction.options?.getString('sourcechannelid');

        createDmMirror(sourceChannelId, mirrorChannel?.id)
            .then((combinedData) => {
                interaction.reply({ content: `Successfully linked DMs from ${combinedData?.originalChannel?.recipients?.[0]?.username}#${combinedData?.originalChannel?.recipients?.[0]?.discriminator} to #${combinedData?.newChannel?.name}`, ephemeral: true});
            }).catch((err) => {
                interaction.reply({ content: `🚫 Failed! ${err}`, ephemeral: true});
            });
    } else {
        error = `Command ${interaction.commandName} is unknown. Something is probably wrong, contact the bot owner`;
        global.logger.log('warn', `Caught error trying to execute command ${interaction.commandName} with message: ${JSON.stringify(message)}`);
        interaction.reply({
            content: error,
            ephemeral: true
        })
    }
}

async function injectCommands() {
    for (const command of commands) {
        global.discordClient.api.applications(discordClient.user.id)
            .commands.post({
                ...command
            });
    }
}

module.exports = {
    interactionHandler,
    injectCommands
}