const { get } = require("../helpers/storage");
const { reactionSystemReady } = require("../helpers/reaction");

// add reaction message to cache and refresh emojis
async function initGuild(client, guildId) {
    let reactions = get("roles.systems", guildId);
    if (!reactions) reactions = {};
    const guild = client.guilds.cache.get(guildId);
    if (!guild)
        return false;
    const systems = Object.keys(reactions);
    for (let i = 0; i < systems.length; i++) {
        const system = reactions[systems[i]];
        if (!reactionSystemReady(guildId, systems[i])) continue;
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
    console.log("reaction toggled")
    if (rct.partial)
        rct = await rct.fetch();
    const guildId = rct.message.guild.id;
    const messageId = rct.message.id;

    if (!rct._emoji.id)
        return false

    if (usr.bot)
        return false

    const systems = get("roles.systems", guildId);
    const foundSystemName = Object.keys(systems).find(v=>systems[v].message===messageId);
    if (!foundSystemName || !reactionSystemReady(guildId, foundSystemName))
        return false

    const roleId = systems[foundSystemName].reactions[rct._emoji.id];
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
