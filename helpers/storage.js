const { Guild, getGuildOrNew } = require("./db")
const _ = require('lodash');

async function set(path, guildId, value) {
    await Guild.findByIdAndUpdate(guildId, { $set: {[path]: value} }, { upsert: true })
}

async function getAllGuilds() {
    return Guild.find()
}

module.exports = {
    set,
    getAllGuilds
};
