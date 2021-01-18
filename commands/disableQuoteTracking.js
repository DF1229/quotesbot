const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'disablequotetracking',
    description: 'Disable the quote tracking feature, the channel used for quotes will be saved unless changed',
    args: false,
    guildOnly: true,
    execute(msg, args, guildSettings) {
        // check permission level (MANAGE_GUILD)
        if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(`❌ Oops, you don't have the right permissions to use that command! \`MANAGE_GUILD\``);

        // change setting
        guildSettings.quotes = false;

        // save changes to settings.json
        const newSettings = JSON.stringify(guildSettings);
        fs.writeFileSync(`../servers/${msg.guild.id}/settings.json`, newSettings, 'utf8', (err) => {
            if (err) throw err;
        });
        
        // embed structure
        let embed = new Discord.MessageEmbed()
            .setTitle('Server settings updated')
            .addField('Bot prefix', guildSettings.prefix, true)
            .setColor('GREEN')
            .setTimestamp()
            .setThumbnail(msg.guild.iconURL());
        
        if (guildSettings.quotes) {
            embed.addField(`Quote tracking`, `Enabled`);
        } else {
            embed.addField(`Quote tracking`, `Disabled`);
        }

        if (guildSettings.quotesChannel) {
            embed.addField(`Quotes channel`, msg.guild.channels.cache.get(guildSettings.quotesChannel.id));
        } else {
            embed.addField('Quotes channel', 'Not defined');
        }

        // respond to user's message
        return msg.channel.send(embed);
    }
}