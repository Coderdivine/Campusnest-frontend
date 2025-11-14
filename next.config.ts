import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Optimize for Cloudflare Pages
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Disable source maps in production to reduce size
  productionBrowserSourceMaps: false,
  
  // Optimize images
  images: {
    unoptimized: true, // Required for Cloudflare Pages
  },
};

export default nextConfig;
