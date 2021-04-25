const config          = require('../../../config.json');
const errors          = require('../../lib/errors.js');

module.exports = {
    "run": async (message, bot, args) => {
        if(!args[0]) return errors.notArgs(message, `Напиши **${config.prefix}help clear** для помощи по команде`);
        if(!/^[0-9]{1,}$/g.test(args[0]) || args[0] == "0") return errors.falseArgs(message, "Можно вводить только цифры, больше 0!");
        if(args[0]>2000) return errors.falseArgs(message, "Можно вводить только цифры, меньше 2000!");

        await message.delete();

        let count = parseInt(args[0]);

        for (let i; count;) {
            i = (count >= 100 ? 100 : count);
            count -= i;
            console.log("i: "+i+"\ncount: "+count)
            await message.channel.bulkDelete(i, true);
        }

        //message.channel.bulkDelete(count, true);
        return errors.success(message,`Очищено ${args[0]} сообщений.`);
    },
    "aliases": ["clear", "clean"],
    "help": {
        "category": "Модерация",
        "description": "Очистить сообщения",
        "arguments": `**<count>** - Удалит заданное количество сообщений`,
        "usage": `**${config.prefix}clear 10** - Удалит 10 сообщений`,
    },
    "botPermissions": ["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"],
    "userPermissions": ["MANAGE_MESSAGES"]
}
