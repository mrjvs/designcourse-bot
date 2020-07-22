const { doThrottle } = require("../join");
const { getThrottleStatus, setThrottleStatus, setThrottleChannel, getThrottleChannel } = require("../helpers/storage");

function triggerThrottle(msg) {
    msg.channel.send("Triggering throttle!");
    for (let i = 0; i < 5; i++) {
        doThrottle(msg.member);
    }
}

function gettThrottleStatus(msg) {
    msg.channel.send(`Throttle status: ${getThrottleStatus(msg.guild.id) ? "Enabled" : "Disabled"}!\nThrottle channel: <#${getThrottleChannel(msg.guild.id)}>`);
}

function settThrottleStatus(msg, _, bool) {
    setThrottleStatus(msg.guild.id, bool);
    msg.channel.send("Throttle status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

function settThrottleChannel(msg, args) {
    setThrottleChannel(msg.guild.id, args[2]);
    msg.channel.send("Throttle channel has been set to: <#" + args[2] + ">!");
}

module.exports = {
    cmd: "throttle",
    admin: true,
    execute: (msg, args) => {
        if (args[1] == "trigger") triggerThrottle(msg, args);
        else if (args[1] == "status") gettThrottleStatus(msg, args);
        else if (args[1] == "enable") settThrottleStatus(msg, args, true);
        else if (args[1] == "disable") settThrottleStatus(msg, args, false);
        else if (args[1] == "channel") settThrottleChannel(msg, args);
        else {
            msg.channel.send("That's not how you use this command")
        }
    }
};
