const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'shitpost',
    description: 'Get a random shitpost the pile',
    execute(msg) {
        let embed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setFooter(msg.client.user.tag, msg.client.user.avatarURL({'dynamic': true}));
        
        const shitposts = fs.readdirSync('shitposts');
        const num = Math.floor(Math.random() * shitposts.length);
        embed.setImage(`shitposts/${num}.jpg`);
        embed.setTitle(`Shitpost #${num}`);
        msg.channel.send(embed);
    }    
}