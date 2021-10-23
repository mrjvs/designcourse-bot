const { MAX_JOINS, ROLE_TIMEOUT, INVITE } = process.env;
const { get } = require("../helpers/storage");

let throttle = {}
let throttleUsers = {}
let timeouts = {};

const interval = setInterval(() => {
    throttle = {};
    throttleUsers = {};
}, 60*1000);

async function onJoin(usr) {
    if (await get("throttle.status", usr.guild.id))
        await doThrottle(usr);
    if (await get("timeout.status", usr.guild.id))
        startRoleTimer(usr.guild.id, usr);
}

async function doThrottle(usr) {
    if (!throttle[usr.guild.id])
        throttle[usr.guild.id] = 0;
    if (!throttleUsers[usr.guild.id])
        throttleUsers[usr.guild.id] = [];
    if (!throttleUsers[usr.guild.id].includes(usr.id))
        throttle[usr.guild.id]++;
    if (throttle[usr.guild.id] <= parseInt(MAX_JOINS)) {
        if (!throttleUsers[usr.guild.id].includes(usr.id))
            throttleUsers[usr.guild.id].push(usr.id);
        return
    }
    await kickThrottledUser(usr);
}

function startRoleTimer(guildId, usr) {
    if (!timeouts[guildId])
        timeouts[guildId] = {};
    if (timeouts[guildId][usr.id])
        clearTimeout(timeouts[guildId][usr.id]);
    timeouts[guildId][usr.id] = setTimeout(async () => {
        delete timeouts[guildId][usr.id];
        try {
            const user = await usr.fetch();
            if (user.roles.cache.array().length > 1)
                return;
            await kickTimeoutUser(user);
        } catch (e) {}
    }, parseInt(ROLE_TIMEOUT));
}

async function kickThrottledUser(usr) {
    try {
        const throttleChannel = await get("throttle.logChannel", usr.guild.id);
        if (throttleChannel)
            await usr.client.guilds.cache.get(usr.guild.id).channels.cache.get(throttleChannel).send({embed:{
                color: 1752220,
                title: "Throttled!",
                description: `user: ${usr.user.tag} (${usr.id})`,
                timestamp: new Date()
            }});
    } catch (e) {}
    try {
        await usr.send(`Hey ${usr.user.username},\n\nDesignCourse is currently experiencing a lot of joins at once.\nIn this case we limit the speed at which people join.\n**Please wait 1 minute**, then you can join again with this invite link: ${INVITE}\n\nThank you for your patience\n - The Designcourse Mod team`);
    } catch (e) {}
    try {
        await usr.kick("User join got throttled!");
    } catch (e) {}
}

async function kickTimeoutUser(usr) {
    try {
        const timeoutChannel = await get("timeout.logChannel", usr.guild.id)
        if (timeoutChannel)
            await usr.client.guilds.cache.get(usr.guild.id).channels.cache.get(timeoutChannel).send({embed:{
                color: 1752220,
                title: "Timed out!",
                description: `user: ${usr.user.tag} (${usr.id})`,
                timestamp: new Date()
            }});
    } catch (e) {}
    try {
        await usr.send(`Hey ${usr.user.username},\n\nYou're taking a long time to choose your role, we've kicked you from the server but you can join back with this invite: ${INVITE}\nIf you're having trouble with the role system. Consider sending one of us a message.\n - The Designcourse Mod team`); 
    } catch (e) {}
    try {
        await usr.kick("User got timed out!");
    } catch (e) {}
}

function getThrottleData() {
    return {
        throttle,
        throttleUsers
    }
}

module.exports = {
    onJoin,
    getThrottleData,
    kickTimeoutUser,
    kickThrottledUser
};
