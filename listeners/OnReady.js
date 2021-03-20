const chalk = require('chalk');

module.exports = {
    name: "ready",
    run: (client) => {
        
        console.log(chalk.cyan(
            `[Клиент] Бот успешно запущен!\n`+
            `[Клиент] Имя    : ${client.user.tag}\n`+
            `[Клиент] ID     : ${client.user.id}\n`+
            `[Клиент] Сервера: ${client.guilds.cache.size}`
        ));
        
    }
}