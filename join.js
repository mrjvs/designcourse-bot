const { max_joins, role_timeout } = require("./config.json");

let throttle = {}

const interval = setInterval(() => {
    throttle = {};
}, 60*1000);

function onJoin(usr) {
    doThrottle(usr);
    startRoleTimer(usr);
}

async function doThrottle(usr) {
    if (!throttle[usr.guild.id])
        throttle[usr.guild.id] = 0;
    throttle[usr.guild.id]++;
    if (throttle[usr.guild.id] <= max_joins)
        return
    await kickThrottledUser();
}

function startRoleTimer(usr) {
    setTimeout(() => {
        if (usr.roles.cache.length > 0)
            return;
        kickTimeoutUser(usr);
    }, role_timeout);
}

async function kickThrottledUser(usr) {
    console.log("User got throttled!");
    try {
        await usr.send("Your join got throttled!");
    } catch (e) {}
    try {
        await usr.kick("User join got throttled!");
    } catch (e) {}
}

async function kickTimeoutUser(usr) {
    console.log("User got Throttled");
    try {
        await usr.send("Your role choosing got timedout!"); 
    } catch (e) {}
    try {
        await usr.kick("User got timedout!");
    } catch (e) {}
}

module.exports = {
    onJoin
};
