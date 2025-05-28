"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    first_name?: string
    last_name?: string
  }
} | null

type Session = {
  user: User
} | null

type AuthContextType = {
  user: User
  session: Session
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [session, setSession] = useState<Session>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user on mount
    try {
      const storedUser = localStorage.getItem("studentConnectUser")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setSession({ user: parsedUser })
      }
    } catch (e) {
      console.error("Failed to parse stored user", e)
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // Mock successful sign in
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: email,
        user_metadata: {
          full_name: email.split("@")[0].replace(".", " "),
        },
      }

      setUser(mockUser)
      setSession({ user: mockUser })

      // Store user in localStorage for persistence
      localStorage.setItem("studentConnectUser", JSON.stringify(mockUser))

      router.push("/dashboard")
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true)
      // Mock successful sign up
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email: email,
        user_metadata: {
          full_name: `${userData.firstName} ${userData.lastName}`,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      }

      setUser(mockUser)
      setSession({ user: mockUser })

      // Store user in localStorage for persistence
      localStorage.setItem("studentConnectUser", JSON.stringify(mockUser))

      router.push("/dashboard")
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem("studentConnectUser")
    router.push("/")
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
