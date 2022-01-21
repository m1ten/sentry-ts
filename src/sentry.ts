// import dependencies
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
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

// create a new REST client
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  // try refreshing application commands
  try {
    console.log("Started refreshing application slash commands.");

    // refresh application commands
    await rest.put(
      // global slash commands
      // Routes.applicationCommand(process.env.CLIENTID)

      // guild slash commands
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Successfully reloaded application slash commands.");
  } catch (error) {
    // log error to console
    console.error(error);
  }
})();

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
