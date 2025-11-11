import mongoose, { Schema, Types } from "mongoose";

const ReviewSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Products",
      required: true,
    },
    comment: {
        type: String,
        default: null
    }
  },
  {
    timestamps: true,
  }
);

export const reviewModel = mongoose.model("reviews", ReviewSchema);
