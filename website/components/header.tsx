import { me } from "@/lib/actions";
import HeaderClient from "./header.client";

export default async function Header() {
  const user = await me(true);

  return <HeaderClient needsLogin={user ? false : true} />;
}
