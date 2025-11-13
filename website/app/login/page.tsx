
import { redirect } from "next/navigation";
import LoginPage from "./page.client";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const force = (await searchParams)?.force;

    if (force == "roblox") redirect("/api/roblox");
    if (force == "discord") redirect("/api/discord");

    return <LoginPage />
}
