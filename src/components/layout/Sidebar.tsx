"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Space, Typography } from "antd";
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  FileTextOutlined,
  TagsOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasRole } = useAuth();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["dashboard"]);

  // Update selected menu item based on current route
  useEffect(() => {
    const currentPath = pathname.split("/")[1] || "dashboard";
    setSelectedKeys([currentPath]);
  }, [pathname]);

  // Generate menu items based on user role
  const getMenuItems = (): MenuProps["items"] => {
    const items: MenuProps["items"] = [
      {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        onClick: () => router.push("/"),
      },
    ];

    // Manager and Admin can see coupon-related features
    if (hasRole("manager")) {
      items.push(
        {
          key: "requests",
          icon: <FileTextOutlined />,
          label: "Coupon Requests",
          onClick: () => router.push("/requests"),
        },
        {
          key: "coupons",
          icon: <TagsOutlined />,
          label: "Coupons",
          onClick: () => router.push("/coupons"),
        },
        {
          key: "categories",
          icon: <ShopOutlined />,
          label: "Categories",
          onClick: () => router.push("/categories"),
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
          onClick: () => router.push("/users"),
        },
        {
          key: "departments",
          icon: <BankOutlined />,
          label: "Departments",
          onClick: () => router.push("/departments"),
        }
      );
    }

    return items;
  };

  // Brand/Logo Component
  const BrandArea = () => (
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? 0 : "0 24px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fafafa",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onClick={() => router.push("/")}
    >
      {collapsed ? (
        <Text
          strong
          style={{
            fontSize: 18,
            color: "#1890ff",
            userSelect: "none",
          }}
        >
          CMS
        </Text>
      ) : (
        <Space direction="vertical" size={0}>
          <Text
            strong
            style={{
              fontSize: 16,
              color: "#1890ff",
              userSelect: "none",
            }}
          >
            Coupon Management
          </Text>
          <Text
            type="secondary"
            style={{
              fontSize: 12,
              userSelect: "none",
            }}
          >
            System
          </Text>
        </Space>
      )}
    </div>
  );

  // Navigation Menu Component
  const NavigationMenu = () => (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={selectedKeys}
      items={getMenuItems()}
      style={{
        borderRight: 0,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    />
  );

  // Desktop version using Sider
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      width={240}
      breakpoint="lg"
      collapsedWidth={80}
      style={{
        boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
      }}
    >
      <BrandArea />
      <NavigationMenu />
    </Sider>
  );
}
