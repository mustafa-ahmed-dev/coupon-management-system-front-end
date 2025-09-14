import { apiClient } from "./client";
import { store } from "@/store";
import {
  setCredentials,
  logout as logoutAction,
  setLoading,
  updateUser,
} from "@/store/slices/authSlice";
import { showToast, toastMessages } from "@/lib/utils/toast";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/types/entities";
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  type JwtPayload,
} from "@/types/auth";

export class AuthService {
  // Two-step login: 1) Get token, 2) Fetch user data
  static async login(email: string, password: string): Promise<User> {
    try {
      store.dispatch(setLoading(true));

      // Step 1: Get access token from backend
      const loginResponse = await apiClient.post<{ accessToken: string }>(
        "/auth/login",
        {
          email,
          password,
        }
      );

      if (!loginResponse.data?.accessToken) {
        throw new Error("No access token received from server");
      }

      const { accessToken } = loginResponse.data;

      // Step 2: Extract user ID from JWT token
      const userId = this.extractUserIdFromToken(accessToken);
      if (!userId) {
        throw new Error("Could not extract user ID from token");
      }

      // Step 3: Fetch full user data using the token
      const userResponse = await apiClient.get<User>(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.data) {
        throw new Error("No user data received from server");
      }

      const user = userResponse.data;

      // Step 4: Store everything in Redux and localStorage
      store.dispatch(setCredentials({ user, token: accessToken }));
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      showToast.success(toastMessages.auth.loginSuccess);
      return user;
    } catch (error: any) {
      // Clear any partial state on error
      this.clearAuthState();

      // Handle specific error messages
      if (error.response?.status === 401) {
        showToast.error("Invalid email or password");
      } else if (error.message.includes("access token")) {
        showToast.error("Authentication failed. Please try again.");
      } else if (error.message.includes("user ID")) {
        showToast.error("Invalid authentication token");
      } else {
        showToast.error("Login failed. Please try again.");
      }

      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  // Logout user
  static logout(): void {
    try {
      this.clearAuthState();
      showToast.success(toastMessages.auth.logoutSuccess);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear everything even if there's an error
      this.clearAuthState();
    }
  }

  // Initialize auth state from localStorage on app start
  static initializeAuth(): void {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const userStr = localStorage.getItem(USER_STORAGE_KEY);

      if (token && userStr) {
        // Check if token is expired
        if (this.isTokenExpired(token)) {
          this.clearAuthState();
          return;
        }

        try {
          const user: User = JSON.parse(userStr);

          // Validate user data structure
          if (this.isValidUser(user)) {
            store.dispatch(setCredentials({ user, token }));
          } else {
            this.clearAuthState();
          }
        } catch (parseError) {
          this.clearAuthState();
        }
      } else {
        this.clearAuthState();
      }
    } catch (error) {
      this.clearAuthState();
    }
  }

  // Refresh current user data from server
  static async refreshUser(): Promise<User> {
    try {
      const state = store.getState();
      const currentUser = state.auth.user;
      const token = state.auth.token;

      if (!currentUser || !token) {
        throw new Error("No authenticated user to refresh");
      }

      store.dispatch(setLoading(true));

      const response = await apiClient.get<User>(`/users/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = response.data;

      // Update user in store and localStorage
      store.dispatch(setCredentials({ user: updatedUser, token }));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      // If refresh fails, might be due to invalid token
      this.logout();
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  // Helper Methods
  private static extractUserIdFromToken(token: string): number | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const userId =
        typeof decoded.sub === "string"
          ? parseInt(decoded.sub, 10)
          : Number(decoded.sub);

      return isNaN(userId) ? null : userId;
    } catch (error) {
      return null;
    }
  }

  private static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private static isValidUser(user: any): user is User {
    return (
      user &&
      typeof user.id === "number" &&
      typeof user.email === "string" &&
      typeof user.role === "string" &&
      user.email.length > 0 &&
      user.role.length > 0
    );
  }

  private static clearAuthState(): void {
    store.dispatch(logoutAction());
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  // Public utility methods
  static hasRole(requiredRole: "admin" | "manager" | "user"): boolean {
    const state = store.getState();
    const userRole = state.auth.user?.role;

    if (!userRole) return false;

    const roleHierarchy = { admin: 3, manager: 2, user: 1 };
    return (
      roleHierarchy[userRole as keyof typeof roleHierarchy] >=
      roleHierarchy[requiredRole]
    );
  }

  static isUserActive(): boolean {
    const state = store.getState();
    const user = state.auth.user;
    return user ? !user.deactivatedAt : false;
  }

  static getCurrentUser(): User | null {
    return store.getState().auth.user;
  }

  static getCurrentToken(): string | null {
    return store.getState().auth.token;
  }

  static isAuthenticated(): boolean {
    const state = store.getState();
    return (
      state.auth.isAuthenticated && !!state.auth.user && !!state.auth.token
    );
  }

  static updateUserProfile(updates: Partial<User>): void {
    const state = store.getState();
    const currentUser = state.auth.user;

    if (!currentUser) {
      throw new Error("No authenticated user to update");
    }

    // Update Redux store first
    store.dispatch(updateUser(updates));

    // Get the updated user from Redux (after the merge)
    const newState = store.getState();
    const updatedUser = newState.auth.user;

    if (updatedUser) {
      // Update localStorage with the complete merged user object
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    showToast.success("Profile updated successfully");
  }
}
