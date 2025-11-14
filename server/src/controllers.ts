import type { Request, Response } from "express";

import jwt from "jsonwebtoken";

import { client as discordClient } from "bot";
import { getConfig, getGuildOwner } from "@utils";

import {
  authenticateUserSchema,
  removeUserLinkSchema,
} from "models/User.validation";
import { userModel } from "models/User";
import {
  createProductReviewSchema,
  createProductSchema,
  updateProductSchema,
} from "models/Product.validation";

import { reviewModel } from "models/Review";
import { productModel } from "models/Product";
import { purchaseModel } from "models/Purchase";
import { ProductImageType } from "@types";

async function getSiteConfig(req: Request, res: Response) {
  const config = await getConfig();

  return res.status(200).json({
    error: false,
    data: config?.website,
  });
}

async function getProducts(req: Request, res: Response) {
  const products = await productModel
    .find({
      isForSale: true,
    })
    .select(
      "name description category tags stock price images features developerProductId"
    )
    .lean();

  return res.status(200).json({
    error: false,
    data: products,
  });
}

async function getProduct(req: Request, res: Response) {
  const productId = req.params.id;

  const product = await productModel
    .findById(productId)
    .select(
      "name description category tags stock price images features developerProductId"
    )
    .lean();

  if (!product)
    return res.status(400).json({
      error: true,
      message: "Product does not exist",
    });

  return res.status(200).json({
    error: false,
    data: product,
  });
}

async function createProduct(req: Request, res: Response) {
  const { file, images, decals, ...productOptions } =
    await createProductSchema.parseAsync(req.body);

  const fileBuffer = file
    ? {
        name: file?.name,
        type: file?.type,
        buffer: Buffer.from(file?.buffer, "base64"),
      }
    : null;

  const imageBuffers =
    [
      images?.map((img) => ({
        type: ProductImageType.Image,
        name: img.name,
        filetype: img.type,
        value: Buffer.from(img.buffer, "base64"),
      })),
      decals?.map((decal: string) => ({
        type: ProductImageType.RobloxDecal,
        value: decal,
      })),
    ].flat() ?? [];

  const product = await productModel.create({
    file: fileBuffer,
    images: imageBuffers,
    ...productOptions,
  });

  return res.status(200).json({
    error: false,
    data: product.toObject({ flattenObjectIds: true }),
  });
}

async function updateProduct(req: Request, res: Response) {
  const productId = req.params.id;

  const product = await productModel
    .findById(productId)
    .select("name description category tags price images developerProductId")
    .lean();

  if (!product)
    return res.status(400).json({
      error: true,
      message: "Product does not exist",
    });

  const { file, images, decals, ...productOptions } = updateProductSchema.parse(
    req.body
  );

  const fileBuffer = file
    ? {
        ...(file?.name ? { name: file?.name } : {}),
        ...(file?.type ? { type: file?.type } : {}),
        ...(file?.buffer
          ? { buffer: Buffer.from(file?.buffer, "base64") }
          : {}),
      }
    : null;

  const existingImages = product.images ?? [];

  const newImageBuffers = [
    ...(images?.map((img) => ({
      type: ProductImageType.Image,
      name: img.name,
      filetype: img.type,
      value: Buffer.from(img.buffer, "base64"),
    })) ?? []),
    ...(decals?.map((decal: string) => ({
      type: ProductImageType.RobloxDecal,
      value: decal,
    })) ?? []),
  ];

  const mergedImages = [
    ...existingImages.filter(
      (img) =>
        !newImageBuffers.some(
          (newImg: any) =>
            newImg.type === img.type &&
            (newImg.type === ProductImageType.Image
              ? newImg.name === img.name
              : newImg.value === img.value)
        )
    ),
    ...newImageBuffers,
  ];

  return productModel
    .findByIdAndUpdate(productId, {
      $set: {
        ...productOptions,
        ...(fileBuffer ? { file: fileBuffer } : {}),
        ...(mergedImages.length ? { images: mergedImages } : {}),
      },
    })
    .then(() =>
      res.status(200).json({
        error: false,
        data: {
          status: true,
        },
      })
    );
}

async function deleteProduct(req: Request, res: Response) {
  const productId = req.params.id!;

  return productModel.findOneAndDelete(productId as any).then((result) =>
    res.status(200).json({
      error: false,
      data: {
        status: !!result,
      },
    })
  );
}

