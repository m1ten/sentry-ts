import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export function deploy() {
  const commands = [];
  const commandFiles = fs
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith(".ts"));

  console.log(commandFiles);

  for (const file of commandFiles) {
    const { data } = require(`./commands/${file}`);
    commands.push(data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log("Started refreshing application slash commands.");

      await rest.put(
        // Routes.applicationCommand(process.env.CLIENTID)
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commands }
      );

      console.log("Successfully reloaded application slash commands.");
    } catch (error) {
      console.error(error);
    }
  })();
}

deploy();