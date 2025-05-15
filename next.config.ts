import type { NextConfig } from 'next';
import packageInfo from 'next/package.json';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    version: packageInfo.version,
  },
};

export default nextConfig;
