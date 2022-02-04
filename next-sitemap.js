const excludedPages = require("./data/excludedPages.json");

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ujet.cx",
  exclude: excludedPages
};
