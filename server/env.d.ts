import type { TextChannel } from "discord.js";

declare global {
  var logs_channel: TextChannel | undefined;

  namespace NodeJS {
    interface MongoENV {
      MONGO_URI: string;
    }

    interface DiscordENV { 
      DISCORD_TOKEN: string;
      DISCORD_OAUTH_CLIENT_ID: string;
      DISCORD_OAUTH_CLIENT_SECRET: string;

      GUILD_ID: string;
      ADMIN_ROLE_ID?: string;
      PURCHASE_LOGS_CHANNEL_ID?: string;
    }

    interface ProcessEnv extends MongoENV, DiscordENV {
      PORT: string;
      JWT_SECRET: string;
    }
  }
}

export {};
