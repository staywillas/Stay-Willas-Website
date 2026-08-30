import type { NextConfig } from "next";

const isProduction = process.env.VERCEL_ENV === "production" || !process.env.VERCEL_ENV;
const defaultRobotsHeader = isProduction
  ? "index, follow, max-image-preview:large"
  : "noindex, nofollow";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    minimumCacheTTL: 31536000, // 1 year cache for immutable villa images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@clerk/nextjs', 'date-fns', 'swiper'],
  },
  redirects: async () => [
    {
      source: '/villa/angled-house',
      destination: '/villa/the-angle-house',
      permanent: true,
    },
    {
      source: '/villa/the-angled-house',
      destination: '/villa/the-angle-house',
      permanent: true,
    },
    {
      source: '/villa/lonavala-anglehouse',
      destination: '/villa/the-angle-house',
      permanent: true,
    },
    {
      source: '/villa/lonavala-estate',
      destination: '/villa/the-angle-house',
      permanent: true,
    },
    {
      source: '/villa/khopoli-canopy-crest',
      destination: '/villa/canopy-crest',
      permanent: true,
    },
    {
      source: '/villa/skytaj-villa',
      destination: '/villas',
      permanent: true,
    },
    {
      source: '/villa/karjat-heritage',
      destination: '/villas',
      permanent: true,
    },
    {
      source: '/lonavala-glass-house-staycation',
      destination: '/villas-in-lonavala-with-private-pool',
      permanent: true,
    },
    {
      source: '/khopoli-group-estate',
      destination: '/khopoli-villas',
      permanent: true,
    },
    {
      source: '/areas/alibaug',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/areas/igatpuri',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/areas/goa',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/areas/karjat',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/alibaug',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/igatpuri',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/goa',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/karjat',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/alibaug-villas',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/villas-in-alibaug',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/villas-in-goa',
      destination: '/areas',
      permanent: true,
    },
    {
      source: '/villas-in-igatpuri',
      destination: '/areas',
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Robots-Tag', value: defaultRobotsHeader },
      ],
    },
    {
      source: '/assets/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/admin/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
    {
      source: '/dashboard/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
    {
      source: '/homeowner/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
    {
      source: '/login/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
    {
      source: '/booking/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
    {
      source: '/api/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
  ],
};

export default nextConfig;
