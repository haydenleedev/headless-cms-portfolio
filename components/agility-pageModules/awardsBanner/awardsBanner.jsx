import { sanitizeHtmlConfig } from "../../../utils/convert";
import { boolean, mediaIsSvg } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import style from "./awardsBanner.module.scss";
import { renderHTML } from "@agility/nextjs";

const AwardsBanner = ({ module, customData }) => {
  const { sanitizedHtml, featuredAwards } = customData;
  const { fields } = module;
  const heading = fields.heading ? JSON.parse(fields.heading) : null;
  const columnLayout = boolean(fields?.columnLayout);
  const textCenterJustification = boolean(fields?.textCenterJustification);
  const numberofRows = fields.numberofRows ? fields.numberofRows : null;

  featuredAwards?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

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
            }${numberofRows ? " row-2" : null}`}
          >
            {featuredAwards &&
              featuredAwards.map(
                (award, index) =>
                  index < fields.awardBadgeColumnsCount && (
                    <div
                      className={`grid-column is-${fields.awardBadgeColumnsCount} d-flex align-items-center justify-content-center`}
                      key={award.contentID}
                    >
                      <div className={`${style.awardImage} ${mediaIsSvg(award.fields.image) ? style.awardImageSvg : ""}`}>
                        <Media media={award.fields.image} />
                      </div>
                    </div>
                  )
              )}
          </aside>
        </div>
      </div>
    </section>
  );
};

AwardsBanner.getCustomInitialProps = async function ({
  agility,
  languageCode,
  item,
}) {
  const api = agility;
  let featuredAwards = await api.getContentList({
    referenceName: "featuredawards",
    languageCode,
    sort: "properties.itemOrder",
    direction: "desc",
    expandAllContentLinks: true,
    take: 7,
  });
  featuredAwards = featuredAwards.items[0].fields.awards;

  const sanitizeHtml = (await import("sanitize-html")).default;
  // sanitize unsafe HTML ( all HTML entered by users and any HTML copied from WordPress to Agility)
  const cleanHtml = (html) => sanitizeHtml(html, sanitizeHtmlConfig);

  const sanitizedHtml = item.fields.description
    ? cleanHtml(item.fields.description)
    : null;

  return {
    sanitizedHtml,
    featuredAwards,
  };
};

export default AwardsBanner;
