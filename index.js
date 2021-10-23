const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE', 'USER'] });
const { initGuild, handleReactionAdd, handleReactionRemove, handleReactionRemoveAll } = require("./events/collector");
const { getAllGuilds } = require("./helpers/storage")
const { onJoin } = require("./events/join")
const { TOKEN } = process.env;
const { messageHandler } = require("./events/command");

let missing = ["TOKEN", "MAX_JOINS", "PREFIX", "INVITE", "ROLE_TIMEOUT", "MONGODB_URI"].filter(envVar => typeof process.env[envVar] === "undefined")

if (missing.length !== 0) {
    console.error(`Missing env variables (${missing.join(", ")}), exiting`)
    process.exit(1)
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guilds = await getAllGuilds();
    guilds.forEach(async g => {
        initGuild(client, g._id);
    })
});

client.on('message', messageHandler);

client.on("messageReactionAdd", handleReactionAdd);
client.on("messageReactionRemove", handleReactionRemove);
client.on("messageReactionRemoveAll", handleReactionRemoveAll);

client.on("guildMemberAdd", onJoin);

client.login(TOKEN);
