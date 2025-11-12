import type { Request, Response } from "express";
import { userModel } from "models/User";
import {
  authenticateUserSchema,
  removeUserLinkSchema,
} from "models/User.validation";

import jwt from "jsonwebtoken";
import { getConfig } from "@utils";
import { productModel } from "models/Product";

async function getSiteConfig(req: Request, res: Response) {
  return res.status(200).end();
}

async function getAllProducts(req: Request, res: Response) {
  const products = await productModel
    .find({
      isForSale: true,
    })
    .select(
      "name description category tags stock price images developerProductId"
    )
    .lean();

  return res.status(200).json({
    error: false,
    data: products,
  });
}

async function getProduct(req: Request, res: Response) {}

async function createProduct(req: Request, res: Response) {}

async function updateProduct(req: Request, res: Response) {}

async function deleteProduct(req: Request, res: Response) {}

async function getProductReviews(req: Request, res: Response) {}

async function createProductReview(req: Request, res: Response) {}

async function deleteProductReview(req: Request, res: Response) {}

async function getOwnedProducts(req: Request, res: Response) {}

async function getAuthenticatedUser(req: Request, res: Response) {
  const userId = req.locals.userId!;
  const config = await getConfig();

  const user = await userModel.findById(userId).lean();

  if (!user)
    return res.status(500).json({
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
  const userId = req.locals.userId!;
  const { type } = removeUserLinkSchema.parse(req.body);

  const user = await userModel.findById(userId);

  if (!user)
    return res.status(500).json({
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
  const users = await userModel.find().lean();

  return res.status(200).json({
    error: false,
    data: users,
  });
}

async function getSiteAnalytics(req: Request, res: Response) {}

async function getRecentPurchases(req: Request, res: Response) {}

export {
  getSiteConfig,
  getAllProducts,
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
  getSiteAnalytics,
  getRecentPurchases,
};
