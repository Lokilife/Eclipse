const discord = require("discord.js");
const Client = require("./lib/client");
const config = require("./config.json");
const typeorm = require("typeorm");
const chalk = require("chalk");
const version = require("./package.json").version;

console.log(chalk.yellow(
    `Добро пожаловать в Eclipse!
        Версия: ${version}.
        Разработчики: [ElectroPlayer]#0256, Lokilife#7962.
        Версия Node.JS: ${process.version}.
        Версия Discord.JS: ${discord.version}.`));

const client = new Client(
    {
        ws: {
            intents: discord.Intents.ALL
        },
        partials: [
            "MESSAGE",
            "REACTION",
            "CHANNEL",
            "GUILD_MEMBER",
            "USER"
        ],
        commandsEnabled: true,
        commandsDir: "commands",
        listenersDir: "listeners"
    }
);

client.loadAll();
client.on("ready", async () => { // Вызов setup у каждого листенера
    for (const listener of client.listenersObjects)
        if (typeof listener.setup == "function")
            listener.setup(client)
});
client.login(config.token);