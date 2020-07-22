const { max_joins, role_timeout } = require("./config.json");
const { getThrottleStatus, getTimeoutStatus } = require("./helpers/storage");

let throttle = {}
let throttleUsers = {}

const interval = setInterval(() => {
    throttle = {};
    throttleUsers = {};
}, 60*1000);

function onJoin(usr) {
    if (getThrottleStatus(usr.guild.id))
        doThrottle(usr);
    if (getTimeoutStatus(usr.guild.id))
        startRoleTimer(usr);
}

async function doThrottle(usr) {
    if (!throttle[usr.guild.id])
        throttle[usr.guild.id] = 0;
    if (!throttleUsers[usr.guild.id])
        throttleUsers[usr.guild.id] = [];
    if (!throttleUsers[usr.guild.id].includes(usr.id))
        throttle[usr.guild.id]++;
    if (throttle[usr.guild.id] <= max_joins) {
        if (!throttleUsers[usr.guild.id].includes(usr.id))
            throttleUsers[usr.guild.id].push(usr.id);
        return
    }
    await kickThrottledUser(usr);
}

function startRoleTimer(usr) {
    setTimeout(async () => {
        const user = await usr.fetch();
        if (user.roles.cache.array().length > 1)
            return;
        kickTimeoutUser(user);
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
    console.log("User got Timed out");
    try {
        await usr.send("Your role choosing got timedout!"); 
    } catch (e) {}
    try {
        await usr.kick("User got timedout!");
    } catch (e) {}
}

module.exports = {
    onJoin,
    doThrottle
};
