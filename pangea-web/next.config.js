/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require('path');
const nextBuildId = require('next-build-id');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.cache = false;
    config.resolve.fallback = { fs: false, path: false };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  //concurrentFeatures: true, // disabled in #284
  staticPageGenerationTimeout: 90,
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  swcMinify: true,
  transpilePackages: ['mui-tel-input'],
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
      preventFullImport: true,
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
      preventFullImport: true,
    },
    lodash: { transform: 'lodash/{{member}}', preventFullImport: true },
    'components/?(((\\w*)?/?)*)': {
      transform: 'components/{{matches.[1]}}/{{member}}',
      skipDefaultConversion: true,
    },
  },
  async headers() {
    return [
      {
        source: '/fonts/:fontname',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://js.stripe.com',
          },
        ],
      },
    ];
  },

  // Use a consistent, git-based build id for the Next.js app
  // For further detials, see link below.
  // https://github.com/nexdrew/next-build-id
  generateBuildId: () => nextBuildId({ dir: __dirname }),
};

module.exports = withBundleAnalyzer(nextConfig);
