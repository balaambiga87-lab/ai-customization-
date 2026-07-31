import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Decoupled API requests proxying if required, otherwise standard CORS is handled
};

export default nextConfig;
