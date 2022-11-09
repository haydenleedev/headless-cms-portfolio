import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const BrandTextWithMediaContent = dynamic(
  () => import("./brandTextWithMediaContent"),
  { ssr: false }
);

const BrandTextWithMedia = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;

  return (
    <BrandTextWithMediaContent fields={fields} sanitizedHtml={sanitizedHtml} />
  );
};

BrandTextWithMedia.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default BrandTextWithMedia;
