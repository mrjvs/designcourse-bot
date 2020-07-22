const Discord = require('discord.js');
const client = new Discord.Client();
const { initGuild, handleReactionAdd, handleReactionRemove, handleReactionRemoveAll } = require("./collector");
const { getStore } = require("./helpers/storage")
const { onJoin } = require("./join")
const { token, prefix } = require("./config.json")

const cmds = require("./cmds");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const store = getStore();
    if (!store.reaction)
        return;
    const guild = Object.keys(store.reaction);
    guild.forEach(async g => {
        await initGuild(client, g);
    })
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    
    const args = msg.content.split(" ");
    args[0] = args[0].slice(prefix.length);

    const theCmd = cmds.find(cmd => cmd.cmd == args[0]);
    if (!theCmd) return;
    theCmd.execute(msg, args);
});

client.on("messageReactionAdd", handleReactionAdd);
client.on("messageReactionRemove", handleReactionRemove);
client.on("messageReactionRemoveAll", handleReactionRemoveAll);

client.on("guildMemberAdd", onJoin);

client.login(token);
