"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"

type UserRole = "admin" | "seller"
type User = {
  name: string
  role: UserRole
  token: string
} | null

interface AuthContextType {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize user from localStorage on mount
  useEffect(() => {
    const role = localStorage.getItem("userRole") as UserRole
    const name = localStorage.getItem("userName")
    const token = localStorage.getItem("token")

    if (role && name && token) {
      setUser({ name, role, token })
    }

    setIsLoading(false)
  }, [])

  // Redirect based on auth status and role
  useEffect(() => {
    if (isLoading) return

    // If on login page and already logged in, redirect to home
    if (pathname === "/login" && user) {
      router.push("/price-offer")
      return
    }

    // If not on login page and not logged in, redirect to login
    if (pathname !== "/login" && !user) {
      router.push("/login")
      return
    }

    // Role-based access control
    if (
      user?.role === "seller" &&
      pathname !== "/login" &&
      !["/price-offer", "/offer", "/settings"].includes(pathname) &&
      !pathname.startsWith("/price-offer/")
    ) {
      router.push("/price-offer")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const { data, success, message } = await fetchWithInterceptor<{
        name: string
        role: UserRole
        token: string
      }>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requiresAuth: false
      })

      if (!success) {
        return false
      }
      const userData = { name: data.name, role: data.role as UserRole, token: data.token }

      setUser(userData)
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userName', userData.name)
      localStorage.setItem('token', userData.token)

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("token")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

