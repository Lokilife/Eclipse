const   PrivateVoices   = require("../models/private-voices"),
        Guilds          = require("../models/guilds")

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {Client} client 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    run: async function(client, oldState, newState) {
        const guild = await Guilds.findOne({_id: newState.guild.id.toString()}).exec()
        let   privateVoice = manager.getRepository(PrivateVoices).findOne({_id: newState.member.id})

        const channel = oldState.guild.channels.cache.get(guild.privateVoices.channel)

        // Создание румы
        if (
            newState.channel &&
            guild.privateVoices.enabled &&
            channel.category === newState.channel.parentID &&
            guild.privateVoices.channel === newState.channel.id
        ) {
            const name = guild.privateVoices.template.replace(/{NAME}/, newState.member.displayName)
            const channel = await newState.guild.channels.create(name,
                {
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: ["MANAGE_CHANNELS", "MOVE_MEMBERS"],
                        }
                    ],
                    type: "voice",
                    parent: newState.channel.parentID
                })
            .catch(async e => {
                if (e.code === 50013) { // Недостаточно прав
                    guild.privateVoices.enabled = false;
                    await Guilds.updateOne({_id: newState.guild.id}, {$set: {privateVoices: guild.privateVoices}}).exec()
                    newState.guild.owner.send(
                        "У бота недостаточно прав чтобы управлять приватными голосовыми каналами. "+
                        "Выдайте боту права управления каналами и снова включите приватные голосовые каналы.\n\n"+
                        "Данное сообщение отправлено автоматически, на него не нужно отвечать.")
                        .catch(()=>{})
                }
            })
            if (!channel) return

            await newState.setChannel(channel).catch(async()=>{await channel.delete()})
            
            if (channel.deleted) return

            if (!privateVoice)
                await PrivateVoices.create({
                    _id: newState.member.id,
                    channelID: channel.id,
                    guildID: newState.guild.id,
                    blockedUsers: [],
                    mutedUsers: []
                })
            
            await PrivateVoices.updateOne({_id: newState.member.id}, {$set: {channelID: channel.id}}).exec()
            if (guild.privateVoices.allowBlock)
                for (const user of (await privateVoice).blockedUsers) {
                    if (newState.channel.deleted) return
                    if (!newState.guild.members.cache.get(user)) continue
                    await channel.updateOverwrite(user, {
                        'CONNECT': false,
                        'SPEAK': false
                    })
                }
            if (guild.privateVoices.allowMute)
                for (const user of (await privateVoice).mutedUsers) {
                    if (newState.channel.deleted) return
                    if (!newState.guild.members.cache.get(user)) continue
                    await channel.updateOverwrite(user, {
                        'SPEAK': false
                    })
                }
        }
        // Удаление румы
        if (
            oldState.channel &&
            guild.privateVoices.enabled &&
            guild.privateVoices.category === oldState.channel.parentID &&
            guild.privateVoices.channel !== oldState.channel.id
        ) {
            if (oldState.channel.deleted) return
            if (oldState.channel.members.size) return
            await oldState.channel.delete()
            .catch(async(e) => {
                if (e.code === 50013) { // Недостаточно прав
                    guild.privateVoices.enabled = false
                    await Guilds.updateOne({_id: newState.guild.id}, {$set: {privateVoices: guild.privateVoices}}).exec()
                    newState.guild.owner.send(
                        "У бота недостаточно прав чтобы управлять приватными голосовыми каналами. "+
                        "Выдайте боту права управления каналами и снова включите приватные голосовые каналы.\n\n"+
                        "Данное сообщение отправлено автоматически, на него не нужно отвечать.")
                        .catch(()=>{})
                }
            })
            
            if (!privateVoice) {
                await PrivateVoices.create({
                    _id: newState.member.id,
                    channelID: "",
                    guildID: newState.guild.id,
                    blockedUsers: [],
                    mutedUsers: []
                })
            }
            await PrivateVoices.updateOne({channelID: oldState.channelID}, {$set: {channelID: ""}}).exec()
        }
    }
}