import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export function deploy() {
    const commands: any[] = [];

    const commandFiles = fs.readdirSync(__dirname + '/cmds');

    // filter out non-ts and non-js files
    commandFiles.forEach((file) => {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const { data } = require(`./cmds/${file}`);
            commands.push(data.toJSON());
        }
    });

    console.log(commandFiles);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log('Started refreshing application slash commands.');

            await rest.put(
                // Routes.applicationCommand(process.env.CLIENTID)
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID,
                ),
                { body: commands },
            );

            console.log('Successfully reloaded application slash commands.');
        }
        catch (error) {
            console.error(error);
        }
    })();
}

deploy();
