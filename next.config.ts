/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  webpack: (config, { isServer }) => {
    return config;
  }
};

module.exports = nextConfig;