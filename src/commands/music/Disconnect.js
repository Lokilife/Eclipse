const config        = require("../../../config.json")

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} client 
     * @param {Array<String>} args 
     */
    run: async function(message) {
        const member = message.member,
              voice = member.voice,
              channel = voice.channel,
              permissions = channel ? channel.permissionsFor(member) : null,
              guild = message.guild,
              client = guild.me

        if (!voice || !channel)
            return await message.channel.send("**❌ You must be in the voice channel!**")
                
        if (!client.voice)
            return await message.channel.send("**❌ I'm not connected to any voice channel!**")
        
        if (channel.id != client.voice.channelID)
            return await message.channel.send("**❌ I'm not connected to this voice channel!**")
        
        if (!permissions.has("MOVE_MEMBERS") && !permissions.has("MANAGE_CHANNELS") && channel.members.size > 3)
            return await message.channel.send("**❌ You need the permission to manage the channel or move members to do this (if there is no one in the channel, then these permissions are not needed).**")
        
        await channel.leave()
        
        await message.channel.send(`**👍 I'm disconnected from 🔇 \`${channel.name}\`!**`)
    },
    aliases: ["disconnect", "dis", "d", "leave", "l"],
    help: {
        "category": "Музыка",
        "description": "Отключить бота от голосового канала",
        "arguments": `**Нет**`,
        "usage": `**${config.prefix}disconnect** - Бот отключится от вашего голосового канала`,
    },
}