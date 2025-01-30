/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['brmeiuhdtfsmgriaqmxj.supabase.co'],
  },
  experimental: {
    serverActions: true,
  }
};

module.exports = nextConfig;