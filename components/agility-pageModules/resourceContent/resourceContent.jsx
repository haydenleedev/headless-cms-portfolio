import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import style from "./resourceContent.module.scss";
import { useState } from "react";
import { boolean } from "../../../utils/validation";
import { Form, FormWrapper } from "../../form";
import AgilityLink from "../../agilityLink";
import { resolveCategory, sanitizeHtmlConfig } from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";
import { useRouter } from "next/router";
import FirstFold from "../firstFold/firstFold";
import EmbedVideo from "../embedVideo/embedVideo";
import Script from "next/script";

const ResourceContent = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml } = customData;
  const [formLoaded, setFormLoaded] = useState(false);
  const resource = dynamicPageItem.fields;
  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");
  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };

  const { asPath } = useRouter();
  let resourceCategory;
  // Integrations are not under /resources/
  if (asPath.includes("/resources/")) {
    resourceCategory = asPath.split("/resources/")[1].split("/")[0];
  } else {
    resourceCategory = asPath.split("/")[1];
  }
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
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
        <FormWrapper
          handleSetFormLoaded={handleSetFormLoaded}
          formID={resource.marketoFormID}
        >
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
                        alt={resource.image.label || null}
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
                      <Form
                        formLoaded={formLoaded}
                        formID={resource.marketoFormID}
                      />
                    </div>
                  </div>
                </div>
                {resource.link.text && resource.link.href && (
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
                      <Form
                        formLoaded={formLoaded}
                        formID={resource.marketoFormID}
                      />
                      {resource.link.href && (
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
        </FormWrapper>
      )}
    </>
  );
};

ResourceContent.getCustomInitialProps = async function ({ dynamicPageItem }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = dynamicPageItem.fields.text
    ? cleanHtml(dynamicPageItem.fields.text)
    : null;

  return {
    sanitizedHtml,
  };
};

export default ResourceContent;
