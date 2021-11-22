import Link from "next/link";
import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import style from "./logosList.module.scss";

const LogosList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);
  const grayFilter = boolean(fields.grayFilter);
  return (
    <section
      className={`section ${style.logosList} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className="container padding-unset">
        {heading.text && (
          <div className={style.heading}>
            <Heading {...heading} />
          </div>
        )}
        <div className={style.content}>
          <div className={`grid-columns ${fields.link ? "mr-4" : ""}`}>
            {fields?.items?.map((logo) => (
              <div
                className={`grid-column ${
                  fields.columns ? `is-${fields.columns}` : ""
                } ${style.logo} ${grayFilter ? "filter-gray" : ""}`}
                key={logo.contentID}
              >
                {(logo.fields.link && (
                  <Link href={logo.fields.link.href}>
                    <a>
                      <Media media={logo.fields.logo} />
                    </a>
                  </Link>
                )) || <Media media={logo.fields.logo} />}
              </div>
            ))}
          </div>
          {fields.link && (
            <Link href={fields.link.href}>
              <a
                className={`button white ${style.link}`}
                aria-label={`Navigate to page ` + fields.link.href}
                title={`Navigate to page ` + fields.link.href}
              >
                {fields.link.text}
              </a>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default LogosList;
