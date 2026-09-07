import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep tracing inside this app so the monorepo root lockfile is not picked up.
  outputFileTracingRoot: APP_ROOT,
  async rewrites() {
    const backendUrl = process.env.NUHA_BACKEND_URL ?? 'http://localhost:3228';
    return [{ source: '/api/:path*', destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;
