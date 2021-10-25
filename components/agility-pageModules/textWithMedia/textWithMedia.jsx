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
            fields.mediaLeft == "true" ? "flex-direction-row-reverse " : ""
          }`}
        >
          <div
            className={`${style.textContent} ${
              fields.mediaLeft == "true"
                ? "justify-content-flex-end"
                : "justify-content-flex-start"
            }`}
          >
            <div className={style.heading}>
              {heading.text && <Heading {...heading} />}
            </div>
            <div dangerouslySetInnerHTML={{ __html: fields.text }}></div>
            {fields.link && (
              <Link href={fields.link.href}>
                <a
                  className={`mt button small cyan outlined ${style.link}`}
                  aria-label={`Navigate to page ` + fields.link.href}
                  title={`Navigate to page ` + fields.link.href}
                >
                  {fields.link.text}
                </a>
              </Link>
            )}
          </div>
          <div
            className={`${style.media} ${
              fields.mediaLeft == "true" ? "mr" : "ml"
            }`}
          >
            {fields.media && <Media media={fields.media} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextWithMedia;
