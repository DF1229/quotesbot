const Discord = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Get information about a specific user',
    args: true,
    usage: '<@user>',
    guildOnly: true,
    execute(msg) {
        if (!msg.mentions.members.first()) return msg.channel.send(`❌ Oops, you need to specific a user by mentioning them, like this: ${msg.author}`);

        let embed = new Discord.MessageEmbed()
            .setTitle(`User info`)
            .setColor('GOLD')
            .setTimestamp()
            .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL({'dynamic': true}));

        const member = msg.mentions.members.first();
        embed.setThumbnail(member.user.displayAvatarURL({'dynamic': true}));
        embed.addField('Username', `${member.user.tag}`, true);
        embed.addField(`User ID`, `${member.user.id}`, true);
        embed.addField(`Bot`, `${member.user.bot}`, true);
        if (member.user.locale) embed.addField(`User locale`, `${member.user.locale}`, true);
        if (member.nickname) embed.addField(`Nickname`, `${member.nickname}`, true);
        embed.addField(`Joined at`, `${member.joinedAt}`, true);
        embed.addField(`Created at`, `${member.user.createdAt}`, true);
        embed.addField(`User ping`, `${member.user.client.ws.ping}ms`, true);
        if (member.premiumSince) embed.addField(`Premium since`, `${member.premiumSince}`);
        embed.addField(`Highest role`, `${member.roles.highest}`, true);

        return msg.channel.send(embed);
    }
}