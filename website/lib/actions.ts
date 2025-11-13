"use server";

import type { ApiResponse, Product, Review } from "@/types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function checkAuth() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  return tokenCookie?.value;
}

export async function setToken(token: string) {
  const cookieStore = await cookies();

  return cookieStore.set("token", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    domain:
      process.env.NODE_ENV === "development"
        ? "localhost"
        : "." + process.env.APP_URL,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearToken() {
  const cookieStore = await cookies();

  return cookieStore.set("token", "", {
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    domain:
      process.env.NODE_ENV === "development"
        ? "localhost"
        : "." + process.env.APP_URL,
    sameSite: "lax",
    expires: -1,
  });
}

export async function auth<R>(
  callback: (user: any, token: string) => R | Promise<R>,
  options = { skipFetch: null, avoidRedirect: false } as any
) {
  const token = await checkAuth();

  if (!token) return null;
  if (options.skipFetch) return await callback(null, token);

  try {
    const request = await fetch(
      `${process.env.SERVER_URL}/users/authenticated`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response: ApiResponse<any> = await request.json();

    if (response.error) {
      if (request.status === 401 && !options.avoidRedirect) redirect("/login");
      if (request.status === 500) throw new Error(response.message); 
    } else return await callback(response.data, token);
  } catch (error: any) {
    console.log("Error", error);

    if (error.message === "Unauthorized") {
      await clearToken();

      // redirect("/login");

      return null;
    } else if (error.message === "Token missing") {
      await clearToken();

      return null;
    } else {
      // internal server error

      console.log("Internal server error", error.message);
      return null;
    }
  }

  return null;
}

export const me = async (avoidRedirect = false) =>
  auth<any>(async (user) => user, { avoidRedirect });

export const unlink = async (userId: string, type: "roblox" | "discord") =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/users/${userId}/linked-account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
          }),
        }
      );

      const response: ApiResponse<{}> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return true;
    },
    { skipFetch: true } as any
  );

export const getAllUsers = async () =>
  auth(
    async (_, token) => {
      const request = await fetch(`${process.env.SERVER_URL}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response: ApiResponse<{}[]> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const getOwnedProducts = async (id: string) => {
  try {
    const request = await fetch(`${process.env.SERVER_URL}/user/profile?type=user&id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response: ApiResponse<Product[]> = await request.json();

    if (response.error) {
      if (request.status === 500) throw new Error(response.message); 
    } else return response.data;
  } catch (error: any) {
    console.log("Error while fetching user owned products", error);

    return null;
  }
};

export const getProductData = async (id: string) => {
  try {
    const request = await fetch(`${process.env.SERVER_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response: ApiResponse<Product> = await request.json();

    if (response.error) {
      if (request.status === 500) throw new Error(response.message); 
    } else return response.data;
  } catch (error: any) {
    console.log("Error while fetching product data", error);

    return null;
  }
};

export const getProductReviews = async (id: string) => {
  try {
    const request = await fetch(`${process.env.SERVER_URL}/products/${id}/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response: ApiResponse<Review[]> = await request.json();

    if (response.error) {
      if (request.status === 500) throw new Error(response.message); 
    } else return response.data;
  } catch (error: any) {
    console.log("Error while fetching product data", error);

    return null;
  }
};

export const getProducts = async () => {
  try {
    const request = await fetch(`${process.env.SERVER_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response: ApiResponse<Product[]> = await request.json();

    if (response.error) {
      if (request.status === 500) throw new Error(response.message); 
    } else return response.data;
  } catch (error: any) {
    console.log("Error while fetching products", error);
  }

  return [];
};

export const getAllProducts = async () =>
  auth(
    async (_, token) => {
      const request = await fetch(`${process.env.SERVER_URL}/admin/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response: ApiResponse<Product[]> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const getServerRoles = async () =>
  auth(
    async (_, token) => {
      const request = await fetch(`${process.env.SERVER_URL}/admin/roles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response: ApiResponse<{ id: string; name: string }[]> =
        await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const getSiteConfig = async () => {
  try {
    const request = await fetch(`${process.env.SERVER_URL}/config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response: ApiResponse<{
      SITE_TITLE: string;
      SITE_DESCRIPTION: string;
      TAG_CONTENT: string;
      HEADER_CONTENT: string;
      SHORT_DESC: string;
      STRIPE_PUBLIC_KEY: string;
    }> = await request.json();

    if (response.error) {
      if (request.status === 500) throw new Error(response.message); 
    } else return response.data;
  } catch (error: any) {
    console.log("Error while fetching products", error);
  }

  return null;
};

export const createProduct = async (payload: {
  name: string;
  description: string;
  category: string;
  stock: string;
  price: {
    robux: number;
    price: number;
  };
  tags?: string[];
  file?:
    | {
        type: string;
        name: string;
        buffer: string;
      }
    | undefined;
  images?:
    | {
        name: string;
        type: string;
        buffer: string;
      }[]
    | undefined;
  discordRoleId?: string | undefined;
  developerProductId?: string | undefined;
}) =>
  auth(
    async (_, token) => {
      const request = await fetch(`${process.env.SERVER_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const response: ApiResponse<any> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const updateProduct = async (
  productId: string,
  mutations: any
) =>
  auth(
    async (_, token) => {
      console.log(mutations)

      const request = await fetch(
        `${process.env.SERVER_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(mutations),
        }
      );

      const response: ApiResponse<any> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const updateProductByKey = async (
  productId: string,
  key: string,
  value: any
) =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            [key]: value
          }),
        }
      );

      const response: ApiResponse<any> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const deleteProduct = async (productId: string) =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const response: ApiResponse<any> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const getSiteAnalytics = async () =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/admin/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response: ApiResponse<any> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );

export const getRecentPurchases = async () =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/admin/sales`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response: ApiResponse<{
        type: "robux" | "stripe" | "paypal";
        user: {
          _id: string;
          discordId: string;
          robloxId: string;
        };
        price: number;
        isGift: boolean;
        products: {
          _id: string;
          name: string;
        }
        createdAt: string;
        updatedAt: string;
      }[]> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); 
      } else return response.data;
    },
    { skipFetch: true } as any
  );