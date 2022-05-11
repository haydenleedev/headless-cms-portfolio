import style from "./twoTextColumns.module.scss";
import { renderHTML } from "@agility/nextjs";
import { sanitizeHtmlConfig } from "../../../utils/convert";
import Heading from "../heading";
import { useIntersectionObserver } from "../../../utils/hooks";

const TwoTextColumns = ({ module, customData }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  //Configuration variables
  const narrowContainer = fields.containerWidth == "narrow";
  const fullPageWidth = fields.containerWidth == "fullPageWidth";
  const brandWidth = fields.containerWidth == "brand";
  const alignRight = fields.headingAlignment == "align-right";
  const alignCenter = fields.headingAlignment == "align-center";
  return (
    <section
      className={`section ${style.textWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      <div
        className={`container ${narrowContainer ? "max-width-narrow" : ""} ${
          fullPageWidth ? "max-width-unset padding-unset" : ""
        } ${brandWidth ? "max-width-brand" : ""}`}
      >
        <div className={`${style.heading} ${"flex-direction-"+fields.subtitlePosition} ${alignRight ? style.alignRight : alignCenter ? style.alignCenter : ""}`}>
    
            <p>{fields.subtitle}</p>
          <Heading {...heading} />
        </div>
        <div className={style.textContainer}>
          <div className={style.columnLeft}>
            <p>uhhhhhhhhh</p>
          </div>
          <div className={style.columnRight}></div>
        </div>
      </div>
    </section>
  );
};
TwoTextColumns.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)

  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);
  const sanitizedHtml = [
    item.fields.textLeft ? cleanHtml(item.fields.text) : null,
    item.fields.textRight ? cleanHtml(item.fields.text) : null,
  ];

  return {
    sanitizedHtml,
  };
};

export default TwoTextColumns;
