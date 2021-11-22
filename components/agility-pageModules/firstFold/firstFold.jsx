import Link from "next/link";
import Heading from "../heading";
import style from "./firstFold.module.scss";
import Media from "../media";
import { boolean } from "../../../utils/validation";

const FirstFold = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const alternateLayout = boolean(fields.alternateLayout);
  const noImageLayout = boolean(fields.noImageLayout);
  const customerStory = boolean(fields.customerStory);
  const narrowContainer = boolean(fields?.narrowContainer);

  return alternateLayout || customerStory ? (
    <section
      className={`section ${style.firstFoldAlternate} ${
        customerStory ? "mb-6" : ""
      } ${fields.classes ? fields.classes : ""}`}
    >
      {fields.media && (
        <div className={style.backgroundImage}>
          <Media media={fields.media}></Media>
        </div>
      )}
      <div
        className={`container ${
          customerStory ? style.customerStoryTextContent : style.textContent
        } ${narrowContainer ? "max-width-narrow" : ""}`}
      >
        <div className={style.heading}>
          <Heading {...heading}></Heading>
        </div>
        {fields.text && (
          <div
            className={`content ${style.text}`}
            dangerouslySetInnerHTML={{ __html: fields.text }}
          ></div>
        )}
        {fields.primaryLink && (
          <Link href="#">
            <a
              className={`button cyan outlined ${style.primaryLink} ${
                fields.linkClasses ? fields.linkClasses : ""
              }`}
              aria-label={`Navigate to page ` + fields.primaryLink.href}
              title={`Navigate to page ` + fields.primaryLink.href}
            >
              {fields.primaryLink.text}
            </a>
          </Link>
        )}
        {fields.secondaryLink && (
          <Link href="#" className="button outlined">
            <a
              className={`button ${style.secondaryLink} ${
                fields.linkClasses ? fields.linkClasses : ""
              }`}
              aria-label={`Navigate to page ` + fields.secondaryLink.href}
              title={`Navigate to page ` + fields.secondaryLink.href}
            >
              {fields.secondaryLink.text}
            </a>
          </Link>
        )}
      </div>
    </section>
  ) : (
    <section
      className={`section ${style.firstFold} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        {/* TODO: allow reverse column order for desktop as a conditional toggle from Agility*/}
        <div
          className={noImageLayout ? style.noImageLayout : "columns repeat-2"}
        >
          <div className={style.textContent}>
            <div className={style.heading}>
              <Heading {...heading}></Heading>
            </div>
            {fields.text && (
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: fields.text }}
              ></div>
            )}
            {fields.primaryLink && (
              <Link href="#">
                <a
                  className={`button cyan outlined ${style.primaryLink} ${
                    fields.linkClasses ? fields.linkClasses : ""
                  }`}
                  aria-label={`Navigate to page ` + fields.primaryLink.href}
                  title={`Navigate to page ` + fields.primaryLink.href}
                >
                  {fields.primaryLink.text}
                </a>
              </Link>
            )}
            {fields.secondaryLink && (
              <Link href="#" className="button outlined">
                <a
                  className={`button ${style.secondaryLink} ${
                    fields.linkClasses ? fields.linkClasses : ""
                  }`}
                  aria-label={`Navigate to page ` + fields.secondaryLink.href}
                  title={`Navigate to page ` + fields.secondaryLink.href}
                >
                  {fields.secondaryLink.text}
                </a>
              </Link>
            )}
          </div>
          {fields.media && !noImageLayout && (
            <Media media={fields.media}></Media>
          )}
        </div>
      </div>
    </section>
  );
};

export default FirstFold;
