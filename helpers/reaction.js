const storage = require("./storage");

function reactionsReady(guildId) {
    return storage.get("reactions.channel", guildId) && storage.get("reactions.message", guildId);
}

module.exports = {
    reactionsReady,
};
