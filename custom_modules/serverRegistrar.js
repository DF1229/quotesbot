const { defaultPrefix } = require('../config.json');
const fs = require('fs');

module.exports = {
    /**
     * Generates a list of all servers the bot is a member of, and creates the directories for their config files.
     * Only meant to run once, during the bot's ready event.
     * @param {Client} client 
     * @returns {Object} Amount of new, and old servers found.
     */
    boot(client) {
        let servers = {};
        var newServers = 0, oldServers = 0;
        client.guilds.cache.forEach(guild => {
            if (!fs.existsSync(`servers/${guild.id}`)) {
                let temp = new Object();
                temp.name = guild.name;
                temp.id = guild.id;
                temp.prefix = defaultPrefix;
                temp.quotes = false;
                let tempStr = JSON.stringify(temp);

                let temp2 = new Object();
                temp2.guildID = guild.id;
                temp2.quotes = [];
                let temp2Str = JSON.stringify(temp2);

                fs.mkdirSync(`servers/${guild.id}`);
                fs.writeFileSync(`servers/${guild.id}/settings.json`, tempStr, (err) => {
                    if (err) throw err;
                });
                fs.writeFileSync(`servers/${guild.id}/quotes.json`, temp2Str, (err) => {
                    if (err) throw err;
                });
                newServers++;
            } else {
                oldServers++;
            }
                      
            servers.newServers = newServers;
            servers.oldServers = oldServers;
        });
        return servers;
    },
    /**
     * This method generates default config files for new servers. 
     * Meant to be executed a limitless amount of times during runtime.
     * @param {Guild} guild Guild for which default config files should be made
     * @returns {Boolean} True on success, throws an error on failure.
     */
    add(guild) {
        fs.mkdirSync(`server/${guild.id}`);

        let settings = new Object();
        settings.name = guild.name;
        settings.id = guild.id;
        settings.prefix = defaultPrefix;
        settings.quotes = false;
        let settingsStr = JSON.stringify(settings);

        let quotes = new Object();
        quotes.guildID = guild.id;
        temp2.quotes = [];
        let quotesStr = JSON.stringify(quotes);

        fs.writeFileSync(`servers/${guild.id}/settings.json`, settingsStr, 'utf8', (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(`servers/${guild.id}/quotes.json`, quotesStr, 'utf8', (err) => {
            if (err) throw err;
        });

        return true;
    },
    /**
     * Recursively deletes any files in regard to the provided guild object.
     * Meant to be run a limitless amount of times during runtime.
     * @param {Guild} guild 
     */
    remove(guild) {
        if (!fs.existsSync(`servers/${guild.id}`)) return false;

        fs.rmdirSync(`servers/${guild.id}`, {recursive: true, maxRetries: 0});
        return true;
    }
}