import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import { article } from "../../../schema";
import { convertUJETLinksToHttps, sanitizeHtmlConfig } from "../../../utils/convert";
import Breadcrumbs from "../../breadcrumbs/breadcrumbs";
import OverrideSEO from "../overrideSEO/overrideSEO";
import style from "./pressReleaseContent.module.scss";

const PressReleaseContent = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml } = customData;
  const resource = dynamicPageItem.fields;

  const articleText = sanitizedHtml.replace(/<[^>]+>/g, "");

  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: resource.title,
            image: resource?.image?.url,
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
      <article className={style.pressReleaseContent}>
        <section className={`section ${style.firstFold}`}>
          <div className={style.backgroundImage}>
            {resource.image && (
              <AgilityImage
                src={resource.image.url}
                alt={resource.image.label || null}
                width={resource.image.pixelWidth}
                height={resource.image.pixelHeight}
                layout={"responsive"}
                objectFit="cover"
              />
            )}
          </div>
          <div className={style.backgroundFilter}></div>
          <div className={`container ${style.title}`}>
            <h1>{resource.title}</h1>
          </div>
        </section>
        <Breadcrumbs breadcrumbs={
            [
              { name: "Home", path: "/" },
              { name: "Press Releases" },
              { name: resource.title }
            ]
          }
        />
        <section className="section">
          <div className="container">
            <div
              className={`content ${style.textContent}`}
              dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
            ></div>
          </div>
        </section>
      </article>
    </>
  );
};

PressReleaseContent.getCustomInitialProps = async function ({
  dynamicPageItem,
}) {
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

export default PressReleaseContent;
