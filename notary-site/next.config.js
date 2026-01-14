import { copyLibFiles } from '@builder.io/partytown/utils';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copier les fichiers Partytown vers public/~partytown au build
copyLibFiles(join(__dirname, 'public', '~partytown'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // #region agent log
  reactStrictMode: true,
  // #endregion
  
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
    // Qualités supportées (pour éviter le warning Next.js 16)
    qualities: [70, 75, 80, 85, 90, 95, 100],
    // Permettre les SVG depuis Cloudflare Images (logos Trustpilot)
    dangerouslyAllowSVG: true,
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
  
  // Permettre les requêtes cross-origin en développement (accès depuis le réseau local)
  // #region agent log
  allowedDevOrigins: ['http://192.168.1.146:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  // #endregion
  
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
  
  // Headers de cache pour les assets statiques + CORS pour développement
  async headers() {
    const headers = [
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
    ];

    // #region agent log
    // Ajouter les headers CORS en développement pour permettre les requêtes cross-origin
    if (process.env.NODE_ENV === 'development') {
      headers.push({
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      });
      
      // Log headers configuration
      fetch('http://127.0.0.1:7242/ingest/78d7b241-5350-42b2-b7ed-d93b3b7962a0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'next.config.js:headers',
          message: 'CORS headers added for development',
          data: { nodeEnv: process.env.NODE_ENV, headersCount: headers.length },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'config-check',
          hypothesisId: 'E'
        })
      }).catch(() => {});
    }
    // #endregion

    return headers;
  },
  
  // Exclure not-found du prerendering
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
}

// #region agent log
// Log configuration loading
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  fetch('http://127.0.0.1:7242/ingest/78d7b241-5350-42b2-b7ed-d93b3b7962a0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'next.config.js:157',
      message: 'next.config.js loaded',
      data: {
        hasAllowedDevOrigins: 'allowedDevOrigins' in nextConfig,
        allowedDevOriginsValue: nextConfig.allowedDevOrigins,
        nodeEnv: process.env.NODE_ENV,
        nextVersion: '15.1.0'
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'config-check',
      hypothesisId: 'C'
    })
  }).catch(() => {});
}
// #endregion

export default nextConfig
