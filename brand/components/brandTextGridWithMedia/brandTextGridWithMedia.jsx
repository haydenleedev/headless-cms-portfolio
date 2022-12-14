import Heading from "../../../components/agility-pageModules/heading";
import Media from "../../../components/agility-pageModules/media";
import { boolean, mediaIsSvg } from "../../../utils/validation";
import style from "./brandTextGridWithMedia.module.scss";
import AgilityLink from "../../../components/agilityLink";
import TextItem from "./textItem";
import { useIntersectionObserver } from "../../../utils/hooks";

const BrandTextGridWithMedia = ({ module }) => {
  const { fields } = module;
  const items = fields.textItems;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const narrowContainer = boolean(fields?.narrowContainer);
  items.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  const columns =
    fields.columns && fields.columns > 0 && fields.columns <= 4
      ? fields.columns
      : 4;

  const numberOfRows = Math.ceil(items.length / columns);

  // observer for triggering animations if an animation style is selected in agility.
  const intersectionRef = useIntersectionObserver(
    {
      threshold: 0.0,
    },
    0.0,
    fields.animationStyle
      ? () => {
          intersectionRef.current
            .querySelectorAll('*[data-animate="true"]')
            .forEach((elem) => {
              elem.classList.add(fields.animationStyle);
            });
        }
      : null
  );

  const columnSizeClassname =
    items.length < columns
      ? style[`is-${items.length}`]
      : style[`is-${columns}`];

  return (
    <section
      className={`section ${style.textGridWithMedia} ${
        fields.classes ? fields.classes : ""
      } ${
        fields.itemStyle == "logoLeft"
          ? style.logoLeftHeaderRight
          : fields.itemStyle == "mediumLogoLeft"
          ? style.logoLeftHeaderRight + " " + style.medium
          : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div className="container max-width-brand">
        {heading.text && (
          <div
            className={`${style.heading} ${
              narrowContainer ? "max-width-narrow" : ""
            }  `}
          >
            <Heading {...heading} />
            {fields.subtitle && <p>{fields.subtitle}</p>}
          </div>
        )}
        <div className={style.content}>
          {fields.media && (
            <div
              className={`${style.mediaContainer} ${
                mediaIsSvg(fields.media) ? style.svgMediaContainer : ""
              }`}
            >
              <Media media={fields.media} title={fields.mediaTitle} />
            </div>
          )}
          <div
            className={`${`grid-columns ${
              fields.itemHorizontalAlignment || "justify-content-flex-start"
            }`}
            ${style.grid}
            ${narrowContainer ? "max-width-narrow" : ""}
            ${fields.itemGapSize === " small-gap" ? "" : style.hasLargerGap}
            `}
          >
            {items?.map((textItem, index) => {
              if (textItem.fields.link) {
                return (
                  <AgilityLink
                    agilityLink={textItem.fields.link}
                    ariaLabel={`Read more about ${textItem.fields.title}`}
                    key={`textItem${index}`}
                    className={`
                      ${style.gridItem}
                      ${columnSizeClassname}
                      ${index % columns == 0 ? "ml-0" : ""}
                      ${index + 1 > (numberOfRows - 1) * columns ? "mb-0" : ""}
                    `}
                  >
                    <TextItem
                      fields={fields}
                      data={textItem}
                      columnSizeClassname={columnSizeClassname}
                      items={items}
                    />
                  </AgilityLink>
                );
              } else {
                return (
                  <div
                    key={`textItem${index}`}
                    className={`
                      ${style.gridItem}
                      ${columnSizeClassname}
                      ${index % columns == 0 ? "ml-0" : ""}
                      ${index + 1 > (numberOfRows - 1) * columns ? "mb-0" : ""}
                  `}
                  >
                    <TextItem
                      fields={fields}
                      data={textItem}
                      columnSizeClassname={columnSizeClassname}
                      items={items}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTextGridWithMedia;
