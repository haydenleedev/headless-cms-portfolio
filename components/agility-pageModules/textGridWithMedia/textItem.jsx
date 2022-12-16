import style from "./textGridWithMedia.module.scss";
import { renderHTML } from "@agility/nextjs";
import { boolean, mediaIsSvg } from "../../../utils/validation";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));
const Media = dynamic(() => import("../media"));

const TextItem = ({
  fields,
  data,
  objectFitContainItemImages,
  columnSizeClassname,
}) => {
  const itemShadow = boolean(fields?.itemShadow);
  const roundCorners = boolean(fields?.roundCorners);
  const itemFields = data.fields;
  const heading = JSON.parse(itemFields.heading);
  const itemImagesAtTop = fields.itemStyle == null;
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

export default TextItem;
