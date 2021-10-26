import Link from "next/link";
import Heading from "../heading";
import Media from "../media";
import style from "./textWithMedia.module.scss";

const TextWithMedia = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  return (
    <section
      className={`section ${style.textWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className="container">
        <div
          className={`${style.content} ${
            fields.columnLayout
              ? "flex-direction-column justify-content-center align-items-center"
              : fields.mediaLeft
              ? "flex-direction-row-reverse"
              : "flex-direction-row"
          }`}
        >
          <div
            className={`${style.textContent} ${
              fields.columnLayout
                ? "justify-content-center align-items-center"
                : fields.mediaLeft
                ? "justify-content-flex-end align-items-flex-start"
                : "justify-content-flex-start align-items-flex-start"
            }`}
          >
            <div className={style.heading}>
              {heading.text && <Heading {...heading} />}
            </div>
            <div dangerouslySetInnerHTML={{ __html: fields.text }}></div>
            {fields.link && (
              <Link href={fields.link.href}>
                <a
                  className={`mt button ${
                    !fields.columnLayout ? "small" : ""
                  } cyan outlined ${style.link}`}
                  aria-label={`Navigate to page ` + fields.link.href}
                  title={`Navigate to page ` + fields.link.href}
                >
                  {fields.link.text}
                </a>
              </Link>
            )}
          </div>
          <div className={`${style.media} ${fields.mediaLeft ? "mr" : "ml"}`}>
            {fields.media && <Media media={fields.media} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextWithMedia;
