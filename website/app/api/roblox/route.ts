import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sign, verify } from "jsonwebtoken";
import { clearToken, setToken } from "@/lib/actions";

const APP_URI = process.env.APP_URL;

const REDIRECT_URI = `${APP_URI}/api/roblox`;

const ROBLOX_AUTH_URL = "https://apis.roblox.com/oauth/v1/authorize";
const ROBLOX_TOKEN_URL = "https://apis.roblox.com/oauth/v1/token";
const ROBLOX_USERINFO_URL = "https://apis.roblox.com/oauth/v1/userinfo";

const SCOPES = ["openid", "profile"].join(" ");

const OAUTH_QS = new URLSearchParams({
  client_id: process.env.ROBLOX_OAUTH_ID!,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
}).toString();

const OAUTH_URI = `${ROBLOX_AUTH_URL}?${OAUTH_QS.toString()}`;

const auth = async (req: Request) => {
  const cook = await cookies();
  const token = cook.get("token");
  const query = new URL(req.url).searchParams;

  if (query.get("error")) {
    return redirect(
      `/?error=${query.get("error_description") || query.get("error")}`
    );
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
      
      if (data.robloxLinked) redirect("/dashboard");
    } else if (request.status === 500)
      redirect(`/?error=Error while authenticating with Robox`);
    else await clearToken();
  }

  if (!query.get("code") || typeof query.get("code") !== "string") {
    redirect(OAUTH_URI);
  }

  const body = new URLSearchParams({
    client_id: process.env.ROBLOX_OAUTH_ID!,
    client_secret: process.env.ROBLOX_OAUTH_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code: query.get("code") as string,
  });

  const { access_token = null } = await fetch(ROBLOX_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).then((res) => res.json());

  if (!access_token || typeof access_token !== "string") {
    return redirect(OAUTH_URI);
  }

  const me = await fetch(ROBLOX_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  }).then((res) => res.json());

  if (!("sub" in me)) {
    return redirect(OAUTH_URI);
  }

  cook.set("avatar_url", me.picture);

  const request = await fetch(`${process.env.SERVER_URL}/users/authenticate`, {
    method: "POST",
    headers: {
      ...(token ? {Authorization: `Bearer ${token.value}`} : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "roblox",
      id: me.sub,
      username: me.name,
    }),
  });

  if (request.status === 200) {
    const response = await request.json();

    setToken(response.data.token);
    redirect("/dashboard");
  } else redirect(`/?error=Error while authenticating with Roblox`);
};

export { auth as GET };
