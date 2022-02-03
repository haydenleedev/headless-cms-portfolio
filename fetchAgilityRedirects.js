const agility = require("@agility/content-fetch");
const fs = require("fs");
require('dotenv').config();

const api = agility.getApi({
  guid: process.env.AGILITY_GUID,
  apiKey: process.env.AGILITY_API_FETCH_KEY,
});

const getAgilityRedirects = () => {
  return api.getUrlRedirections({ lastAccessDate: null });
};

const writeAgilityRedirects = async () => {
    const redirects = [];
    await getAgilityRedirects().then((agilityRedirects) => {
        agilityRedirects.items.forEach((item) => {
            let destination;
            if (item.destinationUrl.includes("~/")) {
                destination = item.destinationUrl.split("~")[1];
            }
            else {
                destination = item.destinationUrl;
            }
            redirects.push({
                source: item.originUrl.split("~")[1],
                destination: destination,
                permanent: item.statusCode == 301,
            });
        });
        fs.writeFile(
            "./data/agilityRedirects.json",
            JSON.stringify(redirects),
            (err) => {
                if (err) throw err;
                console.info("Agility redirects written to file");
            }
        );
    });
}

writeAgilityRedirects();
