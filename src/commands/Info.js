const discord   = require("discord.js");
const config    = require("../../config.json");
const tools     = require("../lib/tools.js");
const strftime  = require("strftime").localizeByIdentifier('ru_RU');
const package   = require("../../package.json");

module.exports = {
    "run": async (message, bot) => {
        const footer = require("../templates.json").footer.replace(/{TAG}/, message.author.tag);
        let uptime = tools.parseMS(bot.uptime);

        let embed = new discord.MessageEmbed().setColor(config.colors.default)
        .setTitle("Информация о боте")
        .addField("Основное",`Пользователей: \`${bot.users.cache.size}\`\nСерверов: \`${bot.guilds.cache.size}\`\nДата создания: \`${strftime('%d.%m.%Y год в %H:%M', new Date(bot.user.createdTimestamp))}\`\nВремя работы: \`${uptime.days} : ${uptime.hours} : ${uptime.minutes} : ${uptime.seconds}.${uptime.milliseconds}\``)
        .addField("Техническая информация",`Использование ОЗУ:  \`${(process.memoryUsage().rss / 1024 / 1024)
        .toFixed(2)} МБ\`\nВерсия Node.JS: \`${process.version}\`\nВерсия Discord.JS: \`v${discord.version}\`\nВерсия бота: \`${package.version}\`\nРазработчики: \`[ElectroPlayer]#0256\`, \`Lokilife#7962\`\nБлагодарности:\n \`[Ueuecoyotl]#4032\` - Ищет грамматические ошибки.\n\`Lookins#4727\` - Ищет неправильно работающие команды.\n\`𝓐𝓤𝓣𝓞𝓟𝓛𝓐𝓨𝓔𝓡 [BF]#4324\` - Хостит бота на своём сервере.`)
        .addField("Полезные ссылки", "[Сервер поддержки](https://discord.gg/PHuvYMrvdr)\n[GitHub бота](https://github.com/Elektroplayer/eclipsebot)\n[Ссылка на бота](https://discord.com/api/oauth2/authorize?client_id=769659625129377812&permissions=1359473878&scope=bot)\n[На чай](https://www.donationalerts.com/r/electroplayer)",true)
        .addField("Мониторинги (проголосуй :з):", "[top.gg](https://top.gg/bot/769659625129377812/vote)\n[boticord](https://boticord.top/bot/769659625129377812)\n[bots.server-discord](https://bots.server-discord.com/769659625129377812)\n[topcord](https://bots.topcord.ru/bots/769659625129377812/vote)",true)
        .setImage("https://imgur.com/gVF57ny.png")
        .setFooter(footer);
    
        message.channel.send(embed);

        return;
    },
    "aliases": ["info", "bot", "botinfo"],
    "help": {
        "category": "Общее",
        "description": "Информация о боте",
        "arguments": `**Нет**`,
        "usage": `**${config.prefix}info** - Информация о боте`,
    },
    "botPermissions": [],
    "userPermissions": []
}