/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  images: {
    domains: [],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  async rewrites() {
    return [
      // support for dynamic product routes
      {
        source: '/product/:id',
        destination: '/product/[id]',
      },
    ];
  },
};

module.exports = nextConfig;
