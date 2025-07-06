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
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      components: path.resolve(__dirname, "src/components"),
      ui:         path.resolve(__dirname, "src/components/ui"),
      utils:      path.resolve(__dirname, "src/lib/utils"),
      lib:        path.resolve(__dirname, "src/lib"),
      hooks:      path.resolve(__dirname, "src/hooks"),
      types:      path.resolve(__dirname, "src/types"),
    };
    return config;
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
