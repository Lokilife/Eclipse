const { Schema, model }            = require('mongoose')
const Logs                  = require('./child-models/logs')
const LevelsOptions         = require('./child-models/levels-options')
const Message               = require('./child-models/message-options')
const PrivateVoicesOptions  = require('./child-models/private-voices-options')

const schema = new Schema({
    _id: String, // ID сервера,
    welcome: {
        server: Message,
        direct: Message,
    },
    goodbye: {
        server: Message,
        direct: Message,
    },
    logs: Logs,
    levels: LevelsOptions,
    privateVoices: PrivateVoicesOptions,
    premium: Boolean
})

module.exports = model("guilds", schema)