const {get} = require("./storage");

async function reactionSystemReady(guildId, name) {
    const guildRoleSystems = await get(`roleSystems.${name}`, guildId)
    return guildRoleSystems.messageId && guildRoleSystems.channelId
}

module.exports = {
    reactionSystemReady,
};
