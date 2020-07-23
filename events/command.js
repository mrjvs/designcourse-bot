const { PREFIX } = process.env;
const { sendError } = require("../helpers/embed");
let cmds = require("../cmds");
cmds = [...cmds, require("../cmds/help")];

function messageHandler(msg) {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.split(" ");
    args[0] = args[0].slice(PREFIX.length);

    const theCmd = cmds.find(cmd => cmd.cmd == args[0]);
    if (!theCmd) return;

    if (theCmd.admin) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            sendError(msg.channel, "Whoops, you don't have access to that command!");
            return
        }
    }

    try {
        if (!theCmd.subCommands) {
            theCmd.execute(msg, args);
            return
        }
        let theSubCmd = Object.keys(theCmd.subCommands).find(sub=>sub==args[1]);
        if (!theSubCmd){
            sendError(msg.channel, "That subcommand doesn't exist!");
            return
        }
        theSubCmd = theCmd.subCommands[theSubCmd];
        theSubCmd.execute(msg, args);
    } catch (e) {
        console.error(e);
        sendError(msg.channel, "Whoops, Something went wrong when running this command!");
    }
}

module.exports = {
    messageHandler
}