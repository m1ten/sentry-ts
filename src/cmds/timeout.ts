import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a given user!')
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription('User to timeout')
            .setRequired(true),
    )
    .addIntegerOption((option) =>
        option
            .setName('time')
            .setDescription('time in ms; 0 to untimeout')
            .setRequired(true),
    )
    .addStringOption((option) =>
        option.setName('reason').setDescription('reason for timeout'),
    )
    .addBooleanOption((option) =>
        option.setName('ephemeral').setDescription('Show or hide message'),
    );

export async function execute(interaction: any) {
    const mod = interaction.member;
    const ephemeral = interaction.options.getBoolean('ephemeral');
    const user = interaction.options.getUser('user');
    const time = interaction.options.getInteger('time');
    const reason = interaction.options.getString('reason');

    // get member from user
    const member = interaction.guild.members.cache.get(user.id);

    if (!mod.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
        throw ':warning: You don\'t have permission to timeout users.';
    }

    if (member === mod) {
        throw ':warning: You can\'t timeout yourself.';
    }

    if (user.id === interaction.client.user.id) {
        throw ':warning: You can\'t timeout me.';
    }

    if (mod.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
        throw ':warning: You can\'t timeout a user that has a higher or equal role than you.';
    }

    // timeout user
    await member.timeout(time, reason).catch(() => {
        throw ':warning: I don\'t have permission to timeout users.';
    });

    // send message
    await interaction
        .reply({
            content: `${user.username} has been timed out with reason, '${reason}'!`,
            ephemeral: ephemeral,
        })
        .catch(() => {
            throw ':warning: An error occurred while replying.';
        });
}
