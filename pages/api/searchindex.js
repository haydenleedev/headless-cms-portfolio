import agility from "@agility/content-fetch";
import { getDynamicPageURL } from "@agility/nextjs/node";
import algoliasearch from "algoliasearch";
import { boolean } from "../../utils/validation";

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
  const index = algoliaClient.initIndex("dev_ujet");
  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    apiKey: process.env.AGILITY_API_FETCH_KEY,
    isPreview: false,
  });
  const type = Object.keys(req.body).find(
    (key) => key === "pageID" || key === "referenceName"
  );

  const headingRegex = /<\/?h[1-6][\s\S]*<\/h[1-6]>/g;

  // resolve the category for a content type by it's referencename
  const resolveCategory = (referenceName) => {
    switch (referenceName) {
      case "pressreleasearticle":
        return "Press Release";
      case "ebooks":
        return "e-Book";
      case "guides":
        return "Guide";
      case "webinars":
        return "Webinar";
      case "whitepapers":
        return "White Paper";
      case "integrations":
        return "Product Datasheet";
      case "reports":
        return "Report";
      case "blogposts":
        return "Blog";
      default:
        return referenceName;
    }
  };

  /* 
  |
  | normalizers for normalizing agility data for algolia indexing
  |
  */
  function normalizePage(page, path) {
    // meta keywords in AgilityCMS can be used to add tags to pages
    const metaKeywords =
      page.seo.metaKeywords.split(" ").length > 0
        ? page.seo.metaKeywords.split(" ")
        : [];
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
      objectID: page.pageID + "p", // p for preventing duplicates with contentIDs
      title: page.title,
      description:
        overrideSEOData?.item.fields?.metaDescription ||
        page.seo.metaDescription,
      headings: getHeadings(page.zones.MainContentZone),
      _tags: ["UJET", ...metaKeywords],
      path,
    };
    normalized["_tags"] = normalized["_tags"].filter((tag) => tag.length > 0);
    return normalized;
  }

  function normalizeBlogPost(post, path) {
    const categories = post.fields.categories.map((categoryObject) => {
      return categoryObject.title;
    });
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
      _tags: [resolveCategory(post.properties.referenceName), ...categories],
      path,
    };
    return normalized;
  }

  function normalizePressReleaseArticle(content, path) {
    function getHeadings() {
      let headings = [];
      const foundHeadings = content.fields?.text?.match?.(headingRegex);
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
      objectID: content.contentID,
      title: content.fields.title,
      description:
        content.fields.metaDescription || content.fields.ogDescription,
      headings: getHeadings(),
      _tags: [resolveCategory(content.properties.referenceName)],
      path,
    };
    return normalized;
  }

  function normalizeResource(content, path) {
    function getHeadings() {
      let headings = [];
      const foundHeadings = content.fields?.text?.match?.(headingRegex);
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
      objectID: content.contentID,
      title: content.fields.title,
      description:
        content.fields.metaDescription || content.fields.ogDescription,
      headings: getHeadings(),
      _tags: ["Resources", resolveCategory(content.properties.referenceName)],
      path,
    };
    return normalized;
  }

  // update handlers
  async function pageUpdate(pageID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await index.deleteObject(pageID + "p");
      return;
    }
    const pageData = await api.getPage({
      pageID: parseInt(pageID),
      languageCode: "en-us",
      expandAllContentLinks: true,
    });

    // the word "nosearchindex" in meta keywords is used to exclude a page from adding it to the search index.
    // if "nosearchindex" is present, stop execution.
    if (
      pageData.seo.metaKeywords
        .split(" ")
        .find((keyword) => keyword === "nosearchindex")
    ) {
      await index.deleteObject(pageID + "p");
      return;
    }
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
    await index.saveObject(normalizePageObject);
  }

  async function blogPostUpdate(contentID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await index.deleteObject(contentID);
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
    await index.saveObject(normalizeBlogPostObject);
  }

  async function pressReleaseUpdate(contentID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await index.deleteObject(contentID);
      return;
    }
    const articleData = await api.getContentItem({
      contentID: parseInt(contentID),
      languageCode: "en-us",
      expandAllContentLinks: true,
    });
    const path = await getDynamicPageURL({
      contentID: parseInt(contentID),
      preview: false,
    });
    const normalizePressReleaseObject = normalizePressReleaseArticle(
      articleData,
      path
    );
    await index.saveObject(normalizePressReleaseObject);
  }

  async function resourceUpdate(contentID, state) {
    // if page has been deleted or unpublished, remove it from algolia index
    if (state === "Deleted") {
      await index.deleteObject(contentID);
      return;
    }
    const resourceData = await api.getContentItem({
      contentID: parseInt(contentID),
      languageCode: "en-us",
      expandAllContentLinks: true,
    });

    if (boolean(resourceData.fields?.excludefromSearchIndex)) {
      await index.deleteObject(contentID);
      return;
    }

    const path = await getDynamicPageURL({
      contentID: parseInt(contentID),
      preview: false,
    });
    const normalizeResourceObject = normalizeResource(resourceData, path);
    await index.saveObject(normalizeResourceObject);
  }

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
        case "pressreleasearticle": {
          pressReleaseUpdate(req.body.contentID, req.body.state);
          break;
        }
        case "ebooks": {
          resourceUpdate(req.body.contentID, req.body.state);
          break;
        }
        case "guides": {
          resourceUpdate(req.body.contentID, req.body.state);
          break;
        }
        case "integrations": {
          resourceUpdate(req.body.contentID, req.body.state);
          break;
        }
        case "webinars": {
          resourceUpdate(req.body.contentID, req.body.state);
          break;
        }
        case "whitepapers": {
          resourceUpdate(req.body.contentID, req.body.state);
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
