import { sanitizeHtmlConfig } from "../../../utils/convert";
import dynamic from "next/dynamic";
const AccordionContent = dynamic(() => import("./accordionContent"));

const Accordion = ({ module, customData }) => {
  const { itemsWithSanitizedHTML } = customData;
  const { fields } = module || {};

  // Margins & Paddings
  const mtValue = fields?.marginTop ? fields.marginTop : "";
  const mbValue = fields?.marginBottom ? fields.marginBottom : "";
  const ptValue = fields?.paddingTop ? fields.paddingTop : "";
  const pbValue = fields?.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      } ${mtValue} ${mbValue} ${ptValue} ${pbValue}`}
    >
      <AccordionContent
        fields={fields}
        itemsWithSanitizedHTML={itemsWithSanitizedHTML}
      />
    </section>
  );
};

Accordion.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  const itemsWithSanitizedHTML = item.fields.items.map((item) => {
    item.fields.html = cleanHtml(item.fields.html);
    return item;
  });
  return { itemsWithSanitizedHTML };
};

export default Accordion;
