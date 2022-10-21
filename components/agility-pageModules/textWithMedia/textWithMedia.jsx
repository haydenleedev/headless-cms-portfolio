import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";

const TextWithMediaContent = dynamic(() => import("./textWithMediaContent"), {
  ssr: false,
});

const TextWithMedia = ({ module, customData }) => {
  const { fields } = module;
  return <TextWithMediaContent fields={fields} customData={customData} />;
};

TextWithMedia.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default TextWithMedia;
