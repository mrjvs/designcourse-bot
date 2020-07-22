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

function getThrottleStatus(guildId) {
    let data = getStore();
    if (!data.throttle)
        return false;
    if (!data.throttle[guildId])
        return false;
    if (data.throttle[guildId] === true)
        return true;
    return false;
}

function setThrottleStatus(guildId, bool) {
    let data = getStore();
    if (!data.throttle)
        data.throttle = {};
    data.throttle[guildId] = bool;
    setStore(data);
}

function getThrottleChannel(guildId) {
    let data = getStore();
    if (!data.throttleChannel)
        return false;
    if (!data.throttleChannel[guildId])
        return false;
    return data.throttleChannel[guildId];
}

function setThrottleChannel(guildId, channelId) {
    let data = getStore();
    if (!data.throttleChannel)
        data.throttleChannel = {};
    data.throttleChannel[guildId] = channelId;
    setStore(data);
}

function getTimeoutChannel(guildId) {
    let data = getStore();
    if (!data.TimeoutChannel)
        return false;
    if (!data.TimeoutChannel[guildId])
        return false;
    return data.TimeoutChannel[guildId];
}

function setTimeoutChannel(guildId, channelId) {
    let data = getStore();
    if (!data.TimeoutChannel)
        data.TimeoutChannel = {};
    data.TimeoutChannel[guildId] = channelId;
    setStore(data);
}

function getTimeoutStatus(guildId) {
    let data = getStore();
    if (!data.timeout)
        return false;
    if (!data.timeout[guildId])
        return false;
    if (data.timeout[guildId] === true)
        return true;
    return false;
}

function setTimeoutStatus(guildId, bool) {
    let data = getStore();
    if (!data.timeout)
        data.timeout = {};
    data.timeout[guildId] = bool;
    setStore(data);
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
    getStore,
    setThrottleStatus,
    getThrottleStatus,
    setTimeoutStatus,
    getTimeoutStatus,
    setTimeoutChannel,
    getTimeoutChannel,
    setThrottleChannel,
    getThrottleChannel
};
