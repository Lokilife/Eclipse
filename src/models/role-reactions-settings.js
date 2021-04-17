const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "role_reactions_settings",
    columns: {
        _id: { // Айди сообщений
            objectId: true,
            primary: true,
            type: "string"
        },
        roles: { // Объект с парами ID-Эмоджи/Юникод-Эмоджи: ID-Роли
            type: "json"
        },
        enabled: { // Включены или нет
            type: "boolean"
        }
    }
});