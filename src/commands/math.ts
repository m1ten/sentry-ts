import { SlashCommandBuilder } from "@discordjs/builders";
import { evaluate } from "mathjs";

export const data = new SlashCommandBuilder()
	.setName("math")
	.setDescription("Solves Equations!")
	.addStringOption((option) =>
		option.setName("equation").setDescription("The equation to solve").setRequired(true)
	)
	.addBooleanOption((option) =>
		option.setName("ephemeral").setDescription("Show or hide message"));

export async function execute(interaction: any) {
	const equation = interaction.options.getString("equation");
	const ephemeral = interaction.options.getBoolean("ephemeral");
	try {
		interaction.reply({ content: `${equation} = ${evaluate(equation)}`, ephemeral: ephemeral });
	} catch (error) {
		interaction.reply({ content: `${equation} = ${error}`, ephemeral: ephemeral });
	}
	return;
}