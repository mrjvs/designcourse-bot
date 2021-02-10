const { getThrottleData, kickTimeoutUser, kickThrottledUser } = require("../events/join");

module.exports = {
    cmd: "test",
    admin: true,
    description: "For testing purposes, don't run it",
    execute: async (msg, args) => {
        if (args[1] == "1") {
            await kickTimeoutUser(msg.member);
        } else if (args[1] == "2") {
            await kickThrottledUser(msg.member);
        } else if (args[1] == "3") {
            const data = getThrottleData();
            msg.channel.send(`throttle: ${data.throttle[msg.guild.id] ? data.throttle[msg.guild.id] : 0}\nthrottle_user: ${JSON.stringify(data.throttleUsers[msg.guild.id] ? data.throttleUsers[msg.guild.id] : [])}`)
        } else {
            sendError(msg.channel, "Oof");
        }
    }
}