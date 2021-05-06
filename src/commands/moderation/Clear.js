const config = require('../../../config.json');
const errors = require('../../lib/errors.js');

module.exports = {
    "run": async (message, client, args) => {
        if(!args[0]) return errors.notArgs(message, `Напиши **${config.prefix}help clear** для помощи по команде`)
        if(!/^[0-9]{1,}$/g.test(args[0]) || parseInt(args[0]) <= 0) return errors.falseArgs(message, "Можно вводить только цифры, больше 0!")
        if(args[0]>100000) return errors.falseArgs(message, "Можно вводить только цифры, меньше или равные 100000!")

        await message.delete()

        let count = parseInt(args[0]),
            totalizer = 0

        for (let i; count;) {
            i = (count >= 100 ? 100 : count)
            count -= i
            totalizer += (await message.channel.bulkDelete(i, true)).array().length
        }

        return await errors.success(message,`Очищено ${totalizer} сообщений.`)
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
