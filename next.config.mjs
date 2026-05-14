/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev stability: prevent stale chunk reuse between build and dev
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 100,
        ignored: ['**/node_modules/**', '**/.git/**', '**/data/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
