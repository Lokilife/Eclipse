const config            = require('../../../config.json');
const { MessageEmbed }  = require('discord.js');

module.exports = {
    "run": async (message) => {
        let status = false; //  В будущем тут будет происходить чёрная магия.

        message.channel.send(new MessageEmbed().setColor(status ? config.colors.successGreen : config.colors.default)
        .setFooter(require("../../templates.json").footer.replace(/{TAG}/, message.author.tag))
        .setTitle("Премиум")
        .addField('Статус:', status ? `Премиум подключен!` : `Премиум не подключен`)
        .addField('Что такое премиум?', `Некоторые функции реализованы за деньги. То есть они требуют ежемесячных вложений. В том числе деньги за сервер, чтобы бот работал круглосуточно, деньги за труд, чтобы была мотивация продолжать работать над ботом, деньги за сайт, чтобы было удобно настраивать бота и тд.`)
        .addField('Какие преимущества?', `Ну в общем тут будет перечислено всё, что получит человек за премиум...`)
        .addField('Где платить?', `Тут будет ссылочка на сайт, где человек будет всё уплачивать.`)
        )
    },
    "aliases": ["premium"],
    "help": {
        "category": "Общее",
        "description": "Премиум",
        "arguments": `**Нет**`,
        "usage": `**${config.prefix}premium** - Узнать информацию о премиуме и как его купить`,
    },
    "botPermissions": [],
    "userPermissions": []
}
