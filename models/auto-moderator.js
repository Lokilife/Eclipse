const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "custom_commands",
    columns: {
        _id: { // ID сервера
            objectId: true,
            primary: true,
            type: "string"
        },

        enabled: {
            type: "boolean"
        },
        exceptions: {
            type: "json"
        },
        logs: {
            type: "json"
        },
    }
});