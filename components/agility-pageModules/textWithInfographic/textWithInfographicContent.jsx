import { renderHTML } from "@agility/nextjs";
import { mediaIsSvg } from "../../../utils/validation";
import dynamic from "next/dynamic";
import style from "./textWithInfographic.module.scss";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const AgilityLink = dynamic(() => import("../../agilityLink"), { ssr: false });
const Media = dynamic(() => import("../media"), { ssr: false });

const TextWithInfographicContent = ({ fields, sanitizedHtml }) => {
  const heading = JSON.parse(fields.heading);

  //configuration options
  const narrowContainer = fields.containerWidth == "narrow";
  const layout = fields.layout || "infographicRight";
  const itemsStyle = fields.itemsStyle || "default";
  fields.items.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  return (
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
              } ${style[itemsStyle]}`}
              data-animate="true"
            >
              {fields.items.map((item) => (
                <li key={item.contentID}>
                  <div className={style.itemImage}>
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
                  <div className={style.itemTextContent}>
                    {item.fields.title && (
                      <p className={style.itemTitle}>{item.fields.title}</p>
                    )}
                    <p className={style.itemDescription}>{item.fields.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextWithInfographicContent;
