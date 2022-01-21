import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("role")
  .setDescription("add or remove a role")
  .addStringOption((option) =>
    option
      .setName("status")
      .setDescription("add or remove")
      .addChoice("add", "add")
      .addChoice("remove", "remove")
      .setRequired(true)
  )
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Role to add or remove")
      .setRequired(true)
  )
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("User to add or remove role")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  const status = interaction.options.getString("status");
  const user = interaction.options.getUser("user");
  const role = interaction.options.getRole("role");
  const ephemeral = interaction.options.getBoolean("ephemeral");

  // owner of the bot
  // if (interaction.member.id !== interaction.client.ownerID) {
  //   return;
  // }

  // get member of the excuter of the command
  const mod = interaction.guild.members.cache.get(interaction.member.id);

  // get member from user
  const member = interaction.guild.members.cache.get(user.id);

  // check if the user has permissions to manage roles
  if (!mod.permissions.has("MANAGE_ROLES")) {
    return interaction.reply({
      content: ":warning: You don't have permission to manage roles.",
      ephemeral: true,
    });
  }

  // check if the role user wants to add or remove is lower than the highest role of the user
  if (mod.roles.highest.comparePositionTo(role) < 0 && status === "add") {
    return interaction.reply({
      content:
        ":warning: You can't add a role that is higher than your highest role.",
      ephemeral: true,
    });
  } else if (
    mod.roles.highest.comparePositionTo(role) > 0 &&
    status === "remove"
  ) {
    return interaction.reply({
      content:
        ":warning: You can't remove a role that is higher than your highest role.",
      ephemeral: true,
    });
  }

  switch (status) {
    case "add":
      await member.roles.add(role);
      return interaction.reply({
        content: `${user.username} has been given the role ${role.name}`,
        ephemeral: ephemeral,
      });
    case "remove":
      await member.roles.remove(role);
      return interaction.reply({
        content: `${user.username} has been removed from the role ${role.name}`,
        ephemeral: ephemeral,
      });
  }
}
