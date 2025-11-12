"use server";

import type { ApiResponse } from "@/types";

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
      if (request.status === 500) throw new Error(response.message); // server error
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

export const me = async (avoidRedirect = false) => auth<any>(async (user) => user, { avoidRedirect });

export const unlink = async (type: "roblox" | "discord") =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/users/linked-account`,
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
        if (request.status === 500) throw new Error(response.message); // server error
      } else return true;
    },
    { skipFetch: true } as any
  );

export const getAllUsers = async () =>
  auth(
    async (_, token) => {
      const request = await fetch(
        `${process.env.SERVER_URL}/admin/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const response: ApiResponse<{}[]> = await request.json();

      if (response.error) {
        if (request.status === 401) redirect("/login");
        if (request.status === 500) throw new Error(response.message); // server error
      } else return response.data;
    },
    { skipFetch: true } as any
  );
