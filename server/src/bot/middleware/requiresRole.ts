import { EmbedBuilder, MessageFlags } from "discord.js";
import type { ReplyableInteractionMiddlewareFn } from "@types";
import hasRole from "@utils";
import config from "@config";

export default function requiresRole(
  roleId: string
): ReplyableInteractionMiddlewareFn {
  return async (next, interaction) => {
    const author = interaction.member;

    if (!author) return;
    if (!hasRole(author, roleId))
      return interaction.replied
        ? await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `It appears you're missing the role, <@&${roleId}> which is required to run this command.`
                )
                .setColor(config.cosmetics.defaultEmbedColor),
            ],
          })
        : await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `It appears you're missing the role, <@&${roleId}> which is required to run this command.`
                )
                .setColor(config.cosmetics.defaultEmbedColor),
            ],
          });

    next();
  };
}
