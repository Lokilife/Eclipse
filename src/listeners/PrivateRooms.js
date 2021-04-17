const   privateVoices   = require("../models/private-voices"),
        guilds          = require("../models/guilds"),
        typeorm         = require("typeorm")

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {Client} client 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    run: async function(client, oldState, newState) {
        const manager = typeorm.getMongoManager(),
              guild = await manager.getRepository(guilds).findOne({_id: newState.guild.id.toString()});
        let   privateVoice = manager.getRepository(privateVoices).findOne({_id: newState.member.id});

        // Создание румы
        if (
            newState.channel &&
            guild.privateVoices.enabled &&
            guild.privateVoices.category === newState.channel.parentID &&
            guild.privateVoices.channel === newState.channel.id
        ) {
            const name = guild.privateVoices.template.replace(/{NAME}/, newState.member.displayName);
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
            .catch(async(e) => {
                if (e.code === 50013) { // Недостаточно прав
                    guild.privateVoices.enabled = false;
                    await manager.getMongoRepository(guilds).updateOne({_id: newState.guild.id}, {$set: {privateVoices: guild.privateVoices}});
                    newState.guild.owner.send(
                        "У бота недостаточно прав чтобы управлять приватными голосовыми каналами. "+
                        "Выдайте боту права управления каналами и снова включите приватные голосовые каналы.\n\n"+
                        "Данное сообщение отправлено автоматически, на него не нужно отвечать.")
                        .catch(()=>{})
                }
            });
            if (!channel) return

            await newState.setChannel(channel).catch(async()=>{await channel.delete()})
            
            if (channel.deleted) return

            if (!privateVoice) {
                privateVoice = {
                    _id: newState.member.id,
                    channelID: channel.id,
                    guildID: newState.guild.id,
                    blockedUsers: [],
                    mutedUsers: []
                };
                await manager.getMongoRepository(privateVoices).save(privateVoice)
            }
            await manager.getMongoRepository(privateVoices).updateOne({_id: newState.member.id}, {$set: {channelID: channel.id}})
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
                    await manager.getMongoRepository(guilds).updateOne({_id: newState.guild.id}, {$set: {privateVoices: guild.privateVoices}});
                    newState.guild.owner.send(
                        "У бота недостаточно прав чтобы управлять приватными голосовыми каналами. "+
                        "Выдайте боту права управления каналами и снова включите приватные голосовые каналы.\n\n"+
                        "Данное сообщение отправлено автоматически, на него не нужно отвечать.")
                        .catch(()=>{});
                }
            });
            
            if (!privateVoice) {
                privateVoice = {
                    _id: newState.member.id,
                    channelID: "",
                    guildID: newState.guild.id,
                    blockedUsers: [],
                    mutedUsers: []
                };
                await manager.getMongoRepository(privateVoices).save(privateVoice);
            }
            await manager.getMongoRepository(privateVoices).updateOne({channelID: oldState.channelID}, {$set: {channelID: ""}});
        }
    }
}