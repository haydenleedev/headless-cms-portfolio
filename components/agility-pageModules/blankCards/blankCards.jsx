import { boolean } from "../../../utils/validation";
import GenericCard from "../../genericCard/genericCard";
import style from "./blankCards.module.scss";
import Heading from "../heading";

const BlankCards = ({ module }) => {
  const { fields } = module;
  const cards = fields.cards;
  cards.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });
  const maxCardsPerRow =
    fields.maxCardsPerRow &&
    fields.maxCardsPerRow > 0 &&
    fields.maxCardsPerRow <= 4
      ? parseInt(fields.maxCardsPerRow)
      : 4;
  const numberOfRows = Math.ceil(cards.length / maxCardsPerRow);
  return (
    <section className="section">
      <div className="container">
        <div className={style.cardGrid}>
          {cards.map((card, index) => {
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
                  link={card.fields.link}
                  title={card.fields.title}
                  image={card.fields.image}
                  ariaTitle={card.fields.title}
                  description={card.fields.description}
                  configuration={{
                    iconStyleImage: boolean(card.fields.useImageAsIcon),
                    descriptionAlignment: fields.textAlignment,
                  }}
                />
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
