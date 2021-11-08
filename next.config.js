module.exports = {
  async redirects() {
    return [
      {
        source: "/integrations",
        destination: "/resources",
        // TODO: is this permanent?
        permanent: true,
      },
      {
        source: "/wp-content/:path*/:slug",
        destination: "https://assets.ujet.cx/:slug", // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
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
  },
};
