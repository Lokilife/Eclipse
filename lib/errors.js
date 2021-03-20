const discord = require('discord.js');
const colors  = require('../config.json').colors;

module.exports = {
    /**
     * Ошибка при отсутствии или недостачи аргументов
     * @param {discord.Message} message
     * @param {string} description
     */
    notArgs: (message,description) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('Недостаточно аргументов!');
        if(description) emb.setDescription(description);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Ошибка при неправильных аргументах
     * @param {discord.Message} message
     * @param {string} description
     */
    falseArgs: (message,description) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('Предоставлены неверные аргументы!');
        if(description) emb.setDescription(description);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Ошибка при недостаче нужных прав
     * @param {discord.Message} message
     */
    notPerms: (message) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('У тебя недостаточно прав!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Ошибка при недостаче прав у бота
     * @param {discord.Message} message
     */
    botNotPerms: (message) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('У меня недостаточно прав!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Ошибка если пользователь не был найден
     * @param {discord.Message} message
     */
    noUser: (message)=> {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('Такого пользователя не существует!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Ошибка если канал не был найден
     * @param {discord.Message} message
     */
    noChannel: (message)=> {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('Такого канала не существует!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Кастомная ошибка для отдельных случаев
     * @param {discord.Message} message
     * @param {string} title
     * @param {string} description
     */
    custom: (message,title,description) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle(title);
        if(description) emb.setDescription(description);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Это и не ошибка вовсе)
     * Если всё пошло по плану
     * @param {discord.Message} message
     * @param {string} title
     * @param {string} description
     */
    success: (message,title,desc) => {
        let emb = new discord.MessageEmbed().setColor(colors.successGreen).setTitle(title);
        if(desc) emb.setDescription(desc);
        message.channel.send(emb);
    },

    /**
     * Ошибка, связанная с проблемами в API
     * @param {discord.Message} message
     */
    APIErrors: (message) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle('Неполадки с API! Попробуйте позже...');
        message.channel.send(emb);
    },

    /**
     * Ошибка, связанная с проблемами в базе данных
     * @param {discord.Message} message
     * @param {string} value
     */
    baseErr: (message,value) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle(value ? `Ошибка базы данных! Значение: ${value}` : `Ошибка базы данных!`)
        .setDescription(`Обновите конфигурацию! \`e.settings configurationUpdate\``);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Ошибка, если функция не работает на данный момент
     * @param {discord.Message} message
     */
    doNotWorksNow: (message) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle(`Эта функция не работает сейчас!`)
        .setDescription(`Следите за обновлениями) \`e.ver\`...`);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },

    /**
     * Неизвестная ошибка
     * @param {discord.Message} message
     * @param {string} description
     */
    unknown: (message, description) => {
        let emb = new discord.MessageEmbed().setColor(colors.errorRed).setTitle("Произошла неизвестная ошибка");
        if(description) emb.setDescription(description);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    }
}