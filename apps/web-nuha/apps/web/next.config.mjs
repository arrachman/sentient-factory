import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep tracing inside this app so the monorepo root lockfile is not picked up.
  outputFileTracingRoot: APP_ROOT,
  async rewrites() {
    const apiUrl = process.env.NUHA_API_URL ?? 'http://localhost:3228';
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
