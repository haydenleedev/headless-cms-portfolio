import Media from "../media";
import Heading from "../heading";
import style from "./caseStudyDownloadPrompt.module.scss";
import AgilityLink from "../../agilityLink";

const CaseStudyDownloadPrompt = ({ module }) => {
  const { fields } = module;
  const downloadTitle = JSON.parse(fields.downloadTitle);
  const ctaTitle = fields.ctaTitle ? JSON.parse(fields.ctaTitle) : null;

  return (
    <section
      className={`section bg-paleblue ${style.caseStudyDownloadPrompt}`}
      id={fields.id ? fields.id : null}
    >
      <div className={`container ${style.content}`}>
        {fields.ctaLink && (
          <div className={style.column}>
            <div className={style.heading}>
              <Heading {...ctaTitle} />
            </div>
            <AgilityLink
              agilityLink={fields.ctaLink}
              className={`button is-outlined ${style.ctaLink}`}
              ariaLabel={`Navigate to page ${fields.ctaLink.href}`}
              title={`Navigate to page ${fields.ctaLink.href}`}
            >
              {fields.ctaLink.text}
            </AgilityLink>
          </div>
        )}
        <div className={style.column}>
          <div className={style.heading}>
            <Heading {...downloadTitle} />
          </div>
          <AgilityLink
            agilityLink={fields.downloadLink}
            className={style.ctaLink}
            ariaLabel={`Navigate to ${fields.downloadLink.href}`}
            title={`Navigate to ${fields.downloadLink.href}`}
          >
            <div className={style.media}>
              <Media media={fields.linkImage} />
            </div>
          </AgilityLink>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyDownloadPrompt;
