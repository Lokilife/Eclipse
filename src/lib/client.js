/// <reference path="typings/index.d.ts" />
const Command   = require("./commands/command"),
      discord   = require("discord.js"),
      chalk     = require("chalk"),
      fs        = require("fs"),
      { join }  = require("path"),
      errors    = require("./commands/errors")

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
     * 
     * @param {ClientOptions} options 
     * @param {*} advancedOptions
     */
    constructor(options = {}, {
        commandsDir = "commands",
        listenersDir = "listeners",
        owners = [],
        prefix
    }) {
        super(options);

        /**
         * Массив ID владельцев бота.
         * Необходимо для доступа к OwnerOnly командам.
         * @type {Array<string>}
         */
        this.owners = owners

        /**
         * @type {string}
         */
        this.prefix = prefix

        /**
         * Массив хранящий в себе все команды.
         * Не изменять! Может привести к последствиям
         * поправимыми только откатом кода и перезагрузкой.
         * @type {Array<Command>}
         */
        this.commands = []

        /**
         * Массив хранящий в себе все обработчики событий.
         * @type {Array<Listener>}
         */
        this.listenersObjects = [] // Назвал бы просто listeners, но это имя уже используется и если его использовать, то события поломаются

        /**
         * Путь к папке где расположены файлы с событиями.
         * @type {string}
         */
        this.listenersDir = join(__dirname, "..", listenersDir ? listenersDir : "listeners")

        this.commandsDir = join(__dirname, "..", commandsDir ? commandsDir : "commands")
        this._init()
    }

    /**
     * Загружает все события и команды в папках путь к которым
     * указан в настройках клиента (client options)
     */
    loadAll() {
        console.log(chalk.cyan("[Загрузчик Событий] Инициализирована загрузка событий..."))
        this.loadListeners()
        console.log(chalk.cyan("[Загрузчик Событий] Все события успешно загружены!"))

        console.log(chalk.cyan("[Загрузчик Команд] Инициализирована загрузка команд..."))
        this.loadCommands()
        console.log(chalk.cyan("[Загрузчик Команд] Все команды успешно загружены!"))
    }

    /**
     * Загружает все события находящиеся в папке путь к которой указан
     * в настройках клиента (client options) или переданные методу.
     * @param {string} path
     */
    loadListeners(path = this.listenersDir) {
        for (let file of fs.readdirSync(path, {withFileTypes: true})) {
            if (file.isFile() && file.name.endsWith(".js")) {
                try {
                    const listeners = require(`${path}/${file.name}`)
                    if (listeners instanceof Array)
                        for (const listener of listeners) {
                            this.on(listener.name, listener.run.bind(null, this))
                            this.listenersObjects.push(listener)
                        }
                    else {
                        this.on(listeners.name, listeners.run.bind(null, this))
                        this.listenersObjects.push(listeners)
                    }
                    console.log(chalk.green(`+ ${file.name}`))
                } catch (e) {
                    console.log(chalk.red(`Не удалось загрузить событие ${file.name}\nОшибка: ${e}`))
                }
            }
            if (file.isDirectory())
                this.loadListeners(`${path}/${file.name}`)
        }
    }
    /**
     * Загружает все команды находящиеся в папке в указанном пути
     * в настройках клиента (client options) и переданные методу.
     * @param {string} path
     */
    loadCommands(path = this.commandsDir) {
        for (let file of fs.readdirSync(path, {withFileTypes: true})) {
            if (file.isFile() && file.name.endsWith(".js")) {
                try {
                    const command = require(`${path}/${file.name}`)
                    this.commands.push(command);
                    console.log(chalk.green(`+ ${file.name}`))
                } catch (e) {
                    console.log(chalk.red(`Не удалось загрузить команду ${file.name}.\nОшибка: ${e}`))
                }
            }
            if (file.isDirectory())
                this.loadCommands(`${path}/${file.name}`)
        }
    }

    /**
     * Проверяет является ли сообщение командой;
     * True - Да;
     * False - Нет/Автор команды является ботом/Отправлено в DM;
     * @param {discord.Message} message 
     * @returns {boolean} boolean
     */
    isCommand(message) {
        return (message.author.bot || !message.content.startsWith(this.prefix) || message.channel.type === "dm") ? false : true
    }

    /**
     * Получает команду из её имени.
     * @param {string} name
     * @returns {Command} Command
     */
    getCommand(name) {
        for (const command of this.commands)
            if (command.aliases.indexOf(name) !== -1) return command
        return false
    }

    /**
     * Инициализирует необходимые события в клиенте.
     * @private
     */
    async _init() {
        this.connection = (await this.connection)
        this._initCommandsHandler()
    }

    /**
     * Подключает обработчик команд в клиент.
     * @private
     */
    _initCommandsHandler() {
        this.on("message", async function(message) {
            if (!this.isCommand(message)) true

            const messageArray = message.content.split(/\s+/g),
                  cmd          = messageArray[0].slice(this.prefix.length),
                  args         = messageArray.slice(1)

            const command = this.getCommand(cmd)
            if (!command) return
            
            if (!message.member.permissions.has(command.userPermissions))
                return this.emit("commandError", new errors.MissingPermissions(
                    "Missing Permissions", message, message.member,
                    command.userPermissions.filter((p)=>message.member.permissions.has(p))))

            if (!message.guild.me.permissions.has(command.botPermissions))
                return this.emit("commandError", new errors.BotMissingPermissions(
                    "Bot don't have needed permissions", message, message.member,
                    command.userPermissions.filter((p)=>message.guild.me.permissions.has(p))))

            if (command.ownerOnly && !this.owners.includes(message.author.id))
                return this.emit("commandError", new errors.NotOwner(
                    "You're not owner!", message, message.author
                ))

            command.run(message, this, args).catch((e)=>{
                this.emit("commandError",
                    {
                        "type": "unknown",
                        "message": message,
                        "author": message.author,
                        "error": e
                    })
            })
        });
    }
}
