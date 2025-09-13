"use client";

import { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Space,
  Typography,
  Divider,
  Badge,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  FileTextOutlined,
  TagsOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, hasRole } = useAuth();

  // Menu items based on user role
  const getMenuItems = (): MenuProps["items"] => {
    const items: MenuProps["items"] = [
      {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
      },
    ];

    // Manager and Admin can see coupon-related features
    if (hasRole("manager")) {
      items.push(
        {
          key: "requests",
          icon: <FileTextOutlined />,
          label: "Coupon Requests",
        },
        {
          key: "coupons",
          icon: <TagsOutlined />,
          label: "Coupons",
        },
        {
          key: "categories",
          icon: <ShopOutlined />,
          label: "Categories",
        }
      );
    }

    // Only Admin can manage users and departments
    if (hasRole("admin")) {
      items.push(
        {
          type: "divider",
        },
        {
          key: "users",
          icon: <UsergroupAddOutlined />,
          label: "Users",
        },
        {
          key: "departments",
          icon: <BankOutlined />,
          label: "Departments",
        }
      );
    }

    return items;
  };

  // User dropdown menu items
  const userDropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: logout,
    },
  ];

  // Role badge color
  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "manager":
        return "blue";
      case "user":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={240}
        style={{
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
        }}
      >
        {/* Logo/Brand Area */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 24px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          {collapsed ? (
            <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
              CMS
            </Text>
          ) : (
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                Coupon Management
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                System
              </Text>
            </Space>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={getMenuItems()}
          style={{
            borderRight: 0,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Left side - Collapse trigger */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 64,
              height: 64,
            }}
          />

          {/* Right side - User info and controls */}
          <Space size="middle" style={{ marginRight: 24 }}>
            {/* Welcome message */}
            <Space size="small">
              <Text type="secondary">Welcome back,</Text>
              <Text strong>{user?.name}</Text>
              <Badge
                count={user?.role?.toUpperCase()}
                color={getRoleBadgeColor(user?.role)}
                style={{ marginLeft: 8 }}
              />
            </Space>

            <Divider type="vertical" style={{ height: 32 }} />

            {/* User dropdown */}
            <Dropdown
              menu={{ items: userDropdownItems }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <Button
                type="text"
                style={{ height: "auto", padding: "8px 12px" }}
              >
                <Space align="center">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Space
                    direction="vertical"
                    size={0}
                    style={{ textAlign: "left" }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: 500 }}>
                      {user?.username}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {user?.email}
                    </Text>
                  </Space>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content Area */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            minHeight: "calc(100vh - 112px)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
