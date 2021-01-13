const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'setprefix',
    description: 'Set the bot\'s command prefix for this server',
    usage: '<prefix>',
    args: true,
    execute(msg, args, guildSettings) {
        if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(`❌ Oops, you don't have the right permissions to use that command! \`MANAGE_GUILD\``);

        // add/overwrite server prefix
        let newPrefix = args[0];
        guildSettings.prefix = newPrefix;

        // save new server config
        let newSettings = JSON.stringify(guildSettings);
        fs.writeFileSync(`servers/${msg.guild.id}/settings.json`, newSettings, 'utf8', (err) => {
            if (err) throw err
        });

        // respond to user's command
        let embed = new Discord.MessageEmbed()
            .setTitle('Bot\'s prefix updated!')
            .addField('New prefix', guildSettings.prefix, true)
            .setColor('BLUE')
            .setTimestamp()
            .setThumbnail(msg.guild.iconURL());
        msg.channel.send(embed);
    }
}