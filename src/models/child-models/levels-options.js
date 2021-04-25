const { Schema } = require('mongoose')
const Message = require('./message-options')

module.exports = new Schema({
    enabled: Boolean,
    textMultiplier: Number,
    voiceXpEnable: Boolean,
    voiceMultiplier: Number,
    message: {
        server: Message,
        direct: Message,
    },
    ignoreTextChannels: [String],
    ignoreVoiceChannels: [String],
    ignoreRoles: [String]
})