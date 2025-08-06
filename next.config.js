/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // 确保TypeScript路径映射正确工作
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 