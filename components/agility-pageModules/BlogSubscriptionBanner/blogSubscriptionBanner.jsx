import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./blogSubscriptionBanner.module.scss";
import dynamic from "next/dynamic";
const BlogSubscriptionBannerContent = dynamic(
  () => import("./blogSubscriptionBannerContent"),
  { ssr: true }
);

const BlogSubscriptionBanner = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${mtValue} ${mbValue} ${ptValue} ${pbValue}
      ${style.blogSubscriptionBanner} ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
    >
      <BlogSubscriptionBannerContent
        fields={fields}
        sanitizedHtml={sanitizedHtml}
      />
    </section>
  );
};

BlogSubscriptionBanner.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default BlogSubscriptionBanner;
