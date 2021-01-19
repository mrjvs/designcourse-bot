const { get } = require("../helpers/storage");
const { reactionsReady } = require("../helpers/reaction");

// add reaction message to cache and refresh emojis
async function initGuild(client, guildId) {
    const reaction = get("reactions", guildId);
    if (!reactionsReady(guildId))
        return false;
    const guild = client.guilds.cache.get(guildId);
    if (!guild)
        return false;
    const channel = guild.channels.cache.get(reaction.channel);
    await channel.messages.fetch(reaction.message);
    addNewReactions(guild);
}

async function addNewReactions(guild) {
    const reaction = get("reactions", guild.id);
    if (!reactionsReady(guild.id))
        return false;
    const channel = guild.channels.cache.get(reaction.channel);
    let message = await channel.messages.cache.get(reaction.message);
    let client = message.reactions.client;

    let emojis = Object.keys(reaction.reactions).filter(e=>!!e);

    message.reactions.cache.forEach((v) => {
        if (emojis.indexOf(v._emoji.id) == -1)
            return
        if (v.users.cache.has(client.user.id))
            emojis = emojis.filter(e=>e!=v._emoji.id)
    });

    emojis.forEach(e=>message.react(e));
}

async function handleReactionToggle(rct, usr, addRole) {
    if (rct.partial)
        rct = await rct.fetch();
    const guildId = rct.message.guild.id;
    const messageId = rct.message.id;

    if (usr.bot)
        return false

    if (!reactionsReady(guildId))
        return false

    const reaction = get("reactions", guildId);
    if (reaction.message !== messageId)
        return false

    if (!rct._emoji.id)
        return false;
    const roleId = reaction.reactions[rct._emoji.id];
    if (!roleId)
        return false;

    const member = await rct.message.guild.members.fetch(usr.id);
    const hasRole = member.roles.cache.has(roleId);
    
    if (addRole && !hasRole) {
        await member.roles.add(roleId);
    }
    else if (!addRole && hasRole) {
        await member.roles.remove(roleId);
    }
    return true;
}

async function handleReactionAdd(rct, usr) {
    await handleReactionToggle(rct, usr, true);
}

async function handleReactionRemove(rct, usr) {
    try {
        await handleReactionToggle(rct, usr, false);
    } catch (e) {}
    addNewReactions(rct.message.guild);
}
async function handleReactionRemoveAll(msg) {
    addNewReactions(msg.guild);
}

module.exports = {
    handleReactionAdd,
    handleReactionRemove,
    handleReactionRemoveAll,
    initGuild,
    addNewReactions
}
