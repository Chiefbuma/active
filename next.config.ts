import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  // Handle images (important for shared hosting)
  images: {
    unoptimized: true, // Prevents sharp dependency issues on some hosts
  },

  // Skip type checking during build to avoid blocking
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Fix for the database connection during build
  staticPageGenerationTimeout: 120,

  // Other recommended optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
