/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker deployment
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/app/dashboard/finance-accounting/:feature',
        destination: '/app/finance-accounting/:feature',
        permanent: true,
      },
      {
        source: '/app/dashboard/finance-accounting',
        destination: '/app/finance-accounting',
        permanent: true,
      },
      {
        source: '/app/dashboard/sales',
        destination: '/app?domain=so',
        permanent: true,
      },
      {
        source: '/app/dashboard/sales/:path*',
        destination: '/app?domain=so',
        permanent: true,
      },
      {
        source: '/app/dashboard/finance/:feature',
        destination: '/app/finance-accounting/:feature',
        permanent: true,
      },
      {
        source: '/app/dashboard/finance',
        has: [
          {
            type: 'query',
            key: 'feature',
            value: '(?<feature>.*)',
          },
        ],
        destination: '/app/finance-accounting/:feature',
        permanent: true,
      },
      {
        source: '/app/dashboard/finance',
        destination: '/app/finance-accounting',
        permanent: true,
      },
    ];
  },
};

const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS || 'sentient.fr-labs.my.id')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedDevOrigins.length > 0) {
  nextConfig.allowedDevOrigins = allowedDevOrigins;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
if (basePath && basePath !== '/') {
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
}

export default nextConfig;
