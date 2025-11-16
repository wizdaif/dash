export async function getUserAvatar(
  userId: string,
  options?: {
    size?: string;
  }
) {
  const {
    size = "420x420",
  }  = options ?? {};

  const request = await fetch(
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=${size}&format=Png&isCircular=false`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const body: any = await request.json();

  return body?.data ?? [];
}

export async function getUser(userId: string) {
  const request = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  const body: any = await request.json();

  return body?.data ?? null;
}
