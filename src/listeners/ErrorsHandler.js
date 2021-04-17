const discord = require("discord.js");
const config = require("../../config.json");
const errors = require("../lib/commands/errors");
const { permsToText } = require("../lib/tools")

module.exports = {
    name: "commandError",
    /**
     * @param {discord.Client} client 
     * @param {any} error
     */
    run: async function (client, error) {
        const embed = new discord.MessageEmbed()
            .setColor(config.colors.errorRed)
            .setTitle("Ошибка!")
            .setFooter(`${error.author.tag} | © Night Devs`)

        if (error instanceof errors.NotOwner)
            embed.setDescription("Вы не являетесь владельцем бота!")
        
        else if (error instanceof errors.BotMissingPermissions)
            embed.setDescription(
                `У бота отсутствуют права необходимые для данной команды. \`` +
                permsToText(error.permissions).join('`, `')+`\`.\n` +
                `Обратитесь к администратору вашего сервера чтобы исправить это.`
            );

        else if (error instanceof errors.MissingPermissions)
            embed.setDescription(`У вас недостаточно прав.\n\`${permsToText(error.permissions).join('`, `')}\``)

        else {
            embed.setDescription("Произошла неожиданная ошибка, отчёт уже отправлен разработчикам. Извините за предоставленные неудобства.")
            client.channels.cache.get("770009648023339049").send(
                new discord.MessageEmbed()
                    .setTitle("Ошибка!")
                    .setDescription(`\`\`\`js\n${error.error}\n\`\`\``)
                    .addField("Message Author", `${error.author} (${error.author.id})`, false)
                    .addField("Message Content", `\`\`\`\n${error.message.content}\n\`\`\``, false)
                    .addField("Guild ID", error.message.guild.id, false)
                    .addField("Channel ID", error.message.channel.id, false)
            )
        }

        await error.channel.send(embed)
    }
}