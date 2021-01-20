const wsStatus = require('../utils/wsStatus.js');
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
        embed.addField('Websocket status', wsStatus[msg.client.ws.status], true);

        let sUptime = Math.round(msg.guild.me.client.uptime/1000);
        var fUptime = calcUptime(sUptime);

        embed.addField('Uptime', `${fUptime}`,true);
        embed.addField('Guilds', msg.guild.me.client.guilds.cache.size, true);

        let members = 0;
        msg.guild.me.client.guilds.cache.forEach(guild => {
            members += guild.memberCount;
        });

        embed.addField('Users', members, true);
        m.delete();

        msg.channel.send(embed);
    }
}

function calcUptime(sUptime) {
    let d = 0, h = 0, m = 0;
    
    while (sUptime > 86400) {
        d++;
        sUptime -= 86400;
    }
    while (sUptime > 3600) {
        h++;
        sUptime -= 3600;
    }
    while (sUptime > 60) {
        m++;
        sUptime -= 60;
    }
    if (d>0) {
        return `${d}d ${h}h ${m}m ${sUptime}s`;
    } else if (h>0) {
        return `${h}h ${m}m ${sUptime}s`;
    } else if (m>0) {
        return `${m}m ${sUptime}s`;
    } else {
        return `${sUptime}s`;
    }
}