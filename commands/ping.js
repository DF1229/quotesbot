const Logger = require('../custom_modules/logger.js');
const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'pong!',
    args: false,
    guildOnly: false,
    async execute(msg) {
        let embed = new Discord.MessageEmbed()
            .setTitle('Ping :ping_pong: Pong')
            .setColor('GREEN')
            .setFooter(msg.client.user.tag, msg.client.user.avatarURL([{'dynamic': true}]));

        const m = await msg.channel.send('Pinging...');

        embed.addField('Ping to bot', `${m.createdTimestamp - msg.createdTimestamp}ms`, true);
        embed.addField('API Heartbeat', `${Math.round(msg.client.ws.ping)}ms`, true);
        embed.addField('Websocket status', `${msg.client.ws.status}`, true);
        embed.addField('Uptime', `${Math.round(msg.guild.me.client.uptime/1000)}s`,true);
        embed.addField('Guilds', msg.guild.me.client.guilds.cache.size, true);

        let members;
        msg.guild.me.client.guilds.cache.forEach(guild => {
            members += guild.memberCount;
        });

        embed.addField('Users', members, true);
        m.delete();

        msg.channel.send(embed);
    }
}