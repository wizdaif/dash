
import { DashClient } from "../../structures/Client";
import { ApplicationCommandOptionType, ApplicationCommandType, Interaction } from "discord.js";

export const name = 'interactionCreate';

export const run = async (client: DashClient, interaction: Interaction) => {
    const guild = client.guilds.cache.get(process.env.MAIN_GUILDID as string);

    if (interaction.user.bot) return;

    if (interaction.isCommand()) {
        const cmd = client.commands.get(interaction.commandName) as any;
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const member = interaction.guild?.members.cache.get(interaction.user.id);

        if (!member?.permissions.has(cmd?.userPermissions || [])) {
            return interaction.reply({
                ephemeral: true,
                content: `You are missing permissions.`,
            });
        }

        const args = [];

        for (const option of interaction.options.data) {
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                if (option.name) args.push(option.name as never);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value as never);
                });
            } else if (option.value) args.push(option.value as never);
        }

        (interaction.member as any) = guild?.members.cache.get(interaction.user.id);

        if (![ApplicationCommandType.User, ApplicationCommandType.Message].includes(cmd.type))
            cmd.run(client, interaction as any, args);
    }

    // Context Menu Handling
    if (interaction.isUserContextMenuCommand()) {
        const command = client.commands.get(interaction.commandName) as any;

        if (command && [ApplicationCommandType.User].includes(command.type)) 
            command.run(client, interaction as any, []);
    }

    if (interaction.isAutocomplete()) {
        const commandName = interaction.commandName;

        const command = client.commands.get(commandName) as any;

        if (!command) return interaction.respond([]);

        return command.autocomplete(
            client,
            interaction as any
        );
    }
}