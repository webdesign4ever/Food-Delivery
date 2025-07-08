import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        // protocol: 'http',
        hostname: 'images.unsplash.com',
        // port: '',
        // pathname: '/**',
      },
    ]
  },
};

export default nextConfig;
