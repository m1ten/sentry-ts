import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("purge")
  .setDescription("purge chat!")
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Number of messages to purge")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
    let amount: number = interaction.options.getInteger("amount");
    const ephemeral = interaction.options.getBoolean("ephemeral");

    if (amount < 1) {
      amount = 1;
    } else if (amount > 100) {
      amount = 100;
    }

    await interaction.channel.bulkDelete(amount, true).catch(() => {
      throw ":warning: I don't have permission to purge messages.";
    });

    await interaction
      .reply({
        content: `Successfully purged \`${amount}\` messages.`,
        ephemeral: ephemeral,
      })
      .catch(() => {
        throw ":warning: An error occurred while replying.";
      });
  } else {
    throw ":warning: You don't have permission to purge messages.";
  }
}
