import { userModel } from "models/User";

export async function GetUserProfile({
  userId,
  robloxId,
  discordId,
}: {
  userId?: string;
  robloxId?: string;
  discordId?: string;
}) {
  let options = {};

  if (!robloxId && !discordId && !userId) return null;

  if (robloxId) {
    options = {
      robloxId,
    };
  } else if (userId) {
    options = {
      _id: userId,
    };
  } else if (discordId) {
    options = {
      discordId,
    };
  }

  const user = await userModel
    .findOne(options)
    .populate([
      { path: "products.id", model: "products", select: "name images" },
    ])
    .select("products")
    .lean();

  if (!user) return null;

  return user;
}
