"use client";

import {
  Layout,
  Button,
  Space,
  Typography,
  Divider,
  Badge,
  Avatar,
  Dropdown,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProfileOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";

const { Header: LayoutHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export function Header({
  collapsed,
  onToggleCollapse,
  isMobile = false,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // User dropdown menu items
  const userDropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "My Profile",
      onClick: () => router.push("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => router.push("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: () => {
        logout();
        router.push("/login");
      },
    },
  ];

  // Get role badge color
  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "#ff4d4f"; // Red
      case "manager":
        return "#1890ff"; // Blue
      case "user":
        return "#52c41a"; // Green
      default:
        return "#d9d9d9"; // Gray
    }
  };

  // Mobile header layout
  if (isMobile) {
    return (
      <LayoutHeader
        style={{
          padding: 0,
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
        }}
      >
        {/* Left side - Menu trigger */}
        <Space align="center">
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={onToggleCollapse}
            style={{
              fontSize: 16,
              width: 64,
              height: 64,
            }}
          />
          <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
            CMS
          </Text>
        </Space>

        {/* Right side - User info (compact) */}
        <Space size="small" style={{ marginRight: 16 }}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: 18 }}
          />
          <Dropdown
            menu={{ items: userDropdownItems }}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <Button type="text" style={{ height: "auto", padding: "8px" }}>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: getRoleBadgeColor(user?.role) }}
              />
            </Button>
          </Dropdown>
        </Space>
      </LayoutHeader>
    );
  }

  // Desktop header layout
  return (
    <LayoutHeader
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
        onClick={onToggleCollapse}
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

        {/* Notifications */}
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ fontSize: 18 }}
          onClick={() => router.push("/notifications")}
        />

        {/* User dropdown */}
        <Dropdown
          menu={{ items: userDropdownItems }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <Button type="text" style={{ height: "auto", padding: "8px 12px" }}>
            <Space align="center">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: getRoleBadgeColor(user?.role) }}
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
    </LayoutHeader>
  );
}
