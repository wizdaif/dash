import events from "./events";
import commands from "./commands";

import { Client, GatewayIntentBits, REST, Routes } from "discord.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.removeAllListeners();

for (const event of events) {
  (client[event.type] as any)(event.event, event.fn);
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

const mappedCommands = commands.flatMap((cmdGroup) =>
  cmdGroup.module.map((obj: any) => obj.schema.command.toJSON())
);

const currentCommands = (await rest.get(
  Routes.applicationCommands(process.env.DISCORD_OAUTH_CLIENT_ID!)
)) as any[];

const needsRefresh = (newCommands: any[], currentCommands: any[]): boolean => {
  if (newCommands.length !== currentCommands.length) {
    return true;
  }

  for (let i = 0; i < newCommands.length; i++) {
    if (
      newCommands[i].name !== currentCommands[i].name ||
      newCommands[i].description !== currentCommands[i].description
    ) {
      return true;
    }
  }

  return false;
};

console.log(mappedCommands, currentCommands);

if (needsRefresh(mappedCommands, currentCommands)) {
  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_OAUTH_CLIENT_ID!),
    {
      body: mappedCommands,
    }
  ).then(console.log);
}

await client.login(process.env.DISCORD_TOKEN);
