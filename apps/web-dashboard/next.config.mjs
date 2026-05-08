/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker deployment
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/app/overview',
        has: [
          {
            type: 'query',
            key: 'domain',
            value: 'm1',
          },
          {
            type: 'query',
            key: 'period',
            value: 'all',
          },
          {
            type: 'query',
            key: 'groupBy',
            value: 'sumber',
          },
          {
            type: 'query',
            key: 'sortBy',
            value: 'id',
          },
          {
            type: 'query',
            key: 'metricView',
            value: 'totalMetric',
          },
        ],
        destination: '/app/overview',
        permanent: true,
      },
    ];
  },
};

const defaultDevOrigins = [
  '192.168.1.150',
  '192.168.1.150:3201',
  'localhost',
  'localhost:3201',
  '127.0.0.1',
  '127.0.0.1:3201',
];

const envDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedDevOrigins = Array.from(
  new Set([...defaultDevOrigins, ...envDevOrigins, 'sentient.fr-labs.my.id'])
);

if (allowedDevOrigins.length > 0) {
  nextConfig.allowedDevOrigins = allowedDevOrigins;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
if (basePath && basePath !== '/') {
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
}

export default nextConfig;
