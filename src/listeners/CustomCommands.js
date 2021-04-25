const { Client, Message } = require("discord.js")
const CustomCommands = require("../models/custom-commands")
const config = require("../../config.json")

module.exports = {
    name: "message",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async function(client, message) {
        if (client.isCommand(message)) return

        const messageArray = message.content.split(/\s+/g),
              cmd          = messageArray[0].slice(config.prefix.length),
              command      = await CustomCommands.findOne({_id: message.guild.id, name: cmd}).exec()
        
        if (!command) return
        
        message.channel.send({content: command.message, embed: command.embed})
    }
}