const redirects = require("./data/redirects.json")

module.exports = {
  rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "blog.ujet.co",
            },
          ],
          destination: "/blog/:path*",
        },
      ],
    };
  },
  async redirects() {
    return redirects;
  },
  images: {
    domains: ["assets.ujet.cx"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  }
};
