const { get, set } = require("../helpers/storage");
const { sendSuccess } = require("../helpers/embed");
const {getGuildOrNew} = require("../helpers/db");

async function getTimeoutStatus(msg) {
    const dbGuild = await getGuildOrNew(msg.guild.id)
    const guildTimeout = dbGuild.timeout
    sendSuccess(msg.channel, `Timeout status: ${guildTimeout.enabled ? "Enabled" : "Disabled"}!\nTimeout channel: <#${guildTimeout.logChannel}>`);
}

async function setTimeoutStatus(msg, _, bool) {
    await set("timeout.status", msg.guild.id, bool);
    sendSuccess(msg.channel, "Timeout status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

async function setTimeoutChannel(msg, args) {
    await set("timeout.channel", msg.guild.id, args[2]);
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
