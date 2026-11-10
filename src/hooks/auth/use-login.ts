"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type LoginResponse = {
  success: boolean
  message?: string
  data?: { user: { id: string; nama: string; email: string } }
}

export function useLogin() {
  const router = useRouter()

  const [username, setUsernameRaw] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function setUsername(value: string) {
  setUsernameRaw(value.toLowerCase())
  }

  async function login() {
  if (!username.trim() || !password) {
    setErrorMessage("Username dan password wajib diisi.")
    return
  }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      const result = (await response.json()) as LoginResponse

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Email atau password salah.")
      }

      router.replace("/dashboard")
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat login.")
    } finally {
      setIsLoading(false)
    }
  }

  return { username, setUsername, password, setPassword, showPassword, setShowPassword, isLoading, errorMessage, login }
}