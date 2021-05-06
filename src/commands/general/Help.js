const discord  = require("discord.js");
const config   = require("../../../config.json");
const errors   = require("../../lib/errors.js");
const tools    = require("../../lib/tools.js");

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} bot
     * @param {Array<String>} args
     */
    "run": async function(message, bot, args) {
        const footer = require("../../templates.json").footer.replace(/{TAG}/, message.author.tag);
        if(args[0]) {

            let c = bot.commands.find(m => m.aliases.includes(args[0])); //  c от command.
            
            if(!c) return errors.falseArgs(message,"Такой команды/алиаса не существует!");

            return message.channel.send(new discord.MessageEmbed().setColor(config.colors.default)
            .setTitle(`Помощь по команде ${c.aliases[0]}`)
            .setDescription(c.help.description)
            .addField('Аргументы:', c.help.arguments)
            .addField('Примеры:', c.help.usage)
            .addField('Могут использовать:', tools.securitylevel(c.userPermissions), true)
            .setFooter(footer));

        }

        let categories = ["Общее", "Полезное", "Модерация", "Музыка", "Прочее"];
        //bot.commands.forEach(value => {if(categories.indexOf(value.help.category) == -1 && value.help.category != "Owners") categories.push(value.help.category)});

        let emb         = new discord.MessageEmbed().setColor(config.colors.default).setTitle('Помощь').setDescription(`\`${config.prefix}help <команда>\` для углублённой помощи по команде'`).setFooter(footer)
        let numbers     = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"] //  Ты целый мап сделал для этого. Я разобрался одним массивом!
        
        let fields = {
            "1️⃣": {
                "name": "Содержание",
                "value": ""
            }
        }

        fields['1️⃣'].value = "1. Содержание\n";
        for(let i=0; i < categories.length; i++) {
            fields['1️⃣'].value += `${i+2}. ${categories[i]}\n`;
        }

        let i1 = 0;
        for(;i1<categories.length;i1++) {
            fields[numbers[i1+1]] = {
                "name": categories[i1],
                "value": ""
            }

            bot.commands.filter(m => m.help.category == categories[i1]).forEach(elm => {
                fields[numbers[i1+1]].value += `**${config.prefix}${elm.aliases[0]}** - ${elm.help.description}\n`
            })

            if(fields[numbers[i1+1]].value == "") fields[numbers[i1+1]].value = "Тут пока ничего нет..."
        }

        message.channel.send(emb.addField(fields['1️⃣'].name,fields['1️⃣'].value))
        .then(async msg=> {

            numbers = numbers.slice(0,i1+1)
            
            for (const number of numbers) await msg.react(number);

            let filter     = (reaction,user) => numbers.includes(reaction.emoji.name) && user.id === message.author.id
            let collector  = msg.createReactionCollector(filter, {idle:3e4});

            collector.on('collect',(r) => {
                try {
                    msg.reactions.cache.get(r.emoji.name).users.remove(message.client.users.cache.get(message.author.id));
                } catch (err) {console.log(err)}

                emb.fields = [fields[r.emoji.name]];
                msg.edit(emb)
            });
            
            collector.on('end', async () => {
                try {
                    await msg.reactions.removeAll();
                    await msg.edit(emb.setFooter(`[Время истекло] ${footer}`));
                } catch (err) {console.log(err)}
            })
        })
    },
    "aliases": ["help", "?", "h"],
    "help": {
        "category": "Общее",
        "description": "Помощь по командам",
        "arguments": `**<command>** - Показать более подробную информацию о команде\n**<Нет>** - Показать список команд`,
        "usage": `**${config.prefix}help** - Список всех команд\n**${config.prefix}help help** - Более подробная информация о help`,
    },
    "botPermissions": ["ADD_REACTIONS","MANAGE_MESSAGES"],
    "userPermissions": []
}

/*
TODO!!!:

88,97 строка : console.log. Возможно захочешь что-то с этим сделать
*/