const { wrapInteraction, sendSuccess } = require("../helpers/embed");
const { reactionSystemReady } = require("../helpers/reaction");
const { get } = require("../helpers/storage");

async function toggleReaction(interaction) {
    const parts = interaction.customId.split(":");
    const roleIdMsg = parts[2];
    const guildId = interaction.message.guildId;
    const messageId = interaction.message.id;
    const member = interaction.member;

    const systems = await get("roleSystems", guildId);
    const foundSystemName = Object.keys(systems).find(v=>systems[v].messageId===messageId);
    if (!foundSystemName || !await reactionSystemReady(guildId, foundSystemName))
        return false;

    const roleId = systems[foundSystemName].reactions[parts[1]];
    if (!roleId || roleId !== roleIdMsg)
        return false;

    const hasRole = member.roles.cache.has(roleId);

    if (!hasRole)
        await member.roles.add(roleId);
    else
        await member.roles.remove(roleId);
    return sendSuccess(wrapInteraction(interaction), hasRole ? 'Role has been removed' : 'Role has been added');
}

function getInteractionType(interaction) {
    const idParts = interaction.customId.split(":");
    if (idParts[0] === 'DCROLES') {
        if (idParts.length !== 3)
            return "unknown";
        return "roles"
    }
    return "unknown";
}

async function handleInteractionCreate(interaction) {
    if (interaction.isMessageComponent()) {
        const type = getInteractionType(interaction);
        if (type === "roles") {
            await toggleReaction(interaction);
            return;
        }
        return;
    }
}

module.exports = {
    handleInteractionCreate,
};
