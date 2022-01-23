export const name = "interactionCreate";

export async function execute(
  interaction: {
    isCommand: () => any;
    commandName: any;
    reply: (arg0: { content: string; ephemeral: boolean }) => any;
  },
  sentry: { commands: { get: (arg0: any) => any } }
) {
  // check if the interaction is a command
  if (!interaction.isCommand()) return;

  // get the command
  const command = sentry.commands.get(interaction.commandName);

  // return if the command doesn't exist
  if (!command) return;

  try {
    // execute the command
    await command.execute(interaction);
  } catch (error: any) {
    // check if error is a string
    if (typeof error === "string") {
      if (error.includes(":warning:")) {
        return interaction.reply({
          content: `${error}`,
          ephemeral: true,
        });
      }
    } else {
      // log error
      console.error(error);
      return interaction.reply({
        content: `:warning: There was an error while executing ${interaction.commandName} command.`,
        ephemeral: true,
      });
    }
  }
}
