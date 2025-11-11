import config, { Messages } from "@config";
import commands from "../commands";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { onEvent } from "./event";

export default onEvent(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const commandName = interaction.commandName;
    const subcommandName = [
      interaction.options.getSubcommand(false),
      interaction.options.getSubcommandGroup(false),
    ]
      .filter(Boolean)
      .join(".");
    const command = commands
      .flatMap((commandGroup) => commandGroup.module)
      .find(
        (obj) =>
          obj.schema.command.name === commandName &&
          obj.schema.command instanceof SlashCommandBuilder
      );

    if (!command) {
      console.error(`Cant find command ${commandName}[${subcommandName}]`);
      return await interaction.reply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          new EmbedBuilder()
            .setDescription(Messages.INVALID_COMMAND)
            .setColor(config.cosmetics.defaultEmbedColor),
        ],
      });
    }

    const commandFn =
      subcommandName === ""
        ? command.baseFn
        : command.subcommandFns.get(subcommandName);

    if (!commandFn) {
      console.error(
        `Missing handler for command ${commandName}[${subcommandName}]!`
      );
      return await interaction.reply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          new EmbedBuilder()
            .setDescription(Messages.INVALID_HANDLER)
            .setColor(config.cosmetics.defaultEmbedColor),
        ],
      });
    }

    console.debug(
      `Running command ${commandName}[${subcommandName}] for user ${interaction.user.tag}`
    );

    try {
      commandFn(interaction as ChatInputCommandInteraction<"cached">);
    } catch (e) {
      console.error(e);
    }
  }
});
