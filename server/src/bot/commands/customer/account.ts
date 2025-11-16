import { EmbedBuilder } from "@discordjs/builders";
import { getConfig } from "@utils";
import { SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { GetUserProfile } from "helpers";

import { getUser, getUserAvatar } from "robloxAPI";
import { defineSlashCommand, SlashCommand } from "../command";

const schema = defineSlashCommand({
  name: "account",
  description: "View a user's account",
  serverOnly: false,
  options: [
    new SlashCommandUserOption()
      .setName("mention")
      .setDescription("Discord User")
      .setRequired(false),
    new SlashCommandStringOption()
      .setName("robloxid")
      .setDescription("Roblox ID")
      .setRequired(false),
  ],
});

export default new SlashCommand(schema, async (interaction) => {
  const target = interaction.options.getUser("mention");
  const robloxId = interaction.options.getString("robloxid");

  await interaction.deferReply();

  const config = await getConfig();

  const notLinkedEmbed = new EmbedBuilder()
    .setDescription(config.errorMessages.NOT_LINKED)
    .setColor(config.cosmetics.defaultEmbedColor as any);

  let options = {};

  try {
    if (target) {
      options = { discordId: target.id };
    } else if (robloxId) {
      options = { robloxId };
    } else {
      options = { discordId: interaction.user.id };
    }

    const userData = await GetUserProfile(options);
    const playerInfo = await getUser(userData!.robloxId!);
    const thumbnail = await getUserAvatar(userData!.robloxId!);

    const products = userData!.products.map((product: any) => product.name);

    const profileEmbed = new EmbedBuilder()
      .setColor(config.cosmetics.defaultEmbedColor as any)
      .setTitle("Profile")
      .setThumbnail(thumbnail.at(0)!.imageUrl)
      .addFields(
        {
          name: "Discord",
          value: `${target ? target.username : interaction.user.username}\n\`${
            target ? target.id : interaction.user.id
          }\``,
          inline: true,
        },

        {
          name: "Roblox",
          value: `${playerInfo.name}\n\`${playerInfo.id}\``,
          inline: true,
        },

        { name: "\u200b", value: "\u200b", inline: true },

        {
          name: "Owned Products",
          value:
            products.length > 0
              ? products.join("\n")
              : "None",
          inline: true,
        }
      )
      .setFooter({
        iconURL: interaction.guild.iconURL()!,
        text: interaction.guild.name,
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [profileEmbed] });
  } catch (err) {
    return interaction.editReply({
      embeds: [notLinkedEmbed],
    });
  }
});
