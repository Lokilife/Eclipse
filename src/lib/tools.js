// Экономим на const)))!
const { User, Guild, GuildMember } = require("discord.js"),
      
      Users = require("../models/users"),
      Guilds = require("../models/guilds")

const permissions = {
    "ADMINISTRATOR":            "Администратор",
    "CREATE_INSTANT_INVITE":    "Создавать приглашение",
    "KICK_MEMBERS":             "Выгонять участников",
    "BAN_MEMBERS":              "Банить участников",
    "MANAGE_CHANNELS":          "Управлять каналами",
    "MANAGE_GUILD":             "Управлять сервером",
    "ADD_REACTIONS":            "Добавлять реакции",
    "VIEW_AUDIT_LOG":           "Просматривать аудит",
    "PRIORITY_SPEAKER":         "Приоритетный режим",
    "VIEW_CHANNEL":             "Просматривать канал",
    "SEND_MESSAGES":            "Отправлять сообщения",
    "SEND_TTS_MESSAGES":        "Отправлять Text-To-Speech сообщения",
    "MANAGE_MESSAGES":          "Управлять сообщениями",
    "ATTACH_FILES":             "Отправлять файлы",
    "READ_MESSAGE_HISTORY":     "Просматривать историю сообщений",
    "MENTION_EVERYONE":         "Упоминание `@everyone`, `@here`",
    "USE_EXTERNAL_EMOJIS":      "Использовать внешние эмодзи",
    "VIEW_GUILD_INSIGHTS":      "Просматривать аналитику сервера",
    "MUTE_MEMBERS":             "Отключать участникам микрофон",
    "DEAFEN_MEMBERS":           "Отключать участникам звук",
    "MOVE_MEMBERS":             "Перемещать участников",
    "USE_VAD":                  "Использовать режим активации по голосу",
    "CHANGE_NICKNAME":          "Изменять никнейм",
    "MANAGE_NICKNAMES":         "Управлять никнеймами",
    "MANAGE_ROLES":             "Управлять ролями",
    "MANAGE_WEBHOOKS":          "Управлять вебхуками",
    "MANAGE_EMOJIS":            "Управлять эмодзи",
    "CONNECT":                  "Подключаться",
    "STREAM":                   "Стримить",
    "SPEAK":                    "Разговаривать",
}

/**
 * Конвертирует названия прав в человеческий русский язык;
 * Например: MANAGE_EMOJIS => Управлять эмодзи
 * @param {Array<Permissions>} perms Права которые нужно конвертировать
 * @returns {Array<string>} perms
 */
function permsToText(perms) { // Просто взял и сократил всё до одной строки сэкономив несколько битов :) - Lokilife
    return perms.map(value => permissions[value])
}

function Database() {
    async function addUser(user, guild) {
        // Нам нужен только id'шник, а мы ещё принимаем другие типы по мимо User/GuildMember/Guild для удобства
        member = user instanceof GuildMember ? Object.assign(user) : null
        user = (user instanceof User || user instanceof GuildMember) ? user.id : user
        guild = (guild instanceof Guild) ? guild.id : member ? member.guild : guild
        
        await Users.create({
            _id: user,
            guildId: guild.id,
            level: 1,
            xp: 0,
            voiceTime: 0,
            roles: []
        })
    }

    async function addGuild(guild) {
        if (guild instanceof Guild) guild = guild.id
    
        await Guilds.create({
            _id: guild,
            welcome: {
                server: {
                    enabled: false
                },
                direct: {
                    enabled: false
                }
            },
            goodbye: {
                server: {
                    enabled: false
                },
                direct: {
                    enabled: false
                }
            },
            logs: {},
            levels: {
                enabled: false,
                textMultiplier: 1,
                voiceXpCounterEnable: false,
                voiceMultiplier: 1,
                message: {
                    server: {
                        enable: false
                    },
                    direct: {
                        enable: false
                    }
                }
            },
            privateVoices: {
                enabled: false
            },
            autoRolesRecoveryEnabled: false,
            recovereablyRoles: [],
            defaultRolesEnabled: false,
            userDefaultRoles: [],
            botDefaultRoles: [],
            premium: false,
        })
    }
    return {
        /**
         * Добавляет пользователя в базу данных;
         * @param {User|GuildMember|string} user Пользователь которого нужно добавить
         * @param {Guild|string} guild Сервер пользователя
         */
        addUser,
        /**
         * Добавляет сервер в базу данных;
         * @param {Guild|string} guild Сервер который нужно добавить
         */
        addGuild,
    }
}

/**
 * @param {Number} milliseconds
 */
function parseMS(milliseconds) {
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil
    return {
        days: roundTowardsZero(milliseconds / 86400000),
        hours: roundTowardsZero(milliseconds / 3600000) % 24,
        minutes: roundTowardsZero(milliseconds / 60000) % 60,
        seconds: roundTowardsZero(milliseconds / 1000) % 60,
        milliseconds: roundTowardsZero(milliseconds) % 1000
    };
}

/**
 * @param {Number} first
 * @param {Number} second
 */
function getRandomInRange(first, second) {
    const check = first > second, // Ты на это потратил 7 строк, когда я справился тремя и даже сэкономив пару наносекунд в рантайме! - Lokilife
          min = check ? second : first,
          max = check ? first  : second
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function securitylevel(level) {
    return level.length == 0 ? "Все без исключений"
    :`Нужные права: "${permsToText(level).join(", ")}"`
}

/**
 * Возвращает параметры для типа содержимого x-www-form-urlencoded
 * @param {Object} params
 * @returns {string}
 */
function encodeDataToUrlForm(params) {
    let formBody = []
    for (const property in params) {
        const encodedKey = encodeURIComponent(property)
        const encodedValue = encodeURIComponent(params[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    return formBody.join("&")
}

module.exports = {
    permsToText,
    parseMS,
    getRandomInRange,
    securitylevel,
    Database,
    encodeDataToUrlForm
}
