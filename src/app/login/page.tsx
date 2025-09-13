"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Form, Input, Button, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/types/forms";
import type { LoginFormData } from "@/types/forms";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>Loading...</Text>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2} className="text-gray-900">
            Coupon Management System
          </Title>
          <Text className="text-gray-600">Sign in to your account</Text>
        </div>

        <Card className="shadow-lg">
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Form.Item
              label="Email Address"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined className="text-gray-400" />}
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
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Enter your password"
                    size="large"
                    autoComplete="current-password"
                  />
                )}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                size="large"
                block
                className="font-medium"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div className="text-center text-sm text-gray-600">
            <Text>For support, contact your system administrator</Text>
          </div>
        </Card>

        {/* Development helper - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <Card className="bg-blue-50 border-blue-200">
            <Title level={5} className="text-blue-800 mb-2">
              Development Info
            </Title>
            <div className="text-sm text-blue-700 space-y-1">
              <div>
                API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}
              </div>
              <div>Login endpoint: /api/auth/login</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
