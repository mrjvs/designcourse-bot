const { get } = require("../helpers/storage");
const { reactionSystemReady } = require("../helpers/reaction");
const {getGuildOrNew} = require("../helpers/db");

// add reaction message to cache and refresh emojis
async function initGuild(client, guildId) {
    const dbGuild = await getGuildOrNew(guildId)
    let roleSystems = dbGuild.roleSystems;
    if (!roleSystems) roleSystems = {};
    const guild = client.guilds.cache.get(guildId);
    if (!guild)
        return false;
    const systems = Object.keys(roleSystems);
    for (let i = 0; i < systems.length; i++) {
        const system = roleSystems[systems[i]];
        if (!await reactionSystemReady(guildId, systems[i])) continue;
        try {
            await addNewReactions(guild, system);
        } catch (err) {};
    }
}

async function addNewReactions(guild, system) {

    const channel = guild.channels.cache.get(system.channel);
    let message = await channel.messages.fetch(system.message, true);
    let client = message.client;
    let emojis = Object.keys(system.reactions ? system.reactions : {}).filter(e=>!!e);

    message.reactions.cache.forEach((v) => {
        if (emojis.indexOf(v._emoji.id) == -1)
            return
        if (v.users.cache.has(client.user.id))
            emojis = emojis.filter(e=>e!=v._emoji.id)
    });


    await Promise.all(emojis.map(e=>message.react(e)));
}

async function handleReactionToggle(rct, usr, addRole) {
    if (rct.partial)
        rct = await rct.fetch();
    const guildId = rct.message.guild.id;
    const messageId = rct.message.id;

    if (!rct._emoji.id)
        return false

    if (usr.bot)
        return false

    const dbGuild = await getGuildOrNew(guildId)
    let roleSystems = dbGuild.roleSystems;
    const foundSystemName = Object.keys(roleSystems).find(v=>roleSystems[v].message===messageId);
    if (!foundSystemName || !await reactionSystemReady(guildId, foundSystemName))
        return false

    const roleId = roleSystems[foundSystemName].reactions[rct._emoji.id];
    if (!roleId)
        return false;

    const member = await rct.message.guild.members.fetch({ user: usr.id, force: true });
    const hasRole = member.roles.cache.has(roleId);

    if (addRole && !hasRole)
        await member.roles.add(roleId);
    else if (!addRole && hasRole)
        await member.roles.remove(roleId);
    return true;
}

async function handleReactionAdd(rct, usr) {
    try {
        await handleReactionToggle(rct, usr, true);
    } catch (err) {}
}

async function handleReactionRemove(rct, usr) {
    try {
        await handleReactionToggle(rct, usr, false);
    } catch (e) {}
}
async function handleReactionRemoveAll(msg) {

}

module.exports = {
    handleReactionAdd,
    handleReactionRemove,
    handleReactionRemoveAll,
    initGuild,
    addNewReactions
}
