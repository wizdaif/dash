import { Messages } from "@config";
import { PermissionFlagsBits, MessageFlags, EmbedBuilder } from "discord.js";
import type { ReplyableInteractionMiddlewareFn } from "types";
import { hasPermission } from "@utils";

export default function requiresPermission<
  T extends keyof typeof PermissionFlagsBits
>(permissions: T[]): ReplyableInteractionMiddlewareFn {
  return (next, interaction) => {
    const member = interaction.member;

    if (
      !member ||
      !hasPermission(
        member,
        permissions.map((permission) => PermissionFlagsBits[permission])
      )
    )
      return interaction.reply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          new EmbedBuilder()
            .setTitle("Missing Permissions")
            .setDescription(
              `${Messages.MISSING_PERMISSION}\n\`${permissions.join(", ")}\``
            ),
        ],
      });

    next();
  };
}
