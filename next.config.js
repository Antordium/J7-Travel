/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    appDir: false
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Optimize for deployment
  compress: true,
  poweredByHeader: false,
  // Handle static file serving
  trailingSlash: false,
  // Webpack configuration for handling Excel files
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig