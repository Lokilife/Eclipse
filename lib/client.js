/// <reference path="typings/index.d.ts" />
const discord   = require("discord.js"),
      chalk     = require("chalk"),
      fs        = require("fs"),
      { join }  = require("path"),
      config    = require("../config.json"),
      errors    = require("./commands/errors");

/**
 * Класс клиента который наследует класс клиента из Discord.JS.
 * Реализует такие мелочи как загрузчик команд, загрузчик событий,
 * а так-же имеет из под капота обработчик команд который
 * в случае чего можно отключить.
 * @extends {discord.Client}
 * @type {Client}
*/
module.exports = class Client extends discord.Client {
    /**
     * @param {ClientOptions} options
     */
    constructor(options = {}) {
        super(options);
        /**
         * Массив хранящий в себе все команды.
         * Не изменять! Может привести к последствиям
         * поправимыми только откатом кода и перезагрузкой.
         * @type {Array<Command>}
         */
        this.commands = [];

        /**
         * Путь к папке где расположены файлы с событиями.
         * @type {string}
         */
        this.listenersDir = join(__dirname, "..", options.listenersDir ? options.listenersDir : "listeners");

        this.commandsDir = join(__dirname, "..", options.commandsDir ? options.commandsDir : "commands");
        this._initCommandsHandler();
    }

    /**
     * Загружает все события и команды в папках путь к которым
     * указан в настройках клиента (client options)
     */
    loadAll() {
        console.log(chalk.cyan("[Загрузчик Событий] Инициализирована загрузка событий..."));
        this.loadListeners();
        console.log(chalk.cyan("[Загрузчик Событий] Все события успешно загружены!"));

        console.log(chalk.cyan("[Загрузчик Команд] Инициализирована загрузка команд..."));
        this.loadCommands();
        console.log(chalk.cyan("[Загрузчик Команд] Все команды успешно загружены!"));
    }

    /**
     * Загружает все события находящиеся в папке путь к которой указан
     * в настройках клиента (client options) или переданные методу.
     * @param {string} path
     */
    loadListeners(path = this.listenersDir) {
        for (let file of fs.readdirSync(path, {withFileTypes: true})) {
            if (file.isFile() && file.name.endsWith(".js"))
                try {
                    const listeners = require(`${path}/${file.name}`);
                    if (listeners instanceof Array)
                        for (const listener of listeners)
                            this.on(listener.name, listener.run.bind(null, this));
                    else
                        this.on(listeners.name, listeners.run.bind(null, this));

                    console.log(chalk.green(`+ ${file.name}`));
                } catch (e) {
                    console.log(chalk.red(`Не удалось загрузить событие ${file.name}\nОшибка: ${e}`));
                }
            if (file.isDirectory())
                this.loadListeners(`${path}/${file.name}`);
        }
    }
    /**
     * Загружает все команды находящиеся в папке в указанном пути
     * в настройках клиента (client options) и переданные методу.
     * @param {string} path
     */
    loadCommands(path = this.commandsDir) {
        for (let file of fs.readdirSync(path, {withFileTypes: true})) {
            if (file.isFile() && file.name.endsWith(".js"))
                try {
                    const command = require(`${path}/${file.name}`);
                    this.commands.push(command);
                    console.log(chalk.green(`+ ${file.name}`));
                } catch (e) {
                    console.log(chalk.red(`Не удалось загрузить команду ${file.name}.\nОшибка: ${e}`));
                }
            if (file.isDirectory())
                this.loadCommands(`${path}/${file.name}`);
        }
    }

    /**
     * Подключает обработчик команд в клиент.
     * Не рекомендовано использовать, если вы используете свой обработчик команд.
     * (Лишний обработчик события message, все дела).
     * @private
     */
    _initCommandsHandler() {
        this.on("message", async function(message) {
            if (message.author.bot || !message.content.startsWith(config.prefix) || message.channel.type === "dm") return;

            const messageArray = message.content.split(/\s+/g),
                  cmd          = messageArray[0].slice(config.prefix.length),
                  args         = messageArray.slice(1);

            for (const command of this.commands) {
                if (command.aliases.indexOf(cmd) !== -1) {
                    if (!message.member.permissions.has(command.userPermissions))
                        return this.emit("commandError", new errors.MissingPermissions(
                            "Missing Permissions", message, message.member,
                            command.userPermissions.filter((p)=>message.member.permissions.has(p))));

                    if (!message.guild.me.permissions.has(command.botPermissions))
                        return this.emit("commandError", new errors.BotMissingPermissions(
                            "Bot don't have needed permissions", message, message.member,
                            command.userPermissions.filter((p)=>message.guild.me.permissions.has(p))));

                    if (command.ownerOnly && !config.owners.includes(message.author.id))
                        return this.emit("commandError", new errors.NotOwner(
                            "You're not owner!", message, message.author
                        ));

                    command.run(message, this, args).catch((e)=>{
                        this.emit("commandError",
                            {
                                "type": "unknown",
                                "message": message,
                                "author": message.author,
                                "error": e
                            })
                    });
                }
            }
        });
    }
}
