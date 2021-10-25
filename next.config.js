module.exports = {
  async redirects() {
    return [
      {
        source: '/integrations',
        destination: '/resources',
        // TODO: is this permanent?
        permanent: true,
      },
      {
        source: '/wp-content/:path*/:slug',
        destination: 'https://assets.ujet.cx/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
  images: {
    domains: ['assets.ujet.cx'],
  },
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  }
};
