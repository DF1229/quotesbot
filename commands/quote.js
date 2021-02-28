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

        switch (args[0]) {
            case 'channel':
                const chnlSettings = ['view', 'remove', 'set'];
                if (!chnlSettings.includes(args[1])) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Invalid setting!')
                        .setDescription(`This option does not have that setting, try one of these: \`view\` \`remove\` \`set\`.`);
                    return msg.channel.send(embed);
                }

                saveSettings(args[1], args[2], guildSettings);
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
                switch (args[2]) {
                    case 'enable':
                        args[2] = true;
                        break;
                    case 'disable':
                        args[2] = false;
                        break;
                }

                if (saveSettings(args[1], args[2], guildSettings)) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`Setting \`${args[1]}\` successfully saved with value \`${args[2]}\`.`);
                    msg.channel.send(embed);
                } else {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`Failed to save new setting, perhaps it was equal to the current setting?`);
                    msg.channel.send(embed);
                }
                break;
            case 'add':
                let quoteChnl = msg.guild.channels.cache.get(guildSettings.quotesChannel.id);
                if (!quoteChnl) return msg.channel.send(`❌ Oops, I couldn't find this server's quotes channel! Is quote tracking enabled in this server?`);
                console.log(`quoteChnl:\n${JSON.stringify(quoteChnl)}\n`);
                let quoteMsg = await quoteChnl.messages.fetch(args[2]);
                if (!quoteMsg) return msg.channel.send(`❌ Oops, I couldn't fetch the message from ${quoteChnl}! Check to see if you provided the right message ID!`);
                console.log(`quoteMsg:\n${JSON.stringify(quoteMsg)}\n`);
                // check to see if the bot already reacted to the message, which means it has already been handled
                let qtMsgReactionManager = quoteMsg.reactions;
                console.log(`qtMsgReactionManager:\n${JSON.stringify(qtMsgReactionManager)}`);

                //quoteHandler.run(quoteMsg);
                break;
            default:
                let errEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Invalid setting!')
                    .setDescription(`Setting ${args[0]} couldn't be found, check your spelling.`);
                msg.channel.send(errEmbed);
                break;
        }
    }
}

function saveSettings(setting, value, guildSettings) {
    var guildId = guildSettings.id;
        
    /*
    * Twee opties:
    *   - oude methode, per setting verschillende functies gebruiken
    *   - nieuwe methode, voor alle settings één functie die onderschijd maakt.
    *       * bepaald ook welk bestand de value in opgeslagen moet worden!
    */
}