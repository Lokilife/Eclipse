const { version }                   = require('../package.json')
const config                        = require('../config.json')
const Client                        = require('./lib/client')
const discord                       = require('discord.js')
const mongoose                      = require('mongoose')
const typeorm                       = require('typeorm')
const chalk                         = require('chalk')

console.log(chalk.yellow(
    `Добро пожаловать в Eclipse!
        Версия: ${version}.
        Разработчики: [ElectroPlayer]#0256, Lokilife#7962.
        Версия Node.JS: ${process.version}.
        Версия Discord.JS: ${discord.version}.`))

const client = new Client({
    ws: {
        intents: discord.Intents.ALL,
    },
    partials: [
        "MESSAGE",
        "REACTION",
        "CHANNEL",
        "GUILD_MEMBER",
        "USER",
    ],
}, {
    commandsEnabled: true,
    commandsDir: "commands",
    listenersDir: "listeners",
    prefix: config.prefix,
    owners: config.owners,
})

client.loadAll()
client.on("ready", async () => { // Вызов setup у каждого листенера
    for (const listener of client.listenersObjects)
        if (typeof listener.setup == "function") listener.setup(client)
})

// Веб-Сервер

const express = require("express")

const app = express()

// Регистрация путей
app.use('/api/auth', require('./routes/auth.routes'))

const port = 5000

async function start() {
    try {
        await mongoose.connect(config.mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        client.login(config.token)
        app.listen(port, () => {
            console.log(`Веб сервер запустился на порте ${port}\nURL: http://localhost:${port}`)
        })
    } catch(e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()
