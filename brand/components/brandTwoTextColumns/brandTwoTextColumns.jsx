import style from "./brandTwoTextColumns.module.scss";
import { renderHTML } from "@agility/nextjs";
import Heading from "../../../components/agility-pageModules/heading";
import { useIntersectionObserver } from "../../../utils/hooks";

const BrandTwoTextColumns = ({ module }) => {
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
        fields?.backgroundColor ? fields?.backgroundColor : ""
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
                dangerouslySetInnerHTML={renderHTML(fields.textLeft)}
              ></div>
            )}
          </div>
          <div className={style.columnRight}>
            {fields.textRight && (
              <div
                className={`${style.html} content`}
                dangerouslySetInnerHTML={renderHTML(fields.textRight)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTwoTextColumns;
