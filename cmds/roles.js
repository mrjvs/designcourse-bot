const storage = require("../helpers/storage");
const { reactionSystemReady } = require("../helpers/reaction");
const {getGuildOrNew, Guild} = require("../helpers/db");
const { sendError, sendSuccess } = require("../helpers/embed");
const { MessageActionRow, MessageButton } = require("discord.js");

async function editMessageWithButtons(msg, name) {
    const guild = msg.guild;
    const system = await storage.get("roleSystems." + name, guild.id);
    if (!system || !system.channelId || !system.messageId) {
        sendError(msg.channel, "No system, channel or message found");
        return false;
    }
    const channel = guild.channels.cache.get(system.channelId);
    let message = await channel.messages.fetch(system.messageId, true);
    if (message.author.id !== message.client.user.id) {
        sendError(msg.channel, "Can only add buttons to a message of the bot");
        return false;
    }

    const buttons = Object.keys(system.reactions || {}).map(v=> {
        return new MessageButton()
            .setCustomId(["DCROLES", v, system.reactions[v]].join(":"))
            .setEmoji(v)
            .setStyle('SECONDARY')
    })

    await message.edit({
        components: [
            new MessageActionRow().addComponents(...buttons),
        ]
    });
    return true;
}

async function systemExists(guildId, name) {
    return !!await storage.get(`roleSystems.${name}`, guildId)
}

async function systemExistsError(msg, name) {
    if (!name || name.length === 0 || !await systemExists(msg.guild.id, name)) {
        sendError(msg.channel, `Reaction system with the name \`${name}\` doesn't exist`);
        return true;
    }
    return false;
}

async function createSystem(msg, args) {
    if (!args[2] || args[2].length === 0 || await systemExists(msg.guild.id, args[2])) {
        sendError(msg.channel, `Reaction system with the name \`${args[2]}\` already exists`);
        return;
    }
    await storage.set(`roleSystems.${args[2]}`, msg.guild.id, {});
    sendSuccess(msg.channel, `Successfully created reaction system with name \`${args[2]}\``);
}

async function deleteSystem(msg, args) {
    if (!args[2] || args[2].length === 0 || !await systemExists(msg.guild.id, args[2])) {
        sendError(msg.channel, `Reaction system with the name \`${args[2]}\` doesnt exist`);
        return;
    }
    await storage.set(`roleSystems.${args[2]}`, msg.guild.id, undefined);
    
    sendSuccess(msg.channel, `Successfully deleted reaction system with name \`${args[2]}\``);
}

async function listSystems(msg) {
    let allSystems = await storage.get("roleSystems", msg.guild.id)
    if (!allSystems || Object.keys(allSystems).length === 0)
        allSystems = { "No systems yet": true };
    sendSuccess(msg.channel, `Systems:\n${Object.keys(allSystems).map(v=>` - ${v}`).join("\n")}`);
}

async function setSystemMessage(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0) {
        sendError(msg.channel, "Message id invalid");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.messageId`, msg.guild.id, args[3]);
    sendSuccess(msg.channel, "Successfully set message id");
}

async function setSystemChannel(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0) {
        sendError(msg.channel, "Channel id invalid");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.channelId`, msg.guild.id, args[3]);
    sendSuccess(msg.channel, "Successfully set channel id");
}

async function addSystemRole(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0) {
        sendError(msg.channel, "Emoji ID invalid");
        return;
    }
    if (!args[4] || args[4].length === 0) {
        sendError(msg.channel, "Role ID invalid");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.reactions.${args[3]}`, msg.guild.id, args[4]);
    sendSuccess(msg.channel, `Successfully added emoji ID \`${args[3]}\` with role ID \`${args[4]}\``);
}

async function removeSystemRole(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    if (!args[3] || args[3].length === 0 || !await storage.set(`roleSystems.${args[2]}.reactions.${args[3]}`, msg.guild.id)) {
        sendError(msg.channel, "Couldn't find emoji in reaction system");
        return;
    }
    await storage.set(`roleSystems.${args[2]}.reactions.${args[3]}`, msg.guild.id, undefined);
    sendSuccess(msg.channel, `Successfully removed role with ID \`${args[3]}\``);
}

async function systemStatus(msg, args) {
    if (await systemExistsError(msg, args[2])) return;
    const isActive = reactionSystemReady(msg.guild.id, args[2]);
    const roleSystem = await storage.get(`roleSystems.${args[2]}`, msg.guild.id)
    const channel = roleSystem.channelId
    const message = roleSystem.messageId
    let reactions = roleSystem.reactions
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
    msg.channel.send({embeds: [embed]});
}

async function refreshReactions(msg, args) {
    const ret = await editMessageWithButtons(msg, args[2]);
    if (ret)
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
            args: ["<name>"],
            description: "Refresh a reaction system",
            execute: refreshReactions,
        },
        status:  {
            args: ["<name>"],
            description: "Gets status of a reaction system",
            execute: systemStatus,
        },
    }
};
