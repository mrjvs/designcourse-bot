const mongoose = require('mongoose');
const { MONGODB_URI } = process.env

const roleSystemSchema = new mongoose.Schema({
    messageId: String,
    channelId: String,
    reactions: { // Emoji ID: Role ID
        type: Map,
        of: String,
        default: {}
    }
})

const throttleSchema = new mongoose.Schema({
    enabled: Boolean,
    logChannel: String
})

const timeoutSchema = new mongoose.Schema({
    enabled: Boolean,
    logChannel: String
})

const guildSchema = new mongoose.Schema({
    _id: String,
    roleSystems: {
        type: Map,
        of: roleSystemSchema
    },
    throttle: throttleSchema,
    timeout: timeoutSchema
})

const Guild = mongoose.model("Guild", guildSchema)

main().catch(err => console.error(err));

async function main() {
    await mongoose.connect(MONGODB_URI);
}

async function getGuildOrNew(guildId) {
    const guild = await Guild.findById(guildId).exec()
    if (!guild) {
        return new Guild({ _id: guildId })
    }
    return guild
}

module.exports = { Guild, getGuildOrNew }