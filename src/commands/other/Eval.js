module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} client 
     * @param {Array<String>} args 
     */
    "run": async function (message, client, args) {
        const code = args.join(" ").replace(/(```(\w+)?)/g, "").trim();
        try {
            message.channel.send(
                "```js\n" +
                `Result: "${await eval(code)}"\n` +
                "```"
            );
        } catch (e) {
            message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
        }
    },
    "aliases": ["eval"],
    "ownerOnly": true,
    "help": {
        "category": "Owners",
        "description": "Просто eval, чё те ещё надо!?",
        "arguments": `Запрещено!`,
        "usage": `Запрещено!`
    },
    "botPermissions": [],
    "userPermissions": []
}