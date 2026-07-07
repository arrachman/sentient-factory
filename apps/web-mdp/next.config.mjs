import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Internal api-gateway URL (server-side only — not exposed to browser).
// MDP reuses ERP auth + reads ERP masters, so it proxies both /api/erp/* and
// /api/mdp/* to the same NestJS backend.
const MDP_INTERNAL_API_URL =
  process.env.MDP_INTERNAL_API_URL ??
  process.env.ERP_INTERNAL_API_URL ??
  'http://localhost:3203';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: { root: __dirname },
  devIndicators: false,

  async rewrites() {
    return [
      {
        source: '/api/erp/:path*',
        destination: `${MDP_INTERNAL_API_URL}/api/erp/:path*`,
      },
      {
        source: '/api/mdp/:path*',
        destination: `${MDP_INTERNAL_API_URL}/api/mdp/:path*`,
      },
    ];
  },
};

const PORT = process.env.WEB_MDP_PORT || '3220';

const defaultDevOrigins = [
  '192.168.1.150',
  `192.168.1.150:${PORT}`,
  'localhost',
  `localhost:${PORT}`,
  '127.0.0.1',
  `127.0.0.1:${PORT}`,
  'mdp.fr-labs.my.id',
];

const envDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedDevOrigins = Array.from(
  new Set([...defaultDevOrigins, ...envDevOrigins])
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
