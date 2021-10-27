import Link from "next/link";
import Heading from "../heading";
import style from "./clientLogosList.module.scss";

const ClientLogosList = ({ module }) => {
  const { fields } = module;
  const heading = JSON.parse(fields.heading);

  return (
    <section
      className={`section ${style.clientLogosList} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className="container">
        {heading.text && (
          <div className={style.heading}>
            <Heading {...heading} />
          </div>
        )}
        <div className={style.content}>
          <div
            className={`mr grid-columns ${
              fields.columns ? `is-${fields.columns}` : ""
            }`}
          >
            {fields?.logos?.media?.map((logo) => (
              <div className={`grid-column ${style.logo}`} key={logo.mediaID}>
                <img
                  src={logo.url}
                  alt={
                    logo.metaData?.Description ? logo.metaData?.Description : ""
                  }
                />
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

export default ClientLogosList;