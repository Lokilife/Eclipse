const Guilds = require("../models/guilds")

module.exports = {
    name: "guildMemberAdd",
    run: async function(client, member) {
        const аilter = role => guild.roles.cache.get(role),
              guild = await Guilds.findOne({_id: member.guild.id}).exec()
        
        if (!guild.defaultRolesEnabled) return

        const roles = member.user.bot ? guild.botDefaultRoles.filter(filter)
                                      : guild.userDefaultRoles.filter(filter)

        await member.roles.add(roles)
    }
}