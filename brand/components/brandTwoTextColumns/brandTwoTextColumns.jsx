import style from "./brandTwoTextColumns.module.scss";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../../../components/agility-pageModules/heading";
import { useIntersectionObserver } from "../../../utils/hooks";

const BrandTwoTextColumns = ({ module, customData }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  //Configuration variables
  const narrowContainer = fields.containerWidth == "narrow";
  const fullPageWidth = fields.containerWidth == "fullPageWidth";
  const brandWidth = fields.containerWidth == "brand";
  const alignRight = fields.headingAlignment == "align-right";
  const alignCenter = fields.headingAlignment == "align-center";

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

  return (
    <section
      className={`section ${fields.classes ? fields.classes : ""} ${
        fields.backgroundColor ? fields.backgroundColor : ""
      }`}
      id={fields.id ? fields.id : null}
      ref={intersectionRef}
    >
      <div
        className={`container ${narrowContainer ? "max-width-narrow" : ""} ${
          fullPageWidth ? "max-width-unset padding-unset" : ""
        } ${brandWidth ? "max-width-brand" : ""}`}
      >
        <div
          className={`${style.heading} ${
            "flex-direction-" + fields.subtitlePosition
          } ${
            alignRight ? style.alignRight : alignCenter ? style.alignCenter : ""
          }`}
        >
          <p>{fields.subtitle}</p>
          <Heading {...heading} />
        </div>
        <div
          className={`${style.textContainer} ${
            "flex-direction-" + fields.mobileorder
          }`}
        >
          <div className={style.columnLeft}>
            {fields.textLeft && (
              <div
                className={`${style.html} content`}
                dangerouslySetInnerHTML={renderHTML(
                  customData.sanitizedHtmlLeft
                )}
              ></div>
            )}
          </div>
          <div className={style.columnRight}>
            {fields.textRight && (
              <div
                className={`${style.html} content`}
                dangerouslySetInnerHTML={renderHTML(
                  customData.sanitizedHtmlRight
                )}
              ></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
BrandTwoTextColumns.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtmlLeft = item.fields.textLeft
    ? cleanHtml(item.fields.textLeft)
    : null;
  const sanitizedHtmlRight = item.fields.textRight
    ? cleanHtml(item.fields.textRight)
    : null;

  return {
    sanitizedHtmlLeft,
    sanitizedHtmlRight,
  };
};

export default BrandTwoTextColumns;
