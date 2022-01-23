import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription(
    "Get the avatar URL of the selected user, or your own avatar."
  )
  .addUserOption((option) =>
    option.setName("user").setDescription("The user's avatar to show")
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  const user = interaction.options.getUser("user");
  const ephemeral = interaction.options.getBoolean("ephemeral");

  if (user)
    await interaction
      .reply({
        content: `${user.username}'s avatar: ${user.displayAvatarURL({
          dynamic: true,
        })}`,
        ephemeral: ephemeral,
      })
      .catch(() => {
        throw ":warning: An error occurred while replying.";
      });

  await interaction
    .reply({
      content: `Your avatar: ${interaction.user.displayAvatarURL({
        dynamic: true,
      })}`,
      ephemeral: ephemeral,
    })
    .catch(() => {
      throw ":warning: An error occurred while replying.";
    });
}
