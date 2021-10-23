async function isToggleReaction(interaction) {
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

function handleInteractionCreate(interaction) {
    console.log(interaction);
}

module.exports = {
    handleInteractionCreate,
};
