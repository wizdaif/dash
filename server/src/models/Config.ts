import { LinkStrategy, type Config } from "@types";
import mongoose, { Schema, Types } from "mongoose";
import { userModel } from "./User";

const ConfigSchema = new Schema({
  linkStrategy: {
    type: String,
    enum: LinkStrategy,
    default: LinkStrategy.Mixed,
  },
  admins: {
    type: [String],
    default: [],
  },
  cosmetics: {
    defaultEmbedColor: {
      type: String,
      default: "#11111",
    },
  },
  errorMessages: {
    INVALID_COMMAND: {
      type: String,
      default: "#11111",
    },
    INVALID_HANDLER: {
      type: String,
      default: "#11111",
    },
    MISSING_PERMISSION: {
      type: String,
      default: "It appears you're missing {permission} permission(s).",
    },
    MISSING_ROLE: {
      type: String,
      default:
        "It appears you're missing the role, {roleId} which is required to run this command.",
    },
  },
  website: {
    SITE_TITLE: {
      type: String,
      default: "dash",
    },
    SITE_DESCRIPTION: {
      type: String,
      default: "Buy premium products from dash eCommerce",
    },
    TAG_CONTENT: {
      type: String,
      default: "Featured Products",
    },
    HEADER_CONTENT: {
      type: String,
      default: "Premium Products, Low Prices",
    },
    SHORT_DESC: {
      type: String,
      default: "Explore our products.",
    },
  },
});

export const configModel = mongoose.model("configs", ConfigSchema);

export async function getConfig(): Promise<Config> {
  let config = await configModel.findOne({}).lean();

  if (!config) {
    config = await configModel.create() as any;
  }
  return config as unknown as Config;
}

export async function setMasterAdmin(discordId: string) {
  const config = await configModel.findOne({});

  if (!config) {
    let user = await userModel.findOne({ discordId });

    if (!user) {
      user = await userModel.create({
        discordId,
        robloxId: null
      })
    }

    return await configModel.create({
      admins: [user.id],
    });
  }

  const user = await userModel.findOne({ discordId });

  if (!user) return;

  config.admins.push(user.id);

  config.admins = [...new Set(config.admins)];
  config.markModified("admins");
  await config.save();
}
