// import dependencies
import { Client, Collection, Intents } from "discord.js";
import { readdirSync } from "fs";

// check if token .env exists
if (!process.env.TOKEN) {
  const dotenv = require("dotenv");
  // load environment variables from .env file
  dotenv.config();
}

// create a new Discord client
const sentry = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  presence: {
    status: "online",
    activities: [
      {
        name: "Discord",
        type: "WATCHING",
      },
    ],
  },
});

// @ts-ignore
sentry.commands = new Collection();

// @ts-ignore
sentry.ownerID = process.env.OWNER_ID;

const commands = [];
// get all command files
const commandFiles = readdirSync(__dirname + "/commands").filter((file) =>
  file.endsWith(".ts")
);

// import and set all commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // @ts-ignore
  sentry.commands.set(command.data.name, command);

  commands.push(command.data.toJSON());
}

// when the client is ready, run this code
const eventFiles = readdirSync(__dirname + "/events").filter((file) =>
  file.endsWith(".ts")
);

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    sentry.once(event.name, (...args) => event.execute(...args));
  } else {
    sentry.on(event.name, (...args) => event.execute(...args, sentry));
  }
}

// login to discord
sentry.login(process.env.TOKEN);
