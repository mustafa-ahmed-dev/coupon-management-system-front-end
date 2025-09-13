import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Optimize CSS-in-JS (Ant Design uses this)
    optimizePackageImports: ["antd", "@ant-design/icons"],
  },

  // Transpile packages that need it
  transpilePackages: ["antd", "@ant-design/charts", "@ant-design/icons"],

  // Image optimization settings (minimal setup)
  images: {
    remotePatterns: [
      // Add patterns here when you actually need them
      // Example for future use:
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3001',
      //   pathname: '/uploads/**',
      // },
    ],
  },

  // Webpack configuration for better bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize Ant Design bundle size
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            antd: {
              name: "antd",
              chunks: "all",
              test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
              priority: 20,
            },
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },

  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Headers for security and CORS (if needed)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
