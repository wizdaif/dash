export function middlwareify<T extends (...any: any) => void>(
  fn: T,
  middlewareFns?: ((next: () => void, ...args: Parameters<T>) => void)[]
): (...args: Parameters<T>) => void {
  return middlewareFns
    ? async (...args: Parameters<T>) => {
        const next = async (index: number) => {
          if (index > middlewareFns.length - 1) fn(...args);
          else
            (middlewareFns as any)[index](async () => next(index + 1), ...args);
        };

        await next(0);
      }
    : fn;
}

import {
  ChannelType,
  PermissionsBitField,
  type Client,
  type GuildMember,
  type TextChannel,
} from "discord.js";

export function hasRole(member: GuildMember, roleId: string): boolean {
  return member.roles.cache.find((role) => role.id === roleId) != undefined;
}

export function hasPermission(
  member: GuildMember,
  permission: bigint[] | bigint
): boolean {
  return member.permissions.has(permission);
}

export async function getPurchaseLogs(client: Client) {
  if (!client.isReady()) return null;

  let purchaseLogs = globalThis.logs_channel;
  const guild = client.guilds.cache.get(Bun.env.GUILD_ID);

  if (!purchaseLogs) {
    let channel =
      guild?.channels.cache.get(Bun.env.PURCHASE_LOGS_CHANNEL_ID!) ??
      guild?.channels.cache.find(
        (c) => c.isTextBased() && c.name === "purchase-logs"
      );

    if (!channel)
      channel = await guild?.channels.create({
        type: ChannelType.GuildText,
        name: "purchase-logs",
        permissionOverwrites: [
          { id: "everyone", deny: PermissionsBitField.All },
          // (Bun.env.ADMIN_ROLE_ID && { id: Bun.env.ADMIN_ROLE_ID, allow: PermissionsBitField.All }),
        ],
      });
    purchaseLogs = channel as TextChannel;
  }

  globalThis.logs_channel = purchaseLogs;
  return purchaseLogs;
}

function makeid(length = 16) {
  var result = "";
  var characters = "ABCDEFGHIJKLMOPQRSTUVWXYZ123456789";
  for (var i = 0; i <= length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  console.log(result);
  result = result.match(/\d{1,4}/g)!.join("-");
  return result;
}

console.log(makeid());
