const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'setquoteschannel',
    description: 'Set the channel to be used for registering quotes',
    usage: '<channel>',
    args: true,
    execute(msg, args, guildSettings) {
        if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(`❌ Oops, you don't have the right permissions to use that command! \`MANAGE_GUILD\``);

        // add/overwrite quote channel id
        let newChannel = msg.mentions.channels.first();
        guildSettings.quotesChannel = newChannel;
        guildSettings.quotes = true;

        // save new server config
        let newSettings = JSON.stringify(guildSettings);
        fs.writeFileSync(`servers/${msg.guild.id}/settings.json`, newSettings, 'utf8', (err) => {
            if (err) throw err
        });

        // respond to user's command
        let embed = new Discord.MessageEmbed()
            .setTitle('Quotes channel updated!')
            .addField('New quotes channel', guildSettings.quotesChannel, true)
            .setColor('BLUE')
            .setTimestamp()
            .setThumbnail(msg.guild.iconURL());
        msg.channel.send(embed);
    }
}