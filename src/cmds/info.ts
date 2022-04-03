/* eslint-disable no-redeclare */
/* eslint-disable no-var */
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('get user or server info.')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('user')
            .setDescription('get user info.')
            .addUserOption((option) =>
                option
                    .setName('user')
                    .setDescription('The user\'s avatar to show')
                    .setRequired(true),
            )
            .addBooleanOption((option) =>
                option
                    .setName('ephemeral')
                    .setDescription('Show or hide message'),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('server')
            .setDescription('get server info.')
            .addBooleanOption((option) =>
                option
                    .setName('ephemeral')
                    .setDescription('Show or hide message'),
            ),
    );

export async function execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean('ephemeral');

    if (interaction.options.getSubcommand() === 'user') {
        const user = interaction.options.getUser('user');

        // get the user's id
        const id = user.id.toString();

        // get the date user account was created
        const createdAt = user.createdAt.toUTCString();

        // get the user's tag
        const tag = user.tag.toString();

        // get the user's avatar
        const avatar = user.avatarURL().toString();

        // get current guild
        const guild = interaction.guild;

        // get the date when the user joined the guild
        const joinedAt = guild.members.cache.get(id).joinedAt.toUTCString();

        // get the user's roles
        const roles = guild.members.cache
            .get(id)
            .roles.cache.map((role: { name: any }) => role.name)
            .join(', ');

        // get the user's nickname
        const nickname = guild.members.cache.get(id).nickname || user.username;

        // create embed
        var embed = new MessageEmbed()
            .setTitle(`${nickname}'s info`)
            .setThumbnail(avatar)
            .addField('ID', id, true)
            .addField('Tag', tag, true)
            .addField('Roles', roles, false)
            .addField('Created At', createdAt, false)
            .addField('Joined At', joinedAt, false)
            .setTimestamp();
    }
    else if (interaction.options.getSubcommand() === 'server') {
        // get server name
        const name = interaction.guild.name.toString();

        // get server id
        const id = interaction.guild.id.toString();

        // get total members
        const members = interaction.guild.memberCount.toString();

        // get total bots
        const bots = interaction.guild.members.cache
            .filter((member: { user: { bot: any } }) => member.user.bot)
            .size.toString();

        // get number of roles
        const roles = interaction.guild.roles.cache.size.toString();

        // get server icon
        const icon = interaction.guild.iconURL().toString();

        // get server boost level
        const boost = interaction.guild.premiumTier.replace('_', ' ');

        // get server owner id
        const ownerId = interaction.guild.ownerId.toString();

        // create embed
        var embed = new MessageEmbed()
            .setTitle(`${name}'s info`)
            .setThumbnail(icon)
            .addField('ID', id, true)
            .addField('Owner', ownerId, true)
            .addField('Members', members, true)
            .addField('Bots', bots, true)
            .addField('Roles', roles, true)
            .addField('Boost', boost, true)
            .setTimestamp();
    }

    // send embed
    await interaction
        .reply({
            embeds: [embed],
            ephemeral: ephemeral,
        })
        .catch(() => {
            throw ':warning: An error occurred while replying.';
        });
}