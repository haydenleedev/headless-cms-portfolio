module.exports = {
  async redirects() {
    return [
      {
        source: '/test',
        destination: '/blog', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/wp-content/:path*/:slug',
        destination: 'https://assets.ujet.cx/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  }
};
