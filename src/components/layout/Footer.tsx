"use client";

import { Layout, Typography, Space, Divider } from "antd";
import { CopyrightOutlined, HeartFilled } from "@ant-design/icons";

const { Footer: LayoutFooter } = Layout;
const { Text, Link } = Typography;

interface FooterProps {
  isMobile?: boolean;
}

export function Footer({ isMobile = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (isMobile) {
    return (
      <LayoutFooter
        style={{
          textAlign: "center",
          padding: "16px",
          background: "#fafafa",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Space size="small" direction="vertical">
          <Text type="secondary" style={{ fontSize: 12 }}>
            <CopyrightOutlined /> {currentYear} Coupon Management System
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Made with <HeartFilled style={{ color: "#ff4d4f" }} />
          </Text>
        </Space>
      </LayoutFooter>
    );
  }

  return (
    <LayoutFooter
      style={{
        textAlign: "center",
        padding: "24px 50px",
        background: "#fafafa",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Space split={<Divider type="vertical" />} size="middle">
        <Text type="secondary">
          <CopyrightOutlined /> {currentYear} Coupon Management System
        </Text>
        <Text type="secondary">Version 1.0.0</Text>
        <Text type="secondary">
          Made with <HeartFilled style={{ color: "#ff4d4f" }} /> by Development
          Team
        </Text>
      </Space>

      <div style={{ marginTop: 8 }}>
        <Space split={<Divider type="vertical" />} size="small">
          <Link href="#" style={{ fontSize: 12 }}>
            Privacy Policy
          </Link>
          <Link href="#" style={{ fontSize: 12 }}>
            Terms of Service
          </Link>
          <Link href="#" style={{ fontSize: 12 }}>
            Support
          </Link>
          <Link href="#" style={{ fontSize: 12 }}>
            Documentation
          </Link>
        </Space>
      </div>
    </LayoutFooter>
  );
}
