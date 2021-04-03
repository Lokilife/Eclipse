import discord from "discord.js";

interface Listener {
    setup?: any;
    name: string;
    run: any;
}

/**
 * Расширенные настройки клиента используемые в client.js
 * @implements {discord.ClientOptions}
 */
interface ClientOptions implements discord.ClientOptions {
    commandsDir?: string;
    listenersDir?: string;
    commandsEnabled?: boolean;
}

/**
 * Настройки команды и всё в таком духе
 */
interface CommandOptions {
    run: AsyncFunction;
    aliases: string[];
    ownerOnly?: boolean;
    cooldown?: number;
    help?: HelpResolvable;
    botPermissions: discord.PermissionsResolvable;
    userPermissions: discord.PermissionsRevolvable;
}

/**
 * Свойства хелпа, не ну, а что ещё тут можно придумать?
 * Всё равно в IntelliSense не отобразится (наверное).
 */
interface HelpResolvable {
    category?: string;
    description?: string;
    arguments?: string;
    usage?: string;
}