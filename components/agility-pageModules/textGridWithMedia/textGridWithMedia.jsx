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

  const TextItem = ({ data }) => {
    const itemFields = data.fields;
    const heading = JSON.parse(itemFields.heading);
    return (
      <div
        className={`${
          centerItemsHorizontally
            ? `grid-column is-${fields.columns}-larger-gap ${style.horizontallyCenteredTextItem}`
            : ""
        } ${itemImageLeft ? style.textItemFlex : style.textItem} ${
          itemShadow ? "card-shadow" : ""
        } ${roundCorners ? "border-radius-1" : ""}`}
        key={data.contentID}
        data-animate="true"
      >
        {itemFields.media && (
          <div
            className={`${style.textItemMedia} ${
              itemSmallImage ? style.textItemMediaSmall : ""
            } ${itemImageCentered ? "margin-center-horizontal" : ""}`}
          >
            <Media media={itemFields.media} />
          </div>
        )}
        <div>
          {heading.text && (
            <div className={style.textItemHeading}>
              <Heading {...heading} />
            </div>
          )}
          {itemFields.text && (
            <div
              className={"content"}
              dangerouslySetInnerHTML={renderHTML(itemFields.text)}
            ></div>
          )}
        </div>
        {itemFields.link && itemFields.link.text && (
          <span className={style.rightArrow}>{itemFields.link.text}</span>
        )}
      </div>
    );
  };

  return (
    <section
      className={`section ${style.textGridWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div className={`container `}>
        {heading.text && (
          <div
            className={`${style.heading} ${
              narrowContainer ? "max-width-narrow" : ""
            }`}
          >
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
            {itemsWithSanitizedHTML?.map((textItem, index) => {
              if (textItem.fields.link) {
                return (
                  <AgilityLink
                    agilityLink={textItem.fields.link}
                    ariaLabel={`Read more about ${textItem.fields.title}`}
                    key={`textItem${index}`}
                  >
                    <TextItem data={textItem} />
                  </AgilityLink>
                );
              } else {
                return <TextItem data={textItem} key={`textItem${index}`} />;
              }
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
