import dynamic from "next/dynamic";
import { boolean } from "../../../utils/validation";
const GenericCard = dynamic(() => import("../../genericCard/genericCard"), {
  ssr: false,
});
import style from "./blankCards.module.scss";

const BlankCardsContent = ({ fields, cardsWithSanitizedHtml }) => {
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

  return (
    <div className="container">
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
  );
};

export default BlankCardsContent;
