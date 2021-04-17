const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "users",
    columns: {
        _id: { // Айди участника
            objectId: true,
            primary: true,
            type: "string"
        },
        guildId: { // Айди сервера
            type: "string"
        },
        level: { // Уровень участника
            type: "int"
        },
        xp: { // Опыт участника
            type: "int"
        },
        voiceTime: { // Время в войсе, в секундах
            type: "int"
        },
        ignoreTextChannels: { // Игнорируемые текстовые каналы
            type: "array"
        },
        ignoreVoiceChannels: { // Игнорируемые голосовые каналы (можно было бы в одно поле запихнуть, но тогда как на сайте их различать?)
            type: "array"
        },
        ignoreRoles: { // Роли с которыми опыт не начисляется
            type: "array"
        }
    }
});