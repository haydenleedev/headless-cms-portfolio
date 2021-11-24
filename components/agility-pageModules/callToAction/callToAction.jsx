import Heading from "../heading";
import Link from "next/link";
import style from "./callToAction.module.scss";
import { boolean } from "../../../utils/validation";
import Media from "../media";

const CallToAction = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const narrowContainer = boolean(fields?.narrowContainer);
  const bannerLayout = boolean(fields?.bannerLayout);
  return (
    <section
      className={`section ${style.callToAction} ${
        bannerLayout ? style.bannerLayout : ""
      } ${fields.classes ? fields.classes : ""}`}
    >
      {fields.backgroundImage && (
        <div className={style.backgroundImage}>
          <Media media={fields.backgroundImage} />
        </div>
      )}
      <div
        className={`container d-flex flex-direction-column justify-content-center align-items-center ${
          narrowContainer ? "max-width-narrow" : ""
        }`}
      >
        <div className={style.content}>
          {heading.text && (
            <div className={style.heading}>
              <Heading {...heading} />
            </div>
          )}
          {fields.textContent && (
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: fields.textContent }}
            ></div>
          )}
          <Link href={fields.link.href}>
            <a
              className={`button cyan outlined ${style.link} ${
                fields.linkClasses ? fields.linkClasses : ""
              }`}
              aria-label={`Navigate to page ` + fields.link.href}
              title={`Navigate to page ` + fields.link.href}
            >
              {fields.link.text}
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
