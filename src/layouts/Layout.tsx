"use client"

// Layout.js
import { useEffect } from "react"
import Sidebar from "../components/Sidebar"
import { useTheme } from "../context/ThemeContext"

import type { ReactNode } from "react"

const Layout = ({ children }: { children: ReactNode }) => {
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-5 overflow-scroll">{children}</main>
    </div>
  )
}

export default Layout

