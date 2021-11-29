import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Head from "next/head";
import Script from "next/script";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./pressReleaseContent.module.scss";

const PressReleaseContent = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml } = customData;
  const resource = dynamicPageItem.fields;

  return (
    <article className={style.pressReleaseContent}>
      <section className={`section ${style.firstFold}`}>
        <div className={style.backgroundImage}>
          {resource.image && (
            <AgilityImage
              src={resource.image.url}
              alt={resource.image.label || null}
              width={resource.image.pixelWidth}
              height={resource.image.pixelHeight}
              objectFit="cover"
            />
          )}
        </div>
        <div className={style.backgroundFilter}></div>
        <div className={`container ${style.title}`}>
          <h1>{resource.title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div
            className={`content ${style.textContent}`}
            dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
          ></div>
        </div>
      </section>
    </article>
  );
};

PressReleaseContent.getCustomInitialProps = async function ({
  dynamicPageItem,
}) {
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

export default PressReleaseContent;
