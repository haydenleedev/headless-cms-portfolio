import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";

const CallToActionContent = dynamic(() => import("./callToActionContent"), {
  ssr: false,
});

const CallToAction = ({ module, customData }) => {
  const { fields } = module;

  return <CallToActionContent fields={fields} customData={customData} />;
};

CallToAction.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.textContent
    ? cleanHtml(item.fields.textContent)
    : null;

  return {
    sanitizedHtml,
  };
};

export const getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.textContent
    ? cleanHtml(item.fields.textContent)
    : null;

  return {
    sanitizedHtml,
  };
};

export default CallToAction;
