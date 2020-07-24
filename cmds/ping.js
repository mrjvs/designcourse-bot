module.exports = {
    cmd: "ping",
    admin: false,
    execute(msg, args) => {
       message.channel.send(`**Pong! ${client.ws.ping}`);
    }
}
