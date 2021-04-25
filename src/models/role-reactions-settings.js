const { Schema, model } = require('mongoose')

const schema = new Schema({
    _id: String, // ID соощения
    roles: [{
        emoji: String, // ID-Эмоджи/Юникод,
        role: String,
    }],
    enabled: Boolean
})


module.exports = model("role_reactions_settings", schema)
