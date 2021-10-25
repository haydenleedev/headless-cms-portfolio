import Link from "next/link";
import Heading from "../heading";
import Media from "../media";
import style from "./textWithMedia.module.scss";

const TextWithMedia = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  // TODO: allow changing row direction based on agilitycms input
  return (
    <section
      className={`section ${style.textWithMedia} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className="container">
        <div className={`columns repeat-2 ${style.content}`}>
          <div className={style.textContent}>
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

          {fields.media && <Media media={fields.media} />}
        </div>
      </div>
    </section>
  );
};

export default TextWithMedia;
