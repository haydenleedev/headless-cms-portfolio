import Heading from "../heading";
import Link from "next/link";
import style from "./callToAction.module.scss";

const CallToAction = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  return (
    <section
      className={`section ${style.callToAction} ${
        fields.classes ? fields.classes : ""
      }`}
    >
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
    </section>
  );
};

export default CallToAction;
