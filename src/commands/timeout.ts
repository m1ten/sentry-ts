import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout a given user!")
  .addUserOption((option) =>
    option.setName("user").setDescription("User to timeout").setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("time")
      .setDescription("time in ms; 0 to untimeout")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("reason for timeout")
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  if (interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const user = interaction.options.getUser("user");
    const time = interaction.options.getInteger("time");
    let reason = interaction.options.getString("reason");

    // get member from user
    const member = interaction.guild.members.cache.get(user.id);

    // timeout user
    await member.timeout(time);

    // send message
    return interaction.reply({
      content: `${user.username} has been timed out!`,
      ephemeral: ephemeral,
    });
  } else {
    throw 50001;
  }
}
