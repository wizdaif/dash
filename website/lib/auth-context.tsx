"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { LinkedAccount } from "@/types"

interface User {
  id: string
  username: string
  avatar: string
  email: string
  isAdmin: boolean
  linkedAccounts?: LinkedAccount[]
}

interface AuthContextType {
  user: User | null
  loginWithDiscord: () => Promise<void>
  logout: () => void
  isLoading: boolean
  linkRobloxAccount: (username: string) => Promise<void>
  unlinkRobloxAccount: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock login - in production this would call your API
    if (username && password) {
      const mockUser: User = {
        id: "1",
        username: username,
        avatar: "/diverse-user-avatars.png",
        email: `${username}@example.com`,
        isAdmin: username === "admin",
        linkedAccounts: [],
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const loginWithDiscord = async () => {
    // Mock Discord OAuth - in production this would redirect to Discord
    const mockUser: User = {
      id: "discord_123",
      username: "DiscordUser",
      avatar: "/stylized-discord-avatar.png",
      email: "discord@example.com",
      isAdmin: true,
      linkedAccounts: [],
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const linkRobloxAccount = async (username: string) => {
    if (user) {
      const linkedAccount: LinkedAccount = {
        platform: "Roblox",
        username: username,
        userId: `roblox_${Date.now()}`,
        linkedDate: new Date().toISOString(),
      }
      const updatedUser = {
        ...user,
        linkedAccounts: [...(user.linkedAccounts || []), linkedAccount],
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const unlinkRobloxAccount = () => {
    if (user) {
      const updatedUser = {
        ...user,
        linkedAccounts: user.linkedAccounts?.filter((account) => account.platform !== "Roblox") || [],
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{ user, loginWithDiscord, logout, isLoading, linkRobloxAccount, unlinkRobloxAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
