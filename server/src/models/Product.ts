import { ProductImageType } from "@types";
import mongoose, { Schema, SchemaTypes } from "mongoose";

const ProductImage = new Schema(
  {
    type: {
      type: String,
      enum: ProductImageType,
      required: true,
    },
    name: {
      type: String,
    },
    filetype: {
      type: String,
    },
    value: {
      type: SchemaTypes.Mixed,
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
      type: SchemaTypes.Mixed,
      default: "infinite",
    },
    price: {
      robux: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        default: -1,
      },
    },
    file: {
      name: {
        type: String,
        default: null
      },
      type:  {
        type: String,
        default: null
      },
      buffer:  {
        type: Buffer,
        default: null
      },
    },
    isForSale: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: []
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
