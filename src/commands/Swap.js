const config  = require('../../config.json');
const errors  = require("../lib/errors.js")

module.exports = {
    "run": async (message, bot, args) => {
        if(!args[0]) errors.notArgs(message, `Напиши **${config.prefix}help swap** для помощи по команде`)

        let alphabets   = {
            "ru":  `ёйцукенгшщзхъфывапролджэячсмитьбю.ЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ,"№;:?`.split(""),
            "en": `\`qwertyuiop[]asdfghjkl;'zxcvbnm,./~QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?@#$^&`.split(""),
            "exception": `.,";:?`.split("")
        };   //  Алфавиты

        let inpText     = args.join(" ").split("");  //  Входной текст
        let outText     = "";                        //  Выходной текст

        let buffer = "en";
        inpText.forEach(e => {
            
            if(alphabets["exception"].indexOf(e) != -1) {
                e = alphabets[buffer][alphabets[buffer == "en" ? "ru" : "en"].indexOf(e)]
            } else {
                if(alphabets["ru"].indexOf(e) != -1) {
                    e = alphabets["en"][alphabets["ru"].indexOf(e)]
    
                    buffer = "en";
                } else if(alphabets["en"].indexOf(e) != -1) {
                    e = alphabets["ru"][alphabets["en"].indexOf(e)]
                    
                    buffer = "ru";
                }
            }

            outText = outText + e;

        })

        message.channel.send(outText);
        
    },
    "aliases": ["swap"],
    "help": {
        "category": "Полезное",
        "description": "Заменить раскладку",
        "arguments": `**<текст с неправильной раскладкой>** - Поменяет раскладку клавиатуры у текста`,
        "usage": `**${config.prefix}swap Ghbdtn? rfr e nt,z ltkf&** - Поменяет раскладку и выведет "Привет, как у тебя дела?"`,
    },
    "botPermissions": [],
    "userPermissions": []
}
