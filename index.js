require('dotenv').config();
const { Client, Intents  } = require('discord.js');
const client = new Client({ partials: ['REACTION', 'MESSAGE', 'USER'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const { initGuild, handleReactionAdd, handleReactionRemove, handleReactionRemoveAll } = require("./events/collector");
const { getAllGuilds } = require("./helpers/storage")
const { onJoin } = require("./events/join")
const { TOKEN } = process.env;
const { messageHandler } = require("./events/command");
const { handleInteractionCreate } = require('./events/buttons');

if (["TOKEN", "MAX_JOINS", "PREFIX", "INVITE", "ROLE_TIMEOUT"].reduce((p,v) => p ? p : typeof process.env[v] === "undefined", false)) {
    console.error("Missing env variables, exiting");
    process.exit(1);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guilds = getAllGuilds();
    guilds.forEach(async g => {
        initGuild(client, g);
    })
});

client.on('messageCreate', messageHandler);
client.on('interactionCreate', handleInteractionCreate);
client.on("messageReactionAdd", handleReactionAdd);
client.on("messageReactionRemove", handleReactionRemove);
client.on("messageReactionRemoveAll", handleReactionRemoveAll);

client.on("guildMemberAdd", onJoin);

client.login(TOKEN);
