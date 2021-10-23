const { set } = require("../helpers/storage");
const { sendSuccess } = require("../helpers/embed");
const {getGuildOrNew} = require("../helpers/db");

async function getThrottleStatus(msg) {
    const dbGuild = await getGuildOrNew(msg.guild.id)
    const guildThrottle = dbGuild.throttle
    sendSuccess(msg.channel, `Throttle status: ${guildThrottle.enabled ? "Enabled" : "Disabled"}!\nThrottle channel: <#${guildThrottle.logChannel}>`);
}

async function setThrottleStatus(msg, _, bool) {
    await set("throttle.status", msg.guild.id, bool)
    sendSuccess(msg.channel, "Throttle status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

async function setThrottleChannel(msg, args) {
    await set("throttle.channel", msg.guild.id, args[2])
    sendSuccess(msg.channel, "Throttle channel has been set to: <#" + args[2] + ">!");
}

module.exports = {
    cmd: "throttle",
    admin: true,
    description: "Throttle user joins",
    subCommands: {
        status: {
            args: [],
            description: "Get Throttle status",
            execute: getThrottleStatus
        },
        channel: {
            args: ["<channelId>"],
            description: "Set channel to log throttles in",
            execute: setThrottleChannel
        },
        enable: {
            args: [],
            description: "Enable throttling",
            execute: (msg, args) => setThrottleStatus(msg, args, true)
        },
        disable: {
            args: [],
            description: "Disable throttling",
            execute: (msg, args) => setThrottleStatus(msg, args, false)
        }
    }
};
