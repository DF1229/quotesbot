const quoteHandler = require('../utils/quoteHandler.js');
const { superusers } = require('../config.json');
const Discord = require('discord.js');
const fs = require("fs");

module.exports = {
    name: 'quote',
    description: 'Handle all settings surrounding quotes',
    guildOnly: true,
    args: true,
    usage: '<option> <setting> [value]',
    options: ['channel', 'tracking', 'add'],
    permissionLeveL: 'MANAGE_GUILD',
    async execute(msg, args, guildSettings) {
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
                const chnlSettings = ['view', 'remove', 'set'];
                if (!chnlSettings.includes(args[1])) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Invalid setting!')
                        .setDescription(`This option does not have that setting, try one of these: \`view\` \`remove\` \`set\`.`);
                    return msg.channel.send(embed);
                }

                const newSettingsA = channel(args[1], args[2], guildSettings);
                saveSettings(newSettingsA);
                break;
            case 'tracking':
                const trackSettings = ['disable', 'enable'];
                if (!trackSettings.includes(args[1])) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Invalid setting!')
                        .setDescription(`This option does not have that setting, try one of these: \`enable\` \`disable\`.`);
                    return msg.channel.send(embed);
                }

                const newSettingsB = tracking(args[1], args[2], guildSettings);
                saveSettings(newSettingsB);
                break;
            case 'add':
                let quoteChnl = msg.guild.channels.cache.get(guildSettings.quotesChannel.id);
                if (!quoteChnl) return msg.channel.send(`❌ Oops, I couldn't find this server's quotes channel! Is quote tracking enabled in this server?`);
                 console.log(`quoteChnl:\n${quoteChnl}\n`);
                let quoteMsg = await quoteChnl.messages.fetch(args[2]);
                if (!quoteMsg) return msg.channel.send(`❌ Oops, I couldn't fetch the message from ${quoteChnl}! Check to see if you provided the right message ID!`);
                 console.log(`quoteMsg:\n${quoteMsg}\n`);
                // check to see if the bot already reacted to the message, which means it has already been handled
                let qtMsgReactionManager = quoteMsg.reactions;
                console.log(`qtMsgReactionManager:\n${qtMsgReactionManager}`);

                //quoteHandler.run(quoteMsg);
                break;
            default:
                let errEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Invalid argument!')
                    .setDescription(`ERR: VARIABLE VALUE NOT IN RANGE AT \`{this.args[0]}\` (switch.default).`);
                msg.channel.send(errEmbed);
                break;
        }
    }
}

function channel(setting, value, guildSettings) {

}

function tracking(setting, value, guildSettings) {

}

function saveSettings(newSettings) {

}