// Public routes
export const GET_SITE_CONFIG = "/config";

// Public routes - products
export const GET_PRODUCTS = "/products";
export const POST_CREATE_PRODUCT = GET_PRODUCTS;

export const GET_PRODUCT_LOOKUP = "/products/:id";
export const PUT_UPDATE_PRODUCT = GET_PRODUCT_LOOKUP;
export const DELETE_PRODUCT = GET_PRODUCT_LOOKUP;

export const GET_PRODUCT_REVIEWS = "/products/:id/reviews";
export const POST_PRODUCT_REVIEW = GET_PRODUCT_REVIEWS;
export const DELETE_PRODUCT_REVIEW = "/reviews/:id";

// Users routes - dashboard
export const GET_OWNED_PRODUCTS = "/users/profile"; // ?id

export const GET_AUTHENTICATED_USER = "/users/authenticated";
export const POST_AUTHENTICATE_USER = "/users/authenticate";
export const DELETE_ACCOUNT_LINK = "/users/:id/linked-account";

export const POST_WHITELIST_ADD = "/whitelist/allow";
export const POST_WHITELIST_REMOVE = "/whitelist/revoke";
export const POST_TRANSFER_PRODUCT = "/whitelist/transfer";

// Admin routes - dashboard
export const GET_USERS = "/admin/users";
export const GET_ALL_PRODUCTS = "/admin/products";
export const GET_ASSIGNABLE_ROLES = "/admin/roles";

export const GET_ANALYTICS = "/admin/stats";
export const GET_RECENT_PURCHASES = "/admin/sales";
