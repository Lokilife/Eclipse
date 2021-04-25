const { Schema, model } = require('mongoose')
const Embed = require('./child-models/embed')

const schema = new Schema({
    _id: String, // Сервера
    name: String, // Название команды
    embed: Embed,
    message: String,
})

module.exports = model("custom_commands", schema)
