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

const router = express.Router();

router.get(routes.GET_SITE_CONFIG, isAuthenticated);

router.get(routes.GET_PRODUCTS);
router.get(routes.GET_PRODUCT_LOOKUP);

router.post(
  routes.POST_CREATE_PRODUCT,
  isAuthenticated,
  isAdmin,
  validateData(createProductSchema)
);
router.put(
  routes.PUT_UPDATE_PRODUCT,
  isAuthenticated,
  isAdmin,
  validateData(updateProductSchema)
);
router.delete(routes.DELETE_PRODUCT, isAuthenticated, isAdmin);

router.get(routes.GET_PRODUCT_REVIEWS);
router.post(
  routes.POST_PRODUCT_REVIEW,
  isAuthenticated,
  validateData(createProductReviewSchema),
  ownsProduct("params"),
);
router.delete(routes.DELETE_PRODUCT_REVIEW, isAuthenticated);

router.get(routes.GET_OWNED_PRODUCTS); //
router.get(routes.GET_AUTHENTICATED_USER, isAuthenticated);

// edit the isAuthenticated handler to also check the db for any api keys, then we ignore the admin middleware
router.post(
  routes.POST_WHITELIST_ADD,
  isAuthenticated,
  isAdmin,
  validateData(addWhitelistSchema)
);
router.post(
  routes.POST_WHITELIST_REMOVE,
  isAuthenticated,
  isAdmin,
  validateData(removeWhitelistSchema)
);
router.post(
  routes.POST_TRANSFER_PRODUCT,
  isAuthenticated,
  validateData(transferWhitelistSchema),
  ownsProduct("body")
);

router.get(routes.GET_USERS, isAuthenticated, isAdmin);
router.get(routes.GET_ANALYTICS, isAuthenticated, isAdmin);
router.get(routes.GET_RECENT_PURCHASES, isAuthenticated, isAdmin);

export default router;
