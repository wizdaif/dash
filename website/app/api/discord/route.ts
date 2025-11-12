import { DiscordUser } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearToken, setToken } from "@/lib/actions";

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
  const cook = await cookies();
  const token = cook.get("token");
  const query = new URL(req.url as string).searchParams;

  if (query.get("error")) {
    return redirect(`/?error=${query.get("error")}`);
  }

  if (token && token.value) {
    const request = await fetch(
      `${process.env.SERVER_URL}/users/authenticated`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    if (request.status === 200) {
      const { data } = await request.json();

      if (data.discordLinked) redirect("/dashboard");
    } else if (request.status === 500)
      redirect(`/?error=Error while authenticating with Discord`);
    else await clearToken();
  }

  if (!query.get("code") || typeof query.get("code") !== "string") {
    redirect(OAUTH_URI);
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

  cook.set(
    "avatar_url",
    `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.${
      me.avatar.startsWith("a_") ? "gif" : "png"
    }`
  );

  const request = await fetch(`${process.env.SERVER_URL}/users/authenticate`, {
    method: "POST",
    headers: {
      ...(token ? {Authorization: `Bearer ${token.value}`} : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "discord",
      id: me.id,
      email: me.email,
      username: me.username,
    }),
  });

  if (request.status === 200) {
    const response = await request.json();

    setToken(response.data.token);
    redirect("/dashboard");
  } else redirect(`/?error=Error while authenticating with Discord`);
};

export { auth as GET };