async function getProductReviews(req: Request, res: Response) {
  const productId = req.params.id;

  const reviews = await reviewModel
    .find({
      product: productId,
    })
    .lean();

  return res.status(200).json({
    error: false,
    data: reviews.map((review) => ({
      id: review._id.toString(),
      rating: review.rating,
      comment: review.comment,
      username: review.username,
      createdAt: review.createdAt,
    })),
  });
}

async function createProductReview(req: Request, res: Response) {
  const productId = req.params.id;

  const { username, rating, content } = createProductReviewSchema.parse(
    req.body
  );

  const review = await reviewModel.create({
    username,
    rating,
    user: req.locals.userId,
    comment: content,
    product: productId,
  });

  return res.status(200).json({
    error: false,
    data: review.toObject({ flattenObjectIds: true }),
  });
}

async function deleteProductReview(req: Request, res: Response) {
  const reviewId = req.params.id;
  const requester = req.locals.userId!;
  const isRequesterAdmin = (await getConfig()).admins.includes(requester);

  if (!reviewId)
    return res.status(400).json({
      error: true,
      message: "Missing `id` parameter.",
    });

  const review = await reviewModel.findById(reviewId);

  if (!review)
    return res.status(400).json({
      error: true,
      message: "Review does not exist.",
    });

  if (requester !== review.user && !isRequesterAdmin)
    return res.status(400).json({
      error: true,
      message: "Missing permissions.",
    });

  return review.deleteOne().then((result) =>
    res.status(200).json({
      error: false,
      data: {
        success: result.acknowledged,
      },
    })
  );
}

async function getOwnedProducts(req: Request, res: Response) {
  const userId = req.query?.id;
  const type = req.query?.type ?? "roblox";

  if (!userId)
    return res.status(400).json({
      error: true,
      message: "Missing `id` query.",
    });

  let options = {};

  if (type === "roblox") {
    options = {
      robloxId: userId,
    };
  } else if (type === "user") {
    options = {
      _id: userId,
    };
  } else if (type === "discord") {
    options = {
      discordId: userId,
    };
  }

  const user = await userModel
    .findOne(options)
    .populate([
      { path: "products.id", model: "products", select: "name images" },
    ])
    .select("products")
    .lean();

  if (!user)
    return res.status(400).json({
      error: true,
      message: "User does not exist.",
    });

  return res.status(200).json({
    error: false,
    data: user.products.map((license) => ({
      id: license.id._id,
      name: license.id.name,
      images: license.id.images.filter(
        (i: any) => i.type === ProductImageType.Image
      ),
      purchaseDate: license.grantedAt,
    })),
  });
}

async function getAuthenticatedUser(req: Request, res: Response) {
  const userId = req.locals.userId!;
  const config = await getConfig();

  const ownerId = await getGuildOwner(discordClient);
  const user = await userModel.findById(userId).lean();

  if (!user)
    return res.status(400).json({
      error: true,
      message: "User does not exist",
    });

  return res.status(200).json({
    error: false,
    data: {
      username: req.locals.data.username,
      ...user,
      discordLinked: !!user?.discordId,
      robloxLinked: !!user?.robloxId,
      isAdmin: config.admins.includes(userId),
      isOwner: ownerId === user.discordId,
    },
  });
}

async function authenticateUser(req: Request, res: Response) {
  const authorization = req.headers["authorization"] ?? "Bearer ";
  const [_, token] = authorization.split(" ");

  const body = authenticateUserSchema.parse(req.body);

  let user;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

    user = await userModel.findById(decoded.sub!);

    if (!user) {
      user = await userModel.create(
        body.type === "roblox" ? { robloxId: body.id } : { discordId: body.id }
      );
    } else {
      user[body.type === "roblox" ? "robloxId" : "discordId"] = body.id;
      user = await user.save();
    }
  } else {
    user = await userModel
      .findOne(
        body.type === "roblox" ? { robloxId: body.id } : { discordId: body.id }
      )
      .lean();

    if (!user)
      user = await userModel.create(
        body.type === "roblox"
          ? { robloxId: body.id, discordId: null, products: [] }
          : { discordId: body.id, robloxId: null, products: [] }
      );
  }

  return res.status(200).json({
    error: false,
    data: {
      token: jwt.sign(
        {
          sub: user._id.toString(),
          username: body?.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      ),
    },
  });
}

