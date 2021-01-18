const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'viewsettings',
    description: 'View the bot\'s settings for this server',
    usage: '',
    args: false,
    permissionLevel: 'VIEW_AUDIT_LOG',
    execute(msg, args, guildSettings) {
        // respond to user's command
        let embed = new Discord.MessageEmbed()
            .setTitle('Current server settings')
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

        return msg.channel.send(embed);
    }
}