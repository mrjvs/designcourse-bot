const fs = require("fs");

const file = "./store";
let cache;

function setMessage(guildId, msgid) {
    let data = getStore();
    if (!data.reaction)
        data.reaction = {}
    if (!data.reaction[guildId]) {
        data.reaction[guildId] = {
            reactions: {}
        }
    }
    data.reaction[guildId].id = msgid;
    setStore(data);
}

function setChannel(guildId, channelId) {
    let data = getStore();
    if (!data.reaction)
        data.reaction = {}
    if (!data.reaction[guildId]) {
        data.reaction[guildId] = {
            reactions: {}
        }
    }
    data.reaction[guildId].channel = channelId;
    setStore(data);
}

function addReaction(guildId, emojiId, roleId) {
    let data = getStore();
    if (!data.reaction)
        data.reaction = {}
    if (!data.reaction[guildId]) {
        data.reaction[guildId] = {
            reactions: {}
        }
    }
    data.reaction[guildId].reactions[emojiId] = roleId;
    setStore(data);
}

function removeReaction(guildId, emojiId) {
    let data = getStore();
    if (!data.reaction)
        data.reaction = {}
    if (!data.reaction[guildId]) {
        data.reaction[guildId] = {
            reactions: {}
        }
    }
    data.reaction[guildId].reactions[emojiId] = undefined;
    setStore(data);
}

function hasMessage(guildId) {
    let data = getStore();
    if (!data.reaction)
        return false;
    if (!data.reaction[guildId])
        return false;
    return true;
}

function getStore() {
    if (cache)
        return {...cache};
    if (fs.existsSync(file))
        return JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
    return {}
}

function setStore(s) {
    fs.writeFileSync(file, JSON.stringify(s));
    cache = {...s};
}

module.exports = {
    setMessage,
    addReaction,
    removeReaction,
    hasMessage,
    setChannel,
    getStore
};
