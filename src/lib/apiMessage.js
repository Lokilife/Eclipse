const { APIMessage, Message, MessageEmbed, MessageFlags, Util } = require('discord.js')

APIMessage.prototype.resolveData = function() {
    
    const message_reference = this.options.reply_message instanceof Message ? 
        {
            message_id: this.options.reply_message.id,
            channel_id: this.options.reply_message.channel.id,
        } : {
            message_id: this.options.reply_message
        }

    if (this.data) return this

    const content = this.makeContent()
    const tts = Boolean(this.options.tts)

    let nonce
    if (typeof this.options.nonce !== 'undefined') {
        nonce = parseInt(this.options.nonce)
        if (isNaN(nonce) || nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE')
    }

    const embedLikes = []
    if (this.isWebhook) {
        if (this.options.embeds) {
            embedLikes.push(...this.options.embeds)
        }
    } else if (this.options.embed) {
        embedLikes.push(this.options.embed)
    }
    const embeds = embedLikes.map(e => new MessageEmbed(e).toJSON())

    let username
    let avatarURL
    if (this.isWebhook) {
        username = this.options.username || this.target.name
        if (this.options.avatarURL) avatarURL = this.options.avatarURL
    }

    let flags
    if (this.isMessage) {
        // eslint-disable-next-line eqeqeq
        flags = this.options.flags != null ? new MessageFlags(this.options.flags).bitfield : this.target.flags.bitfield
    }

    let allowedMentions =
        typeof this.options.allowedMentions === 'undefined'
        ? this.target.client.options.allowedMentions
        : this.options.allowedMentions
    if (this.options.reply) {
        const id = this.target.client.users.resolveID(this.options.reply)
        if (allowedMentions) {
            // Clone the object as not to alter the ClientOptions object
            allowedMentions = Util.cloneObject(allowedMentions)
            const parsed = allowedMentions.parse && allowedMentions.parse.includes('users')
            // Check if the mention won't be parsed, and isn't supplied in `users`
            if (!parsed && !(allowedMentions.users && allowedMentions.users.includes(id))) {
                if (!allowedMentions.users) allowedMentions.users = []
                allowedMentions.users.push(id)
            }
        } else {
            allowedMentions = { users: [id] }
        }
    }
    allowedMentions = !allowedMentions || typeof allowedMentions.replied_user == "undefined"
        ? Object.assign(allowedMentions ? allowedMentions : {}, {replied_user: false})
        : allowedMentions
    
    this.data = {
        content,
        tts,
        nonce,
        embed: this.options.embed === null ? null : embeds[0],
        embeds,
        username,
        avatar_url: avatarURL,
        allowed_mentions: typeof content === 'undefined' ? undefined : allowedMentions,
        flags,
        message_reference,
    }
    return this
}