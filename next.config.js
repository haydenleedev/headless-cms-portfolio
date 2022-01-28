const agility = require("@agility/content-fetch");
const redirects = require("./data/redirects.json");

const api = agility.getApi({
  guid: process.env.AGILITY_GUID,
  apiKey: process.env.AGILITY_API_FETCH_KEY,
});

const getAgilityRedirects = () => {
  return api.getUrlRedirections({ lastAccessDate: null });
};

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
    await getAgilityRedirects().then((agilityRedirects) => {
      agilityRedirects.items.forEach((item) => {
        redirects.push({
          source: item.originUrl.split("~")[1],
          destination: item.destinationUrl.split("~")[1],
          permanent: item.statusCode == 301,
        });
      });
    });
    return (
      redirects +
      [
        {
          source: "/partner-referral",
          destination: "https://info.ujet.co/channel-opportunity-request.html",
          permanent: true,
        },
      ]
    );
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
