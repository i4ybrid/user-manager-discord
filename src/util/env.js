const {
  homeServerId,
  discordBotToken,
  clientId,
  roleName } = require('../../config/env.json');

const botHeaders = {
  'Content-Type': 'application/json',
  Authorization: discordBotToken,
};

module.exports = {
  homeServerId,
  discordBotToken,
  botHeaders,
  clientId,
  roleName,
};
