import { getAllUsers, me } from "@/lib/actions";
import DashboardPage from "./page.client";
import { cookies } from "next/headers";

export default async function DashboardHome() {
  const user = await me();
  const avatarUrl = (await cookies()).get("avatar_url")?.value;

  let data = null;

  if (user.isAdmin) {
    const users = await getAllUsers();

    data = {
      users,
    };
  }

  return <DashboardPage user={user} data={data} avatar={avatarUrl ?? ""} />;
}
