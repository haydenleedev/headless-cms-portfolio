import { boolean } from "../../../utils/validation";
import GenericCard from "../../genericCard/genericCard";
import style from "./blankCards.module.scss";
import Heading from "../heading";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import AgilityLink from "../../agilityLink";
import { AgilityImage } from "@agility/nextjs";
import { renderHTML } from "@agility/nextjs";
const BlankCards = ({ module }) => {
  const { fields } = module;
  const cards = fields.cards;
  const heading = JSON.parse(fields.heading);
  const brand = fields.layout == "brand";
  const smallImage = boolean(fields.smallerImage);
  cards?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });
  const maxCardsPerRow =
    fields.maxCardsPerRow &&
    fields.maxCardsPerRow > 0 &&
    fields.maxCardsPerRow <= 4
      ? parseInt(fields.maxCardsPerRow)
      : 4;
  const numberOfRows = Math.ceil(cards?.length / maxCardsPerRow);
  const fillRow = boolean(fields.fillRow);
  const fillAmount =
    fields.maxCardsPerRow - (cards?.length % fields.maxCardsPerRow);
  const fillCards = fillAmount > 0 && new Array(fillAmount).fill("");
  return (
    <section className={`section  ${fields.classes ? fields.classes : ""}`}>
      <div
        className={`container ${brand ? "max-width-brand" : ""} ${
          style.containerPosition
        }`}
      >
        {fields.description && (
          <p className={style.description}>{fields.description}</p>
        )}
        <div
          className={`${style.headingContainer} ${
            "flex-direction-" + fields.subtitlePosition
          }`}
        >
          {fields.subtitle && <p>{fields.subtitle}</p>}
          {heading.text && <Heading {...heading} />}
        </div>
        <div className={`${style.cardGrid} ${!brand ? style.leftMargin : ""}`}>
          {cards?.map((card, index) => {
              return (
                <div
                  key={`card${index}`}
                  className={`
                    ${
                      cards.length < maxCardsPerRow
                        ? style[`flexBasis${cards.length}`]
                        : style[`flexBasis${maxCardsPerRow}`]
                    } ${index % maxCardsPerRow == 0 ? "ml-0" : ""} ${
                    index + 1 > (numberOfRows - 1) * maxCardsPerRow ? "mb-0" : ""
                  }`}
                >
                  <GenericCard
                    brandLayout={brand ? true : false}
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

BlankCards.getCustomInitialProps = async function ({ item }) {
  const items = item.fields.cards;
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  items?.length > 0 &&
    items.forEach((item) => {
      item.fields.text = item.fields.text ? cleanHtml(item.fields.text) : null;
    });

  return items;
};

export default BlankCards;
