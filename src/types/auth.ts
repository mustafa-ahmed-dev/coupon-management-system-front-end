import type { User } from "./entities";

// JWT Token payload structure
export interface JwtPayload {
  sub: number; // User ID
  email: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expires at
}

// Authentication state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Token storage keys
export const TOKEN_STORAGE_KEY = "coupon_management_token";
export const USER_STORAGE_KEY = "coupon_management_user";

// Auth context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
