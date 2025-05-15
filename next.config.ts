import type { NextConfig } from 'next';
import { version } from 'next/package.json';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    version,
  },
};

export default nextConfig;
