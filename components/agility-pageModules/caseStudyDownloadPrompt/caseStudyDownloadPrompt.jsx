import Link from "next/link";
import Media from "../media";
import Heading from "../heading";
import style from "./caseStudyDownloadPrompt.module.scss";

const CaseStudyDownloadPrompt = ({ module }) => {
  const { fields } = module;
  const downloadTitle = JSON.parse(fields.downloadTitle);
  const ctaTitle = fields.ctaTitle ? JSON.parse(fields.ctaTitle) : null;

  return (
    <section className={`section ${style.caseStudyDownloadPrompt}`}>
      <div className={`container ${style.content}`}>
        {fields.ctaLink && (
          <div className={style.column}>
            <div className={style.heading}>
              <Heading {...ctaTitle} />
            </div>
            <Link href={fields.ctaLink.href}>
              <a
                className={`button is-outlined ${style.ctaLink}`}
                aria-label={`Navigate to page ${fields.ctaLink.href}`}
                title={`Navigate to page ${fields.ctaLink.href}`}
              >
                {fields.ctaLink.text}
              </a>
            </Link>
          </div>
        )}
        <div className={style.column}>
          <div className={style.heading}>
            <Heading {...downloadTitle} />
          </div>
          <Link href={fields.downloadLink.href}>
            <a
              className={style.ctaLink}
              aria-label={`Navigate to ${fields.downloadLink.href}`}
              title={`Navigate to ${fields.downloadLink.href}`}
            >
              <div className={style.media}>
                <Media media={fields.linkImage} />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyDownloadPrompt;
