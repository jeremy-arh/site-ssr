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
  // Exclure les anciens fichiers src/pages/ du build
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/.*$/,
        contextRegExp: /src\/pages$/,
      })
    );
    return config;
  },
}

export default nextConfig

