import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { showToast } from "@/lib/utils/toast";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";
import type { ApiError } from "@/types/api";
import type { JwtPayload } from "@/types/auth";
import { TOKEN_STORAGE_KEY } from "@/types/auth";

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - Add JWT token to requests
  client.interceptors.request.use(
    (config) => {
      // Get token from Redux store (most up-to-date)
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired, logout user
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            store.dispatch(logout());
            showToast.warning("Your session has expired. Please log in again.");
            return Promise.reject(new Error("Token expired"));
          }

          // Token is valid, add to headers
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          // Invalid token, logout user
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          store.dispatch(logout());
          showToast.error("Invalid session. Please log in again.");
          return Promise.reject(new Error("Invalid token"));
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors globally
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiError>) => {
      const { response, code } = error;

      // Handle network errors
      if (code === "ECONNABORTED") {
        showToast.error("Request timed out. Please try again.");
        return Promise.reject(error);
      }

      if (!response) {
        showToast.error("Network error. Please check your connection.");
        return Promise.reject(error);
      }

      const { status } = response;

      switch (status) {
        case 401:
          // Unauthorized - logout user
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          store.dispatch(logout());
          showToast.error("Your session has expired. Please log in again.");
          break;

        case 403:
          showToast.error("You don't have permission to perform this action.");
          break;

        case 404:
          showToast.error("The requested resource was not found.");
          break;

        case 422:
          // Validation errors - let component handle these
          break;

        case 500:
          showToast.error("Server error. Please try again later.");
          break;

        default:
          showToast.error("An unexpected error occurred.");
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
