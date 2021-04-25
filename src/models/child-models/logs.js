const { Schema } = require('mongoose')

module.exports = new Schema({
    'all':          [String],
    'messages':     String,
    'voice-log':    String,
    'admin-log':    String,
    'members-log':  String,
    'bots-log':     String,
})