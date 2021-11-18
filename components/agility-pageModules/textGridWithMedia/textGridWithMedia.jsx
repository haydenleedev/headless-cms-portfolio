import Link from "next/link";
import Heading from "../heading";
import Media from "../media";
import { boolean } from "../../../utils/validation";
import style from "./textGridWithMedia.module.scss";

const TextGridWithMedia = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const narrowContainer = boolean(fields?.narrowContainer);

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
          {fields.media && <Media media={fields.media} />}
          <div className={`columns mt-4 repeat-${fields.columns}`}>
            {fields?.textItems?.map((textItem) => {
              const { fields } = textItem;
              const heading = JSON.parse(fields.heading);
              return (
                <div
                  className={
                    boolean(fields.mediaLeft)
                      ? style.textItemFlex
                      : style.textItem
                  }
                  key={textItem.contentID}
                >
                  {fields.media && (
                    <div className={style.textItemMedia}>
                      <Media media={fields.media} />
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
                      dangerouslySetInnerHTML={{ __html: fields.text }}
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
