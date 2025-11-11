"use server";

import type { ApiResponse } from "@/types";

import { cookies } from "next/headers";

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
  callback: (user: Me, token: string) => R | Promise<R>,
) {
  const token = await checkAuth();

  if (!token) return null;
  
  try {
    const request = await fetch(`${process.env.SERVER_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const response: ApiResponse<Me> = await request.json();

    if (response.error) {
      if (request.status === 400) throw new Error("Token missing"); // missing bearer
      if (request.status === 401) throw new Error("Unauthorized"); // invalid session
      if (request.status === 500) throw new Error(response.message); // server error
    } else return await callback(response.data, token);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      await clearToken();

      return null;
      // redirect("/#login");
    } else if (error.message === "Token missing") {
      await clearToken();

      return null;
      // redirect("/#login");
    } else {
      // internal server error

      console.log("Internal server error", error.message);
      return null;
    }
  }

  return null;
}

export const me = async () => auth<Me>(async (user) => user);
