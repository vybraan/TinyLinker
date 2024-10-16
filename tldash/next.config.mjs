/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true, 
  },
  images: {
    remotePatterns:[
       {
        protocol: 'https',
        hostname: 'google.com',
        port: '',
        pathname: '/*'
      },     
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/*'
      },
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        port: '',
        pathname: '/**'
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/:path*', // Proxy to / for authentication checks
      },
    ];
  },
};

export default nextConfig;
