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
  let awardColumnCount =
    fields.awardColumnCount > 1 ? fields.awardColumnCount : 7;
  const displayedAwardCount =
    fields.displayedAwardCount > 1 ? fields.displayedAwardCount : 7;
  if (displayedAwardCount < awardColumnCount) {
    awardColumnCount = displayedAwardCount;
  }

  featuredAwards?.sort(function (a, b) {
    return a.properties.itemOrder - b.properties.itemOrder;
  });

  // Margins & Paddings
  const mtValue = fields.marginTop ? fields.marginTop : '';
  const mbValue = fields.marginBottom ? fields.marginBottom : '';
  const ptValue = fields.paddingTop ? fields.paddingTop : '';
  const pbValue = fields.paddingBottom ? fields.paddingBottom : '';

  return (
    <section
      className={`section ${style.awardsBanner}
      ${mtValue} ${mbValue} ${ptValue} ${pbValue} ${
        fields.classes ? fields.classes : ""
      } ${fields?.backgroundColor ? fields?.backgroundColor : ""}`}
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
          {(heading.text || sanitizedHtml) && (
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
          )}
          <aside
            className={`grid-columns ${style.awards} ${
              columnLayout ? "width-100" : ""
            }`}
          >
            {featuredAwards &&
              featuredAwards.map(
                (award, index) =>
                  index < displayedAwardCount && (
                    <div
                      className={`grid-column is-${awardColumnCount} d-flex align-items-center justify-content-center`}
                      key={award.contentID}
                    >
                      <div
                        className={`${style.awardImage} ${
                          mediaIsSvg(award.fields.image)
                            ? style.awardImageSvg
                            : ""
                        }`}
                      >
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
