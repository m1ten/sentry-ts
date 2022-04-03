import { Err } from "../err";

export const name = "interactionCreate";

export async function execute(
  interaction: any,
  sentry: { commands: { get: (arg0: any) => any } }
): Promise<void> {
  // check if the interaction is a command
  if (!interaction.isCommand()) return;

  // get the command
  const command = sentry.commands.get(interaction.commandName);

  // return if the command doesn't exist
  if (!command) return;

  await command.execute(interaction).catch((err: Err) => {
    // console.log(err);

    if (!err.name) {
      err.name = interaction.commandName;
    };

    if (!err.userId) {
      err.userId = interaction.member.id;
    }

    let error = err.check_err.call(err);

    console.log(error.output);

    // try {
    //   // try replying the error
    //   await interaction.reply({
    //     content: newErr.output,
    //     ephemeral: true
    //   });
    // } catch (_) {
    //   await interaction.editReply(newErr.output);
    // }
  });

  return;
}