const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'A list of all of the bot\'s commands, or info about a specific command',
    guildOnly: false,
    args: false,
    execute(msg, args, guildSettings) {
        const { commands } = msg.client;
        let embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setTimestamp()
            .setFooter(msg.client.user.tag, msg.client.user.avatarURL({'dynamic': true}));

        if (!args.length) {
            embed.setTitle('All available commands');

            commands.each(command => {
                const name = command.name;
                const description = command.description;

                if (command.usage) {
                    const usage = command.usage;
                    embed.addField(name, usage, true);
                } else {
                    embed.addField(name, description, true);
                }
            });
        } else if (args.length == 1) {
            const name = args[0].toLowerCase();
            const command = commands.get(name);

            if (!command) {
                return msg.channel.send(`❌ I couldn't find that command, ${msg.author}!`);
            }
            embed.setTitle(name);
            embed.setDescription(command.description);

            if (command.usage) embed.addField('Usage'. command.usage, true);
        } else {
            msg.channel.send(`❌ You provided too many arguments, ${msg.author}!`);
        }

        return msg.channel.send(embed)
            .catch(console.error);
    }
}