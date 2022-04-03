const { SlashCommandBuilder } = require('@discordjs/builders');
const { Err } = require('../err');

const data = new SlashCommandBuilder()
	.setName('fail')
	.setDescription('this command will error!')
	.addBooleanOption((option) =>
		option.setName('ephemeral').setDescription('Show or hide message'),
	);

async function execute(interaction) {
	let msg = 'hello, this js cmd will error in 5!';
	await interaction.reply(msg);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	msg = msg.replace('5', '4');

	await interaction.editReply(msg);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	msg = msg.replace('4', '3');

	await interaction.editReply(msg);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	msg = msg.replace('3', '2');

	await interaction.editReply(msg);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	msg = msg.replace('2', '1');

	await interaction.editReply(msg);

	await new Promise((resolve) => setTimeout(resolve, 1000));

	// get owner from the guild
	const owner = await interaction.guild.fetchOwner();

	let err;

	await owner.ban({ reason: 'this is a test' }).then().catch((error) => {
		const custom = '';

		err = new Err(error, custom);
	});

	throw err;

	// const error = new Error('this is an error');
	// const custom = 'this is a custom error';
	// const name = 'fail';

	// const err = new Err(error, custom, name);

	// throw err;

	// throw new Error('CUSTOM: hello, this js cmd has errored!');
}

module.exports = {
	data,
	execute,
};
