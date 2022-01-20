import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies Pong!")
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message"));

export async function execute(interaction: any) {
  const ephemeral = interaction.options.getBoolean("ephemeral");

  let latency = "\nLatency: "  + (Date.now() - interaction.createdTimestamp) + " ms";
  let apiLatency = "\nAPI Latency: " + Math.round(interaction.client.ws.ping) + " ms";

  return interaction.reply({ content: "Pong!" + latency + apiLatency, ephemeral: ephemeral });
}