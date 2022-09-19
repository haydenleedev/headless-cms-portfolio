import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import { useIntersectionObserver } from "../../../utils/hooks";
import { mediaIsSvg } from "../../../utils/validation";
import AgilityLink from "../../agilityLink";
import Heading from "../heading";
import Media from "../media";
import style from "./textWithInfographic.module.scss";

const TextWithInfographic = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  //configuration options
  const narrowContainer = fields.containerWidth == "narrow";
  const layout = fields.layout || "infographicRight";
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

  fields.items.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : "";
  const mbValue = fields.marginBottom ? fields.marginBottom : "";
  const ptValue = fields.paddingTop ? fields.paddingTop : "";
  const pbValue = fields.paddingBottom ? fields.paddingBottom : "";

  return (
    <section
      className={`section ${style.textWithInfographic}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div className={`container ${narrowContainer ? "max-width-narrow" : ""}`}>
        {(layout === "columnTop" || layout === "columnBottom") && (
          <div
            className={`${style.heading} ${
              layout === "columnTop" || layout === "columnBottom"
                ? "align-center"
                : ""
            }`}
          >
            <Heading {...heading} />
          </div>
        )}
        <div className={`${style.content} ${style[layout]}`}>
          <div
            className={`${style.textContent} ${
              style[`textContentBasis${fields.textWidthPercentage || 50}`]
            }`}
          >
            <div className={style.text}>
              {heading.text &&
                layout !== "columnTop" &&
                layout !== "columnBottom" && (
                  <div className={style.heading}>
                    <Heading {...heading} />
                  </div>
                )}
              {fields.text && (
                <div
                  className={style.html}
                  dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
                ></div>
              )}
              {fields.link && (
                <AgilityLink
                  agilityLink={fields.link}
                  className={`${
                    layout !== "columnTop" &&
                    layout !== "columnBottom" &&
                    !fields.linkClasses
                      ? "small"
                      : ""
                  } cyan outlined ${style.link} ${
                    fields.linkClasses ? fields.linkClasses : ""
                  } ${
                    fields.linkStyle ? fields.linkStyle : "chevron-after w-600 "
                  }`}
                  ariaLabel={`Navigate to page ` + fields.link.href}
                  title={`Navigate to page ` + fields.link.href}
                >
                  {fields.link.text}
                </AgilityLink>
              )}
            </div>
          </div>
          <div
            className={`${style.infographic} ${
              style[
                `infoBasis${100 - parseInt(fields.textWidthPercentage) || 50}`
              ]
            }
            `}
          >
            {fields.items && fields.items.length > 0 && (
              <ul
                className={`${style.items} ${
                  layout === "columnTop" || layout === "columnBottom"
                    ? style.columnItems
                    : ""
                }`}
                data-animate="true"
              >
                {fields.items.map((item) => (
                  <li key={item.contentID}>
                    <div className="d-flex justify-content-center">
                      <div
                        className={`${style.infographicIcon} ${
                          mediaIsSvg(item.fields.image)
                            ? style.svgMediaContainer
                            : ""
                        }`}
                      >
                        <Media media={item.fields.image} />
                      </div>
                    </div>
                    <div>
                      <p>{item.fields.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

TextWithInfographic.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.text ? cleanHtml(item.fields.text) : null;

  return {
    sanitizedHtml,
  };
};

export default TextWithInfographic;
