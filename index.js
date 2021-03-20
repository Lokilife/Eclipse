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

const connection = typeorm.createConnection({
    type: "mongodb",
    url: config.mongo_uri,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    entities: [
        require("./models/custom"),
        require("./models/guilds"),
        require("./models/private-voices"),
        require("./models/custom-commands"),
        require("./models/role-reactions-settings")
    ]
});
module.exports.connection = connection;

client.login(config.token);