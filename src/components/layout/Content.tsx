"use client";

import { Layout } from "antd";
import { Breadcrumb } from "./Breadcrumb";

const { Content: LayoutContent } = Layout;

interface ContentProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  isMobile?: boolean;
}

export function Content({
  children,
  showBreadcrumb = true,
  isMobile = false,
}: ContentProps) {
  return (
    <LayoutContent
      style={{
        margin: 24,
        padding: isMobile ? 16 : 24,
        background: "#fff",
        borderRadius: 8,
        minHeight: "calc(100vh - 112px)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.02)",
      }}
    >
      {showBreadcrumb && <Breadcrumb />}

      <div
        style={{
          marginTop: showBreadcrumb ? 8 : 0,
        }}
      >
        {children}
      </div>
    </LayoutContent>
  );
}
