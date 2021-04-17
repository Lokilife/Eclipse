/**
 * Начало иерарзии классов ошибок команд.
 * Запрещено использовать кроме как создания новых типов ошибок.
 * Кто запрещает? Я!
 */
class CommandError extends Error {
    /**
     * @param {string} error Текст ошибки
     * @param {Message} message Сообщение которое вызывало ошибку
     * @param {GuildMember | User} author Автор сообщения
     */
    constructor(error, message, author) {
        super(error);
        /**
         * Сообщение которое вызвало ошибку.
         * @type {Message}
         */
        this.message = message;
        /**
         * Канал в котором была вызвана ошибка.
         * @type {TextChannel}
         */
        this.channel = message.channel;
        /**
         * Автор сообщения.
         * @type {GuildMember | User}
         */
        this.author = author;
    }
}

/**
 * Ошибка вызываемая когда человек пытается использовать
 * ownerOnly команду, но он не является владельцем бота.
 * @type {NotOwner}
 */
class NotOwner extends CommandError {}

/**
 * Ошибка вызываемая когда в команде происходит неизвестная ошибка
 * которую ничто не отлавливает.
 * @type {UnknownError}
 */
class UnknownError extends CommandError {
    /**
     * @param {string} error Текст ошибки
     * @param {Message} message Сообщение которое вызывало ошибку
     * @param {GuildMember | User} author Автор сообщения
     */
    constructor(error, message, author) {
        super(error, message, author);
        /**
         * Текст ошибки
         * @type {string}
         */
        this.error = error;
    }
}

/**
 * Ошибка вызываемая когда у человека отсутствуют права
 * чтобы использовать эту команду.
 * @type {MissingPermissions}
 */
class MissingPermissions extends CommandError {
    /**
     * @param {string} error Текст ошибки
     * @param {Message} message Сообщение вызвавшее ошибку
     * @param {GuildMember} author Автор сообщения
     * @param {PermissionResolvable} permissions Отсутствующие права
     */
    constructor(error, message, author, permissions) {
        super(error, message, author);
        /**
         * Отсутствующие права
         * @type {PermissionResolvable}
         */
        this.permissions = permissions;
    }
}

/**
 * Ошибка вызываемая когда у бота отсутствуют права
 * чтобы вызывать эту команду.
 * @type {BotMissingPermissions}
 */
class BotMissingPermissions extends CommandError {
    /**
     * @param {string} error Текст ошибки
     * @param {Message} message Сообщение вызвавшее ошибку
     * @param {GuildMember} author Автор сообщения
     * @param {PermissionResolvable} permissions Отсутствующие права
     */
    constructor(error, message, author, permissions) {
        super(error, message, author);
        /**
         * Отсутствующие права
         * @type {PermissionResolvable}
         */
        this.permissions = permissions;
    }
}

module.exports.CommandError = CommandError;
module.exports.NotOwner = NotOwner;
module.exports.UnknownError = UnknownError;
module.exports.MissingPermissions = MissingPermissions;
module.exports.BotMissingPermissions = BotMissingPermissions;