const config        = require('../../../config.json')
const { Message }   = require('discord.js')
const ytdl          = require('ytdl-core')
const yts           = require('yt-search')
const Join          = require('./Join')


module.exports = {
    run: async function(message, client, args) {
        const joined = await Join.run(message, client, [], false)
        
        if (!joined || joined instanceof Message) return

        const query = args.join(' ')
        let queue = client.queue.get(message.guild.id)

        let url = true
        try {
            url = new URL(query).searchParams
        } catch(e) {
            url = false
        }

        await message.channel.send(`**Searching 🔎** \`${query}\``)
        console.log(url)
        let result = (await yts(url ? url.toString() : query)).videos[0]

        if (url && url.get("list")) { // Если это плейлист, а не видео
            result = await yts({listId: url.get('v')})[0]
            
            const videos = result.videos
            const first_video = videos.shift()
            
            client.queue.set(message.guild.id, [...result, ...queue])
            
            await message.channel.send(`**Playing 🎶** \`${result.title}\` - Now!`)
            
            this.run(message, client, [first_video.url])
            return
        }
        const connection = client.voice.connections.get(message.guild.id)
        
        if (!connection)
            return await message.channel.send("**❌ I'm not connected to any voice channel!**")
        
        const readStream = ytdl(result.url, {filter: "audioonly"})

        connection.play(readStream)

        await message.channel.send(`**Playing 🎶** \`${result.title}\` - Now!`)

        if (queue && queue.length) {
            const first_video = queue.shift()
            client.queue.set(message.guild.id, queue)
            this.run(message, client, [first_video.url])
        }
    },
    aliases: ["play", "pl", "p"],
    help: {
        "category": "Музыка",
        "description": "Начать проигрывание какой-либо песни в голосовом канале\n**Внимание!** Команда находится в разработке и доступна только разработчикам и тестировщикам!",
        "arguments": `<Запрос или ссылка> - Название или ссылка на вашу песню`,
        "usage": `**${config.prefix}play <Запрос или ссылка>** ` + 
        `- Бот подключится к вашему голосовому каналу и начнёт воспроизводить указанную песню.`,
    },
    botPermissions: ["CONNECT"]
}