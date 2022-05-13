import Heading from "../heading";
import Media from "../media";
import { boolean, mediaIsSvg } from "../../../utils/validation";
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
  const roundCorners = boolean(fields?.roundCorners);
  const itemImagesAtTop = fields.itemStyle == null;
  const brandWidth = boolean(fields?.brandWidth);
  const limitHeight = boolean(fields?.limitItemHeight)
  itemsWithSanitizedHTML.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

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

  const largeColumnNumber =
    itemsWithSanitizedHTML.length < fields.columns
      ? style[`is-${itemsWithSanitizedHTML.length}`]
      : style[`is-${fields.columns}`];

  const TextItem = ({ data }) => {
    const itemFields = data.fields;
    const heading = JSON.parse(itemFields.heading);
    return (
      <div
        className={`
          ${`grid-column ${largeColumnNumber}`}
          ${style.textItem}
          ${
            fields.itemStyle == "logoLeft" || fields.itemStyle == "mediumLogoLeft"
              ? ""
              : `
                flex-direction-column
                ${
                  fields.itemImageSize
                    ? style[`textItemWith${fields.itemImageSize}Media`]
                    : ""
                }
                ${itemShadow ? "card-shadow" : ""}
                ${roundCorners ? "border-radius-1" : ""}`
          }`}
        key={data.contentID}
        data-animate="true"
      >
        {itemFields.media && (
          <div
            className={`
              ${style.textItemMedia}
              ${!limitHeight ?  "": style.adjustHeight}
              ${mediaIsSvg(itemFields.media) ? style.textItemSvgMedia : ""}
              ${
                itemImagesAtTop
                  ? `${style.textItemMediaTop} ${
                      fields.itemImageSize
                        ? style[`textItemMedia${fields.itemImageSize}`]
                        : ""
                    } ${`align-self-${
                      fields.itemImageHorizontalAlignment || "start"
                    }`}
                  `
                  : ""
              }
            `}
          >
            <Media media={itemFields.media} />
          </div>
        )}
        <div
          className={`${style.textItemTextContent} d-flex flex-direction-column`}
        >
          {heading.text && (
            <div className={style.textItemHeading}>
              <Heading {...heading} />
            </div>
          )}
          {(itemFields.text || itemFields.secondText) && (
            <div className={style.textItemContentWrapper}>
              {itemFields.text && (
                <div
                  className={`content ${style.content}`}
                  dangerouslySetInnerHTML={renderHTML(itemFields.text)}
                ></div>
              )}
              {itemFields.secondText && (
                <div
                  className={`content ${style.content}`}
                  dangerouslySetInnerHTML={renderHTML(itemFields.secondText)}
                ></div>
              )}
            </div>
          )}
          {itemFields.link && itemFields.link.text && (
            <span className={style.rightArrow}>{itemFields.link.text}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      className={`section ${style.textGridWithMedia} ${
        fields.classes ? fields.classes : ""
      } ${
        fields.itemStyle == "logoLeft"
          ? style.logoLeftHeaderRight
          : fields.itemStyle == "mediumLogoLeft"
          ? style.logoLeftHeaderRight + " " + style.medium
          : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div className={`container ${brandWidth ? "max-width-brand" : ""}`}>
        {heading.text && (
          <div
            className={`${style.heading} ${
              narrowContainer ? "max-width-narrow" : ""
            }  `}
          >
            <Heading {...heading} />
            {fields.subtitle && <p>{fields.subtitle}</p>}
          </div>
        )}
        <div className={style.content}>
          {fields.media && (
            <div
              className={`${style.mediaContainer} ${
                mediaIsSvg(fields.media) ? style.svgMediaContainer : ""
              }`}
            >
              <Media media={fields.media} title={fields.mediaTitle} />
            </div>
          )}
          <div
            className={`${`grid-columns ${
              fields.itemHorizontalAlignment || "justify-content-flex-start"
            }`}
            ${style.grid}
            ${narrowContainer ? "max-width-narrow" : ""}
            ${fields.itemGapSize === " small-gap" ? "" : style.hasLargerGap}
            mt-4
            `}
          >
            {itemsWithSanitizedHTML?.map((textItem, index) => {
              if (textItem.fields.link) {
                return (
                  <AgilityLink
                    agilityLink={textItem.fields.link}
                    ariaLabel={`Read more about ${textItem.fields.title}`}
                    key={`textItem${index}`}
                    className={`
                      ${style.gridItem}
                      ${largeColumnNumber}
                    `}
                  >
                    <TextItem data={textItem} />
                  </AgilityLink>
                );
              } else {
                return (
                  <div
                    key={`textItem${index}`}
                    className={`
                  ${style.gridItem}
                  ${largeColumnNumber}
                  `}
                  >
                    <TextItem data={textItem} key={`textItem${index}`} />
                  </div>
                );
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
