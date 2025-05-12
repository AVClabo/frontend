// src/context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth().then((isAuth) => {
      setIsAuthenticated(isAuth);
    });

    // Set up token refresh interval (every 45 minutes)
    const refreshInterval = 45 * 60 * 1000; // 45 minutes in milliseconds
    const intervalId = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        setIsAuthenticated(false);
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      // Try to access a protected endpoint
      const response = await fetch("http://localhost:8000/api/patients/", {
        credentials: "include",
      });

      if (response.ok) {
        return true;
      }

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        return await refreshToken();
      }

      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    // Try the request with current token
    let response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the request with new token
        response = await fetch(url, {
          ...options,
          credentials: "include",
        });
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};