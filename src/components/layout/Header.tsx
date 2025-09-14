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
  Image,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";

const { Header: LayoutHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Header({ collapsed, onToggleCollapse }: HeaderProps) {
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
      <Space align="center">
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
        <Image
          src="/elryan.svg"
          alt="ElRyan Logo"
          style={{
            height: "4rem",
            width: "auto",
            cursor: "pointer",
            marginLeft: 8,
          }}
          onClick={() => router.push("/")}
        />
      </Space>

      {/* Right side - User info and controls */}
      <Space size="middle" style={{ marginRight: 24 }}>
        {/* Welcome message */}
        <Space size="small">
          <Text type="secondary">Welcome back</Text>
          {user?.name}
        </Space>

        <Divider type="vertical" style={{ height: 32 }} />

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
