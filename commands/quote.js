const { superusers } = require('../config.json');
const Discord = require('discord.js');
const fs = require("fs");

module.exports = {
    name: 'quote',
    description: 'Handle all settings surrounding quotes',
    guildOnly: true,
    args: true,
    usage: '<option> <value>',
    options: ['channel', 'tracking', 'add'],
    permissionLeveL: 'MANAGE_GUILD',
    execute(msg, args, guildSettings) {
        if (!this.options.includes(args[0])) {
            const iterator = this.options.values();
            let optionsValuesString = "";

            for (const value of iterator) {
                optionsValuesString += `\`${value}\` `;
            }

            let errEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Invalid argument!')
                .setDescription(`Try using one of these: ${optionsValuesString}`);
            return msg.channel.send(errEmbed);
        }

        switch(args[0]) {
            case 'channel':
                
                break;
            case 'tracking':

                break;
            case 'add':

                break;
            default:
                let errEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Invalid argument!')
                    .setDescription(`ERR: VARIABLE VALUE NOT IN RANGE AT \`{this.args[0]}\`.`);
                return msg.channel.send(errEmbed);
                break;
        }
    }
}