import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const Media = dynamic(() => import("../media"), { ssr: false });
import { boolean, mediaIsSvg } from "../../../utils/validation";
import style from "./textGridWithMedia.module.scss";
import AgilityLink from "../../agilityLink";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";
import { Fragment } from "react";
const TextItem = dynamic(() => import("./textItem"), { ssr: false });

const TextGridWithMedia = ({ module, customData }) => {
  const { itemsWithSanitizedHTML } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  const objectFitContainItemImages = boolean(
    fields?.objectFitContainItemImages
  );

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
                  <Fragment key={`textItem${index}`}>
                    <AgilityLink
                      agilityLink={textItem.fields.link}
                      ariaLabel={`Read more about ${textItem.fields.title}`}
                      className={`
                      ${style.gridItem}
                      ${columnSizeClassname}
                      ${index % columns == 0 ? "ml-0" : ""}
                      ${index + 1 > (numberOfRows - 1) * columns ? "mb-0" : ""}
                    `}
                    >
                      <TextItem
                        fields={fields}
                        data={textItem}
                        objectFitContainItemImages={objectFitContainItemImages}
                        columnSizeClassname={columnSizeClassname}
                      />
                    </AgilityLink>
                  </Fragment>
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
                      fields={fields}
                      data={textItem}
                      objectFitContainItemImages={objectFitContainItemImages}
                      columnSizeClassname={columnSizeClassname}
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
