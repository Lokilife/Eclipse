const { Schema, model } = require("mongoose")

const schema = new Schema({
    _id: String,
    guildId: String,
    level: Number,
    xp: Number,
    voiceTime: Number,
})

module.exports = model("users", schema)
