import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { readdirSync } from "fs";

export const data = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("reload the slash commands");

export async function execute(interaction: any) {
  const commands = [];

  // get command list from files
  const commandFiles = readdirSync(__dirname).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of commandFiles) {
    const { data } = require(`./${file}`);

    if (data.name == "reload") {
      data.defaultPermission = false;
    }

    commands.push(data);
  }

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  // 884527082242199632

  // const command = await client.application?.commands.fetch('123456789012345678');
  const command = await interaction.client.guilds.cache
    .get(process.env.GUILD_ID)
    ?.commands.fetch("934583981054238720");

  const permissions = [
    {
      id: process.env.OWNER_ID,
      type: "USER",
      permission: true,
    },
  ];

  await command.permissions.add({ permissions });

  return interaction.reply({
    content: `:white_check_mark: Successfully reloaded commands.`,
    ephemeral: true,
  });
}
