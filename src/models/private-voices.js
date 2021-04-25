const { Schema, model } = require('mongoose')

const schema = new Schema({
    _id: String, // ID участника
    channelID: String,
    guildID: String,
    blockedUsers: [String], // Массив ID заблокированных пользователей
    mutedUsers: [String] // Массив ID замьюченных пользователей
})

module.exports = model("private_voices", schema)
