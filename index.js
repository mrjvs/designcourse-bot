require('dotenv').config();
const { Client, Intents  } = require('discord.js');
const client = new Client({ partials: ['REACTION', 'MESSAGE', 'USER'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES ] });
const { onJoin } = require("./events/join")
const { TOKEN } = process.env;
const { messageHandler } = require("./events/command");
const { handleInteractionCreate } = require('./events/buttons');

if (["TOKEN", "MAX_JOINS", "PREFIX", "INVITE", "ROLE_TIMEOUT"].reduce((p,v) => p ? p : typeof process.env[v] === "undefined", false)) {
    console.error("Missing env variables, exiting");
    process.exit(1);
}

function eventWrapper(eventWrapper) {
    return async (e) => {
        try {
            const data = eventWrapper(e);
            if (data instanceof Promise)
                await data;
        } catch (err) {
            console.error("Unhandled error", err);
        }
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', eventWrapper(messageHandler));
client.on('interactionCreate', eventWrapper(handleInteractionCreate));

client.on("guildMemberAdd", eventWrapper(onJoin));

client.login(TOKEN);
