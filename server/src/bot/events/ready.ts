
import { ActivityType, Client, Events }   from "discord.js";
import { singleEvent } from "./event";
import { getPurchaseLogs } from "@utils";

export default singleEvent(Events.ClientReady, async (client: Client<true>) => {
  return Promise.all([
    getPurchaseLogs,
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
