import { boolean } from "../../../utils/validation";
import GenericCard from "../../genericCard/genericCard";
import style from "./blankCards.module.scss";

const BlankCards = ({ module }) => {
  const { fields } = module;
  const cards = fields.cards;
  cards.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });
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
                    cards.length < fields.maxCardsPerRow
                      ? style[`flexBasis${cards.length}`]
                      : style[`flexBasis${fields.maxCardsPerRow}`]
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

export default BlankCards;
