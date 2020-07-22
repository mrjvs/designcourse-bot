const { prefix } = require("../config.json");

const content = (p)=>`
**REACTION**
\`${p}reaction refresh\` - refresh emoji checker, in case its broken
\`${p}reaction set <messageid>\` - set message id on which to listen
\`${p}reaction add <emojiid> <roleid>\` - add emoji to the role list
\`${p}reaction remove <emojiid>\` - remove emoji from the rolel list
\`${p}reaction channel <channelid>\` - set channel id where the message is from

**THROTTLE**
\`${p}throttle status\` - get throttle status
\`${p}throttle channel\` - sets channel on which to log
\`${p}throttle enable\`
\`${p}throttle disable\`

**TIMEOUT**
\`${p}timeout status\` - get timeout status
\`${p}timeout channel\` - sets channel on which to log
\`${p}timeout enable\`
\`${p}timeout disable\`
`

module.exports = {
    cmd: "help",
    admin: false,
    execute: (msg, args) => {
        msg.channel.send(content(prefix));
    }
};
