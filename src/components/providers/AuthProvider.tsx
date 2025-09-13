"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/api/authService";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize authentication state from localStorage on app start
    AuthService.initializeAuth();
  }, []);

  return <>{children}</>;
}
