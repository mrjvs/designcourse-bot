function sendSuccess(channel, txt, title = "Success!") {
    channel.send({embeds: [{
        color: 3066993,
        title,
        description: txt
    }]}).catch(()=>false);
}

function sendError(channel, txt, title = "Error!") {
    channel.send({embeds: [{
        color: 15158332,
        title,
        description: txt
    }]}).catch(()=>false);
}

function wrapInteraction(interaction) {
    return {
        send(a) {
            interaction.reply({
                ...a,
                ephemeral: true,
            });
        }
    }
}

module.exports = {
    sendSuccess,
    sendError,
    wrapInteraction,
};
