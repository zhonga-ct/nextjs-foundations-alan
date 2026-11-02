import type { NextConfig } from 'next';

// Use environment variable in production, localhost in development
const blogUrl = process.env.BLOG_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: `${blogUrl}/blog`,
      },
      {
        source: '/blog/:path*',
        destination: `${blogUrl}/blog/:path*`,
      },
      {
        source: '/blog-static/:path+',
        destination: `${blogUrl}/blog-static/:path+`,
      },
    ];
  },
};

export default nextConfig;
