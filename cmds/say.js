const { sendError } = require("../helpers/embed");

function removeArgs(content, args, count = 1) {
    // remove prefix
    let startIndex = process.env.PREFIX.length;
    for (let i = 0; i < count; i++) {
        startIndex += args[i].length;
        while (content[startIndex] == " ") startIndex++;
    }
    return content.slice(startIndex);
}

module.exports = {
    cmd: "say",
    admin: true,
    description: "Make the bot send a message",
    subCommands: {
        embed: {
            args: ["<embed json>"],
            description: "Send an embed",
            async execute(msg, args) {
                try {
                    json = JSON.parse(removeArgs(msg.content, args, 2));
                    await msg.channel.send({
                        embed: json,
                    })
                } catch (err) {
                    sendError(msg.channel, "Failed to send")
                    return;
                }
            }
        },
        text: {
            args: ["<text>"],
            description: "send text",
            async execute(msg, args) {
                try {
                    await msg.channel.send(removeArgs(msg.content, args, 2), {
                        disableMentions: "all"
                    })
                } catch (err) {
                    sendError(msg.channel, "Failed to send")
                    return;
                }
            }
        },
        editembed: {
            args: ["<message id>", "<embed json>"],
            description: "Edit a message with an embed",
            async execute(msg, args) {
                try {
                    let message = await msg.channel.messages.fetch(args[2]);
                    await message.edit({
                        embed: JSON.parse(removeArgs(msg.content, args, 3))
                    })
                } catch (err) {
                    sendError(msg.channel, "Failed to edit message")
                    return;
                }
            }
        },
        edittext: {
            args: ["<message id>", "<text>"],
            description: "Edit a message with some text",
            async execute(msg, args) {
                try {
                    let message = await msg.channel.messages.fetch(args[2]);
                    await message.edit(removeArgs(msg.content, args, 3), {
                        disableMentions: "all"
                    })
                } catch (err) {
                    sendError(msg.channel, "Failed to edit message")
                    return;
                }
            }
        }
    },
}