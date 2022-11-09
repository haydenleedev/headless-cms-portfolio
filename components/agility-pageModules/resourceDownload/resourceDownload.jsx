import {
  convertUJETLinksToHttps,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import dynamic from "next/dynamic";
import style from "./resourceDownload.module.scss";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import { useRouter } from "next/router";
import Script from "next/script";
import { useContext, useEffect } from "react";
import GlobalContext from "../../../context";
import Image from "next/image";
const Media = dynamic(() => import("../media"), { ssr: false });
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });

const ResourceDownload = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml } = customData;
  const resourceDownload = dynamicPageItem.fields;
  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");
  const { asPath } = useRouter();
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
        <>
          {
            <>
              <section className="section">
                <div className="container">
                  <div
                    className={`${style.columns} max-width-narrow mr-auto ml-auto`}
                  >
                    {/* <div className={style.content}>
                      <h1 className="heading-5">{resourceDownload.title}</h1>
                      <div
                        className="content mt-4"
                        dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                      />
                    </div> */}
                    <div
                      className={`${resourceDownload.formBackgroundColor} ${style.form}`}
                    >
                      <h1 className="heading-5 mb-3">
                        {resourceDownload.title}
                      </h1>

                      <div className={style.thumbnailWrap}>
                        {/\S/.test(resourceDownload.formTitle) && (
                          <h2
                            className={`${style.formTitle} heading-6 d-flex align-items-center`}
                          >
                            <Image src="/download.svg" width={60} height={60} />

                            <span className="pl-2 d-flex text-20px text-darkblue w-600 line-height-1-2">
                              {" "}
                              {resourceDownload.formTitle ||
                                "Please click to download the resource today!"}
                            </span>
                          </h2>
                        )}
                        {resourceDownload.link?.href && (
                          <AgilityLink
                            className="imgLink"
                            agilityLink={resourceDownload.link}
                          >
                            <div className={`${style.thumbnail}`}>
                              <Media
                                media={resourceDownload.image}
                                title={resourceDownload.title}
                              />
                              <span className={style.download}>Download</span>
                            </div>
                          </AgilityLink>
                        )}
                        {resourceDownload.link?.href &&
                          resourceDownload.link?.text && (
                            <div
                              className={`mt-3 align-center ${style.thumbnailButton}`}
                            >
                              <AgilityLink
                                className="button navy"
                                agilityLink={resourceDownload.link}
                              >
                                {resourceDownload.link.text}
                              </AgilityLink>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          }
        </>
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
