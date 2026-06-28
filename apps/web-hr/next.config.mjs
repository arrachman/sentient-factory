import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Internal api-gateway URL (server-side only — not exposed to browser).
// In production set HR_INTERNAL_API_URL to wherever api-gateway is reachable
// from this Next.js process (e.g. http://localhost:3203 on the same host).
const HR_INTERNAL_API_URL =
  process.env.HR_INTERNAL_API_URL ?? 'http://localhost:3203';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Shared workspace package consumed as TS source (web-hr is the first clean adopter).
  transpilePackages: ['@sentient-factory/ui-kit'],
  // Scope Turbopack to this app (monorepo has multiple lockfiles).
  turbopack: { root: __dirname },
  devIndicators: false,

  // Same-origin proxy: browser calls /api/* (auth + /api/hr/*) are forwarded
  // to the shared NestJS api-gateway. web-hr has no app/api routes of its own,
  // so every /api/* path is proxied. Auth uses the platform cookie `sf_token`.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${HR_INTERNAL_API_URL}/api/:path*`,
      },
    ];
  },
};

const PORT = process.env.WEB_HR_PORT || '3221';

const defaultDevOrigins = [
  '192.168.1.150',
  `192.168.1.150:${PORT}`,
  'localhost',
  `localhost:${PORT}`,
  '127.0.0.1',
  `127.0.0.1:${PORT}`,
  'hr.fr-labs.my.id',
];

const envDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedDevOrigins = Array.from(
  new Set([...defaultDevOrigins, ...envDevOrigins]),
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
