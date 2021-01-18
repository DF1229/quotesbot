// built-in modules
const fs = require('fs');

// third-party modules
const Discord = require('discord.js');

// custom modules
const { token, defaultPrefix } = require('./config.json');
const quoteHandler = require('./custom_modules/quoteHandler.js');
const serverRegistrar = require('./custom_modules/serverRegistrar.js');
const Logger = require('./custom_modules/logger.js');

// setup
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.deletedMessages = new Discord.Collection();
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
    Logger(client.user.tag, `logged in and ready to receive commands`);

    var serverStats = serverRegistrar.boot(client);
    Logger(client.user.tag, `${serverStats.newServers} server(s) registered, ${serverStats.oldServers} existing server(s) found.`);

    serverIDcache = fs.readdirSync('servers');
});

client.on('message', msg => {
    if (msg.channel.type === 'dm') return;
    if (msg.author.bot) return;
    const guildConfig = JSON.parse(fs.readFileSync(`servers/${msg.guild.id}/settings.json`, (err, data) => {if(err) throw err; return data;}));
    
    if (!guildConfig.quotesChannel) quotesChannelID = 0;
    else quotesChannelID = guildConfig.quotesChannel.id;

    const prefix = guildConfig.prefix || defaultPrefix;
    if (guildConfig.quotes && msg.channel.id == quotesChannelID) {
        // check if message is a quote, delete if not
        if (!msg.content.startsWith('"') && !msg.content.startsWith('“')) {
            Logger(msg.author.tag, `posted a non-quote message in a designated quotes channel`);
            return msg.delete();
        }
        // send to quote handler
        quoteHandler.run(msg);
    } else if (msg.content.startsWith(prefix)) { // Command handling
        // prefix & command seperation
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // check if command is registered, and make it a variable if so
        if (!client.commands.has(commandName)) return; /*{
            Logger(msg.author.tag, `used the bot's prefix, but didn't specify an active command`);
            return msg.channel.send(`❌ Oops, I can't seem to find the command you're looking for!`);
        }*/
        const command = client.commands.get(commandName);

        // check if the user has the correct permission level to run the command.
        if (command.permissionLevel && !msg.member.hasPermission(command.permissionLevel)) {
            return msg.channel.send(`❌ Oops, you dont have the required permission(s) to run that command, ${msg.author}: \`${command.permissionLevel}\``);
        }
        
        // check if the command requires arguments, and correct the user's usage if needed
        if (command.args && !args.length) {
            let reply = `❌ You didn't provide any arguments, ${msg.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
            }
            Logger(msg.author.tag, `attempted to run ${commandName}, but didn't follow proper usage`);
            return msg.channel.send(reply);
        }

        // check if command is guild-only
        if (command.guildOnly && msg.channel.type === 'dm') {
            Logger(msg.author.tag, `attempted to run a GuildOnly command in DM`);
            return msg.channel.send('❌ This command doesn\'t work in DM\'s!');
        }

        // attempt to execute command, and catch any errors
        try {
            Logger(msg.author.tag, `ran command: ${commandName}`);
            command.execute(msg, args, guildConfig);
        } catch (error) {
            Logger(msg.author.tag, error);
            return msg.channel.send('Oops, we did a fucky wucky!');
        }
    } else {
        // room for special message handling
    }
});

client.on('messageDelete', message => {
    client.deletedMessages.set(message.channel.id, message);
});

client.on('guildCreate', guild => {
    Logger(client.user.tag, `joined a new guild: ${guild.name}`);
    if (serverRegistrar.add(guild)) {
        return Logger(client.user.tag, `registered server in /servers/${guild.id}.`);
    } else {
        return Logger(client.user.tag, `failed registering server ${guild.id}!`);
    }
});

client.on('guildDelete', guild => {
    Logger(client.user.tag, `left guild: ${guild.name}`);
    if (serverRegistrar.remove(guild)) {
        return Logger(client.user.tag, `successfully removed all files for guild ${guild.id}`);
    } else {
        return Logger(client.user.tag, `failed to remove files related to guild ${guild.id}!`);
    }
});

client.login(token);
