import { ActivityType, Client, Events } from "discord.js";
import { singleEvent } from "./event";
import { getPurchaseLogs } from "@utils";
import { setMasterAdmin } from "models/Config";

export default singleEvent(Events.ClientReady, async (client: Client<true>) => {
  const guildOwnerHandler = async () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    if (!guild) return;

    await setMasterAdmin(guild.ownerId);
  };

  return await Promise.all([
    getPurchaseLogs(client),
    guildOwnerHandler(),
    client.user.setPresence({
      status: "online",
      activities: [{ name: "dash", type: ActivityType.Watching }],
    }),
    client.guilds.cache.forEach((guild: any) => {
      guild.id !== process.env.GUILD_ID ? guild.leave() : true;
    }),
    console.log(`Logged in as ${client.user.tag}!`),
  ]);
});
