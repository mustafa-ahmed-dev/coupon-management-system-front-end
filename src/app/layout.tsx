import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { ScreenWidthGuard } from "@/components/guards/ScreenWidthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coupon Management System",
  description: "Manage coupon requests, approvals, and user access",
  keywords: ["coupon", "management", "admin", "business"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScreenWidthGuard minWidth={950}>
          <Providers>{children}</Providers>
        </ScreenWidthGuard>
      </body>
    </html>
  );
}
