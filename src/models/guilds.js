const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "guilds",
    columns: {
        _id: { // ID сервера
            objectId: true,
            primary: true,
            type: "string"
        },
        welcome: {
            /* {
                server: { // Отправляется на сервере;
                    type: "false" || "embed" // false - выключено, embed - эмбед :D;
                    // embed
                    content: "Some message content" // Не обязательно, текстовое содержание сообщения;
                    embed: { // Стандартный код embed'а;
                        //...
                    }
                },
                direct: { // Абсолютно тоже самое что и server, но отправляет в ЛС;
                    //...
                }
            } */
            type: "json"
        },
        goodbye: {
            /* {
                server: { // Отправляется на сервере
                    type: "false" || "embed" // false - выключено, embed - эмбед :D;
                    // embed
                    content: "Some message content" // Не обязательно, текстовое содержание сообщения;
                    embed: { // Стандартный код embed'а;
                        //...
                    }
                },
                direct: { // Абсолютно тоже самое что и server, но отправляет в ЛС;
                    //...
                }
            } */
            type: "json"
        },
        logs: {
            /* {
                all: "CHANNEL_ID"  // - Все логи сразу в один канал;
                messages: "CHANNEL_ID" // - Лог сообщений, изменения/удаления;
                voice-log: "CHANNEL_ID" // - Лог заходов/выходов из голосовых каналов;
                admin-log: "CHANNEL_ID" // - Лог административных действий, бан/разбан, кик, мут/размут, предупреждение/снятие предупреждения и т. д.;
                members-log: "CHANNEL_ID" // - Лог изменений никнейма (глобально и локально), аватарки, тега в дискорде;
                bots-log: "CHANNEL_ID" // - Лог приглашений/киков ботов на/с сервер(а);
            } */
            type: "json"
        },
        levels: {
            /* {
                enabled: false || true // - Включён ли счётчик уровня или нет;
                textMultiplier: INT // - Множитель опыта за текстовые сообщений;
                voiceXpCounterEnable: false || true // - Включён ли счётчик опыта за минуты в войсе
                voiceMultiplier: INT // - Множитель опыта за минуты в войсе;
                message: { // Сообщение за повышение уровня;
                    server: { // Только если человек получил при отправке сообщения;
                        enable: false || true // - Включено ли сообщение на сервере за повышение уровня;
                        content: "Some content" // Необязательный аргумент, текстовое содержание сообщения;
                        embed: { // Стандартный Embed

                        }
                    },
                    direct: { // Тоже самое что и server, но отправляется ещё и за повышение в войсе
                        //...
                    }
                }
            } */
            type: "json"
        },
        privateVoices: {
            /* {
                enabled: true || false // - Включены ли приватные румы или нет
                template: "{NAME}'s ROOM" // - Шаблон имён каналов
                category: "CATEGORY_ID" // - ID категории в которой находятся войсы
                channel: "CHANNEL_ID" // - ID канала в который надо создать для создания приватной румы
            } */
            type: "json"
        },
        premium: {
            type: "boolean" // false - нету, true - весь премиум
        },
    }
});