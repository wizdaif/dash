"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithDiscord } = useAuth();
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError("")
  //   setIsLoading(true)

  //   const success = await login(username, password)
  //   if (success) {
  //     router.push("/dashboard")
  //   } else {
  //     setError("Invalid credentials")
  //   }
  //   setIsLoading(false)
  // }

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    await loginWithDiscord();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-black to-violet-950">
      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-white/60">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Continue with Discord
          </Button>
          <Button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full bg-[#fff] hover:bg-[#E5E5E5] text-black"
          >
            <svg
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="2"
            >
              <rect
                x="10.8655"
                y="5.76248"
                width="15"
                height="15"
                transform="rotate(19.8889 10.8655 5.76248)"
                stroke="black"
                strokeWidth="9"
              />
            </svg>
            Continue with Roblox
          </Button>

          <p className="text-center text-sm text-white/60">
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              Back to Home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
