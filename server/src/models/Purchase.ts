import { PurchaseType } from "@types";
import mongoose, { Schema, Types } from "mongoose";

const PurchaseSchema = new Schema(
  {
    type: {
      type: String,
      enum: PurchaseType,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    products: {
      type: [Types.ObjectId],
      ref: "Products",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const purchaseModel = mongoose.model("purchases", PurchaseSchema);
