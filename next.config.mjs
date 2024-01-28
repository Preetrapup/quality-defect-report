/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  basePath: '/quality-defect-report',
  assetPrefix: '/quality-defect-report',
};

export default nextConfig;
