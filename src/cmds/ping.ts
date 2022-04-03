import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies Pong!')
    .addBooleanOption((option) =>
        option.setName('ephemeral').setDescription('Show or hide message'),
    );

export async function execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean('ephemeral');

    const embed = new MessageEmbed()
        .setTitle('Pong!')
        .setDescription(
            `Bot Latency: ${
                Date.now() - interaction.createdTimestamp
            } ms\nAPI Latency: ${interaction.client.ws.ping} ms`,
        );

    await interaction
        .reply({
            embeds: [embed],
            ephemeral: ephemeral,
        })
        .catch(() => {
            throw ':warning: An error occurred while replying.';
        });
}
