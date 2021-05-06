const config            = require('../../../config.json');
const { MessageEmbed }  = require('discord.js');

module.exports = {
    "run": async (message, bot) => {
        const footer = require("../../templates.json").footer.replace(/{TAG}/, message.author.tag);
        const msg = await message.channel.send(new MessageEmbed().setColor(config.colors.warnOrange).setTitle(`🏓 Проверка...`));

        msg.edit(new MessageEmbed().setColor(config.colors.default).setTitle(`🏓 Понг!`).addField(`Задержка:`, `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`).addField(`Задержка API:`, ` ${Math.round(bot.ws.ping)}ms`).setFooter(footer));
    },
    "aliases": ["ping"],
    "help": {
        "category": "Общее",
        "description": "Задержки Discord API",
        "arguments": `**Нет**`,
        "usage": `**${config.prefix}ping** - Показать скорость соединения от хоста до серверов Discord`,
    },
    "botPermissions": [],
    "userPermissions": []
}
