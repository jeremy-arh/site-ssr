/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 an de cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: 'jlizwheftlnhoifbqeex.supabase.co',
      },
    ],
  },
  // Optimisations
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  
  // Headers de cache pour les assets statiques
  async headers() {
    return [
      {
        // Images, SVG, fonts
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // JS et CSS (avec hash dans le nom)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Exclure not-found du prerendering
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
}

export default nextConfig
