import type { NextConfig } from 'next';

// Use environment variable in production, localhost in development
const blogUrl = process.env.BLOG_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true, // Enable Instant Navigations
  images: {
    // Allowlist only the quality values the app uses (Next.js 16 defaults to [75])
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    // Full-width srcset candidates: Tailwind sm, md, lg, xl, 2xl + 1920
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    // Smaller-than-viewport candidates (avatars, thumbnails)
    imageSizes: [32, 48, 64, 96, 128, 192, 256],
    formats: ['image/avif', 'image/webp'],
  },
  cacheLife: {
    blog: {
      stale: 3600, // 1 hour
      revalidate: 86400, // 24 hours
      expire: 604800, // 1 week
    },
    products: {
      stale: 300, // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 3600, // 1 hour
    },
    social: {
      stale: 60, // 1 minute
      revalidate: 300, // 5 minutes
      expire: 600, // 10 minutes
    },
  },
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
