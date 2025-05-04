/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optionally ignore TypeScript errors during builds
  typescript: {
    // Only use this if you want to allow builds with TypeScript errors
    ignoreBuildErrors: true,
  },
  // Optionally ignore ESLint errors during builds
  eslint: {
    // Only use this if you want to allow builds with ESLint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

