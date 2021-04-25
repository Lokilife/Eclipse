const { Message } = require("discord.js")
const Client = require("../lib/client")
const Users = require("../models/users")
const Guilds = require("../models/guilds")
const { Database } = require("../lib/tools")

module.exports = {
    name: "message",
    /**
     * @param {Client} client
     */
    setup: async function(client) {
        setInterval(async() => { // Проверка на присутствие человека в голосовом канале, он же счётчик времени в войсе
            for (const guild of client.guilds.cache.values()) {
                const guildDoc = await Guilds.findOne({_id: guild.id}).exec()
                if (!guildDoc) { // Если сервера нет в базе данных - добавляем и переходим к следующему
                    Database().addGuild(guild)
                    continue
                }
                if (!guildDoc.levels.enabled) continue // - Если уровни выключены - переходим к следующему
                
                for (const voiceState of guild.voiceStates.cache.values()) { // Место которое можно оптимизировать, через .slice().map сделать все voiceStat'ы документами и закидывать в бд разом, а не по одному. Мне было лень об этом заморачиваться сейчас).
                    if (voiceState.member.user.bot || !guildDoc.levels.voiceXpEnable) continue
                    const user = await Users.findOne({_id: voiceState.id, guildId: guild.id}).exec()
                    
                    if (!user) Database().addUser(voiceState.id, guild)
                    
                    if (!(user.voiceTime % 60)) user.xp += 24 * guildDoc.levels.voiceMultiplier
                    if (user.xp > user.level*140) user.level += 1
                    user.voiceTime += 1

                    Users.updateOne({_id: voiceState.id, guildId: guild.id}, {$set: {xp: user.xp, level: user.level, voiceTime: user.voiceTime}}).exec()
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
            const guildDoc = await Guilds.findOne({_id: message.guild.id}).exec()
            let   user = await Users.findOne({_id: message.author.id, guildId: message.guild.id}).exec()
            
            if (!guildDoc) return Database().addGuild(message.guild.id)
            if (!guildDoc.levels.enabled) return
            if (!user) return Database().addUser(message.author.id, message.guild.id)

            user.xp += 24 * guildDoc.levels.textMultiplier
            if (user.xp > user.level*140) user.level += 1
            Users.updateOne({_id: message.author.id, guildId: message.guild.id}, {$set: {level: user.level, xp: user.xp}}).exec()
        }
    }
}