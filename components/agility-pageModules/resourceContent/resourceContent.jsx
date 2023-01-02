import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import style from "./resourceContent.module.scss";
import { boolean } from "../../../utils/validation";
import {
  convertUJETLinksToHttps,
  resolveCategory,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";
import { useRouter } from "next/router";
import FirstFold from "../firstFold/firstFold";
import EmbedVideo from "../embedVideo/embedVideo";
import Script from "next/script";
import Accordion from "../accordion/accordion";
import dynamic from "next/dynamic";
const PardotForm = dynamic(() => import("../../form/pardotForm"));
const AgilityLink = dynamic(() => import("../../agilityLink"));
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";
import { getUrlParamValue } from "../../../utils/getUrlParamValue";

const ResourceContent = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml, accordionItemsWithSanitizedHTML, formConfiguration } =
    customData;
  const resource = dynamicPageItem.fields;
  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");
  const { asPath } = useRouter();
  const { campaignScriptIDRef } = useContext(GlobalContext);
  let resourceCategory;
  // Integrations are not under /resources/
  if (asPath.includes("/resources/")) {
    resourceCategory = asPath.split("/resources/")[1].split("/")[0];
  } else {
    resourceCategory = asPath.split("/")[1];
  }
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";

  const stepCompletion = resource.stepLink
    ? {
        link: resource.stepLink,
        title: resource?.stepTitle,
        content: resource?.stepContent,
        image: resource?.stepImage,
      }
    : null;

  // Predefine defalut Pardot form handler ID
  const getPardotDefaultFormID = (resourceCategory) => {
    const lowerCaseResourceCategory = String(resourceCategory).toLowerCase();
    if (
      lowerCaseResourceCategory === "videos" ||
      lowerCaseResourceCategory === "webinars"
    ) {
      return "3712";
    } else if (
      lowerCaseResourceCategory === "partnercontent" ||
      lowerCaseResourceCategory === "partner-content"
    ) {
      return "3889";
    } else {
      return "3658";
    }
  };

  // Predefine default Pardot form action value
  const getPardotDefaultAction = (resourceCategory) => {
    const lowerCaseResourceCategory = String(resourceCategory).toLowerCase();
    if (
      lowerCaseResourceCategory === "videos" ||
      lowerCaseResourceCategory === "webinars"
    ) {
      return "https://info.ujet.cx/l/986641/2022-08-05/kgtbn";
    } else if (
      lowerCaseResourceCategory === "partnercontent" ||
      lowerCaseResourceCategory === "partner-content"
    ) {
      return "https://info.ujet.cx/l/986641/2022-10-07/l1pj2";
    } else {
      return "https://info.ujet.cx/l/986641/2022-07-26/kdq1r";
    }
  };

  // Get Asset Type

  let setAssetType;
  let referenceNameValue = dynamicPageItem.properties.referenceName;
  const resourceTypesByNames = [
    { referenceName: "casestudy", type: "Case Study" },
    { referenceName: "ebooks", type: "eBook" },
    { referenceName: "reports", type: "Report" },
    { referenceName: "guides", type: "Guide" },
    { referenceName: "whitepapers", type: "White Paper" },
    { referenceName: "videos", type: "Webinar" },
    { referenceName: "webinars", type: "Webinar" },
    { referenceName: "integrations", type: "Datasheet" },
    { referenceName: "partnercontent", type: "Partner Content" },
    { referenceName: "partner-content", type: "Partner Content" },
  ];

  const getAssetType = () => {
    resourceTypesByNames.map((item) => {
      if (item.referenceName == dynamicPageItem.properties.referenceName) {
        setAssetType = item.type;
      }
    });
    return setAssetType ? setAssetType : null;
  };

  // Set utm_campaign values from the url if the values exist.  If there's no parameters, then get the default values from "resource.uTMCampaignAsset".
  const utmCampaignValue = getUrlParamValue("utm_campaign");

  // Set clp value from the url if the value exist.  If there's no parameters, then get the default values from "resource.currentLeadProgram2".
  const clpValue = getUrlParamValue("clp");

  const setUtmCampaignValue = (url) => {
    if (utmCampaignValue) {
      return utmCampaignValue;
    } else {
      return resource.uTMCampaignAsset ? resource.uTMCampaignAsset : null;
    }
  };
  const setUtmAssetValue = () => {
    if (resource.uTMCampaignAsset) {
      return resource.uTMCampaignAsset;
    } else {
      return null;
    }
  };
  const setClpValue = (url) => {
    if (clpValue) {
      return clpValue;
    } else {
      return resource.currentLeadProgram2 ? resource.currentLeadProgram2 : null;
    }
  };

  useEffect(() => {
    campaignScriptIDRef.current = resource.campaignTrackingID;
  }, []);

  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: resource.title,
            image: resource?.image?.url,
            keywords: dynamicPageItem.properties.referenceName,
            wordcount: articleText?.split(" ").length,
            url: resource.oGUrl,
            datePublished: resource.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: resource.date,
            description: resource.metaDescription,
            articleBody: articleText,
          }),
        ]}
      />
      <Script
        id="google-optimize"
        src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
        strategy="lazyOnload"
      />
      {resource.videoURL ? (
        <>
          <FirstFold
            module={{
              fields: {
                heading: JSON.stringify({
                  type: "h1",
                  color: "text-navy",
                  text: resource.title,
                  classes: "heading-4 mb-2",
                }),
                classes: "pb-0",
                narrowContainer: "true",
              },
            }}
            customData={{ sanitizedHtml: sanitizedHtml }}
          />
          <EmbedVideo
            module={{
              fields: { videoURL: resource.videoURL, classes: "pt-0" },
            }}
            customData={{ sanitizedHtml: sanitizedHtml }}
          />
        </>
      ) : (
        <>
          {boolean(resource.alternateLayout) ? (
            <>
              <section className={style.alternateHeader}>
                <div className={style.alternateHeaderContainer}>
                  <div className={`container ${style.alternateHeaderTitle}`}>
                    <p className={style.category}>
                      {resolveCategory(
                        dynamicPageItem.properties.referenceName
                      )}
                    </p>
                    <span className={style.hr}></span>
                    <h1 className={`${style.title} heading-5`}>
                      {resource.title}
                    </h1>
                  </div>
                  <div className={style.alternateHeaderColumns}>
                    <div className={style.sideColumn}></div>
                    <div className={style.imageColumn}>
                      <AgilityImage
                        src={resource.image.url}
                        data-src={resource.image.url}
                        alt={resource.image.label || ""}
                        width={resource.image.pixelWidth}
                        height={resource.image.pixelHeight}
                        objectFit="cover"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <Breadcrumbs
                breadcrumbs={[
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: resourceCategory.replace(/-/g, " "),
                    path: `/archives?type=resources&categories=${resourceCategory.replace(
                      /-/g,
                      ""
                    )}`,
                  },
                  { name: resource.title },
                ]}
                className={"pt-3 pb-6 mb-5"}
              />
              <section className="section">
                <div className={`container ${style.alternateContent}`}>
                  <div className="columns repeat-2">
                    <div
                      className="content"
                      dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                    />
                    <div
                      className={`bg-skyblue-light  ${style.marketoResource}`}
                    >
                      {/\S/.test(resource.formTitle) && (
                        <h2 className={`${style.formTitle} heading-6`}>
                          {resource.formTitle ||
                            "Fill out the form to download the the resource today!"}
                        </h2>
                      )}
                      <PardotForm
                        formHandlerID={
                          resource.pardotFormID
                            ? resource.pardotFormID
                            : getPardotDefaultFormID(resourceCategory)
                        }
                        action={
                          resource.formAction
                            ? resource.formAction
                            : getPardotDefaultAction(resourceCategory)
                        }
                        submit={
                          resource.formSubmitText
                            ? resource.formSubmitText
                            : "Download Now"
                        }
                        stepsEnabled={resource.formStepsEnabled}
                        config={formConfiguration}
                        assetTitle={resource.title ? resource.title : null}
                        assetType={getAssetType()}
                        utmCampaign={
                          typeof window !== "undefined"
                            ? setUtmCampaignValue(window.location.href)
                            : null
                        }
                        utmAsset={
                          typeof window !== "undefined" && setUtmAssetValue()
                        }
                        clpField={
                          typeof window !== "undefined"
                            ? setClpValue(window.location.href)
                            : null
                        }
                        clsField={resource.currentLeadSource2}
                        stepCompletion={stepCompletion}
                        stepsCompletionRedirectURL={
                          resource.formStepsEnabled
                            ? resource.completionRedirectURL
                              ? resource.completionRedirectURL
                              : "/thank-you-download-guide"
                            : null
                        }
                      />
                    </div>
                  </div>
                </div>
                {resource.link?.text && resource.link?.href && (
                  <div className="container">
                    <p className={style.alternateLink}>
                      <h2 className="heading-6">
                        {resource.footerText
                          ? resource.footerText
                          : "Want to learn more about UJET?"}
                      </h2>
                      <AgilityLink
                        agilityLink={resource.link}
                        className="link ml-2"
                      >
                        {resource.link.text}
                      </AgilityLink>
                    </p>
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <Breadcrumbs
                breadcrumbs={[
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: resourceCategory.replace(/-/g, " "),
                    path: `/archives?type=resources&categories=${resourceCategory.replace(
                      /-/g,
                      ""
                    )}`,
                  },
                  { name: resource.title },
                ]}
              />
              <section className="section">
                <div className="container">
                  <div className={style.columns}>
                    <div className={style.content}>
                      <h1 className="heading-5">{resource.title}</h1>
                      <div
                        className="content mt-4"
                        dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                      />
                    </div>
                    <div
                      className={`${resource.formBackgroundColor} ${style.form} ${style.marketoResource}`}
                    >
                      {/\S/.test(resource.formTitle) && (
                        <h2 className={`${style.formTitle} heading-6`}>
                          {resource.formTitle ||
                            "Fill out the form to download the the resource today!"}
                        </h2>
                      )}
                      <PardotForm
                        formHandlerID={
                          resource.pardotFormID
                            ? resource.pardotFormID
                            : getPardotDefaultFormID(resourceCategory)
                        }
                        action={
                          resource.formAction
                            ? resource.formAction
                            : getPardotDefaultAction(resourceCategory)
                        }
                        submit={
                          resource.formSubmitText
                            ? resource.formSubmitText
                            : "Download Now"
                        }
                        stepsEnabled={resource.formStepsEnabled}
                        config={formConfiguration}
                        assetTitle={resource.title ? resource.title : null}
                        assetType={getAssetType()}
                        utmCampaign={
                          typeof window !== "undefined" &&
                          setUtmCampaignValue(window.location.href)
                        }
                        utmAsset={
                          typeof window !== "undefined" && setUtmAssetValue()
                        }
                        clpField={
                          typeof window !== "undefined" &&
                          setClpValue(window.location.href)
                        }
                        clsField={resource.currentLeadSource2}
                        stepCompletion={stepCompletion}
                      />
                      {resource.link?.href && resource.link?.text && (
                        <div className="mt-4 align-center">
                          <p>
                            {resource.footerText
                              ? resource.footerText
                              : "Want to learn more about UJET?"}
                          </p>
                          <AgilityLink
                            className="text-decoration-underline"
                            agilityLink={resource.link}
                          >
                            {resource.link.text}
                          </AgilityLink>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {accordionItemsWithSanitizedHTML && (
            <Accordion
              customData={{
                itemsWithSanitizedHTML: accordionItemsWithSanitizedHTML,
              }}
            />
          )}
        </>
      )}
    </>
  );
};

ResourceContent.getCustomInitialProps = async function ({
  dynamicPageItem,
  agility,
  languageCode,
}) {
  const api = agility;

  const accordionItemsData = dynamicPageItem.fields.accordionItems
    ?.referencename
    ? await api.getContentList({
        referenceName: dynamicPageItem.fields.accordionItems.referencename,
        languageCode,
      })
    : null;
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const formConfiguration = await api.getContentItem({
    referenceName: "formconfiguration",
    expandAllContentLinks: true,
    languageCode,
    contentLinkDepth: 4,
    contentID: 6018,
  });
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  const accordionItemsWithSanitizedHTML = accordionItemsData?.items
    ? accordionItemsData.items.map((item) => {
        item.fields.html = cleanHtml(item.fields.html);
        return item;
      })
    : null;
  const sanitizedHtml = dynamicPageItem.fields.text
    ? convertUJETLinksToHttps(cleanHtml(dynamicPageItem.fields.text))
    : null;

  return {
    sanitizedHtml,
    accordionItemsWithSanitizedHTML,
    formConfiguration: formConfiguration.fields,
  };
};

export default ResourceContent;
