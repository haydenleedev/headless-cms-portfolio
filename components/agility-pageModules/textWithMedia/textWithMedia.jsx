import Link from "next/link";
import { boolean } from "../../../utils/validation";
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
      <div
        className={`container ${
          boolean(fields.fullPageWidth) ? "max-width-unset padding-unset" : ""
        }`}
      >
        <div
          className={`${style.content} ${
            boolean(fields.columnLayout)
              ? "flex-direction-column justify-content-center align-items-center"
              : boolean(fields.mediaLeft)
              ? "flex-direction-row-reverse"
              : "flex-direction-row"
          } ${boolean(fields.fullPageWidth) ? style.fullPageWidthContent : ""}`}
        >
          <div
            className={`${style.textContent} ${
              boolean(fields.fullPageWidth)
                ? style.fullPageWidthTextContent
                : ""
            }`}
          >
            <div
              className={`${
                boolean(fields.columnLayout)
                  ? "justify-content-center align-items-center"
                  : boolean(fields.mediaLeft)
                  ? "ml justify-content-flex-end align-items-flex-start"
                  : "mr justify-content-flex-start align-items-flex-start"
              }`}
            >
              {heading.text && (
                <div
                  className={
                    boolean(fields.columnLayout) ? "heading" : style.heading
                  }
                >
                  <Heading {...heading} />
                </div>
              )}
              <div
                className={`${style.html} content`}
                dangerouslySetInnerHTML={{ __html: fields.text }}
              ></div>
              {fields.link && (
                <Link href={fields.link.href}>
                  <a
                    className={`mt button ${
                      !boolean(fields.columnLayout) ? "small" : ""
                    } cyan outlined ${style.link}`}
                    aria-label={`Navigate to page ` + fields.link.href}
                    title={`Navigate to page ` + fields.link.href}
                  >
                    {fields.link.text}
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div
            className={`${style.media} ${
              boolean(fields.mediaLeft) ? "mr" : "ml"
            } ${
              boolean(fields.fullPageWidth) ? style.fullPageWidthMedia : ""
            } ${
              boolean(fields.centerVertical)
                ? "d-flex align-items-center justify-content-center"
                : ""
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
