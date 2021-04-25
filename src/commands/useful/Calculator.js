const config          = require('../../../config.json');
const {MessageEmbed}  = require('discord.js');
const mathjs          = require('mathjs');

module.exports = {
    "run": async (message, bot, args) => {
        let result;
        try {
            result = mathjs.evaluate(args.join(" "));
        } catch (error) {
            result = "Ошибка!";
        }
        return message.channel.send(
            new MessageEmbed().setColor(result == "Ошибка!" ? config.colors.errorRed : config.colors.default)
            .setTitle("Калькулятор")
            .setDescription(`**Пример:**\n\`\`\`${args.join(" ")}\`\`\`\n**Итог:**\`\`\`${result}\`\`\``)
        );
    },
    "aliases": ["calculator", "calc"],
    "help": {
        "category": "Полезное",
        "description": "Посчитать пример",
        "arguments": `**<пример>** - Само алгебраическое выражение`,
        "usage": `**${config.prefix}calc 9+(4/sqrt(16))** - Решит пример данный пример`,
    },
    "botPermissions": [],
    "userPermissions": []
}
