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
	} catch (error) {

		// check all the error codes

		//@ts-ignore
		if (error.code == 50013) {
			return interaction.reply({
				content:
					":exclamation: I don't have permission to execute this command!",
				ephemeral: true,
			});
		}

		console.error(error);

		await interaction.reply({
			content:
				":exclamation: There was an error while executing this command!",
			ephemeral: true,
		});
	}
}