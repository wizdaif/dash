import { EmbedBuilder, MessageFlags } from "discord.js";
import type { ReplyableInteractionMiddlewareFn } from "@types";

import { formatString, getConfig, hasRole } from "@utils";

export default function requiresRole(
  roleId: string
): ReplyableInteractionMiddlewareFn {
  return async (next, interaction) => {
    const author = interaction.member;
    const config = await getConfig();

    if (!author) return;
    if (!hasRole(author, roleId))
      return interaction.replied
        ? await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  formatString(config.errorMessages.MISSING_ROLE, {
                    roleId,
                  })
                )
                .setColor(config.cosmetics.defaultEmbedColor),
            ],
          })
        : await interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  formatString(config.errorMessages.MISSING_ROLE, {
                    roleId,
                  })
                )
                .setColor(config.cosmetics.defaultEmbedColor),
            ],
          });

    next();
  };
}
