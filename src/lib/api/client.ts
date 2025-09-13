import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { showToast } from "@/lib/utils/toast";
import { store } from "@/store";
import { logout, setLoading } from "@/store/slices/authSlice";
import type { ApiError } from "@/types/api";
import type { JwtPayload } from "@/types/auth";
import { TOKEN_STORAGE_KEY } from "@/types/auth";

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: "/api", // Uses Next.js API proxy
    timeout: 10000, // 10 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - Add JWT token to requests
  client.interceptors.request.use(
    (config) => {
      // Get token from Redux store
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        // Check if token is expired
        try {
          const decodedToken = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token is expired, remove it and logout
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            store.dispatch(logout());
            showToast.warning("Your session has expired. Please log in again.");
            return Promise.reject(new Error("Token expired"));
          }

          // Token is valid, add to headers
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          // Invalid token, remove it and logout
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          store.dispatch(logout());
          showToast.error("Invalid session. Please log in again.");
          return Promise.reject(new Error("Invalid token"));
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Successful response, return as-is
      return response;
    },
    (error: AxiosError<ApiError>) => {
      const { response, code, message } = error;

      // Handle different types of errors
      if (code === "ECONNABORTED") {
        // Request timeout
        showToast.error("Request timed out. Please try again.");
        return Promise.reject(error);
      }

      if (!response) {
        // Network error (no response)
        showToast.error(
          "Network error. Please check your connection and try again."
        );
        return Promise.reject(error);
      }

      const { status, data } = response;

      switch (status) {
        case 401: {
          // Unauthorized - logout user
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          store.dispatch(logout());
          showToast.error("Your session has expired. Please log in again.");

          // Redirect to login if not already there
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/login";
          }
          break;
        }

        case 403: {
          // Forbidden - user doesn't have permission
          const errorMessage =
            data?.message ||
            "You do not have permission to perform this action.";
          showToast.error(errorMessage);
          break;
        }

        case 404: {
          // Not found
          const errorMessage =
            data?.message || "The requested resource was not found.";
          showToast.error(errorMessage);
          break;
        }

        case 422: {
          // Validation error
          const errorMessage =
            data?.message || "Please check your input and try again.";
          showToast.error(errorMessage);
          break;
        }

        case 429: {
          // Too many requests
          showToast.error(
            "Too many requests. Please wait a moment before trying again."
          );
          break;
        }

        case 500: {
          // Server error
          showToast.error("Server error. Please try again later.");
          break;
        }

        default: {
          // Other errors
          const errorMessage =
            data?.message || `An error occurred (${status}). Please try again.`;
          showToast.error(errorMessage);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create and export the API client instance
export const apiClient = createApiClient();

// Helper function to handle API calls with loading states
export const withLoading = async <T>(
  apiCall: () => Promise<T>,
  showLoadingToast = false
): Promise<T> => {
  store.dispatch(setLoading(true));

  let loadingToastId: string | undefined;
  if (showLoadingToast) {
    loadingToastId = showToast.loading("Processing...");
  }

  try {
    const result = await apiCall();

    if (loadingToastId) {
      showToast.dismiss(loadingToastId);
    }

    return result;
  } catch (error) {
    if (loadingToastId) {
      showToast.dismiss(loadingToastId);
    }
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Helper function to extract error message from API error
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.message || error.message || "An unexpected error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

// Helper function to check if user has permission
export const hasPermission = (
  requiredRole: "admin" | "manager" | "user"
): boolean => {
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
};

export default apiClient;
