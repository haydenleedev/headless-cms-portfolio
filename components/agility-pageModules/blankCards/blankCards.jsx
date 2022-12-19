import dynamic from "next/dynamic";
import { sanitizeHtmlConfig } from "../../../utils/convert";
const BlankCardsContent = dynamic(() => import("./blankCardsContent"));

const BlankCards = ({ module, customData }) => {
  const { fields } = module;
  const cardsWithSanitizedHtml = customData;

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section className={`section ${mtValue} ${mbValue} ${ptValue} ${pbValue}`}>
      <BlankCardsContent
        fields={fields}
        cardsWithSanitizedHtml={cardsWithSanitizedHtml}
      />
    </section>
  );
};

export default BlankCards;

BlankCards.getCustomInitialProps = async function ({ item }) {
  const items = item.fields.cards;
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
