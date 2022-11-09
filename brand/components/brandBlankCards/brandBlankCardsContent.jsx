import dynamic from "next/dynamic";
const GenericCard = dynamic(
  () => import("../../../components/genericCard/genericCard"),
  { ssr: false }
);
const Heading = dynamic(
  () => import("../../../components/agility-pageModules/heading"),
  { ssr: false }
);
import { boolean } from "../../../utils/validation";
import style from "./brandBlankCards.module.scss";

const BrandBlankCardsContent = ({ fields, cardsWithSanitizedHtml }) => {
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
  );
};

export default BrandBlankCardsContent;
