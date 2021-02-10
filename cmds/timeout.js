const { get, set } = require("../helpers/storage");
const { sendSuccess } = require("../helpers/embed");

function getTimeoutStatus(msg) {
    sendSuccess(msg.channel, `Timeout status: ${get("timeout.status", msg.guild.id) ? "Enabled" : "Disabled"}!\nTimeout channel: <#${get("timeout.channel", msg.guild.id)}>`);
}

function setTimeoutStatus(msg, _, bool) {
    set("timeout.status", msg.guild.id, bool);
    sendSuccess(msg.channel, "Timeout status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

function setTimeoutChannel(msg, args) {
    set("timeout.channel", msg.guild.id, args[2]);
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
