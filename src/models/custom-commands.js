const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "custom_commands",
    columns: {
        _id: { // ID сервера
            objectId: true,
            primary: true,
            type: "string"
        },
        name: { // Название команды
            type: "string"
        },
        embed: { // Эмбед, и так понятно
            type: "json"
        },
        message: { // Текст сообщения
            type: "string"
        }
    }
});