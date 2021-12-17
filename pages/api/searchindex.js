import agility from "@agility/content-fetch";
import { getDynamicPageURL } from "@agility/nextjs/node";
import algoliasearch from "algoliasearch";

/*
| this endpoint receives webhook events from AgilityCMS and pushes any content updates
| to the Algolia search index to populate data for the search functionality on the site.
*/

export default function handler(req, res) {
  //set up the Agolia client and index
  const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
  const staticPageIndex = algoliaClient.initIndex("pages");
  const resourceIndex = algoliaClient.initIndex("resource");
  const blogIndex = algoliaClient.initIndex("blog");
  const newsroomIndex = algoliaClient.initIndex("newsroom");

  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
    isPreview: false,
  });
  const type = Object.keys(req.body).find(
    (key) => key === "pageID" || key === "referenceName"
  );

  const headingRegex = /<\/?h[1-6][\s\S]*<\/h[1-6]>/g;

  /* 
  |
  | normalizers for normalizing agility data for algolia indexing
  |
  */
  function normalizePage(page, path) {
    const overrideSEOData = page.zones.MainContentZone.find(
      (module) => module.item.properties.definitionName === "OverrideSEO"
    );
    function getHeadings(moduleList) {
      let headings = [];
      moduleList.forEach((module) => {
        const heading = module.item.fields.heading || module.item.fields.title;
        // check if it's the heading custom field object
        if (heading && heading.charAt(0) === "{") {
          const headingObject = JSON.parse(heading);
          if (headingObject.text) headings.push(headingObject.text);
        }
        // find any headings from possible inner content array in the module
        Object.values(module.item.fields).forEach((field) => {
          if (Array.isArray(field)) {
            field.forEach((item) => {
              const heading = item.fields.heading || item.fields.title;
              if (heading && heading.charAt(0) === "{") {
                const headingObject = JSON.parse(heading);
                if (headingObject.text) headings.push(headingObject.text);
              } else {
                if (
                  typeof item.field === "string" &&
                  headingRegex.test(item.field)
                ) {
                  item.field.match(headingRegex).forEach((foundHeading) => {
                    headings.push(foundHeading.split(">")[1].split("</")[0]);
                  });
                }
              }
            });
          } else if (typeof field === "string" && headingRegex.test(field)) {
            field.match(headingRegex).forEach((foundHeading) => {
              headings.push(foundHeading.split(">")[1].split("</")[0]);
            });
          }
        });
      });
      return headings;
    }
    const normalized = {
      objectID: page.pageID,
      title: page.title,
      description:
        overrideSEOData?.item.fields?.metaDescription ||
        page.seo.metaDescription,
      headings: getHeadings(page.zones.MainContentZone),
      path,
    };
    return normalized;
  }

  function normalizeBlogPost(post, path) {
    function getHeadings() {
      let headings = [];
      const foundHeadings = post.fields.content.match(headingRegex);
      if (foundHeadings) {
        foundHeadings.forEach((foundHeading) => {
          headings.push(
            foundHeading
              .split(/<h[1-6][\w\s\d"'-=]*>/)[1]
              .split(/<\/h[1-6][\w\s\d"'-=]*>/)[0]
          );
        });
      }
      return headings;
    }
    const normalized = {
      objectID: post.contentID,
      title: post.fields.title,
      description: post.fields.metaDescription || post.fields.ogDescription,
      headings: getHeadings(),
      path,
    };
    return normalized;
  }

  // update handlers
  async function pageUpdate(pageID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await staticPageIndex.deleteObject(pageID);
      return;
    }
    const pageData = await api.getPage({
      pageID: parseInt(pageID),
      languageCode: "en-us",
      expandAllContentLinks: true,
    });
    const sitemap = await api.getSitemapFlat({
      channelName: "website",
      languageCode: "en-us",
    });
    const sitemapObjectKey = Object.keys(sitemap).find(
      (key) => key.split("/")[key.split("/").length - 1] === pageData.name
    );
    const normalizePageObject = normalizePage(
      pageData,
      sitemap[sitemapObjectKey].path
    );
    await staticPageIndex.saveObject(normalizePageObject);
  }

  async function blogPostUpdate(contentID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await blogIndex.deleteObject(contentID);
      return;
    }
    const postData = await api.getContentItem({
      contentID: parseInt(contentID),
      languageCode: "en-us",
      expandAllContentLinks: true,
    });
    const path = await getDynamicPageURL({
      contentID: parseInt(contentID),
      preview: false,
    });
    const normalizeBlogPostObject = normalizeBlogPost(postData, path);
    await blogIndex.saveObject(normalizeBlogPostObject);
  }

  // TODO: add update logic for press releases and resources

  /*   async function pressReleaseUpdate(contentID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await newsroomIndex.deleteObject(contentID);
      return;
    }
    const postData = await api.getContentItem({
      contentID: parseInt(contentID),
      languageCode: "en-us",
      expandAllContentLinks: true,
    });
    const path = await getDynamicPageURL({
      contentID: parseInt(contentID),
      preview: false,
    });
    const normalizeBlogPostObject = normalizeBlogPost(postData, path);
    await newsroomIndex.saveObject(normalizeBlogPostObject);
  } */

  switch (type) {
    case "pageID": {
      pageUpdate(req.body.pageID, req.body.state);
      break;
    }
    // default to referenceName
    default: {
      switch (req.body.referenceName) {
        case "blogposts": {
          blogPostUpdate(req.body.contentID, req.body.state);
          break;
        }
        case "pressrelease": {
          pressReleaseUpdate(req.body.referenceName);
          break;
        }
        case "ebooks": {
          resourceUpdate(req.body.referenceName);
          break;
        }
        case "guides": {
          resourceUpdate(req.body.referenceName);
          break;
        }
        case "integrations": {
          resourceUpdate(req.body.referenceName);
          break;
        }
        case "webinars": {
          resourceUpdate(req.body.referenceName);
          break;
        }
        case "whitepapers": {
          resourceUpdate(req.body.referenceName);
          break;
        }
        default: {
          res.status(200).end();
          return;
        }
      }
      break;
    }
  }
  res.status(200).end();
}
