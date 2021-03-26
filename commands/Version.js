const config          = require('../config.json');
const {MessageEmbed}  = require('discord.js');
const versions        = require('../versions.json');
const package         = require('../package.json');
const errors          = require('../lib/errors.js');

module.exports = {
    "run": async (message, bot, args) => {
        const footer = require("../templates.json").footer.replace(/{TAG}/, message.author.tag);

        let ver = args[0] || package.version;

        if(ver == "list") {
            let vers = [];
            for (let key in versions) vers.push(key);

            message.channel.send(new MessageEmbed().setColor(config.colors.default).setTitle(`Список всех выпущенных версий:`).setFooter(footer)
            .setDescription(vers.join(', ')))
            return
        }
        if(!versions[ver]) return errors.custom(message, "Такой версии не существует!");

        let embed = new MessageEmbed().setColor(config.colors.default).setTitle(`Версия: ${ver}`).setFooter(footer);

        if(versions[ver].new)  embed.addField('Новое:',versions[ver].new);
        if(versions[ver].edit) embed.addField('Изменено:', versions[ver].edit);
        if(versions[ver].bugs) embed.addField('Исправления багов:',versions[ver].bugs);
        if(versions[ver].desc) embed.addField('Что нового:',versions[ver].desc);
        if(versions[ver].del)  embed.addField('Удалено:',versions[ver].del);
        if(versions[ver].teh)  embed.addField('Техническое:',versions[ver].teh);

        message.channel.send(embed);

    },
    "aliases": ["version", "ver"],
    "help": {
        "category": "Общее",
        "description": "Версии бота",
        "arguments": `**list** - Список всех версий\n**<ver>** - версия, изменения в которой вы хотите посмотреть\n**<Нет>** - Посмотреть изменения в текущей версии`,
        "usage": `**${config.prefix}version** - Изменения в текущей версии\n**${config.prefix}version 1.0.0** - Изменения в версии 1.0.0`,
    },
    "botPermissions": [],
    "userPermissions": []
}