import Link from "next/link";
import Heading from "../heading";
import style from "./firstFold.module.scss";
import Media from "../media";

const FirstFold = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  return (
    <section className={`section ${style.firstFold}`}>
      <div className="container">
        {/* TODO: allow reverse column order for desktop as a conditional toggle from Agility*/}
        <div className="columns repeat-2">
          <div className={style.textContent}>
            <div className={style.heading}>
              <Heading {...heading}></Heading>
            </div>
            {fields.text && (
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: fields.text }}
              ></div>
            )}
            {fields.primaryLink && (
              <Link href="#">
                <a
                  className={`button cyan outlined ${style.primaryLink}`}
                  aria-label={`Navigate to page ` + fields.primaryLink.href}
                  title={`Navigate to page ` + fields.primaryLink.href}
                >
                  {fields.primaryLink.text}
                </a>
              </Link>
            )}
            {fields.secondaryLink && (
              <Link href="#" className="button outlined">
                <a
                  className={`button ${style.secondaryLink}`}
                  aria-label={`Navigate to page ` + fields.secondaryLink.href}
                  title={`Navigate to page ` + fields.secondaryLink.href}
                >
                  {fields.secondaryLink.text}
                </a>
              </Link>
            )}
          </div>
          <div>
            <Media media={fields.media}></Media>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstFold;
