const {MessageEmbed}  = require('discord.js');
const config          = require('../../../config.json');
const errors          = require('../../lib/errors.js');

//  Почему я всё это решил прокомментировать? Не знаю... Но хуже от этого не стало)
module.exports = {
    "run": async (message, bot, args) => {
        message.delete(); //  Удаляем сообщение
        
        let text   = args.join(" "); //  Соединяем всё в один текст
        let embed  = new MessageEmbed() //  Делаем всё это сейчас, чтобы не переписывать всё это потом
        .setColor(config.colors.default)
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }) || message.author.defaultAvatarURL)

        if(!text.trim()) return message.channel.send(embed.setTitle('?')) //  Если текста как такового нет, просто ставим ? и заканчиваем
        .then(async msg=> { await msg.react('✅'); msg.react('❎'); }) //  Ставим реакции

        let matchedText = text.match(/"(\\.|[^"\\])*"/g) //  Выделяем текст в кавычках

        if(!matchedText) { //  Если кавычек нет
            if(text.length>=256) return errors.falseArgs(message,"Тема не может быть длиннее 256 символов!"); //  Ограничение discord.js
            
            return message.channel.send(embed.setTitle(text)) //  Отправляем полученный embed
            .then(async msg=> { await msg.react('✅'); msg.react('❎'); }); //  Ставим реакции
        }

        for(let i = 0; i<=matchedText.length-1; i++) matchedText[i] = matchedText[i].slice(1, -1); //  Избавляемся от кавычек по краям у каждого из элементов

        if(matchedText.length == 1) { //  Если у нас есть только тема (казалось бы,а на хрена тогда кавычки)

            if(!matchedText[0].trim()) embed.setTitle('?') //  Если они пустые (ещё лучше), записываем ?
            else if(matchedText[0].length>=256) return errors.falseArgs(message,"Тема не может быть длиннее 256 символов!"); //  Ограничение discord.js
            else embed.setTitle(matchedText[0]) //  Если же всё таки там что-то есть, записываем в тайтл

            return message.channel.send(embed) //  Отправляем
            .then(async msg=> { await msg.react('✅'); msg.react('❎'); }); //  Ставим реакции
        
        } else {
            if(matchedText[0].trim().length>=256) return errors.falseArgs(message,"Тема не может быть длиннее 256 символов!"); //  Ограничение discord.js
            if(matchedText[0].trim()) embed.setTitle(matchedText[0]) //  Если текст там всё таки есть

            let variables  = matchedText.slice(1) //  Все варианты
            let endText    = ""; //  Конечный текст, который нужно будет засунуть в setDescription
            let l  = 0, i  = 0; //  Я просто гений... Но зачем?

            for(;i<=variables.length-1;i++) { 
                if(!variables[i].trim()) { //  Если там ничего нет, то просто пропускаем
                    l++;
                    continue;
                } else endText+= `${i+1-l}. ${variables[i]}\n`; //  Если там что-то есть , то записываем. Там умная система нумерации
            }

            if((i-l)>10) return errors.falseArgs(message,"Не больше 10 вариантов!"); //  Реакций всего лишь 10...
            
            else if(!endText.trim()) return message.channel.send(embed) //  Если в итоге все варианты оказались пустыми (почему)
            .then(async msg=> { await msg.react('✅'); msg.react('❎'); }); //  Смысл этой строки не поменялся

            else embed.setDescription(endText); //  А если там что-то есть, то мы добавляем его в описание
            
            message.channel.send(embed) //  Отправляем
            .then(async msg=> { //  Тут установка реакций по сложнее будет
                for(let i2 = 1; i2<(i+1-l); i2++) await msg.react(["1️⃣", "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"][i2-1]);
            });
        }
    },
    "aliases": ["poll"],
    "help": {
        "category": "Полезное",
        "description": "Создание голосований",
        "arguments": `**<тема голосования || "?">** - Создаст голосование с выбранной темой (иначе тема будет "?")\n**"<тема голосования || "?">" "<выбор 1>" "<выбор 2>" ... "<выбор 10>"** - Создаст голосование между заданными элементами`,
        "usage": `**${config.prefix}poll** - Создаст голосование с темой "?"\n**${config.prefix}poll Пойти кушать?** -  Создаст голосование с темой "Пойти кушать?"\n**${config.prefix}poll "Что покушать?" "Яичница" "Омлет" "Омлет с сосисками"** - Создаст голосование с темой "Что покушать?" и элементами "Яичница", "Омлет", "Омлет с сосисками"\n**${config.prefix}poll "" "Да" "Нет" "Не знаю"** - Создаст голосование без темы с элементами "Да" "Нет" и "Не знаю"`,
    },
    "botPermissions": ["ADD_REACTIONS"],
    "userPermissions": []
}