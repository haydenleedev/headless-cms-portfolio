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
  const fillRow = boolean(fields.fillRow);
  const fillAmount =
    fields.maxCardsPerRow - (cards.length % fields.maxCardsPerRow);
  const fillCards = new Array(fillAmount).fill("");


  //TODO: Integrate the brand layout options into genericCard component and rmeove this method
  const RenderCard = ({ card }) => {
    const isIconCard = boolean(card.fields.useImageAsIcon);
    return (
      <div className={`${style.cardWrapper} ${brand ? style.brand : ""}`}>
        <div className={style.card}>
          {card.fields.image && !isIconCard && (
            <div
              className={`${style.imageWrapper} ${
                card.fields.imageWrapperClasses
              } ${smallImage ? style.smallerSize : style.normalSize} ${
                cards.length < fields.maxCardsPerRow
                  ? style[`height${cards.length}`]
                  : style.height4
              }`}
            >
              <AgilityImage
                src={card.fields.image.url}
                width={0}
                height={0}
                layout="responsive"
                objectFit={brand ? "contain" : "cover"}
              />
            </div>
          )}
          <div
            className={`${style.textContent} ${
              card.fields.image && !isIconCard && style.imageCardTextContent
            }`}
          >
            {card.fields.title && isIconCard && (
              <div
                className={`${style.titleWithIcon} ${
                  cards.length < fields.maxCardsPerRow
                    ? style[`height${cards.length}`]
                    : style.height4
                }`}
              >
                {card.fields.image && (
                  <div className={style.iconWrapper}>
                    <AgilityImage
                      src={card.fields.image.url}
                      width={0}
                      height={0}
                      layout="responsive"
                      objectFit="contain"
                      className={style.icon}
                    />
                  </div>
                )}
                <p className={style.title}>{card.fields.title}</p>
              </div>
            )}
            {card.fields.title && !isIconCard && (
              <p className={style.title}>{card.fields.title}</p>
            )}
            {card.fields.text && (
              <div
                dangerouslySetInnerHTML={renderHTML(card.fields.text)}
                className={
                  fields.textAlignment == "left" ? "align-left" : "align-center"
                }
              />
            )}
            {card.fields.link && (
              <p className={style.linkText}>
                <span>{card.fields.link.text}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
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
          {cards.map((card, index) => {
            if (brand) {
              return(
                <div
                key={`card${index}`}
                className={
                  cards.length < fields.maxCardsPerRow
                    ? style[`flexBasis${cards.length}`]
                    : style[`flexBasis${fields.maxCardsPerRow}`]
                }
              >
                {card.fields.link ? (
                  <AgilityLink
                    agilityLink={card.fields.link}
                    className={style.linkCard}
                  >
                    <RenderCard card={card} />
                  </AgilityLink>
                ) : (
                  <RenderCard card={card} />
                )}
              </div>
            );
            } else{
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
                    layout={brand ? "brand" : null}
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
            }
           
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
