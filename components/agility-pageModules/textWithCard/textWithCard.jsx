import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";
import style from "./textWithCard.module.scss";

const TextWithCard = ({ module, customData }) => {
  const sanitizedHtml = customData.sanitizedHtml;
  const sanitizedCardHtml = customData.sanitizedCardHtml;
  const { fields } = module;
  const heading = fields.textContentHeading ? JSON.parse(fields.textContentHeading) : null;
  const cardFields = fields.card?.fields;
  return (
    <section className="section">
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
    </section>
  );
};

TextWithCard.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;
  const sanitizedCardHtml = item.fields.card?.fields.content
    ? cleanHtml(item.fields.card.fields.content)
    : null;

  return {
    sanitizedHtml: sanitizedHtml,
    sanitizedCardHtml: sanitizedCardHtml,
  };
};

export default TextWithCard;
