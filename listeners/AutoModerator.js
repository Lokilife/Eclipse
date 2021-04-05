// eslint-disable-next-line no-unused-vars
const { Client, Message, MessageEmbed } = require("discord.js");
const typeorm        = require("typeorm");
const strftime       = require('strftime');
const AutoModerator  = require('../models/auto-moderator.js')
const config         = require("../config.json");

module.exports = {
    name: "message",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async function(client, message) {

        if(message.channel.type == 'dm') return; //  Не слушаем ЛС
        if(message.content.replace(/\s/g, '').includes("discord.gg/") || message.content.replace(/\s/g, '').includes("discord.com/invite/")) {
            const modSettings = await typeorm.getMongoManager().findOne(AutoModerator, {_id: message.guild.id});

            // let modSettings = { //  Во-первых, для тестов. Во-вторых, для понимания, что будет в итоге
            //     enabled: false,
            //     exceptions: {
            //         roles: [],
            //         channels: [],
            //         members: []
            //     },
            //     logs: {
            //         enabled: true,
            //         ownerDirectMessage: true,
            //         channel: "ID",
            //     }
            // }

            if(!modSettings.enabled) return;
            if(message.author.id == message.guild.owner.id) return; //  Исключаем создателя
    
            let ok=true //  Проверка на наличие особой роли
            for(let i=0;i<=modSettings.exceptions.roles.length-1;i++) { if(message.member.roles.cache.has(modSettings.exceptions.roles[i])) { ok=false; break;}}
            
            if(
                !ok ||
                modSettings.exceptions.channels.indexOf('dog') == -1 ||
                modSettings.exceptions.members.indexOf('dog') == -1
            ) return; //  Если это исключение, то не продолжаем
    
            message.delete() //  Удаляем сообщение
            message.channel.send(new MessageEmbed().setColor(config.colors.warnOrange).setTitle(`${message.author.username}, реклама на этом сервере запрещена!`)).then(msg=>msg.delete({timeout:5000}));
    
            let emb = new MessageEmbed().setColor(config.colors.warnOrange).setTitle('Нарушение!').addField('Нарушитель:',`<@${message.author.id}> \nID: "${message.author.id}"`,true).addField('Канал:',`${message.channel.name}`,true).addField('Время', strftime("%B %d, %H:%M", new Date(message.createdAt)),true).addField('Причина:','Отправка ссылок-приглашений на другие сервера');
            
            if(modSettings.logs.enabled) { //  Смотрим, включено ли логирование и если да, то смотрим доступность канала. Если всё норм, то отправляем сообщение
                if(message.guild.channels.cache.get(modSettings.logs.channel)) message.guild.channels.cache.get(modSettings.logs.channel).send(emb);
                else message.guild.members.cache.get(message.guild.owner.id).send(new MessageEmbed().setTitle('Лог канала не существует!').setDescription('Выключите функцию логирования или задайте другой канал!').setColor(config.colors.errorRed)); //  Отправляем сообщение создателю, что канала для логов не существует. Пускай вырубает или изменяет.
            }
            if(modSettings.logs.ownerDirectMessage) message.guild.owner.send(emb); //  Смотрим включено ли логирование в ЛС и если да, то отправляем ЛС человеку.
        }
    }
}

module.exports = {
    name: "messageUpdate",
    /**
     * 
     * @param {Client} client 
     * @param {Message} oldMessage
     * @param {Message} message
     */
    run: async function(client, oldMessage, message) {
        if(message.channel.type == 'dm') return; //  Не слушаем ЛС
        if(message.content.replace(/\s/g, '').includes("discord.gg/") || message.content.replace(/\s/g, '').includes("discord.com/invite/")) {

            const modSettings = await typeorm.getMongoManager().findOne(AutoModerator, {_id: message.guild.id});

            // let modSettings = { //  Во-первых, для тестов. Во-вторых, для понимания, что будет в итоге
            //     enabled: false,
            //     exceptions: {
            //         roles: [],
            //         channels: [],
            //         members: []
            //     },
            //     logs: {
            //         enabled: true,
            //         ownerDirectMessage: true,
            //         channel: "ID",
            //     }
            // }
            
            if(!modSettings.enabled) return; //  Если выключено
            if(message.author.id == message.guild.owner.id) return; //  Исключаем создателя
    
            let ok=true //  Проверка на наличие особой роли
            for(let i=0;i<=modSettings.exceptions.roles.length-1;i++) { if(message.member.roles.cache.has(modSettings.exceptions.roles[i])) { ok=false; break;}}
            
            if(
                !ok ||
                modSettings.exceptions.channels.indexOf('dog') == -1 ||
                modSettings.exceptions.members.indexOf('dog') == -1
            ) return; //  Если это исключение, то не продолжаем
    
            message.delete() //  Удаляем сообщение
            message.channel.send(new MessageEmbed().setColor(config.colors.warnOrange).setTitle(`${message.author.username}, реклама на этом сервере запрещена!`)).then(msg=>msg.delete({timeout:5000}));
    
            let emb = new MessageEmbed().setColor(config.colors.warnOrange).setTitle('Нарушение!').addField('Нарушитель:',`<@${message.author.id}> \nID: "${message.author.id}"`,true).addField('Канал:',`${message.channel.name}`,true).addField('Время', strftime("%B %d, %H:%M", new Date(message.createdAt)),true).addField('Причина:','Отправка ссылок-приглашений на другие сервера');
            
            if(modSettings.logs.enabled) { //  Смотрим, включено ли логирование и если да, то смотрим доступность канала. Если всё норм, то отправляем сообщение
                if(message.guild.channels.cache.get(modSettings.logs.channel)) message.guild.channels.cache.get(modSettings.logs.channel).send(emb);
                else message.guild.members.cache.get(message.guild.owner.id).send(new MessageEmbed().setTitle('Лог канала не существует!').setDescription('Выключите функцию логирования или задайте другой канал!').setColor(config.colors.errorRed)); //  Отправляем сообщение создателю, что канала для логов не существует. Пускай вырубает или изменяет.
            }
            if(modSettings.logs.ownerDirectMessage) message.guild.owner.send(emb); //  Смотрим включено ли логирование в ЛС и если да, то отправляем ЛС человеку.
        }
    }
}