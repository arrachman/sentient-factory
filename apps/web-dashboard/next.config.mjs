/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove basePath for direct root access
  basePath: "",

  // Remove asset prefix
  assetPrefix: "",

  // Standalone output for Docker deployment
  output: "standalone",
};

export default nextConfig;
