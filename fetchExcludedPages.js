const fs = require("fs");
const agility = require("@agility/content-fetch");
require('dotenv').config();

const api = agility.getApi({
  guid: process.env.AGILITY_GUID,
  apiKey: process.env.AGILITY_API_FETCH_KEY,
});

const getExcludedPages = async () => {
    const allPages = await api.getSitemapFlat({ channelName: "website", languageCode: "en-us" });
    const excludedPages = [];
    Object.keys(allPages).forEach((key) => {
        if (!allPages[key].visible.sitemap) {
            excludedPages.push(allPages[key].path);
        }
    });
    fs.writeFile(
        "./excludedPages.json",
        JSON.stringify(excludedPages),
        (err) => {
            if (err) throw err;
            console.info("Pages to be excluded from sitemap written to file")
        }
    );
}

getExcludedPages();
