const Guilds            = require("../models/guilds")
const Users             = require("../models/users")
const Client            = require("../lib/client")
const { Database }      = require("../lib/tools")
const { GuildMember }   = require("discord.js")

module.exports = [{
    name: "guildMemberAdd",
    /**
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    run: async function(client, member) {
        const guild = member.guild,
              db_guild = await Guilds.findOne({_id: guild.id}).exec(),
              user = await Users.findOne({_id: member.id, guildId: guild.id}).exec()

        if (!db_guild) return Database().addGuild(guild)
        if (!user) return Database().addUser(member)
        if (!db_guild.autoRolesRecoveryEnabled) return

        const roles = user.roles
            .map(id => guild.roles.cache.get(id))
            .filter(role => role &&
                            role.editable &&
                            (!!db_guild.recovereableRoles.length ? db_guild.recovereableRoles.includes(role) : true))

        await member.roles.add(roles)
    }
}, {
    name: "guildMemberRemove",
    run: async function(client, member) {
        const guild = member.guild,
              db_guild = await Guilds.findOne({_id: guild.id}).exec(),
              user = await Users.findOne({_id: member.id, guildId: guild.id}).exec()
        
        if (!db_guild) return Database().addGuild(guild)
        if (!user) Database().addUser(member)
        if (!db_guild.autoRolesRecoveryEnabled) return

        const roles = member.roles.cache.array()
            .filter(role => !role.managed &&
                            role.editable &&
                            role.id != guild.roles.everyone.id)

        await Users.updateOne({_id: member.id, guildId: guild.id}, {$set:{roles: roles}}).exec()
    }
}]