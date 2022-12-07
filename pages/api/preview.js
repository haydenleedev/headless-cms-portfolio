import agility from "@agility/content-fetch";
import { validatePreview, getDynamicPageURL } from "@agility/nextjs/node";

// A simple example for testing it manually from your browser.
// If this is located at pages/api/preview.js, then
// open /api/preview from your browser.
export default async (req, res) => {
  //validate our preview key, also validate the requested page to preview exists
  const validationResp = await validatePreview({
    agilityPreviewKey: req.query.agilitypreviewkey,
    slug: req.query.slug,
  });

  if (validationResp.error) {
    return res.status(401).end(`${validationResp.message}`);
  }

  const api = agility.getApi({
    guid: process.env.AGILITY_GUID,
    /* apiKey: process.env.AGILITY_API_FETCH_KEY, */
    isPreview: true,
    apiKey: process.env.AGILITY_API_PREVIEW_KEY,
  });

  let previewUrl = req.query.slug;
  let referer = req.headers.referer;
  let queryString;
  if (
    referer &&
    referer.includes("?") &&
    !referer.includes("?lang=") &&
    !referer.includes("?ContentID=")
  ) {
    queryString = referer.substring(
      referer.indexOf("?"),
      referer.indexOf("&lang=")
    );
    previewUrl += queryString;
  }

  //TODO: these kinds of dynamic links should work by default (even outside of preview)
  if (req.query.ContentID) {
    if (req.query.slug.includes("/resources/")) {
      // Use the resource item's slug for the preview URL
      // This is to make previews work correctly for resource items that also have separate pages with corresponding slugs (e.g. webinars)
      const resourceItem = await api.getContentItem({
        contentID: req.query.ContentID,
        languageCode: "en-us",
      });
      previewUrl = `${req.query.slug.split(/\/(?=[^\/]+$)/)[0]}/${
        resourceItem.fields.slug
      }`;
    } else {
      const dynamicPath = await getDynamicPageURL({
        contentID: req.query.ContentID,
        preview: true,
        slug: req.query.slug,
      });
      if (dynamicPath) {
        previewUrl = dynamicPath;
      }
    }
  }

  //enable preview mode
  res.setPreviewData({});

  // Redirect to the slug
  //Add a dummy querystring to the location header - since Netlify will keep the QS for the incoming request by default
  res.writeHead(307, {
    Location: `${previewUrl}${queryString ? "&" : "?"}preview=1`,
  });
  res.end();
};
