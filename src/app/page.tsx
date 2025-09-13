"use client";

import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        Not logged in. Go to <a href="/login">/login</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
