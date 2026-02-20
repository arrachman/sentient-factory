/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker deployment
  output: 'standalone',
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
