import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("unixtime")
  .setDescription("Replies Unix Time!")
  .addStringOption((option) =>
	option.setName("unit").setDescription("unit of time; ms, s, m, h, d, mo, y, de").setRequired(true))
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message"));

export async function execute(interaction: any) {
  const ephemeral = interaction.options.getBoolean("ephemeral");
  const time = interaction.options.getString("time");

  // get unix time
  const unixTime = Math.floor(Date.now() / 1000);

  // unix time in milliseconds
  const unixTimeMilliseconds = Date.now();

  // unix time in days
  const unixTimeDays = Math.floor(unixTime / 86400);

  // unix time in hours
  const unixTimeHours = Math.floor(unixTime / 3600);

  // unix time in minutes
  const unixTimeMinutes = Math.floor(unixTime / 60);

  // unix time in months
  const unixTimeMonths = Math.floor(unixTime / 2592000);

  // unix time in years
  const unixTimeYears = Math.floor(unixTime / 31536000);

  // unix time in decades
  const unixTimeDecades = Math.floor(unixTime / 315400000);

  switch (time) {
	case "ms":
		return interaction.reply({ content: `${unixTimeMilliseconds} milliseconds`, ephemeral: ephemeral });
	case "s":
		return interaction.reply({ content: `${unixTime} seconds`, ephemeral: ephemeral });
	case "m":
		return interaction.reply({ content: `${unixTimeMinutes} minutes`, ephemeral: ephemeral });
	case "h":
		return interaction.reply({ content: `${unixTimeHours} hours`, ephemeral: ephemeral });
	case "d":
		return interaction.reply({ content: `${unixTimeDays} days`, ephemeral: ephemeral });
	case "mo":
		return interaction.reply({ content: `${unixTimeMonths} months`, ephemeral: ephemeral });
	case "y":
		return interaction.reply({ content: `${unixTimeYears} years`, ephemeral: ephemeral });
	case "de":
		return interaction.reply({ content: `${unixTimeDecades} decades`, ephemeral: ephemeral });
	default:
		return interaction.reply({ content: `${unixTime} seconds`, ephemeral: ephemeral });
  }
}