const { GuildMember } = require('discord.js')
const Client = require('../lib/client')
const Guilds = require('../models/guilds')

module.exports = [{
    name: "guildMemberAdd",
    /**
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    run: async function(client, member) {
        const guild     = member.guild,
              db_guild  = await Guilds.findOne({_id: guild.id}).exec()
        let   welcome   = db_guild.welcome
        
        if (!welcome.server.enabled && !welcome.direct.enabled) return
        
        const channel = guild.channels.cache.get(welcome.server.channel)

        if (channel && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            try {
                welcome.server.embed.description = welcome.server.embed.description ? welcome.server.embed.description
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
                welcome.server.content = welcome.server.content ? welcome.server.content
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
            } catch(e) {}
            await channel.send({
                embed: welcome.server.embed,
                content: welcome.server.content
            })
        } else {
            welcome.server.enabled = false
            welcome.server.channel = null
            Guilds.updateOne({_id: guild.id}, {$set: {welcome: welcome}}).exec()
        }

        if (welcome.direct.enabled) {
            try {
                welcome.direct.embed.content = welcome.direct.embed.content ? welcome.direct.embed.content
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
                welcome.direct.content = welcome.direct.content ? welcome.direct.content
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
            } catch(e) {}
                await member.send({
                embed: welcome.direct.embed,
                content: welcome.direct.content
            }).catch(()=>{})
        }
    }
}, {
    name: "guildMemberRemove",
    /**
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    run: async function(client, member) {
        const guild     = member.guild,
              db_guild  = await Guilds.findOne({_id: guild.id}).exec()
        let   goodbye   = db_guild.goodbye
        
        if (!goodbye.server.enabled && !goodbye.direct.enabled) return
        
        const channel = guild.channels.cache.get(goodbye.server.channel)

        if (channel && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            try {
                goodbye.server.embed.description = goodbye.server.embed.description ? goodbye.server.embed.description
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
                goodbye.server.content = goodbye.server.content ? goodbye.server.content
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
            } catch(e) {}
            await channel.send({
                embed: goodbye.server.embed,
                content: goodbye.server.content
            })
        } else {
            goodbye.server.enabled = false
            goodbye.server.channel = null
            Guilds.updateOne({_id: guild.id}, {$set: {welcome: goodbye}}).exec()
        }

        if (goodbye.direct.enabled) {
            try {
                goodbye.direct.embed.content = goodbye.direct.embed.content ? goodbye.direct.embed.content
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
                goodbye.direct.content = goodbye.direct.content ? goodbye.direct.content
                    .replace(/{{member}}/g, member.user.tag)
                    .replace(/{{guild}}/g, guild.name) : null
            } catch(e) {}
                await member.send({
                embed: goodbye.direct.embed,
                content: goodbye.direct.content
            }).catch(()=>{})
        }
    }
}]