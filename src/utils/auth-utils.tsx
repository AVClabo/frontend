// src/utils/auth-utils.tsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Function to refresh the token
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      return true
    }
    return false
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

// Renamed to useLogout to avoid conflict
export const useLogout = () => {
  const navigate = useNavigate()

  // Function to handle logout
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        console.log("Logout successful")
      } else {
        console.error("Logout failed with status:", response.status)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always navigate to login page, even if logout fails
      navigate("/login")
    }
  }

  return { logout }
}

// Custom hook to handle token refresh
export const useTokenRefresh = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Set up token refresh interval (every 45 minutes)
    const refreshInterval = 45 * 60 * 1000 // 45 minutes in milliseconds

    const intervalId = setInterval(async () => {
      const success = await refreshToken()
      if (!success) {
        // If refresh fails, redirect to login
        navigate("/login")
      }
    }, refreshInterval)

    // Initial token refresh when component mounts
    refreshToken().catch(() => navigate("/login"))

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [navigate])
}

// Utility function to create authenticated fetch
export const authFetch = async (url: string, options: RequestInit = {}) => {
  // Try the request with current token
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  })

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const refreshed = await refreshToken()
    if (refreshed) {
      // Retry the request with new token
      response = await fetch(url, {
        ...options,
        credentials: "include",
      })
    }
  }

  return response
}