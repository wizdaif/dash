import {
  getAllProducts,
  getAllUsers,
  getOwnedProducts,
  getRecentPurchases,
  getServerRoles,
  getSiteAnalytics,
  me,
} from "@/lib/actions";
import DashboardPage from "./page.client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const user = await me();
  const avatarUrl = (await cookies()).get("avatar_url")?.value;

  let data = null;

  if (!user) return redirect("/login");

  const ownedProducts = await getOwnedProducts(user._id);

  if (user.isAdmin) {
    const users = await getAllUsers();
    const products = await getAllProducts();
    const serverRoles = await getServerRoles();
    const analytics = await getSiteAnalytics();
    const purchases = await getRecentPurchases();

    data = {
      users,
      products,
      analytics,
      purchases,
      serverRoles,
    };
  }

  return (
    <DashboardPage
      user={{ products: ownedProducts, ...user }}
      data={data}
      avatar={avatarUrl ?? ""}
    />
  );
}
