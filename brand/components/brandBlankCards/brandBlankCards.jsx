import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const BrandBlankCardsContent = dynamic(
  () => import("./brandBlankCardsContent"),
  { ssr: false }
);

const BrandBlankCards = ({ module, customData }) => {
  const { fields } = module;
  const cardsWithSanitizedHtml = customData;
  return (
    <section
      className={`section  ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
    >
      <BrandBlankCardsContent
        fields={fields}
        cardsWithSanitizedHtml={cardsWithSanitizedHtml}
      />
    </section>
  );
};

BrandBlankCards.getCustomInitialProps = async function ({ item }) {
  const items = item.fields.cardItems;
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  items?.length > 0 &&
    items.forEach((item) => {
      item.fields.text = item.fields.text ? cleanHtml(item.fields.text) : null;
      item.fields.description = item.fields.description
        ? cleanHtml(item.fields.description)
        : null;
    });
  return items;
};

export default BrandBlankCards;
