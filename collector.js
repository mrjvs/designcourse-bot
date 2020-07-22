const { getStore, hasMessage } = require("./helpers/storage");

// add reaction message to cache and refresh emojis
async function initGuild(client, guildId) {
    const store = getStore();
    const reaction = store.reaction[guildId];
    if (!reaction.channel || !reaction.id)
        return false;
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(reaction.channel);
    await channel.messages.fetch(reaction.id);
    addNewReactions(guild);
}

async function addNewReactions(guild) {
    const store = getStore();
    const reaction = store.reaction[guild.id];
    if (!reaction.channel || !reaction.id)
        return false;
    const channel = guild.channels.cache.get(reaction.channel);
    let message = await channel.messages.cache.get(reaction.id);
    let client = message.reactions.client;

    let emojis = Object.keys(store.reaction[guild.id].reactions);

    message.reactions.cache.forEach((v)=> {
        if (emojis.indexOf(v._emoji.id) == -1)
            return
        if (v.users.cache.has(client.user.id))
            emojis = emojis.filter(e=>e!=v._emoji.id)
    });

    emojis.forEach(e=>message.react(e));
}

async function handleReactionToggle(rct, usr, addRole) {
    const guildId = rct.message.channel.guild.id;
    const messageId = rct.message.id;

    if (usr.bot)
        return false

    if (!hasMessage(guildId))
        return false

    const store = getStore();
    if (store.reaction[guildId].id !== messageId)
        return false

    if (!rct._emoji.id)
        return false;
    const roleId = store.reaction[guildId].reactions[rct._emoji.id];
    if (!roleId)
        return false;

    const member = rct.message.channel.guild.members.cache.get(usr.id);
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
    addNewReactions(rct.message.channel.guild);
}
async function handleReactionRemoveAll(msg) {
    addNewReactions(msg.channel.guild);
}

module.exports = {
    handleReactionAdd,
    handleReactionRemove,
    handleReactionRemoveAll,
    initGuild,
    addNewReactions
}
