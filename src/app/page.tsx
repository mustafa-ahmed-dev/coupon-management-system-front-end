"use client";

import { Typography, Divider } from "antd";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

const { Title, Text } = Typography;

export default function HomePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Title level={2}>Dashboard</Title>
        <Divider />
        <Text type="secondary">
          Welcome to the Coupon Management System dashboard. Use the sidebar to
          navigate to different sections.
        </Text>
      </AppLayout>
    </ProtectedRoute>
  );
}
