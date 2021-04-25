const { Schema } = require('mongoose')

module.exports = new Schema({
    author: {
        name:           String,
        url:            String,
        iconURL:        String,
        proxyiconURL:   String
    },
    color:          Number,
    createdAt:      Date,
    description:    String,
    fields: [{
        name:   String,
        value:  String,
        inline: Boolean,
    }],
    footer: {
        text:           String,
        iconURL:        String,
        proxyiconURL:   String,
    },
    hexColor:   String,
    image: {
        url:        String,
        proxyURL:   String,
        height:     Number,
        width:      Number,
    },
    thumbnail: {
        url:        String,
        proxyURL:   String,
        height:     Number,
        width:      Number,
    },
    title:  String,
    url:    String,
})