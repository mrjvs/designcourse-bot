const Discord = require('discord.js');
const client = new Discord.Client();
const { initGuild, handleReactionAdd, handleReactionRemove, handleReactionRemoveAll } = require("./events/collector");
const { getAllGuilds } = require("./helpers/storage")
const { onJoin } = require("./events/join")
const { token } = require("./config.json")
const { messageHandler } = require("./events/command");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guilds = getAllGuilds();
    guilds.forEach(async g => {
        await initGuild(client, g);
    })
});

client.on('message', messageHandler);

client.on("messageReactionAdd", handleReactionAdd);
client.on("messageReactionRemove", handleReactionRemove);
client.on("messageReactionRemoveAll", handleReactionRemoveAll);

client.on("guildMemberAdd", onJoin);

client.login(token);
