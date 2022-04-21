import { renderHTML } from "@agility/nextjs";
import { useRef, useState, useEffect } from "react";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";
import style from "./accordion.module.scss";

const Accordion = ({ module, customData }) => {
  const { itemsWithSanitizedHTML } = customData;
  const detailsRefs = useRef([]);
  const itemContentRefs = useRef([]);
  const [activeItem, setActiveItem] = useState(null);
  const [lastKeyPress, setLastKeyPress] = useState(null);
  const { fields } = module || {};
  const heading = fields?.heading ? JSON.parse(fields.heading) : null;

  itemsWithSanitizedHTML?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setLastKeyPress(e.key);
    };
    const handleFocusIn = (index) => {
      return function curriedHandleFocusIn() {
        setActiveItem(index);
      };
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
    }
    itemContentRefs.current.forEach((element, index) => {
      element.addEventListener("focusin", handleFocusIn(index));
    });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      itemContentRefs.current.forEach((element, index) => {
        element?.removeEventListener("focusin", handleFocusIn(index));
      });
    };
  }, []);

  return (
    <section className="section">
      <div className="container max-width-narrow mb-3">
        {heading?.text ? (
          <div className={`heading ${fields?.headingAlignment}`}>
            <Heading {...heading} />
          </div>
        ) : (
          <div className={`heading mb-3 ${fields?.headingAlignment}`}>
            <h2 className="heading-5">Frequently Asked Questions</h2>
          </div>
        )}
        <div className={style.accordion}>
          {itemsWithSanitizedHTML.map((item, index) => {
            return (
              <div
                key={`details${index}`}
                className={`${style["bb-1"]} ${
                  activeItem == index ? style.open : "null"
                }`}
              >
                <details
                  className={style.accordionItem}
                  open={activeItem == index}
                  aria-expanded={activeItem == index}
                  ref={(elem) => (detailsRefs.current[index] = elem)}
                >
                  <summary
                    className={style.itemToggle}
                    onClick={(e) => {
                      setLastKeyPress(null);
                      e.preventDefault();
                      if (activeItem == index) {
                        setActiveItem(null);
                      } else {
                        setActiveItem(index);
                      }
                    }}
                    onMouseDown={() => setLastKeyPress(null)}
                    onFocus={() => {
                      if (lastKeyPress == "Tab") {
                        setActiveItem(index);
                      }
                    }}
                  >
                    <h3 className="heading-6">{item.fields.heading}</h3>
                    <span className={style.circle}>
                      <span className={style.chevron} />
                    </span>
                  </summary>
                </details>
                <div
                  className={style.itemContent}
                  ref={(elem) => (itemContentRefs.current[index] = elem)}
                  dangerouslySetInnerHTML={renderHTML(item.fields.html)}
                />
              </div>
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
