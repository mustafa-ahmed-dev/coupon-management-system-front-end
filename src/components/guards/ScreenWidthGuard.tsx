"use client";

import { useState, useEffect } from "react";
import { Result, Typography, Button } from "antd";
import { DesktopOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface ScreenWidthGuardProps {
  children: React.ReactNode;
  minWidth?: number;
}

export function ScreenWidthGuard({
  children,
  minWidth = 950,
}: ScreenWidthGuardProps) {
  const [screenWidth, setScreenWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(window.innerWidth);
      setIsClient(true);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Don't render during SSR
  if (!isClient) {
    return null;
  }

  // Allow access if screen is wide enough
  if (screenWidth >= minWidth) {
    return <>{children}</>;
  }

  // Block access for narrow screens
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Result
          icon={
            <DesktopOutlined style={{ color: "#1890ff", fontSize: "64px" }} />
          }
          title={
            <Title level={3} style={{ color: "#262626" }}>
              Desktop Required
            </Title>
          }
          subTitle={
            <>
              <Paragraph style={{ fontSize: "16px", color: "#595959" }}>
                This application requires a minimum screen width of{" "}
                <strong>{minWidth}px</strong> for optimal experience.
              </Paragraph>
              <Paragraph style={{ color: "#8c8c8c" }}>
                Current width: <strong>{screenWidth}px</strong>
              </Paragraph>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
                style={{ marginTop: "16px" }}
              >
                Check Again
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
}
