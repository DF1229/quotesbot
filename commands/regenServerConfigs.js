const Logger = require('../custom_modules/logger.js');
const { superusers } = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'regenServerConfigs',
    description: 'Disable the quote tracking feature, the channel used for quotes will be saved until it is changed',
    args: false,
    guildOnly: true,
    execute(msg, args, guildSettings) {
        // check permission level (MANAGE_GUILD)
        if (!superusers.includes(msg.author.id)) {
            Logger(msg.author.tag, `was denied acces to the ${this.name} command`);
            return msg.channel.send(`❌ Access denied ${msg.author.tag}, this command can only be executed by the bot's developer!`);
        }

        // regenerate the guild's settings, leaving any custom settings untouched
        const serverIDs = fs.readdirSync('../servers');

        for (const id of serverIDs) {
            fs.readFileSync(`../servers/${id}/settings.json`, (err, data) => {
                if (err) throw err;
                let oldSettings = JSON.parse(data);
                
                // Any settings file without the quotes boolean present will have it set to false automatically.
                // This should leave the ones where it is already enable untouched since that would be a boolean.
                if (!oldSettings.quotes instanceof Boolean) {
                    oldSettings.quotes = false;
                }

                // save new settings to server's settings file.
                let newSettingsRaw = JSON.stringify(oldSettings);
                fs.writeFileSync(`../server/${id}/settings.json`, newSettingsRaw, 'utf8', (err) => {
                    if (err) throw err;
                });
            });
        }
    }
}