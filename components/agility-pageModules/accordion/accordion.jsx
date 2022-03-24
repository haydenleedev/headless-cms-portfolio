import { renderHTML } from "@agility/nextjs";
import { useRef } from "react";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import style from "./accordion.module.scss";

const Accordion = ({ customData }) => {
  const { itemsWithSanitizedHTML } = customData;
  const detailsRefs = useRef([]);

  const closeOtherItems = (excludedIndex) => {
    detailsRefs.current.forEach((item, index) => {
      if (index !== excludedIndex) {
        item.open = false;
      }
    });
  };

  itemsWithSanitizedHTML?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  return (
    <section className="section">
      <div className="container">
        <div className={style.accordion}>
          {itemsWithSanitizedHTML.map((item, index) => {
            return (
              <details
                className={style.accordionItem}
                onClick={() => closeOtherItems(index)}
                ref={(elem) => (detailsRefs.current[index] = elem)}
              >
                <summary className={style.itemToggle}>
                  <div className={style.chevron} />
                  <h3 className="heading-5 text-darkblue">
                    {item.fields.heading}
                  </h3>
                </summary>
                <div className={style.itemContentWrapper}>
                  <div dangerouslySetInnerHTML={renderHTML(item.fields.html)} />
                </div>
              </details>
            );
          })}
        </div>
      </div>
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
