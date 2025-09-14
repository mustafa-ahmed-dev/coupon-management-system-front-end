"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/api/authService";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize authentication state from localStorage
    AuthService.initializeAuth();

    // Debug: Check auth state after initialization
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        const state = AuthService.getCurrentUser();
        console.log("Auth state after initialization:", {
          user: !!state,
          isAuthenticated: AuthService.isAuthenticated(),
        });
      }, 100);
    }
  }, []);

  return <>{children}</>;
}
