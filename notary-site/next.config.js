/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 an de cache pour les images optimisées
  },
  // Conserver les routes exactes
  async rewrites() {
    return [];
  },
  // Optimisations de performance
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  
  // Cibler les navigateurs modernes uniquement (évite les polyfills inutiles)
  transpilePackages: [],
  
  // Headers de cache optimisés
  async headers() {
    return [
      {
        // Images statiques - cache 1 an
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Assets statiques
        source: '/:path*.svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Fonts
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Expérimental: optimisation du bundle
  experimental: {
    optimizePackageImports: ['@iconify/react'],
  },
}

export default nextConfig

