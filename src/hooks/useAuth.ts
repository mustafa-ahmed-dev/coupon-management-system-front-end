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
      dispatch(setLoading(true));
      try {
        return await AuthService.login(email, password);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Logout function
  const logout = useCallback(() => {
    AuthService.logout();
  }, []);

  // Refresh user data from server
  const refreshUser = useCallback(async (): Promise<User> => {
    dispatch(setLoading(true));
    try {
      return await AuthService.refreshUser();
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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
