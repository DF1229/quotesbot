const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'viewsettings',
    description: 'View the bot\'s settings for this server',
    usage: '',
    args: false,
    execute(msg, args, guildSettings) {
        if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(`❌ Oops, you don't have the right permissions to use that command! \`MANAGE_GUILD\``);

        // respond to user's command
        let embed = new Discord.MessageEmbed()
            .setTitle('Current server settings')
            .addField('Server name', guildSettings.name)
            .addField('Server ID', guildSettings.id)
            .addField('Bot prefix', guildSettings.prefix, true)
            .setColor('GOLD')
            .setTimestamp()
            .setThumbnail(msg.guild.iconURL());
            
            if (!guildSettings.quotesChannel) {
                msg.channel.send(embed);
            } else {
                embed.addField('Quotes channel', msg.guild.channels.cache.get(guildSettings.quotesChannel.id));
                msg.channel.send(embed);
        }
    }
}