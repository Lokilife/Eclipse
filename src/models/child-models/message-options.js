const { Schema } = require('mongoose')
const Embed = require('./embed')

module.exports = new Schema({
    enabled: Boolean,
    content: String,
    embed:   Embed,
})