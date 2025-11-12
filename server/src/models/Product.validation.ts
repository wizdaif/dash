import * as z from "zod";
import { productModel } from "./Product";
import { userModel } from "./User";

// CRUD

const createProductSchema = z.object({
  name: z.string().refine(
    async (name) => {
      const exists = await productModel.exists({
        name: name.toString(),
      });

      return exists;
    },
    { message: "Product already exist exist" }
  ),
  description: z.string(),
  category: z.string(),
  tags: z
    .string()
    .optional()
    .refine((data) => !data?.split("").length),
  stock: z
    .string()
    .default("inf")
    .refine((data) => data !== "inf" || !isNaN(parseInt(data!))),
  price: z.object({
    robux: z.number(),
    price: z.number(),
  }),
  isForSale: z.boolean().default(false),
  discordRoleId: z.string().optional(),
  developerProductId: z.string().optional(),
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z
    .string()
    .optional()
    .refine((data) => !data?.split("").length),
  stock: z
    .string()
    .optional()
    .refine((data) => data === "inf" || !isNaN(parseInt(data!))),
  price: z
    .object({
      robux: z.number().optional(),
      price: z.number().optional(),
    })
    .optional(),
  isForSale: z.boolean().optional(),
  discordRoleId: z.string().optional(),
});

const createProductReviewSchema = z.object({
  rating: z.number(),
  content: z.string(),
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
  id: z.string().refine(
    async (id) => {
      const exists = await productModel.exists({
        _id: id.toString(),
      });

      return !exists;
    },
    { message: "Product does not exist" }
  ),
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
