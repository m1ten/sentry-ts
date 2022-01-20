// import dependencies
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import dotenv from "dotenv";

// load environment variables from .env file
dotenv.config();

export function deploy() {
	// get files from sentry/src/commands
	const commands = [];
	const commandFiles = fs
		.readdirSync(__dirname + "/commands")
		.filter((file) => file.endsWith(".ts"));

	// print command files to console
	console.log(commandFiles);

	// loop through command files
	for (const file of commandFiles) {
		// get command data
		const { data } = require(`./commands/${file}`);
		// add command data to commands array
		commands.push(data.toJSON());
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
}

deploy();