import { sanitizeHtmlConfig } from "../../../utils/convert";
import dynamic from "next/dynamic";
import TextWithCardContent from "./textWithCardContent";

const TextWithCard = ({ module, customData }) => {
  const { sanitizedHtml, sanitizedCardHtml } = customData;
  const { fields } = module;

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
    >
      <TextWithCardContent
        fields={fields}
        sanitizedHtml={sanitizedHtml}
        sanitizedCardHtml={sanitizedCardHtml}
      />
    </section>
  );
};

TextWithCard.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;
  const sanitizedCardHtml = item.fields.card?.fields.content
    ? cleanHtml(item.fields.card.fields.content)
    : null;

  return {
    sanitizedHtml: sanitizedHtml,
    sanitizedCardHtml: sanitizedCardHtml,
  };
};

export default TextWithCard;
