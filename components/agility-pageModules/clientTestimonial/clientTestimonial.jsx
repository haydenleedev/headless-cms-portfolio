import Link from "next/link";
import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import style from "./clientTestimonial.module.scss";

const ClientTestimonial = ({ module }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${style.clientTestimonial} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      <div className="container">
        <div className={style.content}>
          {boolean(fields.slim) ? (
            <div className={fields.award ? style.slimWithAward : style.slim}>
              {fields?.award?.fields?.image && (
                // TODO: make award image display correctly
                <div classes={style.award}>
                  <Media media={fields.award.fields.image} />
                </div>
              )}
              {fields.testimonial.fields?.text && (
                <div className={style.textContent}>
                  <p
                    className={style.quote}
                  >{`“${fields.testimonial.fields.text}”`}</p>
                  <div className={style.client}>
                    <p>
                      <span>{fields.testimonial.fields.name}</span>
                      <span>
                        {fields.testimonial.fields.jobTitle
                          ? `, ${fields.testimonial.fields.jobTitle}`
                          : ""}
                      </span>
                      <span>
                        {fields.testimonial.fields.companyName
                          ? `, ${fields.testimonial.fields.companyName}`
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={style.normal}>
              {fields.testimonial.fields?.text && (
                <>
                  <p
                    className={style.quote}
                  >{`“${fields.testimonial.fields.text}”`}</p>
                  <div className={style.client}>
                    <p>{fields.testimonial.fields.name}</p>
                    <p className={style.jobTitle}>
                      {fields.testimonial.fields.jobTitle}
                    </p>
                    {fields.testimonial.fields.logo.url && (
                      <img
                        className={style.logo}
                        src={fields.testimonial.fields.logo.url}
                        alt={
                          fields.testimonial.fields.logo.label
                            ? fields.testimonial.fields.logo.label
                            : ""
                        }
                        width={fields.testimonial.fields.logo.pixedWidth}
                        height={fields.testimonial.fields.logo.pixelHeight}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {fields.link && (
            <Link href={fields.link.href}>
              <a
                className={`button white small ${style.link}`}
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

export default ClientTestimonial;
