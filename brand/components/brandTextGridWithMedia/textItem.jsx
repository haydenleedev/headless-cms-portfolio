import { renderHTML } from "@agility/nextjs";
import dynamic from "next/dynamic";
import { boolean, mediaIsSvg } from "../../../utils/validation";
import style from "./brandTextGridWithMedia.module.scss";
const Heading = dynamic(
  () => import("../../../components/agility-pageModules/heading"),
  { ssr: true }
);
const Media = dynamic(
  () => import("../../../components/agility-pageModules/media"),
  { ssr: true }
);

const TextItem = ({
  fields,
  data,
  columnSizeClassname,
  itemsWithSanitizedHTML,
}) => {
  const itemFields = data.fields;
  const heading = JSON.parse(itemFields.heading);
  const itemShadow = boolean(fields?.itemShadow);
  const roundCorners = boolean(fields?.roundCorners);
  const itemImagesAtTop = fields.itemStyle == null;
  const limitHeight = boolean(fields?.limitItemHeight);
  const heightMax = boolean(fields?.imageHeightMax);
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
        className={`${style.textItemTextContent} d-flex flex-direction-column ${
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

export default TextItem;
