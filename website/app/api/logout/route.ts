import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { clearToken } from "@/lib/actions";

const logout = async (req: Request) => {
  const token = (await cookies()).get("token");

  if (!token) redirect("/");

  await clearToken();

  return redirect('/')
};

export { logout as GET };
