import * as z from "zod";
import { productModel } from "./Product";
import { userModel } from "./User";

// CRUD

const createProductSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    tags: z
      .array(z.string())
      .default([]),
    stock: z
      .string()
      .default("infinite")
      .refine((data) => data === "infinite" || !isNaN(parseInt(data!, 10)), {
        message: "not a number or 'infinite'",
      }),
    price: z.object({
      robux: z.number().default(0),
      price: z.number().default(-1),
    }),
    isForSale: z.boolean().default(false),
    file: z
      .object({
        type: z.string(),
        name: z.string(),
        buffer: z.string(),
      })
      .optional(),
    images: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          buffer: z.string(),
        })
      )
      .optional(),
    features: z
      .array(z.string())
      .default([]),
    decals: z.array(z.string()).optional(),
    discordRoleId: z.string().optional(),
    developerProductId: z.string().optional(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await productModel.exists({ name: data.name });
    if (exists) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Product with this name already exists",
      });
    }
  });

const updateProductSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    stock: z.string().optional(),
    price: z
      .object({
        robux: z.number().optional(),
        price: z.number().optional(),
      })
      .optional(),
    isForSale: z.boolean().optional(),
    file: z
      .object({
        type: z.string().optional(),
        name: z.string().optional(),
        buffer: z.string().optional(),
      })
      .optional(),
    images: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          buffer: z.string(),
        })
      )
      .optional(),
    features: z.array(z.string()).optional(),
    decals: z.array(z.string()).optional(),
    discordRoleId: z.string().optional(),
    developerProductId: z.string().optional(),
  })
  .refine((d) => d, {
    message: "Wtf was the point",
  });

const createProductReviewSchema = z.object({
  rating: z.number(),
  content: z.string(),
  username: z.string(),
});

type CreateProductReviewOptions = z.infer<typeof createProductReviewSchema>;

type CreateProductOptions = z.infer<typeof createProductSchema>;
type UpdateProductOptions = z.infer<typeof updateProductSchema>;

export {
  createProductSchema,
  updateProductSchema,
  createProductReviewSchema,
  type CreateProductOptions,
  type UpdateProductOptions,
  type CreateProductReviewOptions,
};

const addWhitelistSchema = z
  .object({
    type: z.enum(["roblox", "discord"]),
    userId: z.string().optional(),
    username: z.string().optional(),
    productId: z.string(),
  })
  .refine((data) => data.username || data.userId, {
    message: "Either username or userId must be provided",
  })
  .refine((data) => data.type === "discord" && data.username, {
    message: "You must provide an id for the discord type",
    path: ["username"],
  })
  .refine(
    async (data) => {
      if (data.type === "roblox" && data.userId) {
        const user = await userModel
          .findOne({
            robloxId: data.userId,
          })
          .lean();

        return !user;
      } else if (data.type === "discord" && data.userId) {
        const user = await userModel
          .findOne({
            discordId: data.userId,
          })
          .lean();

        return !user;
      }
    },
    { message: "Invalid target passed", path: ["userId"] }
  );

const transferWhitelistSchema = z.object({
  id: z.string(),
  to: z.string(),
});

const removeWhitelistSchema = z
  .object({
    type: z.enum(["roblox", "discord"]),
    userId: z.string(),
    productId: z.string().refine(
      async (id) => {
        const exists = await productModel.exists({
          _id: id.toString(),
        });

        return !exists;
      },
      { message: "Product does not exist" }
    ),
  })
  .refine(
    async (data) => {
      if (data.type === "roblox" && data.userId) {
        const user = await userModel
          .findOne({
            robloxId: data.userId,
          })
          .lean();

        return !user;
      } else if (data.type === "discord" && data.userId) {
        const user = await userModel
          .findOne({
            discordId: data.userId,
          })
          .lean();

        return !user;
      }
    },
    { message: "Invalid target passed", path: ["userId"] }
  );

type UpdateWhitelistOptions = z.infer<typeof addWhitelistSchema>;
type TransferWhitelistOptions = z.infer<typeof transferWhitelistSchema>;
type RemoveWhitelistOptions = z.infer<typeof removeWhitelistSchema>;

export {
  addWhitelistSchema,
  transferWhitelistSchema,
  removeWhitelistSchema,
  type UpdateWhitelistOptions,
  type TransferWhitelistOptions,
  type RemoveWhitelistOptions,
};
