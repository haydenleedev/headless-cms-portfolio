import { sanitizeHtmlConfig } from "../../../utils/convert";
import dynamic from "next/dynamic";
import style from "./awardsBanner.module.scss";
const AwardsBannerContent = dynamic(() => import("./awardsBannerContent"), {
  ssr: false,
});

const AwardsBanner = ({ module, customData }) => {
  const { sanitizedHtml, featuredAwards } = customData;
  const { fields } = module;

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.awardsBanner}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
    >
      <AwardsBannerContent
        fields={fields}
        sanitizedHtml={sanitizedHtml}
        featuredAwards={featuredAwards}
      />
    </section>
  );
};

AwardsBanner.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;
  let featuredAwards = await api.getContentList({
    referenceName: "featuredawards",
    languageCode,
    sort: "properties.itemOrder",
    direction: "desc",
    expandAllContentLinks: true,
    take: 7,
  });
  featuredAwards = featuredAwards.items[0].fields.awards;

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.description
    ? cleanHtml(item.fields.description)
    : null;

  return {
    sanitizedHtml,
    featuredAwards,
  };
};

export default AwardsBanner;
