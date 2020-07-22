function sendSuccess(channel, txt, title = "Success!") {
    channel.send({embed: {
        color: 3066993,
        title,
        description: txt
    }});
}

function sendError(channel, txt, title = "Error!") {
    channel.send({embed: {
        color: 15158332,
        title,
        description: txt
    }});
}

module.exports = {
    sendSuccess,
    sendError
};
