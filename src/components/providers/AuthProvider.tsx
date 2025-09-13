"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/api/authService";
import { store } from "@/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize authentication state from localStorage on app start
    console.log("AuthProvider: Initializing auth...");
    AuthService.initializeAuth();

    // Debug: Check Redux state after initialization
    setTimeout(() => {
      const state = store.getState();
      console.log("Redux auth state after init:", state.auth);
    }, 100);
  }, []);

  return <>{children}</>;
}
