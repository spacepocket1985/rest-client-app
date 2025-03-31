// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'futuramaapi.com',
        port: '',
        pathname: '/static/**',
      },
    ],
  },
  distDir: './dist',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

// export default nextConfig;
export default withNextIntl(nextConfig);
