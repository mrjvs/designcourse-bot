const { set, get} = require("../helpers/storage");
const { sendSuccess, sendError} = require("../helpers/embed");
const {getGuildOrNew} = require("../helpers/db");

async function getThrottleStatus(msg) {
    const guildThrottle = await get("throttle", msg.guild.id) || {}
    sendSuccess(msg.channel, `Throttle status: ${guildThrottle.enabled ? "Enabled" : "Disabled"}!\nThrottle channel: <#${guildThrottle.logChannelId}>`);
}

async function setThrottleStatus(msg, _, bool) {
    await set("throttle.enabled", msg.guild.id, bool)
    sendSuccess(msg.channel, "Throttle status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

async function setThrottleChannel(msg, args) {
    await set("throttle.logChannelId", msg.guild.id, args[2])
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
