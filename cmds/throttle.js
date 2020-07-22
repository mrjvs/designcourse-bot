const { doThrottle } = require("../join");
const { getThrottleStatus, setThrottleStatus } = require("../helpers/storage");

function triggerThrottle(msg) {
    msg.channel.send("Triggering throttle!");
    for (let i = 0; i < 5; i++) {
        doThrottle(msg.member);
    }
}

function gettThrottleStatus(msg) {
    msg.channel.send("Throttle status: " + (getThrottleStatus(msg.guild.id) ? "Enabled" : "Disabled"));
}

function settThrottleStatus(msg, _, bool) {
    setThrottleStatus(msg.guild.id, bool);
    msg.channel.send("Throttle status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

module.exports = {
    cmd: "throttle",
    execute: (msg, args) => {
        if (args[1] == "trigger") triggerThrottle(msg, args);
        else if (args[1] == "status") gettThrottleStatus(msg, args);
        else if (args[1] == "enable") settThrottleStatus(msg, args, true);
        else if (args[1] == "disable") settThrottleStatus(msg, args, false);
        else {
            msg.channel.send("That's not how you use this command")
        }
    }
};
