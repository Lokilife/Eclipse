const errors          = require('../lib/errors.js');
const {MessageEmbed}  = require('discord.js');
const strftime        = require('strftime').localizeByIdentifier('ru_RU');
const config          = require('../config.json');

module.exports = {
    "run": async (message, bot, args) => {
        const footer = require("../templates.json").footer.replace(/{TAG}/, message.author.tag);

        // Получаем пользователя, о котором мы ищем информацию
        let argsUser
        if(!args[0]) argsUser = message.author
        else {
            argsUser = message.mentions.users.first() || message.guild.members.cache.find(m => m.user.username == args[0]) || message.guild.members.cache.get(args[0]) //
            if(!argsUser) return errors.noUser(message);
            argsUser = message.guild.member(argsUser).user;
        }
        let member = message.guild.members.cache.get(argsUser.id) //  Находим человека на сервере
    
        //  Вычисляем все даты
        let day   = 1000 * 60 * 60 * 24
        let date1 = new Date(message.createdTimestamp)
        let date2 = new Date(argsUser.createdTimestamp)
        let date3 = new Date(message.guild.member(argsUser).joinedTimestamp)
        let diff1 = Math.round(Math.abs((date1.getTime() - date2.getTime()) / day))
        let diff2 = Math.round(Math.abs((date1.getTime() - date3.getTime()) / day))

        let nickname   = member.nickname ? ` aka ${member.nickname}` : ""; //  Если есть никнейм, то мы его записываем, если нет, то его видно не будет
        let roles      = member.roles.cache.filter((r) => r.id !== message.guild.id) //  Находим роли у человека на сервере
        .sort((a, b) => b.rawPosition - a.rawPosition) //  Сортируем
        .map((r) => r).join(", ") || "Отсутствуют"; //  Если роли есть, у нас будет весь список, если нет, то напишет "Отсутствуют"

        let roleCount = member.roles.cache.filter((r) => r.id !== message.guild.id).size; //  Находим количество ролей
    
        let profileEmbed = new MessageEmbed().setTitle(argsUser.username + nickname).setColor(config.colors.default)
        .addField('Дата регистрации:', `${strftime('%B %d, %Y год в %H:%M', date2)}\n(${diff1} дней назад)`,true)
        .addField('Подключился на сервер:', `${strftime('%B %d, %Y год в %H:%M', date3)}\n(${diff2} дней назад)`,true)
        .addField(`ID:`,`${argsUser.id}`)
        .addField(`Роли (${roleCount}):`, `${roles}`)
        .setThumbnail(argsUser.avatarURL({ dynamic: true, size: 512 })|| argsUser.defaultAvatarURL)
        .setFooter(footer); //  Создаём embed. Создал его сразу для своего удобства, потом не придётся писать это снова

        let statuses = {online: `В сети`, idle: `Не активен`, dnd: `Не беспокоить`, offline: `Не в сети`} //  Облегчаем себе жизнь
        let game
        if(message.guild.presences.cache.get(argsUser.id)) {
            game = `\`\`\`${statuses[message.guild.presences.cache.get(argsUser.id).status]}\`\`\``; //  Вычисляем в сети ли он или нет
            if(game == `\`\`\`Не в сети\`\`\``) return message.channel.send(profileEmbed.addField(`Имеет статус:`, `\`\`\`${statuses[argsUser.presence.status]}\`\`\``)); //  Если нет, то на этом заканчиваем
        } else return message.channel.send(profileEmbed.addField(`Имеет статус:`, `\`\`\`${statuses[argsUser.presence.status]}\`\`\``)) //  Если у нас нет его действий, то заканчиваем тоже
    
        let text = `` //  Узнаем, откуда он активен
        if(message.guild.presences.cache.get(argsUser.id).clientStatus.web) text = text + `Браузера\n`
        if(message.guild.presences.cache.get(argsUser.id).clientStatus.mobile) text = text + `Телефона\n`
        if(message.guild.presences.cache.get(argsUser.id).clientStatus.desktop) text = text + `Компьютера\n`
    
        let activit  = message.guild.presences.cache.get(argsUser.id).activities; //  Да, я умею называть переменные)
        let activ    = '';
    
        for(let i=0;i<=activit.length-1;i++) {  //  Там без цикла никак...
            if (activit[i].type == 'CUSTOM_STATUS') { //  К кастомному статусу отдельная надпись
                let stat = ""
                if(activit[i].emoji) stat = stat + " " + activit[i].emoji.name;
                if(activit[i].state) stat = stat + " " + activit[i].state
                activ = activ + ` \`\`\`Кастомный статус:${stat}\`\`\` `
            } else {
                activ = activ + ` \`\`\`Имя: ${activit[i].name}\n${activit[i].details}\n${activit[i].state}\`\`\` `
            }
        } //  Иногда какой-то из параметров может быть null. К сожалению, я ещё не отследил, какой, когда, как и почему...
    
        if(activ == '') activ = '```Нет```' //  Если активностей нет, то и сюда нет...

        message.channel.send(profileEmbed.addField(`Активен с`,`${text}`).addField(`Активности:`, activ)) //  Отправляем конечный embed
    },
    "aliases": ["profile", "me"],
    "help": {
        "category": "Полезное",
        "description": "Информация о пользователей",
        "arguments": `**<user>** - Покажет информацию о пользователе *(Можно ввести ID или имя)*\n**<Нет>** - Покажет информацию о авторе`,
        "usage": `**${config.prefix}profile** - Покажет информацию о тебе\n**${config.prefix}profile @user** -  Покажет информацию об упомянутом пользователе\n**${config.prefix}profile 111111123456789101** - Покажет информацию о пользователе с таким ID\n**${config.prefix}profile UserName** - Покажет информацию о пользователе с таким именем *(НЕ НИКОМ НА СЕРВЕРЕ)*`,
    },
    "botPermissions": [],
    "userPermissions": []
}