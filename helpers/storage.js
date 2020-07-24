const fs = require("fs");

const file = "./store/db.json";
let cache;

/*
guilddata: {
    reactions: {
        message: MESSAGE_ID,
        channel: CHANNEL_ID,
        reactions: {} KEY:VALUE - EMOJI_ID:ROLE_ID
    },
    throttle: {
        status: BOOLEAN,
        log_channel: CHANNEL_ID
    },
    timeout: {
        status: BOOLEAN,
        log_channel: CHANNEL_ID
    }
}
*/

function getFollowPath(obj, parts) {
    if (parts.length == 0)
        return obj;
    
    if (typeof obj[parts[0]] === "undefined")
        return undefined;
    obj = obj[parts[0]];
    parts.shift();
    return getFollowPath(obj, parts);
}

function setFollowPath(obj, parts, value) {
    if (parts.length == 1) {
        obj[parts] = value;
        return
    }

    if (typeof obj[parts[0]] === "undefined")
        obj[parts[0]] = {};
    obj = obj[parts[0]];
    parts.shift();
    setFollowPath(obj, parts, value);
}

function get(path, guildId) {
    data = getStore();
    if (!data[guildId])
        data[guildId] = {};
    return getFollowPath(data[guildId], path.split("."));
}

function set(path, guildId, value) {
    data = getStore();
    if (!data[guildId])
        data[guildId] = {};
    setFollowPath(data[guildId], path.split("."), value);
    setStore(data);
    return true;
}

function getAllGuilds() {
    const data = getStore();
    return Object.keys(data);
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
    get,
    set,
    getAllGuilds
};
