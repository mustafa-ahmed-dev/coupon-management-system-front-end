"use client";

import { useState } from "react";
import { Layout as AntdLayout } from "antd";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Content } from "./Content";
import { Footer } from "./Footer";

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

  // Handle sidebar collapse toggle
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AntdLayout style={{ minHeight: "100vh" }}>
      {/* Sidebar - Responsive */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout Container */}
      <AntdLayout>
        {/* Header */}
        <Header collapsed={collapsed} onToggleCollapse={toggleCollapse} />

        {/* Main Content */}
        <Content showBreadcrumb={showBreadcrumb}>{children}</Content>

        {/* Footer */}
        {showFooter && <Footer />}
      </AntdLayout>
    </AntdLayout>
  );
}
