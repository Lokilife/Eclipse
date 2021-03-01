const config          = require('../config.json');
const {MessageEmbed}  = require('discord.js');

module.exports = {
    "run": async (message, bot) => {
        const msg = await message.channel.send(new MessageEmbed().setColor(config.colors.warnOrange).setTitle(`🏓 Проверка...`));

        msg.edit(new MessageEmbed().setColor(config.colors.default).setTitle(`🏓 Понг!`).addField(`Задержка:`, `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`).addField(`Задержка API:`, ` ${Math.round(bot.ws.ping)}ms`).setFooter(bot.helps.footer));
    },
    "name": "ping",
    "aliases": ["ping", "пинг"],
    "help": {
        "category": "Общее",
        "desciption": "Задержки Discord API",
        "arguments": `**Нет**`,
        "usage": `**${config.prefix}ping** - Показать скорость соединения от хоста до серверов Discord`,
        "usegeLevel": 0
    }
}