import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";

export const data = new SlashCommandBuilder()
  .setName("reddit")
  .setDescription("get a post from a subreddit!")
  .addStringOption((option) =>
    option
      .setName("subreddit")
      .setDescription("subreddit name")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
	const subreddit = interaction.options.getString("subreddit");
	const ephemeral = interaction.options.getBoolean("ephemeral");

	// get image from api
	const response = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`);
	const json = await response.json();

	// send image
	return interaction.reply({
		content: json[0].data.children[0].data.url,
		ephemeral: ephemeral,
	});
}