import dynamic from "next/dynamic";
const Heading = dynamic(
  () => import("../../../components/agility-pageModules/heading"),
  { ssr: false }
);
const Media = dynamic(
  () => import("../../../components/agility-pageModules/media"),
  { ssr: false }
);
const AgilityLink = dynamic(() => import("../../../components/agilityLink"), {
  ssr: false,
});
const TextItem = dynamic(() => import("./textItem"), { ssr: false });
import { boolean, mediaIsSvg } from "../../../utils/validation";
import style from "./brandTextGridWithMedia.module.scss";

const BrandTextGridWithMediaContent = ({ fields, itemsWithSanitizedHTML }) => {
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  itemsWithSanitizedHTML.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

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
                  <TextItem
                    fields={fields}
                    data={textItem}
                    columnSizeClassname={columnSizeClassname}
                    itemsWithSanitizedHTML={itemsWithSanitizedHTML}
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

export default BrandTextGridWithMediaContent;
