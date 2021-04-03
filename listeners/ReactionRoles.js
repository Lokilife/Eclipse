// Refactored by Lokilife
const Settings = require("../models/role-reactions-settings")
const typeorm = require("typeorm")

module.exports = [
    // Даже если сообщение не кешировано, событие
    // затригерится потому что оно включено в partials клиента.
    {
        // Добавление ролей
        name: "messageReactionAdd",
        /**
         * 
         * @param {Client} client 
         * @param {MessageReaction} reaction 
         * @param {User} user 
         * @returns 
         */
        run: async function(client, reaction, user) {
            const manager       = typeorm.getMongoManager(),
                  settingsRepo  = manager.getMongoRepository(Settings),
                  settings      = await settingsRepo.findOne({_id: reaction.message.id})
            
            // Если реакцию поставил бот или вне сервера
            if (user.bot || !reaction.message.guild) return
            // Создаём дополнительные константы для читаемости кода и удобства
            // (Электро, только посмей придраться, эти константы - просто ссылки, а значит они вообще ничего не нагружают, а если бы и нагружали, то это было бы ничтожно мало)
            const guild         = reaction.message.guild,
                  roles         = guild.roles.cache,
                  member        = guild.members.cache.get(user.id),
                  emoji_name    = reaction.emoji.name,
                  emoji_id      = reaction.emoji.id

            if (settings && settings.enabled) {// Выдача включена
                const role = roles.get(settings.roles[emoji_name] || settings.roles[emoji_id])
                if (!role) return
                await member.roles.add(role)
                .catch(async(e) => {
                    if (e.code === 50013) // Недостаточно прав
                        await settingsRepo.updateOne({_id: guild.id}, {$set: {enabled: false}})
                })
            }
        }
    },
    {
        // Удаление ролей
        name: "messageReactionRemove",
        /**
         * 
         * @param {Client} client 
         * @param {MessageReaction} reaction 
         * @param {User} user 
         * @returns 
         */
         run: async function(client, reaction, user) {
            const manager       = typeorm.getMongoManager(),
                  settingsRepo  = manager.getMongoRepository(Settings),
                  settings      = (async() => await settingsRepo.findOne({_id: message.id}))()
            // Если реакцию поставил бот или вне сервера
            if (user.bot || !reaction.message.guild) return
            // Создаём дополнительные константы для читаемости кода и удобства
            // (Электро, только посмей придраться, эти константы - просто ссылки, а значит они вообще ничего не нагружают, а если бы и нагружали, то это было бы ничтожно мало)
            const guild         = reaction.message.guild,
                  roles         = guild.roles.cache,
                  member        = guild.members.cache.get(user.id),
                  emoji_name    = reaction.emoji.name,
                  emoji_id      = reaction.emoji.id

            if (settings && settings.enabled) {// Выдача включена
                const role = roles.get(settings.roles[emoji_name] || settings.roles[emoji_id])
                if (!role) return
                await member.roles.remove(role)
                .catch(async(e) => {
                    if (e.code === 50013) // Недостаточно прав
                        await settingsRepo.updateOne({_id: guild.id}, {$set: {enabled: false}})
                })
            }
        }
    }
]