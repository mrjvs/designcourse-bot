const { Guild, getGuildOrNew } = require("./db")

async function set(path, guildId, value) {
    const guild = await getGuildOrNew(guildId);
    guild.set(path, value)
    if (guild.isModified()) {
        await guild.save()
    }
}

async function get(path, guildId) {
    const guild = await getGuildOrNew(guildId)
    return guild.get(path)
}

async function getAllGuilds() {
    return Guild.find()
}

module.exports = {
    set,
    get,
    getAllGuilds
};
