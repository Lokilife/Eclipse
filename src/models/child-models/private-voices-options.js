const { Schema } = require('mongoose')

module.exports = new Schema({
    enabled:    Boolean,
    template:   String,
    channel:    String,
})