import express from "express";
import * as routes from "./routes.config";

import {
  isAdmin,
  isAuthenticated,
  ownsProduct,
  validateData,
} from "@middleware";

import {
  addWhitelistSchema,
  createProductReviewSchema,
  createProductSchema,
  removeWhitelistSchema,
  transferWhitelistSchema,
  updateProductSchema,
} from "models/Product.validation";

import {
  addWhitelist,
  authenticateUser,
  createProduct,
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getAllProducts,
  getAllUsers,
  getAuthenticatedUser,
  getOwnedProducts,
  getProduct,
  getProductReviews,
  getRecentPurchases,
  getSiteAnalytics,
  getSiteConfig,
  removeAccountLink,
  removeWhitelist,
  transferWhitelist,
  updateProduct,
} from "controllers";
import { authenticateUserSchema, removeUserLinkSchema } from "models/User.validation";

const router = express.Router();

router.get(routes.GET_SITE_CONFIG, isAuthenticated, getSiteConfig);

router.get(routes.GET_PRODUCTS, getAllProducts);
router.get(routes.GET_PRODUCT_LOOKUP, getProduct);

router.post(
  routes.POST_CREATE_PRODUCT,
  isAuthenticated,
  isAdmin,
  validateData(createProductSchema),
  createProduct
);
router.put(
  routes.PUT_UPDATE_PRODUCT,
  isAuthenticated,
  isAdmin,
  validateData(updateProductSchema),
  updateProduct
);
router.delete(routes.DELETE_PRODUCT, isAuthenticated, isAdmin, deleteProduct);

router.get(routes.GET_PRODUCT_REVIEWS, getProductReviews);
router.post(
  routes.POST_PRODUCT_REVIEW,
  isAuthenticated,
  validateData(createProductReviewSchema),
  ownsProduct("params"),
  createProductReview
);
router.delete(
  routes.DELETE_PRODUCT_REVIEW,
  isAuthenticated,
  deleteProductReview
);

router.get(routes.GET_OWNED_PRODUCTS, getOwnedProducts);
router.get(
  routes.GET_AUTHENTICATED_USER,
  isAuthenticated,
  getAuthenticatedUser
);

router.post(
  routes.POST_AUTHENTICATE_USER,
  validateData(authenticateUserSchema),
  authenticateUser
);

router.delete(
  routes.DELETE_ACCOUNT_LINK,
  isAuthenticated,
  validateData(removeUserLinkSchema),
  removeAccountLink
);

router.post(
  routes.POST_WHITELIST_ADD,
  isAuthenticated,
  isAdmin,
  validateData(addWhitelistSchema),
  addWhitelist
);
router.post(
  routes.POST_WHITELIST_REMOVE,
  isAuthenticated,
  isAdmin,
  validateData(removeWhitelistSchema),
  removeWhitelist
);
router.post(
  routes.POST_TRANSFER_PRODUCT,
  isAuthenticated,
  validateData(transferWhitelistSchema),
  ownsProduct("body"),
  transferWhitelist
);

router.get(routes.GET_USERS, isAuthenticated, isAdmin, getAllUsers);
router.get(routes.GET_ANALYTICS, isAuthenticated, isAdmin, getSiteAnalytics);
router.get(
  routes.GET_RECENT_PURCHASES,
  isAuthenticated,
  isAdmin,
  getRecentPurchases
);

export default router;
