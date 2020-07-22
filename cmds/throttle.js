const { get, set } = require("../helpers/storage");
const { sendSuccess } = require("../helpers/embed");

function getThrottleStatus(msg) {
    sendSuccess(msg.channel, `Throttle status: ${get("throttle.status", msg.guild.id) ? "Enabled" : "Disabled"}!\nThrottle channel: <#${get("throttle.channel", msg.guild.id)}>`);
}

function setThrottleStatus(msg, _, bool) {
    set("throttle.status", msg.guild.id, bool)
    sendSuccess(msg.channel, "Throttle status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

function setThrottleChannel(msg, args) {
    set("throttle.channel", msg.guild.id, args[2])
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
