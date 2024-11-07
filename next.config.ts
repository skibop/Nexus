/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-image-domain.com',
      },
      {
        protocol: 'https',
        hostname: 'www.chatbase.co',
      },
    ],
  },
}

module.exports = nextConfig
