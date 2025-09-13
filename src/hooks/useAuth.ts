import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/authSlice";
import { AuthService } from "@/lib/api/authService";
import type { User } from "@/types/entities";

// Custom hook for authentication
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Login function
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      dispatch(setLoading(true));
      try {
        const user = await AuthService.login(email, password);
        return user;
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

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<User> => {
    dispatch(setLoading(true));
    try {
      const user = await AuthService.getCurrentUser();
      return user;
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

// Hook for checking specific roles
export const useRole = (requiredRole: "admin" | "manager" | "user") => {
  const { hasRole } = useAuth();
  return hasRole(requiredRole);
};

// Hook for admin access
export const useIsAdmin = () => {
  return useRole("admin");
};

// Hook for manager access (admin + manager)
export const useIsManager = () => {
  const { user } = useAuth();
  return user?.role === "admin" || user?.role === "manager";
};

// Hook for checking if current user
export const useIsCurrentUser = (userId: number) => {
  const { user } = useAuth();
  return user?.id === userId;
};
