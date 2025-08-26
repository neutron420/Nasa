import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'mars.jpl.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mars.jpl.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'mars.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mars.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-assets.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'epic.gsfc.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.nasa.gov',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
