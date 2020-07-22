const { getTimeoutStatus, setTimeoutStatus } = require("../helpers/storage");

function gettTimeoutStatus(msg) {
    msg.channel.send("Timeout status: " + (getTimeoutStatus(msg.guild.id) ? "Enabled" : "Disabled"));
}

function settTimeoutStatus(msg, _, bool) {
    setTimeoutStatus(msg.guild.id, bool);
    msg.channel.send("Timeout status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

module.exports = {
    cmd: "timeout",
    execute: (msg, args) => {
        if (args[1] == "status") gettTimeoutStatus(msg, args);
        else if (args[1] == "enable") settTimeoutStatus(msg, args, true);
        else if (args[1] == "disable") settTimeoutStatus(msg, args, false);
        else {
            msg.channel.send("That's not how you use this command")
        }
    }
};
