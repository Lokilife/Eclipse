/// <references types="../typings/index.d.ts">
/**
 * Класс команды, значительная часть бота
 * без которой команды не будут работать.
 */
class Command {
    /**
     * @param {CommandOptions} options
     */
    constructor(options = {}) {
        this.run = options.run;
        this.aliases = options.aliases;
        this.ownerOnly = options.onwerOnly;
        this.cooldown = options.cooldown;
        this.help = options.help;
        this.botPermissions = options.botPermissions;
        this.userPermissions = options.userPermissions;
    }
}

module.exports = Command;