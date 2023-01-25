const { default: next } = require('next');
const isProd = process.env.NODE_ENV === 'production'


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  assetPrefix: isProd ? '/runout' : undefined,
}


module.exports = nextConfig
