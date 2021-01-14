const Logger = require('../custom_modules/logger.js');
const fs = require('fs');

module.exports = {
    /**
     * Takes a quote in the form of a DiscordMessage object, and stores data about it on a per-server basis. Server must have a folder in the './servers' directory.
     * @param {DiscordMessage} Message
     */
    run(msg) {
        let info = msg.content.split('-');
        let quoteRaw = info[0];
        let authorRaw = info[1];

        let quoteTemp = quoteRaw.split('"');
        let authorTemp = authorRaw.split(' ');

        const quote = quoteTemp[1];
        const author = authorTemp[1];

        var newQuoteData = new Object();
        newQuoteData.quote = quote;
        newQuoteData.author = author;
        newQuoteData.quoter = msg.author;
        
        const currentQuoteDataRaw = fs.readFileSync(`servers/${msg.guild.id}/quotes.json`, 'utf8', (err, data) => {
            if (err) throw err;
            return data;
        });
        let currentQuoteData = JSON.parse(currentQuoteDataRaw);
        currentQuoteData.quotes.push(newQuoteData);

        const newQuoteDataRaw = JSON.stringify(currentQuoteData);

        fs.writeFileSync(`servers/${msg.guild.id}/quotes.json`, newQuoteDataRaw, (err) => {
            if (err) {
                throw err;
            }
        });

        Logger(msg.author.tag, 'quote stored');
        return msg.react('✅');
    }
}