import { boolean } from "../../../utils/validation";
import GenericCard from "../../../components/genericCard/genericCard";
import style from "./brandBlankCards.module.scss";
import Heading from "../../../components/agility-pageModules/heading";
import { sanitizeHtmlConfig } from "../../../utils/convert";

const BrandBlankCards = ({ module, customData }) => {
  const { fields } = module;
  const cardsWithSanitizedHtml = customData;
  const heading = JSON.parse(fields.heading);
  const smallImage = boolean(fields.smallerImage);
  cardsWithSanitizedHtml?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });
  const maxCardsPerRow =
    fields.maxCardsPerRow &&
    fields.maxCardsPerRow > 0 &&
    fields.maxCardsPerRow <= 4
      ? parseInt(fields.maxCardsPerRow)
      : 4;
  const numberOfRows = Math.ceil(
    cardsWithSanitizedHtml?.length / maxCardsPerRow
  );
  const fillRow = boolean(fields.fillRow);
  const fillAmount =
    fields.maxCardsPerRow -
    (cardsWithSanitizedHtml?.length % fields.maxCardsPerRow);
  const fillCards = fillAmount > 0 && new Array(fillAmount).fill("");
  return (
    <section
      className={`section  ${fields.classes ? fields.classes : ""} ${
        fields?.backgroundColor ? fields?.backgroundColor : ""
      }`}
    >
      <div className={`container max-width-brand ${style.containerPosition}`}>
        <div
          className={`${style.headingContainer} ${
            "flex-direction-" + fields.subtitlePosition
          }`}
        >
          {fields.subtitle && <p>{fields.subtitle}</p>}
          {heading.text && <Heading {...heading} />}
        </div>
        {fields.description && (
          <p className={style.description}>{fields.description}</p>
        )}
        <div className={style.cardGrid}>
          {cardsWithSanitizedHtml?.map((card, index) => {
            return (
              <div
                key={`card${index}`}
                className={`
                    ${
                      cardsWithSanitizedHtml.length < maxCardsPerRow
                        ? style[`flexBasis${cardsWithSanitizedHtml.length}`]
                        : style[`flexBasis${maxCardsPerRow}`]
                    } ${index % maxCardsPerRow == 0 ? "ml-0" : ""} ${
                  index + 1 > (numberOfRows - 1) * maxCardsPerRow ? "mb-0" : ""
                }`}
              >
                <GenericCard
                  brandLayout
                  link={card.fields.link}
                  title={card.fields.title}
                  image={card.fields.image}
                  ariaTitle={card.fields.title}
                  description={card.fields.description}
                  smallImage={smallImage}
                  text={card.fields.text}
                  textAlignment={fields.textAlignment}
                  imageWrapperClasses={card.fields.imageWrapperClasses}
                  configuration={{
                    iconStyleImage: boolean(card.fields.useImageAsIcon),
                    descriptionAlignment: fields.textAlignment,
                  }}
                />
              </div>
            );
          })}

          {fillCards.length > 0 &&
            fillRow === true &&
            fillCards.map((item, index) => {
              return (
                <div
                  className={style[`flexBasis${fields.maxCardsPerRow}`]}
                  key={`fillCard-${index}`}
                >
                  {" "}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

BrandBlankCards.getCustomInitialProps = async function ({ item }) {
  const items = item.fields.cardItems;
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  items?.length > 0 &&
    items.forEach((item) => {
      item.fields.text = item.fields.text ? cleanHtml(item.fields.text) : null;
      item.fields.description = item.fields.description
        ? cleanHtml(item.fields.description)
        : null;
    });
  return items;
};

export default BrandBlankCards;