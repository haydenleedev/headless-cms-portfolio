import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import style from "./resourceContent.module.scss";
import { useState } from "react";
import { boolean } from "../../../utils/validation";
import { Form, FormWrapper } from "../../form";
import AgilityLink from "../../agilityLink";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";

const ResourceContent = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml } = customData;
  const [formLoaded, setFormLoaded] = useState(false);
  const resource = dynamicPageItem.fields;

  const articleText = sanitizedHtml.replace(/<[^>]+>/g, "");

  const handleSetFormLoaded = () => {
    setFormLoaded(true);
  };

  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: resource.title,
            image: resource.image.url,
            keywords: dynamicPageItem.properties.referenceName,
            wordcount: articleText.split(" ").length,
            url: resource.oGUrl,
            datePublished: resource.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: resource.date,
            description: resource.metaDescription,
            articleBody: articleText,
          }),
        ]}
      />
      <FormWrapper
        handleSetFormLoaded={handleSetFormLoaded}
        formID={resource.marketoFormID}
      >
        {boolean(resource.alternateLayout) ? (
          <>
            <section className={style.alternateHeader}>
              <div className={style.alternateHeaderColumns}>
                <div className={style.contentColumn} aria-hidden></div>
                <div className={style.imageColumn}>
                  <AgilityImage
                    src={resource.image.url}
                    alt={resource.image.label || null}
                    width={resource.image.pixelWidth}
                    height={resource.image.pixelHeight}
                    objectFit="cover"
                  />
                </div>
                <div
                  className={`section container ${style.alternateHeaderContainer}`}
                >
                  <p className={style.category}>Render category here</p>
                  <span className={style.hr}></span>
                  <h1 className={`${style.title} heading-5`}>
                    {resource.title}
                  </h1>
                </div>
              </div>
            </section>
            <section className="section">
              <div className={`container ${style.alternateContent}`}>
                <div className="columns repeat-2">
                  <div
                    className="content"
                    dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                  />
                  <div className={`marketo-resource`}>
                    <h2 className={`${style.alternateFormTitle} heading-6`}>
                      {resource.formTitle ||
                        "Fill out the form to download the the resource today!"}
                    </h2>
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
                    <AgilityLink
                      agilityLink={resource.link}
                      className="link ml-4"
                    >
                      {resource.link.text}
                    </AgilityLink>
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="section">
            <div className="container">
              <div className="columns repeat-2">
                <div className={style.content}>
                  <h1 className="heading-5">{resource.title}</h1>
                  <div
                    className="content mt-4"
                    dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                  />
                </div>
                <div className={`${style.form} marketo-resource`}>
                  <h2 className={`${style.formTitle} heading-6`}>
                    {resource.formTitle ||
                      "Fill out the form to download the the resource today!"}
                  </h2>
                  <Form
                    formLoaded={formLoaded}
                    formID={resource.marketoFormID}
                  />
                  {resource.link.text && resource.link.href && (
                    <p>
                      <AgilityLink agilityLink={resource.link}>
                        {resource.link.title}
                      </AgilityLink>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </FormWrapper>
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
