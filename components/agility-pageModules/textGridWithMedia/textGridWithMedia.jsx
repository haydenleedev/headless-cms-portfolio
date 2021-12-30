import Heading from "../heading";
import Media from "../media";
import { boolean } from "../../../utils/validation";
import style from "./textGridWithMedia.module.scss";
import AgilityLink from "../../agilityLink";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";

const TextGridWithMedia = ({ module, customData }) => {
  const { itemsWithSanitizedHTML } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  const itemShadow = boolean(fields?.itemShadow);
  const itemSmallImage = boolean(fields?.itemSmallImage);
  const itemImageLeft = boolean(fields?.itemImageLeft);
  const itemImageCentered = boolean(fields?.itemImageCentered);
  const centerItemsHorizontally = boolean(fields?.centerItemsHorizontally);
  const roundCorners = boolean(fields?.roundCorners);

  // observer for triggering animations if an animation style is selected in agility.
  const intersectionRef = useIntersectionObserver(
    {
      threshold: 0.0,
    },
    0.0,
    fields.animationStyle
      ? () => {
          intersectionRef.current
            .querySelectorAll('*[data-animate="true"]')
            .forEach((elem) => {
              elem.classList.add(fields.animationStyle);
            });
        }
      : null
  );
  return (
    <section
      className={`section ${style.textGridWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        {heading.text && (
          <div className={style.heading}>
            <Heading {...heading} />
            {fields.subtitle && <p>{fields.subtitle}</p>}
          </div>
        )}
        <div className={style.content}>
          {fields.media && (
            // <div className={style.mediaContainer}>
            <Media media={fields.media} />
            // </div>
          )}
          <div
            className={`${
              centerItemsHorizontally
                ? "grid-columns"
                : `columns mt-4 repeat-${fields.columns}`
            } ${style.grid}`}
          >
            {itemsWithSanitizedHTML?.map((textItem) => {
              const heading = JSON.parse(textItem.fields.heading);
              return (
                <div
                  className={`${
                    centerItemsHorizontally
                      ? `grid-column is-${fields.columns}-larger-gap ${style.horizontallyCenteredTextItem}`
                      : ""
                  } ${itemImageLeft ? style.textItemFlex : style.textItem} ${
                    itemShadow ? "card-shadow" : ""
                  } ${roundCorners ? "border-radius-1" : ""}`}
                  key={textItem.contentID}
                  data-animate="true"
                >
                  {textItem.fields.media && (
                    <div
                      className={`${style.textItemMedia} ${
                        itemSmallImage ? style.textItemMediaSmall : ""
                      } ${itemImageCentered ? "margin-center-horizontal" : ""}`}
                    >
                      <Media media={textItem.fields.media} />
                    </div>
                  )}
                  <div>
                    {heading.text && (
                      <div className={style.textItemHeading}>
                        <Heading {...heading} />
                      </div>
                    )}
                    <div
                      className={`${style.textItemHtml} content`}
                      dangerouslySetInnerHTML={renderHTML(textItem.fields.text)}
                    ></div>
                  </div>
                  {textItem.fields.link && (
                    <AgilityLink agilityLink={textItem.fields.link}>
                      {textItem.fields.link.text}
                    </AgilityLink>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
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
