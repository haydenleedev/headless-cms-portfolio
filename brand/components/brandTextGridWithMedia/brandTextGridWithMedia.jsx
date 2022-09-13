import Heading from "../../../components/agility-pageModules/heading";
import Media from "../../../components/agility-pageModules/media";
import { boolean, mediaIsSvg } from "../../../utils/validation";
import style from "./brandTextGridWithMedia.module.scss";
import AgilityLink from "../../../components/agilityLink";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";

const BrandTextGridWithMedia = ({ module, customData }) => {
  const { itemsWithSanitizedHTML } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  const itemShadow = boolean(fields?.itemShadow);
  const roundCorners = boolean(fields?.roundCorners);
  const itemImagesAtTop = fields.itemStyle == null;
  const limitHeight = boolean(fields?.limitItemHeight);
  const heightMax = boolean(fields?.imageHeightMax);
  itemsWithSanitizedHTML.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  const columns =
    fields.columns && fields.columns > 0 && fields.columns <= 4
      ? fields.columns
      : 4;

  const numberOfRows = Math.ceil(itemsWithSanitizedHTML.length / columns);

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

  const columnSizeClassname =
    itemsWithSanitizedHTML.length < columns
      ? style[`is-${itemsWithSanitizedHTML.length}`]
      : style[`is-${columns}`];

  const TextItem = ({ data }) => {
    const itemFields = data.fields;
    const heading = JSON.parse(itemFields.heading);
    return (
      <div
        className={`
          ${
            itemsWithSanitizedHTML?.length < 2
              ? ""
              : `
              ${`grid-column ${columnSizeClassname}`}
              ${style.textItem} ${
                  fields.itemStyle === "imgBottom" &&
                  style["justify-content-flex-end"]
                }
              ${
                fields.itemStyle == "logoLeft" ||
                fields.itemStyle == "mediumLogoLeft"
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
              }`
          }
        `}
        key={data.contentID}
        data-animate="true"
      >
        {heading.text && fields.itemStyle === "imgBottom" && (
          <div className={style.textItemHeading}>
            <Heading {...heading} />
          </div>
        )}
        {itemFields.media && (
          <div
            className={`
              ${style.textItemMedia}
              ${heightMax ? style.height100 : ""}
              ${!limitHeight ? "" : style.adjustHeight}
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
          className={`${
            style.textItemTextContent
          } d-flex flex-direction-column ${
            fields.flexAlignItems ? fields.flexAlignItems : ""
          }`}
        >
          {heading.text && fields.itemStyle !== "imgBottom" && (
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
                  className={`content ${style.content} ${style.textItemSecondText}`}
                  dangerouslySetInnerHTML={renderHTML(itemFields.secondText)}
                ></div>
              )}
            </div>
          )}
          {itemFields.link && itemFields.link.text && (
            <span
              className={`${
                fields.linkStyle ? fields.linkStyle : style.rightArrow2
              }`}
            >
              {itemFields.link.text}
            </span>
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
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div className="container max-width-brand">
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
                      ${columnSizeClassname}
                      ${index % columns == 0 ? "ml-0" : ""}
                      ${index + 1 > (numberOfRows - 1) * columns ? "mb-0" : ""}
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
                      ${columnSizeClassname}
                      ${index % columns == 0 ? "ml-0" : ""}
                      ${index + 1 > (numberOfRows - 1) * columns ? "mb-0" : ""}
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

BrandTextGridWithMedia.getCustomInitialProps = async function ({ item }) {
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

export default BrandTextGridWithMedia;
