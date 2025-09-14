import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/authSlice";
import { AuthService } from "@/lib/api/authService";
import type { User } from "@/types/entities";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Two-step login function
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      // AuthService.login handles the two-step flow internally
      return await AuthService.login(email, password);
    },
    []
  );

  // Logout function
  const logout = useCallback(() => {
    AuthService.logout();
  }, []);

  // Refresh user data from server
  const refreshUser = useCallback(async (): Promise<User> => {
    return await AuthService.refreshUser();
  }, []);

  // Check if user has required role
  const hasRole = useCallback(
    (requiredRole: "admin" | "manager" | "user"): boolean => {
      return AuthService.hasRole(requiredRole);
    },
    []
  );

  // Check if user is active
  const isActive = useCallback((): boolean => {
    return AuthService.isUserActive();
  }, []);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    logout,
    refreshUser,

    // Utilities
    hasRole,
    isActive,
  };
};

// Convenience hooks
export const useRole = (requiredRole: "admin" | "manager" | "user") => {
  const { hasRole } = useAuth();
  return hasRole(requiredRole);
};

export const useIsAdmin = () => useRole("admin");

export const useIsManager = () => {
  const { user } = useAuth();
  return user?.role === "admin" || user?.role === "manager";
};

export const useIsCurrentUser = (userId: number) => {
  const { user } = useAuth();
  return user?.id === userId;
};
