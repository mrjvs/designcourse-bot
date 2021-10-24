const { get, set } = require("../helpers/storage");
const { sendSuccess } = require("../helpers/embed");
const {getGuildOrNew} = require("../helpers/db");

async function getTimeoutStatus(msg) {
    const guildTimeout = await get("timeout", msg.guild.id) || {}
    sendSuccess(msg.channel, `Timeout status: ${guildTimeout.enabled ? "Enabled" : "Disabled"}!\nTimeout channel: <#${guildTimeout.logChannelId}>`);
}

async function setTimeoutStatus(msg, _, bool) {
    await set("timeout.enabled", msg.guild.id, bool);
    sendSuccess(msg.channel, "Timeout status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

async function setTimeoutChannel(msg, args) {
    await set("timeout.logChannelId", msg.guild.id, args[2]);
    sendSuccess(msg.channel, "Timeout channel has been set to: <#" + args[2] + ">!");
}

module.exports = {
    cmd: "timeout",
    admin: true,
    description: "Timeout users that don't get a role after a certain amount of time",
    subCommands: {
        status: {
            args: [],
            description: "Get timeout status",
            execute: getTimeoutStatus
        },
        channel: {
            args: ["<channelId>"],
            description: "Set channel to log timeouts in",
            execute: setTimeoutChannel
        },
        enable: {
            args: [],
            description: "Enable timeouts",
            execute: (msg, args) => setTimeoutStatus(msg, args, true)
        },
        disable: {
            args: [],
            description: "Disable timeouts",
            execute: (msg, args) => setTimeoutStatus(msg, args, false)
        }
    }
};
