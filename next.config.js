/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { i18n } = require("./i18n.config");
const withTM = require("next-transpile-modules")([
  "@renec-foundation/wallet-adapter-react",
]);

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = withTM(nextConfig);
