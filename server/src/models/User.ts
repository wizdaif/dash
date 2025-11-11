import { LicenseGrantType } from "@types";
import mongoose, { Schema, Types } from "mongoose";

const License = new Schema(
  {
    id: {
      type: Types.ObjectId,
      ref: "Products",
      required: true,
    },
    grantedAt: {
      type: Date,
      default: Date,
    },
    grantMethod: {
      type: String,
      enum: LicenseGrantType,
      required: true,
    },
    grantedBy: {
      type: Types.ObjectId,
      ref: "Users",
      default: null,
    },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    robloxId: {
      type: String,
    },
    products: {
      type: [License],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("users", UserSchema);
