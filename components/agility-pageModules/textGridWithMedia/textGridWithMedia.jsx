import Link from "next/link";
import Heading from "../heading";
import Media from "../media";
import { boolean } from "../../../utils/validation";
import style from "./textGridWithMedia.module.scss";

const TextGridWithMedia = ({ module }) => {
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  const itemShadow = boolean(fields?.itemShadow);
  const itemSmallImage = boolean(fields?.itemSmallImage);
  const itemImageLeft = boolean(fields?.itemImageLeft);
  const itemImageCentered = boolean(fields?.itemImageCentered);
  const centerItemsHorizontally = boolean(fields?.centerItemsHorizontally);
  const roundCorners = boolean(fields?.roundCorners);

  return (
    <section
      className={`section ${style.textGridWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
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
            className={
              centerItemsHorizontally
                ? "grid-columns"
                : `columns mt-4 repeat-${fields.columns}`
            }
          >
            {fields?.textItems?.map((textItem) => {
              const heading = JSON.parse(textItem.fields.heading);
              return (
                <div
                  className={`${
                    centerItemsHorizontally
                      ? `grid-column is-${fields.columns} ${style.horizontallyCenteredTextItem}`
                      : ""
                  } ${itemImageLeft ? style.textItemFlex : style.textItem} ${
                    itemShadow ? "card-shadow" : ""
                  } ${roundCorners ? "border-radius-1" : ""}`}
                  key={textItem.contentID}
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
                      dangerouslySetInnerHTML={{ __html: textItem.fields.text }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextGridWithMedia;
