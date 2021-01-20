const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'shitpost',
    description: 'Get a random shitpost from the pile',
    async execute(msg) {
        let embed = new Discord.MessageEmbed()
        
        const shitposts = fs.readdirSync('shitposts');
        const num = Math.floor(Math.random() * shitposts.length);
        embed.attachFiles(`shitposts/${num}.jpg`);
        const sMsg = await msg.channel.send(embed);
        sMsg.suppressEmbeds();
    }    
}