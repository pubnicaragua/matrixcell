"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import authService from "../services/authService"

interface AuthContextType {
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const user = authService.getUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const login = async (email: string, password: string) => {
    await authService.login(email, password)
    setUser(authService.getUser())
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

