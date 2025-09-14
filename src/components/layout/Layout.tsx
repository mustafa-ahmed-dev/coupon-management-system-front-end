"use client";

import { useState, useEffect } from "react";
import { Layout as AntdLayout, Grid } from "antd";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Content } from "./Content";
import { Footer } from "./Footer";

const { useBreakpoint } = Grid;

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  showFooter?: boolean;
}

export function Layout({
  children,
  showBreadcrumb = true,
  showFooter = true,
}: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screens = useBreakpoint();

  // Determine if we're on mobile
  const isMobile = !screens.lg;

  // Handle responsive behavior
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true); // Always collapsed on mobile
      setMobileMenuOpen(false); // Close mobile menu when switching to mobile
    } else {
      setMobileMenuOpen(false); // Close mobile drawer when switching to desktop
    }
  }, [isMobile]);

  // Handle sidebar collapse toggle
  const toggleCollapse = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Handle mobile breakpoint changes
  const handleBreakpoint = (broken: boolean) => {
    if (broken) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <AntdLayout style={{ minHeight: "100vh" }}>
      {/* Sidebar - Responsive */}
      <Sidebar
        collapsed={isMobile ? mobileMenuOpen : collapsed}
        isMobile={isMobile}
        onBreakpoint={handleBreakpoint}
      />

      {/* Main Layout Container */}
      <AntdLayout>
        {/* Header */}
        <Header
          collapsed={isMobile ? mobileMenuOpen : collapsed}
          onToggleCollapse={toggleCollapse}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <Content showBreadcrumb={showBreadcrumb} isMobile={isMobile}>
          {children}
        </Content>

        {/* Footer */}
        {showFooter && <Footer isMobile={isMobile} />}
      </AntdLayout>

      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 999,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </AntdLayout>
  );
}
