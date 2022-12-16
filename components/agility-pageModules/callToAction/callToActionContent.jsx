import { renderHTML } from "@agility/nextjs";
import style from "./callToAction.module.scss";
import { boolean } from "../../../utils/validation";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: true });
const Media = dynamic(() => import("../media"), { ssr: true });
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: true });

const CallToActionContent = ({ fields, sanitizedHtml }) => {
  const heading = JSON.parse(fields.heading);
  const narrowContainer = boolean(fields?.narrowContainer);
  const textLeftJustification = boolean(fields?.textLeftJustification);

  const linkBackgroundColor = fields.linkBackgroundColor || "cyan outlined";
  return (
    <>
      {fields.backgroundImage && (
        <div className={style.backgroundImage}>
          <Media media={fields.backgroundImage} />
        </div>
      )}
      <div
        className={`container d-flex flex-direction-column justify-content-center align-items-center ${
          narrowContainer ? "max-width-narrow" : ""
        }`}
      >
        <div
          className={`${style.content} ${
            fields.textAlignment ? fields.textAlignment : ""
          } ${textLeftJustification ? style.textLeft : style.textCenter}`}
        >
          {heading.text && (
            <div className={style.heading}>
              <Heading {...heading} />
            </div>
          )}
          {fields.textContent && (
            <div
              className="content"
              dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
            ></div>
          )}
          <AgilityLink
            agilityLink={fields.link}
            className={`button ${style.link} ${linkBackgroundColor} ${
              fields.linkClasses ? fields.linkClasses : ""
            }`}
            ariaLabel={`Navigate to page ` + fields.link.href}
            title={`Navigate to page ` + fields.link.href}
          >
            {fields.link.text}
          </AgilityLink>
        </div>
      </div>
    </>
  );
};

export default CallToActionContent;
