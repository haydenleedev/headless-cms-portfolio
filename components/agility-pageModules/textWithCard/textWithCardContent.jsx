import { renderHTML } from "@agility/nextjs";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"));
import style from "./textWithCard.module.scss";

const TextWithCardContent = ({ fields, sanitizedHtml, sanitizedCardHtml }) => {
  const heading = fields.textContentHeading
    ? JSON.parse(fields.textContentHeading)
    : null;
  const cardFields = fields.card?.fields;
  return (
    <div className="container">
      <div className={style.content}>
        {fields.card && (
          <div className={style.card}>
            <div className={style.cardTop}>
              {cardFields.topBarText && (
                <span className={style.bar}>{cardFields.topBarText}</span>
              )}
              <div className={style.cardTextWrapper}>
                {cardFields.heading && (
                  <p className={style.cardHeading}>{cardFields.heading}</p>
                )}
                {cardFields.price && (
                  <p className={style.price}>{`$${cardFields.price}`}</p>
                )}
                {cardFields.conditionsText && (
                  <p className={style.conditions}>
                    {cardFields.conditionsText}
                  </p>
                )}
              </div>
            </div>
            <div
              className={style.cardContent}
              dangerouslySetInnerHTML={renderHTML(sanitizedCardHtml)}
            ></div>
          </div>
        )}
        {(heading || fields.text) && (
          <div className={`${style.text} ${fields.textVerticalAlignment}`}>
            {heading && <Heading {...heading} />}
            {fields.text && (
              <div dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWithCardContent;
