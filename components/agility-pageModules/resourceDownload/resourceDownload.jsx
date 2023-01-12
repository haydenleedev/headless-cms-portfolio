import {
  convertUJETLinksToHttps,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import ResourceDownloadContent from "./resourceDownloadContent";
import dynamic from "next/dynamic";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import Script from "next/script";
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";
const Media = dynamic(() => import("../media"));
const AgilityLink = dynamic(() => import("../../agilityLink"));

const ResourceDownload = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml } = customData;
  const resourceDownload = dynamicPageItem;
  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");
  const { campaignScriptIDRef } = useContext(GlobalContext);
  const { rootPath } = customData;

  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";

  useEffect(() => {
    campaignScriptIDRef.current = resourceDownload.campaignTrackingID;
  }, []);

  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: resourceDownload.title,
            image: resourceDownload?.image?.url,
            keywords: dynamicPageItem.properties.referenceName,
            wordcount: articleText?.split(" ").length,
            url: resourceDownload.oGUrl,
            datePublished: resourceDownload.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: resourceDownload.date,
            description: resourceDownload.metaDescription,
            articleBody: articleText,
          }),
        ]}
      />
      <Script
        id="google-optimize"
        src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
        strategy="lazyOnload"
      />
      {console.log("rootPath: ", rootPath)}
      {
        <section className="section">
          <div className="container">
            <ResourceDownloadContent
              dynamicPageItem={resourceDownload}
              customData={sanitizedHtml}
              rootPath={rootPath}
              isDownloadHeader={true}
            />
          </div>
        </section>
      }
    </>
  );
};

ResourceDownload.getCustomInitialProps = async function ({
  dynamicPageItem,
  agility,
  languageCode,
  sitemapNode,
}) {
  const api = agility;
  const sitemap = await api.getSitemapFlat({
    channelName: "website",
    languageCode: languageCode,
  });

  let rootPath = sitemapNode.path.split("/");
  rootPath.pop();
  rootPath = rootPath.join("/") + "/";
  console.log("rootPath22: ", rootPath);

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  const sanitizedHtml = dynamicPageItem.fields.text
    ? convertUJETLinksToHttps(cleanHtml(dynamicPageItem.fields.text))
    : null;

  return {
    sanitizedHtml,
    rootPath: sitemapNode.path,
  };
};

export default ResourceDownload;
