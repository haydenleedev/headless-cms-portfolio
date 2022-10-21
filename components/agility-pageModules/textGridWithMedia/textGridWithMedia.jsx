import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";

const TextGridWithMediaContent = dynamic(
  () => import("./textGridWithMediaContent"),
  { ssr: false }
);

const TextGridWithMedia = ({ module, customData }) => {
  const { fields } = module;
  return <TextGridWithMediaContent fields={fields} customData={customData} />;
};

TextGridWithMedia.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const itemsWithSanitizedHTML = item.fields.textItems.map((item) => {
    item.text = cleanHtml(item.text);
    return item;
  });

  return {
    itemsWithSanitizedHTML,
  };
};

export default TextGridWithMedia;
