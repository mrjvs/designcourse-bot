const storage = require("../helpers/storage");
const { initGuild } = require("../events/collector");
const { sendError, sendSuccess } = require("../helpers/embed");

async function setMessage(msg, args) {
    storage.set("reactions.message", msg.guild.id, args[2]);
    msg.channel.send("Successfully set the message id");
}

async function refreshMessage(msg) {
    try {
        await initGuild(msg.client, msg.guild.id);
    } catch (e) {
        sendError(msg.channel, "Failed to refresh reactions");
        return
    }
    sendSuccess(msg.channel, "Successfully refreshed reactions");
}

async function setChannel(msg, args) {
    storage.set("reactions.channel", msg.guild.id, args[2]);
    sendSuccess(msg.channel, "Successfully set the channel id");
}

async function addReaction(msg, args) {
    storage.set("reactions.reactions." + args[2], msg.guild.id, args[3]);
    sendSuccess(msg.channel, "Successfully added reaction");
}

async function removeReaction(msg, args) {
    storage.set("reactions.reactions." + args[2], msg.guild.id, undefined);
    sendSuccess(msg.channel, "Successfully removed reaction");
}

module.exports = {
    cmd: "reaction",
    description: "Editing reaction role functionality",
    admin: true,
    subCommands: {
        set: {
            args: ["<messageId>"],
            description: "Change which message to listen reactions on",
            execute: setMessage,
        },
        channel: {
            args: ["<channelId>"],
            description: "Change what channel the message is in",
            execute: setChannel,
        },
        add: {
            args: ["<emojiId>", "<roleId>"],
            description: "Add a new emoji and role to the reaction system",
            execute: addReaction,
        },
        remove:  {
            args: ["<emojiId>"],
            description: "Remove a emoji from the reaction system",
            execute: removeReaction,
        },
        refresh:  {
            args: [],
            description: "Refresh the message reactions (in case any are missing)",
            execute: refreshMessage,
        }
    }
};
