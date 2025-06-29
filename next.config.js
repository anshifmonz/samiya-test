/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.jdmagicbox.com', 'lovable.dev'],
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
      // Support for dynamic product routes
      {
        source: '/product/:id',
        destination: '/product/[id]',
      },
    ];
  },
};

module.exports = nextConfig;
