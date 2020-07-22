const { getTimeoutStatus, setTimeoutStatus, setTimeoutChannel, getTimeoutChannel } = require("../helpers/storage");

function gettTimeoutStatus(msg) {
    msg.channel.send(`Timeout status: ${getTimeoutStatus(msg.guild.id) ? "Enabled" : "Disabled"}!\nTimeout channel: <#${getTimeoutChannel(msg.guild.id)}>`);
}

function settTimeoutStatus(msg, _, bool) {
    setTimeoutStatus(msg.guild.id, bool);
    msg.channel.send("Timeout status has been set to: " + (bool ? "Enabled" : "Disabled"));
}

function settTimeoutChannel(msg, args) {
    setTimeoutChannel(msg.guild.id, args[2]);
    msg.channel.send("Timeout channel has been set to: <#" + args[2] + ">!");
}

module.exports = {
    cmd: "timeout",
    admin: true,
    execute: (msg, args) => {
        if (args[1] == "status") gettTimeoutStatus(msg, args);
        else if (args[1] == "enable") settTimeoutStatus(msg, args, true);
        else if (args[1] == "disable") settTimeoutStatus(msg, args, false);
        else if (args[1] == "channel") settTimeoutChannel(msg, args);
        else {
            msg.channel.send("That's not how you use this command")
        }
    }
};
