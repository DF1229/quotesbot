const fs = require('fs');
const { defaultPrefix } = require('../config.json');

module.exports = {
    /**
     * Generates a list of all servers the bot is a member of, and creates the directories for their config files.
     * @param {Client} client 
     * @returns {Object} Amount of new, and old servers found.
     */
    run(client) {        
        let servers = {};
        var newServers = 0, oldServers = 0;
        client.guilds.cache.forEach(guild => {
            if (!fs.existsSync(`servers/${guild.id}`)) {
                let temp = new Object();
                temp.name = guild.name;
                temp.id = guild.id;
                temp.prefix = defaultPrefix;
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
    }
}