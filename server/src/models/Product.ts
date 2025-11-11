import { ProductImageType } from "@types";
import mongoose, { Schema, Types } from "mongoose";

const ProductImage = new Schema(
  {
    type: {
      type: String,
      enum: ProductImageType,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    stock: {
      type: String,
      default: "inf",
    },
    price: {
      robux: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    file: {
      type: String,
      default: null,
    },
    isForSale: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [ProductImage],
      default: [],
    },
    discordRoleId: {
      type: String,
      default: null,
    },
    developerProductId: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model("products", ProductSchema);
