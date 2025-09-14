"use client";

import { useState, useEffect } from "react";
import { Result, Typography, Space, Button, Alert } from "antd";
import {
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
  RotateRightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface DeviceInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: "portrait" | "landscape";
  deviceType: string;
}

interface ScreenWidthGuardProps {
  children: React.ReactNode;
  minWidth?: number;
  allowTabletLandscape?: boolean;
}

export function ScreenWidthGuard({
  children,
  minWidth = 900,
  allowTabletLandscape = true,
}: ScreenWidthGuardProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: "portrait",
    deviceType: "Unknown",
  });
  const [isClient, setIsClient] = useState(false);

  const getDeviceInfo = (): DeviceInfo => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? "landscape" : "portrait";

    //  device detection
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    // More specific device type detection
    let deviceType = "Desktop";
    if (isMobile) {
      deviceType =
        orientation === "landscape"
          ? "Mobile (Landscape)"
          : "Mobile (Portrait)";
    } else if (isTablet) {
      deviceType =
        orientation === "landscape"
          ? "Tablet (Landscape)"
          : "Tablet (Portrait)";
    }

    // Check for specific devices using user agent
    const userAgent = navigator.userAgent;
    if (/iPad/.test(userAgent)) {
      deviceType = `iPad (${orientation})`;
    } else if (/iPhone/.test(userAgent)) {
      deviceType = `iPhone (${orientation})`;
    } else if (/Android.*Mobile/.test(userAgent)) {
      deviceType = `Android Phone (${orientation})`;
    } else if (/Android/.test(userAgent)) {
      deviceType = `Android Tablet (${orientation})`;
    }

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      orientation,
      deviceType,
    };
  };

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo());
      setIsClient(true);
    };

    updateDeviceInfo();

    // Handle window resize and orientation changes
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDeviceInfo, 150);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Show nothing during SSR/hydration
  if (!isClient) {
    return null;
  }

  // Determine if access should be allowed
  const shouldAllowAccess = () => {
    if (deviceInfo.width >= minWidth) return true;

    // Special case: Allow tablet landscape if enabled
    if (
      allowTabletLandscape &&
      deviceInfo.isTablet &&
      deviceInfo.orientation === "landscape" &&
      deviceInfo.width >= 900
    ) {
      return true;
    }

    return false;
  };

  if (shouldAllowAccess()) {
    return <>{children}</>;
  }

  // Get appropriate icon and messages based on device
  const getDeviceIcon = () => {
    if (deviceInfo.isMobile)
      return <MobileOutlined style={{ color: "#ff7875", fontSize: "48px" }} />;
    if (deviceInfo.isTablet)
      return <TabletOutlined style={{ color: "#faad14", fontSize: "48px" }} />;
    return <DesktopOutlined style={{ color: "#52c41a", fontSize: "48px" }} />;
  };

  const getInstructions = () => {
    if (deviceInfo.isMobile) {
      return (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong style={{ color: "#d46b08" }}>
            📱 Mobile Device Detected
          </Text>
          <ul
            style={{
              textAlign: "left",
              margin: 0,
              paddingLeft: "20px",
              color: "#595959",
            }}
          >
            <li>This system requires a desktop or laptop computer</li>
            <li>Try accessing from a computer with a larger screen</li>
            {deviceInfo.orientation === "portrait" && (
              <li>
                <RotateRightOutlined /> Try rotating to landscape mode (may help
                on larger phones)
              </li>
            )}
          </ul>
        </Space>
      );
    }

    if (deviceInfo.isTablet) {
      return (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong style={{ color: "#d46b08" }}>
            📱 Tablet Detected
          </Text>
          <ul
            style={{
              textAlign: "left",
              margin: 0,
              paddingLeft: "20px",
              color: "#595959",
            }}
          >
            {deviceInfo.orientation === "portrait" && (
              <li>
                <RotateRightOutlined /> Try rotating to landscape mode
              </li>
            )}
            <li>Use a desktop or laptop for the best experience</li>
            <li>Some tablet landscape modes may work (if screen ≥ 900px)</li>
          </ul>
        </Space>
      );
    }

    return (
      <ul
        style={{
          textAlign: "left",
          margin: 0,
          paddingLeft: "20px",
          color: "#595959",
        }}
      >
        <li>Maximize your browser window</li>
        <li>Use a larger monitor if available</li>
        <li>Ensure your browser zoom is at 100%</li>
      </ul>
    );
  };

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
          padding: deviceInfo.isMobile ? "30px 20px" : "40px",
          maxWidth: deviceInfo.isMobile ? "350px" : "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Result
          icon={getDeviceIcon()}
          title={
            <Title
              level={deviceInfo.isMobile ? 4 : 3}
              style={{ color: "#262626", marginBottom: "16px" }}
            >
              Desktop Experience Required
            </Title>
          }
          subTitle={
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Paragraph
                style={{
                  fontSize: deviceInfo.isMobile ? "14px" : "16px",
                  color: "#595959",
                }}
              >
                This business application is optimized for desktop use and
                requires a minimum screen width of <strong>{minWidth}px</strong>
                .
              </Paragraph>

              {/* Device Info Alert */}
              <Alert
                message={
                  <Space>
                    <InfoCircleOutlined />
                    <span>Device Information</span>
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Text>
                      <strong>Device:</strong> {deviceInfo.deviceType}
                    </Text>
                    <Text>
                      <strong>Screen Size:</strong> {deviceInfo.width} ×{" "}
                      {deviceInfo.height}px
                    </Text>
                    <Text>
                      <strong>Orientation:</strong> {deviceInfo.orientation}
                    </Text>
                  </Space>
                }
                type="info"
                showIcon={false}
                style={{ textAlign: "left", fontSize: "12px" }}
              />

              {/* Instructions */}
              <div
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <DesktopOutlined style={{ color: "#52c41a" }} />
                    <Text strong style={{ color: "#389e0d" }}>
                      How to Access:
                    </Text>
                  </div>
                  {getInstructions()}
                </Space>
              </div>

              {/* Refresh Button for Mobile */}
              {deviceInfo.isMobile && (
                <Button
                  type="primary"
                  icon={<RotateRightOutlined />}
                  onClick={() => window.location.reload()}
                  style={{ marginTop: "10px" }}
                >
                  Check Again
                </Button>
              )}

              <Paragraph
                style={{
                  fontSize: "11px",
                  color: "#bfbfbf",
                  marginTop: "20px",
                }}
              >
                This ensures optimal performance and user experience across all
                system features.
              </Paragraph>
            </Space>
          }
        />
      </div>
    </div>
  );
}
