/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1'], // Allow images from Medusa backend
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add script and content security policy configuration for Spline
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; style-src-elem 'self' 'unsafe-inline' https://unpkg.com; connect-src 'self' https://prod.spline.design http://localhost:9000 https://localhost:9000; frame-src 'self' https://my.spline.design https://prod.spline.design; img-src 'self' data: https://localhost:* http://localhost:* https://prod.spline.design http://127.0.0.1:* https:// http://"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 