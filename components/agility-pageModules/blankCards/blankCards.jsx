import { AgilityImage, renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { boolean } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import style from "./blankCards.module.scss";
import Heading from "../heading";

const BlankCards = ({ module, customData }) => {
  const { fields } = module;
  const cards = customData;
  const brand = fields.layout == "brand";
  const heading = JSON.parse(fields.heading);
  const smallImage = boolean(fields.smallerImage);
  cards?.length > 0 &&
    cards.sort(function (a, b) {
      return a.properties.itemOrder - b.properties.itemOrder;
    });

  const RenderCard = ({ card }) => {
    const isIconCard = boolean(card.fields.useImageAsIcon);
    return (
      <div className={`${style.cardWrapper} ${brand ? style.brand : ""}`}>
        <div className={style.card}>
          {card.fields.image && !isIconCard && (
            <div
              className={`${style.imageWrapper} ${
                smallImage ? style.smallerSize : style.normalSize
              } ${
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
    <section className={`section  ${
        fields.classes ? fields.classes : ""
      }`}>
      <div
        className={`container ${brand ? "max-width-brand" : ""} ${
          style.containerPosition
        } `}
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
        <div className={style.cardGrid}>
          {cards?.map((card, index) => {
            return (
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
