import { apiClient } from "./client";
import { store } from "@/store";
import {
  setCredentials,
  logout as logoutAction,
} from "@/store/slices/authSlice";
import { showToast, toastMessages } from "@/lib/utils/toast";
import type { AuthResponse, LoginRequest } from "@/types/api";
import type { User } from "@/types/entities";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/types/auth";

export class AuthService {
  // Login user with email and password
  static async login(email: string, password: string): Promise<User> {
    try {
      const loginData: LoginRequest = { email, password };

      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        loginData
      );

      // Log the ENTIRE response to see the structure
      console.log("=== FULL API RESPONSE ===");
      console.log("response.data:", response.data);
      console.log("response.status:", response.status);

      // Check if response.data has user and token
      if (!response.data) {
        throw new Error("No data in response");
      }

      const { user, token } = response.data;

      console.log("=== EXTRACTED VALUES ===");
      console.log("user:", user);
      console.log("token:", token);

      if (!user) {
        throw new Error("No user in response data");
      }

      if (!token) {
        throw new Error("No token in response data");
      }

      // Store credentials in Redux and localStorage
      console.log("=== STORING CREDENTIALS ===");
      store.dispatch(setCredentials({ user, token }));

      const userString = JSON.stringify(user);
      console.log("User string to save:", userString);

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, userString);

      console.log("=== VERIFICATION ===");
      console.log("Saved token:", localStorage.getItem(TOKEN_STORAGE_KEY));
      console.log("Saved user string:", localStorage.getItem(USER_STORAGE_KEY));

      // Verify Redux state
      const state = store.getState();
      console.log("Redux auth state:", state.auth);

      showToast.success(toastMessages.auth.loginSuccess);

      return user;
    } catch (error) {
      console.error("Login error details:", error);
      showToast.error(toastMessages.auth.loginError);
      throw error;
    }
  }

  // Logout user
  static logout(): void {
    try {
      // Clear from Redux
      store.dispatch(logoutAction());

      // Clear from localStorage
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      showToast.success(toastMessages.auth.logoutSuccess);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear everything even if there's an error
      store.dispatch(logoutAction());
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  // Initialize auth state from localStorage on app start
  static initializeAuth(): void {
    try {
      console.log("Initializing auth...");
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const userStr = localStorage.getItem(USER_STORAGE_KEY);

      console.log("Token from localStorage:", !!token);
      console.log("User string from localStorage:", !!userStr);

      if (token && userStr) {
        const user: User = JSON.parse(userStr);

        console.log("Parsed user:", user);

        // Check if user data is valid
        if (user.id && user.email && user.role) {
          console.log("Setting credentials in Redux...");
          store.dispatch(setCredentials({ user, token }));
          return;
        } else {
          console.log("Invalid user data structure");
        }
      } else {
        console.log("No token or user in localStorage");
      }

      // If no valid auth data, ensure logged out state
      console.log("Clearing auth state...");
      store.dispatch(logoutAction());
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Auth initialization error:", error);
      // Clear everything on error
      store.dispatch(logoutAction());
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  // Get current user from API (refresh user data)
  static async getCurrentUser(): Promise<User> {
    try {
      const state = store.getState();
      const currentUser = state.auth.user;

      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      const response = await apiClient.get<User>(`/users/${currentUser.id}`);
      const user = response.data;

      // Update user in store and localStorage
      const token = state.auth.token;
      if (token) {
        store.dispatch(setCredentials({ user, token }));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }

      return user;
    } catch (error) {
      // If user fetch fails, logout (token might be invalid)
      this.logout();
      throw error;
    }
  }

  // Check if user has required role
  static hasRole(requiredRole: "admin" | "manager" | "user"): boolean {
    const state = store.getState();
    const userRole = state.auth.user?.role;

    if (!userRole) return false;

    // Role hierarchy: admin > manager > user
    const roleHierarchy = {
      admin: 3,
      manager: 2,
      user: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  // Check if user is active (not deactivated)
  static isUserActive(): boolean {
    const state = store.getState();
    const user = state.auth.user;

    if (!user) return false;

    return !user.deactivatedAt;
  }

  // Get current user from state
  static getCurrentUserFromState(): User | null {
    const state = store.getState();
    return state.auth.user;
  }

  // Get current token from state
  static getCurrentToken(): string | null {
    const state = store.getState();
    return state.auth.token;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const state = store.getState();
    return (
      state.auth.isAuthenticated && !!state.auth.user && !!state.auth.token
    );
  }
}
