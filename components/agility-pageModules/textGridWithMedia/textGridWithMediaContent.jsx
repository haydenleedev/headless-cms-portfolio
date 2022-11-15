import dynamic from "next/dynamic";
import { Fragment } from "react";
import style from "./textGridWithMedia.module.scss";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const Media = dynamic(() => import("../media"), { ssr: false });
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });
const TextItem = dynamic(() => import("./textItem"), { ssr: false });
import { boolean, mediaIsSvg } from "../../../utils/validation";

const TextGridWithMediaContent = ({ itemsWithSanitizedHTML, fields }) => {
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  const objectFitContainItemImages = boolean(
    fields?.objectFitContainItemImages
  );
  const columns =
    fields.columns && fields.columns > 0 && fields.columns <= 4
      ? fields.columns
      : 4;
  const numberOfRows = Math.ceil(itemsWithSanitizedHTML.length / columns);
  const columnSizeClassname =
    itemsWithSanitizedHTML.length < columns
      ? style[`is-${itemsWithSanitizedHTML.length}`]
      : style[`is-${columns}`];
  return (
    <div className="container">
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
  );
};

export default TextGridWithMediaContent;
