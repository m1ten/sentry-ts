import { Err } from '../err';

export const name = 'interactionCreate';

export async function execute(interaction: any, sentry: any): Promise<void> {
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
        }

        if (!err.userId) {
            err.userId = interaction.member.id;
        }

        const error = err.checkErr.call(err);

        // console.log(`output: ${error.output}`);

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
