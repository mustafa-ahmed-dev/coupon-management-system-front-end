"use client";

import { Breadcrumb as AntdBreadcrumb, Space } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  // Generate breadcrumb items based on current path
  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [
      {
        title: "Dashboard",
        path: "/",
        icon: <HomeOutlined />,
      },
    ];

    // Map path segments to breadcrumb items
    const pathMap: Record<string, string> = {
      users: "User Management",
      departments: "Department Management",
      categories: "Category Management",
      coupons: "Coupon Management",
      requests: "Coupon Requests",
      profile: "My Profile",
      settings: "Settings",
      notifications: "Notifications",
      reports: "Reports",
      create: "Create New",
      edit: "Edit",
      view: "View Details",
    };

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Handle dynamic routes (IDs)
      if (/^\d+$/.test(segment)) {
        items.push({
          title: `ID: ${segment}`,
          path: isLast ? undefined : currentPath,
        });
      } else {
        items.push({
          title:
            pathMap[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1),
          path: isLast ? undefined : currentPath,
        });
      }
    });

    return items;
  }, [pathname]);

  // Convert items to Ant Design Breadcrumb format
  const antdBreadcrumbItems = breadcrumbItems.map((item, index) => ({
    key: index,
    title: (
      <Space size="small">
        {item.icon}
        {item.path ? (
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push(item.path!);
            }}
            style={{ cursor: "pointer" }}
          >
            {item.title}
          </a>
        ) : (
          <span>{item.title}</span>
        )}
      </Space>
    ),
  }));

  return (
    <AntdBreadcrumb
      items={antdBreadcrumbItems}
      style={{
        margin: "16px 0",
        fontSize: "14px",
      }}
    />
  );
}
