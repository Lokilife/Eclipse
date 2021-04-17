const errors  = require('../lib/errors.js');
const config  = require('../../config.json');

module.exports = {
    "run": async (message, bot, args) => {
        if(!args[0]) return errors.notArgs(message);

        let string = `{"obj":[${args.join(" ").replace(/(```(\w+)?)/g, "").trim()}]}`; //  Это то, что мы будем парсить
        
        try { //  Попыточка
            let a = JSON.parse(string).obj[0]; 
            return message.channel.send({embed: a, disableMentions: "all"}).catch(()=>{return errors.custom(message, `Перепроверь свой embed!`)});
        } catch (err) { // Если не получилось
            return errors.custom(message, `Перепроверь свой embed!`)
        }
    },
    "aliases": ["sendembed", "embed"],
    "help": {
        "category": "Прочее",
        "description": "Отправка Embed сообщения",
        "arguments": `<\\\`\\\`\\\`JSON embed код\\\`\\\`\\\`>`,
        "usage": `${config.prefix}sendembed \\\`\\\`\\\`{\n**  **"embed": {\n**    **"title": "Угу",\n**    **"description": "Это работает!",\n**    **"color": "#cccccc"\n**  **}\n}\\\`\\\`\\\``
    },
    "botPermissions": [],
    "userPermissions": []
}
