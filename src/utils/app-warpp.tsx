// src/components/AppWrapper.tsx
import type React from "react"
import { useTokenRefresh } from "../utils/auth-utils"

interface AppWrapperProps {
  children: React.ReactNode
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  // This hook will handle token refresh
  useTokenRefresh()

  return <>{children}</>
}

export default AppWrapper
