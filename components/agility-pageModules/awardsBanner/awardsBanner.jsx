import { sanitizeHtmlConfig } from "../../../utils/convert";
import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import style from "./awardsBanner.module.scss";
import { renderHTML } from "@agility/nextjs";

const AwardsBanner = ({ module, customData }) => {
  const { sanitizedHtml } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const columnLayout = boolean(fields?.columnLayout);
  const textCenterJustification = boolean(fields?.textCenterJustification);

  return (
    <section
      className={`section ${style.awardsBanner} ${
        fields.classes ? fields.classes : ""
      }`}
      id={fields.id ? fields.id : null}
    >
      {fields.backgroundImage && (
        <div className={style.backgroundImage}>
          <Media media={fields.backgroundImage} />
        </div>
      )}
      <div className="container">
        <div
          className={`${style.content} ${
            columnLayout ? "flex-direction-column" : "flex-direction-row"
          }`}
        >
          <aside
            className={`${style.textContent} ${
              fields.textContentHighlightColor
            } ${columnLayout ? style.columnLayoutTextContent : ""} ${
              textCenterJustification ? "align-center" : ""
            }`}
          >
            <div>
              <div className={style.heading}>
                <Heading {...heading} />
              </div>
              {fields.featuredImage && (
                <div className={style.featuredImage}>
                  <Media media={fields.featuredImage} />
                </div>
              )}
              <div
                className={style.description}
                dangerouslySetInnerHTML={renderHTML(sanitizedHtml)}
              ></div>
            </div>
          </aside>
          <aside
            className={`grid-columns ${style.awards} ${
              columnLayout ? "width-100" : ""
            }`}
          >
            {fields.awardBadges &&
              fields.awardBadges.map((award) => (
                <div
                  className={`grid-column is-${fields.awardBadgeColumnsCount} d-flex align-items-center justify-content-center`}
                  key={award.contentID}
                >
                  <div className={style.awardImage}>
                    <Media media={award.fields.image} />
                  </div>
                </div>
              ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

AwardsBanner.getCustomInitialProps = async function ({ item }) {
  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.description
    ? cleanHtml(item.fields.description)
    : null;

  return {
    sanitizedHtml,
  };
};

export default AwardsBanner;
