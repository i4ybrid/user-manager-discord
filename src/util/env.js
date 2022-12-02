const {
  discordToken,
  discordBotToken,
  mirrorToken,
  cloneServerId,
  serverId,
  alertWebhook } = require('../../config/env.json');

const headers = {
  'Content-Type': 'application/json',
  Authorization: discordToken,
};

const botHeaders = {
  'Content-Type': 'application/json',
  Authorization: discordBotToken,
};

const mirrorHeaders = {
  'Content-Type': 'application/json',
  Authorization: mirrorToken,
};

module.exports = {
  discordToken,
  serverId,
  discordBotToken,
  mirrorHeaders,
  headers,
  botHeaders,
  cloneServerId,
  alertWebhook,
};
