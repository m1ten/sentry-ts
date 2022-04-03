// import dependencies
const { Client, Collection, Intents } = require('discord.js');
const { readdirSync } = require('fs');

// check if token .env exists
if (!process.env.TOKEN) {
    const dotenv = require('dotenv');
    // load environment variables from .env file
    dotenv.config();
}

// create a new Discord client
const sentry = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    presence: {
        status: 'online',
        activities: [
            {
                name: 'You are not the owner of me.',
                type: 'PLAYING',
            },
        ],
    },
});

sentry.commands = new Collection();

sentry.ownerID = process.env.OWNER_ID;

const commands = [];
// get all command files

const commandFiles = readdirSync(__dirname + '/cmds');
const eventFiles = readdirSync(__dirname + '/events');

commandFiles.forEach((file) => {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const command = require(`./cmds/${file}`);

        sentry.commands.set(command.data.name, command);

        commands.push(command.data.toJSON());
    }
});

eventFiles.forEach((file) => {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const event = require(`./events/${file}`);

        if (event.once) {
            sentry.once(event.name, (...args) => event.execute(...args));
        }
        else {
            sentry.on(event.name, (...args) => event.execute(...args, sentry));
        }

        console.log(`Loaded event: ${event.name}`);
    }
});

// login to discord
sentry.login(process.env.TOKEN);
