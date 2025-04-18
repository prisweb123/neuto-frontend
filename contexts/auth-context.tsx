"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"

type UserRole = "admin" | "seller"
type User = {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
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
    const id = localStorage.getItem("userId")
    const name = localStorage.getItem("userName")
    const email = localStorage.getItem("userEmail")
    const role = localStorage.getItem("userRole") as UserRole
    const active = localStorage.getItem("userActive") === "true"
    const token = localStorage.getItem("token")

    if (id && name && email && role && token) {
      setUser({ id, name, email, role, active, token })
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
      const response = await fetchWithInterceptor<{
        success: boolean
        token: string
        user: {
          id: string
          name: string
          email: string
          role: UserRole
          active: boolean
        }
      }>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requiresAuth: false
      })

      if (!response.data.success) {
        return false
      }

      const userData = {
        ...response.data.user,
        token: response.data.token
      }

      setUser(userData)
      localStorage.setItem('userId', userData.id)
      localStorage.setItem('userName', userData.name)
      localStorage.setItem('userEmail', userData.email)
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userActive', String(userData.active))
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
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userActive")
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

