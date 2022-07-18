import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import style from "./dealRegistration.module.scss";
import { boolean } from "../../../utils/validation";
import {
  convertUJETLinksToHttps,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import PardotForm from "../../form/pardotForm";

const DealRegistration = ({ dynamicPageItem, customData }) => {
  const { sanitizedHtml, formConfiguration } = customData;
  const deal = dynamicPageItem.fields;
  const articleText = sanitizedHtml?.replace(/<[^>]+>/g, "");

  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  return (
    <>
      <OverrideSEO
        module={dynamicPageItem}
        additionalSchemas={[
          article({
            headline: deal.title,
            image: deal?.image?.url,
            keywords: dynamicPageItem.properties.referenceName,
            wordcount: articleText?.split(" ").length,
            url: deal.oGUrl,
            datePublished: deal.date,
            dateModified: dynamicPageItem.properties.modified,
            dateCreated: deal.date,
            description: deal.metaDescription,
            articleBody: articleText,
          }),
        ]}
      />

      <>
        {boolean(deal.alternateLayout) ? (
          <>
            <section className={style.alternateHeader}>
              <div className={style.alternateHeaderContainer}>
                <div className={`container ${style.alternateHeaderTitle}`}>
                  <p className={style.category}>Deal Registration</p>
                  <span className={style.hr}></span>
                  <h1 className={`${style.title} heading-5`}>{deal.title}</h1>
                </div>
                <div className={style.alternateHeaderColumns}>
                  <div className={style.sideColumn}></div>
                  <div className={style.imageColumn}>
                    <AgilityImage
                      src={deal.image.url}
                      alt={deal.image.label || null}
                      width={deal.image.pixelWidth}
                      height={deal.image.pixelHeight}
                      objectFit="cover"
                    />
                  </div>
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
                  <div className={`bg-skyblue-light`}>
                    {/\S/.test(deal.formTitle) && (
                      <h2 className={`${style.formTitle} heading-6`}>
                        {deal.formTitle || "Lead Information"}
                      </h2>
                    )}
                    <PardotForm
                      formHandlerID={deal.pardotFormID}
                      config={formConfiguration}
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="section">
              <div className="container">
                <div className={style.columns}>
                  <div className={style.content}>
                    <h1 className="heading-5">{deal.title}</h1>
                    <div
                      className="content mt-4"
                      dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                    />
                  </div>
                  <div className={`${deal.formBackgroundColor} ${style.form}`}>
                    {/\S/.test(deal.formTitle) && (
                      <h2 className={`${style.formTitle} heading-6`}>
                        {deal.formTitle || "Lead Information"}
                      </h2>
                    )}
                    <PardotForm
                      formHandlerID={deal.pardotFormID}
                      config={formConfiguration}
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </>
    </>
  );
};

DealRegistration.getCustomInitialProps = async function ({
  dynamicPageItem,
  agility,
  languageCode,
}) {
  const api = agility;

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const formConfiguration = await api.getContentList({
    referenceName: "formconfiguration",
    expandAllContentLinks: true,
    languageCode,
  });

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = dynamicPageItem.fields.text
    ? convertUJETLinksToHttps(cleanHtml(dynamicPageItem.fields.text))
    : null;

  return {
    sanitizedHtml,
    formConfiguration,
  };
};

export default DealRegistration;
