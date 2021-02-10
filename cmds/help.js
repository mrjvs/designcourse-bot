const { PREFIX } = process.env;
const cmds = require("./index");
const { sendError } = require("../helpers/embed");

function getHelp(cmd) {
    let usage = "";
    if (cmd.subCommands) {
        usage += "\n"
        Object.keys(cmd.subCommands).forEach(sub => {
            let subCmd = cmd.subCommands[sub];
            usage += `\`${PREFIX}${cmd.cmd} ${sub} ${subCmd.args.join(" ")}\`${subCmd.description ? " - " + subCmd.description : ""}\n`
        })
    }
    return `**${PREFIX}${cmd.cmd}** ${cmd.admin ? "(need admin)" : ""}\n${cmd.description}\n${usage}`
}

module.exports = {
    cmd: "help",
    admin: false,
    execute: (msg, args) => {
        let description;
        let title = "Help"
        if (args[1]) {
            const theCmd = cmds.find(cmd=>cmd.cmd==args[1]);
            if (!theCmd) {
                sendError(msg.channel, "Can't find that command");
                return
            }
            title = "Help for " + PREFIX + theCmd.cmd;
            description = getHelp(theCmd);
        }
        else {
            description = cmds.map(v=>getHelp(v)).join("\n");
        }
        msg.channel.send({embed: {
            color: 1752220,
            title,
            description
        }});
    }
};
