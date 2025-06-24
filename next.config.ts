import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ['app', 'components', 'data', 'types', '__tests__']
  }
};

export default nextConfig;
