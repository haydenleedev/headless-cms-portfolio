const fs = require("fs");
const agility = require("@agility/content-fetch");
require("dotenv").config();
const redirects = require("./data/redirects.json");
const agilityRedirects = require("./data/agilityRedirects.json");

const api = agility.getApi({
  guid: process.env.AGILITY_GUID,
  apiKey: process.env.AGILITY_API_FETCH_KEY,
});

const getExcludedPages = async () => {
  const excludedPages = [];
  // Get sitemap exclusions from Agility content list
  const languageCode = "en-us";
  const referenceName = "sitemapexclusions_sitemapexcb35aaa";
  // get total count of  to determine how many calls we need to get all pages
  let initial = await api.getContentList({
    referenceName,
    languageCode,
    take: 1,
  });

  let totalCount = initial.totalCount;
  let skip = 0;
  let promisedPages = [...Array(Math.ceil(totalCount / 50)).keys()].map(
    (call) => {
      let pagePromise = api.getContentList({
        referenceName,
        languageCode,
        take: 50, // 50 is max value for take parameter
        skip,
      });
      skip += 50;
      return pagePromise;
    }
  );
  promisedPages = await Promise.all(promisedPages);
  let contentList = [];
  promisedPages.map((result) => {
    contentList = [...contentList, ...result.items];
  });
  promisedPages[0].items.forEach((page) => {
    excludedPages.push(page.fields.path);
  });

  // Exclude redirect sources
  agilityRedirects.forEach((redirect) => {
    if (!excludedPages.includes(redirect.source)) {
      excludedPages.push(redirect.source);
    }
  });
  redirects.forEach((redirect) => {
    if (!excludedPages.includes(redirect.source)) {
      excludedPages.push(redirect.source);
    }
  });
  const allPages = await api.getSitemapFlat({
    channelName: "website",
    languageCode: "en-us",
  });
  Object.keys(allPages).forEach((key) => {
    if (
      allPages[key].path.match(/\/resources\/videos-thank-you/) ||
      (!allPages[key].visible.sitemap &&
        !excludedPages.includes(allPages[key].path) &&
        // Always display blog posts, press releases, integrations and resources (except thank you videos) in the sitemap
        !allPages[key].path.match(
          /\/blog\/|\/press-releases\/|\/resources\/|\/integrations\//
        ))
    ) {
      excludedPages.push(allPages[key].path);
    }
  });
  fs.writeFile(
    "./data/excludedPages.json",
    JSON.stringify(excludedPages),
    (err) => {
      if (err) throw err;
      console.info("Pages to be excluded from sitemap written to file");
    }
  );
};

getExcludedPages();
