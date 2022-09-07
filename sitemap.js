const agility = require("@agility/content-fetch");
const fs = require("fs");
const excludedPages = require("./data/excludedPages.json");
require("dotenv").config();

(async () => {
  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
  });

  const getSitemapContentItem = async (contentID) => {
    return await api.getContentItem({
      channelName: "website",
      languageCode: "en-us",
      contentID: contentID,
    });
  };

  const getSitemapPage = async (pageID) => {
    return await api.getPage({
      channelName: "website",
      languageCode: "en-us",
      pageID: pageID,
    });
  };

  const generatePageObjects = async () => {
    const allPages = await api.getSitemapFlat({
      channelName: "website",
      languageCode: "en-us",
    });
    const pages = [];
    // Fetch pages individually to get page modification timestamps (Agility sitemaps do not include them)
    for (let i = 0; i < Object.keys(allPages).length; i++) {
      const pageSlug = Object.keys(allPages)[i];
      if (!excludedPages.includes(pageSlug)) {
        const pageObject = { slug: pageSlug };
        let lastMod;
        let currentPage;
        if (allPages[pageSlug].contentID) {
          currentPage = await getSitemapContentItem(
            allPages[pageSlug].contentID
          );
          lastMod = currentPage?.properties.modified;
        } else if (allPages[pageSlug].pageID) {
          currentPage = await getSitemapPage(allPages[pageSlug].pageID);
          lastMod = currentPage?.properties.modified;
        }
        pageObject.lastModified = lastMod;
        pages.push(pageObject);
      }
    }
    return pages;
  };

  const pages = await generatePageObjects();
  const sectionData = {
    regularPagesSectionData: {
      pageObjects: [],
      lastModified: null,
      xmlData: "",
      xmlFileName: "page_sitemap.xml",
    },
    blogPostPagesSectionData: {
      pageObjects: [],
      lastModified: null,
      xmlData: "",
      xmlFileName: "blog_post_sitemap.xml",
    },
    pressReleasePagesSectionData: {
      pageObjects: [],
      lastModified: null,
      xmlData: "",
      xmlFileName: "press_release_sitemap.xml",
    },
    resourcePagesSectionData: {
      pageObjects: [],
      lastModified: null,
      xmlData: "",
      xmlFileName: "resource_sitemap.xml",
    },
  };

  const updateSectionLastModified = (sectionName, newLastModified) => {
    const sectionObj = sectionData[`${sectionName}PagesSectionData`];
    if (
      !sectionObj.lastModified ||
      new Date(newLastModified) > new Date(sectionObj.lastModified)
    ) {
      sectionObj.lastModified = newLastModified;
    }
  };

  pages.forEach((page) => {
    const pageObject = {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${page.slug}`,
      lastModified: page.lastModified,
    };
    let sectionName;
    if (page.slug.includes("/blog/")) {
      sectionData.blogPostPagesSectionData.pageObjects.push(pageObject);
      sectionName = "blogPost";
    } else if (page.slug.includes("/press-releases/")) {
      sectionData.pressReleasePagesSectionData.pageObjects.push(pageObject);
      sectionName = "pressRelease";
    } else if (page.slug.includes("/resources")) {
      sectionData.resourcePagesSectionData.pageObjects.push(pageObject);
      sectionName = "resource";
    } else {
      sectionData.regularPagesSectionData.pageObjects.push(pageObject);
      sectionName = "regular";
    }
    updateSectionLastModified(sectionName, pageObject.lastModified);
  });

  const addSectionXmlData = (sectionData) => {
    if (sectionData.pageObjects.length > 0) {
      sectionData.xmlData += `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>\n<urldata>\n<urlsettitle>URL</urlsettitle>\n<urlset>\n`;
      sectionData.pageObjects.forEach((page) => {
        sectionData.xmlData += `<url><loc>${page.url}</loc><lastmod>${page.lastModified}</lastmod></url>\n`;
      });
      sectionData.xmlData += "</urlset>\n</urldata>\n";
    }
  };

  try {
    let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>\n<urldata>\n<urlsettitle>Sitemap</urlsettitle>\n<urlset>`;
    const sitemapSections = [
      sectionData.regularPagesSectionData,
      sectionData.blogPostPagesSectionData,
      sectionData.pressReleasePagesSectionData,
      sectionData.resourcePagesSectionData,
    ];
    sitemapSections.forEach((section) => {
      addSectionXmlData(section);
      if (section.xmlData && section.xmlFileName) {
        fs.writeFileSync(`./public/${section.xmlFileName}`, section.xmlData);
        sitemapIndexXml += `<url><loc>${process.env.NEXT_PUBLIC_SITE_URL}/${section.xmlFileName}</loc><lastmod>${section.lastModified}</lastmod></url>\n`;
      }
    });
    sitemapIndexXml += "</urlset>\n</urldata>\n";
    fs.writeFileSync("./public/sitemap_index.xml", sitemapIndexXml || "");
  } catch (error) {
    console.error(error);
  }
})();
