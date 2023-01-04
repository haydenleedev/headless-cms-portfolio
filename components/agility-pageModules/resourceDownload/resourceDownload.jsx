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
      {
        <ResourceDownloadContent
          dynamicPageItem={resourceDownload}
          customData={sanitizedHtml}
        />
      }
    </>
  );
};

ResourceDownload.getCustomInitialProps = async function ({
  dynamicPageItem,
  agility,
  languageCode,
}) {
  const api = agility;

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  const sanitizedHtml = dynamicPageItem.fields.text
    ? convertUJETLinksToHttps(cleanHtml(dynamicPageItem.fields.text))
    : null;

  return {
    sanitizedHtml,
  };
};

export default ResourceDownload;
