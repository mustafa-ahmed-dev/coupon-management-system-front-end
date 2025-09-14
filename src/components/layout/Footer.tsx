"use client";

import { Layout, Typography, Space, Divider } from "antd";
import { CopyrightOutlined, HeartFilled } from "@ant-design/icons";

const { Footer: LayoutFooter } = Layout;
const { Text } = Typography;

export function Footer() {
  const currentYear = new Date().getFullYear();

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
        <Text type="secondary">
          Made with <HeartFilled style={{ color: "#ff4d4f" }} /> by Mustafa
          Ahmed
        </Text>
      </Space>
    </LayoutFooter>
  );
}
