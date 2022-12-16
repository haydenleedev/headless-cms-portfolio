import style from "./twoTextColumns.module.scss";
import { renderHTML } from "@agility/nextjs";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: true });

const TwoTextColumnsContent = ({
  fields,
  sanitizedHtmlLeft,
  sanitizedHtmlRight,
}) => {
  const heading = JSON.parse(fields.heading);
  //Configuration variables
  const narrowContainer = fields.containerWidth == "narrow";
  const fullPageWidth = fields.containerWidth == "fullPageWidth";
  const brandWidth = fields.containerWidth == "brand";
  const alignRight = fields.headingAlignment == "align-right";
  const alignCenter = fields.headingAlignment == "align-center";
  return (
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
              dangerouslySetInnerHTML={renderHTML(sanitizedHtmlLeft)}
            ></div>
          )}
        </div>
        <div className={style.columnRight}>
          {fields.textRight && (
            <div
              className={`${style.html} content`}
              dangerouslySetInnerHTML={renderHTML(sanitizedHtmlRight)}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoTextColumnsContent;
