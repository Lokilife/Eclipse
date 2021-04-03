const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "private_voices",
    columns: {
        _id: { // ID участника
            objectId: true,
            primary: true,
            type: "string"
        },
        channelID: { // ID созданного канала (может быть пустым когда канал удалён)
            type: "string" 
        },
        guildID: { // ID сервера
            type: "string"
        },
        blockedUsers: { // Заблокированные пользователи, массив ID
            type: "array"
        },
        mutedUsers: { // Замьюченные пользователи, массив ID
            type: "array"
        }
    }
});