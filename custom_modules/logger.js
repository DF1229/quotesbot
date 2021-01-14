const fs = require('fs');
module.exports = {
    Log(authorTag, logMsg) {
        const date = new Date();
        const UTCstring = date.toISOString().substr(0, 10);
        const timeString = date.toISOString().substr(11, 8);

        var nextEntry = `${timeString} - ${authorTag} ${description}\n`;

        fs.appendFile(`./logs/${UTCstring}.txt`, nextEntry, 'utf8', (err) => {
            if (err) throw err;
        });
        console.log(nextEntry);
    }
} 