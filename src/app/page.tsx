"use client";

import { Typography, Divider } from "antd";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";

const { Title, Text } = Typography;

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Title level={2}>Dashboard</Title>
        <Divider />
        <Text type="secondary">
          Welcome to the Coupon Management System dashboard. Use the sidebar to
          navigate to different sections.
        </Text>
      </Layout>
    </ProtectedRoute>
  );
}
