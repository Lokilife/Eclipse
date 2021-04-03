const { Client, Message } = require("discord.js")
const CustomCommands = require("../models/custom-commands")
const typeorm = require("typeorm")
const config = require("../config.json")

module.exports = {
    name: "message",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async function(client, message) {
        if (message.author.bot || !message.content.startsWith(config.prefix) || message.channel.type === "dm") return;

        const messageArray = message.content.split(/\s+/g),
              cmd          = messageArray[0].slice(config.prefix.length)

        const manager      = typeorm.getMongoManager(),
              commandsRepo = manager.getMongoRepository(CustomCommands)
              command      = await commandsRepo.findOne({_id: message.guild.id, name: cmd})
        
        if (!command) return
        
        message.channel.send({content: command.message, embed: command.embed})
    }
}