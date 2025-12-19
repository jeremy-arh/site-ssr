/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // EXPERIMENTAL: Optimisation CSS critique avec Critters
  // Extrait le CSS above-the-fold et l'inline dans le HTML
  experimental: {
    optimizeCss: true,
  },
  
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
  
  // Webpack optimisations pour différer le chargement des chunks
  webpack: (config, { isServer, dev }) => {
    // Optimiser les modules externes
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Optimiser le code splitting pour différer les chunks non critiques
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Chunk framework (React, Next.js) - chargé en priorité
              framework: {
                name: 'framework',
                test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
                priority: 40,
                enforce: true,
              },
              // Chunk libs - peut être différé
              lib: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                  return `lib-${packageName?.replace('@', '')}`;
                },
                priority: 30,
                minChunks: 1,
                reuseExistingChunk: true,
              },
              // Chunks communs - différés
              commons: {
                name: 'commons',
                minChunks: 2,
                priority: 20,
                reuseExistingChunk: true,
              },
              // Chunks par défaut
              default: {
                minChunks: 2,
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    }
    
    return config;
  },
  
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
