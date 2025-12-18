/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['imagedelivery.net'],
    formats: ['image/webp', 'image/avif'],
  },
  // Conserver les routes exactes
  async rewrites() {
    return [];
  },
  // Optimisations
  compress: true,
  poweredByHeader: false,
  // Support des fichiers statiques
  trailingSlash: false,
  // Exclure not-found du prerendering
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig

