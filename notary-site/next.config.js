/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Formats optimisés : AVIF en priorité (30% plus léger que WebP)
    formats: ['image/avif', 'image/webp'],
    // Cache des images optimisées : 1 an
    minimumCacheTTL: 31536000,
    // Tailles d'images générées automatiquement par Next.js
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Qualité par défaut pour les images optimisées
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Domaines autorisés pour les images distantes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jlizwheftlnhoifbqeex.supabase.co',
        pathname: '/**',
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
      {
        // Images optimisées par Next.js Image Optimization
        source: '/_next/image/:path*',
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
