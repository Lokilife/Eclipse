const { Message } = require("discord.js")
const Client = require("../lib/client")
const Users = require("../models/users")
const Guilds = require("../models/guilds")
const { Database } = require("../lib/tools")
const typeorm = require("typeorm")

module.exports = {
    name: "message",
    /**
     * @param {Client} client
     */
    setup: async function(client) {
        setInterval(async() => { // Проверка на присутствие человека в голосовом канале, он же счётчик времени в войсе
            const manager = await typeorm.getMongoManager()
            const guildsRepository = await manager.getMongoRepository(Guilds)
            const usersRepository = await manager.getMongoRepository(Users)
            
            for (const guild of client.guilds.cache.values()) {
                const guildDoc = await guildsRepository.findOne({_id: guild.id})
                if (!guildDoc) { // Если сервера нет в базе данных - добавляем и переходим к следующему
                    Database().addGuild(guild)
                    continue
                }
                if (!guildDoc.levels.enabled) continue // - Если уровни выключены - переходим к следующему
                
                for (const voiceState of guild.voiceStates.cache.values()) { // Место которое можно оптимизировать, через .slice().map сделать все voiceStat'ы документами и закидывать в бд разом, а не по одному. Мне было лень об этом заморачиваться сейчас).
                    if (voiceState.member.user.bot || !guildDoc.levels.voiceXpCounterEnable) continue
                    const user = await usersRepository.findOne({_id: voiceState.id, guildId: guild.id})                    
                    
                    if (!user) Database().addUser(voiceState.id, guild)
                    
                    if (!(user.voiceTime % 60)) user.xp += 24 * guildDoc.levels.voiceMultiplier
                    if (user.xp > user.level*140) user.level += 1
                    user.voiceTime += 1

                    usersRepository.updateOne({_id: voiceState.id, guildId: guild.id}, {$set: {xp: user.xp, level: user.level, voiceTime: user.voiceTime}})
                }
            }
        }, 1000)
    },
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async function(client, message) {
        if (!client.isCommand(message)) {
            const manager = await typeorm.getMongoManager(),
                  usersRepository = await manager.getMongoRepository(Users),
                  guildsRepository = await manager.getMongoRepository(Guilds),
                  guildDoc = await guildsRepository.findOne({_id: message.guild.id})
            let   user = await usersRepository.findOne({_id: message.author.id, guildId: message.guild.id})
            
            if (!guildDoc) return Database().addGuild(message.guild.id)
            if (!guildDoc.levels.enabled) return
            if (!user) return Database().addUser(message.author.id, message.guild.id)

            user.xp += 24 * guildDoc.levels.textMultiplier
            if (user.xp > user.level*140) user.level += 1
            usersRepository.updateOne({_id: message.author.id, guildId: message.guild.id}, {$set: {level: user.level, xp: user.xp}})
        }
    }
}