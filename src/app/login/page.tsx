"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Form, Input, Button, Typography, Divider, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/types/forms";
import type { LoginFormData } from "@/types/forms";
import { showToast } from "@/lib/utils/toast";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      // Login success - useEffect will handle redirect
    } catch (error) {
      // Error is handled by AuthService (toast notification)
      console.error("Login error:", error);
      showToast.error("Login Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </main>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5", // Optional: Adds a nice background color
        padding: "16px", // Optional: Adds some padding for small screens
      }}
    >
      <Card style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3}>Sign in to your account</Title>
        </div>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  size="large"
                  autoComplete="email"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  size="large"
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            For support, contact your system administrator
          </Text>
        </div>

        {/* Development helper - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div style={{ marginTop: "24px", opacity: 0.7 }}>
            <Divider>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Dev Info
              </Text>
            </Divider>
            <Text code style={{ display: "block", fontSize: "12px" }}>
              API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}
            </Text>
            <Text code style={{ display: "block", fontSize: "12px" }}>
              Login endpoint: /auth/login
            </Text>
          </div>
        )}
      </Card>
    </main>
  );
}
