import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";

export const data = new SlashCommandBuilder()
  .setName("animal")
  .setDescription("Replies with animal!")
  .addStringOption((option) =>
    option
      .setName("animal")
      .setDescription("cat or dog")
      .addChoice("cat", "cat")
      .addChoice("dog", "dog")
      .addChoice("panda", "panda")
      .addChoice("fox", "fox")
      .addChoice("red panda", "red panda")
      .addChoice("koala", "koala")
      .addChoice("birb", "birb")
      .addChoice("racoon", "racoon")
      .addChoice("kangaroo", "kangaroo")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option.setName("fact").setDescription("Show or hide fact")
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  const animal = interaction.options.getString("animal");
  const ephemeral = interaction.options.getBoolean("ephemeral");

  // get image from api
  const response = await fetch(`https://some-random-api.ml/animal/${animal}`);
  const json = await response.json();

  // send image
  return interaction.reply({
    content:
      json.image +
      (interaction.options.getBoolean("fact") ? `\n\n${json.fact}` : ""),
    ephemeral: ephemeral,
  });
}
