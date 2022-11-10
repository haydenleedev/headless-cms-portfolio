import { boolean, mediaIsSvg } from "../../../utils/validation";
import dynamic from "next/dynamic";
const Heading = dynamic(() => import("../heading"), { ssr: false });
const Media = dynamic(() => import("../media"), { ssr: false });
import style from "./awardsBanner.module.scss";
import { renderHTML } from "@agility/nextjs";

const AwardsBannerContent = ({ fields, sanitizedHtml, featuredAwards }) => {
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
  return (
    <>
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
    </>
  );
};

export default AwardsBannerContent;
