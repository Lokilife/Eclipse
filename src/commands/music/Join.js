const config        = require("../../../config.json")

module.exports = {
    /**
     * @param {Message} message 
     * @param {Client} client 
     * @param {Array<String>} args 
     */
    run: async function(message, l_client, args, check_joined = true) {
        const member = message.member,
              voice = member.voice,
              channel = voice.channel,
              guild = message.guild,
              client = guild.me

        if (!voice || !channel)
            return await message.channel.send("**❌ You must be in the voice channel!**")
        
        if (!channel.joinable)
            return await message.channel.send("**❌ I don't have the permissions to connect to your voice channel.**")
        
        if ((check_joined && client.voice && client.voice.channel) ||
            (client.voice.channel && client.voice.channel.id != voice.channel.id))
            return await message.channel.send("**❌ I'm already connected to another voice channel.**")

        await channel.join()
        await message.channel.send(`**👍 I'm connected to** 🔉 \`${channel.name}\`**!**`, {reply_message: message})
        return true
    },
    aliases: ["join", "j"],
    help: {
        "category": "Музыка",
        "description": "Подключить бота к голосовому каналу",
        "arguments": `**Нет**`,
        "usage": `**${config.prefix}join** - Бот подключится к вашему голосовому каналу`,
    },
}