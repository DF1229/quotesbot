// built-in modules
const fs = require('fs');

// third-party modules
const Discord = require('discord.js');

// custom modules
const { token, defaultPrefix } = require('./config.json');
const quoteHandler = require('./custom_modules/quoteHandler.js');
const serverRegistrar = require('./custom_modules/serverRegistrar.js');

// setup
const client = new Discord.Client();
client.commands = new Discord.Collection();
let serverIDcache;

// command registration
const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// client.on
client.on('ready', () => {
    console.clear();
    console.log(`Logged in as ${client.user.tag}`);

    var serverStats = serverRegistrar.run(client);
    console.log(`${serverStats.newServers} server(s) registered, ${serverStats.oldServers} existing server(s) found.`);

    serverIDcache = fs.readdirSync('servers');
});

client.on('message', msg => {
    if (msg.channel.type === 'dm') return;
    if (msg.author.bot) return;
    const guildConfig = JSON.parse(fs.readFileSync(`servers/${msg.guild.id}/settings.json`, (err, data) => {if(err) throw err; return data;}));
    
    if (!guildConfig.quotesChannel) quotesChannelID = 0;
    else quotesChannelID = guildConfig.quotesChannel.id;

    const prefix = guildConfig.prefix || defaultPrefix;

    if (msg.channel.id == quotesChannelID) {
        // check if message is a quote, delete if not
        if (!msg.content.startsWith('"')) {
            return msg.delete();
        }

        // send to quote handler
        quoteHandler.run(msg);
    } else if (msg.content.startsWith(guildConfig.prefix) || msg.content.startsWith(defaultPrefix)) {
        // prefix & command seperation
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // check if command is registered, and make it a variable if so
        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName);
        
        // check if the command requires arguments, and correct the user's usage if needed
        if (command.args && !args.length) {
            let reply = `❌ You didn't provide any arguments, ${msg.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
            }
            return msg.channel.send(reply);
        }

        // check if command is guild-only
        if (command.guildOnly && msg.channel.type === 'dm') {
            return msg.channel.send('❌ This command doesn\'t work in DM\'s!');
        }

        // attempt to execute command, and catch any errors
        try {
            command.execute(msg, args, guildConfig);
        } catch (error) {
            console.error(error);
            msg.channel.send('Oops, we did a fucky wucky!');
        }
    } else {
        // room for special message handling
    }
});

client.login(token);