const { max_joins, role_timeout, invite } = require("../config.json");
const { get } = require("../helpers/storage");

let throttle = {}
let throttleUsers = {}

const interval = setInterval(() => {
    throttle = {};
    throttleUsers = {};
}, 60*1000);

function onJoin(usr) {
    if (get("throttle.status", usr.guild.id))
        doThrottle(usr);
    if (get("timeout.status", usr.guild.id))
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
    try {
        if (get("throttle.channel", usr.guild.id))
            await usr.client.guilds.cache.get(usr.guild.id).channels.cache.get(get("throttle.channel", usr.guild.id)).send(`**User got throttled:**\nuser: ${usr.user.tag} (${usr.id})`);
    } catch (e) {}
    try {
        await usr.send(`Hey ${usr.user.username},\n\nDesignCourse is currently experiencing a lot of joins at once.\nIn this case we limit the speed at which people join.\n**Please wait 1 minute**, then you can join again with this invite link: ${invite}\n\nThank you for your patience\n - The Designcourse Mod team`);
    } catch (e) {}
    try {
        await usr.kick("User join got throttled!");
    } catch (e) {}
}

async function kickTimeoutUser(usr) {
    try {
        if (get("timeout.channel", usr.guild.id))
            await usr.client.guilds.cache.get(usr.guild.id).channels.cache.get(get("timeout.channel", usr.guild.id)).send(`**User got timed out:**\nuser: ${usr.user.tag} (${usr.id})`);
    } catch (e) {}
    try {
        await usr.send(`Hey ${usr.user.username},\n\nYou're taking a long time to choose your role, we've kicked you from the server but you can join back with this invite: ${invite}\nIf you're having trouble with the role system. Consider sending one of us a message.\n - The Designcourse Mod team`); 
    } catch (e) {}
    try {
        await usr.kick("User got timed out!");
    } catch (e) {}
}

module.exports = {
    onJoin,
    doThrottle
};