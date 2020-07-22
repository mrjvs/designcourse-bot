const storage = require("../helpers/storage");
const { initGuild } = require("../collector");

async function setMessage(msg, args) {
    storage.setMessage(msg.guild.id, args[2]);
    msg.channel.send("Successfully set the message id");
}

async function refreshMessage(msg) {
    try {
        await initGuild(msg.client, msg.guild.id);
    } catch (e) {
        msg.channel.send("Failed to refresh reactions");
        return
    }
    msg.channel.send("Successfully refreshed reactions");
}

async function setChannel(msg, args) {
    storage.setChannel(msg.guild.id, args[2]);
    msg.channel.send("Successfully set the channel id");
}

async function addReaction(msg, args) {
    if (!storage.hasMessage(msg.guild.id)) {
        msg.channel.send("no message has been set, oops");
        return
    }
    storage.addReaction(msg.guild.id, args[2], args[3]);
    msg.channel.send("Successfully added reaction");
}

async function removeReaction(msg, args) {
    if (!storage.hasMessage(msg.guild.id)) {
        msg.channel.send("no message has been set, oops");
        return
    }
    storage.removeReaction(msg.guild.id, args[2]);
    msg.channel.send("Successfully removed reaction");
}

module.exports = {
    cmd: "reaction",
    execute: (msg, args) => {
        if (args[1] == "set") setMessage(msg, args);
        else if (args[1] == "channel") setChannel(msg, args);
        else if (args[1] == "add") addReaction(msg, args);
        else if (args[1] == "remove") removeReaction(msg, args);
        else if (args[1] == "refresh") refreshMessage(msg, args);
        else {
            msg.channel.send("That's not how you use this command")
        }
    }
};
