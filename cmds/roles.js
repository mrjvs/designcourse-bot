const storage = require("../helpers/storage");
const { initGuild } = require("../events/collector");
const { reactionSystemReady } = require("../helpers/reaction");
const { sendError, sendSuccess } = require("../helpers/embed");
const {getGuildOrNew, Guild} = require("../helpers/db");

async function systemExists(guildId, name) {
    const dbGuild = await getGuildOrNew(guildId)
    return !!dbGuild.roleSystems[name]
}

async function systemExistsError(msg, name) {
    if (!name || name.length === 0 || !await systemExists(msg.guild.id, name)) {
        sendError(msg.channel, "Reaction system with that name doesnt exist");
        return true;
    }
    return false;
}

async function createSystem(msg, args) {
    if (!args[2] || args[2].length === 0 || await systemExists(msg.guild.id, args[2])) {
        sendError(msg.channel, "Reaction system with that name already exists");
        return;
    }
    await storage.set("roleSystems." + args[2], msg.guild.id, {});
    sendSuccess(msg.channel, "Successfully created reaction system");
}

async function deleteSystem(msg, args) {
    if (!args[2] || args[2].length === 0 || !await systemExists(msg.guild.id, args[2])) {
        sendError(msg.channel, "Reaction system with that name doesnt exist");
        return;
    }
    await storage.set(`roleSystems.${args[2]}`, msg.guild.id, undefined);
    
    sendSuccess(msg.channel, "Successfully deleted reaction system");
}

async function listSystems(msg) {
    const dbGuild = await getGuildOrNew(msg.guild.id)
    let allSystems = dbGuild.roleSystems;
    if (!allSystems || Object.keys(allSystems).length === 0)
        allSystems = { "No systems yet": true };
    console.log(allSystems)
    sendSuccess(msg.channel, `Systems:\n${Object.keys(allSystems).map(v=>` - ${v}`).join("\n")}`);
}

async function setSystemMessage(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0) {
        sendError(msg.channel, "Message id invalid");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.message`, msg.guild.id, args[3]);
    sendSuccess(msg.channel, "Successfully set message id");
}

async function setSystemChannel(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0) {
        sendError(msg.channel, "Channel id invalid");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.channel`, msg.guild.id, args[3]);
    sendSuccess(msg.channel, "Successfully set channel id");
}

async function addSystemRole(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0) {
        sendError(msg.channel, "emoji id invalid");
        return;
    }
    if (!args[4] || args[4].length === 0) {
        sendError(msg.channel, "role id invalid");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.reactions.${args[3]}`, msg.guild.id, args[4]);
    sendSuccess(msg.channel, "Successfully added role");
}

async function removeSystemRole(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0 || !await storage.set("roleSystems." + args[2] + ".reactions." + args[3], msg.guild.id)) {
        sendError(msg.channel, "couldnt find emoji in reaction system");
        return;
    }
    await storage.set(`roleSystems.${args[2]}reactions.${args[3]}`, msg.guild.id, undefined);
    sendSuccess(msg.channel, "Successfully removed role");
}

async function systemStatus(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    const isActive = reactionSystemReady(msg.guild.id, args[2]);
    const dbGuild = getGuildOrNew(msg.guild.id)
    const channel = dbGuild.roleSystems[args[2]].channelId
    const message = dbGuild.roleSystems[args[2]].messageId
    let reactions = dbGuild.roleSystems[args[2]].reactions
    if (!reactions) reactions = {};
    const embed = {
        title: "Reaction system " + args[2],
        description: isActive ? 'System is active' : 'System is not configured correctly',
        fields: [{
            name: "Configuration",
            value: `Channel: ${channel?'<#'+channel+'>':'Not configured'}\nMessage: ${message?message:'Not configured'}`
        }, {
            name: "Roles",
            value: Object.keys(reactions).length === 0 ? 'No roles configured' : Object.keys(reactions).map(v=>`${msg.guild.emojis.cache.get(v)?msg.guild.emojis.cache.get(v):'?'} - <@&${reactions[v]}>`).join("\n")
        }]
    };
    await msg.channel.send({embed});
}

async function refreshReactions(msg) {
    await initGuild(msg.client, msg.guild.id);
    sendSuccess(msg.channel, "Successfully refreshed role system");
}

module.exports = {
    cmd: "roles",
    description: "Role reaction system - on any message",
    admin: true,
    subCommands: {
        // systems
        create: {
            args: ["<name>"],
            description: "Creates a new reaction system",
            execute: createSystem,
        },
        delete: {
            args: ["<name>"],
            description: "Deletes a reaction system",
            execute: deleteSystem,
        },
        list: {
            args: [],
            description: "Lists all reaction systems",
            execute: listSystems,
        },

        // modify system
        message: {
            args: ["<name>", "<messageId>"],
            description: "Change which message to listen reactions on",
            execute: setSystemMessage,
        },
        channel: {
            args: ["<name>", "<channelId>"],
            description: "Change what channel the message is in",
            execute: setSystemChannel,
        },
        add: {
            args: ["<name>", "<emojiId>", "<roleId>"],
            description: "Add a new emoji and role to the reaction system",
            execute: addSystemRole,
        },
        remove:  {
            args: ["<name>", "<emojiId>"],
            description: "Remove a emoji from the reaction system",
            execute: removeSystemRole,
        },

        // tools
        refresh:  {
            args: [],
            description: "Refresh all reaction systems, fixes missing emojis and broken cache",
            execute: refreshReactions,
        },
        status:  {
            args: ["<name>"],
            description: "Gets status of a reaction system",
            execute: systemStatus,
        },
    }
};
