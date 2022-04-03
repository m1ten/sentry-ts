import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("unixtime")
  .setDescription("Replies Unix Time!")
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  const ephemeral = interaction.options.getBoolean("ephemeral");

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

  // convert unix time to human date
  const timeUTC = new Date(unixTime * 1000).toUTCString();

  const embed = new MessageEmbed()
    .setTitle("unix time")
    .setColor("NOT_QUITE_BLACK")
    .addFields(
      {
        name: "milliseconds",
        value: unixTimeMilliseconds.toString(),
        inline: true,
      },
      {
        name: "seconds",
        value: unixTime.toString(),
        inline: true,
      },
      {
        name: "minutes",
        value: unixTimeMinutes.toString(),
        inline: true,
      },
      {
        name: "hours",
        value: unixTimeHours.toString(),
        inline: true,
      },
      {
        name: "days",
        value: unixTimeDays.toString(),
        inline: true,
      },
      {
        name: "months",
        value: unixTimeMonths.toString(),
        inline: true,
      },
      {
        name: "years",
        value: unixTimeYears.toString(),
        inline: true,
      },
      {
        name: "decades",
        value: unixTimeDecades.toString(),
        inline: true,
      }
    )
    .setFooter({
      text: timeUTC,
    });

  await interaction.reply({
    embeds: [embed],
    ephemeral: ephemeral,
  }).catch(() => {
    throw ":warning: An error occurred while replying.";
  });
}
