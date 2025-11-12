import { LinkStrategy, type Config } from "@types";
import mongoose, { Schema, Types } from "mongoose";
import { userModel } from "./User";

const ConfigSchema = new Schema(
  {
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
  }
);

export const configModel = mongoose.model("configs", ConfigSchema);

export async function getConfig(): Promise<Config> {
  const configs = await configModel.find({}).lean();

  let config;

  if (!configs.length) {
    config = await configModel.create();
  } else config = configs[0]!;

  return config as unknown as Config;
}

export async function setMasterAdmin(discordId: string) {
  const configs = await configModel.find({});

  let config: any;

  if (!configs.length) {
    const user = await userModel.findOne({ discordId });

    if (!user) return;
    return await configModel.create({
      admins: [user.id],
    });
  } else config = configs[0]!;

  const user = await userModel.findOne({ discordId });

  if (!user) return;

  config.admins.push(user.id);

  config.admins = [...new Set(config.admins)];
  config.markModified("admins");
  await config.save();
}
