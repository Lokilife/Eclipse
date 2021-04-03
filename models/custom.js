const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "custom",
    columns: { // This is mine territory, so here i don't write docs :).
        _id: { // Guild ID
            objectId: true,
            primary: true,
            type: "string"
        },
        user: { // ID пользователя
            type: "number"
        },
        header: {
            type: "json"
        },
        fields: {
            type: "array"
        },
        image: {
            type: "string"
        },
        line: {
            type: "number"
        }
    }
});