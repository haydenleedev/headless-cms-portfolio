import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const BrandVideoPopupContent = dynamic(
  () => import("./brandVideoPopupContent"),
  { ssr: false }
);

const BrandVideoPopup = ({ module, customData }) => {
  const { fields } = module;
  const { sanitizedHtml } = customData;
  return (
    <section
      className={fields?.backgroundColor ? fields?.backgroundColor : "" || null}
    >
      <BrandVideoPopupContent fields={fields} sanitizedHtml={sanitizedHtml} />
    </section>
  );
};

BrandVideoPopup.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default BrandVideoPopup;
