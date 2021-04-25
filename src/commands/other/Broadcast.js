const errors          = require('../../lib/errors.js');
//const {MessageEmbed}  = require('discord.js');

module.exports = {
    "run": async (message, bot, args) => {
        let string = `{"obj":[${args.join(" ").replace(/(```(\w+)?)/g, "").trim()}]}`; //  Это то, что мы будем парсить
        
        let a
        try { //  Попыточка
            a = JSON.parse(string).obj[0]; 
        } catch (err) { // Если не получилось
            return await errors.custom(message, `Перепроверь твой embed!`)
        }

        let chans
        bot.guilds.cache.forEach(guild => {
            chans = guild.channels.cache.filter(m => m.type == "text" && m.permissionsFor(bot.user).has('SEND_MESSAGES'))
            if(chans) chans.first().send({embed: a, disableMentions: "all"}).catch(()=>{return errors.custom(message, `Перепроверь свой embed!`)});
        });

    },
    "aliases": ["broadcast"],
    "help": {
        "category": "Owners",
        "description": "Отправка Embed сообщения на все сервера",
        "arguments": `<\\\`\\\`\\\`JSON embed код\\\`\\\`\\\`>`,
        "usage": `\\\`\\\`\\\`{\n  "embed": {\n    "title": "Угу",\n    "description": "Это работает!",\n    "color": null\n  }\n}\\\`\\\`\\\``
    },
    "botPermissions": [],
    "userPermissions": [],
    "ownerOnly": true
}
