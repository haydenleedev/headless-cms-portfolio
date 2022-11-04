import { renderHTML } from "@agility/nextjs";
import { AgilityImage } from "@agility/nextjs";
import Media from "../media";
import style from "./dealRegistration.module.scss";
import { boolean } from "../../../utils/validation";
import {
  convertUJETLinksToHttps,
  sanitizeHtmlConfig,
} from "../../../utils/convert";
import OverrideSEO from "../overrideSEO/overrideSEO";
import { article } from "../../../schema";
import PardotForm from "../../form/pardotForm/index";

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

      <section className="section">
        <div className="container">
          <div className={style.columns}>
            <div className={style.content}>
              <div className="align-center">
                <img
                  className={style.logo}
                  src="https://ujet.cx/_next/static/media/ujet-logo.ebf9b2e5.svg"
                  width="200"
                  height="62"
                  alt="Ujet logo"
                />

                <h1 className="heading-3">
                  <span className={style.visuallyHidden}>{deal.title} </span>
                  Deal Registration
                </h1>
                <div className={`${style.logoImage} align-center mr-auto`}>
                  <Media media={deal.image} />
                </div>
              </div>

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
                formHandlerID={deal.pardotFormID ? deal.pardotFormID : "3571"}
                config={formConfiguration}
                action={
                  deal.formAction
                    ? deal.formAction
                    : "https://info.ujet.cx/l/986641/2022-07-06/k38vn"
                }
                submit={deal.formSubmitText}
                partner={{
                  companyCountry: deal.partnerCompanyCountry,
                  companyName: deal.partnerCompanyName,
                  companyState: deal.partnerCompanyState,
                  companyCity: deal.partnerCompanyCity,
                  allianceReferralCompany: deal.allianceReferralCompany,
                  partnerId: deal.partner,
                }}
                recordTypeId="0121I0000007LYlQAM"
              />
            </div>
          </div>
        </div>
      </section>
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
