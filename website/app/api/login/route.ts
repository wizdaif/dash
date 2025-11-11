import { sign, verify } from "jsonwebtoken";
import { DiscordUser, JWTData } from "@/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const APP_URI = process.env.APP_URL;

const scope = ["identify", "email"].join(" ");
const REDIRECT_URI = `${APP_URI}/api/discord`;

const OAUTH_QS = new URLSearchParams({
  client_id: process.env.DISCORD_OAUTH_CLIENT_ID!,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope,
}).toString();

const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

const auth = async (req: Request) => {
  const query = new URL(req.url as string).searchParams;

  if (query.get("error")) {
    return redirect(`/?error=${query.get("error")}`);
  }

  if (!query.get("code") || typeof query.get("code") !== "string") {
    redirect(OAUTH_URI);
  }

  if (cookies().get("token")) {
    // call server & verify user
    const token = cookies().get("token");

    const request = await fetch(`${process.env.SERVER_URL}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token as unknown as string,
      },
    });

    if (request.status === 200) {
        redirect("/dashboard")
    } if (request.status === 500) {
        // handle bs
    }
  }

  const body = new URLSearchParams({
    client_id: process.env.DISCORD_OAUTH_CLIENT_ID!,
    client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code: query.get("code") as string,
    scope,
  }).toString();

  const { access_token = null, token_type = "Bearer" } = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    }
  ).then((res) => res.json());

  if (!access_token || typeof access_token !== "string") {
    console.log("no token redirect");
    return redirect(OAUTH_URI);
  }

  const me: DiscordUser | { unauthorized: true } = await fetch(
    "https://discord.com/api/users/@me",
    {
      headers: { Authorization: `${token_type} ${access_token}` },
    }
  ).then((res) => res.json());

  if (!("id" in me)) {
    return redirect(OAUTH_URI);
  }

  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
};

export { auth as GET };
