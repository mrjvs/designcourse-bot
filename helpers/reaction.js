const storage = require("./storage");

function reactionSystemReady(guildId, name) {
    return storage.get("roles.systems."+name+".message", guildId) && storage.get("roles.systems."+name+".channel", guildId);
}

module.exports = {
    reactionSystemReady,
};
