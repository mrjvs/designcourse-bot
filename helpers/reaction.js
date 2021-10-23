const {getGuildOrNew} = require("./db");

async function reactionSystemReady(guildId, name) {
    const guildRoleSystems = (await getGuildOrNew(guildId)).roleSystems
    return guildRoleSystems.messageId && guildRoleSystems.channelId
}

module.exports = {
    reactionSystemReady,
};
