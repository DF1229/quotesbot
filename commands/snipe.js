const Discord = require('discord.js');

module.exports = {
    name: 'snipe',
    description: 'Snipe that deleted message back into existance!',
    guildOnly: true,
    args: false,
    execute(msg) {
        console.log(msg.guild.me.client.deletedMessages);
        
        if (msg.guild.me.client.deletedMessages.size == 0) return msg.channel.send(
            new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('❌ Nothing to snipe!'));

        const dMsg = msg.guild.me.client.deletedMessages.get(msg.channel.id);
        if (!dMsg) return msg.channel.send(`❌ Couldn't find anything to snipe!`);

        let embed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setAuthor(dMsg.author.tag, dMsg.author.avatarURL({ dynamic: true}))
            .setDescription(dMsg.content);

        msg.guild.me.client.deletedMessages.clear();
        return msg.channel.send(embed);
    }
}