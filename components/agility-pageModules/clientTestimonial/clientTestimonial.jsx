import Link from "next/link";
import { boolean } from "../../../utils/validation";
import Heading from "../heading";
import Media from "../media";
import StarRating from "../../starRating/starRating";
import style from "./clientTestimonial.module.scss";

const ClientTestimonial = ({ module }) => {
  const { fields } = module;
  return (
    <section
      className={`section ${style.clientTestimonial} ${
        fields.classes ? fields.classes : ""
      }`}
    >
      {fields.backgroundImage && (
        <div className={style.backgroundImage}>
          <Media media={fields.backgroundImage} />
        </div>
      )}
      <div className="container">
        {fields.testimonial && (
          <div className={style.content}>
            {boolean(fields.slim) ? (
              <div className={style.slim}>
                {fields?.award?.fields?.image && (
                  <div className={style.awardImage}>
                    <Media media={fields.award.fields.image} />
                  </div>
                )}
                {fields.testimonial.fields?.text && (
                  <div className={style.textContent}>
                    {boolean(fields.displayRating) && (
                      <StarRating
                        starCount={fields.testimonial?.starCount}
                        starWidth="25"
                      />
                    )}
                    <p className={style.quote}>
                      {fields.testimonial.fields.text}
                    </p>
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
                {fields?.award?.fields?.image && (
                  <div className={style.awardImage}>
                    <Media media={fields.award.fields.image} />
                  </div>
                )}
                {fields.testimonial.fields?.text && (
                  <div className={style.textContent}>
                    {boolean(fields.displayRating) && (
                      <StarRating
                        starCount={fields.testimonial?.starCount}
                        starWidth="25"
                      />
                    )}
                    <p className={style.quote}>
                      {fields.testimonial.fields.text}
                    </p>
                    <div className={style.client}>
                      {fields.testimonial.fields.name && (
                        <p>{fields.testimonial.fields.name}</p>
                      )}
                      {fields.testimonial.fields.jobTitle && (
                        <p className={style.jobTitle}>
                          {fields.testimonial.fields.jobTitle}
                        </p>
                      )}
                      {fields.testimonial.fields.companyName && (
                        <p className={style.companyName}>
                          {fields.testimonial.fields.companyName}
                        </p>
                      )}
                      {fields.testimonial.fields.logo && (
                        <div className={style.logo}>
                          <Media media={fields.testimonial.fields.logo} />
                        </div>
                      )}
                    </div>
                  </div>
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
        )}
      </div>
    </section>
  );
};

export default ClientTestimonial;
