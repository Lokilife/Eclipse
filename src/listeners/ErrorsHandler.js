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

        if (error instanceof errors.NotOwner) {
            embed.setDescription("Вы не являетесь владельцем бота!")
            await error.channel.send(embed)
        }
        
        else if (error instanceof errors.BotMissingPermissions) {
            embed.setDescription(
                `У бота отсутствуют права необходимые для данной команды. \`` +
                permsToText(error.permissions).join('`, `')+`\`.\n` +
                `Обратитесь к администратору вашего сервера чтобы исправить это.`
            );
            await error.channel.send(embed)
        }
        
        else if (error instanceof errors.MissingPermissions) {
            embed.setDescription(`У вас недостаточно прав.\n\`${permsToText(error.permissions).join('`, `')}\``)
            await error.channel.send(embed)
        }

        else if (error instanceof errors.UnknownError) {
            embed.setDescription("Произошла неожиданная ошибка. Извините за предоставленные неудобства.\n" +
                                 "Вы можете помочь нам отправив отчёт о ошибке, будет сообщена следующая информация: " +
                                 "Содержимое сообщения, никнейм и ID автора сообщения, название и ID сервера, имя и ID канала и прочая техническая информация.\n" +
                                 "Продолжить?")

            message = await error.channel.send(embed)

            await message.react('✅')
            await message.react('❌')

            reaction = (await message.awaitReactions(
                (reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") &&
                                    user.id == error.author.id,
                {
                    max: 1
                }
            )).first()

            await message.reactions.removeAll()

            if (reaction.emoji.name == '❌') embed.setDescription("Отчёт о ошибке не был отправлен. Придётся как нибудь выкручиваться самим :(.")
            else {
                await client.channels.cache.get("770009648023339049").send(
                    new discord.MessageEmbed()
                        .setTitle("Ошибка!")
                        .setDescription(`\`\`\`js\n${error.error}\n\`\`\``)
                        .addField("Message Author", `${error.author} (${error.author.id})`, false)
                        .addField("Message Content", `\`\`\`\n${error.message.content}\n\`\`\``, false)
                        .addField("Guild", `${error.message.guild.name} (${error.message.guild.id})`, false)
                        .addField("Channel", `${error.message.channel.name} (${error.message.channel.id})`, false)
                )
                embed.setDescription("Спасибо! Отчёт отчёт об ошибке был отправлен. Очень скоро эта ошибка будет исправлена.")
            }
            
            await message.edit(embed)
        }
    }
}