async function removeAccountLink(req: Request, res: Response) {
  const userId = req.params?.id;
  const { type } = removeUserLinkSchema.parse(req.body);

  if (!userId)
    return res.status(400).json({
      error: true,
      message: "Missing `id` parameter.",
    });

  const user = await userModel.findById(userId);

  if (!user)
    return res.status(400).json({
      error: true,
      message: "User does not exist",
    });

  user[type === "roblox" ? "robloxId" : "discordId"] = null;

  return user.save().then(() =>
    res.status(200).json({
      error: false,
      data: {},
    })
  );
}

async function addWhitelist(req: Request, res: Response) {}

async function removeWhitelist(req: Request, res: Response) {}

async function transferWhitelist(req: Request, res: Response) {}

async function getAllUsers(req: Request, res: Response) {
  const users = await userModel
    .find()
    .populate([
      {
        model: "products",
        path: "products",
        select: "name",
      },
    ])
    .lean();

  const config = await getConfig();
  const ownerId = await getGuildOwner(discordClient);

  return res.status(200).json({
    error: false,
    data: users.map((user) => ({
      ...user,
      isAdmin: config.admins.includes(user._id.toString()),
      isOwner: ownerId === user.discordId,
    })),
  });
}

async function getAllProducts(req: Request, res: Response) {
  const products = await productModel.find().lean();

  return res.status(200).json({
    error: false,
    data: products,
  });
}

async function getAssignableRoles(req: Request, res: Response) {
  const guild = await discordClient.guilds.fetch(process.env.GUILD_ID);
  const me = await guild.members.fetchMe();

  const roles = guild.roles.cache.filter(
    (role) =>
      !role.managed &&
      role.editable &&
      role.position < me.roles.highest.position
  );

  return res.status(200).json({
    error: false,
    data: roles.map((role) => ({ id: role.id, name: role.name })).reverse(),
  });
}

async function getSiteAnalytics(req: Request, res: Response) {
  const totalUsers = await userModel.countDocuments();

  const result = await purchaseModel.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $eq: ["$type", "robux"] },
            then: { $multiply: [{ $divide: ["$price", 1000] }, 3.8] },
            else: "$price",
          },
        },
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: "$user",
        totalRevenue: { $sum: "$effectivePrice" },
        totalPurchases: { $sum: 1 },
        monthlyData: {
          $push: {
            month: {
              $dateToString: { format: "%m", date: "$createdAt" },
            },
            revenue: "$effectivePrice",
          },
        },
      },
    },

    { $unwind: "$monthlyData" },
    {
      $group: {
        _id: {
          user: "$_id",
          month: "$monthlyData.month",
        },
        totalRevenue: { $first: "$totalRevenue" },
        totalPurchases: { $first: "$totalPurchases" },
        revenue: { $sum: "$monthlyData.revenue" },
      },
    },
    {
      $group: {
        _id: "$_id.user",
        totalRevenue: { $first: "$totalRevenue" },
        totalPurchases: { $first: "$totalPurchases" },
        revenueChart: {
          $push: {
            month: "$_id.month",
            revenue: "$revenue",
          },
        },
      },
    },
  ]);

  return res.status(200).json({
    error: false,
    data: result.length
      ? result[0]
      : {
          totalUsers,
          totalRevenue: 0,
          totalPurchases: 0,
          revenueChart: [],
        },
  });
}

async function getRecentPurchases(req: Request, res: Response) {
  const purchases = await purchaseModel
    .find({})
    .populate([
      { model: "users", path: "user", select: "discordId robloxId" },
      {
        model: "products",
        path: "products",
        select: "name",
      },
    ])
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return res.status(200).json({
    error: false,
    data: purchases,
  });
}

export {
  getSiteConfig,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
  deleteProductReview,
  getOwnedProducts,
  getAuthenticatedUser,
  authenticateUser,
  removeAccountLink,
  addWhitelist,
  removeWhitelist,
  transferWhitelist,
  getAllUsers,
  getAllProducts,
  getAssignableRoles,
  getSiteAnalytics,
  getRecentPurchases,
};
