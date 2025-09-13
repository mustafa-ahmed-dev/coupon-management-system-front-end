"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, Typography } from "antd";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/entities";

const { Text } = Typography;

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole, logout } = useAuth();
  const router = useRouter();

  // Debug logs
  console.log("ProtectedRoute - isLoading:", isLoading);
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute - user:", user);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Not authenticated, redirect to login
      console.log("Redirecting to login...");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Still loading authentication state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" tip="Redirecting to login..." />
        </div>
      )
    );
  }

  // Check if user is active (not deactivated)
  if (user.deactivatedAt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Account Deactivated
          </h2>
          <p className="text-gray-600">
            Your account has been deactivated. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  // Check role permissions if required
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Text strong style={{ fontSize: 18, color: "#ff4d4f" }}>
          Access Denied
        </Text>
        <Text type="secondary">
          You don&apos;t have permission to access this page.
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Required role: {requiredRole} | Your role: {user.role}
        </Text>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Specific role-based route guards
export function AdminRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function ManagerRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="manager" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="user" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
