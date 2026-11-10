"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function useLogout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function logout() {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } finally {
      router.replace("/login")
      router.refresh()
    }
  }

  return { logout, isLoading }
}