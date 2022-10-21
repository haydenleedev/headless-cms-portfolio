import Heading from "../heading";
import Media from "../media";
import { boolean, mediaIsSvg } from "../../../utils/validation";
import style from "./textGridWithMedia.module.scss";
import AgilityLink from "../../agilityLink";
import { renderHTML } from "@agility/nextjs";
import { useIntersectionObserver } from "../../../utils/hooks";

const TextGridWithMediaContent = ({ fields, customData }) => {
      const { itemsWithSanitizedHTML } = customData;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  const itemShadow = boolean(fields?.itemShadow);
  const roundCorners = boolean(fields?.roundCorners);
  const objectFitContainItemImages = boolean(
    fields?.objectFitContainItemImages
  );

  const itemImagesAtTop = fields.itemStyle == null;

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

  const TextItem = ({ data, objectFitContainItemImages }) => {
    const itemFields = data.fields;
    const heading = JSON.parse(itemFields.heading);
    return (
      <div
        className={`
          ${`grid-column ${columnSizeClassname}`}
          ${style.textItem} ${
          fields.itemStyle === "imgBottom" && "justify-content-flex-end"
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
          }`}
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
              ${
                objectFitContainItemImages
                  ? style.objectFitContainItemImages
                  : ""
              }
            `}
          >
            <Media media={itemFields.media} />
          </div>
        )}
        {(itemFields.text ||
          itemFields.secondText ||
          (heading.text && fields.itemStyle !== "imgBottom")) && (
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
                  fields.linkStyle ? fields.linkStyle : style.rightArrow
                }`}
              >
                {itemFields.link.text}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.textGridWithMedia}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
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
            ${fields.itemStyle == "imgBottom" ? "mb-4" : ""}
            mt-4`}
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
                    <TextItem
                      data={textItem}
                      objectFitContainItemImages={objectFitContainItemImages}
                    />
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
                    <TextItem
                      data={textItem}
                      key={`textItem${index}`}
                      objectFitContainItemImages={objectFitContainItemImages}
                    />
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

export default TextGridWithMediaContent;
