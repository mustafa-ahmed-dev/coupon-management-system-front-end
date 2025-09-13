"use client";

import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "@/store";
import { AuthProvider } from "./AuthProvider";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient instance (only once per app)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data stays fresh for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Cache data for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 3 times
            retry: 3,
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            // Keep default Ant Design theme
            // You can customize later if needed
            token: {
              // Optional: slight customizations
              borderRadius: 6,
              // colorPrimary: '#1890ff', // Default blue
            },
          }}
          // Global component props
          button={{
            autoInsertSpace: false,
          }}
          input={{
            autoComplete: "off",
          }}
        >
          <AuthProvider>{children}</AuthProvider>

          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#333",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #f0f0f0",
              },
              success: {
                iconTheme: {
                  primary: "#52c41a",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ff4d4f",
                  secondary: "#fff",
                },
              },
            }}
          />

          {/* React Query DevTools (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ConfigProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
