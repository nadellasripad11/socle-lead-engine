/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Type checking is handled separately
    tsconfigPath: './tsconfig.json'
  }
}

module.exports = nextConfig
